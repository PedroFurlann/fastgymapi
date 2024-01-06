import { Optional } from '@/core/types/optional';
import { Entity } from '../../../../core/entities/entity';
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';

export interface AthleteProps {
  name: string;
  email: string;
  password: string;
  coachId: UniqueEntityID;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Athlete extends Entity<AthleteProps> {
  get name() {
    return this.props.name;
  }

  set name(newName: string) {
    this.props.name = newName;
    this.touch();
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get coachId() {
    return this.props.coachId;
  }

  set password(newPassword: string) {
    this.props.password = newPassword;
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
    props: Optional<AthleteProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const athlete = new Athlete(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return athlete;
  }
}
