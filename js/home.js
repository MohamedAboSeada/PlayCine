import { image_base_url, sizes, get, APP_LANG } from './api.js';
import { summarize, hideLoader } from './helper.js';

if (APP_LANG === 'ar-EG') {
	document.body.style.setProperty('direction', 'rtl');
}

const sliders = ['#popularSlider', '#trendSlider', '#popularSeries'];
// update header date
function updateHeaderData() {
	const header = document.querySelector('.header');
	const loading = header.querySelector('.loading');
	header.style.setProperty('background-image', 'none');
	if (loading.classList.contains('loading-hide'))
		loading.classList.remove('loading-hide');

	const movie__title = document.querySelector('.movie__name');
	const movie__overview = document.querySelector('.movie__overview');

	const play_btn = document.querySelector('.movie__button-play');
	const page = 1 + Math.floor(Math.random() * 50);

	get(
		`https://api.themoviedb.org/3/discover/movie?page=${page}`,
		function (x) {
			let rand = Math.floor(Math.random() * 19);
			let results = x.results;
			const crr = results[rand];

			// setting movie info
			movie__title.textContent = crr.original_title;
			movie__overview.textContent = summarize(crr.overview);

			// details
			play_btn.href = `details.html?id=${crr.id}&type=movie`;
			play_btn.addEventListener('click', (_) => {
				localStorage.setItem(
					'details',
					JSON.stringify({ id: crr.id, type: 'movie' })
				);
			});
			// setting the image
			const image_url = `${image_base_url}${sizes.backdrop_sizes[1]}${crr.backdrop_path}`;
			hideLoader(image_url, loading, header);
		}
	);
}

function updateSlidersData(type, request, slides, backdrop = false) {
	let endpoint = null;
	const page = 1 + Math.floor(Math.random() * 50);

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
			let details = slide.querySelector('.details');
			try {
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
				image_url = `${image_base_url}${sizes.poster_sizes[2]}${crr.poster_path}`;
			}

			if (type === 'movie') {
				details.href = `details.html`;
				details.addEventListener('click', (_) => {
					localStorage.setItem(
						'details',
						JSON.stringify({ id: crr.id, type: 'movie' })
					);
				});
			} else if (type === 'tv') {
				details.href = `details.html`;
				details.addEventListener('click', (_) => {
					localStorage.setItem(
						'details',
						JSON.stringify({ id: crr.id, type: 'tv' })
					);
				});
			}
			hideLoader(image_url, loader, slide);
		});
	});
}

function updateUpComingTrellers() {
	const trillerCards = document.querySelectorAll('.trillerCard');
	const page = 1 + Math.floor(Math.random() * 5);

	const endpoint = `https://api.themoviedb.org/3/movie/upcoming?page=${page}`;
	get(
		endpoint,
		function (x) {
			let upComingMovies = x.results;
			trillerCards.forEach((card, index) => {
				let crr = upComingMovies[index];
				let image_url = `${image_base_url}${sizes.backdrop_sizes[1]}${crr.backdrop_path}`;
				let loader = card.querySelector('.loader');
				let watchButton = card.querySelector('.details');
				let video = `https://api.themoviedb.org/3/movie/${crr.id}/videos`;

				hideLoader(image_url, loader, card);

				watchButton.addEventListener('click', (x) => {
					get(video, function (x) {
						let trailerResults = x.results.filter(
							(x) => x.type === 'Trailer'
						);
						if (trailerResults.length > 0) {
							showtrillerWatch(
								`https://www.youtube.com/embed/${trailerResults[0].key}`
							);
						}
					});
				});
			});
		},
		'upcoming'
	);
}

sliders.forEach((slider) => {
	new Splide(slider, {
		pagination: false,
		perPage: 6,
		perMove: 1,
		breakpoints: {
			1200: { perPage: 6, perMove: 1 },
			992: { perPage: 4, perMove: 1, arrows: false },
			768: { perPage: 3, perMove: 1 },
			576: { perPage: 2, perMove: 1 },
		},
	}).mount();
});

// intilize the app
updateUpComingTrellers();
updateHeaderData();

updateSlidersData(
	'movie',
	'trending',
	document.querySelectorAll('#trendSlider .splide__slide')
);

updateSlidersData(
	'movie',
	'popular',
	document.querySelectorAll('#popularSlider .splide__slide')
);

updateSlidersData(
	'tv',
	'popular',
	document.querySelectorAll('#popularSeries .splide__slide')
);

function TopRated() {
	if (window.innerWidth <= 768) {
		updateSlidersData(
			'movie',
			'toprated',
			document.querySelectorAll('.movie .topRated__card'),
			true
		);

		updateSlidersData(
			'tv',
			'toprated',
			document.querySelectorAll('.tv .topRated__card'),
			true
		);
	} else {
		updateSlidersData(
			'movie',
			'toprated',
			document.querySelectorAll('.movie .topRated__card')
		);

		updateSlidersData(
			'tv',
			'toprated',
			document.querySelectorAll('.tv .topRated__card')
		);
	}
}

TopRated();

window.addEventListener('resize', (_) => {
	TopRated();
});

const closetrillerWatch = document.querySelector('.trillerWatch__closeWatch');
const trillerWatch = document.querySelector('.trillerWatch');
const embedFrame = document.querySelector('.trillerWatch__youtubeEmbed');

// close and hide watch Trailers
closetrillerWatch.addEventListener('click', (_) => {
	trillerWatch.classList.add('trillerWatch_hide');
	embedFrame.src = '';
});

function showtrillerWatch(youtubeVideoUrl) {
	trillerWatch.classList.remove('trillerWatch_hide');
	embedFrame.src = youtubeVideoUrl;
}
