// d3 scatter plot with x: budget, y: revenue
//   points for each movie, colored by how profitable it is
//       profitability depends on how many more times it is earning 
//   selection for the different genres (only take in the first genre)

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

    function assign_colors(profitability){
        if (profitability < 1) return 'red';    // loss
        if (profitability < 2) return 'yellow'; // break-even
        if (profitability < 5) return 'blue';   // profitable
        return 'green';                         // extremely profitable`    
    }

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

    // plot points
    let circle = svg.selectAll('circle')
                    .data(data)
                    .enter()
                    .append('circle')
                    .attr('r', 3)
                    .attr('cx', d => xScale(d.budget))
                    .attr('cy', d => yScale(d.revenue))
                    .attr('opacity', 0.6)
                    .attr('fill', d => assign_colors(d.profitability));

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
});