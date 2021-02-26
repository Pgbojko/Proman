"user strict"

const setListeners = function () {
    const colContainer = document.querySelector(".column-container");
    onClickListener(colContainer, event => {
        if (event.target.classList.contains("del-col-btn-img")) {
            const columnId = event.target.dataset.columnId;
            delColFromDB(columnId);
        } else if (event.target.classList.contains("add-card-btn-img")) {
            const modalEl = document.querySelector(".new-card-modal");
            modalEl.classList.toggle("hidden");
        } else if (event.target.classList.contains("add-col-btn-img")) {
            const modalEl = document.querySelector(".new-col-modal");
            modalEl.classList.toggle("hidden");
        } else if (event.target.classList.contains("submit-col-name")) {
            sendNewColData(event);
        } else if (event.target.classList.contains("submit-card-name")) {
            addNewCard();
        } else if (event.target.classList.contains("del-card-btn-img")) {
            const cardId = event.target.dataset.cardId;
            console.log(cardId);
            delCardFromDb(cardId)
        }
    })
}


const onClickListener = function (btnEls, actionToPerform) {
    btnEls.addEventListener('click', actionToPerform);
}


const hideAddColModal = function (modalEl) {
    modalEl.classList.add("hidden");
}


const sendNewColData = function (event) {
    const NewColName = document.querySelector("#new-column-name");
    const newColumnModal = document.querySelector(".new-col-modal");
    const dataToSend = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
                },
            body: JSON.stringify({
                "board_id": boardId,
                "column_name": NewColName.value
                })
        };
    fetch('/add-new-column', dataToSend)
     .then( response => response.json())
        .then(data => {
            if (data[keys.operationStatus]) {
                const columnELs = document.querySelectorAll(".column")
                addColumnContainer(data[keys.columns]);
                addColumnHeader(data[keys.columns], columnELs.length);
            }
            console.log(data[keys.message])
        });
    hideAddColModal(newColumnModal);
}

const delColFromDB = function (columnId) {
    let dataToSend = {
        method: "POST",
        headers: {
                "Content-Type": "application/json"
                },
            body: JSON.stringify({
                "column id": columnId,
                })
        };
    fetch('/delete-column', dataToSend)
        .then(response => response.json())
        .then(data => {
            if (data[keys.operationStatus]) {
                const allColumns = document.querySelectorAll(".column")
                allColumns.forEach(column => {
                    if (column.querySelector("button").dataset.columnId === columnId) {
                        column.remove()
                    }
                })
            }
            console.log(data[keys.message])
        })
}

const addNewCard = function () {
    const newCardInput = document.getElementById("new-card-name");
    const addCardBtn = document.querySelector(".add-card-div");
    const modalEl = document.querySelector(".new-card-modal");
    const dataToSend = {
        method : "POST",
        headers : {
            "Content-Type": "application/json"
        },
        body : JSON.stringify({
            "board id" : boardId,
            "card name" : newCardInput.value
        })
    };
    fetch("/add-new-card", dataToSend)
        .then(response => response.json())
        .then(data => {
            if (data[keys.operationStatus]) {
                let newCard = `
                    <div class="card">
                        <p>${data[keys.cardTitle]}</p>
                        <button type="button" class="del-card-btn" data-card-id="${card[keys.cardId]}">
                            <img alt="del-card-btn-img" class="del-card-btn-img" data-card-id="${card[keys.cardId]}" src="/static/images/delete-card-btn.png">
                        </button>
                    </div>`
                addCardBtn.insertAdjacentHTML("beforebegin", newCard)

            }
            console.log(data[keys.message])
        })
    hideAddColModal(modalEl);
}


const delCardFromDb = function (cardId) {
    let dataToSend = {
        method: "POST",
        headers: {
                "Content-Type": "application/json"
                },
            body: JSON.stringify({
                "card id": cardId,
                })
        };
    fetch("/delete-card", dataToSend)
        .then(response => response.json())
        .then(data => {
            if (data[keys.operationStatus]) {
                const cardsList = document.querySelectorAll(".card");
                cardsList.forEach(card => {
                    if (card.querySelector("button").dataset.cardId === cardId) {
                        card.remove()
                    }
                })
            }
            console.log(data[keys.message])
        })
}