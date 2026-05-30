const express = require('express');
const router = express.Router();

// ==========================================
// REVENUE PREDICTOR
// ==========================================
router.post('/revenue-predictor', async (req, res) => {
    try {
        const { mrr, growth_rate, churn_rate, months } = req.body;
        
        // Validation
        if (!mrr || !growth_rate || !churn_rate || !months) {
            return res.status(400).json({ error: 'Todos os parâmetros são obrigatórios.' });
        }

        const initialMrr = parseFloat(mrr);
        const growth = parseFloat(growth_rate) / 100;
        const churn = parseFloat(churn_rate) / 100;
        const period = parseInt(months);

        const labels = [];
        const baseScenario = [];
        const optimisticScenario = [];
        const pessimisticScenario = [];

        let currentBase = initialMrr;
        let currentOptimistic = initialMrr;
        
        // Simulation Loop
        for (let i = 1; i <= period; i++) {
            labels.push(`Mês ${i}`);
            
            // Base: Growth - Churn
            currentBase = currentBase * (1 + (growth - churn));
            baseScenario.push(Math.round(currentBase));

            // Optimistic: 20% more growth, 20% less churn
            const optGrowth = growth * 1.2;
            const optChurn = churn * 0.8;
            currentOptimistic = currentOptimistic * (1 + (optGrowth - optChurn));
            optimisticScenario.push(Math.round(currentOptimistic));
        }

        // Simulate a "Processing Delay" to feel like AI
        setTimeout(() => {
            res.json({
                months: labels,
                revenue: baseScenario,
                optimistic: optimisticScenario,
                summary: {
                    final_mrr: Math.round(currentBase),
                    total_growth: Math.round(((currentBase - initialMrr) / initialMrr) * 100)
                }
            });
        }, 1500);

    } catch (error) {
        console.error('AI Tool Error:', error);
        res.status(500).json({ error: 'Erro interno ao processar simulação.' });
    }
});

// ==========================================
// GHOSTWRITER AI
// ==========================================
router.post('/ghostwriter-ai', async (req, res) => {
    try {
        const { prospect_name, company_name, pain_point, tone } = req.body;

        if (!prospect_name || !company_name || !pain_point || !tone) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        // Mock AI Generation Logic using Templates
        let emailTemplate = '';
        
        if (tone === 'formal') {
            emailTemplate = `Assunto: Estratégia para resolver ${pain_point} na ${company_name}

Prezado(a) ${prospect_name},

Espero que esta semana esteja sendo produtiva.

Tenho acompanhado o crescimento da ${company_name} e notei que, assim como outras empresas do setor, vocês podem estar enfrentando desafios relacionados a ${pain_point}.

Na Birth Hub 360, ajudamos líderes a superar exatamente esse obstáculo através de nossa metodologia proprietária. Recentemente, apoiamos um player similar a otimizar seus resultados em 30%.

Gostaria de agendar uma breve conversa de 10 minutos para compartilhar esses insights, sem compromisso. Teria disponibilidade na próxima terça-feira às 10h?

Atenciosamente,

[Seu Nome]
Executivo de Contas | Birth Hub 360`;
        } else if (tone === 'casual') {
            emailTemplate = `Assunto: Ideia rápida sobre ${pain_point} 💡

Oi ${prospect_name}, tudo bem?

Estava dando uma olhada no que a ${company_name} tem feito e achei incrível! Porém, imagino que lidar com ${pain_point} não deva ser fácil.

Aqui na Birth Hub, a gente criou um jeito bem prático de resolver isso. Sem complexidade, direto ao ponto.

Topa um papo rápido de 10 min para eu te mostrar como funciona? Acho que você vai curtir.

Abraço,

[Seu Nome]`;
        } else if (tone === 'urgent') {
            emailTemplate = `Assunto: Prioridade: Resolvendo ${pain_point} na ${company_name}

${prospect_name},

Estou entrando em contato porque identificamos uma oportunidade crítica relacionada a ${pain_point} que muitas empresas estão perdendo de vista.

Se não resolvido agora, isso pode impactar significativamente seus resultados no próximo trimestre. A ${company_name} não precisa passar por isso.

Tenho uma solução pronta para implementação imediata. Podemos falar ainda hoje ou amanhã cedo?

No aguardo,

[Seu Nome]`;
        }

        setTimeout(() => {
            res.json({ email: emailTemplate });
        }, 1000);

    } catch (error) {
        console.error('AI Tool Error:', error);
        res.status(500).json({ error: 'Erro ao gerar e-mail.' });
    }
});

