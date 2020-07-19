// Константы элементов.
const BUTTON = document.querySelector('.aside__button'); // Кнопка для проверки палетов – запускает все функции.
const FIELD_CODE = document.querySelector('.article__code-wrap'); // Блок, содержащий все ошибки.
const QUANTITY = document.querySelector('.article__quantity'); // Блок, сообщающий количество коробок.
const LIST = document.querySelector('.list'); // Блок, содержащий список коробок.
const ARTICLE = document.querySelector('.article'); // Блок информации.
const INPUT_FILE = document.getElementById('file'); // Кнопка загрузки файла.
const LOAD_STATE = document.querySelector('.aside__load-state'); // Константа, выводящая информацию о файле.


let data = null; // Переменная, содержащая данные.
// Функция, которая заносит переданную информацию в переменную.
function readFile(object) {
  if (object.files[0] == undefined || object.files[0].type.includes('json') === false) { // Если файл не найден или не соответствует формату – говорим об этом и выходим из функции.
    alert("Загрузите файл с расширением 'json'.");
    return;
  }
  FIELD_CODE.innerHTML = ''; // Обнуляем содержимое элементов перед открытием нового файла.
  LIST.innerHTML = '';
  var file = object.files[0];
  var reader = new FileReader();
  reader.onload = function() {
    data = JSON.parse(reader.result);
    checkUniqueCode(); // Функция, проверяющая уникальность кодов.
    checkQuantity(); // Функция, проверяющая количество кодов.
    checkListBox(); // Функция, проверяющая и сортирующая коробки.
  };
  reader.readAsText(file)
}

let count = null; // Счётчик коробок.
let arr = []; // Массив кодов.

// Функция, создающая параграф, отображающий ошибку и код.
const createParagraph = (code) => {
  let element = document.createElement('p');
  element.className = 'article__code';
  element.innerText = `Ошибка: данный код не уникален – ${code}`;

  if (FIELD_CODE.children.length > 0) { // Выполняем условие толко если есть ошибки, иначе добавляем ошибку.
    for (let i = 0; i < FIELD_CODE.children.length; i ++) {  
      if (FIELD_CODE.children.length > 0 && FIELD_CODE.children[i].innerText === element.innerText) { // Если ошибка уже добавлена – выходим.
        return;
      }
    }
    FIELD_CODE.append(element);
  }
  else {
    FIELD_CODE.append(element);
  }
};

// Функция, создающая сообщение об успешной проверке.
const createParagraphSuccessful = () => {
  let element = document.createElement('p');
  element.className = 'article__code article__code_successful';
  element.innerText = 'Все коды уникальны!';
  FIELD_CODE.append(element); // Добавляем сообщение в элемент ошибок.
};

// Функция, проверяющая уникальность кодов.
let checkUniqueCode = () => {
  ARTICLE.classList.remove('hide'); // Показываем информацию.
  arr = []; // Обнуляем массив (не очень хорошее решение).
  for (let i = 0; i < data.box.length; i ++) {
    for (let x = 0; x < data.box[i].amclist.length; x ++) {
      arr.push(data.box[i].amclist[x].code);
    }
  }

  for (let i = 0; i < arr.length; i ++) {
    for (let x = i + 1; x < arr.length; x ++) {
      if (arr[i] == arr[x]) {
        createParagraph(arr[i]); // Если коды совпадают – создаём сообщение об ошибке.
      }
    }
  }

  if (FIELD_CODE.children.length === 0) { // Если сообщений об ошибок нет – создаём сообщение об этом.
    createParagraphSuccessful();
  }
};


// Функция, проверяющая количество кодов.
const checkQuantity = () => {
  QUANTITY.textContent = `Количество кодов: ${arr.length}`;
};

// Функция, проверяющая и сортирующая коробки.
const checkListBox = () => {
  function compareNumbers(a, b) { // Функция сортировки (от самой свежей коробки).
    return b - a;
  }

  let map = new Map(); // Коллекция, содержащая информацию коробки и строку, полученную из даты коробки.
  let numbers = []; // Массив для сортировки.

  // Если список уже указан – делать ничего не надо.
  if (LIST.children.length === 0) {
    data.box.forEach(item => { // Перебераем коробки.
      map.set(item.packdate.replace(/[^\d]/g, ''), `${item.boxnumber} – ${item.packdate}`); // Заносим информацию о коробках в список.
      numbers.push(item.packdate.replace(/[^\d]/g, '')); // Заносим преобразованную (с помощью регулярного выражения убираем всё, кроме чисел) строку в массив.
      numbers.sort(compareNumbers); // Сортируем массив, используя функции сортровки.
    });

    // Перебираем отсортированный массив и по порядку заносим значение коллекции в список коробок.
    numbers.forEach(item => {
      let element = document.createElement('li');
      element.className = 'list__item';
      element.innerText = `${map.get(item)}`; // Добавляем значение коллекции (информацию о коробке) в элемент.
      LIST.append(element);
    })
  }
};

BUTTON.addEventListener('click', () => {
  readFile(document.getElementById('file'))
});

INPUT_FILE.onchange = function() {
  LOAD_STATE.innerHTML = `Загружен файл – ${INPUT_FILE.files[0].name}`;
};