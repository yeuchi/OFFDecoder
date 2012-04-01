(function() {
 //   http://www.holmes3d.net/graphics/offfiles/
 //   http://people.sc.fsu.edu/~jburkardt/data/off/off.html
  
  var OFF;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  
  OFF = (function() {
    OFF.load = function(url, callback) {
      var xhr;
      xhr = new XMLHttpRequest;
      xhr.open("GET", url, true);
      xhr.responseType = "arraybuffer";
      xhr.onload = __bind(function() {
	      var data = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);
	      return callback(new OFF(data));
      }, this);
      return xhr.send(null);
    };
		
    function OFF(data) {		
      this.data = data;
      this.numVertex = 0;
      this.numFace = 0;
      this.numEdge = 0;
      
      this.listVertex = null;
      this.listFace = null;
      this.listEdge = null;
      
      this.VERTEX_COUNT_INDEX = 0;
      this.FACE_COUNT_INDEX = 1;
      this.EDGE_COUNT_INDEX = 2;
    }
    
    OFF.prototype.bin2String = function(sttPos, endPos) {
      var buf="";
      for(var i=sttPos; i<endPos; i++) {
	var c = this.data[i].toString();
	buf += String.fromCharCode(c);
      }
      return buf.replace('\r', '');
    };
    
    // return upon first non number, non dot, not space
    OFF.prototype.findEndPos = function(stt) {
      var i = stt;
      while(i<(this.data.length-1)) {
	// seek linefeed
	if(this.data[i]==10)
	  return i;
	i++;
      }			
      return this.data.length-1;
    };
	   
    OFF.prototype.skipComment = function(stt) {
       
      while (null!=stt&&stt<this.data.length-1) {
	var c = String.fromCharCode(this.data[stt]);
	if(c != '#')
	  return stt;
	else
	  stt = this.findEndPos(stt)+1;
      }
      return this.data.length;
    };
      
      // public
      // 
    // return true/false for finding/loading vertex
    OFF.prototype.readVertex = function(index) {
      var sttPos = this.listVertex[index];
      var endPos = this.findEndPos(sttPos);		// return EOF pos if not found
      var vString = this.bin2String(sttPos, endPos);
      var list = vString.split(" ");
      
      if(list.length<3)                   	      	// x y z r g b a 
	return null;					// invalid vertex
	      
      var vertex = new Array();
      for(var i=0; i<list.length; i++) 
	vertex.push(Number(list[i]));
	      
      return vertex;
    };
    
    OFF.prototype.readFace = function(index) {
      var sttPos = this.listFace[index];
      var endPos = this.findEndPos(sttPos);
      var vString = this.bin2String(sttPos, endPos);
      var list = vString.split(" ");
      
      if(list.length<4)                   // n v1 v2 ... vn r g b a
	return null;			  // numVertex, vertex1, vertex2, ...
	      
      var face = new Array();
      for(var i=0; i<list.length; i++) {
	if(list[i])
	  face.push(parseInt(list[i]));
      }
	      
      return face;
    };

    OFF.prototype.parseEdgePos = function() {
      if(this.numEdge) {
	this.skipComment(this.pos);
	   
	this.listEdge = new Array();
	for(var i=0; i<this.numEdge; i++) {
	  var endPos = this.findEndPos(this.pos);
	  this.listEdge.push(this.pos);
	  this.pos = ++endPos;
	}
      }
      return true;
    };
	     
    OFF.prototype.parseFacesPos = function() {
      this.skipComment(this.pos);
      
      this.listFace = new Array();
      for(var i=0; i<this.numFace; i++) {
	var endPos = this.findEndPos(this.pos);
	this.listFace.push(this.pos);
	this.pos = ++endPos;
      }
      return true;
    };
	   
    OFF.prototype.parseVerticesPos = function() {
      this.skipComment(this.pos);
       
      this.listVertex = new Array();
	for(var i=0; i<this.numVertex; i++) {
	  var endPos = this.findEndPos(this.pos);
	  this.listVertex.push(this.pos);
	  this.pos = ++endPos;
	}
	return true;
      };
		
    OFF.prototype.parseCount = function() {
      this.skipComment(this.pos);
                        
      var endPos = this.findEndPos(this.pos);
      var str = this.bin2String(this.pos, endPos);
      this.pos = ++endPos;
      var list = str.split(" ");
      
      if(list.length == 3) {
	this.numVertex = list[this.VERTEX_COUNT_INDEX];
	this.numFace = list[this.FACE_COUNT_INDEX];
	this.numEdge = list[this.EDGE_COUNT_INDEX];
	return true;
      }
      return false;
    };
                
    OFF.prototype.parseHeader = function() {
      this.skipComment(this.pos);
		      
      var endPos = this.findEndPos(this.pos);
      var str = this.bin2String(0, endPos);
      this.pos = endPos+1;
      
      if (str.length>=3&&str[0]=='O'&&str[1]=='F'&&str[2]=='F')
	return true;
	      
      return false;				
    };
	      
    OFF.prototype.decode = function() {
      this.numVertex = 0;
      this.numFace = 0;
      this.numEdge = 0;
      
      this.pos = 0;
      if(this.parseHeader()) {
	if(this.parseCount()) {
	  if(this.parseVerticesPos()) {
	    if(this.parseFacesPos()) {
	      if(this.parseEdgePos()) {
		return this.listFace.length;
	      }	
	    }
	  }
	}
      }
      return 0;
    };
    
    return OFF;
  })();
	
  window.OFF = OFF;
}).call(this);
// JavaScript Document