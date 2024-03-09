import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NormalUser } from '@/domain/gym/enterprise/entities/normal-user';
import { Prisma, NormalUser as PrismaNormalUser } from '@prisma/client';

export class PrismaNormalUserMapper {
  static toDomain(raw: PrismaNormalUser): NormalUser {
    return NormalUser.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password ? raw.password : null,
        avatarUrl: raw.avatarUrl ? raw.avatarUrl : null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ? raw.updatedAt : null,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(
    noramlUser: NormalUser,
  ): Prisma.NormalUserUncheckedCreateInput {
    return {
      id: noramlUser.id.toString(),
      name: noramlUser.name,
      email: noramlUser.email,
      password: noramlUser.password,
      avatarUrl: noramlUser.avatarUrl,
      createdAt: noramlUser.createdAt,
      updatedAt: noramlUser.updatedAt,
    };
  }
}
