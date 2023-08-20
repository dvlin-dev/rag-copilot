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

  getAll(docId: string) {
    return this.prisma.index.findMany({
      where: {
        docId,
      },
    });
  }

  async create(createVectorDto: CreateVectorDto) {
    const { docId, content, source, namespace, metadata } = createVectorDto;
    const keyConfiguration = getKeyConfigurationFromEnvironment();
    const vectorStore = await this.getVectorStore(keyConfiguration);
    return await vectorStore.addModels(
      await this.prisma.$transaction([
        this.prisma.index.create({
          data: { content, docId, source, namespace, metadata },
        }),
      ])
    );
  }

  async similaritySearch(docId: string, searchVectorDto: SearchVectorDto) {
    const { message, size } = searchVectorDto;
    const keyConfiguration = getKeyConfigurationFromEnvironment();
    const vectorStore = await this.getVectorStore(keyConfiguration);
    const docs = await vectorStore.similaritySearchWithScore(
      message,
      Number(size),
      {
        docId: { equals: docId },
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

  async chat_test(docId: string, searchVectorDto: SearchVectorDto) {
    const { message, size } = searchVectorDto;
    const keyConfiguration = getKeyConfigurationFromEnvironment();
    const vectorStore = await this.getVectorStore(keyConfiguration);
    const docs = await vectorStore.similaritySearchWithScore(
      message,
      Number(size),
      {
        docId: { equals: docId },
      }
    );
    const model = await getModel(keyConfiguration);
    const context = docs.reduce((acc, item) => {
      return acc + item[0].pageContent + '\n';
    }, '');
    const prompt = PromptTemplate.fromTemplate(
      '在结尾处用以下几段语境回答问题。如果你不知道答案，只需说你不知道，不要尝试编造答案。\n\n{context}\n\n问题：{question}\n有用的答案：'
    );
    const chain = new LLMChain({ llm: model, prompt });
    const result = (await chain.call({ context, question: message })).text;
    return {
      result,
      docs,
    };
  }
}
