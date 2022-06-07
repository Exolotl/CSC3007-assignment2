var crimeData ={}

fetch('https://data.gov.sg/api/action/datastore_search?resource_id=83c21090-bd19-4b54-ab6b-d999c251edcf')
    // get API response
    .then(response => response.json())
    
    // get parking data and remove unecessarry info elements
    .then(data => crimeData = data.result)
    
    // for console log debugging
    .then(test => console.log(crimeData))

    .then(visualize => {
        let data = [
            {text: "Hello World 1", size: 10, color: "green", font: "Courier New"},
            {text: "Hello World 2", size: 20, color: "blue", font: "Arial"},
            {text: "Hello World 3", size: 30, color: "red", font: "Times New Roman"}
        ];
        
        let hellos = d3.select("#textScript");
        
        hellos.selectAll("p")
        .data(data)
        .enter()
        .append("p")
        .text(d => d.text)

        .transition()
        .duration((d,i) => i * 1000)

        .style("font-size", d => d.size + "px")
        .style("color", d => d.color);
    })

    .then(exampleGraph => {
        let data = [
            {cx: 400, cy: 600, r:150, fill: "green", stroke: "black"},
            {cx: 100, cy: 200, r:50, fill: "blue", stroke: "purple"},
            {cx: 650, cy: 100, r:100, fill: "red", stroke: "orange"}
        ];
        
        let margin = {top: 20, right: 20, bottom: 40, left: 40},
            width = 600 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        let chart = d3.select("#graphScript")
            .attr("width", 1000)
            .attr("height", 1000)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        let xScale = d3.scaleLinear()
            .domain([0,1000])
            .range([0,width]);

        let yScale = d3.scaleLinear()
            .domain([0,1000])
            .range([height,0]);

        let colorScale = d3.scaleLinear()
            .domain([0, 300])
            .range([0,1]);
        
        chart.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")

            .transition()
            .duration((d,i) => i * 1000)

            .attr("cx", d => xScale(d.cx))
            .attr("cy", d => yScale(d.cy))
            .attr("r", d => d.r)
            .attr("fill", d => d3.interpolateViridis(colorScale(d.r)));
            //.attr("fill", d => d.fill);

        chart
            .append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));
        
        chart
            .append("g")
            .call(d3.axisLeft(yScale));
    
        chart
            .append("text")
            .attr("transform", "translate(" + (width / 2) + "," + (height + 40) + ")")
            .text("X-axis label")
            .attr("text-align", "middle");
        
        chart
            .append("text")
            .attr("transform", "translate(-40, " + (height / 2) + ") rotate(-90)")
            .text("Y-axis label")
            .attr("text-align", "middle");
            
        chart
            .on("mouseover", (event, d) => {
                d3.select(event.currentTarget)
                .attr("stroke", "black")
                .attr("stroke-width", 1);
            }) 
            .on("mouseout", (event, d) => {
                d3.select(event.currentTarget)
                .attr("stroke", "none");
            })
    })

    .then(graph => {
        let selectedYear = "2020";
        let data = crimeData.records.filter(({year}) => year === selectedYear);
        data.sort((a, b)  => b.value - a.value)
        console.log(data);

        let margin = {top: 25, right: 25, bottom: 100, left: 75},
            width = 700 - margin.left - margin.right,
            height = 350 - margin.top - margin.bottom;

        let chart = d3.select("#crimeGraph")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Add scales
        let xScale = d3.scaleBand()
            .domain(data.map(d => d.level_2))
            .rangeRound([0, width])
            .padding(0.1);
        
        let yMax = Math.ceil(
            d3.max(data, d => parseInt(d.value))/1000
        ) * 1000;
        
        let yScale = d3.scaleLinear()
            .domain([0, yMax])
            .rangeRound([height, 0]);
        
        // Add x-axis
        chart
            .append("g")
            .attr("class", "axis axis-x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale))
            .selectAll("text")
                .attr("transform", "rotate(-30)")
                .style("text-anchor", "end")
                .style("font-size","10px");

        // Add y-axis
        chart
            .append("g")
            .attr("class", "axis axis-y")
            .call(d3.axisLeft(yScale).ticks(10))
            .selectAll("text")
                .style("font-size","10px");
        
        // Add y-axis gridlines
        // chart.append("g")
        //     .attr("class", "grid")
        //     .call(d3.axisLeft(yScale)
        //         .tickSize(-width)
        //         .tickFormat('')
        //         .ticks(10)
        //     );

        var Tooltip = d3.select("#crimeGraph")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        var mouseover = function(d) {
            Tooltip
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 0.8)
        }

        var mousemove = function(d) {
            Tooltip
                .html("The exact value of<br>this cell is: " + d.value)
                .style("left", (d3.pointer(this)[0]+70) + "px")
                .style("top", (d3.pointer(this)[1]) + "px")
        }

        var mouseout = function(d) {
            Tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 1)
        }

        chart.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
                .attr("x", function(d) { return xScale(d.level_2); })
                .attr("y", function(d) { return yScale(d.value); })
                .attr("width", function(d) {return xScale.bandwidth(); })
                .attr("height", function(d) { return height - yScale(d.value); })
                .attr("class", "svgRect")
                .attr("fill", "crimson")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseout", mouseout);
    })