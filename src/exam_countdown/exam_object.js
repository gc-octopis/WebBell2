class Exam {
    countTime(start, end) {
        var timeless = (end - start) % 86400_000;
        var hour = parseInt(timeless / 3600_000);
        var min = parseInt((timeless % 3600_000) / 60_000);
        var sec = parseInt((timeless % 60_000) / 1_000);
        return `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    }
    
    countDate(start, end) {
        return Math.ceil((end - start) / 86400_000);
    }
    
    slashDate(date) {
        return `(${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()})`;
    }
    
    background(count, container) {
        container.style.color = "#000000";
    
        if (count > 300) {
            container.style.background = "linear-gradient(0deg, #c000ff 0%, #ff00ff 100%)";
        }else if (count > 200) {
            container.style.background =  "linear-gradient(0deg, #00ff00 0%, #80ff80 100%)";
        }else if (count > 100) {
            container.style.background =  "linear-gradient(0deg, #ffc000 0%, #ffff00 100%)";
        }else if (count > 50) {
            container.style.background =  "linear-gradient(0deg, #f06060 0%, #ff8080 100%)";
        }else if (count > 10) {
            container.style.background =  "linear-gradient(0deg, #ff3030 0%, #ff6060 100%)";
        }else if (count > 0) {
            container.style.background = "none";
            container.style.backgroundColor = "#000000";
            container.style.color = "#ffffff";   
        } else if (count == 0) {
            container.style.background =  "linear-gradient(90deg,rgba(255, 0, 0, 1) 0%,rgba(255, 154, 0, 1) 10%,rgba(208, 222, 33, 1) 20%,rgba(79, 220, 74, 1) 30%,rgba(63, 218, 216, 1) 40%,rgba(47, 201, 226, 1) 50%,rgba(28, 127, 238, 1) 60%,rgba(95, 21, 242, 1) 70%,rgba(186, 12, 248, 1) 80%,rgba(251, 7, 217, 1) 90%,rgba(255, 0, 0, 1) 100%)"
        }
    }
    
    create(type, cls) {
        let element = document.createElement(type);
        element.classList.add(cls);
        return element;
    }
    
    qs = (selector, parentNode=document) => parentNode.querySelector(selector);
    
    constructor(name, date) {
        this.name = name;
        this.date = new Date(date);
        this.container = this.create('div', 'exam');
        
        this.examName = this.create('div', 'examName');
        this.examName.innerText = this.name;

        this.examDate = this.create('div', 'examDate');
        this.examDate.innerText = slashDate(this.date); 

        this.examCountdown = this.create('div', 'examCountdown');
        this.examCountdownTime = this.create('div', 'examCountdownTime');

        this.container.appendChild(this.examName);
        this.container.appendChild(this.examDate);
        this.container.appendChild(this.examCountdownTime);
        this.container.appendChild(this.examCountdown);

        qs('.examBox').appendChild(this.container);
    }

    update(now) {
        let days = this.countDate(now, this.date)
        this.examCountdown.innerText = days;
        this.examCountdownTime.innerText = this.countTime(now, this.date);
        this.background(days, this.container);
    }
};