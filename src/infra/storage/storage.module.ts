import { Module } from '@nestjs/common';
import { R2Storage } from './r2-storage';
import { EnvModule } from '../env/env.module';
import { Uploader } from '@/domain/gym/application/storage/uploader';
import { Deleter } from '@/domain/gym/application/storage/deleter';
import { DatabaseModule } from '../database/prisma/database.module';

@Module({
  imports: [EnvModule, DatabaseModule],
  providers: [
    {
      provide: Uploader,
      useClass: R2Storage,
    },
    {
      provide: Deleter,
      useClass: R2Storage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
