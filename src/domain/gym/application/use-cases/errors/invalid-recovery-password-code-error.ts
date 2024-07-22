import { UseCaseError } from '../../../../../core/errors/use-case-error';

export class InvalidRecoveryPasswordCodeError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Código de verificação inválido.`);
  }
}
