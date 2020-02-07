//LifeGen creates the life of one single person
//it also creates partial lifes for near people
function LifeGen( country )
{
	if(!country)
		country = CountryGen.getInstance().generateCountry();
	this.country = country;
}

LifeGen.MALE = 0;
LifeGen.FEMALE = 1;

LifeGen.getInstance = function()
{
	if(!LifeGen.instance)
		LifeGen.instance = new LifeGen();
	return LifeGen.instance;
}

LifeGen.prototype.createPerson = function(gender)
{
	if(gender === undefined)
		gender = rand(2);

	var person = new Person();
	person.gender = gender;
	person.age = 30 + rand(10);
	person.stats = {
		intelligence: rand(10),
		happiness: rand(10),
		dreams: rand(10)
	}
	
	var name_info = LifeGen.createName(gender);

	person.name = name_info.name;
	person.surname = name_info.surname;
	person.fullname = name_info.fullname;
	var facegen = FaceGen.instance;
	person.face = facegen.createFace( person.gender );

	return person;
}

LifeGen.prototype.generateLife = function( person )
{
	if(!person)
		person = this.createPerson();

	person.born_city = this.country.cities.random().name;
	person.home_city = rand(10) > 7 ? this.country.cities.random().name : person.born_city;

	person.father = this.createPerson( LifeGen.MALE );
	person.father.surname = person.surname;
	person.father.fullname = person.father.name + " " + person.surname;

	person.mother = this.createPerson( LifeGen.FEMALE );

	//childhood
	person.school = LifeGen.data.school[0] + " " + this.country.figures.random().fullname + LifeGen.data.school[1] + person.born_city;

	//youth
	var studies_index = (LifeGen.data.studies.length * Math.random())|0;
	person.studies = LifeGen.data.studies[studies_index];
	if(person.studies)
		person.university = this.country.universities.random();

	//adulthood
	person.job = LifeGen.data.professions[studies_index];

	//partner
	if(!person.partner && rand(5) > 3)
	{
		person.partner = this.createPerson( rand(10) > 7 ? person.gender : ((person.gender+1)%2) );
		person.partner.partner = person;
		person.romance_history = {
			meet: LifeGen.data.partner_meet.random(),
			years: rand(6),
			living_together: !!rand(2)
		}
	}

	return person;
}

LifeGen.createName = function(gender)
{
	if( gender === undefined )
		gender = rand(2);
	var info = {};
	info.name = gender == LifeGen.MALE ? LifeGen.data.men_names.random() : LifeGen.data.women_names.random();
	info.surname = LifeGen.data.surnames.random();
	info.fullname = info.name + " " + info.surname;
	return info;
}

