
/**
 * Creates a simple HTML element.
 * @param {String} nodeName
 * @param {Object} params
 * @param {Object} [params.class] - if provided, classes will be applied
 * @param {Object} [params.text] - if provided, content will be this (safe)
 * @returns {Node}
 */
export function createElement(nodeName, params) {
    const el = document.createElement(nodeName);
    Object.assign(el, params)
    if (params?.class) {
        params.class.split(' ').map((cls) => el.classList.add(cls))
    }
    if (params?.text) {
        el.appendChild(document.createTextNode(params.text))
    }
    return el
}
