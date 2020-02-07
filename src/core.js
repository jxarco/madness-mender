//This is the core of the CLIENT
//In charge of handling menus, load games, etc

var CORE = {

	stages: {},
	active_stages: [],
	current_stage: null,

	init: function()
	{
		this.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
		document.addEventListener( "visibilitychange", this.handleVisibilityChange.bind(this), false);
    
		var canvas = window.canvas = this.canvas = document.querySelector("canvas");
		canvas.tabIndex = 1;
		canvas.width = Math.floor(document.body.offsetWidth / 2);
		canvas.height = Math.floor(document.body.offsetHeight / 2);
		canvas.style.width = (canvas.width * 2) + "px";
		canvas.style.height = (canvas.height * 2) + "px";
		var ctx = window.ctx = this.ctx = canvas.getContext("2d");
		canvas.addEventListener("mousemove",this.onmouse.bind(this) );
		canvas.addEventListener("mousedown",this.onmouse.bind(this) );

		canvas.addEventListener("keydown",this.onkeydown.bind(this) );
		canvas.addEventListener("mousewheel",this.onmousewheel.bind(this) );
		var mouse_pos = [-1,-1];

		//init stages
		for(var i in this.stages)
			this.stages[i].init("Dr.Ramon", true); // name, gender
			
		this.changeToStage( MAINSTAGE );	
		
		this.enableFileDrop();

		var prev = getTime();
		function loop()
		{
			var now = getTime();
			var dt = (now - prev) * 0.001;
			prev = now;
			requestAnimationFrame(loop);
			CORE.draw();
			CORE.update(dt);
		}

		loop();
	},

	addStage: function( stage )
	{
		console.log("Stage: " + stage.name );
		this.stages[ stage.name ] = stage;
	},
	
	changeToStage: function( stage )
	{
		for(var i = 0; i < this.active_stages.length; ++i)
		{
			var active_stage = this.active_stages[i];
			if( active_stage.onDisable )	
				active_stage.onDisable();
		}
	
		if(stage.constructor === String )
			stage = this.stages[ stage ];
		this.active_stages.length = 1;
		this.active_stages[0] = stage;
		this.current_stage = stage;
		
		if(stage.onEnable)
			stage.onEnable();
	},

	//events to stages
	onmouse: function(e)
	{
		for(var i = 0; i < this.active_stages.length; ++i)
		{
			if(this.active_stages[i].onmouse)
				this.active_stages[i].onmouse(e);
		}
	},

	onmousewheel: function(e)
	{
		for(var i = 0; i < this.active_stages.length; ++i)
		{
			if(this.active_stages[i].onmousewheel)
				this.active_stages[i].onmousewheel(e);
		}
	},

	onkeydown: function(e)
	{
		for(var i = 0; i < this.active_stages.length; ++i)
		{
			if(this.active_stages[i].onkeydown)
				this.active_stages[i].onkeydown(e);
		}
	},

	draw: function()
	{
		this.resizeCanvas();

		for(var i = 0; i < this.active_stages.length; ++i)
		{
			if(this.active_stages[i].draw)
				this.active_stages[i].draw( this.ctx, this.canvas);
		}
	},

	update: function(dt)
	{
		for(var i = 0; i < this.active_stages.length; ++i)
		{
			if(this.active_stages[i].update)
				this.active_stages[i].update(dt);
		}
	},
	
	handleVisibilityChange: function(e)
	{
		//console.log("visibility!");
		for(var i = 0; i < this.active_stages.length; ++i)
		{
			if(this.active_stages[i].onTabEnter)
				this.active_stages[i].onTabEnter( !document.hidden );
		}
	},

	enableFileDrop: function()
	{
		var that = this;
		var element = document.body;
		element.addEventListener("dragenter", onDragEvent);

		function onDragEvent(evt)
		{
			element.addEventListener("dragexit", onDragEvent);
			element.addEventListener("dragover", onDragEvent);
			element.addEventListener("drop", onDrop);
			evt.stopPropagation();
			evt.preventDefault();
		}

		function onDrop(evt)
		{
			evt.stopPropagation();
			evt.preventDefault();

			element.removeEventListener("dragexit", onDragEvent);
			element.removeEventListener("dragover", onDragEvent);
			element.removeEventListener("drop", onDrop);

			if(evt.dataTransfer.files)
			{
				var files = evt.dataTransfer.files;
				for(var i = 0; i < files.length; ++i)
				{
					var file = files[i];
					var url = URL.createObjectURL( file, {} );
					if(file.name.indexOf(".jpg") != -1 || file.name.indexOf(".png") != -1)
					{
					}
				}
			}

			return true;
		}
	},

	onFileDrop: function(e)
	{

	},

	resizeCanvas: function()
	{
		var canvas = this.canvas;
		var parent = canvas.parentNode;
		var rect = parent.getBoundingClientRect();
		canvas.width = Math.floor(document.body.offsetWidth / 2);
		canvas.height = Math.floor(document.body.offsetHeight / 2);
		canvas.style.width = (canvas.width * 2) + "px";
		canvas.style.height = (canvas.height * 2) + "px";
	}
};







