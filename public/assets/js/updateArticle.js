import { validateArticleForm } from "../../services/formCreationValidate.js";

document.addEventListener("DOMContentLoaded", () => {
  const articleForm = document.querySelector("#article-form");
  const message = document.querySelector("#form-message");
  const previewImage = document.querySelector("#preview-image");
  const apiUrlInput = document.querySelector("#api-url");
  const apiImgUrlInput = document.querySelector("#api-img-url");
  const API_URL = apiUrlInput.value;
  const API_IMG_URL = apiImgUrlInput.value;

  // Charger les données de l'article depuis sessionStorage
  const articleData = JSON.parse(sessionStorage.getItem("articleToEdit"));

  if (articleData) {
    // Remplir le formulaire avec les données existantes
    document.getElementById("title").value = articleData.title;
    document.getElementById("introduction").value = articleData.introduction;
    document.getElementById("content").value = articleData.content;

    // Afficher l'image existante
    if (articleData.cover_image) {
      previewImage.src = `${API_IMG_URL}${articleData.cover_image}`;
      previewImage.style.display = "block";
    }

    // Remplir les tags
    if (articleData.tags) {
      const tagsInput = document.getElementById("tags");
      const tags = Array.isArray(articleData.tags)
        ? articleData.tags
        : JSON.parse(articleData.tags);
      tagsInput.value = tags.join(", ");
    }

    // Mettre à jour le titre du formulaire
    document.querySelector(".form-title").textContent = "Modifier l'article";
    document.querySelector('button[type="submit"]').textContent =
      "Mettre à jour";
  }

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

  // Gestion de la soumission du formulaire
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
        if (input) input.classList.add("error-input");
      }
      return;
    }

    try {
      // 1. D'abord envoyer les données textuelles
      const formData = new FormData(articleForm);
      const imageFile = formData.get("image");
      formData.delete("image"); // Retirer l'image des données

      // Conversion des tags
      const tags = formData
        .get("tags")
        .split(",")
        .map((tag) => tag.trim());
      formData.set("tags", JSON.stringify(tags));

      // Récupérer le token depuis localStorage avec la bonne clé
      const token = localStorage.getItem("JWTtoken"); // Changé de "token" à "JWTtoken"
      if (!token) {
        throw new Error("Vous devez être connecté pour modifier un article");
      }

      const response = await fetch(
        `${API_URL}/articles/${articleData.id_article}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Spécifier le type de contenu JSON
          },
          body: JSON.stringify({
            // Convertir l'objet en chaîne JSON
            title: formData.get("title"),
            introduction: formData.get("introduction"),
            content: formData.get("content"),
            tags: tags,
          }),
        }
      );

      if (!response.ok) throw new Error("Erreur lors de la mise à jour");
      const result = await response.json();

      // 2. Si une image est présente, l'envoyer dans une deuxième requête
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

      // Redirection et nettoyage
      window.location.href = `/article/${result.data.id_article}`;
      sessionStorage.removeItem("articleToEdit");
    } catch (error) {
      console.error("Erreur:", error);
      message.textContent = error.message;
      message.style.color = "red";
    }
  });
});
