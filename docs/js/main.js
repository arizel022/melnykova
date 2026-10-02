

(() => {
    const header = document.querySelector('.header');
    if (!header) return;
    let ticking = false;
    const ACTIVE_THRESHOLD = 350; // порог в пикселях, после которого header получает .active

    const onScroll = () => {
        if (window.scrollY > ACTIVE_THRESHOLD) {
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


function initSwitcher(root) {
    const triggers = Array.from(root.querySelectorAll('.switcher__trigger'));
    const resetButton = root.querySelector('.switcher__reset-button');
    const panels = root.querySelectorAll('.switcher__content, .switcher__redirects');
    const initialLayer = root.querySelector('.switcher__bg');
    const TRANSITION_MS = 1800; // должно совпадать с transition в SCSS

    if (!triggers.length || !initialLayer) return;

    // модификатор фонового слоя (напр. switcher__bg--projects) специфичен для конкретной
    // страницы и определяет пути к картинкам — берём его с уже существующего в разметке
    // слоя, чтобы динамически создаваемые слои подхватывали нужные фоны
    const bgModifier = Array.from(initialLayer.classList)
        .find((cls) => cls.startsWith('switcher__bg--'));

    const ids = triggers.map((trigger) => trigger.id).filter(Boolean);

    let selectedId = null;
    let activeLayer = root.querySelector('.switcher__bg.is-active');

    function currentDirection(layer) {
        return ids.find((id) => layer.classList.contains(id)) || null;
    }

    function swapBackground(id) {
        if (activeLayer && currentDirection(activeLayer) === id) return;

        const layer = document.createElement('div');
        layer.className = 'switcher__bg';
        if (bgModifier) layer.classList.add(bgModifier);
        if (id) layer.classList.add(id);
        root.appendChild(layer); // последний в DOM — рисуется поверх остальных фон-слоёв

        void layer.offsetWidth; // форсируем reflow — фиксируем чистый старт (opacity: 0)

        const previousLayer = activeLayer;
        activeLayer = layer;

        requestAnimationFrame(() => {
            layer.classList.add('is-active');
            if (previousLayer) previousLayer.classList.remove('is-active');
        });

        if (previousLayer) {
            setTimeout(() => {
                if (!previousLayer.classList.contains('is-active')) previousLayer.remove();
            }, TRANSITION_MS + 50);
        }
    }







    function applyState(id, isActive) {
        root.classList.toggle('active', isActive);
        swapBackground(id);
        panels.forEach((panel) => {
            const isDefault = panel.classList.contains('switcher__content--default');
            panel.classList.toggle('is-active', id !== null ? panel.classList.contains(id) : isDefault);
        });
    }

    triggers.forEach((trigger) => {
        const id = trigger.id;
        if (!id) return;

        trigger.addEventListener('mouseenter', () => applyState(id, false));
        trigger.addEventListener('mouseleave', () => applyState(selectedId, selectedId !== null));
        trigger.addEventListener('click', () => {
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

    // стартовое состояние — до любого взаимодействия показываем дефолтную панель,
    // если она есть на странице (безопасно и там, где её нет — просто ничего не подсветит)
    applyState(null, false);
}
document.querySelectorAll('.switcher').forEach(initSwitcher);

// Элемент mobile-menu__button. При нажатии
//  - header получает класс mobile-active
//  - mobile-menu__button получает класс active
//  - home получает класс lock
//  - mobile-menu__body получает класс active

// При повторном нажатии все теряют свои классы.

(() => {
    const header = document.querySelector('.header');
    const menuButton = document.querySelector('.mobile-menu__button');
    const home = document.querySelector('.home');
    const menuBody = document.querySelector('.mobile-menu__body');

    if (!menuButton) return;

    menuButton.addEventListener('click', () => {
        const isActive = menuButton.classList.toggle('active');

        header?.classList.toggle('mobile-active', isActive);
        home?.classList.toggle('lock', isActive);
        menuBody?.classList.toggle('active', isActive);
    });
})();




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
