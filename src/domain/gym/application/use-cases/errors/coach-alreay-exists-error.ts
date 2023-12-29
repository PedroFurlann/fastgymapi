import { UseCaseError } from '../../../../../core/errors/use-case-error';

export class CoachAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Professor "${identifier}" com o mesme endereço de email já existe.`);
  }
}
