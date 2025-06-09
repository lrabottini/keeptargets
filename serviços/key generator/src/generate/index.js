const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const serverless = require('serverless-http'); // Adapta Express ao Lambda
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

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

const client = new DynamoDBClient({ region: "sa-east-1" });

// Função para adicionar cabeçalhos CORS
const addCorsHeaders = (res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://keeptargets.com.br'); // Substitua pelo seu domínio
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

app.post("/generate", async (req, res) => {
    const {id_cliente, nome, dias_validade } = req.body;
    
    console.log(req.body)
    console.log(id_cliente, nome, dias_validade)
    console.log("Tipo do body:", typeof req.body);
    console.log("Body bruto:", req.body);

    if (!id_cliente) {
        return res.status(400).json({ error: "ID Cliente não informado" });
    }
    if (!nome) {
        return res.status(400).json({ error: "Nome da chave não informado" });
    }
    const dias = parseInt(dias_validade);
    if (isNaN(dias) || dias < 1 || dias > 365) {
        return res.status(400).json({ error: "dias_validade inválido (1-365 dias)" });
    }

    try {

        const chave_publica = crypto.randomBytes(16).toString("hex");
        const chave_secreta = crypto.randomBytes(32).toString("hex");

        const agora = Math.floor(Date.now() / 1000);
        const expiraEm = agora + 86400 * dias; // 86400 = segundos por dia

        const command = new PutItemCommand({
            TableName: "chave_de_acesso",
            Item: {
                id_cliente: { S: id_cliente },
                chave_publica: { S: chave_publica },
                chave_secreta: { S: chave_secreta },
                ativo:      { BOOL: true },
                expira_em:  { N: expiraEm.toString() },
                criado_em:  { N: agora.toString() },
                nome:  { S: nome }
            }
        });

        await client.send(command);

        addCorsHeaders(res); // Adiciona CORS

        res.status(201).json({
            id_cliente: id_cliente,
            chave_publica: chave_publica,
            chave_secreta: chave_secreta,
            criado_em: agora,
            expira_em: expiraEm,
            dias_validade: dias,
            nome: nome
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao gerar chave", details: err.message });
    }
});

// Exporta a função para o AWS Lambda
module.exports.handler = serverless(app);

// Local test
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando localmente em http://localhost:${PORT}`);
    });
}