

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



(() => {
    const header = document.querySelector('.header');
    if (!header) return;

    let ticking = false;

    function updatePosition() {
        header.style.top = `${window.scrollY}px`;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updatePosition);
            ticking = true;
        }
    }, { passive: true });

    updatePosition(); // стартовая позиция при загрузке
})();





(() => {
    const projects = document.querySelector('.projects');
    const buttons = document.querySelectorAll('.submenu__button');
    const resetButton = document.querySelector('.projects__title-button');

    if (!projects || !buttons.length) return;

    const DIRECTIONS = ['earth', 'fire', 'air', 'water'];
    const TRANSITION_MS = 1800; // должно совпадать с transition в SCSS

    let selectedId = null;
    let activeLayer = projects.querySelector('.projects__bg.is-active');

    function currentDirection(layer) {
        return DIRECTIONS.find((d) => layer.classList.contains(d)) || null;
    }

    function swapBackground(id) {
        // уже показываем нужное направление — не плодим лишний слой
        if (activeLayer && currentDirection(activeLayer) === id) return;

        const layer = document.createElement('div');
        layer.className = 'projects__bg';
        if (DIRECTIONS.includes(id)) {
            layer.classList.add(id);
        }
        projects.appendChild(layer); // последний в DOM — рисуется поверх остальных фон-слоёв

        void layer.offsetWidth; // форсируем reflow — фиксируем чистый старт (opacity: 0)

        const previousLayer = activeLayer;
        activeLayer = layer;

        requestAnimationFrame(() => {
            layer.classList.add('is-active');
            if (previousLayer) {
                previousLayer.classList.remove('is-active');
            }
        });

        if (previousLayer) {
            setTimeout(() => {
                // удаляем старый слой из DOM, только если он и правда больше не активен
                // (на случай если пользователь успел вернуться к нему раньше срабатывания таймера)
                if (!previousLayer.classList.contains('is-active')) {
                    previousLayer.remove();
                }
            }, TRANSITION_MS + 50);
        }
    }

    function applyState(id, isActive) {
        projects.classList.remove(...DIRECTIONS);
        if (id) projects.classList.add(id);
        projects.classList.toggle('active', isActive);
        swapBackground(id);
    }

    buttons.forEach((button) => {
        const id = button.id;
        if (!DIRECTIONS.includes(id)) return;

        button.addEventListener('mouseenter', () => applyState(id, false));
        button.addEventListener('mouseleave', () => applyState(selectedId, selectedId !== null));
        button.addEventListener('click', () => {
            selectedId = id;
            applyState(id, true);
        });
    });

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            selectedId = null;
            applyState(null, false);
        });
    }
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
