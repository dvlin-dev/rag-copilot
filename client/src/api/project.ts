import http from '@/utils/http';
export const githubClientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

export const getProjectList = () => http('/project/list');
