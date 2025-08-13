// Language Management System
class LanguageManager {
	constructor() {
		this.currentLang = 'ca-ES';
		this.supportedLanguages = {
			'ca-ES': 'Català',
			'es-ES': 'Español',
			'en-US': 'English',
			'fr-FR': 'Français'
		};
		this.translations = {};
		this.isInitialized = false;
		this.browserLangDetected = false;
	}

	async init() {
		if (this.isInitialized) return;
		
		console.log('🌍 Initializing language system...');
		
		try {
			// Check for saved language preference first
			const savedLang = this.getCookie('preferredLanguage');
			console.log('💾 Saved language from cookie:', savedLang);
			
			if (savedLang && this.supportedLanguages[savedLang]) {
				this.currentLang = savedLang;
				console.log('✅ Using saved language:', savedLang);
			} else {
				console.log('🔍 No saved language, detecting browser language...');
				// Detect browser language and show notification
				this.detectAndPromptBrowserLanguage();
			}
			
			await this.loadTranslations();
			this.createLanguageSwitcher();
			this.translatePage();
			this.isInitialized = true;
			console.log('✨ Language system initialized successfully');
			
		} catch (error) {
			console.error('❌ Language initialization failed:', error);
			// Fallback to Catalan
			this.currentLang = 'ca-ES';
		}
	}

	detectAndPromptBrowserLanguage() {
		const browserLang = navigator.language || navigator.userLanguage;
		let detectedLang = 'ca-ES';
		
		console.log('🌐 Browser language detected:', browserLang);
		
		// Map browser language codes to our supported languages
		const langMap = {
			'ca': 'ca-ES',
			'ca-ES': 'ca-ES',
			'es': 'es-ES',
			'es-ES': 'es-ES',
			'en': 'en-US',
			'en-US': 'en-US',
			'en-GB': 'en-US',
			'fr': 'fr-FR',
			'fr-FR': 'fr-FR'
		};
		
		// Check exact match first
		if (langMap[browserLang]) {
			detectedLang = langMap[browserLang];
		} else {
			// Check language code without region
			const langCode = browserLang.split('-')[0];
			if (langMap[langCode]) {
				detectedLang = langMap[langCode];
			}
		}
		
		console.log('🎯 Detected language mapped to:', detectedLang);
		
		// Show notification regardless of detected language for testing
		// Later we can change this to only show if different from default
		this.currentLang = detectedLang;
		this.browserLangDetected = true;
		console.log('⏰ Scheduling language notification...');
		// Show notification after page loads
		setTimeout(() => this.showLanguageNotification(detectedLang), 1500);
	}

	showLanguageNotification(detectedLang) {
		console.log('🔔 Showing language notification for:', detectedLang);
		
		// Create language notification overlay
		const notification = document.createElement('div');
		notification.id = 'languageNotification';
		notification.className = 'language-notification';
		
		const langName = this.supportedLanguages[detectedLang] || 'català';
		
		notification.innerHTML = `
			<div class="language-notification-content">
				<div class="language-notification-text">
					<span class="lang-icon">🌍</span>
					<span id="langNotificationText">Hem detectat que prefereix el ${langName.toLowerCase()}. Vol continuar amb aquest idioma?</span>
				</div>
				<div class="language-notification-buttons">
					<button id="confirmLang" class="lang-btn lang-btn-primary">
						<span id="confirmLangText">Sí, continuar</span>
					</button>
					<button id="changeLang" class="lang-btn lang-btn-secondary">
						<span id="changeLangText">Canviar idioma</span>
					</button>
				</div>
			</div>
		`;
		
		document.body.appendChild(notification);
		console.log('📝 Language notification added to body');
		
		// Add event listeners
		const confirmBtn = document.getElementById('confirmLang');
		const changeBtn = document.getElementById('changeLang');
		
		if (confirmBtn) {
			confirmBtn.addEventListener('click', () => {
				console.log('✅ User confirmed language:', detectedLang);
				this.setLanguage(detectedLang, true);
				this.hideLanguageNotification();
			});
		}
		
		if (changeBtn) {
			changeBtn.addEventListener('click', () => {
				console.log('🔄 User wants to change language');
				this.showLanguageSwitcher();
				this.hideLanguageNotification();
			});
		}
		
		// Show with animation
		setTimeout(() => {
			notification.classList.add('show');
			console.log('🎭 Language notification animation triggered');
		}, 100);
	}

	hideLanguageNotification() {
		const notification = document.getElementById('languageNotification');
		if (notification) {
			notification.classList.remove('show');
			setTimeout(() => notification.remove(), 300);
		}
	}

