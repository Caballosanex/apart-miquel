// Definició de variables globals per evitar múltiples querySelectorAll
let contactWrapper, contactTrigger, menuToggle;

// Funció principal que s'executa quan el DOM està carregat
document.addEventListener('DOMContentLoaded', function () {
	initializeYearUpdate();
	initializeCookieConsent();
	initializeContactMenu();
	initializeMenuHandling();
});

// Actualització de l'any
function initializeYearUpdate() {
	const yearElement = document.getElementById('currentYear');
	if (yearElement) {
		yearElement.textContent = new Date().getFullYear();
	}
}

// Gestió de cookies
function initializeCookieConsent() {
	const cookieConsent = document.getElementById('cookieConsent');

	// Prevenir CLS mantenint l'espai però ocultant visualment
	cookieConsent.style.visibility = 'hidden';
	cookieConsent.style.display = 'block';

	if (!getCookie('cookieConsent')) {
		// Usar requestAnimationFrame per assegurar que el DOM està preparat
		requestAnimationFrame(() => {
			cookieConsent.style.visibility = 'visible';
		});
	} else {
		cookieConsent.style.display = 'none';
		if (getCookie('cookieConsent') === 'accepted') {
			enableCookieFunctionality();
		}
	}

	// Event listeners per als botons de cookies
	const acceptButton = document.getElementById('acceptCookies');
	const rejectButton = document.getElementById('rejectCookies');

	if (acceptButton) {
		acceptButton.addEventListener('click', () => {
			setCookie('cookieConsent', 'accepted', 365);
			cookieConsent.style.display = 'none';
			enableCookieFunctionality();
		});
	}

	if (rejectButton) {
		rejectButton.addEventListener('click', () => {
			setCookie('cookieConsent', 'rejected', 365);
			cookieConsent.style.display = 'none';
		});
	}
}

// Gestió del menú de contacte
function initializeContactMenu() {
	contactWrapper = document.querySelector('.contact-wrapper');
	contactTrigger = document.querySelector('.contact-trigger');

	if (contactTrigger) {
		contactTrigger.addEventListener('click', handleContactTriggerClick);
	}

	// Event listener per tancar el menú quan es fa clic fora
	document.addEventListener('click', handleDocumentClick);

	// Prevenir la propagació en el submenú
	const contactSubmenu = document.querySelector('.contact-submenu');
	if (contactSubmenu) {
		contactSubmenu.addEventListener('click', e => e.stopPropagation());
	}
}

// Gestió del menú mòbil
function initializeMenuHandling() {
	menuToggle = document.getElementById('menu-toggle');

	document.addEventListener('click', (e) => {
		if (window.innerWidth <= 842 &&
			menuToggle &&
			!e.target.closest('.menu') &&
			menuToggle.checked) {
			menuToggle.checked = false;
		}
	});
}

// Funcions d'utilitat per events
function handleContactTriggerClick(e) {
	e.preventDefault();
	e.stopPropagation();
	contactWrapper?.classList.toggle('active');
}

function handleDocumentClick(e) {
	if (contactWrapper && !contactWrapper.contains(e.target)) {
		contactWrapper.classList.remove('active');
	}
}
// Funcions d'utilitat per a les cookies
function setCookie(name, value, days) {
	const date = new Date();
	date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Strict`;
}

function getCookie(name) {
	const cookies = document.cookie.split(';');
	for (let cookie of cookies) {
		const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
		if (cookieName === name) return cookieValue;
	}
	return null;
}

// Funcionalitat de cookies
function enableCookieFunctionality() {
	let scrollTimer;

	// Utilitzem un temporitzador per evitar massa escriptures de cookies
	window.addEventListener('scroll', () => {
		clearTimeout(scrollTimer);
		scrollTimer = setTimeout(() => {
			setCookie('scrollPosition', window.scrollY, 1);
		}, 300);
	});

	// Restaurar la posició del scroll si existeix
	const savedPosition = getCookie('scrollPosition');
	if (savedPosition) {
		requestAnimationFrame(() => {
			window.scrollTo(0, parseInt(savedPosition));
		});
	}
}
