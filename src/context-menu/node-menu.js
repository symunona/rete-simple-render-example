import Menu from './menu.js';

export default class NodeMenu extends Menu {
    constructor(editor, position, node) {
        super(editor.view.container, position);

        const items = []

        const defaultDeleteCallback = () => {
            if (editor.selected.list.indexOf(node) !== -1) {
                editor.selected.remove(node);
            }
            editor.removeNode(node);
        }
        items.push({ text: 'Delete', onclick: defaultDeleteCallback});

        const defaultCloneCallback = async () => {
            const { name, position: [x, y], ...params } = node;
            const component = editor.components.get(name);
            const newNode = await component.createNode(component);

            Object.assign(newNode, { position: [x + 10,y + 10], ...params })
            editor.addNode(newNode);
        }
        items.push({ text: 'Clone', onclick: defaultCloneCallback});

        console.log(items)
        this.setItems(items)
    }
}
