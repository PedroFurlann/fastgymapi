import { CreateWorkoutUseCase } from '@/domain/gym/application/use-cases/create-workout';
import { FetchWorkoutByIdUseCase } from '@/domain/gym/application/use-cases/fetch-workout-by-id';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { WorkoutPresenter } from '../presenters/workout-presenter';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NormalUserRoleGuard } from '@/infra/auth/normal-user-role.guard';
import { EditNormalUserWorkoutUseCase } from '@/domain/gym/application/use-cases/edit-normal-user-workout';
import { DeleteNormalUserWorkoutUseCase } from '@/domain/gym/application/use-cases/delete-normal-user-workout';
import { FavoriteWorkoutUseCase } from '@/domain/gym/application/use-cases/favorite-workout';

const createCoachWorkoutBodySchema = z.object({
  title: z.string(),
});

const createCoachWorkoutBodyValidationPipe = new ZodValidationPipe(
  createCoachWorkoutBodySchema,
);

type CreateCoachWorkoutBodySchema = z.infer<
  typeof createCoachWorkoutBodySchema
>;

const editWorkoutBodySchema = z.object({
  title: z.string(),
});

const editWorkoutBodyValidationPipe = new ZodValidationPipe(
  editWorkoutBodySchema,
);

type EditWorkoutBodySchema = z.infer<typeof editWorkoutBodySchema>;

const favoriteWorkoutBodySchema = z.object({
  favorite: z.boolean(),
});

const favoriteWorkoutBodyValidationPipe = new ZodValidationPipe(
  favoriteWorkoutBodySchema,
);

type FavoriteWorkoutBodySchema = z.infer<typeof favoriteWorkoutBodySchema>;

@Controller('/workout')
export class WorkoutController {
  constructor(
    private readonly createWorkoutUseCase: CreateWorkoutUseCase,
    private readonly fetchWorkoutByIdUseCase: FetchWorkoutByIdUseCase,
    private readonly editNormalUserWorkoutUseCase: EditNormalUserWorkoutUseCase,
    private readonly deleteNormalUserWorkoutUseCase: DeleteNormalUserWorkoutUseCase,
    private readonly favoriteWorkoutUseCase: FavoriteWorkoutUseCase,
  ) {}

  @Get('/:workoutId')
  async fetchWorkoutById(@Param('workoutId') workoutId: string) {
    const result = await this.fetchWorkoutByIdUseCase.execute({
      workoutId,
    });

    const { workout } = result.value;

    return { workout: WorkoutPresenter.toHTTP(workout) };
  }

  @UseGuards(NormalUserRoleGuard)
  @Post('/normal-user')
  async createNormalUserWorkout(
    @CurrentUser() user: UserPayload,
    @Body(createCoachWorkoutBodyValidationPipe)
    body: CreateCoachWorkoutBodySchema,
  ) {
    const { title } = body;

    const userId = user.sub;

    const result = await this.createWorkoutUseCase.execute({
      normalUserId: userId,
      title,
    });

    const { workout } = result.value;

    return { workout: WorkoutPresenter.toHTTP(workout) };
  }

  @UseGuards(NormalUserRoleGuard)
  @Put('/normal-user/:workoutId')
  async editNormalUserWorkout(
    @CurrentUser() user: UserPayload,
    @Body(editWorkoutBodyValidationPipe) body: EditWorkoutBodySchema,
    @Param('workoutId') workoutId: string,
  ) {
    const { title } = body;

    const userId = user.sub;

    const result = await this.editNormalUserWorkoutUseCase.execute({
      workoutId,
      normalUserId: userId,
      title,
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

    const { workout } = result.value;

    return { workout: WorkoutPresenter.toHTTP(workout) };
  }

  @UseGuards(NormalUserRoleGuard)
  @Delete('/normal-user/:workoutId')
  async deleteNormalUserWorkout(
    @CurrentUser() user: UserPayload,
    @Param('workoutId') workoutId: string,
  ) {
    const userId = user.sub;

    const result = await this.deleteNormalUserWorkoutUseCase.execute({
      normalUserId: userId,
      workoutId,
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

  @UseGuards(NormalUserRoleGuard)
  @Patch('/favorite/normal-user/:workoutId')
  async favoriteUserWorkout(
    @CurrentUser() user: UserPayload,
    @Body(favoriteWorkoutBodyValidationPipe) body: FavoriteWorkoutBodySchema,
    @Param('workoutId') workoutId: string,
  ) {
    const { favorite } = body;

    const userId = user.sub;

    const result = await this.favoriteWorkoutUseCase.execute({
      workoutId,
      normalUserId: userId,
      favorite,
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
