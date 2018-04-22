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
var tooltip = d3.select("body").append("div").attr("class", "toolTip");

var victoria;
var price_canvas;
var comparison_arr = []; //stores comparison items
var comparison_feat = d3.select(".comparison-feat"); //comparison feature
//var comparison_item_queue = d3.select(".comparison-item-queue");
var comparison_one = d3.select(".comparison-item-one");
var comparison_two = d3.select(".comparison-item-two");
var comparison_three = d3.select(".comparison-item-three");

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

    //projection
    var projection = d3.geoConicConformal()
        .rotate([120,0])
        .fitExtent([[20,20], [450, 450]], victoria);

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

    price_svg.attr("class", "rounded-left");

    comparison_feat
        .attr("class", "rounded-right")
        .style("display", "inline-block")
        .style("background", "#D5D5D5")
        .style("padding", "10px")
        .call(update_comp_feat);

    // comparison feature price bar chart
    d3.select("button.comp-feat-compare")
        .on("click", update_compare);


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

    // put pin or mark on map
    /*price_canvas.selectAll(".mark")
        .data(markData)
        .enter()
        .append("images")
        .attr("width", 20)
        .attr("height", 20)
        .attr("xlink:href", "http://www.clker.com/cliparts/c/9/m/4/B/d/google-maps-grey-marker-w-shadow-hi.png")
        .attr("transform", function(d) {
            return "translate(" + projection([d.longitude, d.latitude]) + ")";
        });*/

    // put circle mark on geo map
    updateMarks();
}


//Redraw the map marks and zone colours when filters are updated
function updateMarks() {
    var projection = d3.geoConicConformal()
        .rotate([120,0])
        .fitExtent([[20,20], [450, 450]], victoria);

    var update = price_canvas.selectAll("circle.mark-point, circle")
        .data(markData.filter(function(mark) {
            return (mark.hiddenByToggle == false && mark.hiddenByPrice == false);
        }));

     var exit = update.exit();
        exit.remove();

    var enter = update.enter()
        .append("circle")
        .attr("class", "mark-point")
        .attr("cx", function(d) {return projection([d.longitude, d.latitude])[0];})
        .attr("cy", function(d) {return projection([d.longitude, d.latitude])[1];})
        .attr("r", "3px")
        .attr("fill", "#778899")
        .on("click", function (d, i) {
            tooltip.selectAll(
                ".close-button, text.info, button.add-to-compare-button, " +
                ".add-to-compare, .alert"
            ).remove();
            tooltip
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px")
                .style("display", "inline-block")
                .append("text")
                .attr("class", "close-button")
                .text("Close")
                .style("font-weight", "bold")
                .style("float", "right")
                .on("mouseover", function (d) {
                    return tooltip.selectAll(".close-button").style("color", "red");
                })
                .on("mouseout", function (d) {
                    return tooltip.selectAll(".close-button").style("color", "black");
                })
                .on("click", function (d, i) {
                    tooltip.style("display", "none");
                    tooltip.selectAll(
                        "text.close-button, text.info, button.add-to-compare-button, .add-to-compare"
                    ).remove();
                });
            tooltip.append("text")
                .attr("class", "info")
                .html(function (d) {
                    return "</br>" + "Posted On: " + markData[i].date + "</br>" +
                        "Address: " + markData[i].address + "</br>" +
                        "Price: " + "$" + markData[i].price + "</br>" +
                        "Bedrooms: " + markData[i].bedrooms + "</br>" +
                        "Bathrooms: " + markData[i].bathrooms + "</br>" +
                        "Pets: " + markData[i].pets + "</br>" +
                        "Furnished: " + markData[i].furnished + "</br>" +
                        "Roommate: " + markData[i].roommate + "</br>" +
                        "Utilities: " + markData[i].utilities
                });
            tooltip.append("div")
                .attr("class", "add-to-compare")
                .style("text-align", "center")
                .append("button")
                .attr("class", "btn btn-primary add-to-compare-button")
                .text("Add to Compare")
                .on("click", function (data) {
                    console.log(comparison_arr);
                    if (comparison_arr.length < 3) {
                        comparison_arr.push(markData[i]);
                    }else {
                        //alert("Zone is full, please remove unwanted selection first.");
                        if (tooltip.selectAll(".alert, .alert-danger")._groups[0].length === 0) {
                            tooltip.append("div")
                                .style("margin-top", "15px")
                                .attr("class", "alert alert-danger")
                                .attr("align", "center")
                                .text("Queue is full, please remove first.")
                        }
                    }
                    update_comp_feat();
                });
        });

        update.merge(enter);
}

