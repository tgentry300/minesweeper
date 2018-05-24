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
}

GameBoard.prototype = {

    eventListeners: {

        click: function (event) {
            if (!event.target.classList.contains("cell")) return;

            if (event.target.childElementCount) {
                event.target.firstChild.style.visibility = "visible"
            } else {
                //PUT THINGS HERE
                event.target.style.backgroundColor = "lightsalmon"
            }
        },
        contextClick: function (event) {
            if (!event.target.classList.contains("cell")) return;

            // ... do the flag shit
        },

    },

    createGameGridArray: function () {
        return Array(this.numberOfRows).fill('0').map(() => new Array(this.numberOfColumns).fill('0'))
    },

    drawBoard: function () {
        // console.log(this.gameGridArray())
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
                colElement.appendChild(cellElement)
                this.gameGridElementsArray[colIndex].push(cellElement)
            }
        }
    },

    getRandomIntCell: function () {
        return Math.floor(Math.random() * Math.floor(this.numberOfRows - 1));
    },

    getRandomIntCol: function () {
        return Math.floor(Math.random() * Math.floor(this.numberOfColumns - 1));
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

    assignEventListeners: function () {
        this.main.addEventListener("click", this.eventListeners.click)
        this.main.addEventListener("contextmenu", this.eventListeners.contextClick)
    },

}

const gameBoard = new GameBoard(config)