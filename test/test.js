import LayerSelector from 'facade/layerselector';


fetch("https://emiliopardo.github.io/integracion-plugins/visores/web-components/configurations/ieca/fullpage/iepabra.json")
// fetch("https://emiliopardo.github.io/integracion-plugins/visores/web-components/configurations/ieca/fullpage/grid_poblacion.json")
// fetch("https://emiliopardo.github.io/integracion-plugins/visores/web-components/configurations/ieca/fullpage/razon_mortalidad_250m.json")
// fetch("https://emiliopardo.github.io/integracion-plugins/visores/web-components/configurations/ieca/fullpage/epla.json")
// fetch("https://emiliopardo.github.io/integracion-plugins/visores/web-components/configurations/ieca/fullpage/direst.json")
  .then(res => {
    if (res.ok) {
      return res.json()
    }
  })
  .then(json => {
    let legendLayers = new Array();
    let arrayoverlaylayers = new Array();
    let arraybaselayers = new Array();
    let baselayers = json.configuration.baselayers
    let overlaylayers = json.configuration.overlaylayers

    console.log(json)

    //Se definen las capas bases
    baselayers.forEach(baselayer => {
      let layer = new M.layer.WMS({
        url: baselayer.url,
        name: baselayer.name,
        legend: baselayer.legend,
        transparent: baselayer.transparent,
        tiled: baselayer.tiled,
        version: "1.1.0"
      }, {
        queryable: baselayer.queryable
      })

      layer.setLegendURL(baselayer.urlLegend)

      //Si en el archivo de configuración viene definida la opacidad se define al crear el layer de mapea
      if (baselayer.opacity) {
        layer.setOpacity(baselayer.opacity)
      }
      arraybaselayers.push(layer)

    })

    //Se construye el objeto mapa 
    const mapajs = M.map({
      container: "mapajs",
      layers: arraybaselayers,
      controls: json.configuration.controls,
      maxExtent: json.configuration.maxExtent,
      projection: "EPSG:25830*m",
    });

    //Se itera por todas las capas overlay de la configuración y se crean los layers de mapea
    overlaylayers.forEach(element => {
      let layer = new M.layer.WMS({
        url: element.url,
        name: element.name,
        legend: element.legend,
        transparent: element.transparent,
        tiled: element.tiled,
        version: "1.1.0"
      }, {

        queryable: element.queryable,
        styles: element.style,
      })
      layer.setId(element.id)
      layer.setLegendURL(element.urlLegend);

      if (element.opacity) {
        layer.setOpacity(element.opacity)
      }

      if (element.showLegend) {
        legendLayers.push({
          id: element.id,
          layer: layer
        })
      } else {
        arrayoverlaylayers.push(layer)
      }
    });

    //mapajs.addControls(["layerswitcher"]);
    mapajs.zoomToMaxExtent();
    //Se cargan los layers de overlay en el mapa
    mapajs.addLayers(arrayoverlaylayers);

    const simpleLegend = new M.plugin.Simplelegend();
    mapajs.addPlugin(simpleLegend);

    const configLayerSelector = {
      nested: json.configuration.nested,
      group: json.configuration.group,
      layerGroups: json.configuration.layerGroups,
      legendLayers: legendLayers,
      selectedLayerId: json.configuration.selectedLayerId
    }

    const layerSelector = new LayerSelector(configLayerSelector);

    mapajs.addPlugin(layerSelector);

    //abrimos el panel del plugin
    layerSelector.panel_.open();
    

  }).catch(err => {
    throw err
  })






