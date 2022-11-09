var configuracion = {
  numCirculos : 100,
  radio : 12,
  velocidad : 1,
  colorCirculos : '#000000',
  randomTam : true,
  circulosConexion : false,
  lineasConexion : false,
  circulosMouse : false,
  lineasMouse : false,
  opacidadCirculo : 1,
  colision: true,
  colorConexion : '#000000',
  rellenoInteraccion : false,
  velocidadColoreado: 0.02,
  opacidadCircunferencia : 1,
  distanciaConexion : 100,
  distanciaMouse : 100,
  anchoCircunferencia : 1,
  anchoConexion : 0.5,
  masaRandom : false,
  colorRandom : false,
  hacker : false,
  colores : []
}

const random = (n, m) =>  {
 return Math.floor(Math.random() * (m - n) + n);
};


function distancia(x1,y1,x2,y2){
  var dx = Math.pow(x2-x1,2);
  var dy = Math.pow(y2-y1,2);
  return Math.sqrt(dx+dy);
}
function medio(x1,y1,x2,y2){
  var x = (x1+x2)/2;
  var y = (y1+y2)/2;
  return new Array(x,y);
}

function rota({x,y}, angulo) {
  var velocidadesRotadas = {
    x: x * Math.cos(angulo) - y * Math.sin(angulo), 
    y: x * Math.sin(angulo) + y * Math.cos(angulo)
  };
  return velocidadesRotadas;
}

function rota1({vx,vy}, angulo) {
  var velocidadesRotadas = {
      x: vx * Math.cos(angulo) - vy * Math.sin(angulo),
      y: vx * Math.sin(angulo) + vy * Math.cos(angulo)
  };
  return velocidadesRotadas;
}


function resuelveColision(circulo, otroCirculo) {
   var velocidadX = circulo.velocidad.x - otroCirculo.velocidad.x;
   var velocidadY = circulo.velocidad.y - otroCirculo.velocidad.y;
   var distanciaX = otroCirculo.x - circulo.x;
   var distanciaY = otroCirculo.y - circulo.y;
    if (velocidadX * distanciaX + velocidadY * distanciaY <= 0){
      var angulo = -Math.atan2(otroCirculo.y - circulo.y, otroCirculo.x - circulo.x);
      var m1 = circulo.masa;
      var m2 = otroCirculo.masa;
      var u1 = rota(circulo.velocidad, angulo);
      var u2 = rota(otroCirculo.velocidad, angulo);
      var v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
      var v2 = { x: u2.x * (m2 - m1) / (m1 + m2) + u1.x * 2 * m1 / (m1 + m2), y: u2.y };
      var vFinal1 = rota(v1, -angulo);
      var vFinal2 = rota(v2, -angulo);
      circulo.velocidad.x = vFinal1.x;
      circulo.velocidad.y = vFinal1.y;
      otroCirculo.velocidad.x = vFinal2.x;
      otroCirculo.velocidad.y = vFinal2.y;
    }

}

function randomColor(opacidad){
  return 'rgba('+random(0,256)+','+random(0,256)+','+random(0,256)+','+opacidad+')';
}
let mouseIB = { x:0 , y:0}
var posX = 0;
var posY = 0;
window.addEventListener('mousemove',function(event){
  posX = event.clientX;
  posY = event.clientY;
})
const canvas = document.querySelector('canvas') // Grab canvas from DOM
canvas.width = window.innerWidth // Set canvas' width to full width of window
canvas.height = window.innerHeight
const c = canvas.getContext('2d') // Get context to access 2D canvas functions
c.globalCompositeOperation='destination-over';


