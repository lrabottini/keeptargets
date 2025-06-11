(async () => {
    try {
        await navigator.clipboard.writeText(properties.param1);
        bubble_fn_copySecret('Chave secreta copiado com sucesso para a área de transferência.');
    } catch (err) {
        bubble_fn_copySecret('Falha ao copiar chave secreta para a área de transferência:', err);
    }
})();