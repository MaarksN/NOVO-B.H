# Roadmap: De Protótipo para Produto Vendável (SaaS)

Este documento descreve as etapas necessárias para transformar o atual protótipo frontend do **Birth Hub 360** em um produto SaaS (Software as a Service) comercializável, seguro e escalável.

## 1. Diagnóstico Atual

*   **Frontend**: Interface moderna e responsiva em HTML/JS/Tailwind. Estrutura de navegação (Dashboard, Kanban, Tabelas) está pronta.
*   **Lógica**: Execução 100% no navegador (Client-side). Dados são perdidos ao recarregar a página.
*   **IA**: Chamadas diretas à API do Google Gemini no frontend.
    *   *Risco Crítico*: Exposição da API Key se publicada assim.
*   **Autenticação**: Simulação visual. Não há login real, recuperação de senha ou controle de sessão.
*   **Dados**: Dados mockados (fictícios) e estáticos.

---

## 2. Lacunas Críticas (O que falta para vender?)

Para cobrar mensalidade (SaaS), você precisa entregar **persistência, segurança e valor contínuo**.

### A. Backend e Banco de Dados (A "Memória" do Sistema)
O sistema precisa salvar os dados dos clientes.
*   **Ação Necessária**: Implementar um servidor API.
    *   *Sugestão*: Node.js (Express/NestJS) ou Python (FastAPI).
*   **Banco de Dados**:
    *   *Sugestão*: PostgreSQL (para usuários, empresas, deals, contatos).
*   **Funcionalidades**:
    *   Salvar/Editar/Deletar Contatos e Deals.
    *   Mover cards no Kanban e persistir a mudança.
    *   Histórico de atividades.

### B. Segurança e Autenticação
*   **Ação Necessária**: Implementar login real.
    *   *Sugestão Rápida*: Usar serviços como **Supabase Auth**, **Clerk** ou **Firebase Auth** para gerenciar logins, senhas e e-mails de confirmação.
*   **Proteção de API**: A chave do Gemini (`apiKey`) deve ficar escondida no servidor. O frontend pede ao seu servidor, e seu servidor pede ao Gemini.

### C. Integração de Pagamentos
*   **Ação Necessária**: Cobrança de assinatura (Recorrência).
    *   *Sugestão*: Integração com **Stripe** ou **Asaas** (Brasil).
    *   Bloqueio de recursos para usuários inadimplentes.

### D. Multi-Tenancy (Isolamento de Dados)
*   **Conceito**: O Cliente A não pode ver os dados do Cliente B.
*   **Ação**: Estruturar o banco de dados para que cada consulta filtre pelo `company_id` do usuário logado.

---

## 3. Plano de Execução (Passo a Passo)

### Fase 1: Fundação (2-3 Semanas)
1.  **Setup do Projeto**: Separar em pastas `frontend` e `backend`.
2.  **Banco de Dados**: Criar tabelas `users`, `companies`, `deals`, `contacts`.
3.  **API Básica**: Criar rotas para criar e ler esses dados.
4.  **Conexão**: Alterar o `index.html` para buscar dados dessa API em vez de usar dados falsos.

### Fase 2: Inteligência e Segurança (2 Semanas)
1.  **Proxy de IA**: Mover a função `callGeminiAPI` para o backend.
2.  **Contexto**: Fazer a IA ler os dados do banco (ex: "Analise o deal X") em vez de apenas o que o usuário digita na hora.
3.  **Autenticação**: Implementar tela de login real.

### Fase 3: Funcionalidades "Premium" (Spec) (3-4 Semanas)
1.  **Integrações**: Conectar com Slack (enviar notificações) e e-mail.
2.  **Roles**: Criar permissões diferentes para "Vendedor" e "Gerente" (conforme sua Spec).
3.  **Voice/Audio**: Implementar upload de arquivos para a IA analisar chamadas reais.

### Fase 4: Go-to-Market (1 Semana)
1.  **Pagamentos**: Configurar planos no Stripe/Asaas.
2.  **Deploy**: Publicar frontend (Vercel/Netlify) e backend (Railway/Render/AWS).
3.  **Domínio**: Configurar `app.birthhub.com`.

---

## 4. Tecnologias Recomendadas (Stack)

*   **Frontend**: React ou Vue.js (migrar o HTML atual para um framework facilitará muito a manutenção), ou manter HTML+HTMX para simplicidade.
*   **Backend**: Node.js ou Python.
*   **Banco de Dados**: PostgreSQL (Supabase é uma ótima opção "tudo em um").
*   **Hospedagem**: Vercel (Front) + Railway (Back/DB).

---

## 5. Resumo da Análise de Código

O código atual é um **Protótipo de Alta Fidelidade**. Ele é excelente para vender a *visão* para investidores ou primeiros clientes (demo), mas tecnicamente ainda não é um *produto* funcional. O trabalho pesado de engenharia (backend) começa agora.
