import { fetchData } from "../../lib/fetchData.js";
import { validateArticleForm } from "../../services/formCreationValidate.js";

document.addEventListener("DOMContentLoaded", () => {
  const articleForm = document.querySelector("#article-form");
  const message = document.querySelector("#form-message");
  const previewImage = document.querySelector("#preview-image");
  const apiUrlInput = document.querySelector("#api-url");
  const API_URL = apiUrlInput.value;

  // Prévisualisation de l'image
  if (articleForm.querySelector('[name="image"]')) {
    articleForm
      .querySelector('[name="image"]')
      .addEventListener("change", (e) => {
        const file = e.target.files[0];
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
      // Récupérer le token depuis localStorage
      const token = localStorage.getItem("JWTtoken");
      if (!token) {
        throw new Error("Vous devez être connecté pour créer un article");
      }

      // 1. D'abord envoyer les données textuelles
      const formData = new FormData(articleForm);
      const imageFile = formData.get("image");
      formData.delete("image");

      const tags = formData
        .get("tags")
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag); // Filtrer les tags vides

      // Préparer les données de l'article
      const articleData = {
        title: formData.get("title"),
        introduction: formData.get("introduction"),
        content: formData.get("content"),
        tags: tags,
      };

      // Envoi des données textuelles avec le token
      const response = await fetch(`${API_URL}/articles`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: articleData.title,
          introduction: articleData.introduction,
          content: articleData.content,
          tags: articleData.tags,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de la création");
      }

      const result = await response.json();

      // 2. Si une image est présente, l'envoyer avec le token également
      if (imageFile && imageFile.size > 0) {
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