	async loadTranslations() {
		console.log('📥 Loading translations for:', this.currentLang);
		
		if (this.translations[this.currentLang]) {
			console.log('✅ Translations already loaded for:', this.currentLang);
			return;
		}
		
		// Determine correct path based on current location
		const isInSubdirectory = window.location.pathname.includes('/apartaments/');
		const translationPath = isInSubdirectory ? '../translations/' : 'translations/';
		console.log('🗂️ Using translation path:', translationPath);
		
		try {
			const response = await fetch(`${translationPath}${this.currentLang}.json`);
			console.log('🌐 Fetch response status:', response.status);
			
			if (!response.ok) throw new Error(`Failed to load ${this.currentLang} (${response.status})`);
			
			this.translations[this.currentLang] = await response.json();
			console.log('✅ Translations loaded successfully for:', this.currentLang);
			console.log('📊 Translation keys:', Object.keys(this.translations[this.currentLang]));
			
		} catch (error) {
			console.error(`❌ Error loading translation ${this.currentLang}:`, error);
			// Fallback to Catalan if available
			if (this.currentLang !== 'ca-ES') {
				console.log('🔄 Falling back to ca-ES...');
				try {
					const fallbackResponse = await fetch(`${translationPath}ca-ES.json`);
					this.translations['ca-ES'] = await fallbackResponse.json();
					this.currentLang = 'ca-ES';
					console.log('✅ Fallback to ca-ES successful');
				} catch (fallbackError) {
					console.error('❌ Fallback to ca-ES also failed:', fallbackError);
				}
			}
		}
	}

	createLanguageSwitcher() {
		console.log('🎛️ Creating language switcher...');
		
		// Find header and mobile menu
		const header = document.querySelector('header');
		const mobileMenu = document.querySelector('.menu-items');
		
		if (!header) {
			console.error('❌ Header not found, cannot create language switcher');
			return;
		}
		
		// Remove existing language switchers if they exist
		const existingSwitchers = document.querySelectorAll('.language-switcher');
		existingSwitchers.forEach(switcher => {
			switcher.remove();
			console.log('🗑️ Removed existing language switcher');
		});
		
		// Create language switcher
		const langSwitcher = document.createElement('div');
		langSwitcher.className = 'language-switcher';
		langSwitcher.innerHTML = `
			<button class="lang-toggle" id="langToggle" aria-label="Seleccionar idioma">
				<span class="lang-current">${this.supportedLanguages[this.currentLang] || 'Català'}</span>
				<span class="lang-arrow">▼</span>
			</button>
			<div class="lang-dropdown" id="langDropdown">
				${Object.entries(this.supportedLanguages).map(([code, name]) => `
					<button class="lang-option ${code === this.currentLang ? 'active' : ''}" 
							data-lang="${code}">${name}</button>
				`).join('')}
			</div>
		`;
		
		// Create desktop version (insert before social buttons)
		const socialButtons = header.querySelector('.social-buttons');
		if (socialButtons) {
			header.insertBefore(langSwitcher, socialButtons);
			console.log('📍 Desktop language switcher inserted before social buttons');
		} else {
			header.appendChild(langSwitcher);
			console.log('📍 Desktop language switcher appended to header');
		}
		
		// Create mobile version (add to mobile menu)
		if (mobileMenu) {
			const mobileLangSwitcher = langSwitcher.cloneNode(true);
			mobileLangSwitcher.classList.add('mobile-lang-switcher');
			mobileMenu.appendChild(mobileLangSwitcher);
			console.log('📍 Mobile language switcher added to menu');
		}
		
		// Add event listeners
		this.setupLanguageSwitcherEvents();
		console.log('✅ Language switcher created successfully');
	}

	setupLanguageSwitcherEvents() {
		// Setup events for all language switchers (desktop and mobile)
		const toggles = document.querySelectorAll('.lang-toggle');
		const dropdowns = document.querySelectorAll('.lang-dropdown');
		
		console.log('🎛️ Setting up language switcher events...');
		console.log('Found toggles:', toggles.length);
		console.log('Found dropdowns:', dropdowns.length);
		
		if (toggles.length === 0 || dropdowns.length === 0) {
			console.error('❌ Toggle or dropdown elements not found');
			return;
		}
		
		// Toggle dropdown for each switcher
		toggles.forEach((toggle, index) => {
			const dropdown = dropdowns[index];
			if (!dropdown) return;
			
			toggle.addEventListener('click', (e) => {
				e.stopPropagation();
				
				// Close all other dropdowns
				dropdowns.forEach((otherDropdown, otherIndex) => {
					if (otherIndex !== index) {
						otherDropdown.classList.remove('show');
					}
				});
				
				// Toggle current dropdown
				dropdown.classList.toggle('show');
				console.log('🔽 Dropdown toggled, show class:', dropdown.classList.contains('show'));
			});
		});
		
		// Language selection for all switchers
		dropdowns.forEach(dropdown => {
			dropdown.addEventListener('click', (e) => {
				console.log('🖱️ Dropdown clicked, target:', e.target);
				if (e.target.classList.contains('lang-option')) {
					const selectedLang = e.target.dataset.lang;
					console.log('🌍 Language selected:', selectedLang);
					this.setLanguage(selectedLang, true);
					
					// Close all dropdowns
					dropdowns.forEach(dd => dd.classList.remove('show'));
				}
			});
		});
		
		// Close dropdown when clicking outside
		document.addEventListener('click', (e) => {
			const isInsideSwitcher = Array.from(document.querySelectorAll('.language-switcher')).some(switcher => 
				switcher.contains(e.target)
			);
			
			if (!isInsideSwitcher) {
				dropdowns.forEach(dropdown => dropdown.classList.remove('show'));
			}
		});
		
		console.log('✅ Language switcher events set up successfully');
	}

