import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Workout,
  WorkoutProps,
} from '@/domain/gym/enterprise/entities/workout';
import { faker } from '@faker-js/faker';

export function makeWorkout(
  override: Partial<WorkoutProps> = {},
  id?: UniqueEntityID,
) {
  const workout = Workout.create(
    {
      title: faker.lorem.text(),
      coachId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return workout;
}
