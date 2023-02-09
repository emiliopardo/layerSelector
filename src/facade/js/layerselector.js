/**
 * @module M/plugin/LayerSelector
 */
import 'assets/css/layerselector';
import LayerSelectorControl from './layerselectorcontrol';
import api from '../../api.json';

export default class LayerSelector extends M.Plugin {
  /**
   * @classdesc
   * Main facade plugin object. This class creates a plugin
   * object which has an implementation Object
   *
   * @constructor
   * @extends {M.Plugin}
   * @param {Object} impl implementation object
   * @api stable
   */
  constructor(config) {
    super();
    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.map_ = null;
    this.config_ = config;
    this.position_ = this.config_.position || 'TR';

    if (this.position_ === 'TL' || this.position_ === 'BL') {
      this.positionClass_ = 'left';
    } else {
      this.positionClass_ = 'right';
    }

    /**
     * Array of controls
     * @private
     * @type {Array<M.Control>}
     */
    this.controls_ = [];

    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;

    /**
     * Name
     * @public
     * @type {string}
     */
    this.name = 'LayerSelector';
  }

  /**
   * This function adds this plugin into the map
   *
   * @public
   * @function
   * @param {M.Map} map the map to add the plugin
   * @api stable
   */
  addTo(map) {
    this.controls_.push(new LayerSelectorControl(this.config_));
    this.map_ = map;
    // panel para agregar control - no obligatorio
    this.panel_ = new M.ui.Panel('panelLayerSelector', {
      // collapsible: false,
      collapsible: true,
      collapsedButtonClass: 'g-cartografia-capas2',
      className: `m-layer-selector ${this.positionClass_}`,
      position: M.ui.position[this.position_],
      tooltip: 'Selector de Capas',
    });
    this.panel_.addControls(this.controls_);
    this.panel_.on(M.evt.ADDED_TO_MAP, () => {
      this.fire(M.evt.ADDED_TO_MAP);
    });
    map.addPanels(this.panel_);
  }

  /**
   * This function gets metadata plugin
   *
   * @public
   * @function
   * @api stable
   */
  getMetadata(){
    return this.metadata_;
  }

}
