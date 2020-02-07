//CountryGen generates a country, with its cities, landmarks and figures

function Country()
{
	this.name = "";
	this.long_name = "";
	this.population = 0;
	this.cities = [];
	this.capital = null;
	this.universities = [];
	this.figures = [];
}

Country.prototype.toString = function()
{
	var lines = [];
	lines.push("Name: " + this.long_name);
	lines.push("Capital: " + this.capital.name);
	lines.push("Cities: " + this.cities.map((a)=>a.name).join(",") );
	lines.push("Universities: " + this.universities.map((a)=>a.name).join(",") );
	lines.push("Figures: " + this.figures.map((a)=>a.fullname).join(",") );
	lines.push("Currency: " + this.currency);
	return lines.join("\n");
}


function CountryGen()
{
}

CountryGen.getInstance = function()
{
	if(!CountryGen.instance)
		CountryGen.instance = new CountryGen();
	return CountryGen.instance;
}

CountryGen.prototype.generateCountry = function()
{
	var country = new Country();
	country.long_name = CountryGen.generateCountryName();
	country.name = country.long_name.split(" ").pop();

	country.currency = CountryGen.generateName(2);

	//cities
	var cities = country.cities;
	var cities_by_name = {};
	cities.length = 0;
	var num_cities = 10 + rand(5);
	var total_population = 0;
	for(var i = 0; i < num_cities; ++i)
	{
		var city = {};
		city.name = CountryGen.generateCityName();
		city.population = Math.floor(Math.pow( Math.random() + 0.2, 3 ) * 10000) / 10;
		total_population += city.population;
		city.pos = [ rand(100), rand(100) ];
		city.next_to_sea = distance(city.pos, [50,50]) > (30 + rand(10));
		city.universities = [];
		city.figures = [];
		if(!cities_by_name[city.name])
		{
			cities.push(city);
			cities_by_name[city.name] = city;
		}
	}
	cities.sort( (a,b)=>(b.population - a.population) );
	cities[0].capital = true;
	country.capital = cities[0];

	//historical figures
	var figures_by_name = {};
	for(var i = 0; i < 8; ++i)
	{
		var person = LifeGen.createName();

		if(figures_by_name[ person.fullname ])
			continue;

		//person.seed = genSeed();
		person.city = cities.random();
		person.city.figures.push( person );
		country.figures.push( person );
		figures_by_name[ person.fullname ] = person;
	}

	//universities
	var universities = country.universities;
	var universities_by_name = {};
	for(var i = 0; i < num_cities * 0.4; ++i)
	{
		var university = {};
		university.city = cities.random( (country.cities.length * 0.3)|0 );

		if( university.city.universities.length == 0 )
			university.name = CountryGen.data.university_names.random() + " " + university.city.name;
		else
			university.name = CountryGen.data.university_figure + " " + country.figures.random().fullname;

		if(universities_by_name[university.name])
			continue;
		university.city.universities.push( university );
		universities.push( university );
		universities_by_name[university.name] = university;
	}
	//console.log( country.toString() );

	return country;
}

CountryGen.generateName = function( parts, force_ending )
{
	parts = parts || (rand(2) + 2);
	var name = "";
	for(var i = 0; i < parts; ++i)
	{
		if( i == parts - 1 && (rand(6) > 3 || force_ending) )
		{
			var ending = CountryGen.data.city_ends.random();
			if(ending[0].isVowel() && name[ name.length-1 ].isVowel)
				name += CountryGen.data.city_letters.random();
			name += ending;
		}
		else
			name += CountryGen.data.city_parts.random();
	}
	name = name.capitalize();
	return name;
}

CountryGen.generateCountryName = function()
{
	return CountryGen.data.country_prefixes.random() + " " + this.generateName(3,true);
}

CountryGen.generateCityName = function()
{
	var name = this.generateName();
	if(rand(10) > 7)
		name = CountryGen.data.city_prefixes.random() + " " + name;
	return name;
}

CountryGen.data = {
	university_figure: "Universidad",
	university_names: ["Universidad de","Universidad Nacional de","Instituto ","Instituto M�dico de","Universidad Polit�cnica de"],
	country_prefixes: ["","Rep�blica de","Federaci�n de","Rep�blica Federal de","Union de Estados de","Islas","Protectorado de","Union","Principado de "],
	city_parts: ["bue","nos","mar","pla", "ta", "rei", "mi", "guel", "for","mo","sa","ve", "ra", "lar", "po", "sa", "das", "mer", "lo", "quil", "mes", "la", "nus", "he", "ras", "rio", "ja", "tan", "dil", "tem", "o", "va", "ber", "nal", "mai", "ju", "nin", "cam", "pa", "na", "za", "ra", "te", "ri", "va", "da", "ne", "co", "ta", "bla", "da"],
	city_ends: ["ina","ona","il","al","el","cruz","ia","cia"],
	city_letters: ["d","t","m","s","g","f"],
	city_prefixes: ["Rio","Monte","Playa","San","Santa","Puente de","Sol de","Fe de","Puerto","Villa","Paso de"]
};

String.prototype.isVowel = function()
{
	return this[0]=="a" || this[0]=="e" || this[0]=="i" || this[0]=="o" || this[0]=="u";
}