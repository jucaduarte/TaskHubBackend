# TaskHub

TaskHub é uma aplicação web para controle e gerenciamento de tarefas, desenvolvida com React, Vite e TypeScript. O objetivo do projeto é fornecer uma interface intuitiva e escalável para organizar, criar, editar e acompanhar tarefas do dia a dia.

Autor: Juca Duarte
Email: jucaduarte@msn.com

## Principais Características

- Gerenciamento de tarefas (criação, edição, exclusão, conclusão)
- Interface moderna e responsiva
- Estrutura modular e escalável baseada em features
- Utilização de boas práticas com React, TypeScript e gerenciamento de estado

## Estrutura do Projeto

Abaixo está a estrutura principal do projeto, com uma breve descrição de cada pasta:

src/
│
├── assets/           # Imagens, ícones, fontes, etc.
├── components/       # Componentes reutilizáveis (Button, Modal, etc.)
├── features/         # Domínios ou módulos (ex: tasks, auth)
│   └── tasks/
│       ├── components/   # Componentes específicos de tasks (TaskList, TaskItem)
│       ├── hooks/        # Hooks customizados para tasks
│       ├── services/     # Lógica de acesso a dados (API, storage)
│       ├── models/       # Modelos e tipos TypeScript
│       ├── tasksSlice.ts # Estado (Redux, Zustand, etc.)
│       └── index.tsx     # Entry point do módulo
├── hooks/            # Hooks customizados globais
├── layouts/          # Layouts de página (ex: MainLayout)
├── pages/            # Páginas da aplicação (Home, TaskPage, etc.)
├── routes/           # Definição das rotas (React Router)
├── store/            # Configuração do estado global (Redux, Zustand, etc.)
├── styles/           # Estilos globais (CSS, SASS, Tailwind config)
├── utils/            # Funções utilitárias e helpers
├── App.tsx           # Componente raiz
└── main.tsx          # Entry point do Vite

## Tecnologias Utilizadas

- **React 19** – Biblioteca principal para construção da interface
- **Vite** (rolldown-vite) – Bundler e servidor de desenvolvimento rápido
- **TypeScript** – Tipagem estática para JavaScript
- **Bootstrap 5** e **Bootstrap Icons** – Estilização e ícones
- **React Bootstrap** – Componentes React baseados no Bootstrap
- **React Router DOM 7** – Roteamento SPA
- **Axios** – Requisições HTTP
- **ESLint** – Linter para padronização de código
- **Vitest** – Testes unitários rápidos
- **Testing Library** (React, Jest DOM, User Event) – Testes de componentes React
- **Weather API** – openweathermap.org - API externa para dados meteorológicos

## Como rodar o projeto

## Instalar
Para instalar e rodar o projeto localmente, siga os passos abaixo:
1. Clone o repositório: 
   ```bash
   git clone https://github.com/jucaduarte/TaskHubBackend.git

   2. Navegue até o diretório do projeto:
   ```bash
   cd TaskHubBackend
   ```

2. Instale as dependências: npm install

3. Inicie o servidor de desenvolvimento: npm run dev

4. Acesse em seu navegador: [http://localhost:5173](http://localhost:5173)

5. Para executar os testes unitários: npm run test

6. Para executar a interface de usuário dos testes: npm run test:ui

7. Para criar uma build de produção: npm run build
