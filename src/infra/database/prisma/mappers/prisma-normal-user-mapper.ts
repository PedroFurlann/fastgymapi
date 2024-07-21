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
        recoveryPasswordCode: raw.recoveryPasswordCode
          ? raw.recoveryPasswordCode
          : null,
        recoveryPasswordCodeExpiresIn: raw.recoveryPasswordCodeExpiresIn
          ? raw.recoveryPasswordCodeExpiresIn
          : null,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(
    normalUser: NormalUser,
  ): Prisma.NormalUserUncheckedCreateInput {
    return {
      id: normalUser.id.toString(),
      name: normalUser.name,
      email: normalUser.email,
      password: normalUser.password,
      avatarUrl: normalUser.avatarUrl,
      createdAt: normalUser.createdAt,
      updatedAt: normalUser.updatedAt,
      recoveryPasswordCode: normalUser.recoveryPasswordCode,
      recoveryPasswordCodeExpiresIn: normalUser.recoveryPasswordCodeExpiresIn,
    };
  }
}
