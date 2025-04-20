// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/apikeys
window.stripe = Stripe(properties.param1);

const options = {
    mode: "setup",
    currency: "brl",
	appearance: {
		theme: 'stripe', // 'flat', 'night', 'none' ou 'stripe'
		variables: {
			fontFamily: 'Roboto, sans-serif', // Define a fonte Roboto
			fontSizeBase: '18px', // Tamanho base da fonte
			fontWeightBold: '600'
		}
	}
};

// Set up Stripe.js and Elements to use in checkout form
window.elements = window.stripe.elements(options);

// Create and mount the Payment Element
const paymentElementOptions = { layout: "accordion" };
const paymentElement = window.elements.create("payment", paymentElementOptions);
paymentElement.mount("#payment-element");