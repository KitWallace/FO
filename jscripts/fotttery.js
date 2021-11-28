/*
 * 3d objects to Gcode
  * 
  based on Functional objects
*/

/* 
 * needs to use the modulation_list 
 * and a new selector a la easing 
 * modulations are functions of two variables t the height of the objcet frm 0 to 1, and the disatnce along the path from 0 to 1
 * 
 */
var toClass = function(obj,proto) {
               obj.__proto__ = proto;
               return obj;
}

//functions to support fourier rep

function fourier_filter(params,threshold) {
    var out = [];
    for (var i=0;i < params.length;i++) {
         var p = params[i];
         if (Math.abs(p[0]) >= threshold )
             out.push(p);         }
    return out;
}

function fourier_representation(t,params) {
	var X = 0;
	var Y = 0;
	var n=params.length;
    var s=0.1;
	for (var i = 0; i < n; i++) {  // For each input element
	        p=params[i];
			X += ( p[0] * cos((t*p[1] + p[2]))) ;
			Y += ( p[0] * sin((t*p[1] + p[2]))) ;
		}
	return [round(s*X,4),-round(s*Y,4)];
	}

function make_design_selector() {
   var html="<table>";
  
   design_list.forEach((d) => {
       var click = 'load_sample_design("' + d.name + '")';
       html+="<tr><td><button onclick='"+click+"'>"+d.name+"</button></td><td>"+d.description+"</td></tr>";
       });
   html+= "</table>";
   $('#design_selector').html(html);
}

var myDesign ;
var gcode;

function set_type() {
     var type=$('#type').val();
     if (type=="function"){
         make_function_selector();
         clear_html('type_parameters');
         }
     else if (type=="fourier") {
         path = new Path();
         clear_html('function_selector');
         path.from_fourier();
         make_fourier_parameters(path);
         make_path_parameters(path);
         }
     else if (type=="points") {
         path = new Path();
         path.from_points();
         clear_html('function_selector');
         make_points_parameters(path);
         make_path_parameters(path);
     }         
}

function function_named(fname) {
  var index = function_list.findIndex(function(f,i) {if (f.fname==fname) return true;});
  if (index != -1)
      return function_list[index];
  else false;
}

function make_function_selector(){
   var html="<tr><th>Function"+tooltip("a pre-defined curve defined by a function which computes the points from a mathematical function ")+"</th><td width='75%''>";
   html+="<select id='selected_function' onchange='set_function()' size='4'>";
   var slist = function_list.sort((a, b) => {
    let fa = a.name.toLowerCase(),
        fb = b.name.toLowerCase();

    if (fa < fb) {
        return -1;
    }
    if (fa > fb) {
        return 1;
    }
    return 0;
        });
   slist.forEach((f) => {
       html+="<option value='"+f.fname+"'>" + f.name + "</option>";
       });
   html+= "</select> </td></tr>";
   $('#function_selector').html(html);
}

function set_function() {
    path=new Path();
    path.from_function();
    make_function_parameters(path);
    make_path_parameters(path);
    refresh();
} 

function make_function_parameters(path) {
   var html="";
   html+="<tr><th>Function</th><td>"+path.f.name+"&#160;<button onclick='set_function()'>Reset </button></td></tr>";
   if (path.f.description) html+="<tr><th>Description</th><td><span>"+path.f.description+"</span>";
   if (path.f.link ) html+="<span>&#160;<a class='external' target='_blank' href='"+path.f.link+"'>See more.</a>"; 
   html+="</td></tr>";
   var params = path.f.parameters;
   for (i =0;i < params.length;i++) {
       var p = params[i];
       var tip="";
       if (p.description)
           tip = tooltip(p.description);
       html+="<tr><th width='15%'>" + p.name  + tip +"</th>"; 
       html+="<td width='45%'><div class='pslider' id='slider"+i +"'/></td>";
       html+="<td><input type='text' size='3' id='sliderparam"+i+"' onchange='refresh()' value='"+path.params[i]+"' /></td>";
       html+="</tr>";
   }
   if (path.maxcycles) html+="<tr><th>Maxcycles "+tooltip("Functions are normally evaluated over a 360° circle but multiple of this are needed for closure in some cases.") +"</th><td width='45%'><div class='pslider' id='slidermaxcycles'/></td><td><input type='text' size='3' id='maxcycles' onchange='refresh()' value='"+path.maxcycles+"'/></td></tr>";
 
   $('#type_parameters').html(html); 
   make_function_sliders(path);
}

function make_function_sliders(path) {
    var params = path.f.parameters;
    for (let i=0;i<params.length;i++) {
        var p = params[i];
        $('#slider'+i ).slider({
           min:p.min,
           max:p.max,
           value:path.params[i],
           step:p.step,
           slide: function(event, ui) {
                     $('#sliderparam'+i).val(ui.value);
                     refresh();  
                  }
           });
      } 
    $('#slidermaxcycles' ).slider({
           min:1,
           max:100,
           value:path.maxcycles,
           step:1,
            slide: function(event, ui) {
                     $('#maxcycles').val(ui.value);
                     refresh();  
                  }
           });
}




// fourier defined paths
function make_fourier_parameters(path) {
   var html="";
   html+="<tr><th>Function</th><td width='45%'>Fourier Representation</td></tr>";
   html+="<tr><th>Description</th><td width='45%'>Path construction from a Fourier spectrum output from the <a class='external' target='_blank' href='../3d/DFT.html'>DFT - Discrete Fourier Transform</a> tool from an svg outline.</td></tr>";
   html+="<tr><th>Spectrum"+tooltip("the amplitude,frequency and phase of the components in the Fourier spectrum")+"</th><td width='45%'><textarea id='params' cols='30' rows='6' >"+JSON.stringify(path.params)+"</textarea></td></tr>";
   html+="<tr><th>Threshold"+tooltip("the theshold amplitude, below which components of the spectum will be ignored ")+"</th><td width='45%'><div class='pslider' id='sliderthreshold'/></td><td><input type='text' size='3' id='threshold' onchange='refresh()' value='"+path.threshold+"'/></td></tr>";

   html+="<tr><th/><td width='45%'><button onclick='refresh()'>Refresh</button></td></tr>";
   $('#type_parameters').html(html); 
   $('#sliderthreshold' ).slider({
           min:0,
           max:50,
           value:path.threshold,
           step:1,
           slide: function(event, ui) {
                     $('#threshold').val(ui.value);
                     refresh();  
                  }
           });
}

