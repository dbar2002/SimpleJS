let targetDate;
let targetTimeZone;
let initialTotalSeconds;
let startTime;
let countdownInterval;

async function getTargetDate() {
    const input = document.getElementById('zip-code').value;
    if (!input) {
        alert('Please enter a zip code or city name.');
        return;
    }

    try {
        // Request to Google Geocoding API to convert input to latitude and longitude
        const geocodingResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(input)}&key=AIzaSyDswMEBZldxBysPD-acetaDJuc_HuRTrOo`);
        const geocodingData = await geocodingResponse.json();
        if (geocodingData.status === 'OK') {
            const location = geocodingData.results[0].geometry.location;
            const cityName = getCityName(geocodingData.results[0].address_components);
            // Construct the 'location' parameter for the Time Zone API request
            const locationParam = `${location.lat},${location.lng}`;
            
            // Request to Google Maps Time Zone API
            const response = await fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${locationParam}&timestamp=${Math.floor(Date.now() / 1000)}&key=AIzaSyDswMEBZldxBysPD-acetaDJuc_HuRTrOo`);
            const data = await response.json();
            if (data.status === 'OK') {
                targetTimeZone = data.timeZoneId;
                displayLocationInfo(cityName, targetTimeZone);
                alert('Time zone retrieved successfully.');
            } else {
                alert('Failed to retrieve time zone information.');
            }
            
        } else {
            alert('Invalid input. Please enter a valid zip code or city name.');
        }
    } catch (error) {
        console.error('Error fetching time zone data:', error);
        alert('An error occurred while fetching time zone data.');
    }
}

function getCityName(addressComponents) {
    for (const component of addressComponents) {
        if (component.types.includes('locality')) {
            return component.long_name;
        }
    }
    return '';
}

function displayLocationInfo(cityName, timeZone) {
    const cityNameElement = document.getElementById('city-name');
    const timeZoneElement = document.getElementById('time-zone');
    cityNameElement.innerText = cityName;
    timeZoneElement.innerText = timeZone;
}

function setTargetDate() {
    const dateInput = document.getElementById('target-date').value;
    const timeInput = document.getElementById('target-time').value;

    if (dateInput && timeInput && targetTimeZone) {
        const targetDateTime = new Date(`${dateInput}T${timeInput}:00`);
        targetDate = new Date(targetDateTime.toLocaleString('en-US', { timeZone: targetTimeZone }));
        startTime = new Date(); // Set start time to current time
        initialTotalSeconds = Math.floor((targetDate - startTime) / 1000); // Calculate initial total seconds
        console.log('Target Date:', targetDate);
        console.log('Initial Total Seconds:', initialTotalSeconds);

        clearInterval(countdownInterval); // Clear any existing interval
        countdownInterval = setInterval(updateCountdown, 1000); // Set new interval
        updateCountdown(); // Immediately update the countdown
    } else {
        alert('Please enter both date and time, and ensure time zone is set.');
    }
}

function updateCountdown() {
    if (!targetDate) return;

    const currentTime = new Date();
    const difference = targetDate - currentTime;

    if (difference <= 0) {
        clearInterval(countdownInterval);
        document.getElementById("days").innerText = '0';
        document.getElementById("hours").innerText = '0';
        document.getElementById("minutes").innerText = '0';
        document.getElementById("seconds").innerText = '0';
        document.getElementById("progress-text").innerText = '100%';
        document.getElementById("progress-bar").style.strokeDashoffset = 0;
        alert('Countdown complete!');
        return;
    }

    const remainingSeconds = Math.floor(difference / 1000);

    const days = Math.floor(remainingSeconds / (60 * 60 * 24));
    const hours = Math.floor((remainingSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((remainingSeconds % (60 * 60)) / 60);
    const seconds = remainingSeconds % 60;

    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;

    updateProgressBar(remainingSeconds);
}

function updateProgressBar(remainingSeconds) {
    const progress = ((initialTotalSeconds - remainingSeconds) / initialTotalSeconds) * 100;
    const dashoffset = 565.48 * (1 - progress / 100);

    document.getElementById("progress-text").innerText = `${Math.round(progress)}%`;
    document.getElementById("progress-bar").style.strokeDashoffset = dashoffset;
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