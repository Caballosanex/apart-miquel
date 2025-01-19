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

	// Configurar cada imatge individualment
	images.forEach(img => {
		img.style.width = `${100 / numImages}%`;
		
		// Afegim gestió per imatges verticals
		img.addEventListener('load', function() {
			if (this.naturalHeight > this.naturalWidth) {
				// És una imatge vertical
				this.style.width = 'auto';  // Eliminem l'amplada forçada
				this.style.height = '100%'; // Ajustem l'altura al 100% del contenidor
				this.style.maxWidth = '100%'; // Evitem que sobresurti del contenidor
				this.style.objectFit = 'contain'; // Mantenim la relació d'aspecte
				this.style.margin = '0 auto'; // Centrem horitzontalment
			} else {
				// És una imatge horitzontal
				this.style.width = `${100 / numImages}%`;
				this.style.height = 'auto';
				this.style.objectFit = 'cover';
			}
		});
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