import { fetchData } from "../../lib/fetchData.js";

const validateArticleForm = (form) => {
  const errors = {};

  // Validation du titre
  const title = form.querySelector('[name="title"]').value.trim();
  if (!title) {
    errors.title = "Le titre est requis";
  } else if (title.length < 5) {
    errors.title = "Le titre doit contenir au moins 5 caractères";
  }

  // Validation du contenu
  const content = form.querySelector('[name="content"]').value.trim();
  if (!content) {
    errors.content = "Le contenu est requis";
  } else if (content.length < 100) {
    errors.content = "Le contenu doit contenir au moins 100 caractères";
  }

  // Validation des tags
  const tags = form.querySelector('[name="tags"]').value.trim();
  if (!tags) {
    errors.tags = "Au moins un tag est requis";
  }

  // Validation de l'image
  const image = form.querySelector('[name="image"]').files[0];
  if (!image) {
    errors.image = "Une image est requise";
  } else {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(image.type)) {
      errors.image = "Le format d'image doit être JPEG, PNG ou WEBP";
    }
    if (image.size > 5 * 1024 * 1024) {
      // 5MB
      errors.image = "L'image ne doit pas dépasser 5MB";
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

document.addEventListener("DOMContentLoaded", () => {
  const articleForm = document.querySelector("#article-form");
  const message = document.querySelector("#form-message");
  const previewImage = document.querySelector("#preview-image");

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
    const API_URL = document.querySelector("#api-url").value;

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
      const result = await fetchData({
        route: "/articles",
        api: API_URL,
        options: {
          method: "POST",
          body: formData, // Envoi direct du FormData pour gérer le fichier
          headers: {
            // Ne pas définir Content-Type pour FormData
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // Redirection vers la page de l'article créé
      window.location.href = `/article/${result.articleId}`;
    } catch (error) {
      message.textContent = error.message;
      message.style.color = "red";
    }
  });
});