function make_points_parameters(path) {
   var s= path.points_equalize ? " checked='checked' ": "" ;
   var html="";
   html+="<tr><th>Description</th><td>An array of points in json format as output from, for example the <a class='external' target='_blank' href='../FO/Fractal2.html'>Fractal</a> tool.</td></tr>";
   html+="<tr><th title='Points'>Points</th><td width='45%'><textarea id='data_points' cols='50' rows='6' onchange='refresh()'>"+JSON.stringify(path.data_points)+"</textarea></td></tr>";
   html+="<tr><th>Properties</th><td width='45%'> Number of steps <input type='text' id='steps' size='3' value='"+path.dsteps+"' onchange='refresh()'/>" +
   "Equalize "+tooltip("Equalize the points by dividing the path into N equal length segments. Polar funcations are computed with equal steps in the angle but this does not produce equal length steps along the curve")+"<input type='checkbox' id='points_equalize' onchange='refresh()' "+ s+ "/></td></tr>";
   
   html+="<tr><th/><td width='45%'><button onclick='refresh()'>Refresh</button></td></tr>";

   $('#type_parameters').html(html); 
}

function make_path_parameters(path) {
   var html="";
   var s= path.closed ? " checked='checked' ": "" ;
   var t= path.autoscale ? " checked='checked' ": "" ;
   var v= path.keep_aspect_ratio ? " checked='checked' ": "" ;
   var u= path.autocentre ? " checked='checked' ": "" ;
   var v= path.allcycles ? " checked='checked' ": "" ;
   
   html+="<tr><th>Properties</th><td width='45%'>" +
   "<span class='checkbox'>Closed "+tooltip("Checked if the sequence of points is closed")+"<input type='checkbox' id='closed' onchange='refresh()' "+ s+ "/></span>" + 
   "<span class='checkbox'>Autocentre "+tooltip("Centre the path")+"<input type='checkbox' id='autocentre' onchange='refresh()' "+ u + "/></span>" +
   "<span class='checkbox'>Keep aspect Ratio "+tooltip("Keep aspect ratio when changing width or height")+"<input type='checkbox' id='keep_aspect_ratio' onchange='refresh()' "+ v + "/></span>"+
   "<span class='checkbox'>All cycles "+tooltip("Curve extends to max cycles even if closed earlier")+"<input type='checkbox' id='allcycles' onchange='refresh()' "+ u + "/></span>" +
   "</td></tr>";
   
   html+="<tr><th>Width"+tooltip("size in x direction in mm")+"</th><td width='45%'><div class='cslider' id='slidersizex'/></td><td><input type='text' size='3' id='sizex' onchange='refresh(0)' value='"+path.size[0]+"'/></td></tr>";
   html+="<tr><th>Height"+tooltip("size in the y direction in mm")+"</th><td width='45%'><div class='cslider' id='slidersizey'/></td><td><input type='text' size='3' id='sizey' onchange='refresh(1)' value='"+path.size[1]+"'/></td></tr>";
   html+="<tr><th>Rotate "+tooltip("rotation angle in degees, anticlockwise")+"</th><td width='45%'><div class='cslider' id='sliderrotate'/></td><td><input type='text' size='3' id='rotate' onchange='refresh()' value='"+path.rotate+"'/></td></tr>";
   html+="<tr><th>Move X"+tooltip("translation along the X axis")+"</th><td width='45%'><div class='cslider' id='slidermovex'/></td><td><input type='text' size='3' id='movex' onchange='refresh()' value='"+path.translate[0]+"'/></td></tr>";
   html+="<tr><th>Move Y"+tooltip("translation along the Y axis")+" </th><td width='45%'><div class='cslider' id='slidermovey'/></td><td><input type='text' size='3' id='movey' onchange='refresh()' value='"+path.translate[1]+"'/></td></tr>";
   html+="<tr><th>Align"+tooltip("offset of the start of the sequence of points along the curve. This is useful when layers are created by different functions.")+"</th><td width='45%'><div class='cslider' id='slideralign'/></td><td><input type='text' size='3' id='align' onchange='refresh()' value='"+path.align+"'/></td></tr>";
   html+="<tr><th>From %"+tooltip("the start % of an open path ")+"</th><td width='45%'><div class='cslider' id='sliderfrompc'/></td><td><input type='text' size='3' id='frompc' onchange='refresh()' value='"+path.frompc+"'/></td></tr>";
   html+="<tr><th>To %"+tooltip("the end % of an open path ")+"</th><td width='45%'><div class='cslider' id='slidertopc'/></td><td><input type='text' size='3' id='topc' onchange='refresh()' value='"+path.topc+"'/></td></tr>";
   html+="<tr><th>Step size"+tooltip("the step size in degrees ")+"</th><td width='45%'><div class='cslider' id='sliderstepsize'/></td><td><input type='text' size='3' id='stepsize' onchange='refresh()' value='"+path.stepsize+"'/></td></tr>";                                
   $('#path_parameters').html(html);
   make_path_sliders(path);
}

function make_path_sliders(path) {
         $('#slidersizex' ).slider({
           min:1,
           max:200,
           value:path.size[0],
           step:1,
           slide: function(event, ui) {
                     $('#sizex').val(ui.value);
                     refresh(0);  
                  }
           });
         $('#slidersizey' ).slider({
           min:1,
           max:200,
           value:path.size[1],
           step:1,
           slide: function(event, ui) {
                     $('#sizey').val(ui.value);
                     refresh(1);  
                  }
           });

     $('#slideralign' ).slider({
           min:0,
           max:100,
           value:path.align,
           step:1,
           slide: function(event, ui) {
                     $('#align').val(ui.value);
                     refresh();  
                  }
           });
    $('#sliderfrompc' ).slider({
           min:0,
           max:100,
           value:path.frompc,
           step:1,
           slide: function(event, ui) {
                     $('#frompc').val(ui.value);
                     refresh();  
                  }
           });
     $('#slidertopc' ).slider({
           min:0,
           max:100,
           value:path.topc,
           step:1,
           slide: function(event, ui) {
                     $('#topc').val(ui.value);
                     refresh();  
                  }
           });
      $('#sliderrotate' ).slider({
           min:0,
           max:360,
           value:path.rotate,
           step:1,
           slide: function(event, ui) {
                     $('#rotate').val(ui.value);
                     refresh();  
                  }
           });
           
      $('#slidermovex' ).slider({
           min:-50,
           max:+50,
           value:path.translate[0],
           step:1,
            slide: function(event, ui) {
                     $('#movex').val(ui.value);
                     refresh();  
                  }
           });
       $('#slidermovey' ).slider({
           min:-50,
           max:+50,
           value:path.translate[0],
           step:1,
            slide: function(event, ui) {
                     $('#movey').val(ui.value);
                     refresh();  
                  }
           });
      $('#sliderstepsize' ).slider({
           min:1,
           max:36,
           value:path.stepsize,
           step:1,
            slide: function(event, ui) {
                     $('#stepsize').val(ui.value);
                     refresh();  
                  }
           });
}


//////////////////////////////////////////

function clear_html(id) {
   var html = "<div/>";
   $('#'+id).html(html);  
}

