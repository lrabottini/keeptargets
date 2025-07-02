(function() {
    // ID do input definido no editor Bubble
    const inputId = `input_simulacao_${properties.param1}_${properties.param2}`;
    const mensagem = `O valor não pode ser menor que ${properties.param3} 0,00`;
  
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