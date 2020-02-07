var MALE = 0;
var FEMALE = 1;

function Person()
{
	this.name = "";
	this.gender = -1;
	this.age = 0,
	this.stats = {}
	this.face = null;
	this.photo = null;
	this.max_sanity = 1;
	this.sanity = null;
	this.log = [];
}

Person.prototype.generateSalute = async function( character )
{
	
	return new Promise((function(success, reject){
		
		var salutations = [
			"Hi, I'm " + this.name,
			"Hi Doctor!!",
			`Hello ${character.name}`,
		];

		var salute = salutations[Math.floor(Math.random() * salutations.length)];
		this.log.push(salute);

		stage_message = {text:salute, type: 2};

		setTimeout(success, 3000/*  + Math.floor(Math.random() * 1000 */);
	}).bind(this));
}

Person.prototype.generateDrama = async function(){

	return new Promise((function(success, reject){
		
		var phrases = [
			'Saddest',
			'Very very sad',
			'Very sad',
			'So sad',
			'Sad',
			'Little sad',
			'Not good',
			'Don\'t mind',
			'Happy!',
		];
	
		var drama = phrases[Math.floor((this.sanity/10) * phrases.length)];
		this.log.push(drama);

		stage_message = {text:drama, type: 2};

		setTimeout(function(){

			success();

		}, 2000/*  + Math.floor(Math.random() * 1000) */);



	}).bind(this));
}

Person.prototype.sayGoodbye = async function( character ){
	return new Promise((function(success, reject){
		
		this.phrases = [
			'Thank you!!!',
			'Omg I\' so happy now!',
			`I'm so good now, thanks ${character.name}!`
		];
	
		var drama = this.phrases[Math.floor(Math.random() * this.phrases.length)];
		this.log.push(drama);

		stage_message = {text:drama, type: 2};

		setTimeout(success, 1000 + Math.floor(Math.random() * 1000));
	}).bind(this));
}

Person.prototype.sayFuckYou = async function( character ){
	return new Promise((function(success, reject){
		
		this.phrases = [
			'Filho d puta!',
			'Pero bueno gentuzo!',
			`${character.name}, you are a bad person:(!`
		];
	
		var drama = this.phrases[Math.floor(Math.random() * this.phrases.length)];
		this.log.push(drama);

		stage_message = {text:drama, type: 2};

		setTimeout(success, 1000 + Math.floor(Math.random() * 1000));
	}).bind(this));
}


Person.prototype.fadeIn = function(){}
Person.prototype.fadeOut = function(){}


Person.prototype.draw = function(ctx,canvas)
{
	var INFOS = 3;

	drawText((Math.floor(this.sanity*10)) + "%",canvas.width - 42,16);
	drawText(this.fullname, 30, 16);
	drawText(this.studies !== "" ? "Studied " + this.studies : "No studies", 30,31);

	var job_string = this.job !== "" ? "and now working as " + (this.job[0].isVowel() ? "an " : "a ") + this.job : "and doesn't have a job";
	drawText(job_string, 30,46);

	ctx.strokeRect(25, 12, job_string.length * 7 + 10, 17 * INFOS);

	var x = Math.floor(Math.sin(performance.now() * 0.0001) * 2);
	ctx.drawImage( this.photo, canvas.width/2 - 42, canvas.height - 254 - x, 84, 84 );
}