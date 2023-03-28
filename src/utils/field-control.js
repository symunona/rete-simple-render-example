import { Control } from 'rete';

export class FieldControl extends Control {
    /**
     * @param {*} emitter
     * @param {*} key
     * @param {*} type
     * @param {*} node
     */
    constructor(emitter, key, type) {
        super(key);
        this.key = key
        this.emitter = emitter
        this._isEnabled = true
    }

    getValue(){
        return this.getData(this.key)
    }

    /**
     * @returns {Boolean}
     */
    isEnabled(){
        return this._isEnabled
    }

    /**
     * @param {Boolean} val
     */
    setEnabled(val){
        this._isEnabled = val
        this._update()
    }

    /**
     * The reason this is needed, because currently
     * when I call setValue, e.g. from the data layer
     * the new value propagates to the UI, if I call
     * the emitter, it gets into an infinite loop.
     * I really do not think you can separate the UI
     * the way this is implemented now.
     * I would expect smarter components that trigger
     * recomputes down the line, not triggering a global
     * recompute every time, just compute whatever's really
     * necessary...
     *
     * @param {*} value
     */
    setValueNoProcess(value){
        console.warn('[field-control] New Value, No process', value)
        this.putData(this.key, value)
        this._update()
    }

    setValue(value) {
        value = parseInt(value)
        console.warn('[field-control] trigger: process!', value)
        this.putData(this.key, value)
        this.emitter.trigger('process')
    }

    onChange() {}
}