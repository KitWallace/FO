/* 
 * parametric functions 
 *  input t range [0,360*n]  where n is maxcycles
 *        p list of parameters
 * output  [x,y]
 * 
 */
 
var function_list = [ 

{ name: 'Lame curve' , fname: 'fn_Lame_curve' , description: 'Lame or superellipses (Piet Hein) are formed by the generalisation of the equation for a circle r^2=x^2+y^2 when the power 2 is replaced by n. Ax and Ay for the x and y axis amplitudes.' , link: 'https://en.wikipedia.org/wiki/Superellipse', scale: 10, parameters : [ 
{name: 'n' , description: "power", min: 0 , max: 10 , step: 0.01 , initial: 2.5}] } , 

{ name: 'Reuleux curve' , fname: 'fn_Reuleux_curve' , description: 'The odd-numbered curves are curves of constant width.' , link: "https://math.stackexchange.com/questions/2279568/formula-to-create-a-reuleaux-polygon", maxcycles: 1 , scale: 10, parameters : [ 
 { name: 'N' , description: "number of sides", min: 0 , max: 10 , step: 0.5 , initial: 3}] } , 

{ name: 'Polygon' , fname: 'fn_Polygon' , description: 'A functional form of Polygons.' ,link: "https://math.stackexchange.com/questions/41940/is-there-an-equation-to-describe-regular-polygons", maxcycles: 1 , scale: 30, parameters : [ 
 { name: 'N' ,description: "number of sides", min: 2 , max: 12 , step: 0.11 , initial: 3}] } , 

{ name: 'Lissajous curve' , fname: 'fn_Lissajous_curve' , description: 'Formed by the combination of two sinusoidal functions, one along the X axis, the other along the Y Axis, with exponential decay.' , link: 'https://en.wikipedia.org/wiki/Lissajous_curve', maxcycles: 1 , scale: 10, parameters : [ 
 { name: 'Fx' , description: 'X Frequency' , min: 0 , max: 20 , step: 1 , initial: 6},
{ name: 'Px' , description: 'X Phase' , min: 0 , max: 180 , step: 1 , initial: 39},
{ name: 'Fy' , description: 'Y Frequency' , min: 0 , max: 20 , step: 1 , initial: 7},
{ name: 'Py' , description: 'Y Phase' , min: 0 , max: 20 , step: 1 , initial: 7},
{ name: 'D' , description: 'Rate of decay' , min: 0 , max: 2 , step: 0.01 , initial: 0}
] } , 

{ name: 'Rose curve' , fname: 'fn_Rose_curve' , description: 'The Rose or rhodonea curve is a sinuisodal curve plotted in polar coordinates  (r,F2*theta) where r=O1 + A1*cos(F1 *t +P1) with  exponential decay.' ,link:'https://en.wikipedia.org/wiki/Rose_%28mathematics%29', maxcycles: 50 , scale: 15, parameters : [ 
 { name: 'F1' , min: 1 , max: 100 , step: 1 , initial: 5},
{ name: 'A1' , min: 0 , max: 5 , step: 0.1 , initial: 1},
{ name: 'P1' , min: 0 , max: 90 , step: 1 , initial: 0},
{ name: 'O1' , min: 0 , max: 10 , step: 0.1 , initial: 0},
{ name: 'F2' , min: 1 , max: 100 , step: 1 , initial: 1},
{ name: 'decay' , min: 0 , max: 1 , step: 0.01 , initial: 0}] } , 


{ name: 'Archimedean Spiral' , fname: 'fn_Archimedean_Spiral' , description: '' ,  scale: 2, parameters : [ 
 { name: 'R' , description: 'Revolutions' , min: 1 , max: 30 , step: 1 , initial: 1},
{  name: 'a' , description: 'rate',min: 1 , max: 100 , step: 1 , initial: 1}] } , 

{ name: 'Epitrochoid' , fname: 'fn_Epitrochoid' , description: 'The path of a point on a wheel radius R2 rotating around the inside of another of radius R1. Epicycloid when d=R2' , link: 'https://en.wikipedia.org/wiki/Epitrochoid', maxcycles: 1 , scale: 2, parameters : [ 
 { name: 'R1' , min: 1 , max: 100 , step: 1 , initial: 3},
{ name: 'R2' , min: 1 , max: 100 , step: 1 , initial: 1},
{ name: 'd' , min: 0 , max: 20 , step: 0.1 , initial: 0.5}
] } , 

{ name: 'Hypotrochoid', fname: 'fn_Hypotrochoid' , description: 'The path of a point on a wheel radius R2 rotating around the inside of another of radius R1. Hypocycloid when d=R2' , link: 'https://en.wikipedia.org/wiki/Hypotrochoid', maxcycles: 3 , scale: 2, parameters : [ 
 {name: 'R1' , min:0 , max: 20 , step: 1 , initial: 5},
{ name: 'R2' , min: 0 , max: 20 , step: 1 , initial: 3}, 
{ name: 'd' , min: 0 , max: 20 , step: 0.1 , initial: 5}] } , 

{ name: "Bernoulli's Lemniscate" , fname: 'fn_Bernoullis_Lemniscate' , description: "Bernoulli's lemniscate (x^2+y^2)^2= 2C^2(x^2-y^2)  where C is the focal distance." ,

link: 'https://en.wikipedia.org/wiki/Lemniscate_of_Bernoulli', maxcycles: 1 , scale: 5, parameters : [ 
 { name: 'Ax' , description: 'Focal distance or half-width' , min: 0 , max: 10 , step: 0.1 , initial: 5},
{ name: 'Ay' , description: 'Y Scaling' , min: 0 , max:10 , step: 0.1 , initial: 5}] } , 

/*  
{ name: 'Fourier 3 Term' , fname: 'fn_Fourier_3_Term' , description: 'The motion of three linked arms, the parameters determining the rate of rotation, the length and phase of each arm. More in this blog post' , maxcycles: 1, parameters : [ 
 { name: 'F1' , description: 'Frequency 1' , min: -20 , max: 20 , step: 1 , initial: 1},
{ name: 'A1' , description: 'Amplitude 1' , min: -50 , max: 50 , step: 1 , initial: 20},
{ name: 'P1' , description: 'Phase 1' , min: 0 , max: 180 , step: 1 , initial: 0},
{ name: 'F2' , description: 'Frequency 2' , min: -20 , max: 20 , step: 0.1 , initial: 3},
{ name: 'A2' , description: 'Amplitude 2' , min: -50 , max: 50 , step: 1 , initial: 40},
{ name: 'P2' , min: 0 , max: 180 , step: 1 , initial: 0},
{ name: 'F3' , description: 'Frequency 3' , min: 0 , max: 100 , step: 1 , initial: 0},
{ name: 'A3' , description: 'Amplitude 3' , min: -50 , max: 50 , step: 1 , initial: 0},
{ name: 'P3' , description: 'Phase 3' , min: 0 , max: 180 , step: 1 , initial: 0}] } , 
*/
{ name: 'Fourier 3 Term Relative' , fname: 'fn_Fourier_3_Term_Relative' , description: ' Fourier function with 3 components where each rotation is relative to the previous component, so behaviour is more intuitive.' , scale:5, maxcycles: 1, parameters : [ 
 { name: 'F1' , description: 'Frequency 1' ,min: -50 , max: 50 , step: 0.1 , initial: 1},
{ name: 'A1' , description: 'Amplitude 1' ,min: 0 , max: 20 , step: 0.1 , initial: 2},
{ name: 'P1' , description: 'Phase 1' ,min: 0 , max: 180 , step: 0.1 , initial: 0},
{ name: 'F2' , description: 'Frequency 2' , min: -50 , max: 50 , step: 0.1 , initial: 2},
{ name: 'A2' ,  description: 'Amplitude 2' ,min: 0 , max: 20 , step: 0.1 , initial: 2},
{ name: 'P2' , description: 'Phase 2' ,min: 0 , max: 180 , step: 1 , initial: 0},
{ name: 'F3' , description: 'Frequency 3' ,min: -50 , max: 50 , step: 0.1 , initial: 0},
{ name: 'A3' , description: 'Amplitude 3' , min: 0 , max: 20 , step: 0.1 , initial: 0},
{ name: 'P3' , description: 'Phase 1' ,min: 0 , max: 180 , step: 1 , initial: 90}] } , 
 
{ name: 'Heart Equation' , fname: 'fn_Heart_Equation' , description: 'One of a number of heart-shaped curves' , maxcycles: 1 , scale: 2, parameters : [ 
 { name: 'a' , min: 0 , max: 20 , step: 1 , initial: 16},
{ name: 'b' , description:'must be equal to or greater than a', min: -20 , max: 20 , step: 1 , initial: 13},
{ name: 'c' , min: -10 , max: 10 , step: 1 , initial: -5},
{ name: 'd' , min: -10 , max: 10 , step: 1 , initial: -2},
{ name: 'e' , min: -10 , max: 10 , step: 1 , initial: -1}] } ,

{ name: 'Cassini ovals' , fname: 'fn_Cassini_ovals' , description: 'A curve for which the product of the distances to the two focii is constant.' , link:'https://en.wikipedia.org/wiki/Cassini_oval',  scale: 3, parameters : [ 
 { name: 'a' , min: 0 , max: 20 , step: 0.1 , initial: 8},
{ name: 'b' , min: 0 , max: 20 , step: 0.1 , initial: 8}] } , 

{ name: 'The Bean' , fname: 'fn_The_Bean' , description: 'r = cos t (2 - cos 2t) , generalised to r = cos t (a - cos bt)' , link:'http://serge.mehl.free.fr/anx/haricot.html', maxcycles: 1 , scale: 30, parameters : [ 
 { name: 'a' , min: 0 , max: 5 , step: 0.1 , initial: 2},
{ name: 'b' , min: 0 , max: 5 , step: 0.1 , initial: 2}] } ,
  
{ name: 'Torus knot' , fname: 'fn_Torus_knot' , description: '' , maxcycles: 1 , scale: 10, parameters : [ 
 { name: 'p' , min: 0 , max: 20 , step: 1 , initial: 2},
{ name: 'q' , min: 0 , max: 20 , step: 1 , initial: 3},
{ name: 'd' , description: 'd * 10' , min: -100 , max: 100 , step: 1 , initial: 2}] } , 
 
{ name: 'Fourier line' , fname: 'fn_Fourier_line' , description: '' , maxcycles: 1 ,  parameters : [ 
{ name: 'Aamp' , min: 0 , max: 20 , step: 0.1 , initial: 10},
{ name: 'Afreq' , min: 1 , max: 50 , step: 0.1 , initial: 1},
{ name: 'Aphase' , min: 0 , max: 180 , step: 1 , initial: 0},
{ name: 'Bamp' , min: 0 , max: 20 , step: 0.1 , initial: 0},
{ name: 'Bfreq' , min: 0 , max: 50 , step: 0.1 , initial: 0},
{ name: 'Bphase' , min: 0 , max: 180 , step: 1 , initial: 0},
{ name: 'Camp' , min: 0 , max: 20 , step: 0.1 , initial: 0},
{ name: 'Cfreq' , min: 0 , max: 50 , step: 0.1 , initial: 0},
{ name: 'Cphase' , min: 0 , max: 180 , step: 1 , initial: 0}
] } , 

{ name:'Cubic Bezier 2', fname:'fn_cubic_bezier_2', description: 'Cubic Bezier with two control points [x1,y1] and [x2,y2]',  parameters : 
[
       {name: 'x1', min:-5, max:5, step:0.01, initial:0.5},
       {name: 'y1', min:-5, max:5, step:0.01, initial:0.5},  
       {name: 'x2', min:-5, max:5, step:0.01, initial:0.5},
       {name: 'y2', min:-5, max:5, step:0.01, initial:0.5}
  ]},
  
{ name:'Cubic Bezier 3', fname:'fn_cubic_bezier_3', description: 'Cubic Bezier with three control points [x1,y1],[x2,y2] and [x3,y3]',  parameters : 
[
       {name: 'x1', min:-5, max:5, step:0.01, initial:0.5},
       {name: 'y1', min:-5, max:5, step:0.01, initial:0.5},  
       {name: 'x2', min:-5, max:5, step:0.01, initial:0.5},
       {name: 'y2', min:-5, max:5, step:0.01, initial:0.5},
       {name: 'x3', min:-5, max:5, step:0.01, initial:0.5},
       {name: 'y3', min:-5, max:5, step:0.01, initial:0.5}
  ]
},


];

        
            function fn_Lissajous_curve(t,p ) { 
            var d= Math.exp(-p[4]*t/360);
            var X= sin(p[0]*t + p[1])* d;
            var Y= sin(p[2]*t + p[3]) * d;
            return [X,Y]; 
            } 
        
            function fn_Torus_knot(t,p ) { 
            var r= cos(p[1]*t)+p[2]/10;
            var X= r*cos(p[0]*t);
            var Y= r*sin(p[0]*t);
            return [X,Y];
            } 
        
            function fn_Fourier_3_Term(t,p ) {   
            X= (p[1]*cos(p[0]*t +p[2])+p[4]*cos(p[3]*t+p[5])+p[7]*cos(p[6]*t+p[8]));
            Y= (p[1]*sin(p[0]*t +p[2])+p[4]*sin(p[3]*t+p[5])+p[7]*sin(p[6]*t+p[8]));
            return [X,Y];   
            } 
        
            function fn_Fourier_3_Term_Relative(t,p ) {
           
            r1=p[0];
            r2=p[3]+r1;
            r3=p[6]+r2;
            X= (p[1]*cos(r1*t +p[2])+p[4]*cos(r2*t+p[5])+p[7]*cos(r3*t+p[8]));
            Y= (p[1]*sin(r1*t +p[2])+p[4]*sin(r2*t+p[5])+p[7]*sin(r3*t+p[8]));
            return [X,Y];
            } 
        
        
            function fn_Rose_curve(t,p ) {  
            r=  (p[3] + p[1]*cos(p[0]*t+p[2]) * Math.exp(-p[5]/50 *t))
            X=r*cos(p[4]*t);
            Y=r*sin(p[4]*t);
            return [X,Y];   
            } 
        
            function fn_Wikipedia_name_unknown(t,p ) {  
            X= (cos(p[0]*t) - Math.pow(cos(p[1]*t+p[6]),p[2]))
            Y= (sin(p[3]*t) - Math.pow(sin(p[4]*t),p[5]))
            return [X,Y];   
            } 
        
            function fn_Wikipedia_name_unknown_reduced(t,p ) {  
            X= (cos(p[0]*t) - Math.pow(cos(p[1]*t+p[4]),p[2]))
            Y= (sin(p[0]*t) - Math.pow(sin(p[1]*t),p[3]))
            return [X,Y];   
            } 
        
            function fn_Lame_curve(t,p ) { 
            
            var n=p[0];
            X=  Math.pow(Math.abs(cos(t)),2/n) * sgn(cos(t));
            Y=  Math.pow(Math.abs(sin(t)),2/n) * sgn(sin(t));
            return [X,Y];
            } 
                
            function fn_Heart_Equation(t,p ) {            
            X= p[0]*Math.pow(sin(t),3);
            Y= (p[1]*cos(t)+ p[2]*cos(2*t)+ p[3]*cos(3*t) + p[4]*cos(4*t))
            return [-X,Y];
            } 
        
            function fn_Archimedean_Spiral(t,p ) { 
            theta = t*p[0];
            r=  theta*(p[1])/360;
            X=  r*sin(theta);
            Y=  r*cos(theta);
            return [X,Y];
            } 
        
            function fn_Desmos_1(t,p ) { 
            rad=180/3.14159;
            T=t;
            X=  sin(p[0]*T)*cos(cos(p[1]*T)*rad);
            Y=  cos(p[0]*T)*cos(p[0]*T)*sin(sin(p[1]*T)*rad+p[2]);
            return [X,Y];
            } 
        
            function fn_Epitrochoid(t,p ) { 
            var a  = p[0] + p[1];
            var b =  a/p[1];
            var d = p[2];
            X=  a* cos(t) -  d* p[1]*cos(b*t);
            Y=  a* sin(t) -  d* p[1]*sin(b*t);

  //          X=  ((p[0]+p[1])*cos(t + p[2])- p[1]*cos((p[0]/p[1] + 1)*t ));
  //          Y=  ((p[0]+p[1])*sin(t + p[2])- p[1]*sin((p[0]/p[1] + 1)*t + p[2]));
            return [X,Y];
            } 
            
            function fn_Hypotrochoid(t,p ) { 
            var a  = p[0] - p[1];
            var b =  (p[0]-p[1])/p[1];
            var d = p[2];
            X=  a* cos(t) +  d*cos(b*t);
            Y=  a* sin(t) -  d*sin(b*t);
            return [X,Y];
            } 
        
            function fn_Bernoullis_Lemniscate(t,p ) { 
            var X= p[0]*cos(t)/(1 + Math.pow(sin(t),2));
            var Y= p[1]*sin(t)*cos(t)/(1 + Math.pow(sin(t),2));
            return [X,Y]; 
            } 
        
            function fn_Cassini_ovals(t,p ) { 
            var r2 = Math.pow(p[0],2)*Math.abs(cos(2*t) + Math.sqrt(Math.pow(p[1]/p[0],4) - Math.pow(sin(2*t),2)));
            var r= Math.sqrt(r2);
            var X=  r *sin(t);
            var Y=  r *cos(t);
            return [X,Y];
            } 
        
            function fn_The_Bean(x,p ) { 
            var t = x/2;
            var r=cos (t) * ((p[0] - cos(p[1]*t)));
            
            var X=  r *sin(t);
            var Y=  r *cos(t);
            return [-X,Y];
            } 
        

          function fn_Reuleux_curve(t,p) { 
          //Expressed in degrees and the half-angle subtended by a side.
            
            var angle = 180 /p[0] ; // half side angle
            var a = angle * (2 * rdiv(t , 2 * angle) + 1);
            var r = 2* cos (angle / 2);
            var X = (r * cos((t+a)/2) -cos(a));
            var Y = (r * sin((t+a)/2) -sin(a));   
            return [X,Y]; 
            } 

            function fn_Polygon(t,p ) { 
           // Expressed in degrees and the half-angle subtended by a side.
            var angle= 180/p[0];  // half the side angle
            var r = cos(angle) / ( cos( rmod(t , 2*angle) - angle )) ; 
            var X =  r * cos(t);
            var Y =  r * sin(t);
            return [X,Y];
            } 
         
            function fn_Fourier_line(t,p ) {          
            var X= (p[0] * cos (p[1] *t +p[2]) +  p[3] * sin (p[4] *t +p[5]) + p[6] * sin (p[7] *t +p[8]));
            return [X, t/360]; 
            } 
            
            function fn_cubic_bezier_2(d,p) {
                t= d/360;
                x=  3 * Math.pow(1 - t, 2) * t * p[0] +
                    3 * (1 - t) * Math.pow(t, 2) * p[2] +
                    Math.pow(t, 3) ;
                return [x,t];  
            }
            
            function fn_cubic_bezier_3(d,p) {
                t= d/360;
                x=  3 * Math.pow(1 - t, 2) * t * p[0] +
                    3 * (1 - t) * Math.pow(t, 2) * p[2] +
                    Math.pow(t, 3) *p[4] ;
              return [x,t];  
            }
/*           
           function fn_cubic_bezier_2(d,p) {
                var t = d/360;
                x=  3 * Math.pow(1 - t, 2) * t * p[0] +
                    3 * (1 - t) * Math.pow(t, 2) * p[2] +
                    Math.pow(t, 3) ;
                return [x,t];  
            }
            
            function fn_cubic_bezier_3(d,p) {
                var t = d/360;
                var x=  3 * Math.pow(1 - t, 2) * t * p[0] +
                    3 * (1 - t) * Math.pow(t, 2) * p[2] +
                    Math.pow(t, 3) *p[4] ;
              return [x,t];  
            }
*/
