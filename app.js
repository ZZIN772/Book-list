let books = JSON.parse(localStorage.getItem("books")) || {};
let currentYear = new Date().getFullYear();

const yearSelector = document.getElementById("yearSelector");
const bookList = document.getElementById("bookList");

// 초기 실행
renderYears();
renderBooks();

// 연도 버튼 생성
function renderYears() {
    yearSelector.innerHTML = "";

    const years = Object.keys(books).sort();

    years.forEach(year => {
        const btn = document.createElement("button");
        btn.textContent = year;
        btn.classList.toggle("active", year == currentYear);
        btn.onclick = () => {
            currentYear = year;
            renderYears();
            renderBooks();
        };
        yearSelector.appendChild(btn);
    });
}

// 책 리스트 렌더링
function renderBooks() {
    bookList.innerHTML = "";

    if (!books[currentYear]) return;

    books[currentYear].forEach((book, index) => {
        const li = document.createElement("li");
        li.className = "book-item" + (book.read ? " read" : "");

        li.innerHTML = `
            <span>${book.title} — ${book.author}</span>
            <input type="checkbox" ${book.read ? "checked" : ""} />
        `;

        // 체크박스 이벤트
        li.querySelector("input").onchange = () => {
            book.read = !book.read;
            save();
            renderBooks();
        };

        bookList.appendChild(li);
    });
}

// 책 추가 모달 열기
function openAddModal() {
    document.getElementById("addModal").style.display = "block";
}

// 모달 닫기
function closeAddModal() {
    document.getElementById("addModal").style.display = "none";
}

// 책 추가
function addBook() {
    const title = document.getElementById("newTitle").value;
    const author = document.getElementById("newAuthor").value;
    const year = document.getElementById("newYear").value;

    if (!title || !author || !year) return;

    if (!books[year]) books[year] = [];

    books[year].push({
        title,
        author,
        read: false
    });

    save();
    closeAddModal();
    renderYears();
    currentYear = year;
    renderBooks();
}

// 저장
function save() {
    localStorage.setItem("books", JSON.stringify(books));
}
