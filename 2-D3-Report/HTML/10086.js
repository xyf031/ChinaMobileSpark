// Dimensions of sunburst.
var width = 750;
var height = 600;
var radius = Math.min(width, height) / 2;

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
  w: 100, h: 30, s: 3, t: 10
};

// Mapping of step names to colors.
var colors = {
  "小区1": "#CAEBC2",
  "小区2": "#96D581",
  "小区3": "#73BF40",
  "小区4": "#339947",
  "小区5": "#3A6B24",
  "视频": "#DE783B",
  "电商": "#7B615C",
  "微信": "#5687D1",
  "游戏": "#A173D1",
  "导航": "#325EA1",
  "小说": "#06367D",
  "音乐": "#F55877",
  "新闻": "#3EE5F5",
  "微博": "#FFEDAB",
  "邮件": "#FFE6D1",
  "18810103424": "#bbbbbb",
  "18810123904": "#bbbbbb",
  "18810115458": "#bbbbbb",
  "18810118787": "#bbbbbb",
  "18810113284": "#bbbbbb",
  "18810109835": "#bbbbbb",
  "18810115212": "#bbbbbb",
  "18810102157": "#bbbbbb",
  "18810105615": "#bbbbbb",
  "18810126994": "#bbbbbb",
  "18810118933": "#bbbbbb",
  "18810125464": "#bbbbbb",
  "18810128922": "#bbbbbb",
  "18810117403": "#bbbbbb",
  "18810115228": "#bbbbbb",
  "18810128325": "#bbbbbb",
  "18810106999": "#bbbbbb",
  "18810118949": "#bbbbbb",
  "18810102183": "#bbbbbb",
  "18810128938": "#bbbbbb",
  "18810126381": "#bbbbbb",
  "18810104111": "#bbbbbb",
  "18810127408": "#bbbbbb",
  "18810102199": "#bbbbbb",
  "18810105657": "#bbbbbb",
  "18810108986": "#bbbbbb",
  "18810103483": "#bbbbbb",
  "18810126397": "#bbbbbb",
  "18810104127": "#bbbbbb",
  "18810113472": "#bbbbbb",
  "18810111297": "#bbbbbb",
  "18810127042": "#bbbbbb",
  "18810117445": "#bbbbbb",
  "18810126790": "#bbbbbb",
  "18810115400": "#bbbbbb",
  "18810113225": "#bbbbbb",
  "18810103499": "#bbbbbb",
  "18810106957": "#bbbbbb",
  "18810113488": "#bbbbbb",
  "18810128384": "#bbbbbb",
  "18810107602": "#bbbbbb",
  "18810108970": "#bbbbbb",
  "18810123477": "#bbbbbb",
  "18810115416": "#bbbbbb",
  "18810118745": "#bbbbbb",
  "18810128997": "#bbbbbb",
  "18810101480": "#bbbbbb",
  "18810118975": "#bbbbbb",
  "18810110833": "#bbbbbb",
  "18810118771": "#bbbbbb",
  "18810103671": "#bbbbbb",
  "18810101496": "#bbbbbb",
  "18810125055": "#bbbbbb",
  "18810107644": "#bbbbbb",
  "18810102141": "#bbbbbb",
  "18810128981": "#bbbbbb"
};

var colorDraw = {
  "小区1": "#CAEBC2",
  "小区2": "#96D581",
  "小区3": "#73BF40",
  "小区4": "#339947",
  "小区5": "#3A6B24",
  " ": "#FFFFFF",
  "视频": "#DE783B",
  "电商": "#7B615C",
  "微信": "#5687D1",
  "游戏": "#A173D1",
  "导航": "#325EA1",
  "小说": "#06367D",
  "音乐": "#F55877",
  "新闻": "#3EE5F5",
  "微博": "#FFEDAB",
  "邮件": "#FFE6D1"
};

// Total size of all segments
var totalSize = 0;

var vis = d3.select("#chart").append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .append("svg:g")
    .attr("id", "container")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var partition = d3.layout.partition()
    .size([2 * Math.PI, radius * radius])
    .value(function(d) { return d.size; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y); })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

drawLegend();
toggleLegend();

// Main function to draw and set up the visualization, once we have the data.
function createVisualization(json) {

  // Basic setup of page elements.
  initializeBreadcrumbTrail();
  vis.append("svg:circle")
      .attr("r", radius)
      .style("opacity", 0);

  // For efficiency, filter nodes to keep only those large enough to see.
  var nodes = partition.nodes(json)
      .filter(function(d) {
      return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
      });

  var path = vis.data([json]).selectAll("path")
      .data(nodes)
      .enter().append("svg:path")
      .attr("display", function(d) { return d.depth ? null : "none"; })
      .attr("d", arc)
      .attr("fill-rule", "evenodd")
      .style("fill", function(d) { return colors[d.name]; })
      .style("opacity", 1)
      .on("mouseover", mouseover);

  // Add the mouseleave handler to the bounding circle.
  d3.select("#container").on("mouseleave", mouseleave);
  totalSize = path.node().__data__.value;
 };

