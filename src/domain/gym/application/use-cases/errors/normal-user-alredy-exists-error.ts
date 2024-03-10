import { UseCaseError } from '../../../../../core/errors/use-case-error';

export class NormalUserAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor(identifier: string) {
    super(`Usuário "${identifier}" com o mesme endereço de email já existe.`);
  }
}
