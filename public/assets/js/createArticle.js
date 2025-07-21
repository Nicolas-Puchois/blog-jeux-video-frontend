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

    // Debug des données avant envoi
    for (let [key, value] of formData.entries()) {
      console.log(
        `${key}:`,
        value instanceof File ? `File (${value.size} bytes)` : value
      );
    }

    // Conversion des tags en tableau
    const tags = formData
      .get("tags")
      .split(",")
      .map((tag) => tag.trim());
    formData.set("tags", JSON.stringify(tags));

    try {
      console.log("Envoi vers:", `${API_URL}/articles`);

      // Debug de la taille des données
      // let totalSize = 0;
      // for (let pair of formData.entries()) {
      //   console.log("Champ:", pair[0]);
      //   if (pair[1] instanceof File) {
      //     console.log("- Type:", pair[1].type);
      //     console.log("- Taille:", pair[1].size, "bytes");
      //     totalSize += pair[1].size;
      //   } else {
      //     console.log("- Valeur:", pair[1]);
      //     totalSize += new Blob([pair[1]]).size;
      //   }
      // }
      // console.log("Taille totale de la requête:", totalSize, "bytes");

      const result = await fetchData({
        route: "/articles",
        api: API_URL,
        options: {
          method: "POST",
          body: formData,
          headers: {
            // Ne pas définir Content-Type car il sera automatiquement défini avec le bon boundary pour multipart/form-data
            Authorization: `Bearer ${localStorage.getItem("JWTtoken")}`,
          },
        },
      });

      if (!result.success) {
        throw new Error(
          result.error || "Erreur lors de la création de l'article"
        );
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
