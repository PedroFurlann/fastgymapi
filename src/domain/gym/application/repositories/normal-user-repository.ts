import { NormalUser } from '../../enterprise/entities/normal-user';

export abstract class NormalUserRepository {
  abstract create(normalUser: NormalUser): Promise<void>;
  abstract findByEmail(email: string): Promise<NormalUser | null>;
  abstract findById(normalUserId: string): Promise<NormalUser | null>;
  abstract update(normalUser: NormalUser): Promise<void>;
  abstract delete(normalUserId: string): Promise<void>;
}
