let balance = 1000;

function updateUI(message = '', type = '') {
  document.getElementById('balance').textContent = `$${balance}`;
  document.getElementById('amount').value = '';

  const msg = document.getElementById('message');
  msg.textContent = message;
  msg.className = type;
}

function deposit() {
  const amount = Number(document.getElementById('amount').value);

  if (amount > 0) {
    balance += amount;
    updateUI(`Deposited $${amount} successfully!`, 'success');
  } else {
    updateUI('Enter a valid deposit amount!', 'error');
  }
}

function withdraw() {
  const amount = Number(document.getElementById('amount').value);

  if (amount > 0 && amount <= balance) {
    balance -= amount;
    updateUI(`Withdrawn $${amount} successfully!`, 'success');
  } else if (amount > balance) {
    updateUI('Insufficient balance!', 'error');
  } else {
    updateUI('Enter a valid withdrawal amount!', 'error');
  }
}
