import { FakeUploader } from '../../../../../test/storage/fake-uploader';
import { InMemoryNormalUserRepository } from '../../../../../test/repositories/in-memory-normal-user-repository';
import { UploadNormalUserProfilePhotoUseCase } from './upload-normal-user-profile-photo';
import { makeNormalUser } from '../../../../../test/factories/make-normal-user';
import { InvalidFileTypeError } from './errors/invalid-file-type-error';

let inMemoryNormalUserRepository: InMemoryNormalUserRepository;
let fakeUploader: FakeUploader;
let sut: UploadNormalUserProfilePhotoUseCase;

describe('Upload and create normal user profile photo', () => {
  beforeEach(() => {
    inMemoryNormalUserRepository = new InMemoryNormalUserRepository();
    fakeUploader = new FakeUploader();
    sut = new UploadNormalUserProfilePhotoUseCase(
      inMemoryNormalUserRepository,
      fakeUploader,
    );
  });

  it('should be able to upload and create an normal user', async () => {
    const normaluser = makeNormalUser();

    await inMemoryNormalUserRepository.create(normaluser);

    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
      entityId: normaluser.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryNormalUserRepository.items[0].avatarUrl).toEqual(
      expect.any(String),
    );
    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    );
  });

  it('should not be able to upload an normal user profile photo with invalid file type', async () => {
    const normaluser = makeNormalUser();

    await inMemoryNormalUserRepository.create(normaluser);

    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
      entityId: normaluser.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidFileTypeError);
  });
});
