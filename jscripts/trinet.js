
function path_indexes_to_points(points,path) {
   return path.map(function(v,i) {return points[path[i]];});
}

function P(n) {
     var s = n>0 ? P(n-1)+n : 0;
     return s;
}

function tri_net(n) {
    r = Math.sqrt(3);
// make the points
    var p=[];  
    for (var i=0;i<=n;i++) {
       for (var j=0;j<=i;j++) {
          var k=2*i-j;
          p.push([k,j*r])  
       }
    }
// make the vertices
    var v=[];
    for (var i=0;i<=n;i++) {
      
// zigzag 
      if (i >1)
         for (var j=i-1;j>0;j--) { 
            v.push(P(i-1)+i+j);
            v.push(P(i-1)+j-1);
         }

// right side
     for (var j=0;j<i+1;j++)
         v.push(P(i)+j);
           
// top edge
     if (i == n) 
       for (var j=i-1;j>0;j--)
          v.push(P(j+1)-1);
           
    } 
    var points = path_indexes_to_points(p,v); 
    return points;
}
