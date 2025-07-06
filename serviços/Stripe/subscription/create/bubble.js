(async () => {
    try {
        const res = await fetch(properties.param1, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id_cliente: properties.param2 })
        }).then(response => {
            return response.json()
        }).then(data => {
            return data
        }).catch(error => {
            return error
        })

        if (res.return_code !== 'SETUP_INTENT_CREATED'){
            throw new Error(JSON.stringify({
                return_code: res.return_code,
                error: res.error
            }))
        }

        const clientSecret = res.client_secret;
    
        // Confirm the SetupIntent using the details collected by the Payment Element
        try{
            const result = await window.stripe.confirmSetup({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: window.location.origin + "/success",
                },
                redirect: "if_required"
            });

            const setupIntent = result.setupIntent
            const paymentMethodId = setupIntent.payment_method

            const subscription = await fetch(`${properties.param4}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_cliente: properties.param2,
                    id_preco:  properties.param3,
                    metodo_pagamento: paymentMethodId,
                    id_assinatura_anterior: properties.param5
                })
            }).then(response => {
                return response.json();
            }).catch(error => {
                return error
            });
            
            if (subscription.return_code !== "SUB_CREATION_SUCCESS"){
                throw new Error(JSON.stringify({
                    return_code: subscription.return_code,
                    error: subscription.error
                }))
            }
    
            if (subscription){
                bubble_fn_criaPlanoEmpresa([subscription.return_code, subscription.id_assinatura, subscription.status]);
            }
        } catch (error) {
            throw new Error(JSON.stringify({
                return_code: 'SUB_CONFIRM_SETUP_ERROR',
                error: error.message
            }))
        }
    } catch (error){
        const obj = JSON.parse(error.message);
        const result = Object.values(obj);        
        bubble_fn_criaPlanoEmpresa(result);
    }
})
()