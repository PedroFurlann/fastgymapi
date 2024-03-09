import { NormalUserRepository } from '@/domain/gym/application/repositories/normal-user-repository';
import { NormalUser } from '@/domain/gym/enterprise/entities/normal-user';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaNormalUserMapper } from '../mappers/prisma-normal-user-mapper';

@Injectable()
export class PrismaNormalUserRepository implements NormalUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(normalUser: NormalUser): Promise<void> {
    const data = PrismaNormalUserMapper.toPersistence(normalUser);

    await this.prismaService.normalUser.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<NormalUser> {
    const normalUser = await this.prismaService.normalUser.findUnique({
      where: {
        email,
      },
    });

    if (!normalUser) {
      return null;
    }

    return PrismaNormalUserMapper.toDomain(normalUser);
  }

  async findById(normalUserId: string): Promise<NormalUser> {
    const normalUser = await this.prismaService.normalUser.findUnique({
      where: {
        id: normalUserId,
      },
    });

    if (!normalUser) {
      return null;
    }

    return PrismaNormalUserMapper.toDomain(normalUser);
  }

  async update(normalUser: NormalUser): Promise<void> {
    const data = PrismaNormalUserMapper.toPersistence(normalUser);

    await this.prismaService.normalUser.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async delete(normalUserId: string): Promise<void> {
    await this.prismaService.normalUser.delete({
      where: {
        id: normalUserId,
      },
    });
  }
}
