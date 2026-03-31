let books = JSON.parse(localStorage.getItem("books")) || {};
let currentYear = new Date().getFullYear();
let editingIndex = null;

const yearSelector = document.getElementById("yearSelector");
const bookList = document.getElementById("bookList");

// 초기 실행
renderYears();
renderBooks();

// 연도 버튼 생성 (읽은 책 수 표시)
function renderYears() {
    yearSelector.innerHTML = "";
    const years = Object.keys(books).sort();

    years.forEach(year => {
        const btn = document.createElement("button");
        const readCount = books[year].filter(b => b.read).length;
        const totalCount = books[year].length;
        btn.textContent = `${year} (${readCount}/${totalCount})`;
        btn.classList.toggle("active", year == currentYear);
        btn.onclick = () => {
            currentYear = year;
            renderYears();
            renderBooks();
        };
        yearSelector.appendChild(btn);
    });
}

// 책 리스트 렌더링 (번호 + 수정/삭제 버튼)
function renderBooks() {
    bookList.innerHTML = "";
    if (!books[currentYear]) return;

    books[currentYear].forEach((book, index) => {
        const li = document.createElement("li");
        li.className = "book-item" + (book.read ? " read" : "");

        li.innerHTML = `
            <div class="book-info">
                <span class="book-number">${index + 1}.</span>
                <span class="book-title">${book.title} — ${book.author}</span>
            </div>
            <div class="book-actions">
                <input type="checkbox" ${book.read ? "checked" : ""} />
                <button class="edit-btn" onclick="openEditModal(${index})">수정</button>
                <button class="delete-btn" onclick="deleteBook(${index})">삭제</button>
            </div>
        `;

        li.querySelector("input").onchange = () => {
            book.read = !book.read;
            save();
            renderYears();
            renderBooks();
        };

        bookList.appendChild(li);
    });
}

// 책 추가 모달 열기
function openAddModal() {
    editingIndex = null;
    document.getElementById("newTitle").value = "";
    document.getElementById("newAuthor").value = "";
    document.getElementById("newYear").value = currentYear;
    document.getElementById("addModal").style.display = "block";
    document.querySelector(".modal h3").textContent = "책 추가";
    document.querySelector(".modal button:not(.cancel)").textContent = "추가";
}

// 편집 모달 열기
function openEditModal(index) {
    editingIndex = index;
    const book = books[currentYear][index];
    document.getElementById("newTitle").value = book.title;
    document.getElementById("newAuthor").value = book.author;
    document.getElementById("newYear").value = currentYear;
    document.getElementById("addModal").style.display = "block";
    document.querySelector(".modal h3").textContent = "책 수정";
    document.querySelector(".modal button:not(.cancel)").textContent = "수정";
}

// 모달 닫기
function closeAddModal() {
    document.getElementById("addModal").style.display = "none";
    editingIndex = null;
}

// 책 추가 또는 수정
function addBook() {
    const title = document.getElementById("newTitle").value;
    const author = document.getElementById("newAuthor").value;
    const year = document.getElementById("newYear").value;

    if (!title || !author || !year) {
        alert("모든 항목을 입력해주세요.");
        return;
    }

    if (editingIndex !== null) {
        // 수정 모드
        books[currentYear][editingIndex] = { 
            ...books[currentYear][editingIndex], 
            title, 
            author 
        };
    } else {
        // 추가 모드
        if (!books[year]) books[year] = [];
        books[year].push({
            title,
            author,
            read: false
        });
    }

    save();
    closeAddModal();
    renderYears();
    if (year != currentYear) {
        currentYear = year;
    }
    renderBooks();
}

// 책 삭제
function deleteBook(index) {
    if (confirm("이 책을 삭제하시겠습니까?")) {
        books[currentYear].splice(index, 1);
        if (books[currentYear].length === 0) {
            delete books[currentYear];
        }
        save();
        renderYears();
        renderBooks();
    }
}

// 저장
function save() {
    localStorage.setItem("books", JSON.stringify(books));
}
