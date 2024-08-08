document.getElementById('submissionForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const pinCode = document.getElementById('pinCode').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    
    const foodCheckboxes = document.querySelectorAll('input[name="food"]:checked');
    const foodValues = Array.from(foodCheckboxes).map(cb => cb.value).join(', ');

    const state = document.getElementById('state').value;
    const country = document.getElementById('country').value;

    
    const tableBody = document.querySelector('#dataTable tbody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${firstName}</td>
        <td>${lastName}</td>
        <td>${email}</td>
        <td>${pinCode}</td>
        <td>${gender}</td>
        <td>${foodValues}</td>
        <td>${state}</td>
        <td>${country}</td>
    `;

    tableBody.appendChild(newRow);

    // Clear form fields
    document.getElementById('submissionForm').reset();
});
