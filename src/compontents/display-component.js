/**
 * Very simple display utility.
 */

import { Component, Input, Output } from 'rete';
import { FieldControl } from '../utils/field-control.js';
import Socket from '../sockets.js';

export class DisplayComponent extends Component {
    constructor(){
        super("Display");
    }

    builder(node) {
        const input = new Input('num',"Number", Socket.num);
        input.addControl(new FieldControl(this.editor, 'num', 'number'))

        return node
            .addInput(input)
    }

    worker(rawDataNode, inputs, outputs) {
        const nodeOnUI = this.editor.nodes.find(n => n.id === rawDataNode.id)
        const control = nodeOnUI.inputs.get('num').control
        const isInputPlugged = inputs['num'].length
        const n1 = isInputPlugged ? inputs['num'][0] : rawDataNode.data.num;

        control.setValueNoProcess(n1)
        control.setEnabled(false)
    }
}