import http from '@/utils/http';

export const searchVector = (params: searchVector) =>
  http({
    url: `/vector/${params.docsId}/similarity_search?`,
    method: 'get',
    params,
  });
