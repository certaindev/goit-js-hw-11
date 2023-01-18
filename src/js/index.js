import { PixabayAPI } from './pixabay-api';
import Notiflix from 'notiflix';

const api = new PixabayAPI('', 40, 1);

const refs = {
  searchFormEl: document.querySelector('#search-form'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreEl: document.querySelector('.load-more'),
};

refs.searchFormEl.addEventListener('submit', onLoadImage);
refs.loadMoreEl.addEventListener('click', onLoadMore);
refs.loadMoreEl.style.display = 'none';

function onLoadImage(e) {
  e.preventDefault();
  refs.loadMoreEl.style.display = 'none';
  refs.galleryEl.innerHTML = '';
  api.query = e.target.elements.searchQuery.value.trim();
  api.page = 1;
  api
    .fetchImages()
    .then(data => {
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      refs.galleryEl.insertAdjacentHTML(
        'beforeend',
        createGalleryMarkup(data.hits)
      );
      if (data.totalHits / api.perPage > 1) {
        refs.loadMoreEl.style.display = 'block';
      }
    })
    .catch(error => {
      console.log(error.message);
    });
}

function onLoadMore(e) {
  api.page += 1;
  api
    .fetchImages()
    .then(data => {
      refs.galleryEl.insertAdjacentHTML(
        'beforeend',
        createGalleryMarkup(data.hits)
      );
      if (data.totalHits / (api.perPage * api.page) < 1) {
        refs.loadMoreEl.style.display = 'none';
      }
    })
    .catch(error => {
      console.log(error.message);
    });
}

function createGalleryMarkup(hits) {
  return hits
    .map(img => {
      return `
        <div class="photo-card">
          <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" width="300" height="200"/>
          <div class="info">
            <p class="info-item">
              <b>Likes:</b> ${img.likes}
            </p>
            <p class="info-item">
              <b>Views:</b> ${img.views}
            </p>
            <p class="info-item">
              <b>Comments:</b> ${img.comments}
            </p>
            <p class="info-item">
              <b>Downloads:</b> ${img.downloads}
            </p>
          </div>
        </div>
        `;
    })
    .join('');
}
