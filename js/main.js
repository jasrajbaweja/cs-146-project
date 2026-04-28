const contactForm = document.querySelector("form");
if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault(); // prevent page reload

    const name = document.getElementById("name").value;

    // Show a confirmation message
    const message = document.createElement("p");
    message.textContent = `Thanks, ${name}! Your message has been sent.`;
    message.style.color = "green";
    message.style.fontWeight = "bold";

    contactForm.replaceWith(message);
  });
}
