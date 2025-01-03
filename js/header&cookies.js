/* header&cookies.js */
// Gestió de cookies
document.addEventListener('DOMContentLoaded', function () {
	// Actualització automàtica de l'any al footer
	const yearElement = document.getElementById('currentYear');
	if (yearElement) {
		yearElement.textContent = new Date().getFullYear();
	}

	// Cookie consent
	if (!getCookie('cookieConsent')) {
		document.getElementById('cookieConsent').style.display = 'block';
	}

	document.getElementById('acceptCookies')?.addEventListener('click', function () {
		setCookie('cookieConsent', 'accepted', 365);
		document.getElementById('cookieConsent').style.display = 'none';
		enableCookieFunctionality();
	});

	document.getElementById('rejectCookies')?.addEventListener('click', function () {
		setCookie('cookieConsent', 'rejected', 365);
		document.getElementById('cookieConsent').style.display = 'none';
	});

	if (getCookie('cookieConsent') === 'accepted') {
		enableCookieFunctionality();
	}

	// Gestió del menú de contacte
	const contactTrigger = document.querySelector('.contact-trigger');
	const contactWrapper = document.querySelector('.contact-wrapper');
	const menuToggle = document.getElementById('menu-toggle');

	contactTrigger?.addEventListener('click', function (e) {
		e.preventDefault();
		e.stopPropagation();
		contactWrapper.classList.toggle('active');
	});

	document.addEventListener('click', function (e) {
		if (contactWrapper && !contactWrapper.contains(e.target)) {
			contactWrapper.classList.remove('active');
		}

		if (window.innerWidth <= 842 && menuToggle && !e.target.closest('.menu') && menuToggle.checked) {
			menuToggle.checked = false;
		}
	});

	document.querySelector('.contact-submenu')?.addEventListener('click', function (e) {
		e.stopPropagation();
	});
});

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

function enableCookieFunctionality() {
	setInterval(() => {
		setCookie('scrollPosition', window.pageYOffset, 1);
	}, 1000);

	const savedPosition = getCookie('scrollPosition');
	if (savedPosition) {
		window.scrollTo(0, parseInt(savedPosition));
	}
}