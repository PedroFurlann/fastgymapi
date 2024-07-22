import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { NormalUserRepository } from '../repositories/normal-user-repository';
import dayjs from 'dayjs';
import { InvalidRecoveryPasswordCodeError } from './errors/invalid-recovery-password-code-error';
import { RecoveryPasswordCodeExpiredError } from './errors/recovery-password-code-expired-error';

interface ValidateRecoveryPasswordCodeRequest {
  email: string;
  recoveryPasswordCode: string;
}

type ValidateRecoveryPasswordCodeResponse = Either<
  InvalidRecoveryPasswordCodeError | RecoveryPasswordCodeExpiredError,
  null
>;
@Injectable()
export class ValidateRecoveryPasswordCodeUseCase {
  constructor(private readonly normalUserRepository: NormalUserRepository) {}

  async execute({
    email,
    recoveryPasswordCode,
  }: ValidateRecoveryPasswordCodeRequest): Promise<ValidateRecoveryPasswordCodeResponse> {
    const normalUser = await this.normalUserRepository.findByEmail(email);

    const now = dayjs();

    const isCodeValid =
      normalUser.recoveryPasswordCode === recoveryPasswordCode;

    const isCodeExpired = dayjs(
      normalUser.recoveryPasswordCodeExpiresIn,
    ).isBefore(now);

    if (!isCodeValid) {
      return left(new InvalidRecoveryPasswordCodeError());
    }

    if (isCodeExpired) {
      return left(new RecoveryPasswordCodeExpiredError());
    }

    normalUser.recoveryPasswordCode = null;
    normalUser.recoveryPasswordCodeExpiresIn = null;

    await this.normalUserRepository.update(normalUser);

    return right(null);
  }
}
