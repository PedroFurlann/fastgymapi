import { faker } from '@faker-js/faker';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import {
  Athlete,
  AthleteProps,
} from 'src/domain/gym/enterprise/entities/athlete';

export function makeAthlete(
  override: Partial<AthleteProps> = {},
  id?: UniqueEntityID,
) {
  const athlete = Athlete.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      coachId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return athlete;
}
