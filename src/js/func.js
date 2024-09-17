// If it's single digit, add a "0" before it.
function zero(x) {
    return x.toString().padStart(2, '0');
}

// When subtract time that cross a day (e.g. 00:00:10 - 23:59:50), make it positive and meaningful.
function crossDay(x) {
    if (x < 0) return x + 86400_000;
    return x;
}

// Return a 2 digit hex number from base 10. 
function hex(Num) {
    return parseInt(Num).toString(16).padStart(2, '0');
}

// Sort array by from small number to big number. 
function sort(array) {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
            }
        }
    }
}

// turn hh:mm:ss to seconds.
function toSecond(hh, mm, ss) {
    return 3600 * hh + 60 * mm + 1 * ss;
}

// turn hh:mm:ss to milliseconds.
function toMillisecond(hh, mm, ss) {
    return 3600_000 * hh + 60_000 * mm + 1_000 * ss;
}

// turn seconds to hh:mm:ss.
function toHHMMSS(millisecond) {
    let hh = parseInt(millisecond / 3600_000);
    let mm = parseInt((millisecond % 3600_000) / 60_000);
    let ss = parseInt(millisecond % 60_000 / 1_000);
    return [hh, mm, ss];
}

function toHHMMSSString(millisecond) {
    return toHHMMSS(millisecond).map(zero).join(":");
}


// find an element's position in its parent.
function findNthElement(element) {
    let parent = element.parentNode;
    let siblings = Array.from(parent.children);
    let nthIndex = siblings.indexOf(element);

    return nthIndex;
}

// Count the remain time of a class. 
function countTime(start, end) {
    let timeless = (end - start) % 86400_000;
    return toHHMMSSString(timeless);
}

// The 5 functions below are setup to make the code shorter.
let id = (id) => document.getElementById(id);

let qs = (selector) => document.querySelector(selector);

let qsAll = (selector) => document.querySelectorAll(selector);

let get = (item) => localStorage.getItem(item);

let set = (item, data) => localStorage.setItem(item, data);

let create = (elementType, {id, cls, text, parent, ...rest}) => {
    let element = document.createElement(elementType);
    if (id) element.id = id;
    if (cls) element.classList.add(cls);
    if (text) element.innerText = text;
    if (parent) parent.appendChild(element);
    for (let key of Object.keys(rest)) {
        element[key] = rest[key];
    }
    return element;
};

// Add isToday function to Date object.
Date.prototype.isToday = function () {
    const today = new Date()
    return this.getDate() === today.getDate() &&
        this.getMonth() === today.getMonth() &&
        this.getFullYear() === today.getFullYear()
}

Date.prototype.getTimeInDay = () => {
    const today = new Date(new Date().toDateString());
    return new Date() - today;
}

Date.prototype.toMyDateString = () => {
    const week = ["日", "一", "二", "三", "四", "五", "六"];
    const d = new Date();
    return `${d.getFullYear()}/${zero(d.getMonth() + 1)}/${zero(d.getDate())}（${week[d.getDay()]}）`;
}