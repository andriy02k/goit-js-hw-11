import axios from "axios";
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

axios.defaults.baseURL = 'https://pixabay.com/api';

const form = document.querySelector(".search-form");
const container = document.querySelector('.gallery');

form.addEventListener("submit", handlerSearch);

async function handlerSearch(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const inputValue = formData.get("searchQuery");
    try {
        const gallery = await serviceGetGallery(inputValue);
        const images = gallery.hits;
        container.innerHTML = createMarkup(images);
            const lightbox = new SimpleLightbox('.gallery a', {
        /* Налаштування можна додати тут */
            });
        lightbox.refresh();
    } catch (err) {
        Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.');
        console.log(err);
    };
};



async function serviceGetGallery(query) {
    const params = await{
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
    <a class="gallery__link" href="${webformatURL}">
        <div class="photo-card gallery__item">
            <img src="${largeImageURL}" alt="${tags}" loading="lazy" />
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
         </div>
    </a>
  `
    )
    .join("");
};


// {webformatURL, largeImageURL, tags, likes, views, comments, downloads}

        //     images.forEach(image => {
        //         return { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = image;
        //     });
        // console.log(webformatURL, largeImageURL, tags, likes, views, comments, downloads);

    
