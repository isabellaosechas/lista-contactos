const REGEX_NAME = /^[A-Z][a-z ]*[A-Z][a-z]*$/;
const NUMBER_REGEX = /^[0]((424)|(426)|(412)|(414))[0-9]{7}$/;

// Selectores
const inputName = document.querySelector('#input-name');
const inputNumber = document.querySelector('#input-number');
const formBtn = document.querySelector('#form-btn');
const form = document.querySelector('#form');
const list = document.querySelector('#list');

let contacts = [];

// Validations
let nameValidation = false;
let numberValidation = false;

// Functions
const validateInput = (input, validation) => {
  // Validar boton
  if (nameValidation && numberValidation) {
    formBtn.disabled = false;
    
  } else {
    formBtn.disabled = true;
    formBtn.classList.add('formbtn-disabled');
  }

  // 2. Mostrar validacion en el html
  const infoText = input.parentElement.children[2];

  if (input.value === '') {
    input.classList.remove('correct');
    input.classList.remove('incorrect');
    infoText.style.display = 'none';
  } else if (validation) {
    input.classList.add('correct');
    input.classList.remove('incorrect');
    infoText.style.display = 'none';
  } else {
    input.classList.add('incorrect');
    input.classList.remove('correct');
    infoText.style.display = 'block';
  }
}

const renderContacts = () => {
  list.innerHTML = '';
  contacts.forEach(contact => {
    // Crear elemento
    const li = document.createElement('li');
    li.classList.add('list-item');
    li.id = contact.id;
    li.innerHTML = `
      <button class="delete-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
      <p>${contact.name}</p>
      <p>${contact.phone}</p>
      <button class="edit-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </button>
    `;
    list.append(li);
  });
}

// 1. Add event to inputs
inputName.addEventListener('input', (e) => {
  // 1. Comparar valor del input con mi regex
  nameValidation = REGEX_NAME.test(inputName.value);
  // 2. Mostrar en el html la validacion
  validateInput(inputName, nameValidation);
});

inputNumber.addEventListener('input', (e) => {
  // 1. Comparar valor del input con mi regex
  numberValidation = NUMBER_REGEX.test(inputNumber.value);
  validateInput(inputNumber, numberValidation);
});

form.addEventListener('submit', e => {
  // Previene el evento pre definido
  e.preventDefault();
  // Verifica que las validaciones sean verdaderas
  if (!nameValidation || !numberValidation) return;
  // Obtengo el ultimo elemento del array
  const lastElement = contacts[contacts.length - 1];
  // Crear objeto con el nombre y el numero
  const newContact = {
    id: lastElement ? lastElement.id + 1 : 1, // compruebo si el ultimo elemento existe
    name: inputName.value,
    phone: inputNumber.value,
  }
  // Agrego al array
  contacts = contacts.concat(newContact);

  // Guardar en el navegador
  localStorage.setItem('contacts', JSON.stringify(contacts));

  // Mostrar en el html
  renderContacts();
});

list.addEventListener('click', e => {
  const deleteBtn = e.target.closest('.delete-btn');
  const editBtn = e.target.closest('.edit-btn');

  if (deleteBtn) {
    const id = Number(deleteBtn.parentElement.id);
    contacts = contacts.filter(contact => contact.id !== id);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    renderContacts();
  }

  if (editBtn) {
    const li = editBtn.parentElement;
    const name = li.children[1];
    const phone = li.children[2];
    const nameEditValidation =  REGEX_NAME.test(name.innerHTML);
    const phoneEditValidation = NUMBER_REGEX.test(phone.innerHTML);

    

    if (li.classList.contains('editando')) {

      console.log(nameEditValidation, phoneEditValidation);
    if (!nameEditValidation || !phoneEditValidation){
        return;
      }

      // Logica de negocio
      contacts = contacts.map(contact => {
        if (contact.id === Number(li.id)) {
          return {...contact, name: name.innerHTML, phone: phone.innerHTML}
        } else {
          return contact
        }
      });
      localStorage.setItem('contacts', JSON.stringify(contacts));

      
      // Logica del renderizado
      li.classList.remove('editando');
      name.removeAttribute('contenteditable');
      phone.removeAttribute('contenteditable');
      name.classList.remove('border-edit');
      phone.classList.remove('border-edit');
      editBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>
      `;
    } else {
      editBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
      </svg>
      `;
      li.classList.add('editando');
      name.setAttribute('contenteditable', true);
      phone.setAttribute('contenteditable', true);
      name.classList.add('border-edit');
      phone.classList.add('border-edit');
    }
  }
});


(() => {
  const contactStringArray = localStorage.getItem('contacts');
  if (contactStringArray) {
    contacts = JSON.parse(contactStringArray);
    renderContacts();
  }
})();