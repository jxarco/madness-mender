function FaceGen( on_ready )
{
	FaceGen.instance = this;

	this.pending = 0;
	this.imgs = {};
	this.photo_size = [64,64];

	this.on_ready = on_ready;

	this.HAIR_FRONT = this.loadImage("hair_front", FaceGen.BASE_PATH + "HAIR_FRONT" + FaceGen.BASE_EXTENSION );
	this.HAIR_FRONT_YOUNG = this.loadImage("hair_front_young", FaceGen.BASE_PATH + "HAIR_FRONT_young" + FaceGen.BASE_EXTENSION );
	this.GLASSES = this.loadImage("glasses", FaceGen.BASE_PATH + "GLASSES" + FaceGen.BASE_EXTENSION );
	this.BEARD = this.loadImage("beard", FaceGen.BASE_PATH + "BEARD" + FaceGen.BASE_EXTENSION );
	this.MOUSTACHE = this.loadImage("facial_hair", FaceGen.BASE_PATH + "MOUSTACHE" + FaceGen.BASE_EXTENSION );
	this.FACE = this.loadImage("face", FaceGen.BASE_PATH + "FACE" + FaceGen.BASE_EXTENSION);
	this.FACE_YOUNG = this.loadImage("face_young", FaceGen.BASE_PATH + "FACE_young" + FaceGen.BASE_EXTENSION );
	this.MAKEUP = this.loadImage("makeup", FaceGen.BASE_PATH + "MAKEUP" + FaceGen.BASE_EXTENSION );
	this.HEAD = this.loadImage("head", FaceGen.BASE_PATH + "HEAD" + FaceGen.BASE_EXTENSION );
	this.HEAD_YOUNG = this.loadImage("head_young", FaceGen.BASE_PATH + "HEAD_young" + FaceGen.BASE_EXTENSION );
	this.BODY = this.loadImage("body", FaceGen.BASE_PATH + "BODY" + FaceGen.BASE_EXTENSION );
	this.BODY_YOUNG = this.loadImage("body_young", FaceGen.BASE_PATH + "BODY_young" + FaceGen.BASE_EXTENSION );
	this.HAIR_BACK = this.loadImage("hair_back",FaceGen.BASE_PATH + "HAIR_BACK" + FaceGen.BASE_EXTENSION);
	this.HAIR_BACK_YOUNG = this.loadImage("hair_back_young",FaceGen.BASE_PATH + "HAIR_BACK_young" + FaceGen.BASE_EXTENSION);
	this.LAYERS = [ this.HAIR_BACK, this.BODY, this.HEAD, this.FACE, this.FACE, this.BEARD, this.MOUSTACHE, this.GLASSES, this.HAIR_FRONT ];
	this.LAYERS_YOUNG = [ this.HAIR_BACK_YOUNG, this.BODY_YOUNG, this.HEAD_YOUNG, this.FACE_YOUNG, this.FACE_YOUNG, null, null, null, this.HAIR_FRONT_YOUNG ];
}

FaceGen.HAIR_COLORS = ["#5c5347","#5c4e47","#5c4e47",,"#7d6d57","#484238","#a47e65","#7a5949"];

FaceGen.BASE_PATH = "imgs/caras-pixelart_";
FaceGen.BASE_EXTENSION = ".png";

FaceGen.MALE = 0;
FaceGen.FEMALE = 1;
FaceGen.NUM_GENDER_FACES = 17;
FaceGen.NUM_BASE_FACES = 34;

FaceGen.HAIR_BACK_LAYER = 0;
FaceGen.BODY_LAYER = 1;
FaceGen.HEAD_LAYER = 2;
FaceGen.FACE_DOWN_LAYER = 3;
FaceGen.FACE_UP_LAYER = 4;
FaceGen.BEARD_LAYER = 5;
FaceGen.MOUSTACHE_LAYER = 6;
FaceGen.GLASSES_LAYER = 7;
FaceGen.HAIR_FRONT_LAYER = 8;
FaceGen.NUM_LAYERS = 9;

FaceGen.default_size = [64,64];

