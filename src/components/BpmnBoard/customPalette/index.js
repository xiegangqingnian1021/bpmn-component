import CustomPalette from './CustomPalette.js';
import CustomRenderer from './CustomRenderer.js';

export default {
    __init__: ['customPalette', 'customRenderer'],
    customPalette: ['type', CustomPalette],
    customRenderer: ['type', CustomRenderer]
};
