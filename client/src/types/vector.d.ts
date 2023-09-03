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
