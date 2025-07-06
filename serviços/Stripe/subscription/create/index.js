const express = require("express");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const serverless = require('serverless-http');

const app = express();

app.use((req, res, next) => {
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

const adicionarCors = (res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://keeptargets.com.br');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

app.post("/subscription/create", async (req, res) => {
    adicionarCors(res);

    const { id_cliente, id_preco, metodo_pagamento, id_assinatura_anterior } = req.body;

    if (!id_cliente) {
        return res.status(400).json({ return_code: 'CUS_ID_NOT_FOUND' });
    }
    if (!id_preco) {
        return res.status(400).json({ return_code: 'PRI_ID_NOT_FOUND' });
    }

    try {
        let assinatura;

        if (id_assinatura_anterior) {
            // 🔁 Criar nova assinatura a partir de uma anterior
            const subAnterior = await stripe.subscriptions.retrieve(id_assinatura_anterior, {
                expand: ['default_payment_method'],
            });

            const isTrialing = subAnterior.status === 'trialing';
            const trialEndTimestamp = subAnterior.trial_end;

            let metodoPagamentoAnterior = subAnterior.default_payment_method.id;

            // Se não encontrar na assinatura, tenta buscar do cliente
            if (!metodoPagamentoAnterior) {
                const paymentMethods = await stripe.paymentMethods.list({
                    customer: id_cliente,
                    type: 'card',
                });
                metodoPagamentoAnterior = paymentMethods.data[0]?.id;
            }

            if (!metodoPagamentoAnterior) {
                return res.status(400).json({ return_code: 'NO_PREVIOUS_PAYMENT_METHOD_FOUND' });
            }

            const params = {
                customer: id_cliente,
                items: [{ price: id_preco }],
                default_payment_method: metodoPagamentoAnterior,
                collection_method: 'charge_automatically',
                payment_behavior: 'default_incomplete',
                expand: ['latest_invoice.payment_intent']
            };

            if (isTrialing && trialEndTimestamp > Math.floor(Date.now() / 1000)) {
                params.trial_end = trialEndTimestamp;
            }

            assinatura = await stripe.subscriptions.create(params);

        } else {
            // ✳️ Criar nova assinatura do zero
            if (!metodo_pagamento) {
                return res.status(400).json({ return_code: 'PAYMENT_METHOD_NOT_FOUND' });
            }

            assinatura = await stripe.subscriptions.create({
                customer: id_cliente,
                items: [{ price: id_preco }],
                trial_period_days: 30,
                default_payment_method: metodo_pagamento,
                payment_behavior: 'default_incomplete',
                expand: ['latest_invoice.payment_intent'],
            });
        }

        return res.status(200).json({
            return_code: "SUB_CREATION_SUCCESS",
            id_assinatura: assinatura.id,
            status: assinatura.status
        });

    } catch (error) {
        console.error('Erro ao criar assinatura:', error);
        return res.status(500).json({
            return_code: "SUB_CREATION_ERROR",
            error: error.message
        });
    }
});

module.exports.handler = serverless(app);

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando localmente em http://localhost:${PORT}`);
    });
}