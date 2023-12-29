import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  AthleteProps,
  Athlete,
} from '@/domain/gym/enterprise/entities/athlete';
import { faker } from '@faker-js/faker';

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
