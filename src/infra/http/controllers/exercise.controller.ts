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

const createExerciseBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  athleteId: z.string().uuid().optional(),
});

const createExerciseBodyValidationPipe = new ZodValidationPipe(
  createExerciseBodySchema,
);

type CreateExerciseBodySchema = z.infer<typeof createExerciseBodySchema>;

const editExerciseBodySchema = z.object({
  title: z.string(),
  description: z.string(),
});

const editExerciseBodyValidationPipe = new ZodValidationPipe(
  editExerciseBodySchema,
);

type EditExerciseBodySchema = z.infer<typeof editExerciseBodySchema>;

@Controller('/exercise')
export class ExerciseController {
  constructor(
    private readonly createExerciseUseCase: CreateExerciseUseCase,
    private readonly editExerciseUseCase: EditExerciseUseCase,
    private readonly deleteExerciseUseCase: DeleteExerciseUseCase,
    private readonly fetchExerciseByIdUseCase: FetchExerciseByIdUseCase,
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
  @Post()
  async createExercise(
    @CurrentUser() user: UserPayload,
    @Body(createExerciseBodyValidationPipe) body: CreateExerciseBodySchema,
  ) {
    const { title, description, athleteId } = body;

    const userId = user.sub;

    const result = await this.createExerciseUseCase.execute({
      coachId: userId,
      athleteId: athleteId || null,
      title,
      description,
    });

    const { exercise } = result.value;

    return { exercise: ExercisePresenter.toHTTP(exercise) };
  }

  @UseGuards(CoachRoleGuard)
  @Put('/:exerciseId')
  async editExercise(
    @CurrentUser() user: UserPayload,
    @Body(editExerciseBodyValidationPipe) body: EditExerciseBodySchema,
    @Param('exerciseId') exerciseId: string,
  ) {
    const { title, description } = body;

    const userId = user.sub;

    const result = await this.editExerciseUseCase.execute({
      coachId: userId,
      exerciseId,
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
