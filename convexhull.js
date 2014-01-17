function IsLeftOfLine(lineStart, lineEnd, point)
{
    return (((lineEnd.x-lineStart.x)*(point.y-lineStart.y)-(lineEnd.y-lineStart.y)*(point.x-lineStart.x)) > 0);
}

// returns convex hull in CW order
// (required by Rotating Calipers implementation)
// this implementation is not bullet proof.
// it's assumed that no 3 points are co-linear and
// the input point set contains at least 3 points.
function CalcConvexHull(points)
{   
    var hullPt = points[0].clone();
    var convexHull = [];
    
    for (var i=1; i<points.length; i++)
        if (points[i].x < hullPt.x)
            hullPt = points[i];
            
    do
    {
        convexHull.unshift(hullPt);
        var endPt = points[0];
        
        for (var j=1; j<points.length; j++)
            if (hullPt.equals(endPt) || IsLeftOfLine(hullPt, endPt, points[j]))
                endPt = points[j];
       
        hullPt = endPt;
    }
    while (!endPt.equals(convexHull[convexHull.length-1]));

    return convexHull;
}