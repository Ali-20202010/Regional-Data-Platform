    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/widgets/Legend"
      ], function (Map, MapView, FeatureLayer, Legend) {
        const defaultSym = {
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          color: [0, 0, 0, 0],
          outline: {
            // autocasts as new SimpleLineSymbol()
            color: "#71de6e",
            width: 1
          }
        };

        /*****************************************************************
         * Set a size visual variable on the renderer. Size visual variables
         * create continuous ramps that map low data values to small icons
         * and high data values to large icons. Features
         * with data values in between the min and max data values are assigned
         * a size proportionally between the min and max sizes specified in
         * `minSize` and `maxSize` or `stops`.
         *****************************************************************/

   var popuoCOP= {
        "title": "{iso3}",
        
        "content": "<b>Country :</b> {iso3}<br><b>Type of Camp:</b> {loc_type} <br><b>Location:</b> {name}<br><b> Created on :</b> {createdate}<br><b> Updated on :</b> {updatedate}<br><b> Source :</b> {source}<br><b> Footnote :</b> {footnote}"
         
      }

        const pocLayer = new FeatureLayer({
          url:
            "https://gis.unhcr.org/arcgis/rest/services/core/wrl_ppl_poc_p_unhcr/MapServer/0/",
         outFields: ["iso3","pcode","iso3","name","loc_type","updatedate"],
           fieldInfos: [
            {
              fieldName: "updatedate",
              format: {
                dateFormat: "short-date",
              }
            }
          ],
      
        popupTemplate: popuoCOP
        });

        const map = new Map({
          basemap: "dark-gray-vector",
          layers: [pocLayer]
        });

        const view = new MapView({
          container: "viewDiv",
          map: map,
          center: [33.2232, 43.6793],
          zoom: 3
        });

        /******************************************************************
         *
         * Add layers to layerInfos on the legend
         *
         ******************************************************************/

        view.ui.add(
          new Legend({
            view: view
          }),
          "top-left"
        );
      });