function Circulo (x,y,radio,dx,dy,color,masa,circulosConexion,lineas,circulosMouse,
  lineasMouse,opacidadCirculo,colision,colorConexion,rellenoInteraccion,velocidadColoreado,
  opacidadCircunferencia,distanciaConexion,distanciaMouse,anchoCircunferencia,
anchoConexion,hacker){
 this.x=x;
 this.y=y;
 this.velocidad = {
   x: dx,
   y: dy
 };
 this.radio=radio;
 this.color = color;
 this.masa = masa;
 this.circulosConexion = circulosConexion;
 this.lineas = lineas;
 this.circulosMouse = circulosMouse;
 this.lineasMouse = lineasMouse;
 this.opacidadCirculo = opacidadCirculo;
 this.colision = colision;
 this.colorConexion = colorConexion;
 this.rellenoInteraccion = rellenoInteraccion;
 this.velocidadColoreado = velocidadColoreado;
 this.rellenoOpacidad =  0;
 this.opacidadCircunferencia = opacidadCircunferencia;
 this.distanciaConexion = distanciaConexion;
 this.distanciaMouse=distanciaMouse;
 this.anchoCircunferencia = anchoCircunferencia;
 this.anchoConexion = anchoConexion;
 this.hacker = hacker;

 this.dibuja = function(){
   c.beginPath();

   if (!this.rellenoInteraccion) {
     c.beginPath();
     c.arc(this.x,this.y, this.radio, 0, 2 * Math.PI);
     c.save();
     c.globalAlpha = this.opacidadCirculo;
     c.fillStyle = this.color;
     c.fill();
     c.restore();
     c.save();
     c.lineWidth = this.anchoCircunferencia;
     c.globalAlpha = this.opacidadCircunferencia;
     c.strokeStyle = this.color;
     c.stroke();
     c.restore();
   }else{
     c.beginPath();
     c.arc(this.x,this.y, this.radio, 0, 2 * Math.PI);
     c.save();
     c.globalAlpha = this.rellenoOpacidad;
     c.fillStyle = this.color;
     c.fill();
     c.restore();
     c.save();
     c.lineWidth = this.anchoCircunferencia;
     c.globalAlpha = this.opacidadCircunferencia;
     c.strokeStyle = this.color;
     c.stroke();
     c.restore();
   }
   if (this.hacker) {
     c.font = this.radio+'px Comic Sans MS';
     c.fillStyle = this.color;
     c.fillText(random(100,999),this.x-this.radio,this.y-(this.radio+2))
   }

 }
 this.actualiza = function(circulos){
   for (var i = 0; i < circulos.length; i++) {

     if(this==circulos[i])
       continue;
     if (distancia(this.x,this.y,circulos[i].x,circulos[i].y) - (this.radio + circulos[i].radio) < 0) {
       if(this.colision){
        resuelveColision(this,circulos[i]);
        }
       // Color random si colisionan
       //this.color = randomColor(0.5);
       //circulos[i].color = randomColor(0.5);
     }
     if (distancia(this.x,this.y,circulos[i].x,circulos[i].y) - (this.radio + circulos[i].radio) < this.distanciaConexion) {
        c.beginPath();
        if (this.lineas) {
          c.save();
          c.lineWidth = this.anchoConexion;
          c.strokeStyle = this.colorConexion;
          c.moveTo(this.x,this.y)
          c.lineTo(circulos[i].x,circulos[i].y);
          c.closePath();
          c.stroke();
          c.restore();
        }
        if(this.circulosConexion){
          var med = medio(this.x,this.y,circulos[i].x,circulos[i].y);
          c.save();
          c.lineWidth = this.anchoConexion;
          c.beginPath();
          c.strokeStyle = this.colorConexion;
          c.arc(med[0],med[1], 3, 0, 2 * Math.PI);
          c.stroke();
          c.restore();
        }
     }

   }
   if (distancia(posX,posY,this.x,this.y) - this.radio * 2 < this.distanciaMouse) {
     if (this.lineasMouse) {
       c.save();
       c.lineWidth = this.anchoConexion;
       c.beginPath();
       c.strokeStyle = this.colorConexion;
       c.moveTo(posX,posY);
       c.lineTo(this.x,this.y);
       c.closePath();
       c.stroke();
       c.restore();
     }
     if (this.circulosMouse) {
       var med = medio(posX,posY,this.x,this.y);
       c.save();
       c.lineWidth = this.anchoConexion;
       c.beginPath();
       c.strokeStyle = this.colorConexion;
       c.arc(med[0],med[1], 3, 0, 2 * Math.PI);
       c.stroke();
       c.restore();
     }if (this.rellenoInteraccion && this.rellenoOpacidad <0.5) {
       this.rellenoOpacidad +=this.velocidadColoreado;
     }

   }else if(this.rellenoInteraccion) {
     this.rellenoOpacidad -= 0.02;
     this.rellenoOpacidad = Math.max(this.rellenoOpacidad,0);

   }
   if(this.x +this.radio >innerWidth || this.x-this.radio < 0){
     this.velocidad.x*=-1;
   }
   if(this.y +this.radio >innerHeight || this.y-this.radio < 0){
     this.velocidad.y*=-1;
   }
   
   this.y-=this.velocidad.y;
   this.x-=this.velocidad.x;
   this.dibuja();
 }
}

