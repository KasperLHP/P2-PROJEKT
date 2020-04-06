/*var airports = ["London Heathrow", "Paris Charles de Gaulle", "Frankfurt", "Amsterdam", "Istanbul", "Madrid", "Munich", 
"Rome Leonardo da Vinci-Fiumicino", "London Gatwick", "Barcelona", "Moscow", "Khimki", "Paris Orly", 
"Antalya", "Zurich", "Copenhagen", "Oslo", "Mallorca", "Vienna", "Dusseldorf", "Manchester", "Stockholm", "Dublin", 
"Berlin Tegel", "Brussels", "Sabiha Gokcen", "Milan Malpensa", "London Stansted", "Lisbon", "Helsinki"
"Geneva", "Hamburg", "Malaga", "St. Peterburg", "Athens", "Nice", "Vnukovo", "Prague", "Ankara", "Warsaw", "Izmir", "Edinburgh", 
"Gran Canaria", "Las Palmas", "London Luton", "Alicante", "Stuttgart", "Birgmingham", "Cologne", "Cologne Bonn", "Milan Linate", 
"Milan Il Caravaggio", "Tenerife", "Lyon", "Budapest", "Venice", "Marseille", "Boryspil", "Bucharest", "Toulouse", "Glasgow",
"Brussels South Charleroi", "Berlin Schönefeld", "Catania", "Catania-Fontanarossa", "Porto", "Bergen", "Bologna", "Bristol", "Faro", "Basel", 
"Heraklion", "Ibiza", "Naples", "Lanzaroten", "Hannover", "Göteborg", "Larnaca", "Riga", "Rome Ciampino-G. B. Pastine", "Stavanger", "Valencia",
"Bordeaux", "Pisa", "Newcastle", "Parlermo", "East Midlands", "Adana", "Trondheim", "Yekaterinburg", "Fuerteventura", "Rhodese", "Liverpool", 
"Thessaloniki", "Dalaman", "Malta", "Belfast", "Beauvais-Tillé", "Nantes", "Bilbao", "Novosibirsk", "Seville", "Kraków"]

$('#form-autocomplete-4').mdbAutocomplete({
    data: airports,
    dataColor: 'green',
    inputFocus: '2px solid green',
    inputBlur: '1px solid #ced4da',
    inputFocusShadow: '0 1px 0 0 #4285f4',
    inputBlurShadow: ''
    });
*/

const date_picker_element = document.querySelector('.date-picker');
const selected_date_element = document.querySelector('.date-picker .selected-date');
const dates_element = document.querySelector('.date-picker .dates');

// EVENT LISTENERS
date_picker_element.addEventListener('click', toggleDatePicker);


//FUNCTIONS
function toggleDatePicker (e) {
    console.log(e.path);
    if (!checkEventPathForClass(e.path, 'dates')){
        dates_element.classList.toggle('active');
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

function rejseDestination() {
    let inputFra = document.getElementById("inputFra").value;
    let inputTil = document.getElementById("inputTil").value;

    let hej = 1000
     document.getElementById("output").innerHTML = hej;
}


function aldersgruppe(){
    var x,i,j,selElmnt,a,b,c;

    x = document.getElementsByClassName("custom-select");
    for (i = 0; i < x.length; i++){
        selElmnt = x[i].getElementsByTagName("select")[0];
    }


}



