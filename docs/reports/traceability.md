# Relatório de rastreabilidade do Birth Hub 360

Gerado em 2026-05-30T06:35:24.166277Z a partir do ZIP original analisado e de `birthub 360.txt`; os ZIPs binários foram removidos do Git conforme `docs/reports/binary-artifacts.md`.

## Inventário integral do ZIP original

| Caminho | Tipo | Bytes | SHA-256 |
|---|---:|---:|---|
| `plataforma/` | directory | 0 | `-` |
| `plataforma/.gitignore` | file | 84 | `0a72772db57827c8de7952b21b3d61d2a4c5830b6d36fd7a8eb5a2b61339c0b9` |
| `plataforma/client/` | directory | 0 | `-` |
| `plataforma/client/index.html` | file | 94883 | `3906a4f6b5a4a2893937fbcdd4dae82031a1a206e2b4bc26ef57a68f075faadf` |
| `plataforma/client/js/` | directory | 0 | `-` |
| `plataforma/client/js/roles_data.js` | file | 58002 | `a2c73003d96e9aafdcd63bab70f823a5514edd0e111fb117413ec8cf975a0756` |
| `plataforma/client/prototype_v1.html` | file | 23679 | `a44f2d45c1d6889efc530191a8ab0592443d7a23cb46b23720b49ba59bff2c55` |
| `plataforma/expand_all_tools.py` | file | 1179 | `07a4056d925474ff60687def41048fe80bc799c702d0bf0e040246222d830aba` |
| `plataforma/ROADMAP.md` | file | 4244 | `c2c7b59e5ecd5c27f737353e7bd0b971cde76a13f04cc43a0caefab0232f991f` |
| `plataforma/server/` | directory | 0 | `-` |
| `plataforma/server/config/` | directory | 0 | `-` |
| `plataforma/server/config/database.js` | file | 268 | `47b7379b79b43a618f63c26512887338aa323b1445d0ddf4857c3e7ab4802bc5` |
| `plataforma/server/index.js` | file | 922 | `a81a84897c4a327bcc1d6faca4b3e558393a8b4715138141394ca678b2258c90` |
| `plataforma/server/initDb.js` | file | 1688 | `8a2eb2bfb6538f2ea208841760f1ba44956b6723472dcd2b75d20a4ae9a1e3f8` |
| `plataforma/server/models/` | directory | 0 | `-` |
| `plataforma/server/models/Contact.js` | file | 544 | `3d491b522e78c058ed0e3b7ce50f5b08e6c285412317c3906d16e4396684da6a` |
| `plataforma/server/models/Deal.js` | file | 625 | `0497ec8d4f1016b53f26eb2d90ba2342ca19619a7138de9e721e89e36169aefc` |
| `plataforma/server/package-lock.json` | file | 87516 | `1f50cd2020c2482184e145669df8d14d28a1794533ff1a080360f1393bd5ec26` |
| `plataforma/server/package.json` | file | 421 | `cefdde2ddd8fef723be7650466954bc53a4b79311e38644b6845beba4f05605c` |
| `plataforma/server/routes/` | directory | 0 | `-` |
| `plataforma/server/routes/ai.js` | file | 23626 | `9a9d6a37e456d1d215ccaf9ce12d3b681fd832483f33db82b07dc3fb7a9d132f` |
| `plataforma/server/routes/contacts.js` | file | 1038 | `8af923fe93b6117ac53eb882f5e2b31fb0a1b2f16c2a109ee94bb20331d9b27d` |
| `plataforma/server/routes/deals.js` | file | 1598 | `0fc923c10e829150dd233329fec89b8eef567450295d400a6c40b1e70b306e01` |
| `plataforma/server/server_deals.log` | file | 275 | `49662e42bf0bd64b283bdb9bd6925661b4dfa1a0716b6dd0f3cc5400d7e59f06` |
| `plataforma/SPECIFICATION.md` | file | 10027 | `4ce386c6b98b2934fa05b1e629aefeaa3617abf24b410b671e442073e1f267c8` |
| `plataforma/upgrade_roles.py` | file | 1438 | `be596dcecb2b6c303527e08595f466f319f6e00b00f799347ca92a15ddc13c6c` |
| `plataforma/birthub 360.txt` | file | 132348 | `c2a05963ff0fcce1285608413a62ed564c3504a10d84e1188907795046f9e5e2` |

## Classificação e decisão de reconstrução

- `client/index.html`: promovido como frontend principal de alta fidelidade e conectado à API via URL relativa.
- `client/js/roles_data.js`: preservado como catálogo estrutural de cargos, KPIs, gatilhos, widgets e ferramentas por role.
- `client/prototype_v1.html`: arquivado como `docs/legacy/prototype_v1.html`; não é fonte primária do runtime reconstruído para evitar chamada direta a IA no cliente.
- `server/**`: promovido para backend HTTP nativo/JSON persistente, com inicialização separada, CRUD persistente e testes automatizados; as rotas Express legadas foram arquivadas em `docs/legacy/server-routes-original/`.
- `ROADMAP.md` e `SPECIFICATION.md`: preservados como requisitos recuperados e base de evolução do SaaS.
- `expand_all_tools.py` e `upgrade_roles.py`: preservados como scripts históricos de expansão do protótipo.
- `server/server_deals.log`: preservado como log histórico bruto, sem uso no runtime.
- `birthub 360.txt`: preservado em `docs/legacy/birthub-360-original.txt` como material bruto integral.
- Artefatos ZIP/binários: removidos do versionamento; hashes e inventário seguem neste relatório, e a política está em `docs/reports/binary-artifacts.md`.

## Segurança aplicada

- O frontend principal não contém chave de IA embutida e usa `/api/ai/*` no backend.
- O servidor agora serve o frontend e a API no mesmo origin, evitando dependência rígida de `localhost:3000`.
- Payloads de contatos e deals são normalizados e validados antes da persistência.
- A fase 2 adicionou login real, tokens HMAC, validação de tenant e trilha de atividades; detalhes em `docs/reports/phase-2-hardening.md`.

## Pendências conscientes

- Cobrança, RBAC granular e recuperação de senha continuam no roadmap de produto.
- Integrações Slack/Jira/Gemini reais permanecem simuladas até definição de credenciais e provedores.
- Os arquivos originais foram preservados para auditoria; conteúdo obsoleto não foi inserido à força no runtime.
