(window.webpackJsonp=window.webpackJsonp||[]).push([[122],{369:function(e,n,t){"use strict";t.r(n);var o=t(3),a=t(2),s=t(30),r=t(5),c=t(23),i=t(9),l=t(10),w=t(11),u=t(22),d=t(17),p=new r.a({source:new i.b}),f=new w.c({fill:new u.a({color:"rgba(255,255,255,0.7)"}),stroke:new d.a({color:"#3399CC",width:3})}),g=new c.a({source:new l.a({url:"data/geojson/countries.geojson",format:new s.a})}),m=new o.a({layers:[p,g],target:"map",view:new a.a({center:[0,0],zoom:2,multiWorld:!0})}),b=[],h=document.getElementById("status");m.on("singleclick",(function(e){m.forEachFeatureAtPixel(e.pixel,(function(e){var n=b.indexOf(e);n<0?(b.push(e),e.setStyle(f)):(b.splice(n,1),e.setStyle(void 0))})),h.innerHTML="&nbsp;"+b.length+" selected features"}))}},[[369,0]]]);
//# sourceMappingURL=select-multiple-features.js.map