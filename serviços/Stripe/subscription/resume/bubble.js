(async () => {
    const result = []

    const subscription_id = properties.param1
    //const subscription_id = "sub_1R61baQqnE8DY5lEgjfxGuvg"
    try {
        const res = await fetch("https://j3dwlzycg7.execute-api.sa-east-1.amazonaws.com/prod/subscription/resume", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ subscription_id: subscription_id })
        }).then(response => {
            return response.json()
        }).then(data => {
            return data
        }).catch(error => {
            return error
        })

        console.log("passei aqui")

        if (res.pause_collection != null){
            console.log("erro")

            result.push("erro")
            result.push(res.message)
        } else {
            console.log("sucesso")

            result.push("sucesso")
            result.push(res.id)
            result.push(res.status)
        }
    }catch(error){
        result.push("erro")
        result.push(error.message)
    }

    console.log("passei aqui também")
    console.log(result)

    bubble_fn_cancelar_assinatura(result)
})

()