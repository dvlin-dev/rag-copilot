import { Document } from 'langchain/dist/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

export function getSplitterDocument(
  documents: Document[]
): Promise<Document[]> {
  const chunkSize = 1000;
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: chunkSize,
    chunkOverlap: 100,
  });
  return splitter.splitDocuments(documents);
}
