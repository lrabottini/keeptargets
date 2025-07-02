(async () => {
    const customerId = properties.param1
    const action = properties.param2
  
    try {
        const response = await fetch(`${properties.param3}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_cliente: customerId,
                acao: action
            })
        });
  
        const result = await response.json();
  
        if (!response.ok || !result.url) {
            console.error("Erro ao gerar portal:", result.error);
            bubble_fn_stripeportal([
                `${properties.param4}`,
                `${result.error}`
            ])
            return;
        }
  
        console.log("URL do portal Stripe:", result.url);
  
        // Envia resultado para Bubble (opcional)
        bubble_fn_stripeportal([
            `${properties.param5}`,
            `${result.url}`
        ])
    } catch (err) {
        console.error("Erro na chamada:", err.message);
        bubble_fn_stripeportal([
            `${properties.param4}`,
            `${err.message}`
        ])
    }
})()