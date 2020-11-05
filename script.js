//Lab 7-- Mapping


const width=500
const height=500
const half=width/2

d3.json('airports.json').then(airports=>{
   

    const anodes=airports.nodes
    console.log(anodes)

    const svg = d3.select('.chart')
            .append('svg')
            .style('width', '100%')  
            .attr('viewBox', [0,0,width, height])
            .append('g')
            .attr('transform', `translate(${half}, ${half})`)

    const circleScale=d3.scaleLinear()
        .domain(d3.extent(anodes,d=>d.passengers))
        .range([8,30])
        
    const portScale=d3.scaleOrdinal()
        .domain(anodes, d=>d.name)
        .range(d3.schemeTableau10)
    
    const airForce = d3.forceSimulation()
        .force('charge', d3.forceManyBody().strength(-50))
        .force('center', d3.forceCenter([half, half]))
    
    const nodeElements=svg.append('g')
        .selectAll('circle')
        .data(anodes)
        .enter().append('circle')
          .attr('r', d=>circleScale(d.passengers))
          .attr('fill', d=>portScale(d.name))

    airForce.nodes(anodes).on("tick", function(){
        nodeElements
            .attr("cx", node => node.latitude)
            .attr("cy", node => node.longitude)
        })
})