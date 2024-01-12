import { InMemoryAthleteRepository } from '../../../../../test/repositories/in-memory-athlete-repository';
import { makeAthlete } from '../../../../../test/factories/make-athlete';
import { FetchAthleteByIdUseCase } from './fetch-athlete-by-id';

let inMemoryAthleteRepository: InMemoryAthleteRepository;
let sut: FetchAthleteByIdUseCase;

describe('Fetch athlete', () => {
  beforeEach(() => {
    inMemoryAthleteRepository = new InMemoryAthleteRepository();
    sut = new FetchAthleteByIdUseCase(inMemoryAthleteRepository);
  });

  it('Fetch athlete by id', async () => {
    const athlete = makeAthlete();

    await inMemoryAthleteRepository.create(athlete);

    const result = await sut.execute({
      athleteId: athlete.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value.athlete).toEqual(
      expect.objectContaining({
        name: inMemoryAthleteRepository.items[0].name,
      }),
    );
  });
});
