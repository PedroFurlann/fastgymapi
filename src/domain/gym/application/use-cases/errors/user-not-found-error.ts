import { UseCaseError } from '../../../../../core/errors/use-case-error';

export class UserNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(`Nenhum usuário encontrado com esse endereço de email.`);
  }
}
