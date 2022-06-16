var crimeData ={};

var selectedYear = "2020";

fetch('https://data.gov.sg/api/action/datastore_search?resource_id=83c21090-bd19-4b54-ab6b-d999c251edcf')
    // get API response
    .then(response => response.json())
    
    // get parking data and remove unecessarry info elements
    .then(data => crimeData = data.result)
    
    // for console log debugging
    .then(test => console.log(crimeData))

    // show year of data
    .then(selectYear => {
        var yearSpan = document.createElement('span');
        yearSpan.innerHTML = "<strong>Year:</strong> " + selectedYear;
        document.getElementById("crimeYear").appendChild(yearSpan);
        return selectedYear;
    })

    // show data graph
    .then((visualize) => {
        //filter json data by year
        let data = crimeData.records.filter(({year}) => year === selectedYear);
        data.sort((a, b)  => a.value - b.value)
        console.log(data);

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
                .html("There were " + d.value + " occurences of "  + d.level_2 + " in " + selectedYear + ".")
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
        chart.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => xScale(d.level_2))
            .attr("y", d => yScale(d.value))
            .attr("width", d => xScale.bandwidth())
            .attr("height", d => height - yScale(d.value))
            .attr("class", "svgRect")
            .attr("fill", "crimson")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);
    })