var circulos =[];
function rellenaCirculos(){
  circulos=[]
  for (var i = 0; i < configuracion.numCirculos; i++) {  
    var radio = configuracion.randomTam?random(1,configuracion.radio):parseInt(configuracion.radio);
    var colorC = configuracion.colorRandom ? (configuracion.colores.length == 0? randomColor(1):configuracion.colores[random(0,configuracion.colores.length)]): configuracion.colorCirculos;
    var colorConexion = configuracion.colorRandom ? colorC:configuracion.colorConexion;
    var x = random(radio,innerWidth-radio);
    var y = random(radio,innerHeight-radio);
    var dx = random(-1,2) == 0? random(1,configuracion.velocidad*10+1)/10: -random(1,configuracion.velocidad*10+1)/10;
    var dy = random(-1,2) == 0? random(1,configuracion.velocidad*10+1)/10: -random(1,configuracion.velocidad*10+1)/10;
    var masa = configuracion.masaRandom ? random(1,radio+1): radio;
    masa = configuracion.randomTam ? radio : masa;
    /*
      El primer circulo lo podemos generar en donde sea.
      Los siguientes si hay colision activa, los generamos
      de forma que no esten uno encima de otro.
      Si no hay colision, no nos importa si se enciman,
    */
    if (circulos.length!=0 && configuracion.colision) {
      var inicio=Date.now();
      for (var j = 0; j < circulos.length; j++) {
        if (distancia(x,y,circulos[j].x,circulos[j].y)-(radio*2)<=0) {
          x = random(configuracion.radio,innerWidth-configuracion.radio);
          y = random(configuracion.radio,innerHeight-configuracion.radio);
          j=-1
          var fin = Date.now();
          if ((fin-inicio)/1000 >= 0.1) {
            return;
          }
        }
      }
    }
    circulos.push(new Circulo(x,y,radio,dx,dy,colorC,masa,
    configuracion.circulosConexion,configuracion.lineasConexion,configuracion.circulosMouse,configuracion.lineasMouse,
    configuracion.opacidadCirculo,configuracion.colision,colorConexion,
    configuracion.rellenoInteraccion,configuracion.velocidadColoreado,configuracion.opacidadCircunferencia,
    configuracion.distanciaConexion,configuracion.distanciaMouse,
    configuracion.anchoCircunferencia,configuracion.anchoConexion,configuracion.hacker));
  }
}
rellenaCirculos();


/*Inputs*/
var conexionCirculos = document.querySelector('#conexion-circulos');
var conexionLineas = document.querySelector('#conexion-lineas');

var sliderVelocidad = document.querySelector('#slider-velocidad');
var labelVelocidad = document.querySelector('#label-velocidad');

var sliderVelocidadColoreado = document.querySelector('#slider-velocidad-coloreado');
var labelVelocidadColoreado = document.querySelector('#label-velocidad-coloreado');

var labelCirculos = document.querySelector('#label-circulos');
var labelDistanciaConexion = document.querySelector('#label-distancia-conexion');
var sliderDistanciaConexion= document.querySelector('#slider-distancia-conexion');

var labelAnchoCircunferencia = document.querySelector('#label-ancho-circunferencia');
var sliderAnchoCircunferencia= document.querySelector('#slider-ancho-circunferencia');

var labelAnchoConexion = document.querySelector('#label-ancho-conexion');
var sliderAnchoConexion = document.querySelector('#slider-ancho-conexion');

