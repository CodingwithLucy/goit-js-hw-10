import axios from 'axios';

import SlimSelect from 'slim-select';

const API_URL = 'https://api.thecatapi.com/v1';
const API_KEY =
  'live_rdqKQpQH7r8MY4Lzyhl1EEiE7Zu78twyJjqhu6IaaFbJB22oKkqTfojVvEZQHCiB';

axios.defaults.headers.common['X-api-key'] = API_KEY;

export const fetchBreeds = () => {
  return axios
    .get(`${API_URL}/breeds`)
    .then(response => response.data)
    .catch(error => {
      console.error('Błąd podczas pobierania ras:', error);
      throw error;
    });
};

export const fetchCatByBreed = breedId => {
  return axios
    .get(`${API_URL}/images/search?breed_ids=${breedId}`)
    .then(response => response.data[0])
    .catch(error => {
      console.error(
        `Błąd podczas pobierania informacji o kocie dla rasy ${breedId}:`,
        error
      );
      throw error;
    });
};

const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const breedSelect = document.querySelector('.breed-select');
const catInfo = document.querySelector('.cat-info');

loader.classList.add('show');
error.classList.remove('show');

fetchBreeds()
  .then(breeds => {
    loader.classList.remove('show');
    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.text = breed.name;
      breedSelect.appendChild(option);
    });
  })
  .catch(() => {
    loader.classList.remove('show');
    error.classList.add('show');
  });

breedSelect.addEventListener('change', function () {
  const breedId = this.value;
  fetchCatByBreed(breedId)
    .then(cat => {
      while (catInfo.firstChild) {
        catInfo.removeChild(catInfo.firstChild);
      }

      const img = document.createElement('img');
      img.src = cat.url;
      catInfo.appendChild(img);

      const name = document.createElement('h2');
      name.textContent = cat.breeds[0].name;
      catInfo.appendChild(name);

      const description = document.createElement('p');
      description.textContent = cat.breeds[0].description;
      catInfo.appendChild(description);

      const temperament = document.createElement('p');
      temperament.textContent = cat.breeds[0].temperament;
      catInfo.appendChild(temperament);

      error.classList.remove('show');
    })
    .catch(() => {
      error.textContent =
        'Wystąpił błąd podczas pobierania informacji o kocie.';
      error.classList.add('show');
    });
});
