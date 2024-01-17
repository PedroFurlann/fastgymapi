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
import { AthleteController } from './controllers/athlete.controller';
import { FetchAthleteByIdUseCase } from '@/domain/gym/application/use-cases/fetch-athlete-by-id';
import { FetchAthleteExercisesUseCase } from '@/domain/gym/application/use-cases/fetch-athlete-exercises';
import { EditAthleteUseCase } from '@/domain/gym/application/use-cases/edit-athlete';
import { DeleteAthleteUseCase } from '@/domain/gym/application/use-cases/delete-athlete';
import { CreateExerciseUseCase } from '@/domain/gym/application/use-cases/create-exercise';
import { FetchExerciseByIdUseCase } from '@/domain/gym/application/use-cases/fetch-exercise-by-id';
import { EditExerciseUseCase } from '@/domain/gym/application/use-cases/edit-exercise';
import { DeleteExerciseUseCase } from '@/domain/gym/application/use-cases/delete-exercise';
import { ExerciseController } from './controllers/exercise.controller';
import { StorageController } from './controllers/storage.controller';
import { UploadCoachProfilePhotoUseCase } from '@/domain/gym/application/use-cases/upload-coach-profile-photo';
import { UploadAthleteProfilePhotoUseCase } from '@/domain/gym/application/use-cases/upload-athlete-profile-photo';
import { DeleteCoachProfilePhotoUseCase } from '@/domain/gym/application/use-cases/delete-coach-profile-photo';
import { DeleteAthleteProfilePhotoUseCase } from '@/domain/gym/application/use-cases/delete-athlete-profile-photo';

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    RegisterController,
    AuthenticateController,
    CoachController,
    AthleteController,
    ExerciseController,
    StorageController,
  ],
  providers: [
    RegisterAthleteUseCase,
    RegisterCoachUseCase,
    AuthenticateAthleteUseCase,
    AuthenticateCoachUseCase,
    FetchCoachByIdUseCase,
    EditCoachUseCase,
    FetchCoachAthletesUseCase,
    FetchCoachExercisesUseCase,
    FetchAthleteByIdUseCase,
    FetchAthleteExercisesUseCase,
    EditAthleteUseCase,
    DeleteAthleteUseCase,
    CreateExerciseUseCase,
    FetchExerciseByIdUseCase,
    EditExerciseUseCase,
    DeleteExerciseUseCase,
    UploadCoachProfilePhotoUseCase,
    UploadAthleteProfilePhotoUseCase,
    DeleteCoachProfilePhotoUseCase,
    DeleteAthleteProfilePhotoUseCase,
  ],
})
export class HttpModule {}
