const API_URL = "https://localhost:7033/api/Employees"; // Update with your actual API URL

document.addEventListener("DOMContentLoaded", function () {
    fetchEmployees();
    
    document.getElementById("employee-form").addEventListener("submit", saveEmployee);
});

// Fetch employees from API
async function fetchEmployees() {
    const response = await fetch("https://localhost:7033/api/Employees");
    const employees = await response.json();
    
    const tableBody = document.getElementById("employee-table-body");
    tableBody.innerHTML = "";

    employees.forEach(emp => {
        const row = `
            <tr>
                <td>${emp.name}</td>
                <td>${emp.email}</td>
                <td>${emp.position}</td>
                <td>${emp.salary}</td>
                <td>
                    <button class="edit" onclick="editEmployee(${emp.id}, '${emp.name}', '${emp.email}', '${emp.position}', ${emp.salary})">Edit</button>
                    <button onclick="deleteEmployee(${emp.id})">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Save (Add/Edit) Employee
async function saveEmployee(event) {
    event.preventDefault();
    
    const id = document.getElementById("employee-id").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const position = document.getElementById("position").value;
    const salary = document.getElementById("salary").value;

    const employee = { name, email, position, salary: parseFloat(salary) };

    if (id) {
        // Update existing employee
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...employee, id: parseInt(id) })
        });
    } else {
        // Add new employee
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(employee)
        });
    }

    document.getElementById("employee-form").reset();
    document.getElementById("employee-id").value = "";
    fetchEmployees();
}

// Edit employee (Pre-fill form)
function editEmployee(id, name, email, position, salary) {
    document.getElementById("employee-id").value = id;
    document.getElementById("name").value = name;
    document.getElementById("email").value = email;
    document.getElementById("position").value = position;
    document.getElementById("salary").value = salary;
}

// Delete Employee
async function deleteEmployee(id) {
    if (confirm("Are you sure you want to delete this employee?")) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchEmployees();
    }
}
