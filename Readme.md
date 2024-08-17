# API Daisy Store

## Visão Geral

Este projeto é uma API para a Daisy Store, desenvolvida usando Node.js, Express, Prisma, e JWT para autenticação. A arquitetura do projeto segue o padrão MVC (Model-View-Controller) e utiliza Prisma como ORM para interagir com o banco de dados.

## Requisitos

Certifique-se de que você tem as seguintes ferramentas instaladas em seu ambiente de desenvolvimento:

- Node.js (v14 ou superior)
- npm (v6 ou superior)
- PostgreSQL (ou outro banco de dados suportado pelo Prisma)

## Configuração do Projeto


### 1. Clonando o Repositório
Primeiro, clone o repositório para o seu ambiente local:

```
git clone https://github.com/hermesonbastos/api-daisy-store.git
cd api-daisy-store
```

### 2. Instalando dependências
Instale as dependências do projeto usando npm:

```
npm install
```

### 3. Configurando as variáveis de ambiente
Crie um arquivo .env na raiz do projeto com as seguintes variáveis:

```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
PORT=3000
JWT_SECRET="sua_chave_secreta_para_jwt"
```

### 4. Executanto migrações
Antes de rodar a aplicação, você precisa aplicar as migrações para configurar o banco de dados:

```
npm run prisma:migrate
```

### 5. Gerando o cliente Prisma
Sempre que você fizer alterações no arquivo schema.prisma, rode o seguinte comando para regenerar o cliente Prisma:

```
npm run prisma:generate
```

### 5. Rodando o servidor
Para iniciar o servidor, use o comando:

```
npm start
```



