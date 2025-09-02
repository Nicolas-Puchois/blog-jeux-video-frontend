// Fonction pour vérifier le token reCAPTCHA
export async function verifyRecaptchaToken(token) {
  try {
    const API_URL = document.querySelector("#api-url").value;
    const response = await fetch(`${API_URL}/verify-recaptcha`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Erreur lors de la vérification du reCAPTCHA:", error);
    return false;
  }
}

// Fonction appelée par reCAPTCHA après validation
export async function onRecaptchaSubmit(token) {
  const isValid = await verifyRecaptchaToken(token);
  if (!isValid) {
    const message = document.querySelector("#verify-msg");
    if (message) {
      message.textContent = "Veuillez valider le reCAPTCHA";
      message.style.color = "red";
    }
    return false;
  }
  return true;
}
