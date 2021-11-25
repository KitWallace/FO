var theTab;
var ntabs;

function init_tabs() {
   ntabs=$(".tab").length;
   theTab=0;
   tab(theTab);
}

function tab(n) {
  theTab=n;
  $('#tab'+n).show();
  $('#but'+n).css("background-color","lightgreen");
  for (var i=0;i<ntabs;i++)
     if (i != n) {
       $('#tab'+i).hide(); 
       $('#but'+i).css("background-color","white");      
     }
};

function hide_show(id) {
    div =$('#div-'+id);
    button = $('#b-'+id);
    if (div.is(":visible")) {
        div.hide(); 
        button.html("Show");
    }   
    else {
       div.show();
       button.html("Hide")
    }
}

function tooltip(text) {
    var s= "<span class='tooltip'><img src='assets/Info_Symbol.png' width='10px'/><span class='tooltiptext'>"+ text+"</span></span>";
//    console.log(s);
    return s;
};
