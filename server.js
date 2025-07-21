import express from "express";
import helmet from "helmet";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import indexRoutes from "./routes/index.js";
// création de l'application
const app = express();
const __dirname__ = path.resolve();
// initialisation du moteur de template
app.set("view engine", "ejs");
app.set("views", path.join(__dirname__, "views"));
// Configuration de Helmet (sécurité)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "localhost:*",
        ],
        connectSrc: ["'self'", "ws://localhost:*", "http://localhost:8000"],
        imgSrc: ["'self'", "data:", "blob:", "http://localhost:8000"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
        fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
        formAction: ["'self'", "http://localhost:8000"],
        baseUri: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: false,
  })
);

// configuration des assets static => /public
app.use(express.static(path.join(__dirname__, "public")));
// import du routeur
app.use("/", indexRoutes);
// mise en écoute du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("serveur lancé :\nhttp://localhost:" + PORT);
});
