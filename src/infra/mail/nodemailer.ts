import { EnvService } from '../env/env.service';
import { Injectable } from '@nestjs/common';
import { EmailSender } from '@/domain/gym/application/mail/emailSender';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class NodeMailer implements EmailSender {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(private readonly envService: EnvService) {
    this.transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: envService.get('EMAIL'),
        pass: envService.get('EMAIL_PASSWORD'),
      },
    });
  }

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
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error', error);
    }
  }
}
