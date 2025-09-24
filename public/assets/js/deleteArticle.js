document.addEventListener("DOMContentLoaded", () => {
  const btnDelete = document.querySelector(".btn-delete");
  const apiUrlInput = document.querySelector("#api-url");
  const API_URL = apiUrlInput.value;
  let isDeleting = false; // Drapeau pour éviter les doubles soumissions

  if (btnDelete) {
    btnDelete.addEventListener("click", async () => {
      try {
        // Éviter les doubles clics
        if (isDeleting) return;
        isDeleting = true;

        // Récupérer l'ID de l'article depuis l'URL
        const articleId = window.location.pathname.split("/").pop();

        // Confirmation de suppression
        const confirmation = confirm(
          "Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible."
        );
        if (!confirmation) {
          isDeleting = false;
          return;
        }

        // Récupérer les tokens
        const token = localStorage.getItem("JWTtoken");
        const csrfToken = document.querySelector(
          'input[name="csrf_token"]'
        ).value;

        if (!token) {
          throw new Error("Vous devez être connecté pour supprimer un article");
        }

        // Appel à l'API pour supprimer l'article
        const response = await fetch(`${API_URL}/article-delete/${articleId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-CSRF-Token": csrfToken,
          },
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Erreur lors de la suppression");
        }

        const result = await response.json();

        // Afficher un message de succès
        localStorage.setItem(
          "showNotification",
          "Article supprimé avec succès !"
        );
        // Rediriger vers la page des articles
        window.location.href = "/articles";
      } catch (error) {
        console.error("Erreur:", error);
        alert(`Erreur lors de la suppression : ${error.message}`);
      } finally {
        isDeleting = false;
      }
    });
  }
});
