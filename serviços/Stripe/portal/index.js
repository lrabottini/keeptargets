const express = require("express");
//const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const stripe = require('stripe')("sk_test_51QxBYwBxrGev9VhBwSOvqJMqOZHfBvmkZ8MATU6GxzLyFfzcmwtL39hfKhJOBtrjY8la4cLjJEG2dBMdK5zYzMpC00vUnIQcZS");
const serverless = require('serverless-http'); // Adapta Express ao Lambda

const app = express();
app.use((req, res, next) => {
    // Se o body for um Buffer, tenta converter para JSON
    if (Buffer.isBuffer(req.body)) {
      try {
        const rawBody = req.body.toString();
        req.body = JSON.parse(rawBody);
        console.log("Body convertido do Buffer:", req.body);
      } catch (e) {
        console.warn("Erro ao converter Buffer em JSON:", e);
        return res.status(400).json({ error: "Body inválido" });
      }
    }
    next();
  });
app.use(express.json());

// Função para adicionar cabeçalhos CORS
const adicionarCors = (res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://keeptargets.com.br');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

const portalConfigMap = {};

const portalConfigsDefinition = {
    cancelar: {
        subscription_cancel: {
            enabled: true,
            mode: 'immediately',
            cancellation_reason: {
                enabled: true,
                options: [
                    'customer_service',
                    'low_quality',
                    'missing_features',
                    'other',
                    'switched_service',
                    'too_complex',
                    'too_expensive',
                    'unused'
                ]            
            }
        }
    },
    reativar: {
        subscription_resume: { enabled: true }
    },
    pagamento: {
        payment_method_update: { enabled: true }
    },
    dados_cliente: {
        customer_update: {
            enabled: true,
            allowed_updates: ['email', 'address', 'phone']
        }
    },
    'pausar': {
        subscription_pause: {
            enabled: true
        }
    }
}

async function ensurePortalConfiguration(action) {
    if (portalConfigMap[action]) return portalConfigMap[action];

    const features = portalConfigsDefinition[action];
    if (!features) throw new Error(`Ação '${action}' não é suportada.`);

    const config = await stripe.billingPortal.configurations.create({
        features
    });

    portalConfigMap[action] = config.id;
    return config.id;
}

app.post("/customer/portal", async (req, res) => {
    try {
        adicionarCors(res); // Adiciona CORS

        const {id_cliente, acao } = req.body;
        if (!id_cliente){
            return res.status(400).json({ error: "Id do cliente não informado" });
        }
        if (!acao){
            return res.status(400).json({ error: "Necessário informar uma ação" });
        }
        
        const configurationId = await ensurePortalConfiguration(acao);
        const session = await stripe.billingPortal.sessions.create({
            customer: id_cliente,
            configuration: configurationId,
            return_url: `${process.env.RETURN_URL}`
        });
        
        res.status(201).json({
            url: session.url
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao criar sessão", details: err.message });
    }
});

// Exporta a função para o AWS Lambda
module.exports.handler = serverless(app);

// 🧪 Local test
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando localmente em http://localhost:${PORT}`);
    });
}