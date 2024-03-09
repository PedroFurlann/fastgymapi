import { NormalUserRepository } from '@/domain/gym/application/repositories/normal-user-repository';
import { NormalUser } from 'src/domain/gym/enterprise/entities/normal-user';

export class InMemoryNormalUserRepository implements NormalUserRepository {
  public items: NormalUser[] = [];

  async create(normalUser: NormalUser): Promise<void> {
    this.items.push(normalUser);
  }

  async findByEmail(email: string): Promise<NormalUser> {
    const normalUser = this.items.find((item) => item.email === email);

    if (!normalUser) {
      return null;
    }

    return normalUser;
  }

  async findById(normalUserId: string): Promise<NormalUser> {
    const normalUser = this.items.find(
      (item) => item.id.toString() === normalUserId,
    );

    if (!normalUser) {
      return null;
    }

    return normalUser;
  }

  async update(normalUser: NormalUser): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === normalUser.id);

    this.items[itemIndex] = normalUser;
  }
  async delete(normalUserId: string): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === normalUserId,
    );

    this.items.splice(itemIndex, 1);
  }
}
