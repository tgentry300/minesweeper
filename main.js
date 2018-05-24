const gameBoardCreate = {
    main: document.getElementById("main"),
    numberOfRows: 10,
    numberOfColumns: 10,
    numberOfMines: 10,
    gameGridElementsArray: [],
    gameGridArray: function () {
        return Array(this.numberOfRows).fill('0').map(() => new Array(this.numberOfColumns).fill('0'))
    },
    drawBoard: function () {
        // console.log(this.gameGridArray())
        for (let colIndex in this.gameGridArray()) {
            this.gameGridElementsArray.push([])
            const colElement = document.createElement("div")
            colElement.classList.add("column")
            this.main.appendChild(colElement)
            for (let cellIndex in this.gameGridArray()[colIndex]) {
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
}
gameBoardCreate.drawBoard()
gameBoardCreate.drawMines()