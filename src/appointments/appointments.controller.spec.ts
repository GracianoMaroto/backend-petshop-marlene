import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

const mockAppointmentsService = {
  create: jest.fn().mockResolvedValue({
    id: '1',
    customerId: 'c1',
    petId: 'p1',
    serviceType: 'BANHO',
    status: 'SCHEDULED',
    price: 100.0,
    serviceDate: '2026-06-01T10:00:00.000Z',
  }),
  findAll: jest.fn().mockResolvedValue([
    {
      id: '1',
      customerId: 'c1',
      petId: 'p1',
      serviceType: 'BANHO',
      status: 'SCHEDULED',
      price: 100.0,
      serviceDate: '2026-06-01T10:00:00.000Z',
    },
  ]),
  findOne: jest.fn().mockResolvedValue({
    id: '1',
    customerId: 'c1',
    petId: 'p1',
    serviceType: 'BANHO',
    status: 'SCHEDULED',
    price: 100.0,
    serviceDate: '2026-06-01T10:00:00.000Z',
  }),
  update: jest.fn().mockResolvedValue({
    id: '1',
    customerId: 'c1',
    petId: 'p1',
    serviceType: 'TOSA',
    status: 'SCHEDULED',
    price: 120.0,
    serviceDate: '2026-06-01T10:00:00.000Z',
  }),
  remove: jest.fn().mockResolvedValue({ deleted: true }),
};

describe('AppointmentsController', () => {
  let controller: AppointmentsController;
  let service: typeof mockAppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        {
          provide: AppointmentsService,
          useValue: mockAppointmentsService,
        },
      ],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
    service = module.get(AppointmentsService) as typeof mockAppointmentsService;
  });

  it('should create an appointment', async () => {
    const dto = {
      customerId: 'c1',
      petId: 'p1',
      serviceType: 'BANHO',
      price: 100.0,
      serviceDate: '2026-06-01T10:00:00.000Z',
    };
    await expect(controller.create(dto)).resolves.toEqual({
      id: '1',
      customerId: 'c1',
      petId: 'p1',
      serviceType: 'BANHO',
      status: 'SCHEDULED',
      price: 100.0,
      serviceDate: '2026-06-01T10:00:00.000Z',
    });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return appointments based on filters', async () => {
    await expect(controller.findAll('c1', 'p1', '2026-06-01', '2026-06-30')).resolves.toEqual([
      {
        id: '1',
        customerId: 'c1',
        petId: 'p1',
        serviceType: 'BANHO',
        status: 'SCHEDULED',
        price: 100.0,
        serviceDate: '2026-06-01T10:00:00.000Z',
      },
    ]);
    expect(service.findAll).toHaveBeenCalledWith({
      customerId: 'c1',
      petId: 'p1',
      from: '2026-06-01',
      to: '2026-06-30',
    });
  });

  it('should return an appointment by id', async () => {
    await expect(controller.findOne('1')).resolves.toEqual({
      id: '1',
      customerId: 'c1',
      petId: 'p1',
      serviceType: 'BANHO',
      status: 'SCHEDULED',
      price: 100.0,
      serviceDate: '2026-06-01T10:00:00.000Z',
    });
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should update an appointment', async () => {
    const dto = { serviceType: 'TOSA', price: 120.0 };
    await expect(controller.update('1', dto)).resolves.toEqual({
      id: '1',
      customerId: 'c1',
      petId: 'p1',
      serviceType: 'TOSA',
      status: 'SCHEDULED',
      price: 120.0,
      serviceDate: '2026-06-01T10:00:00.000Z',
    });
    expect(service.update).toHaveBeenCalledWith('1', dto);
  });

  it('should delete an appointment', async () => {
    await expect(controller.remove('1')).resolves.toEqual({ deleted: true });
    expect(service.remove).toHaveBeenCalledWith('1');
  });
});
