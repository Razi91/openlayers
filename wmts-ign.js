(window.webpackJsonp=window.webpackJsonp||[]).push([[173],{415:function(t,e,a){"use strict";a.r(e);for(var r=a(3),i=a(2),o=a(1),n=a(5),p=a(4),g=a(94),s=a(146),w=new r.a({target:"map",view:new i.a({zoom:5,center:Object(p.f)([5,45])})}),l=[],c=[],m=Object(p.i)("EPSG:3857"),f=Object(o.E)(m.getExtent())/256,b=0;b<18;b++)c[b]=b.toString(),l[b]=f/Math.pow(2,b);var u=new s.b({origin:[-20037508,20037508],resolutions:l,matrixIds:c}),S=new g.a({url:"https://wxs.ign.fr/pratique/geoportail/wmts",layer:"GEOGRAPHICALGRIDSYSTEMS.MAPS",matrixSet:"PM",format:"image/jpeg",projection:"EPSG:3857",tileGrid:u,style:"normal",attributions:'<a href="http://www.geoportail.fr/" target="_blank"><img src="https://api.ign.fr/geoportail/api/js/latest/theme/geoportal/img/logo_gp.gif"></a>'}),h=new n.a({source:S});w.addLayer(h)}},[[415,0]]]);
//# sourceMappingURL=wmts-ign.js.map