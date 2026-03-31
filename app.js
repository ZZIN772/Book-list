// Adding book numbering, edit/delete functions, and read count statistics

let books = [];

function addBook(title, author) {
    const book = {
        id: books.length + 1,
        title: title,
        author: author,
        readCount: 0,
    };
    books.push(book);
}

function editBook(id, newTitle, newAuthor) {
    const book = books.find(b => b.id === id);
    if (book) {
        book.title = newTitle;
        book.author = newAuthor;
    }
}

function deleteBook(id) {
    books = books.filter(b => b.id !== id);
}

function logRead(id) {
    const book = books.find(b => b.id === id);
    if (book) {
        book.readCount += 1;
    }
}

function displayBooks() {
    books.forEach(book => {
        console.log(`ID: ${book.id}, Title: ${book.title}, Author: ${book.author}, Reads: ${book.readCount}`);
    });
}