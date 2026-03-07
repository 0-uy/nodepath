document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("cform");
  const button = document.getElementById("fsub");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    button.innerText = "Enviando...";
    button.disabled = true;

    emailjs.sendForm(
      "service_f8uqm44",
      "template_xwa3s57",
      this
    )
    .then(function () {
      button.innerText = "✅ Enviado correctamente";
      form.reset();

      setTimeout(() => {
        button.innerText = "🚀 Quiero mi propuesta gratuita";
        button.disabled = false;
      }, 3000);
    }, function (error) {
      button.innerText = "❌ Error al enviar";
      button.disabled = false;
      console.error("Error:", error);
    });

  });

});
