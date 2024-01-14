import { EditCoachUseCase } from '@/domain/gym/application/use-cases/edit-coach';
import { FetchCoachAthletesUseCase } from '@/domain/gym/application/use-cases/fetch-coach-athletes';
import { FetchCoachByIdUseCase } from '@/domain/gym/application/use-cases/fetch-coach-by-id';
import { FetchCoachExercisesUseCase } from '@/domain/gym/application/use-cases/fetch-coach-exercises';
import { CoachRoleGuard } from '@/infra/auth/coach-role.guard';
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CoachPresenter } from '../presenters/coach-presenter';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { AthletePresenter } from '../presenters/athlete-presenter';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

const editCoachBodySchema = z.object({
  name: z.string(),
  password: z.string().optional(),
});

const editCoachBodyValidationPipe = new ZodValidationPipe(editCoachBodySchema);

type EditCoachBodySchema = z.infer<typeof editCoachBodySchema>;

@UseGuards(CoachRoleGuard)
@Controller('/coach')
export class CoachController {
  constructor(
    private readonly fetchCoachByIdUseCase: FetchCoachByIdUseCase,
    private readonly editCoachUseCase: EditCoachUseCase,
    private readonly fetchCoachAthletesUseCase: FetchCoachAthletesUseCase,
    private readonly fetchCoachExercisesUseCase: FetchCoachExercisesUseCase,
  ) {}

  @Get()
  async fetchCoachById(@CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.fetchCoachByIdUseCase.execute({
      coachId: userId,
    });

    const { coach } = result.value;

    return { coach: CoachPresenter.toHTTP(coach) };
  }

  @Get('/athletes')
  async fetchCoachAthletes(@CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.fetchCoachAthletesUseCase.execute({
      coachId: userId,
    });

    const { athletes } = result.value;

    return { athletes: athletes.map(AthletePresenter.toHTTP) };
  }

  @Get('/exercises')
  async fetchCoachExercises(@CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.fetchCoachExercisesUseCase.execute({
      coachId: userId,
    });

    const { exercises } = result.value;

    return { exercises };
  }

  @Put()
  async editCoach(
    @Body(editCoachBodyValidationPipe) body: EditCoachBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, password } = body;

    const userId = user.sub;

    const result = await this.editCoachUseCase.execute({
      coachId: userId,
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

    const { coach } = result.value;

    return { coach: CoachPresenter.toHTTP(coach) };
  }
}
