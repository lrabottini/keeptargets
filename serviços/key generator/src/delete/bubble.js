(async () => {
    try {
        const url = `${properties.param3}?id_cliente=${encodeURIComponent(properties.param1)}&chave_publica=${encodeURIComponent(properties.param2)}`;
        const resposta = await fetch(url, {
            method: "DELETE",
        });
  
        const resultado = await resposta.json();
  
        if (resultado.sucesso === true) {
            bubble_fn_excluiChave(["yes"]);
        } else {
            bubble_fn_excluiChave(["no", `erro: ${resultado.erro}`]);
        }
    } catch (erro) {
        bubble_fn_excluiChave(["no", `erro: ${erro.message}`]);
    }
})();