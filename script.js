let myLibrary = [];
//get starting elements
const totalBooksLabel = document.querySelector("#total-books");
const unreadBooksLabel = document.querySelector("#unread-books");
const readBooksLabel = document.querySelector("#read-books");
const averageRatingLabel = document.querySelector("#avg-rating");
const libraryContainer = document.querySelector("#library-container");

const addButton = document.querySelector("#add-book");
const clearButton = document.querySelector("#clear-library");
let readBookButtons;
let deleteBookButtons;

let totalBooks = 0;
let unreadBooks = 0;
let readBooks = 0;


//*******Functions*******

//this is the constructor to the book object
class Book{
    constructor(title, author, pages){
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.completed = "Not Yet Completed";
        this.rating ='';
        this.ratingNumber = 0;
    }
    newCard(){
        let card = document.createElement('div');
        card.classList.add('book-card');
        card.innerHTML = `
            <div class="book-upper">
                <div class="book-header">
                    <div class="book-title">${this.title}</div>
                    <div class="book-author">${this.author}</div>
                </div>
                <div class="book-details">
                    <div class="book-pages">Pages: ${this.pages}</div>
                    <div class="book-completed">${this.completed}</div>
                    <div class="book-rating">${this.rating}</div>
                </div>
            </div>
            <div class="book-buttons">
                <button class="add-button">Mark as Read</button>
                <button class="delete-button">Delete</button>
            </div>`;
        return card;
    }
    markRead(){
        let today = new Date();
        this.completed = `Date Completed: ${today.getMonth()+1}/${today.getDate()}/${today.getFullYear()}`
        this.rating = `Rating: `;
        for(let i = 0; i<getStar(); i++){
            this.rating += `&#9733`;
        }
        this.ratingNumber = getStar();
    }
    markUnread(){
        this.completed = "Not Yet Completed";
        this.rating = "";
        this.ratingNumber = "";
    }
}

