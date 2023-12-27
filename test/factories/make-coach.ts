import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Coach, CoachProps } from 'src/domain/gym/enterprise/entities/coach';
import { faker } from '@faker-js/faker';

export function makeCoach(
  override: Partial<CoachProps> = {},
  id?: UniqueEntityID,
) {
  const coach = Coach.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  );

  return coach;
}
