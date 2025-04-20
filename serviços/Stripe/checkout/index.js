// Importações
const express = require('express');
const serverless = require('serverless-http'); // Adapta Express ao Lambda

const app = express();
app.use(express.json()); // Importante para processar JSON no Lambda

// Criar sessão de checkout
app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price: 'XXX', // Usando variável de ambiente
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: `${process.env.RETURN_URL}?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.json({ clientSecret: session.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Consultar status da sessão
app.get('/session-status', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    res.json({
      status: session.status,
      customer_email: session.customer_details?.email || 'N/A',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exporta a função para o AWS Lambda
module.exports.handler = serverless(app);