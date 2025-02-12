
const cardValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let gameBoard = document.getElementById('gameBoard');
let cards = [];
let flippedCards = [];
let matchedPairs = 0;

// Initialize the game
function initGame() {
    cards = [...cardValues, ...cardValues];
    shuffle(cards);
    createBoard();
}

// Shuffle the cards
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Create the game board
function createBoard() {
    gameBoard.innerHTML = '';
    cards.forEach((value, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-value', value);
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// Flip the card
function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        this.innerText = this.getAttribute('data-value');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }
}

// Check for matching pairs
function checkForMatch() {
    const [firstCard, secondCard] = flippedCards;
    if (firstCard.getAttribute('data-value') === secondCard.getAttribute('data-value')) {
        matchedPairs++;
        flippedCards = [];
        if (matchedPairs === cardValues.length) {
            setTimeout(() => alert('You won!'), 500);
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.innerText = '';
            secondCard.innerText = '';
            flippedCards = [];
        }, 1000);
    }
}

// Restart the game
document.getElementById('restart').addEventListener('click', () => {
    matchedPairs = 0;
    flippedCards = [];
    initGame();
});

// Start the game
initGame();
