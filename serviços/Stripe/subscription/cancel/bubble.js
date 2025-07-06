(async () => {
    try {
        const res = await fetch(properties.param1, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                subscription_id: properties.param2,
                licencas_ativas: properties.param3,
                customer_id: properties.param4
            })
        }).then(response => {
            return response.json()
        }).catch(error => {
            return error
        })

        if (res. return_code !== 'SUB_CANCELLATION_SUCCESS'){
            throw new Error(JSON.stringify({
                return_code: res.return_code,
                error: res.error
            }))
        }

        bubble_fn_cancelar_assinatura([res.return_code, res.status, res.assinatura_id]);
    } catch (error){
        const obj = JSON.parse(error.message);
        const result = Object.values(obj);        
        
        bubble_fn_cancelar_assinatura(result);
    }
})
()