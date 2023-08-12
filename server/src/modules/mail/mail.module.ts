import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './mail.service';
import { getServerConfig } from 'src/utils';

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
