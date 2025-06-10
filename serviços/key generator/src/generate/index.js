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

function gerarChave(tamanho) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let resultado = '';
    const bytes = crypto.randomBytes(tamanho);
    for (let i = 0; i < tamanho; i++) {
        resultado += caracteres[bytes[i] % caracteres.length];
    }
    return resultado;
}

// Função para adicionar cabeçalhos CORS
const addCorsHeaders = (res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://keeptargets.com.br'); // Substitua pelo seu domínio
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

app.post("/chaves/generate", async (req, res) => {
    const { id_cliente, nome, dias_validade, tabelas_permitidas } = req.body;
    
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
    if (!tabelas_permitidas) {
        return res.status(400).json({ error: "Tabelas permitidas não informadas" });
    }
    try {

        const chave_publica = gerarChave(64);
        const chave_secreta = gerarChave(64);

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
                nome:  { S: nome },
                tabelas_permitidas: {S: tabelas_permitidas }
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
            nome: nome,
            tabelas_permitidas: tabelas_permitidas
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