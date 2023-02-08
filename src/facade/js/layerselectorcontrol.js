/* eslint-disable no-console */

/**
 * @module M/control/LayerSelectorControl
 */

import LayerSelectorImplControl from 'impl/layerselectorcontrol';
import template from 'templates/layerselector';
import templateOptgroup from 'templates/layerselectorOptgroup';
import templateNestedOptgroup from 'templates/layerselectorNestedOptgroup';
import templateNested from 'templates/layerselectorNested';

export default class LayerSelectorControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(config) {
    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(LayerSelectorImplControl)) {
      M.exception("La implementación usada no puede crear controles LayerSelectorControl");
    }
    // 2. implementation of this control
    const impl = new LayerSelectorImplControl();
    super(impl, "LayerSelector");
    this.config_ = config;
    this.selectLayer;
    this.layer_;
    this.layerList_;
    this.legendLayers = this.config_.legendLayers;
    this.checkConfig(this.config_);
  }

  /**
   * This function creates the view
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  createView(map) {
    return new Promise((success, fail) => {
      const html = M.template.compileSync(this.template, this.templateVars);
      this.addEvents(html)
      // Añadir código dependiente del DOM
      success(html);
    });
  }

  addEvents(html) {
    //se carga la/as capas establecidas de inicio
    this.loadLayers()

    this.selectLayer = html.querySelector("select#selectLayer");
    //listener para controlar el evento change del selectLayer
    this.selectLayer.addEventListener("change", () => {
      if (this.config_.selectedLayerId == "none") {
        this.selectLayer.options[0].disabled = true;
      }

      let value = this.selectLayer.value;

      this.config_.legendLayers.forEach(element => {
        this.map_.removeLayers(element.layer)
      })
      if (value == "all") {
        this.layerList_ = new Array()
        this.config_.legendLayers.forEach(element => {
          this.layer_ = element.layer;
          this.layerList_.push(this.layer_)
          this.map_.addLayers(this.layerList_)

        })
      } else {
        this.layerList_ = new Array()
        this.config_.legendLayers.forEach(element => {
          if (element.id == value) {
            this.layer_ = element.layer
            this.layerList_.push(this.layer_)
            this.map_.addLayers(this.layerList_)
          }
        })
      }
      if (this.map_.getControls({ 'name': 'Simplelegend' }).length > 0) {
        let legend = this.map_.getControls({ 'name': 'Simplelegend' })[0];
        legend.updateLegend(this.layerList_)
      }
    })

    this.parentSelectLayer = html.querySelector("select#parentSelectLayer");

    if (this.parentSelectLayer != null) {
      this.parentSelectLayer.addEventListener("change", () => {
        let value = this.parentSelectLayer.value;
        this.selectLayer.innerHTML = "";
        let find = false;
        do {
          this.config_.layerGroups.forEach(layerGroup => {
            if (layerGroup.label == value) {
              let myOption = document.createElement("option");
              myOption.text = "Seleccione una opción";
              this.selectLayer.appendChild(myOption)
              layerGroup.layerGroup.forEach(element => {
                let optgroup = document.createElement("optgroup");
                optgroup.label = element.optgroup;
                this.selectLayer.appendChild(optgroup)
                element.layersId.forEach(layersId => {
                  let find = false;
                  do {
                    this.legendLayers.forEach(layer => {
                      if (layer.id == layersId) {
                        myOption = document.createElement("option");
                        myOption.value = layersId
                        myOption.text = layer.layer.legend
                        optgroup.appendChild(myOption)
                        find = true;
                      }
                    })

                  } while (!find);
                })

              })
              find = true;
            }
          })
        } while (!find);
      })
    }
  }



  /**
   * This function compares controls
   *
   * @public
   * @function
   * @param {M.Control} control to compare
   * @api stable
   */
  equals(control) {
    return control instanceof LayerSelectorControl;
  }

  // Add your own functions

  checkConfig() {
    let find = false;
    //construccion de select simple y sin grupos
    if (!this.config_.group && !this.config_.nested) {
      let arrayLayers = new Array();
      if (this.config_.selectedLayerId == "all") {
        let optionLayer = {
          id: "all",
          legend: "Todas las capas"
        }
        arrayLayers.push(optionLayer)
      } else if (this.config_.selectedLayerId == "none") {
        let optionLayer = {
          id: null,
          legend: "Selecciones una opción"
        }
        arrayLayers.push(optionLayer)
      }

      this.template = template;
      this.config_.legendLayers.forEach((layer) => {
        let optionLayer = {
          id: layer.id,
          legend: layer.layer.legend
        }

        arrayLayers.push(optionLayer)
      })
      this.templateVars = {
        vars: {
          layers: arrayLayers,
          selectedLayerId: this.config_.selectedLayerId
        }
      }
    }
    //construccion de select simple con optgroups
    if (this.config_.group && !this.config_.nested) {
      let groups = new Array();
      this.config_.layerGroups.forEach(group => {
        let layers = new Array();
        group.layersId.forEach(layerId => {
          do {
            this.legendLayers.forEach(layer => {
              if (layer.id == layerId) {
                let OptionLayer = {
                  id: layer.id,
                  legend: layer.layer.legend
                }
                layers.push(OptionLayer)
                find = true;
              }
            })
          } while (!find);
        })
        let dataGroup = {
          optgroup: group.optgroup,
          layers: layers
        }
        groups.push(dataGroup)
      })
      this.templateVars = {
        vars: {
          groups: groups,
          selectedLayerId: this.config_.selectedLayerId
        }
      }
      this.template = templateOptgroup;
    }

    //Construccion de los select anidados con optgroup
    if (this.config_.nested && this.config_.group) {
      let groups = new Array();

      let parentSelectOptions = new Array();
      this.config_.layerGroups.forEach(group => {
        parentSelectOptions.push(group.label)
      })

      let layerGroup_0 = this.config_.layerGroups[0];
      layerGroup_0.layerGroup.forEach(group => {
        let layers = new Array();
        group.layersId.forEach(layerId => {
          do {
            this.legendLayers.forEach(layer => {
              if (layer.id == layerId) {
                let OptionLayer = {
                  id: layer.id,
                  legend: layer.layer.legend
                }
                layers.push(OptionLayer)
                find = true;
              }
            })
          } while (!find);
        })
        let options = {
          optgroup: group.optgroup,
          layers: layers
        }
        groups.push(options)
      })

      this.templateVars = {
        vars: {
          parentOptions: parentSelectOptions,
          nestedOptions: groups
        }
      }

      this.template = templateNestedOptgroup
    }

    //Construccion de los select anidados sin optgroup
    if (this.config_.nested && !this.config_.group) {
      //console.log("anidado sin grupos")

      //TODO

      this.template = templateNested;
    }




    //console.log(this.templateVars)
  }

  loadLayers() {
    if (this.config_.selectedLayerId == "all") {
      this.layerList_ = new Array()
      this.legendLayers.forEach(layer => {
        this.layer_ = layer.layer
        this.layerList_.push(this.layer_)
      })
      this.map_.addLayers(this.layerList_);
      console.log(this.layerList_)


    } else {
      this.layerList_ = new Array()
      this.legendLayers.forEach(layer => {
        if (layer.id == this.config_.selectedLayerId) {
          this.layer_ = layer.layer
          this.layerList_.push(this.layer_)

          this.map_.addLayers(this.layerList_)
        }
      })
    }

    if (this.map_.getControls({ 'name': 'Simplelegend' }).length > 0) {
      let legend = this.map_.getControls({ 'name': 'Simplelegend' })[0];
      legend.updateLegend(this.layerList_)
    }
  }
}
