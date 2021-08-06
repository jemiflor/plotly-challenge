//from samples.js

var individualIds;
var individualMetaData;
var individualSamples

// handle on change event
d3.select('#individual-select')
  .on('change', function() {
    
    var selectedValue = d3.select(this).property('value');
    loadVisualizations(selectedValue);
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
                loadVisualizations(d);
            }
            counter ++;
            return counter === 1;          
        });
}

function loadVisualizations(individualIdString){

    var individualId = parseInt(individualIdString)||0;

    loadMetadata(individualId);
    drawTop10CultureChart(individualId);
    drawSamplesBubbleChart(individualId);
    drawWashFrequencyGauge(individualId);
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
        return (parseInt(sample.id)||0) === individualId;
    });

    //create trace
    var trace = [{
        type: 'bar',
        x: filteredSamples.sample_values.slice(0,10).reverse(), //first ten desc
        y: filteredSamples.otu_ids.slice(0,10).reverse().map(d => {return "OTU " + d;}), //first ten desc - Map reversed
        text: filteredSamples.otu_labels.slice(0,10).reverse(), //first ten desc
        orientation: 'h',
        width: 0.8
      }];

    //create layout
    var layout = {
        title: "Top 10 Bacteria Cultures Found"
    }

    var config = {responsive: true}
    //plot
    Plotly.newPlot("top-10-cultures", trace, layout, config)
}

function drawSamplesBubbleChart(individualId){

    var filteredSamples = individualSamples.find(function(sample){
        return (parseInt(sample.id)||0) === individualId;
    });

    var desired_maximum_marker_size = 60;

     //create trace
     var trace = [{
        x: filteredSamples.otu_ids,
        y: filteredSamples.sample_values,
        mode: 'markers',
        marker: {
            size: filteredSamples.sample_values,
            sizeref: 2.0 * Math.max(...filteredSamples.sample_values) / (desired_maximum_marker_size**2),    
            sizemode: 'area',
            color: filteredSamples.otu_ids,
            colorscale: 'Earth'
        },
        text: filteredSamples.otu_labels       
      }];

      //create layout
    var layout = {
        title: "Bacteria Culteres Per Sample",
        xaxis: {
            title: {
                text: 'OTU ID',
                font: {
                    family: 'Oxygen , sans-serif',
                    size: 12                
                }
            },
        }         
    }

    var config = {responsive: true}

    //plot
    Plotly.newPlot("samples-bubble-chart", trace, layout, config)
}

function drawWashFrequencyGauge(individualId){
    
    //Filter metadata
    var filteredMetaData = individualMetaData.find(function(metaData) {
        return metaData.id === individualId;
    });

    var trace = [{
          domain: { x: [0, 1], y: [0, 1] },
          value: filteredMetaData.wfreq,
          title: { text: "Scrubs per week" },
          type: "indicator",
          mode: "gauge",
          gauge: {
            axis: { range: [null, 9], dtick:1 },
            threshold: {
                line: { color: "#800080", width: 4 },
                thickness: 0.8,
                value: filteredMetaData.wfreq
            },
            steps: [
                { range: [0, 1], color: "#F4F8F8" },
                { range: [1, 2], color: "#E9F2F2" },
                { range: [2, 3], color: "#D4E6E5" },
                { range: [3, 4], color: "#BED9D8" },
                { range: [4, 5], color: "#A8CCCD" },
                { range: [5, 6], color: "#92BFC0" },
                { range: [6, 7], color: "#7BB4B3" },
                { range: [7, 8], color: "#64A6A6" },
                { range: [8, 9], color: "#4B9A9A" }
              ]                     
          }
    }];
    
        //create layout
    var layout = {
        title: "Belly Button Washing Frequency"             
    }

    var config = {responsive: true}

    //plot
    Plotly.newPlot("wash-freq-gauge", trace, layout, config)

}
