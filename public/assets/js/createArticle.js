import { fetchData } from "../../lib/fetchData.js";
import { validateArticleForm } from "../../services/formCreationValidate.js";

document.addEventListener("DOMContentLoaded", () => {
  const articleForm = document.querySelector("#article-form");
  const message = document.querySelector("#form-message");
  const previewImage = document.querySelector("#preview-image");
  const apiUrlInput = document.querySelector("#api-url");
  const API_URL = apiUrlInput.value;
  let imageFile = null;
  // Gérer l'affichage des boutons
  document.getElementById("create-button").style.display = "block";
  document.getElementById("update-button").style.display = "none";

  document.querySelector(".form-title").textContent = "Créer un article";

  // Prévisualisation de l'image
  if (articleForm.querySelector('[name="image"]')) {
    articleForm
      .querySelector('[name="image"]')
      .addEventListener("change", (e) => {
        const file = e.target.files[0];
        imageFile = file; // Stocker le fichier sélectionné
        // Vérifier la taille du fichier (10MB max)
        const maxSize = 10 * 1024 * 1024; // 10MB en octets
        if (file.size > maxSize) {
          message.textContent = "L'image ne doit pas dépasser 10MB";
          message.style.color = "red";
          e.target.value = ""; // Réinitialiser l'input
          previewImage.src = "";
          previewImage.style.display = "none";
          return;
        }

        if (file && previewImage) {
          const reader = new FileReader();
          reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewImage.style.display = "block";
          };
          reader.readAsDataURL(file);
        }
      });
  }

  // Gestion de la soumission du formulaire
  articleForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("JWTtoken");
      const csrfToken = document.querySelector(
        'input[name="csrf_token"]'
      ).value;

      console.log("CSRF Token:", csrfToken); // Debug

      const formData = new FormData(articleForm);
      const jsonData = {};
      formData.forEach((value, key) => {
        if (key !== "image") {
          jsonData[key] = value;
        }
      });

      // Envoi des données de l'article
      const response = await fetch(`${API_URL}/articles`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'article");
      }

      const result = await response.json();

      // Si une image est présente, l'envoyer dans une requête séparée
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);

        const imageResponse = await fetch(
          `${API_URL}/articles/${result.data.id_article}/image`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: imageFormData,
          }
        );

        if (!imageResponse.ok) {
          throw new Error("Erreur lors de l'upload de l'image");
        }
      }

      // Redirection vers l'article créé
      window.location.href = `/article/${result.data.id_article}`;
    } catch (error) {
      console.error("Erreur:", error);
      message.textContent = error.message;
      message.style.color = "red";
    }
  });
});
