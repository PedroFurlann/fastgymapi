import { InMemoryAthleteRepository } from '../../../../../test/repositories/in-memory-athlete-repository';
import { FetchCoachAthletesUseCase } from './feth-coach-athletes';
import { makeAthlete } from '../../../../../test/factories/make-athlete';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryAthleteRepository: InMemoryAthleteRepository;
let sut: FetchCoachAthletesUseCase;

describe('Fetch coach athletes', () => {
  beforeEach(() => {
    inMemoryAthleteRepository = new InMemoryAthleteRepository();
    sut = new FetchCoachAthletesUseCase(inMemoryAthleteRepository);
  });

  it('Fetch all coach athletes by coachId', async () => {
    await inMemoryAthleteRepository.create(
      makeAthlete({
        coachId: new UniqueEntityID('coach-1'),
      }),
    );

    await inMemoryAthleteRepository.create(
      makeAthlete({
        coachId: new UniqueEntityID('coach-1'),
      }),
    );

    const result = await sut.execute({
      coachId: 'coach-1',
    });

    console.log(result.value.athletes[0]);

    expect(result.value.athletes).toHaveLength(2);
    expect(result.value.athletes).toEqual([
      expect.objectContaining({ coachId: new UniqueEntityID('coach-1') }),
      expect.objectContaining({ coachId: new UniqueEntityID('coach-1') }),
    ]);
  });
});
