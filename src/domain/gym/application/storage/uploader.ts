export interface UploaderParams {
  entityId: string;
  fileName: string;
  fileType: string;
  body: Buffer;
}

export abstract class Uploader {
  abstract upload(params: UploaderParams): Promise<{ url: string }>;
}
