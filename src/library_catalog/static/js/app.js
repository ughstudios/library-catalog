document.addEventListener('DOMContentLoaded', () => {
    const bookList = document.getElementById('book-list');
    const addBookButton = document.getElementById('add-book');
    const saveBookButton = document.getElementById('save-book');
    const modalTitle = document.getElementById('modal-title');
    const fileInput = document.getElementById('book-cover');
    const fileNameSpan = document.getElementById('file-name');
    const publicationDateInput = document.getElementById('book-publication-date');
    let currentBookId = null;

    const bookModalElement = document.getElementById('book-modal');
    const bookModal = new bootstrap.Modal(bookModalElement);

    const populateLanguages = () => {
        const languageSelect = document.getElementById('book-language');
        const languages = ISO6391.getAllNames();
        languageSelect.innerHTML = languages.map(lang => `<option value="${lang}">${lang}</option>`).join('');
    };

    const setDefaultLanguage = () => {
        const languageSelect = document.getElementById('book-language');
        const browserLangCode = navigator.language.split('-')[0];
        const browserLang = ISO6391.getName(browserLangCode);
        if (languageSelect.querySelector(`option[value="${browserLang}"]`)) {
            languageSelect.value = browserLang;
        }
    };

    const fetchBooks = async () => {
        const response = await fetch('/api/books/');
        const data = await response.json();
        bookList.innerHTML = '';
        data.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.className = 'col-md-4 mb-4';
            bookItem.innerHTML = `
                <div class="card h-100">
                    ${book.cover ? `<img src="${book.cover}" alt="${book.title} Cover" class="card-img-top img-fluid" style="height: 200px; object-fit: cover;">` : ''}
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text">Author: ${book.author}</p>
                        <p class="card-text">ISBN: ${book.isbn}</p>
                        <p class="card-text">Publication Date: ${book.publication_date}</p>
                        <p class="card-text">Pages: ${book.pages}</p>
                        <p class="card-text">Language: ${book.language}</p>
                    </div>
                    <div class="card-footer mt-auto d-flex justify-content-between">
                        <button class="btn btn-warning edit-book" data-id="${book.id}">Edit</button>
                        <button class="btn btn-danger delete-book" data-id="${book.id}">Delete</button>
                    </div>
                </div>
            `;
            bookList.appendChild(bookItem);
        });
    };

    const isValidDate = (dateString) => {
        const regEx = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateString.match(regEx)) return false;
        const d = new Date(dateString);
        const dNum = d.getTime();
        if (!dNum && dNum !== 0) return false;
        return d.toISOString().slice(0, 10) === dateString;
    };

    const isValidInteger = (value) => {
        return /^\d+$/.test(value);
    };

    const saveBook = async () => {
        const title = document.getElementById('book-title').value;
        const author = document.getElementById('book-author').value;
        const isbn = document.getElementById('book-isbn').value;
        const publicationDate = document.getElementById('book-publication-date').value;
        const pages = document.getElementById('book-pages').value;
        const language = document.getElementById('book-language').value;
        const cover = document.getElementById('book-cover').files[0];

        if (title && author && isbn && publicationDate && pages && language) {
            if (!isValidDate(publicationDate)) {
                alert("Publication date must be in YYYY-MM-DD format.");
                return;
            }
            if (!isValidInteger(pages)) {
                alert("Pages must be a valid integer.");
                return;
            }

            const method = currentBookId ? 'PUT' : 'POST';
            const url = currentBookId ? `/api/books/${currentBookId}/` : '/api/books/';

            const formData = new FormData();
            formData.append('title', title);
            formData.append('author', author);
            formData.append('isbn', isbn);
            formData.append('publication_date', publicationDate);
            formData.append('pages', pages);
            formData.append('language', language);
            if (cover) {
                formData.append('cover', cover);
            }

            const response = await fetch(url, {
                method: method,
                body: formData
            });

            if (response.ok) {
                fetchBooks();
                resetForm();
                bookModal.hide();
                currentBookId = null;
            } else {
                const errorData = await response.json();
                alert('Error saving book: ' + JSON.stringify(errorData));
            }
        } else {
            alert('All fields are required');
        }
    };

    const resetForm = () => {
        document.getElementById('book-title').value = '';
        document.getElementById('book-author').value = '';
        document.getElementById('book-isbn').value = '';
        document.getElementById('book-publication-date').value = '';
        document.getElementById('book-pages').value = '';
        document.getElementById('book-language').value = '';
        document.getElementById('book-cover').value = '';
        document.getElementById('file-name').textContent = 'No file chosen';
    };

    const editBook = async (id) => {
        currentBookId = id;
        const response = await fetch(`/api/books/${id}/`);
        const book = await response.json();
        
        modalTitle.textContent = "Edit Book";
        document.getElementById('book-title').value = book.title;
        document.getElementById('book-author').value = book.author;
        document.getElementById('book-isbn').value = book.isbn;
        document.getElementById('book-publication-date').value = book.publication_date;
        document.getElementById('book-pages').value = book.pages;
        document.getElementById('book-language').value = book.language;
        document.getElementById('file-name').textContent = book.cover ? book.cover.split('/').pop() : 'No file chosen';
        document.getElementById('book-cover').value = '';
        bookModal.show();
    };

    const deleteBook = async (id) => {
        if (confirm('Are you sure you want to delete this book?')) {
            const response = await fetch(`/api/books/${id}/`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchBooks();
            } else {
                alert('Error deleting book');
            }
        }
    };

    addBookButton.addEventListener('click', () => {
        currentBookId = null;
        modalTitle.textContent = "Add New Book";
        resetForm();
        bookModal.show();
        setDefaultLanguage();
    });

    saveBookButton.addEventListener('click', saveBook);

    bookList.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-book')) {
            editBook(e.target.getAttribute('data-id'));
        } else if (e.target.classList.contains('delete-book')) {
            deleteBook(e.target.getAttribute('data-id'));
        }
    });

    fileInput.addEventListener('change', (e) => {
        const fileName = e.target.files[0] ? e.target.files[0].name : 'No file chosen';
        fileNameSpan.textContent = fileName;
    });

    publicationDateInput.addEventListener('focus', () => {
        publicationDateInput.showPicker();
    });

    populateLanguages();
    setDefaultLanguage();
    fetchBooks();
});