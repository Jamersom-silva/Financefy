💸 Financefy

Bem-vindo ao Financefy — seu novo sistema pessoal de controle financeiro ✨
Criado para ajudar pessoas a organizarem suas finanças de forma simples, visual e inteligente.

A ideia por trás do Financefy é oferecer uma ferramenta moderna e segura onde cada usuário pode acompanhar seus gastos, receitas, extratos, relatórios e ainda anexar comprovantes e faturas em PDF.
Tudo isso com uma experiência fluida no frontend React e uma API robusta em Django.

🎯 Propósito do Projeto

O Financefy nasceu como um projeto completo para demonstrar habilidades reais de desenvolvimento full stack.
Aqui você encontra:

Autenticação segura com JWT e Refresh Token por cookie HttpOnly

API REST profissional com Django REST Framework

Integração total com o frontend em React

Upload seguro de PDFs

Relatórios financeiros e categorização de despesas

Uma base perfeita para evoluir para um sistema financeiro real

Além de servir como case para estudos, entrevistas e portfólio — é um projeto que você pode realmente usar no seu dia a dia para organizar sua vida financeira.

✨ Principais Funcionalidades
🏦 Gestão de Contas

Cadastre suas contas bancárias ou carteiras

Acompanhe saldo inicial e saldo atualizado automaticamente

💰 Transações Inteligentes

Registre receitas e despesas

Categorize gastos (ex.: Alimentação, Lazer, Saúde…)

Acompanhe valores, datas e descrições

Tudo filtrável e organizado

📊 Relatórios Visuais

Relatório Mensal: Veja o balanço de receitas, despesas e saldo

Relatório por Categoria: Visualize onde você mais gasta

Ideais para entender padrões financeiros

📎 Gestão de Anexos

Envie PDFs como faturas e comprovantes

Cada arquivo é validado e armazenado com segurança

Organizado por transações e grupos de anexos

🔐 Autenticação Segura

Login via JWT (token de acesso + refresh seguro via cookie HttpOnly)

Somente o usuário tem acesso às suas contas, transações e anexos

Pensado para privacidade e segurança real

🧰 Tecnologias Utilizadas
🖥️ Backend

Django 5

Django REST Framework

SimpleJWT (com refresh seguro por cookie)

Django Filter

DRF Spectacular (Swagger e ReDoc)

SQLite

💻 Frontend

React + TypeScript

Context API para autenticação

Axios para comunicação com backend

Gráficos modernos para relatórios

🧱 Infraestrutura

Ambiente isolado com venv

Estrutura limpa e modular

Suporte a deploy futuro

🚀 Como Rodar o Projeto
📌 1. Clone o repositório
git clone https://github.com/username/financefy.git
cd financefy

🛠️ Backend (Django) — Configuração
▶️ 1. Crie o ambiente virtual
python -m venv .venv


Ative:

Windows

.venv\Scripts\activate


Linux/Mac

source .venv/bin/activate

▶️ 2. Instale dependências
pip install -r backend/requirements.txt

▶️ 3. Migre o banco de dados
python backend/manage.py migrate

▶️ 4. Crie um usuário administrativo
python backend/manage.py createsuperuser

▶️ 5. Inicie o servidor
python backend/manage.py runserver


A API estará disponível em:

🔗 http://127.0.0.1:8000/api/docs

(Interface Swagger pronta para uso!)

💻 Frontend (React) — Configuração
▶️ 1. Acesse o frontend
cd financefy-web

▶️ 2. Instale dependências
npm install

▶️ 3. Inicie o projeto
npm start


A aplicação estará disponível em:
🔗 http://localhost:5173

🤝 Contribuindo

Este projeto foi pensado para ser expandido.
Ideias de evolução:

Dashboard com IA para previsões financeiras

Exportação de relatórios em PDF

Suporte a múltiplos bancos

Pull requests são sempre bem-vindos!

❤️ Finalizando

O Financefy é mais do que um projeto:
é uma demonstração real de backend profissional, frontend moderno e boas práticas de segurança.

Se você está construindo seu portfólio, parabéns — esse projeto impressiona recrutadores 👏
E se estiver usando para aprendizado, melhor ainda: aqui você treina Django, React, JWT, segurança, organização de pastas e muito mais.