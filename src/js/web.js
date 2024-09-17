function web(bool) {
    let time = qs('.time');
    let title = id('title');
    let subtitle = id('subtitle');
    if (bool) {
        time.style.display = 'none';

        let button = document.createElement('button');
        button.id = 'button';
        button.innerText = "立即開始";
        button.onclick = () => {web(false)};

        title.after(button);
    } else {
        if (id('button')) id('button').remove();
        time.style.display = "";
        title.classList.replace('title', 'title-new');
        subtitle.classList.replace('subtitle', 'subtitle-new');
        main();
    }
}