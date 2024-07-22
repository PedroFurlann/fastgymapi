export abstract class EmailSender {
  abstract sendRecoveryPasswordCodeEmail(
    email: string,
    recoveryPasswordCode: string,
  ): Promise<void>;
}
