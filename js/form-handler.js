// Script pour gérer les envois de formulaires via l'API Brevo
document.addEventListener('DOMContentLoaded', function() {
    // Formulaire de contact
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Débogage - vérifier si le formulaire est trouvé
            console.log('Formulaire soumis', contactForm);
            
            // Récupération des valeurs en utilisant FormData
            const formData = new FormData(contactForm);
            
            // Récupérer les valeurs
            const company = formData.get('company');
            const lastname = formData.get('lastname');
            const firstname = formData.get('firstname');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const service = formData.get('service');
            const quantity = formData.get('quantity');
            const message = formData.get('message');
            
            // Débogage - vérifier les valeurs récupérées
            console.log('Valeurs (contact): ', {
                company, lastname, firstname, email, phone, service, quantity, message
            });
            
            // Préparation du corps de l'email
            const emailBody = `
                Nouveau message de contact:
                
                Entreprise: ${company}
                Nom: ${lastname}
                Prénom: ${firstname}
                Email: ${email}
                Téléphone: ${phone}
                Service concerné: ${service}
                Quantité: ${quantity}
                
                Message:
                ${message}
            `;
            
            // Envoi via l'API Brevo
            sendEmail(
                'Nouveau message de contact AEL',
                emailBody,
                email,
                `${firstname} ${lastname}`,
                'contact'
            );
        });
    }
    
    // Formulaire de candidature
    const careerForm = document.getElementById('career-form');
    if (careerForm) {
        careerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupération des données du formulaire en utilisant FormData
            const formData = new FormData(careerForm);
            
            // Récupérer les valeurs
            const lastname = formData.get('nom') || '';
            const firstname = formData.get('prenom') || '';
            const email = formData.get('email') || '';
            const phone = formData.get('telephone') || '';
            const position = formData.get('poste') || '';
            const message = formData.get('message') || '';
            
            // Préparation du corps de l'email
            const emailBody = `
                Nouvelle candidature:
                
                Nom: ${lastname}
                Prénom: ${firstname}
                Email: ${email}
                Téléphone: ${phone}
                Poste souhaité: ${position}
                
                Lettre de motivation:
                ${message}
                
                Note: Le CV est joint au formulaire mais ne peut pas être envoyé via cette API.
                Veuillez demander au candidat de l'envoyer directement par email.
            `;
            
            // Envoi via l'API Brevo
            sendEmail(
                'Nouvelle candidature AEL',
                emailBody,
                email,
                `${firstname} ${lastname}`,
                'candidature'
            );
        });
    }
    
    // Fonction d'envoi d'email via Brevo
    function sendEmail(subject, content, senderEmail, senderName, formType) {
        // S'assurer que senderName et senderEmail sont définis
        senderName = senderName || 'Contact AEL';
        senderEmail = senderEmail || 'contact@ael-ci.com';
        // Afficher un message de chargement
        const formElement = formType === 'contact' ? contactForm : careerForm;
        const submitBtn = formElement.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Envoi en cours...';
        submitBtn.disabled = true;
        
        // Configuration de la requête
        const url = 'https://api.brevo.com/v3/smtp/email';
        const apiKey = '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';
        
        // Format de requête simplifié sans template
        const data = {
            sender: {
                name: 'Site Web AEL',
                email: 'contact@ael-ci.com'
            },
            to: [
                {
                    email: 'abdoulayekante863@gmail.com',
                    name: 'AEL Contact'
                }
            ],
            subject: subject,
            htmlContent: `<!DOCTYPE html><html><body>${content.replace(/\n/g, '<br>')}</body></html>`,
            textContent: content,
            replyTo: {
                email: senderEmail,
                name: senderName
            }
            // Suppression de templateId et autres paramètres qui causent des erreurs
        };
        
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau');
            }
            return response.json();
        })
        .then(data => {
            // Afficher un message de succès
            formElement.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <h3>Message envoyé avec succès!</h3>
                    <p>Nous vous répondrons dans les plus brefs délais.</p>
                </div>
            `;
            console.log('Email envoyé avec succès:', data);
        })
        .catch(error => {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            alert('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.');
        });
    }
});