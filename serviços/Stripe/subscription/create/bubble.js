(async () => {
    const result = []

    // Create the SetupIntent and obtain clientSecret
    const res = await fetch(`${properties.param1}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_cliente: properties.param2 })
    })
    
    const {client_secret: clientSecret} = await res.json();
    
    // Confirm the SetupIntent using the details collected by the Payment Element
    const {error} = await window.stripe.confirmSetup({
        elements,
        clientSecret,
        confirmParams: {
            return_url: window.location.origin + "/success",
        },
        redirect: "if_required"
    });
    
    if (error) {
        console.log(error)
    
        result.push("erro")
        result.push(error.message)
    
    } else {
        const subscription = await fetch(`${properties.param4}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_cliente: properties.param2,
                id_preco:  properties.param3
            })
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        }).catch(error => {
            console.error("Erro ao criar a assinatura:", error);
            return null; // Retorna `null` caso haja erro, evitando quebra do código
        });

        if (subscription){

            console.log(subscription)
            console.log(subscription.id_assinatura)
            console.log(subscription.status)

            result.push("sucesso")
            result.push(subscription.id_assinatura)
            result.push(subscription.status)
        }
    }
    
    bubble_fn_criaPlanoEmpresa(result);
})
()