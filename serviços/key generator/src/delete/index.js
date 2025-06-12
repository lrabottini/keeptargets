const express = require("express");
const serverless = require("serverless-http");
const { DynamoDBClient, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");

const app = express();

const regiao = process.env.REGIAO || "sa-east-1";
const client = new DynamoDBClient({ region: regiao });

const addCorsHeaders = (res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

app.options("/v1/key/delete", (req, res) => {
    addCorsHeaders(res);
    res.status(200).send();
});

app.delete("/v1/key/delete", async (req, res) => {
    addCorsHeaders(res);

    const { id_cliente, chave_publica } = req.query;

    if (!id_cliente || !chave_publica) {
        return res.status(400).json({ error: "id_cliente e chave_publica são obrigatórios na URL" });
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