import { fetchData } from "../../lib/fetchData.js";
import { validateForm } from "../../services/validate.js";
import { AuthManager } from "../../services/auth.js";
import { NavigationManager } from "../../services/navigation.js";
import { onRecaptchaSubmit } from "../../services/recaptcha.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#login-form");
  const API_URL = document.querySelector("#api-url").value;
  const message = document.querySelector("#verify-msg");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.textContent = "";

    // Réinitialisation des erreurs
    loginForm
      .querySelectorAll(".error")
      .forEach((span) => (span.textContent = ""));
    loginForm
      .querySelectorAll(".error-input")
      .forEach((input) => input.classList.remove("error-input"));

    // Validation des données
    const { valid, errors } = validateForm(loginForm);

    if (!valid) {
      for (const [field, message] of Object.entries(errors)) {
        const errorSpan = loginForm.querySelector(`[data-error="${field}"]`);
        const input = loginForm.querySelector(`[name="${field}"]`);
        if (errorSpan) errorSpan.textContent = message;
        if (input) {
          input.classList.add("error-input");
        }
      }
      return;
    }

    const formData = new FormData(loginForm);
    const jsonData = Object.fromEntries(formData.entries());
    try {
      const result = await fetchData({
        route: "/login",
        api: API_URL,
        options: {
          method: "POST",
          body: JSON.stringify(jsonData),
        },
      });

      if (!result.success) {
        throw new Error(result.error || "Erreur de connexion");
      }

      // Stockage des informations de connexion
      localStorage.setItem("JWTtoken", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("showNotification", "Connexion réussie !");
      console.log(NavigationManager);
      // Mise à jour de l'interface du header
      NavigationManager.updateAuthLinks();

      // Redirection
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect") || "/";
      window.location.href = redirect;
    } catch (error) {
      message.textContent = error.message;
      message.style.color = "red";
      loginForm.querySelector('button[type="submit"]').disabled = false;
    }
  });
});
