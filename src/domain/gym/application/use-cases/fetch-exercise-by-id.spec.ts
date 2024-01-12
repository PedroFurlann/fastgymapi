import { InMemoryExerciseRepository } from '../../../../../test/repositories/in-memory-exercise-repository';
import { makeExercise } from '../../../../../test/factories/make-exercise';
import { FetchExerciseByIdUseCase } from './fetch-exercise-by-id';

let inMemoryExerciseRepository: InMemoryExerciseRepository;
let sut: FetchExerciseByIdUseCase;

describe('Fetch exercise', () => {
  beforeEach(() => {
    inMemoryExerciseRepository = new InMemoryExerciseRepository();
    sut = new FetchExerciseByIdUseCase(inMemoryExerciseRepository);
  });

  it('Fetch exercise by id', async () => {
    const exercise = makeExercise();

    await inMemoryExerciseRepository.create(exercise);

    const result = await sut.execute({
      exerciseId: exercise.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value.exercise).toEqual(
      expect.objectContaining({
        title: inMemoryExerciseRepository.items[0].title,
      }),
    );
  });
});
