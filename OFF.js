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
      xhr.responseType = "text";
      xhr.onload = __bind(function() {
	      var data = (xhr.responseText);
	      return callback(new OFF(data));
      }, this);
      return xhr.send(null);
    };
		
    function OFF(data) {		
      this.data = data.split('\n');
      this.numVertex = 0;
      this.numFace = 0;
      this.numEdge = 0;
      
      this.listVertex = null;
      this.listFace = null;
      
      this.VERTEX_COUNT_INDEX = 0;
      this.FACE_COUNT_INDEX = 1;
      this.EDGE_COUNT_INDEX = 2;
    }
    
    OFF.prototype.decode = function() {
      this.numVertex = 0;
      this.numFace = 0;
      this.numEdge = 0;
      
      this.pos = 0;
      if(this.parseHeader()) {
	if(this.parseCount()) {
	  if(this.parseVertices()) {
	    if(this.parseFaces()) {
	      return this.listFace.length;
	    }
	  }
	}
      }
      return 0;
    };
    
    OFF.prototype.skipComment = function() {
      while(this.isComment(this.data[this.pos]))
	    this.pos++; 
    }
    
    OFF.prototype.isComment = function(oneLine) {
      if(oneLine.indexOf('#')>=0)
	return true;
      return false;
    };
	     
    OFF.prototype.parseHeader = function() {
      this.skipComment();
	    
      if(this.data[this.pos++].indexOf("OFF")>=0)
	return true;     
      return false;				
    };
    
    OFF.prototype.parseFaces = function() {
      this.skipComment(this.pos);
      
      this.listFace = new Array();
      for(var i=0; i<this.numFace; i++) {
	this.data[this.pos]=this.data[this.pos].replace('\r', "");
	var list = this.data[this.pos++].split(" ");
	var face = [];
	for(var j=0; j<list.length; j++) 
	  face.push(parseInt(list[j]))

	this.listFace.push(face);
      }
      return true;
    };
	   
    OFF.prototype.parseVertices = function() {
      this.skipComment(this.pos);
       
      this.listVertex = new Array();
      for(var i=0; i<this.numVertex; i++) {
	this.data[this.pos]=this.data[this.pos].replace('\r', "");
	var list = this.data[this.pos++].split(" ");
	var vertices = [];
	for(var j=0; j<list.length; j++)
	  vertices.push(parseFloat(list[j]));
	  
	this.listVertex.push(vertices);
      }
      return true;
    };
		
    OFF.prototype.parseCount = function() {
      this.skipComment();
      this.data[this.pos]=this.data[this.pos].replace('\r', "");                  
      var list = this.data[this.pos++].split(" ");
      
      if(list.length == 3) {
	this.numVertex = list[this.VERTEX_COUNT_INDEX];
	this.numFace = list[this.FACE_COUNT_INDEX];
	this.numEdge = list[this.EDGE_COUNT_INDEX];
	return true;
      }
      return false;
    };  
    return OFF;
  })();
	
  window.OFF = OFF;
}).call(this);
// JavaScript Document