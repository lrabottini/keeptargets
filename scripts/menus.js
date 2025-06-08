let index = properties.param1; // Passe isso dinamicamente do Bubble
let button_id = `menu-botao-${index}`;
let menu = document.getElementById("menu-fg");
let button = document.getElementById(button_id);

if (!button || !menu) {
	console.log("Botão ou menu não encontrados.");
} else {
	// Torna o menu visível, mas ainda escondido visualmente
	menu.style.position = "absolute";  // Usar 'absolute' para controle preciso de posição
	menu.style.visibility = "hidden";  // Inicialmente invisível
	menu.style.display = "block";  // Torna o menu renderizável

  	// Aguarda o próximo frame para garantir que o menu foi renderizado
  	requestAnimationFrame(() => {
		let buttonRect = button.getBoundingClientRect();
		let buttonTop = buttonRect.top + window.scrollY;  // Adiciona a rolagem da página, se necessário
		let buttonLeft = buttonRect.left + window.scrollX;  // Adiciona a rolagem da página, se necessário
		let buttonHeight = buttonRect.height;
		let windowHeight = window.innerHeight;
		let menuHeight = menu.offsetHeight;

		// A lógica de exibição para cima ou para baixo
		let showAbove = buttonTop + buttonHeight + menuHeight > windowHeight;
		let menuTop = showAbove
		? buttonTop - menuHeight - 8  // Exibir acima
		: buttonTop + buttonHeight + 8;  // Exibir abaixo

		// Alinhamento à direita do botão com o deslocamento de 8px para a esquerda
		let menuLeft = buttonLeft + button.offsetWidth - menu.offsetWidth;

		// Atualiza a posição do menu
		menu.style.top = menuTop + "px";
		menu.style.left = menuLeft + "px";
		menu.style.visibility = "visible";  // Torna o menu visível
  	});

  	// Fecha o menu ao clicar fora dele
  	document.addEventListener("click", (event) => {
    	// Verifica se o clique ocorreu fora do botão e do menu
    	if (!menu.contains(event.target) && !button.contains(event.target)) {
      		menu.style.visibility = "hidden";  // Fecha o menu
    	}
  	});
}