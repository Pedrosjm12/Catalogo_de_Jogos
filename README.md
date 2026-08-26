# Catálogo de Jogos

Aplicação full-stack com backend em Node.js + Express + TypeScript + Prisma + SQLite e frontend em React + Vite.

## Estrutura

- `backend/` — API REST e banco de dados
- `frontend/` — interface para consumo da API

## Como rodar

### Backend

1. Crie uma chave no RAWG e configure no arquivo `.env` do backend:

```bash
RAWG_API_KEY="SUA_CHAVE_RAWG_AQUI"
```

2. Rode:

```bash
cd backend
npm install
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

Para rodar os testes automatizados:

```bash
npm run test
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Endpoints principais

- `GET /api/games` (aceita `?page=` e `?pageSize=` opcionais para paginação; sem eles, retorna a lista completa)
- `GET /api/games/search?q=nome-do-jogo`
- `GET /api/games/:id`
- `POST /api/games`
- `PUT /api/games/:id`
- `DELETE /api/games/:id`
- `GET /api/games/featured`

## Campos do jogo

- `title`
- `platform`
- `developer`
- `status` (`JOGANDO`, `ZERADO`, `QUERO_JOGAR`)
- `favorite`
- `rating`
- `releaseDate`
- `coverUrl`

## Observações

- A listagem principal ordena do mais recente para o mais antigo.
- A rota `featured` retorna jogos favoritados ou com melhor nota.
- A nota só pode ser preenchida para jogos com status `JOGANDO` ou `ZERADO`.
- O arquivo `backend/.env` é local e não deve ser enviado ao GitHub. Use `backend/.env.example` como modelo.
- `CORS_ORIGIN` no `.env` define as origens permitidas (separadas por vírgula). Se omitida, o CORS libera qualquer origem — recomendado apenas em desenvolvimento.
- Validação de entrada (formato, tipos e obrigatoriedade) é feita com `zod` na borda da API; erros de validação retornam `400` com a lista de campos inválidos.
