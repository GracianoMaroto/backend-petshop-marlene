import { Test, TestingModule } from '@nestjs/testing';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';

const mockPetsService = {
  create: jest.fn().mockResolvedValue({ id: '1', name: 'Bingo', breed: 'Vira-lata', customerId: 'c1' }),
  findAll: jest.fn().mockResolvedValue([{ id: '1', name: 'Bingo', breed: 'Vira-lata', customerId: 'c1' }]),
  findOne: jest.fn().mockResolvedValue({ id: '1', name: 'Bingo', breed: 'Vira-lata', customerId: 'c1' }),
  update: jest.fn().mockResolvedValue({ id: '1', name: 'Bingo Updated', breed: 'Vira-lata', customerId: 'c1' }),
  remove: jest.fn().mockResolvedValue({ deleted: true }),
};

describe('PetsController', () => {
  let controller: PetsController;
  let service: typeof mockPetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PetsController],
      providers: [
        {
          provide: PetsService,
          useValue: mockPetsService,
        },
      ],
    }).compile();

    controller = module.get<PetsController>(PetsController);
    service = module.get(PetsService) as typeof mockPetsService;
  });

  it('should create a pet', async () => {
    const dto = { name: 'Bingo', breed: 'Vira-lata', customerId: 'c1' };
    await expect(controller.create(dto)).resolves.toEqual({
      id: '1',
      name: 'Bingo',
      breed: 'Vira-lata',
      customerId: 'c1',
    });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return pets filtered by customerId and search', async () => {
    await expect(controller.findAll('c1', 'Bingo')).resolves.toEqual([
      { id: '1', name: 'Bingo', breed: 'Vira-lata', customerId: 'c1' },
    ]);
    expect(service.findAll).toHaveBeenCalledWith({ customerId: 'c1', search: 'Bingo' });
  });

  it('should return a pet by id', async () => {
    await expect(controller.findOne('1')).resolves.toEqual({
      id: '1',
      name: 'Bingo',
      breed: 'Vira-lata',
      customerId: 'c1',
    });
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should update a pet', async () => {
    const dto = { name: 'Bingo Updated' };
    await expect(controller.update('1', dto)).resolves.toEqual({
      id: '1',
      name: 'Bingo Updated',
      breed: 'Vira-lata',
      customerId: 'c1',
    });
    expect(service.update).toHaveBeenCalledWith('1', dto);
  });

  it('should delete a pet', async () => {
    await expect(controller.remove('1')).resolves.toEqual({ deleted: true });
    expect(service.remove).toHaveBeenCalledWith('1');
  });
});
