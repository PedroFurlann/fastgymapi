export interface DeleterParams {
  entityId: string;
}

export abstract class Deleter {
  abstract deleteFile(params: DeleterParams): Promise<void>;
}
