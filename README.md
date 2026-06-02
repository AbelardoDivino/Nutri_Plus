# Nutri+ 🍏

O **Nutri+** é uma aplicação web completa desenvolvida para auxiliar nutricionistas e usuários no gerenciamento de dietas e acompanhamento nutricional. O sistema permite o cálculo de taxa metabólica basal, montagem de planos alimentares personalizados e o envio automatizado desses planos por e-mail.

## 🚀 Funcionalidades

- **Gerenciamento de Usuários:** Cadastro e login para usuários comuns, administradores e profissionais de saúde.
- **Cálculo de Taxa Basal:** Ferramenta integrada para calcular o gasto energético diário com base nos dados do usuário.
- **Montagem de Dieta:** Interface para profissionais criarem planos alimentares (café da manhã, almoço, jantar, etc.).
- **Integração com TACO:** Consulta à Tabela Brasileira de Composição de Alimentos para precisão nutricional.
- **Notificações por E-mail:** Envio automático da dieta formatada diretamente para o e-mail do paciente.
- **Painel Administrativo:** Controle total de usuários e profissionais cadastrados.

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React.js** (v19)
- **React Router DOM** (Navegação)
- **Firebase** (Integração de serviços)
- **CSS Modules / Vanilla CSS** (Estilização)
- **React Icons** (Iconografia)

### Backend
- **Node.js** com **Express**
- **MySQL** (Banco de dados relacional)
- **Nodemailer** (Envio de e-mails)
- **Bcrypt** (Criptografia de senhas)
- **CORS / Dotenv** (Configurações de ambiente e segurança)

## 📁 Estrutura do Projeto

```text
Nutri_Plus/
├── backend/            # API REST em Node.js
│   ├── db/             # Conexão com banco de dados
│   ├── rotas/          # Endpoints da API (Usuário, Admin, Profissional)
│   ├── services/       # Lógica de negócio (Cálculos, E-mail, TACO)
│   └── sql/            # Scripts de criação do banco de dados
└── frontend/nutri/     # Aplicação Single Page em React
    ├── public/         # Assets públicos
    └── src/
        ├── components/ # Componentes reutilizáveis
        └── pages/      # Páginas principais da aplicação
```

## ⚙️ Configuração e Instalação

### Pré-requisitos
- Node.js (v20 ou superior)
- MySQL Server
- Conta no Firebase (opcional, dependendo do uso de storage/auth)

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/nutri-plus.git
cd nutri-plus
```

### 2. Configurar o Backend
Acesse a pasta do backend e instale as dependências:
```bash
cd backend
npm install
```

Crie um arquivo `.env` na raiz da pasta `backend` com as seguintes variáveis:
```env
PORT=3001
DB_HOST=database_host
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=database_name

# Configuração de E-mail (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
EMAIL_FROM=Nutri+ <seu-email@gmail.com>
```

### 3. Configurar o Banco de Dados
Execute os scripts SQL localizados em `backend/sql/` no seu MySQL Workbench ou terminal para criar as tabelas necessárias:
1. `setup_completo.sql`
2. `setup_dietas.sql`
3. `setup_profissionais.sql`

### 4. Configurar o Frontend
Acesse a pasta do frontend e instale as dependências:
```bash
cd ../frontend/nutri
npm install
```

## 🏃 Como Rodar

### Iniciar o Backend
```bash
cd backend
npm run dev
```
O servidor rodará em `http://localhost:3001`.

### Iniciar o Frontend
```bash
cd frontend/nutri
npm start
```
A aplicação abrirá automaticamente em `http://localhost:3000`.

## 📄 Licença
Este projeto está sob a licença [ISC](LICENSE).

---
Desenvolvido por Abelardo Divino como parte de estudos em desenvolvimento Web Full Stack.
