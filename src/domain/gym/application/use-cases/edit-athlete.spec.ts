import { FakeHasher } from '../../../../../test/cryptography/fake-hasher';
import { makeAthlete } from '../../../../../test/factories/make-athlete';
import { InMemoryAthleteRepository } from '../../../../../test/repositories/in-memory-athlete-repository';
import { EditAthleteUseCase } from './edit-athlete';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryAthleteRepository: InMemoryAthleteRepository;
let fakeHasher: FakeHasher;
let sut: EditAthleteUseCase;

describe('Edit Athlete', () => {
  beforeEach(() => {
    inMemoryAthleteRepository = new InMemoryAthleteRepository();
    fakeHasher = new FakeHasher();
    sut = new EditAthleteUseCase(inMemoryAthleteRepository, fakeHasher);
  });

  it('should be able to edit a athlete', async () => {
    const athlete = makeAthlete(
      {
        coachId: new UniqueEntityID('coach-1'),
      },
      new UniqueEntityID('athlete-1'),
    );

    await inMemoryAthleteRepository.create(athlete);

    await sut.execute({
      athleteId: athlete.id.toString(),
      name: 'John',
      password: '123456',
    });

    expect(inMemoryAthleteRepository.items[0]).toMatchObject({
      name: 'John',
      password: '123456-hashed',
    });
  });
});
