import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './mail.service';
import { getServerConfig } from 'ormconfig';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import * as path from 'path';

const config = getServerConfig();
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.163.com',
        port: 465,
        secure: true,
        preview: true,
        auth: {
          user: config['user'],
          pass: config['pass'],
        },
      },
    }),
  ],
  providers: [EmailService],
})
export class MailModule {}
