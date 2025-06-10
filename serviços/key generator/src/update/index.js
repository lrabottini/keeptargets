const express = require("express");
const serverless = require("serverless-http");
const {  DynamoDBClient, UpdateItemCommand, } = require("@aws-sdk/client-dynamodb");

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
	res.setHeader("Access-Control-Allow-Origin", "*"); // Ou defina seu domínio
	res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

app.options("/chaves/update", (req, res) => {
	addCorsHeaders(res);
	res.status(200).send();
});

app.put("/chaves/update", async (req, res) => {
	try {
		addCorsHeaders(res);

		const { id_cliente, chave_publica, ativo, tabelas_permitidas } = req.body;
	
		if (!id_cliente || !chave_publica) {
			return res
			.status(400)
			.json({ error: "id_cliente e chave_publica são obrigatórios" });
		}
	
		const updates = [];
		const expressionValues = {};
	
		if (ativo) {
			updates.push("ativo = :ativo");
			expressionValues[":ativo"] = { S: ativo };
		}

		if (tabelas_permitidas) {
			updates.push("tabelas_permitidas = :tabelas_permitidas");
			expressionValues[":tabelas_permitidas"] = { S: tabelas_permitidas }; // espera array de strings
		}
	
		if (updates.length === 0) {
			return res
			.status(400)
			.json({ error: "Nenhum campo válido para atualizar" });
		}
	
		const command = new UpdateItemCommand({
			TableName: "chave_de_acesso",
			Key: {
				id_cliente: { S: id_cliente },
				chave_publica: { S: chave_publica },
			},
			UpdateExpression: "SET " + updates.join(", "),
			ExpressionAttributeValues: expressionValues,
			ReturnValues: "UPDATED_NEW",
		});

		await client.send(command);
        
		res.status(201).json({
            id_cliente: id_cliente,
            chave_publica: chave_publica,
			ativo: ativo,
            tabelas_permitidas: tabelas_permitidas
        });
	} catch (err) {
		console.error(err);
		res
		.status(500)
		.json({ error: "Erro ao atualizar a chave", details: err.message });
	}
});

// Exporta para uso no AWS Lambda
module.exports.handler = serverless(app);

// Execução local
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`Rodando localmente em http://localhost:${PORT}`)
  );
}