//canvas pool
FaceGen.temp_canvas = [];
FaceGen.last_unused_canvas = 0;
FaceGen.getTempCanvas = function()
{
	//TODO
	if( FaceGen.last_unused_canvas < FaceGen.temp_canvas.length )
	{
		FaceGen.last_unused_canvas++;
		var canvas = FaceGen.temp_canvas[ FaceGen.last_unused_canvas - 1];
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0,0,canvas.width,canvas.height);
		return canvas;
	}

	var canvas = document.createElement("canvas");
	canvas.width = FaceGen.default_size[0];
	canvas.height = FaceGen.default_size[1];
	FaceGen.temp_canvas.push( canvas );
	FaceGen.last_unused_canvas++;
	return canvas;
}

FaceGen.resetTempCanvas = function()
{
	FaceGen.last_unused_canvas = 0;
}


//generate face properties
FaceGen.prototype.createFace = function( gender, age )
{
	if(gender === undefined)
		gender = rand(2);
	if(age === undefined)
		age = rand(10) + 16;

	var feminity = rand(10);
	var layer = [];
	for(var i = 0; i < FaceGen.NUM_LAYERS; ++i)
	{
		var v = rand(FaceGen.NUM_GENDER_FACES);
		var g = gender;
		if( rand(10) < 3 && i != 1 ) //switch gender
			g = g == 0 ? 1 : 0;
		if(g == FaceGen.FEMALE)
			v += FaceGen.NUM_GENDER_FACES;
		layer.push( v );
	}

	//not bald women
	if( gender == FaceGen.FEMALE && layer[ FaceGen.HAIR_BACK_LAYER ] < 2 )
		layer[ FaceGen.HAIR_BACK_LAYER ] = rand(FaceGen.NUM_BASE_FACES - 2) + 2; 

	var face_info = {
		layer: layer, //info about which image to take from every layer
		gender: gender,
		age: age,
		feminity: feminity,
		makeup: rand(10),
		baldness: gender == FaceGen.FEMALE ? 0 : rand(10),
		hair_color: rand(FaceGen.NUM_BASE_FACES),
		hair_front_flip: rand(2),
		hair_front: layer[FaceGen.HAIR_FRONT_LAYER],
		glasses: layer[ FaceGen.GLASSES_LAYER ],
		facial_hair: rand(FaceGen.NUM_BASE_FACES),
		face_up: layer[FaceGen.FACE_UP_LAYER],
		face_up_offset: rand(3)-1,
		face_up_separation: rand(3)-1,
		face_down: layer[FaceGen.FACE_DOWN_LAYER],
		face_down_offset: rand(3)-1,
		head: layer[FaceGen.HEAD_LAYER],
		head_scale: rand(3)-1,
		body: layer[FaceGen.BODY_LAYER],
		hair_back: layer[FaceGen.HAIR_BACK_LAYER]
	}

	if(age < 20) //teenager
	{
		face_info.baldness = 0;
		face_info.facial_hair = 0;
		face_info.makeup = 0;
		face_info.glasses = 0;
		face_info.face_up_separation = 0;
		face_info.face_up_offset = 2;
		face_info.face_down_offset = -1;
		face_info.head_scale = -2;
		layer[ FaceGen.GLASSES_LAYER ] = null;
	}

	//face_info.photo = this.generatePhoto( face_info );

	return face_info;
}

