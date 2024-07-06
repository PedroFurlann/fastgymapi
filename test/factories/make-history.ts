import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  HistoryProps,
  History,
} from '@/domain/gym/enterprise/entities/history';

export function makeHistory(
  override: Partial<HistoryProps> = {},
  id?: UniqueEntityID,
) {
  const history = History.create(
    {
      elapsedTime: 3600,
      completedAt: new Date(),
      workoutId: new UniqueEntityID(),
      coachId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return history;
}
