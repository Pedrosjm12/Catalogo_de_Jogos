<img width="1527" height="876" alt="Print5" src="https://github.com/user-attachments/assets/c0b45e1a-f30e-4f49-aa5d-ad880f66ec2d" />
<img width="1507" height="712" alt="Print4" src="https://github.com/user-attachments/assets/2d989461-d739-49a4-9050-a7f172236e7c" />
<img width="1537" height="765" alt="Print3" src="https://github.com/user-attachments/assets/efa0cab1-ea40-4f2a-8c6a-1b6356053119" />
<img width="1531" height="892" alt="Print2" src="https://github.com/user-attachments/assets/d826e312-510d-4a07-b12b-4a04d874bdca" />
<img width="1552" height="890" alt="Print1" src="https://github.com/user-attachments/assets/90384e13-4fde-4dd8-a40f-60d489a4bf02" />
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

## Autenticação

O catálogo é por usuário: cada conta só vê e gerencia os próprios jogos. A sessão é um JWT em cookie `httpOnly` (não fica acessível via JavaScript no navegador).

- `POST /api/auth/register` — `{ username, email, password }`
- `POST /api/auth/login` — `{ email, password }`
- `POST /api/auth/logout`
- `GET /api/auth/me` — retorna o usuário da sessão atual

Todas as rotas em `/api/games*` exigem sessão ativa (cookie enviado automaticamente pelo navegador).

Ao migrar o banco para o modelo com usuários, os jogos que já existiam no `dev.db` foram atribuídos a uma conta padrão:

```
E-mail: gamer_pro@example.com
Senha:  GamerPro123!
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
- Senhas são armazenadas com hash (`bcryptjs`), nunca em texto puro. `JWT_SECRET` no `.env` assina os tokens de sessão — gere uma chave própria (`openssl rand -hex 48`) antes de qualquer uso além do dev local.
- As rotas de `/api/auth/register` e `/api/auth/login` têm limite de tentativas por IP (10 por minuto) para dificultar força bruta.<img width="1527" height="885" alt="Print2" src="https://github.com/user-attachments/assets/3c053c9e-c020-46d0-8b92-a4cc0aabc289" />
<img width="1607" height="907" alt="Print1" src="https://github.com/user-attachments/assets/d1bbcadd-b05f-4f6e-891d-bce9897017d6" />

