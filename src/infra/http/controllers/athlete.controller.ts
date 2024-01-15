import { DeleteAthleteUseCase } from '@/domain/gym/application/use-cases/delete-athlete';
import { EditAthleteUseCase } from '@/domain/gym/application/use-cases/edit-athlete';
import { FetchAthleteByIdUseCase } from '@/domain/gym/application/use-cases/fetch-athlete-by-id';
import { FetchAthleteExercisesUseCase } from '@/domain/gym/application/use-cases/fetch-athlete-exercises';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { AthletePresenter } from '../presenters/athlete-presenter';
import { ExercisePresenter } from '../presenters/exercise-presenter';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

const editAthleteBodySchema = z.object({
  name: z.string(),
  password: z.string().optional(),
});

const editAthleteBodyValidationPipe = new ZodValidationPipe(
  editAthleteBodySchema,
);

type EditAthleteBodySchema = z.infer<typeof editAthleteBodySchema>;

@Controller('/athlete')
export class AthleteController {
  constructor(
    private readonly fetchAthleteByIdUseCase: FetchAthleteByIdUseCase,
    private readonly fetchAthleteExercisesUseCase: FetchAthleteExercisesUseCase,
    private readonly editAthleteUseCase: EditAthleteUseCase,
    private readonly deleteAthleteUseCase: DeleteAthleteUseCase,
  ) {}

  @Get()
  async fetchAthleteById(@CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.fetchAthleteByIdUseCase.execute({
      athleteId: userId,
    });

    const { athlete } = result.value;

    return { athlete: AthletePresenter.toHTTP(athlete) };
  }

  @Get('/exercises')
  async fetchCoachExercises(@CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.fetchAthleteExercisesUseCase.execute({
      athleteId: userId,
    });

    const { exercises } = result.value;

    return { exercises: exercises.map(ExercisePresenter.toHTTP) };
  }

  @Put()
  async editAthlete(
    @Body(editAthleteBodyValidationPipe) body: EditAthleteBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, password } = body;

    const userId = user.sub;

    const result = await this.editAthleteUseCase.execute({
      athleteId: userId,
      name,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { athlete } = result.value;

    return { athlete: AthletePresenter.toHTTP(athlete) };
  }

  @Delete()
  async deleteAthleteFromCoach(@CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.deleteAthleteUseCase.execute({
      athleteId: userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
