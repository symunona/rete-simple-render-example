import { createElement } from './create-element.js';
import Menu from './menu.js';

export default class MainMenu extends Menu {
    constructor(editor, position) {
        super(editor.view.container, position);

        this.element.appendChild(createElement('div', { text: ' + Create node', class: 'menu-header'}))

        const items = []
        editor.components.forEach((component)=>{
            items.push({
                text: component.name,
                onclick: async ()=>{
                    // Create the node. First parameter is the default data of the node.
                    const comp = await component.createNode(component.defaultData)

                    // Reposition it to the context menu's position.
                    comp.position = [position.x, position.y]

                    // Append to the editor.
                    editor.addNode(comp)
                }
            })
        })

        this.setItems(items)
    }
}