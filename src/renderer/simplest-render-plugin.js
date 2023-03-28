/**
 * Super lightweight ReteJS render plugin to demonstrate how ReteJS works without Vue.
 *
 * Vue requires a bundler, this works out of the box, even with browser native imports.
 */

import Rete from 'rete';

/**
 * Creates a simple HTML element.
 * @param {String} nodeName
 * @param {Object} params
 * @param {Object} [params.class] - if provided, classes will be applied
 * @param {Object} [params.text] - if provided, content will be this (safe)
 * @returns {Node}
 */
function createElement(nodeName, params) {
    const el = document.createElement(nodeName);
    Object.assign(el, params)
    if (params?.class) {
        params.class.split(' ').map((cls) => el.classList.add(cls))
    }
    if (params?.text && nodeName !== 'a') {
        el.appendChild(document.createTextNode(params.text))
    }
    return el
}


function install(editor, params) {
    // When a node is updated, do smart re-rendering, e.g. dynamic number of inputs/outputs.
    editor.bind('updatenode')
    // Subscribe to general editor events.
    editor.on('rendernode updatenode', createNodeElement)
    editor.on('rendercontrol', createControlElement)
}

/**
 * Called by the editor's event dispatcher when we create the elements.
 *
 * @param {Object} p
 * @param {Node} p.el - DOM element to append the content to.
 * @param {Rete.Node} p.node - Rete's node element
 * @param {Function} p.bindSocket - Bound when
 */
function createNodeElement({ el, node, bindSocket, bindControl }) {

    // Within the node element, create a node wrapper div.
    const nodeElement = createElement('div', { class: 'node' })

    // Header of each node.
    const title = createElement('h1', { class: 'title', text: node.name + ' #' + node.id })

    nodeElement.appendChild(title)

    // Empty if there was content in the element before
    el.innerHTML = ''
    node._el = el;

    // Save for later, if we get called by 'updatenode' event, just restore these from there.
    node._bindSocket = node._bindSocket || bindSocket
    node._bindControl = node._bindControl || bindControl

    el.appendChild(nodeElement)

    // Render Output sockets.
    Array.from(node.outputs.values()).forEach((output) => {
        nodeElement.appendChild(createOutputElement(output, node._bindSocket))
    })

    // Controls: do not render them, just call bindControl, through the event
    // loop it will get created.
    Array.from(node.controls.values()).forEach(control => {
        const inputControlWrapper = createElement('div', { class: 'control' })
        nodeElement.appendChild(inputControlWrapper)
        node._bindControl(inputControlWrapper, control)
    })

    // Create input sockets
    Array.from(node.inputs.values()).forEach((input) => {
        nodeElement.appendChild(createInputElement(input, node._bindSocket, node._bindControl))
    })

    // This is specific to FieldControl: if there is a newInput function, render
    // a new input append button. This solution is not nice, but I do not think this
    // event-driven flow building is nice...
    if (node.newInput){
        const adder = createElement('a', { text: 'Add Input', onclick: node.newInput})
        nodeElement.appendChild(adder)
    }
}

/**
 * Creates the DOM representation of a simple output socket.
 * @param {Rete.Output} output
 * @param {Function} bindSocket
 * @param {Function} bindControl
 * @returns
 */
function createOutputElement(output, bindSocket) {
    const wrapper = createElement('div', { class: 'output-wrapper' })
    const label = createElement('div', { class: 'output-title', text: output.name })
    const socketElement = createElement('div', { class: 'output socket', title: output.socket.name })
    wrapper.appendChild(label)
    wrapper.appendChild(socketElement)

    bindSocket(socketElement, 'output', output)
    return wrapper
}

/**
 * Creates the DOM representation of a simple input socket.
 * @param {Rete.Input} input
 * @param {Function} bindSocket
 * @returns {Node}
 */
function createInputElement(input, bindSocket, bindControl) {
    const wrapper = createElement('div', { class: 'input' })
    const socketElement = createElement('div', { class: 'input socket', title: input.socket.name })
    const inputControlWrapper = createElement('div', { class: 'input-control' })

    bindControl(inputControlWrapper, input.control)

    wrapper.appendChild(socketElement)
    wrapper.appendChild(inputControlWrapper)

    bindSocket(socketElement, 'input', input)

    return wrapper
}

/**
 * Creates a DOM node for a simple FieldControl element
 * @param {Rete.Control} control
 * @param {Function} bindControl
 * @returns {Node} DOM node for the input.
 */
function createControlElement({ el, control }) {
    const value = control.getValue()
    control._input = createElement('input', {
        placeholder: '',
        value: value,
        onchange: (e) => {
            control.setValue(control._input.value)
        }
    })
    control._update = () => {
        control._input.value = control.getValue()
        if (control.isEnabled()){
            control._input.removeAttribute('disabled')
        } else {
            control._input.setAttribute('disabled', true)
        }

    }
    control._update();
    el.appendChild(control._input)
    return control._input
}

export default {
    install
}