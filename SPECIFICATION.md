Aqui está a especificação arquitetural completa do Birth Hub 360 Innovation, executada conforme o prompt desenhado, cobrindo todas as funções da estrutura comercial.

Especificação Funcional: Birth Hub 360 Innovation
Grupo 1: Prospecção (Top-of-Funnel)
#### 1.1 LDR (Lead Development Representative)
Foco: Inteligência de Dados e Construção de Listas.

1. Visão do Sales Cockpit

KPIs: Novos Leads Gerados/Dia, Taxa de Validez de E-mail/Telefone, Cobertura de Dados por Conta (Preenchimento do CRM), Taxa de Aceitação da Lista (pelo BDR/SDR).

Widgets de Ação: "Validador em Lote", "Higienização de Lista Pendente", "Exportar para CRM".

2. Funcionalidade do Radar de Oportunidades

Foco: Identificar "buracos" de dados e novas empresas no TAM (Total Addressable Market).

Gatilhos:

Alerta de ICP: "Nova empresa detectada no LinkedIn que corresponde a 95% dos critérios de ICP."

Alerta de Movimentação: "Decision Maker mudou de emprego (atualizar contato)."

3. Automações e Integrações

Gemini: "Enriquecimento de Perfil" -> O Gemini varre o site da empresa e LinkedIn para preencher automaticamente: Tech Stack, Resumo da Empresa e Últimas Notícias no CRM.

Slack: Notificação diária: "Resumo da Manhã: 50 novos leads enriquecidos prontos para distribuição."

Jira: N/A (Foco em dados, não produto).

#### 1.2 BDR (Business Development Representative)
Foco: Prospecção Outbound (Cold).

1. Visão do Sales Cockpit

KPIs: Atividades Diárias (Calls/Emails), Taxa de Conexão, Reuniões Agendadas (SALs), Taxa de Conversão (Lista -> Reunião).

Widgets de Ação: "Próximo na Cadência" (Dialer integrado), "Personalizar E-mail em Massa", "Testar Pitch A/B".

2. Funcionalidade do Radar de Oportunidades

Foco: Timing de abordagem (Trigger events).

Gatilhos:

Sinal de Compra: "Empresa Alvo acabou de receber Série B de investimento."

Sinal de Dor: "Empresa Alvo abriu 5 vagas para [Cargo que sua ferramenta substitui/ajuda]."

3. Automações e Integrações

Gemini: "Gerador de Icebreakers" -> Gemini analisa o último post do LinkedIn do lead e sugere a primeira frase do e-mail de prospecção.

Slack: "Alerta de Engajamento: Lead Quente abriu seu e-mail 5 vezes na última hora."

Jira: N/A.

#### 1.3 SDR (Sales Development Representative)
Foco: Qualificação Inbound (Leads de Marketing).

1. Visão do Sales Cockpit

KPIs: Tempo de Resposta (Speed to Lead), Lead Response Rate, Reuniões Agendadas (SQLs), Qualidade do Lead (Lead Scoring médio).

Widgets de Ação: "Fila de Novos Leads (Priorizada por Score)", "Reagendamento Rápido", "Desqualificar Lead".

2. Funcionalidade do Radar de Oportunidades

Foco: Priorização baseada em comportamento digital.

Gatilhos:

Alta Intenção: "Lead visitou a página de Preços 3 vezes hoje."

Reativação: "Lead antigo (Lost) baixou um novo eBook."

3. Automações e Integrações

Gemini: "Analista de Pré-Call" -> Resume todo o histórico de marketing do lead (páginas visitadas, e-mails clicados) em 3 bullet points antes da ligação.

Slack: "Alerta Speed-to-Lead: Novo Demo Request recebido. Ligue agora!"

Jira: N/A.

Grupo 2: Fechamento (Core Sales)
#### 2.1 AE (Account Executive)
Foco: Demonstração, Negociação e Fechamento.

1. Visão do Sales Cockpit

