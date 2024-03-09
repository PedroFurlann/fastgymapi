import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  NormalUser,
  NormalUserProps,
} from '@/domain/gym/enterprise/entities/normal-user';
import { PrismaNormalUserMapper } from '@/infra/database/prisma/mappers/prisma-normal-user-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeNormalUser(
  override: Partial<NormalUserProps> = {},
  id?: UniqueEntityID,
) {
  const normalUser = NormalUser.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      ...override,
    },
    id,
  );

  return normalUser;
}

@Injectable()
export class NormalUserFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaNormalUser(
    data: Partial<NormalUserProps> = {},
  ): Promise<NormalUser> {
    const normalUser = makeNormalUser(data);

    await this.prismaService.normalUser.create({
      data: PrismaNormalUserMapper.toPersistence(normalUser),
    });

    return normalUser;
  }
}
