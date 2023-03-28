/**
 * Simple context menu plugin without the use of Vue.
 */

import MainMenu from "./main-menu.js";
import NodeMenu from "./node-menu.js";


/**
 * @param {Rete.Editor} editor
 * @param {Object} param1
 */
function install(editor) {
    editor.bind('hidecontextmenu');
    editor.bind('showcontextmenu');

    let currentMenu;

    editor.on('hidecontextmenu', () => {
        if (currentMenu) currentMenu.destroy();
    });

    editor.on('click contextmenu', () => {
        editor.trigger('hidecontextmenu');
    });

    editor.on('contextmenu', ({ e, node }) => {
        e.preventDefault();
        e.stopPropagation();
        if (!editor.trigger('showcontextmenu', { e, node })) return;

        const position = {x: e.clientX, y: e.clientY};

        if (currentMenu){
            currentMenu.destroy()
        }

        if(node) {
            currentMenu = new NodeMenu(editor, position, node);
        } else {
            currentMenu = new MainMenu(editor, position)
        }
    });
}

export default {
    name: 'context-menu',
    install
}
