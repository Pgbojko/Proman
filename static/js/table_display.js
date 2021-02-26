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


const loadBoard = function (boardObject) {
    boardData = boardObject
    displayBoard(boardObject)
    setListeners();
}


const displayBoard = function (boardObject) {
    boardTitle.textContent = boardObject[keys.boardTitle];
    createColumns(boardObject[keys.columns]);
}


const createColumns = function (columnsList) {
    addColBtn()
    addColumnContainer(columnsList);
    addColumnHeader(columnsList, 0);
    addCardsToColumn(columnsList);
    newCardBtn()
}


const addColBtn = function () {
    let columnEL = `    
    <div class="add-col-div">
        <button class="add-col-btn">
            <img class="add-col-btn-img" alt="add-col-btn" src="/static/images/add_button.png">
        </button>
        <div class="new-col-modal hidden">
            <label for="new-column-name">New Column header:</label><br><br>
            <input name="new-col-name" id="new-column-name" type="text" maxlength="20" minlength="1"><br><br>
            <button type="submit" name="submit-col-name" class="submit-col-name" id="submit-col-name">Submit</button>
        </div>
    </div>`
    columnContainer.insertAdjacentHTML("afterbegin", columnEL);
}


const addColumnContainer = function (columnList) {
    const addColDiv = document.querySelector(".add-col-div");
    let columnEl = "";

    for(let i = 0; i < columnList.length; i++) {
        columnEl += `<div class="column"></div>`
    }
    addColDiv.insertAdjacentHTML("beforebegin", columnEl);
}


const addColumnHeader = function (columnList, firstIndex) {
    const columnEls = document.querySelectorAll(".column");

    columnList.forEach(column => {
        let headerEl = `
            <div class="column-header" id="${column[keys.columnName]}">
                <h2>${column[keys.columnName]}</h2>
                <button type="button" class="del-col-btn" data-column-id="${column[keys.columnId]}">
                    <img alt="del-col-btn-img" class="del-col-btn-img" data-column-id="${column[keys.columnId]}" src="/static/images/delete-btn.png">
                </button>
            </div>`

        columnEls[firstIndex].insertAdjacentHTML("afterbegin", headerEl);
        firstIndex++;
    })
}


const addCardsToColumn = function (columnList) {
    let cardEls;
    let i = 0;
    const columnEls = document.querySelectorAll(".column");

    columnList.forEach(column => {
        cardEls = "";
        column[keys.cards].forEach(function (card) {
            cardEls += `
            <div class="card">
                <p>${card[keys.cardTitle]}</p>
                <button type="button" class="del-card-btn" data-card-id="${card[keys.cardId]}">
                    <img alt="del-card-btn-img" class="del-card-btn-img" data-card-id="${card[keys.cardId]}" src="/static/images/delete-card-btn.png">
                </button>
            </div>`
        })
        columnEls[i].insertAdjacentHTML("beforeend", cardEls);
        i++;
    })
}


const newCardBtn = function () {
    const columns = document.querySelector(".column");

    let cardBtnEl = `
        <div class="add-card-div">
            <button type="button" class="add-card-btn">
                <img class="add-card-btn-img" src="/static/images/add_col_button.png" alt="add-card-btn">
            </button>
            <div class="new-card-modal hidden">
                <label for="new-card-name">Card Title:</label><br><br>
                <input name="new-card-name" id="new-card-name" type="text" maxlength="20" minlength="1"><br><br>
                <button type="submit" name="submit-card-name" class="submit-card-name">Submit</button>
            </div>
        </div>`;

    columns.insertAdjacentHTML("beforeend", cardBtnEl);
}


function init () {
    boardId = boardContainer.dataset.baordId;
    getBoardData();
}


init()
