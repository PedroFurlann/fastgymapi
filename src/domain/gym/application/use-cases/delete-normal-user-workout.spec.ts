import { makeWorkout } from '../../../../../test/factories/make-workout';
import { InMemoryWorkoutRepository } from '../../../../../test/repositories/in-memory-workout-repository';
import { DeleteNormalUserWorkoutUseCase } from './delete-normal-user-workout';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let inMemoryWorkoutRepository: InMemoryWorkoutRepository;
let sut: DeleteNormalUserWorkoutUseCase;

describe('Delete Workout', () => {
  beforeEach(() => {
    inMemoryWorkoutRepository = new InMemoryWorkoutRepository();
    sut = new DeleteNormalUserWorkoutUseCase(inMemoryWorkoutRepository);
  });

  it('should be able to delete a workout', async () => {
    const workout = makeWorkout({
      normalUserId: new UniqueEntityID('normal-user-1'),
    });

    await inMemoryWorkoutRepository.create(workout);

    await sut.execute({
      normalUserId: 'normal-user-1',
      workoutId: workout.id.toString(),
    });

    expect(inMemoryWorkoutRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a workout from another normal user', async () => {
    const workout = makeWorkout({
      normalUserId: new UniqueEntityID('normal-user-1'),
    });

    await inMemoryWorkoutRepository.create(workout);

    const result = await sut.execute({
      normalUserId: 'normal-user-2',
      workoutId: workout.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
