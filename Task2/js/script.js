// 1. Получаем элемент из DOM

let btn = document.querySelector('.btn');

// 2. Вешаем обработчик на кнопку, получаем ширину и высоту экрана

btn.addEventListener('click', () => {
    alert(`Ширина экрана: ${window.screen.width}, Высота экрана: ${window.screen.height}`);
})

