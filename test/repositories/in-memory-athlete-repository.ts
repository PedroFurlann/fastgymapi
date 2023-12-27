import { AthleteRepository } from 'src/domain/gym/application/repositories/athlete-repository';
import { Athlete } from 'src/domain/gym/enterprise/entities/athlete';

export class InMemoryAthleteRepository implements AthleteRepository {
  public items: Athlete[] = [];

  async create(athlete: Athlete): Promise<void> {
    this.items.push(athlete);
  }

  async findById(id: string): Promise<Athlete> {
    const athlete = this.items.find((item) => item.id.toString() === id);

    if (!athlete) {
      return null;
    }

    return athlete;
  }

  async update(athlete: Athlete): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === athlete.id);

    this.items[itemIndex] = athlete;
  }

  async delete(athleteId: string): Promise<void> {
    this.items.filter((item) => item.id.toString() !== athleteId);
  }

  async findManyByCoachId(coachId: string): Promise<Athlete[]> {
    const athletes = this.items.filter(
      (item) => item.coachId.toString() === coachId,
    );

    if (!athletes) {
      return [];
    }

    return athletes;
  }
}
