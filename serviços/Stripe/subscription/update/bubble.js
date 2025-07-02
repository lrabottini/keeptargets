(async () => {
    const result = []
    let resStatus = 0

    const subscription_id = properties.param1
    const price_id = properties.param2

    // const subscription_id = "sub_1R6BVrQqnE8DY5lESictgVa4"
    // const price_id = "price_1QxCI5QqnE8DY5lESjFcgBN4"
    //avançado price_1Qzk6pQqnE8DY5lEWAPLaWkS
    //básico price_1QxCI5QqnE8DY5lESjFcgBN4
    
    try {
        const res = await fetch("https://api.keeptargets.com.br/subscription/update", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_assinatura: subscription_id, preço: price_id })
        }).then(response => {
            resStatus = response.status
            return response.json()
        }).then(data => {
            return { data }
        }).catch(error => {
            return error
        })

        if (!resStatus == 200){
            console.log("erro")

            result.push("erro")
            result.push(res.data.message)
        } else {
            console.log("sucesso")

            result.push("sucesso")
            result.push(res.data.id)
            result.push(res.data.status)
        }
    }catch(error){
        result.push("erro")
        result.push(error.message)
    }

    bubble_fn_trocar_plano(result)
})

()