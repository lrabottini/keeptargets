const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const serverless = require('serverless-http'); // Adapta Express ao Lambda
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

const app = express();
app.use(express.json());

const client = new DynamoDBClient({ region: "sa-east-1" });

// CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,x-api-key,x-api-signature");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
});

app.post("/generate", async (req, res) => {
    try {
        const {
            cliente_id = "default",
            descricao = "Gerado via Lambda",
            dias_validade = 30 // padrão: 30 dias
        } = req.body;

        const dias = parseInt(dias_validade);
        if (isNaN(dias) || dias < 1 || dias > 365) {
            return res.status(400).json({ error: "dias_validade inválido (1-365 dias)" });
        }

        const publicKey = crypto.randomBytes(16).toString("hex");
        const secretKey = crypto.randomBytes(32).toString("hex");

        const agora = Math.floor(Date.now() / 1000);
        const expiraEm = agora + 86400 * dias; // 86400 = segundos por dia

        const command = new PutItemCommand({
            TableName: "chave_de_acesso",
            Item: {
                id_cliente: { S: cliente_id },
                chave_publica: { S: publicKey },
                chave_secreta: { S: secretKey },
                ativo:      { BOOL: true },
                expira_em:  { N: expiraEm.toString() },
                criado_em:  { N: agora.toString() },
                descricao:  { S: descricao }
            }
        });

        await client.send(command);

        res.status(201).json({
            cliente_id,
            public_key: publicKey,
            secret_key: secretKey,
            criado_em: agora,
            expira_em: expiraEm,
            dias_validade: dias
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao gerar chave", details: err.message });
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