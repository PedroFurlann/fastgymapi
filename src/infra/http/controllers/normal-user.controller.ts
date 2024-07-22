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
  Post,
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
import { Public } from '@/infra/auth/public';
import { SendRecoveryPasswordCodeUseCase } from '@/domain/gym/application/use-cases/send-recovery-password-email';
import { UserNotFoundError } from '@/domain/gym/application/use-cases/errors/user-not-found-error';
import { ValidateRecoveryPasswordCodeUseCase } from '@/domain/gym/application/use-cases/validate-recovery-password-code';
import { InvalidRecoveryPasswordCodeError } from '@/domain/gym/application/use-cases/errors/invalid-recovery-password-code-error';
import { UpdateNormalUserPasswordUseCase } from '@/domain/gym/application/use-cases/update-normal-user-password';

const editNormalUserBodySchema = z.object({
  name: z.string(),
  password: z.string().optional(),
});

const sendRecoveryPasswordCodeBodySchema = z.object({
  email: z.string().email(),
});

const validateRecoveryPasswordCodeBodySchema = z.object({
  email: z.string().email(),
  recoveryPasswordCode: z.string(),
});

const updateNormalUserPasswordBodySchema = z.object({
  email: z.string().email(),
  newPassword: z.string(),
});

const editNormalUserBodyValidationPipe = new ZodValidationPipe(
  editNormalUserBodySchema,
);

type EditNormalUserBodySchema = z.infer<typeof editNormalUserBodySchema>;

type SendRecoveryPasswordCodeBodySchema = z.infer<
  typeof sendRecoveryPasswordCodeBodySchema
>;

type ValidateRecoveryPasswordCodeBodySchema = z.infer<
  typeof validateRecoveryPasswordCodeBodySchema
>;

type UpdateNormalUserPasswordBodySchema = z.infer<
  typeof updateNormalUserPasswordBodySchema
>;

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
    private readonly sendRecoveryPasswordCodeUseCase: SendRecoveryPasswordCodeUseCase,
    private readonly validateRecoveryPasswordCodeUseCase: ValidateRecoveryPasswordCodeUseCase,
    private readonly updateNormalUserPasswordUseCase: UpdateNormalUserPasswordUseCase,
  ) {}

  @UseGuards(NormalUserRoleGuard)
  @Get()
  async fetchNormalUserById(@CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.fetchNormalUserByIdUseCase.execute({
      normalUserId: userId,
    });

    const { normalUser } = result.value;

    return { normalUser: NormalUserPresenter.toHTTP(normalUser) };
  }

  @UseGuards(NormalUserRoleGuard)
  @Get('/exercises')
  async fetchNormalUserExercises(@CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.fetchNormalUserExercisesUseCase.execute({
      normalUserId: userId,
    });

    const { exercises } = result.value;

    return { exercises: exercises.map(ExercisePresenter.toHTTP) };
  }

  @UseGuards(NormalUserRoleGuard)
  @Get('/workouts')
  async fetchNormalUserWorkouts(@CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.fetchNormalUserWorkoutsUseCase.execute({
      normalUserId: userId,
    });

    const { workouts } = result.value;

    return { workouts: workouts.map(WorkoutPresenter.toHTTP) };
  }

  @UseGuards(NormalUserRoleGuard)
  @Get('/history')
  async fetchNormalUserHistory(@CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.fetchNormalUserHistoryUseCase.execute({
      normalUserId: userId,
    });

    const { history } = result.value;

    return { history: history.map(HistoryPresenter.toHTTP) };
  }

  @UseGuards(NormalUserRoleGuard)
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

  @UseGuards(NormalUserRoleGuard)
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
  sendRecoveryPasswordCodeEmail;

  @UseGuards(NormalUserRoleGuard)
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

  @Public()
  @Post('/recovery-password')
  async sendRecoveryPasswordCode(
    @Body() body: SendRecoveryPasswordCodeBodySchema,
  ) {
    const { email } = body;

    const result = await this.sendRecoveryPasswordCodeUseCase.execute({
      email,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserNotFoundError:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }

  @Public()
  @Post('/validate-recovery-password-code')
  async validateRecoveryPasswordCode(
    @Body() body: ValidateRecoveryPasswordCodeBodySchema,
  ) {
    const { email, recoveryPasswordCode } = body;

    const result = await this.validateRecoveryPasswordCodeUseCase.execute({
      email,
      recoveryPasswordCode,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidRecoveryPasswordCodeError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }

  @Public()
  @Post('/update-password')
  async updateNormalUserPassword(
    @Body() body: UpdateNormalUserPasswordBodySchema,
  ) {
    const { email, newPassword } = body;

    const result = await this.updateNormalUserPasswordUseCase.execute({
      email,
      newPassword,
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
