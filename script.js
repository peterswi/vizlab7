//Lab 7-- Mapping


const width=800
const height=800
const half=width/2

drag = airForce => {

    function dragstarted(event) {
        if (!event.active) airForce.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event) {
        if (!event.active) airForce.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);

}

Promise.all([ // load multiple files
	d3.json('airports.json'),
	d3.json('world-110m.json')
]).then(data=>{ // or use destructuring :([airports, wordmap])=>{ ... 
	let airports = data[0]; // data1.csv
	let worldmap = data[1]; // data2.json

    const anodes=airports.nodes
    const alinks=airports.links

    let worldmapgeo = topojson.feature(worldmap, worldmap.objects.countries)
    
    const world=d3.geoMercator().fitExtent([[0,0],[width, height]],worldmapgeo)
    let worldPath=d3.geoPath().projection(world)

    const svg = d3.select('.chart')
            .append('svg')
            .attr('width', width)  
            .attr('height',height)
            .attr('viewBox', [0,0,width, height])
            .append('g')
            .attr('transform', `translate(${width/16}, ${height/16})`)

    const map = svg.append("path")
        .datum(worldmapgeo)
        .attr("d", worldPath)
        .style("opacity", 0)

    const mapOutline=svg.append("path")
            .datum(topojson.mesh(worldmap, worldmap.objects.countries))
            .attr("d", worldPath)
            .attr('fill', 'none')
            .attr('stroke', 'white')
            .attr("class", "subunit-boundary")

    const circleScale=d3.scaleLinear()
        .domain(d3.extent(anodes,d=>d.passengers))
        .range([8,30])
        
    const portScale=d3.scaleOrdinal()
        .domain(anodes, d=>d.name)
        .range(d3.schemeTableau10)
    
    const airForce = d3.forceSimulation(anodes)
        .force('charge', d3.forceManyBody().strength(-40))
        .force('center', d3.forceCenter().x(half).y(half))
        .force('link', d3.forceLink(alinks).distance(50))
        //.force('x',d3.forceX(100))
        //.force('y',d3.forceY())

    const linkElements = svg.selectAll('line')
        .data(alinks)
        .enter().append('line')
          .attr('stroke-width', 1)
          .attr('stroke', 'black')
    
    const nodeElements=svg.selectAll('circle')
        .data(anodes)
        .enter().append('circle')
          .attr('r', d=>circleScale(d.passengers))
          .attr('fill', d=>portScale(d.name))
          .call(drag(airForce))

    nodeElements.append("title")
      .text(d=>d.name)
    
  
        
    airForce.on("tick", function(){
        nodeElements
            .attr("cx", node => node.x)
            .attr("cy", node => node.y)
        linkElements
            .attr('x1', link => link.source.x)
            .attr('y1', link => link.source.y)
            .attr('x2', link => link.target.x)
            .attr('y2', link => link.target.y)
        })
    
    

    let tool = d3.selectAll('circle')
        .on("mouseenter", (event, nodes) => {
        const position = d3.pointer(event, window)
        d3.select('.tooltip')
            .style('display', 'inline-block')
            .style('position', 'fixed')
            .style('left', position[0]+10+'px')
            .style('top', position[1]+5+'px')
            .html(nodes.name)
    })
    .on("mouseleave", (event, nodes) => {
        d3.select('.tooltip')
            .style('display', 'none')
    })


    function switchLayout() {
        if (visType === "map") {
              // stop the simulation
              // set the positions of links and nodes based on geo-coordinates
              // set the map opacity to 1
          } else { // force layout
              // restart the simulation
              // set the map opacity to 0
          }
      }
       
})