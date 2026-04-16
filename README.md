<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20%2B-green?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js version" />
  <img src="https://img.shields.io/badge/TypeScript-6.x-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express-5.x-lightgrey?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

# ServiçoPIM API

API REST do sistema de gestão de ordens de serviço de manutenção do projeto ServiçoPIM.

## Visão Geral

O backend foi construído com `Node.js`, `TypeScript`, `Express`, `TypeORM` e `PostgreSQL`. Ele concentra:

- autenticação com `JWT`
- autorização por perfil
- gestão de usuários
- gestão de equipamentos
- fluxo completo de ordens de serviço
- histórico de auditoria
- apontamentos de trabalho do técnico
- dashboard agregado por perfil
- testes unitários e integrados

## O que a API entrega hoje

- login com `accessToken` e `refreshToken`
- perfis `SOLICITANTE`, `TÉCNICO` e `SUPERVISOR`
- CRUD de usuários com `email` e `matricula` únicos
- CRUD de equipamentos com desativação lógica
- criação de O.S. usando o usuário autenticado como solicitante
- atribuição de técnico pelo supervisor
- autoatribuição de O.S. aberta pelo técnico
- início explícito da O.S.
- atualização de status com observação opcional
- conclusão da O.S. com cálculo automático de duração
- apontamentos de trabalho para medir tempo efetivo trabalhado
- histórico automático das mudanças relevantes
- listagem de O.S. com filtros por:
  - `status`
  - `prioridade`
  - `busca`
  - `tecnicoId`
  - `setor`
- endpoint agregado de dashboard
- healthcheck em `GET /health`

## Perfis e responsabilidades

- `SOLICITANTE`
  - abre ordens de serviço
  - acompanha suas solicitações

- `TÉCNICO`
  - pode assumir O.S. aberta disponível
  - pode iniciar a execução
  - atualiza status da O.S. sob sua responsabilidade
  - registra apontamentos de trabalho
  - conclui a O.S.

- `SUPERVISOR`
  - administra usuários e equipamentos
  - atribui técnico
  - pode cancelar O.S.
  - acompanha visão global pelo dashboard

## Regras de negócio principais

- `POST /ordens-servico` usa o usuário autenticado como solicitante
- equipamentos inativos não podem receber nova O.S.
- exclusão de equipamento é lógica (`ativo = false`)
- técnico não pode cancelar O.S.
- conclusão exige descrição do serviço
- o tempo total da O.S. e o tempo efetivamente trabalhado são tratados separadamente
- não é permitido concluir O.S. com apontamento de trabalho aberto
- criação, atribuição, mudança de status, apontamentos e conclusão geram histórico

## Módulos principais

- `src/routes`
  Define os endpoints.

- `src/controllers`
  Recebe a requisição HTTP e orquestra os serviços.

- `src/services`
  Implementa as regras de negócio.

- `src/entities`
  Mapeia as entidades do banco.

- `src/middleware`
  Autenticação, tratamento de erros e utilitários do pipeline HTTP.

- `src/dtos`
  Schemas e validações com `Zod`.

- `src/database` e `src/migrations`
  Configuração e versionamento do banco.

## Principais endpoints

### Auth

- `POST /auth/login`
- `POST /auth/refresh`

### Usuários

- `GET /usuarios`
- `GET /usuarios/:id`
- `POST /usuarios`
- `PUT /usuarios/:id`
- `DELETE /usuarios/:id`

### Equipamentos

- `GET /equipamentos`
- `GET /equipamentos/:id`
- `GET /equipamentos/:id/detalhes`
- `POST /equipamentos`
- `PUT /equipamentos/:id`
- `DELETE /equipamentos/:id`

### Ordens de Serviço

- `GET /ordens-servico`
- `GET /ordens-servico/:id`
- `POST /ordens-servico`
- `PATCH /ordens-servico/:id/atribuir-tecnico`
- `PATCH /ordens-servico/:id/assumir`
- `PATCH /ordens-servico/:id/iniciar`
- `PATCH /ordens-servico/:id/status`
- `PATCH /ordens-servico/:id/concluir`
- `GET /ordens-servico/:id/apontamentos`
- `POST /ordens-servico/:id/apontamentos/iniciar`
- `PATCH /ordens-servico/:id/apontamentos/finalizar`

### Dashboard e histórico

- `GET /dashboard`
- `GET /historico-os`
- `GET /historico-os/:id`
- `GET /historico-os/os/:osId`
- `GET /historico-os/usuario/:usuarioId`

## Ambiente e configuração

As variáveis principais ficam no `.env`:

- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASS`
- `DB_NAME`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `DB_LOGGING`

Modelo completo em [`.env.example`](./.env.example).

## Como executar

### 1. Banco no Docker + API local

```bash
docker compose up -d postgres pgadmin
npm install
npm run db:migrate
npm run dev
```

Endereços:

- API: `http://localhost:9090`
- PostgreSQL: `localhost:5433`
- PgAdmin: `http://localhost:8080`

### 2. Tudo com Docker

```bash
docker compose up --build -d
```

Evite subir a API local e a API em container ao mesmo tempo, porque ambas usam a mesma porta.

## Scripts

- `npm run dev`
  Sobe a API em modo desenvolvimento

- `npm run build`
  Compila o projeto

- `npm start`
  Executa a versão compilada

- `npm run db:migrate`
  Aplica as migrations no banco do ambiente atual

- `npm test`
  Roda os testes unitários

- `npm run test:unit`
  Roda explicitamente a suíte unitária

- `npm run test:integration:jest`
  Roda os testes integrados usando o banco de teste já disponível

- `npm run test:integration:docker`
  Sobe o ambiente de teste, aplica migrations, roda os integrados e derruba tudo no final

## Testes

### Unitários

```bash
npm test
```

Cobrem principalmente:

- services
- regras de transição de O.S.
- autenticação/autorização
- filtros
- validações de negócio

### Integrados

```bash
npm run test:integration:docker
```

Cobrem fluxos ponta a ponta com banco real de teste:

- auth
- usuários
- equipamentos
- ordens de serviço
- histórico
- dashboard

## Observações de arquitetura

- o projeto usa `migrations`, não `synchronize`
- os erros de negócio usam `AppError`
- a autenticação é centralizada em middleware
- o dashboard já usa agregação no banco para evitar processamento em memória
- o sistema separa:
  - tempo até início
  - tempo até conclusão
  - tempo efetivamente trabalhado

## Referências úteis

- setup detalhado: [SETUP.md](./SETUP.md)
- roteiro de testes manuais: [testes-api.http](./testes-api.http)
