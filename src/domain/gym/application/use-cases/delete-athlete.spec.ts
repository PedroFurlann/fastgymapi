import { makeAthlete } from '../../../../../test/factories/make-athlete';
import { InMemoryAthleteRepository } from '../../../../../test/repositories/in-memory-athlete-repository';
import { DeleteAthleteUseCase } from './delete-athlete';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryAthleteRepository: InMemoryAthleteRepository;
let sut: DeleteAthleteUseCase;

describe('Delete Athlete', () => {
  beforeEach(() => {
    inMemoryAthleteRepository = new InMemoryAthleteRepository();
    sut = new DeleteAthleteUseCase(inMemoryAthleteRepository);
  });

  it('should be able to delete a athlete', async () => {
    const athlete = makeAthlete({
      coachId: new UniqueEntityID('coach-1'),
    });

    await inMemoryAthleteRepository.create(athlete);

    await sut.execute({
      athleteId: athlete.id.toString(),
    });

    expect(inMemoryAthleteRepository.items).toHaveLength(0);
  });
});
