import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { EPubLoader } from 'langchain/document_loaders/fs/epub';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { CSVLoader } from 'langchain/document_loaders/fs/csv';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { DocumentLoader } from 'langchain/dist/document_loaders/base';
import { UnstructuredLoader } from 'langchain/document_loaders/fs/unstructured';

export function getDocumentLoader(
  fileType: string,
  filePath: string
): DocumentLoader {
  const loaders: {
    [type: string]: new (path: string, options?: any) => DocumentLoader;
  } = {
    pdf: PDFLoader,
    epub: EPubLoader,
    docx: DocxLoader,
    txt: TextLoader,
    md: TextLoader,
    json: TextLoader,
    csv: CSVLoader,
  };

  const options = {
    pdf: { splitPages: false },
    epub: { splitChapters: false },
  };

  if (loaders[fileType]) {
    return new loaders[fileType](filePath, options[fileType]);
  }

  if (fileType === 'zip') {
    return getDirectoryLoader(filePath);
  }

  return new UnstructuredLoader(filePath);
}

export function getDirectoryLoader(path: string): DocumentLoader {
  const zipFilePath = path.split('.')[0];
  const extensions = ['.pdf', '.epub', '.txt', '.docx', '.json', '.md', '.csv'];

  const loaders = extensions.reduce((acc, ext) => {
    acc[ext] = (path: string) => getDocumentLoader(ext.slice(1), path);
    return acc;
  }, {} as { [key: string]: (path: string) => DocumentLoader });

  return new DirectoryLoader(zipFilePath, loaders);
}
