export interface DeleterParams {
  entityId: string;
}

export abstract class Deleter {
  abstract deleteCoachProfilePhoto(params: DeleterParams): Promise<void>;
}
