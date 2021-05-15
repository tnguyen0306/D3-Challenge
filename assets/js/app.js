// The code for the chart is wrapped inside a function that automatically resizes the chart
function makeResponsive() {

    // If the SVG area isn't empty when the browser loads, remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
  
    // Clear svg is not empty
    if (!svgArea.empty()) {
        svgArea.remove();
    }
    
    // Setup chart
    var svgWidth = window.innerWidth;
    if (svgWidth > 1000) {
        svgWidth = 1000
    }

    var svgHeight = 550;
  
    var margin = {
        top: 20,
        right: 150,
        bottom: 100,
        left: 100
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
  
    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
  
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // Initial parameters for x and y axis
    var chosenXAxis = "poverty";
    var chosenYAxis = "healthcare";
  
    // Create scale functions for x and y axis
    function xScale(healthcareData, chosenXAxis) {
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(healthcareData, d => d[chosenXAxis]) * 0.85,
            d3.max(healthcareData, d => d[chosenXAxis]) * 1.1
            ])
            .range([0, width]);
        return xLinearScale;
    }

    function yScale(healthcareData, chosenYAxis) {
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(healthcareData, d => d[chosenYAxis]) * 0.75,
            d3.max(healthcareData, d => d[chosenYAxis]) * 1.1
            ])
            .range([height, 0]);
        return yLinearScale;
    }

        // Function for updating Tooltip
    function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {
        if (chosenXAxis === "poverty") {
            var xLabel = "Poverty (%)";
        }
        else if (chosenXAxis === "age") {
            var xLabel = "Age (Median)";
        }
        else {
            var xLabel = "Household Income (Median)";
        }
        if (chosenYAxis === "healthcare") {
            var yLabel = "Lacks Healthcare (%)";
        }
        else if (chosenYAxis === "obesity") {
            var yLabel = "Obese (%)";
        }
        else {
            var yLabel = "Smokes (%)";
        }

        // Initialize tool tip
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([80, -60])
            .html(function(d) {
            return (`${d.abbr}<br>${xLabel}: ${d[chosenXAxis]}<br>${yLabel}: ${d[chosenYAxis]}`);
            });

        // Create tooltip in the chart fro circles
        circlesGroup.call(toolTip);
        
        // Display and hide the tooltip on circles
        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
        })
            // onmouseout Event
            .on("mouseout", function(data) {
            toolTip.hide(data);
            });

        // Create tooltip in the chart fro circles
        textGroup.call(toolTip);

        // Display and hide the tooltip on states abbr
        textGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
        })
            // onmouseout Event
            .on("mouseout", function(data) {
            toolTip.hide(data);
            });
        return circlesGroup;
    }

    // Function for updating Tooltip
    function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {
        if (chosenXAxis === "poverty") {
            var xLabel = "Poverty (%)";
        }
        else if (chosenXAxis === "age") {
            var xLabel = "Age (Median)";
        }
        else {
            var xLabel = "Household Income (Median)";
        }
        if (chosenYAxis === "healthcare") {
            var yLabel = "Lacks Healthcare (%)";
        }
        else if (chosenYAxis === "obesity") {
            var yLabel = "Obese (%)";
        }
        else {
            var yLabel = "Smokes (%)";
        }
  
    // Initialize Tool Tip
    var toolTip = d3.tip()
        .attr("class", "tooltip d3-tip")
        .offset([80, -60])
        .html(function(d) {
          return (`<strong>${d.abbr}</strong><br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
        });

    // Create Circles Tooltip in the Chart
    circlesGroup.call(toolTip);

    // Create Event Listeners to Display and Hide the Circles Tooltip
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
        // onmouseout Event
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });
    
    // Create Text Tooltip in the Chart
    textGroup.call(toolTip);
      
    // Create Event Listeners to Display and Hide the Text Tooltip
    textGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout Event
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });
      return circlesGroup;
    }
  
    // Function for change x and y axis by click on Label
    function renderXAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);
        xAxis.transition()
            .duration(500)
            .call(bottomAxis);
        return xAxis;
    }

    function renderYAxes(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);
        yAxis.transition()
            .duration(500)
            .call(leftAxis);
        return yAxis;
    }
  
    // Function for updating data
    function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
        circlesGroup.transition()
            .duration(500)
            .attr("cx", d => newXScale(d[chosenXAxis]))
            .attr("cy", d => newYScale(d[chosenYAxis]));
        return circlesGroup;
    }
  
    // Function for updating states abbr
    function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
        textGroup.transition()
            .duration(500)
            .attr("x", d => newXScale(d[chosenXAxis]))
            .attr("y", d => newYScale(d[chosenYAxis]) + 3)
            .attr("text-anchor", "middle");
        return textGroup;
    }
  
    // Import data from the csv file
    d3.csv("assets/data/data.csv").then(function(healthcareData) {
        healthcareData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.age = +data.age;
            data.income = +data.income;
            data.healthcare = +data.healthcare;
            data.obesity = +data.obesity;
            data.smokes = +data.smokes;
        });
    
        // Create scale functions
        var xLinearScale = xScale(healthcareData, chosenXAxis);
        var yLinearScale = yScale(healthcareData, chosenYAxis);
    
        // Create axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);
    
        // Append x and y xis chart
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        var yAxis = chartGroup.append("g")
            .classed("y-axis", true)
            .call(leftAxis);
    
        // Create circles
        var circlesGroup = chartGroup.selectAll(".stateCircle")
            .data(healthcareData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("class", "stateCircle")
            .attr("r", 15)
            .attr("opacity", ".8");
    
        // Append state abbr to circles
        var textGroup = chartGroup.selectAll(".stateText")
            .data(healthcareData)
            .enter()
            .append("text")
            .attr("class", "stateText")
            .text(d => (d.abbr))
            .attr("font-size", "9")
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis]) + 3);
    
        // Create group for x and y axis Labels
        var xLabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`);

        var yLabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(-25, ${height / 2})`);
        
        // Append x axis
        var povertyLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty") // Value to Grab for Event Listener
            .classed("active", true)
            .text("Poverty (%)");
    
        var ageLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age") // Value to Grab for Event Listener
            .classed("inactive", true)
            .text("Age (Median)");
    
        var incomeLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income") // Value to Grab for Event Listener
            .classed("inactive", true)
            .text("Household Income (Median)");
        
        // Append y Axis
        var healthcareLabel = yLabelsGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -20)
            .attr("x", 0)
            .attr("value", "healthcare")
            .attr("dy", "1em")
            .classed("axis-text", true)
            .classed("active", true)
            .text("Lacks Healthcare (%)");
    
        var smokesLabel = yLabelsGroup.append("text") 
            .attr("transform", "rotate(-90)")
            .attr("y", -40)
            .attr("x", 0)
            .attr("value", "smokes")
            .attr("dy", "1em")
            .classed("axis-text", true)
            .classed("inactive", true)
            .text("Smokes (%)");
    
        var obesityLabel = yLabelsGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -60)
            .attr("x", 0)
            .attr("value", "obesity")
            .attr("dy", "1em")
            .classed("axis-text", true)
            .classed("inactive", true)
            .text("Obese (%)");
    
        // update ToolTip Function
        var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
    
        // Update x axis when new label has chosen
        xLabelsGroup.selectAll("text")
            .on("click", function() {
                // Retrieve value
                var value = d3.select(this).attr("value");
                if (value !== chosenXAxis) {
                    // Replaces new value
                    chosenXAxis = value;
                    // Updates scale
                    xLinearScale = xScale(healthcareData, chosenXAxis);
                    // Updates axis 
                    xAxis = renderXAxes(xLinearScale, xAxis);
                    // Updates data
                    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                    // Updates states abbr
                    textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)
                    // Updates Tooltips
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
                    // Update x axis labels depending on the choice
                    if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    }
                    else if (chosenXAxis === "age") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    }
                    else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    }
                }
            });
        
        // Update x axis when new label has chosen
        yLabelsGroup.selectAll("text")
            .on("click", function() {
            // Retrieve value
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {
                // Replaces new value
                chosenYAxis = value;
                // Updates scale
                yLinearScale = yScale(healthcareData, chosenYAxis);
                // Updates axis
                yAxis = renderYAxes(yLinearScale, yAxis);
                // Updates data
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                // Updates states abbr
                textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)
                // Updates Tooltips 
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
                // Update x axis labels depending on the choice
                if (chosenYAxis === "healthcare") {
                healthcareLabel
                    .classed("active", true)
                    .classed("inactive", false);
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else if (chosenYAxis === "obesity") {
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obesityLabel
                    .classed("active", true)
                    .classed("inactive", false);
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else {
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokesLabel
                    .classed("active", true)
                    .classed("inactive", false);
                }
            }
        });
    }).catch(function(error) {
        console.log(error);
    });
  }
  // When the browser loads, makeResponsive() is called
  makeResponsive();
  
  // When the browser window is resized, makeResponsive() is called
  d3.select(window).on("resize", makeResponsive);