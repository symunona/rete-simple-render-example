import { createElement } from "./create-element.js";

export default class Menu{
    items = []
    constructor(container, position) {
        this.element = createElement('div', {
            class: 'menu',
            style: `position: absolute; top: ${position.y}px; left:${position.x}px`});
        container.appendChild(this.element)
    }
    setItems(items){
        items.forEach((item) => {
            const itemElementWrapper = createElement('div', {class: 'menu-item', onclick: ()=>{
                this.destroy()
                item.onclick()
            }});
            const itemElement = createElement('span', {class: 'menu-item-text', text: item.text});
            itemElementWrapper.appendChild(itemElement)
            this.element.appendChild(itemElementWrapper)
        })
    }

    destroy() {
        this.element.remove()
    }
}