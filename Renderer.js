var Renderer = function(width, 
						height, 
						context) {
	this.width = width;
	this.height = height;
	this.context = context;

	
	// properties
	this.centerX = this.width/2;
	this.centerY = this.height/2;
	this.PI = 3.14159265;
};

Renderer.prototype.drawWireFrame = function(decoder,
										    mag,			// [in] magnification
										    rX,
										    rY,
										    rZ) {
	this.mag = mag;
	this.decoder = decoder;
	
	// convert rotation from degrees to radian
	this.radX = this.PI / 180.0 * rX;
	this.radY = this.PI / 180.0 * rY;
	this.radZ = this.PI / 180.0 * rZ;
	
	this.pos = 0;
	var len = decoder.listFace.length;
	for(var i=0; i<len; i++) {
		var face = decoder.listFace[i];
		
		if(!this.drawTriangles(face))
			return false;
	}
	return true;
};
		
Renderer.prototype.drawTriangles = function(face) {
		this.context.beginPath();
		
		
					
		var vtx0 = [0,0,0];
		var vtx1;
		if(face.length<4)			// n v1 v2 ... vn r g b a
			return false;
		
		// draw
		for(var j=0; j<face[0]-1; j++) {  
			// retrieve vertices
			var vIndex = face[j+1];
			if(vIndex>=this.decoder.listVertex.length||vIndex<0)
				return false;
			
			// retrieve vertex
			var vertex = this.decoder.listVertex[vIndex];
			var vtx1 = [vertex[0], vertex[1], vertex[2]];
			
			//vtx1[0] = vtx1[0];
			var y = vtx1[1];
			var z = vtx1[2];
			vtx1[1] = Math.cos(this.radX)*y-Math.sin(this.radX)*z;
			vtx1[2] = Math.sin(this.radX)*y+Math.cos(this.radX)*z
			
			var x = vtx1[0];
			z = vtx1[2];
			vtx1[0] = Math.cos(this.radY)*x+Math.sin(this.radY)*z;
			//vtx1[1] = vtx1[1];
			vtx1[2] = -Math.sin(this.radY)*x+Math.cos(this.radY)*z;
					  
			// draw 2 lengths of a triangle
			if(j==0) {
				this.context.moveTo(vtx1[0]*this.mag+ this.centerX, 
						    vtx1[1]*this.mag+ this.centerY);				// move to 1st triangle corner
				vtx0[0] = vtx1[0];
				vtx0[1] = vtx1[1];
				vtx0[2] = vtx1[2];
			}
			else 
				this.context.lineTo(vtx1[0]*this.mag+ this.centerX, 
						    vtx1[1]*this.mag+ this.centerY);				// render only (x,y)
		}
		// complete triangle
		this.context.lineTo(vtx0[0]*this.mag+ this.centerX, 
				    vtx0[1]*this.mag+ this.centerY);						// compete the loop
		
		// render on canvase
		this.context.stroke();
		this.context.closePath();
		return true;
};
