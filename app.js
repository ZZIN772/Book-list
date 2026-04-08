let books = JSON.parse(localStorage.getItem("books")) || {};
let currentYear = String(new Date().getFullYear());
let editingIndex = null;
let currentTab = "list";

const yearSelector = document.getElementById("yearSelector");
const bookList = document.getElementById("bookList");

// 초기 실행
renderYears();
renderBooks();

// ── 탭 전환 ──
function switchTab(tab) {
    currentTab = tab;
    document.getElementById("tabList").classList.toggle("active", tab === "list");
    document.getElementById("tabRead").classList.toggle("active", tab === "read");
    document.getElementById("viewList").style.display = tab === "list" ? "block" : "none";
    document.getElementById("viewRead").style.display = tab === "read" ? "block" : "none";
    document.getElementById("yearSelector").style.display = tab === "list" ? "flex" : "none";
    document.getElementById("addBtnHeader").style.display = tab === "list" ? "inline-block" : "none";
    if (tab === "read") renderReadBooks();
}

// ── 읽은 책 전체 뷰 (연도별 그룹) ──
function renderReadBooks() {
    const readList = document.getElementById("readList");
    const readSummary = document.getElementById("readSummary");
    readList.innerHTML = "";

    const years = Object.keys(books).sort();
    let totalRead = 0;

    years.forEach(year => {
        const readBooks = books[year].filter(b => b.read);
        totalRead += readBooks.length;
        if (readBooks.length === 0) return;

        // 연도 헤더
        const yearHeader = document.createElement("li");
        yearHeader.className = "read-year-header";
        yearHeader.textContent = `${year}년 — ${readBooks.length}권`;
        readList.appendChild(yearHeader);

        // 책 목록
        readBooks.forEach((book, i) => {
            const li = document.createElement("li");
            li.className = "book-item read";
            li.innerHTML = `
                <div class="book-info">
                    <span class="book-number">${i + 1}.</span>
                    <span class="book-title">${book.title} — ${book.author}</span>
                </div>
            `;
            readList.appendChild(li);
        });
    });

    // 요약 문구
    readSummary.textContent = totalRead > 0
        ? `총 ${totalRead}권을 읽었어요 🎉`
        : "아직 읽은 책이 없어요.";

    if (totalRead === 0) {
        const empty = document.createElement("li");
        empty.className = "empty-state";
        empty.textContent = "체크한 책이 없습니다.";
        readList.appendChild(empty);
    }
}

// ── 연도 버튼 생성 ──
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

// ── 책 리스트 렌더링 ──
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

// ── 모달 열기 (추가) ──
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

// ── 모달 열기 (수정) ──
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

// ── 모달 닫기 ──
function closeAddModal() {
    document.getElementById("addModal").classList.remove("open");
    editingIndex = null;
}

// ── 오버레이 클릭 시 닫기 ──
function handleOverlayClick(e) {
    if (e.target === document.getElementById("addModal")) {
        closeAddModal();
    }
}

// ── 책 추가 또는 수정 ──
function addBook() {
    const title = document.getElementById("newTitle").value.trim();
    const author = document.getElementById("newAuthor").value.trim();
    const year = document.getElementById("newYear").value.trim();

    if (!title || !author || !year) {
        alert("모든 항목을 입력해주세요.");
        return;
    }

    if (editingIndex !== null) {
        books[currentYear][editingIndex].title = title;
        books[currentYear][editingIndex].author = author;
    } else {
        if (!books[year]) books[year] = [];
        books[year].push({ title, author, read: false });
        currentYear = year;
    }

    save();
    closeAddModal();
    renderYears();
    renderBooks();
}

// ── 책 삭제 ──
function deleteBook(index) {
    if (confirm("이 책을 삭제하시겠습니까?")) {
        books[currentYear].splice(index, 1);
        if (books[currentYear].length === 0) {
            delete books[currentYear];
            const remaining = Object.keys(books).sort();
            currentYear = remaining.length > 0 ? remaining[remaining.length - 1] : String(new Date().getFullYear());
        }
        save();
        renderYears();
        renderBooks();
    }
}

// ── 저장 ──
function save() {
    localStorage.setItem("books", JSON.stringify(books));
}

// ── JSON 내보내기 ──
function exportBooks() {
    const data = JSON.stringify(books, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `책목록_백업_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// ── JSON 가져오기 ──
function importBooks() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const imported = JSON.parse(ev.target.result);
                if (confirm("기존 데이터에 병합할까요?\n(취소 시 전체 덮어쓰기)")) {
                    // 병합: 중복 제외하고 추가
                    Object.keys(imported).forEach(year => {
                        if (!books[year]) books[year] = [];
                        imported[year].forEach(newBook => {
                            const exists = books[year].some(
                                b => b.title === newBook.title && b.author === newBook.author
                            );
                            if (!exists) books[year].push(newBook);
                        });
                    });
                } else {
                    books = imported;
                }
                save();
                renderYears();
                renderBooks();
                alert("가져오기 완료! ✅");
            } catch {
                alert("올바른 JSON 파일이 아닙니다.");
            }
        };
        reader.readAsText(file);
    };
    input.click();
}