// ==========================================
// DEAL STRATEGY AI
// ==========================================
router.post('/dealstrategy-ai', async (req, res) => {
    try {
        const { deal_value, stage, decision_maker, last_interaction } = req.body;

        if (!deal_value || !stage || !decision_maker) {
            return res.status(400).json({ error: 'Parâmetros inválidos.' });
        }

        // Logic Simulation
        let riskLevel = 'Baixo';
        let riskAnalysis = 'O negócio segue um fluxo natural.';
        let nextAction = 'Agendar próxima reunião de alinhamento.';
        let talkingPoints = ['Reforçar o ROI', 'Mostrar casos de sucesso'];

        if (stage === 'negotiation' && decision_maker === 'skeptic') {
            riskLevel = 'Crítico';
            riskAnalysis = 'Decisor final é cético e estamos em fase final. Risco alto de travar no preço.';
            nextAction = 'Mapear as objeções específicas do cético e agendar reunião técnica para desmistificar.';
            talkingPoints = [
                'Focar na redução de riscos (segurança/compliance)',
                'Apresentar garantia de performance',
                'Não ceder desconto sem contrapartida clara'
            ];
        } else if (stage === 'demo' && decision_maker === 'champion') {
            riskLevel = 'Moderado';
            riskAnalysis = 'Temos um campeão, mas precisamos armá-lo para vender internamente.';
            nextAction = 'Enviar material de apoio executivo para o Champion apresentar ao board.';
            talkingPoints = [
                'Destaque a facilidade de implementação',
                'Compare diretamente com o concorrente legado',
                'Calcule o custo da inação (Cost of Inaction)'
            ];
        } else {
            // Generic logic based on value
            if (parseInt(deal_value) > 500000) {
                riskLevel = 'Alto (Valor Elevado)';
                riskAnalysis = 'Valores acima de 500k exigem aprovação múltipla.';
                nextAction = 'Expandir mapa de influência para incluir CFO e Jurídico.';
                talkingPoints = ['ROI em 6 meses', 'Escalabilidade global', 'Suporte enterprise'];
            }
        }

        setTimeout(() => {
            res.json({
                risk_level: riskLevel,
                risk_analysis: riskAnalysis,
                next_action: nextAction,
                talking_points: talkingPoints
            });
        }, 1500);

    } catch (error) {
        console.error('AI Tool Error:', error);
        res.status(500).json({ error: 'Erro ao gerar estratégia.' });
    }
});

// ==========================================
// CHURN PREVENTER
// ==========================================
router.post('/churnpreventer', async (req, res) => {
    try {
        const { customer_name, last_login_days, nps_score, support_tickets_open } = req.body;

        if (!customer_name) {
            return res.status(400).json({ error: 'Nome do cliente é obrigatório.' });
        }

        // Logic Simulation
        const login = parseInt(last_login_days);
        const nps = parseInt(nps_score);
        const tickets = parseInt(support_tickets_open);
        
        let probability = 10; // Base baseline
        const factors = [];
        const actions = [];

        // Calculate Probability
        if (login > 14) {
            probability += 30;
            factors.push(`Ausência de login por ${login} dias.`);
        }
        if (nps < 7) {
            probability += 40;
            factors.push(`NPS Detrator (${nps}).`);
        } else if (nps < 9) {
            probability += 10;
        }
        if (tickets > 3) {
            probability += 20;
            factors.push(`${tickets} chamados de suporte em aberto.`);
        }

        probability = Math.min(probability, 99);

        // Determine Status & Actions
        let status = 'Saudável';
        if (probability > 75) {
            status = 'Risco Crítico';
            actions.push('Agendar reunião executiva de emergência (QBR antecipada).');
            actions.push('Oferecer plano de recuperação de serviço.');
            actions.push('Escalar tickets para engenharia com prioridade máxima.');
        } else if (probability > 30) {
            status = 'Atenção';
            actions.push('Entrar em contato para check-in de satisfação.');
            actions.push('Enviar tutorial de funcionalidades não utilizadas.');
        } else {
            actions.push('Solicitar depoimento ou case de sucesso.');
            actions.push('Explorar oportunidades de upsell.');
        }

        if (factors.length === 0) factors.push('Nenhum fator de risco grave detectado.');

        setTimeout(() => {
            res.json({
                probability,
                status,
                factors,
                actions
            });
        }, 1500);

    } catch (error) {
        console.error('AI Tool Error:', error);
        res.status(500).json({ error: 'Erro ao calcular risco de churn.' });
    }
});

