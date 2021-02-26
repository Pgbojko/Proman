"use strict"

const keys = {
    "operationStatus" : "status",
    "message" : "message",
    "boardTitle" : "board title",
    "columns" : "columns",
    "columnName" : "column name",
    "columnId" : "column id",
    "cardTitle" : "card title",
    "cards" : "cards",
    "cardName" : "card name",
}


const boardContainer = document.querySelector(".board-container");
const boardTitle = document.querySelector(".board-title");
const columnContainer = document.querySelector(".column-container");


let boardId;
let boardData;