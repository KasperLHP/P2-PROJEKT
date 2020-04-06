//Destination
function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            b.addEventListener("click", function(e) {
                inp.value = this.getElementsByTagName("input")[0].value;
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          currentFocus++;
          addActive(x);
        } else if (e.keyCode == 38) { //up
          currentFocus--;
          addActive(x);
        } else if (e.keyCode == 13) {
          e.preventDefault();
          if (currentFocus > -1) {
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}  

var airports = ["London Heathrow", "Paris Charles de Gaulle", "Frankfurt", "Amsterdam", "Istanbul", "Madrid", "Munich", 
"Rome Leonardo da Vinci-Fiumicino", "London Gatwick", "Barcelona", "Moscow", "Khimki", "Paris Orly", 
"Antalya", "Zurich", "Copenhagen", "Oslo", "Mallorca", "Vienna", "Dusseldorf", "Manchester", "Stockholm", "Dublin", 
"Berlin Tegel", "Brussels", "Sabiha Gokcen", "Milan Malpensa", "London Stansted", "Lisbon", "Helsinki",
"Geneva", "Hamburg", "Malaga", "St. Peterburg", "Athens", "Nice", "Vnukovo", "Prague", "Ankara", "Warsaw", "Izmir", "Edinburgh", 
"Gran Canaria", "Las Palmas", "London Luton", "Alicante", "Stuttgart", "Birgmingham", "Cologne", "Cologne Bonn", "Milan Linate", 
"Milan Il Caravaggio", "Tenerife", "Lyon", "Budapest", "Venice", "Marseille", "Boryspil", "Bucharest", "Toulouse", "Glasgow",
"Brussels South Charleroi", "Berlin Schönefeld", "Catania", "Catania-Fontanarossa", "Porto", "Bergen", "Bologna", "Bristol", "Faro", "Basel", 
"Heraklion", "Ibiza", "Naples", "Lanzaroten", "Hannover", "Göteborg", "Larnaca", "Riga", "Rome Ciampino-G. B. Pastine", "Stavanger", "Valencia",
"Bordeaux", "Pisa", "Newcastle", "Parlermo", "East Midlands", "Adana", "Trondheim", "Yekaterinburg", "Fuerteventura", "Rhodese", "Liverpool", 
"Thessaloniki", "Dalaman", "Malta", "Belfast", "Beauvais-Tillé", "Nantes", "Bilbao", "Novosibirsk", "Seville", "Kraków"]

autocomplete(document.getElementById("myAirport"), airports); 

$('#form-autocomplete-4').mdbAutocomplete({
    data: airports,
    dataColor: 'green',
    inputFocus: '2px solid green',
    inputBlur: '1px solid #ced4da',
    inputFocusShadow: '0 1px 0 0 #4285f4',
    inputBlurShadow: ''
    });

function rejseDestination() {
    let inputFra = document.getElementById("inputFra").value;
    let inputTil = document.getElementById("inputTil").value;
}

//Date Picker code
const date_picker_element = document.querySelector('.date-picker');
const selected_date_element = document.querySelector('.date-picker .selected-date');
const dates_element = document.querySelector('.date-picker .dates');

const mth_element = document.querySelector('.date-picker .dates .month .mth');
const next_mth_element = document.querySelector('.date-picker .dates .month .next-mth');
const prev_mth_element = document.querySelector('.date-picker .dates .month .prev-mth');
const days_element = document.querySelector('.date-picker .dates .days');
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

let date = new Date();
let day = date.getDate();
let month = date.getMonth();
let year = date.getFullYear();

let selectedDate = date;
let selectedDay = day;
let selectedMonth = month;
let selectedYear = year;

mth_element.textContent = months[month] + ' ' + year;

selected_date_element.textContent = formatDate(date);

populateDates();

// EVENT LISTENERS
date_picker_element.addEventListener('click', toggleDatePicker);
next_mth_element.addEventListener('click', goToNextMonth);
prev_mth_element.addEventListener('click', goToPrevMonth);

//FUNCTIONS
function toggleDatePicker (e) {
    if (!checkEventPathForClass(e.path, 'dates')){
        dates_element.classList.toggle('active');
    }
}

function goToNextMonth (e) {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    mth_element.textContent = months[month] + ' ' + year;
}

function goToPrevMonth (e) {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    mth_element.textContent = months[month] + ' ' + year;
}

function populateDates (e) {
    days_element.innerHTML = '';
    let amount_days = 31;

    if (month ==1) {
        amount_days = 28;
    }

    for (let i = 0; i < amount_days; i++){
        const day_element = document.createElement('div');
        day_element.classList.add('day');
        day_element.textContent = i + 1;

        days_element.appendChild(day_element);
    }
}

// HELPER FUNCTIONS
function checkEventPathForClass (path, selector) {
    for (let i = 0; i < path.length; i++) {
        if (path[i].classList && path[i].classList.contains(selector)) {
            return true;
        }
    }
    return false;
}

function formatDate (d) {
    let day = d.getDate();
    if (day < 10) {
        day = '0' + day;
    }

    let month = d.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }

    let year = d.getFullYear();
    if (year < 10) {
        year = '0' + year;
    }

    return year + ' / ' + month + ' / ' + day;
}

function aldersgruppe(){
    var x,i,j,selElmnt,a,b,c;

    x = document.getElementsByClassName("custom-select");
    for (i = 0; i < x.length; i++){
        selElmnt = x[i].getElementsByTagName("select")[0];
    a = document.createElement("DIV");
    a.setAttribute("class", "select-items select-hide");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);

    /*Opretter en DIV der indeholder valgmulighederne*/

    b = document.createElement("DIV");
    b.setAttribute("class,select-items select-hide");
    for (j = 1; j < selElmnt.length; j++){
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function(e) {
     var y, i, k, s, h;
    s = this.parentNode.parentNode.getElementsByTagName("select")[0];
    h = this.parentNode.previousSibling;
    for (i = 0; i < s.length; i++) {
        if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            for (k = 0; k < y.length; k++) {
               y[k].removeAttribute("class");
            }
               this.setAttribute("class", "same-as-selected");
                break;
              }
            }
            h.click();
        });
        b.appendChild(c);
      }
      x[i].appendChild(b);
      a.addEventListener("click", function(e) {
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
      });
    }


    function closeAllSelect(elmnt) {
        /* Funktion der lukker alle åbnet boxe */
        var x, y, i, arrNo = [];
        x = document.getElementsByClassName("select-items");
        y = document.getElementsByClassName("select-selected");
        for (i = 0; i < y.length; i++) {
          if (elmnt == y[i]) {
            arrNo.push(i)
          } else {
            y[i].classList.remove("select-arrow-active");
          }
        }
        for (i = 0; i < x.length; i++) {
          if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
          }
        }
      }
      
      /* Hvis man klikker andre steder end boxen så lukker den ned*/
      document.addEventListener("click", closeAllSelect);
}


