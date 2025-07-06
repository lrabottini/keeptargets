(async () => {
    // const subscription_id = `${properties.param1}`
    const subscription_id = 'sub_1RgeULBxrGev9VhBYCaV3pGx'
    try {
        const res = await fetch("https://api.keeptargets.com.br/subscription/pause", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_assinatura: subscription_id })
        }).then(response => {
            return response.json()
        }).then(data => {
            return data
        }).catch(error => {
            return error
        })

        if (res.return_code !== "SUB_PAUSE_SUCCESS"){
            throw new Error(JSON.stringify({
                return_code: res.return_code,
                error: res.error
            }))
        }

        bubble_fn_pausar_assinatura([res.return_code, res.subscription_id, res.status]);
    }catch(error){
        const obj = JSON.parse(error.message);
        const result = Object.values(obj);        
        
        bubble_fn_pausar_assinatura(result)
    }
})
()