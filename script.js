// ================================
// Create Map
// ================================

var map = L.map('map').setView([22.5,80],5);


// ================================
// Base Map
// ================================

var osm =
L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
attribution:'© OpenStreetMap'
}
).addTo(map);



// Layer Variables

var floodLayer;
var buildingLayer;




// ================================
// Flood Colors
// ================================

function getFloodColor(dn){

return dn==1 ? "green":
       dn==2 ? "yellow":
       dn==3 ? "orange":
       dn==4 ? "red":
       dn==5 ? "maroon":
       "gray";

}





// ================================
// WFS URLs
// ================================


const wfsUrl =
"asset/floodlayer.geojson";



const buildingUrl =

"asset/risk_building_distance.geojson";






// ================================
// LOAD FLOOD LAYER
// ================================


fetch(wfsUrl)

.then(res=>res.json())

.then(data=>{



let dropdown =
document.getElementById("floodSelect");



dropdown.innerHTML =
"<option value=''>Select Flood Level</option>";



for(let i=1;i<=5;i++){


let op =
document.createElement("option");


op.value=i;

op.textContent =
"Flood Level "+i;


dropdown.appendChild(op);


}






floodLayer =
L.geoJSON(
data,
{


style:function(feature){


let dn =
Number(feature.properties.DN);



return {


color:"black",

weight:1,

fillColor:getFloodColor(dn),

fillOpacity:0.6


};



},




onEachFeature:function(feature,layer){


let dn =
feature.properties.DN;



layer.bindPopup(

`
<b>Flood Level:</b>
${dn}
`

);



layer.on(
"click",
function(){

map.fitBounds(
layer.getBounds()
);


});



}


}

);



// add layer

floodLayer.addTo(map);



map.fitBounds(
floodLayer.getBounds()
);



createLayerControl();



})

.catch(err=>{

console.log(
"Flood Error",
err
);

});









// ================================
// LOAD BUILDING LAYER
// ================================


fetch(buildingUrl)

.then(res=>res.json())

.then(data=>{



let count=1;



buildingLayer =
L.geoJSON(
data,
{


style:function(){


return {

color:"blue",

weight:2,

fillColor:"cyan",

fillOpacity:0.5

};


},





onEachFeature:function(feature,layer){


let p =
feature.properties;



let buildingNo =

p.building_id ??
p.BUILDING_ID ??
p.id ??
p.ID ??
p.fid ??
count;





let riskZone =

p.risk_zone ??
p.RISK_ZONE ??
p.risk ??
p.RISK ??
"Not Available";






let distanceKM =

p.distance_k ??
p.DISTANCE_K ??
"Not Available";






layer.bindPopup(

`

<b>Building No:</b>
${buildingNo}

<br><br>

<b>Risk Zone:</b>
${riskZone}

<br><br>

<b>Distance (km):</b>
${distanceKM} km

`

);






layer.on(
"click",
function(){


map.fitBounds(
layer.getBounds()
);


layer.openPopup();


});



count++;



}


}

);




// add building layer

buildingLayer.addTo(map);



createLayerControl();



})

.catch(error=>{

console.log(
"Building Error",
error
);

});








// ================================
// Layer Toggle Control
// ================================


function createLayerControl(){


if(
floodLayer &&
buildingLayer
){



L.control.layers(

{

"OpenStreetMap":osm

},


{

"Flood Vulnerability":floodLayer,

"Buildings":buildingLayer

},


{
collapsed:false
}


).addTo(map);



}



}









// ================================
// Flood Dropdown Filter
// ================================


document
.getElementById("floodSelect")
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




if(dn===selected){


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

fillColor:getFloodColor(dn),

fillOpacity:0.4


});


}



});


});

