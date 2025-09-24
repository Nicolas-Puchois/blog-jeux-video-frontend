import express from "express";
const router = express.Router();

const globals = {
  API_URL: process.env.API_URL || "http://localhost:8000/api",
  API_IMG_URL: process.env.API_IMG_URL || "http://localhost:8000",
  RECAPTCHA_PUBLIC_KEY: process.env.RECAPTCHA_PUBLIC_KEY,
  CSRF_TOKEN: process.env.CSRF_TOKEN,
};

router.get("/", (req, res) => {
  res.render("layout", { title: "Accueil", view: "pages/home" });
});

router.get("/articles", (req, res) => {
  res.render("layout", {
    title: "Articles",
    view: "pages/articles",
    ...globals,
  });
});

router.get("/register", (req, res) => {
  res.render("layout", {
    title: "S'inscrire",
    view: "pages/register",
    ...globals,
  });
});

router.get("/validateEmail", (req, res) => {
  res.render("layout", {
    title: "Valider votre Email",
    view: "pages/validateEmail",
    ...globals,
  });
});

router.get("/login", (req, res) => {
  res.render("layout", {
    title: "Se Connecter",
    view: "pages/login",
    ...globals,
  });
});

router.get("/contact", (req, res) => {
  res.render("layout", {
    title: "A Propos/Contact",
    view: "pages/contact",
    ...globals,
  });
});

router.get("/critiques", (req, res) => {
  res.render("layout", {
    title: "les critiques",
    view: "pages/critiques",
    ...globals,
  });
});

// Route pour créer/modifier un article
router.get("/create-article", (req, res) => {
  res.render("layout", {
    title: "Créer un article",
    view: "pages/createArticle",
    ...globals,
  });
});

// Remplacer la route /modifier-article par :
router.get("/modifier-article/:id", (req, res) => {
  res.render("layout", {
    title: "Modifier l'article",
    view: "pages/createArticle",
    isEditing: true,
    articleId: req.params.id,
    ...globals,
  });
});

// Route pour afficher un article spécifique
router.get("/article/:id", (req, res) => {
  res.render("layout", {
    title: "Article",
    view: "pages/article",
    ...globals,
  });
});

export default router;
