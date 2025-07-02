const express = require("express");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
//const stripe = require('stripe')("sk_test_51QxBYwBxrGev9VhBwSOvqJMqOZHfBvmkZ8MATU6GxzLyFfzcmwtL39hfKhJOBtrjY8la4cLjJEG2dBMdK5zYzMpC00vUnIQcZS");
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

app.post("/subscription/create", async (req, res) => {
    try {
        adicionarCors(res); // Adiciona CORS

        const { id_cliente, id_preco } = req.body;
        if (!id_cliente) {
            return res.status(400).json({
                return_code: 'CUS_ID_NOT_FOUND'
            });
        }
        if (!id_preco) {
            return res.status(400).json({
                return_code: 'PRI_ID_NOT_FOUND'
            });
        }

        const customer = await stripe.customers.retrieve(id_cliente)

        const assinatura = await stripe.subscriptions.create({
            customer: id_cliente,
            items: [{ price: id_preco }],
            trial_period_days: 30,
            default_payment_method: customer.invoice_settings.default_payment_method,
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent'],
        });

        return res.status(200).json({
            return_code: "SUB_CREATION_SUCCESS",
            id_assinatura: assinatura.id,
            status: assinatura.status
        });
    } catch (error) {
        return res.status(500).json({
            return_code: "SUB_CREATION_ERROR",
            error: error.message
        });
    }
});

module.exports.handler = serverless(app);

// 🧪 Local test
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando localmente em http://localhost:${PORT}`);
    });
}