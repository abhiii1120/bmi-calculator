const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const form = $(".form");
const radios = $$('input[name="cmKg_feetLbs"]');
const changableWeight = $(".changable-weight");
const changableHeight = $(".changable-height");
const footer = $(".footer");
const outputNumber = $(".output-number");
let category = "";
const container = $(".history-container");
const resetBtn = $(".reset-button");
const resetHistoryButton = $(".reset-history-button");

function addData(e) {
  e.preventDefault();
  const type = $('input[name="cmKg_feetLbs"]:checked').value;
  const username = e.target.username.value;
  const weight = e.target.weight.value;
  const height = e.target.height.value;

  if (validateInputs(weight, height, type, username) != true) return;
  const bmiNumber = calculateBMI(weight, height, type);
  outputNumber.innerHTML = bmiNumber;
  displayingValue(bmiNumber);
  const payload = {
    name: username,
    category: category,
    massIndex: bmiNumber,
  };
  saveToLocalStorage(payload);
  loadHistory();
  form.reset();
}

function saveToLocalStorage(payload) {
  const history = JSON.parse(localStorage.getItem("bmiHistory") || "[]");
  history.unshift(payload);
  localStorage.setItem("bmiHistory", JSON.stringify(history));
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("bmiHistory") || "[]");
  renderHistory(history);
}

function renderHistory(history) {
  container.innerHTML = history
    .map(
      (item, index) => `
         <div class="history-data">
                    <div class="name">${item.name}<span class="category">${item.category}</span></div>
                    <div class="index"><span>${item.massIndex}</span> <button onclick="deleteHistory(${index})" class="delete-button"> Delete </button> </div>
                </div>
        `,
    )
    .join("");
}

function calculateBMI(weight, height, unit) {
  let mainHeight;
  let mainWeight;
  if (unit === "feet_lbs") {
    const feet = Math.floor(height);
    const inches = (height % 1) * 10;
    mainHeight = feet * 30.48 + inches * 2.54;
    mainWeight = weight * 0.453592;
  } else {
    mainHeight = height;
    mainWeight = weight;
  }

  const heightM = mainHeight / 100;
  const bmi = mainWeight / Math.pow(heightM, 2);
  return bmi.toFixed(2);
}

function validateInputs(weight, height, unit, username) {
  if (weight === "" || username === "" || height === "") {
    alert("All fields are required");
    return false;
  }
  if (unit === "cm_kg") {
    if (weight < 10 || weight > 450) {
      alert("Please enter weight between 10 and 450 kg");
      return false;
    }
    if (height < 50 || height > 250) {
      alert("Please enter height between 50 to 250");
      return false;
    }
  }
  if (unit === "feet_lbs") {
    if (weight < 22 || weight > 900) {
      alert("Please enter weight between 22 and 900 lbs");
      return false;
    }
    if (height < 1 || height > 9.11) {
      alert("Please enter height between 1 and 9.11 (feet.inches");
      return false;
    }
  }
  return true;
}

function onToggle(e) {
  const checked = $('input[name="cmKg_feetLbs"]:checked').value;
  if (checked == "feet_lbs") {
    changableWeight.innerHTML = "Lbs";
    changableHeight.innerHTML = "Feet";
  } else {
    changableWeight.innerHTML = "Kg";
    changableHeight.innerHTML = "Cm";
  }
}

function displayingValue(bmi) {
  console.log("running");
  if (bmi < 18.5) {
    footer.innerHTML =
      "You are underweight. Consider diet with more nutrients.";
    outputNumber.style.color = "#3b82f6";
    footer.style.color = "#aacaff";
    outputNumber.style.backgroundColor = "#3b83f62a";
    category = "Underweight";
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    footer.innerHTML =
      "Great! You have a healthy weight. Keep maintaining your lifestyle!";
    outputNumber.style.color = "#22c55e";
    footer.style.color = "#6affa1";
    outputNumber.style.backgroundColor = "#22c55e1a";
    category = "Normal";
  } else if (bmi >= 25 && bmi <= 29.9) {
    footer.innerHTML =
      "You are slightly overweight. Try regular exercise and a balanced diet.";
    outputNumber.style.color = "#f59e0b";
    footer.style.color = "#ffcb71";
    outputNumber.style.backgroundColor = "#f59e0b1a";
    category = "Overweight";
  } else if (bmi > 30) {
    footer.innerHTML =
      "You are obese. It is recommended to consult a doctor or nutritionist.";
    outputNumber.style.color = "#f97316";
    footer.style.color = "#ffb885";
    outputNumber.style.backgroundColor = "#f973161a";
    category = "Obese";
  }
}

form.addEventListener("submit", addData);
radios.forEach((radio) => {
  radio.addEventListener("click", onToggle);
});

function deleteHistory(index) {
  const history = JSON.parse(localStorage.getItem("bmiHistory") || "[]");
  history.splice(index, 1); // remove item at that index
  localStorage.setItem("bmiHistory", JSON.stringify(history));
  renderHistory(history); // update UI instantly
}

resetBtn.addEventListener("click", () => {
    location.reload();                     
});

resetHistoryButton.addEventListener("click",()=>{
    localStorage.removeItem("bmiHistory"); 
    loadHistory();
});

loadHistory();