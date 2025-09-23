/**
 * Utilitaire pour gérer les appels API
 */ // Ajouter le token JWT si présent
//SAUVEGARDE Peut etre réutiliser dans tous les projets
export const fetchData = async ({ route, api, options = {} }) => {
  const token = localStorage.getItem("JWTtoken");
  const csrfToken = document.querySelector('input[name="csrf_token"]').value;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      "X-CSRF-Token": csrfToken,
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // Construire la query string si des paramètres sont présents
  let queryString = "";
  if (options.params) {
    queryString = "?" + new URLSearchParams(options.params).toString();
    delete options.params;
  }

  // Debug de la requête
  console.log("URL complète:", `${api}${route}${queryString}`);
  console.log("Headers:", finalOptions.headers);
  console.log("Options:", finalOptions);

  // Effectuer la requête
  const result = await fetch(`${api}${route}${queryString}`, finalOptions);

  // Debug de la réponse
  console.log("Status:", result.status);
  console.log("Status Text:", result.statusText);
  console.log("Response Headers:", Object.fromEntries(result.headers));

  // Traiter la réponse
  const responseData = await result.text();
  console.log("Response Data:", responseData);
  let jsonData;

  try {
    jsonData = JSON.parse(responseData);
  } catch (e) {
    console.error("Réponse non-JSON:", responseData);

    throw new Error("Format de réponse invalide");
  }

  if (result.ok) {
    return jsonData;
  }

  throw new Error(jsonData.error || "Erreur serveur");
};
