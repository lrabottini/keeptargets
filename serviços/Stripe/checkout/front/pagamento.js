// valida formulário de pagamento
// saída: 0 - sem erros; 1 - com erros
(async () => {
    const {error: submitError} = await window.elements.submit();
    if (submitError) {
        bubble_fn_validaFormDePagamento(1);
    } else {
   
        bubble_fn_validaFormDePagamento(0);
    }
})
()

// avança com pagamento
// caso a saída da validação do formulário de pagamento
// seja 0
(async () => {
    const result = []

    // Create the SetupIntent and obtain clientSecret
    const res = await fetch("https://j3dwlzycg7.execute-api.sa-east-1.amazonaws.com/prod/create-intent", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ customer_id: properties.param1 })
    })
    
    const {client_secret: clientSecret, setup_intent_id: setupIntentId} = await res.json();
    
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
        const subscription = await fetch("https://j3dwlzycg7.execute-api.sa-east-1.amazonaws.com/prod/subscription", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customer_id: properties.param1,
                price_id:  properties.param2
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
            console.log(subscription.id)
            console.log(subscription.status)

            result.push("sucesso")
            result.push(subscription.id)
            result.push(subscription.status)
        }
    }
    
    bubble_fn_criaPlanoEmpresa(result);
})
()