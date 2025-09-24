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
      const response = await fetch(`${API_URL}/articles/id/${articleId}`);
      if (!response.ok) {
        throw new Error("Article non trouvé");
      }

      const jsonResponse = await response.json();
      const article = jsonResponse.data;

      // Debug des données de l'article
      console.log("Article data:", article);

      // Gestion des boutons d'action
      const token = localStorage.getItem("JWTtoken");
      const userRole = localStorage.getItem("role");

      if (token) {
        const tokenPayload = token.split(".")[1];
        const tokenData = JSON.parse(atob(tokenPayload));

        // Debug des données d'authentification
        console.log("Token data:", tokenData);
        console.log("User role:", userRole);
        console.log("Article user_id:", article.user_id);

        // Vérification des droits
        const isAdmin = userRole === "ROLE_ADMIN";
        const isAuthor = parseInt(tokenData.id) === parseInt(article.user_id);

        console.log("Is admin:", isAdmin);
        console.log("Is author:", isAuthor);

        const actionButtons = document.querySelector(".article-actions");
        if (isAdmin || isAuthor) {
          actionButtons.style.display = "flex";

          // Gestion du bouton modifier
          const editButton = document.querySelector(".btn-edit");
          if (editButton) {
            editButton.onclick = (e) => {
              e.preventDefault();
              // Stocker les données de l'article dans sessionStorage
              sessionStorage.setItem("articleToEdit", JSON.stringify(article));
              window.location.href = `/modifier-article/${article.id}`;
            };
          }

          // Gestion du bouton supprimer
          const deleteButton = document.querySelector(".btn-delete");
          if (deleteButton) {
            deleteButton.onclick = async (e) => {
              e.preventDefault();
              if (confirm("Voulez-vous vraiment supprimer cet article ?")) {
                try {
                  const response = await fetch(
                    `${API_URL}/article-delete/${article.id}`,
                    {
                      method: "DELETE",
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "X-CSRF-Token": document.querySelector(
                          'input[name="csrf_token"]'
                        ).value,
                      },
                    }
                  );

                  if (response.ok) {
                    window.location.href = "/articles";
                  } else {
                    throw new Error("Erreur lors de la suppression");
                  }
                } catch (error) {
                  console.error("Erreur:", error);
                  alert("Erreur lors de la suppression de l'article");
                }
              }
            };
          }
        } else {
          actionButtons.style.display = "none";
        }
      }

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
    } catch (error) {
      console.error("Erreur:", error);
      const contentElement = document.getElementById("article-content");
      if (contentElement) {
        contentElement.innerHTML = `
                    <div class="error-message">
                        <h2>Erreur lors du chargement de l'article</h2>
                        <p>${error.message}</p>
                    </div>
                `;
      }
    }
  }

  // Appel de la fonction loadArticle
  loadArticle();
});
