export class AuthManager {
  static isLoggedIn() {
    const token = localStorage.getItem("JWTtoken");
    const currentPath = window.location.pathname;
    const notAllowedPaths = ["/skills", "/profil"];
    const adminPaths = ["%2Fdashboard"];

    // Vérifie si la page nécessite une connexion
    if (!token && notAllowedPaths.includes(currentPath)) {
      localStorage.setItem(
        "showNotification",
        "Vous devez être connecté pour accéder à cette page"
      );

      window.location.href = `/login?redirect=${encodeURIComponent(
        currentPath
      )}`;

      return false;
    }

    if (token && this.isTokenExpired(token)) {
      localStorage.setItem(
        "showNotification",
        "Session expirée, veuillez vous reconnecter"
      );
      this.logout();
      window.location.href = "/login";
      return false;
    }

    // Vérifie si la page est réservée aux admins
    const encodedPath = encodeURIComponent(window.location.pathname);
    if (adminPaths.includes(encodedPath) && !this.isAdmin()) {
      localStorage.setItem(
        "showNotification",
        "Accès non autorisé - Administrateurs uniquement"
      );
      window.location.href = "/";
      return false;
    }

    return true;
  }

  static getUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  static logout() {
    localStorage.removeItem("JWTtoken");
    localStorage.removeItem("user");
  }

  static isTokenExpired(token) {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  }

  static isAdmin() {
    const token = localStorage.getItem("JWTtoken");
    if (!token) return false;

    try {
      // Le token JWT est composé de 3 parties : header.payload.signature
      // Nous voulons décoder le payload qui est à l'index 1
      const payload = JSON.parse(atob(token.split(".")[1]));
      // Vérifie si l'utilisateur a le rôle admin
      return (
        payload.role &&
        Array.isArray(payload.role) &&
        (payload.role.includes("ROLE_ADMIN") || payload.role.includes("admin"))
      );
    } catch (error) {
      console.error("Erreur parsing token:", error);
      return false;
    }
  }
}
