"use strict"


function init () {
    const boardListContainer = document.querySelector(".board-list-container");
    boardListContainer.classList.add("hidden");
    boardListContainer.insertAdjacentHTML("afterend", boardContainerElement(boardId));
    boardId = document.querySelector(".board-container").dataset.baordId;

    getBoardData(boardId);
}


const loadBoard = function (boardObject) {
    boardTitle = document.querySelector(".board-title");
    boardData = boardObject;
    boardTitle.textContent = boardData[keys.boardTitle];
    createColumns(boardData[keys.columns]);
    listenersHandler();
}


const createColumns = function (columnsList) {
    addColBtn();
    if (columnsList.length > 0) {
        addColumns(columnsList);
        addColumnHeader(columnsList, 0);
        addCardContainer(columnsList, 0);
        addCardsToColumn(columnsList);
        addNewCardBtn();
    }
}


const addColBtn = function () {
    columnContainer = document.querySelector(".column-container");
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
            cardEls += addCardToColumnHTMLElement(card);
        })
        cardContainers[i].insertAdjacentHTML("beforeend", cardEls);
        i++;
    })
}


const addNewCardBtn = function () {
    const columns = document.querySelector(".column");

    let cardBtnEl = addCardBtnHTMLElement();

    columns.insertAdjacentHTML("beforeend", cardBtnEl);
}


const hideAddColModal = function (modalEl) {
    modalEl.classList.add("hidden");
}