	showLanguageSwitcher() {
		const dropdown = document.getElementById('langDropdown');
		if (dropdown) {
			dropdown.classList.add('show');
		}
	}

	async setLanguage(langCode, saveToCookie = false) {
		console.log('🔄 Setting language to:', langCode, 'Save cookie:', saveToCookie);
		
		if (!this.supportedLanguages[langCode]) {
			console.error(`❌ Unsupported language: ${langCode}`);
			return;
		}
		
		this.currentLang = langCode;
		
		// Save to cookie if requested
		if (saveToCookie) {
			this.setCookie('preferredLanguage', langCode, 365);
			console.log('🍪 Language preference saved to cookie');
		}
		
		// Load translations and update page
		await this.loadTranslations();
		this.translatePage();
		this.updateLanguageSwitcher();
		this.updatePageMeta();
		console.log('✅ Language set successfully to:', langCode);
	}

	translatePage() {
		const translations = this.translations[this.currentLang];
		if (!translations) return;
		
		// Translate elements with data-translate attributes
		document.querySelectorAll('[data-translate]').forEach(element => {
			const key = element.getAttribute('data-translate');
			const translation = this.getNestedTranslation(translations, key);
			
			if (translation) {
				if (element.tagName === 'INPUT' && element.type === 'button') {
					element.value = translation;
				} else if (element.tagName === 'TITLE') {
					element.textContent = translation;
				} else {
					element.textContent = translation;
				}
			}
		});
		
		// Translate content attributes (for meta tags)
		document.querySelectorAll('[data-translate-content]').forEach(element => {
			const key = element.getAttribute('data-translate-content');
			const translation = this.getNestedTranslation(translations, key);
			
			if (translation) {
				element.setAttribute('content', translation);
			}
		});
		
		// Translate aria-label attributes
		document.querySelectorAll('[data-translate-aria]').forEach(element => {
			const key = element.getAttribute('data-translate-aria');
			const translation = this.getNestedTranslation(translations, key);
			
			if (translation) {
				element.setAttribute('aria-label', translation);
			}
		});
		
		// Translate placeholders
		document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
			const key = element.getAttribute('data-translate-placeholder');
			const translation = this.getNestedTranslation(translations, key);
			
			if (translation) {
				element.setAttribute('placeholder', translation);
			}
		});
		
		// Translate alt attributes
		document.querySelectorAll('[data-translate-alt]').forEach(element => {
			const key = element.getAttribute('data-translate-alt');
			const translation = this.getNestedTranslation(translations, key);
			
			if (translation) {
				element.setAttribute('alt', translation);
			}
		});
	}

	getNestedTranslation(obj, path) {
		return path.split('.').reduce((current, key) => {
			return current && current[key] !== undefined ? current[key] : null;
		}, obj);
	}

	updateLanguageSwitcher() {
		const currentSpan = document.querySelector('.lang-current');
		const options = document.querySelectorAll('.lang-option');
		
		if (currentSpan) {
			currentSpan.textContent = this.supportedLanguages[this.currentLang];
		}
		
		options.forEach(option => {
			option.classList.toggle('active', option.dataset.lang === this.currentLang);
		});
	}

	updatePageMeta() {
		const translations = this.translations[this.currentLang];
		if (!translations || !translations.meta) return;
		
		// Update title
		const titleElement = document.querySelector('title');
		if (titleElement && translations.meta.title) {
			titleElement.textContent = translations.meta.title;
		}
		
		// Update meta description
		const descMeta = document.querySelector('meta[name="description"]');
		if (descMeta && translations.meta.description) {
			descMeta.setAttribute('content', translations.meta.description);
		}
		
		// Update meta keywords
		const keywordsMeta = document.querySelector('meta[name="keywords"]');
		if (keywordsMeta && translations.meta.keywords) {
			keywordsMeta.setAttribute('content', translations.meta.keywords);
		}
		
		// Update html lang attribute
		document.documentElement.setAttribute('lang', this.currentLang.split('-')[0]);
	}

	// Cookie utility methods (reusing from existing system)
	setCookie(name, value, days) {
		const date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Strict`;
	}

	getCookie(name) {
		const cookies = document.cookie.split(';');
		for (let cookie of cookies) {
			const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
			if (cookieName === name) return cookieValue;
		}
		return null;
	}

	// Public API methods
	getCurrentLanguage() {
		return this.currentLang;
	}

	getSupportedLanguages() {
		return this.supportedLanguages;
	}
}

// Global language manager instance
window.languageManager = new LanguageManager();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
	window.languageManager.init();
});