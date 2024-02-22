import axios from 'axios';

import SlimSelect from 'slim-select';

import Notiflix from 'notiflix';

const API_URL = 'https://api.thecatapi.com/v1';
const API_KEY =
  'live_rdqKQpQH7r8MY4Lzyhl1EEiE7Zu78twyJjqhu6IaaFbJB22oKkqTfojVvEZQHCiB';

axios.defaults.headers.common['X-api-key'] = API_KEY;

export const fetchBreeds = () => {
  return axios
    .get(`${API_URL}/breeds`)
    .then(response => response.data)
    .catch(error => {
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!',
        error
      );
      throw error;
    });
};

export const fetchCatByBreed = breedId => {
  return axios
    .get(`${API_URL}/images/search?breed_ids=${breedId}`)
    .then(response => response.data[0])
    .catch(error => {
      Notiflix.Notify.failure(
        `Oops! Something went wrong! Try reloading the page!`,
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

      const container = document.createElement('div');
      container.style.display = 'flex';

      const imgContainer = document.createElement('div');
      imgContainer.style.width = '40%';
      imgContainer.style.marginRight = '20px';

      const img = document.createElement('img');
      img.src = cat.url;
      img.width = 500;
      imgContainer.appendChild(img);

      container.appendChild(imgContainer);

      const textContainer = document.createElement('div');
      textContainer.style.width = '50%';

      const name = document.createElement('h2');
      name.textContent = cat.breeds[0].name;
      textContainer.appendChild(name);

      const description = document.createElement('p');
      description.textContent = cat.breeds[0].description;
      textContainer.appendChild(description);

      const temperamentLabel = document.createElement('strong');
      temperamentLabel.textContent = 'Temperament: ';

      const temperament = document.createElement('p');
      temperament.appendChild(temperamentLabel);
      temperament.appendChild(
        document.createTextNode(cat.breeds[0].temperament)
      );

      textContainer.appendChild(temperament);

      container.appendChild(textContainer);

      catInfo.appendChild(container);

      error.classList.remove('show');
    })
    .catch(() => {
      Notiflix.Notify.failure =
        'Oops! Something went wrong! Try reloading the page!';
      error.classList.add('show');
    });
});