//******Modals******
const Modal = (() => {

    //define block HTML code
    const newBookModalHTML = `
    <div class="modal-content">
        <div class="modal-header">Add a Book</div>
        <div class="modal-info-container">
            <div class="modal-info">
                <label for="new-book-title">Book Title: </label>
                <input type="text" id="new-book-title" name="new-book-title">
            </div>
            <div class="modal-info">
                <label for="new-book-author">Author: </label>
                <input type="text" id="new-book-author" name="new-book-author">
            </div>
            <div class="modal-info">
                <label for="new-book-pages">Pages: </label>
                <input type="number" id="new-book-pages" name="new-book-pages">
            </div>
            <div class="book-buttons">
                <button id="confirm-add-book" class="add-button">Add</button>
                <button id="cancel-button" class="delete-button">Cancel</button>
            </div>
        </div>
    </div>`;

    const clearLibraryModalHTML = `
    <div class="modal-content">
        <div class="modal-header">Clear Library</div>
        <div class="modal-info-container">
            <div class="modal-subtitle">Would you like to clear the entire library?</div>
        </div>
        <div class="book-buttons">
            <button class="add-button" id="confirm-button">Clear Library</button>
            <button class="delete-button" id ="cancel-button">Cancel</button>
        </div>
    </div>`;

    const confirmReadModalHTML = `
    <div class="modal-content">
        <div class="modal-header">Mark this book as Read</div>
        <div class="modal-info-container">
            <div class="modal-subtitle">I confirm I have read this book</div>
            <div class="modal-info">Book Rating: 
                <div class="rating">
                    <input id="star5" name="star" type="radio" value="5" class="radio-btn hide" />
                    <label for="star5" >???</label>
                    <input id="star4" name="star" type="radio" value="4" class="radio-btn hide" />
                    <label for="star4" >???</label>
                    <input id="star3" name="star" type="radio" value="3" class="radio-btn hide" />
                    <label for="star3" >???</label>
                    <input id="star2" name="star" type="radio" value="2" class="radio-btn hide" />
                    <label for="star2" >???</label>
                    <input id="star1" name="star" type="radio" value="1" class="radio-btn hide" />
                    <label for="star1" >???</label>
                    <div class="clear"></div>
                </div>
            </div>
        </div>
        <div class="book-buttons">
            <button class="add-button" id="confirm-button">Confirm Read</button>
            <button class="delete-button" id ="cancel-button">Cancel</button>
        </div>
    </div>`;

    const confirmUnreadModalHTML = `
    <div class="modal-content">
        <div class="modal-header">Mark this book as Unread</div>
        <div class="modal-info-container">
            <div class="modal-subtitle">I confirm I have not read this book</div>
        </div>
        <div class="book-buttons">
            <button class="add-button" id="confirm-button">Confirm Unread</button>
            <button class="delete-button" id ="cancel-button">Cancel</button>
        </div>
    </div>`;

    const deleteBookModalHTML = `
    <div class="modal-content">
        <div class="modal-header">Delete Book</div>
        <div class="modal-info-container">
            <div class="modal-subtitle">Would you like to delete this book?</div>
        </div>
        <div class="book-buttons">
            <button class="add-button" id="confirm-button">Delete Book</button>
            <button class="delete-button" id ="cancel-button">Cancel</button>
        </div>
    </div>`;

    //this function makes the New Book modal appear
    function newBookModal(){
        _makeModal(newBookModalHTML);
        const addBookButton = document.querySelector("#confirm-add-book");
        addBookButton.addEventListener('click', addBook);
    }
    //this function makes the clear library modal
    function clearLibraryModal(){
        _makeModal(clearLibraryModalHTML);
        const clearLibraryButton = document.querySelector("#confirm-button");
        clearLibraryButton.addEventListener('click', clearLibrary);
    }

    //this function makes the confirm read modal appear
    function confirmReadModal(index){
        _makeModal(confirmReadModalHTML);
        const readButton = document.querySelector("#confirm-button");
        readButton.addEventListener('click', ()=> toggleBook(index, "read"));
    }
    //this functions makes the confirm unread modal
    function confirmUnreadModal(index){
        _makeModal(confirmUnreadModalHTML);
        const unreadButton = document.querySelector("#confirm-button");
        unreadButton.addEventListener('click', ()=> toggleBook(index, "unread"));
    }
    //this function makes the delete book modal
    function deleteBookModal(index){
        _makeModal(deleteBookModalHTML);
        const clearLibraryButton = document.querySelector("#confirm-button");
        clearLibraryButton.addEventListener('click', ()=>deleteBook(index));
    }

     //this function closes a modal.
     function closeModal(modal){
        modal.classList.remove('modal-active');
        setTimeout( () => modal.remove(), 200);
    }


    //This funtion takes in the type of modal being made and creates it
    function _makeModal(type){
        let modal = document.createElement('div');
        modal.classList.add("modal");
        modal.setAttribute("id", "my-modal")
        modal.innerHTML = type;
        document.body.appendChild(modal);
        //needs timeout in order to create the modal and set the opacity to 0 before
        //transitioning it for the animation
        setTimeout(()=>_activateModal(modal), 1);
    }

    //this function makes the modal visible
    function _activateModal(modal){
        modal.classList.add('modal-active');
        let cancelModalButton = document.querySelector("#cancel-button");
        cancelModalButton.addEventListener('click', ()=>closeModal(modal));
    }

   

    return {newBookModal, clearLibraryModal, confirmReadModal, confirmUnreadModal, deleteBookModal, closeModal}
})();

//event listeners to starting buttons
addButton.addEventListener('click', Modal.newBookModal);
clearButton.addEventListener('click', Modal.clearLibraryModal);


//******General Functions******

