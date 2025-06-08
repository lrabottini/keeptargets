const express = require("express");
const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const crypto = require("crypto");
const axios = require("axios");
const serverlessExpress = require("@vendia/serverless-express");

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

app.post("/authorize", async (req, res) => {
    try {
        const publicKey = req.header("x-api-key");
        const signature = req.header("x-api-signature");

        if (!publicKey) return res.status(401).send("Missing x-api-key");

        const getCmd = new GetItemCommand({
            TableName: "api_keys",
            Key: {
                cliente_id: { S: "cliente_001" }, // ajuste conforme necessário
                public_key: { S: publicKey }
            }
        });

        const result = await client.send(getCmd);
        const item = result.Item;
        if (!item || !item.ativo.BOOL) return res.status(403).send("Key not active");

        const now = Math.floor(Date.now() / 1000);
        if (parseInt(item.expira_em.N) < now) return res.status(403).send("Key expired");

        if (signature) {
            const computed = crypto
                .createHmac("sha256", item.secret_key.S)
                .update(JSON.stringify(req.body))
                .digest("hex");
            if (computed !== signature) return res.status(401).send("Invalid signature");
        }

        const bubbleResponse = await axios.post(BUBBLE_ENDPOINT, req.body, {
            headers: { "Content-Type": "application/json" }
        });

        res.status(bubbleResponse.status).json(bubbleResponse.data);
    } catch (err) {
        console.error("Erro:", err);
        res.status(500).json({ error: err.message });
    }
});

// 🔄 Lambda handler
exports.handler = serverlessExpress({ app });

// 🧪 Local test
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando localmente em http://localhost:${PORT}`);
    });
}