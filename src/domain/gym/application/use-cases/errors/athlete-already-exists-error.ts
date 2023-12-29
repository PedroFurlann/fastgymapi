import { UseCaseError } from '../../../../../core/errors/use-case-error';

export class AthleteAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Aluno "${identifier}" com o mesme endereço de email já existe.`);
  }
}
