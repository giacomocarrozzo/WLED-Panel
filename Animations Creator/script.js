var heigh_canvas;
var num_pixel_x;
var num_pixel_y;
var background_color="#000000";
var color="#FFFFFF";
var c, sc, ctx;

var saveMatrix = [];
var numberSavedMatrix=0;
var selectedMatrix=0;

function init(){
    $("#collection").css("max-height",$(window).height());
    $("#collection").css("height",$(window).height());
    var elem = $('.color-input')[0];
    var hueb = new Huebee( elem, {
      staticOpen: true,
      notation: 'hex',
      setBGColor: '.set-bg-elem'
    });
    hueb.on( 'change', function( color_select, hue, sat, lum ) {
      color=$('#color-picker').val();
    })
    c=document.getElementById("canvas");
}

function setDrawing(){
    $("#displaysetting").css("display","none");
    $("#canvas").css("display","block");
    $("#savecontainer").css("display","block");
    $("#saveanimation").css("display","block");
    $("#importanimation").css("display","block");
    $("#textarea").css("display","block");
    height_canvas=$(window).height()-100;
    num_pixel_x=$("#pixelxinput").val();
    num_pixel_y=$("#pixelyinput").val();

    pixel_size=height_canvas/num_pixel_y;
    width_canvas=pixel_size*num_pixel_x;

    if(width_canvas>($("#drawcontainer").width()-50)){
    width_canvas=($("#drawcontainer").width()-50);
    pixel_size=width_canvas/num_pixel_x;
    height_canvas=pixel_size*num_pixel_y;
    $("#drawsubcontainer").css("margin-top",($("#drawcontainer").height()-height_canvas)/2);
    }else{
    $("#drawsubcontainer").css("margin-top",0);
    }
    c.height = height_canvas;
    c.width = width_canvas;

    ctx = c.getContext("2d");
    c.addEventListener('click',handleClick, false);

    newMatrix(null);
    initDraw(ctx,num_pixel_x,num_pixel_y,pixel_size,height_canvas,width_canvas,saveMatrix[selectedMatrix]);
}

