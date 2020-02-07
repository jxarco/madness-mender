
var CARDS_VERB = [
    "If you could _, you would be happier!",
    "There is nothing better than _",
    "Please stop _",
    "I think you should be more _",
    "The best options is to _"
];

var CARDS_NOUN = [
    "thinking about this",
    "Gandalf",
    "talking you little bitch",
    "agressive",
    "be an asshole"
];

var copyCARDS_VERB;
var copyCARDS_NOUN;

class Card{

    constructor(type, deck)
    {
        this.deck = deck;
        this.type = type;
       
        this.create();
    }

    create()
    {
        this.text = getText(this.type);

        let type_ = this.type;

        var div = document.createElement('div');
        /* div.setAttribute("draggable", true); */
        div.className = "card-" + this.type;
        div.setAttribute("tabIndex", 1);
        div.innerHTML = this.text;
        document.querySelector(".deck").appendChild(div);

        var that = this;

        div.addEventListener('click', function(e){

            if(type_ == "v") {
                $(".card-v").removeClass("selected");
            }
            if(type_ == "n")
                $(".card-n").removeClass("selected");
            $(this).toggleClass("selected");

            that.onSelected();

        });
    }

    onSelected()
    {
        switch(this.type){
			case "v": this.deck.character.Verb = this; break;
            case "n": this.deck.character.Noun = this; break;
            default: throw("unsupported card type");
        }

        console.log(this.deck.character)
        
		if(this.deck.character.cardsReady())
		{
            setTimeout(() => {
                
			    MAINSTAGE.logic( "MESSAGE" );

            }, 2000);
		}
    }
}

class Deck{

    constructor()
    {
        this.cards = [];
        this.stack = [];
    }

    init( character )
    {
        this.character = character;

        copyCARDS_VERB = [].concat(CARDS_VERB);
        copyCARDS_NOUN = [].concat(CARDS_NOUN);
          
        $(".deck").remove();

        console.log("init deck");
        var div = document.createElement('div');
        this.container = div;
        div.className = "deck";
        div.style.display = "none";
        document.body.appendChild(div);

        for(var i = 0; i < 3; i++)
        this.cards.push( new Card("v", this) );

        for(var i = 0; i < 3; i++)
        this.cards.push( new Card("n", this) );
    }

    show()
    {
        this.container.style.display = "flex";
    }
    
    hide()
    {
        this.container.style.display = "none";
    }

    pop()
    {

    }

    shuffle()
    {

    }

    getCards(type)
    {
        
    }
}

function getText(type)
{
    var index = Math.floor(Math.random() * (copyCARDS_VERB.length));

    if(type == "v")
    {
        var element = copyCARDS_VERB[ index ];
        if (index > -1) {
            copyCARDS_VERB.splice(index, 1);
        }
        return element;
    }
    
    index = Math.floor(Math.random() * (copyCARDS_NOUN.length));
    var element = copyCARDS_NOUN[ index ];
    if (index > -1) {
        copyCARDS_NOUN.splice(index, 1);
    }
    return element;
}

