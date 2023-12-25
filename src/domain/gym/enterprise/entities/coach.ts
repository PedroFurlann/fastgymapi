import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Exercise } from './exercise';
import { Athlete } from './athlete';

export interface CoachProps {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string | null;
  exercises?: Exercise[] | null;
  updatedAt?: Date | null;
  athletes?: Athlete[] | null;
}

export class Coach extends Entity<CoachProps> {
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

  set password(newPassword: string) {
    this.props.password = newPassword;
    this.touch();
  }

  get athletes() {
    return this.props.athletes;
  }

  set athletes(newAthletes: Athlete[]) {
    this.props.athletes = newAthletes;
    this.touch();
  }

  get avatarUrl() {
    return this.props.avatarUrl;
  }

  set avatarUrl(newAvatarUrl: string) {
    this.props.avatarUrl = newAvatarUrl;
    this.touch();
  }

  get exercises() {
    return this.props.exercises;
  }

  set exercises(newExercises: Exercise[]) {
    this.props.exercises = newExercises;
    this.touch();
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: CoachProps, id?: UniqueEntityID) {
    const coach = new Coach(props, id);

    return coach;
  }
}
