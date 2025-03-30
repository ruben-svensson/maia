import { browser } from '$app/environment';
// Define supported languages
export type Language = 'en' | 'sv';

// Translation type definitions
export type TranslationDict = {
    [key: string]: string | TranslationDict;
};

export type Translations = {
    [key in Language]: TranslationDict;
};

// Default translations
const translations: Translations = {
    en: {
        app: {
            title: 'Maia Learning Assistant',
            subtitle: 'Learn step by step',
            lgm: {
                open: 'Explore Learning Lines',
            }
        },
        lgm: {
            title: 'Learn Graph Map',
            description: 'Explore all learning lines. Completed topics are marked with ✓.',
            status: {
                completed: 'Completed',
                locked: 'Locked',
                available: 'Available'
            },
            prereq: 'Prerequisites:',
            close: 'Close',
            noItems: 'No learning topics available yet.'
        },
        learnLines: {
            startPrompt: 'Pick a learning line to start learning!',
            completed: 'Completed',
            locked: 'Locked'
        },
        conversation: {
            inputPlaceholder: 'Type your message...',
            send: 'Send',
            continue: 'Continue',
            greeting: 'Hello! How can I help you today?'
        }
    },
    sv: {
        app: {
            title: 'Maia Lärande-assistent',
            subtitle: 'Lär steg för steg',
            lgm: {
                open: 'Utforska lärolinjer',
            }
        },
        lgm: {
            title: 'Lärolinjeutforskare',
            description: 'Utforska alla lärolinjer. Avklarade ämnen är markerade med ✓.',
            status: {
                completed: 'Avklarad',
                locked: 'Låst',
                available: 'Tillgänglig'
            },
            prereq: 'Förkunskaper:',
            close: 'Stäng',
            noItems: 'Inga läroämnen är tillgängliga än.'
        },
        navigation: {
            learnMap: 'Ämnesöversikt',
            settings: 'Inställningar'
        },
        learnLines: {
            startPrompt: 'Välj en lärolinje för att börja lära dig!',
            completed: 'Avslutad',
            locked: 'Låst'
        },
        conversation: {
            inputPlaceholder: 'Skriv ditt meddelande...',
            send: 'Skicka',
            continue: 'Fortsätt',
            greeting: 'Hej! Hur kan jag hjälpa dig idag?'
        }
    }
};

// Initialize with browser language or default to English
function getBrowserLanguage(): Language {
    if (browser) {
        const browserLang = navigator.language.split('-')[0];
        if (browserLang === 'sv') return 'sv';
    }
    return 'en';
}

// Create state variables outside the object
let currentLanguage = $state<Language>(getBrowserLanguage());
const translationsStore = $state<Translations>(translations);

// Create and export the i18n object
export const i18n = {
    // Getter for current language
    get currentLanguage() {
        return currentLanguage;
    },
    
    // Getter for translations
    get translations() {
        return translationsStore;
    },
    
    // Switch language
    setLanguage(lang: Language) {
        currentLanguage = lang;
        
        // Save preference
        if (browser) {
            localStorage.setItem('preferredLanguage', lang);
        }
    },
    
    // Get translation
    t(key: string, params: Record<string, string> = {}): string {
        const keys = key.split('.');
        let result: TranslationDict | string = translationsStore[currentLanguage];
        
        // Navigate through nested keys
        for (const k of keys) {
            if (typeof result === 'string') {
                console.warn(`Cannot access ${k} on string value`);
                return key;
            }
            if (result[k] === undefined) {
                console.warn(`Translation missing: ${key}`);
                return key; // Return key as fallback
            }
            result = result[k];
        }
        
        // Return the string value
        if (typeof result === 'string') {
            // Replace parameters
            return result.replace(/\{(\w+)\}/g, (_, paramKey) => {
                return params[paramKey] || `{${paramKey}}`;
            });
        }
        
        console.warn(`Invalid translation key: ${key}`);
        return key;
    },
    
    // Load translations from external source (API, JSON file, etc.)
    async loadTranslations() {
        if (browser) {
            try {
                // Example: fetch from a JSON file
                // const response = await fetch(`/translations/${currentLanguage}.json`);
                // const newTranslations = await response.json();
                // translationsStore[currentLanguage] = {
                //    ...translationsStore[currentLanguage],
                //    ...newTranslations
                // };
            } catch (error) {
                console.error('Failed to load translations:', error);
            }
        }
    },
    
    // Initialize the i18n system
    initialize() {
        if (browser) {
            // Check for saved language preference
            const savedLang = localStorage.getItem('preferredLanguage') as Language;
            if (savedLang && (savedLang === 'en' || savedLang === 'sv')) {
                currentLanguage = savedLang;
            }
            
            // You could load additional translations here
            this.loadTranslations();
        }
    }
};

// Auto-initialize
i18n.initialize();