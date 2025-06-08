// função Lambda
app.post('/subscription/update-quantity', async (req, res) => {
    addCorsHeaders(res);

    const { subscription_id, quantity, customer_id } = req.body;

    if (!customer_id) {
        return res.status(400).json({ error: 'O ID do cliente não foi encontrado' });
    }

    if (!subscription_id) {
        return res.status(400).json({ error: 'O ID da assinatura não foi encontrado' });
    }

    if (!quantity) {
        return res.status(400).json({ error: 'Necessário informar a quantidade' });
    }

    try {
        // Cria o evento de medição
        await stripe.meterEvents.create({
            subscription_item: subscription_id,
            customer: customer_id,
            timestamp: Math.floor(Date.now() / 1000),
            quantity: quantity,
            action: 'set', // substitui o valor anterior
            idempotency_key: `meter-${subscription_id}-${Date.now()}`
        });

        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Quantidade atualizada com sucesso' })
        };
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao atualizar quantidade',
            error: error.message
        });
    }
});

// chamada do Lambda
const response = await fetch(properties.thing1, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "x-api-key": "Po3agV1XER7zWSCqKVsYP4xCogqgk50fawmyL3cG"
    },
    body: JSON.stringify({
      customer_id: properties.thing2,
      quantity: properties.thing3
    })
});
  
const result = await response.json();
return JSON.stringify(result);

// função para cálculo da média

// Garante que a lista de logs é um array
const logs = Array.isArray(properties.thinglist1) ? properties.thinglist1 : [];

// Converte timestamps UNIX para objetos Date
const inicio = new Date(properties.thing1 * 1000);
const fim = new Date(properties.thing2 * 1000);

// Parâmetros adicionais
const minLicenses = properties.thing3;
const ativosAnteriores = properties.keyvaluesobj["thing4"] || 0;

// Set para manter usuários ativos no início
const ativosIniciais = new Set();

// Mapa que armazena o status final de cada usuário antes do início do período
const ativosMap = {};

// Itera sobre os logs para preencher o mapa
logs.forEach(log => {
  const dataLog = new Date(log.get("Created Date"));
  const userId = log.get("id_do_objeto_text");
  const evento = log.get("evento_option_evento");

  if (dataLog < inicio) {
    ativosMap[userId] = evento;
  }
});

// Pega os que estavam ativados no início
Object.entries(ativosMap).forEach(([user_id, status]) => {
    if (status === "ativado") {
        ativosIniciais.add(user_id);
    }
});

// Se não houver logs prévios, usa o número informado
while (ativosIniciais.size < ativosAnteriores) {
    ativosIniciais.add(`usuario_${ativosIniciais.size + 1}`); // mock IDs únicos
}

const dias = (fim - inicio) / (1000 * 60 * 60 * 24);
const semanas = Math.ceil(dias / 7);
const picos = [];

let ativosSemanaPassada = new Set(ativosIniciais);

for (let i = 0; i < semanas; i++) {
    const semanaInicio = new Date(inicio);
    semanaInicio.setDate(semanaInicio.getDate() + i * 7);
    const semanaFim = new Date(semanaInicio);
    semanaFim.setDate(semanaFim.getDate() + 7);

    // Copia os ativos da semana anterior
    const ativos = new Set(ativosSemanaPassada);

    logs.forEach(log => {
        const dataLog = new Date(log.get("Created Date"));
        if (dataLog >= semanaInicio && dataLog < semanaFim) {
        if (log.get("evento_option_evento") === "ativado") {
            ativos.add(log.get("id_do_objeto_text"));
        } else if (log.get("evento_option_evento")  === "desativado") {
            ativos.delete(log.get("id_do_objeto_text"));
        }
        }
    });

    picos.push(ativos.size);
    ativosSemanaPassada = new Set(ativos); // Para próxima semana
}

// Se nenhum pico foi registrado, usar os ativos anteriores como base
if (picos.length === 0) {
    picos.push(ativosIniciais.size);
}

const media = Math.round(picos.reduce((a, b) => a + b, 0) / picos.length);
const resultadoFinal = Math.max(media, minLicenses);

return {
    picos_semanas: picos,
    media_calculada: media,
    resultado_final: resultadoFinal
};