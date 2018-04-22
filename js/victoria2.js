//color
var price_domain = [600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200];
var price_color = d3.scaleThreshold()
    .domain(price_domain)
    .range(d3.schemeOranges[9]);

//create x-axis for scale
var x = d3.scaleLinear()
    .domain([600, 2400])
    .rangeRound([500, 900]);

// priceData map, keys are neighbourhood names
var priceData = d3.map();

// markData
var markData = [];
d3.csv("data/project_sample_data.csv", function(d) {
    if (d.address === "") {
        // work as filter
        return;
    }
    // prototype(low-res) stage
    return markData.push({
        address : d.address,
        longitude : +d.longitude,
        latitude : +d.latitude,
        price : +d.price,
        bedrooms : +d.bedrooms,
        bathrooms : +d.bathrooms,
        pets : +d.pets, // binary
        furnished : +d.furnished, // binary
        date : d.date,
        roommate : +d.roommate, // binary
        utilities : +d.utilities, // binary
        hiddenByToggle : false,
        hiddenByPrice : false
    });
}, function(data) {
    console.log("reading data file...");
});

console.log(markData);

// tooltip test
//var tooltip = d3.select("body").append("div").attr("class", "toolTip");

var victoria;
var price_canvas;

//asynchronous tasks, load topojson maps and data
d3.queue()
    .defer(d3.json, "data/VicData.json")
    .defer(d3.csv, "data/average_neighbourhood_prices.csv", function(d){
        priceData.set(d.neighbourhood, +d.price);
    })
    .await(ready);

//callback function
function ready(error, jsonData, csvData) {
    if (error) throw error;

    //Victoria neighbourhoods
    victoria = topojson.feature(jsonData, {
        type: "GeometryCollection",
        geometries: jsonData.objects.VicData.geometries
    });

    //projection .fitExtent([[20,20], [450, 530]], victoria)
    var projection = d3.geoConicConformal()
        .rotate([120,0])
        .fitSize([250,250], victoria);

    //path
    var geoPath = d3.geoPath()
        .projection(projection);

    //zoom and pan
    var zoom = d3.zoom()
        .scaleExtent([1/2, 8]) //zoom scale
        .on("zoom", function() {
            price_canvas.attr("transform", d3.event.transform);
        });

    //draw the map for priceData
    var price_svg = d3.select("svg.price"),
        price_width = +price_svg.attr("width"),
        price_height = +price_svg.attr("height");

    //price range legend
    var price_legend = price_svg
        .attr("width", price_width)
        .attr("height", price_height)
        .insert("g");

    //drawing scale
    price_legend
        .attr("transform", "translate(0, 14)")
        .selectAll("rect")
        .data(price_color.range().map(function(d) {
            d = price_color.invertExtent(d);
            if (d[0] == null) d[0] = x.domain()[0];
            if (d[1] == null) d[1] = x.domain()[1];
            return d;
        }))
        .enter().append("rect")
        .attr("height", 8)
        .attr("x", function(d) { return x(d[0]); })
        .attr("width", function(d) { return x(d[1]) - x(d[0]); })
        .attr("fill", function(d) {
            return price_color(d[0]); });

    //add text to scale
    price_legend.append("text")
        .attr("class", "caption")
        .attr("x", x.range()[0])
        .attr("y", -6) //-6
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Price Range");

    //add ticks to scale
    price_legend.call(d3.axisBottom(x)
        .tickSize(13)
        .tickFormat(function(x, i) {
            return "$" + x; })
        .tickValues(price_color.domain()))
        .select(".domain")
        .remove();

    //draw background canvas
    price_canvas = price_svg
        .attr("width", price_width)
        .attr("height", price_height)
        .call(zoom)
        .insert("g", ":first-child"); //adding control boundary

    //draw neighbourdhood boundaries
    price_canvas.selectAll("path")
        .data(victoria.features)
        .enter()
        .append("path")
        .attr("d", geoPath)
        .attr("fill", function(d) {
            return price_color(d.price = priceData.get(d.properties.Name));
        });
}