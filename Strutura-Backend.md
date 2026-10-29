# Organização do Backend

O backend será desenvolvido utilizando **NestJS e TypeScript**, seguindo uma arquitetura modular que separa as responsabilidades do sistema. A estrutura utiliza Controllers, Services e Repositories para facilitar a manutenção, os testes e a evolução do projeto.

## Estrutura de pastas

```text
backend/
└── src/
    ├── modules/
    │   ├── usuarios/
    │   │   ├── usuarios.controller.ts
    │   │   ├── usuarios.service.ts
    │   │   ├── usuarios.repository.ts
    │   │   └── usuarios.module.ts
    │   │
    │   ├── projetos/
    │   │   ├── projetos.controller.ts
    │   │   ├── projetos.service.ts
    │   │   ├── projetos.repository.ts
    │   │   └── projetos.module.ts
    │   │
    │   └── atividades/
    │
    ├── auth/
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── guards/
    │   └── strategies/
    │
    └── database/
```

## Fundamentos da arquitetura

### Modules

Os módulos organizam o sistema por funcionalidades, agrupando os componentes relacionados a cada área. Isso facilita a separação de responsabilidades e a manutenção do código.

### Controllers

Os Controllers recebem as requisições HTTP, encaminham os dados para os Services e retornam as respostas ao cliente. Eles funcionam como a porta de entrada da API.

### Services

Os Services concentram a lógica de negócio do sistema, executando as operações e verificando as regras necessárias antes de acessar ou modificar os dados.

### Repositories

Os Repositories são responsáveis pelo acesso e pela manipulação dos dados no banco de dados. Essa separação evita que as consultas SQL fiquem espalhadas pelos Controllers e Services.

### Auth

O módulo de autenticação reúne os componentes responsáveis por identificar os usuários e controlar o acesso ao sistema. Ele diferencia a autenticação, que verifica a identidade, da autorização, que verifica as permissões.

### Guards

Os Guards verificam se uma requisição pode acessar determinada rota. Podem validar a autenticação do usuário e restringir funcionalidades conforme seu perfil, como Membro ou Administrador.

### Strategies

As Strategies definem os métodos utilizados para autenticar os usuários, como a validação de tokens JWT. Elas trabalham em conjunto com os mecanismos de autenticação do NestJS.

### Database

A pasta `database` reúne os componentes relacionados à configuração e à conexão com o banco de dados MySQL. Também pode conter configurações de migrations e outras operações de gerenciamento do banco.
