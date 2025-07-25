(async () => {
    const subscription_id = properties.param1
    const price_id = properties.param2

    try {
        const res = await fetch(properties.param3, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_assinatura: subscription_id, preço: price_id })
        }).then(response => {
            return response.json()
        }).catch(error => {
            return error
        })

        if (res.return_code !== 'SUB_UPDATE_SUCCESS'){
            throw new Error(JSON.stringify({
                return_code: res.return_code,
                error: res.error
            }))
        }

        bubble_fn_trocar_plano([res.return_code, res.subscription_id, res.status])
    }catch(error){
        const obj = JSON.parse(error.message);
        const result = Object.values(obj);        

        bubble_fn_trocar_plano(result)
    }
})
()