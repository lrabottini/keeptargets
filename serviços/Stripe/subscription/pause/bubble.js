(async () => {
    const result = []

    const subscription_id = `${properties.param1}`
    try {
        const res = await fetch(`${properties.param2}`, {
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

        result.push(res.return_code)

        if (res.return_code === `${properties.param3}`){
            result.push(res.subscription_id)
            result.push(res.status)
        } else {
            result.push(res.error)
        }
    }catch(error){
        result.push(error.message)
    }
    
    bubble_fn_pausar_assinatura(result)
})
()