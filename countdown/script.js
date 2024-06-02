let targetDate;

function setTargetDate() {
    const dateInput = document.getElementById('target-date').value;
    const timeInput = document.getElementById('target-time').value;

    if (dateInput && timeInput) {
        targetDate = new Date(`${dateInput}T${timeInput}:00`);
        console.log(targetDate); // Log the new target date to the console
        updateCountdown(); // Immediately update the countdown
    } else {
        alert('Please enter both date and time.');
    }
}

function updateCountdown() {
    if (!targetDate) return;

    const currentTime = new Date();
    const difference = targetDate - currentTime;

    if (difference <= 0) {
        clearInterval(interval);
        document.getElementById("days").innerText = '0';
        document.getElementById("hours").innerText = '0';
        document.getElementById("minutes").innerText = '0';
        document.getElementById("seconds").innerText = '0';
        alert('Countdown complete!');
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;
}

function toggleOrientation() {
    const countdown = document.getElementById('countdown');
    if (countdown.classList.contains('horizontal')) {
        countdown.classList.remove('horizontal');
        countdown.classList.add('vertical');
    } else {
        countdown.classList.remove('vertical');
        countdown.classList.add('horizontal');
    }
}

const interval = setInterval(updateCountdown, 1000);
