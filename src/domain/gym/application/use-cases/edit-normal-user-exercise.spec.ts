import { makeExercise } from '../../../../../test/factories/make-exercise';
import { InMemoryExerciseRepository } from '../../../../../test/repositories/in-memory-exercise-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { EditNormalUserExerciseUseCase } from './edit-normal-user-exercise';

let inMemoryExerciseRepository: InMemoryExerciseRepository;
let sut: EditNormalUserExerciseUseCase;

describe('Edit Exercise', () => {
  beforeEach(() => {
    inMemoryExerciseRepository = new InMemoryExerciseRepository();
    sut = new EditNormalUserExerciseUseCase(inMemoryExerciseRepository);
  });

  it('should be able to edit a exercise', async () => {
    const exercise = makeExercise(
      {
        normalUserId: new UniqueEntityID('normal-user-1'),
      },
      new UniqueEntityID('exercise-1'),
    );

    await inMemoryExerciseRepository.create(exercise);

    await sut.execute({
      normalUserId: 'normal-user-1',
      title: 'exercise-1',
      description: 'test-1',
      category: 'BICEPS',
      exerciseId: exercise.id.toString(),
      workoutId: 'workout-1',
    });

    expect(inMemoryExerciseRepository.items[0]).toMatchObject({
      title: 'exercise-1',
      description: 'test-1',
    });
  });

  it('should not be able to edit a exercise from another normal user', async () => {
    const exercise = makeExercise(
      {
        normalUserId: new UniqueEntityID('normal-user-1'),
      },
      new UniqueEntityID('exercise-1'),
    );

    await inMemoryExerciseRepository.create(exercise);

    const result = await sut.execute({
      normalUserId: 'normal-user-2',
      exerciseId: exercise.id.toString(),
      title: 'title-2',
      category: 'BICEPS',
      description: 'test-2',
      workoutId: 'workout-2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