// Fade all but the current sequence, and show it in the breadcrumb trail.
function mouseover(d) {
  var percentage1 = d.value + " MB";
  var percentage = (100 * d.value / totalSize).toPrecision(3);
  var percentageString = percentage + "%";
  if (percentage < 0.1) {
    percentageString = "< 0.1%";
  }

  d3.select("#percentage1")
      .text(percentage1);
  d3.select("#percentage")
      .text(percentageString);
  d3.select("#explanation")
      .style("visibility", "");

  var sequenceArray = getAncestors(d);
  updateBreadcrumbs(sequenceArray, percentageString);

  d3.selectAll("path")
      .style("opacity", 0.3);

  vis.selectAll("path")
      .filter(function(node) {
                return (sequenceArray.indexOf(node) >= 0);
              })
      .style("opacity", 1);
}

// Restore everything to full opacity when moving off the visualization.
function mouseleave(d) {
  d3.select("#trail")
      .style("visibility", "hidden");

  d3.selectAll("path").on("mouseover", null);

  d3.selectAll("path")
      .transition()
      .duration(300)
      .style("opacity", 1)
      .each("end", function() {
              d3.select(this).on("mouseover", mouseover);
            });

  d3.select("#explanation")
      .style("visibility", "hidden");
}

// Given a node in a partition layout, return an array of all of its ancestor
// nodes, highest first, but excluding the root.
function getAncestors(node) {
  var path = [];
  var current = node;
  while (current.parent) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
}

function initializeBreadcrumbTrail() {
  // Add the svg area.
  var trail = d3.select("#sequence").append("svg:svg")
      .attr("width", width)
      .attr("height", 50)
      .attr("id", "trail");

  trail.append("svg:text")
    .attr("id", "endlabel")
    .style("fill", "#000");
}

// Generate a string that describes the points of a breadcrumb polygon.
function breadcrumbPoints(d, i) {
  var points = [];
  points.push("0,0");
  points.push(b.w + ",0");
  points.push(b.w + b.t + "," + (b.h / 2));
  points.push(b.w + "," + b.h);
  points.push("0," + b.h);
  if (i > 0) {
    points.push(b.t + "," + (b.h / 2));
  }
  return points.join(" ");
}

// Update the breadcrumb trail to show the current sequence and percentage.
function updateBreadcrumbs(nodeArray, percentageString) {
  // Data join; key function combines name and depth (= position in sequence).
  var g = d3.select("#trail")
      .selectAll("g")
      .data(nodeArray, function(d) { return d.name + d.depth; });
  var entering = g.enter().append("svg:g");

  entering.append("svg:polygon")
      .attr("points", breadcrumbPoints)
      .style("fill", function(d) { return colors[d.name]; });

  entering.append("svg:text")
      .attr("x", (b.w + b.t) / 2)
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.name; });

  // Set position for entering and updating nodes.
  g.attr("transform", function(d, i) {
    return "translate(" + i * (b.w + b.s) + ", 0)";
  });

  // Remove exiting nodes.
  g.exit().remove();

  // Now move and update the percentage at the end.
  d3.select("#trail").select("#endlabel")
      .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(percentageString);

  // Make the breadcrumb trail visible, if it's hidden.
  d3.select("#trail")
      .style("visibility", "");

}

function drawLegend() {

  // Dimensions of legend item: width, height, spacing, radius of rounded rect.
  var li = {
    w: 75, h: 30, s: 3, r: 3
  };

  var legend = d3.select("#legend").append("svg:svg")
      .attr("width", li.w)
      .attr("height", d3.keys(colorDraw).length * (li.h + li.s));

  var g = legend.selectAll("g")
      .data(d3.entries(colorDraw))
      .enter().append("svg:g")
      .attr("transform", function(d, i) {
              return "translate(0," + i * (li.h + li.s) + ")";
           });

  g.append("svg:rect")
      .attr("rx", li.r)
      .attr("ry", li.r)
      .attr("width", li.w)
      .attr("height", li.h)
      .style("fill", function(d) { return d.value; });

  g.append("svg:text")
      .attr("x", li.w / 2)
      .attr("y", li.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.key; });
}

function toggleLegend() {
  var legend = d3.select("#legend");
  if (legend.style("visibility") == "hidden") {
    legend.style("visibility", "");
  } else {
    legend.style("visibility", "hidden");
  }
}

function buildHierarchy(csv) {
  var root = {"name": "root", "children": []};
  for (var i = 0; i < csv.length; i++) {
    var sequence = csv[i][0];
    var size = +csv[i][1];
    if (isNaN(size)) { // e.g. if this is a header row
      continue;
    }
    var parts = sequence.split("-");
    var currentNode = root;
    for (var j = 0; j < parts.length; j++) {
      var children = currentNode["children"];
      var nodeName = parts[j];
      var childNode;
      if (j + 1 < parts.length) {
   // Not yet at the end of the sequence; move down the tree.
 	var foundChild = false;
 	for (var k = 0; k < children.length; k++) {
 	  if (children[k]["name"] == nodeName) {
 	    childNode = children[k];
 	    foundChild = true;
 	    break;
 	  }
 	}
  // If we don't already have a child node for this branch, create it.
 	if (!foundChild) {
 	  childNode = {"name": nodeName, "children": []};
 	  children.push(childNode);
 	}
 	currentNode = childNode;
      } else {
 	// Reached the end of the sequence; create a leaf node.
 	childNode = {"name": nodeName, "size": size};
 	children.push(childNode);
      }
    }
  }
  return root;
};
