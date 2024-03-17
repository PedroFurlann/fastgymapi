import { NormalUser } from '@/domain/gym/enterprise/entities/normal-user';

export class NormalUserPresenter {
  static toHTTP(normalUser: NormalUser) {
    return {
      id: normalUser.id.toString(),
      name: normalUser.name,
      email: normalUser.email,
      avatarUrl: normalUser.avatarUrl,
      createdAt: normalUser.createdAt,
      updatedAt: normalUser.updatedAt,
    };
  }
}