// ==========================================
// LEAD PRIORITIZE AI
// ==========================================
router.post('/leadprioritize-ai', async (req, res) => {
    try {
        const { lead_source, company_size, budget_status, urgency } = req.body;

        if (!lead_source) {
            return res.status(400).json({ error: 'Dados incompletos.' });
        }

        // Logic Simulation
        let score = 0;
        let summary = "Lead com potencial inicial baixo.";
        let checklist = [
            { text: "Verificar presença no LinkedIn", checked: true },
            { text: "Validar e-mail corporativo", checked: true }
        ];

        // Scoring Logic
        if (lead_source === 'inbound') score += 30;
        if (lead_source === 'referral') score += 40;
        if (lead_source === 'outbound') score += 10;

        if (company_size === 'mid') score += 20;
        if (company_size === 'enterprise') score += 30;
        
        if (budget_status === 'confirmed') {
            score += 30;
            checklist.push({ text: "Orçamento aprovado pelo financeiro", checked: true });
        } else if (budget_status === 'unknown') {
            checklist.push({ text: "Sondar disponibilidade de budget", checked: false });
        }

        if (urgency === 'high') {
            score += 20;
            summary = "Alta prioridade. Cliente com dor latente e orçamento. Atuar imediatamente.";
        } else if (urgency === 'low') {
            score -= 10;
            summary = "Lead em estágio inicial de educação. Nutrir com conteúdo.";
        }

        score = Math.min(Math.max(score, 0), 100);

        // Dynamic Checklist
        if (score > 70) {
            checklist.push({ text: "Agendar Demo Técnica", checked: false });
            checklist.push({ text: "Enviar Case de Sucesso do Setor", checked: false });
        } else {
            checklist.push({ text: "Adicionar ao fluxo de nutrição", checked: false });
        }

        setTimeout(() => {
            res.json({
                score,
                summary,
                checklist
            });
        }, 1200);

    } catch (error) {
        console.error('AI Tool Error:', error);
        res.status(500).json({ error: 'Erro ao classificar lead.' });
    }
});

// ==========================================
// CAMPAIGN ROI AI
// ==========================================
router.post('/campaignroi-ai', async (req, res) => {
    try {
        const { campaign_name, investment_amount, channel, expected_sales_increase } = req.body;

        if (!investment_amount) {
            return res.status(400).json({ error: 'Investimento é obrigatório.' });
        }

        const investment = parseFloat(investment_amount);
        const uplift = parseFloat(expected_sales_increase) / 100;
        
        // Base return calculation (simulation)
        // Assume baseline sales is 5x investment for calculation purposes if not provided
        // In a real app, we'd ask for "Current Sales". Here we simulate.
        const simulatedBaselineSales = investment * 4; 
        const newSales = simulatedBaselineSales * (1 + uplift);
        const returnValue = newSales - simulatedBaselineSales; // The "Return" is the incremental sales
        
        // ROI = (Net Return / Cost) * 100
        // Net Return = Incremental Margin. Let's assume 30% margin on sales.
        const margin = 0.30;
        const netProfit = (returnValue * margin) - investment;
        const roi = (netProfit / investment) * 100;

        let analysis = "";
        if (roi > 50) {
            analysis = `Excelente potencial! O canal ${channel.toUpperCase()} costuma ter boa performance para este tipo de ação. O lucro líquido projetado supera significativamente o custo.`;
        } else if (roi > 0) {
            analysis = "Retorno positivo, mas margem apertada. Considere otimizar o custo criativo ou focar em produtos de maior margem.";
        } else {
            analysis = "Atenção: A projeção indica ROI negativo. O aumento de vendas esperado não cobre o investimento + margem. Revise o budget.";
        }

        setTimeout(() => {
            res.json({
                investment: Math.round(investment),
                return_value: Math.round(returnValue * margin), // Showing Gross Margin Return
                net_profit: Math.round(netProfit),
                roi: Math.round(roi),
                analysis
            });
        }, 1200);

    } catch (error) {
        console.error('AI Tool Error:', error);
        res.status(500).json({ error: 'Erro ao calcular ROI.' });
    }
});

