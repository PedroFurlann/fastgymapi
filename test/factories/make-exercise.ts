import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Exercise,
  ExerciseProps,
} from '@/domain/gym/enterprise/entities/exercise';
import { faker } from '@faker-js/faker';

export function makeExercise(
  override: Partial<ExerciseProps> = {},
  id?: UniqueEntityID,
) {
  const exercise = Exercise.create(
    {
      title: faker.lorem.text(),
      description: faker.lorem.text(),
      coachId: new UniqueEntityID(),
      category: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return exercise;
}
