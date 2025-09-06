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
    
    // Fonction d'envoi d'email via webhook n8n
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
        
        // Préparer les données pour le webhook
        const formData = {
            subject: subject,
            content: content,
            email: senderEmail,
            firstname: senderName.split(' ')[0] || '',
            lastname: senderName.split(' ')[1] || '',
            formType: formType
        };
        
        // Envoyer au webhook n8n
        fetch('https://dataventuren8n.acserveur.com/webhook-test/ael-contact-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau');
            }
            return response.json();
        })
        .then(data => {
            // Vérifier si la réponse contient messageId (succès)
            if (data && data[0] && data[0].messageId) {
                // Afficher un message de succès
                formElement.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <h3>Message envoyé avec succès!</h3>
                        <p>Nous vous répondrons dans les plus brefs délais.</p>
                    </div>
                `;
                console.log('Email envoyé avec succès:', data);
            } else {
                throw new Error('Réponse invalide du serveur');
            }
        })
        .catch(error => {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            alert('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.');
        });
    }
});