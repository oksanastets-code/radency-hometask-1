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

  renderNewNote(name, category, content);

  addNoteForm.reset();
  onCloseForm();
  renderSummaryTable();
}

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
    renderSummaryTable();
  }
}
// архівування запису

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
    renderSummaryTable();
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
  console.log(arrayByCategory);
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
  //   console.log(newSummaryRowData);
  summaryData.push(newSummaryRowData);
  //   console.log(summaryData);
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
console.log(archiveLink);
archiveLink.addEventListener('click', onaAchiveLinkClick);
function onaAchiveLinkClick(e) {
  e.preventDefault();

  const body = document.querySelector('body');
  const archiveTableHeadingEl = `<table class="js-archive-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Content</th>
          <th></th>
        </tr>
      </thead>
    </table>`;
    body.insertAdjacentHTML('beforeend', archiveTableHeadingEl);
    renderArchiveTable();
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
let archiveData = [
  {
    name: 'cnkdnc',
    category: 'Task',
    content: ' vnfdk kdk klcd k',
  },
  {
    name: 'cnkdnc',
    category: 'Task',
    content: ' vnfdk kdk klcd k',
  },
  {
    name: 'cnkdnc',
    category: 'Task',
    content: ' vnfdk kdk klcd k',
  },
];
function renderArchiveTable() {
    const archiveTableEl = document.querySelector('.js-archive-table');
    const archiveTableRowsMarkup = archiveData.map(makeArchiveTableRowMarkup).join('');
    archiveTableEl.insertAdjacentHTML('beforeend', archiveTableRowsMarkup);


}
