import { image_base_url, sizes, get, APP_LANG } from './api.js';
import { summarize, hideLoader } from './helper.js';
function fetchShow() {
	let Given = JSON.parse(localStorage.getItem('season'));
	let endpoint = `https://api.themoviedb.org/3/tv/${Given.tv_id}/season/${Given.season_id}`;

	const returnTo = document.querySelector('.return__to__series');

	const header = document.querySelector('.header');
	const loading = header.querySelector('.loading');

	const movie__title = document.querySelector('.movie__name');
	const movie__overview = document.querySelector('.movie__overview');

	get(endpoint, function (x) {
		console.log(x);
		returnTo.textContent = `${Given.tv_show} > ${x.name}`;
		fillEpisods(x.episodes, Given.tv_id, Given.tv_show, Given.season_id);
		movie__title.textContent = x.name;
		movie__overview.textContent = summarize(x.overview);
		movie__overview.style.setProperty('width', '90%');
		const image_url = `${image_base_url}${sizes.poster_sizes[4]}${x.poster_path}`;
		hideLoader(image_url, loading, header);
	});
}

fetchShow();

function fillEpisods(episods, serie_id, serie_name, season_number) {
	const episods_cards = document.querySelector(
		'.block__episods .block__cards'
	);

	episods_cards.innerHTML = ``;

	episods.forEach((episod, index) => {
		let block__card = document.createElement('div');
		block__card.classList.add('block__card');
		let block__loader = document.createElement('div');
		block__loader.classList.add('loader');
		block__loader.innerHTML = `<i class="bx bx-loader-alt bx-spin"></i>`;

		let card_number = document.createElement('h3');
		card_number.classList.add('episod__number');
		card_number.textContent = index + 1;

		let block__details = document.createElement('a');
		block__details.innerHTML = `<i class="bx bx-play"></i>`;
		block__details.classList.add('details');
		block__details.href = `watch.html`;

		block__details.addEventListener('click', (_) => {
			localStorage.setItem(
				'watch',
				JSON.stringify({
					id: serie_id,
					name: serie_name,
					type: 'tv',
					e: index + 1, 
					s: season_number,
				})
			);
		});

		block__card.append(block__loader, block__details, card_number);

		const image_url = `${image_base_url}${sizes.still_sizes[2]}${episod.still_path}`;
		episods_cards.append(block__card);
		hideLoader(image_url, block__loader, block__card);
	});
}
