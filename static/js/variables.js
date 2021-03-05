"use strict"

const keys = {
    "operationStatus" : "status",
    "message" : "message",
    "boardTitle" : "board title",
    "boardId" : "board id",
    "columns" : "columns",
    "columnName" : "column name",
    "columnId" : "column id",
    "cardTitle" : "card title",
    "cards" : "cards",
    "cardName" : "card name",
    "cardId" : "card id",
    "cardPriority": "card priority",
    "enterKey": "Enter",
    "escKey": "Escape",
}

let columnContainer;
let boardTitle;


let boardId;
let boardData;
let draggedElement;

let clickNum = 0;