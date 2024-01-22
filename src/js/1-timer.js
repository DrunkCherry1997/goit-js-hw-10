// Оголошуємо глобальну змінну для збереження обраної дати
let userSelectedDate;

// Підключаємо необхідні бібліотеки та їх стилі
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast/dist/js/iziToast.min.js";
import "izitoast/dist/css/iziToast.min.css";

// Опції для flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    // Зберігаємо обрану дату у глобальну змінну
    userSelectedDate = selectedDates[0];
    const currentDate = new Date();
    const startBtn = document.querySelector('[data-start]');
    
    // Перевіряємо, чи обрана дата в майбутньому
    if (userSelectedDate > currentDate) {
      // Робимо кнопку «Start» активною
      startBtn.removeAttribute('disabled');
    } else {
      // Показуємо повідомлення про вибір дати в майбутньому та робимо кнопку неактивною
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      startBtn.setAttribute('disabled', true);
    }
  },
};

// Ініціалізуємо flatpickr з опціями
flatpickr("#datetime-picker", options);

// Перевіряємо, чи кнопка повинна бути активною при завантаженні сторінки
const currentDate = new Date();
if (!userSelectedDate || userSelectedDate <= currentDate) {
  const startBtn = document.querySelector('[data-start]');
  startBtn.setAttribute('disabled', true);
}

// Оголошуємо змінні для таймера
let countdownTimer;
let targetDate;

// Функція для розрахунку різниці часу та відображення таймера
function updateTimer() {
  const currentDate = new Date();
  const timeDifference = targetDate - currentDate;

  if (timeDifference > 0) {
    const { days, hours, minutes, seconds } = convertMs(timeDifference);

    // Оновлюємо значення таймера на сторінці з врахуванням форматування
    document.querySelector('[data-days]').textContent = addLeadingZero(days);
    document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
    document.querySelector('[data-minutes]').textContent = addLeadingZero(minutes);
    document.querySelector('[data-seconds]').textContent = addLeadingZero(seconds);
  } else {
    // Якщо таймер завершено, зупиняємо його та виводимо повідомлення
    clearInterval(countdownTimer);
    iziToast.success({
      title: 'Success',
      message: 'Countdown finished!',
    });
  }
}

// Обробник кліку на кнопку «Start»
document.querySelector('[data-start]').addEventListener('click', () => {
  // Встановлюємо цільову дату для таймера
  targetDate = userSelectedDate;

  // Запускаємо таймер та встановлюємо інтервал оновлення таймера
  countdownTimer = setInterval(updateTimer, 1000);

  // Деактивуємо кнопку «Start»
  document.querySelector('[data-start]').setAttribute('disabled', true);
});

// Функція для форматування чисел з додаванням ведучого нуля
function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

// Функція для підрахунку значень днів, годин, хвилин та секунд
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
