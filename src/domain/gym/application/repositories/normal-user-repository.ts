import { NormalUser } from '../../enterprise/entities/normal-user';

export abstract class NormalUserRepository {
  abstract create(normaluser: NormalUser): Promise<void>;
  abstract findByEmail(email: string): Promise<NormalUser | null>;
  abstract findById(normaluserId: string): Promise<NormalUser | null>;
  abstract update(normaluser: NormalUser): Promise<void>;
  abstract delete(normaluserId: string): Promise<void>;
}
