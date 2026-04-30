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