"use strict"

const getBoardData = function () {
    const url = `/${boardId}/board-data`
    fetch(url, {
        method: "GET",
        credentials: "same-origin"
    })
    .then(response => response.json())
    .then(json_response => loadBoard(json_response));
}


const sendNewColData = function () {
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
            const addCardBtn = document.querySelector(".add-card-div")
            if (data[keys.operationStatus]) {
                const columnELs = document.querySelectorAll(".column")
                addColumns(data[keys.columns]);
                addColumnHeader(data[keys.columns], columnELs.length);
                addCardContainer(data[keys.columns], columnELs.length)
            }
            console.log(data[keys.message])
            if (!document.querySelector(".column").contains(addCardBtn)) {
                    addNewCardBtn()
                }
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
                const allColumns = document.querySelectorAll(".column");
                const addCardBtn = document.querySelector(".add-card-div");
                allColumns.forEach(column => {
                    if (column.querySelector("button").dataset.columnId === columnId) {
                        column.remove();
                    }
                })
                if (!document.querySelector(".column").contains(addCardBtn)) {
                    addNewCardBtn();
                }
            }
            console.log(data[keys.message]);
        })
}

const addNewCard = function () {
    const newCardInput = document.getElementById("new-card-name");
    const cardContainer = document.querySelector(".card-container");
    const modalEl = document.querySelector(".new-card-modal");
    const firstColId = document.querySelector(".column").dataset.columnId;
    const dataToSend = {
        method : "POST",
        headers : {
            "Content-Type": "application/json"
        },
        body : JSON.stringify({
            "board id" : boardId,
            "card name" : newCardInput.value,
            "column id" : firstColId
        })
    };
    fetch("/add-new-card", dataToSend)
        .then(response => response.json())
        .then(data => {
            if (data[keys.operationStatus]) {
                cardContainer.insertAdjacentHTML("beforeend", addCardToColumnHTMLElement(data));
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
                        card.remove();
                        // document.querySelector(".card-container").lastElementChild.remove();

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


const updateTitle = function (newTitle, id, isColumn) {
    let dataToSend = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "title": newTitle,
            "id": id,
            "is column": isColumn
        })
    }
    fetch("/update-title", dataToSend);
}


const addNewPublicBoradToDB = function () {
    const newBoardTitleEl = document.querySelector(".new-title-input");
    let dataToSend = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "board title": newBoardTitleEl.value
        })
    }
    fetch("/new-public-board", dataToSend)
        .then(response => response.json())
        .then(data => injectNewBoardData(data, newBoardTitleEl))
            // let newBoardId = data["board id"];
            // let newBoardTitle = data["board title"];
            // newBoardTitleEl.parentElement.dataset.BoardId = newBoardId;
            // newBoardTitleEl.parentElement.insertAdjacentHTML("afterbegin", boardTitleElement(newBoardId, newBoardTitle))
            // document.querySelectorAll(".add-new-board-btn").forEach(btn => btn.classList.remove("hidden"))
            // newBoardTitleEl.remove()
}

const addNewPrivateBoardToDB = function (userId) {
    const newBoardTitleEl = document.querySelector(".new-title-input");
    let dataToSend = {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            "board title" : newBoardTitleEl.value,
            "user id" : userId
        })
    }
    fetch("/new-private-board", dataToSend)
        .then(response => response.json())
        .then(data => injectNewBoardData(data, newBoardTitleEl))
}

const injectNewBoardData = function (data, newBoardTitleEl) {
    let newBoardId = data["board id"];
    let newBoardTitle = data["board title"];
    newBoardTitleEl.parentElement.dataset.BoardId = newBoardId;
    newBoardTitleEl.parentElement.insertAdjacentHTML("afterbegin", boardTitleElement(newBoardId, newBoardTitle))
    document.querySelectorAll(".add-new-board-btn").forEach(btn => btn.classList.remove("hidden"))
    newBoardTitleEl.remove()
}


const delBoard = function (boardId) {
    let dataToSend = {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            "board id" : boardId
        })
    }
    fetch(`/${boardId}/delete`, dataToSend)

    let boards = document.querySelectorAll(".board-block")
    boards.forEach(board => {
        console.log(board.dataset.boardId === boardId || board.dataset.BoardId === boardId)
        if (board.dataset.boardId === boardId || board.dataset.BoardId === boardId) {
            board.remove();
        }
    })
}

const editBoardTitle = function (boardId) {
    const inputEl = document.querySelector(".new-title-input");
    let dataToSend = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "board id": boardId,
            "board title": inputEl.value
        })
    }
    fetch(`/${boardId}/edit-title`, dataToSend);

}

// const displayBoard = function (boardId) {
//     let dataToSend = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             "board id": boardId
//         })
//     }
//     fetch(`/board/${boardId}`, dataToSend)
// }