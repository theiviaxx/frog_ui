export class Point {
    x:number;
    y:number;

    constructor(x:number = 0, y:number = 0) {
        
    }
}


export class Matrix {
    constructor(public elements:number[][]) {
        
    }
    x(b:Matrix) {
        let i = this.elements.length;
        let nj = b.elements[0].length;
        let cols = this.elements[0].length;
        let elements = [];
        let sum:number;
        let c:any;
        let j:number = 0;

        while(i--) {
            j = nj;
            elements[i] = [];
            while (j--) {
                c = cols;
                sum = 0;
                while (c--) {
                    sum += this.elements[i][c] * b.elements[c][j];
                }
                elements[i][j] = sum;
            }
        }

        return new Matrix(elements);
    }
    dup() {
        return new Matrix(this.elements);
    }
    static Identity() {
        return new Matrix([
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ]);
    }
}

export class Rect {
    constructor(private _x: number, private _y: number, private _width:number, private _height: number) {

    }
    get x(): number { return this._x; }
    set x(value: number) { this._x = value; }
    get y(): number { return this._y; }
    set y(value: number) { this._y = value; }
    get width(): number { return this._width; }
    set width(value: number) { this._width = value; }
    get height(): number { return this._height; }
    set height(value: number) { this._height = value; }
    
    get top(): number { return this._y; }
    get left(): number { return this.x; }
    get bottom(): number { return this._y + this.height; }
    get right(): number { return this._x + this._width; }

    zero() {
        this._x = this._y = this._width = this._height = 0;
    }
    intersects(other: Rect) {
        let value = (
            other.left > this.right ||
            other.right < this.left ||
            other.top > this.bottom ||
            other.bottom < this.top
        )
        return !value;
    }
}