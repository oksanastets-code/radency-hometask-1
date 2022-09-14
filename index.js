import notesList from './data/notes.js';
// рендер таблиці
const makeNotesTableRowMarkup = note => {
  let { name, created, category, content, dates = '' } = note;
  dates = getDates(content);
  return `  
        <tr>
          <td></td>
          <td>${name}</td>
          <td>${created}</td>
          <td>${category}</td>
          <td>${content}</td>
          <td>${dates}</td>
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

  const notesDate = new Date();
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  let created = formElements.created.value;
  created = notesDate.toLocaleDateString('en-US', options);

  const name = formElements.name.value;
  const category = formElements.categ.value;

  const content = formElements.content.value;

  //  const dates = getDates(content);

  const newNote = {
    name,
    created,
    category,
    content,
    dates: '',
  };

  const newNoteRow = makeNotesTableRowMarkup(newNote);
  const tbodyEl = document.querySelector('tbody');
  tbodyEl.insertAdjacentHTML('beforeend', newNoteRow);
  addNoteForm.reset();
  onCloseForm();
}

// видалення запису

tableEl.addEventListener('click', onDel);
async function onDel(event) {
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
// вибрати дати з контенту
function getDates(str) {
  const regex = /^(0?[1-9]|1[0-2]).?\/?(0?[1-9]|[12][0-9]|3[01]).?\/?\d{4}$/;
  let foundedDates = [];
  str.split(' ').forEach(s => {
    const matches_array = s.match(regex);
    // console.log(matches_array);
    if (matches_array) {
      foundedDates.push(matches_array[0]);
    }
  });
  //   console.log(foundedDates);
  return foundedDates.join(', ');
}
