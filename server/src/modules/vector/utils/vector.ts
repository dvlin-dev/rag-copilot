import { Index, Prisma, PrismaClient } from '@prisma/client';
import { PrismaVectorStore } from 'langchain/vectorstores/prisma';
import { getEmbeddings } from './embeddings';
import { KeyConfiguration } from 'src/types/keyConfiguration';

export const getVectorStore = async (keyConfiguration: KeyConfiguration) => {
  const db = new PrismaClient();
  return PrismaVectorStore.withModel<Index>(db).create(
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
};
