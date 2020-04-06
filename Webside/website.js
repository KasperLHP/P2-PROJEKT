//Destination
function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("myInput", function(e) {
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
                inp.value = this.getElementsByTagName("myInput")[0].value;
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
/*
function rejseDestination() {
    let inputFra = document.getElementById("inputFra").value;
    let inputTil = document.getElementById("inputTil").value;
}
*/




