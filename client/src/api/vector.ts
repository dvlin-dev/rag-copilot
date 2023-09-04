import http from '@/utils/http';

interface searchVector {
  message: string;

  docId: string;

  size: number;
}

interface addVector {
  content: string;

  docId: string;

  source: string;

  namespace: string;

  metadata: string;
}

export const addVector = (data: addVector) =>
  http({
    url: `/vector`,
    method: 'post',
    data,
  });

interface similaritySearch {
  message: string;

  docIds: string[];

  size: number;
}

export const similaritySearch = (params: similaritySearch) =>
  http({
    url: `/vector/similarity_search`,
    method: 'get',
    params,
  });
