function Vector(x, y)
{
	this.x = x;
	this.y = y;

	this.min = function(vec)
	{
		x = Math.min(x, vec.x);
		y = Math.min(y, vec.y);
	}

	this.max = function(vec)
	{
		x = Math.max(x, vec.x);
		y = Math.max(y, vec.y);
	}
	
	this.midpoint = function(vec)
	{
		return new Vector((x+vec.x)*0.5, (y+vec.y)*0.5);
	}

	this.clone = function()
	{
		return new Vector(this.x, this.y);
	}

	this.normalize = function()
	{
		var len = this.length();
		this.x /= len;
		this.y /= len;
	}

	this.normalized = function()
	{
		var vec = new Vector(this.x, this.y);
		vec.normalize();
		return vec;
	}

	this.negate = function()
	{
		this.x = -this.x;
		this.y = -this.y;
	}

	this.sqrLength = function()
	{
		return this.x * this.x + this.y * this.y;
	}

	this.length = function()
	{
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	this.scale = function(len)
	{
		this.x *= len;
		this.y *= len;
	}

	this.add = function(vec)
	{
		this.x += vec.x;
		this.y += vec.y;
	}

	this.sub = function(vec)
	{
		this.x -= vec.x;
		this.y -= vec.y;
	}

	this.diff = function(vec)
	{
		return new Vector(this.x-vec.x, this.y-vec.y);
	}

	this.distance = function(vec)
	{
		var x = this.x-vec.x;
		var y = this.y-vec.y;
		return Math.sqrt(x*x+y*y);
	}

	this.dot = function(vec)
	{
		return this.x*vec.x+this.y*vec.y;
	}

	this.equals = function(vec)
	{
		return this.x == vec.x && this.y == vec.y;
	}

	this.orthogonal = function()
	{
		return new Vector(this.y, -this.x);
	}

	this.distanceToLine = function(v0, v1)
	{
		var sqrLen = v1.diff(v0).sqrLength();
		var u = ((this.x-v0.x)*(v1.x-v0.x)+(this.y-v0.y)*(v1.y-v0.y))/sqrLen;
	    var v1c = v1.diff(v0);
	    v1c.scale(u);
	    var pl = v0.clone();
	    pl.add(v1c);
	    return this.distance(pl);
	}
};