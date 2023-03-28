import { Component, Input, Output } from 'rete';
import { FieldControl } from '../utils/field-control.js';
import Socket from '../sockets.js';

/**
 * A component is a type of a Rete.Node factory.
 * It gets instantiated on plugin load and the builder
 * gets the actual node data, which then will be transformed
 * into the actual UI via events.
 *
 * Why this event based thing, I do not know yet.
 */
export class AddComponent extends Component {
    constructor() {
        super("Add");
    }

    defaultData = {
        num1: 0,
        num2: 0
    }

    getInputKeys(dataObject){
        return Object.keys(dataObject).filter((name)=>name.startsWith('num'))
    }

    /**
     * Acts as a factory: creates the nodes and the necessary field controls.
     * Hooking into this is possible via subscribing to the renderNode event.
     * @param {Rete.Node} node
     * @returns
     */
    builder(node) {
        const output = new Output('num', "Number", Socket.num);

        const inputKeys = this.getInputKeys(node.data)

        node._newInput = ()=>{
            let id = 'num' + (node._inputCounter ++)

            // Set default value for new inputs being inserted!
            node.data[id] = 0
            const control = new FieldControl(this.editor, id, 'number')
            const input = new Input(id, "Number", Socket.num);
            input.addControl(control)

            node.addInput(input)
        }

        node.newInput = ()=>{
            node._newInput()

            // This is a hack I do not like: From the component, I have to
            // manually look up the UI node to be able to pass it back, when
            // the node actually updates instead of having a clear place
            // to just use as reference independent of the component.
            // This may be because I do not see what is the benefit of
            // rendering running event based...
            const nodeOnUI = this.editor.nodes.find(n => n.id === node.id)
            this.editor.trigger('updatenode', {el: nodeOnUI._el, node: nodeOnUI})
        }

        node._inputCounter = 1
        for(let inputKeyId in inputKeys){
            node._newInput()
        }

        return node
            .addOutput(output);
    }

    /**
     * This get's called by the engine I guess, and does the calculation,
     * also updating the UI with the appropriate values.
     * @param {Object} rawDataNode - !!! Not Rete.Node - this is the raw data!
     * @param {Object} inputs  !!! Not Rete.Imports - raw data
     * @param {Object} outputs  - same as the above
     */
    worker(rawDataNode, inputs, outputs) {
        console.warn('Add worker', rawDataNode)
        const inputKeys = this.getInputKeys(rawDataNode.data)

        // This just hurts my brain. Why would I have to FIND the actual node
        // by the current node's ID??@%!%@!
        // So apparently, we need to dig out the actual node INSTANCE -
        // yes, the one you just created ABOVE in the Builder, because rawDataNode
        // is not the same node as what the editor gives back.
        // Why? Beats me for now.
        const nodeOnUI = this.editor.nodes.find(n => n.id === rawDataNode.id)

        let sum = 0

        for(let inputKeyIndex in inputKeys){
            const inputKey = inputKeys[inputKeyIndex]
            const isInputPlugged = inputs[inputKey].length
            const value = isInputPlugged ? inputs[inputKey][0] : rawDataNode.data[inputKey];
            sum += value

            const control = nodeOnUI.inputs.get(inputKey).control
            control.setValueNoProcess(value)
            control.setEnabled(!isInputPlugged)
        }

        outputs['num'] = sum;
        // console.log('[WORKER] Add Updated:', n1, `(${isInput1Plugged})`, '+', n2, `(${isInput1Plugged})`, '=', sum)
    }
}