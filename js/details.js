import { image_base_url, sizes, get, APP_LANG } from './api.js';
import { summarize, hideLoader } from './helper.js';

const seasons = document.querySelector('.block__seasons');

function fetchShow() {
	let Given = JSON.parse(localStorage.getItem('details'));
	let endpoint =
		Given.type === 'movie'
			? `https://api.themoviedb.org/3/movie/${Given.id}`
			: `https://api.themoviedb.org/3/tv/${Given.id}`;

	const play_btn = document.querySelector('.movie__button-play');

	const watch__details = {
		id: Given.id,
		type: Given.type,
	};

	play_btn.addEventListener('click', (_) => {
		localStorage.setItem('watch', JSON.stringify(watch__details));
	});

	const header = document.querySelector('.header');
	const loading = header.querySelector('.loading');

	const movie__title = document.querySelector('.movie__name');
	const movie__overview = document.querySelector('.movie__overview');
	const movie__genres = document.querySelector('.movie__genres');

	const trillerbtn = document.querySelector('.movie__button-trailer');

	if (Given.type === 'tv') {
		seasons.classList.remove('hide_seasons');
		play_btn.classList.add('hide');
	}

	get(endpoint, function (x) {
		Given.type === 'movie'
			? changeTitle(x.title, movie__title, watch__details)
			: changeTitle(x.name, movie__title, watch__details);

		if (Given.type === 'tv') fillSeasons(x.seasons, x.id, x.name);

		movie__overview.textContent = summarize(x.overview);
		if (x.genres.length > 0) {
			x.genres.slice(0, 2).forEach((genre) => {
				createGenre(movie__genres, genre.name);
			});
		} else {
			createGenre(movie__genres, 'N/A');
		}
		const image_url = `${image_base_url}${sizes.backdrop_sizes[1]}${x.backdrop_path}`;
		hideLoader(image_url, loading, header);

		play_btn.href = `watch.html`;
		let video = `https://api.themoviedb.org/3/${Given.type}/${Given.id}/videos`;

		trillerbtn.addEventListener('click', (x) => {
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

		updateGirds(Given.id, Given.type, 'recommendation');
		updateGirds(Given.id, Given.type, 'similar');
	});
}

function createGenre(movie__genres, genre__name) {
	let el = document.createElement('p');
	el.className = 'movie__genre';
	el.textContent = genre__name;
	movie__genres.append(el);
}

function updateGirds(show_id, type, request = 'recommendation') {
	let endpoint = null;
	let slides = null;
	if (request === 'recommendation') {
		endpoint =
			type === 'movie'
				? `https://api.themoviedb.org/3/movie/${show_id}/recommendations`
				: `https://api.themoviedb.org/3/tv/${show_id}/recommendations`;
		slides = document.querySelectorAll('.block__recommend .block__card');
	} else {
		endpoint =
			type === 'movie'
				? `https://api.themoviedb.org/3/movie/${show_id}/similar`
				: `https://api.themoviedb.org/3/tv/${show_id}/similar`;
		slides = document.querySelectorAll('.block__related .block__card');
	}

	get(endpoint, function (x) {
		let results = x.results;
		slides.forEach((slide, index) => {
			let loader = slide.querySelector('.loader');
			let crr = results[index];
			let poster = crr.poster_path ? crr.poster_path : crr.backdrop_path;
			let image_url = `${image_base_url}${sizes.poster_sizes[2]}${poster}`;
			let details = slide.querySelector('.details');

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

function changeTitle(title, movie_title, details_obj) {
	document.title = `PlayCine - ${title}`;
	movie_title.textContent = title;
	details_obj['name'] = title;
}

fetchShow();

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

function fillSeasons(seasons, serie_id, show_name) {
	const seasons_cards = document.querySelector(
		'.block__seasons .block__cards'
	);

	seasons_cards.innerHTML = ``;

	seasons.forEach((season) => {
		console.log(season);
		let block__card = document.createElement('div');
		block__card.classList.add('block__card');
		let block__loader = document.createElement('div');
		block__loader.classList.add('loader');
		block__loader.innerHTML = `<i class="bx bx-loader-alt bx-spin"></i>`;

		let block__details = document.createElement('a');
		block__details.innerHTML = `<i class="bx bx-play"></i>`;
		block__details.classList.add('details');
		block__details.href = `season.html`;
		block__details.addEventListener('click', (_) => {
			localStorage.setItem(
				'season',
				JSON.stringify({
					tv_id: serie_id,
					tv_show: show_name,
					season_id: season.season_number,
				})
			);
		});

		block__card.append(block__loader, block__details);

		const image_url = `${image_base_url}${sizes.poster_sizes[1]}${season.poster_path}`;
		seasons_cards.append(block__card);
		hideLoader(image_url, block__loader, block__card);
	});
}
