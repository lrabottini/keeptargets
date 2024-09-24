function soma_previsto(valor_final) {
    // Função para remover "R$" e converter para número
    function parseCurrency(value) {
        // Verifica se o valor é vazio, nulo ou indefinido, e retorna 0 nesses casos
        if (!value) {
            return 0;
        }
        return parseFloat(value.replace('R$ ', '').replace(',', '')) || 0;
    }

    // Selecionar todos os elementos com o id=input_previsto_monetario
    let elements = document.querySelectorAll("[id=input_previsto_monetario]");

    // Inicializar soma
    let total = 0;

    // Iterar sobre os elementos, remover "R$" e somar os valores
    elements.forEach(function (element) {
        total += parseCurrency(element.value);
    });

    // Retornar o resultado da soma
    return total;
}

function retorna_valor_previsto(id){
    const previsto_monetario = document.getElementById(`input_previsto_monetario_${id}`)
    if (previsto_monetario) {
        const valor =  parseFloat(previsto_monetario.value.replace(/[^0-9,-]+/g, '').replace(',', '.')).toFixed(2)
        return valor
    } else {
        return 0;
    }
}


retorna_valor_previsto()

soma_previsto(0);


function get_index(valor){
    const lista = []
    return lista.indexOf(valor.replace(';', '|'))
}

get_index()

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
        var input3 = document.querySelectorAll('[id^=input_previsto_monetario]'); // Array de elementos para input3
        var input4 = document.getElementById('input_reajuste_monetario')
        
        if (input1 || input2 || input3.length > 0 || input4) {
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

            clearInterval(checkExist); // Para de verificar após encontrar os inputs
        }
    }, 100); // Verifica a cada 100ms
});


function soma_previsto(valor_final) {
    // Função para remover "R$" e converter para número
    function parseCurrency(value) {
        // Verifica se o valor é vazio, nulo ou indefinido, e retorna 0 nesses casos
        if (!value) {
            return 0;
        }
        return parseFloat(value.replace('R$ ', '').replace(',', '')) || 0;
    }

    // Selecionar todos os elementos com o id=input_previsto_monetario
    let elements = document.querySelectorAll("[id=input_previsto_monetario]");

    // Inicializar soma
    let total = 0;

    // Iterar sobre os elementos, remover "R$" e somar os valores
    elements.forEach(function (element) {
        total += parseCurrency(element.value);
    });

    // Retornar o resultado da soma
    return total;
}

soma_previsto(0);

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

listaValorPrevistoUnidade()

// Script Valor Final Monetário 
document.addEventListener('input', function(event) {
    if (event.target.id.startsWith('input_previsto_monetario')) {
        function parseCurrency(value) {
            if (!value) {
                return 0;
            }
            return parseFloat(value.replace('R$ ', '').replace(',', '')) || 0;
        }

        let elements = document.querySelectorAll("[id^='input_previsto_monetario']");
    
        if (elements.length > 0) {
            let total = 0;
        
            elements.forEach(function (element) {
                total += parseCurrency(element.value);
            });

            var target = document.getElementById('input_valor_final_monetario');
            target.value = total;
        } else {
            target.value = 0;
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