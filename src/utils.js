
var DEG2RAD = 0.0174532925;

var imgs = {};
pending = 0;
var PIXEL_FONT = loadImage("font","data/bitmapfont_7x14.png");
var font_width = 7;
var on_all_loaded = null;
function loadImage( name, url )
{
	++pending;
	var img = new Image();
	img.src = url;
	imgs[name] = img;
	img.onload = function()
	{
		--pending;
		if(on_all_loaded && pending == 0)
			on_all_loaded();
	}
	return img;
}

function drawText( text, x, y )
{
	var posx = x;
	var posy = y;
	for(var i = 0;i < text.length; ++i)
	{
		var code = text.charCodeAt(i);
		var x = (code % 16) * 14;
		var y = Math.floor(code / 16) * 14;
		ctx.drawImage( PIXEL_FONT, x,y,7,14,posx,posy,7,14);
		posx += 7;
	}
}

function drawRotatedImage( ctx, image, angle, posX, posY, axisX, axisY, frame )
{
	ctx.save();
	ctx.translate(posX, posY);
	ctx.rotate(angle*DEG2RAD);
	ctx.drawImage(image, axisX, axisY);
	if(frame)
	{
		ctx.strokeStyle = "#fff";
		ctx.strokeRect( axisX, axisY, 128, 128 );
	}
	ctx.restore();
}


getTime = performance.now.bind(performance);