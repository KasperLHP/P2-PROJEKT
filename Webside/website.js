var airports = ["London Heathrow", "Paris Charles de Gaulle", "Frankfurt", "Amsterdam", "Istanbul", "Madrid", "Munich", 
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