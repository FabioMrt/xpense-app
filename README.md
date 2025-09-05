# XPensive Control 💰

Um aplicativo moderno de controle financeiro pessoal desenvolvido com Next.js, Prisma, MongoDB e NextAuth. Gerencie suas finanças de forma intuitiva e eficiente.

![XPensive Control Banner](./src/assets/financas.jpg)

## 🚀 Funcionalidades Principais

- ✅ **Autenticação com Google** - Login seguro via OAuth2
- ✅ **Controle de Transações** - Adicione, edite e remova receitas e despesas
- ✅ **Categorização** - Organize transações por categorias
- ✅ **Relatórios Mensais** - Visualize seus gastos por mês
- ✅ **Dashboard Interativo** - Cards com totais de entrada, saída e saldo
- ✅ **Interface Responsiva** - Funciona perfeitamente em mobile e desktop
- ✅ **Design Moderno** - UI/UX com Tailwind CSS e shadcn/ui

## 🛠 Tecnologias Utilizadas

### Frontend
- **Next.js 15.5.0** - Framework React com App Router
- **TypeScript** - Tipagem estática para maior segurança
- **Tailwind CSS 4** - Framework de CSS utilitário
- **shadcn/ui** - Componentes de UI modernos e acessíveis
- **Lucide React** - Ícones SVG otimizados
- **React Hook Form** - Gerenciamento de formulários
- **Sonner** - Notificações toast elegantes

### Backend & Banco de Dados
- **MongoDB** - Banco de dados NoSQL
- **Prisma ORM** - ORM type-safe para Node.js
- **NextAuth.js** - Autenticação completa para Next.js

### Autenticação
- **Google OAuth** - Login com conta Google
- **Session Management** - Gerenciamento de sessões seguro

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18.x ou superior)
- **npm** ou **yarn**
- **MongoDB** (local ou Atlas)
- **Conta Google** (para configurar OAuth)

## ⚡ Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd xpense-control
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/xpense-control"
# Para MongoDB Atlas, use:
# DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/xpense-control?retryWrites=true&w=majority"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-aqui-gerado-com-openssl"

# Google OAuth (obtenha em https://console.developers.google.com)
GOOGLE_CLIENT_ID="seu-google-client-id"
GOOGLE_CLIENT_SECRET="seu-google-client-secret"

# API Host
HOST_URL="http://localhost:3000"
```

### 4. Configure o Google OAuth

1. Vá para [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a Google+ API
4. Vá para "Credenciais" > "Criar credenciais" > "ID do cliente OAuth"
5. Configure as URLs autorizadas:
   - **JavaScript origins**: `http://localhost:3000`
   - **Redirect URIs**: `http://localhost:3000/api/auth/callback/google`
6. Copie o Client ID e Client Secret para o `.env.local`

### 5. Configure o MongoDB

#### Opção A: MongoDB Local
```bash
# Instale o MongoDB localmente
# macOS (com Homebrew)
brew install mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb

# Inicie o serviço
mongod
```

#### Opção B: MongoDB Atlas (Recomendado)
1. Crie uma conta gratuita em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um cluster gratuito
3. Configure um usuário e senha
4. Adicione seu IP à whitelist
5. Obtenha a string de conexão e atualize `DATABASE_URL`

### 6. Configure o banco de dados com Prisma

```bash
# Gere o cliente Prisma
npx prisma generate

# Execute as migrações (para MongoDB, usa db push)
npx prisma db push

# (Opcional) Visualize o banco com Prisma Studio
npx prisma studio
```

### 7. Popule categorias iniciais

Acesse o MongoDB e adicione algumas categorias básicas:

```javascript
// No MongoDB Compass ou via mongosh
db.Category.insertMany([
  { _id: ObjectId(), name: "Alimentação" },
  { _id: ObjectId(), name: "Transporte" },
  { _id: ObjectId(), name: "Entretenimento" },
  { _id: ObjectId(), name: "Saúde" },
  { _id: ObjectId(), name: "Educação" },
  { _id: ObjectId(), name: "Outros" }
])
```

### 8. Execute o projeto

