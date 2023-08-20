import http from '@/utils/http';

export const searchVector = (params: searchVector) =>
  http({
    url: `/vector/${params.docId}/chat_test`,
    method: 'get',
    params,
  });

export const addVector = (data: addVector) =>
  http({
    url: `/vector`,
    method: 'post',
    data,
  });

export const similaritySearch = (params: similaritySearch) =>
  http({
    url: `/vector/${params.docId}/similarity_search`,
    method: 'get',
    params,
  });
