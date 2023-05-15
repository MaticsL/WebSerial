import{_ as M,r as d,o as h,c as g,a as t,w as v,b as k,d as C,F as y,e as f,f as w}from"./index-dc005e0b.js";const S={data(){return{headMessageType:"warning",connected:!1,lastmessage:"请选择端口",sliderType:1,portNum:null,sensitive:8,sensiStep:1,sensiMin:8,sensiMax:12,sensiMarks0:{24:"超高",32:"高",40:"一般",48:"低",56:"较低",64:"非常低"},sensiMarks1:{8:"超高",9:"高",10:"一般",11:"低",12:"较低",13:"非常低"},sensiMarks:{24:"超高",32:"高",40:"一般",48:"低",56:"较低",64:"非常低"}}},methods:{async writeSensitive(){let e=this;if(e.connected&&e.portNum!=null){var n=e.portNum.writable.getWriter(),r=e.portNum.readable.getReader(),l=new Uint8Array([33,64,35,35,28,84,0,e.sensitive,e.sensitive,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);await n.write(l);var x=new Uint8Array([33,64,35,35,29,84,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);await n.write(x);for(var i=0,s="";i<=2;){var a=await r.read();i++;for(var o in a.value)String.fromCharCode(a.value[o])!="A"&&(s=s+String.fromCharCode(a.value[o]))}e.sensitive=parseInt(s),e.sensitive>16?(e.sensiMarks=e.sensiMarks0,e.sensiStep=8,e.sensiMin=24,e.sensiMax=64):(e.sensiMarks=e.sensiMarks1,e.sensiStep=1,e.sensiMin=8,e.sensiMax=13),r.releaseLock(),n.releaseLock(),e.lastmessage="写入成功！灵敏度在下次连接手台时生效。"}},async choosePort(){let e=this;if("serial"in navigator){try{e.portNum=await navigator.serial.requestPort()}catch(p){e.lastmessage="端口选择错误："+p;return}try{await e.portNum.open({baudRate:1e6})}catch(p){e.lastmessage="打开端口错误："+p;return}var n=new Uint8Array([33,64,35,35,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),r=e.portNum.writable.getWriter(),l=e.portNum.readable.getReader();await r.write(n);for(var x="",i=!1;x.length<=20&&!i;){var s=await l.read();for(var a in s.value)String.fromCharCode(s.value[a])!="A"&&(x=x+String.fromCharCode(s.value[a])),x.endsWith("XDEN chunicon v2.")&&(i=!0)}var o=new Uint8Array([33,64,35,35,29,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);await r.write(o);for(var c=0,u="";c<=2;){var s=await l.read();c++;for(var a in s.value)String.fromCharCode(s.value[a])!="A"&&(u=u+String.fromCharCode(s.value[a]))}var _=new Uint8Array([33,64,35,35,29,84,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);await r.write(_);for(var c=0,m="";c<=2;){var s=await l.read();c++;for(var a in s.value)String.fromCharCode(s.value[a])!="A"&&(m=m+String.fromCharCode(s.value[a]))}e.sensitive=parseInt(m),e.sensitive>16?(e.sensiMarks=e.sensiMarks0,e.sensiStep=8,e.sensiMin=24,e.sensiMax=64):(e.sensiMarks=e.sensiMarks1,e.sensiStep=1,e.sensiMin=8,e.sensiMax=13),e.lastmessage="已选择控制器: XDEN chunicon v2. 固件版本: "+u,e.headMessageType="success",l.releaseLock(),r.releaseLock(),e.connected=!0}else e.lastmessage="您的浏览器不支持串口通信，请使用chrome浏览器。"}}},N=f("h2",null,"控制器配置",-1),b={slot:"header"},A=f("span",null,"灵敏度配置",-1);function U(e,n,r,l,x,i){const s=d("el-divider"),a=d("el-button"),o=d("el-col"),u=d("el-alert"),_=d("el-row"),c=d("el-slider"),m=d("el-card");return h(),g(y,null,[N,t(s),t(_,null,{default:v(()=>[t(o,{span:4},{default:v(()=>[t(a,{onClick:i.choosePort,disabled:x.connected},{default:v(()=>[w("连接控制器")]),_:1},8,["onClick","disabled"])]),_:1}),t(o,{span:20},{default:v(()=>[t(u,{title:x.lastmessage,type:x.headMessageType,closable:!1},null,8,["title","type"])]),_:1})]),_:1}),t(s),x.connected?(h(),k(m,{key:0},{default:v(()=>[f("div",b,[A,t(a,{style:{float:"right"},type:"primary",disabled:!x.connected,onClick:i.writeSensitive},{default:v(()=>[w("写入灵敏度")]),_:1},8,["disabled","onClick"])]),t(c,{modelValue:x.sensitive,"onUpdate:modelValue":n[0]||(n[0]=p=>x.sensitive=p),"show-tooltip":!1,step:x.sensiStep,min:x.sensiMin,marks:x.sensiMarks,max:x.sensiMax},null,8,["modelValue","step","min","marks","max"])]),_:1})):C("",!0)],64)}const T=M(S,[["render",U]]);export{T as default};