```bash
npm run dev
# ou
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver o aplicativo.

## 🏗 Arquitetura do Projeto

```
src/
├── @types/           # Tipagens TypeScript personalizadas
│   └── next-auth.d.ts
├── app/              # App Router (Next.js 13+)
│   ├── api/          # Rotas da API
│   │   ├── auth/     # Autenticação NextAuth
│   │   ├── categories/ # CRUD de categorias
│   │   └── transactions/ # CRUD de transações
│   ├── dashboard/    # Página do dashboard
│   ├── globals.css   # Estilos globais
│   ├── layout.tsx    # Layout principal
│   └── page.tsx      # Landing page
├── assets/           # Imagens e recursos estáticos
├── components/       # Componentes React reutilizáveis
│   ├── Container/    # Wrapper de layout
│   ├── Header/       # Cabeçalho com auth
│   ├── SelectMes/    # Seletor de mês
│   ├── Table/        # Tabela de transações
│   ├── TransactionModal/ # Modal para CRUD de transações
│   └── ui/           # Componentes shadcn/ui
├── lib/              # Utilitários e configurações
│   ├── api.ts        # Cliente Axios
│   ├── auth.ts       # Configuração NextAuth
│   ├── prisma.ts     # Cliente Prisma
│   └── utils.ts      # Funções utilitárias
└── providers/        # Providers React
    └── auth.tsx      # Provider de autenticação
```

## 🔌 API Routes

### Autenticação
- `GET/POST /api/auth/[...nextauth]` - Endpoints do NextAuth

### Categorias
- `GET /api/categories` - Lista todas as categorias

### Transações
- `GET /api/transactions?month=8` - Lista transações do mês
- `POST /api/transactions` - Cria nova transação
- `PUT /api/transactions` - Atualiza transação existente
- `DELETE /api/transactions?id=123` - Remove transação

## 📊 Schema do Banco de Dados

### User (Usuário)
```prisma
model User {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  name          String?
  email         String?  @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  transactions  Transaction[]
}
```

### Transaction (Transação)
```prisma
model Transaction {
  id          String          @id @default(auto()) @map("_id") @db.ObjectId
  description String
  value       Float
  type        TransactionType
  date        DateTime        @default(now())
  category    Category?       @relation(fields: [categoryId], references: [id])
  categoryId  String?         @db.ObjectId
  user        User            @relation(fields: [userId], references: [id])
  userId      String          @db.ObjectId
}

enum TransactionType {
  ENTRADA
  SAIDA
}
```

### Category (Categoria)
```prisma
model Category {
  id           String        @id @default(auto()) @map("_id") @db.ObjectId
  name         String
  transactions Transaction[]
}
```

## 🎨 Componentes Principais

### Header
- Autenticação com Google
- Avatar do usuário
- Navegação responsiva

### Dashboard
- Cards com métricas financeiras
- Seletor de mês
- Tabela de transações
- Modal para adicionar/editar transações

### TransactionModal
- Formulário completo para transações
- Validação de campos
- Seleção de categorias e tipos
- Campos monetários formatados

### Table
- Listagem paginada de transações
- Ações de editar/excluir
- Formatação de moeda brasileira
- Ícones para tipos de transação

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Cria build de produção
npm run start        # Inicia servidor de produção

# Banco de dados
npx prisma generate  # Gera cliente Prisma
npx prisma db push   # Sincroniza schema com MongoDB
npx prisma studio    # Interface visual do banco
```

## 🔧 Solução de Problemas

### Erro: EPERM operation not permitted
```bash
# Limpe o cache do Next.js
rm -rf .next
npm run dev
```

### Erro de conexão com MongoDB
- Verifique se o MongoDB está rodando
- Confirme a string de conexão no `.env.local`
- Para Atlas, verifique se o IP está na whitelist

### Erro de autenticação Google
- Verifique as credenciais no `.env.local`
- Confirme as URLs de redirect no Google Console
- Certifique-se de que `NEXTAUTH_URL` está correto

### Prisma não encontra o cliente
```bash
npx prisma generate
```

## 📱 Responsividade

O aplicativo é totalmente responsivo e funciona em:
- 📱 **Mobile** (320px+)
- 📱 **Tablet** (768px+)
- 💻 **Desktop** (1024px+)
- 🖥 **Large screens** (1440px+)

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

Desenvolvido por **Fabio** - [GitHub](https://github.com/seu-usuario)

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!
