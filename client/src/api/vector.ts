import http from '@/utils/http';

interface searchVector {
  message: string;

  docId: string;

  size: number;
}

interface AddVector {
  content: string;

  docId: string;

  source: string;

  namespace: string;

  metadata: string;
}

export const addVector = (data: AddVector) =>
  http({
    url: `/vector`,
    method: 'post',
    data,
  });

interface SimilaritySearch {
  message: string;

  docIds: string[];

  size: number;
}

export const similaritySearch = (params: SimilaritySearch) =>
  http({
    url: `/vector/similarity_search`,
    method: 'get',
    params,
  });

export const deleteVector = (id: string) =>
  http({
    url: `/vector/${id}`,
    method: 'delete',
  });

interface UpdateVector {
  id: string;
  content?: string;
  source?: string;
  namespace?: string;
  metadata?: string;
}

export const updateVector = (data: UpdateVector) =>
  http({
    url: '/vector',
    method: 'patch',
    data,
  });
