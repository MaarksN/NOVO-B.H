# Phase 2 — Hardening SaaS mínimo

Esta fase executa o próximo plano lógico após a reconstrução inicial: transformar a API aberta em uma base SaaS minimamente isolada e auditável.

## Entregas

- Autenticação real via `POST /api/auth/login` com senha PBKDF2 e token HMAC com expiração.
- Rotas de negócio protegidas por `Authorization: Bearer <token>` e validação de `X-Tenant-Id`.
- Isolamento lógico por `tenantId` para contatos, deals, atividades e seeds.
- Registro de atividades para criação, atualização, deleção e execução de ferramentas IA.
- Frontend conectado ao login real, com sessão em `localStorage`, headers autenticados e logout efetivo.
- Testes automatizados cobrindo autenticação, proteção de API, isolamento por tenant, CRUD e auditoria.

## Credenciais de desenvolvimento

O seed local cria o usuário de demonstração abaixo, somente para desenvolvimento:

- E-mail: `ana@birthhub.com`
- Senha: `123456`
- Tenant: `birthhub-demo`

Em ambientes compartilhados ou produção, substituir por variáveis `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` e `AUTH_SECRET`.

## Riscos restantes

- O token HMAC nativo é adequado para o MVP local, mas em produção deve ser substituído por um provedor de identidade gerenciado ou por JWT com rotação formal de chaves.
- O datastore JSON continua intencionalmente simples; produção deve migrar para PostgreSQL/Supabase com constraints, índices e backups.
- Ainda não há signup público, recuperação de senha, RBAC granular ou cobrança recorrente.
