function DrawLine(x0, y0, x1, y1, col)
{
    context.fillStyle = col;
    context.strokeStyle = col;
    context.beginPath();
    context.moveTo(x0+canvas.width/2, canvas.height/2-y0);
    context.lineTo(x1+canvas.width/2, canvas.height/2-y1);
    context.stroke();
}

function DrawPoint(x, y, col)
{
    context.fillStyle = col;
    context.strokeStyle = col;
    context.beginPath();
    context.arc(x+canvas.width/2, canvas.height/2-y, 2, 0, 2.0*Math.PI, false);
    context.fill();
    context.stroke();
}

function DrawText(text, x, y, col)
{
    context.fillStyle = col;
    context.fillText(text, x+canvas.width/2, canvas.height/2-y);
}

function FillRect(x, y, w, h, col)
{
    context.fillStyle = col;
    context.fillRect(x+canvas.width/2, canvas.height/2-y, w, h);
}

function DrawPolygon(points, off, col)
{
    context.strokeStyle = col;
    context.fillStyle = col;
    
    // draw vertices
    var ymax = 0;

    for (var i=0; i<points.length; i++)
    {
        var pt = points[i];
        DrawPoint(pt.x+off.x, pt.y+off.y, col);
        ymax = Math.max(ymax, pt.y);
    }

    // draw lines
    for (var i=0; i<points.length; i++)
    {
        var pt0 = points[i];
        var pt1 = points[(i+1)%points.length]
        var midPt = pt0.midpoint(pt1);
        DrawLine(pt0.x+off.x, pt0.y+off.y, pt1.x+off.x, pt1.y+off.y, col);
    }
}

points =
[
    new Vector(235, 774),
    new Vector(245, 740),
    new Vector(230, 710),
    new Vector(240, 703),
    new Vector(274, 733),
    new Vector(306, 710),
    new Vector(272, 690),
    new Vector(277, 639),
    new Vector(305, 645),
    new Vector(347, 611),
    new Vector(340, 639),
    new Vector(298, 674),
    new Vector(325, 702),
    new Vector(335, 663),
    new Vector(355, 645),
    new Vector(350, 686),
    new Vector(400, 710),
    new Vector(360, 725),
    new Vector(357, 755),
    new Vector(328, 723),
    new Vector(291, 741),
    new Vector(289, 754),
    new Vector(266, 757),
];

// points.length must be > 0
function CalcAabb(points)
{
    var aabbMin = points[0].clone();
    var aabbMax = points[0].clone();
    
    for (var i=1; i<points.length; i++)
    {
        aabbMin.x = Math.min(aabbMin.x, points[i].x);
        aabbMin.y = Math.min(aabbMin.y, points[i].y);
        aabbMax.x = Math.max(aabbMax.x, points[i].x);
        aabbMax.y = Math.max(aabbMax.y, points[i].y);
    }
    
    return [aabbMin, new Vector(aabbMin.x, aabbMax.y), aabbMax, new Vector(aabbMax.x, aabbMin.y)];
}

function UiCompute()
{
    // clear canvas
    FillRect(-canvas.width/2, canvas.height/2, canvas.width, canvas.height, "#eeeeee");
    
    // transform points into view
    for (var i=0; i<points.length; i++)
    {
        points[i].x *= 1.5;
        points[i].y *= 1.5;
        points[i].x -= 250;
        points[i].y -= 1050;
    }
    
    // do computations
    var convexHull = CalcConvexHull(points);
    var maer = new MinAreaEnclosingRect(convexHull);
    var oobb = maer.Compute(); // draws OOBB candidates
    var aabb = CalcAabb(points);

    // paint infos
    context.lineWidth = 2.0;
    DrawPolygon(convexHull, new Vector(0, 0), "#00c800", false);
    context.lineWidth = 1.0;
   
    DrawText("Convex hull", -100, 200, "#00c800");
    DrawText("Axis aligned bounding box", -100, 212, "#0000ff");
    DrawText("Oriented bounding box", -100, 224, "#ff0000"); 
    DrawText("OOBB candidates", -100, 236, "#336699");
    DrawText("Input polygon", -100, 248, "#000000");

    DrawPolygon(points, new Vector(-480, 0), "#000000", false);
    DrawPolygon(convexHull, new Vector(-480, 0), "#00c800", false);
    DrawPolygon(oobb, new Vector(-480, 0), "#ff0000", false);
    DrawPolygon(aabb, new Vector(-480, 0), "#0000ff", false);
}
