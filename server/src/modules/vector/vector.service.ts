import { Injectable } from '@nestjs/common';
import { CreateVectorDto } from './dto/create-vector.dto';
import { SearchVectorDto } from './dto/seatch.dto';
import { getKeyConfigurationFromEnvironment } from '../../utils/llm/configuration';
import { KeyConfiguration } from 'src/types/keyConfiguration';
import { PrismaVectorStore } from 'langchain/vectorstores/prisma';
import { Index, Prisma } from '@prisma/client';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { UpdateVectorDto } from './dto/update-vector.dto';
import { ConfigService } from '@nestjs/config';
import { Document } from 'langchain/document';
import { getEmbeddings } from 'src/utils/llm/embeddings';

@Injectable()
export class VectorService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {}

  get(id: string) {
    return this.prisma.index.findUnique({
      where: {
        id,
      },
    });
  }

  async update(updateVectorDto: UpdateVectorDto) {
    const { id, content, source, metadata, namespace } = updateVectorDto;
    const { id: index_id } = await this.prisma.index.update({
      where: {
        id,
      },
      data: {
        content,
        source,
        metadata,
        namespace,
      },
    });
    const keyConfiguration = getKeyConfigurationFromEnvironment(
      this.configService
    );
    const vector = await getEmbeddings(keyConfiguration).embedQuery(content);
    return this.prisma.$executeRaw`
          UPDATE "Index"
          SET "vector" = ${`[${vector.join(',')}]`}::vector
          WHERE "id" = ${index_id}
        `;
  }

  delete(id: string) {
    return this.prisma.index.delete({
      where: {
        id,
      },
    });
  }

  getAll(docId: string) {
    return this.prisma.index.findMany({
      where: {
        docId,
      },
    });
  }

  async create(createVectorDto: CreateVectorDto) {
    const { docId, content, source, namespace, metadata } = createVectorDto;
    const keyConfiguration = getKeyConfigurationFromEnvironment(
      this.configService
    );
    const vectorStore = await this.getVectorStore(keyConfiguration);
    return await vectorStore.addModels(
      await this.prisma.$transaction([
        this.prisma.index.create({
          data: { content, docId, source, namespace, metadata },
        }),
      ])
    );
  }

  async similaritySearch(searchVectorDto: SearchVectorDto) {
    const { message, size, docIds } = searchVectorDto;
    const idsString = docIds.map((id) => `'${id}'`).join(', ');
    const filterSqlString = `WHERE "docId" IN (${idsString})`;
    const filterSql = Prisma.raw(filterSqlString);

    const docs = await this.customSimilaritySearchVectorWithScore(
      message,
      Number(size),
      filterSql
    );
    return docs;
  }

  async customSimilaritySearchVectorWithScore(
    message: string,
    k: number,
    filterSql?: Prisma.Sql
  ) {
    const vectorColumnRaw = Prisma.raw(`"vector"`);
    const tableNameRaw = Prisma.raw(`"Index"`);
    const columns = {
      id: PrismaVectorStore.IdColumn,
      content: PrismaVectorStore.ContentColumn,
      namespace: PrismaVectorStore.ContentColumn,
      source: PrismaVectorStore.ContentColumn,
      metadata: PrismaVectorStore.ContentColumn,
      docId: PrismaVectorStore.ContentColumn,
    };
    const entries = Object.entries(columns);

    const selectColumns = entries
      .map(([key, alias]) => (alias && key) || null)
      .filter((x): x is string => !!x);

    const selectRaw = Prisma.raw(selectColumns.map((x) => `"${x}"`).join(', '));
    const keyConfiguration = getKeyConfigurationFromEnvironment(
      this.configService
    );
    const query = await getEmbeddings(keyConfiguration).embedQuery(message);
    const vector = `[${query.join(',')}]`;
    const querySql = Prisma.join(
      [
        Prisma.sql`
          SELECT ${selectRaw}, ${vectorColumnRaw} <=> ${vector}::vector as "_distance"
          FROM ${tableNameRaw}
        `,
        filterSql ? filterSql : null,
        Prisma.sql`
          ORDER BY "_distance" ASC
          LIMIT ${k};
        `,
      ].filter((x) => x != null),
      ''
    );
    const articles: any = await this.prisma.$queryRaw(querySql);

    const results = [];
    for (const article of articles) {
      if (article._distance != null && article['content'] != null) {
        results.push(
          new Document({
            pageContent: article['content'],
            metadata: article,
          })
        );
      }
    }

    return results;
  }

  async getVectorStore(keyConfiguration: KeyConfiguration): Promise<any> {
    return PrismaVectorStore.withModel<Index>(this.prisma).create(
      getEmbeddings(keyConfiguration),
      {
        prisma: Prisma,
        tableName: 'Index',
        vectorColumnName: 'vector',
        columns: {
          id: PrismaVectorStore.IdColumn,
          content: PrismaVectorStore.ContentColumn,
          namespace: PrismaVectorStore.ContentColumn,
          source: PrismaVectorStore.ContentColumn,
          metadata: PrismaVectorStore.ContentColumn,
          docId: PrismaVectorStore.ContentColumn,
        },
      }
    );
  }
}
