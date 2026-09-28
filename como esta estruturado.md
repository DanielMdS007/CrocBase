# CrocBase

Backend da aplicação CrocBase desenvolvido com **NestJS**, utilizando **TypeORM** para comunicação com **MySQL** e **Docker** para gerenciamento do ambiente.

## Tecnologias

* Node.js
* NestJS
* TypeScript
* TypeORM
* MySQL 8.4
* Docker
* Docker Compose

---

## Estrutura do projeto

```text
CrocBase/
├── backend/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── produtos/
│   │   │   ├── produto.entity.ts
│   │   │   ├── produto.service.ts
│   │   │   └── produto.controller.ts
│   │   ├── ...
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── Dockerfile
│
├── frontend/
│   └── ...
│
├── docker-compose.yml
└── .gitignore
```

---

# Backend

O backend utiliza NestJS e TypeScript.

## Instalação das dependências

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências do projeto:

```bash
npm install
```

Para instalar o TypeORM e o driver do MySQL:

```bash
npm install @nestjs/typeorm typeorm mysql2
```

### Dependências

* `@nestjs/typeorm` — integração entre NestJS e TypeORM.
* `typeorm` — ORM utilizado para trabalhar com o banco de dados.
* `mysql2` — driver utilizado pelo TypeORM para comunicação com o MySQL.

---

# TypeORM

O TypeORM fica dentro do projeto NestJS como uma dependência do backend.

A configuração principal pode ser feita no:

```text
backend/src/app.module.ts
```

Exemplo:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql',
      port: 3306,
      username: 'crocbase',
      password: 'crocbase',
      database: 'crocbase',

      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

## Configurações

| Configuração | Valor      |
| ------------ | ---------- |
| Banco        | MySQL      |
| Host         | `mysql`    |
| Porta        | `3306`     |
| Usuário      | `crocbase` |
| Senha        | `crocbase` |
| Database     | `crocbase` |

### Por que o host é `mysql`?

O `mysql` corresponde ao nome do serviço definido no `docker-compose.yml`.

```yaml
services:
  mysql:
    image: mysql:8.4
```

Dentro da rede Docker, o NestJS consegue encontrar o MySQL através do nome:

```text
mysql
```

Por isso, no TypeORM:

```typescript
host: 'mysql'
```

e não:

```typescript
host: 'localhost'
```

`localhost` dentro do container do NestJS apontaria para o próprio container do NestJS, e não para o container do MySQL.

---

# Entities

As entidades representam as tabelas do banco de dados.

Por exemplo, uma entidade `Produto`:

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  preco: number;
}
```

Com:

```typescript
autoLoadEntities: true
```

o NestJS consegue carregar automaticamente as entidades utilizadas pelos módulos.

---

# Docker

O projeto utiliza Docker para executar o backend e o banco de dados.

## Dockerfile

O Dockerfile do backend fica em:

```text
backend/Dockerfile
```

Conteúdo:

```dockerfile
FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

### O que o Dockerfile faz?

1. Utiliza Node.js 22.
2. Cria o diretório `/app`.
3. Copia os arquivos `package.json` e `package-lock.json`.
4. Instala as dependências.
5. Copia o código do backend.
6. Compila o NestJS.
7. Expõe a porta `3000`.
8. Inicia a aplicação em modo de produção.

---

# Docker Compose

O arquivo:

```text
docker-compose.yml
```

fica na raiz do projeto.

```yaml
services:

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile

    container_name: crocbase-backend

    ports:
      - "3000:3000"

    depends_on:
      - mysql

  mysql:
    image: mysql:8.4

    container_name: crocbase-mysql

    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: crocbase
      MYSQL_USER: crocbase
      MYSQL_PASSWORD: crocbase

    ports:
      - "3306:3306"

    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

## Serviços

O Docker Compose possui dois serviços:

### Backend

```yaml
backend:
```

Executa o NestJS.

A aplicação fica disponível em:

```text
http://localhost:3000
```

### MySQL

```yaml
mysql:
```

Executa o banco de dados MySQL.

A porta disponibilizada para o computador é:

```text
3306
```

---

# Banco de dados

As configurações do MySQL são:

```text
Database: crocbase
User: crocbase
Password: crocbase
Root Password: root
Port: 3306
```

O volume:

```yaml
volumes:
  - mysql_data:/var/lib/mysql
```

faz com que os dados do banco sejam persistidos mesmo que o container seja removido.

---

# Executando o projeto

Na raiz do projeto:

```bash
docker compose up -d --build
```

O parâmetro `--build` faz o Docker reconstruir a imagem do backend.

Para verificar os containers:

```bash
docker ps
```

Você deverá encontrar:

```text
crocbase-backend
crocbase-mysql
```

---

# Visualizando os logs

Para visualizar os logs do backend:

```bash
docker logs -f crocbase-backend
```

Para visualizar os logs do MySQL:

```bash
docker logs -f crocbase-mysql
```

---

# Parando o projeto

Para parar os containers:

```bash
docker compose down
```

Isso remove os containers, mas mantém o volume do MySQL.

Para remover também os dados do banco:

```bash
docker compose down -v
```

> ⚠️ O comando `docker compose down -v` remove o volume `mysql_data` e, consequentemente, os dados armazenados no banco.

---

# Arquitetura

A comunicação entre os serviços funciona da seguinte maneira:

```text
                 Docker
┌─────────────────────────────────────┐
│                                     │
│  ┌─────────────────┐                │
│  │     NestJS      │                │
│  │     :3000       │                │
│  └────────┬────────┘                │
│           │                         │
│           │ TypeORM                 │
│           │                         │
│           ▼                         │
│  ┌─────────────────┐                │
│  │      MySQL       │                │
│  │      :3306       │                │
│  └─────────────────┘                │
│                                     │
└─────────────────────────────────────┘
```

O fluxo da aplicação é:

```text
Cliente
   │
   ▼
NestJS
   │
   ▼
TypeORM
   │
   ▼
MySQL
```

---

# Desenvolvimento

Para executar o NestJS diretamente fora do Docker:

```bash
cd backend
npm run start:dev
```

Nesse caso, o MySQL ainda pode continuar sendo executado pelo Docker:

```bash
docker compose up -d mysql
```

Porém, quando o NestJS estiver rodando diretamente no computador, a configuração do banco deverá utilizar:

```typescript
host: 'localhost'
```

Em vez de:

```typescript
host: 'mysql'
```

### Dentro do Docker

```typescript
host: 'mysql'
```

### Fora do Docker

```typescript
host: 'localhost'
```

---

# Portas

| Serviço |  Porta |
| ------- | -----: |
| NestJS  | `3000` |
| MySQL   | `3306` |

O acesso externo é:

```text
NestJS → http://localhost:3000
MySQL  → localhost:3306
```

---

# Comandos úteis

### Subir os serviços

```bash
docker compose up -d
```

### Subir reconstruindo as imagens

```bash
docker compose up -d --build
```

### Parar os serviços

```bash
docker compose down
```

### Ver containers

```bash
docker ps
```

### Ver logs do backend

```bash
docker logs -f crocbase-backend
```

### Ver logs do MySQL

```bash
docker logs -f crocbase-mysql
```

### Entrar no container do backend

```bash
docker exec -it crocbase-backend bash
```

### Entrar no MySQL

```bash
docker exec -it crocbase-mysql mysql -u crocbase -p
```

A senha será:

```text
crocbase
```
