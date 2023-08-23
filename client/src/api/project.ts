import http from '@/utils/http';
export const githubClientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

export const getProjectList = () => http('/project/list');
export const createProjectApi = (data: CreateProject) =>
  http({
    url: '/project',
    method: 'post',
    data,
  });
export const updateProjectApi = (data: UpdateProject) =>
  http({
    url: '/project',
    method: 'patch',
    data,
  });
