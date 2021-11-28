
// basic function for use in function scripts

// dates

function formatted_date(){
    var d = new Date();
    var datestring =  d.getDate() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
         d.getFullYear() + " " + d.getHours() + ":" + ("0" + d.getMinutes()).slice(-2);
    return datestring;
}

// math
var RAD = Math.PI/180.0;

function sgn(t) {
   return (t>0) ? 1 : (t<0) ? -1 : 0;
}

function d2r(d){ return d*RAD }
function r2d(r){ return r/RAD}

function sin(t) {
   return Math.sin(t*RAD);   
}

function cos(t) {
   return Math.cos(t*RAD);   
}

function positive(x) {
   return x > 0;
}

function rdiv(a,b) {
   return Math.floor( a / b);
}

function rmod(a,b) {
   return a - rdiv(a,b) * b;
}

function between(x,a,b) {
   return x>=a && x <=b;
}

function interpolate(a,b,t) { 
   return (1-t)*a + t*b;
}

function list_interpolate(lista,listb,t) {
    return lista.map(function(x,i) {return interpolate(x,listb[i],t);});  
}

function triangle(a,b,c) {
   return (a >=0 && b>=0  && c >= 0 && b+c >= a &&  a+c >= b && a+b >= c );
}

function round(number,precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
};


// 2-d point operations

function point_add(a,b) {
    return [b[0] + a[0],b[1] + a[1]];
}

function point_diff(a,b) {
    return [a[0] - b[0],a[1] - b[1]];
}

function point_mult(p,s) {
     return [p[0]*s,p[1]*s];
}

function point_interpolate(a,b,t) {
   return [interpolate(a[0],b[0],t), interpolate(a[1],b[1],t)];
}

function point_rotate(p,a) {
   return [p[0]*cos(a) - p[1]*sin(a), p[0]*sin(a) + p[1]*cos(a)];
}

function norm(p) {
    return Math.sqrt( p[0]*p[0] + p[1]*p[1]);
}

function unitv (a) {
    return point_mult(a, 1/norm(a));
}

function dot(u,v) {
    return u[0]*v[0]+u[1]*v[1];  
}

function cross(u,v) {
    return u[0]*v[1] - u[1]*v[0];
    
}

function angle_between(u, v) {
    var x= cross(u,v);
    var angle = Math.atan2( Math.abs(x),dot(u,v));
    if (x < 0)
      return 2 * Math.PI - angle;
    else 
      return angle;
}
/*  

// easing
  
function ease_linear(t) {return t;}

function ease_inout_dwell(t,d=0.2) {
    if (t<d )
       return 0;
    else if (t > (1-d))
       return 1;
    else return (t-d)/(1-2*d);
}

function ease_inout_sine(t,f=1) {
   var tt = -(cos(f*t*180) - 1) / 2  ;
   return tt;
}

function ease_fsine(t) {
   var tt= t < 0.5 ?  -(cos(t*360) - 1) / 2 : 1 + (cos((t-0.5)*360) - 1) / 2 ;
   return tt;
}

function ease_inout_quad(t) {
   if( t < 0.5 )
     return 2 * t * t; 
    else  
     return  1 - Math.pow(-2 * t + 2, 2) / 2; 
}   

function ease_rsine(t,f=3)  {
    return sin(f*t*180);
  
}

*/
// 2-d path operations

function path_translate(path, p) {
   return path.map(function(v,i) {return point_add(v,p);});
}

function path_scale(path, s) {
   if (Array.isArray(s))
        return path.map(function(v,i) {return [s[0]*v[0],s[1]*v[1]];});
   else
        return path.map(function(v,i) {return [s*v[0],s*v[1]];});
}   

function path_centre (path) {
   var box = bounding_box(path);
   return [(box[1]+box[0])/2,(box[3]+box[2])/2];
}

function path_centroid(path) {
    var sx =0; var sy=0;
    for (var i=0;i<path.length;i++) {
        sx+=path[i][0];
        sy+=path[i][1];
    }
    return [sx / path.length, sy / path.length];
}

