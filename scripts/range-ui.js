const cards = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

import {Range} from './calc.js'

export class RangeUI {
    constructor(canvas, textBox, boxHeight = 40, boxWidth = 40) {
        this.selected =
            [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.textBox = textBox;
        this.boxHeight = boxHeight;
        this.boxWidth = boxWidth;
        let self = this;
        this.mousePressed = false;
        this.pressed = [0, 0];
        canvas.width = 2 + (boxWidth + 1) * 13;
        canvas.height = 2 + (boxHeight + 1) * 13;
        canvas.onmousedown = function(e) { self.onMouseDown(e.clientX, e.clientY); self.mousePressed = true; };
        canvas.onmouseup = function(e) { self.mousePressed = false; };
        canvas.onmousemove = function(e) { self.onMouseMove(e.clientX, e.clientY) };
        canvas.onmouseout = function(e) { self.mousePressed = false; };

        textBox.oninput = function(e) { self.updateRange(this.value) };
        this.updateRange(textBox.value);
    }

    drawGrid() {
        this.ctx.textAlign = "center";
        this.ctx.font = "12px Arial";
        this.ctx.fillStyle = "#000";
        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 13; j++) {
                let hand = i > j ? cards[j] + cards[i] + 's' : i < j ? cards [i] + cards[j] + 'o' : cards[i] + cards[j];
                let text_x = (1 + (this.boxWidth / 2)) + ((this.boxWidth + 1) * i);
                let text_y = (5 + (this.boxHeight / 2)) + ((this.boxHeight + 1) * j);
                this.ctx.fillText(hand, text_x, text_y);
            }
        }
        for (let i = 0; i < 14; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, 1 + i * (this.boxHeight + 1));
            this.ctx.lineTo(this.canvas.width, 1 + i * (this.boxHeight + 1));
            this.ctx.moveTo(1 + i * (this.boxWidth + 1), 0);
            this.ctx.lineTo(1 + i * (this.boxWidth + 1), this.canvas.height);
            this.ctx.stroke();
        }
    }

    clearRange() {
        for (let i = 0; i < 13; i++)
            for (let j = 0; j < 13; j++)
                this.selected[i][j] = 0;
    }

    drawRange() {
        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 13; j++) {
                if (this.selected[i][j] === 0) {
                    this.ctx.fillStyle = "#fff";
                } else {
                    this.ctx.fillStyle = "#0f0"; // Can add variable here for % played, for now only 100% played
                }
                this.ctx.fillRect(1 + (this.boxWidth + 1) * i, 1 + (this.boxHeight + 1) * j, this.boxWidth, this.boxHeight);
            }
        }
    }

    redraw() {
        this.drawRange();
        this.drawGrid();
    }

    updateRange(rangeString) {
        let expandedRangeStr = Range.parseRange(rangeString)[1];
        this.clearRange();
        let hands = expandedRangeStr.split(",").map(x => x.trim());
        for (let hand of hands) {
            if (hand.length < 2 || hand.length > 3)
                continue;
            let i = cards.indexOf(hand[0]);
            let j = cards.indexOf(hand[1]);
          
            if (j < i) {
                let temp = i;
                i = j;
                j = temp;
            }


            if (i === -1 || j === -1)
                continue;
            if (hand.length === 2 && i != j)
                continue;
            if (hand.length === 3 && !(hand[2] === 's' || hand[2] === 'o'))
                continue;
            if (hand.length === 3 && hand[2] === 's') {
                let temp = i;
                i = j;
                j = temp;
            }
            this.selected[i][j] = 1.0;
        }
        this.redraw();
    }

    updateTextBox() {
        this.textBox.value = '';
        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 13; j++) {
                if (this.selected[i][j] === 0)
                    continue;
                let hand = i > j ? cards[j] + cards[i] + 's' : i < j ? cards [i] + cards[j] + 'o' : cards[i] + cards[j];
                let hands = this.textBox.value.split(",").map(x => x.trim());
                if (!hands.includes(hand)) {
                    this.textBox.value += ', ' + hand;
                    // Remove leading and trailing commas
                    this.textBox.value = this.textBox.value.replace(/(^, )|(, $)/g, "");
                }
            }
        }
    }

    mouseCoordsToIndexes(mouseX, mouseY) {
        let rect = this.canvas.getBoundingClientRect();
        let canvasX = mouseX - rect.left;
        let canvasY = mouseY - rect.top;

        let i = Math.floor((canvasX - 1) / (this.boxWidth + 1));
        let j = Math.floor((canvasY - 1) / (this.boxHeight + 1));
        return [i, j];
    }

    onMouseDown(mouseX, mouseY) {
        let indexes = this.mouseCoordsToIndexes(mouseX, mouseY);
        this.selectHand(indexes[0], indexes[1]);
    }

    onMouseMove(mouseX, mouseY) {
        if (this.mousePressed) {
            let indexes = this.mouseCoordsToIndexes(mouseX, mouseY);
            let i = indexes[0];
            let j = indexes[1];
            if (this.pressed[0] === i && this.pressed[1] === j)
                return;
            this.selectHand(i, j);
        }
    }

    selectHand(i, j) {
        if (i < 0 || j < 0 || i > 12 || j > 12)
            return;
        this.pressed[0] = i;
        this.pressed[1] = j;
        if (this.selected[i][j] > 0)
            this.selected[i][j] = 0;
        else
            this.selected[i][j] = 1.0;
        this.redraw();
        this.updateTextBox()
    }
}
