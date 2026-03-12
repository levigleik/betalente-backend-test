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


Os seeds criam os gateways iniciais e também um usuário administrador com base nas variáveis `ADMIN_NAME`, `ADMIN_EMAIL` e `ADMIN_PASSWORD`.


6. **Acesse a aplicação**
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
   node ace migration:run
   ```

5. **Execute os seeds**
   ```bash
   node ace db:seed
   ```

   Os seeds criam os gateways padrão e um usuário administrador usando as variáveis `ADMIN_NAME`, `ADMIN_EMAIL` e `ADMIN_PASSWORD`.


6. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

## 📚 Documentação da API

### Swagger UI

O projeto possui documentação Swagger manual via blocos `@openapi` nos controllers e schemas compartilhados em `app/docs/components.ts`. Para visualizar:

- **Acesse**: http://localhost:3335/docs (docker) http://localhost:3333/docs (dev)
- **Especificação JSON**: http://localhost:3335/swagger

### Gerar Documentação

> **Importante**: Em ambiente de desenvolvimento, a spec é montada dinamicamente a partir dos blocos `@openapi`. O comando `docs:generate` gera os arquivos estáticos `swagger.json` e `swagger.yml`, usados principalmente no build/produção.

```bash
npm run docs:generate
```

## 🛣️ Rotas Disponíveis

### Públicas
- `POST /v1/auth/login` - Autentica um usuário
- `POST /v1/purchase` - Realiza uma compra

### Regras da compra
- O payload de `purchase` recebe os produtos com `id` e `quantity`.
- O backend busca os produtos no banco, calcula o valor total da compra e só então envia o pagamento para o gateway.
- Se o mesmo produto for enviado mais de uma vez no payload, é feito um merge das quantidades antes do processamento.
- A criação de cliente, transação e itens da transação usa `trx` para garantir atomicidade no banco.

### Autenticadas
- `POST /v1/auth/logout` - Encerra a sessão/token atual
- `GET /v1/profile` - Retorna o usuário autenticado
- `GET /v1/transactions` - Lista transações
- `GET /v1/transactions/:id` - Exibe uma transação
- `POST /v1/transactions/:id/refund` - Solicita reembolso
- `GET /v1/clients` - Lista clientes
- `GET /v1/clients/:id` - Exibe um cliente
- `GET /v1/gateways` - Lista gateways configurados
- `PATCH /v1/gateways/:id/toggle` - Ativa/Desativa um gateway
- `PATCH /v1/gateways/:id/priority` - Atualiza a prioridade de um gateway

### Permissões por role

#### Users

| Método | Rota | Permissão |
| --- | --- | --- |
| `GET` | `/v1/users` | `ADMIN` |
| `GET` | `/v1/users/:id` | `ADMIN` |
| `POST` | `/v1/users` | `ADMIN` |
| `PUT` | `/v1/users/:id` | `ADMIN` ou `USER` |
| `DELETE` | `/v1/users/:id` | `ADMIN` |

> O endpoint `POST /v1/users` cria usuários com role `USER`. O seed é responsável por criar o usuário administrador inicial.

#### Products

| Método | Rota | Permissão |
| --- | --- | --- |
| `GET` | `/v1/products` | `ADMIN` |
| `GET` | `/v1/products/:id` | `ADMIN` |
| `POST` | `/v1/products` | `ADMIN` |
| `PUT` | `/v1/products/:id` | `ADMIN` |
| `DELETE` | `/v1/products/:id` | `ADMIN` |

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
# node ace generate:key
APP_KEY=chave-gerada-com-comando-acime
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

# Admin (usado no db seed)
ADMIN_NAME="John Doe Adm"
ADMIN_EMAIL="john@example.com"
ADMIN_PASSWORD="S3cur3P4s5word!"
```

> Importante: após rodar as migrations, execute `node ace db:seed` (ou `docker-compose exec app node ace db:seed`). Além dos gateways, o seed também cria o usuário administrador inicial.

**Desenvolvido com ❤️ por [Levi Gleik](https://github.com/levigleik) para BeTalent Tech**
