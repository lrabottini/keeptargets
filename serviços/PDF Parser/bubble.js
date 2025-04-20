//const pdfUrls = [
//    "https://keeptargets.s3.amazonaws.com/budget/upload/nfse/DFE35250272381189001001550010073955841584983639.pdf",
//    "https://keeptargets.s3.amazonaws.com/budget/upload/nfse/NF-e_-_Nota_Fiscal_Eletrônica_de_Serviços_-_São_Paulo.pdf",
//    "https://keeptargets.s3.amazonaws.com/budget/upload/nfse/vazio.pdf",
//    "https://keeptargets.s3.amazonaws.com/budget/upload/nfse/NOTA_336336.pdf"
//]

(async function() {
    try {
        // Configurar a URL da sua função Lambda
        const lambdaUrl = "https://hmz017iq65.execute-api.sa-east-1.amazonaws.com/prod/extractpdftext";
        //const pdfUrls = properties.paramlist1.get(0, properties.paramlist1.length())
        const pdfUrls = ["https://keeptargets.s3.amazonaws.com/budget/upload/nfse/vazio.pdf"]
        //const erros = properties.paramlist2.get(0, properties.paramlist2.length())
        const erros = ["BAD_PDF;Arquivo Inválido"]
                    
        if (!Array.isArray(pdfUrls) || pdfUrls.length === 0) {
            throw new Error("[Extrair texto do PDF] Nenhuma URL de arquivo foi fornecida");
        }

        // Configuração da requisição
        const response = await fetch(lambdaUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ s3Urls: pdfUrls })
        });

        // Processar a resposta
        const result = await response.json();

        // Validar e transformar o resultado
        if (result && Array.isArray(result.results)) {
            const formattedResults = result.results.map((item) => {
                let mensagem = 'PROCESSADO'

                if (item.success === false) {
                    mensagem = erros.filter(str => str.includes(item.error.split('-')[0].trim()))[0].split(';')[1]
                }
                let itemTratado = item.extractedText || null
                return `${item.success};${item.url.split("/").pop().split("?")[0]};${item.url};${itemTratado};${mensagem}`;
            });

            // Enviar o resultado formatado como uma única string para o Bubble
            formattedResults.unshift(result.overallStatus)
            bubble_fn_texto(formattedResults);
        } else {
            throw new Error("[Extrair texto do PDF] Estrutura de retorno inválida");
        }
    } catch (error) {
        const erros = []

        // Enviar erro formatado para o Bubble
        erros.push('falha')
        erros.push(error.message)

        console.error(erros);
        bubble_fn_texto(erros);
    }
})();