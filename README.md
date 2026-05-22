# Backend PetShop DM

API local em NestJS + Prisma + PostgreSQL para o MVP do sistema de gestão de atendimentos da Dona Marlene.

## Rodando localmente

```bash
cp .env.example .env
docker compose up -d
npm run prisma:migrate -- --name init
npm run start:dev
```

A API sobe em `http://localhost:3000`.

## Recursos do MVP

- `GET /` status da API
- `CRUD /customers` clientes
- `CRUD /pets` animais vinculados a clientes
- `CRUD /appointments` atendimentos vinculados a cliente e animal

Serviços aceitos em atendimentos:

- `BANHO`
- `TOSA`
- `BANHO_E_TOSA`

Status aceitos:

- `SCHEDULED`
- `COMPLETED`
- `CANCELED`
