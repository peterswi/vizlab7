//Lab 7-- Mapping


const width=500
const height=500

d3.json('airports.json').then(airports=>{
    console.log(d3.extent(airports.nodes,d=>d.passengers))


    const svg = d3.select('.chart')
            .append('svg')
            .style('width', '100%')  
            .attr('viewBox', [0,0,width, height])

    const circleScale=d3.scaleLinear()
        .domain(d3.extent(airports.nodes,d=>d.passengers))
        .range([8,30])
    
    const airForce = d3.forceSimulation(airports.nodes)
})