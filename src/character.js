class Character
{  
    constructor(photo, genre, name)
    {
        this.photo = photo;
        this.genre = genre;
        this.name =  name;
        this.log = [];

        this.deck = null;

        this.phraseVerbs = [];
        this.phraseNouns = [];
    }

    draw(ctx, canvas)
    {
        var frame = false;
        var angle = 25;

        var posX = (canvas.width >> 1) - 64;
        var posY = canvas.height - 128;

        var axisX = 50;
        var axisY = -50;

        ctx.drawImage( this.photo,  posX, posY);

        if(frame)
            ctx.strokeRect( posX, posY, 128, 128 );

        //drawRotatedImage( ctx, this.photo, angle, posX, posY, axisX, axisY, frame )
    }

    async generateSalute(person)
    {
        
        return new Promise((function(success, reject){
            
            var salutations = [
                "Hi, I'm here to help you! How are you?",
                "What\'s that, my boy? Mm?",
                `Brave heart, ${person.name}. Tell me...`,
                `Mmm I wonder... Aha! I'm all ears!`,
                'There is no sadder sight than a young pessimist',
                `Somewhere there\'s danger, somewhere there\'s injustice, somewhere else, the tea\'s getting cold`
            ];
    
            var salute = salutations[Math.floor(Math.random() * salutations.length)];
            this.log.push(salute);

            stage_message = {text:salute, type: 1};
    
            setTimeout(success, 2000/*  + Math.floor(Math.random() * 1000 */);
        }).bind(this));
    }

    initCards()
    {
        this.deck = new Deck();
        this.deck.init( this );
    }
    
    showCards()
    {
        if(this.deck)
        this.deck.show();
    }

    hideCards()
    {
        if(this.deck)
        this.deck.hide();
    }

    cardsReady()
    {
        return this.Verb && this.Noun;
       
    }

    async generateMessage( person )
    {
        return new Promise((function(success, reject)
        {
            var response = this.Verb.text.replace('_', this.Noun.text); 
            stage_message = {text:response, type: 1};
            this.log.push(response);

            setTimeout(success, 2000/*  + Math.floor(Math.random() * 1000 */);

        }).bind(this));
    }
};


