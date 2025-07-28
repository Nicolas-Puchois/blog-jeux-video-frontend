/**
 * Valide le formulaire de création d'article
 * @param {HTMLFormElement} form - Le formulaire à valider
 * @returns {Object} Un objet contenant valid (boolean) et errors (object)
 */
export const validateArticleForm = (form) => {
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
    if (image.size > 10 * 1024 * 1024) {
      // 10MB
      errors.image = "L'image ne doit pas dépasser 10MB";
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
