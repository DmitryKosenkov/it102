const suits = ["spades", "hearts", "diamonds", "clubs"];
const ranks = {
    "ace": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "jack": 10,
    "queen": 10,
    "king": 10
};


class Card{
    constructor(suit, rank){
        this.suit = suit;
        this.rank = rank;
        this.isVisible = true;
        this.image = "images/" + this.rank + "_of_" + this.suit + ".svg";
    }

    display(){
        if (this.isVisible) {
            return '<img src="' + this.image + '" height="87" width="100">';
        } else {
            return '<img src="images/back.png" height="87" width="60">';
        }
    }

    hide(){
        this.isVisible = false;
    }

    show(){
        this.isVisible = true;
    }
}

class Deck{
    constructor(){
        this.cards = [];
        for (let i = 0; i < suits.length; i++){
            for(let j in ranks){
                this.cards.push(new Card(suits[i], j))
            }
        }
    }
}

class Dealer{
    constructor(deck, hand = [], total = 0, deckIndex = 0){
        this.deck = deck
        this.hand = hand;
        this.total = total;
        this.deckIndex = deckIndex;


    }
    shuffleDeck(){
        for(let i = 0; i < this.deck.cards.length; i++){
            let j = Math.floor(Math.random() * 52);
            let buffer = this.deck.cards[j];
            this.deck.cards[j] = this.deck.cards[i];
            this.deck.cards[i] = buffer; 
        }
        console.log('deck shuffled!');
    }

    dealCard(){
        return this.deck.cards[this.deckIndex++]; 
    }

    takeCard(){
        if (this.hand.length > 0){
            this.deck.cards[this.deckIndex].hide();
            this.hand.push(this.deck.cards[this.deckIndex++]);
            
            this.total += ranks[this.deck.cards[this.deckIndex - 1].rank];
        } else {
            this.hand.push(this.deck.cards[this.deckIndex++]);
            this.total += ranks[this.deck.cards[this.deckIndex - 1].rank];
        }
    }
}

class Player{
    constructor(name, hand = [], total = 0){
        this.name = name;
        this.hand = hand;
        this.total = total;
    }

    hit(card){
        this.hand.push(card);
        this.total += ranks[card.rank];
    }
}

const Game = {
    dealer: null,
    player: null,

    start(username){
        
        this.player = new Player(username);
        const deck = new Deck();
        this.dealer = new Dealer(deck);

        this.dealer.shuffleDeck();
        dealInitialCards(this.dealer, this.player);
    },

    restart(){
        document.getElementById("dealerCards").innerHTML = "";
        document.getElementById("playerCards").innerHTML = "";
        document.getElementById("resultMessage").textContent = "";

        const deck = new Deck();
        this.dealer.deck = deck;
        this.dealer.hand = [];
        this.dealer.total = 0;
        this.dealer.deckIndex = 0;

        this.player.hand = [];
        this.player.total = 0;

        this.dealer.shuffleDeck();

        dealInitialCards(this.dealer, this.player);
    },

    shuffleDeck(){
        this.restart();
    },

    hit(){
        const card = this.dealer.dealCard();
        this.player.hit(card);
        document.getElementById("playerCards").innerHTML += card.display();
        if (this.player.total >= 21) {
            this.stand();
        }
    },

    stand() {
        this.dealer.hand[1].show();
        document.getElementById("dealerCards").innerHTML = "";
        for (let card of this.dealer.hand) {
            document.getElementById("dealerCards").innerHTML += card.display();
        }

        let result = "";
        if (this.player.total > 21) result = "You busted!";
        else if (this.player.total > this.dealer.total) result = "You win!";
        else if (this.player.total < this.dealer.total) result = "Dealer wins!";
        else result = "Push";

        document.getElementById("resultMessage").textContent = result;
    }

};

function validateUserName(username) {
    if (!username.trim()) {
        throw new Error("User name cannot be blank.");
    }

    const regex = /^[a-zA-Z]+$/;
    if (!regex.test(username)) {
        throw new Error("User name can only contain alpha characters.");
    }

    return username;
}


function dealInitialCards(dealer, player) {
    let dealerCardsHTML = "";
    let playerCardsHTML = "";

    // Dealer first card face up
    dealer.takeCard();
    dealerCardsHTML += dealer.hand[dealer.deckIndex - 1].display();
    dealer.takeCard();
    dealerCardsHTML += dealer.hand[dealer.deckIndex - 1].display();

    document.getElementById("dealerCards").innerHTML = dealerCardsHTML;

    // Player first 2 cards face up
    player.hit(dealer.dealCard());
    playerCardsHTML += player.hand[player.hand.length - 1].display();
    player.hit(dealer.dealCard());
    playerCardsHTML += player.hand[player.hand.length - 1].display();

    document.getElementById("playerCards").innerHTML = playerCardsHTML;
}


function startGame() {
    let username = document.userForm.elements[0].value.trim();
    try {
        let validUsername = validateUserName(username);

        document.getElementById('userForm').style.display = 'none';
        document.getElementById('gameArea').style.display = 'block';
        document.getElementById('welcomeMessage').textContent = "Welcome " + validUsername + "!";

        Game.start(validUsername);

    } catch (error) {
        alert(error);
    }
}


function returnToForm() {
    document.getElementById('userForm').style.display = 'block';
    document.getElementById('gameArea').style.display = 'none';
}