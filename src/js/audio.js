// Setup the bell's audio file and the range of possible strat point, also run other set property functions for the first time.
const { open } = window.__TAURI_PLUGIN_DIALOG__;
const { convertFileSrc } = window.__TAURI__.core;
const { invoke } = window.__TAURI__.core;

const AudioPlayer = {
    audio: null,
    audioStartPoint: get("audioStartPoint") ?? 0,
    audioLength: get("audioLength") ?? 10,
    audioVolume: get("audioVolume") ?? 0.8,
    isFadeIn: false,
    isFadeOut: false,

    init() {
        this.audio = new Audio();
        this.loadAudio();
        this.attachEventListeners();
    },

    async loadAudio(input = null, type = null) {

        let audioData = JSON.parse(get("audioData"));

        if (input == null && audioData !== null) {
            input = audioData.input;
            type = audioData.type;
        }

        if (input !== null) {
            if (type == "file") {
                let link = convertFileSrc(input);
                this.audio.src = link;
                set("audioData", JSON.stringify({input: input, type: type}));
            } else if (type == "link") {
                invoke("dlp", { link: input })
                    .then(pureLink => {
                        this.audio.src = pureLink;
                        set("audioData", JSON.stringify({input: input, type: type}));
                    });
            }
        } else {
            this.audio.src = "ring.mp3";
        }

        let point = id("audioStartPoint");
        this.audio.onloadedmetadata = () => {
            point.min = "0";
            point.max = `${this.audio.duration}`;
            point.value = "0";
            this.audio.loop = true;
            id("audioStartPoint").value = get("audioStartPoint") ?? 0;
            id("audioLengthSet").value = get("audioLength") ?? 10; 
            id("audioVolumeSet").value = get("audioVolume") ?? 0.8;
            id("fade-in").checked = get("isFadeIn");
            id("fade-out").checked = get("isFadeOut");
            this.setAudioStartPoint();
            this.setAudioLength();
            this.setAudioVolume();
            Peaks(peaks); // also do in tab(), since it only works when the container is visible.
        };
    },

    attachEventListeners() {

        // id("ain").onchange = () => this.loadAudio();

        id("ain-btn").onclick = async () => {
            let file = await open({
                multiple: false,
                directory: false,
            });
            console.log(file);
            this.loadAudio(file, "file");
        };

        id("ain-link").onchange = async () => {
            await this.loadAudio(id("ain-link").value, "link");
        }

        id("audioStartPoint").onchange = () => this.setAudioStartPoint();

        id("audioLengthSet").onchange = () => this.setAudioLength();

        id("audioVolumeSet").onchange = () => this.setAudioVolume();

        id("fade-in").onchange = () => {
            let isFadeIn = id("fade-in").checked;
            if (isFadeIn) set("isFadeIn", "1");
            else set("isFadeIn", "");
        };

        id("fade-out").onchange = () => {
            let isFadeOut = id("fade-out").checked;
            if (isFadeOut) set("isFadeOut", "1");
            else set("isFadeOut", "");
        };

        qs("#title #logo #path1784").onclick = () => this.playAudio();

        id("audio-play-test").onclick = () => this.playAudio();

        id("audioReset").onclick = () => {
            localStorage.removeItem("audioStartPoint");
            localStorage.removeItem("audioLength");
            localStorage.removeItem("audioVolume");
            localStorage.removeItem("audioData");
            this.loadAudio();
        };
    },

    setAudioStartPoint() {
        this.audioStartPoint = id("audioStartPoint").value;
        this.audio.currentTime = this.audioStartPoint;
        set("audioStartPoint", this.audioStartPoint);
        id("showAudioStartPoint").innerHTML = `起始時間：${this.changeTimeFormat(this.audioStartPoint)}`;
    },

    changeTimeFormat(t) {
        if (t > 3600) {
            return `${zero(parseInt(t / 60 / 60))}:${zero(parseInt(t / 60 % 60))}:${zero(parseInt(t % 60))}.${Math.round((t - parseInt(t)) * 10)}`;
        } else {
            return `${zero(parseInt(t / 60 % 60))}:${zero(parseInt(t % 60))}.${Math.round((t - parseInt(t)) * 10)}`;
        }
    },

    setAudioLength() {
        this.audioLength = id("audioLengthSet").value * 1000;
        set("audioLength", this.audioLength / 1000);
        id("audioLength").innerHTML = `鐘響時長：${this.audioLength / 1000}秒`;
    },

    setAudioVolume() {
        this.audioVolume = id("audioVolumeSet").value;
        this.audio.volume = this.audioVolume;
        set("audioVolume", this.audioVolume);
        id("audioVolume").innerHTML = `音量大小：${this.audioVolume * 100}%`;
    },

    playAudio() {
        this.audio.volume = this.audioVolume;
        this.audio.play();
        setTimeout(() => { this.audio.pause(); this.audio.currentTime = this.audioStartPoint; }, this.audioLength);

        if (id("fade-in").checked) {
            this.audio.volume = 0.2 * this.audioVolume;
            this.fadeIn();
        }

        if (id("fade-out").checked) {
            setTimeout(() => this.fadeOut(), this.audioLength - 1500);
        }
    },

    fadeIn() {
        this.audio.volume += 0.01;
        if (this.audio.volume < this.audioVolume) {
            setTimeout(() => this.fadeIn(), 40);
            return;
        }
    },

    fadeOut() {
        this.audio.volume -= 0.01;
        if (this.audio.volume > 0) {
            setTimeout(() => this.fadeOut(), 20);
            return;
        }
    },
};

// Copied from Peak's code. Use Peak to show the sound wave.
function Peaks(Peaks) {

    const options = {
        zoomview: {
            container: id('zoomview-container')
        },
        overview: {
            container: id('overview-container')
        },
        mediaElement: AudioPlayer.audio,
        webAudio: {
            audioContext: new AudioContext()
        }
    };

    Peaks.init(options, function (err, peaks) {
        if (err) {
            console.error('Failed to initialize Peaks instance: ' + err.message);
            return;
        }
    });
}