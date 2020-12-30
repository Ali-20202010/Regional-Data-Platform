  var map;
  require([
      "esri/Map",
      "esri/views/MapView",
      "dojo/on",
      "esri/tasks/support/Query",
      "esri/layers/FeatureLayer",
	  "esri/layers/TileLayer",
      "dojo/store/Memory",
      "dojo/_base/array",
      "dojo/_base/lang",
      "esri/request",
      "dojo/parser",
      "dijit/registry",
      "esri/widgets/Search",
	   "esri/widgets/Legend",

      "dijit/layout/BorderContainer",
      "dijit/layout/ContentPane",
      "dijit/form/Button",
      "dijit/form/ComboBox",
      "dojo/domReady!"
    ], function(
      Map, MapView, on, Query, FeatureLayer,TileLayer, Memory, array, lang, esriRequest, parser, registry, Search,Legend
    ) {
      parser.parse();
       map = new Map({
          basemap: "dark-gray-vector",
         
        });

       

        var view = new MapView({
          container: "viewDiv",
          map: map,
		  center: [26.8206, 30.8025],
		zoom: 5
        });
		        view.ui.add(
          new Legend({
            view: view
          }),
          "top-right"
        );
		
		  var searchWidget = new Search({
        view: view,
        container: "searchDiv"
      });
	  
	     esriRequest('https://services7.arcgis.com/S9LAFnsxHsSpUJFQ/arcgis/rest/services/Arab_countries_map/FeatureServer/0/query?where=1%3D1&outFields=CNTRY_NAME&returnGeometry=false&orderByFields=CNTRY_NAME&returnDistinctValues=true&f=json',
      {
        responseType:'json',
        timeout:15000
      }).then(lang.hitch(this,function(response){
        var store2 = new Memory({data:[]});
        registry.byId("countrySelect").set('store',store2);
        var data = array.map(response.data.features,lang.hitch(this,function(feat, index){
          var name = feat.attributes.CNTRY_NAME;
          var value = feat.attributes.CNTRY_NAME;
          var dataItem = {
            id:index,
            name,
            value:value
          };
          return dataItem;
        }));
        store2 = new Memory({data:data});
        registry.byId("countrySelect").set('store',store2);
      }));

  var Countries = new FeatureLayer({
        url: "https://services7.arcgis.com/S9LAFnsxHsSpUJFQ/arcgis/rest/services/Arab_countries_map/FeatureServer/0",
        outFields: ["*"]
      });
	        
        var pocPopup= {
        "title": "{iso3}",
        
        "content": "<b>Country :</b> {iso3}<br><b>Type of Camp:</b> {loc_type} <br><b>Location:</b> {name}<br><b> Created on :</b> {createdate}<br><b> Updated on :</b> {updatedate}<br><b> Source :</b> {source}<br><b> Footnote :</b> {footnote}"
         
      }

        const pocLayer = new FeatureLayer({
          url:
            "https://gis.unhcr.org/arcgis/rest/services/core/wrl_ppl_poc_p_unhcr/MapServer/0/",
             id: "poc-UNHCR",
          visible: false,
         outFields: ["iso3","pcode","iso3","name","loc_type","updatedate"],
           fieldInfos: [
            {
              fieldName: "updatedate",
              format: {
                dateFormat: "short-date",
              }
            }
          ],
      
        popupTemplate: pocPopup
        });
        var chgTempLayer = new TileLayer({
          url:
            "https://tiles.arcgis.com/tiles/S9LAFnsxHsSpUJFQ/arcgis/rest/services/Chg_in_temperature_Midcentury_2046_2065/MapServer",
          // This property can be used to uniquely identify the layer
          id: "chgTemp",
          visible: false
        });
        var tempLayer = new TileLayer({
          url:
            "https://tiles.arcgis.com/tiles/S9LAFnsxHsSpUJFQ/arcgis/rest/services/Temperature_1986_2005/MapServer",
         
          id: "temps",
          visible: false
        });
            var landLayer = new TileLayer({
          url:
            "https://tiles.arcgis.com/tiles/S9LAFnsxHsSpUJFQ/arcgis/rest/services/Land_Use_Land_Cover_Arab_Region/MapServer",
          
          id: "lands",
          visible: false
        });
        var cropLandLayer = new TileLayer({
          url:
            "https://tiles.arcgis.com/tiles/S9LAFnsxHsSpUJFQ/arcgis/rest/services/Irrigated_Croplands_Arab_Region/MapServer",
          id: "Ar-cropLand",
         visible: false
        });
		
		

     
        view.on("layerview-create", function (event) {
            if (event.layer.id === "poc-UNHCR") {
           
            console.log(
              "LayerView for POC created!", event.layerView);
          }
          if (event.layer.id === "Ar-cropLand") {
           
            console.log(
              "LayerView for Arab Crop Lands created!", event.layerView);
          }
          if (event.layer.id === "chgTemp") {
          
            console.log("LayerView for Tempreature 2046-2065 created!", event.layerView);
          }
            if (event.layer.id === "lands") {
            // Explore the properties of the transportation layer's layer view here
            // Explore the properties of the transportation layer's layer view here
            console.log("LayerView for Land use created!", event.layerView);
          }
          if (event.layer.id === "temps") {
          
            console.log("LayerView for temperature  created!", event.layerView);
          }
        });

        view.when(function () {
          cropLandLayer.when(function () {
            view.goTo(cropLandLayer.fullExtent).catch(function (error) {
              if (error.name != "AbortError") {
                console.error(error);
              }
            });
          });
        });
 var pocLayerToggle = document.getElementById("pocsLayer");

        pocLayerToggle.addEventListener("change", function () {
         pocLayer.visible = pocLayerToggle.checked;
        });
        var chgTempLayerToggle = document.getElementById("chgTempsLayer");

      
        chgTempLayerToggle.addEventListener("change", function () {
         chgTempLayer.visible = chgTempLayerToggle.checked;
        });
            var landLayerToggle = document.getElementById("landsLayer");

        landLayerToggle.addEventListener("change", function () {
          landLayer.visible = landLayerToggle.checked;
        });

        var tempLayerToggle = document.getElementById("tempsLayer");

        tempLayerToggle.addEventListener("change", function () {
          tempLayer.visible = tempLayerToggle.checked;
        });
        var cropLandLayerToggle = document.getElementById("cropLandsLayer");

        cropLandLayerToggle.addEventListener("change", function () {
          cropLandLayer.visible = cropLandLayerToggle.checked;
        });
		var toggler = document.getElementsByClassName("caret");
var i;

for (i = 0; i < toggler.length; i++) {
  toggler[i].addEventListener("click", function() {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    
  });
}
     
app = {
        zoomRow: function(id, which){
          var cb = registry.byId("countrySelect");
          console.info(cb.item.value);
          var sym = {
            type: "simple-fill",  // autocasts as new SimpleFillSymbol()
            color: [255, 255, 255, .12],
		   
            outline: {  // autocasts as new SimpleLineSymbol()
              color: [128, 128, 128, 1],
              width: "0.5px"
            }
          }, gra;
          view.graphics.removeAll();
          var query = Countries.createQuery();
          var thePoly, theExtent;
          if(which == "Country"){
            query.outFields=[];
            query.outSpatialReference = view.spatialReference;
            query.where = "CNTRY_NAME='" + (id).toString() + "'";
            console.info(query.where);
            query.returnGeometry = true;
            Countries.queryFeatures(query).then(function(response){
              gra = response.features[0];
              gra.symbol = sym;
              view.graphics.add(gra);
              thePoly = gra.geometry;
              theExtent = thePoly.extent.expand(.7); //Zoom out slightly from the polygon's extent
              view.goTo(theExtent);
            });
         
      
          } 
        }
      };
	map.add(pocLayer),
	  map.add(chgTempLayer),
	 map.add(tempLayer),
	  map.add(cropLandLayer),
	  map.add(landLayer)

	 });