var labelDistanciaMouse= document.querySelector('#label-distancia-mouse');
var sliderDistanciaMouse= document.querySelector('#slider-distancia-mouse');
var labelOpacidad = document.querySelector('#label-opacidad');
var sliderOpacidad = document.querySelector('#slider-opacidad');
var sliderTamano = document.querySelector('#slider-tamano');
var labelTamano = document.querySelector('#label-tamano');
var sliderOpacidadCircunferencia = document.querySelector('#slider-opacidad-circunferencia');
var labelOpacidadCircunferencia = document.querySelector('#label-opacidad-circunferencia');
var sliderCirculos = document.querySelector('#slider-circulos');
var mouseCirculos = document.querySelector('#mouse-circulos');
var mouseLineas = document.querySelector('#mouse-lineas');
var labelMouseLineas = document.querySelector('#label-mouse-lineas');
var labelMouseCirculos = document.querySelector('#label-mouse-circulos');
var randomTamano = document.querySelector('#random-tamano');
var colision = document.querySelector('#colision');
var colorCirculos = document.querySelector('#color-circulos');
var colorConexion = document.querySelector('#color-conexion');
var rellenoInteraccion = document.querySelector('#relleno-interaccion');
var body = document.querySelector('#body');
var bodyColor = document.querySelector('#body-color');
var masaRandom = document.querySelector('#masa-random');
var colorRandom  = document.querySelector('#color-random');
var config  = document.querySelector('.configuracion');
var copiar = document.querySelector('#copiar');
var tooltip = document.querySelector('.tooltip');
var transparente = document.querySelector('#transparente');
var container = document.querySelector('.container');
var hacker = document.querySelector('#hacker');
var select= document.querySelector('.select');
var selectedColor = document.querySelector('#selected-color');
var addColor = document.querySelector('#add-color');
var removeColor = document.querySelector('#remove-color');

/*Efecto logo*/
const logo = document.querySelector('.logo');
const sText = logo.textContent;
const splitText = sText.split("");
logo.innerHTML="";

splitText.map((str)=>{
  const spn =document.createElement('span')
  spn.textContent = str;
  spn.className = 'spanLogo';
  logo.appendChild(spn);
  //logo.innerHTML += "<span class='spanLogo'>"+ str + '</span>';
});

let char = 0;
let timer = setInterval(onTimer,50);

function onTimer(){
  const span = logo.querySelectorAll('.spanLogo')[char];
  span.classList.add('efecto');
  char++;
  if (char === splitText.length) {
    completo();
    return;
  }
}
function completo(){
  clearInterval(timer);
  timer = null;
}
transparente.onchange = function(){
  if (!transparente.checked) {
    container.style.opacity = 0;
    container.style.pointerEvents = 'none';
    container.style.transform = 'translateX(-100px) rotate(90deg)'
  }else{
    container.style.opacity = 1;
    container.style.pointerEvents = 'all';
    container.style.transform = 'translateX(0px) rotate(0deg)'
  }
}
/*Termina efecto logo*/
copiar.onclick = function(){
  navigator.clipboard.writeText(config.textContent);
  tooltip.classList.add('active');
  timer = setTimeout(() => {
      tooltip.classList.remove('active');
  }, 1000);
} 
function ajustes(){
  var clr = '';
  for (var i = 0; i < configuracion.colores.length; i++) {
    clr += "'"+configuracion.colores[i]+"'" + ','
  }
  const str  = 'var configuracion = {\n' +
  '\tnumCirculos:'+configuracion.numCirculos+',\n'+
  '\tradio:'+configuracion.radio+',\n'+
  '\tvelocidad:'+configuracion.velocidad + ',\n' +
  '\tcolorCirculos:'+"'"+configuracion.colorCirculos+"'"+',\n'+
  '\trandomTam:'+configuracion.randomTam+',\n'+
  '\tcirculosConexion:'+configuracion.circulosConexion+',\n'+
  '\tlineasConexion:'+configuracion.lineasConexion+',\n'+
  '\tcirculosMouse:'+configuracion.circulosMouse+',\n'+
  '\tlineasMouse:'+configuracion.lineasMouse+',\n'+
  '\topacidadCirculo:'+configuracion.opacidadCirculo+',\n'+
  '\tcolision:'+configuracion.colision+',\n'+
  '\tcolorConexion:'+"'"+configuracion.colorConexion+"'"+',\n'+
  '\trellenoInteraccion:'+configuracion.rellenoInteraccion+',\n'+
  '\tvelocidadColoreado:'+configuracion.velocidadColoreado+',\n'+
  '\topacidadCircunferencia:'+configuracion.opacidadCircunferencia+',\n'+
  '\tdistanciaConexion:'+configuracion.distanciaConexion+',\n'+
  '\tdistanciaMouse:'+configuracion.distanciaMouse+',\n'+
  '\tanchoCircunferencia:'+configuracion.anchoCircunferencia+',\n'+
  '\tanchoConexion:'+configuracion.anchoConexion+',\n'+
  '\tmasaRandom:'+configuracion.masaRandom+',\n'+
  '\tcolorRandom:'+configuracion.colorRandom+',\n'+
  '\thacker:'+configuracion.hacker+',\n'+
  '\tcolores:['+clr.substring(0,clr.length-1)+']\n}';
   config.textContent = str;
}

