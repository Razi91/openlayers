(window.webpackJsonp=window.webpackJsonp||[]).push([[161],{404:function(e,r,t){"use strict";t.r(r);for(var a=t(3),n=t(2),o=t(1),s=t(5),w=t(4),p=t(9),c=t(66),i=t(78),u=Object(w.i)("EPSG:3857").getExtent(),v=Object(o.E)(u)/256,l=new Array(22),b=0,g=l.length;b<g;++b)l[b]=v/Math.pow(2,b);var h=new i.a({extent:[-13884991,2870341,-7455066,6338219],resolutions:l,tileSize:[512,256]}),m=[new s.a({source:new p.b}),new s.a({source:new c.a({url:"https://ahocevar.com/geoserver/wms",params:{LAYERS:"topp:states",TILED:!0},serverType:"geoserver",tileGrid:h})})];new a.a({layers:m,target:"map",view:new n.a({center:[-10997148,4569099],zoom:4})})}},[[404,0]]]);
//# sourceMappingURL=wms-custom-tilegrid-512x256.js.map