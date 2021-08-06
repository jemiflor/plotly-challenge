//from samples.js

var individualIds;
var individualMetaData;
var individualSamples

d3.json("../data/samples.json")
    .then(function(data){
        
        //Load individual select dropdown
        loadIndividualDropDown(data.names);


    });

function loadIndividualDropDown(names){
    
    //Load the individual id as option elements to 
    //the drop down using d3

    var individualSelectOptions = d3.select("#individual-select")
        .selectAll('individuals')
            .data(names)
        .enter()
            .append('option')
        .text( (id) => "Individual - " + id)
        .attr("value", (id) => id);

        var counter = 0;
        individualSelectOptions.property("selected", function(d) {
            counter ++;
            return counter === 1;          
        });
    
}
