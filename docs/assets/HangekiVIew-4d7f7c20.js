import{_ as m,r as s,o as f,c as g,a as c,b as t,w as n,F as y,f as b}from"./index-33d6f0e7.js";const h={data(){return{headMessageType:"warning",lastmessage:"请选择设备",portNum:null}},methods:{async factoryMode(){let e=this;if("serial"in navigator){try{e.portNum=await navigator.serial.requestPort()}catch(a){e.lastmessage="端口选择错误："+a;return}try{await e.portNum.open({baudRate:1200}),await e.portNum.setSignals({dataTerminalReady:!1})}catch(a){e.lastmessage="打开端口错误："+a;return}e.lastmessage="成功，请检查控制器盘符并放入固件",e.headMessageType="success"}}}},w=c("br",null,null,-1);function k(e,a,N,v,o,i){const u=s("el-divider"),l=s("el-alert"),d=s("el-button"),r=s("el-col"),p=s("el-row");return f(),g(y,null,[c("h2",{onClick:a[0]||(a[0]=(..._)=>e.debugenable&&e.debugenable(..._))},"Hangeki 配置"),t(u),t(l,{title:"提示",type:"info",description:"本页面提供 Hangeki 音击风格控制器的配置功能。请确认您的控制器符合这个版本。完成配置后，您可以直接关闭这个页面。","show-icon":""}),w,t(p,null,{default:n(()=>[t(r,{span:4},{default:n(()=>[t(d,{onClick:i.factoryMode},{default:n(()=>[b("进入刷机模式")]),_:1},8,["onClick"])]),_:1}),t(r,{span:16},{default:n(()=>[t(l,{title:o.lastmessage,type:o.headMessageType,closable:!1},null,8,["title","type"])]),_:1})]),_:1})],64)}const M=m(h,[["render",k]]);export{M as default};