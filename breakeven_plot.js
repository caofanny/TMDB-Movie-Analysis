const movie_data = d3.csv('movies_cleaned.csv')

// loads the data and changes budget and revenue into numbers
movie_data.then(function(data) {
    
    data.forEach(function(d) {
        d.budget = +d.budget;
        d.revenue = +d.revenue; 
        // calculate the ratio between revenue and budget
        d.profitability = d.revenue / d.budget;

        // removes the ' and []
        let str_genre = d.genres.replace(/[\[\]']/g, '');
        // gets the forst genre from the list
        d.genres = str_genre.split(',')[0].trim();
    });

    // get all the genres
    let allGenre = Array.from(new Set(data.map(d => d.genres))).sort();

    // update dropdown option to include all genres
    let dropdown = d3.select('#select-genre');
    dropdown.selectAll('option.select-genre')
            .data(allGenre)
            .enter()
            .append('option')
            .attr('value', d => d)
            .text(d => d);

    // gets the colors of each movie based on profitability
    function assign_colors(profitability){
        if (profitability < 1) return 'red';    // loss
        if (profitability < 2) return 'yellow'; // break-even
        if (profitability < 5) return 'blue';   // profitable
        return 'green';                         // extremely profitable`    
    };

    // defining the svg margins and dimensions
    let 
        width = 800,
        height = 600;

    let margin = { 
        top: 50,
        bottom: 50,
        left: 100,
        right: 50
    };

    // create the svg container
    let svg = d3.select('#breakeven')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .style('background', 'white');

    // define the scales
    let yScale = d3.scaleLinear() // linear bc it is a linear relationship for the domain
                .domain([d3.min(data, d => d.revenue), d3.max(data, d => d.revenue)]) // domain is rata range you want to represent
                .range([height - margin.bottom, margin.top]);

    let xScale = d3.scaleLinear()
                .domain([d3.min(data, d => d.budget), d3.max(data, d => d.budget)]) 
                .range([margin.left, width - margin.right]);

    // make axis with the scale functions
    let xAxis = svg.append('g')
                .call(d3.axisBottom().scale(xScale))
                .attr('transform', `translate(0, ${height - margin.bottom})`);

    let yAxis = svg.append('g')
                .call(d3.axisLeft().scale(yScale))
                .attr('transform', `translate(${margin.left}, 0)`);

    // add x-axis label              
    svg.append('text')
        .attr('x', width/2)
        .attr('y', height - 15)
        .text('Budget')
        .style('text-anchor', 'middle');

    // add y-axis label
    svg.append('text')
        .attr('x', 0 - height/2)
        .attr('y', 15)
        .text('Revenue')
        .style('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)');

    // make a legend
    let legend = svg.append('g')
                .attr('class', 'legend')
                .attr('transform', `translate(${width - margin.right - 150}, ${margin.top})`);
    
    // data for the legend
    let legendData = [
        {color: 'red', label: '< 1x (Loss)'},
        {color: 'yellow', label: '1x - 2x (Break-even)'},
        {color: 'blue', label: '2x - 5x (Profitable)'},
        {color: 'green', label: '> 5x (Highly Profitable)'}
    ];
    
    let legendItem = legend.selectAll('.legend-item')
        .data(legendData)
        .enter()
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0, ${i * 25})`);
    
    // adds the colors
    legendItem.append('circle')
        .attr('r', 5)
        .attr('cx', 5)
        .attr('cy', 2)
        .attr('fill', d => d.color)
        .attr('opacity', 0.7);

    // Add text labels
    legendItem.append('text')
        .attr('x', 15)
        .attr('y', 5)
        .text(d => d.label)
        .style('font-size', '12px')
        .style('font-family', 'Arial');

    // Add legend title
    legend.append('text')
        .attr('x', 0)
        .attr('y', -10)
        .text('Profitability')
        .style('font-weight', 'bold')
        .style('font-size', '14px');
    
    // updates the graph based on genre selected
    function updateGraph(selectedGenre) {
        let filteredData = data;
        // set data to the data of the specific genre
        if (selectedGenre != 'all') {
            filteredData = data.filter(d => (d.genres == selectedGenre));
        } 

        let circle = svg.selectAll('circle.data')
                        .data(filteredData, d => d.title); // match data to movie titles
        
        // removes the circles without data
        circle.exit().remove();

        // adds the new circles
        circle.enter()
            .append('circle')
            .attr('class', 'data')
            .attr('r', 3)
            .attr('cx', d => xScale(d.budget))
            .attr('cy', d => yScale(d.revenue))
            .attr('opacity', 0.6)
            .attr('fill', d => assign_colors(d.profitability));
    }

    // initial graph
    updateGraph('all');

    // eventlistener: when there is a change, update the graph
    d3.select('#select-genre').on('change', function() {
        updateGraph(this.value);
    });

});