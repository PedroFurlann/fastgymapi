import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/prisma/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { StorageModule } from '../storage/storage.module';
import { RegisterController } from './controllers/register.controller';
import { RegisterAthleteUseCase } from '@/domain/gym/application/use-cases/register-athlete';
import { RegisterCoachUseCase } from '@/domain/gym/application/use-cases/register-coach';

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [RegisterController],
  providers: [RegisterAthleteUseCase, RegisterCoachUseCase],
})
export class HttpModule {}
