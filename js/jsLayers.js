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

        

   var pocPopup= {
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
      
        popupTemplate: pocPopup
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
        
        	/*****
		for hiding & displaying first layer on the map **/
	
	var checkbox = document.getElementById("Checkbox1");
checkbox.onclick = function () {
  pocLayer.visible = this.checked;
}


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
// displaying json data in table
	$(document).ready(function() {

    $('#landings_table tfoot th').each( function () { // Change table element ID here
      var title = $('#landings_table thead th').eq( $(this).index() ).text(); // Change table element ID here
      $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
    } );
   
    var url ="https://gis.unhcr.org/arcgis/rest/services/core/wrl_prp_p_unhcr/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=0.0&units=esriSRUnit_Meter&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&gdbVersion=&historicMoment=&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&multipatchOption=&resultOffset=&resultRecordCount=1000&returnTrueCurves=false&sqlFormat=none&f=pjson";  
		var table = $('#landings_table').DataTable({ // Change table element ID here
        dom: 'Bfrtip', // Add this to enable export buttons
        buttons: [ // Add this to choose which buttons to display
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
	
