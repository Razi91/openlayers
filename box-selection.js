(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{249:function(e,n,t){"use strict";t.r(n);var o=t(3),a=t(2),r=t(36),c=t(30),i=t(95),s=t(182),u=t(5),w=t(23),g=t(10),d=t(9),f=new g.a({url:"data/geojson/countries.geojson",format:new c.a}),m=new o.a({layers:[new u.a({source:new d.b}),new w.a({source:f})],target:"map",view:new a.a({center:[0,0],zoom:2,constrainRotation:16})}),v=new i.a;m.addInteraction(v);var p=v.getFeatures(),l=new s.a({condition:r.j});m.addInteraction(l),l.on("boxend",(function(){var e=m.getView().getRotation(),n=e%(Math.PI/2)!=0,t=n?[]:p,o=l.getGeometry().getExtent();if(f.forEachFeatureIntersectingExtent(o,(function(e){t.push(e)})),n){var a=[0,0],r=l.getGeometry().clone();r.rotate(-e,a);var c=r.getExtent();t.forEach((function(n){var t=n.getGeometry().clone();t.rotate(-e,a),t.intersectsExtent(c)&&p.push(n)}))}})),l.on("boxstart",(function(){p.clear()}));var h=document.getElementById("info");p.on(["add","remove"],(function(){var e=p.getArray().map((function(e){return e.get("name")}));e.length>0?h.innerHTML=e.join(", "):h.innerHTML="No countries selected"}))}},[[249,0]]]);
//# sourceMappingURL=box-selection.js.map