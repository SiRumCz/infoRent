//Setting up filter button events

//Get all filter buttons in an array
var filterButtons = document.querySelectorAll(".filterButton li input");

//Map for later lookup
var filterMap = new Map();
console.log(filterButtons.length);
for (var i; i < filterButtons.length; i++) {
    console.log(filterButtons[i].id);

}

//Add event listeners to each
filterButtons.forEach(function(button) {
    if (button.id != 'pets' && button.id != 'furnished' && button.id != 'roommate' && button.id != 'utilities') {
        button.checked = true;
    } else {
        button.checked = false;
    }

    filterMap.set(button.id, button);
    button.addEventListener('click', function() {
        update_filters();
    });
});

//Filter or unfilter items.
function update_filters() {
    //Check status of all filters to determine how to filter an object
    var unfilteredMarks = []
    var unfilteredRentData = []

    console.log(map.markData.features[0].properties.bedrooms);

    for (var i = 0; i < map.markers.length; i++) {
        var rental = map.markData.features[i].properties;

        if (rental.bedrooms == 0 && filterMap.get('beds1').checked == false) {
            continue;
        }

        if (rental.bedrooms == 1 && filterMap.get('beds1').checked == false) {
            continue;
        }

        if (rental.bedrooms == 2 && filterMap.get('beds2').checked == false) {
            continue;
        }

        if (rental.bedrooms == 3 && filterMap.get('beds3').checked == false) {
            continue;
        }

        if (rental.bedrooms == 4 && filterMap.get('beds4').checked == false) {
            continue;
        }

        if (rental.bedrooms == 5 && filterMap.get('beds5').checked == false) {
            continue;
        }

        if (rental.bedrooms == 6 && filterMap.get('beds5').checked == false) {
            continue;
        }

        //Next check bathrooms
        if (rental.bathrooms == 1 && filterMap.get('baths1').checked == false) {
            continue;
        }

        if (rental.bathrooms == 2 && filterMap.get('baths2').checked == false) {
            continue;
        }

        if (rental.bathrooms == 3 && filterMap.get('baths3').checked == false) {
            continue;
        }

        if (rental.pets == false && filterMap.get('pets').checked == true) {
            continue;
        }

        if (rental.furnished == false && filterMap.get('furnished').checked == true) {
            continue;
        }

        if (rental.roommate == false && filterMap.get('roommate').checked == true) {
            continue;
        }

        if (rental.utilities == false && filterMap.get('utilities').checked == true) {
            continue;
        }

        unfilteredMarks.push(map.markers[i]);
        unfilteredRentData.push(map.markData.features[i])
    }

    //Finish filtering by removing any marks that don't fit price criteria
    filterPrice(priceFilterValues, unfilteredMarks, unfilteredRentData);
}

//Function for filtering elements based on price
var prev_call_time = Date.now();
function filterPrice(price, unfilteredMarks, unfilteredRentData) {
    //This is a pretty terrible hack, will fix if there's time
    if (Date.now() - prev_call_time < 50) {
        return;
    }

    prev_call_time = Date.now();

    if (unfilteredMarks == undefined && unfilteredRentData == undefined) {
        unfilteredMarks = map.markers;
        unfilteredRentData = map.markData.features;
    }

    var newMarks = [];

    for (var i = 0; i < unfilteredMarks.length; i++) {
        if (unfilteredRentData[i].properties.price <= price[0] || unfilteredRentData[i].properties.price >= price[1]) {
            unfilteredMarks[i].setVisible(false);
        } else {
            unfilteredMarks[i].setVisible(true);
            newMarks.push(unfilteredMarks[i]);
        }
    }
    var mcOptions = {gridSize: 25, maxZoom: 20, zoomOnClick: true, imagePath: 'img/m'};
    //Reset clusters to reflect changes in points
    map.markerCluster.clearMarkers();
    map.markerCluster = new MarkerClusterer(map, newMarks, mcOptions);
}

//Price slider code (from https://happy-css.com/articles/using-nouislider-as-range-slider-to-filter-between-two-numbers/)
var regularSlider = document.querySelector('.regular-slider')
// wNumb is their tool to format the number. We us it to format the numbers that appear in the handles
var dollarPrefixFormat = wNumb({prefix: '$', decimals: 0})
var slider = noUiSlider.create(regularSlider, {
    // two handles
    start: [0, 5000],
    // they are connected
    connect: true,
    // their minimal difference is 5 - this makes sense, because we want the user to always find items
    margin: 5,
    // tooltip for handle 1 and handle 2
    tooltips: [dollarPrefixFormat, dollarPrefixFormat],
    pips: {
        mode: 'steps',
        density: 5,
        format: dollarPrefixFormat
    },
    // start and end point of the slider - we are going to calculate that later based on a set of items
    range: {min: 0, max: 5000}
})

var priceFilterValues;
//listener for slider updates
slider.on('update', function(values){
    priceFilterValues = values;
    update_filters();
//    updateMarks();
})
