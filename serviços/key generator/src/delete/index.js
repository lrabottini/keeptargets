const express = require("express");
const serverless = require("serverless-http");
const { DynamoDBClient, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");

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

const addCorsHeaders = (res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

app.options("/chaves/delete", (req, res) => {
    addCorsHeaders(res);
    res.status(200).send();
});

app.delete("/chaves/delete", async (req, res) => {
    addCorsHeaders(res);

    const { id_cliente, chave_publica } = req.body;

    if (!id_cliente || !chave_publica) {
        return res.status(400).json({ error: "id_cliente e chave_publica são obrigatórios" });
    }

    try {
        const command = new DeleteItemCommand({
            TableName: "chave_de_acesso",
            Key: {
                id_cliente: { S: id_cliente },
                chave_publica: { S: chave_publica }
            }
        });

        await client.send(command);
        res.status(200).json({ sucesso: true, mensagem: "Chave excluída com sucesso" });

    } catch (err) {
        console.error("Erro ao excluir chave:", err);
        res.status(500).json({ sucesso: false, erro: err.message });
    }
});

module.exports.handler = serverless(app);

if (require.main === module) {
    app.listen(3000, () => {
        console.log("Servidor local em http://localhost:3000");
    });
}
