// d3 scatter plot with x: budget, y: revenue
//   points for each movie, colored by how profitable it is
//       profitability depends on how many more times it is earning 
//   selection for the different genres (only take in the first genre)

let 
    width = 500,
    height = 600;

let margin = { 
    top: 50,
    bottom: 50,
    left: 50,
    right: 50
};

let svg = d3.select('body')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', 'gray')

// define the scales
let yScale = d3.scaleLinear() // linear bc it is a linear relationship for the domain
              .domain([0,10]) // domain is rata range you want to represent
              .range([height - margin.bottom, margin.top])

let xScale = d3.scaleBand() // band bc x-axis might be divided into different bins
              .domain(data.map(d => d.name)) // d: data, d.name: data in each col
              .range([margin.left, width - margin.right])

// make axis with the scale functions
let xAxis = svg.append('g')
              .call(d3.axisBottom().scale(xScale))
              .attr('transform', `translate(0, ${height - margin.bottom})`)

let yAxis = svg.append('g')
              .call(d3.axisLeft().scale(yScale))
              .attr('transform', `translate(${margin.left}, 0)`)