function reset() {
     $('#type').val("function");    
     myDesign = new Design();
     myDesign.to_UI();
 // layers page
     $('#role_0').prop('checked',true);
     make_function_selector(); 
     clear_html('function_parameters');
     clear_html('type_parameters');
     clear_html('path_parameters');
     clear_html('canvas');
     $('#role_0_data').html('<span/>');
     $('#role_1_data').html('<span/>');

  // design page
     clear_html('role_0_summary');
     clear_html('role_1_summary');

     make_easing_selector("layer");
     make_easing_selector("scale");
     make_easing_selector("rotate");
     make_modulation_selector("peri");
     
     clear_html('print_result');
     clear_html('gcode');
     myDesign.to_UI();
 // samples page
     make_design_selector();
}

function refresh(k) {  
   var type = $('#type').val();
   var path = new Path;
   path.from_UI(); 
   path.constraint=k;
   path.to_points();
   $('#points_closed').prop('checked',path.closed );
   var role = $('input[name=role]:checked').val();
   myDesign.set_path(role,path);
   path.report(role);
   make_svg(myDesign);   
}

/*  
function toggle_role() {
    var role = $('input[name=role]:checked').val();
    var role = role==1 ? 0 : 1;
    $('#role_'+role).prop('checked',true);
    var path = myDesign.paths[role];

   if ( ! path) {  // initialise to current UI
      path=new Path();
      path.from_UI();
      myDesign.paths[role] = path;
   } 
   path.to_UI();     
   refresh(); 
}

*/
function swap_roles() {
    var role = $('input[name=role]:checked').val();
    var other_role = role==1 ? 0 : 1;
    myDesign.swap();    
    $('#role_'+other_role).prop('checked',true);
    make_svg(myDesign);  
}

function set_role(i) {
    $('#role_'+i).prop('checked',true);
}

function change_role() {
   var role = $('input[name=role]:checked').val();
   var path = myDesign.paths[role];

   if ( ! path) {  // initialise to current UI
      path=new Path();
      path.from_UI();
      myDesign.paths[role] = path;
   } 
   path.to_UI();     
   refresh();
}

/* 
function copy_role(from,to) {
    myDesign.paths[to] = myDesign.paths[from]; 
    refresh();
}
*/

function clear_role(role) {
   myDesign.paths[role] = undefined;
   clear_html('function_parameters');
   clear_html('type_parameters');
   clear_html('path_parameters');
   $('#role_'+role).prop('checked',true);
   $('#role_'+role+'_data').html("<span/>");
   $('#role_'+role+'_summary').html("<div/>");    

   make_svg(myDesign);  
}



// functions to paths
// move to Path

function function_to_points(fn,params,stepsize,maxcycles,allcycles) {
    var eps=0.001;
    var points = [];
    var start =fn(0,params);
    var cycle=0; 
    var closed=false;
    while(true) {
       for (var t=360*cycle;t <(cycle+1)*360;t+=stepsize) {
           var p = fn(t,params);
           points.push(p);
       }        
       end = fn((cycle+1)*360,params);
       cycle++;
       d= Math.abs(Math.pow(end[0]-start[0],2) + Math.pow(end[1]-start[1],2));
       if (allcycles && cycle < maxcycles) {
        }
       else if (d < eps) {
           closed = true;
           break;  
       }
       else if (cycle >= maxcycles ){
           points.push(end);
           break;
       }
    }
    var f = {points: points, closed: closed};
    return f;
}

// easings

function easing_named(name) {
  var index = easing_list.findIndex(function(f,i) {if (f.fname==name) return true;});
  if (index != -1)
      return easing_list[index];
  else false;
}

function make_easing_selector(mode) {
    var onchange = 'set_easing_function("'+mode+'")';
    var html="<div>";
    html+="<select id='easing_"+mode+"' onchange='"+onchange+"'>";
    easing_list.forEach((f) => {
       html+="<option value='"+f.fname+"'>" + f.name + "</option>";
       });
    html+= "</select><div id='easing_parameters_"+mode+"'/>";
    html+="</div>";
    $('#easing_selector_'+mode).html(html);
}

function set_easing_function(mode) {
    var easing= new Easing(mode);
    easing.to_UI();
}

class Easing {
      mode;
      fname;
      f;
      fn;
      params; 
      constructor(mode,fname) {
          this.mode=mode;
          if (fname)
             this.fname=fname;
          else 
             this.fname = $('#easing_'+mode).val();
          this.f = easing_named(this.fname);
          this.fn=window[this.fname]; 
          this.params=[]; 
          for (var i = 0;i < this.f.parameters.length;i++) {
               this.params.push(this.f.parameters[i].initial)
          }
       }
      deconstruct() {
          this.f=undefined;
          this.fn=undefined;
      }
      reconstruct() {
          this.f = easing_named(this.fname);
          this.fn=window[this.fname];  
      }
      make_easing_parameters() {
        var html="<div>";
        if (this.f.description) html+=tooltip(this.f.description);
        if (this.f.link) html += "&#160; <a href='"+this.f.link+"'> more </a>";
        if (this.f.parameters.length >0) {
            var onchange = 'set_easing("'+this.mode+'")';
            for (var i = 0;i < this.params.length;i++) {
               var p =  this.f.parameters[i];
               var pv = this.params[i];
               var tip = p.description ? tooltip(p.description) : "";
               html+="<span>&#160;"+p.name+tip+"<input type='text' size='3' id='easing_param_"+this.mode+i+"' value='"+pv+"' /></span>";
            }
         }
         html+="</div>";
         $('#easing_parameters_'+this.mode).html(html);
      }
     
      from_UI() {
          this.params=[];
          for (var i=0;i<this.f.parameters.length;i++) {
                this.params.push(parseFloat($('#easing_param_'+this.mode+i).val())); 
          }
      }
      to_UI() {
          $('#easing_'+this.mode).val(this.fname);
          this.make_easing_parameters();
      }
      
      val(t) {
         return this.fn(t,this.params);
      }
}

// modulations
function modulation_named(name) {
  var index = modulation_list.findIndex(function(f,i) {if (f.fname==name) return true;});
  if (index != -1)
      return modulation_list[index];
  else false;
}

function make_modulation_selector(mode) {
    var onchange = 'set_modulation_function("'+mode+'")';
    var html="<div>";
    html+="<select id='modulation_"+mode+"' onchange='"+onchange+"'>";
    modulation_list.forEach((f) => {
       html+="<option value='"+f.fname+"'>" + f.name + "</option>";
       });
    html+= "</select><div id='modulation_parameters_"+mode+"'/>";
    html+="</div>";
    $('#modulation_selector_'+mode).html(html);
    console.log(html);
}

function set_modulation_function(mode) {
    var modulation= new Modulation(mode);
    modulation.to_UI();
    console.log(modulation);
}

