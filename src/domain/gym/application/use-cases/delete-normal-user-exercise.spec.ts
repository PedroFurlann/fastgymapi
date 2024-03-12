import { makeExercise } from '../../../../../test/factories/make-exercise';
import { InMemoryExerciseRepository } from '../../../../../test/repositories/in-memory-exercise-repository';
import { DeleteNormalUserExerciseUseCase } from './delete-normal-user-exercise';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let inMemoryExerciseRepository: InMemoryExerciseRepository;
let sut: DeleteNormalUserExerciseUseCase;

describe('Delete Exercise', () => {
  beforeEach(() => {
    inMemoryExerciseRepository = new InMemoryExerciseRepository();
    sut = new DeleteNormalUserExerciseUseCase(inMemoryExerciseRepository);
  });

  it('should be able to delete a exercise', async () => {
    const exercise = makeExercise({
      normalUserId: new UniqueEntityID('normal-user-1'),
    });

    await inMemoryExerciseRepository.create(exercise);

    await sut.execute({
      normalUserId: 'normal-user-1',
      exerciseId: exercise.id.toString(),
    });

    expect(inMemoryExerciseRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a exercise from another normaluser', async () => {
    const exercise = makeExercise({
      normalUserId: new UniqueEntityID('normal-user-1'),
    });

    await inMemoryExerciseRepository.create(exercise);

    const result = await sut.execute({
      normalUserId: 'normal-user-2',
      exerciseId: exercise.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
