const form = document.querySelector(".info");
const moneyList = document.querySelector("#money-list");

const deleteModeButton = document.querySelector("#delete-mode");

let deleteMode = false;

const moneyData = {
    food: {
        total: 0,
        details: []
    },

    "travel-cost": {
        total: 0,
        details: []
    },

    "house-money": {
        total: 0,
        details: []
    },

    other: {
        total: 0,
        details: []
    }
};

const typeLabels = {
    food: "🍚 食事",
    "travel-cost": "🚃 移動費",
    "house-money": "🏠 家賃",
    other: "🌷 その他"
};

const savedData = localStorage.getItem("moneyData");

if (savedData) {
    const loadedData = JSON.parse(savedData);
    Object.assign(moneyData, loadedData);
}

function renderMoneyList() {
    moneyList.innerHTML = "";

    for (const key in moneyData) {
        const expense = document.createElement("div");

        expense.innerHTML = `
            <div class="expense-header">
                <span>${typeLabels[key]}</span>
                <span>${moneyData[key].total.toLocaleString()}円</span>
            </div>

            <div class="expense-details"></div>

            <hr>
        `;

        const header = expense.querySelector(".expense-header");
        const detailsArea = expense.querySelector(".expense-details");

        header.addEventListener("click", function() {
            if (detailsArea.innerHTML !== "") {
                detailsArea.innerHTML = "";
                return;
            }

            moneyData[key].details.forEach(function(item, index) {
                const detail = document.createElement("p");

                detail.textContent =
                    `${item.date}　${item.details}　${item.amount.toLocaleString()}円`;

                if (deleteMode) {
                    detail.style.cursor = "pointer";
                    detail.style.color = "red";

                    detail.addEventListener("click", function(event) {
                        event.stopPropagation();

                        const result = confirm("この明細を削除しますか？");

                        if (!result) {
                            return;
                        }

                        moneyData[key].total -= item.amount;

                        moneyData[key].details.splice(index, 1);

                        localStorage.setItem(
                            "moneyData",
                            JSON.stringify(moneyData)
                        );

                        renderMoneyList();
                    });
                }

                detailsArea.appendChild(detail);
            });
        });

        moneyList.appendChild(expense);
    }
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const type = document.querySelector("#trade-type").value;
    const details = document.querySelector("#details").value;
    const date = document.querySelector("#date").value;
    const amount = Number(document.querySelector("#amount").value);

    moneyData[type].total += amount;

    moneyData[type].details.push({
        details: details,
        date: date,
        amount: amount
    });

    localStorage.setItem(
        "moneyData",
        JSON.stringify(moneyData)
    );

    renderMoneyList();

    form.reset();
});

deleteModeButton.addEventListener("click", function() {
    deleteMode = !deleteMode;

    if (deleteMode) {
        deleteModeButton.textContent = "削除モード終了";
    } else {
        deleteModeButton.textContent = "削除";
    }

    renderMoneyList();
});

renderMoneyList();