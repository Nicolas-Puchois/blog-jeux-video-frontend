import { validateArticleForm } from "../../services/formCreationValidate.js";

document.addEventListener("DOMContentLoaded", () => {
  const articleForm = document.querySelector("#article-form");
  const message = document.querySelector("#form-message");
  const previewImage = document.querySelector("#preview-image");

  // Vérification de la présence des éléments nécessaires
  const apiUrlInput = document.querySelector("#api-url");
  const apiImgUrlInput = document.querySelector("#api-img-url");

  if (!apiUrlInput || !apiImgUrlInput) {
    console.error("Éléments d'API manquants");
    return;
  }

  const API_URL = apiUrlInput.value;
  const API_IMG_URL = apiImgUrlInput.value;

  // Charger les données de l'article depuis sessionStorage
  const articleData = JSON.parse(sessionStorage.getItem("articleToEdit"));

  if (!articleData) {
    console.error("Données de l'article non trouvées");
    // Rediriger vers la liste des articles
    window.location.href = "/articles";
    return;
  }

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

    // Gérer l'affichage des boutons
    document.getElementById("create-button").style.display = "none";
    document.getElementById("update-button").style.display = "block";

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

  // Supprimer le gestionnaire sur le formulaire et ne garder que celui du bouton
  articleForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Empêcher la soumission par défaut
  });

  // Gestion de la mise à jour
  const updateButton = document.getElementById("update-button");
  updateButton.addEventListener("click", async (e) => {
    e.preventDefault();

    // Validation du formulaire
    const { valid, errors } = validateArticleForm(articleForm);
    if (!valid) {
      Object.entries(errors).forEach(([field, message]) => {
        const errorSpan = articleForm.querySelector(`[data-error="${field}"]`);
        const input = articleForm.querySelector(`[name="${field}"]`);
        if (errorSpan) errorSpan.textContent = message;
        if (input) input.classList.add("error-input");
      });
      return;
    }

    try {
      const formData = new FormData(articleForm);
      const imageFile = formData.get("image");

      // Récupération des tokens
      const token = localStorage.getItem("JWTtoken");
      const csrfToken = document.querySelector(
        'input[name="csrf_token"]'
      ).value;

      if (!token) {
        throw new Error("Vous devez être connecté pour modifier un article");
      }

      // Préparation des données
      const articleUpdateData = {
        title: formData.get("title"),
        introduction: formData.get("introduction"),
        content: formData.get("content"),
        tags: formData
          .get("tags")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      // 1. Mise à jour du texte
      const response = await fetch(`${API_URL}/articles/${articleData.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleUpdateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la mise à jour");
      }

      // 2. Upload de la nouvelle image si présente
      if (imageFile && imageFile.size > 0) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);

        const imageResponse = await fetch(
          `${API_URL}/articles/${articleData.id}/image`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "X-CSRF-Token": csrfToken,
            },
            body: imageFormData,
          }
        );

        if (!imageResponse.ok) {
          throw new Error("Erreur lors de l'upload de l'image");
        }
      }

      // Succès : nettoyage et redirection
      sessionStorage.removeItem("articleToEdit");
      window.location.href = `/article/${articleData.id}`;
    } catch (error) {
      console.error("Erreur:", error);
      message.textContent = error.message;
      message.style.color = "red";
      // Afficher un message plus convivial à l'utilisateur
      message.textContent =
        "Une erreur est survenue lors de la modification de l'article. Veuillez réessayer.";
    }
  });
});
