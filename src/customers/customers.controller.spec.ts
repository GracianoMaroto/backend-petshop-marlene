import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

const mockCustomersService = {
  create: jest.fn().mockResolvedValue({ id: '1', name: 'Maria', phone: '11999999999' }),
  findAll: jest.fn().mockResolvedValue([{ id: '1', name: 'Maria', phone: '11999999999' }]),
  findOne: jest.fn().mockResolvedValue({ id: '1', name: 'Maria', phone: '11999999999' }),
  update: jest.fn().mockResolvedValue({ id: '1', name: 'Maria Updated', phone: '11999999999' }),
  remove: jest.fn().mockResolvedValue({ deleted: true }),
};

describe('CustomersController', () => {
  let controller: CustomersController;
  let service: typeof mockCustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: mockCustomersService,
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    service = module.get(CustomersService) as typeof mockCustomersService;
  });

  it('should create a customer', async () => {
    const dto = { name: 'Maria', phone: '11999999999' };
    await expect(controller.create(dto)).resolves.toEqual({
      id: '1',
      name: 'Maria',
      phone: '11999999999',
    });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return a list of customers', async () => {
    await expect(controller.findAll('Maria')).resolves.toEqual([
      { id: '1', name: 'Maria', phone: '11999999999' },
    ]);
    expect(service.findAll).toHaveBeenCalledWith('Maria');
  });

  it('should return a customer by id', async () => {
    await expect(controller.findOne('1')).resolves.toEqual({
      id: '1',
      name: 'Maria',
      phone: '11999999999',
    });
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should update a customer', async () => {
    const dto = { name: 'Maria Updated' };
    await expect(controller.update('1', dto)).resolves.toEqual({
      id: '1',
      name: 'Maria Updated',
      phone: '11999999999',
    });
    expect(service.update).toHaveBeenCalledWith('1', dto);
  });

  it('should delete a customer', async () => {
    await expect(controller.remove('1')).resolves.toEqual({ deleted: true });
    expect(service.remove).toHaveBeenCalledWith('1');
  });
});
