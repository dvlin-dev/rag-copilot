import { Injectable } from '@nestjs/common';
import { CreateVectorDto } from './dto/create-vector.dto';
import { SearchVectorDto } from './dto/seatch.dto';
import { getKeyConfigurationFromEnvironment } from './utils/configuration';
import { KeyConfiguration } from 'src/types/keyConfiguration';
import { PrismaVectorStore } from 'langchain/vectorstores/prisma';
import { getEmbeddings } from './utils/embeddings';
import { Index, Prisma } from '@prisma/client';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { LLMChain, PromptTemplate } from 'langchain';
import { getModel } from './utils/openai';
import { UpdateVectorDto } from './dto/update-vector.dto';

@Injectable()
export class VectorService {
  constructor(private prisma: PrismaService) {}

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
    const keyConfiguration = getKeyConfigurationFromEnvironment();
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

  getAll(docs_id: string) {
    return this.prisma.index.findMany({
      where: {
        docs_id,
      },
    });
  }

  async create(createVectorDto: CreateVectorDto) {
    const { docs_id, content, source, namespace, metadata } = createVectorDto;
    const keyConfiguration = getKeyConfigurationFromEnvironment();
    const vectorStore = await this.getVectorStore(keyConfiguration);
    return await vectorStore.addModels(
      await this.prisma.$transaction([
        this.prisma.index.create({
          data: { content, docs_id, source, namespace, metadata },
        }),
      ])
    );
  }

  async similaritySearch(searchVectorDto: SearchVectorDto) {
    const { message, size, docs_id } = searchVectorDto;
    const keyConfiguration = getKeyConfigurationFromEnvironment();
    const vectorStore = await this.getVectorStore(keyConfiguration);
    const docs = await vectorStore.similaritySearchWithScore(
      message,
      Number(size),
      {
        docs_id: { equals: docs_id },
      }
    );
    return docs.map((item) => item[0]);
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
        },
      }
    );
  }
}
