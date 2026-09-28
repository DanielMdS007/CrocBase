# CrocBase

## Como executar o projeto

### Requisitos

* Node.js
* npm
* Docker
* Docker Compose

### 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd CrocBase
```

### 2. Instalar as dependências do backend

```bash
cd backend
npm install
cd ..
```

### 3. Subir o projeto com Docker

```bash
docker compose up -d --build
```

### 4. Acessar o Swagger

Com os containers rodando, acesse:

**http://localhost:3000/api**

### Comandos úteis

Verificar os containers:

```bash
docker compose ps
```

Parar os containers:

```bash
docker compose down
```

Iniciar novamente:

```bash
docker compose up -d
```

Recriar os containers após alterações no código ou Dockerfile:

```bash
docker compose up -d --build
```

### Endereços

| Serviço | Endereço                  |
| ------- | ------------------------- |
| Swagger | http://localhost:3000/api |
| Backend | http://localhost:3000     |
| MySQL   | localhost:3306            |
