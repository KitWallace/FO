/*  easings

functions have one variable t  [0,1]  and a list of parameters p
output is generally in the range [0,1] 
  
*/

var easing_list = [
{ name:"Linear", fname:'ease_linear',parameters: []},
{ name:'Ease in-out cubic',fname:'ease_inout_cubic', description: 'Ease in-out with cubic curve',  parameters : [] },
{ name:'Ease in-out quadratic',fname:'ease_inout_quadratic', description: 'Ease in-out with quadratic curve',  parameters : [] },
{ name:'Cubic Bezier 2',kind:'profile', fname:'ease_cubic_bezier_2', description: 'Cubic Bezier with two control points [x1,y1] and [x2,y2]',  parameters : 
[
       {name: 'x1', min:-5, max:5, step:0.01, initial:0.5},
       {name: 'y1', min:-5, max:5, step:0.01, initial:0.5},  
       {name: 'x2', min:-5, max:5, step:0.01, initial:0.5},
       {name: 'y2', min:-5, max:5, step:0.01, initial:0.5}
  ]},
/* 
{ name:'Cubic Bezier 3', fname:'ease_cubic_bezier_3', description: 'Cubic Bezier with three control points [x1,y1],[x2,y2] and [x3,y3]',  parameters : 
[
       {name: 'x1', min:-5, max:5, step:0.01, initial:0.5},
       {name: 'y1', min:-5, max:5, step:0.01, initial:0.5},  
       {name: 'x2', min:-5, max:5, step:0.01, initial:0.5},
       {name: 'y2', min:-5, max:5, step:0.01, initial:0.5},
       {name: 'x3', min:-5, max:5, step:0.01, initial:0.5},
       {name: 'y3', min:-5, max:5, step:0.01, initial:0.5}
  ]
},
*/
{ name:"Sine", fname:'ease_sine', description:'sine curve',parameters: [
  {name:'cycles',min:0, max:10,step:0.1,initial: 2, description:'# quarter wave cycles' },
  {name: 'phase',min:0,max:90,step:1,initial:0, description:'phase angle'}
    ]
},

{ name:"Linear dwell", fname:'ease_linear_dwell', description:'linear with start and end constant: start+end <= 1 ',parameters: [
  {name:'start',min:0, max:0.5,step:0.01,initial:0, description:'constant at start : between 0 and 1' },
  {name:'end',min:0, max:0.5,step:0.01,initial:0, description:'constant at end : between 0 and 1' }
    ]
}

];
           function ease_linear(t,p) {
                return t;
           }       
           
           function ease_linear_dwell(t,p) {
                 var x;
                 var a=p[0];
                 var b=p[1];
                 if (t<a )
                    x=0;                
                 else if (t > (1-b))
                    x=1;
                 else x=  (t-a)/(1-a-b);
                 return x;
             }
            function ease_inout_cubic(t,p) {
                var x = t < 0.5 
                   ? 4 * t * t * t
                   : 1 - Math.pow(-2 * t + 2, 3) / 2;
                return x;
            }
            
            function ease_inout_quadratic(t,p) {
                var x = ease_cubic_bezier_2(t,[0.45,0,0.55,1]);
                return x;
            }

 /*           function ease_sine(t,p)  {
                var x = sin(p[0]*t/4 +p[1]);
                return x;
            }
 */
            function ease_cubic_bezier_2(t,p) {
                x=  3 * Math.pow(1 - t, 2) * t * p[0] +
                    3 * (1 - t) * Math.pow(t, 2) * p[2] +
                    Math.pow(t, 3) ;
                return x;  
            }
            
            function ease_cubic_bezier_3(t,p) {
                var x=  3 * Math.pow(1 - t, 2) * t * p[0] +
                    3 * (1 - t) * Math.pow(t, 2) * p[2] +
                    Math.pow(t, 3) *p[4] ;
              return x;  
            }
            
            function ease_sine(t,p)  {
              var f=p[0];
              var phase =p[1];
              return sin(f*t*180 + phase);
            }

