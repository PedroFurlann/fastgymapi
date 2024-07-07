import { makeWorkout } from '../../../../../test/factories/make-workout';
import { InMemoryWorkoutRepository } from '../../../../../test/repositories/in-memory-workout-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { EditNormalUserWorkoutUseCase } from './edit-normal-user-workout';
import { InMemoryHistoryRepository } from '../../../../../test/repositories/in-memory-history-repository';
import { makeHistory } from '../../../../../test/factories/make-history';

let inMemoryWorkoutRepository: InMemoryWorkoutRepository;
let inMemoryHistoryRepository: InMemoryHistoryRepository;
let sut: EditNormalUserWorkoutUseCase;

describe('Edit Workout', () => {
  beforeEach(() => {
    inMemoryWorkoutRepository = new InMemoryWorkoutRepository();
    inMemoryHistoryRepository = new InMemoryHistoryRepository();
    sut = new EditNormalUserWorkoutUseCase(
      inMemoryWorkoutRepository,
      inMemoryHistoryRepository,
    );
  });

  it('should be able to edit a workout', async () => {
    const workout = makeWorkout(
      {
        normalUserId: new UniqueEntityID('normal-user-1'),
      },
      new UniqueEntityID('workout-1'),
    );

    const history1 = makeHistory({
      workoutId: workout.id,
    });

    const history2 = makeHistory({
      workoutId: workout.id,
    });

    await inMemoryWorkoutRepository.create(workout);
    await inMemoryHistoryRepository.create(history1);
    await inMemoryHistoryRepository.create(history2);

    await sut.execute({
      normalUserId: 'normal-user-1',
      title: 'workout-1',
      workoutId: workout.id.toString(),
    });

    expect(inMemoryWorkoutRepository.items[0]).toMatchObject({
      title: 'workout-1',
    });
    expect(inMemoryHistoryRepository.items[0]).toMatchObject({
      workoutTitle: 'workout-1',
    });
    expect(inMemoryHistoryRepository.items[1]).toMatchObject({
      workoutTitle: 'workout-1',
    });
  });

  it('should not be able to edit a workout from another normal user', async () => {
    const workout = makeWorkout(
      {
        normalUserId: new UniqueEntityID('normal-user-1'),
      },
      new UniqueEntityID('workout-1'),
    );

    await inMemoryWorkoutRepository.create(workout);

    const result = await sut.execute({
      normalUserId: 'normal-user-2',
      workoutId: workout.id.toString(),
      title: 'title-2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
