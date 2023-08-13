import http from '@/utils/http';

export const searchVector = (params: searchVector) =>
  http({
    url: `/vector/${params.docs_id}/similarity_search?`,
    method: 'get',
    params,
  });
