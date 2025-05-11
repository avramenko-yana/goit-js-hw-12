// js/pixabay-api.js
import axios from 'axios';

// Ваш унікальний ключ доступу до API Pixabay
// Увага: у реальних проектах ключі API не зберігають прямо в коді!
const API_KEY = '50196951-391601c250e619b024764c208'; // <-- ЗАМІНІТЬ НА ВАШ КЛЮЧ!
const BASE_URL = 'https://pixabay.com/api/';

/**
 * Виконує HTTP-запит до Pixabay API для пошуку зображень з пагінацією.
 * @param {string} query - Пошукове слово.
 * @param {number} page - Номер сторінки результатів.
 * @returns {Promise<object>} - Проміс, що резолвиться з об'єктом відповіді (властивість data),
 * що містить масив hits та totalHits.
 * @throws {Error} - Кидає помилку, якщо запит не вдається.
 */
export async function getImagesByQuery(query, page) {
  // Параметри запиту згідно з ТЗ, включаючи пагінацію
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page, // Додаємо параметр сторінки
    per_page: 15, // Встановлюємо кількість елементів на сторінці (15)
  };

  try {
    // Виконуємо GET запит за допомогою Axios
    const response = await axios.get(BASE_URL, { params });

    // Axios автоматично обробляє успішні відповіді (статус 2xx)
    // Повертаємо об'єкт data з відповіді, який містить hits та totalHits
    return response.data;

  } catch (error) {
    // Обробка помилок мережі або помилок відповіді від сервера
    console.error('Помилка під час запиту до Pixabay API:', error);
    // Кидаємо помилку далі, щоб її обробив main.js
    throw error;
  }
}
