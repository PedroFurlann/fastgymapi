import { makeCoach } from '../../../../../test/factories/make-coach';
import { CreateHistoryUseCase } from './create-history';
import { InMemoryHistoryRepository } from '../../../../../test/repositories/in-memory-history-repository';
import { makeWorkout } from 'test/factories/make-workout';

let inMemoryHistoryRepository: InMemoryHistoryRepository;
let sut: CreateHistoryUseCase;

describe('Create History', () => {
  beforeEach(() => {
    inMemoryHistoryRepository = new InMemoryHistoryRepository();
    sut = new CreateHistoryUseCase(inMemoryHistoryRepository);
  });

  it('should be able to create a new history', async () => {
    const coach = makeCoach();
    const workout = makeWorkout();

    const result = await sut.execute({
      elapsedTime: 3600,
      completedAt: new Date(),
      coachId: coach.id.toString(),
      workoutId: workout.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      history: inMemoryHistoryRepository.items[0],
    });
  });
});
