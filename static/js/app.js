//from samples.js

var individualIds;
var individualMetaData;
var individualSamples

// handle on change event
d3.select('#individual-select')
  .on('change', function() {
    
    var selectedValue = d3.select(this).property('value');
    var selectedIndividual = parseInt(selectedValue) || 0;

    loadMetadata(selectedIndividual);
    drawTop10CultureChart(selectedValue);
});

d3.json("../plotly-challenge/data/samples.json")
    .then(function(data){
        
        individualMetaData = data.metadata;
        individualSamples = data.samples;

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
        .text((id) => "Individual - " + id)
        .attr("value", (id) => id);

        //select the first individual
        var counter = 0;
        individualSelectOptions.property("selected", function(d) {
            if (counter === 0){
                loadMetadata(parseInt(d)||0);
                drawTop10CultureChart(d);
            }
            counter ++;
            return counter === 1;          
        });
}

function loadMetadata(individualId){

    //Clear demographic info
    var metaDataEntries = d3.select("#demographic-entries")
    metaDataEntries.html("");

    //Filter metadata
    var filteredMetaData = individualMetaData.find(function(metaData) {
        return metaData.id === individualId;
    });

    //Write demographic info
    d3.entries(filteredMetaData).forEach(entry => {
        metaDataEntries.append("dt")
            .attr("class", "col-sm-3 text-nowrap text-capitalize")
            .text(entry.key)

        metaDataEntries.append("dd")
        .attr("class", "col-sm-9")
        .text(entry.value)
    });
}

function drawTop10CultureChart(individualId){

    //filter sample
    var filteredSamples = individualSamples.find(function(sample){
        return sample.id === individualId;
    });

    //create trace
    var trace = [{
        type: 'bar',
        x: filteredSamples.sample_values.splice(0,10).reverse(), //first ten desc
        y: filteredSamples.otu_ids.splice(0,10).map(d => {return "OTU " + d;}), //first ten desc - Map reversed
        text: filteredSamples.otu_labels.splice(0,10).reverse(), //first ten desc
        orientation: 'h',
        width: 0.8
      }];

    //create layout
    var layout = {
        title: "Top 10 Bacteria Cultures Found"
    }

    //plot
    Plotly.newPlot("top-10-cultures", trace, layout)
}


