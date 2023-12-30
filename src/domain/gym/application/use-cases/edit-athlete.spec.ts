import { makeAthlete } from '../../../../../test/factories/make-athlete';
import { InMemoryAthleteRepository } from '../../../../../test/repositories/in-memory-athlete-repository';
import { EditAthleteUseCase } from './edit-athlete';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let inMemoryAthleteRepository: InMemoryAthleteRepository;
let sut: EditAthleteUseCase;

describe('Edit Athlete', () => {
  beforeEach(() => {
    inMemoryAthleteRepository = new InMemoryAthleteRepository();
    sut = new EditAthleteUseCase(inMemoryAthleteRepository);
  });

  it('should be able to edit a athlete', async () => {
    const athlete = makeAthlete(
      {
        coachId: new UniqueEntityID('coach-1'),
      },
      new UniqueEntityID('athlete-1'),
    );

    await inMemoryAthleteRepository.create(athlete);

    const newAthlete = makeAthlete(
      {
        coachId: athlete.coachId,
        name: 'Pedro',
        email: 'email@example.com',
      },
      athlete.id,
    );

    await sut.execute({
      coachId: athlete.coachId.toString(),
      athlete: newAthlete,
    });

    expect(inMemoryAthleteRepository.items[0]).toMatchObject({
      name: 'Pedro',
      email: 'email@example.com',
    });
  });

  it('should not be able to edit a athlete from another coach', async () => {
    const athlete = makeAthlete(
      {
        coachId: new UniqueEntityID('coach-1'),
      },
      new UniqueEntityID('athlete-1'),
    );

    await inMemoryAthleteRepository.create(athlete);

    const newAthlete = makeAthlete(
      {
        coachId: new UniqueEntityID('coach-2'),
        name: 'Pedro',
        email: 'email@example.com',
      },
      athlete.id,
    );

    const result = await sut.execute({
      coachId: athlete.coachId.toString(),
      athlete: newAthlete,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
