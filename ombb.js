function IntersectLines(start0, dir0, start1, dir1)
{
    var dd = dir0.x*dir1.y-dir0.y*dir1.x;
    // dd=0 => lines are parallel. we don't care as our lines are never parallel.
    var dx = start1.x-start0.x; 
    var dy = start1.y-start0.y;
    var t = (dx*dir1.y-dy*dir1.x)/dd; 
    return new Vector(start0.x+t*dir0.x, start0.y+t*dir0.y); 
}

// computes the minimum area enclosing rectangle
// (aka oriented minimum bounding box)
function CalcOmbb(convexHull)
{   
    this.UpdateOmbb = function(leftStart, leftDir, rightStart, rightDir, topStart, topDir, bottomStart, bottomDir)
    {  
        var obbUpperLeft = IntersectLines(leftStart, leftDir, topStart, topDir);
        var obbUpperRight = IntersectLines(rightStart, rightDir, topStart, topDir);
        var obbBottomLeft = IntersectLines(bottomStart, bottomDir, leftStart, leftDir);
        var obbBottomRight = IntersectLines(bottomStart, bottomDir, rightStart, rightDir);
        var distLeftRight = obbUpperLeft.distance(obbUpperRight);        
        var distTopBottom = obbUpperLeft.distance(obbBottomLeft);
        var obbArea = distLeftRight*distTopBottom;
        
        if (obbArea < this.BestObbArea)
        {
            BestObb = [obbUpperLeft, obbBottomLeft, obbBottomRight, obbUpperRight];
            this.BestObbArea = obbArea;
        }
        
        // draw rectangle candidates
        DrawLine(obbUpperLeft.x, obbUpperLeft.y, obbBottomLeft.x, obbBottomLeft.y, "#336699");
        DrawLine(obbBottomRight.x, obbBottomRight.y, obbUpperRight.x, obbUpperRight.y, "#336699");
        DrawLine(obbUpperRight.x, obbUpperRight.y, obbUpperLeft.x, obbUpperLeft.y, "#336699");
        DrawLine(obbBottomLeft.x, obbBottomLeft.y, obbBottomRight.x, obbBottomRight.y, "#336699");
    }
    
    // initialize attributes
    this.BestObbArea = Number.MAX_VALUE;
    this.BestObb = [];
    
    // compute directions of convex hull edges
    var edgeDirs = [];
    
    for (var i=0; i<convexHull.length; i++)
    {
        edgeDirs.push(convexHull[(i+1)%convexHull.length].diff(convexHull[i]));
        edgeDirs[i].normalize();
    }
    
    // compute extreme points
    var minPt = new Vector(Number.MAX_VALUE, Number.MAX_VALUE);
    var maxPt = new Vector(Number.MIN_VALUE, Number.MIN_VALUE);
    var leftIdx, rightIdx, topIdx, bottomIdx;
   
    for (var i=0; i<convexHull.length; i++)
    {
        var pt = convexHull[i];
        
        if (pt.x < minPt.x)
        {
            minPt.x = pt.x;
            leftIdx = i;
        }
        
        if (pt.x > maxPt.x)
        {
            maxPt.x = pt.x;
            rightIdx = i;
        }
        
        if (pt.y < minPt.y)
        {
            minPt.y = pt.y;
            bottomIdx = i;
        }

        if (pt.y > maxPt.y)
        {
            maxPt.y = pt.y;
            topIdx = i;
        }
    }          
       
    // initial caliper lines + directions
    //
    //        top
    //      <-------
    //      |      A
    //      |      | right
    // left |      |
    //      V      |
    //      ------->
    //       bottom
    var leftDir = new Vector(0.0, -1);
    var rightDir = new Vector(0, 1);
    var topDir = new Vector(-1, 0);
    var bottomDir = new Vector(1, 0);
   
    // execute rotating caliper algorithm
    for (var i=0; i<convexHull.length; i++)
    {
        // of course the acos() can be optimized.
        // but it's a JS prototype anyways, so who cares.
        var phis = // 0=left, 1=right, 2=top, 3=bottom
        [
            Math.acos(leftDir.dot(edgeDirs[leftIdx])),
            Math.acos(rightDir.dot(edgeDirs[rightIdx])),
            Math.acos(topDir.dot(edgeDirs[topIdx])),
            Math.acos(bottomDir.dot(edgeDirs[bottomIdx])),
        ];
        
        var lineWithSmallestAngle = phis.indexOf(Math.min.apply(Math, phis));
        switch (lineWithSmallestAngle)
        {
        case 0: // left
            leftDir = edgeDirs[leftIdx].clone();
            rightDir = leftDir.clone();
            rightDir.negate();
            topDir = leftDir.orthogonal();
            bottomDir = topDir.clone();
            bottomDir.negate();
            leftIdx = (leftIdx+1)%convexHull.length;
            break;
        case 1: // right
            rightDir = edgeDirs[rightIdx].clone();
            leftDir = rightDir.clone();
            leftDir.negate();
            topDir = leftDir.orthogonal();
            bottomDir = topDir.clone();
            bottomDir.negate();
            rightIdx = (rightIdx+1)%convexHull.length;
            break;
        case 2: // top
            topDir = edgeDirs[topIdx].clone();
            bottomDir = topDir.clone();
            bottomDir.negate();
            leftDir = bottomDir.orthogonal();
            rightDir = leftDir.clone();
            rightDir.negate();
            topIdx = (topIdx+1)%convexHull.length;
            break;
        case 3: // bottom
            bottomDir = edgeDirs[bottomIdx].clone();
            topDir = bottomDir.clone();
            topDir.negate();
            leftDir = bottomDir.orthogonal();
            rightDir = leftDir.clone();
            rightDir.negate();
            bottomIdx = (bottomIdx+1)%convexHull.length;
            break;
        }                   
        
        this.UpdateOmbb(convexHull[leftIdx], leftDir, convexHull[rightIdx], rightDir, convexHull[topIdx], topDir, convexHull[bottomIdx], bottomDir);
    }

    return BestObb;
}
