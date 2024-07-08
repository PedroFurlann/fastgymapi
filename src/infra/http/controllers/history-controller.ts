import { CreateHistoryUseCase } from '@/domain/gym/application/use-cases/create-history';
import { FetchHistoryByIdUseCase } from '@/domain/gym/application/use-cases/fetch-history-by-id';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { HistoryPresenter } from '../presenters/history-presenter';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { NormalUserRoleGuard } from '@/infra/auth/normal-user-role.guard';

const createNormalUserHistoryBodySchema = z.object({
  elapsedTime: z.number(),
  completedAt: z.coerce.date(),
  workoutId: z.string().uuid(),
  workoutFavorite: z.boolean(),
  workoutTitle: z.string(),
});

const createNormalUserHistoryBodyValidationPipe = new ZodValidationPipe(
  createNormalUserHistoryBodySchema,
);

type CreateNormalUserHistoryBodySchema = z.infer<
  typeof createNormalUserHistoryBodySchema
>;

@Controller('/history')
export class HistoryController {
  constructor(
    private readonly createHistoryUseCase: CreateHistoryUseCase,
    private readonly fetchHistoryByIdUseCase: FetchHistoryByIdUseCase,
  ) {}

  @Get('/:historyId')
  async fetchWorkoutById(@Param('historyId') historyId: string) {
    const result = await this.fetchHistoryByIdUseCase.execute({
      historyId,
    });

    const { history } = result.value;

    return { history: HistoryPresenter.toHTTP(history) };
  }

  @UseGuards(NormalUserRoleGuard)
  @Post('/normal-user')
  async createNormalUserHistory(
    @CurrentUser() user: UserPayload,
    @Body(createNormalUserHistoryBodyValidationPipe)
    body: CreateNormalUserHistoryBodySchema,
  ) {
    const {
      elapsedTime,
      completedAt,
      workoutId,
      workoutFavorite,
      workoutTitle,
    } = body;

    const userId = user.sub;

    const result = await this.createHistoryUseCase.execute({
      normalUserId: userId,
      workoutId,
      completedAt,
      elapsedTime,
      workoutFavorite,
      workoutTitle,
    });

    const { history } = result.value;

    return { history: HistoryPresenter.toHTTP(history) };
  }
}
