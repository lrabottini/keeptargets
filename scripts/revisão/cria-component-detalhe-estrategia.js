<script>
let ultimoIdAberto = null; // rastreia se o mesmo ícone foi clicado novamente

function mostrarComponenteDinamico(id, valorInicial = 0, estrategia) {
	const icone = document.getElementById(`icon-detalhe-estrategia-${id}`);
  	const dropdown = document.getElementById(`dd-estrategia-revisao-${id}`);
  	if (!icone || !dropdown) {
    	console.warn('Ícone ou dropdown não encontrados.');
    	return;
  	}

  	// Se o mesmo ícone foi clicado novamente, remove e reseta
  	const existente = document.getElementById('gf-aplicar-percentual');
  	if (existente) {
    	if (ultimoIdAberto === id) {
      		existente.remove();
      		ultimoIdAberto = null;
      		return;
    	} else {
      		existente.remove();
    	}
  	}

  	// Novo id aberto
  	ultimoIdAberto = id;

  	// HTML do componente
  	const html = `
		<div class="bubble-element GroupFocus cmrgk bubble-r-container flex column" 
		id="gf-aplicar-percentual" 
		data-origem="${id}"
		style="min-width: 60px; max-width: 280px; min-height: 120px; height: auto; z-index: 2177; overflow-y: auto; position: absolute; justify-content: flex-start; border-radius: 0px;">
		
		<div class="bubble-element Group cmrgq bubble-r-container flex column" data-outline="true"
			style="background-color: rgb(255, 255, 255); box-shadow: 2px 2px 8px 2px var(--color_cmUvH_default); overflow: visible; justify-content: flex-start; row-gap: 16px; border-style: solid; border-width: 1px; border-color: var(--color_cmOAN1_default); border-radius: 8px; padding: 16px; opacity: 1; align-self: flex-start; min-width: 40px; min-height: 40px; height: max-content; flex-grow: 0; flex-shrink: 0; width: calc(100% - 16px); margin: 8px; z-index: 6;">
		
			<input class="bubble-element Input cmrhaN" 
			type="text" placeholder="0%" inputmode="decimal"
			style="background-color: rgb(255, 255, 255); border-style: solid; border-width: 1px; border-color: rgba(var(--color_text_default_rgb), 0.15); border-radius: 5px; font-family: var(--font_default); font-size: 14px; font-weight: 400; color: var(--color_text_default); text-align: center; padding: 4px 6px; opacity: 1; align-self: stretch; width: 100%; min-height: 40px; height: 40px; margin: 0px; z-index: 4;">
		
			<button class="clickable-element bubble-element Button cmrgx"
			style="background-color: var(--color_cmNzx1_default); font-family: Roboto; font-size: 16px; font-weight: bold; color: rgb(255, 255, 255); text-align: center; border-radius: 8px; padding: 16px; opacity: 1; cursor: pointer; align-self: center; width: 100%; margin: 0px; z-index: 5;">
			Aplicar
			</button>
		</div>
		</div>`;

  	const wrapper = document.createElement('div');
  	wrapper.innerHTML = html;
  	const componente = wrapper.firstElementChild;
  	document.body.appendChild(componente);

  	// Posicionamento
  	const rect = dropdown.getBoundingClientRect();
  	const alturaComponente = componente.getBoundingClientRect().height;
  	const alturaJanela = window.innerHeight;

  	const top = (rect.bottom + alturaComponente - 4 > alturaJanela)
    	? window.scrollY + rect.top - alturaComponente + 4
    	: window.scrollY + rect.bottom - 4;

  	const left = window.scrollX + rect.left - 8;
  	componente.style.top = `${top}px`;
  	componente.style.left = `${left}px`;

  	// Máscara de porcentagem com suporte a decimal
  	const input = componente.querySelector('input');
	if (valorInicial !== null && valorInicial !== undefined) {
    	let valStr = String(valorInicial).replace('.', ',');
    	input.value = valStr + '%';
  	} else {
    	input.value = '0%';
  	}
  	aplicarMascaraPercentual(input);

	const botao = componente.querySelector('button');
	botao.addEventListener('click', () => {
		const valorRaw = input.value.replace('%', '').trim();

		if (window.bubble_fn_aplicaEstrategia) {
			window.bubble_fn_aplicaEstrategia(`${id}|${valorRaw}|${estrategia}`)
		}

		componente.remove();
		ultimoIdAberto = null;
	});
  
    // Fecha ao clicar fora
  	const fechar = (e) => {
    	if (!componente.contains(e.target) && !icone.contains(e.target)) {
      		componente.remove();
      		document.removeEventListener('mousedown', fechar);
      		ultimoIdAberto = null;
    	}
  	};
  	setTimeout(() => {
    	document.addEventListener('mousedown', fechar);
  	}, 0);
}

function aplicarMascaraPercentual(input) {
  	input.addEventListener('input', () => {
    	let valor = input.value;

    	// Remove tudo que não for número ou vírgula
    	valor = valor.replace(/[^\d,]/g, '');

    	// Garante que só haja uma vírgula
    	const partes = valor.split(',');
    	if (partes.length > 2) {
      		valor = partes[0] + ',' + partes[1];
    	}

    	// Remove zeros à esquerda
    	if (partes[0]) {
      		partes[0] = partes[0].replace(/^0+(?!\b)/, '') || '0';
    	}

    	// Limita a 2 casas decimais
    	if (partes[1]) {
      		partes[1] = partes[1].slice(0, 2);
    	}

    	valor = partes.join(',');

    	// Verifica se é número e maior ou igual a 0
    	const numero = parseFloat(valor.replace(',', '.'));
    	if (!isNaN(numero) && numero >= 0) {
      		input.value = valor + '%';
    	} else {
      		input.value = '0%';
    	}
  	});

  	input.addEventListener('focus', () => {
    	// Remove o símbolo % ao focar
    	if (input.value.endsWith('%')) {
      		input.value = input.value.slice(0, -1);
    	}
    	input.select();
  	});

	input.addEventListener('blur', () => {
		// Reaplica o símbolo % ao sair do campo
		if (!input.value.endsWith('%') && input.value !== '') {
			input.value += '%';
		}
	});

  	input.addEventListener('keydown', (e) => {
    	if (['Backspace', 'Delete'].includes(e.key)) {
      		e.preventDefault();
      		input.value = '';
    	}
  	});
}
</script>