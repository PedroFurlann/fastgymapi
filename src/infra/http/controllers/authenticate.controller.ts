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
import { NormalUserOAuthAuthenticateUseCase } from '@/domain/gym/application/use-cases/normal-user-oauth-authenticate';

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const oAuthAuthenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().optional(),
  name: z.string().optional(),
  avatarUrl: z.string().optional(),
});

type AuthenticateBodySchemaType = z.infer<typeof authenticateBodySchema>;

type OAuthAuthenticateBodySchemaType = z.infer<
  typeof oAuthAuthenticateBodySchema
>;

@Controller('/auth')
@Public()
export class AuthenticateController {
  constructor(
    private readonly authenticateCoachUseCase: AuthenticateCoachUseCase,
    private readonly authenticateAthleteUseCase: AuthenticateAthleteUseCase,
    private readonly authenticateNormalUserUseCase: AuthenticateNormalUserUseCase,
    private readonly normalUserOAuthAuthenticateUseCase: NormalUserOAuthAuthenticateUseCase,
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

  @Post('/normal-user/oauth')
  @UsePipes(new ZodValidationPipe(oAuthAuthenticateBodySchema))
  async oAuthAuthenticateNormalUser(
    @Body() body: OAuthAuthenticateBodySchemaType,
  ) {
    const { email, password, avatarUrl, name } = body;

    const result = await this.normalUserOAuthAuthenticateUseCase.execute({
      email,
      password: password ?? null,
      name: name ?? null,
      avatarUrl: avatarUrl ?? null,
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
