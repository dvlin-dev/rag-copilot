import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as qiniu from 'qiniu';

@Injectable()
export class OssService {
  private mac: qiniu.auth.digest.Mac;
  private config: qiniu.conf.Config;
  private bucketManager: qiniu.rs.BucketManager;
  private bucket: string;
  private accessKey: string;
  private secretKey: string;

  constructor(private configService: ConfigService) {
    this.bucket = this.configService.get('BUCKET_NAME'); // 你的七牛云存储空间名称
    this.accessKey = this.configService.get('ACCESS_KEY');
    this.secretKey = this.configService.get('SECRET_KEY');

    // 配置你的七牛云 AccessKey 和 SecretKey

    this.mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey);

    this.config = new qiniu.conf.Config();

    this.bucketManager = new qiniu.rs.BucketManager(this.mac, this.config);
  }

  async uploadFile(filename: string, fileBuffer: Buffer): Promise<string> {
    const options = {
      scope: `${this.bucket}:${filename}`,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(this.mac);

    return new Promise((resolve, reject) => {
      const formUploader = new qiniu.form_up.FormUploader(this.config);
      const putExtra = new qiniu.form_up.PutExtra();
      formUploader.put(
        uploadToken,
        filename,
        fileBuffer,
        putExtra,
        (err, body, info) => {
          if (err) {
            reject(err);
          }
          if (info.statusCode === 200) {
            resolve(body.key);
          } else {
            reject(body);
          }
        }
      );
    });
  }
}
