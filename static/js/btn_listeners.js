"user strict"

let draggedElement;

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
            sendNewColData(event);
        } else if (event.target.classList.contains("submit-card-name")) {
            addNewCard();
        } else if (event.target.classList.contains("del-card-btn-img")) {
            const cardId = event.target.dataset.cardId;
            delCardFromDb(cardId)
        }
    })
}


const dragAndDropHandler = function () {
    const colContainer = document.querySelector(".column-container");
    setDragStartListeners(colContainer);
    // setDragEndListener(colContainer);
    setDragEnterListener(colContainer);
    setDragOverListener(colContainer);
    // setDragLeaveListener(colContainer);
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
        event.preventDefault()
    })
}

const setDragOverListener = function (btnEl) {
    btnEl.addEventListener('dragover', event => {
        event.preventDefault()
    })
}

// const setDragLeaveListener = function (btnEl) {
// }

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


