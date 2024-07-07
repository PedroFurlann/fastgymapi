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
import { CreateManyExercisesUseCase } from '@/domain/gym/application/use-cases/create-many-exercises';
import { EditNormalUserExerciseUseCase } from '@/domain/gym/application/use-cases/edit-normal-user-exercise';
import { DeleteNormalUserExerciseUseCase } from '@/domain/gym/application/use-cases/delete-normal-user-exercise';
import { AuthenticateNormalUserUseCase } from '@/domain/gym/application/use-cases/authenticate-normal-user';
import { UploadNormalUserProfilePhotoUseCase } from '@/domain/gym/application/use-cases/upload-normal-user-profile-photo';
import { DeleteNormalUserProfilePhotoUseCase } from '@/domain/gym/application/use-cases/delete-normal-user-profile-photo';
import { RegisterNormalUserUseCase } from '@/domain/gym/application/use-cases/register-normal-user';
import { NormalUserController } from './controllers/normal-user.controller';
import { FetchNormalUserByIdUseCase } from '@/domain/gym/application/use-cases/fetch-normal-user-by-id';
import { FetchNormalUserExercisesUseCase } from '@/domain/gym/application/use-cases/fetch-normal-user-exercises';
import { EditNormalUserUseCase } from '@/domain/gym/application/use-cases/edit-normal-user';
import { DeleteNormalUserUseCase } from '@/domain/gym/application/use-cases/delete-normal-user';
import { NormalUserOAuthAuthenticateUseCase } from '@/domain/gym/application/use-cases/normal-user-oauth-authenticate';
import { FetchNormalUserWorkoutsUseCase } from '@/domain/gym/application/use-cases/fetch-normal-user-workouts';
import { WorkoutController } from './controllers/workout.controller';
import { CreateWorkoutUseCase } from '@/domain/gym/application/use-cases/create-workout';
import { DeleteNormalUserWorkoutUseCase } from '@/domain/gym/application/use-cases/delete-normal-user-workout';
import { EditNormalUserWorkoutUseCase } from '@/domain/gym/application/use-cases/edit-normal-user-workout';
import { FavoriteWorkoutUseCase } from '@/domain/gym/application/use-cases/favorite-workout';
import { FetchWorkoutByIdUseCase } from '@/domain/gym/application/use-cases/fetch-workout-by-id';
import { FetchWorkoutExercisesUseCase } from '@/domain/gym/application/use-cases/fetch-workout-exercises';
import { EditManyExercisesUseCase } from '@/domain/gym/application/use-cases/edit-many-exercises';
import { FetchHistoryByIdUseCase } from '@/domain/gym/application/use-cases/fetch-history-by-id';
import { FetchNormalUserHistoryUseCase } from '@/domain/gym/application/use-cases/fetch-normal-user-history';
import { CreateHistoryUseCase } from '@/domain/gym/application/use-cases/create-history';
import { DeleteNormalUserHistoryUseCase } from '@/domain/gym/application/use-cases/delete-normal-user-history';
import { HistoryController } from './controllers/history-controller';

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    RegisterController,
    AuthenticateController,
    CoachController,
    AthleteController,
    ExerciseController,
    NormalUserController,
    StorageController,
    WorkoutController,
    HistoryController,
  ],
  providers: [
    RegisterAthleteUseCase,
    RegisterCoachUseCase,
    RegisterNormalUserUseCase,
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
    CreateManyExercisesUseCase,
    EditManyExercisesUseCase,
    FetchExerciseByIdUseCase,
    EditExerciseUseCase,
    DeleteExerciseUseCase,
    UploadCoachProfilePhotoUseCase,
    UploadAthleteProfilePhotoUseCase,
    DeleteCoachProfilePhotoUseCase,
    DeleteAthleteProfilePhotoUseCase,
    EditNormalUserExerciseUseCase,
    DeleteNormalUserExerciseUseCase,
    AuthenticateNormalUserUseCase,
    UploadNormalUserProfilePhotoUseCase,
    DeleteNormalUserProfilePhotoUseCase,
    FetchNormalUserByIdUseCase,
    FetchNormalUserExercisesUseCase,
    EditNormalUserUseCase,
    DeleteNormalUserUseCase,
    NormalUserOAuthAuthenticateUseCase,
    FetchNormalUserWorkoutsUseCase,
    CreateWorkoutUseCase,
    DeleteNormalUserWorkoutUseCase,
    FetchWorkoutByIdUseCase,
    EditNormalUserWorkoutUseCase,
    FavoriteWorkoutUseCase,
    FetchWorkoutExercisesUseCase,
    FetchHistoryByIdUseCase,
    FetchNormalUserHistoryUseCase,
    CreateHistoryUseCase,
    DeleteNormalUserHistoryUseCase,
  ],
})
export class HttpModule {}
