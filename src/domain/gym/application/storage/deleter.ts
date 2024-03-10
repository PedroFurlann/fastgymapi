export interface DeleterParams {
  entityId: string;
}

export abstract class Deleter {
  abstract deleteCoachProfilePhoto(params: DeleterParams): Promise<void>;
  abstract deleteAthleteProfilePhoto(params: DeleterParams): Promise<void>;
  abstract deleteNormalUserProfilePhoto(params: DeleterParams): Promise<void>;
}
