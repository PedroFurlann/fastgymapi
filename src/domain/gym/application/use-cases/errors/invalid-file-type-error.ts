import { UseCaseError } from '@/core/errors/use-case-error';

export class InvalidFileType extends Error implements UseCaseError {
  constructor(type: string) {
    super(`Formato do arquivo: "${type}" não é suportado.`);
  }
}
