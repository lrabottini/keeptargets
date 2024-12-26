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

    let allPrevistoValor = document.querySelectorAll("[id^='input_previsto_valor']");
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
    
    console.log(totalPrevistoValor/100)
    console.log(totalRealizadoValor/100)
    console.log(totalRealizadoUnidade)

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
            result.push((0).toFixed(2))
        } else {
            result.push((parseCurrency(previstoValor.value) / 100).toFixed(2))
        }
    } else {
        result.push((0).toFixed(2))
    }

    const realizadoValor = document.getElementById(`input_realizado_valor_${id}`)
    if (realizadoValor) {
        if (realizadoValor.value === null){
            result.push((0).toFixed(2))
        } else {
            result.push((parseCurrency(realizadoValor.value) / 100).toFixed(2))
        }
    } else {
        result.push((0).toFixed(2))
    }

    const previstoUnidade = document.getElementById(`input_previsto_unidade_${id}`)
    if (previstoUnidade) {
        if (previstoUnidade.value === null){
            result.push((0).toFixed(2))
        } else {
            result.push(parseFloat(previstoUnidade.value).toFixed(2))
        }
    } else {
        result.push((0).toFixed(2))
    }

    const realizadoUnidade = document.getElementById(`input_realizado_unidade_${id}`)
    if (realizadoUnidade) {
        if (realizadoUnidade.value === null){
            result.push((0).toFixed(2))
        } else {
            result.push(parseFloat(realizadoUnidade.value).toFixed(2))
        }
    } else {
        result.push((0).toFixed(2))
    }

    return result
}

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

const distribuicao = {
    "ano": "",
    "mes": "",
    "observações": "",
    "ordem": "",
    "previsto unitário": "",
    "previsto valor": "",
    "realizado unitário": "",
    "realizado valor": "",
    "situação financeira": "",
    "anexos": [
        {
            "url":""
        }
    ]
}

function xxx {
    const valores = 

    var distribuicao = JSON.parse(objeto)
    
    console.log(distribuicao)
    console.log(distribuicao["previsto unitário"])
    console.log(distribuicao["previsto valor"])
    console.log(distribuicao["realizado unitário"])
    console.log(distribuicao["realizado valor"])
    
    objeto["previsto unitário"] = 0
    objeto["previsto valor"] = 0
    objeto["realizado unitário"] = 0
    objeto["realizado valor"] = 0
    
    //bubble_fn_atualizaDistribuicao(JSON.stringify(distribuicao))
    
    //?<=\"previsto valor\":\")[0-9]+\.[0-9]{2}
    
    
    //{value_list: filtro[0], output1: filtro.slice(1).join(';')}}
}

function {
    var saldo_ate = 
    var saldo_a_partir = 
    var saldo_final = saldo_a_partir - saldo_ate

    bubble_fn_retorna_saldo_final(saldo_final)
}

// Aplicar distribuição

const valores = []

for (mes = 1; mes <= 12; mes++){
    if (mes%5==0){
        valores.push()
    } else {
        valores.push(0)
    }
}

<script>
  // Injetando CSS dinamicamente
  let style = document.createElement('style');
  style.innerHTML = `
    #menu_linha {
        display: none; /* Inicialmente escondido */
        background-color: rgba(255, 0, 0, 0.5); /* Cor de fundo visível para depuração */
        padding: 10px;
        border-radius: 5px;
        color: white;
        position: absolute; /* Necessário para o posicionamento absoluto */
        min-width: 100px;
        min-height: 50px;
        border: 2px solid black; /* Bordas visíveis para depuração */
        z-index: 99999; /* Garantir que o Focus Group fique acima de todos os outros elementos */
        pointer-events: all; /* Garante que o Focus Group seja interativo */
    }
  `;
  document.head.appendChild(style);

  <script>
  // Injetando CSS dinamicamente para garantir que o menu tenha um z-index adequado
  let style = document.createElement('style');
  style.innerHTML = `
    #menu_linha {
        display: none; /* Inicialmente escondido */
        background-color: rgba(255, 0, 0, 0.5); /* Cor de fundo visível para depuração */
        padding: 10px;
        border-radius: 5px;
        color: white;
        position: absolute; /* Necessário para o posicionamento absoluto */
        min-width: 100px;
        min-height: 50px;
        border: 2px solid black; /* Bordas visíveis para depuração */
        z-index: 99999; /* Garantir que o Focus Group fique acima de todos os outros elementos */
        pointer-events: all; /* Garante que o Focus Group seja interativo */
    }
  `;
  document.head.appendChild(style);

  // Injetando o Script
  let interval = setInterval(function() {
      // Seleciona todos os grupos com ID que começa com "grp_menu_linha"
      let groups = document.querySelectorAll('[id^=grp_menu_linha]');
      
      // Verifica se os grupos foram carregados
      if (groups.length > 0) {
          clearInterval(interval); // Para o intervalo após os elementos serem encontrados

          groups.forEach(function(group) {
              console.log("Grupo encontrado:", group.id);

              // Adiciona o evento de clique ao grupo
              group.addEventListener("click", function(event) {
                  console.log("Grupo clicado:", group.id); // Verifica se o clique foi detectado

                  let focusGroup = document.getElementById("menu_linha");

                  if (focusGroup) {
                      // Força a exibição do Focus Group
                      focusGroup.style.display = "block"; // Garante que o Focus Group será exibido

                      // Obtém as coordenadas do grupo clicado
                      let groupRect = group.getBoundingClientRect(); 
                      console.log("Coordenadas do grupo:", groupRect); // Exibe as coordenadas para depuração

                      // Calcula a posição do Focus Group
                      let top = groupRect.top + window.scrollY + groupRect.height / 2 - focusGroup.offsetHeight / 2;
                      let left = groupRect.left + window.scrollX - focusGroup.offsetWidth - 10;

                      // Aplica o "reference element" ao Focus Group
                      focusGroup.style.position = "absolute";
                      focusGroup.style.top = `${top}px`;
                      focusGroup.style.left = `${left}px`;

                      // Exibe a posição calculada do Focus Group para depuração
                      console.log("Posição calculada do Focus Group:", focusGroup.style.left, focusGroup.style.top);
                  }
              });
          });
      }
  }, 100); // Verifica a cada 100ms se os grupos foram carregados

  // Função para fechar o Floating Group ao clicar fora
  document.addEventListener("click", function(event) {
      let focusGroup = document.getElementById("menu_linha");

      // Verifica se o clique foi fora do Floating Group e do grupo que o disparou
      if (focusGroup && !focusGroup.contains(event.target) && !document.querySelector('[id^=grp_menu_linha]:hover')) {
          console.log("Clique fora do Floating Group, fechando...");
          focusGroup.style.display = "none"; // Esconde o Floating Group
      }
  });
</script>


