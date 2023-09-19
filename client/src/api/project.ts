import http from '@/utils/http';
export const githubClientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
interface CreateProject {
  name: string;
  description: string;
  prompt: string;
  questions: string[];
  whiteList: string[];
  ipLimit: string;
}

export const getProjectList = () => http('/project/list');
export const getProjectDetail = (projectId: string) =>
  http(`/project/${projectId}/detail`);
export const createProjectApi = (data: CreateProject) =>
  http({
    url: '/project',
    method: 'post',
    data,
  });

interface UpdateProject {
  id: string;
  name?: string;
  description?: string;
  prompt?: string;
  questions?: string[];
  whiteList?: string[];
  ipLimit?: string;
  docIds?: string[];
}

export const updateProject = (data: UpdateProject) =>
  http({
    url: '/project',
    method: 'patch',
    data,
  });

interface SimilaritySearchFromDocsParams {
  content: string;

  projectId: string;

  size: number;
}

export const similaritySearchFromDocs = (
  params: SimilaritySearchFromDocsParams
) => {
  const { projectId, content, size } = params;
  return http({
    url: `/project/${projectId}/similaritySearchFromDocs`,
    method: 'post',
    data: {
      content,
      size,
    },
  });
};
