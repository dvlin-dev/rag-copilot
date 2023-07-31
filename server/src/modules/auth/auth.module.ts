import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/modules/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'src/enum/config.enum';
import { JwtStrategy } from './auth.strategy';
import { MailModule } from '../mail/mail.module';
import { EmailService } from '../mail/mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Profile } from 'src/entity/profile.entity';
import { UserService } from 'src/modules/user/user.service';
import { Device } from 'src/entity/device.entity';

@Global()
@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule, MailModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>(ConfigEnum.SECRET),
          signOptions: {
            expiresIn: '100d',
          },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Profile, Device]),
  ],
  providers: [AuthService, JwtStrategy, EmailService],
  controllers: [AuthController],
})
export class AuthModule {}
