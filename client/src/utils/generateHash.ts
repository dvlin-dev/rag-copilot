import crypto from 'crypto';

export function generateHash(params: any) {
  const hash = crypto.createHash('md5');
  const paramsString = JSON.stringify(params).trim();
  hash.update(paramsString);
  return hash.digest('hex');
}

export async function blobToHash(blob: Blob): Promise<string> {
  // 将 Blob 对象转换为 ArrayBuffer
  const arrayBuffer = await blob.arrayBuffer();

  // 使用 SHA-256 算法计算哈希值
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);

  // 将 ArrayBuffer 转换为十六进制字符串
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return hashHex;
}