ajustes();

removeColor.onclick = function(){
  const option = document.querySelectorAll('option');
  const i = select.selectedIndex;
  if (i-1<0) {
    return;
  }
  configuracion.colores.splice(i-1,1);
  select.removeChild(option[i]);
  ajustes();
  rellenaCirculos();
}

addColor.onclick = function(){
  const option = document.createElement('option');
  option.text = selectedColor.value;
  option.style.color = selectedColor.value;
  option.style.background = selectedColor.value;
  select.appendChild(option);
  //select.style.color = selectedColor.value;
  configuracion.colores.push(selectedColor.value);  
  ajustes();
  rellenaCirculos();
}
select.oninput = function(){
  select.style.color = configuracion.colores[select.selectedIndex-1];
}
colorRandom.oninput = function(){
    configuracion.colorRandom  = colorRandom.checked;
    ajustes();
    rellenaCirculos();
}
hacker.oninput = function(){
  configuracion.hacker = hacker.checked;
  ajustes();
  rellenaCirculos();
}

masaRandom.oninput = function(){
  configuracion.masaRandom = masaRandom.checked;
  ajustes();
  rellenaCirculos();
}
bodyColor.oninput = function(){
  body.style.backgroundColor = bodyColor.value;
}
rellenoInteraccion.oninput = function(){
  configuracion.rellenoInteraccion = rellenoInteraccion.checked;
  ajustes();
  circulos.map((circulo) => circulo.rellenoInteraccion = rellenoInteraccion.checked);
  rellenaCirculos();
}
colorConexion.oninput = function(){
  configuracion.colorConexion = colorConexion.value;
  ajustes();
  circulos.map((circulo) => circulo.colorConexion = colorConexion.value);
}

colorCirculos.oninput = function(){
  if(colorRandom.checked) return;
  configuracion.colorCirculos = colorCirculos.value;
  ajustes();
  circulos.map((circulo) => circulo.color = colorCirculos.value);
}
colision.oninput = function (){
  configuracion.colision = colision.checked;
  ajustes();
  rellenaCirculos();
}

randomTamano.oninput = function (){
  configuracion.randomTam = randomTamano.checked;
  ajustes();
  rellenaCirculos();
}

mouseCirculos.oninput = function (){
  configuracion.circulosMouse = mouseCirculos.checked;
  ajustes();
  circulos.map((circulo)=> circulo.circulosMouse = mouseCirculos.checked);
}
mouseLineas.oninput = function (){
  configuracion.lineasMouse = mouseLineas.checked;
  ajustes();
  circulos.map((circulo) => circulo.lineasMouse=mouseLineas.checked);
}

labelVelocidad.textContent = 'Velocidad: ' + sliderVelocidad.value/10;
sliderVelocidad.oninput = function (){
  labelVelocidad.textContent = 'Velocidad: ' + sliderVelocidad.value/10;
  configuracion.velocidad = sliderVelocidad.value/10;
  ajustes();
  rellenaCirculos();
}
labelVelocidadColoreado.textContent = 'Velocidad coloreado: ' + sliderVelocidadColoreado.value/100;
sliderVelocidadColoreado.oninput = function (){
  labelVelocidadColoreado.textContent = 'Velocidad coloreado: ' + sliderVelocidadColoreado.value/100;
  configuracion.velocidadColoreado = sliderVelocidadColoreado.value/100;
  ajustes();
  rellenaCirculos();
}

