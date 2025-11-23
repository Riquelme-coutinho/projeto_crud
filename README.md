# Novo Repositório
# 🎮 Plataforma de Jogos Educativos

Bem-vindo ao repositório da Plataforma de Jogos Educativos. Este é um projeto acadêmico (desenvolvido para a disciplina de Programação Web) que cria um ambiente online para alunos de uma escola, com perfis, autenticação e, futuramente, jogos.

O sistema é construído em **Node.js** com **Express** e utiliza **EJS** para renderização de páginas no servidor (SSR).

**Status do Projeto:** 🚧 Em Desenvolvimento 🚧

---

## ✨ Funcionalidades (Features)

* **Autenticação Segura:**
    * Cadastro de novos alunos com hash de senha (`bcrypt`).
    * Login de alunos com verificação de senha.
    * Sistema de Sessões (`express-session`) para manter o usuário logado.
    * Rotas protegidas (ex: `/perfil` só pode ser acessado após o login).
* **Perfil do Aluno:**
    * Página de perfil dinâmica que busca dados do banco MySQL.
    * Exibição de nome, avatar, pontos, nível e total de jogos.
* **Banco de Dados:**
    * Integração com MySQL (`mysql2`).
    * Script de schema (`database/schema.sql`) para fácil replicação do banco.

---

## 🛠️ Tecnologias Utilizadas

O projeto é dividido entre o que roda no **servidor (backend)** e as **dependências de desenvolvimento**.

### Dependências Principais (Dependencies)

* **[Express](https://expressjs.com/pt-br/)**: O framework web para criar o servidor e as rotas (API).
* **[EJS](https://ejs.co/)**: Motor de templates para injetar dados do servidor no HTML.
* **[MySQL2](https://github.com/sidorares/node-mysql2)**: O "driver" para conectar e fazer queries no banco de dados MySQL.
* **[Bcrypt](https://github.com/kelektiv/node.bcrypt.js)**: Para criptografar (hash) e comparar as senhas com segurança.
* **[Express-Session](https://github.com/expressjs/session)**: Para criar e gerenciar as sessões de login (o "crachá" do usuário).
* **[DotEnv](https://github.com/motdotla/dotenv)**: Para carregar variáveis de ambiente (como senhas do banco) do arquivo `.env`.

### Dependências de Desenvolvimento (DevDependencies)

* **[Nodemon](https://nodemon.io/)**: Ferramenta que reinicia o servidor automaticamente toda vez que um arquivo é salvo, agilizando o desenvolvimento.

---

## 🚀 Como Rodar o Projeto

Siga os passos abaixo para configurar e rodar o projeto em sua máquina local.

### 1. Pré-requisitos

* [Node.js](https://nodejs.org/en/) (v18 ou superior)
* [NPM](https://www.npmjs.com/) (geralmente vem com o Node)
* Um servidor MySQL (como [XAMPP](https://www.apachefriends.org/index.html), [WAMP](https://www.wampserver.com/en/) ou [MySQL Community Server](https://dev.mysql.com/downloads/mysql/))

### 2. Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://seu-link-do-git/projeto-programa-o-web.git
    cd projeto-programa-o-web
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

### 3. Configuração do Banco de Dados

1.  Abra seu cliente MySQL (Workbench, DBeaver, etc.).
2.  Crie o banco de dados e o usuário conforme o arquivo `database/schema.sql`. (O nome padrão do banco é `escola_divertida`).
3.  Execute o restante do script `database/schema.sql` para criar todas as tabelas (`alunos`, `jogos`, `pontuacoes`, etc.).

### 4. Configuração do Ambiente

1.  Na raiz do projeto (`seu-projeto/`), crie um arquivo chamado `.env`.
2.  Copie e cole o conteúdo abaixo, substituindo pelos seus dados do MySQL:

    ```ini
    # Configuração do Banco de Dados
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=aluno_web
    DB_PASSWORD=SenhaAluno@2025
    DB_DATABASE=escola_divertida
    
    # Porta do Servidor
    PORT=3000
    ```

### 5. Executando a Aplicação

Para iniciar o servidor com o `nodemon` (recomendado para desenvolvimento):

```bash
npm run dev