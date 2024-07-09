import { CreateExerciseUseCase } from '@/domain/gym/application/use-cases/create-exercise';
import { DeleteExerciseUseCase } from '@/domain/gym/application/use-cases/delete-exercise';
import { EditExerciseUseCase } from '@/domain/gym/application/use-cases/edit-exercise';
import { FetchExerciseByIdUseCase } from '@/domain/gym/application/use-cases/fetch-exercise-by-id';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ExercisePresenter } from '../presenters/exercise-presenter';
import { CoachRoleGuard } from '@/infra/auth/coach-role.guard';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { CreateManyExercisesUseCase } from '@/domain/gym/application/use-cases/create-many-exercises';
import { NormalUserRoleGuard } from '@/infra/auth/normal-user-role.guard';
import { EditNormalUserExerciseUseCase } from '@/domain/gym/application/use-cases/edit-normal-user-exercise';
import { DeleteNormalUserExerciseUseCase } from '@/domain/gym/application/use-cases/delete-normal-user-exercise';
import { EditManyExercisesUseCase } from '@/domain/gym/application/use-cases/edit-many-exercises';

const createCoachExerciseBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  athleteId: z.string().uuid().optional(),
  mediaUrl: z.string().optional(),
  previewUrl: z.string().optional(),
  workoutId: z.string().uuid().optional(),
  category: z.enum([
    'BICEPS',
    'TRICEPS',
    'CHEST',
    'BACK',
    'LEGS',
    'SHOULDERS',
    'FOREARMS',
    'OTHER',
  ]),
});

const createCoachExerciseBodyValidationPipe = new ZodValidationPipe(
  createCoachExerciseBodySchema,
);

type CreateCoachExerciseBodySchema = z.infer<
  typeof createCoachExerciseBodySchema
>;

const createAthleteExerciseBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  athleteId: z.string().uuid(),
  mediaUrl: z.string().optional(),
  previewUrl: z.string().optional(),
  category: z.enum([
    'BICEPS',
    'TRICEPS',
    'CHEST',
    'BACK',
    'LEGS',
    'SHOULDERS',
    'FOREARMS',
    'OTHER',
  ]),
});

const createAthleteExerciseBodyValidationPipe = new ZodValidationPipe(
  createAthleteExerciseBodySchema,
);

type CreateAthleteExerciseBodySchema = z.infer<
  typeof createAthleteExerciseBodySchema
>;

const createManyExercisesBodySchema = z.object({
  exercises: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      athleteId: z.string().uuid().optional(),
      normalUserId: z.string().uuid().optional(),
      mediaUrl: z.string().optional(),
      previewUrl: z.string().optional(),
      workoutId: z.string().uuid().optional(),
      category: z.enum([
        'BICEPS',
        'TRICEPS',
        'CHEST',
        'BACK',
        'LEGS',
        'SHOULDERS',
        'FOREARMS',
        'OTHER',
      ]),
    }),
  ),
});

const createManyExercisesBodyValidationPipe = new ZodValidationPipe(
  createManyExercisesBodySchema,
);

type CreateManyExercisesBodySchema = z.infer<
  typeof createManyExercisesBodySchema
>;

const editManyExercisesBodySchema = z.object({
  exercises: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      athleteId: z.string().uuid().optional(),
      normalUserId: z.string().uuid().optional(),
      mediaUrl: z.string().optional(),
      previewUrl: z.string().optional(),
      workoutId: z.string().uuid().nullable(),
      series: z.number().nullable(),
      repetitions: z.array(z.number()).nullable(),
      weights: z.array(z.number()).nullable(),
      category: z.enum([
        'BICEPS',
        'TRICEPS',
        'CHEST',
        'BACK',
        'LEGS',
        'SHOULDERS',
        'FOREARMS',
        'OTHER',
      ]),
    }),
  ),
});

const editManyExercisesBodyValidationPipe = new ZodValidationPipe(
  editManyExercisesBodySchema,
);

type EditManyExercisesBodySchema = z.infer<typeof editManyExercisesBodySchema>;

const editExerciseBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  workoutId: z.string().uuid().optional(),
  series: z.number().nullable(),
  repetitions: z.array(z.number()).nullable(),
  weights: z.array(z.number()).nullable(),
});

const editExerciseBodyValidationPipe = new ZodValidationPipe(
  editExerciseBodySchema,
);

type EditExerciseBodySchema = z.infer<typeof editExerciseBodySchema>;

@Controller('/exercise')
export class ExerciseController {
  constructor(
    private readonly createExerciseUseCase: CreateExerciseUseCase,
    private readonly createManyExercisesUseCase: CreateManyExercisesUseCase,
    private readonly editExerciseUseCase: EditExerciseUseCase,
    private readonly deleteExerciseUseCase: DeleteExerciseUseCase,
    private readonly fetchExerciseByIdUseCase: FetchExerciseByIdUseCase,
    private readonly editNormalUserExerciseUseCase: EditNormalUserExerciseUseCase,
    private readonly deleteNormalUserExerciseUseCase: DeleteNormalUserExerciseUseCase,
    private readonly editManyExercisesUseCase: EditManyExercisesUseCase,
  ) {}

  @Get('/:exerciseId')
  async fetchExerciseById(@Param('exerciseId') exerciseId: string) {
    const result = await this.fetchExerciseByIdUseCase.execute({
      exerciseId,
    });

    const { exercise } = result.value;

    return { exercise: ExercisePresenter.toHTTP(exercise) };
  }

