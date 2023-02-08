import M$plugin$LayerSelector from '/home/epardo/proyectos/layerSelector/src/facade/js/layerselector';
import M$control$LayerSelectorControl from '/home/epardo/proyectos/layerSelector/src/facade/js/layerselectorcontrol';
import M$impl$control$LayerSelectorControl from '/home/epardo/proyectos/layerSelector/src/impl/ol/js/layerselectorcontrol';

if (!window.M.plugin) window.M.plugin = {};
if (!window.M.control) window.M.control = {};
if (!window.M.impl) window.M.impl = {};
if (!window.M.impl.control) window.M.impl.control = {};
window.M.plugin.LayerSelector = M$plugin$LayerSelector;
window.M.control.LayerSelectorControl = M$control$LayerSelectorControl;
window.M.impl.control.LayerSelectorControl = M$impl$control$LayerSelectorControl;
