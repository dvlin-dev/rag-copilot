declare interface searchVector {
  message: string;

  docId: string;

  size: number;
}

declare interface addVector {
  content: string;

  docId: string;

  source: string;

  namespace: string;

  metadata: string;
}

declare interface similaritySearch {
  message: string;

  docId: string;

  size: number;
}

declare interface similaritySearchResponseItem {
  pageContent: string;
  metadata: {
    content: string;
    metadata: string;
    namespace: string;
    source: string;
    _distance: number;
  };
}
