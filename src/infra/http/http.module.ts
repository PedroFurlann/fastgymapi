import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/prisma/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { StorageModule } from '../storage/storage.module';
import { RegisterController } from './controllers/register.controller';
import { RegisterAthleteUseCase } from '@/domain/gym/application/use-cases/register-athlete';
import { RegisterCoachUseCase } from '@/domain/gym/application/use-cases/register-coach';
import { AuthenticateController } from './controllers/authenticate.controller';
import { AuthenticateCoachUseCase } from '@/domain/gym/application/use-cases/authenticate-coach';
import { AuthenticateAthleteUseCase } from '@/domain/gym/application/use-cases/authenticate-athlete';
import { CoachController } from './controllers/coach.controller';
import { FetchCoachByIdUseCase } from '@/domain/gym/application/use-cases/fetch-coach-by-id';
import { EditCoachUseCase } from '@/domain/gym/application/use-cases/edit-coach';
import { FetchCoachAthletesUseCase } from '@/domain/gym/application/use-cases/fetch-coach-athletes';
import { FetchCoachExercisesUseCase } from '@/domain/gym/application/use-cases/fetch-coach-exercises';

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [RegisterController, AuthenticateController, CoachController],
  providers: [
    RegisterAthleteUseCase,
    RegisterCoachUseCase,
    AuthenticateAthleteUseCase,
    AuthenticateCoachUseCase,
    FetchCoachByIdUseCase,
    EditCoachUseCase,
    FetchCoachAthletesUseCase,
    FetchCoachExercisesUseCase,
  ],
})
export class HttpModule {}