function path_to_centre(path) {
    var c = path_centre(path);
    c= point_mult(c , -1);
    return path_translate(path,c); 
}
function path_to_centroid(path) {
    var c = path_centroid(path);
    c= point_mult(c , -1);
    return path_translate(path,c); 
}

function path_round(path,n) {
   return path.map(function(v,i) {return [round(v[0],n),round(v[1],n)];}); 
}

function path_toFixed(path,n) {
   return path.map(function(v,i) {return [Number(v[0].toFixed(n)),Number(v[1].toFixed(n))];}); 
}

function path_shift(path,n) {
   return path.map(function(v,i) {return path[(i + n )% path.length];});  
}

function path_segment(path,from,to) {
    var npath = [];
    for (var i=from;i<to;i++) {
      npath.push(path[i])
    }
    return npath;
}

function path_reverse(path) {
   return path.map(function(v,i) {return path[path.length - 1 - i];});  
}

function path_rotate(path,a) {
   return path.map(function(v,i) {return point_rotate(v,a);});  
}


function path_at (path,t) {
// t= [0,1]
    var i = Math.floor(i*path.length);
    return point_interpolate(path[i],path[i+1], t - i/path.length);
}

function path_interpolate(patha,pathb,t) {
   return patha.map(function(v,i) {
       return point_interpolate(patha[i],pathb[i],t);});
}
  
function path_continuous_interpolate(patha,pathb) {
   var k= 1.0/patha.length;
   return patha.map(function(v,i) {
       return point_interpolate(patha[i],pathb[i],i*k);});
}  

function path_length(path) {
   var length = 0;
   for (i = 1;i < path.length; i++) 
       length += norm(point_diff(path[i],path[i-1]));
   length += norm(point_diff(path[path.length - 1],path[0]));
   return length;
}

function path_diff(patha,pathb) {
   if (patha.length == pathb.length)
     return patha.map(function(v,i) {return point_diff(v,pathb[i]);});   
   else return false;
}

function path_offset(path,d) {
// needs a bit of tidying  and optimisation -  mixture of rads and degrees
   var ipath= [];
   for (var i= 0 ; i < path.length;i++) {
       var iprev = (i - 1 + path.length) % path.length;
       var inext = (i + 1 ) % path.length;
       var vp= unitv(point_diff(path[i],path[iprev]));
       var vn= unitv(point_diff(path[inext],path[i]));
       var a=  Math.PI - angle_between(vn,vp);
       var vd = unitv(point_add(vp,vn));
       var vm = [-vd[1],vd[0]];
       if (a > 0)
           vm = point_mult(vm,-1);
       var offset = d / Math.sin(a/2);
       var offset_v = point_mult(vm,offset);
       var offset_p = point_add(path[i],offset_v);
 //      console.log(i,path[i],vp,vn,r2d(a/2),vm,offset,offset_v,offset_p);
       ipath.push(offset_p);     
   }
   return ipath; 
}

function path_offset_function(path,fn,y,p) {
// needs a bit of tidying  and optimisation -  mixture of rads and degrees
   var ipath= [];
   for (var i= 0 ; i < path.length;i++) {
       var iprev = (i - 1 + path.length) % path.length;
       var inext = (i + 1 ) % path.length;
       var vp= unitv(point_diff(path[i],path[iprev]));
       var vn= unitv(point_diff(path[inext],path[i]));
       var a=  Math.PI - angle_between(vn,vp);
       var vd = unitv(point_add(vp,vn));
       var vm = [-vd[1],vd[0]];
       if (a > 0)
           vm = point_mult(vm,-1);
       var x = i/(path.length-1);
       var d = fn(x,y,p);
       var offset = d / Math.sin(a/2);
       var offset_v = point_mult(vm,offset);
       var offset_p = point_add(path[i],offset_v);
       ipath.push(offset_p);     
   }
   return ipath; 
}
function path_min(path) {
    var min = 1000;
    var i_min =0;
    for (var i = 0; i<path.length; i++) {
        var d = norm(path[i]);
        if (d < min) {
            min = d;
            i_min=i;
        }
    }
    return i_min;    
}
// path smoothing 


