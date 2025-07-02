(function() {
    const source = document.getElementById(`dd-estrategia-revisao-${properties.param1}`);
    if (!source) return;
  
    const selectedValue = source.value;
    const dropdowns = Array.from(document.querySelectorAll('[id^="dd-estrategia-revisao-"]'));
  
    dropdowns.forEach(dropdown => {
        if (dropdown !== source && dropdown.value !== selectedValue) {
            dropdown.value = selectedValue;
            dropdown.dispatchEvent(new Event('input', { bubbles: true }));
            dropdown.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
})();