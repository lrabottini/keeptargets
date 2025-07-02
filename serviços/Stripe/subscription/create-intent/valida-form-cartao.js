(async () => {
    const {error: submitError} = await window.elements.submit();
    if (submitError) {
        bubble_fn_validaFormDePagamento(1);
    } else {
        bubble_fn_validaFormDePagamento(0);
    }
})
()