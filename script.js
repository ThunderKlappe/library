let myLibrary = [];
//get starting elements
const totalBooksLabel = document.querySelector("#total-books");
const unreadBooksLabel = document.querySelector("#unread-books");
const readBooksLabel = document.querySelector("#read-books");
const averageRatingLabel = document.querySelector("#avg-rating");
const libraryContainer = document.querySelector("#library-container");

const addButton = document.querySelector("#add-book");
const clearButton = document.querySelector("#clear-library");

//define block HTML code
const newBookModalHTML = `
    <div class="modal-content">
        <div class="modal-header">Add a Book</div>
        <div class="book-info">
            <div class="new-info-container">
                <label for="new-book-title">Book Title: </label>
                <input type="text" id="new-book-title" name="new-book-title">
            </div>
            <div class="new-info-container">
                <label for="new-book-author">Author: </label>
                <input type="text" id="new-book-author" name="new-book-author">
            </div>
            <div class="new-info-container">
                <label for="new-book-pages">Pages: </label>
                <input type="number" id="new-book-pages" name="new-book-pages">
            </div>
            <div class="book-buttons">
                <button id="confirm-add-book" class="add-button">Add</button>
                <button id="cancel-add-book" class="delete-button">Cancel</button>
            </div>
        </div>
    </div>`;

let totalBooks = 0;
let unreadBooks = 0;
let readBooks = 0;

//event listeners to starting buttons
addButton.addEventListener('click', newBookModal);
//clearButton.addEventListener('click', clearLibraryModal);




//*******Functions*******

//this is the constructor to the book object
function Book(title, author, pages, completed="Not Yet Completed", rating=''){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.completed = completed;
    this.rating = rating;
}

Book.prototype.newCard = function(){
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
            <button class="add-button book-button">Mark as Read</button>
            <button class="delete-button book-button">Delete</button>
        </div>`;
    libraryContainer.appendChild(card);
    totalBooks++;
    unreadBooks++;
    totalBooksLabel.textContent = `Total Books: ${totalBooks}`;
    unreadBooksLabel.textContent = `Unread Books: ${unreadBooks}`;
}

//this function makes the New Book modal appear
function newBookModal(){
    makeModal(newBookModalHTML);
    const addBookButton = document.querySelector("#confirm-add-book");
    addBookButton.addEventListener('click', addBook);
}

//This funtion takes in the type of modal being made and creates it
function makeModal(type){
    let modal = document.createElement('div');
    modal.classList.add("modal");
    modal.setAttribute("id", "addModal")
    modal.innerHTML = type;
    document.body.appendChild(modal);
    //needs timeout in order to create the modal and set the opacity to 0 before
    //transitioning it for the animation
    setTimeout(()=>activateModal(modal), 1);
}

//this function makes the modal visible
function activateModal(modal){
    modal.classList.add('modal-active');
    let cancelModalButton = document.querySelector("#cancel-add-book");
    cancelModalButton.addEventListener('click', ()=>closeModal(modal));
}

//this function closes a modal.
function closeModal(modal){
    modal.classList.remove('modal-active');
    setTimeout( () => modal.remove(), 200);
}

//this function takes the data put into the new book modal and adds it to the book
function addBook(){
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());

    let modal = document.querySelector('#addModal')
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
        myLibrary[myLibrary.length-1].newCard();
        closeModal(modal);
    }
}

//this function adds a book to a card on the library display