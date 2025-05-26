function pop() {
  document.getElementById("popup").style.display = "block";
}

function closep() {
  document.getElementById("popup").style.display = "none";
}

const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");

const dateValue = document.getElementById("Date-input");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const editIdInput = document.getElementById("edit-id"); // hidden input

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add or Edit Transaction
function addTransaction(e) {
  e.preventDefault();

  const editId = editIdInput.value;

  if (text.value.trim() === '' || amount.value.trim() === '' || dateValue.value.trim() === '') {
    alert('Please add text, amount, and date');
    return;
  }

  if (editId) {
    // Update existing transaction
    const index = transactions.findIndex(t => t.id === +editId);
    if (index !== -1) {
      transactions[index].text = text.value;
      transactions[index].amount = +amount.value;
      transactions[index].date = dateValue.value;
    }
    editIdInput.value = ''; // Clear edit mode
  } else {
    // Add new transaction
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
      date: dateValue.value
    };
    transactions.push(transaction);
  }

  updateLocalStorage();
  Init();

  // Reset form
  text.value = '';
  amount.value = '';
  dateValue.value = '';
  closep();
}

// Generate Random ID
function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

// Add Transactions to DOM List
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");

  item.classList.add(transaction.amount < 0 ? "minus" : "plus");
  item.innerHTML = `
    <strong>${transaction.text}</strong> 
    <span>${transaction.date}</span>
    <span>&#8377;${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">Remove</button>
    <button class="edit-btn" onclick="startEditTransaction(${transaction.id})">Edit</button>
  `;

  list.appendChild(item);
}

// Update Balance, Income, Expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1
  ).toFixed(2);

  balance.innerHTML = `&#8377;${total}`;
  money_plus.innerHTML = `+&#8377;${income}`;
  money_minus.innerHTML = `-&#8377;${expense}`;
}

// Remove Transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  Init();
}

// Start Edit
function startEditTransaction(id) {
  const transaction = transactions.find(t => t.id === id);
  if (transaction) {
    editIdInput.value = transaction.id;
    text.value = transaction.text;
    amount.value = transaction.amount;
    dateValue.value = transaction.date;
    document.getElementById("popup-title").innerText = "Edit Transaction";
    pop();
  }
}

// Update Local Storage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initialize App
function Init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// Search Bar
document.getElementById("search-bar").addEventListener("input", function (search) {
  const bar = search.target.value.toLowerCase().trim();
  list.innerHTML = "";
  const filter = transactions.filter(transaction =>
    transaction.text.toLowerCase().includes(bar)
  );
  filter.forEach(addTransactionDOM);
});

// Initialize and Add Form Listener
Init();
form.addEventListener('submit', addTransaction);