function update_compare() {

    // price barchart
    var comp_feat_price_barchart = d3.select("svg.comp-bar-chart"),
        margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = +comp_feat_price_barchart.attr("width") - margin.left - margin.right,
        height = +comp_feat_price_barchart.attr("height") - margin.top - margin.bottom;

    comp_feat_price_barchart.selectAll("*").remove();
    d3.select("#comp-table").selectAll("*").remove(); // clean screen before forming thable

    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]);

    var comp_feat_price_g = comp_feat_price_barchart.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var i = 0;

    x.domain(comparison_arr.map(function (d) {
        i++;
        return "Item " + i;
    }));
    y.domain([0, d3.max(comparison_arr, function(d) { return d.price; })]);

    if(comparison_arr.length === 0) {
        comp_feat_price_g.append("div").text("Not enough item.").style("justify-content", "center");
        return;
    }

    comp_feat_price_g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    comp_feat_price_g.append("g")
        .attr("class", "axis axis--y")
        .call(
            d3.axisLeft(y)
                .ticks(10)
                .tickFormat(function (d) {
                    return '$' + d;
                })
        )
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Price");

    i=0;

    comp_feat_price_g.selectAll(".bar")
        .data(comparison_arr).enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { i++; return x("Item " + i); })
        .attr("y", function(d) { return y(d.price); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.price); });

    // comparison feature table

    var comp_feat_table = d3.select("#comp-table").append("table");
    comp_feat_table.attr("class", "table")
        .style("border-collapse", "collapse")
        .style("width", "100%");

    // table header
    var comp_feat_header = comp_feat_table.append("thead").append("tr");
    comp_feat_header.append("th");
    for(i=0; i< comparison_arr.length; i++) {
        var item_name = i+1;
        comp_feat_header.append("th").text("Item " + item_name);
    }
    var comp_feat_body = comp_feat_table.append("tbody");

    var bedroom_body = comp_feat_body.append("tr"); // bedroom
    bedroom_body.append("th").text("Bedrooms");
    for(i=0; i< comparison_arr.length; i++) {
        bedroom_body.append("td").text(comparison_arr[i].bedrooms);
    }
    var bathroom_body = comp_feat_body.append("tr"); //bathroom
    bathroom_body.append("th").text("Bathrooms");
    for(i=0; i< comparison_arr.length; i++) {
        bathroom_body.append("td").text(comparison_arr[i].bathrooms);
    }
    var pet_body = comp_feat_body.append("tr"); //pet
    pet_body.append("th").text("Pets");
    for(i=0; i< comparison_arr.length; i++) {
        if (comparison_arr[i].pets === 1) {
            pet_body.append("td").html("<i class='fa fa-check fa-sm' aria-hidden='true' style='color:#58D68D'></i>");
        }else if (comparison_arr[i].pets === 0) {
            pet_body.append("td").html("<i class='fa fa-times fa-sm' aria-hidden='true' style='color:#E74C3C'></i>");
        }else {
            pet_body.append("td").html("<i class='fa fa-question fa-sm' aria-hidden='true'></i>");
        }
    }
    var furnished_body = comp_feat_body.append("tr"); //furnished
    furnished_body.append("th").text("Furnished");
    for(i=0; i< comparison_arr.length; i++) {
        if (comparison_arr[i].furnished === 1) {
            furnished_body.append("td").html("<i class='fa fa-check fa-sm' aria-hidden='true' style='color:#58D68D'></i>");
        }else if (comparison_arr[i].furnished === 0) {
            furnished_body.append("td").html("<i class='fa fa-times fa-sm' aria-hidden='true' style='color:#E74C3C'></i>");
        }else {
            furnished_body.append("td").html("<i class='fa fa-question fa-sm' aria-hidden='true'></i>");
        }
    }
    var roommate_body = comp_feat_body.append("tr"); //roommate
    roommate_body.append("th").text("Roommate");
    for(i=0; i< comparison_arr.length; i++) {
        if (comparison_arr[i].roommate === 1) {
            roommate_body.append("td").html("<i class='fa fa-check fa-sm' aria-hidden='true' style='color:#58D68D'></i>");
        }else if (comparison_arr[i].roommate === 0) {
            roommate_body.append("td").html("<i class='fa fa-times fa-sm' aria-hidden='true' style='color:#E74C3C'></i>");
        }else {
            roommate_body.append("td").html("<i class='fa fa-question fa-sm' aria-hidden='true'></i>");
        }
    }
    var utilities_body = comp_feat_body.append("tr"); //utilities
    utilities_body.append("th").text("Utilities");
    for(i=0; i< comparison_arr.length; i++) {
        if (comparison_arr[i].utilities === 1) {
            utilities_body.append("td").html("<i class='fa fa-check fa-sm' aria-hidden='true' style='color:#58D68D'></i>");
        }else if (comparison_arr[i].utilities === 0) {
            utilities_body.append("td").html("<i class='fa fa-times fa-sm' aria-hidden='true' style='color:#E74C3C'></i>");
        }else {
            utilities_body.append("td").html("<i class='fa fa-question fa-sm' aria-hidden='true'></i>");
        }
    }
}