//convert face info into an image
FaceGen.prototype.generatePhoto = function( face_info )
{
	var canvas = document.createElement("canvas");
	canvas.width = this.photo_size[0];
	canvas.height = this.photo_size[1];
	var ctx = canvas.getContext("2d");
	ctx.save();
	ctx.imageSmoothingEnabled = false;

	var hair_color = FaceGen.HAIR_COLORS[ face_info.hair_color ] || "#5c5347";

	var layers = [];

	//extract layers (just the image parts)
	for(var i = 0; i < face_info.layer.length; ++i)
	{
		var frame_index = face_info.layer[i];
		if( (i == FaceGen.BEARD_LAYER || i == FaceGen.MOUSTACHE_LAYER) )
		{
			if( face_info.gender == FaceGen.FEMALE ) //women do not have beards nor moustache
				continue;
			if( i == FaceGen.BEARD_LAYER )
				frame_index = face_info.layer[ FaceGen.HEAD_LAYER ];
			if( i == FaceGen.MOUSTACHE_LAYER )
				frame_index = face_info.layer[ FaceGen.FACE_DOWN_LAYER ];
		}
		if( i == FaceGen.BODY_LAYER )
			frame_index = frame_index % (FaceGen.NUM_BASE_FACES*0.5) + (face_info.gender == FaceGen.FEMALE ? (FaceGen.NUM_BASE_FACES*0.5) : 0);

		var flip = false;
		var offset_y = 0;
		var scale_y = 0;

		if( i == FaceGen.HAIR_FRONT_LAYER )
		{
			flip = face_info.hair_front_flip;
			if(face_info.baldness > 7 )
				continue;
		}
		if( i == FaceGen.HEAD_LAYER || i == FaceGen.BEARD_LAYER)
			scale_y = face_info.head_scale;
		if( i == FaceGen.FACE_UP_LAYER || i == FaceGen.GLASSES_LAYER )
			offset_y = face_info.face_up_offset;
		if( i == FaceGen.FACE_DOWN_LAYER || i == FaceGen.MOUSTACHE_LAYER )
			offset_y = face_info.face_down_offset;

		layers[i] = this.extractLayer( face_info, i, frame_index, flip, offset_y, scale_y );
		if(!layers[i])
			continue;

		if(i == FaceGen.FACE_UP_LAYER && face_info.face_up_separation )
			layers[i] = FaceGen.separateImage( layers[i], -face_info.face_up_separation, face_info.face_up_separation );


		if(i == FaceGen.BEARD_LAYER || i == FaceGen.MOUSTACHE_LAYER || i == FaceGen.HAIR_FRONT_LAYER || i == FaceGen.HAIR_BACK_LAYER )
			layers[i] = FaceGen.colorizeImage( layers[i], FaceGen.HAIR_COLORS[ face_info.hair_color % FaceGen.HAIR_COLORS.length ] );
	}

	//combine layers
	for(var i = 0; i < layers.length; ++i)
	{
		var layer = layers[i];
		if(!layer) //layers could be null
			continue;
	
		ctx.save();
		//0-3 nothing, 4-6 moustache, 7-14 short beard, 15...: long beard
		if( i == FaceGen.BEARD_LAYER )
		{
			if( face_info.facial_hair < 7 )
			{
				ctx.restore();
				continue;
			}
			else if( face_info.facial_hair >= 7 && face_info.facial_hair <= 14 )
			{
				FaceGen.applyMask( layer, layers[ FaceGen.HEAD_LAYER ] );
				ctx.globalAlpha = (face_info.facial_hair - 6) / (7);
			}
		}
		else if( i == FaceGen.MOUSTACHE_LAYER )
		{
			if( face_info.facial_hair < 4 )
			{
				ctx.restore();
				continue;
			}
		}

		ctx.drawImage( layer, 0,0 );
		ctx.restore();
	}

	ctx.restore();
	FaceGen.resetTempCanvas();
	return canvas;
}

FaceGen.applyMask = function( image, mask )
{
	var ctx = image.getContext("2d");
	ctx.save();
	ctx.globalCompositeOperation = "destination-in";
	ctx.drawImage( mask, 0, 0 );
	ctx.restore();
	return image;
}

FaceGen.cloneImage = function( image, flip_x )
{
	/*
	var canvas = document.createElement("canvas");
	canvas.width = image.width;
	canvas.height = image.height;
	*/
	var canvas = FaceGen.getTempCanvas();
	var ctx = canvas.getContext("2d");
	ctx.save();
	ctx.imageSmoothingEnabled = false;
	if(flip_x)
	{
		ctx.translate(image.width,0);
		ctx.scale(-1,1);
	}
	ctx.drawImage(image,0,0);
	ctx.restore();
	return canvas;
}


FaceGen.cropImage = function( image, x,y, w, h )
{
	var canvas = FaceGen.getTempCanvas();
	//var canvas = document.createElement("canvas");
	//canvas.width = w;
	//canvas.height = h;
	var ctx = canvas.getContext("2d");
	ctx.drawImage( image, x, y, w, h, 0,0,w,h);
	return canvas;
}

