function pop() {
  document.getElementById("popup").style.display = "block";
  document.getElementById("popup-title").innerText = "Add New Transaction";
  document.getElementById("edit-id").value = ""; // Clear edit mode
  text.value = "";
  amount.value = "";
}

function closep() {
  document.getElementById("popup").style.display = "none";
}

const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const editIdInput = document.getElementById("edit-id");

const localStorageTransactions = JSON.parse(localStorage.getItem("transactions"));
let transactions = localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// Add or Edit Transaction
function addTransaction(e) {
  e.preventDefault();

  const idValue = editIdInput.value;
  const transactionData = {
    text: text.value,
    amount: +amount.value,
  };

  if (transactionData.text.trim() === "" || transactionData.amount === 0) {
    alert("Please add valid text and amount");
    return;
  }

  if (idValue) {
    // Edit mode
    editTransaction(Number(idValue), transactionData);
  } else {
    const transaction = {
      id: generateID(),
      ...transactionData,
    };
    transactions.push(transaction);
  }

  updateLocalStorage();
  Init();
  form.reset();
  closep();
}

// Generate Random ID
function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

// Add transaction to DOM
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
    ${transaction.text} <span>&#8377;${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">Remove</button>
    <button class="edit-btn" onclick="startEditTransaction(${transaction.id})">Edit</button>
  `;

  list.appendChild(item);
}

// Update values
function updateValues() {
  const amounts = transactions.map((t) => t.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter((item) => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expense = (amounts.filter((item) => item < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

  balance.innerHTML = `&#8377;${total}`;
  money_plus.innerHTML = `+&#8377;${income}`;
  money_minus.innerHTML = `-&#8377;${expense}`;
}

// Remove transaction
function removeTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  updateLocalStorage();
  Init();
}

// Start Edit
function startEditTransaction(id) {
  const transaction = transactions.find((t) => t.id === id);
  if (transaction) {
    editIdInput.value = transaction.id;
    text.value = transaction.text;
    amount.value = transaction.amount;
    document.getElementById("popup-title").innerText = "Edit Transaction";
    document.getElementById("popup").style.display = "block";
  }
}

// Final edit logic
function editTransaction(id, updatedData) {
  transactions = transactions.map((transaction) =>
    transaction.id === id ? { ...transaction, ...updatedData } : transaction
  );
}

// Update local storage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initialize app
function Init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

Init();
form.addEventListener("submit", addTransaction);

// Search Bar
document.getElementById("search-bar").addEventListener("input", function (search) {
  const query = search.target.value.toLowerCase().trim();
  list.innerHTML = "";
  const filtered = transactions.filter((t) => t.text.toLowerCase().includes(query));
  filtered.forEach(addTransactionDOM);
});
