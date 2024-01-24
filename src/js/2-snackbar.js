// Підключаємо бібліотеку iziToast
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Отримуємо форму за ідентифікатором
const form = document.querySelector('.form');

// Додаємо обробник події submit для форми
form.addEventListener('submit', function (event) {
  event.preventDefault();

  // Отримуємо значення затримки та стану з форми
  const delayInput = form.querySelector('[name="delay"]');
  const stateInputs = form.querySelectorAll('[name="state"]');
  const selectedState = Array.from(stateInputs).find(input => input.checked);

  // Перевіряємо, чи обрано стан
  if (!selectedState) {
    iziToast.error({
      title: 'Error',
      message: 'Please select a state (Fulfilled/Rejected)',
    });
    return;
  }

  // Отримуємо значення затримки та перетворюємо його на ціле число
  const delay = parseInt(delayInput.value, 10);

  // Перевіряємо, чи введено коректне значення затримки
  if (isNaN(delay) || delay <= 0) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a valid positive delay value',
    });
    return;
  }

  // Створюємо проміс з вказаною затримкою та обраним станом
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (selectedState.value === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  // Обробляємо виконання промісу
  promise.then(
    (result) => {
      iziToast.success({
        title: 'Fulfilled',
        message: `✅ Fulfilled promise in ${result}ms`,
      });
    },
    (error) => {
      iziToast.error({
        title: 'Rejected',
        message: `❌ Rejected promise in ${error}ms`,
      });
    }
  );
});
