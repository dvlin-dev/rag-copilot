import { Injectable } from '@nestjs/common';
import { CreateVectorDto } from './dto/create-vector.dto';
import { SearchVectorDto } from './dto/seatch.dto';
import { getKeyConfigurationFromEnvironment } from './utils/configuration';
import { KeyConfiguration } from 'src/types/keyConfiguration';
import { PrismaVectorStore } from 'langchain/vectorstores/prisma';
import { getEmbeddings } from './utils/embeddings';
import { Index, Prisma } from '@prisma/client';
import { PrismaService } from 'src/utils/prisma/prisma.service';

@Injectable()
export class VectorService {
  constructor(private prisma: PrismaService) {}

  get(id: string) {}
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

    return await vectorStore.similaritySearchWithScore(message, number, {
      docs_id: { equals: docs_id },
    });
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
