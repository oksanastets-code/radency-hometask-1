import notesList from './data/notes.js';
// рендер таблиці
const makeNotesTableRowMarkup = note => {
  let { name, created, category, content, dates } = note;
  dates = getDates(content);
  return `  
        <tr class="js-notes-row">
          <td class="js-name">${name}</td>
          <td class="js-created">${created}</td>
          <td class="js-categories">${category}</td>
          <td class="js-content">${content}</td>
          <td>${dates}</td>
          <td>
            <button type="button" class="edit__button">Edit</button>
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
const saveBtn = document.querySelector('[data-action="edit-note"]');
const addBtn = document.querySelector('[data-action="add-note"]');
openFormBtn.addEventListener('click', onOpenForm);

function onOpenForm() {
  lightbox.classList.add('is-open');
  addNoteForm.classList.remove('visually-hidden');
  saveBtn.style.display = 'none';
}

const closeFormBtn = document.querySelector('[data-action="close-form"]');
closeFormBtn.addEventListener('click', onCloseForm);

function onCloseForm() {
  lightbox.classList.remove('is-open');
  addNoteForm.classList.add('visually-hidden');
  archiveTableEl.classList.add('visually-hidden');
  addBtn.style.display = '';
  saveBtn.style.display = '';
}

// додавання нового запису
addNoteForm.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();
  const formElements = event.currentTarget.elements;

  const name = formElements.name.value;
  const category = formElements.categ.value;
  const content = formElements.content.value;

  const created = '';
  renderNewNote(name, created, category, content);

  addNoteForm.reset();
  onCloseForm();
  renderSummaryTable();
  deleteNote(getBtns);
  archiveNote(getBtns);
  editNote(getBtns);
}

const tbodyEl = document.querySelector('tbody');
let editTarget = [];
let index = -1;
function renderNewNote(name, created, category, content) {
  const newNote = {
    name,
    created,
    category,
    content,
  };

  if (!editTarget.length) {
    newNote.created = getCurrentDate();
  } else {
    editTarget.filter(item => {
      if (item.className === 'js-created') {
        newNote.created = item.textContent;
      }
    });
  }

  newNote.dates = getDates(content);
  // console.log(newNote);

  const newNoteRow = makeNotesTableRowMarkup(newNote);
  tbodyEl.insertAdjacentHTML('beforeend', newNoteRow);

  if (editTarget.length) {
    const array = [...tbodyEl.children];
    array[index].remove();
  }
}
// редагування запису

const getBtns = str => {
  return document.querySelectorAll(str);
};
function editNote(callback) {
  const editBtns = callback('.edit__button');
  editBtns.forEach(btn => {
    const editNoteData = {};
    btn.addEventListener('click', event => {
      const parent = btn.parentNode.parentNode;
      editTarget = [...btn.parentNode.parentNode.children];
      lightbox.classList.add('is-open');
      addNoteForm.classList.remove('visually-hidden');
      addBtn.style.display = 'none';

      // берем індекс цільової записки
      index = [...tbodyEl.children].indexOf(parent);
      
      // берем дані цільової записки
      editTarget.map(item => {
        if (item.className === 'js-name') {
          editNoteData.name = item.textContent;
        }
        if (item.className === 'js-categories') {
          editNoteData.category = item.textContent;
        }
        if (item.className === 'js-content') {
          editNoteData.content = item.textContent;
        }
      });

      // заповнення форми даними для редагування
      const inputs = callback('input');
      inputs.forEach(input => {
        if (input.name === 'name') {
          input.value = editNoteData.name;
        }
        if (input.name === 'categ') {
          input.value = editNoteData.category;
        }
        if (input.name === 'content') {
          input.value = editNoteData.content;
        }
      });

      // console.log('new editNoteData', editNoteData);
      // console.log(editTarget);

      renderSummaryTable();

      return editTarget, index;
    });
  });
}
editNote(getBtns);

// видалення запису

function deleteNote(callback) {
  const list = callback('.delete__button');
  list.forEach(btn => {
    btn.addEventListener('click', event => {
      const parent = btn.parentNode.parentNode;
      parent.remove();
      renderSummaryTable();
    });
  });
}
deleteNote(getBtns);

// архівування запису
function archiveNote(callback) {
  const list = callback('.archieve__button');
  list.forEach(btn => {
    btn.addEventListener('click', event => {
      const parent = btn.parentNode.parentNode;
      parent.style.display = 'none';
      parent.dataset.status = 'archieved';
      renderSummaryTable();
      getArchiveTableData(trs);
    });
  });
}
archiveNote(getBtns);

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
  return [...document.querySelectorAll('.js-categories')];
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
let unarchiveBtns = [];
function getUnarchiveBtns() {
  unarchiveBtns = [...archiveTableEl.querySelectorAll('.unarchieve__button')];
  unarchiveBtns.forEach(btn => {
    btn.addEventListener('click', event => {
      const parent = btn.parentNode.parentNode;
      const identity = parent.firstElementChild.textContent;
      const index = unarchiveBtns.indexOf(btn);
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
