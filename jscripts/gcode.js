// gcode functions
function gcode_comment(s) {
    return ";" + s + "\n";
}

function gcode_move(p) {
    return "G0 X"+round(p[0],5)+" Y"+round(p[1],5)+ "\n";
}
function gcode_moveZ(p,z,feedrate) {
    var feed = feedrate ? " F"+feedrate : "";
    return "G0 X"+round(p[0],5)+" Y"+ round(p[1],5)+ " Z"+round(z,5)+  feed + "\n";
}

function gcode_line(path,i,extrusion_rate) {
     var e = norm(point_diff(path[i],path[(i - 1 + path.length)% path.length]));
     return "G1 X"+round(path[i][0],5) + " Y"+round(path[i][1],5) + " E" + round(extrusion_rate*e,5) + "\n";
}

function gcode_extrude(p0,p1,extrusion_rate) {
     var e = norm(point_diff(p0,p1));
     if (e<0.001)
        return ";\n";
     else 
        return "G1 X"+round(p1[0],5) + " Y"+round(p1[1],5) + " E" + round(extrusion_rate*e,5) + "\n";
}
function gcode_extrudeZ(p0,p1,z,extrusion_rate) {
     var e = norm(point_diff(p0,p1));
     if (e<0.001)
        return ";\n";
     else 
        return "G1 X"+round(p1[0],5) + " Y"+round(p1[1],5) + " Z"+z+" E" + round(extrusion_rate*e,5) + "\n";
}

function gcode_lineZ(path,i,z,extrusion_rate) {
     var e = norm(point_diff(path[i],path[(i - 1 + path.length)% path.length]));
     return "G1 X"+round(path[i][0],5) + " Y"+round(path[i][1],5) + " Z" + round(z,5) + " E" + round(extrusion_rate*e,5) + "\n";
}

function path_to_gcode(path,rate,closed) {
    var gcode = "";
    var end;
    for (var i = 1; i < path.length; i++) {
         gcode += gcode_line(path,i,rate);
    }
    if (closed) {
         gcode += gcode_line(path,0,rate);
         end = path[0];
         }
    else end = path[path.length - 1] ; 
    return {gcode: gcode, end: end};
}       

function path_to_gcodeZ(path,z_start,layer_height,rate,closed) {
    var gcode = "";
    var end;
    var steps = closed ? path.length : path.length-1;
    var delta = 1 /steps;
    for (var i = 1 ; i < path.length ; i++) {
       var z=z_start+i*delta*layer_height;
       gcode += gcode_lineZ(path,i,z,rate);
    }
    if (closed) {
       gcode += gcode_lineZ(path,0,z_start + layer_height,rate);
       end=path[0];
       }
    else
       end = path[path.length - 1] ; 

    return {gcode: gcode, end: end};
}
