# ReteJS experiment

Tiny ReteJS example which works without Vue.


### When is this lib useful for you?

- understand how ReteJS works
- create a different render engine
- create other plugins


### Usage

`npm i`

Host `index.html` with apache, or

`npm install http-server -g` then

`http-server`

### Motivations

- I needed a way to program flow based graphics in JS
- Looked promising as it's written in Typescript.
- Bundler: I wanted something that runs without a bundler
    - Does with my renderer


### Findings

Documentation: The engine and core are technically undocumented, zero comments in the source code.
It took me quite some hours figuring out how can I just simply create a different front-end.

Event Driven: I do not really understand the benefits of being designed this way just yet
although I did not stress test it.

Performance: the examples I found were working with one global 'process' event, which then
triggered the evaluation the graph, by first converting it to an object. That's kind of
missing the concept and benefits of this structure e.g. circling down of data changes only
to the relevant parts of the graph. But I might be missing something there.

MV?M Pattern: The separation of the engine and the front end is nice in concept,
but many times I felt I have to hack the Core->View data-flow into my components.


### Alternatives
- [ThreeNodes.js](https://idflood.github.io/ThreeNodes.js/index_optimized.html):
ThreeJS flow editor written in Coffee Script
- [NoFlo JS](https://noflojs.org/): created a protocol standard and migrated it to embedded systems too.
Looks like they are making a world-solver-machine.