KPIs: Pipeline Total, Forecast Ponderado, Taxa de Conversão (Demo -> Close), Ciclo Médio de Vendas, Ticket Médio.

Widgets de Ação: "Pipeline Review (Arrastar Cards)", "Gerar Contrato", "Follow-up Atrasado".

2. Funcionalidade do Radar de Oportunidades

Foco: Aceleração de deal e reativação.

Gatilhos:

Risco de Deal: "Deal estagnado na etapa 'Negociação' há mais de 10 dias."

Multithreading: "Novo stakeholder (Diretor Financeiro) adicionado à thread de e-mail pelo cliente."

3. Automações e Integrações

Gemini: "Assistente de Follow-up" -> Ouve a gravação da Demo e gera um e-mail de follow-up citando as dores específicas mencionadas e os próximos passos acordados.

Slack: "Comemoração: Contrato assinado com [Empresa]! Valor: R$ [Valor]."

Jira: Integração bidirecional: "Cliente solicitou Feature X como condição de fechamento" -> Cria Ticket no Jira -> Notifica AE quando Ticket for resolvido/agendado.

Grupo 3: Pós-Venda (Retenção e Expansão)
#### 3.1 Account Manager (Farmer)
Foco: Expansão de Receita (Upsell/Cross-sell) e Renovação.

1. Visão do Sales Cockpit

KPIs: Net Revenue Retention (NRR), Pipeline de Expansão, Taxa de Renovação, Mapa de Carteira (Tierização).

Widgets de Ação: "Criar Oportunidade de Upsell", "Agendar Revisão de Contrato", "Enviar Proposta de Renovação".

2. Funcionalidade do Radar de Oportunidades

Foco: White Space Analysis (O que o cliente não comprou ainda).

Gatilhos:

Sinal de Crescimento: "Cliente atingiu 90% do limite de licenças contratadas (Gatilho de Upsell)."

Cross-Sell: "Cliente usa Módulo A, mas tem perfil ideal para Módulo B (baseado em clientes similares)."

3. Automações e Integrações

Gemini: "Gerador de Business Case" -> Analisa o uso atual do cliente e gera um slide deck justificando o ROI de um upgrade de plano.

Slack: "Alerta de Vencimento: Contrato da [Empresa] vence em 60 dias. Iniciar renovação."

Jira: Acompanhamento de solicitações de funcionalidades que bloqueiam uma expansão.

#### 3.2 CSM (Customer Success Manager)
Foco: Adoção, Saúde (Health Score) e Prevenção de Churn.

1. Visão do Sales Cockpit

KPIs: Health Score da Carteira, Time to Value (Onboarding), Taxa de Adoção de Features, NPS/CSAT.

Widgets de Ação: "Playbook de Risco", "Agendar QBR (Quarterly Business Review)", "Plano de Sucesso".

2. Funcionalidade do Radar de Oportunidades

Foco: Detecção precoce de Risco de Churn.

Gatilhos:

Risco Crítico: "Queda de 30% nos logins semanais nos últimos 15 dias."

Sinal de Risco: "Campeão (Key User) saiu da empresa (verificado via LinkedIn)."

3. Automações e Integrações

Gemini: "Analista de Feedback" -> Lê todos os tickets de suporte e comentários de NPS do cliente e resume o sentimento geral para a reunião de QBR.

Slack: "Alerta Vermelho: Cliente [Nome] caiu para Health Score 'Crítico'. Iniciar Playbook de Resgate."

Jira: "Cliente reportou Bug crítico na reunião" -> Cria Bug no Jira diretamente do Cockpit do CSM.

Grupo 4: Gestão e Liderança
#### 4.1 Sales Manager
Foco: Gestão de Time e Coaching.

1. Visão do Sales Cockpit

KPIs: % da Meta do Time, Atividades por Rep, Taxa de Conversão por Etapa do Funil, Forecast do Mês.

Widgets de Ação: "Ouvir Call (Gong/Call Tracker)", "Aprovar Desconto", "Revisão de 1:1".

2. Funcionalidade do Radar de Oportunidades

