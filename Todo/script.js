let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editIndex = null;

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const transactionList = document.getElementById("transactionList");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const netBalanceEl = document.getElementById("netBalance");
const filterRadios = document.querySelectorAll("input[name='filter']");

document.getElementById("transactionForm").addEventListener("submit", addTransaction);
document.getElementById("resetBtn").addEventListener("click", resetForm);
filterRadios.forEach(radio => radio.addEventListener("change", renderTransactions));

function addTransaction(e) {
    e.preventDefault();
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = document.querySelector("input[name='type']:checked").value;

    if (editIndex !== null) {
        transactions[editIndex] = { description, amount, type };
        editIndex = null;
    } else {
        transactions.push({ description, amount, type });
    }

    saveTransactions();
    renderTransactions();
    resetForm();
}

function resetForm() {
    descriptionInput.value = "";
    amountInput.value = "";
    document.querySelector("input[name='type'][value='income']").checked = true;
}

function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    saveTransactions();
    renderTransactions();
}

function editTransaction(index) {
    const transaction = transactions[index];
    descriptionInput.value = transaction.description;
    amountInput.value = transaction.amount;
    document.querySelector(`input[name='type'][value='${transaction.type}']`).checked = true;
    editIndex = index;
}

function renderTransactions() {
    transactionList.innerHTML = "";
    const filterValue = document.querySelector("input[name='filter']:checked").value;

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction, index) => {
        if (filterValue === "all" || transaction.type === filterValue) {
            const li = document.createElement("li");
            li.classList.add(transaction.type);

            li.innerHTML = `
                <span>${transaction.description} - ₹${transaction.amount}</span>
                <div class="actions">
                    <button onclick="editTransaction(${index})">Edit</button>
                    <button onclick="deleteTransaction(${index})">Delete</button>
                </div>
            `;
            transactionList.appendChild(li);
        }

        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }
    });

    totalIncomeEl.textContent = totalIncome;
    totalExpenseEl.textContent = totalExpense;
    netBalanceEl.textContent = totalIncome - totalExpense;
}

renderTransactions();
