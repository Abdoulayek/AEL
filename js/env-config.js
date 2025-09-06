// Configuration pour les API keys et autres variables sensibles
// Ce fichier est conçu pour fonctionner avec les variables d'environnement de Netlify
const config = {
    // En production (sur Netlify), utilise la variable d'environnement
    // En développement local, utilise la valeur par défaut
    BREVO_API_KEY: typeof process !== 'undefined' && process.env.BREVO_API_KEY 
        ? process.env.BREVO_API_KEY 
        : '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'
};
