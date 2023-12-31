import { makeExercise } from '../../../../../test/factories/make-exercise';
import { InMemoryExerciseRepository } from '../../../../../test/repositories/in-memory-exercise-repository';
import { DeleteExerciseUseCase } from './delete-exercise';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let inMemoryExerciseRepository: InMemoryExerciseRepository;
let sut: DeleteExerciseUseCase;

describe('Delete Exercise', () => {
  beforeEach(() => {
    inMemoryExerciseRepository = new InMemoryExerciseRepository();
    sut = new DeleteExerciseUseCase(inMemoryExerciseRepository);
  });

  it('should be able to delete a exercise', async () => {
    const exercise = makeExercise({
      coachId: new UniqueEntityID('coach-1'),
    });

    await inMemoryExerciseRepository.create(exercise);

    await sut.execute({
      coachId: 'coach-1',
      exerciseId: exercise.id.toString(),
    });

    

    expect(inMemoryExerciseRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a exercise from another coach', async () => {
    const exercise = makeExercise({
      coachId: new UniqueEntityID('coach-1'),
    });

    await inMemoryExerciseRepository.create(exercise);

    const result = await sut.execute({
      coachId: 'coach-2',
      exerciseId: exercise.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
