var modulation_list = [
    {name:"Unmodulated",fname: "modulate_none", description: "unmodulated", parameters: []}
    ,{ name:"Sine", fname:'modulate_sine', description:'sine curve',parameters: [
     {name:'cycles',min:0, max:10,step:0.1,initial: 2, description:'# full cycles' },
     {name: 'phase',min:0,max:90,step:1,initial:0, description:'phase in multiples of 90 '},
     {name:'amplitude',min:0,max:1,step:0.01,initial:0,description: 'amplitude of modulation'}
    ]},
    { name:"Sawtooth", fname:'modulate_sawtooth', description:'sawtooth curve',parameters: [
     {name:'layer cycles',min:0, max:10,step:0.1,initial: 16, description:'#full cycles' },
     {name:'vertical cycles',min:0,max:90,step:1,initial:0, description:'in multiples of 180 '},
     {name:'amplitude',min:0,max:1,step:0.01,initial:0,description: 'amplitude of modulation'}
    ]}
];
    function modulate_none(x,y,P) {
        return 0;
    }
   
    function modulate_sine(x,y,P)  {
              var f=P[0];
              var phase = 180 * sin(P[1]*y*90);   
              var d=P[2]*sin(f*x*90 + phase);
              return d
    } 
    function modulate_sawtooth(x,y,P)  {
              var f=P[0];
              var k= Math.floor(x*f);
              var xd = x*f - k;
              var amp = P[2]*sin(P[1]*y*180);
              var d =  xd <0.5 ? amp * xd  : amp * (1 - xd);  
              return d;
    }

