console.log("JS LOADED");
document.addEventListener("DOMContentLoaded", () => {

// ---------------- LOCAL STORAGE KEYS ----------------
const MEALS_KEY = "meals";
const ASSIGNMENTS_KEY = "assignments";
const SLEEP_KEY = "sleep";


// ---------------- MEAL TRACKER ----------------
const mealChecks = document.querySelectorAll(".meal-check");
const mealProgress = document.getElementById("mealProgress");
const mealCongrats = document.getElementById("mealCongrats");

let meals = JSON.parse(localStorage.getItem(MEALS_KEY)) || [false, false, false];

mealChecks.forEach((cb, i) => {
  cb.checked = meals[i];
});

function updateMeals() {
  let count = 0;

  mealChecks.forEach((cb, i) => {
    meals[i] = cb.checked;
    if (cb.checked) count++;
  });

  localStorage.setItem(MEALS_KEY, JSON.stringify(meals));

  mealProgress.textContent = `${count}/3 meals completed`;

  mealCongrats.textContent = count === 3
    ? "🎉 Congrats! You completed all meals!"
    : "";
}

mealChecks.forEach(cb => cb.addEventListener("change", updateMeals));
updateMeals();


// ---------------- ASSIGNMENT TRACKER ----------------
const addBtn = document.getElementById("addAssignment");
const list = document.getElementById("assignmentList");

let assignments = JSON.parse(localStorage.getItem(ASSIGNMENTS_KEY)) || [];

function renderAssignments() {
  list.innerHTML = "";

  assignments.forEach((a, index) => {
    const li = document.createElement("li");

    const left = document.createElement("span");
    left.textContent = `${a.name} (Due: ${a.date})`;

    if (a.done) {
      left.style.textDecoration = "line-through";
      left.style.color = "gray";
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = a.done;

    checkbox.addEventListener("change", () => {
      assignments[index].done = checkbox.checked;
      localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
      renderAssignments();
    });

    li.appendChild(left);
    li.appendChild(checkbox);
    list.appendChild(li);
  });
}

if (addBtn) {
  addBtn.addEventListener("click", () => {
    const name = document.getElementById("assignmentName").value.trim();
    const date = document.getElementById("assignmentDate").value;

    if (!name || !date) return;

    assignments.push({ name, date, done: false });

    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));

    document.getElementById("assignmentName").value = "";
    document.getElementById("assignmentDate").value = "";

    renderAssignments();
  });
}

renderAssignments();


// ---------------- SLEEP TRACKER ----------------
const sleepBtn = document.getElementById("checkSleep");
const sleepResult = document.getElementById("sleepResult");

const savedSleep = JSON.parse(localStorage.getItem(SLEEP_KEY));
if (savedSleep) {
  sleepResult.textContent = savedSleep.message;
}

if (sleepBtn) {
  sleepBtn.addEventListener("click", () => {
    const start = document.getElementById("sleepStart").value;
    const end = document.getElementById("sleepEnd").value;

    if (!start || !end) return;

    let startTime = new Date(`1970-01-01T${start}:00`);
    let endTime = new Date(`1970-01-01T${end}:00`);

    if (endTime < startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }

    const hours = (endTime - startTime) / (1000 * 60 * 60);

    let message = `You slept ${hours.toFixed(1)} hours`;

    if (hours >= 8) {
      message += " 🎉 Congrats! You got enough sleep!";
    }

    sleepResult.textContent = message;

    localStorage.setItem(SLEEP_KEY, JSON.stringify({
      start,
      end,
      message
    }));
  });
}

});
const contactForm = document.querySelector("form");

if (contactForm) {
  // --- Real-time validation helpers ---

  function showError(input, message) {
    clearError(input);
    const err = document.createElement("span");
    err.className = "field-error";
    err.textContent = message;
    input.classList.add("input-invalid");
    input.parentElement.appendChild(err);
  }

  function clearError(input) {
    input.classList.remove("input-invalid");
    const existing = input.parentElement.querySelector(".field-error");
    if (existing) existing.remove();
  }

  function validateName(input) {
    const val = input.value.trim();
    if (!val) {
      showError(input, "Name is required.");
      return false;
    }
    if (val.length < 2) {
      showError(input, "Name must be at least 2 characters.");
      return false;
    }
    clearError(input);
    return true;
  }

  function validateEmail(input) {
    const val = input.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) {
      showError(input, "Email is required.");
      return false;
    }
    if (!emailPattern.test(val)) {
      showError(input, "Please enter a valid email address.");
      return false;
    }
    clearError(input);
    return true;
  }

  function validateSubject(input) {
    if (!input.value) {
      showError(input, "Please select a subject.");
      return false;
    }
    clearError(input);
    return true;
  }

  function validateMessage(input) {
    const val = input.value.trim();
    if (!val) {
      showError(input, "Message is required.");
      return false;
    }
    if (val.length < 10) {
      showError(input, "Message must be at least 10 characters.");
      return false;
    }
    clearError(input);
    return true;
  }

  // Attach live validation listeners
  const nameInput    = document.getElementById("name");
  const emailInput   = document.getElementById("email");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");

  nameInput.addEventListener("blur", () => validateName(nameInput));
  emailInput.addEventListener("blur", () => validateEmail(emailInput));
  subjectInput.addEventListener("change", () => validateSubject(subjectInput));
  messageInput.addEventListener("blur", () => validateMessage(messageInput));

  // --- Form submit: validate then show summary card ---
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameOk    = validateName(nameInput);
    const emailOk   = validateEmail(emailInput);
    const subjectOk = validateSubject(subjectInput);
    const msgOk     = validateMessage(messageInput);

    if (!(nameOk && emailOk && subjectOk && msgOk)) {
      // Scroll to first error
      const firstError = contactForm.querySelector(".input-invalid");
      if (firstError) firstError.focus();
      return;
    }

    // Collect form data
    const name        = nameInput.value.trim();
    const email       = emailInput.value.trim();
    const subject     = subjectInput.options[subjectInput.selectedIndex].text;
    const contactPref = contactForm.querySelector('input[name="contact-method"]:checked').value;
    const newsletter  = document.getElementById("newsletter").checked;
    const message     = messageInput.value.trim();

    // Build confirmation card
    const card = document.createElement("div");
    card.className = "confirmation-card";

    card.innerHTML = `
      <div class="confirm-icon">✓</div>
      <h2>Message Sent!</h2>
      <p class="confirm-intro">Thanks, <strong>${escapeHTML(name)}</strong>! Here's a summary of what you sent:</p>
      <table class="confirm-table">
        <tr><th>Email</th><td>${escapeHTML(email)}</td></tr>
        <tr><th>Subject</th><td>${escapeHTML(subject)}</td></tr>
        <tr><th>Preferred Reply</th><td>${capitalize(escapeHTML(contactPref))}</td></tr>
        <tr><th>Newsletter</th><td>${newsletter ? "Subscribed ✓" : "Not subscribed"}</td></tr>
        <tr><th>Message</th><td class="confirm-message">${escapeHTML(message)}</td></tr>
      </table>
      <button class="btn-back" id="sendAnother">Send another message</button>
    `;

    contactForm.replaceWith(card);

    // Allow sending another message
    document.getElementById("sendAnother").addEventListener("click", () => {
      location.reload();
    });
  });
}

// --- Utilities ---
function escapeHTML(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}