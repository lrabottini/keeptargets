(async () => {
    const endpoint = `${properties.param5}`;
  
    const payload = {
        id_cliente: `${properties.param1}`,
        nome: `${properties.param2}`,
        dias_validade: properties.param3,
        tabelas_permitidas: `${properties.param4}`
    };
  
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
  
        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.error || "Erro ao gerar chave");
        }
    
        const data = await response.json();
    
        // Envia os dados de volta para o Bubble
        bubble_fn_dadosChave([
            "yes",
            `${data.id_cliente}`,
            `${data.chave_publica}`,
            `${data.criado_em}`,
            `${data.expira_em}`,
            `${data.tabelas_permitidas}`,
            `${data.dias_validade}`,
            `${data.nome}`,
            `${data.chave_secreta}`
        ])
  
    } catch (erro) {
        console.error("Erro ao gerar chave:", erro.message);
  
        // Retorno com erro
        bubble_fn_dadosChave([
            "no",
            `${erro.message}`
        ]);
    }
})();
  