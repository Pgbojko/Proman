const addColumnHTMLElement = `    
    <div class="add-col-div">
        <button class="add-col-btn" draggable="false">
            <img class="add-col-btn-img" alt="add-col-btn" src="/static/images/add_button.png" draggable="false">
        </button>
        <div class="new-col-modal hidden" draggable="false">
            <label class="label" for="new-column-name" >Column Header:</label><br><br>
            <input class="input col-input" name="new-col-name" id="new-column-name" type="text" maxlength="20" minlength="1"><br><br>
            <button type="submit" name="submit-col-name" class="submit-btn submit-col-name" id="submit-col-name">Submit</button>
        </div>
    </div>`


function columnHTMLElement (column) {
    return `<div class="column" data-column-id="${column[keys.columnId]}"></div>`
}


function columnHeaderHTMLElement (column) {
    return `<div class="column-header" id="${column[keys.columnName]}" data-column-id="${column[keys.columnId]}">
                <h2 class="col-title">${column[keys.columnName]}</h2>
                <button type="button" class="del-col-btn" data-column-id="${column[keys.columnId]}" draggable="false">
                    <img alt="del-col-btn-img" class="del-col-btn-img" data-column-id="${column[keys.columnId]}" src="/static/images/delete-btn.png" draggable="false">
                </button>
            </div>`
}


function cardContainerHTMLElement (column) {
    return `<div class="card-container" data-column-id="${column[keys.columnId]}">
            </div>`
}

function addCardToColumnHTMLElement (card) {
    return `<div class="card" draggable="true" data-card-id="${card[keys.cardId]}">
                <p class="card-title">${card[keys.cardTitle]}</p>
                <button type="button" class="del-card-btn" data-card-id="${card[keys.cardId]}" draggable="false">
                    <img alt="del-card-btn-img" class="del-card-btn-img" data-card-id="${card[keys.cardId]}" src="/static/images/delete-card-btn.png" draggable="false">
                </button>
            </div>`
}


function addCardBtnHTMLElement () {
    return `<div class="add-card-div" draggable="false">
                <button type="button" class="add-card-btn" draggable="false">
                    <img class="add-card-btn-img" src="/static/images/add_col_button.png" alt="add-card-btn" draggable="false">
                </button>
                <div class="new-card-modal hidden" draggable="false">
                    <label class="label" for="new-card-name">Card Title:</label><br><br>
                    <input class="input card-input" name="new-card-name" id="new-card-name" type="text" maxlength="20" minlength="1"><br><br>
                    <button type="submit" name="submit-card-name" class="submit-btn submit-card-name">Submit</button>
                </div>
            </div>`
}


