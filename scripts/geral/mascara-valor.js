<script>
// Máscara R$ - Formatação de moeda BRL
document.addEventListener('input', function () {
    // Formata o valor como moeda BR
    const applyCurrencyFormatting = (input) => {
        let value = input.value.replace(/\D/g, '');

        value = (parseInt(value || '0', 10) / 100).toFixed(2);
        value = value.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        input.value = value;
    };

    // Permite apenas números e teclas de navegação
    const restrictInputToNumbers = (event) => {
        if (!/^[0-9]|Backspace|Tab|ArrowLeft|ArrowRight$/.test(event.key)) {
            event.preventDefault();
        }
    };

    // Aplica os eventos aos inputs informados
    const addCurrencyMask = (inputs) => {
        inputs.forEach(input => {
            if (input) {
                input.addEventListener('input', () => applyCurrencyFormatting(input));
                input.addEventListener('keydown', restrictInputToNumbers);
            }
        });
    };

    // Espera elementos aparecerem no DOM
    const checkExist = setInterval(() => {
        const inputsStatic = [
            document.getElementById('input_valor'),
            document.getElementById('input_valor_real'),
            document.getElementById('input_reajuste_monetario')
        ].filter(Boolean);

        const inputsDynamic = [
            ...document.querySelectorAll('[id^=input_previsto_valor]'),
            ...document.querySelectorAll('[id^=input_realizado_valor]'),
            ...document.querySelectorAll('[id^=input-simulacao]')
        ];

        const allInputs = [...inputsStatic, ...inputsDynamic];

        if (allInputs.length > 0) {
            addCurrencyMask(allInputs);
            clearInterval(checkExist);
        }
    }, 100);
});
</script>