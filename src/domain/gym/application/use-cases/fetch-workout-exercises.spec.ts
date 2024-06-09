import { InMemoryExerciseRepository } from '../../../../../test/repositories/in-memory-exercise-repository';
import { FetchWorkoutExercisesUseCase } from './fetch-workout-exercises';
import { makeExercise } from '../../../../../test/factories/make-exercise';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryExerciseRepository: InMemoryExerciseRepository;
let sut: FetchWorkoutExercisesUseCase;

describe('Fetch workout exercises', () => {
  beforeEach(() => {
    inMemoryExerciseRepository = new InMemoryExerciseRepository();
    sut = new FetchWorkoutExercisesUseCase(inMemoryExerciseRepository);
  });

  it('Fetch all workout exercises by workoutId', async () => {
    await inMemoryExerciseRepository.create(
      makeExercise({
        workoutId: new UniqueEntityID('workout-1'),
      }),
    );

    await inMemoryExerciseRepository.create(
      makeExercise({
        workoutId: new UniqueEntityID('workout-1'),
      }),
    );

    const result = await sut.execute({
      workoutId: 'workout-1',
    });

    expect(result.value.exercises).toHaveLength(2);
    expect(result.value.exercises).toEqual([
      expect.objectContaining({
        workoutId: new UniqueEntityID('workout-1'),
      }),
      expect.objectContaining({
        workoutId: new UniqueEntityID('workout-1'),
      }),
    ]);
  });
});
