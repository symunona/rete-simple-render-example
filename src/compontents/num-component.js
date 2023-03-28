import { Component, Output, Node } from 'rete';
import { FieldControl } from '../utils/field-control.js';
import Socket from '../sockets.js';

export class NumComponent extends Component {

    constructor() {
        super("Number");
    }

    defaultData = {
        num: 0,
    }
    /**
     * @param {Rete.Node} node
     * @returns
     */
    builder(node) {
        return node
            .addControl(new FieldControl(this.editor, 'num', 'number'))
            .addOutput(new Output('num', "Number", Socket.num));
    }

    worker(node, inputs, outputs) {
        outputs['num'] = node.data.num;
        return outputs
    }
}