// ==========================================
// COACHING INSIGHTS AI
// ==========================================
router.post('/coachinginsights', async (req, res) => {
    try {
        const { rep_name, quota_attainment, deals_closed, main_challenge } = req.body;

        if (!rep_name) {
            return res.status(400).json({ error: 'Nome do vendedor é obrigatório.' });
        }

        const attainment = parseFloat(quota_attainment);
        
        let profileType = "Performer Equilibrado";
        let strengths = ["Consistência", "Boa comunicação"];
        let focusAreaAnalysis = "";
        let coachingPlan = [];
        let potentialScore = 3;

        // Profile Determination
        if (attainment > 110) {
            profileType = "Top Performer (Star)";
            strengths = ["Foco em resultados", "Alta conversão", "Autonomia"];
            potentialScore = 5;
        } else if (attainment < 70) {
            profileType = "Baixa Performance (Em Risco)";
            strengths = ["Resiliência", "Vontade de aprender"];
            potentialScore = 2;
        } else {
            profileType = "Core Performer";
            potentialScore = 4;
        }

        // Challenge Specific Logic
        if (main_challenge === 'prospecting') {
            focusAreaAnalysis = `O vendedor ${rep_name} precisa melhorar o volume de topo de funil. A taxa de conversão pode ser boa, mas falta 'combustível' (leads).`;
            coachingPlan = [
                "Revisar blocos de tempo dedicados a prospecção (Time Blocking).",
                "Treinar scripts de abordagem inicial e quebra-gelo.",
                "Definir meta diária de atividades (ex: 20 calls/dia)."
            ];
        } else if (main_challenge === 'negotiation') {
            focusAreaAnalysis = `Dificuldade em manter valor na reta final. Possivelmente concedendo descontos muito cedo ou não ancorando bem o preço.`;
            coachingPlan = [
                "Roleplay de negociação focado em 'Não' inicial.",
                "Revisar matriz de concessões (o que dar em troca de desconto).",
                "Analisar gravação de uma call perdida por preço."
            ];
        } else if (main_challenge === 'closing') {
            focusAreaAnalysis = `O vendedor constrói bom relacionamento, mas hesita em pedir o fechamento (medo da rejeição ou falta de urgência).`;
            coachingPlan = [
                "Treinar técnicas de fechamento (ex: Fechamento Presuntivo).",
                "Identificar sinais de compra não verbais.",
                "Criar cronograma reverso com o cliente (Mutual Action Plan)."
            ];
        } else { // Discovery
            focusAreaAnalysis = `Diagnóstico superficial. O vendedor está apresentando a solução antes de entender a dor real do cliente.`;
            coachingPlan = [
                "Praticar perguntas de implicação (SPIN Selling).",
                "Escuta ativa: Regra 80/20 (Ouvir 80%, Falar 20%).",
                "Validar entendimento antes de apresentar slide de solução."
            ];
        }

        setTimeout(() => {
            res.json({
                profile_type: profileType,
                potential_score: potentialScore,
                strengths,
                focus_area_analysis: focusAreaAnalysis,
                coaching_plan: coachingPlan
            });
        }, 1200);

    } catch (error) {
        console.error('AI Tool Error:', error);
        res.status(500).json({ error: 'Erro ao gerar insights.' });
    }
});

