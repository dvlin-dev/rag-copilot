import { Document } from 'langchain/dist/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

export function getSplitterDocument(
  documents: Document[]
): Promise<Document[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });
  return splitter.splitDocuments(documents);
}
