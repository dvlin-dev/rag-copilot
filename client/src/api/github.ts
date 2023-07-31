import http from '@/utils/http';
import { User } from '../types/user';

export const githubClientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

interface githubAuthDto {
  code: string;
  deviceId: string;
  deviceType: string;
}

export const getGithubUser = (
  params: githubAuthDto
): Promise<{
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}> =>
  http({
    url: '/auth/github',
    method: 'post',
    data: params,
  });
