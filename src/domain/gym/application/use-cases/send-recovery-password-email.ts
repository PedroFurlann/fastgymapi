import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { NormalUserRepository } from '../repositories/normal-user-repository';
import { UserNotFoundError } from './errors/user-not-found-error';
import { EmailSender } from '../mail/emailSender';
import dayjs from 'dayjs';

interface SendRecoveryPasswordRequest {
  email: string;
}

type SendRecoveryPasswordResponse = Either<UserNotFoundError, null>;
@Injectable()
export class SendRecoveryPasswordUseCase {
  constructor(
    private readonly normalUserRepository: NormalUserRepository,
    private readonly emailSender: EmailSender,
  ) {}

  async execute({
    email,
  }: SendRecoveryPasswordRequest): Promise<SendRecoveryPasswordResponse> {
    const normalUser = await this.normalUserRepository.findByEmail(email);

    if (!normalUser) {
      return left(new UserNotFoundError());
    }

    function generateCode() {
      const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
      }
      return code;
    }

    const code = generateCode();

    const recoveryPasswordCodeExpiresIn = dayjs().add(10, 'minutes');

    normalUser.recoveryPasswordCode = code;
    normalUser.recoveryPasswordCodeExpiresIn = new Date(
      recoveryPasswordCodeExpiresIn.toISOString(),
    );

    await this.normalUserRepository.update(normalUser);
    await this.emailSender.sendRecoveryPasswordEmail(email, code);

    return right(null);
  }
}
