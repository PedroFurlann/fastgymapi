import { makeCoach } from '../../../../../test/factories/make-coach';
import { CreateWorkoutUseCase } from './create-workout';
import { InMemoryWorkoutRepository } from '../../../../../test/repositories/in-memory-workout-repository';

let inMemoryWorkoutRepository: InMemoryWorkoutRepository;
let sut: CreateWorkoutUseCase;

describe('Create Workout', () => {
  beforeEach(() => {
    inMemoryWorkoutRepository = new InMemoryWorkoutRepository();
    sut = new CreateWorkoutUseCase(inMemoryWorkoutRepository);
  });

  it('should be able to create a new workout', async () => {
    const coach = makeCoach();

    const result = await sut.execute({
      coachId: coach.id.toString(),
      title: 'Test workout',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      workout: inMemoryWorkoutRepository.items[0],
    });
  });
});
