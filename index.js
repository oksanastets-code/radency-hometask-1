import notesList from './data/notes.js';
// рендер таблиці
const makeNotesTableRowMarkup = note => {
  let { name, created, category, content, dates } = note;
  dates = getDates(content);
  return `  
        <tr>
         
          <td>${name}</td>
          <td>${created}</td>
          <td class="js-categories">${category}</td>
          <td>${content}</td>
          <td>${dates}</td>
          <td>
            <button>Edit</button>
            <button type="button" class="archieve__button">Archive</button>
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
  const category = formElements.categ.value;
  const content = formElements.content.value;

  makeNewNote(name, category, content);

  addNoteForm.reset();
  onCloseForm();
}

function makeNewNote(name, category, content) {
  const newNote = {
    name,
    category,
    content,
  };
  newNote.created = getCurrentDate();
  newNote.dates = getDates(content);
  console.log(newNote);

  const newNoteRow = makeNotesTableRowMarkup(newNote);
  const tbodyEl = document.querySelector('tbody');
  tbodyEl.insertAdjacentHTML('beforeend', newNoteRow);
}

// видалення запису

tableEl.addEventListener('click', onDel);
function onDel(event) {
  console.log(event.target.className);
  if (event.target.className === 'delete__button') {
    const deleteNoteBtn = document.querySelectorAll('.delete__button');
    for (let i = 0; i < deleteNoteBtn.length; i++) {
      deleteNoteBtn[i].onclick = function () {
        let parent = this.parentNode;
        parent.parentNode.remove();
      };
    }
  }
}
// архівування запису
let summaryData = [];
tableEl.addEventListener('click', onArch);
function onArch(event) {
  if (event.target.className === 'archieve__button') {
    const archiveNoteBtn = document.querySelectorAll('.archieve__button');
    for (let i = 0; i < archiveNoteBtn.length; i++) {
      archiveNoteBtn[i].onclick = function () {
        let parent = this.parentNode;
        //   parent.parentNode.classList.add('visually-hidden');
        parent.parentNode.style.display = 'none';
        parent.parentNode.dataset.status = 'archieved';
      };
    }
    summaryData = [];
    makeSummaryTableRowData();
    const summaryTableEl = document.querySelector('.js-summary-table');
    const summaryTableRowsMarkup = summaryData.map(makeSummaryTableRowMarkup).join('');
    summaryTableEl.innerHTML = '';
    summaryTableEl.insertAdjacentHTML('beforeend', summaryTableRowsMarkup);
  }
}

// згенерувати дату
function getCurrentDate() {
  const newDate = new Date();
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return newDate.toLocaleDateString('en-US', options);
}

// вибрати дати з контенту
function getDates(str) {
  const regex = /^(0?[1-9]|1[0-2]).?\/?(0?[1-9]|[12][0-9]|3[01]).?\/?\d{4}$/;
  let foundedDates = [];
  str.split(' ').forEach(s => {
    const matches_array = s.match(regex);
    if (matches_array) {
      foundedDates.push(matches_array[0]);
    }
  });
  return foundedDates.join(', ');
}

// рендер підсумкової таблиці

const tds = [...document.querySelectorAll('.js-categories')];

const makeSummaryTableRowMarkup = data => {
  let { option, active, archieved } = data;

  return `  
        <tr>
         
          <td>${option}</td>
          <td>${active}</td>
          <td>${archieved}</td>
          
        </tr>
  `;
};

const summaryTableEl = document.querySelector('.js-summary-table');
const summaryTableRowsMarkup = summaryData.map(makeSummaryTableRowMarkup).join('');

summaryTableEl.insertAdjacentHTML('beforeend', summaryTableRowsMarkup);

const optionsArray = [...document.getElementById('categories').children].map(
  option => option.value,
);
console.log(optionsArray);

function makeSummaryTableRowData() {
  optionsArray.map(item => {
    countNotesByCategoryAndStatus(tds, item);
  });
}

function countNotesByCategoryAndStatus(array, option) {
  const arrayByCategory = array.filter(td => {
    return td.textContent === option;
  });

  let activeArray = [];
  let archievedArray = [];

  arrayByCategory.filter(item => {
    if (item.parentElement.hasAttribute('data-status')) {
      archievedArray.push(item.parentElement);
    }
    if (!item.parentElement.hasAttribute('data-status')) {
      activeArray.push(item.parentElement);
    }
  });

  const newSummaryRowData = {};
  newSummaryRowData.option = option;
  newSummaryRowData.active = activeArray.length;
  newSummaryRowData.archieved = archievedArray.length;
  console.log(newSummaryRowData);
  summaryData.push(newSummaryRowData);

  //   const newSummaryRow = makeSummaryTableRowMarkup(newSummaryRowData);
  //   summaryTableEl.insertAdjacentHTML('beforeend', newSummaryRow);

  //   console.log(string, archievedArray, activeArray);
  console.log(summaryData);
  return summaryData;
}
// makeSummaryTableRowData();
