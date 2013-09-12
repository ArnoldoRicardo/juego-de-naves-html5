//objetos importantes de canvas
var canvas = document.getElementById('game');
var ctx = canvas.getContext("2d");

//objetos del juego
var nave = {
	x: 100,
	y: canvas.height - 100,
	width: 50,
	height: 50,
	counter: 0
};

var game = {
	state: "start"
};
var answerText ={
	counter: -1,
	title: "",
	subtitle: ""
};

var keyboard = {};

//arrays del juego
var shoots = [];
var invaderShoots = [];
var invaders = [];

//variables para las imagenes
var fondo, imgshoot, imgInvader, imgInvaderShoot, imgSpaceShip;

//definicion de funciones
function loadMedia(){
	/*cargar multimedia*/
	fondo = new Image();
	fondo.src = 'img/space.jpg';

	imgshoot = new Image();
	imgshoot.src = "img/laser.png";

	imgInvader = new Image();
	imgInvader.src = "img/monster.png";

	imgInvaderShoot = new Image();
	imgInvaderShoot.src = "img/enemyLaser.png";

	imgSpaceShip = new Image();
	imgSpaceShip.src = "img/spaceship.png";

	fondo.onload = function(){
		var intervalo = window.setInterval(frameLoop,1000/55);
	}
}

function drawInvaders(){
	for(var i in invaders){
		var invader = invaders[i];
		/*ctx.save();
		if(invader.state == "alive") ctx.fillStyle = "red";
		if(invader.state == "dead") ctx.fillStyle = "white";
		ctx.fillRect(invader.x,invader.y,invader.width,invader.height);
		ctx.restore();*/
		ctx.drawImage(imgInvader,invader.x,invader.y,invader.width,invader.height);
	}
}

function drawBackground(){
	ctx.drawImage(fondo,0,0);
}

function drawSpaceship(){
	/*ctx.save();
	ctx.fillStyle = "white";
	ctx.fillRect(nave.x,nave.y,nave.width,nave.height);
	ctx.restore();*/
	ctx.drawImage(imgSpaceShip,nave.x,nave.y,nave.width,nave.height);
}

function addKeyboardEvents(){
	addEvent(document,"keydown",function(e){
		//ponemos en true la tecla presionada
		keyboard[e.keyCode] = true;
	});

	addEvent(document,"keyup",function(e){
		//ponemos en falso la tecla presionada
		keyboard[e.keyCode] = false;
	});

	function addEvent(element,nameEvent,funcion){
		if(element.addEventListener){
			//navegadores de verdad
			element.addEventListener(nameEvent,funcion,false);
		}
		else if(element.attachEvent){
			//internet exporer
			element.attachEvent(nameEvent,funcion);
		}
	}
}

function moveSpaceship(){
	if(keyboard[37]){
		//movimiento a la izquierda
		nave.x -= 7;
		if(nave.x < 0) nave.x = 0;
	}
	
	if(keyboard[39]){
		//movimiento a la derecha
		var limit = canvas.width - nave.width;
		nave.x += 7;
		if(nave.x > limit) nave.x = limit;
	}

	if(keyboard[32]){
		//trigger de disparo
		if (!keyboard.fire){
		fire();
			keyboard.fire = true;
		}
	}
	else keyboard.fire = false;

	if(nave.state == "hit"){
		nave.counter++;
		if(nave.counter >=20){
			nave.counter = 0;
			nave.state = "dead";
			game.state = "over";
			answerText.title = "Game over";
			answerText.subtitle = "Presiona la telca R para continuar";
			answerText.counter= 0;
		}
	}
}

function drawInvaderShoot(){
	for(var i in invaderShoots){
		var shoot = invaderShoots[i];
		/*ctx.save();
		ctx.fillStyle = "yellow";
		ctx.fillRect(shoot.x, shoot.y, shoot.width, shoot.height);
		ctx.restore();*/
		ctx.drawImage(imgInvaderShoot,shoot.x, shoot.y, shoot.width, shoot.height);
	}
}

function moveInvaderShoot(){
	for(var i in invaderShoots){
		var shoot = invaderShoots[i];
		shoot.y += 3;
	}
	invaderShoots = invaderShoots.filter(function(shoot){
		return shoot.y < canvas.height;
	});
}

