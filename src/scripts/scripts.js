function calculaValorFinalMonetario() {
    function parseCurrency(value) {
        if (!value) {
            return 0;
        }
        // Remove "R$ ", pontos de milhar e converte para número em centavos
        return Math.round(parseFloat(value.replace('R$ ', '').replace(/\./g, '').replace(',', '.')) * 100) || 0;
    }

    let elements = document.querySelectorAll("[id^='input_previsto_monetario']");
    let total = 0;

    if (elements.length > 0) {
   
        // Soma os valores de cada campo input em centavos
        elements.forEach(function (element) {
            total += parseCurrency(element.value);
        });
    }

    return total/100
}

bubble_fn_calculavalorfinalmonetario(calculaValorFinalMonetario())

function totalizaValores() {
    function parseCurrency(value) {
        if (!value) {
            return 0;
        }
        // Remove "R$ ", pontos de milhar e converte para número em centavos
        return Math.round(parseFloat(value.replace('R$ ', '').replace(/\./g, '').replace(',', '.')) * 100) || 0;
    }

    let allPrevistoValor = document.querySelectorAll("[id^='input_previsto_monetario']");
    let totalPrevistoValor = 0;

    if (allPrevistoValor.length > 0) {
   
        // Soma os valores de cada campo input em centavos
        allPrevistoValor.forEach(function (element) {
            totalPrevistoValor += parseCurrency(element.value);
        });
    }

    let allRealizadoValor = document.querySelectorAll("[id^='input_realizado_valor']");
    let totalRealizadoValor = 0;

    if (allRealizadoValor.length > 0) {
   
        // Soma os valores de cada campo input em centavos
        allRealizadoValor.forEach(function (element) {
            totalRealizadoValor += parseCurrency(element.value);
        });
    }
    
    let allRealizadoUnidade = document.querySelectorAll("[id^='input_realizado_unidade']");
    let totalRealizadoUnidade = 0;

    if (allRealizadoUnidade.length > 0) {
   
        // Soma os valores de cada campo input em centavos
        allRealizadoUnidade.forEach(function (element) {
            totalRealizadoUnidade += parseFloat(element.value);
        });
    }
    
    return [totalPrevistoValor/100, totalRealizadoValor/100, totalRealizadoUnidade]
}

function get_index(valor){
    const lista = []
    return lista.indexOf(valor.replace(';', '|'))
}

get_index()

function valor_final(valor_final) {
    let previsto_unidade = document.querySelectorAll("[id=input_previsto_unidade]");

    return elements.length > 0 ? elements[elements.length-1].value : 0 
}
    

function listaValorPrevistoUnidade() {
    let lista = document.querySelectorAll("[id=input_previsto_unidade]");

    if (lista) {
        if (lista.length > 0) {
            return lista
        } else {
            return 
        }
    } else {
        return []
    }
}

function calculaValorFinalMonetario() {
    function parseCurrency(value) {
        if (!value) {
            return 0;
        }
        // Remove "R$ ", pontos de milhar e converte para número em centavos
        return Math.round(parseFloat(value.replace('R$ ', '').replace(/\./g, '').replace(',', '.')) * 100) || 0;
    }

    let elements = document.querySelectorAll("[id^='input_previsto_valor']");
    let total = 0;

    if (elements.length > 0) {
   
        // Soma os valores de cada campo input em centavos
        elements.forEach(function (element) {
            total += parseCurrency(element.value);
        });
    }

    return total/100
}

bubble_fn_calculavalorfinalmonetario(calculaValorFinalMonetario())

// Função para retornar os valores previstos e realizados, por distribuição
function retornaValores(id){
    function parseCurrency(value) {
        if (!value) {
            return 0;
        }
        // Remove "R$ ", pontos de milhar e converte para número em centavos
        return Math.round(parseFloat(value.replace('R$ ', '').replace(/\./g, '').replace(',', '.')) * 100) || 0;
    }

    var result = []

    const previstoValor = document.getElementById(`input_previsto_valor_${id}`)
    if (previstoValor) {
            if (previstoValor.value === null){
                result.push(0)
            } else {
                result.push(parseCurrency(previstoValor.value)/100)
            }
    } else {
        result.push(0)
    }

    const realizadoValor = document.getElementById(`input_realizado_valor_${id}`)
    if (realizadoValor) {
            if (realizadoValor.value === null){
                result.push(0)
            } else {
                result.push(parseCurrency(realizadoValor.value)/100)
            }
    } else {
        result.push(0)
    }

    const previstoUnidade = document.getElementById(`input_previsto_unidade_${id}`)
    if (previstoUnidade) {
            if (previstoUnidade.value === null){
                result.push(0)
            } else {
                result.push(parseFloat(previstoUnidade.value))
            }
    } else {
        result.push(0)
    }

    const realizadoUnidade = document.getElementById(`input_previsto_unidade_${id}`)
    if (realizadoUnidade) {
            if (realizadoUnidade.value === null){
                result.push(0)
            } else {
                result.push(parseFloat(realizadoUnidade.value))
            }
    } else {
        result.push(0)
    }

    return result
}