// closed paths
function weighted_interpolation(path,n,i,weight) {
      var p1 =  point_mult(path[(i - 1 + n) %n] , weight[0] );
      var p2 =  point_mult(path[i],weight[1]);
      var p3 =  point_mult(path[(i + 1 + n) %n],weight[2]);
      var p4 =  point_mult(path[(i + 2 + n) %n],weight[3]);
      var new_point = point_add(p1,point_add(p2,point_add(p3,p4)));
 //     console.log(new_point);
      return new_point;
}

function path_smooth_r(path,weights) {
     var spath = [];
     for (var i = 0;i < path.length; i++) {
 //        spath.push(path[i]);
         spath.push(weighted_interpolation(path, path.length, i,weights));
     }
     return spath;
}

function path_smooth(path,n) {
    var weights = [-1/16, 9/16, 9/16, -1/16];
    if (n == 0)
        return path
    else  {
        spath=path_smooth_r(path,weights);
//        console.log(spath);
        return path_smooth(spath,n-1);
    }
}

// path equalisation - construct path as a sequence of equal length segments  - 

function path_cumulative_lengths(path,closed) {
   var length=0;
   var qlengths=[0];
   var last = closed ? 0 : 1;
   for (i = 1;i <= path.length - last ; i++) {
       length += norm(point_diff(path[i % path.length],path[i-1]));
       qlengths.push(length);
   }
   return qlengths;
}

function path_equalize(path,n,closed) {
    var qlengths = path_cumulative_lengths(path,closed);
    var length = qlengths[qlengths.length -1];
    var delta = length/n;
    var epath = [];
    for (var i = 0;i < n ; i++) {
        d = i * delta;
        p= path_position(path,qlengths,d);
        epath.push(p);
    }
    if (! closed) epath.push(path[path.length-1]);  
    return epath;
}

function path_position(path,qlengths ,d) {
  var i=0;
  while(d >= qlengths[i]) i++;
  var step_length = qlengths[i] - qlengths[i-1];
  var excess = d - qlengths[i-1];
  var p = point_interpolate( path[i-1] , path[i % path.length], excess / step_length); 
//  console.log(i,d,step_length,excess,excess/step_length,path[i-1],path[i],p);        
  return p;
}

function bounding_box(points) {
   xs = points.map(function(v,i) {return v[0];});
   ys = points.map(function(v,i) {return v[1];});
   minx = Math.min.apply(Math,xs);
   maxx = Math.max.apply(Math,xs);
   miny = Math.min.apply(Math,ys);
   maxy = Math.max.apply(Math,ys);
   return [minx,maxx,miny,maxy];
}

function box_to_path(box) {
//  [minx,maxx,miny,maxy];
    return [
      [box[0],box[2]],
      [box[1],box[2]],
      [box[1],box[3]],
      [box[0],box[3]]
    ];
}
// svg functions
function svg_points(points, closed) {
    var start = points[0];
    var s= " M " + start[0]+ " " + start[1];
    for (var i=1; i <points.length ; i++) {
         p = points[i];
         s+= " L " + p[0]+ "," + p[1];
    }
    if (closed) s+= " L " + start[0]+ "," + start[1];
    return s;
}

function svg_path(path,style) {
    var svg = "<path d='"+path+"' ";
    svg += " style='"+style;
    svg +="'/>";
    return svg;
}


function svg_dot(point,r,style) {
    return "<circle cx=" + point[0] + " cy=" +point[1] + " r=" + r + " style='" + style + "'/>";
}

// UI assists

function parsefloat(s) {
    var n = parseFloat(s);
    if (isNaN(n))
      return 0;
    else return x;
}
