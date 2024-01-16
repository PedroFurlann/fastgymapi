import { RegisterAthleteUseCase } from '@/domain/gym/application/use-cases/register-athlete';
import { RegisterCoachUseCase } from '@/domain/gym/application/use-cases/register-coach';
import { Public } from '@/infra/auth/public';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { CoachAlreadyExistsError } from '@/domain/gym/application/use-cases/errors/coach-alreay-exists-error';
import { CoachRoleGuard } from '@/infra/auth/coach-role.guard';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { AthleteAlreadyExistsError } from '@/domain/gym/application/use-cases/errors/athlete-already-exists-error';
import { CoachPresenter } from '../presenters/coach-presenter';
import { AthletePresenter } from '../presenters/athlete-presenter';

const createCoachBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type CreateCoachBodySchemaType = z.infer<typeof createCoachBodySchema>;

const createAthleteBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

const createAthleteBodyValidationPipe = new ZodValidationPipe(
  createAthleteBodySchema,
);

type CreateAthleteBodySchema = z.infer<typeof createAthleteBodySchema>;

@Controller('/register')
export class RegisterController {
  constructor(
    private readonly registerCoachUseCase: RegisterCoachUseCase,
    private readonly registerAthleteUseCase: RegisterAthleteUseCase,
  ) {}

  @Public()
  @Post('/coach')
  @UsePipes(new ZodValidationPipe(createCoachBodySchema))
  async registerCoach(@Body() body: CreateCoachBodySchemaType) {
    const { name, email, password } = body;

    const result = await this.registerCoachUseCase.execute({
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CoachAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { coach } = result.value;

    return { coach: CoachPresenter.toHTTP(coach) };
  }

  @UseGuards(CoachRoleGuard)
  @Post('/athlete')
  async registerAthlete(
    @CurrentUser() user: UserPayload,
    @Body(createAthleteBodyValidationPipe) body: CreateAthleteBodySchema,
  ) {
    const { name, email, password } = body;

    const userId = user.sub;

    const result = await this.registerAthleteUseCase.execute({
      coachId: userId,
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case AthleteAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { athlete } = result.value;

    return { athlete: AthletePresenter.toHTTP(athlete) };
  }
}
