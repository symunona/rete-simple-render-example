
import { NodeEditor, Engine } from 'rete';
import ConnectionPlugin from 'rete-connection-plugin';

import SimplestRenderPlugin from './src/renderer/simplest-render-plugin.js';
import SimplestContextMenuPlugin from './src/context-menu/simplest-context-menu-plugin.js';
import { NumComponent } from './src/compontents/num-component.js';
import { AddComponent } from './src/compontents/add-component.js';
import { DisplayComponent } from './src/compontents/display-component.js';

import data from './simple.json' assert {type: 'json'};
import data2 from './simple2.json' assert {type: 'json'};

async function start(container) {

    const editor = new NodeEditor('retejs@0.1.2', container);
    const engine = new Engine('retejs@0.1.2');

    window.editor = editor;

    window.exportJson = ()=>{
        let data = window.editor.toJSON();
        console.log(data)
        console.log(JSON.stringify(data))
    }

    // Switch Dataset
    window.switchTo = async (n)=>{
        switch(n){
            case 1: await editor.fromJSON(data); break;
            case 2: await editor.fromJSON(data2);
        }
        editor.trigger('process')
    }

    editor.use(ConnectionPlugin);
    editor.use(SimplestRenderPlugin);
    editor.use(SimplestContextMenuPlugin);


    // This keeps the underlying graph up-to-date.
    editor.on('process nodecreated noderemoved connectioncreated connectionremoved', async () => {
        if(editor.silent) return;

        await engine.abort();

        // This is what's recomputes the actual values and calls the workers of the components.
        // This looks like it's a very naive way of re-computing the whole net on each
        // change right away.
        const start = new Date
        await engine.process(editor.toJSON());
        console.log(`Recompute took ${new Date - start}ms`)
    });

    const components = [
        new NumComponent,
        new AddComponent,
        new DisplayComponent
    ]
    components.forEach((comp)=>{
        editor.register(comp)
        engine.register(comp)
    })

    await editor.fromJSON(data);

    editor.view.resize();
    editor.trigger('process');

    return { editor, engine }
}

start(document.getElementById('rete'))