labelAnchoConexion.textContent = 'Ancho conexion: ' + sliderAnchoConexion.value/10;
sliderAnchoConexion.oninput = function (){
  labelAnchoConexion.textContent = 'Ancho conexion: ' + sliderAnchoConexion.value/10;
  configuracion.anchoConexion = sliderAnchoConexion.value/10;
  ajustes();
  rellenaCirculos();
}

labelAnchoCircunferencia.textContent = 'Ancho circunferencia: ' + sliderAnchoCircunferencia.value/10;
sliderAnchoCircunferencia.oninput = function (){
  labelAnchoCircunferencia.textContent = 'Ancho circunferencia: ' + sliderAnchoCircunferencia.value/10;
  configuracion.anchoCircunferencia = sliderAnchoCircunferencia.value/10;
  ajustes();
  rellenaCirculos();
}

labelDistanciaMouse.textContent = 'Distancia mouse: ' + sliderDistanciaMouse.value;
sliderDistanciaMouse.oninput = function (){
  labelDistanciaMouse.textContent = 'Distancia mouse: ' + sliderDistanciaMouse.value;
  configuracion.distanciaMouse = sliderDistanciaMouse.value;
  ajustes();
  rellenaCirculos();
}

labelDistanciaConexion.textContent = 'Distancia conexion: ' + sliderDistanciaConexion.value;
sliderDistanciaConexion.oninput = function (){
  labelDistanciaConexion.textContent = 'Distancia conexion: ' + sliderDistanciaConexion.value;
  configuracion.distanciaConexion = sliderDistanciaConexion.value;
  ajustes();
  rellenaCirculos();
}

labelOpacidadCircunferencia.textContent = 'Opacidad circunferencia: ' + sliderOpacidadCircunferencia.value/10
sliderOpacidadCircunferencia.oninput = function (){
  configuracion.opacidadCircunferencia = sliderOpacidadCircunferencia.value/10;
  ajustes();
  labelOpacidadCircunferencia.textContent = 'Opacidad circunferencia: ' + sliderOpacidadCircunferencia.value/10
  rellenaCirculos();
}

labelTamano.textContent = 'Tamaño de circulos: ' + sliderTamano.value
sliderTamano.oninput = function (){
  labelTamano.textContent = 'Tamaño de circulos: ' + sliderTamano.value
  configuracion.radio = sliderTamano.value;
  ajustes();
  rellenaCirculos();
}

labelOpacidad.textContent = 'Opacidad circulos: '+(sliderOpacidad.value/10);
sliderOpacidad.oninput = function (){
  labelOpacidad.textContent = 'Opacidad circulos: '+(sliderOpacidad.value/10);
  configuracion.opacidadCirculo = sliderOpacidad.value/10;
  ajustes();
  circulos.map((circulo) => circulo.opacidadCirculo = sliderOpacidad.value/10);
}
labelCirculos.textContent = 'Número de circulos: '+sliderCirculos.value;
sliderCirculos.oninput = function() {
  labelCirculos.textContent = 'Número de circulos: '+this.value;
  configuracion.numCirculos = sliderCirculos.value;
  ajustes();
  rellenaCirculos();
}
conexionCirculos.oninput = function(){
  circulos.map((circulo) => circulo.circulosConexion = conexionCirculos.checked);
  configuracion.circulosConexion = conexionCirculos.checked;
  ajustes();
}
conexionLineas.oninput = function(){
  circulos.map((circulo) => circulo.lineas = conexionLineas.checked);
  configuracion.lineasConexion = conexionLineas.checked;
  ajustes();
}

function anima(){
 requestAnimationFrame(anima);
 c.clearRect(0,0,innerWidth,innerHeight);
 circulos.map((circulo) => circulo.actualiza(circulos));
}


anima();
