import http from '@/utils/http';

interface CreateDoc {
  name: string;
  description: string;
}

export const createDocApi = (data: CreateDoc) =>
  http({
    url: '/doc',
    method: 'post',
    data,
  });
