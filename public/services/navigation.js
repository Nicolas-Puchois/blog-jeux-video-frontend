import { AuthManager } from "./auth.js";

export class NavigationManager {
  static updateAuthLinks() {
    const authLinksContainer = document.getElementById("auth-links-container");
    const registerLinkContainer = document.getElementById(
      "register-link-container"
    );
    if (!authLinksContainer || !registerLinkContainer) return;

    const token = localStorage.getItem("JWTtoken");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (token && user) {
      // Utilisateur connecté
      const isAdmin = user.roles && user.roles.includes("ROLE_ADMIN");

      // Mettre à jour le premier lien d'authentification

      // Transformer le conteneur d'inscription en lien de déconnexion
      registerLinkContainer.innerHTML =
        '<a href="#" id="logout-btn"><i class="fas fa-plug-circle-xmark"></i> Se Déconnecter</a>';

      // Ajouter le lien Dashboard entre les deux si admin
      if (isAdmin) {
        const existingDashboard = document.querySelector(".dashboard-link");
        if (!existingDashboard) {
          const dashboardLi = document.createElement("li");
          dashboardLi.classList.add("dashboard-link");
          dashboardLi.innerHTML =
            '<a href="/dashboard"><i class="fas fa-table-cells"></i> Dashboard</a>';
          authLinksContainer.insertAdjacentElement("afterend", dashboardLi);
        }
      }

      // Gestion du clic sur le bouton de déconnexion
      document.getElementById("logout-btn")?.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.setItem("showNotification", "Déconnexion réussie !");
        AuthManager.logout();
        window.location.href = "/login";
      });
    } else {
      // Utilisateur non connecté
      authLinksContainer.innerHTML =
        '<a href="/login"><i class="fas fa-right-to-bracket"></i> Se Connecter</a>';
      registerLinkContainer.innerHTML =
        '<a href="/register"><i class="fas fa-user-plus"></i> S&apos;inscrire</a>';

      // Supprimer le lien dashboard s'il existe
      document.querySelector(".dashboard-link")?.remove();
    }
  }

  static init() {
    // Mettre à jour les liens au chargement de la page
    document.addEventListener("DOMContentLoaded", () => this.updateAuthLinks());

    // Mettre à jour les liens si le localStorage change
    window.addEventListener("storage", () => this.updateAuthLinks());
  }
}
