import { fetchData } from "../../lib/fetchData.js";
import { validateArticleForm } from "../../services/formCreationValidate.js";

document.addEventListener("DOMContentLoaded", () => {
  const articleForm = document.querySelector("#article-form");
  const message = document.querySelector("#form-message");
  const previewImage = document.querySelector("#preview-image");
  // Récupération de l'URL de l'API depuis l'input hidden
  const apiUrlInput = document.querySelector("#api-url");
  const API_URL = apiUrlInput.value;
  // Prévisualisation de l'image
  if (articleForm.querySelector('[name="image"]')) {
    articleForm
      .querySelector('[name="image"]')
      .addEventListener("change", (e) => {
        const file = e.target.files[0];
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

  articleForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Réinitialisation des erreurs
    articleForm
      .querySelectorAll(".error")
      .forEach((span) => (span.textContent = ""));
    articleForm
      .querySelectorAll(".error-input")
      .forEach((input) => input.classList.remove("error-input"));

    // Validation du formulaire
    const { valid, errors } = validateArticleForm(articleForm);
    if (!valid) {
      for (const [field, message] of Object.entries(errors)) {
        const errorSpan = articleForm.querySelector(`[data-error="${field}"]`);
        const input = articleForm.querySelector(`[name="${field}"]`);
        if (errorSpan) errorSpan.textContent = message;
        if (input) {
          input.classList.add("error-input");
        }
      }
      return;
    }

    // Préparation des données
    const formData = new FormData(articleForm);

    // Conversion des tags en tableau
    const tags = formData
      .get("tags")
      .split(",")
      .map((tag) => tag.trim());
    formData.set("tags", JSON.stringify(tags));

    // Vérifier si on est en mode édition
    const urlParams = new URLSearchParams(window.location.search);
    const editMode = urlParams.get("edit");

    const url = editMode
      ? `${API_URL}/articles/${editMode}`
      : `${API_URL}/articles`;

    try {
      const response = await fetch(url, {
        method: editMode ? "PUT" : "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erreur lors de la sauvegarde");

      // Redirection vers l'article
      const data = await response.json();
      window.location.href = `/article/${data.data.id_article}`;
    } catch (error) {
      console.error("Erreur:", error);
      message.textContent = error.message;
      message.style.color = "red";
    }
  });

  // Vérifier si on est en mode édition
  const urlParams = new URLSearchParams(window.location.search);
  const editMode = urlParams.get("edit");

  if (editMode) {
    // Récupérer les données de l'article depuis sessionStorage
    const articleData = JSON.parse(sessionStorage.getItem("articleToEdit"));
    if (articleData) {
      // Remplir le formulaire avec les données existantes
      document.getElementById("title").value = articleData.title;
      document.getElementById("introduction").value = articleData.introduction;
      document.getElementById("content").value = articleData.content;

      // Afficher l'image existante si présente
      if (articleData.cover_image) {
        document.getElementById(
          "preview-image"
        ).src = `${API_IMG_URL}${articleData.cover_image}`;
      }

      // Mettre à jour les tags si présents
      if (articleData.tags) {
        const tags = Array.isArray(articleData.tags)
          ? articleData.tags
          : JSON.parse(articleData.tags);
        // Mettre à jour l'interface des tags
        tags.forEach((tag) => addTag(tag));
      }

      // Modifier le titre de la page et le bouton de soumission
      document.title = "Modifier l'article - InfoD0tGame";
      document.querySelector('button[type="submit"]').textContent =
        "Modifier l'article";
    }

    // Nettoyer sessionStorage après utilisation
    sessionStorage.removeItem("articleToEdit");
  }
});