//data
LifeGen.data = {
	men_names: ["Franco", "Lucas", "Matias", "Juan", "Joaquín", "Santiago", "Agustin", "Mauro", "Federico", "Martin", "Ezequiel", "Leandro", "Benjamin", "Pablo", "Tomas", "Fernando", "Valentin", "Alan", "Facundo", "Francisco", "Gabriel", "Thomas", "Luciano", "Ilan", "Fabricio", "Brandon", "Daniel", "Lautaro", "Manuel", "Sergio", "Axel", "Nicolas", "Alejo", "Juan", "Augusto", "Gregorio", "Braian", "Ricardo", "Emiliano", "Dario", "Faustino", "Seba", "Ariel", "Fabian", "Sebastian", "Ariel", "Mateo", "Pedro", "Jose", "Luis", "Nahuel", "Thiago", "Ignacio", "Guido", "Santi", "Víctor", "Marcos", "Segundo", "Jesus", "Esteban", "Walter", "Alex", "Emanuel", "Gonzalo", "Julian", "Horacio", "Iturra", "Eneas", "Boris", "Diego", "Josef", "Rodigo", "Alexander", "Uziel", "Taedio", "Leo", "Tadeo", "Luca", "Homero", "Damian", "Gino", "Dania", "Alberto", "Hurlington", "Milton", "Brandon", "Edgardo", "Alexis", "Matias", "Javier", "Hosa", "Alejandro", "Milco", "Raul", "Mariano", "Agus", "Lulu", "Neron", "Ramiro", "Dylan", "Marino", "Hermann", "David"],
	women_names: ["Camila", "Agustina", "Micaela", "Julieta", "Abril", "Rocío", "Sofia", "Milagros", "Sara", "Valentina", "Paula", "Tania", "Lucia", "Martina", "Victoria", "Carolina", "Ingrid", "Andrea", "Rosario", "Lara", "Paz", "Nadia", "Michelle", "Tatiana", "Giuliana", "Ana", "Juana", "Romina", "Valen", "Meli", "Nerea", "Juliana", "Daiana", "Antonella", "Cami", "Gaby", "Jessica", "Lola", "Daniela", "Magdalena", "Julia", "Cecilia", "Eliana", "Malena", "Maria", "Ayelen", "Aldana", "Felicitas", "Carla", "Belén", "Natalia", "May", "Flavia", "Santiago", "Sasha", "Candela", "Francesca", "Karen", "Mari", "Cande", "Celeste", "Romi", "Gabriela", "Camii", "Lourdes", "Sheila", "Emilia", "Nicole", "Clara", "Ludmi", "Maite", "Stefania", "Sol", "Florencia", "Laura", "Mayra", "Ailen", "Yessica", "Nayla", "Ro", "Magali", "Marina", "Milena", "Lisbet", "Caro", "Agus", "Alejandra", "Araceli", "Mora", "Ka", "Jorgelina", "Constanza", "Jazmin", "Iara", "Anna", "Belu", "Laila", "Ludmilaa", "Sofìa", "Beatriz", "Adriana", "Carla", "Eva"],
	surnames: ["Fernandez","Rodriguez","Gonzalez","Garcia","Lopez","Martinez","Perez","Alvarez","Gomez","Sanchez","Diaz","Vazquez","Castro","Romero","Suarez","Blanco","Ruiz","Alonso","Torres","Dominguez","Gutierrez","Sosa","Iglesias","Gimenez","Ramirez","Martin","Varela","Ramos","Nuñez","Rossi","Silva","Mendez","Hernandez","Flores","Pereyra","Ferrari","Ortiz","Medina","Benitez","Herrera","Arias","Acosta","Moreno","Aguirre","Otero","Cabrera","Rey","Rojas","Vidal","Molina","Russo","Paz","Vega","Costa","Bruno","Romano","Morales","Rios","Miranda","Muñoz","Franco","Castillo","Campos","Bianchi","Luna","Correa","Ferreyra","Navarro","Quiroga","Colombo","Cohen","Pereira","Vera","Lorenzo","Gil","Santos","Delgado","Godoy","Rivas","Rivero","Gallo","Peralta","Soto","Figueroa","Juarez","Marin","Marino","Ponce","Calvo","Ibañez","Caceres","Carrizo","Vargas","Mendoza","Aguilar","Ledesma","Guzman","Soria","Villalba","Prieto","Maldonado","Acuña","Schneider","Cabrero","Boser","Valls"],
	professions: ["accountant", "actor", "air steward", "architect", "assistant", "author", "baker", "biologist", "builder", "butcher", "caretaker", "chef", "civil servant", "clerk", "company director", "computer programmer", "cook", "decorator", "dentist", "designer", "director", "doctor", "economist", "editor", "electrician", "engineer", "executive", "film director", "fishmonger", "flight attendant", "garbage man", "geologist", "hairdresser", "teacher", "jeweler", "journalist", "judge", "lawyer", "lecturer", "library assistant", "entertainer", "makeup artist", "manager", "musician", "nurse", "optician", "painter", "personal assistant", "photographer", "pilot", "plumber", "police officer", "politician", "printer", "receptionist", "salesperson", "scientist", "secretary", "shop assistant", "singer", "surgeon", "tailor", "principal", "telephone operator", "telephonist", "translator", "travel agent", "trucker", "TV cameraman", "TV presenter", "vet", "waiter", "writer"],
	studies: ["accounting", "theater", "", "architecture", "", "literature", "", "biology", "construction", "", "", "cooking", "", "", "business", "computer science", "cooking", "interiorism", "dentistry", "design", "film production", "medical degree", "economy", "journalism", "electrics", "engineering", "business", "filming", "", "", "", "geology", "", "higher education", "", "journalism", "law", "law", "philosophy", "documentalism", "acting", "", "", "music", "nursing", "optics", "fine arts", "", "photography", "aircraft operations", "", "", "politics", "", "", "", "physics", "", "", "", "medical studies", "", "administration", "", "", "languages", "", "", "TV production", "journalism", "animal physiology", "", "linguistics"],
	school: ["Instituto"," de "],
	partner_meet: ["school","institute","course","work place","party","through friends","shopping","library","concert"]
};



//tasks
LifeGen.history = {
	intro: ["This is {name}.","His/Her name is {name}."],
	born: ["He/She was born at {born} in {year}."],
	childhood: ["When he/she was a boy/girl he/she always dreamed with becoming a {job}."]
};





//example

//helpers
Array.prototype.random = function(v){ return this[ Math.floor(Math.random() * (v || this.length)) ]; }
String.prototype.capitalize = function() { return this.charAt(0).toUpperCase() + this.slice(1); }
function distance(a,b) { return Math.sqrt((b[0]-a[0])*(b[0]-a[0]) + (b[1]-a[1])*(b[1]-a[1])); }