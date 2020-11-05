//Lab 7-- Mapping


const width=1000
const height=1000
const half=width/2

d3.json('airports.json').then(airports=>{
   

    const anodes=airports.nodes
    console.log(anodes)

    const svg = d3.select('.chart')
            .append('svg')
            .style('width', '100%')  
            .attr('viewBox', [0,0,width, height])
            .append('g')
            .attr('transform', `translate(${width/16}, ${height/16})`)

    const circleScale=d3.scaleLinear()
        .domain(d3.extent(anodes,d=>d.passengers))
        .range([8,30])
        
    const portScale=d3.scaleOrdinal()
        .domain(anodes, d=>d.name)
        .range(d3.schemeTableau10)
    
    const airForce = d3.forceSimulation()
        .force('charge', d3.forceManyBody().strength(-20))
        .force('center', d3.forceCenter(half, half))
        //.force('x',d3.forceX(100))
        //.force('y',d3.forceY())

    airForce.force('link', d3.forceLink()
        .id(link => link.id)
        .strength(link => link.strength))
    
    const nodeElements=svg.append('g')
        .selectAll('circle')
        .data(anodes)
        .enter().append('circle')
          .attr('r', d=>circleScale(d.passengers))
          .attr('fill', d=>portScale(d.name))

    airForce.nodes(anodes).on("tick", function(){
        nodeElements
            .attr("cx", node => node.x)
            .attr("cy", node => node.y)
        })
    
})