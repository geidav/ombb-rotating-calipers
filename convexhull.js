var ON = 0;
var LEFT = 1;
var RIGHT = 2;

function GetSideOfLine(lineStart, lineEnd, point)
{
    var d = (lineEnd.x-lineStart.x)*(point.y-lineStart.y)-(lineEnd.y-lineStart.y)*(point.x-lineStart.x);
    return (d > 0.1 ? LEFT : (d < -0.1 ? RIGHT : ON));
}

// returns convex hull in CW order
// (required by Rotating Calipers implementation)
function CalcConvexHull(points)
{   
    // bad input?
    if (points.length < 3)
        return points;

    // find first hull point
    var hullPt = points[0].clone();
    var convexHull = [];
    
    for (var i=1; i<points.length; i++)
        if (points[i].x < hullPt.x)
            hullPt = points[i];
         
    // find remaining hull points
    do
    {
        convexHull.unshift(hullPt);
        var endPt = points[0];
        
        for (var j=1; j<points.length; j++)
        {           
            var side = GetSideOfLine(hullPt, endPt, points[j]);
            
            // in case point lies on line take the one further away.
            // this fixes the collinearity problem.
            if (side == LEFT || (side == ON && (hullPt.distance(points[j]) > hullPt.distance(endPt))))
                endPt = points[j];
        }
       
        hullPt = endPt;
    }
    while (!endPt.equals(convexHull[convexHull.length-1]));

    return convexHull;
}
