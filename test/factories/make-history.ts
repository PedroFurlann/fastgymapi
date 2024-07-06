import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  HistoryProps,
  History,
} from '@/domain/gym/enterprise/entities/history';
import { faker } from '@faker-js/faker';

export function makeHistory(
  override: Partial<HistoryProps> = {},
  id?: UniqueEntityID,
) {
  const history = History.create(
    {
      elapsedTime: 3600,
      workoutFavorite: false,
      workoutTitle: faker.lorem.text(),
      completedAt: new Date(),
      workoutId: new UniqueEntityID(),
      coachId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return history;
}
