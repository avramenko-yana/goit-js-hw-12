 
import axios from 'axios';
 
const API_KEY = '50196951-391601c250e619b024764c208';  
const BASE_URL = 'https://pixabay.com/api/';

 
export async function getImagesByQuery(query, page) {
   
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,  
    per_page: 15,  
  };

  try {
     
    const response = await axios.get(BASE_URL, { params });

     
    return response.data;

  } catch (error) {
     
    console.error('Помилка під час запиту до Pixabay API:', error);
     
    throw error;
  }
}
