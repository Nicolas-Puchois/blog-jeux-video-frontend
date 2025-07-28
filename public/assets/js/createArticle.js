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

    try {
      // Construction d'un objet avec les données pour la requête
      const articleData = {};
      articleData.title = formData.get("title");
      articleData.content = formData.get("content");
      articleData.introduction = formData.get("introduction") || "";
      articleData.tags = formData.get("tags");

      console.log("Données de l'article à envoyer:", articleData);
      console.log("Envoi de l'article vers:", `${API_URL}/articles`);

      const result = await fetchData({
        route: "/articles",
        api: API_URL,
        options: {
          method: "POST",
          body: JSON.stringify(articleData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("JWTtoken")}`,
          },
        },
      });

      if (!result.success) {
        throw new Error(
          result.error || "Erreur lors de la création de l'article"
        );
      }

      // Si une image a été sélectionnée, on l'envoie dans une seconde requête
      const imageFile = formData.get("image");
      if (imageFile && imageFile.size > 0) {
        const imageData = new FormData();
        imageData.append("image", imageFile);

        console.log(
          "Envoi de l'image vers:",
          `${API_URL}/articles/${result.articleId}/image`
        );

        const imageResult = await fetchData({
          route: `/articles/${result.articleId}/image`,
          api: API_URL,
          options: {
            method: "POST",
            body: imageData,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("JWTtoken")}`,
            },
          },
        });

        if (!imageResult.success) {
          console.error(
            "Erreur lors de l'upload de l'image:",
            imageResult.error
          );
          message.textContent =
            "Article créé avec succès, mais erreur lors de l'upload de l'image";
          message.style.color = "orange";
          return;
        }
      }

      // Affichage du succès
      message.textContent = "Article créé avec succès !";
      message.style.color = "green";

      // Redirection vers la page des articles après 2 secondes
      setTimeout(() => {
        window.location.href = "/articles";
      }, 2000);
    } catch (error) {
      console.error("Erreur:", error);
      message.textContent = error.message;
      message.style.color = "red";
    }
  });
});
