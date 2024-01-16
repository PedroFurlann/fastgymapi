import { makeExercise } from '../../../../../test/factories/make-exercise';
import { InMemoryExerciseRepository } from '../../../../../test/repositories/in-memory-exercise-repository';
import { EditExerciseUseCase } from './edit-exercise';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let inMemoryExerciseRepository: InMemoryExerciseRepository;
let sut: EditExerciseUseCase;

describe('Edit Exercise', () => {
  beforeEach(() => {
    inMemoryExerciseRepository = new InMemoryExerciseRepository();
    sut = new EditExerciseUseCase(inMemoryExerciseRepository);
  });

  it('should be able to edit a exercise', async () => {
    const exercise = makeExercise(
      {
        coachId: new UniqueEntityID('coach-1'),
      },
      new UniqueEntityID('exercise-1'),
    );

    await inMemoryExerciseRepository.create(exercise);

    await sut.execute({
      coachId: 'coach-1',
      title: 'exercise-1',
      description: 'test-1',
      exerciseId: exercise.id.toString(),
    });

    expect(inMemoryExerciseRepository.items[0]).toMatchObject({
      title: 'exercise-1',
      description: 'test-1',
    });
  });

  it('should not be able to edit a exercise from another coach', async () => {
    const exercise = makeExercise(
      {
        coachId: new UniqueEntityID('coach-1'),
      },
      new UniqueEntityID('exercise-1'),
    );

    await inMemoryExerciseRepository.create(exercise);

    const result = await sut.execute({
      coachId: 'coach-2',
      exerciseId: exercise.id.toString(),
      title: 'title-2',
      description: 'test-2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
