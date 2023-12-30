import { makeExercise } from '../../../../../test/factories/make-exercise';
import { InMemoryExerciseRepository } from '../../../../../test/repositories/in-memory-exercise-repository';
import { EditExerciseUseCase } from './edit-exercise';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Exercise } from '../../enterprise/entities/exercise';
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

    const newExercise = Exercise.create(
      {
        coachId: exercise.coachId,
        title: 'Test title exercise',
        description: 'Test description exercise',
      },
      exercise.id,
    );

    await sut.execute({
      coachId: exercise.coachId.toString(),
      exercise: newExercise,
    });

    expect(inMemoryExerciseRepository.items[0]).toMatchObject({
      title: 'Test title exercise',
      description: 'Test description exercise',
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

    const newExercise = Exercise.create(
      {
        coachId: new UniqueEntityID('coach-2'),
        title: 'Test title exercise',
        description: 'Test description exercise',
      },
      exercise.id,
    );

    const result = await sut.execute({
      coachId: exercise.coachId.toString(),
      exercise: newExercise,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
