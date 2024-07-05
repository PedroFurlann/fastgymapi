import { HistoryRepository } from 'src/domain/gym/application/repositories/history-repository';
import { History } from 'src/domain/gym/enterprise/entities/history';

export class InMemoryHistoryRepository implements HistoryRepository {
  public items: History[] = [];

  async create(history: History): Promise<void> {
    this.items.push(history);
  }

  async findById(id: string): Promise<History> {
    const history = this.items.find((item) => item.id.toString() === id);

    if (!history) {
      return null;
    }

    return history;
  }

  async deleteManyByNormalUserId(normalUserId: string): Promise<void> {
    const newHistory = this.items.filter(
      (history) => history.normalUserId.toString() !== normalUserId,
    );

    this.items = newHistory;
  }

  async deleteManyByCoachId(coachId: string): Promise<void> {
    const newHistory = this.items.filter(
      (history) => history.coachId.toString() !== coachId,
    );

    this.items = newHistory;
  }

  async deleteManyByAthleteId(athleteId: string): Promise<void> {
    const newHistory = this.items.filter(
      (history) => history.athleteId.toString() !== athleteId,
    );

    this.items = newHistory;
  }

  async findManyByCoachId(coachId: string): Promise<History[]> {
    const historys = this.items.filter(
      (item) => item.coachId.toString() === coachId,
    );

    if (!historys) {
      return [];
    }

    return historys;
  }

  async findManyByAthleteId(athleteId: string): Promise<History[]> {
    const historys = this.items.filter(
      (item) => item.athleteId.toString() === athleteId,
    );

    if (!historys) {
      return [];
    }

    return historys;
  }

  async findManyByNormalUserId(normalUserId: string): Promise<History[]> {
    const historys = this.items.filter(
      (item) => item.normalUserId.toString() === normalUserId,
    );

    if (!historys) {
      return [];
    }

    return historys;
  }

  async findManyByWorkoutId(workoutId: string): Promise<History[]> {
    const historys = this.items.filter(
      (item) => item.workoutId.toString() === workoutId,
    );

    if (!historys) {
      return [];
    }

    return historys;
  }
}
