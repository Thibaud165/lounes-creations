const canvas = new fabric.Canvas("canvas");
let backgroundImage = null;

// Chargement d'une image par l'utilisateur
document.getElementById("imgUpload").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (f) {
    fabric.Image.fromURL(f.target.result, function (img) {
      img.scaleToWidth(200);
      img.left = 150;
      img.top = 100;
      canvas.add(img);
    });
  };
  reader.readAsDataURL(file);
});

// Ajouter du texte personnalisé
function addText() {
  const text = document.getElementById("textInput").value;
  const font = document.getElementById("fontSelect").value;
  if (!text) return;

  const textbox = new fabric.Textbox(text, {
    left: 100,
    top: 50,
    fontSize: 24,
    fontFamily: font,
    fill: "#000",
  });
  canvas.add(textbox);
}

// Supprimer l'élément sélectionné
function deleteSelected() {
  const active = canvas.getActiveObject();
  if (active) {
    canvas.remove(active);
  }
}

// Suppr via la touche "Suppr"
document.addEventListener("keydown", function (e) {
  if (e.key === "Delete") {
    deleteSelected();
  }
});

// Exporter le design (avec fond)
function exportDesign() {
  const dataURL = canvas.toDataURL({ format: "png" });
  const link = document.createElement("a");
  link.download = "design_avec_fond.png";
  link.href = dataURL;
  link.click();
}

// Exporter le design sans le fond
function exportWithoutBackground() {
  const originalBg = canvas.backgroundImage;

  canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));

  setTimeout(() => {
    const dataURL = canvas.toDataURL({ format: "png" });
    const link = document.createElement("a");
    link.download = "design_sans_fond.png";
    link.href = dataURL;
    link.click();

    canvas.setBackgroundImage(originalBg, canvas.renderAll.bind(canvas));
  }, 100);
}

// Envoyer la commande au backend
function envoyerCommande() {
  const originalBg = canvas.backgroundImage;

  canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));

  setTimeout(() => {
    const imageBase64 = canvas.toDataURL("image/png");

    const dataCommande = {
      image: imageBase64,
      produit: "T-shirt personnalisé",
      nomClient: "Client Exemple",
      date: new Date().toISOString(),
    };

    fetch("https://ton-backend.onrender.com/api/commande", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataCommande),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Commande envoyée avec succès 🎉");
      })
      .catch((err) => {
        console.error("Erreur envoi commande:", err);
        alert("Erreur lors de l'envoi de la commande");
      });

    canvas.setBackgroundImage(originalBg, canvas.renderAll.bind(canvas));
  }, 100);
}
