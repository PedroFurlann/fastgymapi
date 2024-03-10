import { FakeHasher } from '../../../../../test/cryptography/fake-hasher';
import { makeNormalUser } from '../../../../../test/factories/make-normal-user';
import { InMemoryNormalUserRepository } from '../../../../../test/repositories/in-memory-normal-user-repository';
import { EditNormalUserUseCase } from './edit-normal-user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryNormalUserRepository: InMemoryNormalUserRepository;
let fakeHasher: FakeHasher;
let sut: EditNormalUserUseCase;

describe('Edit Normal User', () => {
  beforeEach(() => {
    inMemoryNormalUserRepository = new InMemoryNormalUserRepository();
    fakeHasher = new FakeHasher();
    sut = new EditNormalUserUseCase(inMemoryNormalUserRepository, fakeHasher);
  });

  it('should be able to edit a normal user', async () => {
    const normalUser = makeNormalUser(
      {
        name: 'John',
        email: 'john@example.com',
      },
      new UniqueEntityID('normaluser-1'),
    );

    await inMemoryNormalUserRepository.create(normalUser);

    await sut.execute({
      normalUserId: normalUser.id.toString(),
      name: 'Pedro',
    });

    expect(inMemoryNormalUserRepository.items[0]).toMatchObject({
      name: 'Pedro',
    });
  });
});
