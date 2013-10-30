(function() {
  window.editableScatter = function(_arg) {
    var addPoint, data, draw, el, h, hPadding, size, userPoints, vPadding, w, x, y, zeal;

    data = _arg.data, w = _arg.w, h = _arg.h, el = _arg.el;
    hPadding = 10;
    vPadding = 10;
    x = d3.scale.linear().range([hPadding, w - hPadding]);
    y = d3.scale.linear().range([h - vPadding, vPadding]);
    zeal = x.domain(d3.extent(data, function(a) {
      return a.zeal;
    }));
    size = y.domain(d3.extent(data, function(a) {
      return a.size;
    }));
    userPoints = {};
    addPoint = function() {};
    draw = function() {
      var entering, points;

      points = d3.select(el).append("svg").attr("width", w).attr("height", h).append("g").selectAll(".point").data(data);
      entering = points.enter().append("g").classed("language", true);
      entering.append("text");
      entering.append("circle").classed("point", true).attr("r", 5).on("click", addPoint);
      return points.attr("transform", function(d) {
        return "translate(" + (zeal(d.zeal)) + "," + (size(d.size)) + ")";
      }).select("text").text(function(d) {
        return d.name;
      });
    };
    return draw();
  };

}).call(this);
