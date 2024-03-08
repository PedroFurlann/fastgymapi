import { NormalUserRepository } from '@/domain/gym/application/repositories/normal-user-repository';
import { NormalUser } from 'src/domain/gym/enterprise/entities/normal-user';

export class InMemoryNormalUserRepository implements NormalUserRepository {
  public items: NormalUser[] = [];

  async create(normaluser: NormalUser): Promise<void> {
    this.items.push(normaluser);
  }

  async findByEmail(email: string): Promise<NormalUser> {
    const normaluser = this.items.find((item) => item.email === email);

    if (!normaluser) {
      return null;
    }

    return normaluser;
  }

  async findById(normaluserId: string): Promise<NormalUser> {
    const normaluser = this.items.find(
      (item) => item.id.toString() === normaluserId,
    );

    if (!normaluser) {
      return null;
    }

    return normaluser;
  }

  async update(normaluser: NormalUser): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === normaluser.id);

    this.items[itemIndex] = normaluser;
  }
  async delete(normaluserId: string): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === normaluserId,
    );

    this.items.splice(itemIndex, 1);
  }
}
