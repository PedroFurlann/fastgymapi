import { InMemoryCoachRepository } from '../../../../../test/repositories/in-memory-coach-repository';
import { makeCoach } from '../../../../../test/factories/make-coach';
import { FetchCoachByIdUseCase } from './fetch-coach-by-id';

let inMemoryCoachRepository: InMemoryCoachRepository;
let sut: FetchCoachByIdUseCase;

describe('Fetch coach', () => {
  beforeEach(() => {
    inMemoryCoachRepository = new InMemoryCoachRepository();
    sut = new FetchCoachByIdUseCase(inMemoryCoachRepository);
  });

  it('Fetch coach by id', async () => {
    const coach = makeCoach();

    await inMemoryCoachRepository.create(coach);

    const result = await sut.execute({
      coachId: coach.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value.coach).toEqual(
      expect.objectContaining({ name: inMemoryCoachRepository.items[0].name }),
    );
  });
});
