// Desabilita inputs
const groupNodes = document.querySelectorAll(`[id^=g-simulacao-${properties.param1}-]`);
const inputNodes = document.querySelectorAll(`[id^=input-simulacao-${properties.param1}-]`);

// Etapa 1: prepara os elementos para alteração sem aplicar ainda (se necessário, pode armazenar os alvos)
const groups = Array.from(groupNodes);
const inputs = Array.from(inputNodes);

// Etapa 2: aplica os estilos de forma agrupada
setTimeout(() => {
    groups.forEach(group => {
        group.style.backgroundColor = "rgba(120, 120, 120, 0.2)";
    });

    inputs.forEach(input => {
        input.disabled = true;
    });

    bubble_fn_aplicaEstrategia(properties.param3)
}, 0);

// Habilita inputs
const groupNodes = document.querySelectorAll(`[id^=g-simulacao-${properties.param1}-]`);
const inputNodes = document.querySelectorAll(`[id^=input-simulacao-${properties.param1}-]`);

// Etapa 1: prepara os elementos para alteração sem aplicar ainda (se necessário, pode armazenar os alvos)
const groups = Array.from(groupNodes);
const inputs = Array.from(inputNodes);

// Etapa 2: aplica os estilos de forma agrupada
setTimeout(() => {
    groups.forEach(group => {
        group.style.backgroundColor = "rgba(255, 255, 255)"
    });

    inputs.forEach(input => {
        input.disabled = false;
    });

    bubble_fn_aplicaEstrategia(properties.param3)
}, 0);