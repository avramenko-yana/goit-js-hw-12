 
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

 
const galleryElement = document.querySelector('.gallery');

 
const loaderElement = document.querySelector('.loader');  

 
const loadMoreButton = document.querySelector('.load-more-button');  

 
const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',  
    captionDelay: 250,   
});

 
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

 
export function appendGalleryMarkup(images) {
   
  if (!images || images.length === 0) {
    return;  
  }

   
  const galleryHTML = images.map(image => createImageCard(image)).join('');

   
  galleryElement.insertAdjacentHTML('beforeend', galleryHTML);

  
  lightbox.refresh();
}

 
export function clearGallery() {
  galleryElement.innerHTML = '';  
}

 
export function showLoader() {
  if (loaderElement) {
    loaderElement.classList.add('visible');  
  }
}
 
export function hideLoader() {
   if (loaderElement) {
    loaderElement.classList.remove('visible');  
  }
}

 
export function showLoadMoreButton() {
  if (loadMoreButton) {
    loadMoreButton.classList.remove('is-hidden');
  }
}
 
export function hideLoadMoreButton() {
  if (loadMoreButton) {
    loadMoreButton.classList.add('is-hidden');
  }
}
 
export function getGalleryCardHeight() {
  const firstGalleryItem = galleryElement.querySelector('.gallery-item');
  if (firstGalleryItem) {
    const cardRect = firstGalleryItem.getBoundingClientRect();
    return cardRect.height;
  }
  return 0;  
}
