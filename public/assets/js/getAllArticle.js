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
    return `
        <article class="article-card" onclick="window.location.href='/article/${
          article.id
        }'">
            <div class="article-image">
                <img 
                  src="${
                    article.cover_image
                      ? `${API_IMG_URL}/uploads/articles/${article.cover_image
                          .split("/")
                          .pop()}`
                      : "/assets/images/gamepad.png"
                  }" 
                  alt="Image de ${article.title}"
                  onerror="console.error('Erreur de chargement:', this.src); this.style.display='none';"
                  onload="console.log('Image chargée:', this.src); this.parentElement.classList.add('loaded');"
                />
                <!-- Debug URL: ${
                  article.cover_image
                    ? `URL complète: ${API_IMG_URL}${article.cover_image}, 
                       API_IMG_URL: ${API_IMG_URL}, 
                       cover_image: ${article.cover_image}`
                    : "No image"
                } -->
            </div>
            <div class="article-content">
                <h3>${article.title}</h3>
                <div class="article-metadata">
                    <span class="article-date">${formatDate(
                      article.created_at
                    )}</span>
                    <div class="article-tags">
                        ${
                          article.tags
                            ? (Array.isArray(article.tags)
                                ? article.tags
                                : JSON.parse(article.tags)
                              )
                                .map(
                                  (tag) =>
                                    `<span class="tag">${tag.trim()}</span>`
                                )
                                .join("")
                            : ""
                        }
                    </div>
                </div>
                <p class="article-description">${article.content.substring(
                  0,
                  150
                )}...</p>
            </div>
        </article>

        <div class="articles-pagination">
          <button class="voir-plus">Voir plus d'articles ...</button>
        </div>
    `;
  }

  // Fonction pour charger les articles
  async function loadArticles(page = 1) {
    if (isLoading) return;
    isLoading = true;

    try {
      // Construire l'URL avec les paramètres de pagination
      let url = `${API_URL}/articles?page=${page}&limit=${articlesPerPage}`;

      const response = await fetch(url);
      if (!response.ok)
        throw new Error("Erreur lors de la récupération des articles");

      const data = await response.json();
      const articlesContainer = document.querySelector(".articles-list");

      // Si c'est la première page, on vide le conteneur
      if (page === 1) {
        articlesContainer.innerHTML = "";
      }

      // Ajouter les nouveaux articles
      data.articles.forEach((article) => {
        articlesContainer.innerHTML += createArticleCard(article);
      });

      // Gérer le bouton "Voir plus"
      const voirPlusBtn = document.querySelector(".voir-plus");
      if (data.articles.length < articlesPerPage) {
        voirPlusBtn.style.display = "none";
      } else {
        voirPlusBtn.style.display = "block";
      }

      currentPage = page;
    } catch (error) {
      console.error("Erreur:", error);
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
