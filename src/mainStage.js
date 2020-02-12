var MAX_SANITY_CHANGE_TIME = 300;

var stage_message = null;
var imgs_loaded = 0;

var sanity_change_time = 0;
var last_sanity_change = false;

var MAINSTAGE = {
	
	name: "main",
	enabled: true,

	scene_files: [
		{name: "full_sanity", path: "data/sanity_full.png"},
		{name: "empty_sanity", path: "data/sanity_empty.png"},
		{name: "desk", path: "data/Desk.png"},
		{name: "chair", path: "data/Chair.png"},
		{name: "sup", path: "data/san-up.png"},
		{name: "sdown", path: "data/san-down.png"}
	],

	imgs: {},

	init: function( name, gender )
	{
		this.facegen = new FaceGen( MAINSTAGE.createPerson.bind(MAINSTAGE) );
		var that = this;

		var path = gender ? "imgs/woman_back.png" : "imgs/man_back.png";

		// load character
		var photo = new Image(this.facegen.photo_size[0], this.facegen.photo_size[1]);
		photo.src = path;
		photo.onload = function()
		{
			console.log("%c" + path + " loaded", "font-weight: bold; color: orange;");
		}

		this.character = new Character(photo, gender, name);

		for(var i = 0; i < this.scene_files.length; i++)
		{
			let my_file = this.scene_files[i];
			var img = new Image();
			img.src = my_file.path;
			img.onload = function(e)
			{
				that.imgs[my_file.name] = e.target;
				imgs_loaded++;
			}
		}
	},

	createPerson: function()
	{
		var lifegen = LifeGen.getInstance();
		this.person = lifegen.generateLife();
		var facegen = this.facegen;
		var face_info = facegen.createFace( this.person.gender, 30 );
		this.person.photo = facegen.generatePhoto( face_info );
		this.person.fadeIn();
		console.log(this.person);
		
		this.person.sanity = this.person.stats["intelligence"];
		this.person.sanity += this.person.stats["happiness"];
		this.person.sanity += this.person.stats["dreams"];
		this.person.sanity /= (3*2); // decrease to have something to repair (max is 0.5)

		this.state = "CLIENT";
		setTimeout(this.logic.bind(this), 1000);
	},

	computeScore: function()
	{
		var score = 3 * Math.random() * (!Math.floor(Math.random()*2) ? -1 : 1);
		// console.log("score is " + score);

		if(score > 0)
			last_sanity_change = true;
		else 
			last_sanity_change = false;

		sanity_change_time = MAX_SANITY_CHANGE_TIME;

		return score;
	},

	logic: function( state){
		
		this.state = state || this.state;

		// console.log("LOGIC STATE", this.state);		

		switch(this.state){
			case "CLIENT":{

				this.character.initCards();
				this.state = "DOCTOR";

				this.character.generateSalute( this.person )
				.then(this.person.generateDrama.bind( this.person ))
				.then(this.logic.bind(this));
				break;
			}  
					
			case "DOCTOR":
			{	
				this.character.Verb = null;
				this.character.Noun = null;
				
				// Aqui al usuario ya le han mostraod las cartas
				// tiene que elegir
				this.character.showCards();
				break;
			} 	

			case "MESSAGE":{
				this.character.generateMessage( this.person )
				.then( this.person.generateResponse.bind( this.person ) )
				.then( sanity => {

					if(this.person.sanity < 0)
						this.logic("BROKEN");
					else if(this.person.sanity > 10)
						this.logic("REPAIRED");
					// continue logic with same person
					else
						this.logic("DOCTOR");
				});
				break;
			}

			case "REPAIRED":	{
				this.person.sayGoodbye(this.character); // then...
				break;
			}

			case "BROKEN":
			{
				this.person.sayFuckYou(this.character); // then...
				break;
			}
		}
	},

	

	onEnable: function()
	{
		console.log("%cEntering mainstage", "color: red; font-size: 14px;");
	},
	
	onDisable: function()
	{
		
	},

	draw: function(ctx, canvas)
	{
		sanity_change_time --;

		if(imgs_loaded != this.scene_files.length)
		return;

		ctx.fillStyle="#b6ada2";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.fillStyle="black";

		if( !this.person )
		{
			drawText("Loading...",100,100);
			return;
		}
		
		ctx.imageSmoothingEnabled = false;
		

		var person_sanity = this.person.sanity / 10; // de 0 a 1;
		var a = 512 * (1-person_sanity);

		if(this.imgs["full_sanity"])
			ctx.drawImage( this.imgs["full_sanity"], a , 0, 512, 32, canvas.width - 256 - 15 + a/2, 15, 256, 16);
		if(this.imgs["empty_sanity"])
			ctx.drawImage( this.imgs["empty_sanity"], canvas.width - 256 - 15 , 15, 256, 16);
		
		// draw arrow
		if(this.imgs["sup"] && this.imgs["sdown"] && sanity_change_time > 0)
		{
			ctx.globalAlpha = sanity_change_time / MAX_SANITY_CHANGE_TIME;

			if(last_sanity_change)
				ctx.drawImage( this.imgs["sup"],  canvas.width - 256 - 40 , 15, 16, 16);
			else
				ctx.drawImage( this.imgs["sdown"], canvas.width - 256 - 40 , 15, 16, 16);

			ctx.globalAlpha = 1;
			
		}

		if(this.imgs["chair"])
			ctx.drawImage( this.imgs["chair"], canvas.width / 2 - 64, canvas.height - 245, 128, 128);
		this.person.draw(ctx, canvas);
		if(this.imgs["desk"])
			ctx.drawImage( this.imgs["desk"], canvas.width / 2 - 256, canvas.height - 170);
		this.character.draw(ctx, canvas);

		// render other text
		if(!stage_message)
		return;

		// character
		var posX = (canvas.width >> 1);
		var posY = canvas.height - 300;
		
		// person
		if(stage_message.type == 2)
			posX = (canvas.width >> 1) - (canvas.width >> 2);
		
		if(stage_message.text.length < 25)
		{
			drawText(stage_message.text, posX,posY);
			return;
		}

		var string = stage_message.text;
		var origin = (string.length  % 2 == 0) ? string.length / 2 : (string.length + 1) / 2;
		var index = origin - 1;

		// search index to divide
		for(var i = origin - 1; i <= string.length; i++)
			if(string[i] === ' '){
				index = i;
				break;
			}

		var sub0 = stage_message.text.substr(0, index)
		var sub1 = stage_message.text.substr(index + 1, stage_message.text.length)

		drawText(sub0, posX,posY);
		drawText(sub1, posX,posY + 20);
	},

	update: function(dt)
	{

	},
	
	onmouse: function(e)
	{
		if(e.type == "mousedown")
		{
			// this.createPerson();
		}
	},
	
	onkeydown: function(e)
	{
		if(e.keyCode == 32)
		{
			this.createPerson();
		}
		else if(e.keyCode == 13)
		{
			
		}
	}
};

CORE.addStage( MAINSTAGE );