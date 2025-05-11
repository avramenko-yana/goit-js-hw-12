// js/main.js
import { getImagesByQuery } from './js/pixabay-api'; // Імпортуємо функцію запиту до API
import {
  appendGalleryMarkup, // Змінили імпорт, тепер додаємо розмітку
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton, // Імпортуємо нові функції для кнопки
  hideLoadMoreButton,
  getGalleryCardHeight // Імпортуємо функцію для отримання висоти картки
} from './js/render-functions'; // Імпортуємо функції рендеру та керування лоадером
import iziToast from "izitoast"; // Імпортуємо бібліотеку повідомлень
import "izitoast/dist/css/iziToast.min.css"; // Імпортуємо стилі iziToast


// Знаходимо елементи DOM
const searchForm = document.querySelector('.form');
const searchInput = searchForm.querySelector('input[name="search-text"]');
const loadMoreButton = document.querySelector('.load-more-button'); // Знаходимо кнопку "Load more"

// Змінні стану для пагінації та поточного запиту
let currentQuery = '';
let currentPage = 1;
const perPage = 15; // Кількість елементів на сторінці, як вимагає ТЗ
let totalHits = 0; // Загальна кількість знайдених зображень

// Приховуємо кнопку "Load more" при першому завантаженні сторінки
hideLoadMoreButton();


// Обробник події 'submit' для форми пошуку
searchForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Зупиняємо стандартну дію браузера (перезавантаження сторінки)

  const query = searchInput.value.trim(); // Отримуємо пошуковий запит

  // Перевіряємо, чи не є запит порожнім рядком
  if (query === '') {
    iziToast.warning({
      title: 'Увага',
      message: 'Будь ласка, введіть пошуковий запит.',
      position: 'topRight',
    });
    return;
  }

  // Скидаємо стан для нового пошуку
  currentQuery = query;
  currentPage = 1;
  totalHits = 0; // Скидаємо загальну кількість знайдених зображень
  clearGallery(); // Очищаємо галерею
  hideLoadMoreButton(); // Приховуємо кнопку "Load more" перед новим пошуком
  showLoader(); // Показуємо індикатор завантаження

  try {
    // Виконуємо перший запит до Pixabay API
    const data = await getImagesByQuery(currentQuery, currentPage);

    // Перевіряємо, чи отримано будь-які зображення
    if (data.hits.length === 0) {
      iziToast.info({
        title: 'Інформація',
        message: 'На жаль, зображень за вашим запитом не знайдено. Спробуйте ще раз!',
        position: 'topRight',
      });
    } else {
      // Якщо зображення знайдені, відображаємо їх
      appendGalleryMarkup(data.hits); // Використовуємо appendGalleryMarkup
      totalHits = data.totalHits; // Зберігаємо загальну кількість знайдених зображень

      // Перевіряємо, чи є ще сторінки для завантаження
      if (data.hits.length < totalHits) {
         showLoadMoreButton(); // Показуємо кнопку "Load more"
      } else {
         // Якщо на першій сторінці вже всі результати
         iziToast.info({
           title: 'Інформація',
           message: "We're sorry, but you've reached the end of search results.",
           position: 'topRight',
         });
      }
    }

  } catch (error) {
    // Обробка помилок запиту
     iziToast.error({
        title: 'Помилка',
        message: 'Не вдалося завантажити зображення. Спробуйте пізніше.',
        position: 'topRight',
      });
      console.error('Помилка пошуку:', error);
  } finally {
    // Виконується завжди
    hideLoader(); // Приховуємо індикатор завантаження
    searchForm.reset(); // Очищаємо поле вводу форми
  }
});

// Обробник події 'click' для кнопки "Load more"
loadMoreButton.addEventListener('click', async () => {
  currentPage += 1; // Збільшуємо номер сторінки
  showLoader(); // Показуємо індикатор завантаження
  hideLoadMoreButton(); // Приховуємо кнопку "Load more" під час завантаження

  try {
    // Виконуємо запит за наступною сторінкою
    const data = await getImagesByQuery(currentQuery, currentPage);

    // Додаємо нові зображення до галереї
    appendGalleryMarkup(data.hits);

    // Перевіряємо, чи є ще сторінки для завантаження
    const loadedImagesCount = currentPage * perPage;
    if (loadedImagesCount < totalHits) {
       showLoadMoreButton(); // Показуємо кнопку "Load more"
    } else {
       // Якщо дійшли до кінця колекції
       hideLoadMoreButton(); // Ховаємо кнопку
       iziToast.info({
         title: 'Інформація',
         message: "We're sorry, but you've reached the end of search results.",
         position: 'topRight',
       });
    }

    // Плавне прокручування сторінки
    const cardHeight = getGalleryCardHeight();
    if (cardHeight > 0) {
       window.scrollBy({
         top: cardHeight * 2, // Прокручуємо на дві висоти картки
         behavior: 'smooth' // Робимо прокручування плавним
       });
    }


  } catch (error) {
    // Обробка помилок запиту
     iziToast.error({
        title: 'Помилка',
        message: 'Не вдалося завантажити додаткові зображення. Спробуйте пізніше.',
        position: 'topRight',
      });
      console.error('Помилка завантаження додаткових зображень:', error);
      showLoadMoreButton(); // На випадок помилки, можливо, варто показати кнопку знову
  } finally {
    // Виконується завжди
    hideLoader(); // Приховуємо індикатор завантаження
  }
});
