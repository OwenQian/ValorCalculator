const cards = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

export class RangeUI {
    constructor(canvas, box_height=40, box_width=40) {
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
        this.box_height = box_height;
        this.box_width = box_width;
        canvas.width = 2 + (box_width + 1) * 13;
        canvas.height = 2 + (box_height + 1) * 13;
    }
    drawGrid() {
        this.ctx.textAlign = "center";
        this.ctx.font = "12px Arial";
        this.ctx.fillStyle = "#000";
        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 13; j++) {
                let hand = i > j ? cards[j] + cards[i] + 's' : i < j ? cards [i] + cards[j] + 'o' : cards[i] + cards[j];
                let text_x = (1 + (this.box_width / 2)) + ((this.box_width + 1) * i);
                let text_y = (5 + (this.box_height / 2)) + ((this.box_height + 1) * j);
                this.ctx.fillText(hand, text_x, text_y);
            }
        }
        for (let i = 0; i < 14; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, 1 + i * (this.box_height + 1));
            this.ctx.lineTo(this.canvas.width, 1 + i * (this.box_height + 1));
            this.ctx.moveTo(1 + i * (this.box_width + 1), 0);
            this.ctx.lineTo(1 + i * (this.box_width + 1), this.canvas.height);
            this.ctx.stroke();
        }
    }
}