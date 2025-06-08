import axios from 'axios';

const responseHeaders = {
    "Access-Control-Allow-Headers" : "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
}

export const handler = async (event) => {
    try {
        // URL da API da OpenAI
        const url = 'https://api.openai.com/v1/chat/completions';

        // Verifica se o corpo da requisição está presente
        let parsedEvent;
        if (typeof event.body === 'string') {
            try {
                parsedEvent = JSON.parse(event.body);
            } catch (err) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        success: false,
                        error: "Corpo da requisição inválido. Certifique-se de enviar um JSON válido.",
                        message: "Não foi possível retornar informações"
                    }),
                    headers: responseHeaders
                };
            }
        } else {
            parsedEvent = event.body || event;
        }

        // O corpo da requisição já é o JSON esperado pela API da OpenAI
        const body = parsedEvent;
        if (!body || !body.model || !body.messages) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    error: "O corpo da requisição precisa conter 'model' e 'messages'.",
                    message: "Não foi possível retornar informações"
                }),
                headers: responseHeaders
            };
        }

        // Cabeçalhos da requisição
        const reqHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        };

        // Fazendo a chamada única para a API da OpenAI
        const result = await axios.post(url, body, { reqHeaders });

        const infos = result.data.choices[0].message.content

        const notFoundCount = (infos.split(":")[1].trim().match(/NÃO ENCONTRADO/g) || []).length; // Conta as ocorrências de 'NÃO ENCONTRADO'
        const status = notFoundCount === 0
            ? "sucesso"
            : notFoundCount === 4
            ? "falha"
            : "falha parcial";

        return `${status};${result.filename};${result.url};${status === 'sucesso'
                                                                ? 'Todos os dados retornados'
                                                                : 'Verifique se a nota contém todas as informações'};${result.data.split(";").map(item => item.split(":")[1].trim()).join(";")}`

        // Processando a resposta
        const response = {
            success: true,
            data: result.data.choices[0].message.content,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
        };

        // Retornando a resposta
        return {
            statusCode: 200,
            body: JSON.stringify(response),
        };
    } catch (error) {
        console.error("Erro ao acessar a API da OpenAI:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erro ao acessar a API da OpenAI", details: error.message }),
        };
    }
};
