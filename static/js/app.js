// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // get the metadata field
    let metadata = data.metadata;
    // filter the metadeta for the object with the desired sample number
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    // use d3 to select the panel with id pf '#sample-metadata'
    let panel = d3.select("#sample-metadata");

    // use '.html("") to clear any existing metadta
  
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata

    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    // Render the Bubble Chart
    let bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    }];

    let bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      margin: { t: 0 },
      hovermode: 'closest',
      xaxis: { title: 'OTU ID' },
      margin: { t: 30 }
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map otu_ids to a list of strings for yticks
    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    let barData = [{
      y: yticks,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h',
    }];

    // Build a Bar Chart
    // Don't forger to slice and reverse the input data appropriately
    let barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      margin: { t: 30, l: 150 }
    };
    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);
  });
}

// Function to run on page load
function init() {
  // Get the names field
  let selector = d3.select("#selDataset");

  // Use d3 to select the dropdown with id of '#selDataset'

  // Use the list of sample names to populate the select options
  // Hint: Inside a loop, you will need to use d3 to append a new
  // option for each sample name
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let sampleNames = data.names;

    //Build charts and metadata panel with the first sample
    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    let firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for Event Listener
function optionChanged(newSample) {
  // Build charts and metadata each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
