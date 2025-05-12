 
import { getImagesByQuery } from './js/pixabay-api'; 
import {
  appendGalleryMarkup,  
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,  
  hideLoadMoreButton,
  getGalleryCardHeight  
} from './js/render-functions';  
import iziToast from "izitoast"; 
import "izitoast/dist/css/iziToast.min.css";  


 
const searchForm = document.querySelector('.form');
const searchInput = searchForm.querySelector('input[name="search-text"]');
const loadMoreButton = document.querySelector('.load-more-button');  

 
let currentQuery = '';
let currentPage = 1;
const perPage = 15;  
let totalHits = 0;  

 
hideLoadMoreButton();


 
searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();  

  const query = searchInput.value.trim();  

  
  if (query === '') {
    iziToast.warning({
      title: 'Увага',
      message: 'Будь ласка, введіть пошуковий запит.',
      position: 'topRight',
    });
    return;
  }

   
  currentQuery = query;
  currentPage = 1;
  totalHits = 0; 
  clearGallery();  
  hideLoadMoreButton();  
  showLoader();  

  try {
     
    const data = await getImagesByQuery(currentQuery, currentPage);

     
    if (data.hits.length === 0) {
      iziToast.info({
        title: 'Інформація',
        message: 'На жаль, зображень за вашим запитом не знайдено. Спробуйте ще раз!',
        position: 'topRight',
      });
    } else {
      
      appendGalleryMarkup(data.hits);  
      totalHits = data.totalHits;  

     
      if (data.hits.length < totalHits) {
         showLoadMoreButton();  
      } else {
         
         iziToast.info({
           title: 'Інформація',
           message: "We're sorry, but you've reached the end of search results.",
           position: 'topRight',
         });
      }
    }

  } catch (error) {
    
     iziToast.error({
        title: 'Помилка',
        message: 'Не вдалося завантажити зображення. Спробуйте пізніше.',
        position: 'topRight',
      });
      console.error('Помилка пошуку:', error);
  } finally {
 
    hideLoader();  
    searchForm.reset(); 
  }
});

 
loadMoreButton.addEventListener('click', async () => {
  currentPage += 1;  
  showLoader();  
  hideLoadMoreButton();  

  try {
     
    const data = await getImagesByQuery(currentQuery, currentPage);

     
    appendGalleryMarkup(data.hits);

     
    const loadedImagesCount = currentPage * perPage;
    if (loadedImagesCount < totalHits) {
       showLoadMoreButton();  
    } else {
        
       hideLoadMoreButton();  
       iziToast.info({
         title: 'Інформація',
         message: "We're sorry, but you've reached the end of search results.",
         position: 'topRight',
       });
    }

    
    const cardHeight = getGalleryCardHeight();
    if (cardHeight > 0) {
       window.scrollBy({
         top: cardHeight * 2,  
         behavior: 'smooth'  
       });
    }


  } catch (error) {
   
     iziToast.error({
        title: 'Помилка',
        message: 'Не вдалося завантажити додаткові зображення. Спробуйте пізніше.',
        position: 'topRight',
      });
      console.error('Помилка завантаження додаткових зображень:', error);
      showLoadMoreButton();  
  } finally {
    
    hideLoader();  
  }
});
