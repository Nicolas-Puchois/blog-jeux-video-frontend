export function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;

  // Style de la notification modifié pour être au centre
  notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: fadeIn 0.5s ease-out;
        text-align: center;
    `;

  document.body.appendChild(notification);

  // Modification de l'animation pour un fade in/out au centre
  const style = document.createElement("style");
  style.textContent = `
        @keyframes fadeIn {
            from { 
                opacity: 0;
                transform: translate(-50%, -60%);
            }
            to { 
                opacity: 1;
                transform: translate(-50%, -50%);
            }
        }
        @keyframes fadeOut {
            from { 
                opacity: 1;
                transform: translate(-50%, -50%);
            }
            to { 
                opacity: 0;
                transform: translate(-50%, -40%);
            }
        }
    `;
  document.head.appendChild(style);

  // Animation de sortie
  setTimeout(() => {
    notification.style.animation = "fadeOut 0.5s ease-out";
    setTimeout(() => notification.remove(), 500);
    style.remove();
  }, 3000);
}

// Vérifier si une notification doit être affichée
document.addEventListener("DOMContentLoaded", () => {
  const notification = localStorage.getItem("showNotification");
  if (notification) {
    showNotification(notification);
    localStorage.removeItem("showNotification");
  }
});