function updateInvaders(){
	function addInvaderShoots(invader){
		return {
			x: invader.x,
			y: invader.y,
			width: 10,
			height: 33,
			counter: 0
		};
	}

	if(game.state == "start"){
		for(var i = 0;i<10;i++){
			invaders.push({
				x: 10 + (i*50),
				y: 10,
				width: 40,
				height: 40,
				state: "alive",
				counter: 0
			});
		}
		game.state = "playing";
	}
	for(var i in invaders){
		var invader = invaders[i];
		if(!invader) continue;
		if(invader && invader.state =="alive"){
			invader.counter++;
			invader.x += Math.sin(invader.counter * Math.PI /90)*5;

			if(aleatorio(0,invaders.length * 10) == 4){
				invaderShoots.push(addInvaderShoots(invader));
			}

		}
		if(invader && invader.state == "hit"){
			invader.counter++;
			if(invader.counter >=20){
				invader.state = "dead";
				invader.counter = 0;
			}
		}
	}
	invaders = invaders.filter(function(enemigo){
		if(enemigo && enemigo.state != "dead") return true;
		return false;
	});
}

function moveShoots(){
	for(var i in shoots){
		var shoot = shoots[i];
		shoot.y -= 2;
	}
	shoots = shoots.filter(function(shoot){
		return shoot.y > 0;
	});
}

function fire(){
	shoots.push({
		x: nave.x + 20,
		y: nave.y - 10,
		width: 10,
		height: 30
	});
}

function drawShoots(){
	ctx.save();
	ctx.fillStyle = "white";
	for(var i in shoots){
		shoot = shoots[i];
		//ctx.fillRect(shoot.x,shoot.y,shoot.width,shoot.height);
		ctx.drawImage(imgshoot,shoot.x,shoot.y,shoot.width,shoot.height);
	}
	ctx.restore();
}

function drawAnswerText(){
	if(answerText.counter == -1) return;
	var alpha = answerText.counter/50.0;
	if(alpha>1){
		for(var i in invaders){
			delete invaders[i];
		}
	}
	ctx.save();
	ctx.globalAlpha = alpha;
	if(game.state == "over"){
		ctx.fillStyle = "white";
		ctx.font = "Bold 40pt Arial";
		ctx.fillText(answerText.title,140,200);
		ctx.font = "14pt Arial";
		ctx.fillText(answerText.subtitle,190,250);
	}
	if(game.state == "win"){
		ctx.fillStyle = "white";
		ctx.font = "Bold 40pt Arial";
		ctx.fillText(answerText.title,140,200);
		ctx.font = "14pt Arial";
		ctx.fillText(answerText.subtitle,190,250);
	}
	ctx.restore();
}

function updateGameState(){
	if(game.state == "playing" && invaders.length == 0){
		game.state = "win";
		answerText.title = "Derrotaste a los enemigos";
		answerText.subtitle = "presiona la tecla R para reiniciar";
		answerText.counter = 0;
	}
	if(answerText.counter >= 0){
		answerText.counter++;
	}
	if((game.state == "over" || game.state == "win") && keyboard[82]){
		game.state = "start";
		nave.state = "alive";
		answerText.counter = -1;
	}
}

function hit(a,b){
	/*algoritmo de colision*/
	var hit = false;
	if(b.x + b.width >= a.x && b.x < a.x + a.width){
		if(b.y + b.height >= a.y && b.y < a.y + a.height){
		hit = true;
		}
	}
	if(b.x <= a.x && b.x + b.width >= a.x + a.width){
		if(b.y <= a.y && b.y + b.height >= a.y + a.height){
			hit = true;
		}
	}
	if(a.x <= b.x && a.x + a.width >= b.x + b.width){
		if(a.y <= b.y && a.y + a.height >= b.y + b.height){
			hit = true;
		}
	}

	return hit;
}

function checkHit(){
	/*chequeo de colisiones entre disparos y naves*/

	//colicion entre disparos y enemigos
	for(var i in shoots){
		var shoot = shoots[i];
		for (var j in invaders){
			var invader = invaders[j];
			if(hit(shoot,invader)){
				invader.state = "hit";
				invader.counter = 0;
			}
		}
	}

	//colicion entre disparos y hero
	if(nave.state == "hit" || nave.state == "dead") return;
	for(var i in invaderShoots){
		var shoot = invaderShoots[i];
		if(hit(shoot,nave)){
			nave.state = "hit";
			console.log("contacto");
		}
	}
}

function aleatorio(inferior,superior){
	/*Genera numeros aleorios*/
	var posibilidades = superior - inferior;
	var a = Math.random() * posibilidades;
	a = Math.floor(a);
	return parseInt(inferior + a);
}

function frameLoop(){
	/*bucle del juego*/
	updateGameState();
	//movimientos de los invasores
	updateInvaders();
	//movimientos del heroe
	moveSpaceship();
	//movimiento de disparos
	moveShoots();
	moveInvaderShoot();
	//draw
	drawBackground();
	drawSpaceship();
	drawInvaders();
	drawInvaderShoot();
	drawShoots();
	drawAnswerText();
	//chequeo de coliciones
	checkHit();
}

//ejecucion del juego
loadMedia();
addKeyboardEvents();