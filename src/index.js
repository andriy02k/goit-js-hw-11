import axios from "axios";
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '40333980-523d7a346ab541add85c41861';

const form = document.querySelector(".search-form");
const container = document.querySelector('.gallery');
const guard = document.querySelector('.js-guard');

const options = {
  root: null,
  rootMargin: "300px",
};

const observer = new IntersectionObserver(handlerLoadMore, options);

let page = 1;
let isLoading = false;
let quantity = 0;

form.addEventListener("submit", handlerSearch);

const lightbox = new SimpleLightbox('.gallery a',{captionsData: 'alt', captionDelay: 250});

async function handlerSearch(e) {
    e.preventDefault();
    container.innerHTML = '';

    const formData = new FormData(e.currentTarget);
    const inputValue = formData.get("searchQuery");
    if (!inputValue) {
    return Notiflix.Notify.failure('Enter something!');
  }
    try {
        const gallery = await serviceGetGallery(inputValue);

        if (gallery.hits.length === 0) {
            Notiflix.Report.failure(
                'Error 404',
                'Sorry, there are no images matching your search query. Please try again.'
            );
        }
        container.insertAdjacentHTML('beforeend', createMarkup(gallery.hits));
        if (gallery.totalHits < gallery.total) {
            observer.observe(guard);
        }
    } catch (err) {
        Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.');
        console.log(err);
    } finally {
        // form.reset();
        lightbox.refresh();
    }
};

async function serviceGetGallery(query, page = 1) {
    const params = new URLSearchParams({
                key: API_KEY,
                q: query,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                page,
                per_page: '40',
    });
    const response = await axios.get(`${BASE_URL}?${params}`)
        return response.data;
};

function createMarkup(arr) {
    return arr
    .map(
        ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
        <div class="photo-card gallery__item">
            <a class="gallery__link" href="${largeImageURL}">
                <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
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

async function handlerLoadMore(entries, observer) {
    try {
        const formData = new FormData(form);
        const inputValue = formData.get("searchQuery");

        await entries.forEach(entry => {
            if (entry.isIntersecting) {
                isLoading = true;
                page += 1;
                serviceGetGallery(inputValue, page)
                    .then((data) => {
                        isLoading = false;
                        container.insertAdjacentHTML('beforeend', createMarkup(data.hits));
                        quantity += data.hits.length;
                        if (data.total <= quantity) {
                            observer.unobserve(guard);
                        }
                })
            }
        });
    } catch (error) {
        isLoading = false;
        Notiflix.Notify.failure(error.message);
  } finally {
        lightbox.refresh();
  }
}
    