class Modulation {
      mode;
      fname;
      f;
      fn;
      params; 
      constructor(mode,fname) {
          this.mode=mode;
          if (fname)
             this.fname=fname;
          else 
             this.fname = $('#modulation_'+mode).val();
          this.f = modulation_named(this.fname);
          this.fn=window[this.fname]; 
          this.params=[]; 
          for (var i = 0;i < this.f.parameters.length;i++) {
               this.params.push(this.f.parameters[i].initial)
          }
       }
      deconstruct() {
          this.f=undefined;
          this.fn=undefined;
      }
      reconstruct() {
          this.f = modulation_named(this.fname);
          this.fn=window[this.fname];  
      }
      make_modulation_parameters() {
        var html="<div>";
        if (this.f.description) html+=tooltip(this.f.description);
        if (this.f.link) html += "&#160; <a href='"+this.f.link+"'> more </a>";
        if (this.f.parameters.length >0) {
            var onchange = 'set_modulation("'+this.mode+'")';
            for (var i = 0;i < this.params.length;i++) {
               var p =  this.f.parameters[i];
               var pv = this.params[i];
               var tip = p.description ? tooltip(p.description) : "";
               html+="<span>&#160;"+p.name+tip+"<input type='text' size='3' id='modulation_param_"+this.mode+i+"' value='"+pv+"' /></span>";
            }
         }
         html+="</div>";
         $('#modulation_parameters_'+this.mode).html(html);
      }
     
      from_UI() {
          this.params=[];
          for (var i=0;i<this.f.parameters.length;i++) {
                this.params.push(parseFloat($('#modulation_param_'+this.mode+i).val())); 
          }
      }
      to_UI() {
          $('#modulation_'+this.mode).val(this.fname);
          this.make_modulation_parameters();
      }
      
      val(t) {
         return this.fn(t,this.params);
      }
}

class Path {
      type;
      maxcycles;
      allcycles;
      fname;
      f;
      fn;
      params;
      threshold;
      data_points;
      centre;
      stepsize;
      dsteps;
      size;
      closed;
      equalize;
      autocentre;
      autoscale;
      keep_aspect_ratio;
      scale;
      align;
      frompc;
      topc;
      constraint;
      rotate;
      translate;

      points; 
      constructor() {
          this.points=[];
          this.dsteps=0;
          this.type="function";
      }
      reconstruct() {
         if (this.type != "points") {
            this.f = function_named(this.fname);
            this.fn=window[this.fname];   
            this.to_points();   
         }
      }
      deconstruct(){
          this.points=[];
          if (this.type != "points") this.data_points=[];
          this.f=undefined;
      }
      
      report (role)  {
         var html = "<span>"+this.steps+" "+ (this.closed ? "Closed" : "Open") + "," + this.width.toFixed(1) +" x " + this.height.toFixed(1) +"</span>"
         $('#role_'+role+'_data').html(html);
         $('#role_'+role+'_summary').html(this.summary);    
      }
      
      from_function() {
          this.type="function";
          this.fname = $('#selected_function').val();
          this.f = function_named(this.fname);
          this.params=[];
          for (var i=0;i<this.f.parameters.length;i++) {
            this.params.push(this.f.parameters[i].initial); 
          }
          this.maxcycles=  this.f.maxcycles ? this.f.maxcycles : 1;
          this.allcycles = false;
          this.closed=true;
          this.size= [50,50];  
          this.keep_aspect_ratio=true;
          this.autocentre=true;
          this.autoscale=true;
          this.equalize=false;
          this.stepsize=1;
          this.rotate=0;
          this.translate=[0,0];
          this.align=0;
          this.frompc=0;
          this.topc=100;
      }
      
      from_fourier() {
          this.type="fourier";
          this.fname = "fourier_representation";
          this.params=[];
          this.threshold=0;
          this.maxcycles=1;
          this.allcycles=false;
          this.closed=true;
          this.size= [50,50];
          this.autocentre=true;
          this.keep_aspect_ratio=true;
          this.autoscale=true;
          this.equalize=false;
          this.stepsize=1;
          this.rotate=0;
          this.translate=[0,0];
          this.align=0;
          this.frompc=0;
          this.topc=100;   
      }
      
      from_points() {
          this.type="points";
          this.data_points=[];
          this.maxcycles=1;
          this.allcycles=false;
          this.closed=true;
          this.size= [50,50];
          this.keep_aspect_ratio=true;
          this.autocentre=true;
          this.autoscale=true;
          this.equalize=false;
          this.stepsize=1;
          this.rotate=0;
          this.translate=[0,0];
          this.align=0;
          this.frompc=0;
          this.topc=100; 
      }
      
      to_UI() {
         $('#type').val(this.type); 
         if (this.type=="function") {
            make_function_selector();
            make_function_parameters(this);
            make_path_parameters(this);   
            $('#selected_function').val(this.fname);
          }
          else if (this.type=="fourier") {
            make_fourier_parameters(this);
            make_path_parameters(this);   
          }
          else if (this.type=="points") {
            make_points_parameters(this);
            make_path_parameters(this);              
          }
      }
      
      from_UI() {
          this.type=$('#type').val(); 
          this.size = [parseFloat($('#sizex').val()),parseFloat($('#sizey').val())];
          this.equalize= $('#points_equalize').is(":checked");
          this.autocentre= $('#autocentre').is(":checked");
          this.closed= $('#closed').is(":checked");
          this.keep_aspect_ratio= $('#keep_aspect_ratio').is(":checked");
          this.allcycles= $('#allcycles').is(":checked");
          this.autoscale= $('#autoscale').is(":checked");
          this.translate = [parseFloat($('#movex').val()),parseFloat($('#movey').val())];
          this.rotate = parseFloat($('#rotate').val());
          this.align= parseFloat($('#align').val());
          this.frompc= parseFloat($('#frompc').val());
          this.topc= parseFloat($('#topc').val());

          if (this.type== "function") {
              this.fname = $('#selected_function').val();
              this.f = function_named(this.fname);
              this.params=[];
              for (var i=0;i<this.f.parameters.length;i++) {
                this.params.push(parseFloat($('#sliderparam'+i).val())); 
              }
              this.fn=window[this.fname];   
              this.stepsize = parseFloat($('#stepsize').val());            
              this.maxcycles = parseFloat($('#maxcycles').val());
            }
          else if (this.type == "fourier") {
             this.fname = "fourier_representation";
             this.params =JSON.parse($('#params').val());
             this.threshold = parseFloat($('#threshold').val());
             this.fn=window['fourier_representation'];   
             this.stepsize = parseFloat($('#stepsize').val());            
             this.maxcycles = 1;
          } 
          else if (this.type=="points") {
             try {
                 this.data_points = JSON.parse($('#data_points').val());
                 }
             catch(err) {
                 alert ("formatting error in list of points");  
                 this.data_points=[];
                 } 
             this.closed= $('#closed').is(":checked");
             this.maxcycles = 1;
             this.dsteps = parseFloat($('#steps').val());
             if ( ! this.dsteps) this.dsteps = this.data_points.length - (this.closed ? 0 : 1);
             $('#steps').val(this.dsteps);
          }
      }
      to_raw_points() {
          
           if (this.type== "function" ){
              var f = function_to_points(this.fn,this.params,this.stepsize,this.maxcycles,this.allcycles); 
              this.data_points = f.points;
              this.closed=f.closed;
              return this.data_points;
          }
          else if (this.type=="fourier")  {
              var params = fourier_filter(this.params,this.threshold);
              var f = function_to_points(this.fn,params,this.stepsize,this.maxcycles,this.allcycles); 
              this.data_points = f.points;
              this.closed=f.closed;
              return this.data_points;
          }
          else if (this.type=="points") {
              if (this.dsteps != this.data_points.length)
                  return path_equalize( this.data_points,this.dsteps,this.closed)
              else return this.data_points;
          }   
      }
      
