/*
TODO:

(1)另存 (save as a copy)。
(2)can copy cell.
(3)調課。
(4)倒數結束
(5)更換主題
(6)輸入音檔數值

*/



async function main() {

    loadColors();
    loadTabs();
    loadEasterEgg();
    AudioPlayer.init();
    
    // new Audio('ring.mp3').play();


    // this makes a dialog to prevent accidently closing the tab
    // also makes user unable to close the electron window
    // window.A = () => "prevent leaving";

    /*

    remember to enable onbeforeunload later.


    */

    // Week name array
    let weekEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let change = document.createEvent('Event');
    change.initEvent('change', true, false);

    let timeSets = {};
    let times = {}, timesInSec = {}, subjects = {};

    timeSets["empty.json"] = new TimeSet();
    await timeSets["empty.json"].fromFile("empty.json");

    let keys = Object.keys(JSON.parse(get('timeSets')));

    for (let set of keys) {
        timeSets[set] = new TimeSet();
        await timeSets[set].fromLocal(set);
        timeSets[set].addOption();
    }

    id('timeSetImport').onchange = async () => {
        let file = id('timeSetImport').files[0];
        let path = URL.createObjectURL(file);
        let name = file.name;
        timeSets[name] = new TimeSet();
        await timeSets[name].fromFile(path, name);
        timeSets[name].addOption();
    }

    // for setup timeSets select 

    let currentSet = get("currentSet");
    timeSets[currentSet] ? id("timeSets").value = currentSet : id("timeSets").selectedIndex = 0;

    timeSets[id("timeSets").value].load(times, timesInSec, subjects);

    id("timeSets").onchange = () => {
        set("currentSet", event.target.value); // Save the last time set user stayed in. When next time open (this app) , target to it.
        timeSets[event.target.value].load(times, timesInSec, subjects); // load new set to the bell
    };

    // for setup editor select

    let currentEditor = get("currentEditor");
    timeSets[currentEditor] ? id('editor-select').value = currentEditor : set('currentEditor', id('editor-select').value);

    timeSets[id("editor-select").value].editor.active();

    id("editor-select").onchange = () => {
        timeSets[get('currentEditor')].editor.clear();
        set("currentEditor", event.target.value);
        timeSets[event.target.value].editor.active(); // load new editor to the editor
    };

    id('editor-save-btn').onclick = () => timeSets[get('currentEditor')].saveToLocal();
    id('editor-export-btn').onclick = () => {
        const jsonBlob = new Blob([JSON.stringify(timeSets[get('currentEditor')].editor.json)], { type: 'application/json' });
        const a = document.createElement('a');
        const name = id('editor-name-input').value;
        a.href = URL.createObjectURL(jsonBlob);
        a.download = name + '.json'; // Specify the file name
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    id('editor-add-btn').onclick = () => {
        let name = `new-${parseInt(new Date().getTime())}.json`;
        timeSets[name] = new TimeSet(name);
        timeSets[name].addOption();
        timeSets[name].saveToLocal();
        id('editor-select').value = name;
        id("editor-select").dispatchEvent(change);
    };

    id('editor-delete-btn').onclick = () => {
        if (confirm("你確定要刪除這組時間？")) {
            let target = id('editor-select').value;
            timeSets[target].delete();
            id("timeSets").dispatchEvent(change);
            id("editor-select").dispatchEvent(change);
            delete timeSets[target];
        }
    }

    id('editor-name-input').onchange = () => {
        let input = id('editor-name-input');
        let log = id('editor-name-log');
        let oldName = id('editor-select').value;
        let newName = input.value + '.json';
        log.innerText = "";
        if (newName !== oldName) {
            let local = JSON.parse(get('timeSets'));
            for (let name of Object.keys(local)) {
                if (newName === name) {
                    log.innerText = "這個名字已經存在，請換一個";
                    return;
                }
            }
            Object.defineProperty(timeSets, newName,
                Object.getOwnPropertyDescriptor(timeSets, oldName));
            delete timeSets[oldName];
            timeSets[newName].name = newName;
            timeSets[newName].editor.name = newName;
            Object.defineProperty(local, newName,
                Object.getOwnPropertyDescriptor(local, oldName));
            delete local[oldName];
            set("timeSets", JSON.stringify(local));
            qsAll('#timeSets option').forEach(option => {
                if (option.innerText === oldName) {
                    option.innerText = newName;
                }
            });
            qsAll('#editor-select option').forEach(option => {
                if (option.innerText === oldName) {
                    option.innerText = newName;
                }
            });
            id("timeSets").dispatchEvent(change);
            set('currentEditor', newName);
        }
    }

    function loop() {

        const time = new Date();
        const day = time.getDay();

        let lastHHMMSS, nextHHMMSS, countdownHHMMSS;

        let timesToday = times[weekEn[day]];

        // this loop was complicate, but I added an variable called now, and it's now much more simple.
        let now = time.getTimeInDay();
        let len = timesToday.length;
        for (let i = 0; i <= len; i++) {

            id("current-class").innerText = showSubject(i - 1, day, subjects);
            id("next-class-1").innerText = showSubject(i, day, subjects);
            id("next-class-2").innerText = showSubject(i + 1, day, subjects);

            // i == len is for the for loop to run until the last round, so the value of i won't mess up.
            let isAfterClass = now > timesToday.at(-1) && i == len;
            let isBeforeClass = now < timesToday[0];

            let subjectTimeLength = crossDay(timesToday[i] - timesToday.at(i - 1));
            let subjectTimePass = crossDay(now - timesToday.at(i - 1));

            if (isBeforeClass || isAfterClass || len == 0) {
                qs(".info").style.display = "none";
                id("progressBar").style.display = "none";
                break;
            } else if (timesToday[i] >= now) {
                qs(".info").style.display = "";
                id("progressBar").style.display = "";

                lastHHMMSS = toHHMMSSString(timesToday.at(i - 1));
                nextHHMMSS = toHHMMSSString(timesToday[i]);
                countdownHHMMSS = countTime(now, timesToday[i]);

                let percent = (subjectTimePass / subjectTimeLength * 100) + "%";
                id("progressFill").style.width = percent;
                break;
            }
        }

        if (toHHMMSSString(now) === nextHHMMSS) AudioPlayer.playAudio();
        id("time-day").innerHTML = time.toMyDateString();
        id("time-time").innerHTML = toHHMMSSString(now);
        id("time-countdown").innerHTML = countdownHHMMSS ? "-" + countdownHHMMSS : ""; // implment it later. use countTime func  
        id("last").innerHTML = lastHHMMSS;
        id("next").innerHTML = nextHHMMSS;

        let table = qs('.class-list');
        table.innerHTML = "";

        for (let i = 0; i < timesToday.length - 1; i++) {
            let tr = document.createElement('tr');
            tr.innerHTML = `<td>${toHHMMSSString(timesToday[i])}~${toHHMMSSString(timesToday[i + 1])}</td>
            <td>${subjects[weekEn[day]][i]}</td>`;
            table.appendChild(tr);
        }

        return;
    }

    // Display current subject and the next two.
    function showSubject(nth, day, subjects) {
        if (nth >= subjects[weekEn[day]].length) {
            return "";
        } else if (nth < 0) {
            return "本日課程尚未開始";
        } else {
            return subjects[weekEn[day]].at(nth);
        }
    }

    let worker = new Worker('js/worker.js');
    worker.onmessage = loop;
}