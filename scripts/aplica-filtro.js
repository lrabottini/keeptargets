<script>
    document.addEventListener('input', function(event){
        const input = document.getElementById('estrutura_search_box');
        if (!input) {
            console.warn('Input com ID "estrutura_search_box" não encontrado.');
            return;
        }

        let timeoutId = null;

        input.addEventListener('input', () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                const valor = input.value;

                bubble_fn_searchEstrutura()
            }, 1000);
        });
    });
</script>