      to_points() {
       this.points = this.to_raw_points();
       // apply transformations to these data points
       
       // compute scaling
       var scale;
       var box = bounding_box(this.points);  
       var box_size = [box[1]-box[0],box[3]-box[2]];
       var aspect_ratio = box_size[0] / box_size[1];
       if (this.keep_aspect_ratio) {  
            if (this.constraint == 0 ) { // x changed - set y  
               this.size[1]= this.size[0]/ aspect_ratio;
               $('#sizey').val(this.size[1]);
            }
            else if (this.constraint == 1 ) { // y changed - set x  
               this.size[0]= this.size[1]* aspect_ratio;
               $('#sizex').val(this.size[0]);
            }
       }
       this.scale= [this.size[0]/box_size[0],this.size[1]/box_size[1]];

       this.points = path_scale(this.points,this.scale);
          if (this.autocentre) {
               var centre = path_centre(this.points);
               this.points = path_translate(this.points,[-centre[0],-centre[1]]);
              }
              
          if (this.rotate != 0)
              this.points = path_rotate(this.points,this.rotate);
              
          if (this.translate != [0,0]) 
              this.points = path_translate(this.points,this.translate);
         
          if (this.align != 0)
               this.points=path_shift(this.points,Math.floor(this.points.length*this.align/100));
            
          if (this.frompc !=0 || this.topc !=100) {
              var from = Math.max(Math.floor(this.points.length * this.frompc/100),0);
              var to = Math.min(Math.ceil(this.points.length * this.topc/100));
              this.points = path_segment(this.points,from,to);
              this.closed=false;
          }
      }
 
      get steps() {
          return this.points.length;
      }
      
      get length() {
         return  path_length(this.points);
      } 
   
      get bounding_box() {
         return bounding_box(this.points);
      }
      
      get box_size() {
         var box = this.bounding_box;
         return [box[1]-box[0],box[3]-box[2]];
      }
      
      get width() {
          var box = this.bounding_box;
          return box[1]-box[0];
      }
      
      get height() {
          var box = this.bounding_box;
          return box[3]-box[2];
      }
      
      get centre() {
         var box = this.bounding_box;
         return [round((box[0] + (box[1]-box[0]) / 2),2), round((box[2] + (box[3]-box[2]) / 2),2) ];
      }
      get summary() {
          var html="<div> Type: " + this.type + " #steps: " + this.points.length+" closed: " + this.closed+"<br/>";
          
          if (this.type == "function")
               html+= this.fname +" (" + this.params + ")";
          else if (this.type =="fourier")
               html+=" no. of components = " + this.params.length ;
          else if (this.type =="points");
          html+=" width: " + round(this.width,2) + "mm, height: "+round(this.height,2) + "mm<br/>";

          html+="</div>";
          return html;
               
      }
}     

var Roles = [
   {name:"bottom", color: "red", line_style:"fill: none; stroke:red; stroke-width:2;" , dot_style:"fill: red;"}, 
   {name:"top", color: "blue", line_style:"fill: none; stroke:blue; stroke-width:2;" , dot_style:"fill: blue;"} 
];

class Design {
     name;
     description;
     paths;
     height;
     stepsize;
     scale_factor;
     top_as_bottom;
     interpolation_mode; 
     layer_easing;
     scale_easing;
     rotate_easing;
     peri_modulation;
     equalize;
     
     constructor () {
         this.paths= [undefined,undefined];
         this.name= "Mydesign";
         this.description="";
         this.height=20;
         this.stepsize=0;
         this.scale_factor=100;
         this.top_as_bottom = false;
         this.interpolation_mode="parametric";
         this.peri_modulation = new Modulation("peri","modulate_none");
         this.layer_easing = new Easing ("layer","ease_linear");
         this.scale_easing = new Easing ("scale","ease_linear");
         this.rotate_easing = new Easing ("rotate","ease_linear");
         this.equalize=true;
     }
         
     deconstruct() {
         this.paths[0].deconstruct();
         this.paths[1].deconstruct();
         this.layer_easing.deconstruct(); 
         this.scale_easing.deconstruct(); 
         this.rotate_easing.deconstruct();
         this.peri_modulation.deconstruct();
     }
     reconstruct()  { 
         for (var i =0;i<this.paths.length;i++) this.paths[i].reconstruct();
         this.layer_easing.reconstruct(); 
         this.scale_easing.reconstruct(); 
         this.rotate_easing.reconstruct();
         this.peri_modulation.reconstruct();
     }

     set_path(i,path) {
         this.paths[i] = path;       
     }
     
     get closed() { this.paths[0].closed;}
     

     from_UI() {  
        this.name= $('#design_name').val();
        this.description =$('#design_description').val();
        this.height = parseFloat($('#height').val());
        this.top_as_bottom = $('#top_as_bottom').is(":checked");       
        this.stepsize = parseFloat($('#design_stepsize').val());      
        this.scale_factor = parseFloat($('#scale_factor').val());
        this.interpolation_mode = $('#interpolation_mode').val();
        this.layer_easing = new Easing('layer');
        this.layer_easing.from_UI();         
        this.scale_easing = new Easing('scale');  
        this.scale_easing.from_UI();         
        this.rotate_easing = new Easing('rotate');
        this.rotate_easing.from_UI();  
        this.peri_modulation = new Modulation('peri');
        this.peri_modulation.from_UI();
        this.equalize = $('#equalize').is(':checked');
     }
     
