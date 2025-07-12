# Todo App Frontend

![Next.js](https://img.shields.io/badge/Next.js-13.x-blue?logo=next.js&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue?logo=typescript&style=flat-square)
![React](https://img.shields.io/badge/React-18.x-blue?logo=react&style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

> Frontend moderno para gerenciamento de tarefas, construído com Next.js 13, TypeScript e React, seguindo as melhores práticas de UX/UI, performance e arquitetura.

---

## Índice

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Como Contribuir](#como-contribuir)
- [Licença](#licença)
- [Contato](#contato)

---

## Sobre

Este projeto é o frontend de um sistema Todo, consumindo uma API local para operações CRUD de tarefas. Construído com Next.js 13 (App Router), TypeScript e React, focando em:

- UI/UX simples e eficiente com modais para criação e edição.
- Tratamento robusto de datas, filtros, paginação e estados de carregamento.
- Código modular e limpo, com hooks customizados para lógica de negócios.
- Performance otimizada e carregamento dinâmico onde aplicável.

---

## Funcionalidades

- Listagem de tarefas com paginação e filtro por status (todas, pendentes, concluídas).
- Busca dinâmica por título.
- Criação, edição e exclusão de tarefas via modais.
- Marcar tarefas como concluídas diretamente da lista.
- Tratamento visual para tarefas atrasadas.
- Responsivo e acessível.

---

## Tecnologias Utilizadas

- [Next.js 13](https://nextjs.org/) (App Router)
- [React 18](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Axios](https://axios-http.com/) para requisições HTTP
- [Lucide Icons](https://lucide.dev/) para ícones SVG
- [Tailwind CSS](https://tailwindcss.com/) para estilização

---

## Pré-requisitos

- Node.js v18+ instalado
- npm ou yarn ou pnpm (gerenciador de pacotes)
- API backend local rodando na porta 3001 (ou ajuste a variável de ambiente)

---

## Instalação e Execução

Clone o repositório:

```bash
git clone https://github.com/VictorRochaSilva/todo-frontend.git
cd todo-frontend
```

Instale as dependências:

```bash
npm install
# ou
yarn
# ou
pnpm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```