const express = require("express");
const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const crypto = require("crypto");
const axios = require("axios");
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

const regiao = process.env.REGIAO || "sa-east-1"
const client = new DynamoDBClient({ region: regiao });

// CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,x-api-key,x-api-signature");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
});

app.post("/execute", async (req, res) => {
    try {
        const chave_publica = req.header("x-api-key");
        const assinatura = req.header("x-api-signature");

        if (!chave_publica) throw new Error("Chave pública não enviada");
        if (!assinatura) throw new Error("Assinatura não enviada");

        const getCmd = new GetItemCommand({
            TableName: "chave_de_acesso",
            Key: {
                id_cliente: { S: req.body.id_cliente }, // ajuste conforme necessário
                chave_publica: { S: chave_publica }
            }
        });

        const result = await client.send(getCmd);
        const item = result.Item;
        if (!item || !item.ativo.BOOL) return res.status(403).send("Chave não está ativa");

        const now = Math.floor(Date.now() / 1000);
        if (parseInt(item.expira_em.N) < now) return res.status(403).send("Chave expirada");

        if (assinatura) {
            const computed = crypto
                .createHmac("sha256", item.chave_secreta.S)
                .update(req.body.semente)
                .digest("hex");
            if (computed !== assinatura) return res.status(401).send("Assinatura inválida");
        }

        res.status(200).send("Autenticado")
    } catch (err) {
        console.error("Erro:", err);
        res.status(500).json({ error: err.message });
    }
});

// Lambda handler
module.exports.handler = serverless(app);

// Local test
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando localmente em http://localhost:${PORT}`);
    });
}