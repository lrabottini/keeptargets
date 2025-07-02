const uniqueid = properties.param4.split('|')[0]
const revisado = properties.param4.split('|')[1].split(",")

revisado[properties.param2-1] = properties.param3

bubble_fn_revisado(`${uniqueid}|${revisado.join(",")}`)