     to_UI() {
        $('#design_name').val( this.name);
        $('#design_description').val(this.description);
        $('#height').val(this.height); 
        $('#top_as_bottom').prop('checked',this.top_as_bottom);
        $('#design_stepsize').val(this.stepsize);
        $('#scale_factor').val(this.scale_factor);
        $('#interpolation_mode').val(this.interpolation_mode);
        this.layer_easing.to_UI();
        this.scale_easing.to_UI();
        this.rotate_easing.to_UI();
        this.peri_modulation.to_UI();
        if (this.paths[0]) this.paths[0].to_UI();
        for (var i =0;i<this.paths.length;i++)  if (this.paths[i]) this.paths[i].report(i);
        set_role(0);
     }
     swap() {
         this.paths = [this.paths[1],this.paths[0]];
     }  
  
     layer_interpolate(n_layers,mode,bottom,top) {
        var layers=[];
        var layer;
        var bottom_points;
        var top_points;
        var stepsize = this.stepsize == 0 ?  bottom.stepsize : this.stepsize;
        var closed = this.paths[0].closed;
        if (mode == "points"){
            bottom_points = bottom.to_raw_points();
            bottom_points = path_shift(bottom_points,Math.floor(bottom_points.length*bottom.align/100));
            top_points=top.to_raw_points();
            top_points = path_shift(top_points,Math.floor(top_points.length*top.align/100));

        }
 
        for (var i=0;i < n_layers ; i++) {
          var t= i/(n_layers-1);
          var r = this.layer_easing.val(t);
          if (mode=="parametric") 
               var params = list_interpolate(bottom.params,top.params,r);
          var rs = this.scale_easing.val(t);
          var scale = point_interpolate(bottom.scale,top.scale,rs);
          var ss= this.rotate_easing.val(t);
          var rotate = interpolate(bottom.rotate,top.rotate,ss);
          var translate= point_interpolate(bottom.translate,top.translate,r);
          var frompc = interpolate(bottom.frompc,top.frompc,r);
          var topc = interpolate(bottom.topc,top.topc,r);
           
    // generate the layer
          if (mode == "points"){
             layer = path_interpolate (bottom_points,top_points,r);
          }
          else if (mode == "parametric" ) {
             var f = function_to_points(bottom.fn,params,stepsize,bottom.maxcycles,bottom.allcycles);
             layer = f.points;
          }
          layer = path_scale(layer,scale);
          if (this.equalize) layer = path_equalize(layer,bottom.steps,closed);
          if (rotate != 0)
              layer = path_rotate(layer,rotate);
          if (translate != [0,0]) {
              layer= path_translate(layer,translate);
          } 
          
          if (this.peri_modulation.fname != "modulate_none") {
              layer = path_offset_function(layer,this.peri_modulation.fn,t,this.peri_modulation.params);
          }
          
          if (this.scale_factor != 100)
              layer=path_scale(layer , this.scale_factor/100);
          if (frompc !=0 || topc !=100  && frompc < topc) {
              var from = Math.max(Math.floor(layer.length * frompc/100),0);
              var to = Math.min(Math.ceil(layer.length * topc/100),layer.length);
              layer = path_segment(layer,from,to);
          } 
          layers.push(layer);
       }
       return layers;
     }
     
     make_layers(n_layers) {
         var bottom=this.paths[0];
         var top= this.top_as_bottom ?  bottom : this.paths[1];
         if ( !(top && bottom) ) {
             alert ("both bottom and top paths must be defined");
             return [];
         }
         
         if(this.interpolation_mode=="parametric"  && (top.fname=="" ||  top.fname != bottom.fname || top.type=="fourier" || top.type=="points"))
            this.interpolation_mode = "points";

         if (this.interpolation_mode =="points") {
            if (top.points.length != bottom.points.length) {
               alert("unequal points : bottom=" + bottom.points.length + " top="+ top.points.length);  
               return [];
               }
          }
           
          return this.layer_interpolate(n_layers,this.interpolation_mode,bottom,top);
        }
}

class Print {
      name;
      bed_width;
      bed_height;
      filament_diameter;  //mm
      filament_density ; // g/cm^3
      nozzle_diameter;
      z_offset;
//      extrusion_rate;
      extrusion_multiplier;
      feed_rate;
      continuous;
      layer_height;
      bottom_layer_height;
      wall_width;
      wall_separation;
      align_start = false;
      skirt_n;
      skirt_offset;
      n_inner_walls;
      n_outer_walls;
      centre_wall=true;
      prologue;
      epilogue;
          
    get n_walls() {
        return  this.n_inner_walls + this.n_outer_walls + (this.centre_wall ? 1 : 0); 
    }
    get extrusion_rate () {   
         var road_xsection = (this.wall_width - this.layer_height)* this.layer_height + Math.PI * Math.pow(this.layer_height/2,2);
         var filament_xsection = Math.PI * Math.pow(this.filament_diameter/2,2);
         var rate = this.extrusion_multiplier * road_xsection / filament_xsection;
         return rate ; 
    }
    length(length) {
        return length * this.extrusion_rate;  
    }   
    weight(length) {
        return length * this.extrusion_rate * (this.filament_diameter * this.filament_diameter * Math.PI /4) * this.filament_density / 1000 ;
    }
    get bed_centre() {
        return [ this.bed_width/2, this.bed_height/2];
    }
    from_UI() {
        this.name = $('#print_name').val();
        this.description=$('#print_description').val();
        this.bed_width = parseFloat($('#bed_width').val());
        this.bed_height = parseFloat($('#bed_height').val());
        this.filament_diameter = parseFloat($('#filament_diameter').val());
        this.filament_density =  parseFloat($('#filament_density').val());
        this.nozzle_diameter = parseFloat($('#nozzle_diameter').val());
        this.z_offset = parseFloat($('#z_offset').val());
        this.extrusion_multiplier =parseFloat($('#extrusion_multiplier').val());
        this.feed_rate =  parseFloat($('#feed_rate').val());
        this.continuous = $('#continuous').is(":checked");
        this.layer_height =  parseFloat($('#layer_height').val());
        this.bottom_layer_height =  parseFloat($('#bottom_layer_height').val());
        this.wall_width =  parseFloat($('#wall_width').val());
        this.wall_separation =  parseFloat($('#wall_separation').val());
        this.align_start = ($('#align_start').is(":checked"));
        this.skirt_n = parseFloat($('#skirt_n').val());
        this.skirt_offset = parseFloat($('#skirt_offset').val());
        this.n_inner_walls = parseFloat($('#n_inner_walls').val());
        this.n_outer_walls = parseFloat($('#n_outer_walls').val());
        this.centre_wall = true;
        this.prologue = $('#prologue').val();
        this.epilogue = $('#epilogue').val();      
    } 
    to_UI() {
        $('#print_name').val(this.name);
        $('#print_description').val(this.description);
        $('#bed_width').val(this.bed_width);
        $('#bed_height').val(this.bed_height);
        $('#filament_diameter').val(this.filament_diameter);       
        $('#filament_density').val(this.filament_density);
        $('#nozzle_diameter').val(this.nozzle_diameter);       
        $('#z_offset').val(this.z_offset);
        $('#extrusion_multiplier').val(this.extrusion_multiplier);
        $('#feed_rate').val(this.feed_rate);
        $('#continuous').prop('checked',this.continuous);
        $('#layer_height').val(this.layer_height);
        $('#bottom_layer_height').val(this.bottom_layer_height);
        $('#wall_width').val(this.wall_width);
        $('#wall_separation').val(this.wall_separation);
        $('#align_start').prop('checked',this.align_start);
        $('#skirt_n').val(this.skirt_n);
        $('#skirt_offset').val(this.skirt_offset);
        $('#n_inner_walls').val(this.n_inner_walls);
        $('#n_outer_walls').val(this.n_outer_walls);
        $('#prologue').val(this.prologue);
        $('#epilogue').val(this.epilogue); 
    }
}

