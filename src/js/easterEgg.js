// The easter egg which change the 關於's color when clicked.

function loadEasterEgg() {
    // Times of executing onclick 
    let egg = 0;

    // HSV Variables
    var R1 = 255;
    var G1 = 0;
    var B1 = 0;
    var timesOfRunning = 0;

    // Create HSV wave for each color
    function HSV(color, i) {
        if (i < 255) {
            color++;
        } else if (i > 768 && i < 1024) {
            color--;
        }

        return color
    }

    // Update HSV color every TimeOut.
    function changeColorHSV() {
        i = timesOfRunning;
        R1 = HSV(R1, (i + 512) % (256 * 6));
        G1 = HSV(G1, (i) % (256 * 6));
        B1 = HSV(B1, (i + 1024) % (256 * 6));

        RGB1 = '#' + hex(R1) + hex(G1) + hex(B1);
        qs(".HSV").style.backgroundColor = RGB1;
        timesOfRunning++;
        var timeOut = setTimeout(changeColorHSV, 3);
    }

    // Set the onclick to 關於
    id("about-title").onclick = () => {
        egg++;
        let changeColor = qs(".tab h1");

        if (egg == 10) {
            changeColor.style.color = "";
            alert("你找到彩蛋了!!!");
            changeColorHSV();
        } else if (egg < 10) {
            changeColor.style.color = "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")";
        }
    }

}