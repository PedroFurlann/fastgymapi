import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

export interface CoachProps {
  name: string;
  email: string;
  password: string;
}

export class Coach extends Entity<CoachProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  static create(props: CoachProps, id?: UniqueEntityID) {
    const coach = new Coach(props, id);

    return coach;
  }
}
