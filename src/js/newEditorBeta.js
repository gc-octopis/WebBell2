class Editor {
    active() {
        for (let day of ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']) {
            id('editor-days').appendChild(this.createDay(day));
        }
        let keys = Object.keys(this.json.regular);
        qsAll('.add-cell').forEach((element, i) => {
            element.onclick = () => {
                let cell = this.createCell();
                element.before(cell);
            }

            let timeSubjects = Object.keys(this.json.regular[keys[i]])
            for (let clsNumber of timeSubjects) {
                let cls = this.json.regular[keys[i]][clsNumber];
                let cell = this.createCell(cls.time, cls.subject);
                element.before(cell);
            }
        });
        id('editor-name-input').value = this.name.replace('.json', '');

    }

    createDay(specialID="") {
        let day = create('div', {cls:'editor-day', id: specialID});
        let topRow = create('div', {cls: 'top-row', parent: day});
        let showHide = create('button', {cls: 'day-show-hide', parent: topRow});
        let dayTitle = create('span', {cls: 'dat-title', parent: topRow});
        let addCellBtn = create('button', {cls: 'add-cell', innerHTML: this.plusIcon, parent: topRow});
        let dayDelete = create('button', {cls: 'day-delete', innerHTML: this.deleteIcon, parent: topRow});

        return day;
    }

    createCell(time=null, subject=null) {
        let cell = create('div', {cls:'cell'});
        let cellRemove = create('button', {cls:'cell-remove', text:'X', parent: cell});
        let cellTime = create('input', {cls:'cell-time', parent: cell});
        cellTime.classList.add('cell-time');
        // selection(cellTime, {
        //     'durationFormat': 'hh:mm:ss',
        //     'max': 3600 * 24
        // });
        let cellSubject = create('input', {cls:'cell-subject', parent: cell});
        cellSubject.placeholder = "課程名稱";

        // Use when restoring
        if (time) cellTime.value = toHHMMSSString(time);
        if (subject) cellSubject.value = subject;

        // Add EventListener to inputs in order to auto save
        cellRemove.onclick = () => {this.deleteCell(event.target)};
        cellTime.oninput = this.saveJSON.bind(this);
        cellSubject.onchange = this.saveJSON.bind(this);

        return cell;
    }

    saveJSON() {
        let self = this;
        qsAll('.editor-day').forEach((day, i) => {
            let dataInput = [];
            let keys = Object.keys(self.json.regular);
            day.querySelectorAll('.cell').forEach(cell => {
                let time = cell.querySelector('.cell-time').value;
                let subject = cell.querySelector('.cell-subject').value;
                dataInput.push({time: toMillisecond(...time.split(':')), subject: subject});
            })
            dataInput.sort((a, b) => a.time - b.time);
            self.json.regular[keys[i]] = {};
            dataInput.forEach((cell, j) => {
                self.json.regular[keys[i]][String(j+1)] = cell;
            })
        })
    }

    // sortTime(array) {
    //     for (let i = 0; i < array.length; i++) {
    //         for (let j = 0; j < array.length - i - 1; j++) {
    //             let current = new Date(1970, 0, 1, ...array[j].time);
    //             let next = new Date(1970, 0, 1, ...array[j + 1].time);
    //             if (current > next) {
    //                 [array[j], array[j+1]] = [array[j+1], array[j]];
    //             }
    //         }
    //     }
    //     return array;
    // }

    addOption(name) {
        let option = document.createElement('option');
        option.innerText = name;
        this.name = name;
        id('editor-select').appendChild(option);
    }

    deleteCell(buttonPosition) {
        let cell = buttonPosition.closest('.cell');
        cell.remove();
        this.saveJSON();
    }

    clear() {
        // qsAll('.add-cell').forEach(element => {
        //     element.removeEventListener('click', () => {
        //         let cell = this.createCell();
        //         element.before(cell);
        //     });
        // });
        // qsAll('.cell').forEach(cell => {
        //     cell.remove();
        // });
        id('editor-days').innerHTML = "";
    }

    json = {
        regular: {
            Mon: {},
            Tue: {},
            Wed: {},
            Thu: {},
            Fri: {},
            Sat: {},
            Sun: {}
        }
    };

    plusIcon = `<svg height="512px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M417.4,224H288V94.6c0-16.9-14.3-30.6-32-30.6c-17.7,0-32,13.7-32,30.6V224H94.6C77.7,224,64,238.3,64,256  c0,17.7,13.7,32,30.6,32H224v129.4c0,16.9,14.3,30.6,32,30.6c17.7,0,32-13.7,32-30.6V288h129.4c16.9,0,30.6-14.3,30.6-32  C448,238.3,434.3,224,417.4,224z"/></svg>`;
    deleteIcon = `<svg height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M12 38c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4V14H12v24zM38 8h-7l-2-2H19l-2 2h-7v4h28V8z"/><path d="M0 0h48v48H0z" fill="none"/></svg>`;
}