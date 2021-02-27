"use strict"


function init () {
    boardId = boardContainer.dataset.baordId;
    getBoardData();
}


const getBoardData = function () {
    const url = `/${boardId}/board-data`
    fetch(url, {
        method: "GET",
        credentials: "same-origin"
    })
    .then(response => response.json())
    .then(json_response => loadBoard(json_response));
}


const loadBoard = function (boardObject) {
    boardData = boardObject
    boardTitle.textContent = boardObject[keys.boardTitle];
    createColumns(boardObject[keys.columns]);
    setClickListeners();
    dragAndDropHandler();
}


const createColumns = function (columnsList) {
    addColBtn()
    addColumns(columnsList);
    addColumnHeader(columnsList, 0);
    addCardContainer(columnsList, 0);
    addCardsToColumn(columnsList);
    addNewCardBtn()
}


const addColBtn = function () {
    let columnEL = `    
    <div class="add-col-div">
        <button class="add-col-btn" draggable="false">
            <img class="add-col-btn-img" alt="add-col-btn" src="/static/images/add_button.png" draggable="false">
        </button>
        <div class="new-col-modal hidden" draggable="false">
            <label class="label" for="new-column-name" >Column Header:</label><br><br>
            <input class="input" name="new-col-name" id="new-column-name" type="text" maxlength="20" minlength="1"><br><br>
            <button type="submit" name="submit-col-name" class="submit-btn submit-col-name" id="submit-col-name">Submit</button>
        </div>
    </div>`
    columnContainer.insertAdjacentHTML("afterbegin", columnEL);
}


const addColumns = function (columnList) {
    const addColDiv = document.querySelector(".add-col-div");
    let columnEl = "";

    columnList.forEach(column => {
        columnEl += `<div class="column" data-column-id="${column[keys.columnId]}"></div>`
    })

    // for(let i = 0; i < columnList.length; i++) {
    //     columnEl += `<div class="column"></div>`
    // }
    addColDiv.insertAdjacentHTML("beforebegin", columnEl);
}


const addColumnHeader = function (columnList, firstIndex) {
    const columnEls = document.querySelectorAll(".column");

    columnList.forEach(column => {
        let headerEl = `
            <div class="column-header" id="${column[keys.columnName]}">
                <h2 class="col-title">${column[keys.columnName]}</h2>
                <button type="button" class="del-col-btn" data-column-id="${column[keys.columnId]}" draggable="false">
                    <img alt="del-col-btn-img" class="del-col-btn-img" data-column-id="${column[keys.columnId]}" src="/static/images/delete-btn.png" draggable="false">
                </button>
            </div>`

        columnEls[firstIndex].insertAdjacentHTML("afterbegin", headerEl);
        firstIndex++;
    })
}

const addCardContainer = function (columnsList, firstIndex) {
    const columnEls = document.querySelectorAll(".column-header");
    columnsList.forEach(column => {
        let cardContainer = `<div class="card-container" data-column-id="${column[keys.columnId]}"></div>`
        columnEls[firstIndex].insertAdjacentHTML("afterend", cardContainer);
        firstIndex++;
    })
}


const addCardsToColumn = function (columnList) {
    let cardEls;
    let i = 0;
    const cardContainers = document.querySelectorAll(".card-container");

    columnList.forEach(column => {
        cardEls = "";
        column[keys.cards].forEach(function (card) {
            cardEls += `
            <div class="card" draggable="true" data-card-id="${card[keys.cardId]}">
                <p>${card[keys.cardTitle]}</p>
                <button type="button" class="del-card-btn" data-card-id="${card[keys.cardId]}" draggable="false">
                    <img alt="del-card-btn-img" class="del-card-btn-img" data-card-id="${card[keys.cardId]}" src="/static/images/delete-card-btn.png" draggable="false">
                </button>
            </div>`
        })
        cardContainers[i].insertAdjacentHTML("beforeend", cardEls);
        i++;
    })
}


const addNewCardBtn = function () {
    const columns = document.querySelector(".column");

    let cardBtnEl = `
        <div class="add-card-div" draggable="false">
            <button type="button" class="add-card-btn" draggable="false">
                <img class="add-card-btn-img" src="/static/images/add_col_button.png" alt="add-card-btn" draggable="false">
            </button>
            <div class="new-card-modal hidden" draggable="false">
                <label class="label" for="new-card-name">Card Title:</label><br><br>
                <input class="input" name="new-card-name" id="new-card-name" type="text" maxlength="20" minlength="1"><br><br>
                <button type="submit" name="submit-card-name" class="submit-btn submit-card-name">Submit</button>
            </div>
        </div>`;

    columns.insertAdjacentHTML("beforeend", cardBtnEl);
}


const hideAddColModal = function (modalEl) {
    modalEl.classList.add("hidden");
}


init()
