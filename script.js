var crimeData ={};

var dropdown = document.querySelector('.dropdown');
dropdown.addEventListener('click', function(event) {
  event.stopPropagation();
  dropdown.classList.toggle('is-active');
});

fetch('https://data.gov.sg/api/action/datastore_search?resource_id=83c21090-bd19-4b54-ab6b-d999c251edcf')
    // get API response
    .then(response => response.json())
    
    // get parking data and remove unecessarry info elements
    .then(data => crimeData = data.result)
    
    // for console log debugging
    .then(test => console.log(crimeData))

    // show year of data
    .then(selectYear => {
        
    })

    // show data graph
    .then((visualize) => {
        //filter json data by year
        let data = crimeData.records;

        // set SVG size
        let svgWidth = 700, svgHeight = 300;
        let margin = {top: 10, right: 20, bottom: 80, left: 50},
            width = svgWidth - margin.left - margin.right,
            height = svgHeight - margin.top - margin.bottom;

        // create SVG
        let chart = d3.select("#crimeGraph")
            .append("svg")
            .attr("viewBox", "0 0 " + svgWidth + " " + svgHeight)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // add x scale
        let xScale = d3.scaleBand()
            .domain(data.map(d => d.level_2))
            .rangeRound([0, width])
            .padding(0.1);
        
        // add y scale
        let yMax = Math.ceil(
            d3.max(data, d => parseInt(d.value))/1000
        ) * 1000;

        let yScale = d3.scaleLinear()
            .domain([0, yMax])
            .rangeRound([height, 0]);
        
        // add x-axis
        chart
            .append("g")
            .attr("class", "axis axis-x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale))
            .selectAll("text")
                .attr("transform", "rotate(-30)")
                .style("text-anchor", "end")
                .style("font-size","10px");

        // add y-axis
        chart
            .append("g")
            .attr("class", "axis axis-y")
            .call(d3.axisLeft(yScale).ticks(10))
            .selectAll("text")
                .style("font-size","10px");

        // create tooltip div
        let tooltip = d3.select(".tooltip")
            .style("opacity", 0)
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // mouseover events
        let mouseover = function(d) {
            // Tooltip
            tooltip
                .style("opacity", 0.9);
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 0.8);
        }

        // mousemove events
        let mousemove = function(event, d) {
            tooltip
                .html("There were " + d.value + " occurences of "  + d.level_2 + " in " + d.year + ".")
                .style("position", "absolute")
                .style("top", (event.pageY)+"px")
                .style("left",(event.pageX)+"px");
        }

        // mouseleave events
        let mouseleave = function(d) {
            tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 1)
        }

        // create chart
        // chart.selectAll("rect")
        //     .data(data)
        //     .enter()
        //     .append("rect")
        //     .attr("x", d => xScale(d.level_2))
        //     .attr("y", d => yScale(d.value))
        //     .attr("width", d => xScale.bandwidth())
        //     .attr("height", d => height - yScale(d.value))
        //     .attr("class", "svgRect")
        //     .attr("fill", "crimson")
        //     .on("mouseover", mouseover)
        //     .on("mousemove", mousemove)
        //     .on("mouseleave", mouseleave);

        function drawChart(selectedYear) {

            let yearDiv = document.getElementById("crimeYear");
            while (yearDiv.firstChild) {
                yearDiv.removeChild(yearDiv.firstChild);
            }
            var yearSpan = document.createElement('span');
            yearSpan.innerHTML = "<strong>Year:</strong> " + selectedYear;
            yearDiv.appendChild(yearSpan);

            let data = crimeData.records.filter(({year}) => year === selectedYear);
            data.sort((a, b)  => a.value - b.value);

            xScale.domain(data.map(function(d) { return d.level_2; }));
            chart.select("g .axis-x")
                .transition()
                .duration(1000)
                .call(d3.axisBottom(xScale));

            chart.selectAll("rect")
                .data(data)
                .join(
                enter => enter
                    .append("rect")
                    .attr("x", d => xScale(d.level_2))
                    .attr("y", d => yScale(d.value))
                    .attr("width", 0)
                    .attr("height", 0)
                    .attr("class", "svgRect")
                    .attr("fill", "crimson")
                    .on("mouseover", mouseover)
                    .on("mousemove", mousemove)
                    .on("mouseleave", mouseleave)
                  .call(enter => enter.transition()
                    .duration(1000)
                    .attr("width", xScale.bandwidth())
                    .attr("height", d => height - yScale(d.value))
                   ),
                update => update 
                  .call(update => update.transition()
                    .duration(1000)
                    .attr("x", d => xScale(d.level_2))
                    .attr("y", d => yScale(d.value))
                    .attr("width", xScale.bandwidth())
                    .attr("height", d => height - yScale(d.value))
                   ),
                exit => exit
                  .call(exit => exit.transition()
                    .duration(1000)
                    .attr("width", 0)
                    .attr("height", 0)
                    .remove()
                   )
                );
        }


        d3.select("#bt2020").on("click", function() {
            
            drawChart("2020");
        });
        d3.select("#bt2019").on("click", function() {
            drawChart("2019");
        });
        d3.select("#bt2018").on("click", function() {
            drawChart("2018");
        });
        d3.select("#bt2017").on("click", function() {
            drawChart("2017");
        });
        d3.select("#bt2016").on("click", function() {
            drawChart("2016");
        });
        d3.select("#bt2015").on("click", function() {
            drawChart("2015");
        });
        d3.select("#bt2014").on("click", function() {
            drawChart("2014");
        });
        d3.select("#bt2013").on("click", function() {
            drawChart("2013");
        });
        d3.select("#bt2012").on("click", function() {
            drawChart("2012");
        });
        d3.select("#bt2011").on("click", function() {
            drawChart("2011");
        });

        drawChart("2020");
        
    })