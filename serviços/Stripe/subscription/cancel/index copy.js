const express = require("express");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const serverless = require('serverless-http');

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

const adicionarCors = (res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://keeptargets.com.br');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

app.put("/subscription/cancel", async (req, res) => {
    adicionarCors(res);

    const { subscription_id } = req.body;

    if (!subscription_id) {
        return res.status(400).json({ return_code: "SUBSCRIPTION_ID_REQUIRED" });
    }

    try {
        const currentSubscription = await stripe.subscriptions.retrieve(subscription_id);

        if (currentSubscription.status === 'canceled') {
            return res.status(400).json({ return_code: "ALREADY_CANCELED" });
        }

        const updatedSubscription = await stripe.subscriptions.update(subscription_id, {
            cancel_at_period_end: true
        });

        return res.status(200).json({
            return_code: "SUBSCRIPTION_CANCELLATION_SCHEDULED",
            status: "in cancellation",
            cancel_at: updatedSubscription.cancel_at,
            cancel_at_period_end: updatedSubscription.cancel_at_period_end
        });

    } catch (error) {
        console.error("Erro ao cancelar assinatura:", error);
        return res.status(500).json({
            return_code: "CANCEL_SUBSCRIPTION_ERROR",
            error: error.message
        });
    }
});

module.exports.handler = serverless(app);

// Teste local opcional
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando localmente em http://localhost:${PORT}`);
  });
}