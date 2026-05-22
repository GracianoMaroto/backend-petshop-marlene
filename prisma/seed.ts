import 'dotenv/config';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString =
  process.env.DATABASE_URL ??
  'postgresql://postgres:postgres@localhost:5432/petshop_dm?schema=public';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const customers = [
  { name: 'Ana Costa', phone: '11911112222' },
  { name: 'Bruno Lima', phone: '11922223333' },
  { name: 'Carla Mendes', phone: '11933334444' },
  { name: 'Diego Rocha', phone: '11944445555' },
  { name: 'Eva Santos', phone: '11955556666' },
];

const petsByCustomer = {
  'Ana Costa': [
    { name: 'Luna', breed: 'Siamês' },
    { name: 'Biscoito', breed: 'Maltês' },
  ],
  'Bruno Lima': [
    { name: 'Thor', breed: 'Pastor Alemão' },
    { name: 'Nala', breed: 'Labrador' },
  ],
  'Carla Mendes': [{ name: 'Pipoca', breed: 'Pug' }],
  'Diego Rocha': [{ name: 'Jujuba', breed: 'Shih Tzu' }],
  'Eva Santos': [{ name: 'Mochi', breed: 'Beagle' }],
};

const appointments = [
  {
    customerName: 'Ana Costa',
    petName: 'Luna',
    serviceType: 'BANHO',
    price: '75.00',
    serviceDate: '2026-06-03T09:30:00.000Z',
    notes: 'Primeiro banho do mês e escovação completa.',
  },
  {
    customerName: 'Bruno Lima',
    petName: 'Thor',
    serviceType: 'TOSA',
    price: '120.00',
    serviceDate: '2026-06-05T14:00:00.000Z',
    notes: 'Tosa higiênica com corte mais curto.',
  },
  {
    customerName: 'Eva Santos',
    petName: 'Mochi',
    serviceType: 'BANHO_E_TOSA',
    price: '155.00',
    serviceDate: '2026-06-08T11:15:00.000Z',
    notes: 'Agendamento com shampoo antialérgico.',
  },
];

async function main() {
  await prisma.appointment.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.customer.deleteMany();

  const customerIds = new Map<string, string>();

  for (const customer of customers) {
    const createdCustomer = await prisma.customer.create({ data: customer });
    customerIds.set(customer.name, createdCustomer.id);
  }

  for (const customer of customers) {
    const customerId = customerIds.get(customer.name);

    if (!customerId) {
      throw new Error(`Cliente não encontrado ao criar pets: ${customer.name}`);
    }

    for (const pet of petsByCustomer[customer.name] ?? []) {
      await prisma.pet.create({
        data: {
          ...pet,
          customerId,
        },
      });
    }
  }

  const petMap = new Map<string, string>();
  for (const customer of customers) {
    const customerId = customerIds.get(customer.name);

    if (!customerId) {
      throw new Error(`Cliente não encontrado para o mapeamento: ${customer.name}`);
    }

    const createdPets = await prisma.pet.findMany({
      where: { customerId },
      select: { id: true, name: true },
    });

    for (const pet of createdPets) {
      petMap.set(`${customer.name}:${pet.name}`, pet.id);
    }
  }

  for (const appointment of appointments) {
    const customerId = customerIds.get(appointment.customerName);

    if (!customerId) {
      throw new Error(`Cliente não encontrado para o agendamento: ${appointment.customerName}`);
    }

    const petId = petMap.get(`${appointment.customerName}:${appointment.petName}`);

    if (!petId) {
      throw new Error(`Pet não encontrado para o agendamento: ${appointment.customerName} -> ${appointment.petName}`);
    }

    await prisma.appointment.create({
      data: {
        customerId,
        petId,
        serviceType: appointment.serviceType,
        status: 'SCHEDULED',
        price: new Prisma.Decimal(appointment.price),
        serviceDate: new Date(appointment.serviceDate),
        notes: appointment.notes,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
