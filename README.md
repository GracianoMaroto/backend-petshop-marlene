# Backend PetShop DM

API local em NestJS + Prisma + PostgreSQL para o MVP do sistema de gestão de atendimentos da Dona Marlene.

## Parar rodar localmente

```bash
cp .env.example .env
docker compose up -d
npm install prisma --save-dev // Caso nunca tenha usado prisma.
npm run prisma:migrate -- --name init
npx prisma generate
npm run prisma:seed // Para ter alguns dados mocados e fazer testes.
npm run start:dev
```

A API sobe em `http://localhost:3000`.

## Documentação Swagger

- A documentação interativa está disponível em `http://localhost:3000/api/docs`
- Ela inclui todos os endpoints de clientes, pets e agendamentos
- Permite testar os requests diretamente pelo navegador

## Uso de ORM
- Utilizei o Prisma ORM pois acredito que seu encaixe com o NestJS é muito bom.
- Facilita o desenvolvimento, e é muito intuitivo em uma futura manutenção.
- Apesar de ser limitado em Querys manuais, seu custo-benefício é ótimo.

## Respondendo às perguntas do desafio

• Por que você modelou as tabelas dessa forma?
    Pensei em uma forma que ficasse escalável, simples e direta. Em Clientes, não coloquei informações
    como CPF, endereço.. Em animais não coloquei o tipo de animal (ave, coelho..), justamente para deixar 
    o mais enxuto possível. E assim, as 3 tabelas se relacionando permite consultas diversas e praticidade.
• Que decisão técnica você tomou que tem um trade-off (escolheu A em vez de B)? Por quê?
    Eu preferi nomear a tabela de "animais" ao invés de "cachorros", dona Marlene cita apenas cachorros em sua fala,
    mas acredito que ou ela trabalha com mais animais, ou futuramente irá, então nomear a tabela como "cachorros"
    iria limitar muito o sistema e posteriormente teria que fazer alterações.
• Se tivesse mais uma semana, o que você adicionaria? Por quê?
    Eu adicionaria autenticação, pois acredito que é a base de um sistema, para evitar acessos inadequados. 
    Criaria a página de dashboard que está especificada no fora do escopo, para dona marlene ter uma melhor visão do negócio.
    E por fim, acredito que verificaria com ela sobre essa questão dos produtos, se ela trabalha ou não no petshop, ou se pretende, para criarmos essa nova feature no sistema.
• O que você não entendeu na dor da cliente e precisaria perguntar pra ela antes de continuar?
    Se ela tem algum funcionário que também utilizará o sistema, pois assim teríamos que ter níveis de usuários.
    E como disse na pergunta anterior, se ela trabalha somente com banho e tosa, ou promove mais algum tipo de serviço,
    ou vende algum produto em seu petshop, ou pretende.