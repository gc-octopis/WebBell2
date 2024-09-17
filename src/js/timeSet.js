function TimeSet(name) {
    this.set = {};
    this.name = name;
    this.editor = new Editor();
    this.set = this.editor.json;
    !(get("timeSets")) ? set("timeSets", "{}") : 0;
}

// Fetch a time set from a JSON file and save its path to localStorge.
TimeSet.prototype.fromFile = async function (path, name = path) {
    await fetch(path)
        .then(r => r.json())
        .then(x => {
            this.set = x;
            this.name = name;
            this.saveToLocal();
            this.editor.json = this.set;
        });
}

// Get a time set from localStorge to current variable
TimeSet.prototype.fromLocal = async function (name) {
    let local = JSON.parse(get("timeSets"));
    this.set = local[name];
    this.name = name;
    this.editor.json = this.set;
}

// Append a time set to localStorge with the right format. 
TimeSet.prototype.saveToLocal = function () {
    let local = JSON.parse(get("timeSets"));
    this.editor.saveJSON();
    local[this.name] = this.set;
    set("timeSets", JSON.stringify(local));
}

// Add a option to timeSets select
TimeSet.prototype.addOption = function () {
    let option = document.createElement('option');
    option.innerText = this.name;
    id('timeSets').appendChild(option);
    this.editor.addOption(this.name);
}

// Load the time set into the bell.
TimeSet.prototype.load = function (times, timesInSec, subjects) {
    let x = this.set;

    Object.keys(x.regular).forEach(d => {
        times[d] = [];
        timesInSec[d] = [];
        subjects[d] = [];
        Object.keys(x.regular[d]).forEach((e, i) => {
            times[d].push(x.regular[d][e]["time"]);
            timesInSec[d].push(toSecond(...times[d][i]));
            subjects[d].push(x.regular[d][e]["subject"]);
        });
    });

    if (x.exception != undefined) {
        x.exception.forEach(e => {
            e.date.forEach(k => {
                if (new Date(k).isToday()) {
                    Object.keys(e.modification).forEach(s => {
                        subjects[weekEn[new Date().getDay()]][s - 1] = e.modification[s];
                    });
                }
            });
        });
    }
}

// Delete a time set from everywhere
TimeSet.prototype.delete = function () {
    let local = JSON.parse(get("timeSets"));
    delete local[this.name];
    set("timeSets", JSON.stringify(local));
    if (id('timeSets').value === this.name) id('timeSets').selectedIndex = 0;
    qsAll('#timeSets option').forEach(option => {
        if (option.innerText === this.name) {
            option.remove();
        }
    });
    if (id('editor-select').value === this.name) id('editor-select').selectedIndex = 0;
    qsAll('#editor-select option').forEach(option => {
        if (option.innerText === this.name) {
            option.remove();
        }
    });
}