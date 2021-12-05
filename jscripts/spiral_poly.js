function sin(t) {
   return Math.sin(t*RAD);   
}

function cos(t) {
   return Math.cos(t*RAD);   
}

function polygon(r,n) {
   var d= 360/n;
   var v = [];
   for (var i=0;i<=n-1;i++) {
      var a= i * d;
      v.push([r*cos(a),r*sin(a)]);
   }
   return v;
}

function interpolate(a,b,t) { 
   return (1-t)*a + t*b;
}

function point_interpolate(a,b,t) {
   return [interpolate(a[0],b[0],t), interpolate(a[1],b[1],t)];
}

function path_sequential_interpolate(pnts,t) {
  var v =[];
  var n= pnts.length;
  for (var i=0;i<n;i++)
      v.push(point_interpolate(pnts[(i -1 + n) %n], pnts[i],t));
  return v;
} 

function path_indexes_to_points(points,path) {
   return path.map(function(v,i) {return points[path[i]];});
}

function r_points(base,r,n) {
   if( n==1 )
     return base
   else {
     var nbase=path_sequential_interpolate(base,r);
      return base.concat(r_points(nbase,r,n-1))
     }
}

function r_path(m,n,j=0) {
   var v = [];
   if (j<n ) {
     for (var i=0;i<=m-1;i++)
          v.push(j*m + i);
     v= v.concat(r_path(m,n,j+1));
     if(j > 0) 
         v.push(j*m);
     }
   return v;
}
function polygon_spiral(base,n,d) {
    var m=base.length; 
    var points = r_points(base,d,n);  
    var path = r_path(m,n);
    var path_points = path_indexes_to_points(points,path);
    return path_points;    
}
