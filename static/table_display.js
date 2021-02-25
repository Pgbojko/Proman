"use strict"

const BOARD_TITLE_KEY = "board title";
const COLUMNS_KEY = "columns";
const COLUMN_NAME_KEY = "column name";
const CARD_TITLE_KEY = "card title";
const CARDS_KEY = "cards";
const MESSAGE_KEY = "message";
const COLUMN_ADDED = "added";

const boardContainer = document.querySelector(".board-container");
const boardTitle = document.querySelector(".board-title");
const columnContainer = document.querySelector(".column-container");

let boardId;


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
    displayBoard(boardObject)
    setListeners();
}


const displayBoard = function (boardObject) {
    boardTitle.textContent = boardObject[BOARD_TITLE_KEY];
    createColumns(boardObject[COLUMNS_KEY])
    // createColumn(boardObject[COLUMNS_KEY]);
}


const createColumns = function (columnsList) {
    addColBtn()
    addColumnContainer(columnsList);
    addColumnHeader(columnsList, 0);
    addCardsToColumn(columnsList);
}


const addColBtn = function () {
    let columnEL = `    
    <div class="add-col-div">
        <button class="add-col-btn"><img src="/static/images/add_button.png"></button>
    </div>`
    columnContainer.insertAdjacentHTML("afterbegin", columnEL);
}


const addColumnContainer = function (columnList) {
    const addColDiv = document.querySelector(".add-col-div");
    let columnEl = "";

    for(let i = 0; i < columnList.length; i++) {
        columnEl += `<div name="column" class="column"></div>`
    }
    addColDiv.insertAdjacentHTML("beforebegin", columnEl);
}


const addColumnHeader = function (columnList, firstIndex) {
    const columnEls = document.querySelectorAll(".column");

    columnList.forEach(column => {
        let headerEl = `
            <div class="column-header" id="${column[COLUMN_NAME_KEY]}">
                <h2>${column[COLUMN_NAME_KEY]}</h2>
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
        column[CARDS_KEY].forEach(function (card) {
            cardEls += `
            <div name="card" class="card">
                <p>${card[CARD_TITLE_KEY]}</p>
            </div>`
        })
        columnEls[i].insertAdjacentHTML("beforeend", cardEls);
        i++;
    })
}


// const createColumn = function (columnsList) {
//     let columnDOM = "";
//
//     columnsList.forEach(function (column) {
//         columnDOM += `
//         <div name="column" class="column">
//             <div class="column-header" id="${column[COLUMN_NAME_KEY]}">
//                 <h2>${column[COLUMN_NAME_KEY]}</h2>
//             </div>`
//
//         column[CARDS_KEY].forEach(function (card) {
//             columnDOM += `
//             <div name="card" class="card">
//                 <p>${card[CARD_TITLE_KEY]}</p>
//             </div>`
//         })
//         columnDOM += `</div>`
//     })
//     columnDOM += `
//         <div>
//             <button class="add-col-btn"><img src="/static/images/add_button.png"></button>
//         </div>`
//      columnContainer.insertAdjacentHTML("afterbegin", columnDOM);
// }


const setListeners = function () {
    addColumnListener()
}


const addColumnListener = () => {
        const addColumnBtn = document.querySelectorAll(".add-col-btn");
        onClickListener(addColumnBtn, sendNewColData);
    }


const onClickListener = function (btnEls, actionToPerform) {
    btnEls.forEach(el => el.addEventListener('click', actionToPerform));
}


const sendNewColData = function () {
    let dataToSend = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
                },
            body: JSON.stringify({
                "board_id": boardId,
                "column_name": "any string"
                })
        }
    fetch('/add-new-column', dataToSend)
     .then( response => response.json())
        .then(data => {
            if (data[COLUMN_ADDED]) {
                const columnELs = document.querySelectorAll(".column")
                console.log(data[MESSAGE_KEY]);
                addColumnContainer(data[COLUMNS_KEY])
                addColumnHeader(data[COLUMNS_KEY], columnELs.length)
            } else {
                console.log(data[MESSAGE_KEY])
            }
        });
}


function init () {
    boardId = boardContainer.dataset.baordId;
    getBoardData();
}


init()
