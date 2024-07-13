import { image_base_url, sizes, get } from './api.js';

function hideLoader(image_url, loader = null, cont = null) {
	let image = new Image();
	image.src = image_url;
	image.addEventListener('load', (_) => {
		loader.classList.add('loading-hide');
		cont.style.setProperty('background-image', `url(${image_url})`);
	});
}

function updateSlidersData(type, request, slides, backdrop = false) {
	let endpoint = null;
	const page = 1 + Math.floor(Math.random() * 5);

	if (request === 'trending')
		endpoint = `https://api.themoviedb.org/3/trending/movie/day`;
	else if (request === 'popular')
		endpoint = `https://api.themoviedb.org/3/${type}/popular?page=${page}`;
	else if (request === 'toprated')
		endpoint = `https://api.themoviedb.org/3/${type}/top_rated`;

	get(endpoint, function (x) {
		let results = x.results;
		slides.forEach((slide, index) => {
			let loader = slide.querySelector('.loader');
			let crr = results[index];
			let image_url = null;
			try {
				let details = slide.querySelector('.details');
				details.href = `details.html?id=${crr.id}`;
				let top_rated_name = slide.querySelector('.toprated__name');
				if (type === 'movie') {
					top_rated_name.textContent = crr.title;
				} else {
					top_rated_name.textContent = crr.name;
				}
			} catch {}

			if (backdrop) {
				image_url = `${image_base_url}${sizes.backdrop_sizes[1]}${crr.backdrop_path}`;
			} else {
				image_url = `${image_base_url}${sizes.poster_sizes[3]}${crr.poster_path}`;
			}
			hideLoader(image_url, loader, slide);
		});
	});
}

updateSlidersData(
	'movie',
	'popular',
	document.querySelectorAll('.landing__movie-card')
);
