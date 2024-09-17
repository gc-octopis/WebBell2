class Editor {
    active() {
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

    createCell(time=null, subject=null) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        let cellRemove = document.createElement('button');
        cellRemove.classList.add('cell-remove');
        cellRemove.innerText = 'X';
        let cellTime = document.createElement('input');
        cellTime.classList.add('cell-time');
        selection(cellTime, {
            'durationFormat': 'hh:mm:ss',
            'max': 3600 * 24
        });
        let cellSubject = document.createElement('input');
        cellSubject.classList.add('cell-subject');
        cellSubject.placeholder = "課程名稱";

        // Use when restoring
        if (time) cellTime.value = time.join(':');
        if (subject) cellSubject.value = subject;

        // Add EventListener to inputs in order to auto save
        cellRemove.onclick = () => {this.deleteCell(event.target)};
        cellTime.oninput = this.saveJSON.bind(this);
        cellSubject.onchange = this.saveJSON.bind(this);

        cell.appendChild(cellRemove);
        cell.appendChild(cellTime);
        cell.appendChild(cellSubject);
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
                dataInput.push({time: [...time.split(':')], subject: subject});
            })
            dataInput = self.sortTime(dataInput);
            self.json.regular[keys[i]] = {};
            dataInput.forEach((cell, j) => {
                self.json.regular[keys[i]][String(j+1)] = cell;
            })
        })
    }

    sortTime(array) {
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array.length - i - 1; j++) {
                let current = new Date(1970, 0, 1, ...array[j].time);
                let next = new Date(1970, 0, 1, ...array[j + 1].time);
                if (current > next) {
                    [array[j], array[j+1]] = [array[j+1], array[j]];
                }
            }
        }
        return array;
    }

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
        qsAll('.add-cell').forEach(element => {
            element.removeEventListener('click', () => {
                let cell = this.createCell();
                element.before(cell);
            });
        });
        qsAll('.cell').forEach(cell => {
            cell.remove();
        });
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
}