"use strict"


function init () {
    boardId = boardContainer.dataset.baordId;
    getBoardData();
}


const loadBoard = function (boardObject) {
    boardData = boardObject
    boardTitle.textContent = boardObject[keys.boardTitle];
    createColumns(boardObject[keys.columns]);
    listenersHandler()
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
    columnContainer.insertAdjacentHTML("afterbegin", addColumnHTMLElement);
}


const addColumns = function (columnList) {
    const addColDiv = document.querySelector(".add-col-div");
    let columnEl = "";

    columnList.forEach(column => {
        columnEl += columnHTMLElement(column);
    })

    addColDiv.insertAdjacentHTML("beforebegin", columnEl);
}


const addColumnHeader = function (columnList, firstIndex) {
    const columnEls = document.querySelectorAll(".column");

    columnList.forEach(column => {
        columnEls[firstIndex].insertAdjacentHTML("afterbegin", columnHeaderHTMLElement(column));
        firstIndex++;
    })
}

const addCardContainer = function (columnsList, firstIndex) {
    const columnEls = document.querySelectorAll(".column-header");
    columnsList.forEach(column => {
        columnEls[firstIndex].insertAdjacentHTML("afterend", cardContainerHTMLElement(column));
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
            cardEls += addCardToColumnHTMLElement(card)
        })
        cardContainers[i].insertAdjacentHTML("beforeend", cardEls);
        i++;
    })
}


const addNewCardBtn = function () {
    const columns = document.querySelector(".column");

    let cardBtnEl = addCardBtnHTMLElement()

    columns.insertAdjacentHTML("beforeend", cardBtnEl);
}


const hideAddColModal = function (modalEl) {
    modalEl.classList.add("hidden");
}


init()
