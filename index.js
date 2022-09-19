import notesList from './data/notes.js';
// рендер таблиці
const makeNotesTableRowMarkup = note => {
  let { name, created, category, content, dates } = note;
  dates = getDates(content);
  return `  
        <tr class="js-notes-row">
          <td class="js-name">${name}</td>
          <td>${created}</td>
          <td class="js-categories">${category}</td>
          <td class="js-content">${content}</td>
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
const addNoteForm = document.querySelector('.note-form');
const openFormBtn = document.querySelector('[data-action="open-form"]');

openFormBtn.addEventListener('click', onOpenForm);

function onOpenForm() {
  lightbox.classList.add('is-open');
  addNoteForm.classList.remove('visually-hidden');
}

const closeFormBtn = document.querySelector('[data-action="close-form"]');
closeFormBtn.addEventListener('click', onCloseForm);

function onCloseForm() {
  lightbox.classList.remove('is-open');
  addNoteForm.classList.add('visually-hidden');
  archiveTableEl.classList.add('visually-hidden');
}

// додавання нового запису
addNoteForm.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();
  const formElements = event.currentTarget.elements;

  const name = formElements.name.value;
  const category = formElements.categ.value;
  const content = formElements.content.value;

  renderNewNote(name, category, content);

  addNoteForm.reset();
  onCloseForm();
  renderSummaryTable();
}

const tbodyEl = document.querySelector('tbody');
function renderNewNote(name, category, content) {
  const newNote = {
    name,
    category,
    content,
  };
  newNote.created = getCurrentDate();
  newNote.dates = getDates(content);
  console.log(newNote);

  const newNoteRow = makeNotesTableRowMarkup(newNote);
  tbodyEl.insertAdjacentHTML('beforeend', newNoteRow);
}

// видалення запису

let deleteNoteBtn = document.querySelectorAll('.delete__button');
deleteNoteBtn.forEach(btn => {
  btn.addEventListener('click', event => {
    const parent = btn.parentNode.parentNode;
    parent.remove();
    renderSummaryTable();
  });
});

// архівування запису

let archiveNoteBtn = document.querySelectorAll('.archieve__button');
archiveNoteBtn.forEach(btn => {
  btn.addEventListener('click', event => {
    const parent = btn.parentNode.parentNode;
    parent.style.display = 'none';
    parent.dataset.status = 'archieved';
    renderSummaryTable();
    getArchiveTableData(trs);
  });
});

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

const tds = () => {
  const arrayOfTds = [...document.querySelectorAll('.js-categories')];
  return arrayOfTds;
};

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

const optionsArray = [...document.getElementById('categories').children].map(
  option => option.value,
);

function makeSummaryTableRowData() {
  optionsArray.map(item => {
    countNotesByCategoryAndStatus(tds, item);
  });
}

function countNotesByCategoryAndStatus(callback, option) {
  const array = callback();
  const arrayByCategory = array.filter(td => {
    return td.textContent === option;
  });
  let activeArray = [];
  let archivedArray = [];

  arrayByCategory.filter(item => {
    if (item.parentElement.hasAttribute('data-status')) {
      archivedArray.push(item.parentElement);
    }
    if (!item.parentElement.hasAttribute('data-status')) {
      activeArray.push(item.parentElement);
    }
  });

  const newSummaryRowData = {};
  newSummaryRowData.option = option;
  newSummaryRowData.active = activeArray.length;
  newSummaryRowData.archieved = archivedArray.length;
  summaryData.push(newSummaryRowData);
  return summaryData;
}

let summaryData = [];
function renderSummaryTable() {
  summaryData = [];
  makeSummaryTableRowData();
  const summaryTableEl = document.querySelector('.js-summary-table');
  const summaryTableRowsMarkup = summaryData.map(makeSummaryTableRowMarkup).join('');
  if ([...summaryTableEl.children].length > 1) {
    summaryTableEl.lastElementChild.remove();
  }
  summaryTableEl.insertAdjacentHTML('beforeend', summaryTableRowsMarkup);
}
renderSummaryTable();

// рендер архіву
const archiveLink = document.querySelector('.js-archive');
archiveLink.addEventListener('click', onaAchiveLinkClick);

function onaAchiveLinkClick(e) {
  e.preventDefault();
  lightbox.classList.add('is-open');
  archiveTableEl.classList.remove('visually-hidden');
  renderArchiveTable();
  getUnarchiveBtns();
}
const makeArchiveTableRowMarkup = data => {
  let { name, category, content } = data;
  return `  
        <tr>
          <td>${name}</td>
          <td>${category}</td>
          <td>${content}</td>
          <td>
            <button type="button" class="unarchieve__button">Unarchive</button>
          </td>
        </tr>
  `;
};
let archiveData = [];
const archiveTableEl = document.querySelector('.js-archive-table');

function renderArchiveTable() {
  if ([...archiveTableEl.children].length > 1) {
    archiveTableEl.lastElementChild.remove();
  }
  const archiveTableRowsMarkup = archiveData.map(makeArchiveTableRowMarkup).join('');
  archiveTableEl.insertAdjacentHTML('beforeend', archiveTableRowsMarkup);
}

const trs = () => {
  const arrayOfTrs = [...document.querySelectorAll('.js-notes-row')];
  let archivedList = [];
  arrayOfTrs.filter(item => {
    if (item.hasAttribute('data-status')) {
      archivedList.push(item);
    }
  });
  return archivedList;
};

function getArchiveTableData(foo) {
  const archivedArray = foo();
  archiveData = [];
  archivedArray.map(item => {
    let elName = item.querySelector('.js-name');
    let elCateg = item.querySelector('.js-categories');
    let elContent = item.querySelector('.js-content');
    const newArchiveRow = {};
    newArchiveRow.name = elName.textContent;
    newArchiveRow.category = elCateg.textContent;
    newArchiveRow.content = elContent.textContent;
    archiveData.push(newArchiveRow);
  });
  return archiveData;
}

// розархівування запису
let unarchiveBtn = [];
function getUnarchiveBtns() {
  unarchiveBtn = [...archiveTableEl.querySelectorAll('.unarchieve__button')];
  unarchiveBtn.forEach(btn => {
    btn.addEventListener('click', event => {
      const parent = btn.parentNode.parentNode;
      const identity = parent.firstElementChild.textContent;
      const index = unarchiveBtn.indexOf(btn);
      archiveData.splice(index, 1);
      const arrayOfNamesTds = document.querySelectorAll('.js-name');
      arrayOfNamesTds.forEach(td => {
        if (td.textContent === identity) {
          delete td.parentElement.dataset.status;
          td.parentElement.style.display = '';
          renderSummaryTable();
          renderArchiveTable();
          getUnarchiveBtns();
        }
      });
    });
  });
}
