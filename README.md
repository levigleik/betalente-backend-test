# Betalent Gateway Test

Um projeto de teste para a BeTalent Tech - Sistema gerenciador de pagamentos multi-gateway construído com AdonisJS.

## 📋 Descrição

Este é um sistema de gerenciador de pagamentos multi-gateway que se conecta a duas APIs de terceiros para processar transações. O sistema segue uma ordem de prioridade definida para os gateways - se o primeiro gateway falhar, automaticamente tenta o segundo. A arquitetura foi projetada para facilitar a adição de novos gateways de forma modular.

## 🛠️ Tecnologias Utilizadas

- **Framework**: AdonisJS v7
- **Linguagem**: TypeScript/Node.js
- **Banco de Dados**: MySQL 8.0
- **Documentação**: Swagger/OpenAPI manual com `@openapi`
- **Containerização**: Docker & Docker Compose
- **Testes**: Japa
- **Linting**: Biome

## 📋 Requisitos

- Node.js 24+ 
- Docker & Docker Compose
- MySQL (caso não use Docker)

## 🚀 Como Instalar e Rodar

### Via Docker (Recomendado)

1. **Clone o repositório**
   ```bash
   git clone https://github.com/levigleik/betalente-backend-test
   cd betalent-gateway-test
   ```

2. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```

3. **Inicie os serviços com Docker Compose**
   ```bash
   docker-compose up -d
   ```

   Isso irá iniciar:
   - Aplicação (porta 3335)
   - Banco de dados MySQL (porta 3307) 
   > Deixei expondo a porta 3307 para caso já tenha um serviço local rodando na 3306
   - Gateway 1 mock (porta 3001)
   - Gateway 2 mock (porta 3002)

4. **Execute as migrações do banco de dados**
   ```bash
   docker-compose exec app node ace migration:run
   ```

5. **Acesse a aplicação**
   - API: http://localhost:3335
   - Documentação Swagger: http://localhost:3335/docs

### Manualmente (Desenvolvimento)

1. **Instale as dependências**
   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

3. **Configure o banco de dados MySQL**
   - Crie o banco `gateway_sample`
   - Configure as credenciais no `.env`

4. **Execute as migrações**
   ```bash
   npm run migration:run
   ```

5. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

## 📚 Documentação da API

### Swagger UI

O projeto possui documentação Swagger manual via blocos `@openapi` nos controllers e schemas compartilhados em `app/docs/components.ts`. Para visualizar:

- **Acesse**: http://localhost:3335/docs
- **Especificação JSON**: http://localhost:3335/swagger

### Gerar Documentação

> **Importante**: Em ambiente de desenvolvimento, a spec é montada dinamicamente a partir dos blocos `@openapi`. O comando `docs:generate` gera os arquivos estáticos `swagger.json` e `swagger.yml`, usados principalmente no build/produção.

```bash
npm run docs:generate
```

## 🛣️ Detalhamento de Rotas

### Autenticação (Públicas)
- `POST /v1/auth/login` - Login de usuário
- `POST /v1/auth/signup` - Criar nova conta
- `POST /v1/auth/logout` - Logout (requer autenticação)

### Perfil (Privada)
- `GET /v1/profile` - Obter dados do usuário autenticado

### Compras (Pública)
- `POST /v1/purchase` - Realizar uma compra

### Transações (Privadas)
- `GET /v1/transactions` - Listar transações
- `GET /v1/transactions/:id` - Visualizar detalhes da transação
- `POST /v1/transactions/:id/refund` - Solicitar reembolso

### Clientes (Privadas)
- `GET /v1/clients` - Listar clientes
- `GET /v1/clients/:id` - Visualizar detalhes do cliente

### Produtos (Privadas)
- `GET /v1/products` - Listar produtos
- `GET /v1/products/:id` - Visualizar detalhes do produto
- `POST /v1/products` - Criar novo produto
- `PUT /v1/products/:id` - Atualizar produto
- `DELETE /v1/products/:id` - Excluir produto

### Gateways (Privadas)
- `GET /v1/gateways` - Listar gateways configurados
- `PATCH /v1/gateways/:id/toggle` - Ativar/Desativar gateway
- `PATCH /v1/gateways/:id/priority` - Atualizar prioridade do gateway

## 🏗️ Arquitetura

### Estrutura de Pastas

```
app/
├── controllers/          # Controladores da API
├── models/              # Models do banco de dados
├── services/            # Lógica de negócio
│   └── gateways/        # Serviços dos gateways de pagamento
├── middleware/          # Middleware da aplicação
├── validators/          # Validadores de entrada
├── transformers/        # Transformadores de dados
└── exceptions/          # Manipuladores de exceção

config/                  # Arquivos de configuração
database/               # Migrações e seeds
start/                  # Bootstrap da aplicação
tests/                  # Testes automatizados
```

### Serviços de Gateway

O sistema possui uma arquitetura modular para gateways:

- **Gateway One Service**: Implementação do primeiro gateway
- **Gateway Two Service**: Implementação do segundo gateway  
- **Payment Processor Service**: Orquestrador do processamento de pagamentos
- **Refund Transaction Service**: Serviço de reembolso

## 🧪 Testes

### Configuração do Ambiente de Testes

Para executar os testes corretamente, use o arquivo de ambiente de testes:

```bash
cp .env.example .env.test
```

**Recomendação**: Configure um banco de dados diferente para os testes para não interferir com os dados de desenvolvimento. Edite o arquivo `.env.test` com:

```env
# Use um banco de dados separado para testes
DB_DATABASE=gateway_test
# Outras configurações específicas para teste...
```

### Executando os Testes

Para executar os testes:
```bash
npm test
```


## 📝 Variáveis de Ambiente

### Principais variáveis:

```env
# Servidor
PORT=3333
HOST=localhost
NODE_ENV=development

# Aplicação
APP_KEY=sua-chave-secreta
APP_URL=http://localhost:3333

# Banco de Dados
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_DATABASE=gateway_sample

# Gateways
GATEWAY_1_URL=http://localhost:3001
GATEWAY_2_URL=http://localhost:3002
```

**Desenvolvido com ❤️ por [Levi Gleik](https://github.com/levigleik) para BeTalent Tech**
