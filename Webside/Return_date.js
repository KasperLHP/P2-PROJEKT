//Date Picker code
const date_picker_element2 = document.querySelector('.date-picker2');
const selected_date_element2 = document.querySelector('.date-picker2 .selected-date');
const dates_element2 = document.querySelector('.date-picker2 .dates');
const mth_element2 = document.querySelector('.date-picker2 .dates .month .mth');
const next_mth_element2 = document.querySelector('.date-picker2 .dates .month .next-mth');
const prev_mth_element2 = document.querySelector('.date-picker2 .dates .month .prev-mth');
const days_element2 = document.querySelector('.date-picker2 .dates .days');

const months2 = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const number_months2 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];

let date2 = new Date();
let day2 = date2.getDate();
let month2 = date2.getMonth();
let year2 = date2.getFullYear();

let selectedDate2 = date2;
let selectedDay2 = day2;
let selectedMonth2 = month2;
let selectedYear2 = year2;

mth_element2.textContent = months2[month2] + ' ' + year2;

selected_date_element2.textContent = formatDate2(date2);

populateDates2();

// EVENT LISTERNERS
date_picker_element2.addEventListener('click', toggleDatePicker2);
next_mth_element2.addEventListener('click', goToNextMonth2);
prev_mth_element2.addEventListener('click', goToPrevMonth2);

// FUNCTIONS
function toggleDatePicker2 (e) {
    if (!checkEventPathForClass2(e.path, 'dates')){
    dates_element2.classList.toggle('active');
    }
}

function goToNextMonth2 (e) {
    month2++;
    if (month2 > 11) {
        month2 = 0;
        year2++;
    }
    mth_element2.textContent = months2[month2] + ' ' + year2;
    
    populateDates2();
}

function goToPrevMonth2 (e) {
    month2--;
    if (month2 < 0) {
        month2 = 11;
        year2--;
    }
    mth_element2.textContent = months2[month2] + ' ' + year2;
    populateDates2();
}

function populateDates2 (e) {
    days_element2.innerHTML = '';
    let amount_days2 = 31;

    if (month2 == 1) {
        amount_days2 = 28;
    }
    if (month2 == 3 || month2 == 5 || month2 == 8 || month2 == 10) {
        amount_days2 = 30;
    }
    for (let i = 0; i < amount_days2; i++) {
        const day_element2 = document.createElement('div');
        day_element2.classList.add('day');
        day_element2.textContent = i + 1;

        if (selectedDay2 == (i + 1) && selectedYear2 == year2 && selectedMonth2 == month2) {
            day_element2.classList.add('selected');
        }

        day_element2.addEventListener('click', function() {
            selectedDate2 = new Date(year2 + '-' + (month2 + 1) + '-' + (i + 1));
            selectedDay2 = (i + 1);
            selectedMonth2 = month2;
            selectedYear2 = year2;

            selected_date_element2.textContent = formatDate(selectedDate2);
            selected_date_element2.dataset.value = selectedDate2;
            
            populateDates2();
        });

        days_element2.appendChild(day_element2);
    
    }
    return selected_date_element2.textContent;
}



// HELPER FUNCTIONS
function checkEventPathForClass2 (path, selector) {
    for (let i = 0; i < path.length; i++) {
        if (path[i].classList && path[i].classList.contains(selector)) {
            return true;
        }
    }

    return false;
}
function formatDate2 (d) {
    let day2 = d.getDate();
    if (day2 < 10) {
        day2 = '0' + day2;
    }

    let month2 = d.getMonth() + 1;
    if (month2 < 10) {
        month2 = '0' + month2;
    }

    let year2 = d.getFullYear();
    if (year2 < 10) {
        year2 = '0' + year2;
    }

    return year2 + '-' + month2 + '-' + day2;
    
}