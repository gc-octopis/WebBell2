function loadColors() {
    let colorSelectors = qsAll(".setStyle input[type='color']");
    let colorOpacitySelectors = qsAll(".setStyle input[type='range']");

    function updateColor() {
        if (id("styleRoot")) id("styleRoot").remove();
        let styleRoot = document.createElement("style");
        styleRoot.innerHTML = `
            :root {
                --bg-color: ${id('bgColor').value}${parseInt(id('bgColorOpacity').value).toString(16).padStart(2, "0")};
                --text-color: ${id('textColor').value}${parseInt(id('textColorOpacity').value).toString(16).padStart(2, "0")};
                --text-dark-color: #2e90aa;
                --day-color: ${id('dayColor').value}${parseInt(id('dayColorOpacity').value).toString(16).padStart(2, "0")};
                --credit-color: ${id('dayColor').value}${parseInt(id('dayColorOpacity').value).toString(16).padStart(2, "0")};
                --block-color: ${id('blockColor').value}${parseInt(id('blockColorOpacity').value).toString(16).padStart(2, "0")};
                --bar-fill-color: ${id('barFillColor').value}${parseInt(id('barFillColorOpacity').value).toString(16).padStart(2, "0")};
                --bar-bg-color: ${id('barBgColor').value}${parseInt(id('barBgColorOpacity').value).toString(16).padStart(2, "0")};
            }
        `;
        document.head.appendChild(styleRoot);
    }

    function setDefaultColor() {
        colorSelectors[0].value = "#4c5c68";
        colorSelectors[1].value = "#b29a41";
        colorSelectors[2].value = "#dcdcdd";
        colorSelectors[3].value = "#c5c3c6";
        colorSelectors[4].value = "#000000"; colorOpacitySelectors[4].value = "204";
        colorSelectors[5].value = "#1989a1";
        colorSelectors[6].value = "#AAAAAA"; colorOpacitySelectors[6].value = "38";
        updateColor();
    }

    setDefaultColor();

    for (let element of colorSelectors) {
        element.onchange = () => {
            updateColor();
        }
    }

    id("colorReset").onclick = () => {
        setDefaultColor();
    };
}