//this function returns which star is selected
function getStar(){
    let stars = document.querySelectorAll(".radio-btn");
    let chosen; 
    stars.forEach(star=>{
        if(star.checked == true){
            chosen = star.value;
        }
    })
    return chosen;
}
//this function takes the data put into the new book modal and adds it to the book
function addBook(){
    clearErrors();

    let modal = document.querySelector('#my-modal')
    let newTitle = modal.querySelector('#new-book-title').value;
    let newAuthor = modal.querySelector('#new-book-author').value;
    let newPages = modal.querySelector('#new-book-pages').value;

    //makes sure all fields have been put in
    if(newTitle == ''){
        let titleError = document.createElement('div');
        titleError.classList.add('error-message');
        titleError.textContent = 'Please enter the title of the book';
        //this series of things adds the error message to right above the buttons
        modal.firstElementChild.lastElementChild.insertBefore(titleError, modal.firstElementChild.lastElementChild.lastElementChild);
    }if(newAuthor == ''){
        let authorError = document.createElement('div');
        authorError.classList.add('error-message');
        authorError.textContent = 'Please enter the author of the book';
        modal.firstElementChild.lastElementChild.insertBefore(authorError, modal.firstElementChild.lastElementChild.lastElementChild);
    }
    if(newPages == ''){
        let pagesError = document.createElement('div');
        pagesError.classList.add('error-message');
        pagesError.textContent = 'Please enter the amout of pages in of the book';
        modal.firstElementChild.lastElementChild.insertBefore(pagesError, modal.firstElementChild.lastElementChild.lastElementChild);
    }
    if(newTitle && newAuthor && newPages){
        let newBook = new Book(`${newTitle}`, `${newAuthor}`, `${newPages}`);
        myLibrary.push(newBook);
        libraryContainer.appendChild(myLibrary[myLibrary.length-1].newCard());
        updateCounts();
        updateButtons();
        Modal.closeModal(modal);
    }
}
//function clears the library of any books
function clearLibrary(){
    clearErrors();
    let modal = document.querySelector('#my-modal')
    if(myLibrary.length == 0){
        let libraryError = document.createElement('div');
        libraryError.classList.add('error-message');
        libraryError.textContent = 'Your Library is already empty';
        modal.firstElementChild.insertBefore(libraryError, modal.firstElementChild.lastElementChild);
    }else{
        myLibrary.splice(0,myLibrary.length);
        reloadAllCards();
        updateCounts();
        Modal.closeModal(modal)
    }
}
//This function toggles a book between read and unread
function toggleBook(index, read){
    clearErrors();
    let modal = document.querySelector('#my-modal')
    if(read == "read" && getStar() == undefined)
    {
        let starError = document.createElement('div');
        starError.classList.add('error-message');
        starError.textContent = 'Please select a rating for this book';
        modal.firstElementChild.insertBefore(starError, modal.firstElementChild.lastElementChild);
    
    }else{
        read == "read" ? myLibrary[index].markRead() : myLibrary[index].markUnread();
        reloadAllCards();
        readBookButtons = libraryContainer.querySelectorAll(".add-button");
        myLibrary.forEach((book, bookNo) => (book.completed != "Not Yet Completed") ? 
            readBookButtons[bookNo].textContent = "Unread": false);
        updateButtons();
        updateCounts();
        Modal.closeModal(modal);
    }
}
//this function deletes a single book
function deleteBook(index){
    let modal = document.querySelector("#my-modal");
    myLibrary.splice(index, 1);
    reloadAllCards();
    updateButtons();
    updateCounts();
    Modal.closeModal(modal);
}

//this function clears error messages
function clearErrors(){
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
}



//******Update Functions******

//this function updates the book counts
function updateCounts(){
    totalBooks = myLibrary.length;
    unreadBooks = 0;
    readBooks = 0;
    myLibrary.forEach(book => book.completed == "Not Yet Completed" ? unreadBooks++ : readBooks++)
    totalBooksLabel.textContent = `Total Books: ${totalBooks}`;
    unreadBooksLabel.textContent = `Unread Books: ${unreadBooks}`;
    readBooksLabel.textContent = `Read Books: ${readBooks}`;
    updateRating();
}

//This function updates the average rating
function updateRating(){
    let maxStars = 5;
    let totalRatings = myLibrary.reduce((total, book) => Number(total) + Number(book.ratingNumber) , 0);
    let averageRating = readBooks > 0 ? totalRatings/readBooks:0;
    let percentageRating = (averageRating/maxStars)*100;
    let roundedPercentageRating = `${percentageRating.toFixed(2)}%`;
    document.querySelector("#stars-inner").style.width = roundedPercentageRating;
    document.querySelector("#avg-rating-number").textContent = ""
    if(percentageRating>0){
        document.querySelector("#avg-rating-number").textContent = roundedPercentageRating; 
    }

}

//This function makes sure the buttons have event listeners on them
function updateButtons(){
    readBookButtons = libraryContainer.querySelectorAll(".add-button");
    readBookButtons.forEach((button, index) => {
        if(button.getAttribute("listener") != "true"){
            button.textContent == "Mark as Read" ? 
                button.addEventListener('click', ()=>Modal.confirmReadModal(index)):
                button.addEventListener('click', ()=>Modal.confirmUnreadModal(index));
            button.setAttribute("listener","true");
        }
    });
    deleteBookButtons = libraryContainer.querySelectorAll(".delete-button");
    deleteBookButtons.forEach((button, index) => {
        if(button.getAttribute("listener") != "true"){
            button.addEventListener('click', ()=>Modal.deleteBookModal(index));
            button.setAttribute("listener","true");
        }
    });
}

//This function removes all cards and then re-displays them with updated information
function reloadAllCards(){
    removeCards();
    myLibrary.forEach(book=>libraryContainer.appendChild(book.newCard()));
}

//This function removes all cards
function removeCards(){
    let cards = libraryContainer.querySelectorAll(".book-card")
    cards.forEach(card=>card.remove());
}