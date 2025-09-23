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
      // Validation du formulaire
      const { valid, errors } = validateArticleForm(articleForm);

      // Effacer les messages d'erreur précédents
      articleForm
        .querySelectorAll(".error")
        .forEach((error) => (error.textContent = ""));

      // Si le formulaire n'est pas valide, afficher les erreurs
      if (!valid) {
        Object.keys(errors).forEach((field) => {
          const errorSpan = articleForm.querySelector(
            `[data-error="${field}"]`
          );
          if (errorSpan) {
            errorSpan.textContent = errors[field];
            errorSpan.style.color = "red";
          }
        });
        return; // Arrêter l'envoi si le formulaire n'est pas valide
      }

      const token = localStorage.getItem("JWTtoken");
      const csrfToken = document.querySelector(
        'input[name="csrf_token"]'
      ).value;

      // Récupérer toutes les données du formulaire
      const formData = new FormData(articleForm);
      const jsonData = {
        title: formData.get("title"),
        content: formData.get("content"),
        introduction: formData.get("introduction"),
        tags: formData
          .get("tags")
          .split(",")
          .map((tag) => tag.trim()), // Convertir la chaîne de tags en tableau
      };

      console.log("Données envoyées:", jsonData); // Debug

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
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la création de l'article"
        );
      }

      const result = await response.json();

      // Upload de l'image si présente
      if (imageFile) {
        await uploadImage(result.data.id_article, imageFile);
      }

      // Redirection vers l'article créé
      window.location.href = `/article/${result.data.id_article}`;
    } catch (error) {
      console.error("Erreur:", error);
      message.textContent = error.message;
      message.style.color = "red";
    }
  });

  async function uploadImage(articleId, imageFile) {
    const token = localStorage.getItem("JWTtoken");
    const csrfToken = document.querySelector('input[name="csrf_token"]').value;

    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(`${API_URL}/articles/${articleId}/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-CSRF-Token": csrfToken,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'upload de l'image");
    }

    return response.json();
  }
});
