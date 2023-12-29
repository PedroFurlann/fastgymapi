import { Entity } from '../../../../core/entities/entity';
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';

export interface AthleteProps {
  name: string;
  email: string;
  password: string;
  coachId: UniqueEntityID;
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

  set coachId(coachId: UniqueEntityID) {
    this.props.coachId = coachId;
    this.touch();
  }

  set password(newPassword: string) {
    this.props.password = newPassword;
    this.touch();
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: AthleteProps, id?: UniqueEntityID) {
    const coach = new Athlete(props, id);

    return coach;
  }
}
