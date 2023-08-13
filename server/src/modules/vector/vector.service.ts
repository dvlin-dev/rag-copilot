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

@Injectable()
export class VectorService {
  constructor(private prisma: PrismaService) {}

  get(id: string) {}
  getAll(docs_id: string) {
    return this.prisma.docs.findMany();
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
    const { message, number, docs_id } = searchVectorDto;
    const keyConfiguration = getKeyConfigurationFromEnvironment();
    const vectorStore = await this.getVectorStore(keyConfiguration);

    const documents = await vectorStore.similaritySearchWithScore(
      message,
      number,
      {
        docs_id: { equals: docs_id },
      }
    );
    const model = await getModel(keyConfiguration);
    const context = documents.reduce((acc, item) => {
      return acc + item[0].pageContent + '\n';
    }, '');
    const prompt = PromptTemplate.fromTemplate(
      '在结尾处用以下几段语境回答问题。如果你不知道答案，只需说你不知道，不要尝试编造答案。\n\n{context}\n\n问题：{question}\n有用的答案：'
    );
    const chain = new LLMChain({ llm: model, prompt });
    const result = (await chain.call({ context, question: message })).text;
    return {
      result,
      docs: documents,
    };
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
        },
      }
    );
  }
}