// update comparison feature content
function update_comp_feat() {
    // first item
    ((comparison_arr.length >= 1)
            ? comparison_one
                .html(
                    "<strong>" + comparison_arr[0].address + "</strong></br>"
                )
                .append("div")
                .attr("class", "btn-group")
                .attr("role", "group")
                .attr("aria-label", "btn group")
                .append("button")
                .attr("type", "button")
                .attr("class", "btn btn btn-secondary btn-sm comparison-info-one")
                .text("Info")
                .style("float", "left")
                .on("click", function (data) {
                    tooltip.selectAll(
                        ".close-button, text.info, button.add-to-compare-button, " +
                        ".add-to-compare, .alert"
                    ).remove();
                    tooltip
                        .style("left", "40%")
                        .style("top", "30%")
                        .style("display", "inline-block")
                        .append("text")
                        .attr("class", "close-button")
                        .text("Close")
                        .style("font-weight", "bold")
                        .style("float", "right")
                        .on("mouseover", function (d) {
                            return tooltip.selectAll(".close-button").style("color", "red");
                        })
                        .on("mouseout", function (d) {
                            return tooltip.selectAll(".close-button").style("color", "black");
                        })
                        .on("click", function (d, i) {
                            tooltip.style("display", "none");
                            tooltip.selectAll(
                                "text.close-button, text.info, .alert"
                            ).remove();
                        });
                    tooltip.append("text")
                        .attr("class", "info")
                        .html(function (d) {
                            return "</br>" + "posted on: " + comparison_arr[0].date + "</br>" +
                                "address: " + comparison_arr[0].address + "</br>" +
                                "price: " + "$" + comparison_arr[0].price + "</br>" +
                                "bedrooms: " + comparison_arr[0].bedrooms + "</br>" +
                                "bathrooms: " + comparison_arr[0].bathrooms + "</br>" +
                                "pets: " + comparison_arr[0].pets + "</br>" +
                                "furnished: " + comparison_arr[0].furnished + "</br>" +
                                "roommate: " + comparison_arr[0].roommate + "</br>" +
                                "utilities: " + comparison_arr[0].utilities
                        });
                })
                .select(function () {
                    return this.parentNode;
                })
                .append("button")
                .attr("class", "btn btn-danger btn-sm comparison-remove-one")
                .style("float", "left")
                .text("Remove")
                .on("click", function (data) {
                    comparison_arr.splice(0, 1);
                    update_comp_feat();
                })
            : comparison_one
                .html("<strong>Item one</strong>")
    );

    // second item
    ((comparison_arr.length >= 2)
            ? comparison_two
                .html(
                    "<strong>" + comparison_arr[1].address + "</strong></br>"
                )
                .append("div")
                .attr("class", "btn-group")
                .attr("role", "group")
                .attr("aria-label", "btn group")
                .append("button")
                .attr("type", "button")
                .attr("class", "btn btn btn-secondary btn-sm comparison-info-two")
                .text("Info")
                .style("float", "left")
                .on("click", function (data) {
                    tooltip.selectAll(
                        ".close-button, text.info, button.add-to-compare-button, " +
                        ".add-to-compare, .alert"
                    ).remove();
                    tooltip
                        .style("left", "40%")
                        .style("top", "30%")
                        .style("display", "inline-block")
                        .append("text")
                        .attr("class", "close-button")
                        .text("Close")
                        .style("font-weight", "bold")
                        .style("float", "right")
                        .on("mouseover", function (d) {
                            return tooltip.selectAll(".close-button").style("color", "red");
                        })
                        .on("mouseout", function (d) {
                            return tooltip.selectAll(".close-button").style("color", "black");
                        })
                        .on("click", function (d, i) {
                            tooltip.style("display", "none");
                            tooltip.selectAll(
                                "text.close-button, text.info, .alert"
                            ).remove();
                        });
                    tooltip.append("text")
                        .attr("class", "info")
                        .html(function (d) {
                            return "</br>" + "posted on: " + comparison_arr[1].date + "</br>" +
                                "address: " + comparison_arr[1].address + "</br>" +
                                "price: " + "$" + comparison_arr[1].price + "</br>" +
                                "bedrooms: " + comparison_arr[1].bedrooms + "</br>" +
                                "bathrooms: " + comparison_arr[1].bathrooms + "</br>" +
                                "pets: " + comparison_arr[1].pets + "</br>" +
                                "furnished: " + comparison_arr[1].furnished + "</br>" +
                                "roommate: " + comparison_arr[1].roommate + "</br>" +
                                "utilities: " + comparison_arr[1].utilities
                        });
                })
                .select(function () {
                    return this.parentNode;
                })
                .append("button")
                .attr("class", "btn btn-danger btn-sm comparison-remove-two")
                .style("float", "left")
                .text("Remove")
                .on("click", function (data) {
                    comparison_arr.splice(1, 1);
                    update_comp_feat();
                })
            : comparison_two
                .html("<strong>Item two</strong>")
    );

    // third item
    ((comparison_arr.length === 3)
            ? comparison_three
                .html(
                    "<strong>" + comparison_arr[2].address + "</strong></br>"
                )
                .append("div")
                .attr("class", "btn-group")
                .attr("role", "group")
                .attr("aria-label", "btn group")
                .append("button")
                .attr("type", "button")
                .attr("class", "btn btn btn-secondary btn-sm comparison-info-three")
                .text("Info")
                .style("float", "left")
                .on("click", function (data) {
                    tooltip.selectAll(
                        ".close-button, text.info, button.add-to-compare-button, " +
                        ".add-to-compare, .alert"
                    ).remove();
                    tooltip
                        .style("left", "40%")
                        .style("top", "30%")
                        .style("display", "inline-block")
                        .append("text")
                        .attr("class", "close-button")
                        .text("Close")
                        .style("font-weight", "bold")
                        .style("float", "right")
                        .on("mouseover", function (d) {
                            return tooltip.selectAll(".close-button").style("color", "red");
                        })
                        .on("mouseout", function (d) {
                            return tooltip.selectAll(".close-button").style("color", "black");
                        })
                        .on("click", function (d, i) {
                            tooltip.style("display", "none");
                            tooltip.selectAll(
                                "text.close-button, text.info, .alert"
                            ).remove();
                        });
                    tooltip.append("text")
                        .attr("class", "info")
                        .html(function (d) {
                            return "</br>" + "posted on: " + comparison_arr[2].date + "</br>" +
                                "address: " + comparison_arr[2].address + "</br>" +
                                "price: " + "$" + comparison_arr[2].price + "</br>" +
                                "bedrooms: " + comparison_arr[2].bedrooms + "</br>" +
                                "bathrooms: " + comparison_arr[2].bathrooms + "</br>" +
                                "pets: " + comparison_arr[2].pets + "</br>" +
                                "furnished: " + comparison_arr[2].furnished + "</br>" +
                                "roommate: " + comparison_arr[2].roommate + "</br>" +
                                "utilities: " + comparison_arr[2].utilities
                        });
                })
                .select(function () {
                    return this.parentNode;
                })
                .append("button")
                .attr("class", "btn btn-danger btn-sm comparison-remove-three")
                .style("float", "left")
                .text("Remove")
                .on("click", function (data) {
                    comparison_arr.splice(2, 1);
                    update_comp_feat();
                })
            : comparison_three
                .html("<strong>Item three</strong>")
    );
}
