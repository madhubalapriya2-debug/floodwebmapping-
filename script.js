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
    attribution:'© OpenStreetMap'
}
).addTo(map);



var floodLayer;


// ================================
// Flood Colors
// ================================
function getFloodColor(dn){

    return dn == 1 ? "green" :
           dn == 2 ? "yellow" :
           dn == 3 ? "orange" :
           dn == 4 ? "red" :
           dn == 5 ? "maroon" :
           "gray";
}



// ================================
// GitHub GeoJSON File
// ================================
const floodmap =
"flooddissolve.geojson";



// ================================
// Load Flood GeoJSON
// ================================
fetch(floodmap)

.then(response=>{


    if(!response.ok){

        throw Error(
        "GeoJSON not found"
        );

    }

    return response.json();

})


.then(data=>{


console.log(
"Flood data loaded",
data
);



// ================================
// Dropdown 1-5
// ================================
let dropdown =
document.getElementById(
"floodSelect"
);



dropdown.innerHTML =
`
<option value="">
Select Flood Level
</option>
`;



for(let i=1;i<=5;i++){


let option =
document.createElement("option");


option.value=i;

option.textContent =
"Flood Level "+i;


dropdown.appendChild(option);


}





// ================================
// Create Layer
// ================================
floodLayer =
L.geoJSON(
data,
{


style:function(feature){


let level =
Number(
feature.properties.DN
);



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
"click",
function(){

map.fitBounds(
layer.getBounds()
);

}

);


}



}
)
.addTo(map);




// Zoom
map.fitBounds(
floodLayer.getBounds()
);



})

.catch(error=>{


console.error(
"Loading error:",
error
);


});







// ================================
// Dropdown Filter
// ================================
document
.getElementById(
"floodSelect"
)
.addEventListener(
"change",
function(){


let selected =
Number(this.value);



if(!floodLayer)
return;



floodLayer.eachLayer(
function(layer){



let dn =
Number(
layer.feature.properties.DN
);




if(dn === selected){


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
