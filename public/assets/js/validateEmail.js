import { fetchData } from "../../lib/fetchData.js";

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const message = document.querySelector("#verify-msg");
  const API_URL = document.querySelector("#api-url").value;
  const loginLink = document.querySelector("#login-link");

  if (!token) {
    message.textContent = "Token non trouvé !";
    message.style.color = "red";
    return;
  }

  try {
    const result = await fetchData({
      route: "/valider-email",
      api: API_URL,
      options: {
        params: { token: token }, // Passage du token dans un objet
      },
    });
    if (result.success) {
      message.textContent = result.message;
      message.style.color = "green";
      loginLink.style.display = "block";
    }
  } catch (error) {
    message.textContent =
      "Problème dans la vérification de votre email, veuillez contacter l'administrateur : ";
    const contactButton = document.createElement("a");
    contactButton.setAttribute("href", "mailto:contact@shareskill.com");
    contactButton.textContent = "Contactez-nous";
    message.append(contactButton);
    message.style.color = "red";
  }
});
