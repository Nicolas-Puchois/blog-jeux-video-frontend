import { fetchData } from "../../lib/fetchData.js";
import { validateRegisterForm } from "../../services/validate.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.querySelector("#register-form");

  registerForm.addEventListener("submit", async (e) => {
    const API_URL = document.querySelector("#api-url").value;
    console.log(API_URL);

    const message = document.querySelector("#verify-msg");
    e.preventDefault();
    registerForm
      .querySelectorAll(".error")
      //    réinitialisation des champs erreurs a vides
      .forEach((span) => (span.textContent = ""));
    registerForm
      .querySelectorAll(".error-input")
      .forEach((input) => input.classList.remove("error-input"));
    // Validation des donnée
    const { valid, errors } = validateRegisterForm(registerForm);
    if (!valid) {
      for (const [field, message] of Object.entries(errors)) {
        const errorSpan = registerForm.querySelector(`[data-error="${field}"]`);
        const input = document.querySelector(`[name="${field}"]`);
        if (errorSpan) errorSpan.textContent = message;
        if (input) {
          input.classList.add("error-input");
        }
      }
      return;
    }
    // Recuperation des saisie via les attributs'name" => value
    const formData = new FormData(registerForm);
    const jsonData = {};
    formData.forEach((value, key) => {
      if (key !== "repeat-password") {
        jsonData[key] = value;
      }
    });

    try {
      const result = await fetchData({
        route: "/register",
        api: API_URL,
        options: {
          method: "POST",
          body: JSON.stringify(jsonData),
        },
      });

      if (!result.success) {
        throw new Error(result.error);
      }
      if (result.success) {
        registerForm.reset();
        message.textContent =
          "Inscription réussi. Vérifier votre messagerie pour activer le compte";
        message.style.color = "green";
      }
    } catch (error) {
      message.textContent = error.message;
      message.style.color = "red";
    }
  });
});
