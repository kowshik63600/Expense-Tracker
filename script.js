let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let chart;

updateUI();

function addTransaction() {
    const text = document.getElementById("text").value;
    const amount = document.getElementById("amount").value;

    if (text === "" || amount === "") {
        alert("Please enter details");
        return;
    }

    const transaction = {
        id: Date.now(),
        text,
        amount: +amount
    };

    transactions.push(transaction);

    saveData();
    updateUI();

    document.getElementById("text").value = "";
    document.getElementById("amount").value = "";
}

function updateUI() {
    const list = document.getElementById("list");
    list.innerHTML = "";

    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
        const li = document.createElement("li");

        li.classList.add(t.amount > 0 ? "income" : "expense");

        li.innerHTML = `
      ${t.text} ₹${t.amount}
      <button onclick="deleteTransaction(${t.id})">❌</button>
    `;

        list.appendChild(li);

        if (t.amount > 0) income += t.amount;
        else expense += t.amount;
    });

    document.getElementById("income").innerText = "₹" + income;
    document.getElementById("expense").innerText = "₹" + Math.abs(expense);
    document.getElementById("balance").innerText = "₹" + (income + expense);

    updateChart(income, Math.abs(expense));
}

function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveData();
    updateUI();
}

function saveData() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

/* 🔥 CHART FUNCTION */
function updateChart(income, expense) {
    const ctx = document.getElementById("chart");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Income", "Expense"],
            datasets: [{
                data: [income, expense],
                backgroundColor: ["#22c55e", "#ef4444"]
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: "#fff"
                    }
                }
            }
        }
    });
}