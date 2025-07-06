const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const serverless = require("serverless-http");

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
    res.setHeader("Access-Control-Allow-Origin", "https://keeptargets.com.br");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

app.put("/subscription/cancel", async (req, res) => {
    adicionarCors(res);

    const { subscription_id, customer_id, licencas_ativas } = req.body;

    // Validações
    if (!subscription_id || !customer_id || !licencas_ativas || licencas_ativas <= 0) {
        return res.status(400).json({
            return_code: "INVALID_PARAMETERS",
            error: "subscription_id, customer_id e licencas_ativas são obrigatórios"
        });
    }

    try {
        // 📝 Registra uso via Metered Events
        const meterEvent = await stripe.billing.meterEvents.create({
            event_name: 'licenças_ativadas',
            payload: {
                value: licencas_ativas,
                stripe_customer_id: customer_id,
            }
        });

        const cancelamento = await stripe.subscriptions.cancel(subscription_id, {
            invoice_now: true,
            prorate: false
        });

        return res.status(200).json({
            return_code: "SUB_CANCELLATION_SUCCESS",
            assinatura_id: cancelamento.id,
            status: cancelamento.status,
            meter_event_id: meterEvent.id
        });
    } catch (error) {
        return res.status(500).json({
            return_code: "SUB_CANCELLATION_ERROR",
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