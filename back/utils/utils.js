key = 'AIzaSyBrRh0NjtrSopoOrG-4_W3OP0nmzSDQK-M'

class property{
    _temperature_bebe = null
    _latitudeEnd = null

    _longitudeStart = null
    _longitudeEnd = null

    _unit = null


    get unit() {
        return this._unit;
    }

    set unit(value) {
        this._unit = value;
    }

    get latitudeStart() {
        return this._latitudeStart;
    }

    set latitudeStart(value) {
        this._latitudeStart = value;
    }

    get latitudeEnd() {
        return this._latitudeEnd;
    }

    set latitudeEnd(value) {
        this._latitudeEnd = value;
    }

    get longitudeStart() {
        return this._longitudeStart;
    }

    set longitudeStart(value) {
        this._longitudeStart = value;
    }

    get longitudeEnd() {
        return this._longitudeEnd;
    }

    set longitudeEnd(value) {
        this._longitudeEnd = value;
    }
}

module.exports = property
