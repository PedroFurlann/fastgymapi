import { Optional } from '@/core/types/optional';
import { Entity } from '../../../../core/entities/entity';
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';

export interface HistoryProps {
  elapsedTime: number;
  completedAt: Date;
  workoutId: UniqueEntityID;
  coachId?: UniqueEntityID | null;
  normalUserId?: UniqueEntityID | null;
  athleteId?: UniqueEntityID | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class History extends Entity<HistoryProps> {
  get elapsedTime() {
    return this.props.elapsedTime;
  }

  set elapsedTime(newElapsedTime: number) {
    this.props.elapsedTime = newElapsedTime;
    this.touch();
  }

  get completedAt() {
    return this.props.completedAt;
  }

  set completedAt(newCompletedAt: Date) {
    this.props.completedAt = newCompletedAt;
    this.touch();
  }

  get workoutId() {
    return this.props.workoutId;
  }

  set workoutId(workoutId: UniqueEntityID) {
    this.props.workoutId = workoutId;
    this.touch();
  }

  get coachId() {
    return this.props.coachId;
  }

  set coachId(coachId: UniqueEntityID) {
    this.props.coachId = coachId;
    this.touch();
  }

  get athleteId() {
    return this.props.athleteId;
  }

  set athleteId(athleteId: UniqueEntityID) {
    this.props.athleteId = athleteId;
    this.touch();
  }

  get normalUserId() {
    return this.props.normalUserId;
  }

  set normalUserId(normalUserId: UniqueEntityID) {
    this.props.normalUserId = normalUserId;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<HistoryProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const history = new History(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return history;
  }
}
