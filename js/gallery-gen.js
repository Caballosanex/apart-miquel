/* js/gallery-gen.js */
document.addEventListener('DOMContentLoaded', function () {
	// Obtenir elements
	const mainImg = document.querySelector('.main-img');
	const images = mainImg.querySelectorAll('img');
	const numImages = images.length;
	const radioButtons = document.querySelectorAll('input[type="radio"]');
	const thumbnails = document.querySelectorAll('.thumbnail');

	// Establir l'amplada total basada en el nombre d'imatges
	mainImg.style.width = `${numImages * 100}%`;

	// Establir l'amplada individual de cada imatge
	images.forEach(img => {
		img.style.width = `${100 / numImages}%`;
	});

	// Event listeners per als radio buttons
	radioButtons.forEach((radio, index) => {
		radio.addEventListener('change', function () {
			// Moviment del carrusel
			const translateX = -(index * (100 / numImages));
			mainImg.style.transform = `translateX(${translateX}%)`;

			// Actualitzar thumbnails
			thumbnails.forEach(thumb => {
				thumb.style.opacity = '0.6';
				thumb.style.transform = 'scale(1)';
				thumb.style.boxShadow = 'none';
			});

			thumbnails[index].style.opacity = '1';
			thumbnails[index].style.transform = 'scale(1.05)';
			thumbnails[index].style.boxShadow = '0 0 0 2px #ff8c00';
		});
	});

	// Marcar la primera thumbnail com activa inicialment
	thumbnails[0].style.opacity = '1';
	thumbnails[0].style.transform = 'scale(1.05)';
	thumbnails[0].style.boxShadow = '0 0 0 2px #ff8c00';
});