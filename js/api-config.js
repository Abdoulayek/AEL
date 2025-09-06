// Configuration pour récupérer la clé API Brevo depuis Netlify
const config = {
  BREVO_API_KEY: null,
  
  // Fonction pour initialiser la configuration
  async init() {
    // En environnement de développement, utiliser une clé par défaut
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      // Utiliser une clé locale pour le développement
      this.BREVO_API_KEY = localStorage.getItem('BREVO_API_KEY') || '';
      return;
    }
    
    // En production (Netlify), récupérer la clé depuis la fonction Netlify
    try {
      const response = await fetch('/.netlify/functions/get-api-key');
      const data = await response.json();
      this.BREVO_API_KEY = data.apiKey;
    } catch (error) {
      console.error('Erreur lors de la récupération de la clé API:', error);
    }
  }
};
