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

// форма

// const form = document.querySelector('.js-register-form');

// form.addEventListener('submit', onFormSubmit);

// function onFormSubmit(event) {
//   event.preventDefault();

//   const formData = new FormData(event.currentTarget);

//   console.log(formData);

//   formData.forEach((value, name) => {
//     console.log('onFormSubmit -> name', name);
//     console.log('onFormSubmit -> value', value);
//   });
// }




const addNoteBtn = document.querySelector('[data-action="add-note"]');
addNoteBtn.addEventListener('click', onSubmit);

const addNoteForm = document.querySelector('.note-form');
addNoteForm.addEventListener('submit', onSubmit);
// inputs
const nameInputField = document.querySelector('[data-action="name-input"]');
nameInputField.addEventListener('blur', onInput);

const categInputField = document.querySelector('[data-action="categ-input"]');
categInputField.addEventListener('blur', onInput);

const contentInputField = document.querySelector('[data-action="content-input"]');
contentInputField.addEventListener('blur', onInput);

function onInput(e) {
    console.log(e.currentTarget.name, e.currentTarget.value);
}

function onSubmit(event) {
    event.preventDefault();
     
  console.log('Клик по целевой кнопке');
    addNoteForm.reset();
  
}
