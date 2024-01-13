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

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type CreateAccountBodySchemaType = z.infer<typeof createAccountBodySchema>;

@Controller('/register')
export class RegisterController {
  constructor(
    private readonly registerCoachUseCase: RegisterCoachUseCase,
    private readonly registerAthleteUseCase: RegisterAthleteUseCase,
  ) {}

  @Public()
  @Post('/coach')
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async registerCoach(@Body() body: CreateAccountBodySchemaType) {
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
  }

  @Post('/athlete')
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  @UseGuards(CoachRoleGuard)
  async registerAthlete(
    @Body() body: CreateAccountBodySchemaType,
    @CurrentUser() user: UserPayload,
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
  }
}
