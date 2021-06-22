class Game {
    constructor() {
        // 0: turno de nadie, 1: turno de maquina, 2: turno de jugador
        this.turno = 0;
        this.scoreMax = 0;
        this.scorePlayer = 0;
        this.indexPlayer = 0;
        this.timer = 1300; //1,5 s
        this.result = "";
        this.rightSecuence = [];
        this.direcciones = ["up", "left", "right", "down", "center"];
        this.playerSecuence = [];
        this.hoverColor = {
            "center": "2",

        }
        this.hiddeInterface(false);
        this.round();
    }


    addToSecuence() {
        let random = Math.round(Math.random() * (this.direcciones.length - 1));
        let randomDir = this.direcciones[random];
        this.rightSecuence.push(randomDir);
    }

    async autoSecuence() {
        this.turno = 1;
        for (let i = 0; i < this.rightSecuence.length; i++) {
            await new Promise(resolve => setTimeout(resolve, this.timer)); // 1.5 sec
            let position = this.rightSecuence[i];
            let button = document.getElementById("game-" + position);
            let className = button.className.baseVal;
            button.className.baseVal = className + "-auto";
            await new Promise(resolve => setTimeout(resolve, this.timer)); // 1.5 sec
            button.className.baseVal = className;

        }
        this.turno = 2;
        this.update("turn");
    }

    async round() {
        this.reduceTime();
        this.reaction();

        this.hiddeButtons(true);
        this.setNext();
        this.scorePlayer = 0;
        this.indexPlayer = 0;
        this.update("attention");
        this.turno = 0;
        this.addToSecuence();
        await new Promise(resolve => setTimeout(resolve, 1600));
        this.autoSecuence();
    }

    reduceTime(fail = false) {
        if (fail) {
            this.timer = this.timer + 100;
            if (this.timer < 500) {
                this.timer = 500;
            }
        }
        else {
            if (this.timer >= 200) {
                this.timer = this.timer - 100;
            }
            else if (this.timer >= 60) {
                this.timer = this.timer - 10;
            }
        }

    }

    press(buttonID) {
        if (this.turno === 2) {
            let actual = this.rightSecuence[this.indexPlayer];
            if (buttonID === actual) {
                this.indexPlayer += 1;
                this.scorePlayer += 1;

                if (this.indexPlayer === this.rightSecuence.length) {
                    // Termino bien la cadena
                    if (this.scorePlayer > this.scoreMax) {
                        this.scoreMax = this.scorePlayer;
                    }
                    this.update("win");
                    this.hiddeButtons(false);
                    this.turno = 0;

                } else {
                    // No ha terminado
                    this.update("well");
                }
            } else {
                //this.timer = 1500;
                this.reduceTime(true);
                this.rightSecuence = [];
                this.update("fail");
                this.setNext(false);
                this.hiddeButtons(false);
            }
        }
    }

    hiddeButtons(val) {
        document.getElementById("B3").hidden = val;
    }
    hiddeInterface(val) {
        document.getElementById("B1").innerHTML = "Reiniciar juego";
        document.getElementById("inst1").hidden = !val;
        document.getElementById("inst2").hidden = !val;
        document.getElementById("results").hidden = val;
        document.getElementById("gameboard").hidden = val;

    }

    reaction() {
        let reaction = (this.timer / 1000).toFixed(2)
        let empieza = document.getElementById("empieza");
        empieza.innerHTML = "Tiempo de reaccion: " + reaction + "s";
        empieza.hidden = false;
    }

    setNext(val = true) {
        let button = document.getElementById("B3");
        if (val) {
            button.innerHTML = "Siguiente Nivel";
        } else {
            button.innerHTML = "Volver a intentarlo";
        }
    }

    update(momento = "score") {
        let scoreMax = document.getElementById("scoreMax");
        let scorePlayer = document.getElementById("scorePlayer");
        let result = document.getElementById("result");

        if (momento === "attention") {
            result.innerHTML = "Atencion a la secuencia, espera tu turno...";
        } else if (momento === "turn") {
            result.innerHTML = "Tu turno: sigue el orden";
        } else if (momento === "well") {
            result.innerHTML = "Bien!, continua...";
        } else if (momento === "win") {
            result.innerHTML = "Ganaste! Resultados:";
        } else if (momento === "fail") {
            let nuevo
            result.innerHTML = "Fallaste! Resultados: " + this.result;
        }
        scoreMax.innerHTML = "Puntuacion Máxima: " + this.scoreMax;
        scorePlayer.innerHTML = "Puntuacion Obtenida: " + this.scorePlayer;
    }

}
var gameActual;
function restart() {
    gameActual = new Game();
}
