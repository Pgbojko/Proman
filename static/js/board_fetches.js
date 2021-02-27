"use strict"

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
                addColumns(data[keys.columns]);
                addColumnHeader(data[keys.columns], columnELs.length);
                addCardContainer(data[keys.columns], columnELs.length)
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
    const cardContainer = document.querySelector(".card-container");
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
                    <div class="card" draggable="true" data-card-id="${data[keys.cardId]}">
                        <p>${data[keys.cardTitle]}</p>
                        <button type="button" class="del-card-btn" data-card-id="${data[keys.cardId]}" draggable="false">
                            <img alt="del-card-btn-img" class="del-card-btn-img" data-card-id="${data[keys.cardId]}" src="/static/images/delete-card-btn.png" draggable="false">
                        </button>
                    </div>`
                cardContainer.insertAdjacentHTML("beforeend", newCard)

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


const updateCardStatus = function (cardId, columnId) {
    let dataToSend = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "card id": cardId,
            "column id": columnId
        })
    }
    fetch("/update-card-status", dataToSend)
}