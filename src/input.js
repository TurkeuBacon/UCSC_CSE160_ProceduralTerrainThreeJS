class Input {
    canvas;

    w;
    a;
    s;
    d;
    space;
    shift;

    up;
    down;
    left;
    right;

    constructor(canvas) {
        this.canvas = canvas;
        this.w = false;
        this.a = false;
        this.s = false;
        this.d = false;
        this.space = false;
        this.shift = false;

        this.canvas.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'KeyW':
                    this.w = true;
                    break;
                case 'KeyA':
                    this.a = true;
                    break;
                case 'KeyS':
                    this.s = true;
                    break;
                case 'KeyD':
                    this.d = true;
                    break;
                case 'Space':
                    this.space = true;
                    break;
                case 'ShiftLeft':
                    this.shift = true;
                    break;
                case 'ArrowUp':
                    this.up = true;
                    break;
                case 'ArrowLeft':
                    this.left = true;
                    break;
                case 'ArrowDown':
                    this.down = true;
                    break;
                case 'ArrowRight':
                    this.right = true;
                    break;
            }
        });
        this.canvas.addEventListener('keyup', (e) => {
            switch(e.code) {
                case 'KeyW':
                    this.w = false;
                    break;
                case 'KeyA':
                    this.a = false;
                    break;
                case 'KeyS':
                    this.s = false;
                    break;
                case 'KeyD':
                    this.d = false;
                    break;
                case 'Space':
                    this.space = false;
                    break;
                case 'ShiftLeft':
                    this.shift = false;
                    break;
                case 'ArrowUp':
                    this.up = false;
                    break;
                case 'ArrowLeft':
                    this.left = false;
                    break;
                case 'ArrowDown':
                    this.down = false;
                    break;
                case 'ArrowRight':
                    this.right = false;
                    break;
            }
        });

    }

    getHorizontal() {
        return this.a ? (this.d ? 0 : -1) : (this.d ? 1 : 0);
    }
    getForward() {
        return this.s ? (this.w ? 0 : -1) : (this.w ? 1 : 0);
    }
    getVertical() {
        return this.shift ? (this.space ? 0 : -1) : (this.space ? 1 : 0);
    }
    getRotationX() {
        return this.down ? (this.up ? 0 : -1) : (this.up ? 1 : 0);
    }
    getRotationY() {
        return this.left ? (this.right ? 0 : -1) : (this.right ? 1 : 0);
    }
}