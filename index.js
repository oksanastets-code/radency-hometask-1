import notesList from './data/notes.js';
// рендер таблиці
const makeNotesTableRowMarkup = note => {
  const { name, created, category, content} = note;

    return `
  
        <tr>
          <td></td>
          <td>${name}</td>
          <td>${created}</td>
          <td>${category}</td>
          <td>${content}</td>
          <td>Dates</td>
          <td>Edit</td>
          <td>Save</td>
          <td>Remove</td>
        </tr>
  
  `;
};

const tableEl = document.querySelector('.js-notes-table');
const notesTableRowsMarkup = notesList
  .map(makeNotesTableRowMarkup)
  .join('');

tableEl.insertAdjacentHTML('beforeend', notesTableRowsMarkup);

// відкриття і закриття форми
const lightbox = document.querySelector('.js-lightbox');
const openFormBtn = document.querySelector('[data-action="open-form"]');
openFormBtn.addEventListener('click', onOpenForm);

function onOpenForm() {
    lightbox.classList.add('is-open')
}

const closeFormBtn = document.querySelector('[data-action="close-form"]');
closeFormBtn.addEventListener('click', onCloseForm);

function onCloseForm() {
    lightbox.classList.remove('is-open')
}


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
    }
    const newNoteRow = makeNotesTableRowMarkup(newNote);
    // console.log(newNote);
    // console.log(makeNotesTableRowMarkup(newNote));
    tableEl.insertAdjacentHTML('beforeend', newNoteRow);
    addNoteForm.reset();
    onCloseForm();
}
