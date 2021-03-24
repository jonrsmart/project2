function buildCharts(sample) {
  // Read in the JSON Data
  d3.json("./samples.json").then( data => {
      // Create the Data variables
      var allSamples = data.samples;
      var selectionArray = allSamples.filter(object => object.id == sample);
      var selectionObj = selectionArray[0];
      var sample_values = selectionObj.sample_values;
      var otu_ids = selectionObj.otu_ids;
      var otu_labels = selectionObj.otu_labels;

      // Build Bar Chart
      var yLabels = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
      var hBarData = [{
          type: 'bar',
          x: sample_values.slice(0, 10).reverse(),
          y: yLabels,
          text: otu_labels.slice(0, 10).reverse(),
          marker: {
            color: "rgb(26,215,121)"
          },
          orientation: 'h'
        }];

      var barLayout = {
          title: "Top 10 Bacteria Cultures Found",
          margin: { t: 50, l: 150 },
          
          // automargin: true
      };
        
        Plotly.newPlot('bar', hBarData, barLayout);



      
      // Create the Bubble Chart
      var bubbleData = [{
          x: otu_ids,
          y: sample_values,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Jet" 
          }
      }];

      var bubbleLayout = {
          title: "Bacteria Cultures Per Sample",
          margin: { t: 0 },
          hovermode: "closest",
          xaxis: { title: "OTU ID" },
          margin: { t: 30 },
      };

      Plotly.newPlot("bubble", bubbleData, bubbleLayout)
  }).catch(err => {
      console.log('an error occured inside buildCharts', err)
  });
};

function metaData(sample) {
  d3.json("./samples.json").then( data => {
      // Create metaData variables
      var metaData = data.metadata;
      var selectionArray = metaData.filter(obj => obj.id == sample);
      var selectionObj = selectionArray[0];

      // Use d3 to select the HTML where the info will be placed
      var demographicBox = d3.select("#sample-metadata");
      // Use .html to clear existing metaData
      demographicBox.html("");
      // Use Object.entries to add each key and value pair to the box
      console.log(Object.entries(selectionObj))
      Object.entries(selectionObj).forEach(([key, value]) => {
          demographicBox.append("h6")
          .text(`${key}: ${value}`)

      })

  }).catch(err => console.log('an err happened in the metadata promise', err))
};


function init() {
  // Grab a reference to the DropDown
  var selector = d3.select("#selDataset");

  // Read in the Data
  d3.json("./samples.json").then( data => {
      // Create init Variables
      var names = data.names;
      // Populate DropDown menu with sample IDs
      names.forEach( name => {
          selector
          .append("option")
          .text(name)
          .property("value", name);
      });
      // Create default charts
      var defaultSample = names[0];
      buildCharts(defaultSample);
      metaData(defaultSample);
  }).catch(err => console.log('ok cool error!', err));
};



function idChange(newSample) {  
  // Fetch new data each time a new sample is selected  
  buildCharts(newSample);  
  metaData(newSample);}
  


  

init();