const plans = properties.paramlist1.get(0, properties.paramlist1.length());

let selectedPlan = plans.find(plan => XX <= Number(plan.up_to)) || plans[plans.length - 1];

var result = ""
if (selectedPlan.get('_api_c2_unit_amount') === "Custom"){
    result  = "Entre em contato"
} else {
    result = String(xx * Number(selectedPlan.get('_api_c2_unit_amount')/100))
}

bubble_fn_valorPlano(result)