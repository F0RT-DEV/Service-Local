# Tecnologias Utilizadas no Projeto Service-Local

## 🖥️ Frontend (Client)

### Framework e Bibliotecas Base
- **React 18.3.1** - Biblioteca JavaScript para criar interfaces de usuário
- **Vite 5.4.2** - Build tool e bundler moderno para desenvolvimento rápido
- **TypeScript 5.5.3** - Linguagem de programação com tipagem estática

### Roteamento e HTTP
- **React Router DOM 7.6.2** - Biblioteca para roteamento em aplicações React
- **Axios 1.10.0** - Cliente HTTP para fazer requisições para APIs

### Interface e Estilização
- **Tailwind CSS 3.4.1** - Framework CSS utility-first para estilização
- **PostCSS 8.4.35** - Ferramenta para transformar CSS com plugins
- **Autoprefixer 10.4.18** - Plugin PostCSS para adicionar prefixos de vendor automaticamente
- **Lucide React 0.344.0** - Biblioteca de ícones para React

### Ferramentas de Desenvolvimento
- **ESLint 9.9.1** - Linter para JavaScript/TypeScript
- **@vitejs/plugin-react 4.3.1** - Plugin oficial do Vite para React
- **Globals 15.9.0** - Configurações globais para ESLint
- **TypeScript ESLint 8.3.0** - Parser e regras ESLint para TypeScript

### Configuração TypeScript
- **@types/react 18.3.23** - Definições de tipos para React
- **@types/react-dom 18.3.0** - Definições de tipos para React DOM

---

## 🔧 Backend (Server)

### Runtime e Framework
- **Node.js** - Runtime JavaScript no servidor
- **Express 5.1.0** - Framework web para Node.js

### Banco de Dados e ORM
- **MySQL2 3.14.1** - Driver MySQL para Node.js
- **Knex.js 2.5.1** - Query builder SQL para Node.js
- **Migrações e Seeds** - Sistema de versionamento de banco via Knex

### Autenticação e Segurança
- **bcrypt 6.0.0** - Biblioteca para hash de senhas
- **bcryptjs 3.0.2** - Implementação JavaScript pura do bcrypt
- **jsonwebtoken 9.0.2** - Implementação de JSON Web Tokens
- **CORS 2.8.5** - Middleware para Cross-Origin Resource Sharing

### Validação e Utilitários
- **Zod 3.25.48** - Biblioteca de validação de schemas TypeScript-first
- **UUID 11.1.0** - Gerador de identificadores únicos universais
- **dotenv 16.5.0** - Carregador de variáveis de ambiente

### Upload e Middleware
- **Multer 2.0.1** - Middleware para upload de arquivos multipart/form-data
- **cookie-parser 1.4.7** - Middleware para parsing de cookies

### Estrutura de Módulos
- **Arquitetura modular** - Organização por domínios (auth, user, service, order, etc.)
- **Middleware customizado** - Sistema de autenticação e autorização por roles
- **Sistema de uploads** - Gerenciamento de avatars e arquivos

---

## 🗄️ Banco de Dados

### Sistema de Gerenciamento
- **MySQL** - Sistema de gerenciamento de banco de dados relacional

### Estrutura
- **Migrações Knex** - Versionamento e estruturação do schema
- **Tabelas principais**:
  - `users` - Usuários do sistema
  - `services` - Serviços oferecidos
  - `orders` - Pedidos/solicitações de serviço
  - `reviews` - Avaliações e comentários
  - `categories` - Categorias de serviços

---

## 🛠️ Ferramentas de Desenvolvimento

### Build e Deploy
- **Vite** - Build tool com hot module replacement
- **ESLint** - Linting para qualidade de código
- **TypeScript Compiler** - Compilação e verificação de tipos

### Desenvolvimento
- **Node --watch** - Modo de desenvolvimento com auto-reload no backend
- **Vite Dev Server** - Servidor de desenvolvimento com hot reload no frontend

---

## 🎨 Principais Features Implementadas

### Interface
- **Design responsivo** - Compatível com mobile e desktop
- **Modais dinâmicos** - Sistema de modais customizados
- **Alerts customizados** - Substituição de alerts nativos por componentes estilizados
- **Navegação intuitiva** - Sistema de roteamento SPA

### Funcionalidades
- **Sistema de autenticação** - Login, registro, reset de senha
- **Múltiplos papéis** - Admin, Provider (prestador), Client (cliente)
- **Gestão de serviços** - Criação, edição, busca e contratação
- **Sistema de pedidos** - Solicitação, acompanhamento e finalização
- **Avaliações** - Sistema de rating entre clientes e prestadores
- **Upload de arquivos** - Sistema de avatars e documentos

### Segurança
- **Autenticação JWT** - Tokens seguros para sessões
- **Hash de senhas** - Criptografia bcrypt
- **Validação de dados** - Schemas Zod no backend
- **Middleware de autorização** - Controle de acesso por roles

---

## 📱 Compatibilidade

### Frontend
- **Browsers modernos** - Chrome, Firefox, Safari, Edge
- **Mobile responsive** - Design adaptativo para dispositivos móveis
- **TypeScript strict** - Tipagem rigorosa para melhor DX

### Backend
- **Node.js 18+** - Compatibilidade com versões LTS
- **MySQL 8.0+** - Banco de dados moderno
- **ES Modules** - Sintaxe moderna de importação

---

## 🚀 Scripts Disponíveis

### Frontend
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run lint     # Verificação de código
npm run preview  # Preview do build
```

### Backend
```bash
npm run dev      # Servidor com auto-reload
npm run test     # Testes (a implementar)
```

---

*Documentação atualizada em dezembro de 2024*
