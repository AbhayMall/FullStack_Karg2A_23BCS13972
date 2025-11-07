let books = [];

const bookForm = document.getElementById('bookForm');
const bookList = document.getElementById('bookList');
const searchInput = document.getElementById('search');

function showBooks(items) {
  bookList.innerHTML = '';
  for (let book of items) {
    let li = document.createElement('li');
    li.textContent = `${book.title} by ${book.author}`;
    
    let deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => {
      books = books.filter(b => b !== book);
      showBooks(books);
    };

    li.appendChild(deleteBtn);
    bookList.appendChild(li);
  }
}

bookForm.onsubmit = function(e) {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;

  books.push({ title, author });
  showBooks(books);

  bookForm.reset();
};

searchInput.oninput = function() {
  const term = searchInput.value.toLowerCase();
  showBooks(books.filter(b => b.title.toLowerCase().includes(term)));
};

showBooks(books);
