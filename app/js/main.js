

(() => {
    const header = document.querySelector('.header');
    if (!header) return;

    let ticking = false;

    const onScroll = () => {
        if (window.scrollY > 0) {
            header.classList.add('active');
        } else {
            header.classList.remove('active');
        }
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });

    // на случай если страница открыта не с самого верха (напр. после reload с сохранённой позицией)
    onScroll();
})();

$(function () {
    $('.header__burger').click(function () {
        $(this).toggleClass('active');
        $('.header__list').toggleClass('active');
        $('body').toggleClass('lock');
    });
});




document.addEventListener('DOMContentLoaded', function () {
    const audioButtons = document.querySelectorAll('.audio__play-button');
    const audioTracks = document.querySelectorAll('.audio__track');

    let activeButton = null;

    audioButtons.forEach((button, index) => {
        button.addEventListener('click', function () {
            const audio = audioTracks[index];
            if (audio.paused) {
                pauseAllTracks();
                audio.play();
                button.classList.add('active');
                activeButton = button;
            } else {
                audio.pause();
                button.classList.remove('active');
                activeButton = null;
            }
        });
    });

    function pauseAllTracks() {
        audioTracks.forEach(audio => {
            audio.pause();
        });
        if (activeButton) {
            activeButton.classList.remove('active');
            activeButton = null;
        }
    }
});
