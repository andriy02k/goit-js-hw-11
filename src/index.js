import axios from "axios";
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

axios.defaults.baseURL = 'https://pixabay.com/api';

const form = document.querySelector(".search-form");
const container = document.querySelector('.gallery');

const lightbox = new SimpleLightbox('.gallery a');

form.addEventListener("submit", handlerSearch);
container.addEventListener('click', markupCardList);

async function handlerSearch(e) {
    e.preventDefault();
    container.innerHTML = '';

    const formData = new FormData(e.currentTarget);
    const inputValue = formData.get("searchQuery");
    if (!inputValue) {
    return Notify.failure('Enter something!');
  }
    try {
        const gallery = await serviceGetGallery(inputValue);
        container.innerHTML = createMarkup(gallery.hits);
    } catch (err) {
        Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.');
        console.log(err);
    } finally {
        form.reset();
        lightbox.refresh();
    }
};

async function markupCardList(evt) {
  evt.preventDefault();
  lightbox.next();
}


async function serviceGetGallery(query) {
    const params = {
                key: '40333980-523d7a346ab541add85c41861',
                q: query,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
    };
    return axios.get('', { params })
        .then(response => response.data);
};

function createMarkup(arr) {
    return arr
    .map(
        ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
        <div class="photo-card">
            <a class="gallery__link" href="${largeImageURL}">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                <div class="info">
                    <p class="info-item">
                        <b>${likes} Likes</b>
                    </p>
                    <p class="info-item">
                        <b>${views} Views</b>
                    </p>
                    <p class="info-item">
                        <b>${comments} Comments</b>
                    </p>
                    <p class="info-item">
                        <b>${downloads} Downloads</b>
                    </p>
                </div>
            </a>
        </div>
    
  `
    )
    .join("");
};


// {webformatURL, largeImageURL, tags, likes, views, comments, downloads}

        //     images.forEach(image => {
        //         return { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = image;
        //     });
        // console.log(webformatURL, largeImageURL, tags, likes, views, comments, downloads);

    
