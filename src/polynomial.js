export default class Polynomial {
    constructor(coefficients) {
        this.coefficients = coefficients;
    }

    evalAt(t) {
        if (this.coefficients.length === 0) {
            return 0;
        }
        var i = this.coefficients.length - 1;
        var result = this.coefficients[i];
        while (--i >= 0) {
            result = result * t + this.coefficients[i];
        }

        return result;
    }

    derivative() {
        var coefficients = [];
        for (var i = 1; i < this.coefficients.length; ++i) {
            coefficients.push(this.coefficients[i] * i);
        }

        return new Polynomial(coefficients);
    }

    toString() {
        var result = [];
        const length = this.coefficients.length;
        switch (length) {
        case 0:
            result.push("0");
            break;
        case 1:
            if (this.coefficients[0] !== 0) {
                result = [this.coefficients[0]]
            }
            break;
        default:
            if (this.coefficients[0] !== 0) {
                result.push(this.coefficients[0]);
            }
            if (this.coefficients[1] !== 0) {
                result.push(this.coefficients[1] + " t");
            }
            for (var i = 2; i < length; ++i) {
                if (this.coefficients[i] !== 0) {
                    result.push(this.coefficients[i] + " t^" + i);
                }
            }
            break;
        }
        return result.join(' + ');
    }

    toControlPoints() {
        const [c0 = 0.0, c1 = 0.0, c2 = 0.0, c3 = 0.0] = this.coefficients;
        return [c0,
                c0 + c1 / 3,
                c0 + 2 * c1 / 3 + c2 / 3,
                c0 + c1 + c2 + c3]
    }
};
