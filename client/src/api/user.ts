import type {
  LoginByPasswordParams,
  RegisterByEmail,
  UpdateUserDto,
} from '../types/user';
import http from '../utils/http';

// TODO response type

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

export function updateUserInfo(data: UpdateUserDto) {
  return http({
    url: '/user/update',
    method: 'patch',
    data,
  });
}

export function logout(deviceId: string) {
  return http({
    url: '/auth/logout',
    method: 'post',
    data: {
      deviceId,
    },
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
