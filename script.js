// ================================
// Create Map
// ================================
var map = L.map('map').setView([22.5, 80], 5);


// ================================
// Base Map
// ================================
L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '© OpenStreetMap'
    }
).addTo(map);


var floodLayer;


// ================================
// Flood Colors
// ================================
function getFloodColor(dn) {

    return dn == 1 ? "green" :
           dn == 2 ? "yellow" :
           dn == 3 ? "orange" :
           dn == 4 ? " Red" :
           dn == 5 ? "Maroon" :
           "gray";
}



// ================================
// WFS URL
// ================================
const floodmap =
"flooddissolve.shp"


// ================================
// Load WFS
// ================================
fetch(floodmap)

.then(response => response.json())

.then(data => {


    console.log(
        "Flood Features:",
        data.features
    );


    // ================================
    // Fixed Dropdown 1-5
    // ================================
    const dropdown =
        document.getElementById("floodSelect");


    dropdown.innerHTML =
        "<option value=''>Select Flood Level</option>";


    for(let i=1;i<=5;i++){

        let option =
        document.createElement("option");


        option.value=i;

        option.textContent =
        "Flood Level " + i;


        dropdown.appendChild(option);
    }



    // ================================
    // Create Flood GeoJSON Layer
    // ================================
    floodLayer = L.geoJSON(
        data,
        {


        style:function(feature){


            let level =
            Number(feature.properties.DN);


            return {

                color:"black",

                weight:1,

                fillColor:
                getFloodColor(level),

                fillOpacity:0.6
            };
        },



        onEachFeature:function(
            feature,
            layer
        ){


            let level =
            feature.properties.DN;



            layer.bindPopup(

            `
            <b>Flood Level:</b>
            ${level}
            `

            );



            layer.on(
            'click',
            function(){


                map.fitBounds(
                    layer.getBounds()
                );


            });


        }



    }).addTo(map);



    // Zoom to flood layer
    map.fitBounds(
        floodLayer.getBounds()
    );




})

.catch(error=>{

console.error(
"Error loading WFS:",
error
);

});





// ================================
// Dropdown Filter
// ================================
document
.getElementById("floodSelect")
.addEventListener(
"change",
function(){


    let selectedLevel =
    Number(this.value);



    if(!floodLayer)
        return;




    floodLayer.eachLayer(
    function(layer){


        let dn =
        Number(
        layer.feature.properties.DN
        );



        if(dn === selectedLevel){



            // Selected flood class

            layer.setStyle({

                color:"blue",

                weight:4,

                fillColor:"cyan",

                fillOpacity:0.8
            });



            map.fitBounds(
                layer.getBounds()
            );


            layer.openPopup();



        }

        else{


            // Reset other layers

            layer.setStyle({

                color:"black",

                weight:1,

                fillColor:
                getFloodColor(dn),

                fillOpacity:0.4
            });


        }


    });


});
