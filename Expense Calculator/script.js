document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('entry-form');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const typeInput = document.getElementById('type');
    const entriesList = document.getElementById('entries-list');
    const totalIncome = document.getElementById('total-income');
    const totalExpense = document.getElementById('total-expense');
    const netBalance = document.getElementById('net-balance');
    const resetBtn = document.getElementById('reset-btn');
    const filters = document.querySelectorAll('input[name="filter"]');
  
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
  
    // Validate amount input to accept only numbers and decimal point
    amountInput.addEventListener('input', (e) => {
        // Remove any non-numeric characters except decimal point
        e.target.value = e.target.value.replace(/[^0-9.]/g, '');
        
        // Ensure only one decimal point is present
        const decimalCount = e.target.value.split('.').length - 1;
        if (decimalCount > 1) {
            e.target.value = e.target.value.substring(0, e.target.value.lastIndexOf('.'));
        }
        
        // Limit to 2 decimal places
        if (e.target.value.includes('.')) {
            const decimalPart = e.target.value.split('.')[1];
            if (decimalPart.length > 2) {
                e.target.value = parseFloat(e.target.value).toFixed(2);
            }
        }
    });
  
    const renderEntries = (filter = 'all') => {
      entriesList.innerHTML = '';
      
      if (entries.length === 0) {
          entriesList.innerHTML = `
              <li class="empty-state">
                  <i class="fas fa-receipt"></i>
                  <p>No transactions yet</p>
                  <small>Add your first transaction above</small>
              </li>
          `;
          return;
      }
      
      const filteredEntries = filter === 'all' ? entries : entries.filter(entry => entry.type === filter);
  
      filteredEntries.forEach((entry, index) => {
        const li = document.createElement('li');
        li.className = `transaction-item ${entry.type}`;
        li.innerHTML = `
          <div class="transaction-content">
            <div class="transaction-description">${entry.description}</div>
            <div class="transaction-type ${entry.type}">${entry.type}</div>
          </div>
          <div class="transaction-amount ${entry.type}">$${entry.amount.toFixed(2)}</div>
          <div class="transaction-actions">
            <button onclick="editEntry(${index})" class="edit-btn">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="deleteEntry(${index})" class="delete-btn">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        `;
        entriesList.appendChild(li);
      });
      updateSummary();
    };
  
    const updateSummary = () => {
      const income = entries.filter(entry => entry.type === 'income')
                          .reduce((sum, entry) => sum + entry.amount, 0);
      const expense = entries.filter(entry => entry.type === 'expense')
                          .reduce((sum, entry) => sum + entry.amount, 0);
      const balance = income - expense;
      
      totalIncome.textContent = `$${income.toFixed(2)}`;
      totalExpense.textContent = `$${expense.toFixed(2)}`;
      netBalance.textContent = `$${balance.toFixed(2)}`;
      
      // Change color based on balance
      if (balance >= 0) {
        netBalance.className = 'card-value';
        netBalance.style.color = 'var(--success)';
      } else {
        netBalance.className = 'card-value';
        netBalance.style.color = 'var(--danger)';
      }
    };
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const description = descriptionInput.value.trim();
      const amount = parseFloat(amountInput.value);
      const type = typeInput.value;
  
      if (description && !isNaN(amount) && amount > 0 && type) {
        entries.push({ 
            description, 
            amount: parseFloat(amount.toFixed(2)), 
            type 
        });
        localStorage.setItem('entries', JSON.stringify(entries));
        renderEntries();
        form.reset();
      } else {
        alert('Please enter valid transaction details:\n- Description\n- Positive amount\n- Transaction type');
      }
    });
  
    window.editEntry = (index) => {
      const entry = entries[index];
      descriptionInput.value = entry.description;
      amountInput.value = entry.amount;
      typeInput.value = entry.type;
      entries.splice(index, 1);
      localStorage.setItem('entries', JSON.stringify(entries));
      renderEntries();
    };
    
  
    window.deleteEntry = (index) => {
      if (confirm('Are you sure you want to delete this transaction?')) {
        entries.splice(index, 1);
        localStorage.setItem('entries', JSON.stringify(entries));
        renderEntries();
      }
    };
  
    resetBtn.addEventListener('click', () => {
      form.reset();
    });
  
    filters.forEach(filter => {
      filter.addEventListener('change', (e) => {
        renderEntries(e.target.value);
      });
    });
  
    renderEntries();
});
