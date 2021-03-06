function createCard(value){
    return `<div class="card" data-value="${value}"><h1>?</h1></div>`
}
function createGrid(pairCount){
    const cols = Math.ceil(Math.sqrt(pairCount * 2))
    return `grid-template-columns: ${"1fr ".repeat(cols)};`
}

/* Apparently there is something called 'grid-auto-rows: auto;' which makes this code irrelevant...

function createGrid(pairCount){
    //Calculate how many columns and rows we need
    const cols = Math.ceil(Math.sqrt(pairCount * 2))
    let rows = cols

    //Check if we have an empty row, if so remove it.
    if(cols * rows > ((pairCount * 2) + cols) - 1){
        rows--;
    }
    //Build CSS styling
    return `
    grid-template-columns: ${"1fr ".repeat(cols)};
    grid-template-rows: ${"1fr ".repeat(rows)};
    `
}
*/



function startGame(gameboard, pairCount){

    // Build CSS Grid to hold cards
    gameboard.setAttribute('style', createGrid(pairCount))

    //Build array of numbers
    let orderArr = []

    for (let i = 0; i < pairCount; i++) {
        orderArr.push(i)
    }

    //Duplicate array
    orderArr.push(...orderArr)

    //Shuffle array
    for(let i = orderArr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let temp = orderArr[i]
        orderArr[i] = orderArr[j]
        orderArr[j] = temp
    }

    //Create cards
    orderArr.forEach(function(value){
        gameboard.innerHTML += createCard(value)
    })

    // Register card EventListeners
    const cards = document.querySelectorAll('.card')
    cards.forEach(function(card){
        card.addEventListener('click', function(){
            //Make sure we only have 0 - 2 active cards to prevent weird bugs when spam clicking cards (setTimeout still running.)
            const activeCards = document.querySelectorAll('.active')
            if(activeCards.length < 2){
                card.firstChild.textContent = card.dataset.value;
                card.classList.add('active')
                checkState()
            }
        })
    })
}

function resetGame(gameboard, pairCount){
    //Remove current gameboard and call startGame
    gameboard.innerHTML = ''
    startGame(gameboard, pairCount)
}

//Check the state of the game
function checkState(){
    const cards = document.querySelectorAll('.card')
    const activeCards = document.querySelectorAll('.active')
    
    //Compare selected card values and complete them on match
    if(activeCards.length === 2){
        //Unselect selected cards
        activeCards.forEach(function(card){
            window.setTimeout(function(){
                card.classList.remove('active')
                updateStatusText(`${setDifficulty.toUpperCase()}`)
                if(!card.classList.contains('completed')){
                    card.firstChild.textContent = '?'
                }
            }, 600)
        })

        //Check if they matched
        if(activeCards[0].dataset.value === activeCards[1].dataset.value){
            activeCards[0].classList.add('completed')    
            activeCards[1].classList.add('completed')

            //Display their value when completed
            activeCards[0].firstChild.textContent = activeCards[0].dataset.value;
            activeCards[1].firstChild.textContent = activeCards[1].dataset.value;
            updateStatusText('Nice')
        } else {
            updateStatusText('Uh oh...')
        }
    }

    //Check if game is completed
    const completedCards = document.querySelectorAll('.completed')
    if(completedCards.length === cards.length){
        updateStatusText('Game won!')
    }
}

function updateStatusText(string){
    const text = document.querySelector('#status-text')
        string.toString
        text.textContent = string
}