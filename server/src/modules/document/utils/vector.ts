import { TypeORMVectorStore } from 'langchain/vectorstores/typeorm';
import { Document } from 'langchain/dist/document';
import dbConfig from '../../../../ormconfig';
import { getEmbeddings } from './embeddings';
import { getKeyConfigurationFromEnvironment } from './configuration';
export const getVectorStore = async (document: Document[]) => {
  TypeORMVectorStore.fromDocuments(
    document,
    getEmbeddings(getKeyConfigurationFromEnvironment()),
    {
      postgresConnectionOptions: dbConfig,
      tableName: 'document',
      // filter?: Metadata;
      // verbose?: boolean;
    }
  );
};