Foco: Identificação de gargalos de performance humana.

Gatilhos:

Coaching: "Rep [Nome] tem taxa de agendamento 20% abaixo da média do time."

Sandbagging: "Rep tem 5 deals com fechamento para 'amanhã' sem atividade registrada há 7 dias."

3. Automações e Integrações

Gemini: "Coach Virtual" -> Analisa as últimas 10 calls do Rep e aponta: "O Rep está falando 70% do tempo. Sugira fazer mais perguntas abertas na próxima 1:1."

Slack: "Resumo Diário do Time: X reuniões agendadas, Y reais em pipeline criado hoje."

Jira: N/A.

#### 4.2 Head of Sales / Diretor
Foco: Estratégia e P&L.

1. Visão do Sales Cockpit

KPIs: CAC (Custo de Aquisição), LTV (Lifetime Value), MRR/ARR Total, Forecast Trimestral/Anual, Churn Rate Financeiro.

Widgets de Ação: "Ajustar Cotas", "Simular Cenário de Forecast", "Relatório para Board".

2. Funcionalidade do Radar de Oportunidades

Foco: Tendências de Mercado e Macro-riscos.

Gatilhos:

Mercado: "Queda na conversão global do segmento 'Varejo' nos últimos 2 meses."

Competitividade: "Aumento de 15% na menção do Competidor X nas calls de perda (Loss Reasons)."

3. Automações e Integrações

Gemini: "Sintetizador de Estratégia" -> "Analise os motivos de perda do último trimestre e sugira 3 ajustes na proposta de valor."

Slack: "Fechamento de Mês: Atingimos 105% da meta global! Parabéns ao time."

Jira: Visualizar painel macro de "Roadmap de Produto vs. Impacto em Receita".

Grupo 5: Suporte e Operações (Enablement)
#### 5.1 Sales Ops
Foco: Processos e Higiene de Dados.

1. Visão do Sales Cockpit

KPIs: Adoção do CRM (% campos preenchidos), Acurácia do Forecast, Ciclo de Venda Médio por Canal, Conversão Funil Completo.

Widgets de Ação: "Auditoria de Pipeline", "Reatribuir Leads Órfãos", "Configurar Regras de Automação".

2. Funcionalidade do Radar de Oportunidades

Foco: Detecção de falhas no processo.

Gatilhos:

Erro de Processo: "50 Leads estão estagnados na etapa 'Novo' há mais de 48h (sem dono)."

Integridade de Dados: "Detectada duplicação de contas acima do normal na última importação."

3. Automações e Integrações

Gemini: "Auditor de CRM" -> Identifica padrões de preenchimento incorreto (ex: telefones sem DDD, nomes em caixa baixa) e sugere correções em lote.

Slack: "Alerta de Sistema: Integração com Marketing apresentou falha. Verifique imediatamente."

Jira: Criar tickets para o time de Engenharia de Dados sobre falhas na integração do CRM.

#### 5.2 Sales Enablement
Foco: Treinamento e Conteúdo.

1. Visão do Sales Cockpit

KPIs: Tempo de Rampagem (Novos Reps), Uso de Conteúdo (Materiais enviados), Correlação Treinamento vs. Performance.

Widgets de Ação: "Publicar Novo Playbook", "Atribuir Treinamento", "Analisar Gaps de Skill".

2. Funcionalidade do Radar de Oportunidades

Foco: Gaps de conhecimento.

Gatilhos:

Gap de Conteúdo: "Reps estão perdendo deals na fase de 'Objeção de Preço'. Necessário reforço em negociação."

Baixa Adoção: "Novo deck de vendas foi usado em apenas 10% das reuniões desta semana."

3. Automações e Integrações

Gemini: "Criador de Roleplay" -> Gera cenários de simulação de vendas para treinamento baseados nas objeções reais mais comuns encontradas nas gravações de calls recentes.

Slack: "Dica do Dia: Use o novo Case de Sucesso X para clientes do setor Y."

Jira: N/A.