/********************************************************************************************************************************/
// displaying json data in table
	 $(document).ready(function() {

    $('#landings_table tfoot th').each( function () { // Change table element ID here
      var title = $('#landings_table thead th').eq( $(this).index() ).text(); // Change table element ID here
      $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
    } );
   
    var url ="https://gis.unhcr.org/arcgis/rest/services/core/wrl_prp_p_unhcr/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=0.0&units=esriSRUnit_Meter&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&gdbVersion=&historicMoment=&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&multipatchOption=&resultOffset=&resultRecordCount=1000&returnTrueCurves=false&sqlFormat=none&f=pjson";  
		var table = $('#landings_table').DataTable({ // Change table element ID here
        dom: 'Bfrtip', // Add this to enable export buttons
        buttons: [ 
            'csv', 'excel', 'pdf'
        ],
        "autoWidth": true, 
        "deferRender": true, 
        "info": true, 
        "lengthChange": false, 
        "ordering": true, 
        "paging": true, 
        "processing": true, 
        "scrollX": false, 
    	"scrollY": "500px", 
        "searching": true, 
        "stateSave": false, 	
		"scrollCollapse": true, 	 		
		"ajax": { 
			"url": url, // JSON URL
			"dataSrc": "features" 
		},
		"columns": [ // Location within the JSON of each column to pipe into the HTML table, in order of columns. 
			{ data: "attributes.adm0name" },
			{ data: "attributes.name"},
			{ data: "attributes.adm2name"},
			{ data: "attributes.source"},
			{ data: "attributes.srcdate"},
			{ data: "attributes.modby"}
			
			],
		"language": {
		  "emptyTable": "Loading...",
		  "search": "Search all fields:"
		}
		});
   
    table.columns().every( function () {
      var that = this;
      $( 'input', this.footer() ).on( 'keyup change', function () {
        that
          .search( this.value )
          .draw();
      });
    }); 
	});	 
