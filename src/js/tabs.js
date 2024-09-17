// Change between tabs when user click it.

// const backgroundColor = document.documentElement.style.getPropertyValue('--block-color');
const backgroundColor = "#4c5c68";

function loadTabs() {
    let tabs = qsAll(".tab");
    let buttons = qsAll(".tabSelector button");

    function tab(index) {
        tabs.forEach(element => {
            element.style.display = "none";
        });
        buttons.forEach(element => {
            element.style.backgroundColor = "";
        });
        buttons[index].style.backgroundColor = backgroundColor;
        tabs[index].style.display = "block";
        if (index === 0) {
            Peaks(peaks);
        }
    }

    buttons.forEach( (e, i) => {
        e.onclick = tab.bind(undefined, i);
        
    });

    tab(0);
}