FaceGen.separateImage = function( image, l, r )
{
	var canvas = FaceGen.getTempCanvas();
	var ctx = canvas.getContext("2d");
	var w = image.width;
	var h = image.height;
	ctx.drawImage( image, 0, 0, w*0.5, h, l,0,w*0.5,h);
	ctx.drawImage( image, w*0.5, 0, w*0.5, h, w*0.5+r,0,w*0.5,h);
	return canvas;
}

FaceGen.colorizeImage = function( image, color )
{
	var canvas = FaceGen.getTempCanvas();
	//var canvas = document.createElement("canvas");
	//canvas.width = image.width;
	//canvas.height = image.height;
	var ctx = canvas.getContext("2d");
	ctx.save();
	ctx.drawImage( image, 0, 0 );

	if(color)
	{
		ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = "source-in"; //test "color"
		ctx.fillStyle = color;
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.globalAlpha = 1;
	}

	ctx.restore();
	return canvas;
}

FaceGen.prototype.extractLayer = function( face, layer_index, frame_index, flip_x, offset_y, scale_y )
{
	var canvas = FaceGen.getTempCanvas();
	//var canvas = document.createElement("canvas");
	//canvas.width = this.photo_size[0];
	//canvas.height = this.photo_size[1];
	var ctx = canvas.getContext("2d");
	ctx.save();
	ctx.imageSmoothingEnabled = false;

	var layers = face.age < 20 ? this.LAYERS_YOUNG : this.LAYERS;

	var image = layers[ layer_index ];
	if(!image) //no layer
		return null;
	var w = 64;
	var h = 64;
	offset_y = offset_y || 0;

	var x = (frame_index % FaceGen.NUM_GENDER_FACES)*w;
	var y = Math.floor(frame_index / FaceGen.NUM_GENDER_FACES);

	if(frame_index < FaceGen.NUM_GENDER_FACES)
		y *= h;
	else
		y *= h*2;

	switch(layer_index)
	{
		case FaceGen.FACE_UP_LAYER: 
			ctx.drawImage( image, x, y, w,h*0.5,0,offset_y,w,h*0.5);
			if(face.gender == FaceGen.FEMALE && face.makeup > 3 && face.age > 20)
			{
				var makeup = FaceGen.cropImage( this.MAKEUP, x, y, w,h*0.5 );
				ctx.drawImage( makeup, 0,offset_y );
			}
			break;
		case FaceGen.FACE_DOWN_LAYER: 
			ctx.drawImage( image, x, y+h*0.5, w,h*0.5,0,h*0.5+offset_y,w,h*0.5);
			if(face.gender == FaceGen.FEMALE && face.makeup > 6 && face.age > 20)
			{
				var makeup = FaceGen.cropImage( this.MAKEUP, x, y+h*0.5, w,h*0.5 );
				if( face.makeup > 8 )
					makeup = FaceGen.colorizeImage( makeup, "#D9C" );
				ctx.drawImage( makeup, 0,h*0.5+offset_y);
			}
			break;
		case FaceGen.GLASSES_LAYER: 
			ctx.drawImage( image, x, y, w,h*0.5,0,offset_y,w,h*0.5);
			ctx.globalAlpha = 0.3;
			ctx.drawImage( image, x, y+h*0.5, w,h*0.5,0,offset_y,w,h*0.5);
			ctx.globalAlpha = 1;
			break;
		default:
			ctx.drawImage( image, x, y, w, h, 0,offset_y,canvas.width,canvas.height + scale_y);
			break;
	}
	ctx.restore();
	return FaceGen.cloneImage( canvas, flip_x );
}

FaceGen.prototype.loadImage = function( name, url )
{
	++this.pending;
	var that = this;
	var img = new Image();
	img.src = url;
	this.imgs[name] = img;
	img.onload = function()
	{
		--that.pending;
		if(that.pending == 0)
		{
			if(that.on_ready)
				that.on_ready();
		}
	}
	return img;
}

function rand(n) { return (Math.random()*n)|0; }
function clamp(v,min,max) { return (v < min) ? min : (v > max ? max : v); }
