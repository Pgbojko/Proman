"user strict"

const listenersHandler = function () {
    setClickListeners();
    setDblClickListener();
    setKeyboardListener();
    dragAndDropHandler();
    // setMouseOverSlots();
    // setMouseOutSlots();
}

const setClickListeners = function () {
    const colContainer = document.querySelector(".column-container");
    colContainer.addEventListener('click', event => {
        if (event.target.classList.contains("del-col-btn-img")) {
            const columnId = event.target.dataset.columnId;
            delColFromDB(columnId);
        } else if (event.target.classList.contains("add-card-btn-img")) {
            const modalEl = document.querySelector(".new-card-modal");
            modalEl.classList.toggle("hidden");
        } else if (event.target.classList.contains("add-col-btn-img")) {
            const modalEl = document.querySelector(".new-col-modal");
            modalEl.classList.toggle("hidden");
        } else if (event.target.classList.contains("submit-col-name")) {
            sendNewColData();
        } else if (event.target.classList.contains("submit-card-name")) {
            addNewCard();
        } else if (event.target.classList.contains("del-card-btn-img")) {
            const cardId = event.target.dataset.cardId;
            delCardFromDb(cardId);
        } else if (!event.target.classList.contains("new-title-input")) {
            removeTitleInputField();
        }
    })
}


const setDblClickListener = function () {
    const colContainer = document.querySelector(".column-container");
    colContainer.addEventListener('dblclick', event => {
        if (event.target.classList.contains("col-title") || event.target.classList.contains("card-title")) {
            let title =  event.target.textContent;
            let input = `<input class="new-title-input" value="${title}" minlength="1" maxlength="20">`;
            event.target.classList.add("hidden");
            event.target.parentElement.insertAdjacentHTML('afterbegin', input);
            document.querySelector(".new-title-input").focus();
        }
    })
}

const setKeyboardListener = function () {
    const colContainer = document.querySelector(".column-container");
    colContainer.addEventListener('keyup', event => {
        if (event.key === keys.enterKey) {
            if (event.target.classList.contains("col-input")) {
                sendNewColData();
            } else if (event.target.classList.contains("card-input")) {
                addNewCard()
            } else {
                updateTitleInDB(event.target);
                removeTitleInputField();
            }
        } else if (event.key === keys.escKey) {
            removeTitleInputField();
        }
    })
}


const updateTitleInDB = function (element) {
    let newTitle = element.value;
    let titleEl = document.querySelector(".new-title-input").parentElement.querySelector(".hidden");
    titleEl.textContent = newTitle

    if (titleEl.classList.contains("card-title")) {
        let id = document.querySelector(".new-title-input").parentElement.dataset.cardId;
        updateTitle(newTitle, id, false);
    } else if (titleEl.classList.contains("col-title")) {
        let id = document.querySelector(".new-title-input").parentElement.dataset.columnId;
        updateTitle(newTitle, id, true);
    }
}


const removeTitleInputField = function () {
    let titleInput = document.querySelector(".new-title-input");
        if (titleInput) {
            titleInput.parentElement.querySelector(".hidden").classList.remove("hidden");
            titleInput.remove();
        }
}

// const setMouseOverSlots = function () {
//     const colContainer = document.querySelector(".column-container");
//     colContainer.addEventListener('mouseover', event => {
//         if (event.target.classList.contains("card-slot")) {
//             event.target.classList.add("slot-highlighted");
//             event.target.classList.remove("card-slot");
//         }
//     })
// }
//
//
// const setMouseOutSlots = function () {
//     const colContainer = document.querySelector(".column-container");
//     colContainer.addEventListener('mouseout', event => {
//         if (event.target.classList.contains("slot-highlighted")) {
//             event.target.classList.remove("slot-highlighted");
//             event.target.classList.add("card-slot");
//         }
//     })
// }


const dragAndDropHandler = function () {
    const colContainer = document.querySelector(".column-container");
    setDragStartListeners(colContainer);
    // setDragEndListener(colContainer);
    setDragEnterListener(colContainer);
    setDragOverListener(colContainer);
    setDragLeaveListener(colContainer);
    setDropListener(colContainer);
}


const setDragStartListeners = function (btnEl) {
    btnEl.addEventListener('dragstart', event => {
        draggedElement = event.target;
    })
}

// const setDragEndListener = function (btnEl) {
//     btnEl.addEventListener('dragend', event => {
//     })
// }

const setDragEnterListener = function (btnEl) {
    btnEl.addEventListener('dragenter', event => {
        event.preventDefault();
        if (event.target.classList.contains("card-slot")) {
            event.target.classList.add("slot-highlighted");
            event.target.classList.remove("card-slot");
        }
    })
}

const setDragOverListener = function (btnEl) {
    btnEl.addEventListener('dragover', event => {
        event.preventDefault()
    })
}

const setDragLeaveListener = function (btnEl) {
    btnEl.addEventListener('dragleave', event => {
        event.preventDefault()
        if (event.target.classList.contains("slot-highlighted")) {
            event.target.classList.remove("slot-highlighted");
            event.target.classList.add("card-slot");
        }
    })
}

const setDropListener = function (btnEl) {
    btnEl.addEventListener('drop', event => {
        event.preventDefault();
        if (event.target.classList.contains("card-container")) {
            event.target.appendChild(draggedElement);
            let cardId = draggedElement.dataset.cardId;
            let columnId = event.target.dataset.columnId;
            updateCardStatus(cardId, columnId);
        }
    })
}


