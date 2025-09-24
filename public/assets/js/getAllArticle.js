// Configuration initiale
let currentPage = 1;
const articlesPerPage = 3;
let isLoading = false;
let API_URL = "";
let API_IMG_URL = "";

document.addEventListener("DOMContentLoaded", () => {
  const apiUrlInput = document.querySelector("#api-url");
  API_URL = apiUrlInput.value;
  const apiImgUrlInput = document.querySelector("#api-img-url");
  API_IMG_URL = apiImgUrlInput.value;
  // Fonction pour formater la date
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  }

  // Fonction pour créer une carte d'article
  function createArticleCard(article) {
    console.log("Création de la carte pour l'article:", article);

    // Vérification des données nulles
    const title = article.title || "Sans titre";
    const introduction = article.introduction || "Pas d'introduction";
    const coverImage = article.cover_image
      ? `${API_IMG_URL}${article.cover_image}`
      : "/assets/images/default.jpg";
    const createdAt = article.created_at
      ? formatDate(article.created_at)
      : "Date inconnue";

    return `
        <a href="/article/${article.id}" class="article-card-link">
            <article class="article-card">
                <div class="article-image">
                    <img src="${coverImage}" alt="${title}" onerror="this.src='/assets/images/default.jpg'"/>
                </div>
                <div class="article-content">
                    <h2>${title}</h2>
                    <p>${introduction}</p>
                    <div class="article-footer">
                        <span class="date">${createdAt}</span>
                        <span class="read-more">Lire la suite →</span>
                    </div>
                </div>
            </article>
        </a>
    `;
  }

  // Fonction pour charger les articles
  async function loadArticles(page = 1) {
    if (isLoading) return;
    isLoading = true;

    try {
      const url = `${API_URL}/articles?page=${page}&limit=${articlesPerPage}`;
      console.log("Chargement des articles depuis:", url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des articles");
      }

      const result = await response.json();
      console.log("Données reçues:", result);

      const articles = result.data.articles;
      const articlesContainer = document.querySelector(".articles-list");

      if (!articles || articles.length === 0) {
        console.log("Aucun article trouvé");
        articlesContainer.innerHTML = "<p>Aucun article disponible</p>";
        return;
      }

      if (page === 1) {
        articlesContainer.innerHTML = "";
      }

      articles.forEach((article) => {
        console.log("Traitement de l'article:", article);
        const cardHtml = createArticleCard(article);
        articlesContainer.innerHTML += cardHtml;
      });

      // Gestion du bouton "Voir plus"
      const voirPlusBtn = document.querySelector(".voir-plus");
      if (voirPlusBtn) {
        voirPlusBtn.style.display =
          articles.length < articlesPerPage ? "none" : "block";
      }
    } catch (error) {
      console.error("Erreur lors du chargement des articles:", error);
    } finally {
      isLoading = false;
    }
  }

  // Les filtres seront ajoutés plus tard

  // Charger les 3 premiers articles
  loadArticles(1);

  // Configurer le bouton "Voir plus"
  const voirPlusBtn = document.querySelector(".voir-plus");
  voirPlusBtn.addEventListener("click", () => {
    loadArticles(currentPage + 1);
  });

  // Log pour le débogage
  console.log("API_URL:", API_URL);
  console.log("API_IMG_URL:", API_IMG_URL);
});
