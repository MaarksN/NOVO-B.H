# Birth Hub 360

Reconstrução consolidada da plataforma **Birth Hub 360** a partir do conteúdo extraído do ZIP original e do material bruto (`birthub 360.txt`). Artefatos ZIP/binários não são versionados; consulte `docs/reports/binary-artifacts.md`.

## O que foi entregue

- Frontend principal preservado em `client/index.html`, agora consumindo a API por URL relativa (`/api/*`) em vez de depender de `http://localhost:3000` hardcoded.
- Backend sem dependências externas em `server/`, com API HTTP nativa, persistência JSON local, seed inicial, CRUD de contatos e deals e endpoints simulados de IA.
- Catálogo de roles, KPIs, widgets, gatilhos e ferramentas preservado em `client/js/roles_data.js`.
- Materiais originais textuais e relatório de rastreabilidade preservados em `docs/legacy/` e `docs/reports/traceability.md`; ZIPs são geráveis localmente e ignorados no Git.

## Como executar

```bash
cd server
npm start
```

A aplicação fica disponível em `http://localhost:3000`. O seed local cria o login de desenvolvimento `ana@birthhub.com` / `123456`.

## Como testar

```bash
cd server
npm test
```

Os testes usam `node --test`, sobem o servidor em porta efêmera e validam status público, autenticação, isolamento por tenant, CRUD de deals, CRUD de contatos, auditoria e uma rota de IA.

## Persistência

Por padrão, o backend grava dados em `database.json` na raiz do repositório, com coleções para tenants, usuários, contatos, deals e atividades. Para alterar o local:

```bash
JSON_STORAGE=/tmp/birth-hub-360.json npm start
```

## Materiais preservados

- `docs/legacy/birthub-360-original.txt`: material bruto integral.
- `docs/reports/traceability.md`: inventário de todos os arquivos do ZIP original, hashes e decisão arquitetural sobre cada categoria de conteúdo.
- `docs/reports/binary-artifacts.md`: política de remoção de binários e instrução para gerar ZIP local quando necessário.

## Segurança e autenticação

- `POST /api/auth/login` valida usuário/senha e retorna token HMAC com expiração.
- Rotas `/api/contacts`, `/api/deals`, `/api/ai/*` e `/api/activities` exigem `Authorization: Bearer <token>`.
- `X-Tenant-Id` é validado contra o tenant do token para evitar acesso cruzado.
- Defina `AUTH_SECRET` fora do repositório em qualquer ambiente não local.

## Entrega compactada local

Arquivos `.zip` e outros binários são ignorados pelo Git. Para gerar a entrega compactada fora do controle de versão:

```bash
python3 scripts/create-deliverable-zip.py
```

## Próximas evoluções recomendadas

- Banco gerenciado (PostgreSQL/Supabase) para produção.
- Proxy real para Gemini/OpenAI com chaves somente no servidor.
- RBAC granular, recuperação de senha, convite de usuários e billing recorrente.