function newMatrix(matrix){
  if(matrix === null){
    saveMatrix[numberSavedMatrix]=[];
    for(var y=0; y<num_pixel_y; y++){
      var row=[]
      for(var x=0; x<num_pixel_x; x++){
        row[x]=background_color;
      }
      saveMatrix[numberSavedMatrix][y] = row; 
    }
  } else {
    saveMatrix[numberSavedMatrix] = matrix;
  }

  $("#collection").append("<center><canvas style='margin-top:20px' class='canvasSavedClass' id='canvasSaved"+numberSavedMatrix+"'> Canvas not supported</canvas></center>");
 

  cSaved=document.getElementById("canvasSaved"+numberSavedMatrix);
  ctxSavedWidth=200;
  pixel_sizeSaved=ctxSavedWidth/num_pixel_x;
  ctxSavedHeight=pixel_sizeSaved*num_pixel_y;
  cSaved.width = ctxSavedWidth;
  cSaved.height = ctxSavedHeight;

  ctxSaved = cSaved.getContext("2d");
  initDraw(ctxSaved,num_pixel_x,num_pixel_y,pixel_sizeSaved,ctxSavedHeight,ctxSavedWidth,saveMatrix[numberSavedMatrix]);
  numberSavedMatrix++;
  cSaved.addEventListener('click',handleClickSC, false);
  $('#canvasSaved'+selectedMatrix).addClass("canvasSavedClassSelected");
  
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        var r= (result[1]=="00") ? "" : parseInt(result[1], 16);
        var g= (result[2]=="00") ? "" : parseInt(result[2], 16);
        var b= (result[3]=="00") ? "" : parseInt(result[3], 16);
    return r+":"+g+":"+b;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

function printAnimation(){
  var text = $("#speedinput").val() + ',' + $("#loopinput").val() + '\n';
  // + num_pixel_x + ',' + num_pixel_y + '\n';
  console.log(numberSavedMatrix);
  for(var n=0;n<numberSavedMatrix;n++){
    for(var y=0; y<num_pixel_y; y++){
              var row=saveMatrix[n][y];
              if(y % 2 == 0){
                  for(var x=0; x<num_pixel_x; x++){
                      text+=hexToRgb(row[x])+",";
                  }
              }else{
                  for(var x=num_pixel_x-1; x>-1; x--){
                      text+=hexToRgb(row[x])+",";
                  }
              }

    }
    text = text.substring(0, text.length - 1);
    text+="\n";
  }
  text = text.substring(0, text.length - 1);
  $("#textarea").val(text);
}

function importAnimation(){
  var text = $("#textarea").val();
  $("#collection").empty();
  saveMatrix = [];
  selectedMatrix=0;
  numberSavedMatrix = 0;
  var frames = text.split('\n');
  $("#speedinput").val(text.split('\n')[0].split(',')[0]);
  $("#loopinput").val(text.split('\n')[0].split(',')[1]);

  for ( var frameId = 1; frameId < frames.length; frameId++ ) {
    tempMatrix=[];
    pixelId =0;
    var frame = frames[frameId].split(',');
    for(var y=0; y<num_pixel_y; y++){
      var row=[]
      if(y % 2 == 0){
          for(var x=0; x<num_pixel_x; x++){
              r = frame[pixelId].split(':')[0] == '' ? 0 : +frame[pixelId].split(':')[0]
              g = frame[pixelId].split(':')[1] == '' ? 0 : +frame[pixelId].split(':')[1]
              b = frame[pixelId].split(':')[2] == '' ? 0 : +frame[pixelId].split(':')[2]
              row[x]=rgbToHex(r,g,b);
              pixelId ++;
          }
      }else{
          for(var x=num_pixel_x-1; x>-1; x--){
              r = frame[pixelId].split(':')[0] == '' ? 0 : +frame[pixelId].split(':')[0]
              g = frame[pixelId].split(':')[1] == '' ? 0 : +frame[pixelId].split(':')[1]
              b = frame[pixelId].split(':')[2] == '' ? 0 : +frame[pixelId].split(':')[2]
              row[x]=rgbToHex(r,g,b);
              pixelId ++;
          }
      }
      tempMatrix[y]=row;
    }
    newMatrix(tempMatrix);
  }
}

function initDraw(context,n_pixel_x,n_pixel_y,p_size,h_canvas,w_canvas,matrixC){
  for(var x=0; x<n_pixel_x; x++){
    for(var y=0; y<n_pixel_y; y++){
      context.fillStyle = matrixC[y][x];
      context.fillRect(p_size*x,p_size*y,p_size,p_size);
      context.stroke();
    }
  }

  drawGrid(context,n_pixel_y,n_pixel_x,p_size,h_canvas,w_canvas);
}

function drawGrid(context,n_pixel_y,n_pixel_x,p_size,h_canvas,w_canvas){
  context.lineWidth="1";
  context.strokeStyle="white";
  for(var y=0; y<n_pixel_y; y++){
    context.beginPath();
    context.moveTo(0,y*p_size);
    context.lineTo(w_canvas,y*p_size);
    context.stroke();
  }
  for(var x=0; x<n_pixel_x; x++){
    context.beginPath();
    context.moveTo(x*p_size,0);
    context.lineTo(x*p_size,h_canvas);
    context.stroke();
  }

}

function setbqcolor(){
  $('#bq_span').css("background-color",$('#color-picker').val());
  background_color=$('#color-picker').val();
}

function resetdraw(){
  saveMatrix = [];
  selectedMatrix=0;
  newMatrix(null);
  initDraw(ctx,num_pixel_x,num_pixel_y,pixel_size,height_canvas,width_canvas,saveMatrix[selectedMatrix]);
}

function addNewFrame(){
  newMatrix(null);
  selectedMatrix++;
  initDraw(ctx,num_pixel_x,num_pixel_y,pixel_size,height_canvas,width_canvas,saveMatrix[selectedMatrix]);
  var i = 0;
  while (i < numberSavedMatrix) {
      $('#canvasSaved'+i).removeClass("canvasSavedClassSelected");
      i++;
  }
  $('#canvasSaved'+selectedMatrix).addClass("canvasSavedClassSelected");
}

function handleClick(e){
  var rect= c.getBoundingClientRect();
  posx= Math.floor((e.clientX - rect.left)/pixel_size),
  posy= Math.floor((e.clientY - rect.top)/pixel_size)

  cSaved=document.getElementById("canvasSaved"+selectedMatrix);
  ctxSaved = cSaved.getContext("2d");

  ctx.fillStyle = color;
  ctxSaved.fillStyle = color;
  saveMatrix[selectedMatrix][posy][posx]=color;

  ctx.fillRect(pixel_size*posx,pixel_size*posy,pixel_size,pixel_size);
  drawGrid(ctx,num_pixel_x,num_pixel_y,pixel_size,height_canvas,width_canvas);

  ctxSavedWidth=200;
  pixel_sizeSaved=ctxSavedWidth/num_pixel_x;
  ctxSavedHeight=pixel_sizeSaved*num_pixel_y;
  ctxSaved.fillRect(pixel_sizeSaved*posx,pixel_sizeSaved*posy,pixel_sizeSaved,pixel_sizeSaved);
  drawGrid(ctxSaved,num_pixel_x,num_pixel_y,pixel_size,ctxSavedHeight,ctxSavedWidth);
}

function handleClickSC(e){
    selectedMatrix = +e.srcElement.id.replace("canvasSaved", "")
    initDraw(ctx,num_pixel_x,num_pixel_y,pixel_size,height_canvas,width_canvas,saveMatrix[selectedMatrix]);
    
    var i = 0;
    while (i < numberSavedMatrix) {
        $('#canvasSaved'+i).removeClass("canvasSavedClassSelected");
        i++;
    }
    $('#canvasSaved'+selectedMatrix).addClass("canvasSavedClassSelected");
}
