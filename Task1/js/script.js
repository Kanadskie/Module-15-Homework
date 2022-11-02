// 1. Получаем элементы из DOM

let btn = document.querySelector('.btn');

let changeIcon = document.querySelector('.icon-first');

// 2. Вешаем обработчик на кнопку, меняем один класс на другой у элемента, при повторном нажатии возвращаем исходный класс

btn.addEventListener('click', () => {
    changeIcon.classList.toggle('icon-second')
})

