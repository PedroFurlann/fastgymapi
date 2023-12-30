import { CoachRepository } from 'src/domain/gym/application/repositories/coach-repository';
import { Coach } from 'src/domain/gym/enterprise/entities/coach';

export class InMemoryCoachRepository implements CoachRepository {
  public items: Coach[] = [];

  async create(coach: Coach): Promise<void> {
    this.items.push(coach);
  }

  async findByEmail(email: string): Promise<Coach> {
    const coach = this.items.find((item) => item.email === email);

    if (!coach) {
      return null;
    }

    return coach;
  }

  async findById(coachId: string): Promise<Coach> {
    const coach = this.items.find((item) => item.id.toString() === coachId);

    if (!coach) {
      return null;
    }

    return coach;
  }

  async update(coach: Coach): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === coach.id);

    this.items[itemIndex] = coach;
  }
  async delete(coachId: string): Promise<void> {
    this.items.filter((item) => item.id.toString() !== coachId);
  }
}
