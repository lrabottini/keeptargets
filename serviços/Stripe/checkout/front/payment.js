window.stripe = Stripe("pk_test_51QxBZ8QqnE8DY5lEk5dGFbDELseRc4IC8u6VgiBErp6QQ9bD4eewRn7mkg4Qqcg03NEp7qTZkZ8CrbZATCKNLw0h00GXuFMVGP");

// const setupIntent = await stripe.setupIntents.create({
//     customer: properties.param2
// });

// window.elements = window.stripe.elements({
// 	//clientSecret: properties.param1,
// 	clientSecret: setupIntent.clientSecret,
// 	appearance: {
// 		theme: 'stripe', // 'flat', 'night', 'none' ou 'stripe'
// 		variables: {
// 			fontFamily: 'Roboto, sans-serif', // Define a fonte Roboto
// 			fontSizeBase: '18px', // Tamanho base da fonte
// 			fontWeightBold: '600'
// 		}
// 	}
// });

// const options = {layout: "accordion"};
// const paymentElement = window.elements.create("payment", options);

// paymentElement.mount("#payment-element");

(async () => {
    if (!window.Stripe) {
        throw new Error("Stripe.js não foi carregado corretamente.");
    }

    // Inicializa o Stripe
    window.stripe = Stripe(properties.param3);

    // Verificar se o cliente existe antes de criar a assinatura
    const customerResponse = await fetch(`https://api.stripe.com/v1/customers/${properties.param2}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${properties.param4}`
        }
    });

    const customer = await customerResponse.json();

    if (customer.error) {
        console.error("Erro: Cliente inválido ou não encontrado:", customer.error);
        return;
    }

    // ✅ Verifica se o preço foi passado corretamente
    if (!properties.param5 || properties.param5.trim() === "") {
        console.error("Erro: ID do preço não foi fornecido.");
        return;
    }

    // Criar a Assinatura e Capturar o ID da Fatura
    const subscriptionResponse = await fetch("https://api.stripe.com/v1/subscriptions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${properties.param4}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            "customer": properties.param2,
            "items[0][price]": properties.param5, // 🔥 Verifique se este ID de preço é válido no Stripe
            "payment_behavior": "default_incomplete",  // 🔥 NÃO COBRAR IMEDIATAMENTE
            "expand[]": "latest_invoice" // 🔥 Pega o ID da fatura associada
        })
    });

    const subscription = await subscriptionResponse.json();

    if (subscription.error) {
        console.error("Erro ao criar assinatura:", subscription.error);
        return;
    }

    const invoiceId = subscription.latest_invoice.id;

    // Atualizar a Data de Vencimento da Fatura
    const dueDate = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 🔥 30 dias no futuro

    await fetch(`https://api.stripe.com/v1/invoices/${invoiceId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${properties.param4}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            "due_date": dueDate // 🔥 Define nova data de vencimento
        })
    });

    // Criar Setup Intent para salvar o método de pagamento sem cobrar imediatamente
    const setupResponse = await fetch("https://api.stripe.com/v1/setup_intents", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${properties.param4}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            "customer": properties.param2
        })
    });

    const setupIntent = await setupResponse.json();

    if (!setupIntent.client_secret) {
        console.error("Erro ao criar Setup Intent", setupIntent);
        return;
    }

    // Criar o Payment Element com `mode: setup`
    window.elements = window.stripe.elements({
        clientSecret: setupIntent.client_secret,
        appearance: {
            theme: "stripe",
            variables: {
                fontFamily: "Roboto, sans-serif",
                fontSizeBase: "18px",
                fontWeightBold: "600"
            }
        }
    });

    const paymentElement = window.elements.create("payment", { layout: "accordion" });
    paymentElement.mount("#payment-element");

})();






// (async () => {
// 	const result = []

// 	if (!window.elements) {
// 		result.push("erro")
// 		result.push("Stripe Elements não foi encontrado")

// 		bubble_fn_criaPlanoEmpresa(result);

// 		return;
// 	}

// 	const { error: submitError } = await window.elements.submit();
  
// 	if (submitError) {
// 		console.log(submitError)

// 		result.push("erro")
// 		result.push(submitError.message)
// 		result.push(JSON.stringify(submitError))
// 	} else {
// 		let { error, paymentIntent } = await window.stripe.confirmPayment({
// 			elements: window.elements,
// 			  clientSecret: window.clientSecret,
// 			  confirmParams: {
// 				return_url: window.location.origin + "/success",
// 			  },
// 			  redirect: "if_required",
// 		});
	
// 		if (error) {
// 			console.log(error)
	
// 			result.push("erro")
// 			result.push(error.message)
	
// 		} else if (paymentIntent) {
// 			result.push("sucesso")
// 			result.push(paymentIntent.status)
// 			result.push(paymentIntent.id)
// 		}
// 	}
// 	bubble_fn_criaPlanoEmpresa(result);
// })

// ();
