"use strict"

// const GET_DATA_URL = `/${boardId}/board-data`;
const BOARD_TITLE_KEY = "board title";
const COLUMNS_KEY = "columns";
const COLUMN_NAME_KEY = "column name";

const boardContainer = document.querySelector(".table-container");
const boardTitle = document.querySelector(".table-title");
const column_Container = document.querySelector(".column-container");

let boardData;

const loadBoard = function () {
    let boardId = boardContainer.dataset.baordId
    getBoardData(`/${boardId}/board-data`)

}

const getBoardData = function (url) {
    fetch(url, {
        method: "GET",
        credentials: "same-origin"
    })
    .then(response => response.json())
    .then(json_response => displayBoard(json_response));
}

const displayBoard = function (boardObject) {
    boardData = boardObject;
    boardTitle.textContent = boardObject[BOARD_TITLE_KEY];
    createColumnDiv(boardObject[COLUMNS_KEY]);
    // boardObject[COLUMNS_KEY].forEach(col => createColumnDiv(col[COLUMN_NAME_KEY]));

}

const createColumnDiv = function (columns_list) {
    let column_div = "";

    columns_list.forEach(function (column) {
        column_div += `
        <div class="column-header" id="${column[COLUMN_NAME_KEY]}">
            <h2>${column[COLUMN_NAME_KEY]}</h2>
        </div>`
    })
     column_Container.insertAdjacentHTML("afterbegin", column_div);
}

// const get_board_data = function () {
//     let boardId = boardContainer.dataset.baordId
//     fetch(`/${boardId}/board-data`, {
//             method: 'GET',
//             credentials: 'same-origin'
//         })
//     .then(response => response.json())
//     .then(function (json_response) {
//         board_data = json_response;
//         console.log(board_data);
//         });
// }

// const display_board = function () {
//     board_data = get_board_data()
//     boardTitle.textContent = board_data[BORD_TITLE_KEY];
//
// }

loadBoard()
