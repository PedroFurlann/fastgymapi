import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { EmailSender } from '@/domain/gym/application/mail/emailSender';
import { NodeMailer } from './nodemailer';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: EmailSender,
      useClass: NodeMailer,
    },
  ],
  exports: [EmailSender],
})
export class MailModule {}
