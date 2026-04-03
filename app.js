let books = JSON.parse(localStorage.getItem("books")) || {};
let currentYear = String(new Date().getFullYear());
let editingIndex = null;

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
        const readCount = books[year].filter(b => b.read).length;
        const totalCount = books[year].length;
        btn.textContent = `${year} (${readCount}/${totalCount})`;
        btn.classList.toggle("active", year === currentYear);
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

    if (!books[currentYear] || books[currentYear].length === 0) {
        const empty = document.createElement("li");
        empty.className = "empty-state";
        empty.textContent = "이 연도에 등록된 책이 없습니다.";
        bookList.appendChild(empty);
        return;
    }

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
            books[currentYear][index].read = !books[currentYear][index].read;
            save();
            renderYears();
            renderBooks();
        };

        bookList.appendChild(li);
    });
}

// 모달 열기 (추가)
function openAddModal() {
    editingIndex = null;
    document.getElementById("newTitle").value = "";
    document.getElementById("newAuthor").value = "";
    document.getElementById("newYear").value = currentYear;
    document.getElementById("modalTitle").textContent = "책 추가";
    document.getElementById("modalConfirmBtn").textContent = "추가";
    document.getElementById("addModal").classList.add("open");
    document.getElementById("newTitle").focus();
}

// 모달 열기 (수정)
function openEditModal(index) {
    editingIndex = index;
    const book = books[currentYear][index];
    document.getElementById("newTitle").value = book.title;
    document.getElementById("newAuthor").value = book.author;
    document.getElementById("newYear").value = currentYear;
    document.getElementById("modalTitle").textContent = "책 수정";
    document.getElementById("modalConfirmBtn").textContent = "수정 완료";
    document.getElementById("addModal").classList.add("open");
    document.getElementById("newTitle").focus();
}

// 모달 닫기
function closeAddModal() {
    document.getElementById("addModal").classList.remove("open");
    editingIndex = null;
}

// 오버레이 클릭 시 닫기
function handleOverlayClick(e) {
    if (e.target === document.getElementById("addModal")) {
        closeAddModal();
    }
}

// 책 추가 또는 수정
function addBook() {
    const title = document.getElementById("newTitle").value.trim();
    const author = document.getElementById("newAuthor").value.trim();
    const year = document.getElementById("newYear").value.trim();

    if (!title || !author || !year) {
        alert("모든 항목을 입력해주세요.");
        return;
    }

    if (editingIndex !== null) {
        // 수정 모드
        books[currentYear][editingIndex].title = title;
        books[currentYear][editingIndex].author = author;
    } else {
        // 추가 모드
        if (!books[year]) books[year] = [];
        books[year].push({ title, author, read: false });
        currentYear = year;
    }

    save();
    closeAddModal();
    renderYears();
    renderBooks();
}

// 책 삭제
function deleteBook(index) {
    if (confirm("이 책을 삭제하시겠습니까?")) {
        books[currentYear].splice(index, 1);
        if (books[currentYear].length === 0) {
            delete books[currentYear];
            // 삭제 후 남은 연도로 이동
            const remaining = Object.keys(books).sort();
            currentYear = remaining.length > 0 ? remaining[remaining.length - 1] : String(new Date().getFullYear());
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
