import { UseCaseError } from '../use-case-error';

export class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    super('You are not allowed to access this resource.');
  }
}
