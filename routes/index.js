import express from "express";
const router = express.Router();

const globals = {
  API_URL: process.env.API_URL || "http://localhost:8000/api",
};

router.get("/", (req, res) => {
  res.render("layout", { title: "Accueil", view: "pages/home" });
});

router.get("/register", (req, res) => {
  res.render("layout", {
    title: "S'inscrire",
    view: "pages/register",
    ...globals,
  });
});

export default router;
