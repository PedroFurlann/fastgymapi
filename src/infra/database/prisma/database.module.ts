import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CoachRepository } from '@/domain/gym/application/repositories/coach-repository';
import { PrismaCoachRepository } from './repositories/prisma-coach-repository';
import { AthleteRepository } from '@/domain/gym/application/repositories/athlete-repository';
import { PrismaAthleteRepository } from './repositories/prisma-athlete-repository';
import { ExerciseRepository } from '@/domain/gym/application/repositories/exercise-repository';
import { PrismaExerciseRepository } from './repositories/prisma-exercise-repository';
import { NormalUserRepository } from '@/domain/gym/application/repositories/normal-user-repository';
import { PrismaNormalUserRepository } from './repositories/prisma-normal-user-repository';
import { WorkoutRepository } from '@/domain/gym/application/repositories/workout-repository';
import { PrismaWorkoutRepository } from './repositories/prisma-workout-repository';
import { HistoryRepository } from '@/domain/gym/application/repositories/history-repository';
import { PrismaHistoryRepository } from './repositories/prisma-history-repository';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: CoachRepository,
      useClass: PrismaCoachRepository,
    },
    {
      provide: AthleteRepository,
      useClass: PrismaAthleteRepository,
    },
    {
      provide: ExerciseRepository,
      useClass: PrismaExerciseRepository,
    },
    {
      provide: NormalUserRepository,
      useClass: PrismaNormalUserRepository,
    },
    {
      provide: WorkoutRepository,
      useClass: PrismaWorkoutRepository,
    },
    {
      provide: HistoryRepository,
      useClass: PrismaHistoryRepository,
    },
  ],
  exports: [
    PrismaService,
    CoachRepository,
    AthleteRepository,
    ExerciseRepository,
    NormalUserRepository,
    WorkoutRepository,
    HistoryRepository,
  ],
})
export class DatabaseModule {}
