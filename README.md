# Blog Acadêmico

## 📝 Descrição
API RESTful desenvolvida para o Blog dos Professores, uma plataforma que permite que professores da rede pública compartilhem conteúdo educacional. O sistema oferece gerenciamento completo de posts e usuários, com suporte a múltiplas disciplinas. Segue a arquitetura MVC (Model-View-Controller) para organizar a aplicação de forma modular e escalável.

## 🛠 Tecnologias
- Node.js
- Express
- MongoDB
- Docker
- TypeScript
- Swagger
- Jest

## 🚀 Configuração do Projeto

### Pré-requisitos
- Docker
- Docker Compose
- Node.js (para desenvolvimento)
- Git – Para clonar o repositório

### Instalação

1. Clone o repositório
```bash
git clone [URL_DO_REPOSITÓRIO]
```

2. Inicie os containers
```bash
docker-compose up --build
```

A API estará disponível em `http://localhost:3000`


## 🔄 Dados Iniciais
Para carregar dados de teste, use o endpoint de seed:
```bash
curl -X POST http://localhost:3000/api/seed
```

Isso criará:
- 5 usuários professores
- 12 posts distribuídos entre os professores

### Swagger
A documentação interativa da API (Swagger) estará disponível em: http://localhost:3000/api-docs

### Automação com GitHub Actions:

Configuração de workflows de CI/CD para automação de testes e deploy, dispível nas Actions do repositório.

## 📚 Estrutura do Banco de Dados

### Coleção Users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  discipline: String,
  role: String ['professor', 'admin'],
  createdAt: Date
}
```

### Coleção Posts
```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  author: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔗 Endpoints da API

### Posts

#### GET /api/posts
Retorna lista paginada de posts.

**Query Parameters:**
- `page` (opcional): Número da página (default: 1)
- `limit` (opcional): Itens por página (default: 10)

**Resposta de Sucesso:**
```javascript
{
  "data": {
    "posts": [
      {
        "_id": "123",
        "title": "Introdução à Matemática",
        "content": "Conteúdo do post...",
        "author": {
          "_id": "456",
          "name": "Maria Silva",
          "discipline": "Matemática"
        },
        "createdAt": "2025-01-15T10:00:00.000Z"
      }
    ],
    "currentPage": 1,
    "totalPages": 5,
    "totalPosts": 50
  }
}
```

#### GET /api/posts/:id
Retorna um post específico.

**Resposta de Sucesso:**
```javascript
{
  "data": {
    "_id": "123",
    "title": "Introdução à Matemática",
    "content": "Conteúdo do post...",
    "author": {
      "_id": "456",
      "name": "Maria Silva",
      "discipline": "Matemática"
    },
    "createdAt": "2025-01-15T10:00:00.000Z"
  }
}
```

#### POST /api/posts
Cria um novo post.

**Body:**
```javascript
{
  "title": "Título do Post",
  "content": "Conteúdo do post",
  "author": "ID_DO_USUARIO"
}
```

#### PUT /api/posts/:id
Atualiza um post existente.

**Body:**
```javascript
{
  "title": "Título Atualizado",
  "content": "Conteúdo atualizado"
}
```

#### DELETE /api/posts/:id
Remove um post específico.

### Usuários

#### GET /api/users
Retorna lista de usuários.

**Resposta de Sucesso:**
```javascript
{
  "data": [
    {
      "_id": "456",
      "name": "Maria Silva",
      "email": "maria@escola.edu",
      "discipline": "Matemática",
      "role": "professor",
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

#### POST /api/users
Cria um novo usuário.

**Body:**
```javascript
{
  "name": "Nome do Professor",
  "email": "professor@escola.edu",
  "discipline": "Disciplina",
  "role": "professor"
}
```

## 📝 Exemplos de Uso

### Criando um Novo Usuário
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "email": "maria@escola.edu",
    "discipline": "Matemática",
    "role": "professor"
  }'
```

### Criando um Novo Post
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introdução à Álgebra",
    "content": "Nesta aula vamos aprender...",
    "author": "ID_DO_USUARIO"
  }'
```

### Buscando Posts com Paginação
```bash
curl "http://localhost:3000/api/posts?page=1&limit=5"
```

## 🔍 Busca e Filtragem

### GET /api/posts/search
Busca posts por termo.

**Query Parameters:**
- `q`: Termo de busca

**Exemplo:**
```bash
curl "http://localhost:3000/api/posts/search?q=matemática"
```
### Camada de Testes:

Utilizamos o Jest para realizar testes unitários e de integração, garantindo que a API funcione corretamente.
    
## ⚠️ Tratamento de Erros
A API retorna erros no seguinte formato:
```javascript
{
  "error": "Mensagem de erro detalhada"
}
```

Códigos de status HTTP:
- 200: Sucesso
- 201: Criado com sucesso
- 400: Erro de validação
- 404: Recurso não encontrado
- 500: Erro interno do servidor

### Desafios Enfrentados

Iniciar a trabalhar com nodejs, express, swagger, jest, mongodb, git, github actions, docker foi desafiante para o grupo, por ser a primeira experiência de muitos de nós.

## 📜 Licença
Este projeto está sob a licença MIT.

---

Para mais informações ou dúvidas, abra uma issue no repositório.
