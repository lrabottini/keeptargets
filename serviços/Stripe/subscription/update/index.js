const express = require("express");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
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

app.put("/subscription/update", async (req, res) => {
    try {
        adicionarCors(res); // Adiciona CORS

        const { id_assinatura, preço } = req.body;

        if (!id_assinatura) {
            return res.status(400).json({
                return_code: 'SUB_ID_NOT_FOUND',
                error: 'id da assinatua não informado.'
            });
        }
    
        if (!preço) {
            return res.status(400).json({
                return_code: 'PRICE_ID_NOT_FOUND',
                error: 'novo preço não informado.'
            });
        }

        const assinaturas = await stripe.subscriptions.retrieve(id_assinatura);
        const assinatura = assinaturas.items.data[0];
    
        // Atualiza a assinatura com o novo price
        const updated = await stripe.subscriptions.update(id_assinatura, {
            cancel_at_period_end: false,
            proration_behavior: 'create_prorations',
            items: [{
                id: assinatura.id,
                price: preço
            }]
        });

        return res.status(200).json({
            return_code: 'SUB_UPDATE_SUCCESS',
            subscription_id: updated.id,
            status: updated.status
        });
      } catch (err) {
        return res.status(500).json({
            return_code: 'SUB_UPDATE_ERROR',
            error: err.message
        });
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