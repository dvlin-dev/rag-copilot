import Compressor from 'compressorjs';
import imageCompression from 'browser-image-compression';
export function compress(file: Blob, quality = 0.1): Promise<Blob> {
  return new Promise(async (resolve) => {
    if (file.type.endsWith('png')) {
      resolve(
        // @ts-ignore
        await imageCompression(file, {
          useWebWorker: true,
          initialQuality: quality,
        })
      );
    } else {
      new Compressor(file, {
        quality,
        success: resolve,
      });
    }
  });
}
