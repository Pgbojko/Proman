"use strict"

const mainPageListenersHandler = function () {
    setHeaderListener();
    setBoardDisplayListener();
    addPublicBoardBtnListener();
    setBoardKeyboardListener();
    setBoardsDblClickListeners();
}

const setHeaderListener = function () {
    document.addEventListener('click', event => {
        if (event.target.classList.contains("sign-in") || event.target.classList.contains("sign-up")) {
            showHideSignInModal();
        } else if (event.target.classList.contains("blur-background")) {
            showHideSignInModal();
        } else if (event.target.classList.contains("del-board-btn") || event.target.classList.contains("del-board-btn-img")) {
            const boardId =  event.target.parentElement.dataset.boardId;
            delBoard(boardId);
        }
    })
}


const setBoardKeyboardListener = function () {
    document.addEventListener('keyup', event => {
        if (event.key === keys.enterKey && event.target.value.length > 0) {
            if (event.target.classList.contains("private-board-input")) {
                handlePrivateBoardInput();
            } else if (event.target.classList.contains("public-board-input")) {
                handlePublicBoardInput();
            } else if (event.target.classList.contains("new-title-input")) {
                handleNewTitleInput();
            }
        } else if (event.key === keys.escKey) {
            onEscBtn();
        }
    })
}


const handlePrivateBoardInput = function () {
    const userId = document.querySelector(".private-boards").dataset.userId;
    addNewPrivateBoardToDB(userId);
    let newDiv = document.querySelector(".new-board-block");
    newDiv.classList.remove("new-board-block");
    newDiv.classList.add("board-block");
}


const handlePublicBoardInput = function () {
    addNewPublicBoradToDB();
    let newDiv = document.querySelector(".new-board-block");
    newDiv.classList.remove("new-board-block");
    newDiv.classList.add("board-block");
}


const handleNewTitleInput = function () {
    boardId = document.querySelector(".new-title-input").parentElement.dataset.boardId;
    editBoardTitle(boardId);
    let inputEl = document.querySelector(".new-title-input");
    let titleEl = inputEl.parentElement.querySelector(".hidden");
    titleEl.textContent = inputEl.value;
    titleEl.classList.remove("hidden");
    inputEl.remove();
}


const onEscBtn = function () {
    let newBoard = document.querySelector(".new-board-block");
    let newTitleInput = document.querySelector(".new-title-input");
    if (newBoard) {
        newBoard.remove();
        document.querySelectorAll(".add-new-board-btn").forEach(btn => btn.classList.remove("hidden"));
    } else if (newTitleInput) {
        removeTitleInputField();
    }
}


const setBoardDisplayListener = function () {
    const boardBtns = document.querySelector(".board-list-container");
    boardBtns.addEventListener('click', event => {
        clickNum++;
        setTimeout( () => {
            if (clickNum === 1 && (event.target.classList.contains("board-block-title") || event.target.classList.contains("board-block"))) {
                boardId = event.target.dataset.boardId;
                init();
            }
            clickNum = 0;
        }, 300);
    })
}


const setBoardsDblClickListeners = function () {
    const boardListContainer = document.querySelector(".board-list-container");
    boardListContainer.addEventListener('dblclick', event => {
         if (event.target.classList.contains("board-block-title")) {
            setEditTitleField(event);
        }
        clickNum = 0;
    })
}


const addPublicBoardBtnListener = function () {
    const boardListContainer = document.querySelector(".board-list-container");
    boardListContainer.addEventListener("click", event => {
        if (event.target.classList.contains("public-board")) {
            createNewPublicBoard();
        } else if (event.target.classList.contains("private-board")) {
            createNewPrivBoard();
        }
    })
}


const createNewPublicBoard = function () {
    document.querySelector(".public-board-btn").insertAdjacentHTML("beforebegin", newPublicBoardElement());
    document.querySelectorAll(".add-new-board-btn").forEach(btn => btn.classList.add("hidden"));
}


const createNewPrivBoard = function () {
    document.querySelector(".private-board-btn").insertAdjacentHTML("beforebegin", newPrivateBoardElement());
    document.querySelectorAll(".add-new-board-btn").forEach(btn => btn.classList.add("hidden"));
}


const setEditTitleField = function (event) {
    let title =  event.target.textContent;
    let input = `<input class="new-title-input" value="${title}" minlength="1" maxlength="20">`;
    event.target.classList.add("hidden");
    event.target.parentElement.insertAdjacentHTML('afterbegin', input);
    document.querySelector(".new-title-input").focus();
}


mainPageListenersHandler();