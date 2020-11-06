//Lab 7-- Mapping


const width=800
const height=800
const half=width/2

d3.json('airports.json').then(airports=>{
   

    const anodes=airports.nodes
    const alinks=airports.links
    console.log(anodes, alinks)

    const svg = d3.select('.chart')
            .append('svg')
            .attr('width', width)  
            .attr('height',height)
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

    nodeElements.append("title")
      .text(d=>d.name)
    
    const linkElements = svg.append('g')
      .selectAll('line')
      .data(alinks)
      .enter().append('line')
        .attr('stroke-width', 1)
        .attr('stroke', '#E5E5E5')
        
    airForce.nodes(anodes).on("tick", function(){
        nodeElements
            .attr("cx", node => node.x)
            .attr("cy", node => node.y)
        linkElements
            .attr('x1', link => link.source.x)
            .attr('y1', link => link.source.y)
            .attr('x2', link => link.target.x)
            .attr('y2', link => link.target.y)
        })
    airForce.force('link').link(alinks)
       
})