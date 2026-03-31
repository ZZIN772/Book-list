function renderBooks(books) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';
    books.forEach((book, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${book.title} by ${book.author}`;
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => editBook(book.id);
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteBook(book.id);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        bookList.appendChild(li);
    });
}

function editBook(id) {
    // Logic to edit the book by its id
}

function deleteBook(id) {
    // Logic to delete the book by its id
}