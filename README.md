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
- As rotas de `/api/auth/register` e `/api/auth/login` têm limite de tentativas por IP (10 por minuto) para dificultar força bruta.

## Imagens 

<img width="1502" height="751" alt="print7" src="https://github.com/user-attachments/assets/a4b8a573-6545-4fad-8678-b0ebf0701e81" />
<img width="1530" height="635" alt="print6" src="https://github.com/user-attachments/assets/cbf8cb73-3fda-40bc-ab93-056c3a286289" />
<img width="1550" height="407" alt="Print5" src="https://github.com/user-attachments/assets/ba97aa17-e892-4671-92b9-4d6ad92c9381" />
<img width="1552" height="890" alt="Print1" src="https://github.com/user-attachments/assets/caaee0d8-b1ce-4958-bd9c-20a19495e9b5" />
<img width="1531" height="892" alt="Print2" src="https://github.com/user-attachments/assets/2858a545-f5e9-467a-a655-4f1dc1dbb204" />
<img width="1537" height="765" alt="Print3" src="https://github.com/user-attachments/assets/e069f931-3c16-4412-8dfd-be2f1713b734" />
<img width="1507" height="712" alt="Print4" src="https://github.com/user-attachments/assets/3034fc8e-0c6d-43b9-97f8-71f16d72fcde" />



