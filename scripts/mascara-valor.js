<script>
document.addEventListener('input', function (event) {
    const getValue = id => {
        const el = document.getElementById(id);
        return el ? el.innerText.trim() : '';
    };

    const min = parseFloat(getValue('text_min').replace(',', '.')) || 0;
    const max = parseFloat(getValue('text_max').replace(',', '.')) || Infinity;
    const validaRange = getValue('text_valida_range').toLowerCase() === "yes";

    const applyCurrencyFormatting = input => {
        let raw = input.value.replace(/\D/g, '');
        let numeric = parseFloat(raw) / 100 || 0;

        const isOutOfRange = validaRange && (numeric < min || numeric > max);
        if (isOutOfRange) {
            input.setCustomValidity(`Valor deve estar entre ${min.toLocaleString('pt-BR')} e ${max.toLocaleString('pt-BR')}`);
        } else {
            input.setCustomValidity('');
        }

        if (isOutOfRange && document.activeElement !== input) {
            numeric = min;
        }

        const formatted = numeric
            .toFixed(2)
            .replace('.', ',')
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        input.value = formatted;

        if (typeof bubble_fn_valor_numerico === 'function') {
            bubble_fn_valor_numerico(numeric);
        }

        if (!input.checkValidity()) {
            input.reportValidity();
        }
    };

    const restrictToNumbers = e => {
        if (!/[0-9]|Backspace|Tab|ArrowLeft|ArrowRight/.test(e.key)) {
            e.preventDefault();
        }
    };

    const attachToInputs = () => {
        const inputs = document.querySelectorAll('[id^=value_input]');
        if (inputs.length === 0) return false;

        inputs.forEach(input => {
            if (input.dataset.hasListeners === 'true') return;

            input.addEventListener('input', () => applyCurrencyFormatting(input));
            input.addEventListener('keydown', restrictToNumbers);
            input.addEventListener('blur', () => applyCurrencyFormatting(input));
            input.dataset.hasListeners = 'true';

            applyCurrencyFormatting(input);
        });

        return true;
    };

    attachToInputs();
    const interval = setInterval(() => {
        if (attachToInputs()) clearInterval(interval);
    }, 100);
});
</script>


(function() {
    // ID do input definido no editor Bubble
    const inputId = `input_realizado_valor_${param.properties1}`;
    const mensagem = `O valor deve ser entre 0 e ${param.properties2}`;
  
    const input = document.getElementById(inputId);
  
    if (input) {
      // Define a mensagem de erro personalizada
      input.setCustomValidity(mensagem);
  
      // Verifica a validade e exibe a mensagem (tooltip nativo)
      input.reportValidity();
  
      // Limpa a mensagem personalizada para que não fique travada
      setTimeout(() => {
        input.setCustomValidity('');
      }, 5000);
    }
})

();
  

