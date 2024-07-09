import { EditManyExercisesUseCase } from './edit-many-exercises';
import { InMemoryExerciseRepository } from '../../../../../test/repositories/in-memory-exercise-repository';
import { makeExercise } from '../../../../../test/factories/make-exercise';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryExerciseRepository: InMemoryExerciseRepository;
let sut: EditManyExercisesUseCase;

describe('Edit many exercises', () => {
  beforeEach(() => {
    inMemoryExerciseRepository = new InMemoryExerciseRepository();
    sut = new EditManyExercisesUseCase(inMemoryExerciseRepository);
  });

  it('should be able to edit exercises', async () => {
    const exercise1 = makeExercise({
      workoutId: new UniqueEntityID('workout-1'),
      series: 4,
      repetitions: [10, 10, 10, 10],
    });
    const exercise2 = makeExercise({
      workoutId: new UniqueEntityID('workout-1'),
      series: 4,
      repetitions: [10, 10, 10, 10],
    });

    await inMemoryExerciseRepository.create(exercise1);
    await inMemoryExerciseRepository.create(exercise2);

    const result = await sut.execute({
      exercises: [
        {
          id: exercise1.id.toString(),
          title: exercise1.title,
          description: exercise1.description,
          category: exercise1.category,
          athleteId: 'athlete-1',
          workoutId: null,
        },
        {
          id: exercise2.id.toString(),
          title: exercise2.title,
          description: exercise2.description,
          category: exercise2.category,
          normalUserId: 'normal-user-1',
          workoutId: null,
          series: 5,
          repetitions: [12, 12, 10, 10, 8],
          weights: [10, 12, 14, 16, 20],
        },
      ],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryExerciseRepository.items).toHaveLength(2);
    expect(inMemoryExerciseRepository.items[0].workoutId === null);
    expect(inMemoryExerciseRepository.items[1].workoutId === null);
    expect(inMemoryExerciseRepository.items[1].series === 5);
  });
});