  @UseGuards(CoachRoleGuard)
  @Post('/coach')
  async createCoachExercise(
    @CurrentUser() user: UserPayload,
    @Body(createCoachExerciseBodyValidationPipe)
    body: CreateCoachExerciseBodySchema,
  ) {
    const { title, description, category, workoutId, mediaUrl, previewUrl } =
      body;

    const userId = user.sub;

    const result = await this.createExerciseUseCase.execute({
      coachId: userId,
      category: category,
      workoutId,
      mediaUrl: mediaUrl ?? null,
      previewUrl: previewUrl ?? null,
      title,
      description,
    });

    const { exercise } = result.value;

    return { exercise: ExercisePresenter.toHTTP(exercise) };
  }

  @UseGuards(CoachRoleGuard)
  @Post('/athlete')
  async createAthleteExercise(
    @Body(createAthleteExerciseBodyValidationPipe)
    body: CreateAthleteExerciseBodySchema,
  ) {
    const { title, description, category, athleteId, mediaUrl, previewUrl } =
      body;

    const result = await this.createExerciseUseCase.execute({
      category: category,
      title,
      mediaUrl: mediaUrl ?? null,
      previewUrl: previewUrl ?? null,
      description,
      athleteId: athleteId || null,
    });

    const { exercise } = result.value;

    return { exercise: ExercisePresenter.toHTTP(exercise) };
  }

  @UseGuards(NormalUserRoleGuard)
  @Post('/normal-user')
  async createNormalUserExercise(
    @CurrentUser() user: UserPayload,
    @Body(createCoachExerciseBodyValidationPipe)
    body: CreateCoachExerciseBodySchema,
  ) {
    const { title, description, category, workoutId, mediaUrl, previewUrl } =
      body;

    const userId = user.sub;

    const result = await this.createExerciseUseCase.execute({
      normalUserId: userId,
      category: category,
      workoutId: workoutId ?? null,
      mediaUrl: mediaUrl ?? null,
      previewUrl: previewUrl ?? null,
      title,
      description,
    });

    const { exercise } = result.value;

    return { exercise: ExercisePresenter.toHTTP(exercise) };
  }

  @Post('/many')
  async createManyExercises(
    @Body(createManyExercisesBodyValidationPipe)
    body: CreateManyExercisesBodySchema,
  ) {
    const { exercises } = body;

    const createdExercises = exercises.map((exercise) => {
      return {
        title: exercise.title,
        description: exercise.description,
        athleteId: exercise.athleteId ?? null,
        mediaUrl: exercise.mediaUrl ?? null,
        previewUrl: exercise.previewUrl ?? null,
        normalUserId: exercise.normalUserId ?? null,
        category: exercise.category ?? null,
        workoutId: exercise.workoutId ?? null,
      };
    });

    const result = await this.createManyExercisesUseCase.execute({
      exercises: createdExercises,
    });

    const { exercises: resultExercises } = result.value;

    return {
      exercises: resultExercises.map(ExercisePresenter.toHTTP),
    };
  }

  @Put('/many')
  async editManyExercises(
    @Body(editManyExercisesBodyValidationPipe)
    body: EditManyExercisesBodySchema,
  ) {
    const { exercises } = body;

    const editExercises = exercises.map((exercise) => {
      return {
        id: exercise.id,
        title: exercise.title,
        description: exercise.description,
        athleteId: exercise.athleteId ?? null,
        mediaUrl: exercise.mediaUrl ?? null,
        previewUrl: exercise.previewUrl ?? null,
        normalUserId: exercise.normalUserId ?? null,
        category: exercise.category ?? null,
        workoutId: exercise.workoutId ?? null,
        series: exercise.series ?? null,
        weights: exercise.weights ?? null,
        repetitions: exercise.repetitions ?? null,
      };
    });

    await this.editManyExercisesUseCase.execute({
      exercises: editExercises,
    });
  }

  @UseGuards(NormalUserRoleGuard)
  @Put('/normal-user/:exerciseId')
  async editNormalUserExercise(
    @CurrentUser() user: UserPayload,
    @Body(editExerciseBodyValidationPipe) body: EditExerciseBodySchema,
    @Param('exerciseId') exerciseId: string,
  ) {
    const {
      title,
      description,
      category,
      workoutId,
      series,
      repetitions,
      weights,
    } = body;

    const userId = user.sub;

    const result = await this.editNormalUserExerciseUseCase.execute({
      normalUserId: userId,
      title,
      category,
      exerciseId,
      workoutId: workoutId ?? null,
      series: series ?? null,
      repetitions: repetitions ?? null,
      weights: weights ?? null,
      description,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { exercise } = result.value;

    return { exercise: ExercisePresenter.toHTTP(exercise) };
  }

  @UseGuards(NormalUserRoleGuard)
  @Delete('/normal-user/:exerciseId')
  async deleteNormalUserExercise(
    @CurrentUser() user: UserPayload,
    @Param('exerciseId') exerciseId: string,
  ) {
    const userId = user.sub;

    const result = await this.deleteNormalUserExerciseUseCase.execute({
      normalUserId: userId,
      exerciseId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }

  @UseGuards(CoachRoleGuard)
  @Put('/:exerciseId')
  async editExercise(
    @CurrentUser() user: UserPayload,
    @Body(editExerciseBodyValidationPipe) body: EditExerciseBodySchema,
    @Param('exerciseId') exerciseId: string,
  ) {
    const { title, description, category } = body;

    const userId = user.sub;

    const result = await this.editExerciseUseCase.execute({
      coachId: userId,
      exerciseId,
      category,
      title,
      description,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { exercise } = result.value;

    return { exercise: ExercisePresenter.toHTTP(exercise) };
  }

  @UseGuards(CoachRoleGuard)
  @Delete('/:exerciseId')
  async deleteExercise(
    @CurrentUser() user: UserPayload,
    @Param('exerciseId') exerciseId: string,
  ) {
    const userId = user.sub;

    const result = await this.deleteExerciseUseCase.execute({
      coachId: userId,
      exerciseId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
