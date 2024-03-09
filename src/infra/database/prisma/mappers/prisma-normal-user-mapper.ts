import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NormalUser } from '@/domain/gym/enterprise/entities/normal-user';
import { Prisma, NormalUser as PrismaNormalUser } from '@prisma/client';

export class PrismaNormalUserMapper {
  static toDomain(raw: PrismaNormalUser): NormalUser {
    return NormalUser.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        avatarUrl: raw.avatarUrl ? raw.avatarUrl : null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ? raw.updatedAt : null,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(
    normaluser: NormalUser,
  ): Prisma.NormalUserUncheckedCreateInput {
    return {
      id: normaluser.id.toString(),
      name: normaluser.name,
      email: normaluser.email,
      password: normaluser.password,
      avatarUrl: normaluser.avatarUrl,
      createdAt: normaluser.createdAt,
      updatedAt: normaluser.updatedAt,
    };
  }
}
