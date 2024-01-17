import { FakeUploader } from '../../../../../test/storage/fake-uploader';
import { InMemoryAthleteRepository } from '../../../../../test/repositories/in-memory-athlete-repository';
import { UploadAthleteProfilePhotoUseCase } from './upload-athlete-profile-photo';
import { makeAthlete } from '../../../../../test/factories/make-athlete';
import { InvalidFileTypeError } from './errors/invalid-file-type-error';

let inMemoryAthleteRepository: InMemoryAthleteRepository;
let fakeUploader: FakeUploader;
let sut: UploadAthleteProfilePhotoUseCase;

describe('Upload and create athlete profile photo', () => {
  beforeEach(() => {
    inMemoryAthleteRepository = new InMemoryAthleteRepository();
    fakeUploader = new FakeUploader();
    sut = new UploadAthleteProfilePhotoUseCase(
      inMemoryAthleteRepository,
      fakeUploader,
    );
  });

  it('should be able to upload and create an athlete', async () => {
    const athlete = makeAthlete();

    await inMemoryAthleteRepository.create(athlete);

    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
      entityId: athlete.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAthleteRepository.items[0].avatarUrl).toEqual(
      expect.any(String),
    );
    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    );
  });

  it('should not be able to upload an athlete profile photo with invalid file type', async () => {
    const athlete = makeAthlete();

    await inMemoryAthleteRepository.create(athlete);

    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
      entityId: athlete.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidFileTypeError);
  });
});