retornaPrevistoValor()

// Script Máscara R$
document.addEventListener('input', function(event) {
    // Função para aplicar formatação ao input
    function applyCurrencyFormatting(input) {
        let value = input.value;

        // Remove tudo que não for número
        value = value.replace(/\D/g, '');

        // Converte para formato de moeda (R$)
        value = (value / 100).toFixed(2);
        value = value.replace('.', ',');

        // Adiciona separador de milhar
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // Adiciona o símbolo de Real (R$)
        input.value = 'R$ ' + value;
    }

    // Função para restringir entrada apenas para números
    function restrictInputToNumbers(event) {
        const key = event.key;
        if (!/[0-9]|Backspace|Tab|ArrowLeft|ArrowRight/.test(key)) {
            event.preventDefault();
        }
    }

    // Tenta aplicar formatação para os campos repetidamente até que sejam carregados
    let checkExist = setInterval(function() {
        var input1 = document.getElementById('input_valor');
        var input2 = document.getElementById('input_valor_real');
        var input3 = document.querySelectorAll('[id^=input_previsto_valor]');
        var input4 = document.getElementById('input_reajuste_monetario')
        var input5 = document.querySelectorAll('[id^=input_realizado_valor]');
        
        if (input1 || input2 || input3.length > 0 || input4 || input5.length > 0) {
            // Aplica eventos de formatação nos campos
            [input1, input2, input4].forEach(input => {
                if (input) {
                    input.addEventListener('input', function() {
                        applyCurrencyFormatting(input);
                    });
                    input.addEventListener('keydown', function(event) {
                        restrictInputToNumbers(event);
                    });
                }
            });

            // Para input3 (array), aplica a formatação em cada elemento
            input3.forEach(input => {
                input.addEventListener('input', function() {
                    applyCurrencyFormatting(input);
                });
                input.addEventListener('keydown', function(event) {
                    restrictInputToNumbers(event);
                });
            });

            // Para input3 (array), aplica a formatação em cada elemento
            input5.forEach(input => {
                input.addEventListener('input', function() {
                    applyCurrencyFormatting(input);
                });
                input.addEventListener('keydown', function(event) {
                    restrictInputToNumbers(event);
                });
            });

            clearInterval(checkExist); // Para de verificar após encontrar os inputs
        }
    }, 100); // Verifica a cada 100ms
});

// Script Valor Final Monetário 
document.addEventListener('input', function(event) {
    if (event.target.id.startsWith('input_previsto_monetario')) {
        // Função para converter e limpar o valor monetário, garantindo que centavos sejam considerados
        function parseCurrency(value) {
            if (!value) {
                return 0;
            }
            // Remove "R$ ", pontos de milhar e converte para número em centavos
            return Math.round(parseFloat(value.replace('R$ ', '').replace(/\./g, '').replace(',', '.')) * 100) || 0;
        }

        // Função para formatar o valor como Real brasileiro (R$)
        function formatToBRL(value) {
            return (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }

        let elements = document.querySelectorAll("[id^='input_previsto_monetario']");
    
        if (elements.length > 0) {
            let total = 0;
        
            // Soma os valores de cada campo input em centavos
            elements.forEach(function (element) {
                total += parseCurrency(element.value);
            });

            // Formata o valor total e exibe no campo de valor final
            var target = document.getElementById('input_valor_final_monetario');
            target.value = formatToBRL(total);
        } else {
            // Se não houver elementos, define o valor como R$ 0,00
            var target = document.getElementById('input_valor_final_monetario');
            target.value = formatToBRL(0);
        }
    }
});


// Script Valor Final Unidade
document.addEventListener('input', function(event) {
    if (event.target.id.startsWith('input_previsto_unidade')) {
        var elements = document.querySelectorAll("[id^=input_previsto_unidade]");
    
        var target = document.getElementById("input_valor_final_unidade")

        target.value = elements.length > 0 ? elements[elements.length-1].value : 0
    }
})