import notesList from './data/notes.js';
// рендер таблиці
const makeNotesTableRowMarkup = note => {
  const { name, created, category, content } = note;

  return `  
        <tr>
          <td></td>
          <td>${name}</td>
          <td>${created}</td>
          <td>${category}</td>
          <td>${content}</td>
          <td>Dates</td>
          <td>
            <button>Edit</button>
            <button>Archive</button>
            <button type="button" class="delete__button">Delete</button>
          </td>
        </tr>
  `;
};

const tableEl = document.querySelector('.js-notes-table');
const notesTableRowsMarkup = notesList.map(makeNotesTableRowMarkup).join('');

tableEl.insertAdjacentHTML('beforeend', notesTableRowsMarkup);

// відкриття і закриття форми
const lightbox = document.querySelector('.js-lightbox');
const openFormBtn = document.querySelector('[data-action="open-form"]');
openFormBtn.addEventListener('click', onOpenForm);

function onOpenForm() {
  lightbox.classList.add('is-open');
}

const closeFormBtn = document.querySelector('[data-action="close-form"]');
closeFormBtn.addEventListener('click', onCloseForm);

function onCloseForm() {
  lightbox.classList.remove('is-open');
}

// додавання нового запису
const addNoteForm = document.querySelector('.note-form');
addNoteForm.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();
  const formElements = event.currentTarget.elements;
  const name = formElements.name.value;
  const created = formElements.created.value;
  const category = formElements.categ.value;
  const content = formElements.content.value;

  const newNote = {
    name,
    created,
    category,
    content,
  };
  const newNoteRow = makeNotesTableRowMarkup(newNote);
  const tbodyEl = document.querySelector('tbody');
  tbodyEl.insertAdjacentHTML('beforeend', newNoteRow);
  addNoteForm.reset();
  onCloseForm();
}

// видалення запису

tableEl.addEventListener('click', onDel);
function onDel(event) {
  if (event.target.classList.value === 'delete__button') {
    const deleteNoteBtn = document.querySelectorAll('.delete__button');
    for (let i = 0; i < deleteNoteBtn.length; i++) {
      deleteNoteBtn[i].onclick = function () {
        let parent = this.parentNode;
        parent.parentNode.remove();
      };
    }
  }
}