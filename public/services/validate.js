export function validateRegisterForm(form) {
  const formData = new FormData(form);
  const errors = {};
  if (formData.get("username") != null && !formData.get("username").trim())
    errors.username = "Le nom d'utilisateur est requis";
  //  regex validation email
  const emailRegex = new RegExp(
    "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"
  );
  const email = formData.get("email")?.trim();
  if (/*formData.get("email") != null && */ !emailRegex.test(email)) {
    errors.email = "L'Email est invalide. Email valide : test@monmail.com";
  }

  const passwordRegexPattern =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?`~])[A-Za-z\d!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?`~]{12,}$/;
  const strongPasswordRegex = new RegExp(passwordRegexPattern);
  const password = formData.get("password")?.trim();
  if (
    /*formData.get("password") != null && */ !strongPasswordRegex.test(password)
  ) {
    errors.password =
      " Mot de passe invalide : 12 caractères minimum, 1 majuscule, 1 chiffre, 1 caractère spécial";
  }
  const repeatPassword = formData.get("repeat-password")?.trim();
  if (password !== repeatPassword) {
    errors["repeat-password"] = "Les mots de passes ne correspondent pas !";
  }
  return {
    valid: Object.keys(errors).length == 0,
    errors,
  };
}
