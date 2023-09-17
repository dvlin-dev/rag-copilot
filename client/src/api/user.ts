import http from '../utils/http';

export interface LoginByPasswordParams {
  email: string;
  password: string;
}

export type RegisterByEmail = {
  email: 'string';
  password: 'string';
  code: 'string';
  username: 'string';
};

export const loginApi = (data: LoginByPasswordParams) =>
  http({
    url: '/auth/signin_by_password',
    method: 'post',
    data,
  });

export const smsLogin = (data: LoginByPasswordParams) =>
  http({
    url: '/auth/signin_by_code',
    method: 'post',
    data,
  });

export const sendCode = (email: string) =>
  http({
    url: '/auth/send-code',
    method: 'post',
    data: { email },
  });

export const register = (data: RegisterByEmail) =>
  http({
    url: '/auth/signup',
    method: 'post',
    data,
  });

export const findAllUser = () => http('/user/findall');

export function getInfo() {
  return http('/user/userinfo');
}

interface UpdateUserDto {
  username?: string;

  email?: string;

  gender?: Gender;

  avatar?: string;

  photo?: string;

  description?: string;
}

export function updateUserInfo(data: UpdateUserDto) {
  return http({
    url: '/user/update',
    method: 'patch',
    data,
  });
}

export function logout() {
  return http({
    url: '/auth/logout',
    method: 'post',
  });
}

export function follow(followingId: string) {
  return http({
    url: `/follow/${followingId}`,
    method: 'post',
  });
}

export function unfollow(followingId: string) {
  return http({
    url: `/follow/${followingId}`,
    method: 'delete',
  });
}
