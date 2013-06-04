
window.editableScatter = ({data,w,h,el}) ->

  hPadding = 10
  vPadding = 10

  x = d3.scale.linear().range([hPadding,w-hPadding])
  y = d3.scale.linear().range([h-vPadding,vPadding])

  zeal = x.domain(d3.extent(data,(a) -> a.zeal))
  size = y.domain(d3.extent(data,(a) -> a.size))

  userPoints = {}

  addPoint = ->

  draw = ->
    points = d3.select(el)
      .append("svg")
      .attr("width",w)
      .attr("height",h)
      .append("g")
      .selectAll(".point")
      .data(data)

    entering = points
      .enter()
      .append("g").classed("language",true)

    entering
      .append("text")

    entering
      .append("circle").classed("point",true)
        .attr("r",5)
      .on("click",addPoint)

    points
      .attr("transform",(d)-> "translate(#{zeal(d.zeal)},#{size(d.size)})")
      .select("text")
        .text((d) -> d.name)




  draw()
      

