import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/prisma/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
})
export class HttpModule {}
