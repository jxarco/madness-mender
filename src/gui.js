//UI
function Panel()
{
	this.caption = "press";
	this.position = [10,10];
	this.widgets = [];
}

Panel.prototype.draw = function( ctx )
{
	ctx.save();
	ctx.translate( this.position[0], this.position[1] );
	for(var i = 0; i < this.widgets.length; ++i)
	{
		var w = this.widgets[i];
		if(w.draw)
			w.draw(ctx);
	}
	ctx.restore();
}

Panel.prototype.click = function( x,y )
{
	for(var i = 0; i < this.widgets.length; ++i)
	{
		var w = this.widgets[i];
		if(w.click)
			w.click();
	}
}

Panel.prototype.add = function(w)
{
	this.widgets.push(w);
}

function Button(text,callback)
{
	this.caption = text || "press";
	this.position = [0,0];
	this.size = [text.length * font_width + 10,20];
	this.on_click = callback;
}

Button.prototype.draw = function(ctx)
{
	ctx.save();
	ctx.translate(this.position[0],this.position[1]);
	ctx.fillStyle = "black";
	ctx.fillRect( 0,0,this.size[0],this.size[1] );
	ctx.strokeStyle = "white";
	ctx.strokeRect( 0.5,0.5,this.size[0],this.size[1] );
	var tw = this.caption.length * 1
	drawText(this.caption,5,3);
	ctx.restore();
}

Button.prototype.click = function()
{
	if(this.on_click)
		this.on_click();
}
