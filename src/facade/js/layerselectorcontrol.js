/* eslint-disable no-console */

/**
 * @module M/control/LayerSelectorControl
 */

import LayerSelectorImplControl from 'impl/layerselectorcontrol';
import template from 'templates/layerselector';
import templateOptgroup from 'templates/layerselectorOptgroup';
import templateNestedOptgroup from 'templates/layerselectorNestedOptgroup';

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
        this.config_.legendLayers.forEach(element => {

          this.map_.addLayers(element.layer)
        })
      } else {
        this.config_.legendLayers.forEach(element => {
          if (element.id == value) {
            this.map_.addLayers(element.layer)
          }
        })
      }
    })

    this.parentSelectLayer = html.querySelector("select#parentSelectLayer");

    if (typeof (this.parentSelectLayer) != "undefined") {
      this.parentSelectLayer.addEventListener("change", () => {
        let value = this.parentSelectLayer.value;

        console.log(value)
      })
    }


    // let selectContainer = html.querySelector("div#select-container");
    // if (this.config_.legendLayers.length > 1) {
    //   // GRUPOS DE CAPAS NO ANIDADAS
    //   if (this.config_.nested == false) {
    //     this.selectLayer = document.createElement("select");
    //     this.selectLayer.name = "selectLayer";
    //     this.selectLayer.id = "selectLayer";
    //     if (this.config_.selectedLayerId == "all") {
    //       let myOption = document.createElement("option");
    //       myOption.text = "Todas las Capas";
    //       myOption.value = "all";
    //       myOption.selected = "selected";
    //       this.selectLayer.appendChild(myOption);
    //     } else if (this.config_.selectedLayerId == "none") {
    //       let myOption = document.createElement("option");
    //       myOption.text = "Seleccione una opción";
    //       myOption.selected = "selected";
    //       myOption.disabled = true;
    //       this.selectLayer.appendChild(myOption);
    //     }



    //     // GRUPOS DE CAPAS ANIDADAS
    //   } else if (this.config_.nested == true) {
    //     this.parentSelectLayer = document.createElement("select");
    //     this.parentSelectLayer.name = "parentSelectLayer";
    //     this.parentSelectLayer.id = "parentSelectLayer";
    //     this.config_.layerGroups.forEach(element => {
    //       let myOption = document.createElement("option");
    //       myOption.text = element.label;
    //       myOption.value = element.label;
    //       this.parentSelectLayer.appendChild(myOption)
    //     })

    //     this.selectLayer = document.createElement("select");
    //     this.selectLayer.name = "selectLayer";
    //     this.selectLayer.id = "selectLayer";
    //     this.selectLayer.style.width = "70%";
    //     // GRUPOS DE CAPAS ANIDADAS CON OPTGROUP	
    //     if (this.config_.group == true) {
    //       this.config_.layerGroups[0].layerGroup.forEach(group => {
    //         let optgroup = document.createElement("optgroup");
    //         optgroup.label = group.optgroup
    //         this.selectLayer.appendChild(optgroup)
    //         group.layersId.forEach(element => {
    //           this.config_.legendLayers.forEach(legendlayer => {
    //             if (legendlayer.id === element) {
    //               let myOption = document.createElement("option");
    //               myOption.text = legendlayer.layer.legend;
    //               myOption.value = element;
    //               optgroup.appendChild(myOption)
    //             }
    //           })
    //         })
    //       })
    //     }

    //     selectContainer.appendChild(this.parentSelectLayer)
    //     selectContainer.appendChild(this.selectLayer)
    //   }
    // }
    // if (typeof (this.parentSelectLayer) != "undefined") {
    //   this.parentSelectLayer.addEventListener("change", () => {
    //     this.selectLayer = document.querySelector("select#selectLayer");
    //     console.log(this.config_.layerGroups)

    //     this.selectLayer.innerHTML = "";
    //     let myOption = document.createElement("option");
    //     myOption.text = "Seleccione una opción";
    //     myOption.disabled = true;
    //     myOption.selected = true;
    //     this.selectLayer.appendChild(myOption)
    //     this.config_.layerGroups.forEach(element => {
    //       if (element.label == this.value) {
    //         element.layerGroup.forEach(group => {
    //           let optgroup = document.createElement("optgroup");
    //           optgroup.label = group.optgroup
    //           this.selectLayer.appendChild(optgroup)
    //           group.layersId.forEach(element => {
    //             this.config_.legendLayers.forEach(legendlayer => {
    //               if (legendlayer.id === element) {
    //                 let myOption = document.createElement("option");
    //                 myOption.text = legendlayer.layer.legend;
    //                 myOption.value = element;
    //                 optgroup.appendChild(myOption)
    //               }
    //             })
    //           })
    //         })

    //       }
    //     })

    //   })

    // }

    // this.selectLayer.addEventListener("change", () => {
    //   //si tenemos la opcion "Seleccione una capa" la borramos cuando se produce un change
    //   if (this.selectLayer.options[0].value == "none") {
    //     this.selectLayer.remove(0)
    //   }
    //   this.config_.legendLayers.forEach(element => {
    //     this.map_.removeLayers(element.layer)
    //   })

    //   if (this.value == "all") {
    //     let arrayLayers = new Array();
    //     this.config_.legendLayers.forEach(element => {
    //       this.map_.addLayers(element.layer)
    //       arrayLayers.push(element.layer)

    //       //simpleLegendPlugin.updateLegend(arrayLayers)
    //     })
    //   } else {
    //     this.config_.legendLayers.forEach(element => {
    //       console.log(this.value)
    //       if (this.value == element.id) {
    //         this.map_.addLayers(element.layer)
    //         //simpleLegendPlugin.updateLegend(element.layer)
    //       }
    //     })
    //   }
    // }, false);
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
      console.log("sin nested y sin grupos")
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


    console.log(this.templateVars)
  }

  loadLayers() {
    if (this.config_.selectedLayerId == "all") {
      this.legendLayers.forEach(layer => {
        this.map_.addLayers(layer.layer)
      })
    } else {
      this.legendLayers.forEach(layer => {
        if (layer.id == this.config_.selectedLayerId) {
          this.map_.addLayers(layer.layer)
        }
      })

    }
  }
}
