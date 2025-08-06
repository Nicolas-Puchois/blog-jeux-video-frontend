document.addEventListener("DOMContentLoaded", () => {
  // Fonction de formatage de date
  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  }

  // Récupérer l'ID de l'article depuis l'URL
  const urlParts = window.location.pathname.split("/");
  const articleId = urlParts[urlParts.length - 1];

  const apiUrlInput = document.querySelector("#api-url");
  const apiImgUrlInput = document.querySelector("#api-img-url");
  const API_URL = apiUrlInput.value;
  const API_IMG_URL = apiImgUrlInput.value;

  async function loadArticle() {
    try {
      const url = `${API_URL}/articles/id/${articleId}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Article non trouvé");

      const jsonResponse = await response.json();
      if (!jsonResponse.success || !jsonResponse.data) {
        throw new Error("Format de réponse invalide");
      }
      const article = jsonResponse.data;

      // Mise à jour de l'image de couverture
      const coverImage = document.getElementById("article-cover-image");
      if (article.cover_image) {
        const imagePath = article.cover_image.startsWith("/")
          ? article.cover_image
          : "/" + article.cover_image;
        coverImage.src = `${API_IMG_URL}${imagePath}`;
        coverImage.alt = `Image de couverture - ${article.title}`;
      } else {
        coverImage.src = "/assets/images/gamepad.png"; // Image par défaut
        coverImage.alt = "Image par défaut";
      }

      // Mise à jour du contenu
      document.getElementById("article-title").textContent = article.title;
      document.getElementById("article-date").textContent = formatDate(
        article.created_at
      );
      document
        .getElementById("article-date")
        .setAttribute("datetime", article.created_at);

      // Affichage du contenu
      const introElement = document.getElementById("article-intro");
      const contentElement = document.getElementById("article-content");

      introElement.innerHTML = article.introduction || "";
      contentElement.innerHTML = article.content || "";

      const actionButtons = document.querySelector(".article-actions");
      if (article.is_author || article.is_admin) {
        actionButtons.classList.add("user-role");
      } else {
        actionButtons.classList.remove("user-role");
      }

      // Ajouter les gestionnaires d'événements pour les boutons
      const editButton = document.querySelector(".btn-edit");
      editButton.addEventListener("click", () => {
        // Stocker les données de l'article dans sessionStorage
        sessionStorage.setItem("articleToEdit", JSON.stringify(article));
        // Rediriger vers la page de création avec un paramètre edit
        window.location.href = `/create-article?edit=${article.id_article}`;
      });
    } catch (error) {
      // Gérer l'erreur (redirection ou message)
    }
  }

  loadArticle();
});
