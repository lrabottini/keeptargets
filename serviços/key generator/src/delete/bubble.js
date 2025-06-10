(async () => {
    const payload = {
        id_cliente: `${properties.param1}`,
        chave_publica: `${properties.param2}`
    };
  
    try {
        const resposta = await fetch("https://n4po04bzta.execute-api.sa-east-1.amazonaws.com/prod/chaves/delete", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
  
        const resultado = await resposta.json();
  
        if (resultado.sucesso === true) {
            bubble_fn_dadosChave(["delete", "yes"]);
        } else {
            bubble_fn_dadosChave(["delete", "no", `erro: ${resultado.erro}`]);
        }
    } catch (erro) {
        bubble_fn_dadosChave(["delete", "no", `erro: ${erro.message}`]);
    }
})();