'use strict';

// Simply Bank App

const account1 = {
  userName: 'Cecil Ireland',
  transactions: [500, 250, -300, 5000, -850, -110, -170, 1100],
  interest: 1.5,
  pin: 1111,
};

const account2 = {
  userName: 'Amani Salt',
  transactions: [2000, 6400, -1350, -70, -210, -2000, 5500, -30],
  interest: 1.3,
  pin: 2222,
};

const account3 = {
  userName: 'Corey Martinez',
  transactions: [900, -200, 280, 300, -200, 150, 1400, -400],
  interest: 0.8,
  pin: 3333,
};

const account4 = {
  userName: 'Kamile Searle',
  transactions: [530, 1300, 500, 40, 190],
  interest: 1,
  pin: 4444,
};

const account5 = {
  userName: 'Oliver Avila',
  transactions: [630, 800, 300, 50, 120],
  interest: 1.1,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.total__value--in');
const labelSumOut = document.querySelector('.total__value--out');
const labelSumInterest = document.querySelector('.total__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerTransactions = document.querySelector('.transactions');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayTransactions = function(transactions, sort = false) {
    containerTransactions.innerHTML = ''

    const transacs = sort ? transactions.slice().sort((x, y) => x - y) : transactions
    transacs.forEach(function(trans, index) {

        const transType = trans > 0 ? 'deposit' : 'withdrawal'
        const transactionRow = `
        <div class="transactions__row">
          <div class="transactions__type transactions__type--${transType}">
            ${index + 1} ${transType}
          </div>
          <div class="transactions__value">${trans}</div>
        </div>
        `
        containerTransactions.insertAdjacentHTML('afterbegin', transactionRow)
    })
}




const createNickName = function(accs) {
  accs.forEach(function(acc) {
    acc.nickName = acc.userName
  })
}
createNickName(accounts)


const displayBalans = function(account) {
  const balans = account.transactions.reduce((acc, trans) => acc + trans, 0)
  account.balans = balans;
  labelBalance.textContent = `${balans}$`
}



const displayTotal = function(account) {
  const depositTotal = account.transactions.filter(trans => trans > 0).reduce((acc, trans) => acc + trans, 0)
  labelSumIn.textContent = `${depositTotal}$`

  const withdrawalTotal = account.transactions.filter(trans => trans < 0).reduce((acc, trans) => acc + trans, 0)
  labelSumOut.textContent = `${withdrawalTotal}$`

  const interestTotal = account.transactions.filter(trans => trans > 0).map(depos => (depos * 1.1) / 100).reduce((acc, interest) => acc + interest)
  labelSumInterest.textContent = `${interestTotal}$`
}


const updateUI = function(currentAccount) {
  displayBalans(currentAccount)
  displayTotal(currentAccount)
  displayTransactions(currentAccount.transactions)
}




let currentAccount;

btnLogin.addEventListener('click', function(e) {
  e.preventDefault();
  currentAccount = accounts.find(account => account.nickName === inputLoginUsername.value)
  console.log(currentAccount)

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;

    labelWelcome.textContent = `Welcome ${currentAccount.userName.split(' ')[0]}`

    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur()

    updateUI(currentAccount)
  }
})


btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  const transferAmount = Number(inputTransferAmount.value)
  const recipientNickname = inputTransferTo.value;
  const recipientAccount =  accounts.find(account => account.nickName === recipientNickname)

  inputTransferTo.value = '';
  inputTransferAmount.value = '';

  if (transferAmount > 0 && currentAccount.balans >= transferAmount && recipientAccount &&currentAccount.nickName !== recipientAccount.nickName) {
    currentAccount.transactions.push(-transferAmount);
    recipientAccount.transactions.push(transferAmount);
    updateUI(currentAccount);
  }
})


btnClose.addEventListener('click', function(e) {
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.nickName && Number(inputClosePin.value) === currentAccount.pin) {
    const currentAccountIndex = accounts.findIndex(account => account.nickName === currentAccount.nickName)

    accounts.splice(currentAccountIndex, 1)
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Войдите в свой аккаунт'
  }

  inputCloseUsername.value = '';
  inputClosePin.value = '';
})


btnLoan.addEventListener('click', function(e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value)

  if (loanAmount > 0 && currentAccount.transactions.some(trans => trans >= loanAmount * 10 / 100)) {
    currentAccount.transactions.push(loanAmount)
    updateUI(currentAccount)
  }
  inputLoanAmount.value = '';
})


let transactionsSorted = false;

btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayTransactions(currentAccount.transactions, !transactionsSorted);
  transactionsSorted = !transactionsSorted
});



