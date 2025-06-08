// distribuição "replicar valor"
const valores = new Array(properties.param1).fill(properties.param2);

bubble_fn_aplicar_distribuicao(valores)


// distribuição uniforme
const valores = new Array(properties.param1).fill(0);

for (let i = 0; i <= properties.param1; i++) {
    valores[i-1] = (i % properties.param2 === 0) ? properties.param3 : 0;
}

bubble_fn_aplicar_distribuicao(valores)

//distribuição de - até
const valores = new Array(properties.param1).fill(0);

for (let i = properties.param2; i <= properties.param3; i++) {
    valores[i-1] = properties.param4;
}

bubble_fn_aplicar_distribuicao(valores)

//distribuição "com reajuste de"
const valores = new Array(properties.param1).fill(0);

for (let i = 0; i < properties.param2; i++) {
    valores[i-1] = properties.param3;
}

for (let i = properties.param2; i <= properties.param1; i++) {
    valores[i-1] = properties.param4;
}

bubble_fn_aplicar_distribuicao(valores)

//distribuição "com reajuste de"
const valores = properties.paramlist1.get(0, properties.paramlist1.length()).map(v => parseFloat(v) || 0);

valores[properties.param1-1] = properties.param2

bubble_fn_aplicar_distribuicao(valores)

//distribuição "parcela única"
const valores = new Array(properties.param1).fill(0);

valores[properties.param2-1] = properties.param3;

bubble_fn_aplicar_distribuicao(valores)

// lógica para ajustar o último item do array
// caso a soma do array seja maior ou menor que o valor a distribuir
const valores = properties.paramlist1.get(0, properties.paramlist1.length()).map(v => parseFloat(v) || 0);
const valorReferencia = parseFloat(properties.param1) || 0;

const soma = valores.reduce((a, v) => a + v, 0);
const diferenca = soma - valorReferencia;

// Encontra o índice da última posição com valor diferente de zero
let ultimoIndiceNaoZero = -1;
for (let i = valores.length - 1; i >= 0; i--) {
  if (valores[i] !== 0) {
    ultimoIndiceNaoZero = i;
    break;
  }
}

// Aplica a diferença, se encontrou índice válido
if (ultimoIndiceNaoZero >= 0) {
  valores[ultimoIndiceNaoZero] -= diferenca;
}

bubble_fn_aplicar_distribuicao(valores);

// distribuição "distribuir valor"
const valores = new Array(properties.param1).fill(properties.param1);

bubble_fn_aplicar_distribuicao(valores)

//distribuição "com aumento de"
const valores = new Array(properties.param1).fill(0);

for (let i = 0; i < properties.param2; i++) {
    valores[i-1] = properties.param3;
}

for (let i = properties.param2; i <= properties.param1; i++) {
    valores[i-1] = properties.param4;
}

bubble_fn_aplicar_distribuicao(valores)