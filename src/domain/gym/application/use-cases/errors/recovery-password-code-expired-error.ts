import { UseCaseError } from '../../../../../core/errors/use-case-error';

export class RecoveryPasswordCodeExpiredError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Código de verificação expirado.`);
  }
}