class Gcode {
    design;
    print;
    n_layers;
    layers;
    code;
    length;
    constructor(design,print) {
        this.design=design;
        this.print=print;
        this.n_layers = round(this.design.height / this.print.layer_height,0);
        this.layers= this.design.make_layers(this.n_layers);    
    }
    get filament_length() {
        return  this.print.length(this.length);
    }
    
    get filament_weight() {
        return this.print.weight(this.length);
    }
    
    get estimated_minutes() {
        return this.length / this.print.feed_rate  / 60; 
    }

    as_HTML() {
       var html = "<table>";
       html+="<tr><th>Date and Time</th><td>"+formatted_date()+"</td></tr>";
       html+="<tr><th>Interpolation mode </th><td>" + this.design.interpolation_mode + "</td></tr>";
       html+="<tr><th>Extrusion Rate </th><td>" + round(this.print.extrusion_rate,5) + "</td></tr>";
       html+="<tr><th>No of layers </th><td>" + this.n_layers + "</td></tr>";
       html+="<tr><th>Path length</th><td>"+ round(this.length,0) +" mm </td></tr>";
       html+="<tr><th>Filament length</th><td>" + round(this.filament_length,1) + " mm </td></tr>";
       html+="<tr><th>Filament weight</th><td>" + round(this.filament_weight,2) + " gm </td></tr>";
       html+="<tr><th>Estimated Time</th><td>" + round(this.estimated_minutes,2) + " minutes </td></tr>";
       html+="</table>";
       return html;
    }  

    generate_gcode() {
       var layers = this.layers;
       var print = this.print;
       var design = this.design;
       var bottom = layers[0];
       var closed = design.paths[0].closed; 
       var open = ! closed;
       var n_walls = print.n_walls; 
 // align paths to start nearest origin
    var align_index = 0;
    
    if (this.print.align_start && closed) {
        var bpath=path_translate(bottom,print.bed_centre);
        align_index = path_min(bpath);
     }
    var code="";
    var total_length = 0;
    var z_initial=print.z_offset + print.bottom_layer_height;
    if (print.skirt_n > 0) {
       code+="; skirt " + "\n";

       var box = bounding_box(path_translate(bottom,print.bed_centre));
       var box_path = box_to_path(box);
       var skirt = path_offset(box_path,print.skirt_offset);
       var layer_gap = print.wall_separation;
       for (var i=0;i < print.skirt_n;i++) {
          layer = path_offset(skirt,-i*layer_gap);   
          code+=gcode_moveZ(layer[0],z_initial,print.feed_rate*60*1.5);  
          code+=path_to_gcode(layer,print.extrusion_rate,true).gcode;
          total_length += path_length(layer);

       }
     }
     var dir=0;
     var end;
     var layer;
     var wall_layer;
     var g;
     var wall;
 // bottom layer  
     layer = path_shift(bottom,align_index);
     layer = path_translate(layer,print.bed_centre);
     code+= "; bottom layer \n";
     code+=gcode_moveZ(layer[0],z_initial,print.feed_rate*60);
     end=layer[0];
     if (print.n_inner_walls > 0) {           
            for (wall=print.n_inner_walls; wall >0; wall--) {
                wall_layer =path_offset(layer,-wall*print.wall_separation); 
                if ( open && dir==1) {wall_layer=path_reverse(wall_layer); dir=0;} else dir=1;
                code+= "; inner wall "+ wall +" \n";

                code+=gcode_move(wall_layer[0]);
                g = path_to_gcode(wall_layer,print.extrusion_rate,closed);
                code+=g.gcode;
                end = g.end;
                total_length += path_length(wall_layer);
            }
     }

     if (print.n_outer_walls > 0) {           
            for (wall=print.n_outer_walls; wall >0; wall--) {
                wall_layer =path_offset(layer,wall*print.wall_separation); 
                if ( open && dir==1) {wall_layer=path_reverse(wall_layer); dir=0;} else dir=1; 
                code+= "; outer wall "+ wall +" \n"; 
                code+=gcode_move(wall_layer[0]);
                g = path_to_gcode(wall_layer,print.extrusion_rate,closed);
                code+=g.gcode;
                end = g.end;
                total_length += path_length(wall_layer);
            }
     }
// centre wall
     if (print.centre_wall) {    
                wall_layer = layer;
                if ( open && dir==1) {wall_layer=path_reverse(wall_layer); dir=0;} else dir=1;
//                if (end != wall_layer[0]) code+=gcode_extrude(end,wall_layer[0],print.extrusion_rate);
                code+= "; center wall  \n";
                if (n_walls>1)  code+=gcode_move(wall_layer[0]);
                g = path_to_gcodeZ(wall_layer,print.z_offset,print.bottom_layer_height,print.extrusion_rate,closed);
                code+=g.gcode;
                end = g.end;
                total_length += path_length(wall_layer);
     } 
     for (var i = 0; i < this.n_layers; i++) {
        code+= "; layer " + i + ", dir = " + dir +" \n";

        var z = print.z_offset + print.bottom_layer_height + i*print.layer_height;
        layer = layers[i];
        if (i < this.n_layers-1 && print.continuous) 
             layer = path_continuous_interpolate(layer,layers[i+1]);
        layer = path_shift(layer,align_index);
        layer=  path_translate(layer,print.bed_centre);
     
        if (print.n_inner_walls > 0) {
            for (wall=print.n_inner_walls; wall >0; wall--){
                wall_layer =path_offset(layer,-wall*print.wall_separation);
                if ( open && dir==1) {wall_layer=path_reverse(wall_layer); dir=0;} else dir=1;
                code+= "; layer " + i +" inner wall "+ wall +" \n";

                code+=gcode_move(wall_layer[0]);
                g = path_to_gcode(wall_layer,print.extrusion_rate,closed);
                code+=g.gcode;
                end = g.end;
                total_length += path_length(wall_layer);
            }          
        }
        if (print.n_outer_walls > 0) {
            for (wall=print.n_outer_walls; wall >0; wall--){
                wall_layer =path_offset(layer,wall*print.wall_separation);
                 if ( open && dir==1) {wall_layer=path_reverse(wall_layer); dir=0;} else dir=1;
                code+= "; layer " + i +" outer wall "+ wall +" \n";

                code+=gcode_move(wall_layer[0]);
                g = path_to_gcode(wall_layer,print.extrusion_rate,closed);
                code+=g.gcode;
                end = g.end;
                total_length += path_length(wall_layer);
            }          
        }
        if (print.centre_wall) {
       // print centre wall
                wall_layer=layer;
                if ( open && dir==1) {wall_layer=path_reverse(wall_layer); dir=0;} else dir=1;
                code+= "; layer " + i +" centre wall \n";               
                if (print.n_walls>1)  code+=gcode_move(wall_layer[0]);
                g = path_to_gcodeZ(wall_layer,z,print.layer_height,print.extrusion_rate,closed);
                code+=g.gcode;
                end = g.end;
                total_length += path_length(wall_layer);
        }
       }
    this.length = total_length;
    this.code =code;
    }
  }
   
