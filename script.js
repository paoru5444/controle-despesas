const transactionsUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount')

const localStorageTransactions = JSON.parse(localStorage
  .getItem('transactions'))
let transactions = localStorage
  .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = id => {
  transactions = transactions.
    filter(transaction => transaction.id !== id)
  updateLocalStorage()
  init()
}

const addTransactionIntoDOM = ({ amount, name, id }) => {
  const operator = amount < 0 ? '-' : '+';
  const CSSClass = amount < 0 ? 'minus' : 'plus';
  const amountWithoutOperator = Math.abs(amount)
  const li = document.createElement('li')
  li.classList.add(CSSClass)
  li.innerHTML = `
    ${name} <span>${operator}R$${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${id})">
      x
    </button>
  `
  // append adiciona um node no fim da lista
  // prepend adiciona um node no inicio da lista
  transactionsUl.prepend(li);
}

const getExprenses = amounts => Math.abs(amounts
  .filter(value => value < 0)
  .reduce((accumulator, value) => accumulator + value, 0))
  .toFixed(2)

const getIncome = amounts => amounts
.filter(value => value > 0)
.reduce((accumulator, value) => accumulator + value, 0)
.toFixed(2)

// High-order function, quando baseado em uma condição, deseja-se obter um array com apenas alguns items do array original.
const getTotal = amounts => amounts
  .reduce((accumulator, transaction) => accumulator + transaction, 0)
  .toFixed(2 )

const updateBalance = () => {  
  const transactionsAmounts = transactions.map(({amount}) => amount);
  // Usa-se o reduce para "reduzir" um array em um determinado valor.
  const total = getTotal(transactionsAmounts)
  const income = getIncome(transactionsAmounts)
  const expense = getExprenses(transactionsAmounts)
  
  balanceDisplay.textContent = `R$ ${total}`
  incomeDisplay.textContent = `R$ ${income}`
  expenseDisplay.textContent = `R$ ${expense}`
}

const init = () => {
  transactionsUl.innerHTML = '';
  transactions.forEach(addTransactionIntoDOM);
  updateBalance();
}

init(); 

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

const addToTransactionsArray = (name, amount) => {
  const transaction = {
    id: generateID(),
    name: name,
    amount: Number(amount)
  }

  transactions.push(transaction)
}

const cleanInputs = () => {
  inputTransactionName.value = '';
  inputTransactionAmount.value = '';
}

 const handleFormSubmit = event => {
   // Previne que o form faça um submit
  event.preventDefault();

  const transactionName = inputTransactionName.value.trim()
  const transactionAmount = inputTransactionAmount.value.trim()

  const isSomeInputEmpty = transactionName === '' || transactionAmount === '';

  // Trim() remove espaços vazios no  inicio e no fim da string
  if (isSomeInputEmpty) {
    alert("Por favor, preencha tanto o nome quanto o valor da transação")
    return
  }

  addToTransactionsArray(transactionName, transactionAmount)

  init()
  updateLocalStorage()
  cleanInputs()
 }

// Captura o evento de submit do formulario
form.addEventListener('submit', handleFormSubmit)
