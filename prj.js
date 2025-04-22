document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const fileNameDisplay = document.getElementById("file-name-display");
    const choixLangueBtn = document.getElementById("choix-langue");
    const langOptions = document.getElementById("lang-options");
    const translateBtn = document.getElementById("traduction");
    const resultatDiv = document.getElementById("resultat");

    // Correspondance entre affichage et code langue
    const languageMap = {
        "Français": "fr",
        "Anglais": "en",
        "Allemand": "de",
        "Espagnol": "es",
        "Italien": "it",
        "Chinois": "zh",
        "Arabe": "ar"
    };

    let selectedLanguage = "";
    let uploadedFile = null;

    // Gestion de l'upload du fichier
    fileInput.addEventListener("change", (event) => {
        uploadedFile = event.target.files[0];
        if (uploadedFile) {
            // Affiche le nom dans deux endroits : le bouton et sous le bouton
            fileNameDisplay.textContent = `📂 Fichier sélectionné : ${uploadedFile.name}`;
            resultatDiv.innerHTML = `<p>📂 Fichier sélectionné : <strong>${uploadedFile.name}</strong></p>`;
        }
    });

    // Toggle du menu des langues avec animation
    choixLangueBtn.addEventListener("click", () => {
        langOptions.style.display = langOptions.style.display === "block" ? "none" : "block";
        langOptions.classList.toggle("fade-in");
    });

    // Sélection de la langue
    document.querySelectorAll(".lang-btn").forEach(button => {
        button.addEventListener("click", () => {
            selectedLanguage = button.getAttribute("data-lang"); // Utilise le data-lang
            choixLangueBtn.innerHTML = `🌍 ${button.textContent.trim()}`;
            langOptions.style.display = "none";
            console.log("Langue sélectionnée :", selectedLanguage); // Debug
        });
    });

    // Fonction pour envoyer le fichier et récupérer la traduction
    async function uploadFileForTranslation() {
        if (!uploadedFile) {
            showMessage("⚠️ Aucun fichier sélectionné.", "error");
            return;
        }
        if (!selectedLanguage) {
            showMessage("⚠️ Veuillez choisir une langue.", "error");
            return;
        }

        const formData = new FormData();
        formData.append("file", uploadedFile);
        formData.append("language", selectedLanguage);

        console.log("Données envoyées :", [...formData.entries()]);

        try {
            showMessage("⏳ Traduction en cours...", "loading");

            const response = await fetch("http://127.0.0.1:8000/translate", {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            console.log("Réponse de l'API :", data);

            if (data.error) {
                showMessage(`❌ Erreur : ${data.error}`, "error");
            } else {
                showMessage(`<h3>🌍 Traduction :</h3><p>${data.translation.replace(/\n/g, "<br>")}</p>`, "success");
            }
        } catch (error) {
            showMessage(`❌ Erreur : ${error.message}`, "error");
        }
    }

    // Bouton traduction
    translateBtn.addEventListener("click", uploadFileForTranslation);

    // Fonction pour afficher les messages stylisés
    function showMessage(message, type) {
        resultatDiv.innerHTML = `<div class="message ${type}">${message}</div>`;
    }
});