// ==========================================
// PRODUCT-LED GROWTH AI
// ==========================================
router.post('/productled-growth', async (req, res) => {
    try {
        const { product_name, monthly_active_users, viral_coefficient, churn_rate } = req.body;

        if (!product_name) {
            return res.status(400).json({ error: 'Nome do produto é obrigatório.' });
        }

        const mau = parseInt(monthly_active_users);
        const kFactor = parseFloat(viral_coefficient);
        const churn = parseFloat(churn_rate) / 100;

        // Simple Viral Growth Projection (12 months)
        // Net Growth Rate = (kFactor * (1 - Churn)) - Churn -- Simplified model
        // Actually: Next Month Users = Current * (1 - Churn) + (Current * kFactor * (1/12 assuming kFactor is lifetime? usually k is per cycle. Let's assume monthly cycle for simplicity of "viral coefficient"))
        // Let's use a simpler iterative model.
        
        let currentUsers = mau;
        for (let i = 0; i < 12; i++) {
            const lostUsers = currentUsers * churn;
            const newUsers = (currentUsers * kFactor * 0.2); // Assuming 20% of K-factor converts per month (cycle speed)
            currentUsers = currentUsers - lostUsers + newUsers;
        }

        let doublingTime = "N/A (Declínio)";
        if (currentUsers > mau) {
            const growthRate = (currentUsers - mau) / mau;
            if (growthRate > 0) {
                // Rule of 72 approximation
                const monthlyGrowthPercent = (Math.pow(currentUsers / mau, 1/12) - 1) * 100;
                const monthsToDouble = 72 / monthlyGrowthPercent;
                doublingTime = `${Math.round(monthsToDouble)} meses`;
            }
        }

        let hacks = [];
        if (kFactor < 1) {
            hacks.push({
                title: "Otimizar Convite In-App",
                description: "Mova o botão de convite para o 'Momento Aha!' do usuário."
            });
            hacks.push({
                title: "Incentivos Bilaterais",
                description: "Ofereça recompensas tanto para quem convida quanto para o convidado (Ex: Dropbox)."
            });
        } else {
            hacks.push({
                title: "Gamificação de Referência",
                description: "Crie um leaderboard de top referenciadores com prêmios exclusivos."
            });
            hacks.push({
                title: "Loop de Retenção",
                description: "Use notificações push baseadas em comportamento para reduzir o churn e manter o balde cheio."
            });
        }

        setTimeout(() => {
            res.json({
                k_factor: kFactor,
                projected_users: Math.round(currentUsers),
                doubling_time: doublingTime,
                hacks: hacks
            });
        }, 1200);

    } catch (error) {
        console.error('AI Tool Error:', error);
        res.status(500).json({ error: 'Erro ao calcular crescimento.' });
    }
});

// ==========================================
// GENERIC AI TOOL HANDLER
// ==========================================
router.post('/generic-tool', async (req, res) => {
    try {
        const { tool_id, inputs } = req.body;
        
        // Contextual Templates based on Tool ID keywords
        let resultTitle = "Resultado da Análise";
        let resultContent = "A IA processou seus dados e gerou os seguintes insights:\n\n";

        if (tool_id.includes("analyzer") || tool_id.includes("analyst")) {
            resultTitle = "Análise Detalhada";
            resultContent += "• Tendência identificada: Positiva com alta probabilidade de crescimento.\n";
            resultContent += "• Padrões ocultos: Correlação forte entre A e B.\n";
            resultContent += "• Recomendação: Aumentar o investimento em 15%.\n";
        } else if (tool_id.includes("generator") || tool_id.includes("creator") || tool_id.includes("writer")) {
            resultTitle = "Conteúdo Gerado";
            resultContent += "Aqui está o rascunho inicial baseado nos seus parâmetros:\n\n";
            resultContent += "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n";
            resultContent += "Dica: Personalize o segundo parágrafo para maior impacto.";
        } else if (tool_id.includes("calculator") || tool_id.includes("estimator")) {
            resultTitle = "Cálculo Estimado";
            resultContent += "• Valor Base: 100\n";
            resultContent += "• Multiplicador de Risco: 1.2x\n";
            resultContent += "• Resultado Final Projetado: 120\n";
        } else {
            resultTitle = "Insights da IA";
            resultContent += "Baseado no contexto '" + (inputs.context || 'geral') + "', sugerimos:\n";
            resultContent += "1. Priorizar ações de curto prazo.\n";
            resultContent += "2. Revisar métricas na próxima semana.\n";
            resultContent += "3. Alinhar expectativas com os stakeholders.";
        }

        setTimeout(() => {
            res.json({
                title: resultTitle,
                content: resultContent,
                is_generic: true
            });
        }, 1000);

    } catch (error) {
        console.error('AI Tool Error:', error);
        res.status(500).json({ error: 'Erro ao processar ferramenta genérica.' });
    }
});

module.exports = router;
