const config = {
    main: document.getElementById("main"),
    numberOfRows: 10,
    numberOfColumns: 10,
    numberOfMines: 10,
}

const GameBoard = function (config) {
    this.main = config.main
    this.numberOfRows = config.numberOfRows
    this.numberOfColumns = config.numberOfColumns
    this.numberOfMines = config.numberOfMines

    this.gameGridElementsArray = []

    this.assignEventListeners()
    this.drawBoard()
    this.drawMines()
    this.setNumbersToCell()
}

GameBoard.prototype = {



    floodFill: function (cell) {
        const queue = []
        queue.push(cell)
        cell.hasBeenQueued = true


        while (queue.length) {
            const currentCell = queue.shift()
            const neighborCells = this.findNeighboringCellElements(currentCell)

            if(currentCell.dataset.bombstatus == "BOMB") break

            for (let neighborCell of neighborCells) {
                if (currentCell.dataset.numberofbombstouching > 0) continue
                if (neighborCell.hasBeenRevealed || neighborCell.dataset.bombstatus === "BOMB") {
                    continue
                }

                neighborCell.style.backgroundColor = "white"
                neighborCell.dataset.clickstatus = "clicked"
                neighborCell.hasBeenRevealed = true

                if (Number(neighborCell.dataset.numberofbombstouching)) {
                    neighborCell.innerText = neighborCell.dataset.numberofbombstouching
                }

                if (!neighborCell.hasBeenQueued) {
                    queue.push(neighborCell);
                    neighborCell.hasBeenQueued = true;

                }


            }
        }
    },

    eventListeners: {

        click: function (event) {
            let popup = document.createElement("div")
            let bunchOfCells = document.getElementsByClassName("cell")
            
            

            if (!event.target.classList.contains("cell")) return;
            const isABomb = event.target.dataset.bombstatus === "BOMB"
            if (isABomb) {
                event.target.firstChild.style.visibility = "visible"
                this.removeEventListeners()
                popup.innerText = "You Lose"
                main.appendChild(popup)
                for (cell of bunchOfCells) {
                    if (cell.dataset.bombstatus == "BOMB") {
                        cell.firstChild.style.visibility = "visible"
                    }
                }
                
            } else {
                event.target.style.backgroundColor = "white"
                event.target.dataset.clickstatus = "clicked"
                event.target.hasBeenRevealed = true
            }

            if (event.target.dataset.numberofbombstouching === "0") {
                this.floodFill(event.target);
            } else {
                event.target.innerText = event.target.dataset.numberofbombstouching
            }
            
            this.checkWin()
        },
        contextClick: function (event) {
            event.preventDefault()
            if (!event.target.classList.contains("cell")) return;
            event.target.classList.toggle("noflag")
            event.target.classList.toggle("flag")

        },


    },

    createGameGridArray: function () {
        return Array(this.numberOfRows).fill('0').map(() => new Array(this.numberOfColumns).fill('0'))
    },


    drawBoard: function () {
        for (let colIndex in this.createGameGridArray()) {
            this.gameGridElementsArray.push([])
            const colElement = document.createElement("div")
            colElement.classList.add("column")
            this.main.appendChild(colElement)
            for (let cellIndex in this.createGameGridArray()[colIndex]) {
                const cellElement = document.createElement("div")
                cellElement.classList.add("cell")
                cellElement.dataset.columns = colIndex
                cellElement.dataset.cells = cellIndex
                cellElement.dataset.bombstatus = "no bomb"
                cellElement.classList.add("noflag")
                cellElement.dataset.clickstatus = "unclicked"
                cellElement.dataset.numberofbombstouching = Number(0)
                colElement.appendChild(cellElement)
                this.gameGridElementsArray[colIndex].push(cellElement)
            }
        }
    },

    getRandomIntCol: function () {
        return Math.floor(Math.random() * Math.floor(this.numberOfColumns - 1));
    },
    getRandomIntCell: function () {
        return Math.floor(Math.random() * Math.floor(this.numberOfRows - 1));
    },


    drawMines: function () {
        for (let i = 0; i < this.numberOfMines; i++) {
            const colIndex = this.getRandomIntCol()
            const cellIndex = this.getRandomIntCell()

            if (this.gameGridElementsArray[colIndex][cellIndex].dataset.bombstatus === "BOMB") {
                i--;

            } else {
                this.gameGridElementsArray[colIndex][cellIndex].dataset.bombstatus = "BOMB"
                const bombPic = document.createElement("img")
                bombPic.src = "bomb.png"
                bombPic.classList.add("bombpic")

                this.gameGridElementsArray[colIndex][cellIndex].appendChild(bombPic)
            }
        }
    },
    findCellbyCoordinates: function (colposition, cellposition) {
        const column = this.gameGridElementsArray[colposition]
        return column && column[cellposition]
    },

    incrementBombsTouching: function (cell) {

        if (cell && cell.dataset.bombstatus == "no bomb") {
            cell.dataset.numberofbombstouching = Number(cell.dataset.numberofbombstouching) + 1;
        }
        return cell
    },
    setNumbersToCell: function () {
        let gameArray = this.gameGridElementsArray
        gameArray.forEach((element, col) => {
            element.forEach((element, cell) => {
                if (element.dataset.bombstatus === "BOMB") {
                    this.findNeighboringCellElements(element).forEach(neighborCellElement => {
                        this.incrementBombsTouching(neighborCellElement)

                    });
                }
            });
        });
    },

    findNeighboringCellElements: function (cellElement) {
        const col = Number(cellElement.dataset.columns)
        const cell = Number(cellElement.dataset.cells)
        const arrayOfCells = []
        const neighborCoords = {
            cellAbove: [col, cell - 1],
            cellRight: [col + 1, cell],
            cellDown: [col, cell + 1],
            cellLeft: [col - 1, cell],
            cellAboveRight: [col + 1, cell - 1],
            cellAboveLeft: [col - 1, cell - 1],
            cellDownRight: [col + 1, cell + 1],
            cellDownLeft: [col - 1, cell + 1],
        }
        Object.values(neighborCoords).forEach(coords => {
            const cell = this.findCellbyCoordinates(coords[0], coords[1])
            if (cell) arrayOfCells.push(cell)
        });

        return arrayOfCells
    },

    assignEventListeners: function () {
        this._boundClickListener = this.eventListeners.click.bind(this)
        this._boundContextMenuListener = this.eventListeners.contextClick.bind(this)

        this.main.addEventListener("click", this._boundClickListener)
        this.main.addEventListener("contextmenu", this._boundContextMenuListener)
    },

    removeEventListeners: function () {
        this.main.removeEventListener("click", this._boundClickListener)
        this.main.removeEventListener("contextmenu", this._boundContextMenuListener)
    },




    checkWin: function () {
        let popup = document.createElement("div")
        let clickCount = 0
        let countOfClickedCells = document.querySelectorAll("[data-clickstatus='clicked']").length
        const numberOfCells = this.numberOfRows * this.numberOfColumns
        const endResult = numberOfCells - this.numberOfMines
        if(countOfClickedCells === endResult){
             popup.innerText = "WINNNNNNNNNNNERRRRRRRRR"
             this.main.appendChild(popup)
             this.removeEventListeners()
        }
    },

}

resetGame = () => {
    main.innerHTML = ''
    main.secondChild = ''
    new GameBoard(config)

}
document.getElementById("reset").addEventListener("click", resetGame)


const gameBoard = new GameBoard(config)