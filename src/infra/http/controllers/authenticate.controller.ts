import { AuthenticateAthleteUseCase } from '@/domain/gym/application/use-cases/authenticate-athlete';
import { AuthenticateCoachUseCase } from '@/domain/gym/application/use-cases/authenticate-coach';
import { Public } from '@/infra/auth/public';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { WrongCredentialsError } from '@/domain/gym/application/use-cases/errors/wrong-credentials-error';
import { AuthenticateNormalUserUseCase } from '@/domain/gym/application/use-cases/authenticate-normal-user';

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchemaType = z.infer<typeof authenticateBodySchema>;

@Controller('/auth')
@Public()
export class AuthenticateController {
  constructor(
    private readonly authenticateCoachUseCase: AuthenticateCoachUseCase,
    private readonly authenticateAthleteUseCase: AuthenticateAthleteUseCase,
    private readonly authenticateNormalUserUseCase: AuthenticateNormalUserUseCase,
  ) {}

  @Post('/coach')
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async authenticateCoach(@Body() body: AuthenticateBodySchemaType) {
    const { email, password } = body;

    const result = await this.authenticateCoachUseCase.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return { access_token: accessToken };
  }

  @Post('/athlete')
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async authenticateAthlete(@Body() body: AuthenticateBodySchemaType) {
    const { email, password } = body;

    const result = await this.authenticateAthleteUseCase.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return { access_token: accessToken };
  }

  @Post('/normal-user')
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async autheticateNormalUser(@Body() body: AuthenticateBodySchemaType) {
    const { email, password } = body;

    const result = await this.authenticateNormalUserUseCase.execute({
      email,
      password: password ?? null,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return { access_token: accessToken };
  }
}
