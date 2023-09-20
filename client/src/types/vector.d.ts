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

declare interface Vector {
  id: string;
  docId: string;
  content: string;
  vector: any;
  source?: string;
  namespace?: string;
  metadata?: string;
}
