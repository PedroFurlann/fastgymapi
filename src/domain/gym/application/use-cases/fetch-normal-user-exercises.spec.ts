import { InMemoryExerciseRepository } from '../../../../../test/repositories/in-memory-exercise-repository';
import { FetchNormalUserExercisesUseCase } from './fetch-normal-user-exercises';
import { makeExercise } from '../../../../../test/factories/make-exercise';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryExerciseRepository: InMemoryExerciseRepository;
let sut: FetchNormalUserExercisesUseCase;

describe('Fetch normal user exercises', () => {
  beforeEach(() => {
    inMemoryExerciseRepository = new InMemoryExerciseRepository();
    sut = new FetchNormalUserExercisesUseCase(inMemoryExerciseRepository);
  });

  it('Fetch all normaluser exercises by normalUserId', async () => {
    await inMemoryExerciseRepository.create(
      makeExercise({
        normalUserId: new UniqueEntityID('normal-user-1'),
      }),
    );

    await inMemoryExerciseRepository.create(
      makeExercise({
        normalUserId: new UniqueEntityID('normal-user-1'),
      }),
    );

    const result = await sut.execute({
      normalUserId: 'normal-user-1',
    });

    expect(result.value.exercises).toHaveLength(2);
    expect(result.value.exercises).toEqual([
      expect.objectContaining({
        normalUserId: new UniqueEntityID('normal-user-1'),
      }),
      expect.objectContaining({
        normalUserId: new UniqueEntityID('normal-user-1'),
      }),
    ]);
  });
});