function make_svg(design) {
   var bed_width = parseFloat($('#bed_width').val());
   var bed_height = parseFloat($('#bed_height').val());

   var screen_scale=4; 
   var w=screen_scale * bed_width/2;
   var h =screen_scale * bed_height/2;
   var box = [[-w,-h], [w,h]];
   var box_path= [[-w,-h],[w,-h],[w,h],[-w,h]];

//   box = bounding_box(points);
   var line_width=3;
   var line_colour="black"; 
   var padding=20;
   var canvas=$('#canvas');
   var width = 2*w + 2 * padding;
   var height= 2*w + 2 * padding;
   $('#svgimage').attr("width",width);
   $('#svgimage').attr("height",height);
   canvas.empty();
   var transform = "translate(" + ( w +padding) +","+ (w + padding)  +") scale(1,-1)";
//  alert(transform);
   canvas.attr("transform", transform);
   canvas.append("<title>"+this.name+"</title>");

   canvas.append(svg_path(svg_points(box_path,true),"fill: none; stroke:black; stroke-width:3;"));  
   var current_role = $('input[name=role]:checked').val();
   for (var i =0;i < design.paths.length; i++) {
       var path=design.paths[i];
       if (path) {
             var role = Roles[i];
             var line_width= (i==current_role) ? 3 : 2;
             var line_style = "fill: none; stroke:"+ role.color + "; stroke-linejoin: round; stroke-width:" + line_width ;
             var dot_style = "fill:"+ role.color+";";   
             var points = path_scale(path.points,screen_scale); 
             if (points.length > 0){
                canvas.append(svg_path(svg_points(points,path.closed),line_style));
                canvas.append(svg_dot(points[0],line_width + 1,dot_style));
             }
          }
      }

   $("#svgframe").html($('#svgframe').html());  
}

function make_gcode() {
    design = myDesign;
    design.from_UI();
    var print = new Print();
    print.from_UI();
    gcode = new Gcode(design,print);
    console.log(gcode);
    gcode.generate_gcode();
    $('#print_result').html(gcode.as_HTML());
    $('#gcode').text(gcode.code);
}

function download_gcode() {
    var text = gcode.print.prologue + $('#gcode').text() +gcode.print.epilogue;
    var file = new Blob([text], {type: text/text});
    var filename= myDesign.name+'.gcode';
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}
function download_print() {
    var print = new Print();
    print.from_UI();
    var text = JSON.stringify(print);
    var file = new Blob([text], {type: text/text});
    var filename='print-'+print.name.replace(" ","-")+".json";
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function load_print() {
     var files = document.querySelector("#print_file").files;
     if (files.length != 1) 
        alert ("must be one file");
     else {
        var file = files[0] ;
        var reader =new FileReader();

       reader.addEventListener('load',function(e) {
            var text = e.target.result;
            json = JSON.parse(text);
             var toClass = function(obj,proto) {
               obj.__proto__ = proto;
               return obj;
            }
            var print = toClass(json,Print.prototype);
            print.to_UI();
        });
        reader.addEventListener('error', function() {
	            alert('Error : Failed to read file');
	    });
        reader.readAsText(file);
     }
}

function set_print_profile(profile_name) {
    var toClass = function(obj,proto) {
               obj.__proto__ = proto;
               return obj;
   }  
   var profile = print_profile_map.get(profile_name);
   var print = toClass(profile,Print.prototype);
   print.to_UI();     
}

function download_design() {
    myDesign.from_UI();
    // should make a clone or deep copy  so the master is not touched
    myDesign.deconstruct();
    var text = JSON.stringify(myDesign);
    var file = new Blob([text], {type: text/text});
    var filename='design-'+myDesign.name.replace(" ","-")+".json";
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
    myDesign.reconstruct();  // because derived data has been removed 
}


function load_design() {
     var files = document.querySelector("#design_file").files;
     if (files.length != 1) 
        alert ("must be one file");
     else {
        var file = files[0] ;
        var reader =new FileReader();

       reader.addEventListener('load',function(e) {
            var text = e.target.result;
            json = JSON.parse(text);
             var toClass = function(obj,proto) {
               obj.__proto__ = proto;
               return obj;
            }
            var design = toClass(json,Design.prototype);
            for (var i =0;i<design.paths.length;i++) {
               p = design.paths[i];
               p = toClass(p,Path.prototype);
               }
           
            toClass(design.layer_easing,Easing.prototype);
            toClass(design.scale_easing,Easing.prototype);
            toClass(design.rotate_easing,Easing.prototype);
            toClass(design.peri_modulation,Modulation.prototype);

            design.reconstruct();
            myDesign = design; 
            myDesign.to_UI();
            refresh();
        });
        reader.addEventListener('error', function() {
	            alert('Error : Failed to read file');
	    });
        reader.readAsText(file);
     }
}
function design_named(fname) {
  var index = design_list.findIndex(function(f,i) {if (f.name==fname) return true;});
  if (index != -1)
      return design_list[index];
  else false;
}

function load_sample_design(name) {
    var design_json = design_named(name);
    var design = toClass(design_json,Design.prototype);
    for (var i =0;i<design.paths.length;i++) {
               p = design.paths[i];
               p = toClass(p,Path.prototype);
    }
           
    toClass(design.layer_easing,Easing.prototype);
    toClass(design.scale_easing,Easing.prototype);
    toClass(design.rotate_easing,Easing.prototype);
    if (design.peri_modulation)
        toClass(design.peri_modulation,Modulation.prototype);
    else 
        design.peri_modulation = new Modulation("peri","modulate_none");
    design.reconstruct();
    myDesign = design; 
    myDesign.to_UI();
    refresh();   
    tab(0);
}

$(document).ready(function(){
     init_tabs();
 //    alert(ntabs);
     reset();
     set_print_profile("PLA");
})
