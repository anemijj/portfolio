let nombresImg = ['cardigan.png', 'jean.png', 'jeanpollera.png', 'pantalonblanco.png', 'sambaadidas.png', 'top.png', 'sweatergris.png', 'remeazul.png', 'cartera.png', 'chalecoblanco.png', 'uggs.png', 'puffer.png'];
let nombresPrendas = ['Cardigan', 'Jean','Pollera Denim Negra', 'Pantalon Blanco', 'Adidas Samba', 'Top Beige', 'Sweater Gris', 'Remera Azul', 'Longchamp Gris', 'Chaleco Blanco', 'Uggs', 'Puffer' ]; 

let objetosImg = []; 
let duplicados = []; 
let carrito = []; 
let draggingIndex = -1; 
let offsetX, offsetY; 
let colorPicker;
let saveButton;

const maxColumnHeight = 700;  
const columnSpacing = 250;    

function preload() {
  for (let i = 0; i < nombresImg.length; i++) {
    let lImg = loadImage('imagenes/looks/clean/' + nombresImg[i]);
    objetosImg.push({ img: lImg, nombre: nombresPrendas[i], x: 150, y: 0 });
  }
}

function setup() {
  createCanvas(1920, 1280);

  colorPicker = createColorPicker('#ffffff');
  colorPicker.position(1345, 320);
  colorPicker.addClass("picker");

  background(220);
  rectMode(CENTER);
  textFont('Italiana');
  textSize(100);
  textAlign(CENTER, CENTER);

  saveButton = createButton('Guardar');
  saveButton.position(1340, 370);
  saveButton.mousePressed(guardarLookBook);
  saveButton.addClass("guardar");

  for (let i = 0; i < objetosImg.length; i++) {
    objetosImg[i].width = objetosImg[i].img.width;
    objetosImg[i].height = objetosImg[i].img.height;
  }

  createImageElements();
}

function draw() {
  background(220);
  
  let rectX = width * 0.5;
  let rectY = 700;
  let rectWidth = 700;
  let rectHeight = 800;
  let textX = width * 0.5;
  let textY = 150;

  fill(0);
  text('Digital LookBook', textX, textY);

  if (colorPicker) {
    noStroke();
    fill(colorPicker.color());  
    rect(rectX, rectY, rectWidth, rectHeight, 80);
  }

  for (let i = 0; i < duplicados.length; i++) {
    let dup = duplicados[i];
    image(dup.img, dup.x, dup.y, dup.width, dup.height);
  }

 
  let iPrenda = 250;
  for (let i = 0; i < objetosImg.length; i++) {
    let prenda = objetosImg[i];
    image(prenda.img, prenda.x, prenda.y, prenda.width * 0.5, prenda.height * 0.5);
    iPrenda += prenda.height * 0.5 + 10; 
  }

  push();
  fill(0);
  textSize(30);
  textAlign(LEFT, TOP);
  let carritoX = rectX + rectWidth / 2 + 50;
  let carritoY = 500;
  text("Carrito de Compra:", carritoX, carritoY);
  carritoY += 30;
  for (let i = 0; i < carrito.length; i++) {
    text(carrito[i], carritoX, carritoY);
    carritoY += 30;
  }
  pop();
}


function createImageElements() {
  let columnX = 150;  
  let initialY = 250; 
  let maxColumnHeight = 900; 
let columnSpacing = 200; 
  let currentColumnHeight = 0;
  let maxY = initialY + maxColumnHeight; 

  for (let i = 0; i < objetosImg.length; i++) {
    let prenda = objetosImg[i];

    if (initialY + currentColumnHeight + prenda.height * 0.5 > maxY) {
      // Mueve a la siguiente columna si se alcanza la altura máxima
      columnX += columnSpacing;
      currentColumnHeight = 0;
    }

    prenda.x = columnX;
    prenda.y = initialY + currentColumnHeight;
    currentColumnHeight += prenda.height * 0.5 + 10;

    let imgElement = createImg('imagenes/looks/clean/' + nombresImg[i]);
    imgElement.position(prenda.x, prenda.y);
    imgElement.size(prenda.width * 0.5, prenda.height * 0.5);
    imgElement.addClass('prenda-img');
  }
}


function updateImageElements() {
  let imgElements = selectAll('.prenda-img');
  for (let i = 0; i < imgElements.length; i++) {
    let prenda = objetosImg[i];
    let imgElement = imgElements[i];
    imgElement.position(prenda.x, prenda.y);
  }
}


function mousePressed() {
  for (let i = 0; i < objetosImg.length; i++) {
    let prenda = objetosImg[i];
    if (mouseX > prenda.x && mouseX < prenda.x + prenda.width * 0.5 && mouseY > prenda.y && mouseY < prenda.y + prenda.height * 0.5) {
      let rectX = width * 0.5;
      let rectY = 700;
      let rectWidth = 700;
      let rectHeight = 800;
      let rectLeft = rectX - rectWidth / 2;
      let rectRight = rectX + rectWidth / 2;
      let rectTop = rectY - rectHeight / 2;
      let rectBottom = rectY + rectHeight / 2;

      let dupX = random(rectLeft, rectRight - prenda.width);
      let dupY = random(rectTop, rectBottom - prenda.height);

      duplicados.push({ img: prenda.img, x: dupX, y: dupY, width: prenda.width, height: prenda.height });
      carrito.push(prenda.nombre);

      break;
    }
  }

  for (let i = 0; i < duplicados.length; i++) {
    let dup = duplicados[i];
    if (mouseX > dup.x && mouseX < dup.x + dup.width && mouseY > dup.y && mouseY < dup.y + dup.height) {
      if (mouseButton === RIGHT) {
        duplicados.splice(i, 1);
        carrito.splice(i, 1);
      } else {
        draggingIndex = i;
        offsetX = mouseX - dup.x;
        offsetY = mouseY - dup.y;
      }
      break;
    }
  }
}

function mouseDragged() {
  if (draggingIndex !== -1) {
    duplicados[draggingIndex].x = mouseX - offsetX;
    duplicados[draggingIndex].y = mouseY - offsetY;
  }
}

function mouseReleased() {
  draggingIndex = -1;
}

function keyPressed() {
  if (keyCode === DELETE || keyCode === BACKSPACE) {
    if (draggingIndex !== -1) {
      duplicados.splice(draggingIndex, 1);
      carrito.splice(draggingIndex, 1);
      draggingIndex = -1;
    }
  }
}

function guardarLookBook() {
  let lienzoTexto = get(580, 270, 1080, 860);
  lienzoTexto.save('digital_lookbook', 'jpg');
}