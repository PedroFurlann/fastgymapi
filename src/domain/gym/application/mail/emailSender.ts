export abstract class EmailSender {
  abstract sendRecoveryPasswordEmail(
    email: string,
    recoveryPasswordCode: string,
  ): Promise<void>;
}
