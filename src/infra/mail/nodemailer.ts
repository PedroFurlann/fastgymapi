import { EnvService } from '../env/env.service';
import { Injectable } from '@nestjs/common';
import { EmailSender } from '@/domain/gym/application/mail/emailSender';
import nodemailer from 'nodemailer';

@Injectable()
export class NodeMailer implements EmailSender {
  constructor(private readonly envService: EnvService) {}

  async sendRecoveryPasswordCodeEmail(
    email: string,
    recoveryPasswordCode: string,
  ) {
    const mailOptions = {
      from: this.envService.get('EMAIL'),
      to: email,
      subject: 'Recuperação de Senha',
      text: `Você solicitou a recuperação de senha da sua conta. Esse é seu código de verificação ${recoveryPasswordCode}, ele expira em 10 minutos!`,
    };

    try {
      const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user: this.envService.get('EMAIL'),
          pass: this.envService.get('EMAIL_PASSWORD'),
        },
      });
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error', error);
    }
  }
}
