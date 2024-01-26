import { makeCoach } from '../../../../../test/factories/make-coach';
import { CreateExerciseUseCase } from './create-exercise';
import { InMemoryExerciseRepository } from '../../../../../test/repositories/in-memory-exercise-repository';

let inMemoryExerciseRepository: InMemoryExerciseRepository;
let sut: CreateExerciseUseCase;

describe('Create Exercise', () => {
  beforeEach(() => {
    inMemoryExerciseRepository = new InMemoryExerciseRepository();
    sut = new CreateExerciseUseCase(inMemoryExerciseRepository);
  });

  it('should be able to create a new exercise', async () => {
    const coach = makeCoach();

    const result = await sut.execute({
      coachId: coach.id.toString(),
      title: 'Test exercise',
      description: 'Test description',
      category: 'BICEPS',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      exercise: inMemoryExerciseRepository.items[0],
    });
  });
});
