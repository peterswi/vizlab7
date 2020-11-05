//Lab 7-- Mapping


const width=500
const height=500

d3.json('airports.json').then(airports=>{
    console.log(airports)

    const svg = d3.select('.chart')
            .append('svg')
            .style('width', '100%')  
            .attr('viewBox', [0,0,width, height])
})