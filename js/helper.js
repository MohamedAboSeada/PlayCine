

function summarize(overview) {
	return overview.split(' ').slice(0, 20).join(' ') + '...';
}

function getID() {
	let query = location.search.split('&');
	let numberPattern = /[0-9]/g;
	let typePattern = /[movie | tv]/g;
	let id = +query[0].match(numberPattern).join('');
	let type = query[1].match(typePattern).slice(2).join('');
	return { id, type };
}

function hideLoader(image_url, loader = null, cont = null) {
	let image = new Image();
	image.src = image_url;
	image.addEventListener('load', (_) => {
		loader.classList.add('loading-hide');
		cont.style.setProperty('background-image', `url(${image_url})`);
	});
}

export { summarize, hideLoader,getID };
