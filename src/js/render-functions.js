// js/render-functions.js
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

// Знаходимо контейнер для галереї в DOM
const galleryElement = document.querySelector('.gallery');

// Знаходимо елемент лоадера в DOM
const loaderElement = document.querySelector('.loader'); // Переконайтеся, що у вас є елемент з класом 'loader' в HTML

// Знаходимо кнопку "Load more"
const loadMoreButton = document.querySelector('.load-more-button'); // Переконайтеся, що у вас є кнопка з класом 'load-more-button'

// Створюємо екземпляр SimpleLightbox
// Ініціалізуємо його на посиланнях всередині галереї
const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt', // Використовуємо атрибут alt зображення як підпис
    captionDelay: 250,   // Затримка в мілісекундах перед появою підпису
});

/**
 * Створює HTML-розмітку для однієї картки зображення.
 * @param {object} image - Об'єкт зображення з API.
 * @returns {string} - Рядок з HTML-розміткою картки.
 */
function createImageCard({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
  return `
    <li class="gallery-item">
      <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" />
      </a>
      <div class="info">
        <p class="info-item"><b>Likes</b> ${likes}</p>
        <p class="info-item"><b>Views</b> ${views}</p>
        <p class="info-item"><b>Comments</b> ${comments}</p>
        <p class="info-item"><b>Downloads</b> ${downloads}</p>
      </div>
    </li>
  `;
}

/**
 * Додає HTML-розмітку для нових зображень в кінець контейнера галереї.
 * Оновлює SimpleLightbox.
 * @param {array} images - Масив об'єктів зображень для додавання.
 */
export function appendGalleryMarkup(images) {
  // Перевіряємо, чи отримано масив зображень і чи він не порожній
  if (!images || images.length === 0) {
    return; // Якщо масив порожній, нічого не додаємо
  }

  // Створюємо HTML для всіх нових карток за одну операцію
  const galleryHTML = images.map(image => createImageCard(image)).join('');

  // Додаємо згенеровану розмітку в кінець контейнера галереї
  galleryElement.insertAdjacentHTML('beforeend', galleryHTML);

  // Оновлюємо SimpleLightbox після додавання нових елементів до DOM
  lightbox.refresh();
}


/**
 * Очищає вміст контейнера галереї.
 */
export function clearGallery() {
  galleryElement.innerHTML = ''; // Встановлюємо порожній рядок як вміст
}

/**
 * Показує індикатор завантаження (лоадер).
 * Потрібно додати відповідні CSS стилі для класу 'visible'.
 */
export function showLoader() {
  if (loaderElement) {
    loaderElement.classList.add('visible'); // Додаємо клас, що робить лоадер видимим
  }
}

/**
 * Приховує індикатор завантаження (лоадер).
 * Потрібно прибрати відповідні CSS стилі для класу 'visible'.
 */
export function hideLoader() {
   if (loaderElement) {
    loaderElement.classList.remove('visible'); // Прибираємо клас, що робить лоадер видимим
  }
}

/**
 * Показує кнопку "Load more".
 * Прибирає клас 'is-hidden'.
 */
export function showLoadMoreButton() {
  if (loadMoreButton) {
    loadMoreButton.classList.remove('is-hidden');
  }
}

/**
 * Приховує кнопку "Load more".
 * Додає клас 'is-hidden'.
 */
export function hideLoadMoreButton() {
  if (loadMoreButton) {
    loadMoreButton.classList.add('is-hidden');
  }
}

/**
 * Отримує висоту однієї картки галереї для плавного прокручування.
 * @returns {number} Висота першої картки галереї або 0, якщо галерея порожня.
 */
export function getGalleryCardHeight() {
  const firstGalleryItem = galleryElement.querySelector('.gallery-item');
  if (firstGalleryItem) {
    const cardRect = firstGalleryItem.getBoundingClientRect();
    return cardRect.height;
  }
  return 0; // Повертаємо 0, якщо елементів немає
}
