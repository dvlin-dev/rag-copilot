import http from '@/utils/http';
import { blobToHash } from '@/utils/generateHash';
import { preUrl } from '.';

export async function getFormData(md5: any) {}

export async function isExistHandle(
  url: string
): Promise<{ isExist: boolean; url: string }> {
  return new Promise((resolve, reject) => {
    http
      .head(`${url}?random=${Math.random()}`, {
        validateStatus() {
          return true; // 把所有响应码视为正常防止抛异常
        },
        timeout: 2000,
      })
      .then((res) => {
        resolve({
          isExist: res.status === 200,
          url,
        });
      })
      .catch(() => {
        resolve({
          isExist: false,
          url,
        });
      });
  });
}

export async function uploadFile(blob: Blob, fileName: string) {
  return new Promise(async (resolve, reject) => {
    // 创建一个新的FormData对象
    const formData = new FormData();

    // 将blob对象添加到FormData对象中
    formData.append('file', blob, fileName);
    http({
      url: '/oss',
      method: 'POST',
      data: formData,
    })
      .then((data) => {
        resolve(data.data.url);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
