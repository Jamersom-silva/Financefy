# 📊 **Financefy** - Sistema de Controle Financeiro

## Descrição 🚀

**Financefy** é um sistema completo de controle financeiro que permite aos usuários gerenciar suas contas, transações e anexos relacionados a faturas e comprovantes. O projeto foi desenvolvido com **Django** no backend e **React** no frontend, utilizando um banco de dados SQLite para armazenar os dados de maneira simples e eficiente. O sistema oferece a possibilidade de realizar transações financeiras, categorizá-las, gerar relatórios financeiros mensais e por categoria, e gerenciar anexos como faturas e comprovantes.

---

## Funcionalidades 🛠️

- **Gestão de Contas**: O usuário pode criar, editar e visualizar suas contas bancárias, bem como manter o controle do saldo atual.
- **Gerenciamento de Transações**: As transações podem ser registradas, incluindo informações como tipo (receita ou despesa), valor, categoria e data.
- **Relatórios Financeiros**:
  - **Relatório Mensal**: Um gráfico que exibe as receitas, despesas e o saldo por mês.
  - **Relatório por Categoria**: Um gráfico de pizza mostrando as despesas agrupadas por categoria.
- **Gestão de Anexos**: O usuário pode anexar PDFs (faturas ou comprovantes) às suas transações.
- **Autenticação**: Sistema de login simples e autenticação baseada em **JWT** para garantir que cada usuário tenha acesso somente aos seus dados.

---

## Tecnologias Utilizadas 🧑‍💻

- **Backend**: Django, Django REST Framework, JWT Authentication
- **Frontend**: React, Redux (para gerenciamento de estado), Axios (para requisições HTTP)
- **Banco de Dados**: SQLite
- **Outros**: Docker, Git

---

## Como Rodar o Projeto Localmente 🏡

### 1. Requisitos 📦

- **Python 3.8+** (para o backend)
- **Node.js 16+** (para o frontend)
- **Django 5.x**
- **React 18.x**

### 2. Configuração do Backend (Django) 🔧

#### Passos:

1. **Clone o repositório**:
    ```bash
    git clone https://github.com/username/financefy.git
    cd financefy
    ```

2. **Crie e ative o ambiente virtual**:
    ```bash
    python -m venv .venv
    source .venv/bin/activate  # Para Linux/Mac
    .venv\Scripts\activate     # Para Windows
    ```

3. **Instale as dependências do backend**:
    ```bash
    pip install -r backend/requirements.txt
    ```

4. **Configure o banco de dados**:
    ```bash
    python backend/manage.py migrate
    ```

5. **Crie um superusuário para acessar a interface administrativa**:
    ```bash
    python backend/manage.py createsuperuser
    ```

6. **Inicie o servidor Django**:
    ```bash
    python backend/manage.py runserver
    ```

Agora, o backend estará rodando em [http://127.0.0.1:8000/](http://127.0.0.1:8000/).

### 3. Configuração do Frontend (React) 💻

#### Passos:

1. **Vá para o diretório do frontend**:
    ```bash
    cd frontend
    ```

2. **Instale as dependências do frontend**:
    ```bash
    npm install
    ```

3. **Inicie o servidor de desenvolvimento**:
    ```bash
    npm start
    ```

Agora, o frontend estará disponível em [http://localhost:3000](http://localhost:3000).

---

## Estrutura de Diretórios 📁

```bash
financefy/
├── backend/                   # Backend Django
│   ├── finance/                # Aplicação principal (Contas, Transações, Anexos)
│   │   ├── migrations/         # Migrações do banco de dados
│   │   ├── models.py           # Modelos de dados (Contas, Transações, Anexos)
│   │   ├── api/                # APIs REST
│   │   │   ├── attachments.py  # Serializers e ViewSets para Anexos
│   │   │   ├── transactions.py # Serializers e ViewSets para Transações
│   │   │   └── accounts.py     # Serializers e ViewSets para Contas
│   │   └── views.py            # Views da aplicação
│   ├── settings.py             # Configurações do Django
│   ├── urls.py                 # Roteamento de URLs
│   └── manage.py               # Script de gerenciamento do Django
├── frontend/                   # Frontend React
│   ├── public/                 # Arquivos estáticos (HTML, imagens)
│   ├── src/                    # Código fonte React
│   │   ├── components/         # Componentes reutilizáveis
│   │   ├── pages/              # Páginas principais
│   │   ├── api/                # Funções para fazer requisições HTTP
│   │   ├── reducers/           # Gerenciamento de estado (Redux)
│   │   └── App.js              # Componente principal
│   └── package.json            # Dependências do frontend
└── README.md                   # Documentação do projeto
