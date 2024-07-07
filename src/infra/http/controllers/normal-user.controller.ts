import { EditNormalUserUseCase } from '@/domain/gym/application/use-cases/edit-normal-user';
import { FetchNormalUserByIdUseCase } from '@/domain/gym/application/use-cases/fetch-normal-user-by-id';
import { FetchNormalUserExercisesUseCase } from '@/domain/gym/application/use-cases/fetch-normal-user-exercises';
import { NormalUserRoleGuard } from '@/infra/auth/normal-user-role.guard';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { ExercisePresenter } from '../presenters/exercise-presenter';
import { NormalUserPresenter } from '../presenters/normal-user-presenter';
import { DeleteNormalUserUseCase } from '@/domain/gym/application/use-cases/delete-normal-user';
import { FetchNormalUserWorkoutsUseCase } from '@/domain/gym/application/use-cases/fetch-normal-user-workouts';
import { WorkoutPresenter } from '../presenters/workout-presenter';
import { FetchNormalUserHistoryUseCase } from '@/domain/gym/application/use-cases/fetch-normal-user-history';
import { HistoryPresenter } from '../presenters/history-presenter';
import { DeleteNormalUserHistoryUseCase } from '@/domain/gym/application/use-cases/delete-normal-user-history';

const editNormalUserBodySchema = z.object({
  name: z.string(),
  password: z.string().optional(),
});

const editNormalUserBodyValidationPipe = new ZodValidationPipe(
  editNormalUserBodySchema,
);

type EditNormalUserBodySchema = z.infer<typeof editNormalUserBodySchema>;

@UseGuards(NormalUserRoleGuard)
@Controller('/normal-user')
export class NormalUserController {
  constructor(
    private readonly fetchNormalUserByIdUseCase: FetchNormalUserByIdUseCase,
    private readonly editNormalUserUseCase: EditNormalUserUseCase,
    private readonly fetchNormalUserExercisesUseCase: FetchNormalUserExercisesUseCase,
    private readonly deleteNormalUserUseCase: DeleteNormalUserUseCase,
    private readonly fetchNormalUserWorkoutsUseCase: FetchNormalUserWorkoutsUseCase,
    private readonly fetchNormalUserHistoryUseCase: FetchNormalUserHistoryUseCase,
    private readonly deleteNormalUserHistoryUseCase: DeleteNormalUserHistoryUseCase,
  ) {}

  @Get()
  async fetchNormalUserById(@CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.fetchNormalUserByIdUseCase.execute({
      normalUserId: userId,
    });

    const { normalUser } = result.value;

    return { normalUser: NormalUserPresenter.toHTTP(normalUser) };
  }

  @Get('/exercises')
  async fetchNormalUserExercises(@CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.fetchNormalUserExercisesUseCase.execute({
      normalUserId: userId,
    });

    const { exercises } = result.value;

    return { exercises: exercises.map(ExercisePresenter.toHTTP) };
  }

  @Get('/workouts')
  async fetchNormalUserWorkouts(@CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.fetchNormalUserWorkoutsUseCase.execute({
      normalUserId: userId,
    });

    const { workouts } = result.value;

    return { workouts: workouts.map(WorkoutPresenter.toHTTP) };
  }

  @Get('/history')
  async fetchNormalUserHistory(@CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.fetchNormalUserHistoryUseCase.execute({
      normalUserId: userId,
    });

    const { history } = result.value;

    return { history: history.map(HistoryPresenter.toHTTP) };
  }

  @Delete('/history')
  async deleteNormalUserHistory(@CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.deleteNormalUserHistoryUseCase.execute({
      normalUserId: userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }

  @Put()
  async editNormalUser(
    @Body(editNormalUserBodyValidationPipe) body: EditNormalUserBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, password } = body;

    const userId = user.sub;

    const result = await this.editNormalUserUseCase.execute({
      normalUserId: userId,
      name,
      password,
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

    const { normalUser } = result.value;

    return { normalUser: NormalUserPresenter.toHTTP(normalUser) };
  }

  @Delete()
  async deleteNormalUser(@CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.deleteNormalUserUseCase.execute({
      normalUserId: userId,
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
