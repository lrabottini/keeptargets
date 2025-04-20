(async function() {
    try {
        // URL do endpoint da API Gateway que invoca função Lambda
        const url = 'https://17unlcnzfb.execute-api.sa-east-1.amazonaws.com/prod/consultaopenai';

        // Textos e referências para usar na busca das informações
        const textos = properties.paramlist1.get(0, properties.paramlist1.length())
        const referencias = properties.paramlist2.get(0, properties.paramlist2.length())

        if (!Array.isArray(textos) || textos.length === 0) {
            throw new Error("[Infos da nota] Nenhum texto para extração das informações foi fornecido");
        }

        // Lista de dados para enviar nas chamadas paralelas (cada item será enviado como uma requisição individual)
        const requests = textos.map((texto) => {
            const request = {
                "arquivo": `${texto.split("|")[0]}`,
                "url": `${texto.split("|")[1]}`,
                "request": {
                    "model": "gpt-4o-mini",
                    "messages": [
                        {
                            "role": "user",
                            "content": `Extraia exatamente o CNPJ do prestador ou emitente que está no formato "XX.XXX.XXX/XXXX-XX", a data de prestação do serviço e o valor do serviço da seguinte nota fiscal eletrônica                                    <<NFS-e>>
                                    ${texto.split("|")[2]}
                                    <<Fim NFS-e>>
                                    Você deve responder sempre no formato abaixo, sem introduções ou explicações adicionais:
                                    Referência: O primeiro valor da seguinte lista encontrado no texto: [${referencias}];CNPJ: XXX.XXX.XXX/XXXX-XX;Data: DD/MM/AAAA;Valor: R$ XXX,XX
                                    Se não encontrar algum dos campos, insira "NÃO ENCONTRADO".
                                    Responda estritamente no formato especificado`
                        }
                    ],
                    "max_tokens": 100,
                    "temperature": 0
                }
            }            
            return request
        });

        // Função para fazer a chamada a API Lambda para cada requisição
        const fetchResults = requests.map(async (body) => {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body.request)
            });

            // Verificar a resposta da API
            if (!response.ok) {
                    const errorData = await response.json();
                    return new Error(`[Infos da nota] Erro na chamada à API: ${JSON.stringify(errorData)}`);
            } else {
                    const data = await response.json();

                    data.filename = body.arquivo
                    data.url = body.url
                    data.texto = body.request.messages[0].content
                    return  data; // Retorna a resposta de cada requisição
            }
        });

        // Aguardando todas as chamadas serem concluídas
        const results = await Promise.all(fetchResults);

        const processedResults = results.map((result) => {
            const notFoundCount = (result.data.match(/NÃO ENCONTRADO/g) || []).length; // Conta as ocorrências de 'NÃO ENCONTRADO'
            const status = notFoundCount === 0
                ? "sucesso"
                : notFoundCount === 4
                ? "falha"
                : "falha parcial";
          
            return `${status};${result.filename};${result.url};${result.data.split(";").map(item => item.split(":")[1].trim().replace('NÃO ENCONTRADO','')).join(";")};${status === 'sucesso'? 'XXX': ''};${result.texto}`
        });
        
        processedResults.unshift('sucesso')

        console.log(processedResults)

        bubble_fn_resultado(processedResults);

    } catch (error) {
        const erros = []

        // Enviar erro formatado para o Bubble
        erros.push(`falha: ${error.message}`)

        console.log(error)

        bubble_fn_resultado(erros);
    }
})();