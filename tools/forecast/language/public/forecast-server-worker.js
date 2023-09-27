"use strict";(()=>{var dh=Object.defineProperty;var H1=Object.getOwnPropertyDescriptor;var W1=Object.getOwnPropertyNames;var B1=Object.prototype.hasOwnProperty;var bR=(t=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(e,r)=>(typeof require<"u"?require:e)[r]}):t)(function(t){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+t+'" is not supported')});var K1=(t,e)=>()=>(t&&(e=t(t=0)),e);var f=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),z1=(t,e)=>{for(var r in e)dh(t,r,{get:e[r],enumerable:!0})},V1=(t,e,r,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of W1(e))!B1.call(t,i)&&i!==r&&dh(t,i,{get:()=>e[i],enumerable:!(n=H1(e,i))||n.enumerable});return t};var AR=t=>V1(dh({},"__esModule",{value:!0}),t);var gi=f(hh=>{"use strict";Object.defineProperty(hh,"__esModule",{value:!0});var fh;function ph(){if(fh===void 0)throw new Error("No runtime abstraction layer installed");return fh}(function(t){function e(r){if(r===void 0)throw new Error("No runtime abstraction layer provided");fh=r}t.install=e})(ph||(ph={}));hh.default=ph});var mh=f(Tu=>{"use strict";Object.defineProperty(Tu,"__esModule",{value:!0});Tu.Disposable=void 0;var Y1;(function(t){function e(r){return{dispose:r}}t.create=e})(Y1=Tu.Disposable||(Tu.Disposable={}))});var Mo=f(Lo=>{"use strict";Object.defineProperty(Lo,"__esModule",{value:!0});Lo.Emitter=Lo.Event=void 0;var X1=gi(),J1;(function(t){let e={dispose(){}};t.None=function(){return e}})(J1=Lo.Event||(Lo.Event={}));var gh=class{add(e,r=null,n){this._callbacks||(this._callbacks=[],this._contexts=[]),this._callbacks.push(e),this._contexts.push(r),Array.isArray(n)&&n.push({dispose:()=>this.remove(e,r)})}remove(e,r=null){if(!this._callbacks)return;let n=!1;for(let i=0,o=this._callbacks.length;i<o;i++)if(this._callbacks[i]===e)if(this._contexts[i]===r){this._callbacks.splice(i,1),this._contexts.splice(i,1);return}else n=!0;if(n)throw new Error("When adding a listener with a context, you should remove it with the same context")}invoke(...e){if(!this._callbacks)return[];let r=[],n=this._callbacks.slice(0),i=this._contexts.slice(0);for(let o=0,a=n.length;o<a;o++)try{r.push(n[o].apply(i[o],e))}catch(s){(0,X1.default)().console.error(s)}return r}isEmpty(){return!this._callbacks||this._callbacks.length===0}dispose(){this._callbacks=void 0,this._contexts=void 0}},ka=class{constructor(e){this._options=e}get event(){return this._event||(this._event=(e,r,n)=>{this._callbacks||(this._callbacks=new gh),this._options&&this._options.onFirstListenerAdd&&this._callbacks.isEmpty()&&this._options.onFirstListenerAdd(this),this._callbacks.add(e,r);let i={dispose:()=>{this._callbacks&&(this._callbacks.remove(e,r),i.dispose=ka._noop,this._options&&this._options.onLastListenerRemove&&this._callbacks.isEmpty()&&this._options.onLastListenerRemove(this))}};return Array.isArray(n)&&n.push(i),i}),this._event}fire(e){this._callbacks&&this._callbacks.invoke.call(this._callbacks,e)}dispose(){this._callbacks&&(this._callbacks.dispose(),this._callbacks=void 0)}};Lo.Emitter=ka;ka._noop=function(){}});var PR=f(sl=>{"use strict";Object.defineProperty(sl,"__esModule",{value:!0});sl.AbstractMessageBuffer=void 0;var Q1=13,Z1=10,e$=`\r
`,yh=class{constructor(e="utf-8"){this._encoding=e,this._chunks=[],this._totalLength=0}get encoding(){return this._encoding}append(e){let r=typeof e=="string"?this.fromString(e,this._encoding):e;this._chunks.push(r),this._totalLength+=r.byteLength}tryReadHeaders(){if(this._chunks.length===0)return;let e=0,r=0,n=0,i=0;e:for(;r<this._chunks.length;){let u=this._chunks[r];n=0;t:for(;n<u.length;){switch(u[n]){case Q1:switch(e){case 0:e=1;break;case 2:e=3;break;default:e=0}break;case Z1:switch(e){case 1:e=2;break;case 3:e=4,n++;break e;default:e=0}break;default:e=0}n++}i+=u.byteLength,r++}if(e!==4)return;let o=this._read(i+n),a=new Map,s=this.toString(o,"ascii").split(e$);if(s.length<2)return a;for(let u=0;u<s.length-2;u++){let c=s[u],l=c.indexOf(":");if(l===-1)throw new Error("Message header must separate key and value using :");let d=c.substr(0,l),h=c.substr(l+1).trim();a.set(d,h)}return a}tryReadBody(e){if(!(this._totalLength<e))return this._read(e)}get numberOfBytes(){return this._totalLength}_read(e){if(e===0)return this.emptyBuffer();if(e>this._totalLength)throw new Error("Cannot read so many bytes!");if(this._chunks[0].byteLength===e){let o=this._chunks[0];return this._chunks.shift(),this._totalLength-=e,this.asNative(o)}if(this._chunks[0].byteLength>e){let o=this._chunks[0],a=this.asNative(o,e);return this._chunks[0]=o.slice(e),this._totalLength-=e,a}let r=this.allocNative(e),n=0,i=0;for(;e>0;){let o=this._chunks[i];if(o.byteLength>e){let a=o.slice(0,e);r.set(a,n),n+=e,this._chunks[i]=o.slice(e),this._totalLength-=e,e-=e}else r.set(o,n),n+=o.byteLength,this._chunks.shift(),this._totalLength-=o.byteLength,e-=o.byteLength}return r}};sl.AbstractMessageBuffer=yh});var ER=f(Rh=>{"use strict";Object.defineProperty(Rh,"__esModule",{value:!0});var SR=gi(),wa=mh(),t$=Mo(),r$=PR(),Oa=class extends r$.AbstractMessageBuffer{constructor(e="utf-8"){super(e),this.asciiDecoder=new TextDecoder("ascii")}emptyBuffer(){return Oa.emptyBuffer}fromString(e,r){return new TextEncoder().encode(e)}toString(e,r){return r==="ascii"?this.asciiDecoder.decode(e):new TextDecoder(r).decode(e)}asNative(e,r){return r===void 0?e:e.slice(0,r)}allocNative(e){return new Uint8Array(e)}};Oa.emptyBuffer=new Uint8Array(0);var vh=class{constructor(e){this.socket=e,this._onData=new t$.Emitter,this._messageListener=r=>{r.data.arrayBuffer().then(i=>{this._onData.fire(new Uint8Array(i))},()=>{(0,SR.default)().console.error("Converting blob to array buffer failed.")})},this.socket.addEventListener("message",this._messageListener)}onClose(e){return this.socket.addEventListener("close",e),wa.Disposable.create(()=>this.socket.removeEventListener("close",e))}onError(e){return this.socket.addEventListener("error",e),wa.Disposable.create(()=>this.socket.removeEventListener("error",e))}onEnd(e){return this.socket.addEventListener("end",e),wa.Disposable.create(()=>this.socket.removeEventListener("end",e))}onData(e){return this._onData.event(e)}},_h=class{constructor(e){this.socket=e}onClose(e){return this.socket.addEventListener("close",e),wa.Disposable.create(()=>this.socket.removeEventListener("close",e))}onError(e){return this.socket.addEventListener("error",e),wa.Disposable.create(()=>this.socket.removeEventListener("error",e))}onEnd(e){return this.socket.addEventListener("end",e),wa.Disposable.create(()=>this.socket.removeEventListener("end",e))}write(e,r){if(typeof e=="string"){if(r!==void 0&&r!=="utf-8")throw new Error(`In a Browser environments only utf-8 text encoding is supported. But got encoding: ${r}`);this.socket.send(e)}else this.socket.send(e);return Promise.resolve()}end(){this.socket.close()}},n$=new TextEncoder,CR=Object.freeze({messageBuffer:Object.freeze({create:t=>new Oa(t)}),applicationJson:Object.freeze({encoder:Object.freeze({name:"application/json",encode:(t,e)=>{if(e.charset!=="utf-8")throw new Error(`In a Browser environments only utf-8 text encoding is supported. But got encoding: ${e.charset}`);return Promise.resolve(n$.encode(JSON.stringify(t,void 0,0)))}}),decoder:Object.freeze({name:"application/json",decode:(t,e)=>{if(!(t instanceof Uint8Array))throw new Error("In a Browser environments only Uint8Arrays are supported.");return Promise.resolve(JSON.parse(new TextDecoder(e.charset).decode(t)))}})}),stream:Object.freeze({asReadableStream:t=>new vh(t),asWritableStream:t=>new _h(t)}),console,timer:Object.freeze({setTimeout(t,e,...r){let n=setTimeout(t,e,...r);return{dispose:()=>clearTimeout(n)}},setImmediate(t,...e){let r=setTimeout(t,0,...e);return{dispose:()=>clearTimeout(r)}},setInterval(t,e,...r){let n=setInterval(t,e,...r);return{dispose:()=>clearInterval(n)}}})});function Th(){return CR}(function(t){function e(){SR.default.install(CR)}t.install=e})(Th||(Th={}));Rh.default=Th});var Da=f(Qt=>{"use strict";Object.defineProperty(Qt,"__esModule",{value:!0});Qt.stringArray=Qt.array=Qt.func=Qt.error=Qt.number=Qt.string=Qt.boolean=void 0;function i$(t){return t===!0||t===!1}Qt.boolean=i$;function NR(t){return typeof t=="string"||t instanceof String}Qt.string=NR;function o$(t){return typeof t=="number"||t instanceof Number}Qt.number=o$;function a$(t){return t instanceof Error}Qt.error=a$;function s$(t){return typeof t=="function"}Qt.func=s$;function kR(t){return Array.isArray(t)}Qt.array=kR;function u$(t){return kR(t)&&t.every(e=>NR(e))}Qt.stringArray=u$});var Wh=f(Y=>{"use strict";Object.defineProperty(Y,"__esModule",{value:!0});Y.Message=Y.NotificationType9=Y.NotificationType8=Y.NotificationType7=Y.NotificationType6=Y.NotificationType5=Y.NotificationType4=Y.NotificationType3=Y.NotificationType2=Y.NotificationType1=Y.NotificationType0=Y.NotificationType=Y.RequestType9=Y.RequestType8=Y.RequestType7=Y.RequestType6=Y.RequestType5=Y.RequestType4=Y.RequestType3=Y.RequestType2=Y.RequestType1=Y.RequestType=Y.RequestType0=Y.AbstractMessageSignature=Y.ParameterStructures=Y.ResponseError=Y.ErrorCodes=void 0;var $o=Da(),wR;(function(t){t.ParseError=-32700,t.InvalidRequest=-32600,t.MethodNotFound=-32601,t.InvalidParams=-32602,t.InternalError=-32603,t.jsonrpcReservedErrorRangeStart=-32099,t.serverErrorStart=-32099,t.MessageWriteError=-32099,t.MessageReadError=-32098,t.PendingResponseRejected=-32097,t.ConnectionInactive=-32096,t.ServerNotInitialized=-32002,t.UnknownErrorCode=-32001,t.jsonrpcReservedErrorRangeEnd=-32e3,t.serverErrorEnd=-32e3})(wR=Y.ErrorCodes||(Y.ErrorCodes={}));var Ru=class extends Error{constructor(e,r,n){super(r),this.code=$o.number(e)?e:wR.UnknownErrorCode,this.data=n,Object.setPrototypeOf(this,Ru.prototype)}toJson(){let e={code:this.code,message:this.message};return this.data!==void 0&&(e.data=this.data),e}};Y.ResponseError=Ru;var Mt=class{constructor(e){this.kind=e}static is(e){return e===Mt.auto||e===Mt.byName||e===Mt.byPosition}toString(){return this.kind}};Y.ParameterStructures=Mt;Mt.auto=new Mt("auto");Mt.byPosition=new Mt("byPosition");Mt.byName=new Mt("byName");var Qe=class{constructor(e,r){this.method=e,this.numberOfParams=r}get parameterStructures(){return Mt.auto}};Y.AbstractMessageSignature=Qe;var bh=class extends Qe{constructor(e){super(e,0)}};Y.RequestType0=bh;var Ah=class extends Qe{constructor(e,r=Mt.auto){super(e,1),this._parameterStructures=r}get parameterStructures(){return this._parameterStructures}};Y.RequestType=Ah;var Ph=class extends Qe{constructor(e,r=Mt.auto){super(e,1),this._parameterStructures=r}get parameterStructures(){return this._parameterStructures}};Y.RequestType1=Ph;var Sh=class extends Qe{constructor(e){super(e,2)}};Y.RequestType2=Sh;var Ch=class extends Qe{constructor(e){super(e,3)}};Y.RequestType3=Ch;var Eh=class extends Qe{constructor(e){super(e,4)}};Y.RequestType4=Eh;var Nh=class extends Qe{constructor(e){super(e,5)}};Y.RequestType5=Nh;var kh=class extends Qe{constructor(e){super(e,6)}};Y.RequestType6=kh;var wh=class extends Qe{constructor(e){super(e,7)}};Y.RequestType7=wh;var Oh=class extends Qe{constructor(e){super(e,8)}};Y.RequestType8=Oh;var Dh=class extends Qe{constructor(e){super(e,9)}};Y.RequestType9=Dh;var Ih=class extends Qe{constructor(e,r=Mt.auto){super(e,1),this._parameterStructures=r}get parameterStructures(){return this._parameterStructures}};Y.NotificationType=Ih;var xh=class extends Qe{constructor(e){super(e,0)}};Y.NotificationType0=xh;var qh=class extends Qe{constructor(e,r=Mt.auto){super(e,1),this._parameterStructures=r}get parameterStructures(){return this._parameterStructures}};Y.NotificationType1=qh;var Lh=class extends Qe{constructor(e){super(e,2)}};Y.NotificationType2=Lh;var Mh=class extends Qe{constructor(e){super(e,3)}};Y.NotificationType3=Mh;var $h=class extends Qe{constructor(e){super(e,4)}};Y.NotificationType4=$h;var Fh=class extends Qe{constructor(e){super(e,5)}};Y.NotificationType5=Fh;var jh=class extends Qe{constructor(e){super(e,6)}};Y.NotificationType6=jh;var Uh=class extends Qe{constructor(e){super(e,7)}};Y.NotificationType7=Uh;var Gh=class extends Qe{constructor(e){super(e,8)}};Y.NotificationType8=Gh;var Hh=class extends Qe{constructor(e){super(e,9)}};Y.NotificationType9=Hh;var c$;(function(t){function e(i){let o=i;return o&&$o.string(o.method)&&($o.string(o.id)||$o.number(o.id))}t.isRequest=e;function r(i){let o=i;return o&&$o.string(o.method)&&i.id===void 0}t.isNotification=r;function n(i){let o=i;return o&&(o.result!==void 0||!!o.error)&&($o.string(o.id)||$o.number(o.id)||o.id===null)}t.isResponse=n})(c$=Y.Message||(Y.Message={}))});var Kh=f(yi=>{"use strict";var OR;Object.defineProperty(yi,"__esModule",{value:!0});yi.LRUCache=yi.LinkedMap=yi.Touch=void 0;var sr;(function(t){t.None=0,t.First=1,t.AsOld=t.First,t.Last=2,t.AsNew=t.Last})(sr=yi.Touch||(yi.Touch={}));var ul=class{constructor(){this[OR]="LinkedMap",this._map=new Map,this._head=void 0,this._tail=void 0,this._size=0,this._state=0}clear(){this._map.clear(),this._head=void 0,this._tail=void 0,this._size=0,this._state++}isEmpty(){return!this._head&&!this._tail}get size(){return this._size}get first(){return this._head?.value}get last(){return this._tail?.value}has(e){return this._map.has(e)}get(e,r=sr.None){let n=this._map.get(e);if(n)return r!==sr.None&&this.touch(n,r),n.value}set(e,r,n=sr.None){let i=this._map.get(e);if(i)i.value=r,n!==sr.None&&this.touch(i,n);else{switch(i={key:e,value:r,next:void 0,previous:void 0},n){case sr.None:this.addItemLast(i);break;case sr.First:this.addItemFirst(i);break;case sr.Last:this.addItemLast(i);break;default:this.addItemLast(i);break}this._map.set(e,i),this._size++}return this}delete(e){return!!this.remove(e)}remove(e){let r=this._map.get(e);if(r)return this._map.delete(e),this.removeItem(r),this._size--,r.value}shift(){if(!this._head&&!this._tail)return;if(!this._head||!this._tail)throw new Error("Invalid list");let e=this._head;return this._map.delete(e.key),this.removeItem(e),this._size--,e.value}forEach(e,r){let n=this._state,i=this._head;for(;i;){if(r?e.bind(r)(i.value,i.key,this):e(i.value,i.key,this),this._state!==n)throw new Error("LinkedMap got modified during iteration.");i=i.next}}keys(){let e=this._state,r=this._head,n={[Symbol.iterator]:()=>n,next:()=>{if(this._state!==e)throw new Error("LinkedMap got modified during iteration.");if(r){let i={value:r.key,done:!1};return r=r.next,i}else return{value:void 0,done:!0}}};return n}values(){let e=this._state,r=this._head,n={[Symbol.iterator]:()=>n,next:()=>{if(this._state!==e)throw new Error("LinkedMap got modified during iteration.");if(r){let i={value:r.value,done:!1};return r=r.next,i}else return{value:void 0,done:!0}}};return n}entries(){let e=this._state,r=this._head,n={[Symbol.iterator]:()=>n,next:()=>{if(this._state!==e)throw new Error("LinkedMap got modified during iteration.");if(r){let i={value:[r.key,r.value],done:!1};return r=r.next,i}else return{value:void 0,done:!0}}};return n}[(OR=Symbol.toStringTag,Symbol.iterator)](){return this.entries()}trimOld(e){if(e>=this.size)return;if(e===0){this.clear();return}let r=this._head,n=this.size;for(;r&&n>e;)this._map.delete(r.key),r=r.next,n--;this._head=r,this._size=n,r&&(r.previous=void 0),this._state++}addItemFirst(e){if(!this._head&&!this._tail)this._tail=e;else if(this._head)e.next=this._head,this._head.previous=e;else throw new Error("Invalid list");this._head=e,this._state++}addItemLast(e){if(!this._head&&!this._tail)this._head=e;else if(this._tail)e.previous=this._tail,this._tail.next=e;else throw new Error("Invalid list");this._tail=e,this._state++}removeItem(e){if(e===this._head&&e===this._tail)this._head=void 0,this._tail=void 0;else if(e===this._head){if(!e.next)throw new Error("Invalid list");e.next.previous=void 0,this._head=e.next}else if(e===this._tail){if(!e.previous)throw new Error("Invalid list");e.previous.next=void 0,this._tail=e.previous}else{let r=e.next,n=e.previous;if(!r||!n)throw new Error("Invalid list");r.previous=n,n.next=r}e.next=void 0,e.previous=void 0,this._state++}touch(e,r){if(!this._head||!this._tail)throw new Error("Invalid list");if(!(r!==sr.First&&r!==sr.Last)){if(r===sr.First){if(e===this._head)return;let n=e.next,i=e.previous;e===this._tail?(i.next=void 0,this._tail=i):(n.previous=i,i.next=n),e.previous=void 0,e.next=this._head,this._head.previous=e,this._head=e,this._state++}else if(r===sr.Last){if(e===this._tail)return;let n=e.next,i=e.previous;e===this._head?(n.previous=void 0,this._head=n):(n.previous=i,i.next=n),e.next=void 0,e.previous=this._tail,this._tail.next=e,this._tail=e,this._state++}}}toJSON(){let e=[];return this.forEach((r,n)=>{e.push([n,r])}),e}fromJSON(e){this.clear();for(let[r,n]of e)this.set(r,n)}};yi.LinkedMap=ul;var Bh=class extends ul{constructor(e,r=1){super(),this._limit=e,this._ratio=Math.min(Math.max(0,r),1)}get limit(){return this._limit}set limit(e){this._limit=e,this.checkTrim()}get ratio(){return this._ratio}set ratio(e){this._ratio=Math.min(Math.max(0,e),1),this.checkTrim()}get(e,r=sr.AsNew){return super.get(e,r)}peek(e){return super.get(e,sr.None)}set(e,r){return super.set(e,r,sr.Last),this.checkTrim(),this}checkTrim(){this.size>this._limit&&this.trimOld(Math.round(this._limit*this._ratio))}};yi.LRUCache=Bh});var Xh=f(Fo=>{"use strict";Object.defineProperty(Fo,"__esModule",{value:!0});Fo.CancellationTokenSource=Fo.CancellationToken=void 0;var l$=gi(),d$=Da(),zh=Mo(),Vh;(function(t){t.None=Object.freeze({isCancellationRequested:!1,onCancellationRequested:zh.Event.None}),t.Cancelled=Object.freeze({isCancellationRequested:!0,onCancellationRequested:zh.Event.None});function e(r){let n=r;return n&&(n===t.None||n===t.Cancelled||d$.boolean(n.isCancellationRequested)&&!!n.onCancellationRequested)}t.is=e})(Vh=Fo.CancellationToken||(Fo.CancellationToken={}));var f$=Object.freeze(function(t,e){let r=(0,l$.default)().timer.setTimeout(t.bind(e),0);return{dispose(){r.dispose()}}}),cl=class{constructor(){this._isCancelled=!1}cancel(){this._isCancelled||(this._isCancelled=!0,this._emitter&&(this._emitter.fire(void 0),this.dispose()))}get isCancellationRequested(){return this._isCancelled}get onCancellationRequested(){return this._isCancelled?f$:(this._emitter||(this._emitter=new zh.Emitter),this._emitter.event)}dispose(){this._emitter&&(this._emitter.dispose(),this._emitter=void 0)}},Yh=class{get token(){return this._token||(this._token=new cl),this._token}cancel(){this._token?this._token.cancel():this._token=Vh.Cancelled}dispose(){this._token?this._token instanceof cl&&this._token.dispose():this._token=Vh.None}};Fo.CancellationTokenSource=Yh});var DR=f(vi=>{"use strict";Object.defineProperty(vi,"__esModule",{value:!0});vi.ReadableStreamMessageReader=vi.AbstractMessageReader=vi.MessageReader=void 0;var Qh=gi(),Ia=Da(),Jh=Mo(),p$;(function(t){function e(r){let n=r;return n&&Ia.func(n.listen)&&Ia.func(n.dispose)&&Ia.func(n.onError)&&Ia.func(n.onClose)&&Ia.func(n.onPartialMessage)}t.is=e})(p$=vi.MessageReader||(vi.MessageReader={}));var ll=class{constructor(){this.errorEmitter=new Jh.Emitter,this.closeEmitter=new Jh.Emitter,this.partialMessageEmitter=new Jh.Emitter}dispose(){this.errorEmitter.dispose(),this.closeEmitter.dispose()}get onError(){return this.errorEmitter.event}fireError(e){this.errorEmitter.fire(this.asError(e))}get onClose(){return this.closeEmitter.event}fireClose(){this.closeEmitter.fire(void 0)}get onPartialMessage(){return this.partialMessageEmitter.event}firePartialMessage(e){this.partialMessageEmitter.fire(e)}asError(e){return e instanceof Error?e:new Error(`Reader received error. Reason: ${Ia.string(e.message)?e.message:"unknown"}`)}};vi.AbstractMessageReader=ll;var Zh;(function(t){function e(r){let n,i,o,a=new Map,s,u=new Map;if(r===void 0||typeof r=="string")n=r??"utf-8";else{if(n=r.charset??"utf-8",r.contentDecoder!==void 0&&(o=r.contentDecoder,a.set(o.name,o)),r.contentDecoders!==void 0)for(let c of r.contentDecoders)a.set(c.name,c);if(r.contentTypeDecoder!==void 0&&(s=r.contentTypeDecoder,u.set(s.name,s)),r.contentTypeDecoders!==void 0)for(let c of r.contentTypeDecoders)u.set(c.name,c)}return s===void 0&&(s=(0,Qh.default)().applicationJson.decoder,u.set(s.name,s)),{charset:n,contentDecoder:o,contentDecoders:a,contentTypeDecoder:s,contentTypeDecoders:u}}t.fromOptions=e})(Zh||(Zh={}));var em=class extends ll{constructor(e,r){super(),this.readable=e,this.options=Zh.fromOptions(r),this.buffer=(0,Qh.default)().messageBuffer.create(this.options.charset),this._partialMessageTimeout=1e4,this.nextMessageLength=-1,this.messageToken=0}set partialMessageTimeout(e){this._partialMessageTimeout=e}get partialMessageTimeout(){return this._partialMessageTimeout}listen(e){this.nextMessageLength=-1,this.messageToken=0,this.partialMessageTimer=void 0,this.callback=e;let r=this.readable.onData(n=>{this.onData(n)});return this.readable.onError(n=>this.fireError(n)),this.readable.onClose(()=>this.fireClose()),r}onData(e){for(this.buffer.append(e);;){if(this.nextMessageLength===-1){let i=this.buffer.tryReadHeaders();if(!i)return;let o=i.get("Content-Length");if(!o)throw new Error("Header must provide a Content-Length property.");let a=parseInt(o);if(isNaN(a))throw new Error("Content-Length value must be a number.");this.nextMessageLength=a}let r=this.buffer.tryReadBody(this.nextMessageLength);if(r===void 0){this.setPartialMessageTimer();return}this.clearPartialMessageTimer(),this.nextMessageLength=-1;let n;this.options.contentDecoder!==void 0?n=this.options.contentDecoder.decode(r):n=Promise.resolve(r),n.then(i=>{this.options.contentTypeDecoder.decode(i,this.options).then(o=>{this.callback(o)},o=>{this.fireError(o)})},i=>{this.fireError(i)})}}clearPartialMessageTimer(){this.partialMessageTimer&&(this.partialMessageTimer.dispose(),this.partialMessageTimer=void 0)}setPartialMessageTimer(){this.clearPartialMessageTimer(),!(this._partialMessageTimeout<=0)&&(this.partialMessageTimer=(0,Qh.default)().timer.setTimeout((e,r)=>{this.partialMessageTimer=void 0,e===this.messageToken&&(this.firePartialMessage({messageToken:e,waitingTime:r}),this.setPartialMessageTimer())},this._partialMessageTimeout,this.messageToken,this._partialMessageTimeout))}};vi.ReadableStreamMessageReader=em});var IR=f(dl=>{"use strict";Object.defineProperty(dl,"__esModule",{value:!0});dl.Semaphore=void 0;var h$=gi(),tm=class{constructor(e=1){if(e<=0)throw new Error("Capacity must be greater than 0");this._capacity=e,this._active=0,this._waiting=[]}lock(e){return new Promise((r,n)=>{this._waiting.push({thunk:e,resolve:r,reject:n}),this.runNext()})}get active(){return this._active}runNext(){this._waiting.length===0||this._active===this._capacity||(0,h$.default)().timer.setImmediate(()=>this.doRunNext())}doRunNext(){if(this._waiting.length===0||this._active===this._capacity)return;let e=this._waiting.shift();if(this._active++,this._active>this._capacity)throw new Error("To many thunks active");try{let r=e.thunk();r instanceof Promise?r.then(n=>{this._active--,e.resolve(n),this.runNext()},n=>{this._active--,e.reject(n),this.runNext()}):(this._active--,e.resolve(r),this.runNext())}catch(r){this._active--,e.reject(r),this.runNext()}}};dl.Semaphore=tm});var MR=f(_i=>{"use strict";Object.defineProperty(_i,"__esModule",{value:!0});_i.WriteableStreamMessageWriter=_i.AbstractMessageWriter=_i.MessageWriter=void 0;var xR=gi(),bu=Da(),m$=IR(),qR=Mo(),g$="Content-Length: ",LR=`\r
`,y$;(function(t){function e(r){let n=r;return n&&bu.func(n.dispose)&&bu.func(n.onClose)&&bu.func(n.onError)&&bu.func(n.write)}t.is=e})(y$=_i.MessageWriter||(_i.MessageWriter={}));var fl=class{constructor(){this.errorEmitter=new qR.Emitter,this.closeEmitter=new qR.Emitter}dispose(){this.errorEmitter.dispose(),this.closeEmitter.dispose()}get onError(){return this.errorEmitter.event}fireError(e,r,n){this.errorEmitter.fire([this.asError(e),r,n])}get onClose(){return this.closeEmitter.event}fireClose(){this.closeEmitter.fire(void 0)}asError(e){return e instanceof Error?e:new Error(`Writer received error. Reason: ${bu.string(e.message)?e.message:"unknown"}`)}};_i.AbstractMessageWriter=fl;var rm;(function(t){function e(r){return r===void 0||typeof r=="string"?{charset:r??"utf-8",contentTypeEncoder:(0,xR.default)().applicationJson.encoder}:{charset:r.charset??"utf-8",contentEncoder:r.contentEncoder,contentTypeEncoder:r.contentTypeEncoder??(0,xR.default)().applicationJson.encoder}}t.fromOptions=e})(rm||(rm={}));var nm=class extends fl{constructor(e,r){super(),this.writable=e,this.options=rm.fromOptions(r),this.errorCount=0,this.writeSemaphore=new m$.Semaphore(1),this.writable.onError(n=>this.fireError(n)),this.writable.onClose(()=>this.fireClose())}async write(e){return this.writeSemaphore.lock(async()=>this.options.contentTypeEncoder.encode(e,this.options).then(n=>this.options.contentEncoder!==void 0?this.options.contentEncoder.encode(n):n).then(n=>{let i=[];return i.push(g$,n.byteLength.toString(),LR),i.push(LR),this.doWrite(e,i,n)},n=>{throw this.fireError(n),n}))}async doWrite(e,r,n){try{return await this.writable.write(r.join(""),"ascii"),this.writable.write(n)}catch(i){return this.handleError(i,e),Promise.reject(i)}}handleError(e,r){this.errorCount++,this.fireError(e,r,this.errorCount)}end(){this.writable.end()}};_i.WriteableStreamMessageWriter=nm});var HR=f(Q=>{"use strict";Object.defineProperty(Q,"__esModule",{value:!0});Q.createMessageConnection=Q.ConnectionOptions=Q.CancellationStrategy=Q.CancellationSenderStrategy=Q.CancellationReceiverStrategy=Q.ConnectionStrategy=Q.ConnectionError=Q.ConnectionErrors=Q.LogTraceNotification=Q.SetTraceNotification=Q.TraceFormat=Q.TraceValues=Q.Trace=Q.NullLogger=Q.ProgressType=Q.ProgressToken=void 0;var $R=gi(),It=Da(),Z=Wh(),FR=Kh(),Au=Mo(),im=Xh(),Su;(function(t){t.type=new Z.NotificationType("$/cancelRequest")})(Su||(Su={}));var jR;(function(t){function e(r){return typeof r=="string"||typeof r=="number"}t.is=e})(jR=Q.ProgressToken||(Q.ProgressToken={}));var Pu;(function(t){t.type=new Z.NotificationType("$/progress")})(Pu||(Pu={}));var om=class{constructor(){}};Q.ProgressType=om;var am;(function(t){function e(r){return It.func(r)}t.is=e})(am||(am={}));Q.NullLogger=Object.freeze({error:()=>{},warn:()=>{},info:()=>{},log:()=>{}});var De;(function(t){t[t.Off=0]="Off",t[t.Messages=1]="Messages",t[t.Compact=2]="Compact",t[t.Verbose=3]="Verbose"})(De=Q.Trace||(Q.Trace={}));var v$;(function(t){t.Off="off",t.Messages="messages",t.Compact="compact",t.Verbose="verbose"})(v$=Q.TraceValues||(Q.TraceValues={}));(function(t){function e(n){if(!It.string(n))return t.Off;switch(n=n.toLowerCase(),n){case"off":return t.Off;case"messages":return t.Messages;case"compact":return t.Compact;case"verbose":return t.Verbose;default:return t.Off}}t.fromString=e;function r(n){switch(n){case t.Off:return"off";case t.Messages:return"messages";case t.Compact:return"compact";case t.Verbose:return"verbose";default:return"off"}}t.toString=r})(De=Q.Trace||(Q.Trace={}));var un;(function(t){t.Text="text",t.JSON="json"})(un=Q.TraceFormat||(Q.TraceFormat={}));(function(t){function e(r){return It.string(r)?(r=r.toLowerCase(),r==="json"?t.JSON:t.Text):t.Text}t.fromString=e})(un=Q.TraceFormat||(Q.TraceFormat={}));var UR;(function(t){t.type=new Z.NotificationType("$/setTrace")})(UR=Q.SetTraceNotification||(Q.SetTraceNotification={}));var sm;(function(t){t.type=new Z.NotificationType("$/logTrace")})(sm=Q.LogTraceNotification||(Q.LogTraceNotification={}));var pl;(function(t){t[t.Closed=1]="Closed",t[t.Disposed=2]="Disposed",t[t.AlreadyListening=3]="AlreadyListening"})(pl=Q.ConnectionErrors||(Q.ConnectionErrors={}));var Ki=class extends Error{constructor(e,r){super(r),this.code=e,Object.setPrototypeOf(this,Ki.prototype)}};Q.ConnectionError=Ki;var GR;(function(t){function e(r){let n=r;return n&&It.func(n.cancelUndispatched)}t.is=e})(GR=Q.ConnectionStrategy||(Q.ConnectionStrategy={}));var um;(function(t){t.Message=Object.freeze({createCancellationTokenSource(r){return new im.CancellationTokenSource}});function e(r){let n=r;return n&&It.func(n.createCancellationTokenSource)}t.is=e})(um=Q.CancellationReceiverStrategy||(Q.CancellationReceiverStrategy={}));var cm;(function(t){t.Message=Object.freeze({sendCancellation(r,n){return r.sendNotification(Su.type,{id:n})},cleanup(r){}});function e(r){let n=r;return n&&It.func(n.sendCancellation)&&It.func(n.cleanup)}t.is=e})(cm=Q.CancellationSenderStrategy||(Q.CancellationSenderStrategy={}));var lm;(function(t){t.Message=Object.freeze({receiver:um.Message,sender:cm.Message});function e(r){let n=r;return n&&um.is(n.receiver)&&cm.is(n.sender)}t.is=e})(lm=Q.CancellationStrategy||(Q.CancellationStrategy={}));var _$;(function(t){function e(r){let n=r;return n&&(lm.is(n.cancellationStrategy)||GR.is(n.connectionStrategy))}t.is=e})(_$=Q.ConnectionOptions||(Q.ConnectionOptions={}));var cn;(function(t){t[t.New=1]="New",t[t.Listening=2]="Listening",t[t.Closed=3]="Closed",t[t.Disposed=4]="Disposed"})(cn||(cn={}));function T$(t,e,r,n){let i=r!==void 0?r:Q.NullLogger,o=0,a=0,s=0,u="2.0",c,l=new Map,d,h=new Map,v=new Map,g,R=new FR.LinkedMap,E=new Map,N=new Set,A=new Map,b=De.Off,O=un.Text,$,B=cn.New,ee=new Au.Emitter,Fe=new Au.Emitter,Ne=new Au.Emitter,Je=new Au.Emitter,K=new Au.Emitter,le=n&&n.cancellationStrategy?n.cancellationStrategy:lm.Message;function L(P){if(P===null)throw new Error("Can't send requests with id null since the response can't be correlated.");return"req-"+P.toString()}function q(P){return P===null?"res-unknown-"+(++s).toString():"res-"+P.toString()}function F(){return"not-"+(++a).toString()}function W(P,x){Z.Message.isRequest(x)?P.set(L(x.id),x):Z.Message.isResponse(x)?P.set(q(x.id),x):P.set(F(),x)}function ie(P){}function oe(){return B===cn.Listening}function J(){return B===cn.Closed}function dt(){return B===cn.Disposed}function rt(){(B===cn.New||B===cn.Listening)&&(B=cn.Closed,Fe.fire(void 0))}function Dt(P){ee.fire([P,void 0,void 0])}function tn(P){ee.fire(P)}t.onClose(rt),t.onError(Dt),e.onClose(rt),e.onError(tn);function Er(){g||R.size===0||(g=(0,$R.default)().timer.setImmediate(()=>{g=void 0,ba()}))}function ba(){if(R.size===0)return;let P=R.shift();try{Z.Message.isRequest(P)?Aa(P):Z.Message.isNotification(P)?Sa(P):Z.Message.isResponse(P)?Pa(P):vu(P)}finally{Er()}}let ar=P=>{try{if(Z.Message.isNotification(P)&&P.method===Su.type.method){let x=P.params.id,j=L(x),z=R.get(j);if(Z.Message.isRequest(z)){let Ue=n?.connectionStrategy,nt=Ue&&Ue.cancelUndispatched?Ue.cancelUndispatched(z,ie):void 0;if(nt&&(nt.error!==void 0||nt.result!==void 0)){R.delete(j),A.delete(x),nt.id=z.id,On(nt,P.method,Date.now()),e.write(nt).catch(()=>i.error("Sending response for canceled message failed."));return}}let je=A.get(x);if(je!==void 0){je.cancel(),Dn(P);return}else N.add(x)}W(R,P)}finally{Er()}};function Aa(P){if(dt())return;function x(ge,Be,_e){let yt={jsonrpc:u,id:P.id};ge instanceof Z.ResponseError?yt.error=ge.toJson():yt.result=ge===void 0?null:ge,On(yt,Be,_e),e.write(yt).catch(()=>i.error("Sending response failed."))}function j(ge,Be,_e){let yt={jsonrpc:u,id:P.id,error:ge.toJson()};On(yt,Be,_e),e.write(yt).catch(()=>i.error("Sending response failed."))}function z(ge,Be,_e){ge===void 0&&(ge=null);let yt={jsonrpc:u,id:P.id,result:ge};On(yt,Be,_e),e.write(yt).catch(()=>i.error("Sending response failed."))}xo(P);let je=l.get(P.method),Ue,nt;je&&(Ue=je.type,nt=je.handler);let Tt=Date.now();if(nt||c){let ge=P.id??String(Date.now()),Be=le.receiver.createCancellationTokenSource(ge);P.id!==null&&N.has(P.id)&&Be.cancel(),P.id!==null&&A.set(ge,Be);try{let _e;if(nt)if(P.params===void 0){if(Ue!==void 0&&Ue.numberOfParams!==0){j(new Z.ResponseError(Z.ErrorCodes.InvalidParams,`Request ${P.method} defines ${Ue.numberOfParams} params but received none.`),P.method,Tt);return}_e=nt(Be.token)}else if(Array.isArray(P.params)){if(Ue!==void 0&&Ue.parameterStructures===Z.ParameterStructures.byName){j(new Z.ResponseError(Z.ErrorCodes.InvalidParams,`Request ${P.method} defines parameters by name but received parameters by position`),P.method,Tt);return}_e=nt(...P.params,Be.token)}else{if(Ue!==void 0&&Ue.parameterStructures===Z.ParameterStructures.byPosition){j(new Z.ResponseError(Z.ErrorCodes.InvalidParams,`Request ${P.method} defines parameters by position but received parameters by name`),P.method,Tt);return}_e=nt(P.params,Be.token)}else c&&(_e=c(P.method,P.params,Be.token));let yt=_e;_e?yt.then?yt.then(Jt=>{A.delete(ge),x(Jt,P.method,Tt)},Jt=>{A.delete(ge),Jt instanceof Z.ResponseError?j(Jt,P.method,Tt):Jt&&It.string(Jt.message)?j(new Z.ResponseError(Z.ErrorCodes.InternalError,`Request ${P.method} failed with message: ${Jt.message}`),P.method,Tt):j(new Z.ResponseError(Z.ErrorCodes.InternalError,`Request ${P.method} failed unexpectedly without providing any details.`),P.method,Tt)}):(A.delete(ge),x(_e,P.method,Tt)):(A.delete(ge),z(_e,P.method,Tt))}catch(_e){A.delete(ge),_e instanceof Z.ResponseError?x(_e,P.method,Tt):_e&&It.string(_e.message)?j(new Z.ResponseError(Z.ErrorCodes.InternalError,`Request ${P.method} failed with message: ${_e.message}`),P.method,Tt):j(new Z.ResponseError(Z.ErrorCodes.InternalError,`Request ${P.method} failed unexpectedly without providing any details.`),P.method,Tt)}}else j(new Z.ResponseError(Z.ErrorCodes.MethodNotFound,`Unhandled method ${P.method}`),P.method,Tt)}function Pa(P){if(!dt())if(P.id===null)P.error?i.error(`Received response message without id: Error is: 
${JSON.stringify(P.error,void 0,4)}`):i.error("Received response message without id. No further error information provided.");else{let x=P.id,j=E.get(x);if(qo(P,j),j!==void 0){E.delete(x);try{if(P.error){let z=P.error;j.reject(new Z.ResponseError(z.code,z.message,z.data))}else if(P.result!==void 0)j.resolve(P.result);else throw new Error("Should never happen.")}catch(z){z.message?i.error(`Response handler '${j.method}' failed with message: ${z.message}`):i.error(`Response handler '${j.method}' failed unexpectedly.`)}}}}function Sa(P){if(dt())return;let x,j;if(P.method===Su.type.method){let z=P.params.id;N.delete(z),Dn(P);return}else{let z=h.get(P.method);z&&(j=z.handler,x=z.type)}if(j||d)try{if(Dn(P),j)if(P.params===void 0)x!==void 0&&x.numberOfParams!==0&&x.parameterStructures!==Z.ParameterStructures.byName&&i.error(`Notification ${P.method} defines ${x.numberOfParams} params but received none.`),j();else if(Array.isArray(P.params)){let z=P.params;P.method===Pu.type.method&&z.length===2&&jR.is(z[0])?j({token:z[0],value:z[1]}):(x!==void 0&&(x.parameterStructures===Z.ParameterStructures.byName&&i.error(`Notification ${P.method} defines parameters by name but received parameters by position`),x.numberOfParams!==P.params.length&&i.error(`Notification ${P.method} defines ${x.numberOfParams} params but received ${z.length} arguments`)),j(...z))}else x!==void 0&&x.parameterStructures===Z.ParameterStructures.byPosition&&i.error(`Notification ${P.method} defines parameters by position but received parameters by name`),j(P.params);else d&&d(P.method,P.params)}catch(z){z.message?i.error(`Notification handler '${P.method}' failed with message: ${z.message}`):i.error(`Notification handler '${P.method}' failed unexpectedly.`)}else Ne.fire(P)}function vu(P){if(!P){i.error("Received empty message.");return}i.error(`Received message which is neither a response nor a notification message:
${JSON.stringify(P,null,4)}`);let x=P;if(It.string(x.id)||It.number(x.id)){let j=x.id,z=E.get(j);z&&z.reject(new Error("The received response has neither a result nor an error property."))}}function gt(P){if(P!=null)switch(b){case De.Verbose:return JSON.stringify(P,null,4);case De.Compact:return JSON.stringify(P);default:return}}function pi(P){if(!(b===De.Off||!$))if(O===un.Text){let x;(b===De.Verbose||b===De.Compact)&&P.params&&(x=`Params: ${gt(P.params)}

`),$.log(`Sending request '${P.method} - (${P.id})'.`,x)}else Mr("send-request",P)}function _u(P){if(!(b===De.Off||!$))if(O===un.Text){let x;(b===De.Verbose||b===De.Compact)&&(P.params?x=`Params: ${gt(P.params)}

`:x=`No parameters provided.

`),$.log(`Sending notification '${P.method}'.`,x)}else Mr("send-notification",P)}function On(P,x,j){if(!(b===De.Off||!$))if(O===un.Text){let z;(b===De.Verbose||b===De.Compact)&&(P.error&&P.error.data?z=`Error data: ${gt(P.error.data)}

`:P.result?z=`Result: ${gt(P.result)}

`:P.error===void 0&&(z=`No result returned.

`)),$.log(`Sending response '${x} - (${P.id})'. Processing request took ${Date.now()-j}ms`,z)}else Mr("send-response",P)}function xo(P){if(!(b===De.Off||!$))if(O===un.Text){let x;(b===De.Verbose||b===De.Compact)&&P.params&&(x=`Params: ${gt(P.params)}

`),$.log(`Received request '${P.method} - (${P.id})'.`,x)}else Mr("receive-request",P)}function Dn(P){if(!(b===De.Off||!$||P.method===sm.type.method))if(O===un.Text){let x;(b===De.Verbose||b===De.Compact)&&(P.params?x=`Params: ${gt(P.params)}

`:x=`No parameters provided.

`),$.log(`Received notification '${P.method}'.`,x)}else Mr("receive-notification",P)}function qo(P,x){if(!(b===De.Off||!$))if(O===un.Text){let j;if((b===De.Verbose||b===De.Compact)&&(P.error&&P.error.data?j=`Error data: ${gt(P.error.data)}

`:P.result?j=`Result: ${gt(P.result)}

`:P.error===void 0&&(j=`No result returned.

`)),x){let z=P.error?` Request failed: ${P.error.message} (${P.error.code}).`:"";$.log(`Received response '${x.method} - (${P.id})' in ${Date.now()-x.timerStart}ms.${z}`,j)}else $.log(`Received response ${P.id} without active response promise.`,j)}else Mr("receive-response",P)}function Mr(P,x){if(!$||b===De.Off)return;let j={isLSPMessage:!0,type:P,message:x,timestamp:Date.now()};$.log(j)}function rn(){if(J())throw new Ki(pl.Closed,"Connection is closed.");if(dt())throw new Ki(pl.Disposed,"Connection is disposed.")}function Ca(){if(oe())throw new Ki(pl.AlreadyListening,"Connection is already listening")}function Ea(){if(!oe())throw new Error("Call listen() first.")}function Nr(P){return P===void 0?null:P}function In(P){if(P!==null)return P}function Lt(P){return P!=null&&!Array.isArray(P)&&typeof P=="object"}function nn(P,x){switch(P){case Z.ParameterStructures.auto:return Lt(x)?In(x):[Nr(x)];case Z.ParameterStructures.byName:if(!Lt(x))throw new Error("Received parameters by name but param is not an object literal.");return In(x);case Z.ParameterStructures.byPosition:return[Nr(x)];default:throw new Error(`Unknown parameter structure ${P.toString()}`)}}function on(P,x){let j,z=P.numberOfParams;switch(z){case 0:j=void 0;break;case 1:j=nn(P.parameterStructures,x[0]);break;default:j=[];for(let je=0;je<x.length&&je<z;je++)j.push(Nr(x[je]));if(x.length<z)for(let je=x.length;je<z;je++)j.push(null);break}return j}let xn={sendNotification:(P,...x)=>{rn();let j,z;if(It.string(P)){j=P;let Ue=x[0],nt=0,Tt=Z.ParameterStructures.auto;Z.ParameterStructures.is(Ue)&&(nt=1,Tt=Ue);let ge=x.length,Be=ge-nt;switch(Be){case 0:z=void 0;break;case 1:z=nn(Tt,x[nt]);break;default:if(Tt===Z.ParameterStructures.byName)throw new Error(`Received ${Be} parameters for 'by Name' notification parameter structure.`);z=x.slice(nt,ge).map(_e=>Nr(_e));break}}else{let Ue=x;j=P.method,z=on(P,Ue)}let je={jsonrpc:u,method:j,params:z};return _u(je),e.write(je).catch(()=>i.error("Sending notification failed."))},onNotification:(P,x)=>{rn();let j;return It.func(P)?d=P:x&&(It.string(P)?(j=P,h.set(P,{type:void 0,handler:x})):(j=P.method,h.set(P.method,{type:P,handler:x}))),{dispose:()=>{j!==void 0?h.delete(j):d=void 0}}},onProgress:(P,x,j)=>{if(v.has(x))throw new Error(`Progress handler for token ${x} already registered`);return v.set(x,j),{dispose:()=>{v.delete(x)}}},sendProgress:(P,x,j)=>xn.sendNotification(Pu.type,{token:x,value:j}),onUnhandledProgress:Je.event,sendRequest:(P,...x)=>{rn(),Ea();let j,z,je;if(It.string(P)){j=P;let ge=x[0],Be=x[x.length-1],_e=0,yt=Z.ParameterStructures.auto;Z.ParameterStructures.is(ge)&&(_e=1,yt=ge);let Jt=x.length;im.CancellationToken.is(Be)&&(Jt=Jt-1,je=Be);let hi=Jt-_e;switch(hi){case 0:z=void 0;break;case 1:z=nn(yt,x[_e]);break;default:if(yt===Z.ParameterStructures.byName)throw new Error(`Received ${hi} parameters for 'by Name' request parameter structure.`);z=x.slice(_e,Jt).map(qn=>Nr(qn));break}}else{let ge=x;j=P.method,z=on(P,ge);let Be=P.numberOfParams;je=im.CancellationToken.is(ge[Be])?ge[Be]:void 0}let Ue=o++,nt;return je&&(nt=je.onCancellationRequested(()=>{let ge=le.sender.sendCancellation(xn,Ue);return ge===void 0?(i.log(`Received no promise from cancellation strategy when cancelling id ${Ue}`),Promise.resolve()):ge.catch(()=>{i.log(`Sending cancellation messages for id ${Ue} failed`)})})),new Promise((ge,Be)=>{let _e={jsonrpc:u,id:Ue,method:j,params:z},yt=qn=>{ge(qn),le.sender.cleanup(Ue),nt?.dispose()},Jt=qn=>{Be(qn),le.sender.cleanup(Ue),nt?.dispose()},hi={method:j,timerStart:Date.now(),resolve:yt,reject:Jt};pi(_e);try{e.write(_e).catch(()=>i.error("Sending request failed."))}catch(qn){hi.reject(new Z.ResponseError(Z.ErrorCodes.MessageWriteError,qn.message?qn.message:"Unknown reason")),hi=null}hi&&E.set(Ue,hi)})},onRequest:(P,x)=>{rn();let j=null;return am.is(P)?(j=void 0,c=P):It.string(P)?(j=null,x!==void 0&&(j=P,l.set(P,{handler:x,type:void 0}))):x!==void 0&&(j=P.method,l.set(P.method,{type:P,handler:x})),{dispose:()=>{j!==null&&(j!==void 0?l.delete(j):c=void 0)}}},hasPendingResponse:()=>E.size>0,trace:async(P,x,j)=>{let z=!1,je=un.Text;j!==void 0&&(It.boolean(j)?z=j:(z=j.sendNotification||!1,je=j.traceFormat||un.Text)),b=P,O=je,b===De.Off?$=void 0:$=x,z&&!J()&&!dt()&&await xn.sendNotification(UR.type,{value:De.toString(P)})},onError:ee.event,onClose:Fe.event,onUnhandledNotification:Ne.event,onDispose:K.event,end:()=>{e.end()},dispose:()=>{if(dt())return;B=cn.Disposed,K.fire(void 0);let P=new Z.ResponseError(Z.ErrorCodes.PendingResponseRejected,"Pending response rejected since connection got disposed");for(let x of E.values())x.reject(P);E=new Map,A=new Map,N=new Set,R=new FR.LinkedMap,It.func(e.dispose)&&e.dispose(),It.func(t.dispose)&&t.dispose()},listen:()=>{rn(),Ca(),B=cn.Listening,t.listen(ar)},inspect:()=>{(0,$R.default)().console.log("inspect")}};return xn.onNotification(sm.type,P=>{if(b===De.Off||!$)return;let x=b===De.Verbose||b===De.Compact;$.log(P.message,x?P.verbose:void 0)}),xn.onNotification(Pu.type,P=>{let x=v.get(P.token);x?x(P.value):Je.fire(P)}),xn}Q.createMessageConnection=T$});var hm=f(D=>{"use strict";Object.defineProperty(D,"__esModule",{value:!0});D.TraceFormat=D.TraceValues=D.Trace=D.ProgressType=D.ProgressToken=D.createMessageConnection=D.NullLogger=D.ConnectionOptions=D.ConnectionStrategy=D.WriteableStreamMessageWriter=D.AbstractMessageWriter=D.MessageWriter=D.ReadableStreamMessageReader=D.AbstractMessageReader=D.MessageReader=D.CancellationToken=D.CancellationTokenSource=D.Emitter=D.Event=D.Disposable=D.LRUCache=D.Touch=D.LinkedMap=D.ParameterStructures=D.NotificationType9=D.NotificationType8=D.NotificationType7=D.NotificationType6=D.NotificationType5=D.NotificationType4=D.NotificationType3=D.NotificationType2=D.NotificationType1=D.NotificationType0=D.NotificationType=D.ErrorCodes=D.ResponseError=D.RequestType9=D.RequestType8=D.RequestType7=D.RequestType6=D.RequestType5=D.RequestType4=D.RequestType3=D.RequestType2=D.RequestType1=D.RequestType0=D.RequestType=D.Message=D.RAL=void 0;D.CancellationStrategy=D.CancellationSenderStrategy=D.CancellationReceiverStrategy=D.ConnectionError=D.ConnectionErrors=D.LogTraceNotification=D.SetTraceNotification=void 0;var ze=Wh();Object.defineProperty(D,"Message",{enumerable:!0,get:function(){return ze.Message}});Object.defineProperty(D,"RequestType",{enumerable:!0,get:function(){return ze.RequestType}});Object.defineProperty(D,"RequestType0",{enumerable:!0,get:function(){return ze.RequestType0}});Object.defineProperty(D,"RequestType1",{enumerable:!0,get:function(){return ze.RequestType1}});Object.defineProperty(D,"RequestType2",{enumerable:!0,get:function(){return ze.RequestType2}});Object.defineProperty(D,"RequestType3",{enumerable:!0,get:function(){return ze.RequestType3}});Object.defineProperty(D,"RequestType4",{enumerable:!0,get:function(){return ze.RequestType4}});Object.defineProperty(D,"RequestType5",{enumerable:!0,get:function(){return ze.RequestType5}});Object.defineProperty(D,"RequestType6",{enumerable:!0,get:function(){return ze.RequestType6}});Object.defineProperty(D,"RequestType7",{enumerable:!0,get:function(){return ze.RequestType7}});Object.defineProperty(D,"RequestType8",{enumerable:!0,get:function(){return ze.RequestType8}});Object.defineProperty(D,"RequestType9",{enumerable:!0,get:function(){return ze.RequestType9}});Object.defineProperty(D,"ResponseError",{enumerable:!0,get:function(){return ze.ResponseError}});Object.defineProperty(D,"ErrorCodes",{enumerable:!0,get:function(){return ze.ErrorCodes}});Object.defineProperty(D,"NotificationType",{enumerable:!0,get:function(){return ze.NotificationType}});Object.defineProperty(D,"NotificationType0",{enumerable:!0,get:function(){return ze.NotificationType0}});Object.defineProperty(D,"NotificationType1",{enumerable:!0,get:function(){return ze.NotificationType1}});Object.defineProperty(D,"NotificationType2",{enumerable:!0,get:function(){return ze.NotificationType2}});Object.defineProperty(D,"NotificationType3",{enumerable:!0,get:function(){return ze.NotificationType3}});Object.defineProperty(D,"NotificationType4",{enumerable:!0,get:function(){return ze.NotificationType4}});Object.defineProperty(D,"NotificationType5",{enumerable:!0,get:function(){return ze.NotificationType5}});Object.defineProperty(D,"NotificationType6",{enumerable:!0,get:function(){return ze.NotificationType6}});Object.defineProperty(D,"NotificationType7",{enumerable:!0,get:function(){return ze.NotificationType7}});Object.defineProperty(D,"NotificationType8",{enumerable:!0,get:function(){return ze.NotificationType8}});Object.defineProperty(D,"NotificationType9",{enumerable:!0,get:function(){return ze.NotificationType9}});Object.defineProperty(D,"ParameterStructures",{enumerable:!0,get:function(){return ze.ParameterStructures}});var dm=Kh();Object.defineProperty(D,"LinkedMap",{enumerable:!0,get:function(){return dm.LinkedMap}});Object.defineProperty(D,"LRUCache",{enumerable:!0,get:function(){return dm.LRUCache}});Object.defineProperty(D,"Touch",{enumerable:!0,get:function(){return dm.Touch}});var R$=mh();Object.defineProperty(D,"Disposable",{enumerable:!0,get:function(){return R$.Disposable}});var WR=Mo();Object.defineProperty(D,"Event",{enumerable:!0,get:function(){return WR.Event}});Object.defineProperty(D,"Emitter",{enumerable:!0,get:function(){return WR.Emitter}});var BR=Xh();Object.defineProperty(D,"CancellationTokenSource",{enumerable:!0,get:function(){return BR.CancellationTokenSource}});Object.defineProperty(D,"CancellationToken",{enumerable:!0,get:function(){return BR.CancellationToken}});var fm=DR();Object.defineProperty(D,"MessageReader",{enumerable:!0,get:function(){return fm.MessageReader}});Object.defineProperty(D,"AbstractMessageReader",{enumerable:!0,get:function(){return fm.AbstractMessageReader}});Object.defineProperty(D,"ReadableStreamMessageReader",{enumerable:!0,get:function(){return fm.ReadableStreamMessageReader}});var pm=MR();Object.defineProperty(D,"MessageWriter",{enumerable:!0,get:function(){return pm.MessageWriter}});Object.defineProperty(D,"AbstractMessageWriter",{enumerable:!0,get:function(){return pm.AbstractMessageWriter}});Object.defineProperty(D,"WriteableStreamMessageWriter",{enumerable:!0,get:function(){return pm.WriteableStreamMessageWriter}});var Zt=HR();Object.defineProperty(D,"ConnectionStrategy",{enumerable:!0,get:function(){return Zt.ConnectionStrategy}});Object.defineProperty(D,"ConnectionOptions",{enumerable:!0,get:function(){return Zt.ConnectionOptions}});Object.defineProperty(D,"NullLogger",{enumerable:!0,get:function(){return Zt.NullLogger}});Object.defineProperty(D,"createMessageConnection",{enumerable:!0,get:function(){return Zt.createMessageConnection}});Object.defineProperty(D,"ProgressToken",{enumerable:!0,get:function(){return Zt.ProgressToken}});Object.defineProperty(D,"ProgressType",{enumerable:!0,get:function(){return Zt.ProgressType}});Object.defineProperty(D,"Trace",{enumerable:!0,get:function(){return Zt.Trace}});Object.defineProperty(D,"TraceValues",{enumerable:!0,get:function(){return Zt.TraceValues}});Object.defineProperty(D,"TraceFormat",{enumerable:!0,get:function(){return Zt.TraceFormat}});Object.defineProperty(D,"SetTraceNotification",{enumerable:!0,get:function(){return Zt.SetTraceNotification}});Object.defineProperty(D,"LogTraceNotification",{enumerable:!0,get:function(){return Zt.LogTraceNotification}});Object.defineProperty(D,"ConnectionErrors",{enumerable:!0,get:function(){return Zt.ConnectionErrors}});Object.defineProperty(D,"ConnectionError",{enumerable:!0,get:function(){return Zt.ConnectionError}});Object.defineProperty(D,"CancellationReceiverStrategy",{enumerable:!0,get:function(){return Zt.CancellationReceiverStrategy}});Object.defineProperty(D,"CancellationSenderStrategy",{enumerable:!0,get:function(){return Zt.CancellationSenderStrategy}});Object.defineProperty(D,"CancellationStrategy",{enumerable:!0,get:function(){return Zt.CancellationStrategy}});var b$=gi();D.RAL=b$.default});var Ti=f(kr=>{"use strict";var A$=kr&&kr.__createBinding||(Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]}),P$=kr&&kr.__exportStar||function(t,e){for(var r in t)r!=="default"&&!Object.prototype.hasOwnProperty.call(e,r)&&A$(e,t,r)};Object.defineProperty(kr,"__esModule",{value:!0});kr.createMessageConnection=kr.BrowserMessageWriter=kr.BrowserMessageReader=void 0;var S$=ER();S$.default.install();var xa=hm();P$(hm(),kr);var mm=class extends xa.AbstractMessageReader{constructor(e){super(),this._onData=new xa.Emitter,this._messageListener=r=>{this._onData.fire(r.data)},e.addEventListener("error",r=>this.fireError(r)),e.onmessage=this._messageListener}listen(e){return this._onData.event(e)}};kr.BrowserMessageReader=mm;var gm=class extends xa.AbstractMessageWriter{constructor(e){super(),this.context=e,this.errorCount=0,e.addEventListener("error",r=>this.fireError(r))}write(e){try{return this.context.postMessage(e),Promise.resolve()}catch(r){return this.handleError(r,e),Promise.reject(r)}}handleError(e,r){this.errorCount++,this.fireError(e,r,this.errorCount)}end(){}};kr.BrowserMessageWriter=gm;function C$(t,e,r,n){return r===void 0&&(r=xa.NullLogger),xa.ConnectionStrategy.is(n)&&(n={connectionStrategy:n}),(0,xa.createMessageConnection)(t,e,r,n)}kr.createMessageConnection=C$});var ym=f((Hle,KR)=>{"use strict";KR.exports=Ti()});var qa=f((zR,hl)=>{(function(t){if(typeof hl=="object"&&typeof hl.exports=="object"){var e=t(bR,zR);e!==void 0&&(hl.exports=e)}else typeof define=="function"&&define.amd&&define(["require","exports"],t)})(function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.TextDocument=e.EOL=e.WorkspaceFolder=e.InlayHint=e.InlayHintLabelPart=e.InlayHintKind=e.InlineValueContext=e.InlineValueEvaluatableExpression=e.InlineValueVariableLookup=e.InlineValueText=e.SemanticTokens=e.SemanticTokenModifiers=e.SemanticTokenTypes=e.SelectionRange=e.DocumentLink=e.FormattingOptions=e.CodeLens=e.CodeAction=e.CodeActionContext=e.CodeActionTriggerKind=e.CodeActionKind=e.DocumentSymbol=e.WorkspaceSymbol=e.SymbolInformation=e.SymbolTag=e.SymbolKind=e.DocumentHighlight=e.DocumentHighlightKind=e.SignatureInformation=e.ParameterInformation=e.Hover=e.MarkedString=e.CompletionList=e.CompletionItem=e.CompletionItemLabelDetails=e.InsertTextMode=e.InsertReplaceEdit=e.CompletionItemTag=e.InsertTextFormat=e.CompletionItemKind=e.MarkupContent=e.MarkupKind=e.TextDocumentItem=e.OptionalVersionedTextDocumentIdentifier=e.VersionedTextDocumentIdentifier=e.TextDocumentIdentifier=e.WorkspaceChange=e.WorkspaceEdit=e.DeleteFile=e.RenameFile=e.CreateFile=e.TextDocumentEdit=e.AnnotatedTextEdit=e.ChangeAnnotationIdentifier=e.ChangeAnnotation=e.TextEdit=e.Command=e.Diagnostic=e.CodeDescription=e.DiagnosticTag=e.DiagnosticSeverity=e.DiagnosticRelatedInformation=e.FoldingRange=e.FoldingRangeKind=e.ColorPresentation=e.ColorInformation=e.Color=e.LocationLink=e.Location=e.Range=e.Position=e.uinteger=e.integer=e.URI=e.DocumentUri=void 0;var r;(function(m){function S(C){return typeof C=="string"}m.is=S})(r=e.DocumentUri||(e.DocumentUri={}));var n;(function(m){function S(C){return typeof C=="string"}m.is=S})(n=e.URI||(e.URI={}));var i;(function(m){m.MIN_VALUE=-2147483648,m.MAX_VALUE=2147483647;function S(C){return typeof C=="number"&&m.MIN_VALUE<=C&&C<=m.MAX_VALUE}m.is=S})(i=e.integer||(e.integer={}));var o;(function(m){m.MIN_VALUE=0,m.MAX_VALUE=2147483647;function S(C){return typeof C=="number"&&m.MIN_VALUE<=C&&C<=m.MAX_VALUE}m.is=S})(o=e.uinteger||(e.uinteger={}));var a;(function(m){function S(T,p){return T===Number.MAX_VALUE&&(T=o.MAX_VALUE),p===Number.MAX_VALUE&&(p=o.MAX_VALUE),{line:T,character:p}}m.create=S;function C(T){var p=T;return k.objectLiteral(p)&&k.uinteger(p.line)&&k.uinteger(p.character)}m.is=C})(a=e.Position||(e.Position={}));var s;(function(m){function S(T,p,w,I){if(k.uinteger(T)&&k.uinteger(p)&&k.uinteger(w)&&k.uinteger(I))return{start:a.create(T,p),end:a.create(w,I)};if(a.is(T)&&a.is(p))return{start:T,end:p};throw new Error("Range#create called with invalid arguments[".concat(T,", ").concat(p,", ").concat(w,", ").concat(I,"]"))}m.create=S;function C(T){var p=T;return k.objectLiteral(p)&&a.is(p.start)&&a.is(p.end)}m.is=C})(s=e.Range||(e.Range={}));var u;(function(m){function S(T,p){return{uri:T,range:p}}m.create=S;function C(T){var p=T;return k.objectLiteral(p)&&s.is(p.range)&&(k.string(p.uri)||k.undefined(p.uri))}m.is=C})(u=e.Location||(e.Location={}));var c;(function(m){function S(T,p,w,I){return{targetUri:T,targetRange:p,targetSelectionRange:w,originSelectionRange:I}}m.create=S;function C(T){var p=T;return k.objectLiteral(p)&&s.is(p.targetRange)&&k.string(p.targetUri)&&s.is(p.targetSelectionRange)&&(s.is(p.originSelectionRange)||k.undefined(p.originSelectionRange))}m.is=C})(c=e.LocationLink||(e.LocationLink={}));var l;(function(m){function S(T,p,w,I){return{red:T,green:p,blue:w,alpha:I}}m.create=S;function C(T){var p=T;return k.objectLiteral(p)&&k.numberRange(p.red,0,1)&&k.numberRange(p.green,0,1)&&k.numberRange(p.blue,0,1)&&k.numberRange(p.alpha,0,1)}m.is=C})(l=e.Color||(e.Color={}));var d;(function(m){function S(T,p){return{range:T,color:p}}m.create=S;function C(T){var p=T;return k.objectLiteral(p)&&s.is(p.range)&&l.is(p.color)}m.is=C})(d=e.ColorInformation||(e.ColorInformation={}));var h;(function(m){function S(T,p,w){return{label:T,textEdit:p,additionalTextEdits:w}}m.create=S;function C(T){var p=T;return k.objectLiteral(p)&&k.string(p.label)&&(k.undefined(p.textEdit)||$.is(p))&&(k.undefined(p.additionalTextEdits)||k.typedArray(p.additionalTextEdits,$.is))}m.is=C})(h=e.ColorPresentation||(e.ColorPresentation={}));var v;(function(m){m.Comment="comment",m.Imports="imports",m.Region="region"})(v=e.FoldingRangeKind||(e.FoldingRangeKind={}));var g;(function(m){function S(T,p,w,I,ne,ft){var Ke={startLine:T,endLine:p};return k.defined(w)&&(Ke.startCharacter=w),k.defined(I)&&(Ke.endCharacter=I),k.defined(ne)&&(Ke.kind=ne),k.defined(ft)&&(Ke.collapsedText=ft),Ke}m.create=S;function C(T){var p=T;return k.objectLiteral(p)&&k.uinteger(p.startLine)&&k.uinteger(p.startLine)&&(k.undefined(p.startCharacter)||k.uinteger(p.startCharacter))&&(k.undefined(p.endCharacter)||k.uinteger(p.endCharacter))&&(k.undefined(p.kind)||k.string(p.kind))}m.is=C})(g=e.FoldingRange||(e.FoldingRange={}));var R;(function(m){function S(T,p){return{location:T,message:p}}m.create=S;function C(T){var p=T;return k.defined(p)&&u.is(p.location)&&k.string(p.message)}m.is=C})(R=e.DiagnosticRelatedInformation||(e.DiagnosticRelatedInformation={}));var E;(function(m){m.Error=1,m.Warning=2,m.Information=3,m.Hint=4})(E=e.DiagnosticSeverity||(e.DiagnosticSeverity={}));var N;(function(m){m.Unnecessary=1,m.Deprecated=2})(N=e.DiagnosticTag||(e.DiagnosticTag={}));var A;(function(m){function S(C){var T=C;return k.objectLiteral(T)&&k.string(T.href)}m.is=S})(A=e.CodeDescription||(e.CodeDescription={}));var b;(function(m){function S(T,p,w,I,ne,ft){var Ke={range:T,message:p};return k.defined(w)&&(Ke.severity=w),k.defined(I)&&(Ke.code=I),k.defined(ne)&&(Ke.source=ne),k.defined(ft)&&(Ke.relatedInformation=ft),Ke}m.create=S;function C(T){var p,w=T;return k.defined(w)&&s.is(w.range)&&k.string(w.message)&&(k.number(w.severity)||k.undefined(w.severity))&&(k.integer(w.code)||k.string(w.code)||k.undefined(w.code))&&(k.undefined(w.codeDescription)||k.string((p=w.codeDescription)===null||p===void 0?void 0:p.href))&&(k.string(w.source)||k.undefined(w.source))&&(k.undefined(w.relatedInformation)||k.typedArray(w.relatedInformation,R.is))}m.is=C})(b=e.Diagnostic||(e.Diagnostic={}));var O;(function(m){function S(T,p){for(var w=[],I=2;I<arguments.length;I++)w[I-2]=arguments[I];var ne={title:T,command:p};return k.defined(w)&&w.length>0&&(ne.arguments=w),ne}m.create=S;function C(T){var p=T;return k.defined(p)&&k.string(p.title)&&k.string(p.command)}m.is=C})(O=e.Command||(e.Command={}));var $;(function(m){function S(w,I){return{range:w,newText:I}}m.replace=S;function C(w,I){return{range:{start:w,end:w},newText:I}}m.insert=C;function T(w){return{range:w,newText:""}}m.del=T;function p(w){var I=w;return k.objectLiteral(I)&&k.string(I.newText)&&s.is(I.range)}m.is=p})($=e.TextEdit||(e.TextEdit={}));var B;(function(m){function S(T,p,w){var I={label:T};return p!==void 0&&(I.needsConfirmation=p),w!==void 0&&(I.description=w),I}m.create=S;function C(T){var p=T;return k.objectLiteral(p)&&k.string(p.label)&&(k.boolean(p.needsConfirmation)||p.needsConfirmation===void 0)&&(k.string(p.description)||p.description===void 0)}m.is=C})(B=e.ChangeAnnotation||(e.ChangeAnnotation={}));var ee;(function(m){function S(C){var T=C;return k.string(T)}m.is=S})(ee=e.ChangeAnnotationIdentifier||(e.ChangeAnnotationIdentifier={}));var Fe;(function(m){function S(w,I,ne){return{range:w,newText:I,annotationId:ne}}m.replace=S;function C(w,I,ne){return{range:{start:w,end:w},newText:I,annotationId:ne}}m.insert=C;function T(w,I){return{range:w,newText:"",annotationId:I}}m.del=T;function p(w){var I=w;return $.is(I)&&(B.is(I.annotationId)||ee.is(I.annotationId))}m.is=p})(Fe=e.AnnotatedTextEdit||(e.AnnotatedTextEdit={}));var Ne;(function(m){function S(T,p){return{textDocument:T,edits:p}}m.create=S;function C(T){var p=T;return k.defined(p)&&J.is(p.textDocument)&&Array.isArray(p.edits)}m.is=C})(Ne=e.TextDocumentEdit||(e.TextDocumentEdit={}));var Je;(function(m){function S(T,p,w){var I={kind:"create",uri:T};return p!==void 0&&(p.overwrite!==void 0||p.ignoreIfExists!==void 0)&&(I.options=p),w!==void 0&&(I.annotationId=w),I}m.create=S;function C(T){var p=T;return p&&p.kind==="create"&&k.string(p.uri)&&(p.options===void 0||(p.options.overwrite===void 0||k.boolean(p.options.overwrite))&&(p.options.ignoreIfExists===void 0||k.boolean(p.options.ignoreIfExists)))&&(p.annotationId===void 0||ee.is(p.annotationId))}m.is=C})(Je=e.CreateFile||(e.CreateFile={}));var K;(function(m){function S(T,p,w,I){var ne={kind:"rename",oldUri:T,newUri:p};return w!==void 0&&(w.overwrite!==void 0||w.ignoreIfExists!==void 0)&&(ne.options=w),I!==void 0&&(ne.annotationId=I),ne}m.create=S;function C(T){var p=T;return p&&p.kind==="rename"&&k.string(p.oldUri)&&k.string(p.newUri)&&(p.options===void 0||(p.options.overwrite===void 0||k.boolean(p.options.overwrite))&&(p.options.ignoreIfExists===void 0||k.boolean(p.options.ignoreIfExists)))&&(p.annotationId===void 0||ee.is(p.annotationId))}m.is=C})(K=e.RenameFile||(e.RenameFile={}));var le;(function(m){function S(T,p,w){var I={kind:"delete",uri:T};return p!==void 0&&(p.recursive!==void 0||p.ignoreIfNotExists!==void 0)&&(I.options=p),w!==void 0&&(I.annotationId=w),I}m.create=S;function C(T){var p=T;return p&&p.kind==="delete"&&k.string(p.uri)&&(p.options===void 0||(p.options.recursive===void 0||k.boolean(p.options.recursive))&&(p.options.ignoreIfNotExists===void 0||k.boolean(p.options.ignoreIfNotExists)))&&(p.annotationId===void 0||ee.is(p.annotationId))}m.is=C})(le=e.DeleteFile||(e.DeleteFile={}));var L;(function(m){function S(C){var T=C;return T&&(T.changes!==void 0||T.documentChanges!==void 0)&&(T.documentChanges===void 0||T.documentChanges.every(function(p){return k.string(p.kind)?Je.is(p)||K.is(p)||le.is(p):Ne.is(p)}))}m.is=S})(L=e.WorkspaceEdit||(e.WorkspaceEdit={}));var q=function(){function m(S,C){this.edits=S,this.changeAnnotations=C}return m.prototype.insert=function(S,C,T){var p,w;if(T===void 0?p=$.insert(S,C):ee.is(T)?(w=T,p=Fe.insert(S,C,T)):(this.assertChangeAnnotations(this.changeAnnotations),w=this.changeAnnotations.manage(T),p=Fe.insert(S,C,w)),this.edits.push(p),w!==void 0)return w},m.prototype.replace=function(S,C,T){var p,w;if(T===void 0?p=$.replace(S,C):ee.is(T)?(w=T,p=Fe.replace(S,C,T)):(this.assertChangeAnnotations(this.changeAnnotations),w=this.changeAnnotations.manage(T),p=Fe.replace(S,C,w)),this.edits.push(p),w!==void 0)return w},m.prototype.delete=function(S,C){var T,p;if(C===void 0?T=$.del(S):ee.is(C)?(p=C,T=Fe.del(S,C)):(this.assertChangeAnnotations(this.changeAnnotations),p=this.changeAnnotations.manage(C),T=Fe.del(S,p)),this.edits.push(T),p!==void 0)return p},m.prototype.add=function(S){this.edits.push(S)},m.prototype.all=function(){return this.edits},m.prototype.clear=function(){this.edits.splice(0,this.edits.length)},m.prototype.assertChangeAnnotations=function(S){if(S===void 0)throw new Error("Text edit change is not configured to manage change annotations.")},m}(),F=function(){function m(S){this._annotations=S===void 0?Object.create(null):S,this._counter=0,this._size=0}return m.prototype.all=function(){return this._annotations},Object.defineProperty(m.prototype,"size",{get:function(){return this._size},enumerable:!1,configurable:!0}),m.prototype.manage=function(S,C){var T;if(ee.is(S)?T=S:(T=this.nextId(),C=S),this._annotations[T]!==void 0)throw new Error("Id ".concat(T," is already in use."));if(C===void 0)throw new Error("No annotation provided for id ".concat(T));return this._annotations[T]=C,this._size++,T},m.prototype.nextId=function(){return this._counter++,this._counter.toString()},m}(),W=function(){function m(S){var C=this;this._textEditChanges=Object.create(null),S!==void 0?(this._workspaceEdit=S,S.documentChanges?(this._changeAnnotations=new F(S.changeAnnotations),S.changeAnnotations=this._changeAnnotations.all(),S.documentChanges.forEach(function(T){if(Ne.is(T)){var p=new q(T.edits,C._changeAnnotations);C._textEditChanges[T.textDocument.uri]=p}})):S.changes&&Object.keys(S.changes).forEach(function(T){var p=new q(S.changes[T]);C._textEditChanges[T]=p})):this._workspaceEdit={}}return Object.defineProperty(m.prototype,"edit",{get:function(){return this.initDocumentChanges(),this._changeAnnotations!==void 0&&(this._changeAnnotations.size===0?this._workspaceEdit.changeAnnotations=void 0:this._workspaceEdit.changeAnnotations=this._changeAnnotations.all()),this._workspaceEdit},enumerable:!1,configurable:!0}),m.prototype.getTextEditChange=function(S){if(J.is(S)){if(this.initDocumentChanges(),this._workspaceEdit.documentChanges===void 0)throw new Error("Workspace edit is not configured for document changes.");var C={uri:S.uri,version:S.version},T=this._textEditChanges[C.uri];if(!T){var p=[],w={textDocument:C,edits:p};this._workspaceEdit.documentChanges.push(w),T=new q(p,this._changeAnnotations),this._textEditChanges[C.uri]=T}return T}else{if(this.initChanges(),this._workspaceEdit.changes===void 0)throw new Error("Workspace edit is not configured for normal text edit changes.");var T=this._textEditChanges[S];if(!T){var p=[];this._workspaceEdit.changes[S]=p,T=new q(p),this._textEditChanges[S]=T}return T}},m.prototype.initDocumentChanges=function(){this._workspaceEdit.documentChanges===void 0&&this._workspaceEdit.changes===void 0&&(this._changeAnnotations=new F,this._workspaceEdit.documentChanges=[],this._workspaceEdit.changeAnnotations=this._changeAnnotations.all())},m.prototype.initChanges=function(){this._workspaceEdit.documentChanges===void 0&&this._workspaceEdit.changes===void 0&&(this._workspaceEdit.changes=Object.create(null))},m.prototype.createFile=function(S,C,T){if(this.initDocumentChanges(),this._workspaceEdit.documentChanges===void 0)throw new Error("Workspace edit is not configured for document changes.");var p;B.is(C)||ee.is(C)?p=C:T=C;var w,I;if(p===void 0?w=Je.create(S,T):(I=ee.is(p)?p:this._changeAnnotations.manage(p),w=Je.create(S,T,I)),this._workspaceEdit.documentChanges.push(w),I!==void 0)return I},m.prototype.renameFile=function(S,C,T,p){if(this.initDocumentChanges(),this._workspaceEdit.documentChanges===void 0)throw new Error("Workspace edit is not configured for document changes.");var w;B.is(T)||ee.is(T)?w=T:p=T;var I,ne;if(w===void 0?I=K.create(S,C,p):(ne=ee.is(w)?w:this._changeAnnotations.manage(w),I=K.create(S,C,p,ne)),this._workspaceEdit.documentChanges.push(I),ne!==void 0)return ne},m.prototype.deleteFile=function(S,C,T){if(this.initDocumentChanges(),this._workspaceEdit.documentChanges===void 0)throw new Error("Workspace edit is not configured for document changes.");var p;B.is(C)||ee.is(C)?p=C:T=C;var w,I;if(p===void 0?w=le.create(S,T):(I=ee.is(p)?p:this._changeAnnotations.manage(p),w=le.create(S,T,I)),this._workspaceEdit.documentChanges.push(w),I!==void 0)return I},m}();e.WorkspaceChange=W;var ie;(function(m){function S(T){return{uri:T}}m.create=S;function C(T){var p=T;return k.defined(p)&&k.string(p.uri)}m.is=C})(ie=e.TextDocumentIdentifier||(e.TextDocumentIdentifier={}));var oe;(function(m){function S(T,p){return{uri:T,version:p}}m.create=S;function C(T){var p=T;return k.defined(p)&&k.string(p.uri)&&k.integer(p.version)}m.is=C})(oe=e.VersionedTextDocumentIdentifier||(e.VersionedTextDocumentIdentifier={}));var J;(function(m){function S(T,p){return{uri:T,version:p}}m.create=S;function C(T){var p=T;return k.defined(p)&&k.string(p.uri)&&(p.version===null||k.integer(p.version))}m.is=C})(J=e.OptionalVersionedTextDocumentIdentifier||(e.OptionalVersionedTextDocumentIdentifier={}));var dt;(function(m){function S(T,p,w,I){return{uri:T,languageId:p,version:w,text:I}}m.create=S;function C(T){var p=T;return k.defined(p)&&k.string(p.uri)&&k.string(p.languageId)&&k.integer(p.version)&&k.string(p.text)}m.is=C})(dt=e.TextDocumentItem||(e.TextDocumentItem={}));var rt;(function(m){m.PlainText="plaintext",m.Markdown="markdown";function S(C){var T=C;return T===m.PlainText||T===m.Markdown}m.is=S})(rt=e.MarkupKind||(e.MarkupKind={}));var Dt;(function(m){function S(C){var T=C;return k.objectLiteral(C)&&rt.is(T.kind)&&k.string(T.value)}m.is=S})(Dt=e.MarkupContent||(e.MarkupContent={}));var tn;(function(m){m.Text=1,m.Method=2,m.Function=3,m.Constructor=4,m.Field=5,m.Variable=6,m.Class=7,m.Interface=8,m.Module=9,m.Property=10,m.Unit=11,m.Value=12,m.Enum=13,m.Keyword=14,m.Snippet=15,m.Color=16,m.File=17,m.Reference=18,m.Folder=19,m.EnumMember=20,m.Constant=21,m.Struct=22,m.Event=23,m.Operator=24,m.TypeParameter=25})(tn=e.CompletionItemKind||(e.CompletionItemKind={}));var Er;(function(m){m.PlainText=1,m.Snippet=2})(Er=e.InsertTextFormat||(e.InsertTextFormat={}));var ba;(function(m){m.Deprecated=1})(ba=e.CompletionItemTag||(e.CompletionItemTag={}));var ar;(function(m){function S(T,p,w){return{newText:T,insert:p,replace:w}}m.create=S;function C(T){var p=T;return p&&k.string(p.newText)&&s.is(p.insert)&&s.is(p.replace)}m.is=C})(ar=e.InsertReplaceEdit||(e.InsertReplaceEdit={}));var Aa;(function(m){m.asIs=1,m.adjustIndentation=2})(Aa=e.InsertTextMode||(e.InsertTextMode={}));var Pa;(function(m){function S(C){var T=C;return T&&(k.string(T.detail)||T.detail===void 0)&&(k.string(T.description)||T.description===void 0)}m.is=S})(Pa=e.CompletionItemLabelDetails||(e.CompletionItemLabelDetails={}));var Sa;(function(m){function S(C){return{label:C}}m.create=S})(Sa=e.CompletionItem||(e.CompletionItem={}));var vu;(function(m){function S(C,T){return{items:C||[],isIncomplete:!!T}}m.create=S})(vu=e.CompletionList||(e.CompletionList={}));var gt;(function(m){function S(T){return T.replace(/[\\`*_{}[\]()#+\-.!]/g,"\\$&")}m.fromPlainText=S;function C(T){var p=T;return k.string(p)||k.objectLiteral(p)&&k.string(p.language)&&k.string(p.value)}m.is=C})(gt=e.MarkedString||(e.MarkedString={}));var pi;(function(m){function S(C){var T=C;return!!T&&k.objectLiteral(T)&&(Dt.is(T.contents)||gt.is(T.contents)||k.typedArray(T.contents,gt.is))&&(C.range===void 0||s.is(C.range))}m.is=S})(pi=e.Hover||(e.Hover={}));var _u;(function(m){function S(C,T){return T?{label:C,documentation:T}:{label:C}}m.create=S})(_u=e.ParameterInformation||(e.ParameterInformation={}));var On;(function(m){function S(C,T){for(var p=[],w=2;w<arguments.length;w++)p[w-2]=arguments[w];var I={label:C};return k.defined(T)&&(I.documentation=T),k.defined(p)?I.parameters=p:I.parameters=[],I}m.create=S})(On=e.SignatureInformation||(e.SignatureInformation={}));var xo;(function(m){m.Text=1,m.Read=2,m.Write=3})(xo=e.DocumentHighlightKind||(e.DocumentHighlightKind={}));var Dn;(function(m){function S(C,T){var p={range:C};return k.number(T)&&(p.kind=T),p}m.create=S})(Dn=e.DocumentHighlight||(e.DocumentHighlight={}));var qo;(function(m){m.File=1,m.Module=2,m.Namespace=3,m.Package=4,m.Class=5,m.Method=6,m.Property=7,m.Field=8,m.Constructor=9,m.Enum=10,m.Interface=11,m.Function=12,m.Variable=13,m.Constant=14,m.String=15,m.Number=16,m.Boolean=17,m.Array=18,m.Object=19,m.Key=20,m.Null=21,m.EnumMember=22,m.Struct=23,m.Event=24,m.Operator=25,m.TypeParameter=26})(qo=e.SymbolKind||(e.SymbolKind={}));var Mr;(function(m){m.Deprecated=1})(Mr=e.SymbolTag||(e.SymbolTag={}));var rn;(function(m){function S(C,T,p,w,I){var ne={name:C,kind:T,location:{uri:w,range:p}};return I&&(ne.containerName=I),ne}m.create=S})(rn=e.SymbolInformation||(e.SymbolInformation={}));var Ca;(function(m){function S(C,T,p,w){return w!==void 0?{name:C,kind:T,location:{uri:p,range:w}}:{name:C,kind:T,location:{uri:p}}}m.create=S})(Ca=e.WorkspaceSymbol||(e.WorkspaceSymbol={}));var Ea;(function(m){function S(T,p,w,I,ne,ft){var Ke={name:T,detail:p,kind:w,range:I,selectionRange:ne};return ft!==void 0&&(Ke.children=ft),Ke}m.create=S;function C(T){var p=T;return p&&k.string(p.name)&&k.number(p.kind)&&s.is(p.range)&&s.is(p.selectionRange)&&(p.detail===void 0||k.string(p.detail))&&(p.deprecated===void 0||k.boolean(p.deprecated))&&(p.children===void 0||Array.isArray(p.children))&&(p.tags===void 0||Array.isArray(p.tags))}m.is=C})(Ea=e.DocumentSymbol||(e.DocumentSymbol={}));var Nr;(function(m){m.Empty="",m.QuickFix="quickfix",m.Refactor="refactor",m.RefactorExtract="refactor.extract",m.RefactorInline="refactor.inline",m.RefactorRewrite="refactor.rewrite",m.Source="source",m.SourceOrganizeImports="source.organizeImports",m.SourceFixAll="source.fixAll"})(Nr=e.CodeActionKind||(e.CodeActionKind={}));var In;(function(m){m.Invoked=1,m.Automatic=2})(In=e.CodeActionTriggerKind||(e.CodeActionTriggerKind={}));var Lt;(function(m){function S(T,p,w){var I={diagnostics:T};return p!=null&&(I.only=p),w!=null&&(I.triggerKind=w),I}m.create=S;function C(T){var p=T;return k.defined(p)&&k.typedArray(p.diagnostics,b.is)&&(p.only===void 0||k.typedArray(p.only,k.string))&&(p.triggerKind===void 0||p.triggerKind===In.Invoked||p.triggerKind===In.Automatic)}m.is=C})(Lt=e.CodeActionContext||(e.CodeActionContext={}));var nn;(function(m){function S(T,p,w){var I={title:T},ne=!0;return typeof p=="string"?(ne=!1,I.kind=p):O.is(p)?I.command=p:I.edit=p,ne&&w!==void 0&&(I.kind=w),I}m.create=S;function C(T){var p=T;return p&&k.string(p.title)&&(p.diagnostics===void 0||k.typedArray(p.diagnostics,b.is))&&(p.kind===void 0||k.string(p.kind))&&(p.edit!==void 0||p.command!==void 0)&&(p.command===void 0||O.is(p.command))&&(p.isPreferred===void 0||k.boolean(p.isPreferred))&&(p.edit===void 0||L.is(p.edit))}m.is=C})(nn=e.CodeAction||(e.CodeAction={}));var on;(function(m){function S(T,p){var w={range:T};return k.defined(p)&&(w.data=p),w}m.create=S;function C(T){var p=T;return k.defined(p)&&s.is(p.range)&&(k.undefined(p.command)||O.is(p.command))}m.is=C})(on=e.CodeLens||(e.CodeLens={}));var xn;(function(m){function S(T,p){return{tabSize:T,insertSpaces:p}}m.create=S;function C(T){var p=T;return k.defined(p)&&k.uinteger(p.tabSize)&&k.boolean(p.insertSpaces)}m.is=C})(xn=e.FormattingOptions||(e.FormattingOptions={}));var P;(function(m){function S(T,p,w){return{range:T,target:p,data:w}}m.create=S;function C(T){var p=T;return k.defined(p)&&s.is(p.range)&&(k.undefined(p.target)||k.string(p.target))}m.is=C})(P=e.DocumentLink||(e.DocumentLink={}));var x;(function(m){function S(T,p){return{range:T,parent:p}}m.create=S;function C(T){var p=T;return k.objectLiteral(p)&&s.is(p.range)&&(p.parent===void 0||m.is(p.parent))}m.is=C})(x=e.SelectionRange||(e.SelectionRange={}));var j;(function(m){m.namespace="namespace",m.type="type",m.class="class",m.enum="enum",m.interface="interface",m.struct="struct",m.typeParameter="typeParameter",m.parameter="parameter",m.variable="variable",m.property="property",m.enumMember="enumMember",m.event="event",m.function="function",m.method="method",m.macro="macro",m.keyword="keyword",m.modifier="modifier",m.comment="comment",m.string="string",m.number="number",m.regexp="regexp",m.operator="operator",m.decorator="decorator"})(j=e.SemanticTokenTypes||(e.SemanticTokenTypes={}));var z;(function(m){m.declaration="declaration",m.definition="definition",m.readonly="readonly",m.static="static",m.deprecated="deprecated",m.abstract="abstract",m.async="async",m.modification="modification",m.documentation="documentation",m.defaultLibrary="defaultLibrary"})(z=e.SemanticTokenModifiers||(e.SemanticTokenModifiers={}));var je;(function(m){function S(C){var T=C;return k.objectLiteral(T)&&(T.resultId===void 0||typeof T.resultId=="string")&&Array.isArray(T.data)&&(T.data.length===0||typeof T.data[0]=="number")}m.is=S})(je=e.SemanticTokens||(e.SemanticTokens={}));var Ue;(function(m){function S(T,p){return{range:T,text:p}}m.create=S;function C(T){var p=T;return p!=null&&s.is(p.range)&&k.string(p.text)}m.is=C})(Ue=e.InlineValueText||(e.InlineValueText={}));var nt;(function(m){function S(T,p,w){return{range:T,variableName:p,caseSensitiveLookup:w}}m.create=S;function C(T){var p=T;return p!=null&&s.is(p.range)&&k.boolean(p.caseSensitiveLookup)&&(k.string(p.variableName)||p.variableName===void 0)}m.is=C})(nt=e.InlineValueVariableLookup||(e.InlineValueVariableLookup={}));var Tt;(function(m){function S(T,p){return{range:T,expression:p}}m.create=S;function C(T){var p=T;return p!=null&&s.is(p.range)&&(k.string(p.expression)||p.expression===void 0)}m.is=C})(Tt=e.InlineValueEvaluatableExpression||(e.InlineValueEvaluatableExpression={}));var ge;(function(m){function S(T,p){return{frameId:T,stoppedLocation:p}}m.create=S;function C(T){var p=T;return k.defined(p)&&s.is(T.stoppedLocation)}m.is=C})(ge=e.InlineValueContext||(e.InlineValueContext={}));var Be;(function(m){m.Type=1,m.Parameter=2;function S(C){return C===1||C===2}m.is=S})(Be=e.InlayHintKind||(e.InlayHintKind={}));var _e;(function(m){function S(T){return{value:T}}m.create=S;function C(T){var p=T;return k.objectLiteral(p)&&(p.tooltip===void 0||k.string(p.tooltip)||Dt.is(p.tooltip))&&(p.location===void 0||u.is(p.location))&&(p.command===void 0||O.is(p.command))}m.is=C})(_e=e.InlayHintLabelPart||(e.InlayHintLabelPart={}));var yt;(function(m){function S(T,p,w){var I={position:T,label:p};return w!==void 0&&(I.kind=w),I}m.create=S;function C(T){var p=T;return k.objectLiteral(p)&&a.is(p.position)&&(k.string(p.label)||k.typedArray(p.label,_e.is))&&(p.kind===void 0||Be.is(p.kind))&&p.textEdits===void 0||k.typedArray(p.textEdits,$.is)&&(p.tooltip===void 0||k.string(p.tooltip)||Dt.is(p.tooltip))&&(p.paddingLeft===void 0||k.boolean(p.paddingLeft))&&(p.paddingRight===void 0||k.boolean(p.paddingRight))}m.is=C})(yt=e.InlayHint||(e.InlayHint={}));var Jt;(function(m){function S(C){var T=C;return k.objectLiteral(T)&&n.is(T.uri)&&k.string(T.name)}m.is=S})(Jt=e.WorkspaceFolder||(e.WorkspaceFolder={})),e.EOL=[`
`,`\r
`,"\r"];var hi;(function(m){function S(w,I,ne,ft){return new qn(w,I,ne,ft)}m.create=S;function C(w){var I=w;return!!(k.defined(I)&&k.string(I.uri)&&(k.undefined(I.languageId)||k.string(I.languageId))&&k.uinteger(I.lineCount)&&k.func(I.getText)&&k.func(I.positionAt)&&k.func(I.offsetAt))}m.is=C;function T(w,I){for(var ne=w.getText(),ft=p(I,function(Na,al){var RR=Na.range.start.line-al.range.start.line;return RR===0?Na.range.start.character-al.range.start.character:RR}),Ke=ne.length,an=ft.length-1;an>=0;an--){var sn=ft[an],mi=w.offsetAt(sn.range.start),ye=w.offsetAt(sn.range.end);if(ye<=Ke)ne=ne.substring(0,mi)+sn.newText+ne.substring(ye,ne.length);else throw new Error("Overlapping edit");Ke=mi}return ne}m.applyEdits=T;function p(w,I){if(w.length<=1)return w;var ne=w.length/2|0,ft=w.slice(0,ne),Ke=w.slice(ne);p(ft,I),p(Ke,I);for(var an=0,sn=0,mi=0;an<ft.length&&sn<Ke.length;){var ye=I(ft[an],Ke[sn]);ye<=0?w[mi++]=ft[an++]:w[mi++]=Ke[sn++]}for(;an<ft.length;)w[mi++]=ft[an++];for(;sn<Ke.length;)w[mi++]=Ke[sn++];return w}})(hi=e.TextDocument||(e.TextDocument={}));var qn=function(){function m(S,C,T,p){this._uri=S,this._languageId=C,this._version=T,this._content=p,this._lineOffsets=void 0}return Object.defineProperty(m.prototype,"uri",{get:function(){return this._uri},enumerable:!1,configurable:!0}),Object.defineProperty(m.prototype,"languageId",{get:function(){return this._languageId},enumerable:!1,configurable:!0}),Object.defineProperty(m.prototype,"version",{get:function(){return this._version},enumerable:!1,configurable:!0}),m.prototype.getText=function(S){if(S){var C=this.offsetAt(S.start),T=this.offsetAt(S.end);return this._content.substring(C,T)}return this._content},m.prototype.update=function(S,C){this._content=S.text,this._version=C,this._lineOffsets=void 0},m.prototype.getLineOffsets=function(){if(this._lineOffsets===void 0){for(var S=[],C=this._content,T=!0,p=0;p<C.length;p++){T&&(S.push(p),T=!1);var w=C.charAt(p);T=w==="\r"||w===`
`,w==="\r"&&p+1<C.length&&C.charAt(p+1)===`
`&&p++}T&&C.length>0&&S.push(C.length),this._lineOffsets=S}return this._lineOffsets},m.prototype.positionAt=function(S){S=Math.max(Math.min(S,this._content.length),0);var C=this.getLineOffsets(),T=0,p=C.length;if(p===0)return a.create(0,S);for(;T<p;){var w=Math.floor((T+p)/2);C[w]>S?p=w:T=w+1}var I=T-1;return a.create(I,S-C[I])},m.prototype.offsetAt=function(S){var C=this.getLineOffsets();if(S.line>=C.length)return this._content.length;if(S.line<0)return 0;var T=C[S.line],p=S.line+1<C.length?C[S.line+1]:this._content.length;return Math.max(Math.min(T+S.character,p),T)},Object.defineProperty(m.prototype,"lineCount",{get:function(){return this.getLineOffsets().length},enumerable:!1,configurable:!0}),m}(),k;(function(m){var S=Object.prototype.toString;function C(ye){return typeof ye<"u"}m.defined=C;function T(ye){return typeof ye>"u"}m.undefined=T;function p(ye){return ye===!0||ye===!1}m.boolean=p;function w(ye){return S.call(ye)==="[object String]"}m.string=w;function I(ye){return S.call(ye)==="[object Number]"}m.number=I;function ne(ye,Na,al){return S.call(ye)==="[object Number]"&&Na<=ye&&ye<=al}m.numberRange=ne;function ft(ye){return S.call(ye)==="[object Number]"&&-2147483648<=ye&&ye<=2147483647}m.integer=ft;function Ke(ye){return S.call(ye)==="[object Number]"&&0<=ye&&ye<=2147483647}m.uinteger=Ke;function an(ye){return S.call(ye)==="[object Function]"}m.func=an;function sn(ye){return ye!==null&&typeof ye=="object"}m.objectLiteral=sn;function mi(ye,Na){return Array.isArray(ye)&&ye.every(Na)}m.typedArray=mi})(k||(k={}))})});var ct=f(ur=>{"use strict";Object.defineProperty(ur,"__esModule",{value:!0});ur.ProtocolNotificationType=ur.ProtocolNotificationType0=ur.ProtocolRequestType=ur.ProtocolRequestType0=ur.RegistrationType=ur.MessageDirection=void 0;var La=Ti(),E$;(function(t){t.clientToServer="clientToServer",t.serverToClient="serverToClient",t.both="both"})(E$=ur.MessageDirection||(ur.MessageDirection={}));var vm=class{constructor(e){this.method=e}};ur.RegistrationType=vm;var _m=class extends La.RequestType0{constructor(e){super(e)}};ur.ProtocolRequestType0=_m;var Tm=class extends La.RequestType{constructor(e){super(e,La.ParameterStructures.byName)}};ur.ProtocolRequestType=Tm;var Rm=class extends La.NotificationType0{constructor(e){super(e)}};ur.ProtocolNotificationType0=Rm;var bm=class extends La.NotificationType{constructor(e){super(e,La.ParameterStructures.byName)}};ur.ProtocolNotificationType=bm});var ml=f(Rt=>{"use strict";Object.defineProperty(Rt,"__esModule",{value:!0});Rt.objectLiteral=Rt.typedArray=Rt.stringArray=Rt.array=Rt.func=Rt.error=Rt.number=Rt.string=Rt.boolean=void 0;function N$(t){return t===!0||t===!1}Rt.boolean=N$;function VR(t){return typeof t=="string"||t instanceof String}Rt.string=VR;function k$(t){return typeof t=="number"||t instanceof Number}Rt.number=k$;function w$(t){return t instanceof Error}Rt.error=w$;function O$(t){return typeof t=="function"}Rt.func=O$;function YR(t){return Array.isArray(t)}Rt.array=YR;function D$(t){return YR(t)&&t.every(e=>VR(e))}Rt.stringArray=D$;function I$(t,e){return Array.isArray(t)&&t.every(e)}Rt.typedArray=I$;function x$(t){return t!==null&&typeof t=="object"}Rt.objectLiteral=x$});var JR=f(Cu=>{"use strict";Object.defineProperty(Cu,"__esModule",{value:!0});Cu.ImplementationRequest=void 0;var XR=ct(),q$;(function(t){t.method="textDocument/implementation",t.messageDirection=XR.MessageDirection.clientToServer,t.type=new XR.ProtocolRequestType(t.method)})(q$=Cu.ImplementationRequest||(Cu.ImplementationRequest={}))});var ZR=f(Eu=>{"use strict";Object.defineProperty(Eu,"__esModule",{value:!0});Eu.TypeDefinitionRequest=void 0;var QR=ct(),L$;(function(t){t.method="textDocument/typeDefinition",t.messageDirection=QR.MessageDirection.clientToServer,t.type=new QR.ProtocolRequestType(t.method)})(L$=Eu.TypeDefinitionRequest||(Eu.TypeDefinitionRequest={}))});var e0=f(zi=>{"use strict";Object.defineProperty(zi,"__esModule",{value:!0});zi.DidChangeWorkspaceFoldersNotification=zi.WorkspaceFoldersRequest=void 0;var gl=ct(),M$;(function(t){t.method="workspace/workspaceFolders",t.messageDirection=gl.MessageDirection.serverToClient,t.type=new gl.ProtocolRequestType0(t.method)})(M$=zi.WorkspaceFoldersRequest||(zi.WorkspaceFoldersRequest={}));var $$;(function(t){t.method="workspace/didChangeWorkspaceFolders",t.messageDirection=gl.MessageDirection.clientToServer,t.type=new gl.ProtocolNotificationType(t.method)})($$=zi.DidChangeWorkspaceFoldersNotification||(zi.DidChangeWorkspaceFoldersNotification={}))});var r0=f(Nu=>{"use strict";Object.defineProperty(Nu,"__esModule",{value:!0});Nu.ConfigurationRequest=void 0;var t0=ct(),F$;(function(t){t.method="workspace/configuration",t.messageDirection=t0.MessageDirection.serverToClient,t.type=new t0.ProtocolRequestType(t.method)})(F$=Nu.ConfigurationRequest||(Nu.ConfigurationRequest={}))});var n0=f(Vi=>{"use strict";Object.defineProperty(Vi,"__esModule",{value:!0});Vi.ColorPresentationRequest=Vi.DocumentColorRequest=void 0;var yl=ct(),j$;(function(t){t.method="textDocument/documentColor",t.messageDirection=yl.MessageDirection.clientToServer,t.type=new yl.ProtocolRequestType(t.method)})(j$=Vi.DocumentColorRequest||(Vi.DocumentColorRequest={}));var U$;(function(t){t.method="textDocument/colorPresentation",t.messageDirection=yl.MessageDirection.clientToServer,t.type=new yl.ProtocolRequestType(t.method)})(U$=Vi.ColorPresentationRequest||(Vi.ColorPresentationRequest={}))});var o0=f(ku=>{"use strict";Object.defineProperty(ku,"__esModule",{value:!0});ku.FoldingRangeRequest=void 0;var i0=ct(),G$;(function(t){t.method="textDocument/foldingRange",t.messageDirection=i0.MessageDirection.clientToServer,t.type=new i0.ProtocolRequestType(t.method)})(G$=ku.FoldingRangeRequest||(ku.FoldingRangeRequest={}))});var s0=f(wu=>{"use strict";Object.defineProperty(wu,"__esModule",{value:!0});wu.DeclarationRequest=void 0;var a0=ct(),H$;(function(t){t.method="textDocument/declaration",t.messageDirection=a0.MessageDirection.clientToServer,t.type=new a0.ProtocolRequestType(t.method)})(H$=wu.DeclarationRequest||(wu.DeclarationRequest={}))});var c0=f(Ou=>{"use strict";Object.defineProperty(Ou,"__esModule",{value:!0});Ou.SelectionRangeRequest=void 0;var u0=ct(),W$;(function(t){t.method="textDocument/selectionRange",t.messageDirection=u0.MessageDirection.clientToServer,t.type=new u0.ProtocolRequestType(t.method)})(W$=Ou.SelectionRangeRequest||(Ou.SelectionRangeRequest={}))});var l0=f(ln=>{"use strict";Object.defineProperty(ln,"__esModule",{value:!0});ln.WorkDoneProgressCancelNotification=ln.WorkDoneProgressCreateRequest=ln.WorkDoneProgress=void 0;var B$=Ti(),vl=ct(),K$;(function(t){t.type=new B$.ProgressType;function e(r){return r===t.type}t.is=e})(K$=ln.WorkDoneProgress||(ln.WorkDoneProgress={}));var z$;(function(t){t.method="window/workDoneProgress/create",t.messageDirection=vl.MessageDirection.serverToClient,t.type=new vl.ProtocolRequestType(t.method)})(z$=ln.WorkDoneProgressCreateRequest||(ln.WorkDoneProgressCreateRequest={}));var V$;(function(t){t.method="window/workDoneProgress/cancel",t.messageDirection=vl.MessageDirection.clientToServer,t.type=new vl.ProtocolNotificationType(t.method)})(V$=ln.WorkDoneProgressCancelNotification||(ln.WorkDoneProgressCancelNotification={}))});var d0=f(dn=>{"use strict";Object.defineProperty(dn,"__esModule",{value:!0});dn.CallHierarchyOutgoingCallsRequest=dn.CallHierarchyIncomingCallsRequest=dn.CallHierarchyPrepareRequest=void 0;var Ma=ct(),Y$;(function(t){t.method="textDocument/prepareCallHierarchy",t.messageDirection=Ma.MessageDirection.clientToServer,t.type=new Ma.ProtocolRequestType(t.method)})(Y$=dn.CallHierarchyPrepareRequest||(dn.CallHierarchyPrepareRequest={}));var X$;(function(t){t.method="callHierarchy/incomingCalls",t.messageDirection=Ma.MessageDirection.clientToServer,t.type=new Ma.ProtocolRequestType(t.method)})(X$=dn.CallHierarchyIncomingCallsRequest||(dn.CallHierarchyIncomingCallsRequest={}));var J$;(function(t){t.method="callHierarchy/outgoingCalls",t.messageDirection=Ma.MessageDirection.clientToServer,t.type=new Ma.ProtocolRequestType(t.method)})(J$=dn.CallHierarchyOutgoingCallsRequest||(dn.CallHierarchyOutgoingCallsRequest={}))});var f0=f(bt=>{"use strict";Object.defineProperty(bt,"__esModule",{value:!0});bt.SemanticTokensRefreshRequest=bt.SemanticTokensRangeRequest=bt.SemanticTokensDeltaRequest=bt.SemanticTokensRequest=bt.SemanticTokensRegistrationType=bt.TokenFormat=void 0;var Ri=ct(),Q$;(function(t){t.Relative="relative"})(Q$=bt.TokenFormat||(bt.TokenFormat={}));var _l;(function(t){t.method="textDocument/semanticTokens",t.type=new Ri.RegistrationType(t.method)})(_l=bt.SemanticTokensRegistrationType||(bt.SemanticTokensRegistrationType={}));var Z$;(function(t){t.method="textDocument/semanticTokens/full",t.messageDirection=Ri.MessageDirection.clientToServer,t.type=new Ri.ProtocolRequestType(t.method),t.registrationMethod=_l.method})(Z$=bt.SemanticTokensRequest||(bt.SemanticTokensRequest={}));var eF;(function(t){t.method="textDocument/semanticTokens/full/delta",t.messageDirection=Ri.MessageDirection.clientToServer,t.type=new Ri.ProtocolRequestType(t.method),t.registrationMethod=_l.method})(eF=bt.SemanticTokensDeltaRequest||(bt.SemanticTokensDeltaRequest={}));var tF;(function(t){t.method="textDocument/semanticTokens/range",t.messageDirection=Ri.MessageDirection.clientToServer,t.type=new Ri.ProtocolRequestType(t.method),t.registrationMethod=_l.method})(tF=bt.SemanticTokensRangeRequest||(bt.SemanticTokensRangeRequest={}));var rF;(function(t){t.method="workspace/semanticTokens/refresh",t.messageDirection=Ri.MessageDirection.clientToServer,t.type=new Ri.ProtocolRequestType0(t.method)})(rF=bt.SemanticTokensRefreshRequest||(bt.SemanticTokensRefreshRequest={}))});var h0=f(Du=>{"use strict";Object.defineProperty(Du,"__esModule",{value:!0});Du.ShowDocumentRequest=void 0;var p0=ct(),nF;(function(t){t.method="window/showDocument",t.messageDirection=p0.MessageDirection.serverToClient,t.type=new p0.ProtocolRequestType(t.method)})(nF=Du.ShowDocumentRequest||(Du.ShowDocumentRequest={}))});var g0=f(Iu=>{"use strict";Object.defineProperty(Iu,"__esModule",{value:!0});Iu.LinkedEditingRangeRequest=void 0;var m0=ct(),iF;(function(t){t.method="textDocument/linkedEditingRange",t.messageDirection=m0.MessageDirection.clientToServer,t.type=new m0.ProtocolRequestType(t.method)})(iF=Iu.LinkedEditingRangeRequest||(Iu.LinkedEditingRangeRequest={}))});var y0=f(lt=>{"use strict";Object.defineProperty(lt,"__esModule",{value:!0});lt.WillDeleteFilesRequest=lt.DidDeleteFilesNotification=lt.DidRenameFilesNotification=lt.WillRenameFilesRequest=lt.DidCreateFilesNotification=lt.WillCreateFilesRequest=lt.FileOperationPatternKind=void 0;var $r=ct(),oF;(function(t){t.file="file",t.folder="folder"})(oF=lt.FileOperationPatternKind||(lt.FileOperationPatternKind={}));var aF;(function(t){t.method="workspace/willCreateFiles",t.messageDirection=$r.MessageDirection.clientToServer,t.type=new $r.ProtocolRequestType(t.method)})(aF=lt.WillCreateFilesRequest||(lt.WillCreateFilesRequest={}));var sF;(function(t){t.method="workspace/didCreateFiles",t.messageDirection=$r.MessageDirection.clientToServer,t.type=new $r.ProtocolNotificationType(t.method)})(sF=lt.DidCreateFilesNotification||(lt.DidCreateFilesNotification={}));var uF;(function(t){t.method="workspace/willRenameFiles",t.messageDirection=$r.MessageDirection.clientToServer,t.type=new $r.ProtocolRequestType(t.method)})(uF=lt.WillRenameFilesRequest||(lt.WillRenameFilesRequest={}));var cF;(function(t){t.method="workspace/didRenameFiles",t.messageDirection=$r.MessageDirection.clientToServer,t.type=new $r.ProtocolNotificationType(t.method)})(cF=lt.DidRenameFilesNotification||(lt.DidRenameFilesNotification={}));var lF;(function(t){t.method="workspace/didDeleteFiles",t.messageDirection=$r.MessageDirection.clientToServer,t.type=new $r.ProtocolNotificationType(t.method)})(lF=lt.DidDeleteFilesNotification||(lt.DidDeleteFilesNotification={}));var dF;(function(t){t.method="workspace/willDeleteFiles",t.messageDirection=$r.MessageDirection.clientToServer,t.type=new $r.ProtocolRequestType(t.method)})(dF=lt.WillDeleteFilesRequest||(lt.WillDeleteFilesRequest={}))});var _0=f(fn=>{"use strict";Object.defineProperty(fn,"__esModule",{value:!0});fn.MonikerRequest=fn.MonikerKind=fn.UniquenessLevel=void 0;var v0=ct(),fF;(function(t){t.document="document",t.project="project",t.group="group",t.scheme="scheme",t.global="global"})(fF=fn.UniquenessLevel||(fn.UniquenessLevel={}));var pF;(function(t){t.$import="import",t.$export="export",t.local="local"})(pF=fn.MonikerKind||(fn.MonikerKind={}));var hF;(function(t){t.method="textDocument/moniker",t.messageDirection=v0.MessageDirection.clientToServer,t.type=new v0.ProtocolRequestType(t.method)})(hF=fn.MonikerRequest||(fn.MonikerRequest={}))});var T0=f(pn=>{"use strict";Object.defineProperty(pn,"__esModule",{value:!0});pn.TypeHierarchySubtypesRequest=pn.TypeHierarchySupertypesRequest=pn.TypeHierarchyPrepareRequest=void 0;var $a=ct(),mF;(function(t){t.method="textDocument/prepareTypeHierarchy",t.messageDirection=$a.MessageDirection.clientToServer,t.type=new $a.ProtocolRequestType(t.method)})(mF=pn.TypeHierarchyPrepareRequest||(pn.TypeHierarchyPrepareRequest={}));var gF;(function(t){t.method="typeHierarchy/supertypes",t.messageDirection=$a.MessageDirection.clientToServer,t.type=new $a.ProtocolRequestType(t.method)})(gF=pn.TypeHierarchySupertypesRequest||(pn.TypeHierarchySupertypesRequest={}));var yF;(function(t){t.method="typeHierarchy/subtypes",t.messageDirection=$a.MessageDirection.clientToServer,t.type=new $a.ProtocolRequestType(t.method)})(yF=pn.TypeHierarchySubtypesRequest||(pn.TypeHierarchySubtypesRequest={}))});var R0=f(Yi=>{"use strict";Object.defineProperty(Yi,"__esModule",{value:!0});Yi.InlineValueRefreshRequest=Yi.InlineValueRequest=void 0;var Tl=ct(),vF;(function(t){t.method="textDocument/inlineValue",t.messageDirection=Tl.MessageDirection.clientToServer,t.type=new Tl.ProtocolRequestType(t.method)})(vF=Yi.InlineValueRequest||(Yi.InlineValueRequest={}));var _F;(function(t){t.method="workspace/inlineValue/refresh",t.messageDirection=Tl.MessageDirection.clientToServer,t.type=new Tl.ProtocolRequestType0(t.method)})(_F=Yi.InlineValueRefreshRequest||(Yi.InlineValueRefreshRequest={}))});var b0=f(hn=>{"use strict";Object.defineProperty(hn,"__esModule",{value:!0});hn.InlayHintRefreshRequest=hn.InlayHintResolveRequest=hn.InlayHintRequest=void 0;var Fa=ct(),TF;(function(t){t.method="textDocument/inlayHint",t.messageDirection=Fa.MessageDirection.clientToServer,t.type=new Fa.ProtocolRequestType(t.method)})(TF=hn.InlayHintRequest||(hn.InlayHintRequest={}));var RF;(function(t){t.method="inlayHint/resolve",t.messageDirection=Fa.MessageDirection.clientToServer,t.type=new Fa.ProtocolRequestType(t.method)})(RF=hn.InlayHintResolveRequest||(hn.InlayHintResolveRequest={}));var bF;(function(t){t.method="workspace/inlayHint/refresh",t.messageDirection=Fa.MessageDirection.clientToServer,t.type=new Fa.ProtocolRequestType0(t.method)})(bF=hn.InlayHintRefreshRequest||(hn.InlayHintRefreshRequest={}))});var P0=f(Bt=>{"use strict";Object.defineProperty(Bt,"__esModule",{value:!0});Bt.DiagnosticRefreshRequest=Bt.WorkspaceDiagnosticRequest=Bt.DocumentDiagnosticRequest=Bt.DocumentDiagnosticReportKind=Bt.DiagnosticServerCancellationData=void 0;var A0=Ti(),AF=ml(),ja=ct(),PF;(function(t){function e(r){let n=r;return n&&AF.boolean(n.retriggerRequest)}t.is=e})(PF=Bt.DiagnosticServerCancellationData||(Bt.DiagnosticServerCancellationData={}));var SF;(function(t){t.Full="full",t.Unchanged="unchanged"})(SF=Bt.DocumentDiagnosticReportKind||(Bt.DocumentDiagnosticReportKind={}));var CF;(function(t){t.method="textDocument/diagnostic",t.messageDirection=ja.MessageDirection.clientToServer,t.type=new ja.ProtocolRequestType(t.method),t.partialResult=new A0.ProgressType})(CF=Bt.DocumentDiagnosticRequest||(Bt.DocumentDiagnosticRequest={}));var EF;(function(t){t.method="workspace/diagnostic",t.messageDirection=ja.MessageDirection.clientToServer,t.type=new ja.ProtocolRequestType(t.method),t.partialResult=new A0.ProgressType})(EF=Bt.WorkspaceDiagnosticRequest||(Bt.WorkspaceDiagnosticRequest={}));var NF;(function(t){t.method="workspace/diagnostic/refresh",t.messageDirection=ja.MessageDirection.clientToServer,t.type=new ja.ProtocolRequestType0(t.method)})(NF=Bt.DiagnosticRefreshRequest||(Bt.DiagnosticRefreshRequest={}))});var E0=f(Re=>{"use strict";Object.defineProperty(Re,"__esModule",{value:!0});Re.DidCloseNotebookDocumentNotification=Re.DidSaveNotebookDocumentNotification=Re.DidChangeNotebookDocumentNotification=Re.NotebookCellArrayChange=Re.DidOpenNotebookDocumentNotification=Re.NotebookDocumentSyncRegistrationType=Re.NotebookDocument=Re.NotebookCell=Re.ExecutionSummary=Re.NotebookCellKind=void 0;var xu=qa(),mn=ml(),Ln=ct(),S0;(function(t){t.Markup=1,t.Code=2;function e(r){return r===1||r===2}t.is=e})(S0=Re.NotebookCellKind||(Re.NotebookCellKind={}));var C0;(function(t){function e(i,o){let a={executionOrder:i};return(o===!0||o===!1)&&(a.success=o),a}t.create=e;function r(i){let o=i;return mn.objectLiteral(o)&&xu.uinteger.is(o.executionOrder)&&(o.success===void 0||mn.boolean(o.success))}t.is=r;function n(i,o){return i===o?!0:i==null||o===null||o===void 0?!1:i.executionOrder===o.executionOrder&&i.success===o.success}t.equals=n})(C0=Re.ExecutionSummary||(Re.ExecutionSummary={}));var Am;(function(t){function e(o,a){return{kind:o,document:a}}t.create=e;function r(o){let a=o;return mn.objectLiteral(a)&&S0.is(a.kind)&&xu.DocumentUri.is(a.document)&&(a.metadata===void 0||mn.objectLiteral(a.metadata))}t.is=r;function n(o,a){let s=new Set;return o.document!==a.document&&s.add("document"),o.kind!==a.kind&&s.add("kind"),o.executionSummary!==a.executionSummary&&s.add("executionSummary"),(o.metadata!==void 0||a.metadata!==void 0)&&!i(o.metadata,a.metadata)&&s.add("metadata"),(o.executionSummary!==void 0||a.executionSummary!==void 0)&&!C0.equals(o.executionSummary,a.executionSummary)&&s.add("executionSummary"),s}t.diff=n;function i(o,a){if(o===a)return!0;if(o==null||a===null||a===void 0||typeof o!=typeof a||typeof o!="object")return!1;let s=Array.isArray(o),u=Array.isArray(a);if(s!==u)return!1;if(s&&u){if(o.length!==a.length)return!1;for(let c=0;c<o.length;c++)if(!i(o[c],a[c]))return!1}if(mn.objectLiteral(o)&&mn.objectLiteral(a)){let c=Object.keys(o),l=Object.keys(a);if(c.length!==l.length||(c.sort(),l.sort(),!i(c,l)))return!1;for(let d=0;d<c.length;d++){let h=c[d];if(!i(o[h],a[h]))return!1}}return!0}})(Am=Re.NotebookCell||(Re.NotebookCell={}));var kF;(function(t){function e(n,i,o,a){return{uri:n,notebookType:i,version:o,cells:a}}t.create=e;function r(n){let i=n;return mn.objectLiteral(i)&&mn.string(i.uri)&&xu.integer.is(i.version)&&mn.typedArray(i.cells,Am.is)}t.is=r})(kF=Re.NotebookDocument||(Re.NotebookDocument={}));var qu;(function(t){t.method="notebookDocument/sync",t.messageDirection=Ln.MessageDirection.clientToServer,t.type=new Ln.RegistrationType(t.method)})(qu=Re.NotebookDocumentSyncRegistrationType||(Re.NotebookDocumentSyncRegistrationType={}));var wF;(function(t){t.method="notebookDocument/didOpen",t.messageDirection=Ln.MessageDirection.clientToServer,t.type=new Ln.ProtocolNotificationType(t.method),t.registrationMethod=qu.method})(wF=Re.DidOpenNotebookDocumentNotification||(Re.DidOpenNotebookDocumentNotification={}));var OF;(function(t){function e(n){let i=n;return mn.objectLiteral(i)&&xu.uinteger.is(i.start)&&xu.uinteger.is(i.deleteCount)&&(i.cells===void 0||mn.typedArray(i.cells,Am.is))}t.is=e;function r(n,i,o){let a={start:n,deleteCount:i};return o!==void 0&&(a.cells=o),a}t.create=r})(OF=Re.NotebookCellArrayChange||(Re.NotebookCellArrayChange={}));var DF;(function(t){t.method="notebookDocument/didChange",t.messageDirection=Ln.MessageDirection.clientToServer,t.type=new Ln.ProtocolNotificationType(t.method),t.registrationMethod=qu.method})(DF=Re.DidChangeNotebookDocumentNotification||(Re.DidChangeNotebookDocumentNotification={}));var IF;(function(t){t.method="notebookDocument/didSave",t.messageDirection=Ln.MessageDirection.clientToServer,t.type=new Ln.ProtocolNotificationType(t.method),t.registrationMethod=qu.method})(IF=Re.DidSaveNotebookDocumentNotification||(Re.DidSaveNotebookDocumentNotification={}));var xF;(function(t){t.method="notebookDocument/didClose",t.messageDirection=Ln.MessageDirection.clientToServer,t.type=new Ln.ProtocolNotificationType(t.method),t.registrationMethod=qu.method})(xF=Re.DidCloseNotebookDocumentNotification||(Re.DidCloseNotebookDocumentNotification={}))});var L0=f(y=>{"use strict";Object.defineProperty(y,"__esModule",{value:!0});y.WorkspaceSymbolRequest=y.CodeActionResolveRequest=y.CodeActionRequest=y.DocumentSymbolRequest=y.DocumentHighlightRequest=y.ReferencesRequest=y.DefinitionRequest=y.SignatureHelpRequest=y.SignatureHelpTriggerKind=y.HoverRequest=y.CompletionResolveRequest=y.CompletionRequest=y.CompletionTriggerKind=y.PublishDiagnosticsNotification=y.WatchKind=y.RelativePattern=y.FileChangeType=y.DidChangeWatchedFilesNotification=y.WillSaveTextDocumentWaitUntilRequest=y.WillSaveTextDocumentNotification=y.TextDocumentSaveReason=y.DidSaveTextDocumentNotification=y.DidCloseTextDocumentNotification=y.DidChangeTextDocumentNotification=y.TextDocumentContentChangeEvent=y.DidOpenTextDocumentNotification=y.TextDocumentSyncKind=y.TelemetryEventNotification=y.LogMessageNotification=y.ShowMessageRequest=y.ShowMessageNotification=y.MessageType=y.DidChangeConfigurationNotification=y.ExitNotification=y.ShutdownRequest=y.InitializedNotification=y.InitializeErrorCodes=y.InitializeRequest=y.WorkDoneProgressOptions=y.TextDocumentRegistrationOptions=y.StaticRegistrationOptions=y.PositionEncodingKind=y.FailureHandlingKind=y.ResourceOperationKind=y.UnregistrationRequest=y.RegistrationRequest=y.DocumentSelector=y.NotebookCellTextDocumentFilter=y.NotebookDocumentFilter=y.TextDocumentFilter=void 0;y.TypeHierarchySubtypesRequest=y.TypeHierarchyPrepareRequest=y.MonikerRequest=y.MonikerKind=y.UniquenessLevel=y.WillDeleteFilesRequest=y.DidDeleteFilesNotification=y.WillRenameFilesRequest=y.DidRenameFilesNotification=y.WillCreateFilesRequest=y.DidCreateFilesNotification=y.FileOperationPatternKind=y.LinkedEditingRangeRequest=y.ShowDocumentRequest=y.SemanticTokensRegistrationType=y.SemanticTokensRefreshRequest=y.SemanticTokensRangeRequest=y.SemanticTokensDeltaRequest=y.SemanticTokensRequest=y.TokenFormat=y.CallHierarchyPrepareRequest=y.CallHierarchyOutgoingCallsRequest=y.CallHierarchyIncomingCallsRequest=y.WorkDoneProgressCancelNotification=y.WorkDoneProgressCreateRequest=y.WorkDoneProgress=y.SelectionRangeRequest=y.DeclarationRequest=y.FoldingRangeRequest=y.ColorPresentationRequest=y.DocumentColorRequest=y.ConfigurationRequest=y.DidChangeWorkspaceFoldersNotification=y.WorkspaceFoldersRequest=y.TypeDefinitionRequest=y.ImplementationRequest=y.ApplyWorkspaceEditRequest=y.ExecuteCommandRequest=y.PrepareRenameRequest=y.RenameRequest=y.PrepareSupportDefaultBehavior=y.DocumentOnTypeFormattingRequest=y.DocumentRangeFormattingRequest=y.DocumentFormattingRequest=y.DocumentLinkResolveRequest=y.DocumentLinkRequest=y.CodeLensRefreshRequest=y.CodeLensResolveRequest=y.CodeLensRequest=y.WorkspaceSymbolResolveRequest=void 0;y.DidCloseNotebookDocumentNotification=y.DidSaveNotebookDocumentNotification=y.DidChangeNotebookDocumentNotification=y.NotebookCellArrayChange=y.DidOpenNotebookDocumentNotification=y.NotebookDocumentSyncRegistrationType=y.NotebookDocument=y.NotebookCell=y.ExecutionSummary=y.NotebookCellKind=y.DiagnosticRefreshRequest=y.WorkspaceDiagnosticRequest=y.DocumentDiagnosticRequest=y.DocumentDiagnosticReportKind=y.DiagnosticServerCancellationData=y.InlayHintRefreshRequest=y.InlayHintResolveRequest=y.InlayHintRequest=y.InlineValueRefreshRequest=y.InlineValueRequest=y.TypeHierarchySupertypesRequest=void 0;var M=ct(),N0=qa(),Kt=ml(),qF=JR();Object.defineProperty(y,"ImplementationRequest",{enumerable:!0,get:function(){return qF.ImplementationRequest}});var LF=ZR();Object.defineProperty(y,"TypeDefinitionRequest",{enumerable:!0,get:function(){return LF.TypeDefinitionRequest}});var k0=e0();Object.defineProperty(y,"WorkspaceFoldersRequest",{enumerable:!0,get:function(){return k0.WorkspaceFoldersRequest}});Object.defineProperty(y,"DidChangeWorkspaceFoldersNotification",{enumerable:!0,get:function(){return k0.DidChangeWorkspaceFoldersNotification}});var MF=r0();Object.defineProperty(y,"ConfigurationRequest",{enumerable:!0,get:function(){return MF.ConfigurationRequest}});var w0=n0();Object.defineProperty(y,"DocumentColorRequest",{enumerable:!0,get:function(){return w0.DocumentColorRequest}});Object.defineProperty(y,"ColorPresentationRequest",{enumerable:!0,get:function(){return w0.ColorPresentationRequest}});var $F=o0();Object.defineProperty(y,"FoldingRangeRequest",{enumerable:!0,get:function(){return $F.FoldingRangeRequest}});var FF=s0();Object.defineProperty(y,"DeclarationRequest",{enumerable:!0,get:function(){return FF.DeclarationRequest}});var jF=c0();Object.defineProperty(y,"SelectionRangeRequest",{enumerable:!0,get:function(){return jF.SelectionRangeRequest}});var Pm=l0();Object.defineProperty(y,"WorkDoneProgress",{enumerable:!0,get:function(){return Pm.WorkDoneProgress}});Object.defineProperty(y,"WorkDoneProgressCreateRequest",{enumerable:!0,get:function(){return Pm.WorkDoneProgressCreateRequest}});Object.defineProperty(y,"WorkDoneProgressCancelNotification",{enumerable:!0,get:function(){return Pm.WorkDoneProgressCancelNotification}});var Sm=d0();Object.defineProperty(y,"CallHierarchyIncomingCallsRequest",{enumerable:!0,get:function(){return Sm.CallHierarchyIncomingCallsRequest}});Object.defineProperty(y,"CallHierarchyOutgoingCallsRequest",{enumerable:!0,get:function(){return Sm.CallHierarchyOutgoingCallsRequest}});Object.defineProperty(y,"CallHierarchyPrepareRequest",{enumerable:!0,get:function(){return Sm.CallHierarchyPrepareRequest}});var Ua=f0();Object.defineProperty(y,"TokenFormat",{enumerable:!0,get:function(){return Ua.TokenFormat}});Object.defineProperty(y,"SemanticTokensRequest",{enumerable:!0,get:function(){return Ua.SemanticTokensRequest}});Object.defineProperty(y,"SemanticTokensDeltaRequest",{enumerable:!0,get:function(){return Ua.SemanticTokensDeltaRequest}});Object.defineProperty(y,"SemanticTokensRangeRequest",{enumerable:!0,get:function(){return Ua.SemanticTokensRangeRequest}});Object.defineProperty(y,"SemanticTokensRefreshRequest",{enumerable:!0,get:function(){return Ua.SemanticTokensRefreshRequest}});Object.defineProperty(y,"SemanticTokensRegistrationType",{enumerable:!0,get:function(){return Ua.SemanticTokensRegistrationType}});var UF=h0();Object.defineProperty(y,"ShowDocumentRequest",{enumerable:!0,get:function(){return UF.ShowDocumentRequest}});var GF=g0();Object.defineProperty(y,"LinkedEditingRangeRequest",{enumerable:!0,get:function(){return GF.LinkedEditingRangeRequest}});var jo=y0();Object.defineProperty(y,"FileOperationPatternKind",{enumerable:!0,get:function(){return jo.FileOperationPatternKind}});Object.defineProperty(y,"DidCreateFilesNotification",{enumerable:!0,get:function(){return jo.DidCreateFilesNotification}});Object.defineProperty(y,"WillCreateFilesRequest",{enumerable:!0,get:function(){return jo.WillCreateFilesRequest}});Object.defineProperty(y,"DidRenameFilesNotification",{enumerable:!0,get:function(){return jo.DidRenameFilesNotification}});Object.defineProperty(y,"WillRenameFilesRequest",{enumerable:!0,get:function(){return jo.WillRenameFilesRequest}});Object.defineProperty(y,"DidDeleteFilesNotification",{enumerable:!0,get:function(){return jo.DidDeleteFilesNotification}});Object.defineProperty(y,"WillDeleteFilesRequest",{enumerable:!0,get:function(){return jo.WillDeleteFilesRequest}});var Cm=_0();Object.defineProperty(y,"UniquenessLevel",{enumerable:!0,get:function(){return Cm.UniquenessLevel}});Object.defineProperty(y,"MonikerKind",{enumerable:!0,get:function(){return Cm.MonikerKind}});Object.defineProperty(y,"MonikerRequest",{enumerable:!0,get:function(){return Cm.MonikerRequest}});var Em=T0();Object.defineProperty(y,"TypeHierarchyPrepareRequest",{enumerable:!0,get:function(){return Em.TypeHierarchyPrepareRequest}});Object.defineProperty(y,"TypeHierarchySubtypesRequest",{enumerable:!0,get:function(){return Em.TypeHierarchySubtypesRequest}});Object.defineProperty(y,"TypeHierarchySupertypesRequest",{enumerable:!0,get:function(){return Em.TypeHierarchySupertypesRequest}});var O0=R0();Object.defineProperty(y,"InlineValueRequest",{enumerable:!0,get:function(){return O0.InlineValueRequest}});Object.defineProperty(y,"InlineValueRefreshRequest",{enumerable:!0,get:function(){return O0.InlineValueRefreshRequest}});var Nm=b0();Object.defineProperty(y,"InlayHintRequest",{enumerable:!0,get:function(){return Nm.InlayHintRequest}});Object.defineProperty(y,"InlayHintResolveRequest",{enumerable:!0,get:function(){return Nm.InlayHintResolveRequest}});Object.defineProperty(y,"InlayHintRefreshRequest",{enumerable:!0,get:function(){return Nm.InlayHintRefreshRequest}});var Lu=P0();Object.defineProperty(y,"DiagnosticServerCancellationData",{enumerable:!0,get:function(){return Lu.DiagnosticServerCancellationData}});Object.defineProperty(y,"DocumentDiagnosticReportKind",{enumerable:!0,get:function(){return Lu.DocumentDiagnosticReportKind}});Object.defineProperty(y,"DocumentDiagnosticRequest",{enumerable:!0,get:function(){return Lu.DocumentDiagnosticRequest}});Object.defineProperty(y,"WorkspaceDiagnosticRequest",{enumerable:!0,get:function(){return Lu.WorkspaceDiagnosticRequest}});Object.defineProperty(y,"DiagnosticRefreshRequest",{enumerable:!0,get:function(){return Lu.DiagnosticRefreshRequest}});var Mn=E0();Object.defineProperty(y,"NotebookCellKind",{enumerable:!0,get:function(){return Mn.NotebookCellKind}});Object.defineProperty(y,"ExecutionSummary",{enumerable:!0,get:function(){return Mn.ExecutionSummary}});Object.defineProperty(y,"NotebookCell",{enumerable:!0,get:function(){return Mn.NotebookCell}});Object.defineProperty(y,"NotebookDocument",{enumerable:!0,get:function(){return Mn.NotebookDocument}});Object.defineProperty(y,"NotebookDocumentSyncRegistrationType",{enumerable:!0,get:function(){return Mn.NotebookDocumentSyncRegistrationType}});Object.defineProperty(y,"DidOpenNotebookDocumentNotification",{enumerable:!0,get:function(){return Mn.DidOpenNotebookDocumentNotification}});Object.defineProperty(y,"NotebookCellArrayChange",{enumerable:!0,get:function(){return Mn.NotebookCellArrayChange}});Object.defineProperty(y,"DidChangeNotebookDocumentNotification",{enumerable:!0,get:function(){return Mn.DidChangeNotebookDocumentNotification}});Object.defineProperty(y,"DidSaveNotebookDocumentNotification",{enumerable:!0,get:function(){return Mn.DidSaveNotebookDocumentNotification}});Object.defineProperty(y,"DidCloseNotebookDocumentNotification",{enumerable:!0,get:function(){return Mn.DidCloseNotebookDocumentNotification}});var D0;(function(t){function e(r){let n=r;return Kt.string(n.language)||Kt.string(n.scheme)||Kt.string(n.pattern)}t.is=e})(D0=y.TextDocumentFilter||(y.TextDocumentFilter={}));var I0;(function(t){function e(r){let n=r;return Kt.objectLiteral(n)&&(Kt.string(n.notebookType)||Kt.string(n.scheme)||Kt.string(n.pattern))}t.is=e})(I0=y.NotebookDocumentFilter||(y.NotebookDocumentFilter={}));var x0;(function(t){function e(r){let n=r;return Kt.objectLiteral(n)&&(Kt.string(n.notebook)||I0.is(n.notebook))&&(n.language===void 0||Kt.string(n.language))}t.is=e})(x0=y.NotebookCellTextDocumentFilter||(y.NotebookCellTextDocumentFilter={}));var q0;(function(t){function e(r){if(!Array.isArray(r))return!1;for(let n of r)if(!Kt.string(n)&&!D0.is(n)&&!x0.is(n))return!1;return!0}t.is=e})(q0=y.DocumentSelector||(y.DocumentSelector={}));var HF;(function(t){t.method="client/registerCapability",t.messageDirection=M.MessageDirection.serverToClient,t.type=new M.ProtocolRequestType(t.method)})(HF=y.RegistrationRequest||(y.RegistrationRequest={}));var WF;(function(t){t.method="client/unregisterCapability",t.messageDirection=M.MessageDirection.serverToClient,t.type=new M.ProtocolRequestType(t.method)})(WF=y.UnregistrationRequest||(y.UnregistrationRequest={}));var BF;(function(t){t.Create="create",t.Rename="rename",t.Delete="delete"})(BF=y.ResourceOperationKind||(y.ResourceOperationKind={}));var KF;(function(t){t.Abort="abort",t.Transactional="transactional",t.TextOnlyTransactional="textOnlyTransactional",t.Undo="undo"})(KF=y.FailureHandlingKind||(y.FailureHandlingKind={}));var zF;(function(t){t.UTF8="utf-8",t.UTF16="utf-16",t.UTF32="utf-32"})(zF=y.PositionEncodingKind||(y.PositionEncodingKind={}));var VF;(function(t){function e(r){let n=r;return n&&Kt.string(n.id)&&n.id.length>0}t.hasId=e})(VF=y.StaticRegistrationOptions||(y.StaticRegistrationOptions={}));var YF;(function(t){function e(r){let n=r;return n&&(n.documentSelector===null||q0.is(n.documentSelector))}t.is=e})(YF=y.TextDocumentRegistrationOptions||(y.TextDocumentRegistrationOptions={}));var XF;(function(t){function e(n){let i=n;return Kt.objectLiteral(i)&&(i.workDoneProgress===void 0||Kt.boolean(i.workDoneProgress))}t.is=e;function r(n){let i=n;return i&&Kt.boolean(i.workDoneProgress)}t.hasWorkDoneProgress=r})(XF=y.WorkDoneProgressOptions||(y.WorkDoneProgressOptions={}));var JF;(function(t){t.method="initialize",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolRequestType(t.method)})(JF=y.InitializeRequest||(y.InitializeRequest={}));var QF;(function(t){t.unknownProtocolVersion=1})(QF=y.InitializeErrorCodes||(y.InitializeErrorCodes={}));var ZF;(function(t){t.method="initialized",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolNotificationType(t.method)})(ZF=y.InitializedNotification||(y.InitializedNotification={}));var ej;(function(t){t.method="shutdown",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolRequestType0(t.method)})(ej=y.ShutdownRequest||(y.ShutdownRequest={}));var tj;(function(t){t.method="exit",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolNotificationType0(t.method)})(tj=y.ExitNotification||(y.ExitNotification={}));var rj;(function(t){t.method="workspace/didChangeConfiguration",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolNotificationType(t.method)})(rj=y.DidChangeConfigurationNotification||(y.DidChangeConfigurationNotification={}));var nj;(function(t){t.Error=1,t.Warning=2,t.Info=3,t.Log=4})(nj=y.MessageType||(y.MessageType={}));var ij;(function(t){t.method="window/showMessage",t.messageDirection=M.MessageDirection.serverToClient,t.type=new M.ProtocolNotificationType(t.method)})(ij=y.ShowMessageNotification||(y.ShowMessageNotification={}));var oj;(function(t){t.method="window/showMessageRequest",t.messageDirection=M.MessageDirection.serverToClient,t.type=new M.ProtocolRequestType(t.method)})(oj=y.ShowMessageRequest||(y.ShowMessageRequest={}));var aj;(function(t){t.method="window/logMessage",t.messageDirection=M.MessageDirection.serverToClient,t.type=new M.ProtocolNotificationType(t.method)})(aj=y.LogMessageNotification||(y.LogMessageNotification={}));var sj;(function(t){t.method="telemetry/event",t.messageDirection=M.MessageDirection.serverToClient,t.type=new M.ProtocolNotificationType(t.method)})(sj=y.TelemetryEventNotification||(y.TelemetryEventNotification={}));var uj;(function(t){t.None=0,t.Full=1,t.Incremental=2})(uj=y.TextDocumentSyncKind||(y.TextDocumentSyncKind={}));var cj;(function(t){t.method="textDocument/didOpen",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolNotificationType(t.method)})(cj=y.DidOpenTextDocumentNotification||(y.DidOpenTextDocumentNotification={}));var lj;(function(t){function e(n){let i=n;return i!=null&&typeof i.text=="string"&&i.range!==void 0&&(i.rangeLength===void 0||typeof i.rangeLength=="number")}t.isIncremental=e;function r(n){let i=n;return i!=null&&typeof i.text=="string"&&i.range===void 0&&i.rangeLength===void 0}t.isFull=r})(lj=y.TextDocumentContentChangeEvent||(y.TextDocumentContentChangeEvent={}));var dj;(function(t){t.method="textDocument/didChange",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolNotificationType(t.method)})(dj=y.DidChangeTextDocumentNotification||(y.DidChangeTextDocumentNotification={}));var fj;(function(t){t.method="textDocument/didClose",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolNotificationType(t.method)})(fj=y.DidCloseTextDocumentNotification||(y.DidCloseTextDocumentNotification={}));var pj;(function(t){t.method="textDocument/didSave",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolNotificationType(t.method)})(pj=y.DidSaveTextDocumentNotification||(y.DidSaveTextDocumentNotification={}));var hj;(function(t){t.Manual=1,t.AfterDelay=2,t.FocusOut=3})(hj=y.TextDocumentSaveReason||(y.TextDocumentSaveReason={}));var mj;(function(t){t.method="textDocument/willSave",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolNotificationType(t.method)})(mj=y.WillSaveTextDocumentNotification||(y.WillSaveTextDocumentNotification={}));var gj;(function(t){t.method="textDocument/willSaveWaitUntil",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolRequestType(t.method)})(gj=y.WillSaveTextDocumentWaitUntilRequest||(y.WillSaveTextDocumentWaitUntilRequest={}));var yj;(function(t){t.method="workspace/didChangeWatchedFiles",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolNotificationType(t.method)})(yj=y.DidChangeWatchedFilesNotification||(y.DidChangeWatchedFilesNotification={}));var vj;(function(t){t.Created=1,t.Changed=2,t.Deleted=3})(vj=y.FileChangeType||(y.FileChangeType={}));var _j;(function(t){function e(r){let n=r;return Kt.objectLiteral(n)&&(N0.URI.is(n.baseUri)||N0.WorkspaceFolder.is(n.baseUri))&&Kt.string(n.pattern)}t.is=e})(_j=y.RelativePattern||(y.RelativePattern={}));var Tj;(function(t){t.Create=1,t.Change=2,t.Delete=4})(Tj=y.WatchKind||(y.WatchKind={}));var Rj;(function(t){t.method="textDocument/publishDiagnostics",t.messageDirection=M.MessageDirection.serverToClient,t.type=new M.ProtocolNotificationType(t.method)})(Rj=y.PublishDiagnosticsNotification||(y.PublishDiagnosticsNotification={}));var bj;(function(t){t.Invoked=1,t.TriggerCharacter=2,t.TriggerForIncompleteCompletions=3})(bj=y.CompletionTriggerKind||(y.CompletionTriggerKind={}));var Aj;(function(t){t.method="textDocument/completion",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolRequestType(t.method)})(Aj=y.CompletionRequest||(y.CompletionRequest={}));var Pj;(function(t){t.method="completionItem/resolve",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolRequestType(t.method)})(Pj=y.CompletionResolveRequest||(y.CompletionResolveRequest={}));var Sj;(function(t){t.method="textDocument/hover",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolRequestType(t.method)})(Sj=y.HoverRequest||(y.HoverRequest={}));var Cj;(function(t){t.Invoked=1,t.TriggerCharacter=2,t.ContentChange=3})(Cj=y.SignatureHelpTriggerKind||(y.SignatureHelpTriggerKind={}));var Ej;(function(t){t.method="textDocument/signatureHelp",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolRequestType(t.method)})(Ej=y.SignatureHelpRequest||(y.SignatureHelpRequest={}));var Nj;(function(t){t.method="textDocument/definition",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolRequestType(t.method)})(Nj=y.DefinitionRequest||(y.DefinitionRequest={}));var kj;(function(t){t.method="textDocument/references",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolRequestType(t.method)})(kj=y.ReferencesRequest||(y.ReferencesRequest={}));var wj;(function(t){t.method="textDocument/documentHighlight",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolRequestType(t.method)})(wj=y.DocumentHighlightRequest||(y.DocumentHighlightRequest={}));var Oj;(function(t){t.method="textDocument/documentSymbol",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolRequestType(t.method)})(Oj=y.DocumentSymbolRequest||(y.DocumentSymbolRequest={}));var Dj;(function(t){t.method="textDocument/codeAction",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolRequestType(t.method)})(Dj=y.CodeActionRequest||(y.CodeActionRequest={}));var Ij;(function(t){t.method="codeAction/resolve",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolRequestType(t.method)})(Ij=y.CodeActionResolveRequest||(y.CodeActionResolveRequest={}));var xj;(function(t){t.method="workspace/symbol",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolRequestType(t.method)})(xj=y.WorkspaceSymbolRequest||(y.WorkspaceSymbolRequest={}));var qj;(function(t){t.method="workspaceSymbol/resolve",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolRequestType(t.method)})(qj=y.WorkspaceSymbolResolveRequest||(y.WorkspaceSymbolResolveRequest={}));var Lj;(function(t){t.method="textDocument/codeLens",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolRequestType(t.method)})(Lj=y.CodeLensRequest||(y.CodeLensRequest={}));var Mj;(function(t){t.method="codeLens/resolve",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolRequestType(t.method)})(Mj=y.CodeLensResolveRequest||(y.CodeLensResolveRequest={}));var $j;(function(t){t.method="workspace/codeLens/refresh",t.messageDirection=M.MessageDirection.serverToClient,t.type=new M.ProtocolRequestType0(t.method)})($j=y.CodeLensRefreshRequest||(y.CodeLensRefreshRequest={}));var Fj;(function(t){t.method="textDocument/documentLink",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolRequestType(t.method)})(Fj=y.DocumentLinkRequest||(y.DocumentLinkRequest={}));var jj;(function(t){t.method="documentLink/resolve",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolRequestType(t.method)})(jj=y.DocumentLinkResolveRequest||(y.DocumentLinkResolveRequest={}));var Uj;(function(t){t.method="textDocument/formatting",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolRequestType(t.method)})(Uj=y.DocumentFormattingRequest||(y.DocumentFormattingRequest={}));var Gj;(function(t){t.method="textDocument/rangeFormatting",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolRequestType(t.method)})(Gj=y.DocumentRangeFormattingRequest||(y.DocumentRangeFormattingRequest={}));var Hj;(function(t){t.method="textDocument/onTypeFormatting",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolRequestType(t.method)})(Hj=y.DocumentOnTypeFormattingRequest||(y.DocumentOnTypeFormattingRequest={}));var Wj;(function(t){t.Identifier=1})(Wj=y.PrepareSupportDefaultBehavior||(y.PrepareSupportDefaultBehavior={}));var Bj;(function(t){t.method="textDocument/rename",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolRequestType(t.method)})(Bj=y.RenameRequest||(y.RenameRequest={}));var Kj;(function(t){t.method="textDocument/prepareRename",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolRequestType(t.method)})(Kj=y.PrepareRenameRequest||(y.PrepareRenameRequest={}));var zj;(function(t){t.method="workspace/executeCommand",t.messageDirection=M.MessageDirection.clientToServer,t.type=new M.ProtocolRequestType(t.method)})(zj=y.ExecuteCommandRequest||(y.ExecuteCommandRequest={}));var Vj;(function(t){t.method="workspace/applyEdit",t.messageDirection=M.MessageDirection.serverToClient,t.type=new M.ProtocolRequestType("workspace/applyEdit")})(Vj=y.ApplyWorkspaceEditRequest||(y.ApplyWorkspaceEditRequest={}))});var $0=f(Rl=>{"use strict";Object.defineProperty(Rl,"__esModule",{value:!0});Rl.createProtocolConnection=void 0;var M0=Ti();function Yj(t,e,r,n){return M0.ConnectionStrategy.is(n)&&(n={connectionStrategy:n}),(0,M0.createMessageConnection)(t,e,r,n)}Rl.createProtocolConnection=Yj});var F0=f(cr=>{"use strict";var Xj=cr&&cr.__createBinding||(Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]}),bl=cr&&cr.__exportStar||function(t,e){for(var r in t)r!=="default"&&!Object.prototype.hasOwnProperty.call(e,r)&&Xj(e,t,r)};Object.defineProperty(cr,"__esModule",{value:!0});cr.LSPErrorCodes=cr.createProtocolConnection=void 0;bl(Ti(),cr);bl(qa(),cr);bl(ct(),cr);bl(L0(),cr);var Jj=$0();Object.defineProperty(cr,"createProtocolConnection",{enumerable:!0,get:function(){return Jj.createProtocolConnection}});var Qj;(function(t){t.lspReservedErrorRangeStart=-32899,t.RequestFailed=-32803,t.ServerCancelled=-32802,t.ContentModified=-32801,t.RequestCancelled=-32800,t.lspReservedErrorRangeEnd=-32800})(Qj=cr.LSPErrorCodes||(cr.LSPErrorCodes={}))});var At=f($n=>{"use strict";var Zj=$n&&$n.__createBinding||(Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]}),j0=$n&&$n.__exportStar||function(t,e){for(var r in t)r!=="default"&&!Object.prototype.hasOwnProperty.call(e,r)&&Zj(e,t,r)};Object.defineProperty($n,"__esModule",{value:!0});$n.createProtocolConnection=void 0;var eU=ym();j0(ym(),$n);j0(F0(),$n);function tU(t,e,r,n){return(0,eU.createMessageConnection)(t,e,r,n)}$n.createProtocolConnection=tU});var wm=f(Xi=>{"use strict";Object.defineProperty(Xi,"__esModule",{value:!0});Xi.SemanticTokensBuilder=Xi.SemanticTokensDiff=Xi.SemanticTokensFeature=void 0;var Al=At(),rU=t=>class extends t{get semanticTokens(){return{refresh:()=>this.connection.sendRequest(Al.SemanticTokensRefreshRequest.type),on:e=>{let r=Al.SemanticTokensRequest.type;return this.connection.onRequest(r,(n,i)=>e(n,i,this.attachWorkDoneProgress(n),this.attachPartialResultProgress(r,n)))},onDelta:e=>{let r=Al.SemanticTokensDeltaRequest.type;return this.connection.onRequest(r,(n,i)=>e(n,i,this.attachWorkDoneProgress(n),this.attachPartialResultProgress(r,n)))},onRange:e=>{let r=Al.SemanticTokensRangeRequest.type;return this.connection.onRequest(r,(n,i)=>e(n,i,this.attachWorkDoneProgress(n),this.attachPartialResultProgress(r,n)))}}}};Xi.SemanticTokensFeature=rU;var Pl=class{constructor(e,r){this.originalSequence=e,this.modifiedSequence=r}computeDiff(){let e=this.originalSequence.length,r=this.modifiedSequence.length,n=0;for(;n<r&&n<e&&this.originalSequence[n]===this.modifiedSequence[n];)n++;if(n<r&&n<e){let i=e-1,o=r-1;for(;i>=n&&o>=n&&this.originalSequence[i]===this.modifiedSequence[o];)i--,o--;(i<n||o<n)&&(i++,o++);let a=i-n+1,s=this.modifiedSequence.slice(n,o+1);return s.length===1&&s[0]===this.originalSequence[i]?[{start:n,deleteCount:a-1}]:[{start:n,deleteCount:a,data:s}]}else return n<r?[{start:n,deleteCount:0,data:this.modifiedSequence.slice(n)}]:n<e?[{start:n,deleteCount:e-n}]:[]}};Xi.SemanticTokensDiff=Pl;var km=class{constructor(){this._prevData=void 0,this.initialize()}initialize(){this._id=Date.now(),this._prevLine=0,this._prevChar=0,this._data=[],this._dataLen=0}push(e,r,n,i,o){let a=e,s=r;this._dataLen>0&&(a-=this._prevLine,a===0&&(s-=this._prevChar)),this._data[this._dataLen++]=a,this._data[this._dataLen++]=s,this._data[this._dataLen++]=n,this._data[this._dataLen++]=i,this._data[this._dataLen++]=o,this._prevLine=e,this._prevChar=r}get id(){return this._id.toString()}previousResult(e){this.id===e&&(this._prevData=this._data),this.initialize()}build(){return this._prevData=void 0,{resultId:this.id,data:this._data}}canBuildEdits(){return this._prevData!==void 0}buildEdits(){return this._prevData!==void 0?{resultId:this.id,edits:new Pl(this._prevData,this._data).computeDiff()}:this.build()}};Xi.SemanticTokensBuilder=km});var Dm=f(Sl=>{"use strict";Object.defineProperty(Sl,"__esModule",{value:!0});Sl.TextDocuments=void 0;var Uo=At(),Om=class{constructor(e){this._configuration=e,this._syncedDocuments=new Map,this._onDidChangeContent=new Uo.Emitter,this._onDidOpen=new Uo.Emitter,this._onDidClose=new Uo.Emitter,this._onDidSave=new Uo.Emitter,this._onWillSave=new Uo.Emitter}get onDidOpen(){return this._onDidOpen.event}get onDidChangeContent(){return this._onDidChangeContent.event}get onWillSave(){return this._onWillSave.event}onWillSaveWaitUntil(e){this._willSaveWaitUntil=e}get onDidSave(){return this._onDidSave.event}get onDidClose(){return this._onDidClose.event}get(e){return this._syncedDocuments.get(e)}all(){return Array.from(this._syncedDocuments.values())}keys(){return Array.from(this._syncedDocuments.keys())}listen(e){e.__textDocumentSync=Uo.TextDocumentSyncKind.Incremental;let r=[];return r.push(e.onDidOpenTextDocument(n=>{let i=n.textDocument,o=this._configuration.create(i.uri,i.languageId,i.version,i.text);this._syncedDocuments.set(i.uri,o);let a=Object.freeze({document:o});this._onDidOpen.fire(a),this._onDidChangeContent.fire(a)})),r.push(e.onDidChangeTextDocument(n=>{let i=n.textDocument,o=n.contentChanges;if(o.length===0)return;let{version:a}=i;if(a==null)throw new Error(`Received document change event for ${i.uri} without valid version identifier`);let s=this._syncedDocuments.get(i.uri);s!==void 0&&(s=this._configuration.update(s,o,a),this._syncedDocuments.set(i.uri,s),this._onDidChangeContent.fire(Object.freeze({document:s})))})),r.push(e.onDidCloseTextDocument(n=>{let i=this._syncedDocuments.get(n.textDocument.uri);i!==void 0&&(this._syncedDocuments.delete(n.textDocument.uri),this._onDidClose.fire(Object.freeze({document:i})))})),r.push(e.onWillSaveTextDocument(n=>{let i=this._syncedDocuments.get(n.textDocument.uri);i!==void 0&&this._onWillSave.fire(Object.freeze({document:i,reason:n.reason}))})),r.push(e.onWillSaveTextDocumentWaitUntil((n,i)=>{let o=this._syncedDocuments.get(n.textDocument.uri);return o!==void 0&&this._willSaveWaitUntil?this._willSaveWaitUntil(Object.freeze({document:o,reason:n.reason}),i):[]})),r.push(e.onDidSaveTextDocument(n=>{let i=this._syncedDocuments.get(n.textDocument.uri);i!==void 0&&this._onDidSave.fire(Object.freeze({document:i}))})),Uo.Disposable.create(()=>{r.forEach(n=>n.dispose())})}};Sl.TextDocuments=Om});var xm=f(Ga=>{"use strict";Object.defineProperty(Ga,"__esModule",{value:!0});Ga.NotebookDocuments=Ga.NotebookSyncFeature=void 0;var Fr=At(),U0=Dm(),nU=t=>class extends t{get synchronization(){return{onDidOpenNotebookDocument:e=>this.connection.onNotification(Fr.DidOpenNotebookDocumentNotification.type,r=>{e(r)}),onDidChangeNotebookDocument:e=>this.connection.onNotification(Fr.DidChangeNotebookDocumentNotification.type,r=>{e(r)}),onDidSaveNotebookDocument:e=>this.connection.onNotification(Fr.DidSaveNotebookDocumentNotification.type,r=>{e(r)}),onDidCloseNotebookDocument:e=>this.connection.onNotification(Fr.DidCloseNotebookDocumentNotification.type,r=>{e(r)})}}};Ga.NotebookSyncFeature=nU;var Ji=class{onDidOpenTextDocument(e){return this.openHandler=e,Fr.Disposable.create(()=>{this.openHandler=void 0})}openTextDocument(e){this.openHandler&&this.openHandler(e)}onDidChangeTextDocument(e){return this.changeHandler=e,Fr.Disposable.create(()=>{this.changeHandler=e})}changeTextDocument(e){this.changeHandler&&this.changeHandler(e)}onDidCloseTextDocument(e){return this.closeHandler=e,Fr.Disposable.create(()=>{this.closeHandler=void 0})}closeTextDocument(e){this.closeHandler&&this.closeHandler(e)}onWillSaveTextDocument(){return Ji.NULL_DISPOSE}onWillSaveTextDocumentWaitUntil(){return Ji.NULL_DISPOSE}onDidSaveTextDocument(){return Ji.NULL_DISPOSE}};Ji.NULL_DISPOSE=Object.freeze({dispose:()=>{}});var Im=class{constructor(e){e instanceof U0.TextDocuments?this._cellTextDocuments=e:this._cellTextDocuments=new U0.TextDocuments(e),this.notebookDocuments=new Map,this.notebookCellMap=new Map,this._onDidOpen=new Fr.Emitter,this._onDidChange=new Fr.Emitter,this._onDidSave=new Fr.Emitter,this._onDidClose=new Fr.Emitter}get cellTextDocuments(){return this._cellTextDocuments}getCellTextDocument(e){return this._cellTextDocuments.get(e.document)}getNotebookDocument(e){return this.notebookDocuments.get(e)}getNotebookCell(e){let r=this.notebookCellMap.get(e);return r&&r[0]}findNotebookDocumentForCell(e){let r=typeof e=="string"?e:e.document,n=this.notebookCellMap.get(r);return n&&n[1]}get onDidOpen(){return this._onDidOpen.event}get onDidSave(){return this._onDidSave.event}get onDidChange(){return this._onDidChange.event}get onDidClose(){return this._onDidClose.event}listen(e){let r=new Ji,n=[];return n.push(this.cellTextDocuments.listen(r)),n.push(e.notebooks.synchronization.onDidOpenNotebookDocument(i=>{this.notebookDocuments.set(i.notebookDocument.uri,i.notebookDocument);for(let o of i.cellTextDocuments)r.openTextDocument({textDocument:o});this.updateCellMap(i.notebookDocument),this._onDidOpen.fire(i.notebookDocument)})),n.push(e.notebooks.synchronization.onDidChangeNotebookDocument(i=>{let o=this.notebookDocuments.get(i.notebookDocument.uri);if(o===void 0)return;o.version=i.notebookDocument.version;let a=o.metadata,s=!1,u=i.change;u.metadata!==void 0&&(s=!0,o.metadata=u.metadata);let c=[],l=[],d=[],h=[];if(u.cells!==void 0){let N=u.cells;if(N.structure!==void 0){let A=N.structure.array;if(o.cells.splice(A.start,A.deleteCount,...A.cells!==void 0?A.cells:[]),N.structure.didOpen!==void 0)for(let b of N.structure.didOpen)r.openTextDocument({textDocument:b}),c.push(b.uri);if(N.structure.didClose)for(let b of N.structure.didClose)r.closeTextDocument({textDocument:b}),l.push(b.uri)}if(N.data!==void 0){let A=new Map(N.data.map(b=>[b.document,b]));for(let b=0;b<=o.cells.length;b++){let O=A.get(o.cells[b].document);if(O!==void 0){let $=o.cells.splice(b,1,O);if(d.push({old:$[0],new:O}),A.delete(O.document),A.size===0)break}}}if(N.textContent!==void 0)for(let A of N.textContent)r.changeTextDocument({textDocument:A.document,contentChanges:A.changes}),h.push(A.document.uri)}this.updateCellMap(o);let v={notebookDocument:o};s&&(v.metadata={old:a,new:o.metadata});let g=[];for(let N of c)g.push(this.getNotebookCell(N));let R=[];for(let N of l)R.push(this.getNotebookCell(N));let E=[];for(let N of h)E.push(this.getNotebookCell(N));(g.length>0||R.length>0||d.length>0||E.length>0)&&(v.cells={added:g,removed:R,changed:{data:d,textContent:E}}),(v.metadata!==void 0||v.cells!==void 0)&&this._onDidChange.fire(v)})),n.push(e.notebooks.synchronization.onDidSaveNotebookDocument(i=>{let o=this.notebookDocuments.get(i.notebookDocument.uri);o!==void 0&&this._onDidSave.fire(o)})),n.push(e.notebooks.synchronization.onDidCloseNotebookDocument(i=>{let o=this.notebookDocuments.get(i.notebookDocument.uri);if(o!==void 0){this._onDidClose.fire(o);for(let a of i.cellTextDocuments)r.closeTextDocument({textDocument:a});this.notebookDocuments.delete(i.notebookDocument.uri);for(let a of o.cells)this.notebookCellMap.delete(a.document)}})),Fr.Disposable.create(()=>{n.forEach(i=>i.dispose())})}updateCellMap(e){for(let r of e.cells)this.notebookCellMap.set(r.document,[r,e])}};Ga.NotebookDocuments=Im});var qm=f(Pt=>{"use strict";Object.defineProperty(Pt,"__esModule",{value:!0});Pt.thenable=Pt.typedArray=Pt.stringArray=Pt.array=Pt.func=Pt.error=Pt.number=Pt.string=Pt.boolean=void 0;function iU(t){return t===!0||t===!1}Pt.boolean=iU;function G0(t){return typeof t=="string"||t instanceof String}Pt.string=G0;function oU(t){return typeof t=="number"||t instanceof Number}Pt.number=oU;function aU(t){return t instanceof Error}Pt.error=aU;function H0(t){return typeof t=="function"}Pt.func=H0;function W0(t){return Array.isArray(t)}Pt.array=W0;function sU(t){return W0(t)&&t.every(e=>G0(e))}Pt.stringArray=sU;function uU(t,e){return Array.isArray(t)&&t.every(e)}Pt.typedArray=uU;function cU(t){return t&&H0(t.then)}Pt.thenable=cU});var Lm=f(jr=>{"use strict";Object.defineProperty(jr,"__esModule",{value:!0});jr.generateUuid=jr.parse=jr.isUUID=jr.v4=jr.empty=void 0;var Mu=class{constructor(e){this._value=e}asHex(){return this._value}equals(e){return this.asHex()===e.asHex()}},ae=class extends Mu{constructor(){super([ae._randomHex(),ae._randomHex(),ae._randomHex(),ae._randomHex(),ae._randomHex(),ae._randomHex(),ae._randomHex(),ae._randomHex(),"-",ae._randomHex(),ae._randomHex(),ae._randomHex(),ae._randomHex(),"-","4",ae._randomHex(),ae._randomHex(),ae._randomHex(),"-",ae._oneOf(ae._timeHighBits),ae._randomHex(),ae._randomHex(),ae._randomHex(),"-",ae._randomHex(),ae._randomHex(),ae._randomHex(),ae._randomHex(),ae._randomHex(),ae._randomHex(),ae._randomHex(),ae._randomHex(),ae._randomHex(),ae._randomHex(),ae._randomHex(),ae._randomHex()].join(""))}static _oneOf(e){return e[Math.floor(e.length*Math.random())]}static _randomHex(){return ae._oneOf(ae._chars)}};ae._chars=["0","1","2","3","4","5","6","6","7","8","9","a","b","c","d","e","f"];ae._timeHighBits=["8","9","a","b"];jr.empty=new Mu("00000000-0000-0000-0000-000000000000");function B0(){return new ae}jr.v4=B0;var lU=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;function K0(t){return lU.test(t)}jr.isUUID=K0;function dU(t){if(!K0(t))throw new Error("invalid uuid");return new Mu(t)}jr.parse=dU;function fU(){return B0().asHex()}jr.generateUuid=fU});var z0=f(Zi=>{"use strict";Object.defineProperty(Zi,"__esModule",{value:!0});Zi.attachPartialResult=Zi.ProgressFeature=Zi.attachWorkDone=void 0;var Qi=At(),pU=Lm(),Fn=class{constructor(e,r){this._connection=e,this._token=r,Fn.Instances.set(this._token,this)}begin(e,r,n,i){let o={kind:"begin",title:e,percentage:r,message:n,cancellable:i};this._connection.sendProgress(Qi.WorkDoneProgress.type,this._token,o)}report(e,r){let n={kind:"report"};typeof e=="number"?(n.percentage=e,r!==void 0&&(n.message=r)):n.message=e,this._connection.sendProgress(Qi.WorkDoneProgress.type,this._token,n)}done(){Fn.Instances.delete(this._token),this._connection.sendProgress(Qi.WorkDoneProgress.type,this._token,{kind:"end"})}};Fn.Instances=new Map;var Cl=class extends Fn{constructor(e,r){super(e,r),this._source=new Qi.CancellationTokenSource}get token(){return this._source.token}done(){this._source.dispose(),super.done()}cancel(){this._source.cancel()}},$u=class{constructor(){}begin(){}report(){}done(){}},El=class extends $u{constructor(){super(),this._source=new Qi.CancellationTokenSource}get token(){return this._source.token}done(){this._source.dispose()}cancel(){this._source.cancel()}};function hU(t,e){if(e===void 0||e.workDoneToken===void 0)return new $u;let r=e.workDoneToken;return delete e.workDoneToken,new Fn(t,r)}Zi.attachWorkDone=hU;var mU=t=>class extends t{constructor(){super(),this._progressSupported=!1}initialize(e){super.initialize(e),e?.window?.workDoneProgress===!0&&(this._progressSupported=!0,this.connection.onNotification(Qi.WorkDoneProgressCancelNotification.type,r=>{let n=Fn.Instances.get(r.token);(n instanceof Cl||n instanceof El)&&n.cancel()}))}attachWorkDoneProgress(e){return e===void 0?new $u:new Fn(this.connection,e)}createWorkDoneProgress(){if(this._progressSupported){let e=(0,pU.generateUuid)();return this.connection.sendRequest(Qi.WorkDoneProgressCreateRequest.type,{token:e}).then(()=>new Cl(this.connection,e))}else return Promise.resolve(new El)}};Zi.ProgressFeature=mU;var Mm;(function(t){t.type=new Qi.ProgressType})(Mm||(Mm={}));var $m=class{constructor(e,r){this._connection=e,this._token=r}report(e){this._connection.sendProgress(Mm.type,this._token,e)}};function gU(t,e){if(e===void 0||e.partialResultToken===void 0)return;let r=e.partialResultToken;return delete e.partialResultToken,new $m(t,r)}Zi.attachPartialResult=gU});var V0=f(Nl=>{"use strict";Object.defineProperty(Nl,"__esModule",{value:!0});Nl.ConfigurationFeature=void 0;var yU=At(),vU=qm(),_U=t=>class extends t{getConfiguration(e){return e?vU.string(e)?this._getConfiguration({section:e}):this._getConfiguration(e):this._getConfiguration({})}_getConfiguration(e){let r={items:Array.isArray(e)?e:[e]};return this.connection.sendRequest(yU.ConfigurationRequest.type,r).then(n=>Array.isArray(n)?Array.isArray(e)?n:n[0]:Array.isArray(e)?[]:null)}};Nl.ConfigurationFeature=_U});var Y0=f(wl=>{"use strict";Object.defineProperty(wl,"__esModule",{value:!0});wl.WorkspaceFoldersFeature=void 0;var kl=At(),TU=t=>class extends t{constructor(){super(),this._notificationIsAutoRegistered=!1}initialize(e){super.initialize(e);let r=e.workspace;r&&r.workspaceFolders&&(this._onDidChangeWorkspaceFolders=new kl.Emitter,this.connection.onNotification(kl.DidChangeWorkspaceFoldersNotification.type,n=>{this._onDidChangeWorkspaceFolders.fire(n.event)}))}fillServerCapabilities(e){super.fillServerCapabilities(e);let r=e.workspace?.workspaceFolders?.changeNotifications;this._notificationIsAutoRegistered=r===!0||typeof r=="string"}getWorkspaceFolders(){return this.connection.sendRequest(kl.WorkspaceFoldersRequest.type)}get onDidChangeWorkspaceFolders(){if(!this._onDidChangeWorkspaceFolders)throw new Error("Client doesn't support sending workspace folder change events.");return!this._notificationIsAutoRegistered&&!this._unregistration&&(this._unregistration=this.connection.client.register(kl.DidChangeWorkspaceFoldersNotification.type)),this._onDidChangeWorkspaceFolders.event}};wl.WorkspaceFoldersFeature=TU});var X0=f(Ol=>{"use strict";Object.defineProperty(Ol,"__esModule",{value:!0});Ol.CallHierarchyFeature=void 0;var Fm=At(),RU=t=>class extends t{get callHierarchy(){return{onPrepare:e=>this.connection.onRequest(Fm.CallHierarchyPrepareRequest.type,(r,n)=>e(r,n,this.attachWorkDoneProgress(r),void 0)),onIncomingCalls:e=>{let r=Fm.CallHierarchyIncomingCallsRequest.type;return this.connection.onRequest(r,(n,i)=>e(n,i,this.attachWorkDoneProgress(n),this.attachPartialResultProgress(r,n)))},onOutgoingCalls:e=>{let r=Fm.CallHierarchyOutgoingCallsRequest.type;return this.connection.onRequest(r,(n,i)=>e(n,i,this.attachWorkDoneProgress(n),this.attachPartialResultProgress(r,n)))}}}};Ol.CallHierarchyFeature=RU});var J0=f(Dl=>{"use strict";Object.defineProperty(Dl,"__esModule",{value:!0});Dl.ShowDocumentFeature=void 0;var bU=At(),AU=t=>class extends t{showDocument(e){return this.connection.sendRequest(bU.ShowDocumentRequest.type,e)}};Dl.ShowDocumentFeature=AU});var Q0=f(Il=>{"use strict";Object.defineProperty(Il,"__esModule",{value:!0});Il.FileOperationsFeature=void 0;var Ha=At(),PU=t=>class extends t{onDidCreateFiles(e){return this.connection.onNotification(Ha.DidCreateFilesNotification.type,r=>{e(r)})}onDidRenameFiles(e){return this.connection.onNotification(Ha.DidRenameFilesNotification.type,r=>{e(r)})}onDidDeleteFiles(e){return this.connection.onNotification(Ha.DidDeleteFilesNotification.type,r=>{e(r)})}onWillCreateFiles(e){return this.connection.onRequest(Ha.WillCreateFilesRequest.type,(r,n)=>e(r,n))}onWillRenameFiles(e){return this.connection.onRequest(Ha.WillRenameFilesRequest.type,(r,n)=>e(r,n))}onWillDeleteFiles(e){return this.connection.onRequest(Ha.WillDeleteFilesRequest.type,(r,n)=>e(r,n))}};Il.FileOperationsFeature=PU});var Z0=f(xl=>{"use strict";Object.defineProperty(xl,"__esModule",{value:!0});xl.LinkedEditingRangeFeature=void 0;var SU=At(),CU=t=>class extends t{onLinkedEditingRange(e){return this.connection.onRequest(SU.LinkedEditingRangeRequest.type,(r,n)=>e(r,n,this.attachWorkDoneProgress(r),void 0))}};xl.LinkedEditingRangeFeature=CU});var eb=f(ql=>{"use strict";Object.defineProperty(ql,"__esModule",{value:!0});ql.TypeHierarchyFeature=void 0;var jm=At(),EU=t=>class extends t{get typeHierarchy(){return{onPrepare:e=>this.connection.onRequest(jm.TypeHierarchyPrepareRequest.type,(r,n)=>e(r,n,this.attachWorkDoneProgress(r),void 0)),onSupertypes:e=>{let r=jm.TypeHierarchySupertypesRequest.type;return this.connection.onRequest(r,(n,i)=>e(n,i,this.attachWorkDoneProgress(n),this.attachPartialResultProgress(r,n)))},onSubtypes:e=>{let r=jm.TypeHierarchySubtypesRequest.type;return this.connection.onRequest(r,(n,i)=>e(n,i,this.attachWorkDoneProgress(n),this.attachPartialResultProgress(r,n)))}}}};ql.TypeHierarchyFeature=EU});var rb=f(Ll=>{"use strict";Object.defineProperty(Ll,"__esModule",{value:!0});Ll.InlineValueFeature=void 0;var tb=At(),NU=t=>class extends t{get inlineValue(){return{refresh:()=>this.connection.sendRequest(tb.InlineValueRefreshRequest.type),on:e=>this.connection.onRequest(tb.InlineValueRequest.type,(r,n)=>e(r,n,this.attachWorkDoneProgress(r)))}}};Ll.InlineValueFeature=NU});var nb=f(Ml=>{"use strict";Object.defineProperty(Ml,"__esModule",{value:!0});Ml.InlayHintFeature=void 0;var Um=At(),kU=t=>class extends t{get inlayHint(){return{refresh:()=>this.connection.sendRequest(Um.InlayHintRefreshRequest.type),on:e=>this.connection.onRequest(Um.InlayHintRequest.type,(r,n)=>e(r,n,this.attachWorkDoneProgress(r))),resolve:e=>this.connection.onRequest(Um.InlayHintResolveRequest.type,(r,n)=>e(r,n))}}};Ml.InlayHintFeature=kU});var ib=f($l=>{"use strict";Object.defineProperty($l,"__esModule",{value:!0});$l.DiagnosticFeature=void 0;var Fu=At(),wU=t=>class extends t{get diagnostics(){return{refresh:()=>this.connection.sendRequest(Fu.DiagnosticRefreshRequest.type),on:e=>this.connection.onRequest(Fu.DocumentDiagnosticRequest.type,(r,n)=>e(r,n,this.attachWorkDoneProgress(r),this.attachPartialResultProgress(Fu.DocumentDiagnosticRequest.partialResult,r))),onWorkspace:e=>this.connection.onRequest(Fu.WorkspaceDiagnosticRequest.type,(r,n)=>e(r,n,this.attachWorkDoneProgress(r),this.attachPartialResultProgress(Fu.WorkspaceDiagnosticRequest.partialResult,r)))}}};$l.DiagnosticFeature=wU});var ob=f(Fl=>{"use strict";Object.defineProperty(Fl,"__esModule",{value:!0});Fl.MonikerFeature=void 0;var OU=At(),DU=t=>class extends t{get moniker(){return{on:e=>{let r=OU.MonikerRequest.type;return this.connection.onRequest(r,(n,i)=>e(n,i,this.attachWorkDoneProgress(n),this.attachPartialResultProgress(r,n)))}}}};Fl.MonikerFeature=DU});var vb=f(ve=>{"use strict";Object.defineProperty(ve,"__esModule",{value:!0});ve.createConnection=ve.combineFeatures=ve.combineNotebooksFeatures=ve.combineLanguagesFeatures=ve.combineWorkspaceFeatures=ve.combineWindowFeatures=ve.combineClientFeatures=ve.combineTracerFeatures=ve.combineTelemetryFeatures=ve.combineConsoleFeatures=ve._NotebooksImpl=ve._LanguagesImpl=ve.BulkUnregistration=ve.BulkRegistration=ve.ErrorMessageTracker=void 0;var G=At(),Ur=qm(),Hm=Lm(),te=z0(),IU=V0(),xU=Y0(),qU=X0(),LU=wm(),MU=J0(),$U=Q0(),FU=Z0(),jU=eb(),UU=rb(),GU=nb(),HU=ib(),WU=xm(),BU=ob();function Gm(t){if(t!==null)return t}var Wm=class{constructor(){this._messages=Object.create(null)}add(e){let r=this._messages[e];r||(r=0),r++,this._messages[e]=r}sendErrors(e){Object.keys(this._messages).forEach(r=>{e.window.showErrorMessage(r)})}};ve.ErrorMessageTracker=Wm;var jl=class{constructor(){}rawAttach(e){this._rawConnection=e}attach(e){this._connection=e}get connection(){if(!this._connection)throw new Error("Remote is not attached to a connection yet.");return this._connection}fillServerCapabilities(e){}initialize(e){}error(e){this.send(G.MessageType.Error,e)}warn(e){this.send(G.MessageType.Warning,e)}info(e){this.send(G.MessageType.Info,e)}log(e){this.send(G.MessageType.Log,e)}send(e,r){this._rawConnection&&this._rawConnection.sendNotification(G.LogMessageNotification.type,{type:e,message:r}).catch(()=>{(0,G.RAL)().console.error("Sending log message failed")})}},Bm=class{constructor(){}attach(e){this._connection=e}get connection(){if(!this._connection)throw new Error("Remote is not attached to a connection yet.");return this._connection}initialize(e){}fillServerCapabilities(e){}showErrorMessage(e,...r){let n={type:G.MessageType.Error,message:e,actions:r};return this.connection.sendRequest(G.ShowMessageRequest.type,n).then(Gm)}showWarningMessage(e,...r){let n={type:G.MessageType.Warning,message:e,actions:r};return this.connection.sendRequest(G.ShowMessageRequest.type,n).then(Gm)}showInformationMessage(e,...r){let n={type:G.MessageType.Info,message:e,actions:r};return this.connection.sendRequest(G.ShowMessageRequest.type,n).then(Gm)}},ab=(0,MU.ShowDocumentFeature)((0,te.ProgressFeature)(Bm)),KU;(function(t){function e(){return new Ul}t.create=e})(KU=ve.BulkRegistration||(ve.BulkRegistration={}));var Ul=class{constructor(){this._registrations=[],this._registered=new Set}add(e,r){let n=Ur.string(e)?e:e.method;if(this._registered.has(n))throw new Error(`${n} is already added to this registration`);let i=Hm.generateUuid();this._registrations.push({id:i,method:n,registerOptions:r||{}}),this._registered.add(n)}asRegistrationParams(){return{registrations:this._registrations}}},zU;(function(t){function e(){return new ju(void 0,[])}t.create=e})(zU=ve.BulkUnregistration||(ve.BulkUnregistration={}));var ju=class{constructor(e,r){this._connection=e,this._unregistrations=new Map,r.forEach(n=>{this._unregistrations.set(n.method,n)})}get isAttached(){return!!this._connection}attach(e){this._connection=e}add(e){this._unregistrations.set(e.method,e)}dispose(){let e=[];for(let n of this._unregistrations.values())e.push(n);let r={unregisterations:e};this._connection.sendRequest(G.UnregistrationRequest.type,r).catch(()=>{this._connection.console.info("Bulk unregistration failed.")})}disposeSingle(e){let r=Ur.string(e)?e:e.method,n=this._unregistrations.get(r);if(!n)return!1;let i={unregisterations:[n]};return this._connection.sendRequest(G.UnregistrationRequest.type,i).then(()=>{this._unregistrations.delete(r)},o=>{this._connection.console.info(`Un-registering request handler for ${n.id} failed.`)}),!0}},Gl=class{attach(e){this._connection=e}get connection(){if(!this._connection)throw new Error("Remote is not attached to a connection yet.");return this._connection}initialize(e){}fillServerCapabilities(e){}register(e,r,n){return e instanceof Ul?this.registerMany(e):e instanceof ju?this.registerSingle1(e,r,n):this.registerSingle2(e,r)}registerSingle1(e,r,n){let i=Ur.string(r)?r:r.method,o=Hm.generateUuid(),a={registrations:[{id:o,method:i,registerOptions:n||{}}]};return e.isAttached||e.attach(this.connection),this.connection.sendRequest(G.RegistrationRequest.type,a).then(s=>(e.add({id:o,method:i}),e),s=>(this.connection.console.info(`Registering request handler for ${i} failed.`),Promise.reject(s)))}registerSingle2(e,r){let n=Ur.string(e)?e:e.method,i=Hm.generateUuid(),o={registrations:[{id:i,method:n,registerOptions:r||{}}]};return this.connection.sendRequest(G.RegistrationRequest.type,o).then(a=>G.Disposable.create(()=>{this.unregisterSingle(i,n).catch(()=>{this.connection.console.info(`Un-registering capability with id ${i} failed.`)})}),a=>(this.connection.console.info(`Registering request handler for ${n} failed.`),Promise.reject(a)))}unregisterSingle(e,r){let n={unregisterations:[{id:e,method:r}]};return this.connection.sendRequest(G.UnregistrationRequest.type,n).catch(()=>{this.connection.console.info(`Un-registering request handler for ${e} failed.`)})}registerMany(e){let r=e.asRegistrationParams();return this.connection.sendRequest(G.RegistrationRequest.type,r).then(()=>new ju(this._connection,r.registrations.map(n=>({id:n.id,method:n.method}))),n=>(this.connection.console.info("Bulk registration failed."),Promise.reject(n)))}},Km=class{constructor(){}attach(e){this._connection=e}get connection(){if(!this._connection)throw new Error("Remote is not attached to a connection yet.");return this._connection}initialize(e){}fillServerCapabilities(e){}applyEdit(e){function r(i){return i&&!!i.edit}let n=r(e)?e:{edit:e};return this.connection.sendRequest(G.ApplyWorkspaceEditRequest.type,n)}},sb=(0,$U.FileOperationsFeature)((0,xU.WorkspaceFoldersFeature)((0,IU.ConfigurationFeature)(Km))),Hl=class{constructor(){this._trace=G.Trace.Off}attach(e){this._connection=e}get connection(){if(!this._connection)throw new Error("Remote is not attached to a connection yet.");return this._connection}initialize(e){}fillServerCapabilities(e){}set trace(e){this._trace=e}log(e,r){this._trace!==G.Trace.Off&&this.connection.sendNotification(G.LogTraceNotification.type,{message:e,verbose:this._trace===G.Trace.Verbose?r:void 0}).catch(()=>{})}},Wl=class{constructor(){}attach(e){this._connection=e}get connection(){if(!this._connection)throw new Error("Remote is not attached to a connection yet.");return this._connection}initialize(e){}fillServerCapabilities(e){}logEvent(e){this.connection.sendNotification(G.TelemetryEventNotification.type,e).catch(()=>{this.connection.console.log("Sending TelemetryEventNotification failed")})}},Bl=class{constructor(){}attach(e){this._connection=e}get connection(){if(!this._connection)throw new Error("Remote is not attached to a connection yet.");return this._connection}initialize(e){}fillServerCapabilities(e){}attachWorkDoneProgress(e){return(0,te.attachWorkDone)(this.connection,e)}attachPartialResultProgress(e,r){return(0,te.attachPartialResult)(this.connection,r)}};ve._LanguagesImpl=Bl;var ub=(0,BU.MonikerFeature)((0,HU.DiagnosticFeature)((0,GU.InlayHintFeature)((0,UU.InlineValueFeature)((0,jU.TypeHierarchyFeature)((0,FU.LinkedEditingRangeFeature)((0,LU.SemanticTokensFeature)((0,qU.CallHierarchyFeature)(Bl)))))))),Kl=class{constructor(){}attach(e){this._connection=e}get connection(){if(!this._connection)throw new Error("Remote is not attached to a connection yet.");return this._connection}initialize(e){}fillServerCapabilities(e){}attachWorkDoneProgress(e){return(0,te.attachWorkDone)(this.connection,e)}attachPartialResultProgress(e,r){return(0,te.attachPartialResult)(this.connection,r)}};ve._NotebooksImpl=Kl;var cb=(0,WU.NotebookSyncFeature)(Kl);function lb(t,e){return function(r){return e(t(r))}}ve.combineConsoleFeatures=lb;function db(t,e){return function(r){return e(t(r))}}ve.combineTelemetryFeatures=db;function fb(t,e){return function(r){return e(t(r))}}ve.combineTracerFeatures=fb;function pb(t,e){return function(r){return e(t(r))}}ve.combineClientFeatures=pb;function hb(t,e){return function(r){return e(t(r))}}ve.combineWindowFeatures=hb;function mb(t,e){return function(r){return e(t(r))}}ve.combineWorkspaceFeatures=mb;function gb(t,e){return function(r){return e(t(r))}}ve.combineLanguagesFeatures=gb;function yb(t,e){return function(r){return e(t(r))}}ve.combineNotebooksFeatures=yb;function VU(t,e){function r(i,o,a){return i&&o?a(i,o):i||o}return{__brand:"features",console:r(t.console,e.console,lb),tracer:r(t.tracer,e.tracer,fb),telemetry:r(t.telemetry,e.telemetry,db),client:r(t.client,e.client,pb),window:r(t.window,e.window,hb),workspace:r(t.workspace,e.workspace,mb),languages:r(t.languages,e.languages,gb),notebooks:r(t.notebooks,e.notebooks,yb)}}ve.combineFeatures=VU;function YU(t,e,r){let n=r&&r.console?new(r.console(jl)):new jl,i=t(n);n.rawAttach(i);let o=r&&r.tracer?new(r.tracer(Hl)):new Hl,a=r&&r.telemetry?new(r.telemetry(Wl)):new Wl,s=r&&r.client?new(r.client(Gl)):new Gl,u=r&&r.window?new(r.window(ab)):new ab,c=r&&r.workspace?new(r.workspace(sb)):new sb,l=r&&r.languages?new(r.languages(ub)):new ub,d=r&&r.notebooks?new(r.notebooks(cb)):new cb,h=[n,o,a,s,u,c,l,d];function v(A){return A instanceof Promise?A:Ur.thenable(A)?new Promise((b,O)=>{A.then($=>b($),$=>O($))}):Promise.resolve(A)}let g,R,E,N={listen:()=>i.listen(),sendRequest:(A,...b)=>i.sendRequest(Ur.string(A)?A:A.method,...b),onRequest:(A,b)=>i.onRequest(A,b),sendNotification:(A,b)=>{let O=Ur.string(A)?A:A.method;return arguments.length===1?i.sendNotification(O):i.sendNotification(O,b)},onNotification:(A,b)=>i.onNotification(A,b),onProgress:i.onProgress,sendProgress:i.sendProgress,onInitialize:A=>(R=A,{dispose:()=>{R=void 0}}),onInitialized:A=>i.onNotification(G.InitializedNotification.type,A),onShutdown:A=>(g=A,{dispose:()=>{g=void 0}}),onExit:A=>(E=A,{dispose:()=>{E=void 0}}),get console(){return n},get telemetry(){return a},get tracer(){return o},get client(){return s},get window(){return u},get workspace(){return c},get languages(){return l},get notebooks(){return d},onDidChangeConfiguration:A=>i.onNotification(G.DidChangeConfigurationNotification.type,A),onDidChangeWatchedFiles:A=>i.onNotification(G.DidChangeWatchedFilesNotification.type,A),__textDocumentSync:void 0,onDidOpenTextDocument:A=>i.onNotification(G.DidOpenTextDocumentNotification.type,A),onDidChangeTextDocument:A=>i.onNotification(G.DidChangeTextDocumentNotification.type,A),onDidCloseTextDocument:A=>i.onNotification(G.DidCloseTextDocumentNotification.type,A),onWillSaveTextDocument:A=>i.onNotification(G.WillSaveTextDocumentNotification.type,A),onWillSaveTextDocumentWaitUntil:A=>i.onRequest(G.WillSaveTextDocumentWaitUntilRequest.type,A),onDidSaveTextDocument:A=>i.onNotification(G.DidSaveTextDocumentNotification.type,A),sendDiagnostics:A=>i.sendNotification(G.PublishDiagnosticsNotification.type,A),onHover:A=>i.onRequest(G.HoverRequest.type,(b,O)=>A(b,O,(0,te.attachWorkDone)(i,b),void 0)),onCompletion:A=>i.onRequest(G.CompletionRequest.type,(b,O)=>A(b,O,(0,te.attachWorkDone)(i,b),(0,te.attachPartialResult)(i,b))),onCompletionResolve:A=>i.onRequest(G.CompletionResolveRequest.type,A),onSignatureHelp:A=>i.onRequest(G.SignatureHelpRequest.type,(b,O)=>A(b,O,(0,te.attachWorkDone)(i,b),void 0)),onDeclaration:A=>i.onRequest(G.DeclarationRequest.type,(b,O)=>A(b,O,(0,te.attachWorkDone)(i,b),(0,te.attachPartialResult)(i,b))),onDefinition:A=>i.onRequest(G.DefinitionRequest.type,(b,O)=>A(b,O,(0,te.attachWorkDone)(i,b),(0,te.attachPartialResult)(i,b))),onTypeDefinition:A=>i.onRequest(G.TypeDefinitionRequest.type,(b,O)=>A(b,O,(0,te.attachWorkDone)(i,b),(0,te.attachPartialResult)(i,b))),onImplementation:A=>i.onRequest(G.ImplementationRequest.type,(b,O)=>A(b,O,(0,te.attachWorkDone)(i,b),(0,te.attachPartialResult)(i,b))),onReferences:A=>i.onRequest(G.ReferencesRequest.type,(b,O)=>A(b,O,(0,te.attachWorkDone)(i,b),(0,te.attachPartialResult)(i,b))),onDocumentHighlight:A=>i.onRequest(G.DocumentHighlightRequest.type,(b,O)=>A(b,O,(0,te.attachWorkDone)(i,b),(0,te.attachPartialResult)(i,b))),onDocumentSymbol:A=>i.onRequest(G.DocumentSymbolRequest.type,(b,O)=>A(b,O,(0,te.attachWorkDone)(i,b),(0,te.attachPartialResult)(i,b))),onWorkspaceSymbol:A=>i.onRequest(G.WorkspaceSymbolRequest.type,(b,O)=>A(b,O,(0,te.attachWorkDone)(i,b),(0,te.attachPartialResult)(i,b))),onWorkspaceSymbolResolve:A=>i.onRequest(G.WorkspaceSymbolResolveRequest.type,A),onCodeAction:A=>i.onRequest(G.CodeActionRequest.type,(b,O)=>A(b,O,(0,te.attachWorkDone)(i,b),(0,te.attachPartialResult)(i,b))),onCodeActionResolve:A=>i.onRequest(G.CodeActionResolveRequest.type,(b,O)=>A(b,O)),onCodeLens:A=>i.onRequest(G.CodeLensRequest.type,(b,O)=>A(b,O,(0,te.attachWorkDone)(i,b),(0,te.attachPartialResult)(i,b))),onCodeLensResolve:A=>i.onRequest(G.CodeLensResolveRequest.type,(b,O)=>A(b,O)),onDocumentFormatting:A=>i.onRequest(G.DocumentFormattingRequest.type,(b,O)=>A(b,O,(0,te.attachWorkDone)(i,b),void 0)),onDocumentRangeFormatting:A=>i.onRequest(G.DocumentRangeFormattingRequest.type,(b,O)=>A(b,O,(0,te.attachWorkDone)(i,b),void 0)),onDocumentOnTypeFormatting:A=>i.onRequest(G.DocumentOnTypeFormattingRequest.type,(b,O)=>A(b,O)),onRenameRequest:A=>i.onRequest(G.RenameRequest.type,(b,O)=>A(b,O,(0,te.attachWorkDone)(i,b),void 0)),onPrepareRename:A=>i.onRequest(G.PrepareRenameRequest.type,(b,O)=>A(b,O)),onDocumentLinks:A=>i.onRequest(G.DocumentLinkRequest.type,(b,O)=>A(b,O,(0,te.attachWorkDone)(i,b),(0,te.attachPartialResult)(i,b))),onDocumentLinkResolve:A=>i.onRequest(G.DocumentLinkResolveRequest.type,(b,O)=>A(b,O)),onDocumentColor:A=>i.onRequest(G.DocumentColorRequest.type,(b,O)=>A(b,O,(0,te.attachWorkDone)(i,b),(0,te.attachPartialResult)(i,b))),onColorPresentation:A=>i.onRequest(G.ColorPresentationRequest.type,(b,O)=>A(b,O,(0,te.attachWorkDone)(i,b),(0,te.attachPartialResult)(i,b))),onFoldingRanges:A=>i.onRequest(G.FoldingRangeRequest.type,(b,O)=>A(b,O,(0,te.attachWorkDone)(i,b),(0,te.attachPartialResult)(i,b))),onSelectionRanges:A=>i.onRequest(G.SelectionRangeRequest.type,(b,O)=>A(b,O,(0,te.attachWorkDone)(i,b),(0,te.attachPartialResult)(i,b))),onExecuteCommand:A=>i.onRequest(G.ExecuteCommandRequest.type,(b,O)=>A(b,O,(0,te.attachWorkDone)(i,b),void 0)),dispose:()=>i.dispose()};for(let A of h)A.attach(N);return i.onRequest(G.InitializeRequest.type,A=>{e.initialize(A),Ur.string(A.trace)&&(o.trace=G.Trace.fromString(A.trace));for(let b of h)b.initialize(A.capabilities);if(R){let b=R(A,new G.CancellationTokenSource().token,(0,te.attachWorkDone)(i,A),void 0);return v(b).then(O=>{if(O instanceof G.ResponseError)return O;let $=O;$||($={capabilities:{}});let B=$.capabilities;B||(B={},$.capabilities=B),B.textDocumentSync===void 0||B.textDocumentSync===null?B.textDocumentSync=Ur.number(N.__textDocumentSync)?N.__textDocumentSync:G.TextDocumentSyncKind.None:!Ur.number(B.textDocumentSync)&&!Ur.number(B.textDocumentSync.change)&&(B.textDocumentSync.change=Ur.number(N.__textDocumentSync)?N.__textDocumentSync:G.TextDocumentSyncKind.None);for(let ee of h)ee.fillServerCapabilities(B);return $})}else{let b={capabilities:{textDocumentSync:G.TextDocumentSyncKind.None}};for(let O of h)O.fillServerCapabilities(b.capabilities);return b}}),i.onRequest(G.ShutdownRequest.type,()=>{if(e.shutdownReceived=!0,g)return g(new G.CancellationTokenSource().token)}),i.onNotification(G.ExitNotification.type,()=>{try{E&&E()}finally{e.shutdownReceived?e.exit(0):e.exit(1)}}),i.onNotification(G.SetTraceNotification.type,A=>{o.trace=G.Trace.fromString(A.value)}),N}ve.createConnection=YU});var zm=f(zt=>{"use strict";var XU=zt&&zt.__createBinding||(Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]}),_b=zt&&zt.__exportStar||function(t,e){for(var r in t)r!=="default"&&!Object.prototype.hasOwnProperty.call(e,r)&&XU(e,t,r)};Object.defineProperty(zt,"__esModule",{value:!0});zt.ProposedFeatures=zt.NotebookDocuments=zt.TextDocuments=zt.SemanticTokensBuilder=void 0;var JU=wm();Object.defineProperty(zt,"SemanticTokensBuilder",{enumerable:!0,get:function(){return JU.SemanticTokensBuilder}});_b(At(),zt);var QU=Dm();Object.defineProperty(zt,"TextDocuments",{enumerable:!0,get:function(){return QU.TextDocuments}});var ZU=xm();Object.defineProperty(zt,"NotebookDocuments",{enumerable:!0,get:function(){return ZU.NotebookDocuments}});_b(vb(),zt);var eG;(function(t){t.all={__brand:"features"}})(eG=zt.ProposedFeatures||(zt.ProposedFeatures={}))});var Rb=f((Xde,Tb)=>{"use strict";Tb.exports=At()});var Ie=f(jn=>{"use strict";var tG=jn&&jn.__createBinding||(Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]}),Ab=jn&&jn.__exportStar||function(t,e){for(var r in t)r!=="default"&&!Object.prototype.hasOwnProperty.call(e,r)&&tG(e,t,r)};Object.defineProperty(jn,"__esModule",{value:!0});jn.createConnection=void 0;var zl=zm();Ab(Rb(),jn);Ab(zm(),jn);var bb=!1,rG={initialize:t=>{},get shutdownReceived(){return bb},set shutdownReceived(t){bb=t},exit:t=>{}};function nG(t,e,r,n){let i,o,a,s;t!==void 0&&t.__brand==="features"&&(i=t,t=e,e=r,r=n),zl.ConnectionStrategy.is(t)||zl.ConnectionOptions.is(t)?s=t:(o=t,a=e,s=r);let u=c=>(0,zl.createProtocolConnection)(o,a,c,s);return(0,zl.createConnection)(u,rG,i)}jn.createConnection=nG});var Xm={};z1(Xm,{TextDocument:()=>Vm});function Ym(t,e){if(t.length<=1)return t;let r=t.length/2|0,n=t.slice(0,r),i=t.slice(r);Ym(n,e),Ym(i,e);let o=0,a=0,s=0;for(;o<n.length&&a<i.length;)e(n[o],i[a])<=0?t[s++]=n[o++]:t[s++]=i[a++];for(;o<n.length;)t[s++]=n[o++];for(;a<i.length;)t[s++]=i[a++];return t}function Pb(t,e,r=0){let n=e?[r]:[];for(let i=0;i<t.length;i++){let o=t.charCodeAt(i);(o===13||o===10)&&(o===13&&i+1<t.length&&t.charCodeAt(i+1)===10&&i++,n.push(r+i+1))}return n}function Sb(t){let e=t.start,r=t.end;return e.line>r.line||e.line===r.line&&e.character>r.character?{start:r,end:e}:t}function iG(t){let e=Sb(t.range);return e!==t.range?{newText:t.newText,range:e}:t}var Go,Vm,Jm=K1(()=>{"use strict";Go=class{constructor(e,r,n,i){this._uri=e,this._languageId=r,this._version=n,this._content=i,this._lineOffsets=void 0}get uri(){return this._uri}get languageId(){return this._languageId}get version(){return this._version}getText(e){if(e){let r=this.offsetAt(e.start),n=this.offsetAt(e.end);return this._content.substring(r,n)}return this._content}update(e,r){for(let n of e)if(Go.isIncremental(n)){let i=Sb(n.range),o=this.offsetAt(i.start),a=this.offsetAt(i.end);this._content=this._content.substring(0,o)+n.text+this._content.substring(a,this._content.length);let s=Math.max(i.start.line,0),u=Math.max(i.end.line,0),c=this._lineOffsets,l=Pb(n.text,!1,o);if(u-s===l.length)for(let h=0,v=l.length;h<v;h++)c[h+s+1]=l[h];else l.length<1e4?c.splice(s+1,u-s,...l):this._lineOffsets=c=c.slice(0,s+1).concat(l,c.slice(u+1));let d=n.text.length-(a-o);if(d!==0)for(let h=s+1+l.length,v=c.length;h<v;h++)c[h]=c[h]+d}else if(Go.isFull(n))this._content=n.text,this._lineOffsets=void 0;else throw new Error("Unknown change event received");this._version=r}getLineOffsets(){return this._lineOffsets===void 0&&(this._lineOffsets=Pb(this._content,!0)),this._lineOffsets}positionAt(e){e=Math.max(Math.min(e,this._content.length),0);let r=this.getLineOffsets(),n=0,i=r.length;if(i===0)return{line:0,character:e};for(;n<i;){let a=Math.floor((n+i)/2);r[a]>e?i=a:n=a+1}let o=n-1;return{line:o,character:e-r[o]}}offsetAt(e){let r=this.getLineOffsets();if(e.line>=r.length)return this._content.length;if(e.line<0)return 0;let n=r[e.line],i=e.line+1<r.length?r[e.line+1]:this._content.length;return Math.max(Math.min(n+e.character,i),n)}get lineCount(){return this.getLineOffsets().length}static isIncremental(e){let r=e;return r!=null&&typeof r.text=="string"&&r.range!==void 0&&(r.rangeLength===void 0||typeof r.rangeLength=="number")}static isFull(e){let r=e;return r!=null&&typeof r.text=="string"&&r.range===void 0&&r.rangeLength===void 0}};(function(t){function e(i,o,a,s){return new Go(i,o,a,s)}t.create=e;function r(i,o,a){if(i instanceof Go)return i.update(o,a),i;throw new Error("TextDocument.update: document must be created by TextDocument.create")}t.update=r;function n(i,o){let a=i.getText(),s=Ym(o.map(iG),(l,d)=>{let h=l.range.start.line-d.range.start.line;return h===0?l.range.start.character-d.range.start.character:h}),u=0,c=[];for(let l of s){let d=i.offsetAt(l.range.start);if(d<u)throw new Error("Overlapping edit");d>u&&c.push(a.substring(u,d)),l.newText.length&&c.push(l.newText),u=i.offsetAt(l.range.end)}return c.push(a.substr(u)),c.join("")}t.applyEdits=n})(Vm||(Vm={}))});var er=f($t=>{"use strict";Object.defineProperty($t,"__esModule",{value:!0});$t.isRootCstNode=$t.isLeafCstNode=$t.isCompositeCstNode=$t.AbstractAstReflection=$t.isLinkingError=$t.isAstNodeDescription=$t.isReference=$t.isAstNode=void 0;function Zm(t){return typeof t=="object"&&t!==null&&typeof t.$type=="string"}$t.isAstNode=Zm;function Cb(t){return typeof t=="object"&&t!==null&&typeof t.$refText=="string"}$t.isReference=Cb;function oG(t){return typeof t=="object"&&t!==null&&typeof t.name=="string"&&typeof t.type=="string"&&typeof t.path=="string"}$t.isAstNodeDescription=oG;function aG(t){return typeof t=="object"&&t!==null&&Zm(t.container)&&Cb(t.reference)&&typeof t.message=="string"}$t.isLinkingError=aG;var Qm=class{constructor(){this.subtypes={},this.allSubtypes={}}isInstance(e,r){return Zm(e)&&this.isSubtype(e.$type,r)}isSubtype(e,r){if(e===r)return!0;let n=this.subtypes[e];n||(n=this.subtypes[e]={});let i=n[r];if(i!==void 0)return i;{let o=this.computeIsSubtype(e,r);return n[r]=o,o}}getAllSubTypes(e){let r=this.allSubtypes[e];if(r)return r;{let n=this.getAllTypes(),i=[];for(let o of n)this.isSubtype(o,e)&&i.push(o);return this.allSubtypes[e]=i,i}}};$t.AbstractAstReflection=Qm;function Eb(t){return typeof t=="object"&&t!==null&&"children"in t}$t.isCompositeCstNode=Eb;function sG(t){return typeof t=="object"&&t!==null&&"tokenType"in t}$t.isLeafCstNode=sG;function uG(t){return Eb(t)&&"fullText"in t}$t.isRootCstNode=uG});var Ft=f(Ve=>{"use strict";Object.defineProperty(Ve,"__esModule",{value:!0});Ve.Reduction=Ve.TreeStreamImpl=Ve.stream=Ve.DONE_RESULT=Ve.EMPTY_STREAM=Ve.StreamImpl=void 0;var Vt=class{constructor(e,r){this.startFn=e,this.nextFn=r}iterator(){let e={state:this.startFn(),next:()=>this.nextFn(e.state),[Symbol.iterator]:()=>e};return e}[Symbol.iterator](){return this.iterator()}isEmpty(){let e=this.iterator();return Boolean(e.next().done)}count(){let e=this.iterator(),r=0,n=e.next();for(;!n.done;)r++,n=e.next();return r}toArray(){let e=[],r=this.iterator(),n;do n=r.next(),n.value!==void 0&&e.push(n.value);while(!n.done);return e}toSet(){return new Set(this)}toMap(e,r){let n=this.map(i=>[e?e(i):i,r?r(i):i]);return new Map(n)}toString(){return this.join()}concat(e){let r=e[Symbol.iterator]();return new Vt(()=>({first:this.startFn(),firstDone:!1}),n=>{let i;if(!n.firstDone){do if(i=this.nextFn(n.first),!i.done)return i;while(!i.done);n.firstDone=!0}do if(i=r.next(),!i.done)return i;while(!i.done);return Ve.DONE_RESULT})}join(e=","){let r=this.iterator(),n="",i,o=!1;do i=r.next(),i.done||(o&&(n+=e),n+=cG(i.value)),o=!0;while(!i.done);return n}indexOf(e,r=0){let n=this.iterator(),i=0,o=n.next();for(;!o.done;){if(i>=r&&o.value===e)return i;o=n.next(),i++}return-1}every(e){let r=this.iterator(),n=r.next();for(;!n.done;){if(!e(n.value))return!1;n=r.next()}return!0}some(e){let r=this.iterator(),n=r.next();for(;!n.done;){if(e(n.value))return!0;n=r.next()}return!1}forEach(e){let r=this.iterator(),n=0,i=r.next();for(;!i.done;)e(i.value,n),i=r.next(),n++}map(e){return new Vt(this.startFn,r=>{let{done:n,value:i}=this.nextFn(r);return n?Ve.DONE_RESULT:{done:!1,value:e(i)}})}filter(e){return new Vt(this.startFn,r=>{let n;do if(n=this.nextFn(r),!n.done&&e(n.value))return n;while(!n.done);return Ve.DONE_RESULT})}nonNullable(){return this.filter(e=>e!=null)}reduce(e,r){let n=this.iterator(),i=r,o=n.next();for(;!o.done;)i===void 0?i=o.value:i=e(i,o.value),o=n.next();return i}reduceRight(e,r){return this.recursiveReduce(this.iterator(),e,r)}recursiveReduce(e,r,n){let i=e.next();if(i.done)return n;let o=this.recursiveReduce(e,r,n);return o===void 0?i.value:r(o,i.value)}find(e){let r=this.iterator(),n=r.next();for(;!n.done;){if(e(n.value))return n.value;n=r.next()}}findIndex(e){let r=this.iterator(),n=0,i=r.next();for(;!i.done;){if(e(i.value))return n;i=r.next(),n++}return-1}includes(e){let r=this.iterator(),n=r.next();for(;!n.done;){if(n.value===e)return!0;n=r.next()}return!1}flatMap(e){return new Vt(()=>({this:this.startFn()}),r=>{do{if(r.iterator){let o=r.iterator.next();if(o.done)r.iterator=void 0;else return o}let{done:n,value:i}=this.nextFn(r.this);if(!n){let o=e(i);if(Vl(o))r.iterator=o[Symbol.iterator]();else return{done:!1,value:o}}}while(r.iterator);return Ve.DONE_RESULT})}flat(e){if(e===void 0&&(e=1),e<=0)return this;let r=e>1?this.flat(e-1):this;return new Vt(()=>({this:r.startFn()}),n=>{do{if(n.iterator){let a=n.iterator.next();if(a.done)n.iterator=void 0;else return a}let{done:i,value:o}=r.nextFn(n.this);if(!i)if(Vl(o))n.iterator=o[Symbol.iterator]();else return{done:!1,value:o}}while(n.iterator);return Ve.DONE_RESULT})}head(){let r=this.iterator().next();if(!r.done)return r.value}tail(e=1){return new Vt(()=>{let r=this.startFn();for(let n=0;n<e;n++)if(this.nextFn(r).done)return r;return r},this.nextFn)}limit(e){return new Vt(()=>({size:0,state:this.startFn()}),r=>(r.size++,r.size>e?Ve.DONE_RESULT:this.nextFn(r.state)))}distinct(e){let r=new Set;return this.filter(n=>{let i=e?e(n):n;return r.has(i)?!1:(r.add(i),!0)})}exclude(e,r){let n=new Set;for(let i of e){let o=r?r(i):i;n.add(o)}return this.filter(i=>{let o=r?r(i):i;return!n.has(o)})}};Ve.StreamImpl=Vt;function cG(t){return typeof t=="string"?t:typeof t>"u"?"undefined":typeof t.toString=="function"?t.toString():Object.prototype.toString.call(t)}function Vl(t){return!!t&&typeof t[Symbol.iterator]=="function"}Ve.EMPTY_STREAM=new Vt(()=>{},()=>Ve.DONE_RESULT);Ve.DONE_RESULT=Object.freeze({done:!0,value:void 0});function lG(...t){if(t.length===1){let e=t[0];if(e instanceof Vt)return e;if(Vl(e))return new Vt(()=>e[Symbol.iterator](),r=>r.next());if(typeof e.length=="number")return new Vt(()=>({index:0}),r=>r.index<e.length?{done:!1,value:e[r.index++]}:Ve.DONE_RESULT)}return t.length>1?new Vt(()=>({collIndex:0,arrIndex:0}),e=>{do{if(e.iterator){let r=e.iterator.next();if(!r.done)return r;e.iterator=void 0}if(e.array){if(e.arrIndex<e.array.length)return{done:!1,value:e.array[e.arrIndex++]};e.array=void 0,e.arrIndex=0}if(e.collIndex<t.length){let r=t[e.collIndex++];Vl(r)?e.iterator=r[Symbol.iterator]():r&&typeof r.length=="number"&&(e.array=r)}}while(e.iterator||e.array||e.collIndex<t.length);return Ve.DONE_RESULT}):Ve.EMPTY_STREAM}Ve.stream=lG;var eg=class extends Vt{constructor(e,r,n){super(()=>({iterators:n?.includeRoot?[[e][Symbol.iterator]()]:[r(e)[Symbol.iterator]()],pruned:!1}),i=>{for(i.pruned&&(i.iterators.pop(),i.pruned=!1);i.iterators.length>0;){let a=i.iterators[i.iterators.length-1].next();if(a.done)i.iterators.pop();else return i.iterators.push(r(a.value)[Symbol.iterator]()),a}return Ve.DONE_RESULT})}iterator(){let e={state:this.startFn(),next:()=>this.nextFn(e.state),prune:()=>{e.state.pruned=!0},[Symbol.iterator]:()=>e};return e}};Ve.TreeStreamImpl=eg;var dG;(function(t){function e(o){return o.reduce((a,s)=>a+s,0)}t.sum=e;function r(o){return o.reduce((a,s)=>a*s,0)}t.product=r;function n(o){return o.reduce((a,s)=>Math.min(a,s))}t.min=n;function i(o){return o.reduce((a,s)=>Math.max(a,s))}t.max=i})(dG=Ve.Reduction||(Ve.Reduction={}))});var qe=f(ue=>{"use strict";Object.defineProperty(ue,"__esModule",{value:!0});ue.getInteriorNodes=ue.getStartlineNode=ue.getNextNode=ue.getPreviousNode=ue.findLeafNodeAtOffset=ue.isCommentNode=ue.findCommentNode=ue.findDeclarationNodeAtOffset=ue.DefaultNameRegexp=ue.inRange=ue.compareRange=ue.RangeComparison=ue.toDocumentSegment=ue.tokenToRange=ue.isCstChildNode=ue.flattenCst=ue.streamCst=void 0;var Wa=er(),fG=Ft();function kb(t){return new fG.TreeStreamImpl(t,e=>(0,Wa.isCompositeCstNode)(e)?e.children:[],{includeRoot:!0})}ue.streamCst=kb;function pG(t){return kb(t).filter(Wa.isLeafCstNode)}ue.flattenCst=pG;function hG(t,e){for(;t.parent;)if(t=t.parent,t===e)return!0;return!1}ue.isCstChildNode=hG;function mG(t){return{start:{character:t.startColumn-1,line:t.startLine-1},end:{character:t.endColumn,line:t.endLine-1}}}ue.tokenToRange=mG;function gG(t){if(!t)return;let{offset:e,end:r,range:n}=t;return{range:n,offset:e,end:r,length:r-e}}ue.toDocumentSegment=gG;var Ho;(function(t){t[t.Before=0]="Before",t[t.After=1]="After",t[t.OverlapFront=2]="OverlapFront",t[t.OverlapBack=3]="OverlapBack",t[t.Inside=4]="Inside"})(Ho=ue.RangeComparison||(ue.RangeComparison={}));function wb(t,e){if(t.end.line<e.start.line||t.end.line===e.start.line&&t.end.character<t.start.character)return Ho.Before;if(t.start.line>e.end.line||t.start.line===e.end.line&&t.start.character>e.end.character)return Ho.After;let r=t.start.line>e.start.line||t.start.line===e.start.line&&t.start.character>=e.start.character,n=t.end.line<e.end.line||t.end.line===e.end.line&&t.end.character<=e.end.character;return r&&n?Ho.Inside:r?Ho.OverlapBack:Ho.OverlapFront}ue.compareRange=wb;function yG(t,e){return wb(t,e)>Ho.After}ue.inRange=yG;ue.DefaultNameRegexp=/^[\w\p{L}]$/u;function vG(t,e,r=ue.DefaultNameRegexp){if(t){if(e>0){let n=e-t.offset,i=t.text.charAt(n);r.test(i)||e--}return Yl(t,e)}}ue.findDeclarationNodeAtOffset=vG;function _G(t,e){if(t){let r=Ob(t,!0);if(r&&tg(r,e))return r;if((0,Wa.isRootCstNode)(t)){let n=t.children.findIndex(i=>!i.hidden);for(let i=n-1;i>=0;i--){let o=t.children[i];if(tg(o,e))return o}}}}ue.findCommentNode=_G;function tg(t,e){return(0,Wa.isLeafCstNode)(t)&&e.includes(t.tokenType.name)}ue.isCommentNode=tg;function Yl(t,e){if((0,Wa.isLeafCstNode)(t))return t;if((0,Wa.isCompositeCstNode)(t)){let r=0,n=t.children.length-1;for(;r<n;){let i=Math.floor((r+n)/2),o=t.children[i];if(o.offset>e)n=i-1;else if(o.end<=e)r=i+1;else return Yl(o,e)}if(r===n)return Yl(t.children[r],e)}}ue.findLeafNodeAtOffset=Yl;function Ob(t,e=!0){for(;t.parent;){let r=t.parent,n=r.children.indexOf(t);for(;n>0;){n--;let i=r.children[n];if(e||!i.hidden)return i}t=r}}ue.getPreviousNode=Ob;function TG(t,e=!0){for(;t.parent;){let r=t.parent,n=r.children.indexOf(t),i=r.children.length-1;for(;n<i;){n++;let o=r.children[n];if(e||!o.hidden)return o}t=r}}ue.getNextNode=TG;function RG(t){if(t.range.start.character===0)return t;let e=t.range.start.line,r=t,n;for(;t.parent;){let i=t.parent,o=n??i.children.indexOf(t);if(o===0?(t=i,n=void 0):(n=o-1,t=i.children[n]),t.range.start.line!==e)break;r=t}return r}ue.getStartlineNode=RG;function bG(t,e){let r=AG(t,e);return r?r.parent.children.slice(r.a+1,r.b):[]}ue.getInteriorNodes=bG;function AG(t,e){let r=Nb(t),n=Nb(e),i;for(let o=0;o<r.length&&o<n.length;o++){let a=r[o],s=n[o];if(a.parent===s.parent)i={parent:a.parent,a:a.index,b:s.index};else break}return i}function Nb(t){let e=[];for(;t.parent;){let r=t.parent,n=r.children.indexOf(t);e.push({parent:r,index:n}),t=r}return e.reverse()}});var Un=f((Uu,rg)=>{(function(t,e){if(typeof Uu=="object"&&typeof rg=="object")rg.exports=e();else if(typeof define=="function"&&define.amd)define([],e);else{var r=e();for(var n in r)(typeof Uu=="object"?Uu:t)[n]=r[n]}})(Uu,()=>(()=>{"use strict";var t={470:i=>{function o(u){if(typeof u!="string")throw new TypeError("Path must be a string. Received "+JSON.stringify(u))}function a(u,c){for(var l,d="",h=0,v=-1,g=0,R=0;R<=u.length;++R){if(R<u.length)l=u.charCodeAt(R);else{if(l===47)break;l=47}if(l===47){if(!(v===R-1||g===1))if(v!==R-1&&g===2){if(d.length<2||h!==2||d.charCodeAt(d.length-1)!==46||d.charCodeAt(d.length-2)!==46){if(d.length>2){var E=d.lastIndexOf("/");if(E!==d.length-1){E===-1?(d="",h=0):h=(d=d.slice(0,E)).length-1-d.lastIndexOf("/"),v=R,g=0;continue}}else if(d.length===2||d.length===1){d="",h=0,v=R,g=0;continue}}c&&(d.length>0?d+="/..":d="..",h=2)}else d.length>0?d+="/"+u.slice(v+1,R):d=u.slice(v+1,R),h=R-v-1;v=R,g=0}else l===46&&g!==-1?++g:g=-1}return d}var s={resolve:function(){for(var u,c="",l=!1,d=arguments.length-1;d>=-1&&!l;d--){var h;d>=0?h=arguments[d]:(u===void 0&&(u=process.cwd()),h=u),o(h),h.length!==0&&(c=h+"/"+c,l=h.charCodeAt(0)===47)}return c=a(c,!l),l?c.length>0?"/"+c:"/":c.length>0?c:"."},normalize:function(u){if(o(u),u.length===0)return".";var c=u.charCodeAt(0)===47,l=u.charCodeAt(u.length-1)===47;return(u=a(u,!c)).length!==0||c||(u="."),u.length>0&&l&&(u+="/"),c?"/"+u:u},isAbsolute:function(u){return o(u),u.length>0&&u.charCodeAt(0)===47},join:function(){if(arguments.length===0)return".";for(var u,c=0;c<arguments.length;++c){var l=arguments[c];o(l),l.length>0&&(u===void 0?u=l:u+="/"+l)}return u===void 0?".":s.normalize(u)},relative:function(u,c){if(o(u),o(c),u===c||(u=s.resolve(u))===(c=s.resolve(c)))return"";for(var l=1;l<u.length&&u.charCodeAt(l)===47;++l);for(var d=u.length,h=d-l,v=1;v<c.length&&c.charCodeAt(v)===47;++v);for(var g=c.length-v,R=h<g?h:g,E=-1,N=0;N<=R;++N){if(N===R){if(g>R){if(c.charCodeAt(v+N)===47)return c.slice(v+N+1);if(N===0)return c.slice(v+N)}else h>R&&(u.charCodeAt(l+N)===47?E=N:N===0&&(E=0));break}var A=u.charCodeAt(l+N);if(A!==c.charCodeAt(v+N))break;A===47&&(E=N)}var b="";for(N=l+E+1;N<=d;++N)N!==d&&u.charCodeAt(N)!==47||(b.length===0?b+="..":b+="/..");return b.length>0?b+c.slice(v+E):(v+=E,c.charCodeAt(v)===47&&++v,c.slice(v))},_makeLong:function(u){return u},dirname:function(u){if(o(u),u.length===0)return".";for(var c=u.charCodeAt(0),l=c===47,d=-1,h=!0,v=u.length-1;v>=1;--v)if((c=u.charCodeAt(v))===47){if(!h){d=v;break}}else h=!1;return d===-1?l?"/":".":l&&d===1?"//":u.slice(0,d)},basename:function(u,c){if(c!==void 0&&typeof c!="string")throw new TypeError('"ext" argument must be a string');o(u);var l,d=0,h=-1,v=!0;if(c!==void 0&&c.length>0&&c.length<=u.length){if(c.length===u.length&&c===u)return"";var g=c.length-1,R=-1;for(l=u.length-1;l>=0;--l){var E=u.charCodeAt(l);if(E===47){if(!v){d=l+1;break}}else R===-1&&(v=!1,R=l+1),g>=0&&(E===c.charCodeAt(g)?--g==-1&&(h=l):(g=-1,h=R))}return d===h?h=R:h===-1&&(h=u.length),u.slice(d,h)}for(l=u.length-1;l>=0;--l)if(u.charCodeAt(l)===47){if(!v){d=l+1;break}}else h===-1&&(v=!1,h=l+1);return h===-1?"":u.slice(d,h)},extname:function(u){o(u);for(var c=-1,l=0,d=-1,h=!0,v=0,g=u.length-1;g>=0;--g){var R=u.charCodeAt(g);if(R!==47)d===-1&&(h=!1,d=g+1),R===46?c===-1?c=g:v!==1&&(v=1):c!==-1&&(v=-1);else if(!h){l=g+1;break}}return c===-1||d===-1||v===0||v===1&&c===d-1&&c===l+1?"":u.slice(c,d)},format:function(u){if(u===null||typeof u!="object")throw new TypeError('The "pathObject" argument must be of type Object. Received type '+typeof u);return function(c,l){var d=l.dir||l.root,h=l.base||(l.name||"")+(l.ext||"");return d?d===l.root?d+h:d+"/"+h:h}(0,u)},parse:function(u){o(u);var c={root:"",dir:"",base:"",ext:"",name:""};if(u.length===0)return c;var l,d=u.charCodeAt(0),h=d===47;h?(c.root="/",l=1):l=0;for(var v=-1,g=0,R=-1,E=!0,N=u.length-1,A=0;N>=l;--N)if((d=u.charCodeAt(N))!==47)R===-1&&(E=!1,R=N+1),d===46?v===-1?v=N:A!==1&&(A=1):v!==-1&&(A=-1);else if(!E){g=N+1;break}return v===-1||R===-1||A===0||A===1&&v===R-1&&v===g+1?R!==-1&&(c.base=c.name=g===0&&h?u.slice(1,R):u.slice(g,R)):(g===0&&h?(c.name=u.slice(1,v),c.base=u.slice(1,R)):(c.name=u.slice(g,v),c.base=u.slice(g,R)),c.ext=u.slice(v,R)),g>0?c.dir=u.slice(0,g-1):h&&(c.dir="/"),c},sep:"/",delimiter:":",win32:null,posix:null};s.posix=s,i.exports=s},674:(i,o)=>{if(Object.defineProperty(o,"__esModule",{value:!0}),o.isWindows=void 0,typeof process=="object")o.isWindows=process.platform==="win32";else if(typeof navigator=="object"){var a=navigator.userAgent;o.isWindows=a.indexOf("Windows")>=0}},796:function(i,o,a){var s,u,c=this&&this.__extends||(s=function(L,q){return s=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(F,W){F.__proto__=W}||function(F,W){for(var ie in W)Object.prototype.hasOwnProperty.call(W,ie)&&(F[ie]=W[ie])},s(L,q)},function(L,q){if(typeof q!="function"&&q!==null)throw new TypeError("Class extends value "+String(q)+" is not a constructor or null");function F(){this.constructor=L}s(L,q),L.prototype=q===null?Object.create(q):(F.prototype=q.prototype,new F)});Object.defineProperty(o,"__esModule",{value:!0}),o.uriToFsPath=o.URI=void 0;var l=a(674),d=/^\w[\w\d+.-]*$/,h=/^\//,v=/^\/\//;function g(L,q){if(!L.scheme&&q)throw new Error('[UriError]: Scheme is missing: {scheme: "", authority: "'.concat(L.authority,'", path: "').concat(L.path,'", query: "').concat(L.query,'", fragment: "').concat(L.fragment,'"}'));if(L.scheme&&!d.test(L.scheme))throw new Error("[UriError]: Scheme contains illegal characters.");if(L.path){if(L.authority){if(!h.test(L.path))throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character')}else if(v.test(L.path))throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")')}}var R="",E="/",N=/^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/,A=function(){function L(q,F,W,ie,oe,J){J===void 0&&(J=!1),typeof q=="object"?(this.scheme=q.scheme||R,this.authority=q.authority||R,this.path=q.path||R,this.query=q.query||R,this.fragment=q.fragment||R):(this.scheme=function(dt,rt){return dt||rt?dt:"file"}(q,J),this.authority=F||R,this.path=function(dt,rt){switch(dt){case"https":case"http":case"file":rt?rt[0]!==E&&(rt=E+rt):rt=E}return rt}(this.scheme,W||R),this.query=ie||R,this.fragment=oe||R,g(this,J))}return L.isUri=function(q){return q instanceof L||!!q&&typeof q.authority=="string"&&typeof q.fragment=="string"&&typeof q.path=="string"&&typeof q.query=="string"&&typeof q.scheme=="string"&&typeof q.fsPath=="string"&&typeof q.with=="function"&&typeof q.toString=="function"},Object.defineProperty(L.prototype,"fsPath",{get:function(){return Fe(this,!1)},enumerable:!1,configurable:!0}),L.prototype.with=function(q){if(!q)return this;var F=q.scheme,W=q.authority,ie=q.path,oe=q.query,J=q.fragment;return F===void 0?F=this.scheme:F===null&&(F=R),W===void 0?W=this.authority:W===null&&(W=R),ie===void 0?ie=this.path:ie===null&&(ie=R),oe===void 0?oe=this.query:oe===null&&(oe=R),J===void 0?J=this.fragment:J===null&&(J=R),F===this.scheme&&W===this.authority&&ie===this.path&&oe===this.query&&J===this.fragment?this:new O(F,W,ie,oe,J)},L.parse=function(q,F){F===void 0&&(F=!1);var W=N.exec(q);return W?new O(W[2]||R,le(W[4]||R),le(W[5]||R),le(W[7]||R),le(W[9]||R),F):new O(R,R,R,R,R)},L.file=function(q){var F=R;if(l.isWindows&&(q=q.replace(/\\/g,E)),q[0]===E&&q[1]===E){var W=q.indexOf(E,2);W===-1?(F=q.substring(2),q=E):(F=q.substring(2,W),q=q.substring(W)||E)}return new O("file",F,q,R,R)},L.from=function(q){var F=new O(q.scheme,q.authority,q.path,q.query,q.fragment);return g(F,!0),F},L.prototype.toString=function(q){return q===void 0&&(q=!1),Ne(this,q)},L.prototype.toJSON=function(){return this},L.revive=function(q){if(q){if(q instanceof L)return q;var F=new O(q);return F._formatted=q.external,F._fsPath=q._sep===b?q.fsPath:null,F}return q},L}();o.URI=A;var b=l.isWindows?1:void 0,O=function(L){function q(){var F=L!==null&&L.apply(this,arguments)||this;return F._formatted=null,F._fsPath=null,F}return c(q,L),Object.defineProperty(q.prototype,"fsPath",{get:function(){return this._fsPath||(this._fsPath=Fe(this,!1)),this._fsPath},enumerable:!1,configurable:!0}),q.prototype.toString=function(F){return F===void 0&&(F=!1),F?Ne(this,!0):(this._formatted||(this._formatted=Ne(this,!1)),this._formatted)},q.prototype.toJSON=function(){var F={$mid:1};return this._fsPath&&(F.fsPath=this._fsPath,F._sep=b),this._formatted&&(F.external=this._formatted),this.path&&(F.path=this.path),this.scheme&&(F.scheme=this.scheme),this.authority&&(F.authority=this.authority),this.query&&(F.query=this.query),this.fragment&&(F.fragment=this.fragment),F},q}(A),$=((u={})[58]="%3A",u[47]="%2F",u[63]="%3F",u[35]="%23",u[91]="%5B",u[93]="%5D",u[64]="%40",u[33]="%21",u[36]="%24",u[38]="%26",u[39]="%27",u[40]="%28",u[41]="%29",u[42]="%2A",u[43]="%2B",u[44]="%2C",u[59]="%3B",u[61]="%3D",u[32]="%20",u);function B(L,q,F){for(var W=void 0,ie=-1,oe=0;oe<L.length;oe++){var J=L.charCodeAt(oe);if(J>=97&&J<=122||J>=65&&J<=90||J>=48&&J<=57||J===45||J===46||J===95||J===126||q&&J===47||F&&J===91||F&&J===93||F&&J===58)ie!==-1&&(W+=encodeURIComponent(L.substring(ie,oe)),ie=-1),W!==void 0&&(W+=L.charAt(oe));else{W===void 0&&(W=L.substr(0,oe));var dt=$[J];dt!==void 0?(ie!==-1&&(W+=encodeURIComponent(L.substring(ie,oe)),ie=-1),W+=dt):ie===-1&&(ie=oe)}}return ie!==-1&&(W+=encodeURIComponent(L.substring(ie))),W!==void 0?W:L}function ee(L){for(var q=void 0,F=0;F<L.length;F++){var W=L.charCodeAt(F);W===35||W===63?(q===void 0&&(q=L.substr(0,F)),q+=$[W]):q!==void 0&&(q+=L[F])}return q!==void 0?q:L}function Fe(L,q){var F;return F=L.authority&&L.path.length>1&&L.scheme==="file"?"//".concat(L.authority).concat(L.path):L.path.charCodeAt(0)===47&&(L.path.charCodeAt(1)>=65&&L.path.charCodeAt(1)<=90||L.path.charCodeAt(1)>=97&&L.path.charCodeAt(1)<=122)&&L.path.charCodeAt(2)===58?q?L.path.substr(1):L.path[1].toLowerCase()+L.path.substr(2):L.path,l.isWindows&&(F=F.replace(/\//g,"\\")),F}function Ne(L,q){var F=q?ee:B,W="",ie=L.scheme,oe=L.authority,J=L.path,dt=L.query,rt=L.fragment;if(ie&&(W+=ie,W+=":"),(oe||ie==="file")&&(W+=E,W+=E),oe){var Dt=oe.indexOf("@");if(Dt!==-1){var tn=oe.substr(0,Dt);oe=oe.substr(Dt+1),(Dt=tn.lastIndexOf(":"))===-1?W+=F(tn,!1,!1):(W+=F(tn.substr(0,Dt),!1,!1),W+=":",W+=F(tn.substr(Dt+1),!1,!0)),W+="@"}(Dt=(oe=oe.toLowerCase()).lastIndexOf(":"))===-1?W+=F(oe,!1,!0):(W+=F(oe.substr(0,Dt),!1,!0),W+=oe.substr(Dt))}if(J){if(J.length>=3&&J.charCodeAt(0)===47&&J.charCodeAt(2)===58)(Er=J.charCodeAt(1))>=65&&Er<=90&&(J="/".concat(String.fromCharCode(Er+32),":").concat(J.substr(3)));else if(J.length>=2&&J.charCodeAt(1)===58){var Er;(Er=J.charCodeAt(0))>=65&&Er<=90&&(J="".concat(String.fromCharCode(Er+32),":").concat(J.substr(2)))}W+=F(J,!0,!1)}return dt&&(W+="?",W+=F(dt,!1,!1)),rt&&(W+="#",W+=q?rt:B(rt,!1,!1)),W}function Je(L){try{return decodeURIComponent(L)}catch{return L.length>3?L.substr(0,3)+Je(L.substr(3)):L}}o.uriToFsPath=Fe;var K=/(%[0-9A-Za-z][0-9A-Za-z])+/g;function le(L){return L.match(K)?L.replace(K,function(q){return Je(q)}):L}},679:function(i,o,a){var s=this&&this.__spreadArray||function(h,v,g){if(g||arguments.length===2)for(var R,E=0,N=v.length;E<N;E++)!R&&E in v||(R||(R=Array.prototype.slice.call(v,0,E)),R[E]=v[E]);return h.concat(R||Array.prototype.slice.call(v))};Object.defineProperty(o,"__esModule",{value:!0}),o.Utils=void 0;var u,c=a(470),l=c.posix||c,d="/";(u=o.Utils||(o.Utils={})).joinPath=function(h){for(var v=[],g=1;g<arguments.length;g++)v[g-1]=arguments[g];return h.with({path:l.join.apply(l,s([h.path],v,!1))})},u.resolvePath=function(h){for(var v=[],g=1;g<arguments.length;g++)v[g-1]=arguments[g];var R=h.path,E=!1;R[0]!==d&&(R=d+R,E=!0);var N=l.resolve.apply(l,s([R],v,!1));return E&&N[0]===d&&!h.authority&&(N=N.substring(1)),h.with({path:N})},u.dirname=function(h){if(h.path.length===0||h.path===d)return h;var v=l.dirname(h.path);return v.length===1&&v.charCodeAt(0)===46&&(v=""),h.with({path:v})},u.basename=function(h){return l.basename(h.path)},u.extname=function(h){return l.extname(h.path)}}},e={};function r(i){var o=e[i];if(o!==void 0)return o.exports;var a=e[i]={exports:{}};return t[i].call(a.exports,a,a.exports,r),a.exports}var n={};return(()=>{var i=n;Object.defineProperty(i,"__esModule",{value:!0}),i.Utils=i.URI=void 0;var o=r(796);Object.defineProperty(i,"URI",{enumerable:!0,get:function(){return o.URI}});var a=r(679);Object.defineProperty(i,"Utils",{enumerable:!0,get:function(){return a.Utils}})})(),n})())});var Gu=f(Ba=>{"use strict";Object.defineProperty(Ba,"__esModule",{value:!0});Ba.eagerLoad=Ba.inject=void 0;function PG(t,e,r,n){let i=[t,e,r,n].reduce(Lb,{});return qb(i)}Ba.inject=PG;var ng=Symbol("isProxy");function xb(t){if(t&&t[ng])for(let e of Object.values(t))xb(e);return t}Ba.eagerLoad=xb;function qb(t,e){let r=new Proxy({},{deleteProperty:()=>!1,get:(n,i)=>Ib(n,i,t,e||r),getOwnPropertyDescriptor:(n,i)=>(Ib(n,i,t,e||r),Object.getOwnPropertyDescriptor(n,i)),has:(n,i)=>i in t,ownKeys:()=>[...Reflect.ownKeys(t),ng]});return r[ng]=!0,r}var Db=Symbol();function Ib(t,e,r,n){if(e in t){if(t[e]instanceof Error)throw new Error("Construction failure. Please make sure that your dependencies are constructable.",{cause:t[e]});if(t[e]===Db)throw new Error('Cycle detected. Please make "'+String(e)+'" lazy. See https://langium.org/docs/di/cyclic-dependencies');return t[e]}else if(e in r){let i=r[e];t[e]=Db;try{t[e]=typeof i=="function"?i(n):qb(i,n)}catch(o){throw t[e]=o instanceof Error?o:void 0,o}return t[e]}else return}function Lb(t,e){if(e){for(let[r,n]of Object.entries(e))if(n!==void 0){let i=t[r];i!==null&&n!==null&&typeof i=="object"&&typeof n=="object"?t[r]=Lb(i,n):t[r]=n}}return t}});var gn=f(Xl=>{"use strict";Object.defineProperty(Xl,"__esModule",{value:!0});Xl.MultiMap=void 0;var Ka=Ft(),ig=class{constructor(e){if(this.map=new Map,e)for(let[r,n]of e)this.add(r,n)}get size(){return Ka.Reduction.sum((0,Ka.stream)(this.map.values()).map(e=>e.length))}clear(){this.map.clear()}delete(e,r){if(r===void 0)return this.map.delete(e);{let n=this.map.get(e);if(n){let i=n.indexOf(r);if(i>=0)return n.length===1?this.map.delete(e):n.splice(i,1),!0}return!1}}get(e){var r;return(r=this.map.get(e))!==null&&r!==void 0?r:[]}has(e,r){if(r===void 0)return this.map.has(e);{let n=this.map.get(e);return n?n.indexOf(r)>=0:!1}}add(e,r){return this.map.has(e)?this.map.get(e).push(r):this.map.set(e,[r]),this}addAll(e,r){return this.map.has(e)?this.map.get(e).push(...r):this.map.set(e,Array.from(r)),this}forEach(e){this.map.forEach((r,n)=>r.forEach(i=>e(i,n,this)))}[Symbol.iterator](){return this.entries().iterator()}entries(){return(0,Ka.stream)(this.map.entries()).flatMap(([e,r])=>r.map(n=>[e,n]))}keys(){return(0,Ka.stream)(this.map.keys())}values(){return(0,Ka.stream)(this.map.values()).flat()}entriesGroupedByKey(){return(0,Ka.stream)(this.map.entries())}};Xl.MultiMap=ig});var ke=f(_=>{"use strict";Object.defineProperty(_,"__esModule",{value:!0});_.isTypeAttribute=_.TypeAttribute=_.isType=_.Type=_.isTerminalRule=_.TerminalRule=_.isSimpleType=_.SimpleType=_.isReturnType=_.ReturnType=_.isReferenceType=_.ReferenceType=_.isParserRule=_.ParserRule=_.isParameterReference=_.ParameterReference=_.isParameter=_.Parameter=_.isNegation=_.Negation=_.isNamedArgument=_.NamedArgument=_.isLiteralCondition=_.LiteralCondition=_.isInterface=_.Interface=_.isInferredType=_.InferredType=_.isGrammarImport=_.GrammarImport=_.isGrammar=_.Grammar=_.isDisjunction=_.Disjunction=_.isConjunction=_.Conjunction=_.isArrayType=_.ArrayType=_.isAbstractElement=_.AbstractElement=_.isTypeDefinition=_.TypeDefinition=_.isPrimitiveType=_.isFeatureName=_.isCondition=_.Condition=_.isAbstractType=_.AbstractType=_.isAbstractRule=_.AbstractRule=void 0;_.reflection=_.LangiumGrammarAstReflection=_.isWildcard=_.Wildcard=_.isUntilToken=_.UntilToken=_.isUnorderedGroup=_.UnorderedGroup=_.isTerminalRuleCall=_.TerminalRuleCall=_.isTerminalGroup=_.TerminalGroup=_.isTerminalAlternatives=_.TerminalAlternatives=_.isRuleCall=_.RuleCall=_.isRegexToken=_.RegexToken=_.isNegatedToken=_.NegatedToken=_.isKeyword=_.Keyword=_.isGroup=_.Group=_.isCrossReference=_.CrossReference=_.isCharacterRange=_.CharacterRange=_.isAssignment=_.Assignment=_.isAlternatives=_.Alternatives=_.isAction=_.Action=_.isUnionType=_.UnionType=void 0;var SG=er();_.AbstractRule="AbstractRule";function CG(t){return _.reflection.isInstance(t,_.AbstractRule)}_.isAbstractRule=CG;_.AbstractType="AbstractType";function EG(t){return _.reflection.isInstance(t,_.AbstractType)}_.isAbstractType=EG;_.Condition="Condition";function NG(t){return _.reflection.isInstance(t,_.Condition)}_.isCondition=NG;function kG(t){return Mb(t)||t==="current"||t==="entry"||t==="extends"||t==="false"||t==="fragment"||t==="grammar"||t==="hidden"||t==="import"||t==="interface"||t==="returns"||t==="terminal"||t==="true"||t==="type"||t==="infer"||t==="infers"||t==="with"||typeof t=="string"&&/\^?[_a-zA-Z][\w_]*/.test(t)}_.isFeatureName=kG;function Mb(t){return t==="string"||t==="number"||t==="boolean"||t==="Date"||t==="bigint"}_.isPrimitiveType=Mb;_.TypeDefinition="TypeDefinition";function wG(t){return _.reflection.isInstance(t,_.TypeDefinition)}_.isTypeDefinition=wG;_.AbstractElement="AbstractElement";function OG(t){return _.reflection.isInstance(t,_.AbstractElement)}_.isAbstractElement=OG;_.ArrayType="ArrayType";function DG(t){return _.reflection.isInstance(t,_.ArrayType)}_.isArrayType=DG;_.Conjunction="Conjunction";function IG(t){return _.reflection.isInstance(t,_.Conjunction)}_.isConjunction=IG;_.Disjunction="Disjunction";function xG(t){return _.reflection.isInstance(t,_.Disjunction)}_.isDisjunction=xG;_.Grammar="Grammar";function qG(t){return _.reflection.isInstance(t,_.Grammar)}_.isGrammar=qG;_.GrammarImport="GrammarImport";function LG(t){return _.reflection.isInstance(t,_.GrammarImport)}_.isGrammarImport=LG;_.InferredType="InferredType";function MG(t){return _.reflection.isInstance(t,_.InferredType)}_.isInferredType=MG;_.Interface="Interface";function $G(t){return _.reflection.isInstance(t,_.Interface)}_.isInterface=$G;_.LiteralCondition="LiteralCondition";function FG(t){return _.reflection.isInstance(t,_.LiteralCondition)}_.isLiteralCondition=FG;_.NamedArgument="NamedArgument";function jG(t){return _.reflection.isInstance(t,_.NamedArgument)}_.isNamedArgument=jG;_.Negation="Negation";function UG(t){return _.reflection.isInstance(t,_.Negation)}_.isNegation=UG;_.Parameter="Parameter";function GG(t){return _.reflection.isInstance(t,_.Parameter)}_.isParameter=GG;_.ParameterReference="ParameterReference";function HG(t){return _.reflection.isInstance(t,_.ParameterReference)}_.isParameterReference=HG;_.ParserRule="ParserRule";function WG(t){return _.reflection.isInstance(t,_.ParserRule)}_.isParserRule=WG;_.ReferenceType="ReferenceType";function BG(t){return _.reflection.isInstance(t,_.ReferenceType)}_.isReferenceType=BG;_.ReturnType="ReturnType";function KG(t){return _.reflection.isInstance(t,_.ReturnType)}_.isReturnType=KG;_.SimpleType="SimpleType";function zG(t){return _.reflection.isInstance(t,_.SimpleType)}_.isSimpleType=zG;_.TerminalRule="TerminalRule";function VG(t){return _.reflection.isInstance(t,_.TerminalRule)}_.isTerminalRule=VG;_.Type="Type";function YG(t){return _.reflection.isInstance(t,_.Type)}_.isType=YG;_.TypeAttribute="TypeAttribute";function XG(t){return _.reflection.isInstance(t,_.TypeAttribute)}_.isTypeAttribute=XG;_.UnionType="UnionType";function JG(t){return _.reflection.isInstance(t,_.UnionType)}_.isUnionType=JG;_.Action="Action";function QG(t){return _.reflection.isInstance(t,_.Action)}_.isAction=QG;_.Alternatives="Alternatives";function ZG(t){return _.reflection.isInstance(t,_.Alternatives)}_.isAlternatives=ZG;_.Assignment="Assignment";function eH(t){return _.reflection.isInstance(t,_.Assignment)}_.isAssignment=eH;_.CharacterRange="CharacterRange";function tH(t){return _.reflection.isInstance(t,_.CharacterRange)}_.isCharacterRange=tH;_.CrossReference="CrossReference";function rH(t){return _.reflection.isInstance(t,_.CrossReference)}_.isCrossReference=rH;_.Group="Group";function nH(t){return _.reflection.isInstance(t,_.Group)}_.isGroup=nH;_.Keyword="Keyword";function iH(t){return _.reflection.isInstance(t,_.Keyword)}_.isKeyword=iH;_.NegatedToken="NegatedToken";function oH(t){return _.reflection.isInstance(t,_.NegatedToken)}_.isNegatedToken=oH;_.RegexToken="RegexToken";function aH(t){return _.reflection.isInstance(t,_.RegexToken)}_.isRegexToken=aH;_.RuleCall="RuleCall";function sH(t){return _.reflection.isInstance(t,_.RuleCall)}_.isRuleCall=sH;_.TerminalAlternatives="TerminalAlternatives";function uH(t){return _.reflection.isInstance(t,_.TerminalAlternatives)}_.isTerminalAlternatives=uH;_.TerminalGroup="TerminalGroup";function cH(t){return _.reflection.isInstance(t,_.TerminalGroup)}_.isTerminalGroup=cH;_.TerminalRuleCall="TerminalRuleCall";function lH(t){return _.reflection.isInstance(t,_.TerminalRuleCall)}_.isTerminalRuleCall=lH;_.UnorderedGroup="UnorderedGroup";function dH(t){return _.reflection.isInstance(t,_.UnorderedGroup)}_.isUnorderedGroup=dH;_.UntilToken="UntilToken";function fH(t){return _.reflection.isInstance(t,_.UntilToken)}_.isUntilToken=fH;_.Wildcard="Wildcard";function pH(t){return _.reflection.isInstance(t,_.Wildcard)}_.isWildcard=pH;var Jl=class extends SG.AbstractAstReflection{getAllTypes(){return["AbstractElement","AbstractRule","AbstractType","Action","Alternatives","ArrayType","Assignment","CharacterRange","Condition","Conjunction","CrossReference","Disjunction","Grammar","GrammarImport","Group","InferredType","Interface","Keyword","LiteralCondition","NamedArgument","NegatedToken","Negation","Parameter","ParameterReference","ParserRule","ReferenceType","RegexToken","ReturnType","RuleCall","SimpleType","TerminalAlternatives","TerminalGroup","TerminalRule","TerminalRuleCall","Type","TypeAttribute","TypeDefinition","UnionType","UnorderedGroup","UntilToken","Wildcard"]}computeIsSubtype(e,r){switch(e){case _.Action:return this.isSubtype(_.AbstractElement,r)||this.isSubtype(_.AbstractType,r);case _.Alternatives:case _.Assignment:case _.CharacterRange:case _.CrossReference:case _.Group:case _.Keyword:case _.NegatedToken:case _.RegexToken:case _.RuleCall:case _.TerminalAlternatives:case _.TerminalGroup:case _.TerminalRuleCall:case _.UnorderedGroup:case _.UntilToken:case _.Wildcard:return this.isSubtype(_.AbstractElement,r);case _.ArrayType:case _.ReferenceType:case _.SimpleType:case _.UnionType:return this.isSubtype(_.TypeDefinition,r);case _.Conjunction:case _.Disjunction:case _.LiteralCondition:case _.Negation:case _.ParameterReference:return this.isSubtype(_.Condition,r);case _.Interface:case _.Type:return this.isSubtype(_.AbstractType,r);case _.ParserRule:return this.isSubtype(_.AbstractRule,r)||this.isSubtype(_.AbstractType,r);case _.TerminalRule:return this.isSubtype(_.AbstractRule,r);default:return!1}}getReferenceType(e){let r=`${e.container.$type}:${e.property}`;switch(r){case"Action:type":case"CrossReference:type":case"Interface:superTypes":case"ParserRule:returnType":case"SimpleType:typeRef":return _.AbstractType;case"Grammar:hiddenTokens":case"ParserRule:hiddenTokens":case"RuleCall:rule":return _.AbstractRule;case"Grammar:usedGrammars":return _.Grammar;case"NamedArgument:parameter":case"ParameterReference:parameter":return _.Parameter;case"TerminalRuleCall:rule":return _.TerminalRule;default:throw new Error(`${r} is not a valid reference id.`)}}getTypeMetaData(e){switch(e){case"Grammar":return{name:"Grammar",mandatory:[{name:"definesHiddenTokens",type:"boolean"},{name:"hiddenTokens",type:"array"},{name:"imports",type:"array"},{name:"interfaces",type:"array"},{name:"isDeclared",type:"boolean"},{name:"rules",type:"array"},{name:"types",type:"array"},{name:"usedGrammars",type:"array"}]};case"Interface":return{name:"Interface",mandatory:[{name:"attributes",type:"array"},{name:"superTypes",type:"array"}]};case"LiteralCondition":return{name:"LiteralCondition",mandatory:[{name:"true",type:"boolean"}]};case"NamedArgument":return{name:"NamedArgument",mandatory:[{name:"calledByName",type:"boolean"}]};case"ParserRule":return{name:"ParserRule",mandatory:[{name:"definesHiddenTokens",type:"boolean"},{name:"entry",type:"boolean"},{name:"fragment",type:"boolean"},{name:"hiddenTokens",type:"array"},{name:"parameters",type:"array"},{name:"wildcard",type:"boolean"}]};case"TerminalRule":return{name:"TerminalRule",mandatory:[{name:"fragment",type:"boolean"},{name:"hidden",type:"boolean"}]};case"TypeAttribute":return{name:"TypeAttribute",mandatory:[{name:"isOptional",type:"boolean"}]};case"UnionType":return{name:"UnionType",mandatory:[{name:"types",type:"array"}]};case"Alternatives":return{name:"Alternatives",mandatory:[{name:"elements",type:"array"}]};case"CrossReference":return{name:"CrossReference",mandatory:[{name:"deprecatedSyntax",type:"boolean"}]};case"Group":return{name:"Group",mandatory:[{name:"elements",type:"array"}]};case"RuleCall":return{name:"RuleCall",mandatory:[{name:"arguments",type:"array"}]};case"TerminalAlternatives":return{name:"TerminalAlternatives",mandatory:[{name:"elements",type:"array"}]};case"TerminalGroup":return{name:"TerminalGroup",mandatory:[{name:"elements",type:"array"}]};case"UnorderedGroup":return{name:"UnorderedGroup",mandatory:[{name:"elements",type:"array"}]};default:return{name:e,mandatory:[]}}}};_.LangiumGrammarAstReflection=Jl;_.reflection=new Jl});var be=f(it=>{"use strict";Object.defineProperty(it,"__esModule",{value:!0});it.copyAstNode=it.findLocalReferences=it.streamReferences=it.streamAst=it.streamAllContents=it.streamContents=it.findRootNode=it.getDocument=it.hasContainerOfType=it.getContainerOfType=it.linkContentToContainer=void 0;var Gn=er(),eo=Ft(),hH=qe();function $b(t){for(let[e,r]of Object.entries(t))e.startsWith("$")||(Array.isArray(r)?r.forEach((n,i)=>{(0,Gn.isAstNode)(n)&&(n.$container=t,n.$containerProperty=e,n.$containerIndex=i)}):(0,Gn.isAstNode)(r)&&(r.$container=t,r.$containerProperty=e))}it.linkContentToContainer=$b;function mH(t,e){let r=t;for(;r;){if(e(r))return r;r=r.$container}}it.getContainerOfType=mH;function gH(t,e){let r=t;for(;r;){if(e(r))return!0;r=r.$container}return!1}it.hasContainerOfType=gH;function Fb(t){let r=jb(t).$document;if(!r)throw new Error("AST node has no document.");return r}it.getDocument=Fb;function jb(t){for(;t.$container;)t=t.$container;return t}it.findRootNode=jb;function sg(t,e){if(!t)throw new Error("Node must be an AstNode.");let r=e?.range;return new eo.StreamImpl(()=>({keys:Object.keys(t),keyIndex:0,arrayIndex:0}),n=>{for(;n.keyIndex<n.keys.length;){let i=n.keys[n.keyIndex];if(!i.startsWith("$")){let o=t[i];if((0,Gn.isAstNode)(o)){if(n.keyIndex++,og(o,r))return{done:!1,value:o}}else if(Array.isArray(o)){for(;n.arrayIndex<o.length;){let a=n.arrayIndex++,s=o[a];if((0,Gn.isAstNode)(s)&&og(s,r))return{done:!1,value:s}}n.arrayIndex=0}}n.keyIndex++}return eo.DONE_RESULT})}it.streamContents=sg;function yH(t,e){if(!t)throw new Error("Root node must be an AstNode.");return new eo.TreeStreamImpl(t,r=>sg(r,e))}it.streamAllContents=yH;function Ub(t,e){if(t){if(e?.range&&!og(t,e.range))return new eo.TreeStreamImpl(t,()=>[])}else throw new Error("Root node must be an AstNode.");return new eo.TreeStreamImpl(t,r=>sg(r,e),{includeRoot:!0})}it.streamAst=Ub;function og(t,e){var r;if(!e)return!0;let n=(r=t.$cstNode)===null||r===void 0?void 0:r.range;return n?(0,hH.inRange)(n,e):!1}function Gb(t){return new eo.StreamImpl(()=>({keys:Object.keys(t),keyIndex:0,arrayIndex:0}),e=>{for(;e.keyIndex<e.keys.length;){let r=e.keys[e.keyIndex];if(!r.startsWith("$")){let n=t[r];if((0,Gn.isReference)(n))return e.keyIndex++,{done:!1,value:{reference:n,container:t,property:r}};if(Array.isArray(n)){for(;e.arrayIndex<n.length;){let i=e.arrayIndex++,o=n[i];if((0,Gn.isReference)(o))return{done:!1,value:{reference:o,container:t,property:r,index:i}}}e.arrayIndex=0}}e.keyIndex++}return eo.DONE_RESULT})}it.streamReferences=Gb;function vH(t,e=Fb(t).parseResult.value){let r=[];return Ub(e).forEach(n=>{Gb(n).forEach(i=>{i.reference.ref===t&&r.push(i.reference)})}),(0,eo.stream)(r)}it.findLocalReferences=vH;function ag(t,e){let r={$type:t.$type};for(let[n,i]of Object.entries(t))if(!n.startsWith("$"))if((0,Gn.isAstNode)(i))r[n]=ag(i,e);else if((0,Gn.isReference)(i))r[n]=e(r,n,i.$refNode,i.$refText);else if(Array.isArray(i)){let o=[];for(let a of i)(0,Gn.isAstNode)(a)?o.push(ag(a,e)):(0,Gn.isReference)(a)?o.push(e(r,n,a.$refNode,a.$refText)):o.push(a);r[n]=o}else r[n]=i;return $b(r),r}it.copyAstNode=ag});var Bb=f(Ql=>{"use strict";Object.defineProperty(Ql,"__esModule",{value:!0});Ql.getSourceRegion=void 0;var Hb=be(),_H=vt(),TH=Ft();function RH(t){var e,r;if(t){if("astNode"in t)return PH(t);if(Array.isArray(t))return t.reduce(Wb,void 0);{let n=t,i=bH(n)?AH((r=(e=n?.root)===null||e===void 0?void 0:e.element)!==null&&r!==void 0?r:n?.element):void 0;return za(n,i)}}else return}Ql.getSourceRegion=RH;function bH(t){return typeof t<"u"&&"element"in t&&"text"in t}function AH(t){try{return(0,Hb.getDocument)(t).uri.toString()}catch{return}}function PH(t){var e,r;let{astNode:n,property:i,index:o}=t??{},a=(e=n?.$cstNode)!==null&&e!==void 0?e:n?.$textRegion;if(!(n===void 0||a===void 0)){if(i===void 0)return za(a,ug(n));{let s=u=>o!==void 0&&o>-1&&Array.isArray(n[i])?o<u.length?u[o]:void 0:u.reduce(Wb,void 0);if(!((r=a.assignments)===null||r===void 0)&&r[i]){let u=s(a.assignments[i]);return u&&za(u,ug(n))}else if(n.$cstNode){let u=s((0,_H.findNodesForProperty)(n.$cstNode,i));return u&&za(u,ug(n))}else return}}}function ug(t){var e,r,n,i;return t.$cstNode?(r=(e=(0,Hb.getDocument)(t))===null||e===void 0?void 0:e.uri)===null||r===void 0?void 0:r.toString():t.$textRegion?t.$textRegion.documentURI||((i=(n=new TH.TreeStreamImpl(t,o=>o.$container?[o.$container]:[]).find(o=>{var a;return(a=o.$textRegion)===null||a===void 0?void 0:a.documentURI}))===null||n===void 0?void 0:n.$textRegion)===null||i===void 0?void 0:i.documentURI):void 0}function za(t,e){var r,n;let i={offset:t.offset,end:(r=t.end)!==null&&r!==void 0?r:t.offset+t.length,length:(n=t.length)!==null&&n!==void 0?n:t.end-t.offset};return t.range&&(i.range=t.range),e??(e=t.fileURI),e&&(i.fileURI=e),i}function Wb(t,e){var r,n;if(t){if(!e)return t&&za(t)}else return e&&za(e);let i=(r=t.end)!==null&&r!==void 0?r:t.offset+t.length,o=(n=e.end)!==null&&n!==void 0?n:e.offset+e.length,a=Math.min(t.offset,e.offset),s=Math.max(i,o),u=s-a,c={offset:a,end:s,length:u};if(t.range&&e.range&&(c.range={start:e.range.start.line<t.range.start.line||e.range.start.line===t.range.start.line&&e.range.start.character<t.range.start.character?e.range.start:t.range.start,end:e.range.end.line>t.range.end.line||e.range.end.line===t.range.end.line&&e.range.end.character>t.range.end.character?e.range.end:t.range.end}),t.fileURI||e.fileURI){let l=t.fileURI,d=e.fileURI,h=l&&d&&l!==d?`<unmergable text regions of ${l}, ${d}>`:l??d;c.fileURI=h}return c}});var Xb=f(Zl=>{"use strict";Object.defineProperty(Zl,"__esModule",{value:!0});Zl.processGeneratorNode=void 0;var Hu=Wo(),SH=Bb(),cg=class{constructor(e){this.defaultIndentation="    ",this.pendingIndent=!0,this.currentIndents=[],this.recentNonImmediateIndents=[],this.traceData=[],this.lines=[[]],typeof e=="string"?this.defaultIndentation=e:typeof e=="number"&&(this.defaultIndentation="".padStart(e))}get content(){return this.lines.map(e=>e.join("")).join("")}get currentLineNumber(){return this.lines.length-1}get currentLineContent(){return this.lines[this.currentLineNumber].join("")}get currentPosition(){return{offset:this.content.length,line:this.currentLineNumber,character:this.currentLineContent.length}}append(e,r){if(e.length>0){let n=r&&this.currentPosition;this.lines[this.currentLineNumber].push(e),n&&this.indentPendingTraceRegions(n)}}indentPendingTraceRegions(e){for(let r=this.traceData.length-1;r>=0;r--){let n=this.traceData[r];n.targetStart&&n.targetStart.offset===e.offset&&(n.targetStart=this.currentPosition)}}increaseIndent(e){this.currentIndents.push(e),e.indentImmediately||this.recentNonImmediateIndents.push(e)}decreaseIndent(){this.currentIndents.pop()}get relevantIndents(){return this.currentIndents.filter(e=>!this.recentNonImmediateIndents.includes(e))}resetCurrentLine(){this.lines[this.currentLineNumber]=[]}addNewLine(){this.pendingIndent=!0,this.lines.push([]),this.recentNonImmediateIndents.length=0}pushTraceRegion(e){let r=CH(e,this.currentPosition,n=>{var i,o;return(o=(i=this.traceData[this.traceData.length-1])===null||i===void 0?void 0:i.children)===null||o===void 0?void 0:o.push(n)});return this.traceData.push(r),r}popTraceRegion(e){let r=this.traceData.pop();return this.assertTrue(r===e,"Trace region mismatch!"),r}getParentTraceSourceFileURI(){var e;for(let r=this.traceData.length-1;r>-1;r--){let n=(e=this.traceData[r].sourceRegion)===null||e===void 0?void 0:e.fileURI;if(n)return n}}assertTrue(e,r){if(!e)throw new Error(r)}};function CH(t,e,r){let n={sourceRegion:t,targetRegion:void 0,children:[],targetStart:e,complete:i=>{var o,a;return n.targetRegion={offset:n.targetStart.offset,end:i.offset,length:i.offset-n.targetStart.offset,range:{start:{line:n.targetStart.line,character:n.targetStart.character},end:{line:i.line,character:i.character}}},delete n.targetStart,((o=n.children)===null||o===void 0?void 0:o.length)===0&&delete n.children,!((a=n.targetRegion)===null||a===void 0)&&a.length&&r(n),delete n.complete,n}};return n}function EH(t,e){let r=new cg(e),n=r.pushTraceRegion(void 0);Kb(t,r),r.popTraceRegion(n),n.complete&&n.complete(r.currentPosition);let i=n.children&&n.children.length===1?n.children[0]:void 0,o=i?.targetRegion,a=n.targetRegion;return o&&i.sourceRegion&&o.offset===a.offset&&o.length===a.length?{text:r.content,trace:i}:{text:r.content,trace:n}}Zl.processGeneratorNode=EH;function Kb(t,e){typeof t=="string"?NH(t,e):t instanceof Hu.IndentNode?kH(t,e):t instanceof Hu.CompositeGeneratorNode?Yb(t,e):t instanceof Hu.NewLineNode&&wH(t,e)}function zb(t,e){return typeof t=="string"?t.length!==0:t instanceof Hu.CompositeGeneratorNode?t.contents.some(r=>zb(r,e)):t instanceof Hu.NewLineNode?!(t.ifNotEmpty&&e.currentLineContent.length===0):!1}function NH(t,e){t&&(e.pendingIndent&&Vb(e,!1),e.append(t))}function Vb(t,e){var r;let n="";for(let i of t.relevantIndents.filter(o=>o.indentEmptyLines||!e))n+=(r=i.indentation)!==null&&r!==void 0?r:t.defaultIndentation;t.append(n,!0),t.pendingIndent=!1}function Yb(t,e){let r,n=(0,SH.getSourceRegion)(t.tracedSource);n&&(r=e.pushTraceRegion(n));for(let i of t.contents)Kb(i,e);if(r){e.popTraceRegion(r);let i=e.getParentTraceSourceFileURI();i&&n?.fileURI===i&&delete n.fileURI,r.complete&&r.complete(e.currentPosition)}}function kH(t,e){var r;if(zb(t,e)){t.indentImmediately&&!e.pendingIndent&&e.append((r=t.indentation)!==null&&r!==void 0?r:e.defaultIndentation,!0);try{e.increaseIndent(t),Yb(t,e)}finally{e.decreaseIndent()}}}function wH(t,e){t.ifNotEmpty&&!OH(e.currentLineContent)?e.resetCurrentLine():(e.pendingIndent&&Vb(e,!0),e.append(t.lineDelimiter),e.addNewLine())}function OH(t){return t.trimStart()!==""}});var ed=f(St=>{"use strict";Object.defineProperty(St,"__esModule",{value:!0});St.normalizeEOL=St.findIndentation=St.NEWLINE_REGEXP=St.SNLE=St.expandToString=St.expandToStringWithNL=void 0;var Wu=Wo();function DH(t,...e){return Jb(t,...e)+Wu.EOL}St.expandToStringWithNL=DH;function Jb(t,...e){let r=e.reduce((a,s,u)=>{var c;return a+(s===void 0?St.SNLE:xH((0,Wu.toString)(s),a))+((c=t[u+1])!==null&&c!==void 0?c:"")},t[0]).split(St.NEWLINE_REGEXP).filter(a=>a.trim()!==St.SNLE).map(a=>a.replace(St.SNLE,"").trimRight());r=r.length>1&&r[0].trim().length===0?r.slice(1):r,r=r.length!==0&&r[r.length-1].trimRight().length===0?r.slice(0,r.length-1):r;let o=Qb(r);return r.map(a=>a.slice(o).trimRight()).join(Wu.EOL)}St.expandToString=Jb;St.SNLE=Object.freeze("__\xABSKIP^NEW^LINE^IF^EMPTY\xBB__");St.NEWLINE_REGEXP=/\r?\n/g;var IH=/\S|$/;function xH(t,e){let r=Math.max(0,e.length-e.lastIndexOf(`
`)-1),n=" ".repeat(r);return t.replace(St.NEWLINE_REGEXP,Wu.EOL+n)}function Qb(t){let e=t.filter(n=>n.length>0).map(n=>n.search(IH)),r=e.length===0?0:Math.min(...e);return Math.max(0,r)}St.findIndentation=Qb;function qH(t){return t.replace(St.NEWLINE_REGEXP,Wu.EOL)}St.normalizeEOL=qH});var fg=f(to=>{"use strict";Object.defineProperty(to,"__esModule",{value:!0});to.expandTracedToNodeIf=to.expandTracedToNode=to.expandToNode=void 0;var Bu=Wo(),dg=ed();function eA(t,...e){let r=MH(t),n=$H(t,e,r);return jH(n)}to.expandToNode=eA;function tA(t,e,r){return(n,...i)=>(0,Bu.traceToNode)(t,e,r)(eA(n,...i))}to.expandTracedToNode=tA;function LH(t,e,r,n){return t?tA(typeof e=="function"?e():e,r,n):()=>{}}to.expandTracedToNodeIf=LH;function MH(t){let e=t.join("_").split(dg.NEWLINE_REGEXP),r=e.length>1&&e[0].trim().length===0,n=r&&e.length>1&&e[e.length-1].trim().length===0;if(e.length===1||e.length!==0&&e[0].trim().length!==0||e.length===2&&e[1].trim().length===0)return{indentation:0,omitFirstLine:r,omitLastLine:n,trimLastLine:e.length!==1&&e[e.length-1].trim().length===0};{let i=r?e.slice(1):e;i=n?i.slice(0,i.length-1):i,i=i.filter(a=>a.length!==0);let o=(0,dg.findIndentation)(i);return{indentation:o,omitFirstLine:r,omitLastLine:n&&(e[e.length-1].length<o||!e[e.length-1].startsWith(i[0].substring(0,o)))}}}function $H(t,e,{indentation:r,omitFirstLine:n,omitLastLine:i,trimLastLine:o}){let a=[];t.forEach((c,l)=>{a.push(...c.split(dg.NEWLINE_REGEXP).map((d,h)=>h===0||d.length<r?d:d.substring(r)).reduce(l===0?(d,h,v)=>v===0?n?[]:[h]:v===1&&d.length===0?[h]:d.concat(td,h):(d,h,v)=>v===0?[h]:d.concat(td,h),[]).filter(d=>!(typeof d=="string"&&d.length===0)).concat((0,Bu.isGeneratorNode)(e[l])?e[l]:e[l]!==void 0?{content:String(e[l])}:l<e.length?rA:[]))});let s=a.length,u=s!==0?a[s-1]:void 0;return(i||o)&&typeof u=="string"&&u.trim().length===0?n&&s!==1&&a[s-2]===td?a.slice(0,s-2):a.slice(0,s-1):a}var td={isNewLine:!0},rA={isUndefinedSegment:!0},Zb=t=>t===td,lg=t=>t===rA,FH=t=>t.content!==void 0;function jH(t){return t.reduce((r,n,i)=>lg(n)?r:Zb(n)?{node:i!==0&&(lg(t[i-1])||(0,Bu.isGeneratorNode)(t[i-1]))||i>1&&typeof t[i-1]=="string"&&(lg(t[i-2])||(0,Bu.isGeneratorNode)(t[i-2]))?r.node.appendNewLineIfNotEmpty():r.node.appendNewLine()}:(()=>{var o;let a=(i===0||Zb(t[i-1]))&&typeof n=="string"&&n.length!==0?"".padStart(n.length-n.trimStart().length):"",s=FH(n)?n.content:n,u;return{node:r.indented?r.node:a.length!==0?r.node.indent({indentation:a,indentImmediately:!1,indentedChildren:c=>u=c.append(s)}):r.node.append(s),indented:u??((o=r.indented)===null||o===void 0?void 0:o.append(s))}})(),{node:new Bu.CompositeGeneratorNode}).node}});var Wo=f(we=>{"use strict";Object.defineProperty(we,"__esModule",{value:!0});we.NLEmpty=we.NL=we.NewLineNode=we.IndentNode=we.traceToNodeIf=we.traceToNode=we.CompositeGeneratorNode=we.toStringAndTrace=we.toString=we.isNewLineNode=we.isGeneratorNode=we.EOL=void 0;var UH=er(),iA=Xb(),nA=fg();we.EOL=typeof process>"u"?`
`:process.platform==="win32"?`\r
`:`
`;function oA(t){return t instanceof bi||t instanceof Ku||t instanceof Bo}we.isGeneratorNode=oA;function GH(t){return t instanceof Bo}we.isNewLineNode=GH;function HH(t,e){return oA(t)?(0,iA.processGeneratorNode)(t,e).text:String(t)}we.toString=HH;function WH(t,e){return(0,iA.processGeneratorNode)(t,e)}we.toStringAndTrace=WH;var bi=class{constructor(...e){this.contents=[],this.append(...e)}isEmpty(){return this.contents.length===0}trace(e,r,n){if((0,UH.isAstNode)(e)){if(this.tracedSource={astNode:e,property:r,index:n},this.tracedSource.property===void 0&&this.tracedSource.index!==void 0&&this.tracedSource.index>-1)throw new Error("Generation support: 'property' argument must not be 'undefined' if a non-negative value is assigned to 'index' in 'CompositeGeneratorNode.trace(...)'.")}else this.tracedSource=e;return this}append(...e){for(let r of e)typeof r=="function"?r(this):r&&this.contents.push(r);return this}appendIf(e,...r){return e?this.append(...r):this}appendNewLine(){return this.append(we.NL)}appendNewLineIf(e){return e?this.append(we.NL):this}appendNewLineIfNotEmpty(){return this.append(we.NLEmpty)}appendNewLineIfNotEmptyIf(e){return e?this.appendNewLineIfNotEmpty():this}appendTemplate(e,...r){return this.append((0,nA.expandToNode)(e,...r))}appendTemplateIf(e){return e?(r,...n)=>this.appendTemplate(r,...n):()=>this}indent(e){let{indentedChildren:r,indentation:n,indentEmptyLines:i,indentImmediately:o}=Array.isArray(e)||typeof e=="function"?{indentedChildren:e}:typeof e=="object"?e:{},a=new Ku(n,o,i);return this.contents.push(a),Array.isArray(r)?a.append(...r):r&&a.append(r),this}appendTraced(e,r,n){return i=>this.append(new bi().trace(e,r,n).append(i))}appendTracedIf(e,r,n,i){return e?this.appendTraced(typeof r=="function"?r():r,n,i):()=>this}appendTracedTemplate(e,r,n){return(i,...o)=>this.append((0,nA.expandTracedToNode)(e,r,n)(i,...o))}appendTracedTemplateIf(e,r,n,i){return e?this.appendTracedTemplate(typeof r=="function"?r():r,n,i):()=>this}};we.CompositeGeneratorNode=bi;function aA(t,e,r){return n=>n instanceof bi&&n.tracedSource===void 0?n.trace(t,e,r):new bi().trace(t,e,r).append(n)}we.traceToNode=aA;function BH(t,e,r,n){return t?aA(typeof e=="function"?e():e,r,n):()=>{}}we.traceToNodeIf=BH;var Ku=class extends bi{constructor(e,r=!0,n=!1){super(),this.indentImmediately=!0,this.indentEmptyLines=!1,typeof e=="string"?this.indentation=e:typeof e=="number"&&(this.indentation="".padStart(e)),this.indentImmediately=r,this.indentEmptyLines=n}};we.IndentNode=Ku;var Bo=class{constructor(e,r=!1){this.ifNotEmpty=!1,this.lineDelimiter=e??we.EOL,this.ifNotEmpty=r}};we.NewLineNode=Bo;we.NL=new Bo;we.NLEmpty=new Bo(void 0,!0)});var Xa=f(Ae=>{"use strict";Object.defineProperty(Ae,"__esModule",{value:!0});Ae.isMandatoryPropertyType=Ae.propertyTypeToString=Ae.isTypeAssignable=Ae.TypeResolutionError=Ae.InterfaceType=Ae.UnionType=Ae.isInterfaceType=Ae.isUnionType=Ae.isStringType=Ae.isPrimitiveType=Ae.isValueType=Ae.flattenPropertyUnion=Ae.isPropertyUnion=Ae.isArrayType=Ae.isReferenceType=void 0;var Le=Wo(),Va=Ja();function zu(t){return"referenceType"in t}Ae.isReferenceType=zu;function Vu(t){return"elementType"in t}Ae.isArrayType=Vu;function wr(t){return"types"in t}Ae.isPropertyUnion=wr;function uA(t){if(wr(t)){let e=[];for(let r of t.types)e.push(...uA(r));return e}else return[t]}Ae.flattenPropertyUnion=uA;function Ko(t){return"value"in t}Ae.isValueType=Ko;function Hn(t){return"primitive"in t}Ae.isPrimitiveType=Hn;function no(t){return"string"in t}Ae.isStringType=no;function Ya(t){return t&&"type"in t}Ae.isUnionType=Ya;function yg(t){return t&&"properties"in t}Ae.isInterfaceType=yg;var hg=class{constructor(e,r){var n;this.superTypes=new Set,this.subTypes=new Set,this.containerTypes=new Set,this.typeNames=new Set,this.name=e,this.declared=(n=r?.declared)!==null&&n!==void 0?n:!1,this.dataType=r?.dataType}toAstTypesString(e){let r=new Le.CompositeGeneratorNode;return r.append(`export type ${this.name} = ${zo(this.type,"AstType")};`,Le.NL),e&&(r.append(Le.NL),lA(r,this.name)),this.dataType&&KH(r,this),(0,Le.toString)(r)}toDeclaredTypesString(e){let r=new Le.CompositeGeneratorNode;return r.append(`type ${_g(this.name,e)} = ${zo(this.type,"DeclaredType")};`,Le.NL),(0,Le.toString)(r)}};Ae.UnionType=hg;var Yu=class{get superProperties(){return this.getSuperProperties(new Set)}getSuperProperties(e){if(e.has(this.name))return[];e.add(this.name);let r=new Map;for(let n of this.properties)r.set(n.name,n);for(let n of this.interfaceSuperTypes){let i=n.getSuperProperties(e);for(let o of i)r.has(o.name)||r.set(o.name,o)}return Array.from(r.values())}get allProperties(){let e=new Map(this.superProperties.map(n=>[n.name,n]));for(let n of this.subTypes)this.getSubTypeProperties(n,e,new Set);return Array.from(e.values())}getSubTypeProperties(e,r,n){if(n.has(this.name))return;n.add(this.name);let i=yg(e)?e.properties:[];for(let o of i)r.has(o.name)||r.set(o.name,o);for(let o of e.subTypes)this.getSubTypeProperties(o,r,n)}get interfaceSuperTypes(){return Array.from(this.superTypes).filter(e=>e instanceof Yu)}constructor(e,r,n){this.superTypes=new Set,this.subTypes=new Set,this.containerTypes=new Set,this.typeNames=new Set,this.declared=!1,this.abstract=!1,this.properties=[],this.name=e,this.declared=r,this.abstract=n}toAstTypesString(e){let r=new Le.CompositeGeneratorNode,n=this.interfaceSuperTypes.map(o=>o.name),i=n.length>0?(0,Va.distinctAndSorted)([...n]):["AstNode"];return r.append(`export interface ${this.name} extends ${i.join(", ")} {`,Le.NL),r.indent(o=>{this.containerTypes.size>0&&o.append(`readonly $container: ${(0,Va.distinctAndSorted)([...this.containerTypes].map(a=>a.name)).join(" | ")};`,Le.NL),this.typeNames.size>0&&o.append(`readonly $type: ${(0,Va.distinctAndSorted)([...this.typeNames]).map(a=>`'${a}'`).join(" | ")};`,Le.NL),sA(o,this.properties,"AstType")}),r.append("}",Le.NL),e&&(r.append(Le.NL),lA(r,this.name)),(0,Le.toString)(r)}toDeclaredTypesString(e){let r=new Le.CompositeGeneratorNode,n=_g(this.name,e),i=(0,Va.distinctAndSorted)(this.interfaceSuperTypes.map(o=>o.name)).join(", ");return r.append(`interface ${n}${i.length>0?` extends ${i}`:""} {`,Le.NL),r.indent(o=>sA(o,this.properties,"DeclaredType",e)),r.append("}",Le.NL),(0,Le.toString)(r)}};Ae.InterfaceType=Yu;var mg=class extends Error{constructor(e,r){super(e),this.name="TypeResolutionError",this.target=r}};Ae.TypeResolutionError=mg;function ro(t,e){return wr(t)?t.types.every(r=>ro(r,e)):wr(e)?e.types.some(r=>ro(t,r)):Ko(e)&&Ya(e.value)?Ko(t)&&Ya(t.value)&&e.value.name===t.value.name?!0:ro(t,e.value.type):zu(t)?zu(e)&&ro(t.referenceType,e.referenceType):Vu(t)?Vu(e)&&ro(t.elementType,e.elementType):Ko(t)?Ya(t.value)?ro(t.value.type,e):Ko(e)?Ya(e.value)?ro(t,e.value.type):cA(t.value,e.value,new Set):!1:Hn(t)?Hn(e)&&t.primitive===e.primitive:no(t)?Hn(e)&&e.primitive==="string"||no(e)&&e.string===t.string:!1}Ae.isTypeAssignable=ro;function cA(t,e,r){if(r.has(t.name)||(r.add(t.name),t.name===e.name))return!0;for(let n of t.superTypes)if(yg(n)&&cA(n,e,r))return!0;return!1}function zo(t,e="AstType"){if(zu(t)){let r=zo(t.referenceType,e);return e==="AstType"?`Reference<${r}>`:`@${pg(t.referenceType,r)}`}else if(Vu(t)){let r=zo(t.elementType,e);return e==="AstType"?`Array<${r}>`:`${pg(t.elementType,r)}[]`}else if(wr(t)){let r=t.types.map(n=>pg(n,zo(n,e)));return(0,Va.distinctAndSorted)(r).join(" | ")}else{if(Ko(t))return t.value.name;if(Hn(t))return t.primitive;if(no(t)){let r=e==="AstType"?"'":'"';return`${r}${t.string}${r}`}}throw new Error("Invalid type")}Ae.propertyTypeToString=zo;function pg(t,e){return wr(t)&&(e=`(${e})`),e}function sA(t,e,r,n=new Set){function i(o){let a=r==="AstType"?o.name:_g(o.name,n),s=o.optional&&!vg(o.type),u=zo(o.type,r);return`${a}${s?"?":""}: ${u}`}(0,Va.distinctAndSorted)(e,(o,a)=>o.name.localeCompare(a.name)).forEach(o=>t.append(i(o),Le.NL))}function vg(t){return Vu(t)?!0:zu(t)?!1:wr(t)?t.types.every(e=>vg(e)):Hn(t)?t.primitive==="boolean":!1}Ae.isMandatoryPropertyType=vg;function lA(t,e){t.append(`export const ${e} = '${e}';`,Le.NL),t.append(Le.NL),t.append(`export function is${e}(item: unknown): item is ${e} {`,Le.NL),t.indent(r=>r.append(`return reflection.isInstance(item, ${e});`,Le.NL)),t.append("}",Le.NL)}function KH(t,e){switch(e.dataType){case"string":if(gg(e.type)){let r=Array.from(e.subTypes).map(o=>o.name),n=dA(e.type),i=fA(e.type);if(r.length===0&&n.length===0&&i.length===0)rd(t,e.name,`typeof item === '${e.dataType}'`);else{let o=zH(r,n,i);rd(t,e.name,o)}}break;case"number":case"boolean":case"bigint":rd(t,e.name,`typeof item === '${e.dataType}'`);break;case"Date":rd(t,e.name,"item instanceof Date");break;default:return}}function gg(t){let e=!0;if(Hn(t))return t.primitive==="string";if(no(t))return!0;if(wr(t)){for(let r of t.types)if(Ko(r))if(Ya(r.value)){if(!gg(r.value.type))return!1}else return!1;else if(Hn(r)){if(r.primitive!=="string"||!r.regex)return!1}else if(wr(r))e=gg(r);else if(!no(r))return!1}else return!1;return e}function zH(t,e,r){let n=[...t.map(i=>`is${i}(item)`),...e.map(i=>`item === '${i}'`)];if(r.length>0){let i=r.map(o=>`/${o}/.test(item)`).join(" || ");n.push(`(typeof item === 'string' && (${i}))`)}return n.join(" || ")}function _g(t,e){return e.has(t)?`^${t}`:t}function dA(t){let e=[];if(no(t))return[t.string];if(wr(t))for(let r of t.types)no(r)?e.push(r.string):wr(r)&&e.push(...dA(r));return e}function fA(t){let e=[];if(Hn(t)&&t.primitive==="string"&&t.regex&&e.push(t.regex),wr(t))for(let r of t.types)Hn(r)&&r.primitive==="string"&&r.regex?e.push(r.regex):wr(r)&&e.push(...fA(r));return e}function rd(t,e,r){t.append(Le.NL,`export function is${e}(item: unknown): item is ${e} {`,Le.NL),t.indent(n=>n.append(`return ${r};`,Le.NL)),t.append("}",Le.NL)}});var Ja=f(Ye=>{"use strict";Object.defineProperty(Ye,"__esModule",{value:!0});Ye.isAstType=Ye.findReferenceTypes=Ye.hasBooleanType=Ye.hasArrayType=Ye.sortInterfacesTopologically=Ye.mergeTypesAndInterfaces=Ye.mergeInterfaces=Ye.collectSuperTypes=Ye.collectTypeHierarchy=Ye.collectChildrenTypes=Ye.distinctAndSorted=Ye.collectAllPlainProperties=void 0;var Xu=gn(),Ai=ke(),Wn=Xa();function VH(t){let e=new Xu.MultiMap;for(let r of t)e.addAll(r.name,r.properties);for(let r of t)for(let n of r.superTypes){let i=e.get(n);i&&e.addAll(r.name,i)}return e}Ye.collectAllPlainProperties=VH;function YH(t,e){return Array.from(new Set(t)).sort(e)}Ye.distinctAndSorted=YH;function pA(t,e,r,n){let i=new Set;return i.add(t),e.findReferences(t,{}).forEach(a=>{let s=r.getOrCreateDocument(a.sourceUri),u=n.getAstNode(s.parseResult.value,a.sourcePath);(0,Ai.isInterface)(u)?(i.add(u),pA(u,e,r,n).forEach(l=>i.add(l))):u&&(0,Ai.isType)(u.$container)&&i.add(u.$container)}),i}Ye.collectChildrenTypes=pA;function XH(t){let e=new Set(t),r=new Xu.MultiMap,n=new Xu.MultiMap;for(let a of e){for(let s of a.superTypes)e.has(s)&&(r.add(a.name,s.name),n.add(s.name,a.name));for(let s of a.subTypes)e.has(s)&&(r.add(s.name,a.name),n.add(a.name,s.name))}let i=new Xu.MultiMap,o=new Xu.MultiMap;for(let[a,s]of Array.from(r.entriesGroupedByKey()).sort(([u],[c])=>u.localeCompare(c)))i.addAll(a,Array.from(new Set(s)));for(let[a,s]of Array.from(n.entriesGroupedByKey()).sort(([u],[c])=>u.localeCompare(c)))o.addAll(a,Array.from(new Set(s)));return{superTypes:i,subTypes:o}}Ye.collectTypeHierarchy=XH;function Tg(t){let e=new Set;if((0,Ai.isInterface)(t))e.add(t),t.superTypes.forEach(r=>{if((0,Ai.isInterface)(r.ref)){e.add(r.ref);let n=Tg(r.ref);for(let i of n)e.add(i)}});else if((0,Ai.isType)(t)){let r=hA(t.type);for(let n of r){let i=Tg(n);for(let o of i)e.add(o)}}return e}Ye.collectSuperTypes=Tg;function hA(t){var e;if((0,Ai.isUnionType)(t))return t.types.flatMap(r=>hA(r));if((0,Ai.isSimpleType)(t)){let r=(e=t.typeRef)===null||e===void 0?void 0:e.ref;if((0,Ai.isType)(r)||(0,Ai.isInterface)(r))return[r]}return[]}function JH(t,e){return t.interfaces.concat(e.interfaces)}Ye.mergeInterfaces=JH;function QH(t){return t.interfaces.concat(t.unions)}Ye.mergeTypesAndInterfaces=QH;function ZH(t){let e=t.sort((i,o)=>i.name.localeCompare(o.name)).map(i=>({value:i,nodes:[]}));for(let i of e)i.nodes=e.filter(o=>i.value.superTypes.has(o.value.name));let r=[],n=e.filter(i=>i.nodes.length===0);for(;n.length>0;){let i=n.shift();r.includes(i)||(r.push(i),e.filter(o=>o.nodes.includes(i)).forEach(o=>n.push(o)))}return r.map(i=>i.value)}Ye.sortInterfacesTopologically=ZH;function mA(t){return(0,Wn.isPropertyUnion)(t)?t.types.some(e=>mA(e)):!!(0,Wn.isArrayType)(t)}Ye.hasArrayType=mA;function gA(t){return(0,Wn.isPropertyUnion)(t)?t.types.some(e=>gA(e)):(0,Wn.isPrimitiveType)(t)?t.primitive==="boolean":!1}Ye.hasBooleanType=gA;function Rg(t){if((0,Wn.isPropertyUnion)(t))return t.types.flatMap(e=>Rg(e));if((0,Wn.isReferenceType)(t)){let e=t.referenceType;if((0,Wn.isValueType)(e))return[e.value.name]}else if((0,Wn.isArrayType)(t))return Rg(t.elementType);return[]}Ye.findReferenceTypes=Rg;function bg(t){if((0,Wn.isPropertyUnion)(t))return t.types.every(bg);if((0,Wn.isValueType)(t)){let e=t.value;return"type"in e?bg(e.type):!0}return!1}Ye.isAstType=bg});var Za=f(Qa=>{"use strict";Object.defineProperty(Qa,"__esModule",{value:!0});Qa.DefaultNameProvider=Qa.isNamed=void 0;var eW=vt();function yA(t){return typeof t.name=="string"}Qa.isNamed=yA;var Ag=class{getName(e){if(yA(e))return e.name}getNameNode(e){return(0,eW.findNodeForProperty)(e.$cstNode,"name")}};Qa.DefaultNameProvider=Ag});var Ju=f((vA,nd)=>{(function(t,e){typeof define=="function"&&define.amd?define([],e):typeof nd=="object"&&nd.exports?nd.exports=e():t.regexpToAst=e()})(typeof self<"u"?self:vA,function(){function t(){}t.prototype.saveState=function(){return{idx:this.idx,input:this.input,groupIdx:this.groupIdx}},t.prototype.restoreState=function(g){this.idx=g.idx,this.input=g.input,this.groupIdx=g.groupIdx},t.prototype.pattern=function(g){this.idx=0,this.input=g,this.groupIdx=0,this.consumeChar("/");var R=this.disjunction();this.consumeChar("/");for(var E={type:"Flags",loc:{begin:this.idx,end:g.length},global:!1,ignoreCase:!1,multiLine:!1,unicode:!1,sticky:!1};this.isRegExpFlag();)switch(this.popChar()){case"g":a(E,"global");break;case"i":a(E,"ignoreCase");break;case"m":a(E,"multiLine");break;case"u":a(E,"unicode");break;case"y":a(E,"sticky");break}if(this.idx!==this.input.length)throw Error("Redundant input: "+this.input.substring(this.idx));return{type:"Pattern",flags:E,value:R,loc:this.loc(0)}},t.prototype.disjunction=function(){var g=[],R=this.idx;for(g.push(this.alternative());this.peekChar()==="|";)this.consumeChar("|"),g.push(this.alternative());return{type:"Disjunction",value:g,loc:this.loc(R)}},t.prototype.alternative=function(){for(var g=[],R=this.idx;this.isTerm();)g.push(this.term());return{type:"Alternative",value:g,loc:this.loc(R)}},t.prototype.term=function(){return this.isAssertion()?this.assertion():this.atom()},t.prototype.assertion=function(){var g=this.idx;switch(this.popChar()){case"^":return{type:"StartAnchor",loc:this.loc(g)};case"$":return{type:"EndAnchor",loc:this.loc(g)};case"\\":switch(this.popChar()){case"b":return{type:"WordBoundary",loc:this.loc(g)};case"B":return{type:"NonWordBoundary",loc:this.loc(g)}}throw Error("Invalid Assertion Escape");case"(":this.consumeChar("?");var R;switch(this.popChar()){case"=":R="Lookahead";break;case"!":R="NegativeLookahead";break}s(R);var E=this.disjunction();return this.consumeChar(")"),{type:R,value:E,loc:this.loc(g)}}u()},t.prototype.quantifier=function(g){var R,E=this.idx;switch(this.popChar()){case"*":R={atLeast:0,atMost:1/0};break;case"+":R={atLeast:1,atMost:1/0};break;case"?":R={atLeast:0,atMost:1};break;case"{":var N=this.integerIncludingZero();switch(this.popChar()){case"}":R={atLeast:N,atMost:N};break;case",":var A;this.isDigit()?(A=this.integerIncludingZero(),R={atLeast:N,atMost:A}):R={atLeast:N,atMost:1/0},this.consumeChar("}");break}if(g===!0&&R===void 0)return;s(R);break}if(!(g===!0&&R===void 0))return s(R),this.peekChar(0)==="?"?(this.consumeChar("?"),R.greedy=!1):R.greedy=!0,R.type="Quantifier",R.loc=this.loc(E),R},t.prototype.atom=function(){var g,R=this.idx;switch(this.peekChar()){case".":g=this.dotAll();break;case"\\":g=this.atomEscape();break;case"[":g=this.characterClass();break;case"(":g=this.group();break}return g===void 0&&this.isPatternCharacter()&&(g=this.patternCharacter()),s(g),g.loc=this.loc(R),this.isQuantifier()&&(g.quantifier=this.quantifier()),g},t.prototype.dotAll=function(){return this.consumeChar("."),{type:"Set",complement:!0,value:[i(`
`),i("\r"),i("\u2028"),i("\u2029")]}},t.prototype.atomEscape=function(){switch(this.consumeChar("\\"),this.peekChar()){case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":return this.decimalEscapeAtom();case"d":case"D":case"s":case"S":case"w":case"W":return this.characterClassEscape();case"f":case"n":case"r":case"t":case"v":return this.controlEscapeAtom();case"c":return this.controlLetterEscapeAtom();case"0":return this.nulCharacterAtom();case"x":return this.hexEscapeSequenceAtom();case"u":return this.regExpUnicodeEscapeSequenceAtom();default:return this.identityEscapeAtom()}},t.prototype.decimalEscapeAtom=function(){var g=this.positiveInteger();return{type:"GroupBackReference",value:g}},t.prototype.characterClassEscape=function(){var g,R=!1;switch(this.popChar()){case"d":g=l;break;case"D":g=l,R=!0;break;case"s":g=h;break;case"S":g=h,R=!0;break;case"w":g=d;break;case"W":g=d,R=!0;break}return s(g),{type:"Set",value:g,complement:R}},t.prototype.controlEscapeAtom=function(){var g;switch(this.popChar()){case"f":g=i("\f");break;case"n":g=i(`
`);break;case"r":g=i("\r");break;case"t":g=i("	");break;case"v":g=i("\v");break}return s(g),{type:"Character",value:g}},t.prototype.controlLetterEscapeAtom=function(){this.consumeChar("c");var g=this.popChar();if(/[a-zA-Z]/.test(g)===!1)throw Error("Invalid ");var R=g.toUpperCase().charCodeAt(0)-64;return{type:"Character",value:R}},t.prototype.nulCharacterAtom=function(){return this.consumeChar("0"),{type:"Character",value:i("\0")}},t.prototype.hexEscapeSequenceAtom=function(){return this.consumeChar("x"),this.parseHexDigits(2)},t.prototype.regExpUnicodeEscapeSequenceAtom=function(){return this.consumeChar("u"),this.parseHexDigits(4)},t.prototype.identityEscapeAtom=function(){var g=this.popChar();return{type:"Character",value:i(g)}},t.prototype.classPatternCharacterAtom=function(){switch(this.peekChar()){case`
`:case"\r":case"\u2028":case"\u2029":case"\\":case"]":throw Error("TBD");default:var g=this.popChar();return{type:"Character",value:i(g)}}},t.prototype.characterClass=function(){var g=[],R=!1;for(this.consumeChar("["),this.peekChar(0)==="^"&&(this.consumeChar("^"),R=!0);this.isClassAtom();){var E=this.classAtom(),N=E.type==="Character";if(N&&this.isRangeDash()){this.consumeChar("-");var A=this.classAtom(),b=A.type==="Character";if(b){if(A.value<E.value)throw Error("Range out of order in character class");g.push({from:E.value,to:A.value})}else o(E.value,g),g.push(i("-")),o(A.value,g)}else o(E.value,g)}return this.consumeChar("]"),{type:"Set",complement:R,value:g}},t.prototype.classAtom=function(){switch(this.peekChar()){case"]":case`
`:case"\r":case"\u2028":case"\u2029":throw Error("TBD");case"\\":return this.classEscape();default:return this.classPatternCharacterAtom()}},t.prototype.classEscape=function(){switch(this.consumeChar("\\"),this.peekChar()){case"b":return this.consumeChar("b"),{type:"Character",value:i("\b")};case"d":case"D":case"s":case"S":case"w":case"W":return this.characterClassEscape();case"f":case"n":case"r":case"t":case"v":return this.controlEscapeAtom();case"c":return this.controlLetterEscapeAtom();case"0":return this.nulCharacterAtom();case"x":return this.hexEscapeSequenceAtom();case"u":return this.regExpUnicodeEscapeSequenceAtom();default:return this.identityEscapeAtom()}},t.prototype.group=function(){var g=!0;switch(this.consumeChar("("),this.peekChar(0)){case"?":this.consumeChar("?"),this.consumeChar(":"),g=!1;break;default:this.groupIdx++;break}var R=this.disjunction();this.consumeChar(")");var E={type:"Group",capturing:g,value:R};return g&&(E.idx=this.groupIdx),E},t.prototype.positiveInteger=function(){var g=this.popChar();if(n.test(g)===!1)throw Error("Expecting a positive integer");for(;r.test(this.peekChar(0));)g+=this.popChar();return parseInt(g,10)},t.prototype.integerIncludingZero=function(){var g=this.popChar();if(r.test(g)===!1)throw Error("Expecting an integer");for(;r.test(this.peekChar(0));)g+=this.popChar();return parseInt(g,10)},t.prototype.patternCharacter=function(){var g=this.popChar();switch(g){case`
`:case"\r":case"\u2028":case"\u2029":case"^":case"$":case"\\":case".":case"*":case"+":case"?":case"(":case")":case"[":case"|":throw Error("TBD");default:return{type:"Character",value:i(g)}}},t.prototype.isRegExpFlag=function(){switch(this.peekChar(0)){case"g":case"i":case"m":case"u":case"y":return!0;default:return!1}},t.prototype.isRangeDash=function(){return this.peekChar()==="-"&&this.isClassAtom(1)},t.prototype.isDigit=function(){return r.test(this.peekChar(0))},t.prototype.isClassAtom=function(g){switch(g===void 0&&(g=0),this.peekChar(g)){case"]":case`
`:case"\r":case"\u2028":case"\u2029":return!1;default:return!0}},t.prototype.isTerm=function(){return this.isAtom()||this.isAssertion()},t.prototype.isAtom=function(){if(this.isPatternCharacter())return!0;switch(this.peekChar(0)){case".":case"\\":case"[":case"(":return!0;default:return!1}},t.prototype.isAssertion=function(){switch(this.peekChar(0)){case"^":case"$":return!0;case"\\":switch(this.peekChar(1)){case"b":case"B":return!0;default:return!1}case"(":return this.peekChar(1)==="?"&&(this.peekChar(2)==="="||this.peekChar(2)==="!");default:return!1}},t.prototype.isQuantifier=function(){var g=this.saveState();try{return this.quantifier(!0)!==void 0}catch{return!1}finally{this.restoreState(g)}},t.prototype.isPatternCharacter=function(){switch(this.peekChar()){case"^":case"$":case"\\":case".":case"*":case"+":case"?":case"(":case")":case"[":case"|":case"/":case`
`:case"\r":case"\u2028":case"\u2029":return!1;default:return!0}},t.prototype.parseHexDigits=function(g){for(var R="",E=0;E<g;E++){var N=this.popChar();if(e.test(N)===!1)throw Error("Expecting a HexDecimal digits");R+=N}var A=parseInt(R,16);return{type:"Character",value:A}},t.prototype.peekChar=function(g){return g===void 0&&(g=0),this.input[this.idx+g]},t.prototype.popChar=function(){var g=this.peekChar(0);return this.consumeChar(),g},t.prototype.consumeChar=function(g){if(g!==void 0&&this.input[this.idx]!==g)throw Error("Expected: '"+g+"' but found: '"+this.input[this.idx]+"' at offset: "+this.idx);if(this.idx>=this.input.length)throw Error("Unexpected end of input");this.idx++},t.prototype.loc=function(g){return{begin:g,end:this.idx}};var e=/[0-9a-fA-F]/,r=/[0-9]/,n=/[1-9]/;function i(g){return g.charCodeAt(0)}function o(g,R){g.length!==void 0?g.forEach(function(E){R.push(E)}):R.push(g)}function a(g,R){if(g[R]===!0)throw"duplicate flag "+R;g[R]=!0}function s(g){if(g===void 0)throw Error("Internal Error - Should never get here!")}function u(){throw Error("Internal Error - Should never get here!")}var c,l=[];for(c=i("0");c<=i("9");c++)l.push(c);var d=[i("_")].concat(l);for(c=i("a");c<=i("z");c++)d.push(c);for(c=i("A");c<=i("Z");c++)d.push(c);var h=[i(" "),i("\f"),i(`
`),i("\r"),i("	"),i("\v"),i("	"),i("\xA0"),i("\u1680"),i("\u2000"),i("\u2001"),i("\u2002"),i("\u2003"),i("\u2004"),i("\u2005"),i("\u2006"),i("\u2007"),i("\u2008"),i("\u2009"),i("\u200A"),i("\u2028"),i("\u2029"),i("\u202F"),i("\u205F"),i("\u3000"),i("\uFEFF")];function v(){}return v.prototype.visitChildren=function(g){for(var R in g){var E=g[R];g.hasOwnProperty(R)&&(E.type!==void 0?this.visit(E):Array.isArray(E)&&E.forEach(function(N){this.visit(N)},this))}},v.prototype.visit=function(g){switch(g.type){case"Pattern":this.visitPattern(g);break;case"Flags":this.visitFlags(g);break;case"Disjunction":this.visitDisjunction(g);break;case"Alternative":this.visitAlternative(g);break;case"StartAnchor":this.visitStartAnchor(g);break;case"EndAnchor":this.visitEndAnchor(g);break;case"WordBoundary":this.visitWordBoundary(g);break;case"NonWordBoundary":this.visitNonWordBoundary(g);break;case"Lookahead":this.visitLookahead(g);break;case"NegativeLookahead":this.visitNegativeLookahead(g);break;case"Character":this.visitCharacter(g);break;case"Set":this.visitSet(g);break;case"Group":this.visitGroup(g);break;case"GroupBackReference":this.visitGroupBackReference(g);break;case"Quantifier":this.visitQuantifier(g);break}this.visitChildren(g)},v.prototype.visitPattern=function(g){},v.prototype.visitFlags=function(g){},v.prototype.visitDisjunction=function(g){},v.prototype.visitAlternative=function(g){},v.prototype.visitStartAnchor=function(g){},v.prototype.visitEndAnchor=function(g){},v.prototype.visitWordBoundary=function(g){},v.prototype.visitNonWordBoundary=function(g){},v.prototype.visitLookahead=function(g){},v.prototype.visitNegativeLookahead=function(g){},v.prototype.visitCharacter=function(g){},v.prototype.visitSet=function(g){},v.prototype.visitGroup=function(g){},v.prototype.visitGroupBackReference=function(g){},v.prototype.visitQuantifier=function(g){},{RegExpParser:t,BaseRegExpVisitor:v,VERSION:"0.5.0"}})});var Yo=f(tr=>{"use strict";Object.defineProperty(tr,"__esModule",{value:!0});tr.partialRegex=tr.partialMatches=tr.getCaseInsensitivePattern=tr.escapeRegExp=tr.isWhitespaceRegExp=tr.isMultilineComment=tr.getTerminalParts=void 0;var _A=Ju(),TA=new _A.RegExpParser,Pg=class extends _A.BaseRegExpVisitor{constructor(){super(...arguments),this.isStarting=!0,this.endRegexStack=[],this.multiline=!1}get endRegex(){return this.endRegexStack.join("")}reset(e){this.multiline=!1,this.regex=e,this.startRegex="",this.isStarting=!0,this.endRegexStack=[]}visitGroup(e){e.quantifier&&(this.isStarting=!1,this.endRegexStack=[])}visitCharacter(e){let r=String.fromCharCode(e.value);if(!this.multiline&&r===`
`&&(this.multiline=!0),e.quantifier)this.isStarting=!1,this.endRegexStack=[];else{let n=Sg(r);this.endRegexStack.push(n),this.isStarting&&(this.startRegex+=n)}}visitSet(e){if(!this.multiline){let r=this.regex.substring(e.loc.begin,e.loc.end),n=new RegExp(r);this.multiline=Boolean(`
`.match(n))}if(e.quantifier)this.isStarting=!1,this.endRegexStack=[];else{let r=this.regex.substring(e.loc.begin,e.loc.end);this.endRegexStack.push(r),this.isStarting&&(this.startRegex+=r)}}visitChildren(e){e.type==="Group"&&e.quantifier||super.visitChildren(e)}},Vo=new Pg;function tW(t){try{typeof t!="string"&&(t=t.source),t=`/${t}/`;let e=TA.pattern(t),r=[];for(let n of e.value.value)Vo.reset(t),Vo.visit(n),r.push({start:Vo.startRegex,end:Vo.endRegex});return r}catch{return[]}}tr.getTerminalParts=tW;function rW(t){try{return typeof t!="string"&&(t=t.source),t=`/${t}/`,Vo.reset(t),Vo.visit(TA.pattern(t)),Vo.multiline}catch{return!1}}tr.isMultilineComment=rW;function nW(t){return(typeof t=="string"?new RegExp(t):t).test(" ")}tr.isWhitespaceRegExp=nW;function Sg(t){return t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}tr.escapeRegExp=Sg;function iW(t){return Array.prototype.map.call(t,e=>/\w/.test(e)?`[${e.toLowerCase()}${e.toUpperCase()}]`:Sg(e)).join("")}tr.getCaseInsensitivePattern=iW;function oW(t,e){let r=RA(t),n=e.match(r);return!!n&&n[0].length>0}tr.partialMatches=oW;function RA(t){typeof t=="string"&&(t=new RegExp(t));let e=t,r=t.source,n=0;function i(){let o="",a;function s(c){o+=r.substr(n,c),n+=c}function u(c){o+="(?:"+r.substr(n,c)+"|$)",n+=c}for(;n<r.length;)switch(r[n]){case"\\":switch(r[n+1]){case"c":u(3);break;case"x":u(4);break;case"u":e.unicode?r[n+2]==="{"?u(r.indexOf("}",n)-n+1):u(6):u(2);break;case"p":case"P":e.unicode?u(r.indexOf("}",n)-n+1):u(2);break;case"k":u(r.indexOf(">",n)-n+1);break;default:u(2);break}break;case"[":a=/\[(?:\\.|.)*?\]/g,a.lastIndex=n,a=a.exec(r)||[],u(a[0].length);break;case"|":case"^":case"$":case"*":case"+":case"?":s(1);break;case"{":a=/\{\d+,?\d*\}/g,a.lastIndex=n,a=a.exec(r),a?s(a[0].length):u(1);break;case"(":if(r[n+1]==="?")switch(r[n+2]){case":":o+="(?:",n+=3,o+=i()+"|$)";break;case"=":o+="(?=",n+=3,o+=i()+")";break;case"!":a=n,n+=3,i(),o+=r.substr(a,n-a);break;case"<":switch(r[n+3]){case"=":case"!":a=n,n+=4,i(),o+=r.substr(a,n-a);break;default:s(r.indexOf(">",n)-n+1),o+=i()+"|$)";break}break}else s(1),o+=i()+"|$)";break;case")":return++n,o;default:u(1);break}return o}return new RegExp(i(),t.flags)}tr.partialRegex=RA});var jt=f(re=>{"use strict";var aW=re&&re.__createBinding||(Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]}),sW=re&&re.__setModuleDefault||(Object.create?function(t,e){Object.defineProperty(t,"default",{enumerable:!0,value:e})}:function(t,e){t.default=e}),uW=re&&re.__importStar||function(t){if(t&&t.__esModule)return t;var e={};if(t!=null)for(var r in t)r!=="default"&&Object.prototype.hasOwnProperty.call(t,r)&&aW(e,t,r);return sW(e,t),e};Object.defineProperty(re,"__esModule",{value:!0});re.isPrimitiveType=re.extractAssignments=re.resolveTransitiveImports=re.resolveImport=re.resolveImportUri=re.terminalRegex=re.getRuleType=re.getActionType=re.getExplicitRuleType=re.getTypeNameWithoutError=re.getTypeName=re.getActionAtElement=re.isDataType=re.hasDataTypeReturn=re.isDataTypeRule=re.isArrayOperator=re.isArrayCardinality=re.isOptionalCardinality=void 0;var se=uW(ke()),bA=Un(),id=be(),cW=Xa(),lW=Yo();function dW(t){return t==="?"||t==="*"}re.isOptionalCardinality=dW;function fW(t){return t==="*"||t==="+"}re.isArrayCardinality=fW;function pW(t){return t==="+="}re.isArrayOperator=pW;function wg(t){return AA(t,new Set)}re.isDataTypeRule=wg;function AA(t,e){if(e.has(t))return!0;e.add(t);for(let r of(0,id.streamAllContents)(t))if(se.isRuleCall(r)){if(!r.rule.ref||se.isParserRule(r.rule.ref)&&!AA(r.rule.ref,e))return!1}else{if(se.isAssignment(r))return!1;if(se.isAction(r))return!1}return Boolean(t.definition)}function hW(t){var e;let r=(e=t.returnType)===null||e===void 0?void 0:e.ref;return t.dataType!==void 0||se.isType(r)&&PA(r)}re.hasDataTypeReturn=hW;function PA(t){return Eg(t.type,new Set)}re.isDataType=PA;function Eg(t,e){if(e.has(t))return!0;if(e.add(t),se.isArrayType(t))return!1;if(se.isReferenceType(t))return!1;if(se.isUnionType(t))return t.types.every(r=>Eg(r,e));if(se.isSimpleType(t)){if(t.primitiveType!==void 0)return!0;if(t.stringType!==void 0)return!0;if(t.typeRef!==void 0){let r=t.typeRef.ref;return se.isType(r)?Eg(r.type,e):!1}else return!1}else return!1}function SA(t){let e=t.$container;if(se.isGroup(e)){let r=e.elements,n=r.indexOf(t);for(let i=n-1;i>=0;i--){let o=r[i];if(se.isAction(o))return o;{let a=(0,id.streamAllContents)(r[i]).find(se.isAction);if(a)return a}}}if(se.isAbstractElement(e))return SA(e)}re.getActionAtElement=SA;function Og(t){var e;if(se.isParserRule(t))return wg(t)?t.name:(e=Dg(t))!==null&&e!==void 0?e:t.name;if(se.isInterface(t)||se.isType(t)||se.isReturnType(t))return t.name;if(se.isAction(t)){let r=CA(t);if(r)return r}else if(se.isInferredType(t))return t.name;throw new cW.TypeResolutionError("Cannot get name of Unknown Type",t.$cstNode)}re.getTypeName=Og;function mW(t){if(t)try{return Og(t)}catch{return}}re.getTypeNameWithoutError=mW;function Dg(t){if(t.inferredType)return t.inferredType.name;if(t.dataType)return t.dataType;if(t.returnType){let e=t.returnType.ref;if(e){if(se.isParserRule(e))return e.name;if(se.isInterface(e)||se.isType(e))return e.name}}}re.getExplicitRuleType=Dg;function CA(t){var e;if(t.inferredType)return t.inferredType.name;if(!((e=t.type)===null||e===void 0)&&e.ref)return Og(t.type.ref)}re.getActionType=CA;function gW(t){var e,r,n;return se.isTerminalRule(t)?(r=(e=t.type)===null||e===void 0?void 0:e.name)!==null&&r!==void 0?r:"string":wg(t)?t.name:(n=Dg(t))!==null&&n!==void 0?n:t.name}re.getRuleType=gW;function EA(t){return Qu(t.definition)}re.terminalRegex=EA;var Ig=/[\s\S]/.source;function Qu(t){if(se.isTerminalAlternatives(t))return yW(t);if(se.isTerminalGroup(t))return vW(t);if(se.isCharacterRange(t))return RW(t);if(se.isTerminalRuleCall(t)){let e=t.rule.ref;if(!e)throw new Error("Missing rule reference.");return Pi(EA(e),{cardinality:t.cardinality,lookahead:t.lookahead})}else{if(se.isNegatedToken(t))return TW(t);if(se.isUntilToken(t))return _W(t);if(se.isRegexToken(t))return Pi(t.regex,{cardinality:t.cardinality,lookahead:t.lookahead,wrap:!1});if(se.isWildcard(t))return Pi(Ig,{cardinality:t.cardinality,lookahead:t.lookahead});throw new Error(`Invalid terminal element: ${t?.$type}`)}}function yW(t){return Pi(t.elements.map(Qu).join("|"),{cardinality:t.cardinality,lookahead:t.lookahead})}function vW(t){return Pi(t.elements.map(Qu).join(""),{cardinality:t.cardinality,lookahead:t.lookahead})}function _W(t){return Pi(`${Ig}*?${Qu(t.terminal)}`,{cardinality:t.cardinality,lookahead:t.lookahead})}function TW(t){return Pi(`(?!${Qu(t.terminal)})${Ig}*?`,{cardinality:t.cardinality,lookahead:t.lookahead})}function RW(t){return t.right?Pi(`[${Cg(t.left)}-${Cg(t.right)}]`,{cardinality:t.cardinality,lookahead:t.lookahead,wrap:!1}):Pi(Cg(t.left),{cardinality:t.cardinality,lookahead:t.lookahead,wrap:!1})}function Cg(t){return(0,lW.escapeRegExp)(t.value)}function Pi(t,e){var r;return(e.wrap!==!1||e.lookahead)&&(t=`(${(r=e.lookahead)!==null&&r!==void 0?r:""}${t})`),e.cardinality?`${t}${e.cardinality}`:t}function NA(t){if(t.path===void 0||t.path.length===0)return;let e=bA.Utils.dirname((0,id.getDocument)(t).uri),r=t.path;return r.endsWith(".langium")||(r+=".langium"),bA.Utils.resolvePath(e,r)}re.resolveImportUri=NA;function xg(t,e){let r=NA(e);try{if(r){let i=t.getOrCreateDocument(r).parseResult.value;if(se.isGrammar(i))return i}}catch{}}re.resolveImport=xg;function bW(t,e){if(se.isGrammarImport(e)){let r=xg(t,e);if(r){let n=Ng(t,r);return n.push(r),n}return[]}else return Ng(t,e)}re.resolveTransitiveImports=bW;function Ng(t,e,r=e,n=new Set,i=new Set){let o=(0,id.getDocument)(e);if(r!==e&&i.add(e),!n.has(o.uri)){n.add(o.uri);for(let a of e.imports){let s=xg(t,a);s&&Ng(t,s,r,n,i)}}return Array.from(i)}function kg(t){return se.isAssignment(t)?[t]:se.isAlternatives(t)||se.isGroup(t)||se.isUnorderedGroup(t)?t.elements.flatMap(e=>kg(e)):se.isRuleCall(t)&&t.rule.ref?kg(t.rule.ref.definition):[]}re.extractAssignments=kg;var AW=["string","number","boolean","Date","bigint"];function PW(t){return AW.includes(t)}re.isPrimitiveType=PW});var cd=f(ot=>{"use strict";Object.defineProperty(ot,"__esModule",{value:!0});ot.flattenPlainType=ot.mergePropertyTypes=ot.plainToTypes=ot.isPlainStringType=ot.isPlainPrimitiveType=ot.isPlainValueType=ot.isPlainPropertyUnion=ot.isPlainArrayType=ot.isPlainReferenceType=ot.isPlainUnion=ot.isPlainInterface=void 0;var kA=Xa();function SW(t){return!wA(t)}ot.isPlainInterface=SW;function wA(t){return"type"in t}ot.isPlainUnion=wA;function od(t){return"referenceType"in t}ot.isPlainReferenceType=od;function ad(t){return"elementType"in t}ot.isPlainArrayType=ad;function Lg(t){return"types"in t}ot.isPlainPropertyUnion=Lg;function sd(t){return"value"in t}ot.isPlainValueType=sd;function OA(t){return"primitive"in t}ot.isPlainPrimitiveType=OA;function DA(t){return"string"in t}ot.isPlainStringType=DA;function CW(t){let e=new Map,r=new Map;for(let n of t.interfaces){let i=new kA.InterfaceType(n.name,n.declared,n.abstract);e.set(n.name,i)}for(let n of t.unions){let i=new kA.UnionType(n.name,{declared:n.declared,dataType:n.dataType});r.set(n.name,i)}for(let n of t.interfaces){let i=e.get(n.name);for(let o of n.superTypes){let a=e.get(o)||r.get(o);a&&i.superTypes.add(a)}for(let o of n.subTypes){let a=e.get(o)||r.get(o);a&&i.subTypes.add(a)}for(let o of n.properties){let a=EW(o,e,r);i.properties.push(a)}}for(let n of t.unions){let i=r.get(n.name);i.type=Zu(n.type,i,e,r)}return{interfaces:Array.from(e.values()),unions:Array.from(r.values())}}ot.plainToTypes=CW;function EW(t,e,r){return{name:t.name,optional:t.optional,astNodes:t.astNodes,type:Zu(t.type,void 0,e,r)}}function Zu(t,e,r,n){if(ad(t))return{elementType:Zu(t.elementType,e,r,n)};if(od(t))return{referenceType:Zu(t.referenceType,void 0,r,n)};if(Lg(t))return{types:t.types.map(i=>Zu(i,e,r,n))};if(DA(t))return{string:t.string};if(OA(t))return{primitive:t.primitive,regex:t.regex};if(sd(t)){let i=r.get(t.value)||n.get(t.value);return i?(e&&e.subTypes.add(i),{value:i}):{primitive:"unknown"}}else throw new Error("Invalid property type")}function NW(t,e){let r=ud(t),n=ud(e);for(let i of n)kW(r,i)||r.push(i);return r.length===1?r[0]:{types:r}}ot.mergePropertyTypes=NW;function kW(t,e){return t.some(r=>qg(r,e))}function qg(t,e){return ad(t)&&ad(e)?qg(t.elementType,e.elementType):od(t)&&od(e)?qg(t.referenceType,e.referenceType):sd(t)&&sd(e)?t.value===e.value:!1}function ud(t){return Lg(t)?t.types.flatMap(e=>ud(e)):[t]}ot.flattenPlainType=ud});var FA=f(ld=>{"use strict";Object.defineProperty(ld,"__esModule",{value:!0});ld.collectInferredTypes=void 0;var wW=Za(),jg=gn(),pt=ke(),Bn=jt(),xA=cd(),Mg=class{constructor(e,r){this.context=e,this.root=r}getTypes(){let e={name:this.root.name,properties:this.root.properties,ruleCalls:this.root.ruleCalls,super:[]};return this.root.children.length===0?[{alt:e,next:[]}]:this.applyNext(this.root,{alt:e,next:this.root.children})}applyNext(e,r){let n=this.splitType(r.alt,r.next.length),i=[];for(let o=0;o<r.next.length;o++){let a=n[o],s=r.next[o];s.actionWithAssignment&&i.push({alt:IA(a),next:[]}),s.name!==void 0&&s.name!==a.name&&(s.actionWithAssignment?(a.properties=[],a.ruleCalls=[],a.super=[e.name],a.name=s.name):(a.super=[a.name,...a.ruleCalls],a.properties=[],a.ruleCalls=[],a.name=s.name)),a.properties.push(...s.properties),a.ruleCalls.push(...s.ruleCalls);let u={alt:a,next:s.children};u.next.length===0?(u.alt.super=u.alt.super.filter(c=>c!==u.alt.name),i.push(u)):i.push(...this.applyNext(e,u))}return $A(i)}splitType(e,r){let n=[];for(let i=0;i<r;i++)n.push(IA(e));return n}getSuperTypes(e){let r=new Set;return this.collectSuperTypes(e,e,r),Array.from(r)}collectSuperTypes(e,r,n){if(r.ruleCalls.length>0){for(let i of r.ruleCalls)n.add(i);return}for(let i of r.parents)e.name===void 0?this.collectSuperTypes(i,i,n):i.name!==void 0&&i.name!==e.name?n.add(i.name):this.collectSuperTypes(e,i,n);r.parents.length===0&&r.name&&n.add(r.name)}connect(e,r){return r.parents.push(e),e.children.push(r),r}merge(...e){if(e.length===1)return e[0];if(e.length===0)throw new Error("No parts to merge");let r=Xo();r.parents=e;for(let n of e)n.children.push(r);return r}hasLeafNode(e){return this.partHasLeafNode(e)}partHasLeafNode(e,r){return e.children.some(n=>n!==r)?!0:e.name?!1:e.parents.some(n=>this.partHasLeafNode(n,e))}};function OW(t){return{name:t.name,children:[],parents:[],actionWithAssignment:t.actionWithAssignment,ruleCalls:[...t.ruleCalls],properties:t.properties.map(qA)}}function IA(t){return{name:t.name,super:t.super,ruleCalls:t.ruleCalls,properties:t.properties.map(e=>qA(e))}}function qA(t){return{name:t.name,optional:t.optional,type:t.type,astNodes:t.astNodes}}function DW(t,e,r){let n=[],i={fragments:new Map};for(let u of t)n.push(...LA(i,u));let o=$W(n),a=FW(o),s=jW(o,a,r);for(let u of e){let c=IW(u);s.unions.push({name:u.name,declared:!1,type:c,subTypes:new Set,superTypes:new Set,dataType:u.dataType})}return s}ld.collectInferredTypes=DW;function IW(t){if(t.dataType&&t.dataType!=="string")return{primitive:t.dataType};let e=!1,r=()=>(e=!0,{primitive:"unknown"}),n=$g(t.definition,r);return e?{primitive:"string"}:n}function $g(t,e){var r,n,i;if(t.cardinality)return e();if((0,pt.isAlternatives)(t))return{types:t.elements.map(o=>$g(o,e))};if((0,pt.isGroup)(t)||(0,pt.isUnorderedGroup)(t))return t.elements.length!==1?e():$g(t.elements[0],e);if((0,pt.isRuleCall)(t)){let o=(r=t.rule)===null||r===void 0?void 0:r.ref;return o?(0,pt.isTerminalRule)(o)?{primitive:(i=(n=o.type)===null||n===void 0?void 0:n.name)!==null&&i!==void 0?i:"string",regex:(0,Bn.terminalRegex)(o)}:{value:o.name}:e()}else if((0,pt.isKeyword)(t))return{string:t.value};return e()}function LA(t,e){let r=Xo(e),n=new Mg(t,r);return e.definition&&Fg(n,n.root,e.definition),n.getTypes()}function Xo(t){return{name:(0,pt.isParserRule)(t)||(0,pt.isAction)(t)?(0,Bn.getTypeNameWithoutError)(t):t,properties:[],ruleCalls:[],children:[],parents:[],actionWithAssignment:!1}}function Fg(t,e,r){let n=(0,Bn.isOptionalCardinality)(r.cardinality);if((0,pt.isAlternatives)(r)){let i=[];n&&i.push(t.connect(e,Xo()));for(let o of r.elements){let a=t.connect(e,Xo());i.push(Fg(t,a,o))}return t.merge(...i)}else if((0,pt.isGroup)(r)||(0,pt.isUnorderedGroup)(r)){let i=t.connect(e,Xo()),o;n&&(o=t.connect(e,Xo()));for(let a of r.elements)i=Fg(t,i,a);return o?t.merge(o,i):i}else{if((0,pt.isAction)(r))return xW(t,e,r);(0,pt.isAssignment)(r)?qW(e,r):(0,pt.isRuleCall)(r)&&LW(t,e,r)}return e}function xW(t,e,r){var n;if(!t.hasLeafNode(e)){let o=OW(e);t.connect(e,o)}let i=t.connect(e,Xo(r));if(r.type){let o=(n=r.type)===null||n===void 0?void 0:n.ref;o&&(0,wW.isNamed)(o)&&(i.name=o.name)}return r.feature&&r.operator&&(i.actionWithAssignment=!0,i.properties.push({name:r.feature,optional:!1,type:Jo(r.operator==="+=",!1,t.root.ruleCalls.length!==0?t.root.ruleCalls:t.getSuperTypes(i)),astNodes:new Set([r])})),i}function qW(t,e){let r={types:new Set,reference:!1};MA(e.terminal,r);let n=Jo(e.operator==="+=",r.reference,e.operator==="?="?["boolean"]:Array.from(r.types));t.properties.push({name:e.feature,optional:(0,Bn.isOptionalCardinality)(e.cardinality),type:n,astNodes:new Set([e])})}function MA(t,e){if((0,pt.isAlternatives)(t)||(0,pt.isUnorderedGroup)(t)||(0,pt.isGroup)(t))for(let r of t.elements)MA(r,e);else if((0,pt.isKeyword)(t))e.types.add(`'${t.value}'`);else if((0,pt.isRuleCall)(t)&&t.rule.ref)e.types.add((0,Bn.getRuleType)(t.rule.ref));else if((0,pt.isCrossReference)(t)&&t.type.ref){let r=(0,Bn.getTypeNameWithoutError)(t.type.ref);r&&e.types.add(r),e.reference=!0}}function LW(t,e,r){let n=r.rule.ref;if((0,pt.isParserRule)(n)&&n.fragment){let i=MW(n,t.context);(0,Bn.isOptionalCardinality)(r.cardinality)?e.properties.push(...i.map(o=>Object.assign(Object.assign({},o),{optional:!0}))):e.properties.push(...i)}else(0,pt.isParserRule)(n)&&e.ruleCalls.push((0,Bn.getRuleType)(n))}function MW(t,e){let r=e.fragments.get(t);if(r)return r;let n=[];e.fragments.set(t,n);let i=(0,Bn.getTypeNameWithoutError)(t),o=LA(e,t).filter(a=>a.alt.name===i);return n.push(...o.flatMap(a=>a.alt.properties)),n}function $W(t){let e=new Map,r=[],n=$A(t).map(i=>i.alt);for(let i of n){let o={name:i.name,properties:i.properties,superTypes:new Set(i.super),subTypes:new Set,declared:!1,abstract:!1};e.set(o.name,o),i.ruleCalls.length>0&&(r.push(i),i.ruleCalls.forEach(a=>{a!==o.name&&o.subTypes.add(a)}))}for(let i of r)for(let o of i.ruleCalls){let a=e.get(o);a&&a.name!==i.name&&a.superTypes.add(i.name)}return Array.from(e.values())}function $A(t){let e=t.reduce((n,i)=>n.add(i.alt.name,i),new jg.MultiMap),r=[];for(let[n,i]of e.entriesGroupedByKey()){let o=[],a=new Set,s={alt:{name:n,properties:o,ruleCalls:[],super:[]},next:[]};for(let u of i){let c=u.alt;s.alt.super.push(...c.super),s.next.push(...u.next);let l=c.properties;for(let d of l){let h=o.find(v=>v.name===d.name);h?(h.type=(0,xA.mergePropertyTypes)(h.type,d.type),d.astNodes.forEach(v=>h.astNodes.add(v))):o.push(Object.assign({},d))}c.ruleCalls.forEach(d=>a.add(d))}for(let u of i){let c=u.alt;if(c.ruleCalls.length===0)for(let l of o)c.properties.find(d=>d.name===l.name)||(l.optional=!0)}s.alt.ruleCalls=Array.from(a),r.push(s)}return r}function FW(t){let e=new Map(t.map(i=>[i.name,i])),r=[],n=new jg.MultiMap;for(let i of t)for(let o of i.superTypes)n.add(o,i.name);for(let[i,o]of n.entriesGroupedByKey())if(!e.has(i)){let a={declared:!1,name:i,subTypes:new Set,superTypes:new Set,type:Jo(!1,!1,o)};r.push(a)}return r}function jW(t,e,r){let n=new jg.MultiMap;for(let s of t)for(let u of s.superTypes)n.add(u,s.name);let i=new Set(r.interfaces.map(s=>s.name)),o={interfaces:[],unions:e},a=new Map(e.map(s=>[s.name,s]));for(let s of t){let u=new Set(n.get(s.name));if(s.properties.length===0&&u.size>0)if(i.has(s.name))s.abstract=!0,o.interfaces.push(s);else{let c=Jo(!1,!1,Array.from(u)),l=a.get(s.name);if(l)l.type=(0,xA.mergePropertyTypes)(l.type,c);else{let d={name:s.name,declared:!1,subTypes:u,superTypes:s.superTypes,type:c};o.unions.push(d),a.set(s.name,d)}}else o.interfaces.push(s)}for(let s of o.interfaces)s.superTypes=new Set([...s.superTypes].filter(u=>!a.has(u)));return o}function Jo(t,e,r){if(t)return{elementType:Jo(!1,e,r)};if(e)return{referenceType:Jo(!1,!1,r)};if(r.length===1){let n=r[0];return n.startsWith("'")?{string:n.substring(1,n.length-1)}:(0,Bn.isPrimitiveType)(n)?{primitive:n}:{value:n}}else return{types:r.map(n=>Jo(!1,!1,[n]))}}});var Gg=f(ts=>{"use strict";Object.defineProperty(ts,"__esModule",{value:!0});ts.typeDefinitionToPropertyType=ts.collectDeclaredTypes=void 0;var dd=ke(),Ug=jt();function UW(t,e){let r={unions:[],interfaces:[]};for(let n of t){let i=[];for(let s of n.attributes)i.push({name:s.name,optional:s.isOptional,astNodes:new Set([s]),type:es(s.type)});let o=new Set;for(let s of n.superTypes)s.ref&&o.add((0,Ug.getTypeName)(s.ref));let a={name:n.name,declared:!0,abstract:!1,properties:i,superTypes:o,subTypes:new Set};r.interfaces.push(a)}for(let n of e){let i={name:n.name,declared:!0,type:es(n.type),superTypes:new Set,subTypes:new Set};r.unions.push(i)}return r}ts.collectDeclaredTypes=UW;function es(t){if((0,dd.isArrayType)(t))return{elementType:es(t.elementType)};if((0,dd.isReferenceType)(t))return{referenceType:es(t.referenceType)};if((0,dd.isUnionType)(t))return{types:t.types.map(es)};if((0,dd.isSimpleType)(t)){let e;if(t.primitiveType)return e=t.primitiveType,{primitive:e};if(t.stringType)return e=t.stringType,{string:e};if(t.typeRef){let r=t.typeRef.ref,n=(0,Ug.getTypeNameWithoutError)(r);if(n)return(0,Ug.isPrimitiveType)(n)?{primitive:n}:{value:n}}}return{primitive:"unknown"}}ts.typeDefinitionToPropertyType=es});var UA=f(rs=>{"use strict";Object.defineProperty(rs,"__esModule",{value:!0});rs.collectAllAstResources=rs.collectTypeResources=void 0;var GW=FA(),HW=Gg(),WW=be(),BW=ke(),jA=jt();function KW(t,e){let r=Hg(t,e),n=(0,HW.collectDeclaredTypes)(r.interfaces,r.types),i=(0,GW.collectInferredTypes)(r.parserRules,r.datatypeRules,n);return{astResources:r,inferred:i,declared:n}}rs.collectTypeResources=KW;function Hg(t,e,r=new Set,n={parserRules:[],datatypeRules:[],interfaces:[],types:[]}){Array.isArray(t)||(t=[t]);for(let i of t){let o=(0,WW.getDocument)(i);if(!r.has(o.uri)){r.add(o.uri);for(let a of i.rules)(0,BW.isParserRule)(a)&&!a.fragment&&((0,jA.isDataTypeRule)(a)?n.datatypeRules.push(a):n.parserRules.push(a));if(i.interfaces.forEach(a=>n.interfaces.push(a)),i.types.forEach(a=>n.types.push(a)),e){let a=i.imports.map(s=>(0,jA.resolveImport)(e,s)).filter(s=>s!==void 0);Hg(a,e,r,n)}}}return n}rs.collectAllAstResources=Hg});var Kg=f(Kn=>{"use strict";Object.defineProperty(Kn,"__esModule",{value:!0});Kn.specifyAstNodeProperties=Kn.createAstTypes=Kn.collectValidationAst=Kn.collectAst=void 0;var HA=Ja(),Si=Xa(),WA=UA(),zW=cd();function VW(t,e){let{inferred:r,declared:n}=(0,WA.collectTypeResources)(t,e);return fd(r,n)}Kn.collectAst=VW;function YW(t,e){let{inferred:r,declared:n,astResources:i}=(0,WA.collectTypeResources)(t,e);return{astResources:i,inferred:fd(n,r),declared:fd(r,n)}}Kn.collectValidationAst=YW;function fd(t,e){var r,n;let i={interfaces:(0,HA.sortInterfacesTopologically)(GA(...t.interfaces,...(r=e?.interfaces)!==null&&r!==void 0?r:[])),unions:GA(...t.unions,...(n=e?.unions)!==null&&n!==void 0?n:[])},o=(0,zW.plainToTypes)(i);return BA(o),o}Kn.createAstTypes=fd;function GA(...t){return Array.from(t.reduce((e,r)=>(e.set(r.name,r),e),new Map).values()).sort((e,r)=>e.name.localeCompare(r.name))}function BA(t){let e=JW(t),r=Array.from(e.values());QW(r),ZW(r),XW(r)}Kn.specifyAstNodeProperties=BA;function XW(t){let e=new Set,r=n=>{if(!e.has(n)){e.add(n),n.typeNames.add(n.name);for(let i of n.subTypes)r(i),i.typeNames.forEach(o=>n.typeNames.add(o))}};t.forEach(r)}function JW({interfaces:t,unions:e}){let r=t.concat(e).reduce((i,o)=>(i.set(o.name,o),i),new Map),n=new Map;for(let i of e)n.set(i,Wg(i.type,new Set));for(let[i,o]of n)o&&r.delete(i.name);return r}function Wg(t,e){if(e.has(t))return!0;if(e.add(t),(0,Si.isPropertyUnion)(t))return t.types.every(r=>Wg(r,e));if((0,Si.isValueType)(t)){let r=t.value;return(0,Si.isUnionType)(r)?Wg(r.type,e):!1}else return(0,Si.isPrimitiveType)(t)||(0,Si.isStringType)(t)}function QW(t){for(let e of t)for(let r of e.superTypes)r.subTypes.add(e)}function ZW(t){let e=t.filter(Si.isInterfaceType);for(let n of e){let i=n.properties.flatMap(o=>Bg(o.type,new Set));for(let o of i)o.containerTypes.add(n)}let r=eB(t);tB(r)}function Bg(t,e){return(0,Si.isPropertyUnion)(t)?t.types.flatMap(r=>Bg(r,e)):(0,Si.isValueType)(t)?e.has(t.value)?[]:(e.add(t.value),[t.value]):(0,Si.isArrayType)(t)?Bg(t.elementType,e):[]}function eB(t){function e(a){let s=[a];o.add(a);let u=[...i.subTypes.get(a.name),...i.superTypes.get(a.name)];for(let c of u){let l=r.get(c);l&&!o.has(l)&&s.push(...e(l))}return s}let r=new Map(t.map(a=>[a.name,a])),n=[],i=(0,HA.collectTypeHierarchy)(t),o=new Set;for(let a of t)o.has(a)||n.push(e(a));return n}function tB(t){for(let e of t){let r=new Set;e.forEach(n=>n.containerTypes.forEach(i=>r.add(i))),e.forEach(n=>n.containerTypes=r)}}});var Vg=f(pd=>{"use strict";Object.defineProperty(pd,"__esModule",{value:!0});pd.interpretAstReflection=void 0;var rB=er(),nB=gn(),iB=ke(),oB=Kg(),Qo=Ja();function aB(t,e){let r;(0,iB.isGrammar)(t)?r=(0,oB.collectAst)(t,e):r=t;let n=r.interfaces.map(s=>s.name).concat(r.unions.filter(s=>(0,Qo.isAstType)(s.type)).map(s=>s.name)),i=sB(r),o=uB(r),a=(0,Qo.collectTypeHierarchy)((0,Qo.mergeTypesAndInterfaces)(r)).superTypes;return new zg({allTypes:n,references:i,metaData:o,superTypes:a})}pd.interpretAstReflection=aB;var zg=class extends rB.AbstractAstReflection{constructor(e){super(),this.allTypes=e.allTypes,this.references=e.references,this.metaData=e.metaData,this.superTypes=e.superTypes}getAllTypes(){return this.allTypes}getReferenceType(e){let r=`${e.container.$type}:${e.property}`,n=this.references.get(r);if(n)return n;throw new Error("Could not find reference type for "+r)}getTypeMetaData(e){var r;return(r=this.metaData.get(e))!==null&&r!==void 0?r:{name:e,mandatory:[]}}computeIsSubtype(e,r){let n=this.superTypes.get(e);for(let i of n)if(this.isSubtype(i,r))return!0;return!1}};function sB(t){let e=new nB.MultiMap;for(let n of t.interfaces){for(let i of n.properties)for(let o of(0,Qo.findReferenceTypes)(i.type))e.add(n.name,[i.name,o]);for(let i of n.interfaceSuperTypes){let o=e.get(i.name);e.addAll(n.name,o)}}let r=new Map;for(let[n,[i,o]]of e)r.set(`${n}:${i}`,o);return r}function uB(t){let e=new Map;for(let r of t.interfaces){let n=r.superProperties,i=n.filter(a=>(0,Qo.hasArrayType)(a.type)),o=n.filter(a=>!(0,Qo.hasArrayType)(a.type)&&(0,Qo.hasBooleanType)(a.type));(i.length>0||o.length>0)&&e.set(r.name,{name:r.name,mandatory:cB(i,o)})}return e}function cB(t,e){let r=[],n=t.concat(e).sort((i,o)=>i.name.localeCompare(o.name));for(let i of n){let o=t.includes(i)?"array":"boolean";r.push({name:i.name,type:o})}return r}});var KA=f(md=>{"use strict";Object.defineProperty(md,"__esModule",{value:!0});md.LangiumGrammarGrammar=void 0;var lB=vt(),hd,dB=()=>hd??(hd=(0,lB.loadGrammarFromJson)(`{
  "$type": "Grammar",
  "isDeclared": true,
  "name": "LangiumGrammar",
  "rules": [
    {
      "$type": "ParserRule",
      "name": "Grammar",
      "entry": true,
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "isDeclared",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "grammar"
                }
              },
              {
                "$type": "Assignment",
                "feature": "name",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@59"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "with"
                  },
                  {
                    "$type": "Assignment",
                    "feature": "usedGrammars",
                    "operator": "+=",
                    "terminal": {
                      "$type": "CrossReference",
                      "type": {
                        "$ref": "#/rules@0"
                      },
                      "terminal": {
                        "$type": "RuleCall",
                        "rule": {
                          "$ref": "#/rules@59"
                        },
                        "arguments": []
                      },
                      "deprecatedSyntax": false
                    }
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": ","
                      },
                      {
                        "$type": "Assignment",
                        "feature": "usedGrammars",
                        "operator": "+=",
                        "terminal": {
                          "$type": "CrossReference",
                          "type": {
                            "$ref": "#/rules@0"
                          },
                          "terminal": {
                            "$type": "RuleCall",
                            "rule": {
                              "$ref": "#/rules@59"
                            },
                            "arguments": []
                          },
                          "deprecatedSyntax": false
                        }
                      }
                    ],
                    "cardinality": "*"
                  }
                ],
                "cardinality": "?"
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Assignment",
                    "feature": "definesHiddenTokens",
                    "operator": "?=",
                    "terminal": {
                      "$type": "Keyword",
                      "value": "hidden"
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": "("
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Assignment",
                        "feature": "hiddenTokens",
                        "operator": "+=",
                        "terminal": {
                          "$type": "CrossReference",
                          "type": {
                            "$ref": "#/rules@11"
                          },
                          "terminal": {
                            "$type": "RuleCall",
                            "rule": {
                              "$ref": "#/rules@59"
                            },
                            "arguments": []
                          },
                          "deprecatedSyntax": false
                        }
                      },
                      {
                        "$type": "Group",
                        "elements": [
                          {
                            "$type": "Keyword",
                            "value": ","
                          },
                          {
                            "$type": "Assignment",
                            "feature": "hiddenTokens",
                            "operator": "+=",
                            "terminal": {
                              "$type": "CrossReference",
                              "type": {
                                "$ref": "#/rules@11"
                              },
                              "terminal": {
                                "$type": "RuleCall",
                                "rule": {
                                  "$ref": "#/rules@59"
                                },
                                "arguments": []
                              },
                              "deprecatedSyntax": false
                            }
                          }
                        ],
                        "cardinality": "*"
                      }
                    ],
                    "cardinality": "?"
                  },
                  {
                    "$type": "Keyword",
                    "value": ")"
                  }
                ],
                "cardinality": "?"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "imports",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@12"
              },
              "arguments": []
            },
            "cardinality": "*"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "rules",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@11"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Assignment",
                "feature": "interfaces",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@1"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Assignment",
                "feature": "types",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@10"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "+"
          }
        ]
      },
      "definesHiddenTokens": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Interface",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "interface"
          },
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@59"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "extends"
              },
              {
                "$type": "Assignment",
                "feature": "superTypes",
                "operator": "+=",
                "terminal": {
                  "$type": "CrossReference",
                  "type": {
                    "$ref": "#/types@0"
                  },
                  "terminal": {
                    "$type": "RuleCall",
                    "rule": {
                      "$ref": "#/rules@59"
                    },
                    "arguments": []
                  },
                  "deprecatedSyntax": false
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": ","
                  },
                  {
                    "$type": "Assignment",
                    "feature": "superTypes",
                    "operator": "+=",
                    "terminal": {
                      "$type": "CrossReference",
                      "type": {
                        "$ref": "#/types@0"
                      },
                      "terminal": {
                        "$type": "RuleCall",
                        "rule": {
                          "$ref": "#/rules@59"
                        },
                        "arguments": []
                      },
                      "deprecatedSyntax": false
                    }
                  }
                ],
                "cardinality": "*"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@2"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SchemaType",
      "fragment": true,
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "{"
          },
          {
            "$type": "Assignment",
            "feature": "attributes",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@3"
              },
              "arguments": []
            },
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": "}"
          },
          {
            "$type": "Keyword",
            "value": ";",
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "TypeAttribute",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@58"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "isOptional",
            "operator": "?=",
            "terminal": {
              "$type": "Keyword",
              "value": "?"
            },
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ":"
          },
          {
            "$type": "Assignment",
            "feature": "type",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@4"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ";",
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "TypeDefinition",
      "definition": {
        "$type": "RuleCall",
        "rule": {
          "$ref": "#/rules@5"
        },
        "arguments": []
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "UnionType",
      "inferredType": {
        "$type": "InferredType",
        "name": "TypeDefinition"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@6"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Action",
                "inferredType": {
                  "$type": "InferredType",
                  "name": "UnionType"
                },
                "feature": "types",
                "operator": "+="
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "|"
                  },
                  {
                    "$type": "Assignment",
                    "feature": "types",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@6"
                      },
                      "arguments": []
                    }
                  }
                ],
                "cardinality": "+"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ArrayType",
      "inferredType": {
        "$type": "InferredType",
        "name": "TypeDefinition"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@7"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Action",
                "inferredType": {
                  "$type": "InferredType",
                  "name": "ArrayType"
                },
                "feature": "elementType",
                "operator": "="
              },
              {
                "$type": "Keyword",
                "value": "["
              },
              {
                "$type": "Keyword",
                "value": "]"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ReferenceType",
      "inferredType": {
        "$type": "InferredType",
        "name": "TypeDefinition"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@8"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Action",
                "inferredType": {
                  "$type": "InferredType",
                  "name": "ReferenceType"
                }
              },
              {
                "$type": "Keyword",
                "value": "@"
              },
              {
                "$type": "Assignment",
                "feature": "referenceType",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@8"
                  },
                  "arguments": []
                }
              }
            ]
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SimpleType",
      "inferredType": {
        "$type": "InferredType",
        "name": "TypeDefinition"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@4"
                },
                "arguments": []
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ]
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Action",
                "inferredType": {
                  "$type": "InferredType",
                  "name": "SimpleType"
                }
              },
              {
                "$type": "Alternatives",
                "elements": [
                  {
                    "$type": "Assignment",
                    "feature": "typeRef",
                    "operator": "=",
                    "terminal": {
                      "$type": "CrossReference",
                      "type": {
                        "$ref": "#/types@0"
                      },
                      "terminal": {
                        "$type": "RuleCall",
                        "rule": {
                          "$ref": "#/rules@59"
                        },
                        "arguments": []
                      },
                      "deprecatedSyntax": false
                    }
                  },
                  {
                    "$type": "Assignment",
                    "feature": "primitiveType",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@9"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Assignment",
                    "feature": "stringType",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@60"
                      },
                      "arguments": []
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "PrimitiveType",
      "dataType": "string",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Keyword",
            "value": "string"
          },
          {
            "$type": "Keyword",
            "value": "number"
          },
          {
            "$type": "Keyword",
            "value": "boolean"
          },
          {
            "$type": "Keyword",
            "value": "Date"
          },
          {
            "$type": "Keyword",
            "value": "bigint"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Type",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "type"
          },
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@59"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": "="
          },
          {
            "$type": "Assignment",
            "feature": "type",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@4"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ";",
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "AbstractRule",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@13"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@46"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "GrammarImport",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "import"
          },
          {
            "$type": "Assignment",
            "feature": "path",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@60"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ";",
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ParserRule",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "entry",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "entry"
                }
              },
              {
                "$type": "Assignment",
                "feature": "fragment",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "fragment"
                }
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@15"
            },
            "arguments": []
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "wildcard",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "*"
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "returns"
                  },
                  {
                    "$type": "Alternatives",
                    "elements": [
                      {
                        "$type": "Assignment",
                        "feature": "returnType",
                        "operator": "=",
                        "terminal": {
                          "$type": "CrossReference",
                          "type": {
                            "$ref": "#/types@0"
                          },
                          "terminal": {
                            "$type": "RuleCall",
                            "rule": {
                              "$ref": "#/rules@59"
                            },
                            "arguments": []
                          },
                          "deprecatedSyntax": false
                        }
                      },
                      {
                        "$type": "Assignment",
                        "feature": "dataType",
                        "operator": "=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@9"
                          },
                          "arguments": []
                        }
                      }
                    ]
                  }
                ]
              },
              {
                "$type": "Assignment",
                "feature": "inferredType",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@14"
                  },
                  "arguments": [
                    {
                      "$type": "NamedArgument",
                      "value": {
                        "$type": "LiteralCondition",
                        "true": false
                      },
                      "calledByName": false
                    }
                  ]
                }
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "definesHiddenTokens",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "hidden"
                }
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Assignment",
                    "feature": "hiddenTokens",
                    "operator": "+=",
                    "terminal": {
                      "$type": "CrossReference",
                      "type": {
                        "$ref": "#/rules@11"
                      },
                      "terminal": {
                        "$type": "RuleCall",
                        "rule": {
                          "$ref": "#/rules@59"
                        },
                        "arguments": []
                      },
                      "deprecatedSyntax": false
                    }
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": ","
                      },
                      {
                        "$type": "Assignment",
                        "feature": "hiddenTokens",
                        "operator": "+=",
                        "terminal": {
                          "$type": "CrossReference",
                          "type": {
                            "$ref": "#/rules@11"
                          },
                          "terminal": {
                            "$type": "RuleCall",
                            "rule": {
                              "$ref": "#/rules@59"
                            },
                            "arguments": []
                          },
                          "deprecatedSyntax": false
                        }
                      }
                    ],
                    "cardinality": "*"
                  }
                ],
                "cardinality": "?"
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ":"
          },
          {
            "$type": "Assignment",
            "feature": "definition",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@17"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "InferredType",
      "parameters": [
        {
          "$type": "Parameter",
          "name": "imperative"
        }
      ],
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Group",
                "guardCondition": {
                  "$type": "ParameterReference",
                  "parameter": {
                    "$ref": "#/rules@14/parameters@0"
                  }
                },
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "infer"
                  }
                ]
              },
              {
                "$type": "Group",
                "guardCondition": {
                  "$type": "Negation",
                  "value": {
                    "$type": "ParameterReference",
                    "parameter": {
                      "$ref": "#/rules@14/parameters@0"
                    }
                  }
                },
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "infers"
                  }
                ]
              }
            ]
          },
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@59"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "RuleNameAndParams",
      "fragment": true,
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@59"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "<"
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Assignment",
                    "feature": "parameters",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@16"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": ","
                      },
                      {
                        "$type": "Assignment",
                        "feature": "parameters",
                        "operator": "+=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@16"
                          },
                          "arguments": []
                        }
                      }
                    ],
                    "cardinality": "*"
                  }
                ],
                "cardinality": "?"
              },
              {
                "$type": "Keyword",
                "value": ">"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Parameter",
      "definition": {
        "$type": "Assignment",
        "feature": "name",
        "operator": "=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@59"
          },
          "arguments": []
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Alternatives",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@18"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Action",
                "inferredType": {
                  "$type": "InferredType",
                  "name": "Alternatives"
                },
                "feature": "elements",
                "operator": "+="
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "|"
                  },
                  {
                    "$type": "Assignment",
                    "feature": "elements",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@18"
                      },
                      "arguments": []
                    }
                  }
                ],
                "cardinality": "+"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ConditionalBranch",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@19"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Action",
                "inferredType": {
                  "$type": "InferredType",
                  "name": "Group"
                }
              },
              {
                "$type": "Keyword",
                "value": "<"
              },
              {
                "$type": "Assignment",
                "feature": "guardCondition",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@29"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ">"
              },
              {
                "$type": "Assignment",
                "feature": "elements",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@21"
                  },
                  "arguments": []
                },
                "cardinality": "+"
              }
            ]
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "UnorderedGroup",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@20"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Action",
                "inferredType": {
                  "$type": "InferredType",
                  "name": "UnorderedGroup"
                },
                "feature": "elements",
                "operator": "+="
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "&"
                  },
                  {
                    "$type": "Assignment",
                    "feature": "elements",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@20"
                      },
                      "arguments": []
                    }
                  }
                ],
                "cardinality": "+"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Group",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@21"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Action",
                "inferredType": {
                  "$type": "InferredType",
                  "name": "Group"
                },
                "feature": "elements",
                "operator": "+="
              },
              {
                "$type": "Assignment",
                "feature": "elements",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@21"
                  },
                  "arguments": []
                },
                "cardinality": "+"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "AbstractToken",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@22"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@23"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "AbstractTokenWithCardinality",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@37"
                },
                "arguments": []
              },
              {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@24"
                },
                "arguments": []
              }
            ]
          },
          {
            "$type": "Assignment",
            "feature": "cardinality",
            "operator": "=",
            "terminal": {
              "$type": "Alternatives",
              "elements": [
                {
                  "$type": "Keyword",
                  "value": "?"
                },
                {
                  "$type": "Keyword",
                  "value": "*"
                },
                {
                  "$type": "Keyword",
                  "value": "+"
                }
              ]
            },
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Action",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Action",
            "inferredType": {
              "$type": "InferredType",
              "name": "Action"
            }
          },
          {
            "$type": "Keyword",
            "value": "{"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "type",
                "operator": "=",
                "terminal": {
                  "$type": "CrossReference",
                  "type": {
                    "$ref": "#/types@0"
                  },
                  "terminal": {
                    "$type": "RuleCall",
                    "rule": {
                      "$ref": "#/rules@59"
                    },
                    "arguments": []
                  },
                  "deprecatedSyntax": false
                }
              },
              {
                "$type": "Assignment",
                "feature": "inferredType",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@14"
                  },
                  "arguments": [
                    {
                      "$type": "NamedArgument",
                      "value": {
                        "$type": "LiteralCondition",
                        "true": true
                      },
                      "calledByName": false
                    }
                  ]
                }
              }
            ]
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "."
              },
              {
                "$type": "Assignment",
                "feature": "feature",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@58"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Assignment",
                "feature": "operator",
                "operator": "=",
                "terminal": {
                  "$type": "Alternatives",
                  "elements": [
                    {
                      "$type": "Keyword",
                      "value": "="
                    },
                    {
                      "$type": "Keyword",
                      "value": "+="
                    }
                  ]
                }
              },
              {
                "$type": "Keyword",
                "value": "current"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": "}"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "AbstractTerminal",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@25"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@26"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@43"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@35"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@36"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@44"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Keyword",
      "definition": {
        "$type": "Assignment",
        "feature": "value",
        "operator": "=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@60"
          },
          "arguments": []
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "RuleCall",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "rule",
            "operator": "=",
            "terminal": {
              "$type": "CrossReference",
              "type": {
                "$ref": "#/rules@11"
              },
              "terminal": {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@59"
                },
                "arguments": []
              },
              "deprecatedSyntax": false
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "<"
              },
              {
                "$type": "Assignment",
                "feature": "arguments",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@27"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": ","
                  },
                  {
                    "$type": "Assignment",
                    "feature": "arguments",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@27"
                      },
                      "arguments": []
                    }
                  }
                ],
                "cardinality": "*"
              },
              {
                "$type": "Keyword",
                "value": ">"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "NamedArgument",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "parameter",
                "operator": "=",
                "terminal": {
                  "$type": "CrossReference",
                  "type": {
                    "$ref": "#/rules@16"
                  },
                  "terminal": {
                    "$type": "RuleCall",
                    "rule": {
                      "$ref": "#/rules@59"
                    },
                    "arguments": []
                  },
                  "deprecatedSyntax": false
                }
              },
              {
                "$type": "Assignment",
                "feature": "calledByName",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "="
                }
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "value",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@29"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "LiteralCondition",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "true",
            "operator": "?=",
            "terminal": {
              "$type": "Keyword",
              "value": "true"
            }
          },
          {
            "$type": "Keyword",
            "value": "false"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Disjunction",
      "inferredType": {
        "$type": "InferredType",
        "name": "Condition"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@30"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Action",
                "inferredType": {
                  "$type": "InferredType",
                  "name": "Disjunction"
                },
                "feature": "left",
                "operator": "="
              },
              {
                "$type": "Keyword",
                "value": "|"
              },
              {
                "$type": "Assignment",
                "feature": "right",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@30"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Conjunction",
      "inferredType": {
        "$type": "InferredType",
        "name": "Condition"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@31"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Action",
                "inferredType": {
                  "$type": "InferredType",
                  "name": "Conjunction"
                },
                "feature": "left",
                "operator": "="
              },
              {
                "$type": "Keyword",
                "value": "&"
              },
              {
                "$type": "Assignment",
                "feature": "right",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@31"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Negation",
      "inferredType": {
        "$type": "InferredType",
        "name": "Condition"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@32"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Action",
                "inferredType": {
                  "$type": "InferredType",
                  "name": "Negation"
                }
              },
              {
                "$type": "Keyword",
                "value": "!"
              },
              {
                "$type": "Assignment",
                "feature": "value",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@31"
                  },
                  "arguments": []
                }
              }
            ]
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Atom",
      "inferredType": {
        "$type": "InferredType",
        "name": "Condition"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@34"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@33"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@28"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ParenthesizedCondition",
      "inferredType": {
        "$type": "InferredType",
        "name": "Condition"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@29"
            },
            "arguments": []
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ParameterReference",
      "definition": {
        "$type": "Assignment",
        "feature": "parameter",
        "operator": "=",
        "terminal": {
          "$type": "CrossReference",
          "type": {
            "$ref": "#/rules@16"
          },
          "terminal": {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@59"
            },
            "arguments": []
          },
          "deprecatedSyntax": false
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "PredicatedKeyword",
      "inferredType": {
        "$type": "InferredType",
        "name": "Keyword"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Keyword",
                "value": "=>"
              },
              {
                "$type": "Keyword",
                "value": "->"
              }
            ]
          },
          {
            "$type": "Assignment",
            "feature": "value",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@60"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "PredicatedRuleCall",
      "inferredType": {
        "$type": "InferredType",
        "name": "RuleCall"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Keyword",
                "value": "=>"
              },
              {
                "$type": "Keyword",
                "value": "->"
              }
            ]
          },
          {
            "$type": "Assignment",
            "feature": "rule",
            "operator": "=",
            "terminal": {
              "$type": "CrossReference",
              "type": {
                "$ref": "#/rules@11"
              },
              "terminal": {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@59"
                },
                "arguments": []
              },
              "deprecatedSyntax": false
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "<"
              },
              {
                "$type": "Assignment",
                "feature": "arguments",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@27"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": ","
                  },
                  {
                    "$type": "Assignment",
                    "feature": "arguments",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@27"
                      },
                      "arguments": []
                    }
                  }
                ],
                "cardinality": "*"
              },
              {
                "$type": "Keyword",
                "value": ">"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Assignment",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Action",
            "inferredType": {
              "$type": "InferredType",
              "name": "Assignment"
            }
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Keyword",
                "value": "=>"
              },
              {
                "$type": "Keyword",
                "value": "->"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "feature",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@58"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "operator",
            "operator": "=",
            "terminal": {
              "$type": "Alternatives",
              "elements": [
                {
                  "$type": "Keyword",
                  "value": "+="
                },
                {
                  "$type": "Keyword",
                  "value": "="
                },
                {
                  "$type": "Keyword",
                  "value": "?="
                }
              ]
            }
          },
          {
            "$type": "Assignment",
            "feature": "terminal",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@38"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "AssignableTerminal",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@25"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@26"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@39"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@41"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ParenthesizedAssignableElement",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@40"
            },
            "arguments": []
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "AssignableAlternatives",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@38"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Action",
                "inferredType": {
                  "$type": "InferredType",
                  "name": "Alternatives"
                },
                "feature": "elements",
                "operator": "+="
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "|"
                  },
                  {
                    "$type": "Assignment",
                    "feature": "elements",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@38"
                      },
                      "arguments": []
                    }
                  }
                ],
                "cardinality": "+"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "CrossReference",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Action",
            "inferredType": {
              "$type": "InferredType",
              "name": "CrossReference"
            }
          },
          {
            "$type": "Keyword",
            "value": "["
          },
          {
            "$type": "Assignment",
            "feature": "type",
            "operator": "=",
            "terminal": {
              "$type": "CrossReference",
              "type": {
                "$ref": "#/types@0"
              },
              "deprecatedSyntax": false
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Alternatives",
                "elements": [
                  {
                    "$type": "Assignment",
                    "feature": "deprecatedSyntax",
                    "operator": "?=",
                    "terminal": {
                      "$type": "Keyword",
                      "value": "|"
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": ":"
                  }
                ]
              },
              {
                "$type": "Assignment",
                "feature": "terminal",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@42"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": "]"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "CrossReferenceableTerminal",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@25"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@26"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ParenthesizedElement",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@17"
            },
            "arguments": []
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "PredicatedGroup",
      "inferredType": {
        "$type": "InferredType",
        "name": "Group"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Keyword",
                "value": "=>"
              },
              {
                "$type": "Keyword",
                "value": "->"
              }
            ]
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "elements",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@17"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ReturnType",
      "definition": {
        "$type": "Assignment",
        "feature": "name",
        "operator": "=",
        "terminal": {
          "$type": "Alternatives",
          "elements": [
            {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@9"
              },
              "arguments": []
            },
            {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@59"
              },
              "arguments": []
            }
          ]
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "TerminalRule",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "hidden",
            "operator": "?=",
            "terminal": {
              "$type": "Keyword",
              "value": "hidden"
            },
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": "terminal"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Assignment",
                    "feature": "fragment",
                    "operator": "?=",
                    "terminal": {
                      "$type": "Keyword",
                      "value": "fragment"
                    }
                  },
                  {
                    "$type": "Assignment",
                    "feature": "name",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@59"
                      },
                      "arguments": []
                    }
                  }
                ]
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Assignment",
                    "feature": "name",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@59"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": "returns"
                      },
                      {
                        "$type": "Assignment",
                        "feature": "type",
                        "operator": "=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@45"
                          },
                          "arguments": []
                        }
                      }
                    ],
                    "cardinality": "?"
                  }
                ]
              }
            ]
          },
          {
            "$type": "Keyword",
            "value": ":"
          },
          {
            "$type": "Assignment",
            "feature": "definition",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@47"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "TerminalAlternatives",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@48"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Action",
                "inferredType": {
                  "$type": "InferredType",
                  "name": "TerminalAlternatives"
                },
                "feature": "elements",
                "operator": "+="
              },
              {
                "$type": "Keyword",
                "value": "|"
              },
              {
                "$type": "Assignment",
                "feature": "elements",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@48"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "TerminalGroup",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@49"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Action",
                "inferredType": {
                  "$type": "InferredType",
                  "name": "TerminalGroup"
                },
                "feature": "elements",
                "operator": "+="
              },
              {
                "$type": "Assignment",
                "feature": "elements",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@49"
                  },
                  "arguments": []
                },
                "cardinality": "+"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "TerminalToken",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@50"
            },
            "arguments": []
          },
          {
            "$type": "Assignment",
            "feature": "cardinality",
            "operator": "=",
            "terminal": {
              "$type": "Alternatives",
              "elements": [
                {
                  "$type": "Keyword",
                  "value": "?"
                },
                {
                  "$type": "Keyword",
                  "value": "*"
                },
                {
                  "$type": "Keyword",
                  "value": "+"
                }
              ]
            },
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "TerminalTokenElement",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@57"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@52"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@51"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@53"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@54"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@55"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@56"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ParenthesizedTerminalElement",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "lookahead",
            "operator": "=",
            "terminal": {
              "$type": "Alternatives",
              "elements": [
                {
                  "$type": "Keyword",
                  "value": "?="
                },
                {
                  "$type": "Keyword",
                  "value": "?!"
                }
              ]
            },
            "cardinality": "?"
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@47"
            },
            "arguments": []
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "TerminalRuleCall",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Action",
            "inferredType": {
              "$type": "InferredType",
              "name": "TerminalRuleCall"
            }
          },
          {
            "$type": "Assignment",
            "feature": "rule",
            "operator": "=",
            "terminal": {
              "$type": "CrossReference",
              "type": {
                "$ref": "#/rules@46"
              },
              "terminal": {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@59"
                },
                "arguments": []
              },
              "deprecatedSyntax": false
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "NegatedToken",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Action",
            "inferredType": {
              "$type": "InferredType",
              "name": "NegatedToken"
            }
          },
          {
            "$type": "Keyword",
            "value": "!"
          },
          {
            "$type": "Assignment",
            "feature": "terminal",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@50"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "UntilToken",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Action",
            "inferredType": {
              "$type": "InferredType",
              "name": "UntilToken"
            }
          },
          {
            "$type": "Keyword",
            "value": "->"
          },
          {
            "$type": "Assignment",
            "feature": "terminal",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@50"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "RegexToken",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Action",
            "inferredType": {
              "$type": "InferredType",
              "name": "RegexToken"
            }
          },
          {
            "$type": "Assignment",
            "feature": "regex",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@61"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Wildcard",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Action",
            "inferredType": {
              "$type": "InferredType",
              "name": "Wildcard"
            }
          },
          {
            "$type": "Keyword",
            "value": "."
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "CharacterRange",
      "inferredType": {
        "$type": "InferredType",
        "name": "AbstractElement"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Action",
            "inferredType": {
              "$type": "InferredType",
              "name": "CharacterRange"
            }
          },
          {
            "$type": "Assignment",
            "feature": "left",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@25"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ".."
              },
              {
                "$type": "Assignment",
                "feature": "right",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@25"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "FeatureName",
      "dataType": "string",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Keyword",
            "value": "current"
          },
          {
            "$type": "Keyword",
            "value": "entry"
          },
          {
            "$type": "Keyword",
            "value": "extends"
          },
          {
            "$type": "Keyword",
            "value": "false"
          },
          {
            "$type": "Keyword",
            "value": "fragment"
          },
          {
            "$type": "Keyword",
            "value": "grammar"
          },
          {
            "$type": "Keyword",
            "value": "hidden"
          },
          {
            "$type": "Keyword",
            "value": "import"
          },
          {
            "$type": "Keyword",
            "value": "interface"
          },
          {
            "$type": "Keyword",
            "value": "returns"
          },
          {
            "$type": "Keyword",
            "value": "terminal"
          },
          {
            "$type": "Keyword",
            "value": "true"
          },
          {
            "$type": "Keyword",
            "value": "type"
          },
          {
            "$type": "Keyword",
            "value": "infer"
          },
          {
            "$type": "Keyword",
            "value": "infers"
          },
          {
            "$type": "Keyword",
            "value": "with"
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@9"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@59"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "TerminalRule",
      "name": "ID",
      "definition": {
        "$type": "RegexToken",
        "regex": "\\\\^?[_a-zA-Z][\\\\w_]*"
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "STRING",
      "definition": {
        "$type": "RegexToken",
        "regex": "\\"(\\\\\\\\.|[^\\"\\\\\\\\])*\\"|'(\\\\\\\\.|[^'\\\\\\\\])*'"
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "RegexLiteral",
      "type": {
        "$type": "ReturnType",
        "name": "string"
      },
      "definition": {
        "$type": "RegexToken",
        "regex": "\\\\/(?![*+?])(?:[^\\\\r\\\\n\\\\[/\\\\\\\\]|\\\\\\\\.|\\\\[(?:[^\\\\r\\\\n\\\\]\\\\\\\\]|\\\\\\\\.)*\\\\])+\\\\/"
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "hidden": true,
      "name": "WS",
      "definition": {
        "$type": "RegexToken",
        "regex": "\\\\s+"
      },
      "fragment": false
    },
    {
      "$type": "TerminalRule",
      "hidden": true,
      "name": "ML_COMMENT",
      "definition": {
        "$type": "RegexToken",
        "regex": "\\\\/\\\\*[\\\\s\\\\S]*?\\\\*\\\\/"
      },
      "fragment": false
    },
    {
      "$type": "TerminalRule",
      "hidden": true,
      "name": "SL_COMMENT",
      "definition": {
        "$type": "RegexToken",
        "regex": "\\\\/\\\\/[^\\\\n\\\\r]*"
      },
      "fragment": false
    }
  ],
  "types": [
    {
      "$type": "Type",
      "name": "AbstractType",
      "type": {
        "$type": "UnionType",
        "types": [
          {
            "$type": "SimpleType",
            "typeRef": {
              "$ref": "#/rules@1"
            }
          },
          {
            "$type": "SimpleType",
            "typeRef": {
              "$ref": "#/rules@10"
            }
          },
          {
            "$type": "SimpleType",
            "typeRef": {
              "$ref": "#/rules@23/definition/elements@0"
            }
          },
          {
            "$type": "SimpleType",
            "typeRef": {
              "$ref": "#/rules@13"
            }
          }
        ]
      }
    }
  ],
  "definesHiddenTokens": false,
  "hiddenTokens": [],
  "imports": [],
  "interfaces": [],
  "usedGrammars": []
}`));md.LangiumGrammarGrammar=dB});var zA=f(Gr=>{"use strict";Object.defineProperty(Gr,"__esModule",{value:!0});Gr.LangiumGrammarGeneratedModule=Gr.LangiumGrammarGeneratedSharedModule=Gr.LangiumGrammarParserConfig=Gr.LangiumGrammarLanguageMetaData=void 0;var fB=ke(),pB=KA();Gr.LangiumGrammarLanguageMetaData={languageId:"langium",fileExtensions:[".langium"],caseInsensitive:!1};Gr.LangiumGrammarParserConfig={maxLookahead:3};Gr.LangiumGrammarGeneratedSharedModule={AstReflection:()=>new fB.LangiumGrammarAstReflection};Gr.LangiumGrammarGeneratedModule={Grammar:()=>(0,pB.LangiumGrammarGrammar)(),LanguageMetaData:()=>Gr.LangiumGrammarLanguageMetaData,parser:{ParserConfig:()=>Gr.LangiumGrammarParserConfig}}});var _r=f(Ct=>{"use strict";Object.defineProperty(Ct,"__esModule",{value:!0});Ct.Deferred=Ct.MutexLock=Ct.interruptAndCheck=Ct.isOperationCancelled=Ct.OperationCancelled=Ct.setInterruptionPeriod=Ct.startCancelableOperation=Ct.delayNextTick=void 0;var gd=Ti();function VA(){return new Promise(t=>{typeof setImmediate>"u"?setTimeout(t,0):setImmediate(t)})}Ct.delayNextTick=VA;var Yg=0,YA=10;function hB(){return Yg=Date.now(),new gd.CancellationTokenSource}Ct.startCancelableOperation=hB;function mB(t){YA=t}Ct.setInterruptionPeriod=mB;Ct.OperationCancelled=Symbol("OperationCancelled");function XA(t){return t===Ct.OperationCancelled}Ct.isOperationCancelled=XA;async function gB(t){if(t===gd.CancellationToken.None)return;let e=Date.now();if(e-Yg>=YA&&(Yg=e,await VA()),t.isCancellationRequested)throw Ct.OperationCancelled}Ct.interruptAndCheck=gB;var Xg=class{constructor(){this.previousAction=Promise.resolve(),this.previousTokenSource=new gd.CancellationTokenSource}lock(e){this.cancel();let r=new gd.CancellationTokenSource;return this.previousTokenSource=r,this.previousAction=this.previousAction.then(()=>e(r.token).catch(n=>{XA(n)||console.error("Error: ",n)}))}cancel(){this.previousTokenSource.cancel()}};Ct.MutexLock=Xg;var Jg=class{constructor(){this.promise=new Promise((e,r)=>{this.resolve=n=>(e(n),this),this.reject=n=>(r(n),this)})}};Ct.Deferred=Jg});var vd=f(yd=>{"use strict";Object.defineProperty(yd,"__esModule",{value:!0});yd.DefaultScopeComputation=void 0;var Qg=Ti(),JA=be(),yB=gn(),QA=_r(),Zg=class{constructor(e){this.nameProvider=e.references.NameProvider,this.descriptions=e.workspace.AstNodeDescriptionProvider}async computeExports(e,r=Qg.CancellationToken.None){return this.computeExportsForNode(e.parseResult.value,e,void 0,r)}async computeExportsForNode(e,r,n=JA.streamContents,i=Qg.CancellationToken.None){let o=[];this.exportNode(e,o,r);for(let a of n(e))await(0,QA.interruptAndCheck)(i),this.exportNode(a,o,r);return o}exportNode(e,r,n){let i=this.nameProvider.getName(e);i&&r.push(this.descriptions.createDescription(e,i,n))}async computeLocalScopes(e,r=Qg.CancellationToken.None){let n=e.parseResult.value,i=new yB.MultiMap;for(let o of(0,JA.streamAllContents)(n))await(0,QA.interruptAndCheck)(r),this.processNode(o,e,i);return i}processNode(e,r,n){let i=e.$container;if(i){let o=this.nameProvider.getName(e);o&&n.add(i,this.descriptions.createDescription(e,o,r))}}};yd.DefaultScopeComputation=Zg});var Td=f(io=>{"use strict";Object.defineProperty(io,"__esModule",{value:!0});io.DefaultScopeProvider=io.EMPTY_SCOPE=io.StreamScope=void 0;var vB=be(),_d=Ft(),ns=class{constructor(e,r,n){this.elements=e,this.outerScope=r,this.caseInsensitive=n?.caseInsensitive}getAllElements(){return this.outerScope?this.elements.concat(this.outerScope.getAllElements()):this.elements}getElement(e){let r=this.caseInsensitive?this.elements.find(n=>n.name.toLowerCase()===e.toLowerCase()):this.elements.find(n=>n.name===e);if(r)return r;if(this.outerScope)return this.outerScope.getElement(e)}};io.StreamScope=ns;io.EMPTY_SCOPE={getElement(){},getAllElements(){return _d.EMPTY_STREAM}};var ey=class{constructor(e){this.reflection=e.shared.AstReflection,this.nameProvider=e.references.NameProvider,this.descriptions=e.workspace.AstNodeDescriptionProvider,this.indexManager=e.shared.workspace.IndexManager}getScope(e){let r=[],n=this.reflection.getReferenceType(e),i=(0,vB.getDocument)(e.container).precomputedScopes;if(i){let a=e.container;do{let s=i.get(a);s.length>0&&r.push((0,_d.stream)(s).filter(u=>this.reflection.isSubtype(u.type,n))),a=a.$container}while(a)}let o=this.getGlobalScope(n,e);for(let a=r.length-1;a>=0;a--)o=this.createScope(r[a],o);return o}createScope(e,r,n){return new ns((0,_d.stream)(e),r,n)}createScopeForNodes(e,r,n){let i=(0,_d.stream)(e).map(o=>{let a=this.nameProvider.getName(o);if(a)return this.descriptions.createDescription(o,a)}).nonNullable();return new ns(i,r,n)}getGlobalScope(e,r){return new ns(this.indexManager.allElements(e))}};io.DefaultScopeProvider=ey});var Ci=f(is=>{"use strict";Object.defineProperty(is,"__esModule",{value:!0});is.relativeURI=is.equalURI=void 0;function _B(t,e){return t?.toString()===e?.toString()}is.equalURI=_B;function TB(t,e){let r=t.path,n=e.path,i=r.split("/").filter(c=>c.length>0),o=n.split("/").filter(c=>c.length>0),a=0;for(;a<i.length&&i[a]===o[a];a++);let s="../".repeat(i.length-a),u=o.slice(a).join("/");return s+u}is.relativeURI=TB});var tP=f(as=>{"use strict";Object.defineProperty(as,"__esModule",{value:!0});as.LangiumGrammarScopeComputation=as.LangiumGrammarScopeProvider=void 0;var RB=vd(),ty=Td(),os=be(),ZA=qe(),eP=Ft(),bB=Ci(),Hr=ke(),ry=jt(),ny=class extends ty.DefaultScopeProvider{constructor(e){super(e)}getScope(e){let r=this.reflection.getReferenceType(e);return r===Hr.AbstractType?this.getTypeScope(r,e):super.getScope(e)}getTypeScope(e,r){let n,i=(0,os.getDocument)(r.container).precomputedScopes,o=(0,os.findRootNode)(r.container);if(i&&o){let s=i.get(o);s.length>0&&(n=(0,eP.stream)(s).filter(u=>u.type===Hr.Interface||u.type===Hr.Type))}let a=this.getGlobalScope(e,r);return n?this.createScope(n,a):a}getGlobalScope(e,r){let n=(0,os.getContainerOfType)(r.container,Hr.isGrammar);if(!n)return ty.EMPTY_SCOPE;let i=(0,eP.stream)(n.imports).map(ry.resolveImportUri).nonNullable(),o=this.indexManager.allElements(e).filter(a=>i.some(s=>(0,bB.equalURI)(a.documentUri,s)));return e===Hr.AbstractType&&(o=o.filter(a=>a.type===Hr.Interface||a.type===Hr.Type)),new ty.StreamScope(o)}};as.LangiumGrammarScopeProvider=ny;var iy=class extends RB.DefaultScopeComputation{constructor(e){super(e),this.astNodeLocator=e.workspace.AstNodeLocator}exportNode(e,r,n){var i;if(super.exportNode(e,r,n),(0,Hr.isParserRule)(e)){if(!e.returnType&&!e.dataType){let o=(i=e.inferredType)!==null&&i!==void 0?i:e;r.push(this.createInterfaceDescription(o,o.name,n))}(0,os.streamAllContents)(e).forEach(o=>{if((0,Hr.isAction)(o)&&o.inferredType){let a=(0,ry.getActionType)(o);a&&r.push(this.createInterfaceDescription(o,a,n))}})}}processNode(e,r,n){(0,Hr.isReturnType)(e)||(this.processTypeNode(e,r,n),this.processActionNode(e,r,n),super.processNode(e,r,n))}processTypeNode(e,r,n){var i;let o=e.$container;if(o&&(0,Hr.isParserRule)(e)&&!e.returnType&&!e.dataType){let a=(i=e.inferredType)!==null&&i!==void 0?i:e;n.add(o,this.createInterfaceDescription(a,a.name,r))}}processActionNode(e,r,n){let i=(0,os.findRootNode)(e);if(i&&(0,Hr.isAction)(e)&&e.inferredType){let o=(0,ry.getActionType)(e);o&&n.add(i,this.createInterfaceDescription(e,o,r))}}createInterfaceDescription(e,r,n=(0,os.getDocument)(e)){var i;let o=(i=this.nameProvider.getNameNode(e))!==null&&i!==void 0?i:e.$cstNode;return{node:e,name:r,nameSegment:(0,ZA.toDocumentSegment)(o),selectionSegment:(0,ZA.toDocumentSegment)(e.$cstNode),type:"Interface",documentUri:n.uri,path:this.astNodeLocator.getAstNodePath(e)}}};as.LangiumGrammarScopeComputation=iy});var dy=f(dr=>{"use strict";var AB=dr&&dr.__createBinding||(Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]}),PB=dr&&dr.__setModuleDefault||(Object.create?function(t,e){Object.defineProperty(t,"default",{enumerable:!0,value:e})}:function(t,e){t.default=e}),SB=dr&&dr.__importStar||function(t){if(t&&t.__esModule)return t;var e={};if(t!=null)for(var r in t)r!=="default"&&Object.prototype.hasOwnProperty.call(t,r)&&AB(e,t,r);return PB(e,t),e};Object.defineProperty(dr,"__esModule",{value:!0});dr.LangiumGrammarValidator=dr.IssueCodes=dr.registerValidationChecks=void 0;var oy=qa(),oo=be(),ao=gn(),ay=qe(),so=vt(),sy=Ft(),Se=SB(ke()),uy=ke(),xt=jt(),CB=Gg(),cy=cd();function EB(t){let e=t.validation.ValidationRegistry,r=t.validation.LangiumGrammarValidator,n={Action:[r.checkAssignmentReservedName],AbstractRule:r.checkRuleName,Assignment:[r.checkAssignmentWithFeatureName,r.checkAssignmentToFragmentRule,r.checkAssignmentTypes,r.checkAssignmentReservedName],ParserRule:[r.checkParserRuleDataType,r.checkRuleParametersUsed,r.checkParserRuleReservedName],TerminalRule:[r.checkTerminalRuleReturnType,r.checkHiddenTerminalRule,r.checkEmptyTerminalRule],InferredType:r.checkTypeReservedName,Keyword:r.checkKeyword,UnorderedGroup:r.checkUnorderedGroup,Grammar:[r.checkGrammarName,r.checkEntryGrammarRule,r.checkUniqueRuleName,r.checkUniqueTypeName,r.checkUniqueImportedRules,r.checkDuplicateImportedGrammar,r.checkGrammarHiddenTokens,r.checkGrammarForUnusedRules,r.checkGrammarTypeInfer,r.checkClashingTerminalNames],GrammarImport:r.checkPackageImport,CharacterRange:r.checkInvalidCharacterRange,Interface:[r.checkTypeReservedName,r.checkInterfacePropertyTypes],Type:[r.checkTypeReservedName],TypeAttribute:r.checkTypeReservedName,RuleCall:[r.checkUsedHiddenTerminalRule,r.checkUsedFragmentTerminalRule,r.checkRuleCallParameters],TerminalRuleCall:r.checkUsedHiddenTerminalRule,CrossReference:[r.checkCrossReferenceSyntax,r.checkCrossRefNameAssignment,r.checkCrossRefTerminalType,r.checkCrossRefType,r.checkCrossReferenceToTypeUnion],SimpleType:r.checkFragmentsInTypes,ReferenceType:r.checkReferenceTypeUnion};e.register(n,r)}dr.registerValidationChecks=EB;var lr;(function(t){t.GrammarNameUppercase="grammar-name-uppercase",t.RuleNameUppercase="rule-name-uppercase",t.HiddenGrammarTokens="hidden-grammar-tokens",t.UseRegexTokens="use-regex-tokens",t.EntryRuleTokenSyntax="entry-rule-token-syntax",t.CrossRefTokenSyntax="cross-ref-token-syntax",t.UnnecessaryFileExtension="unnecessary-file-extension",t.InvalidReturns="invalid-returns",t.InvalidInfers="invalid-infers",t.MissingInfer="missing-infer",t.MissingReturns="missing-returns",t.SuperfluousInfer="superfluous-infer",t.OptionalUnorderedGroup="optional-unordered-group"})(lr=dr.IssueCodes||(dr.IssueCodes={}));var ly=class{constructor(e){this.references=e.references.References,this.documents=e.shared.workspace.LangiumDocuments}checkGrammarName(e,r){if(e.name){let n=e.name.substring(0,1);n.toUpperCase()!==n&&r("warning","Grammar name should start with an upper case letter.",{node:e,property:"name",code:lr.GrammarNameUppercase})}}checkEntryGrammarRule(e,r){if(e.isDeclared&&!e.name)return;let n=e.rules.filter(i=>Se.isParserRule(i)&&i.entry);if(e.isDeclared&&n.length===0){let i=e.rules.find(o=>Se.isParserRule(o)&&!(0,xt.isDataTypeRule)(o));i?r("error","The grammar is missing an entry parser rule. This rule can be an entry one.",{node:i,property:"name",code:lr.EntryRuleTokenSyntax}):r("error","This grammar is missing an entry parser rule.",{node:e,property:"name"})}else!e.isDeclared&&n.length>=1?n.forEach(i=>r("error","Cannot declare entry rules for unnamed grammars.",{node:i,property:"name"})):n.length>1?n.forEach(i=>r("error","The entry rule has to be unique.",{node:i,property:"name"})):n.length===1&&(0,xt.isDataTypeRule)(n[0])&&r("error","The entry rule cannot be a data type rule.",{node:n[0],property:"name"})}checkUniqueRuleName(e,r){let n=i=>(0,sy.stream)(i.rules).filter(o=>!ec(o));this.checkUniqueName(e,r,n,"rule")}checkUniqueTypeName(e,r){let n=i=>(0,sy.stream)(i.types).concat(i.interfaces);this.checkUniqueName(e,r,n,"type")}checkUniqueName(e,r,n,i){let o=new ao.MultiMap;n(e).forEach(u=>o.add(u.name,u));for(let[,u]of o.entriesGroupedByKey())u.length>1&&u.forEach(c=>{r("error",`A ${i}'s name has to be unique.`,{node:c,property:"name"})});let a=new Set,s=(0,xt.resolveTransitiveImports)(this.documents,e);for(let u of s)n(u).forEach(c=>a.add(c.name));for(let u of o.keys())a.has(u)&&o.get(u).forEach(l=>{r("error",`A ${i} with the name '${l.name}' already exists in an imported grammar.`,{node:l,property:"name"})})}checkDuplicateImportedGrammar(e,r){let n=new ao.MultiMap;for(let i of e.imports){let o=(0,xt.resolveImport)(this.documents,i);o&&n.add(o,i)}for(let[,i]of n.entriesGroupedByKey())i.length>1&&i.forEach((o,a)=>{a>0&&r("warning","The grammar is already being directly imported.",{node:o,tags:[oy.DiagnosticTag.Unnecessary]})})}checkUniqueImportedRules(e,r){let n=new Map;for(let o of e.imports){let a=(0,xt.resolveTransitiveImports)(this.documents,o);n.set(o,a)}let i=new ao.MultiMap;for(let o of e.imports){let a=n.get(o);for(let s of e.imports){if(o===s)continue;let u=n.get(s),c=this.getDuplicateExportedRules(a,u);for(let l of c)i.add(o,l)}}for(let o of e.imports){let a=i.get(o);a.length>0&&r("error","Some rules exported by this grammar are also included in other imports: "+(0,sy.stream)(a).distinct().join(", "),{node:o,property:"path"})}}getDuplicateExportedRules(e,r){let i=e.filter(s=>!r.includes(s)).flatMap(s=>s.rules),o=r.flatMap(s=>s.rules),a=new Set;for(let s of i){let u=s.name;for(let c of o){let l=c.name;u===l&&a.add(c.name)}}return a}checkGrammarTypeInfer(e,r){var n,i,o;let a=new Set;for(let u of e.types)a.add(u.name);for(let u of e.interfaces)a.add(u.name);(0,xt.resolveTransitiveImports)(this.documents,e).forEach(u=>{u.types.forEach(c=>a.add(c.name)),u.interfaces.forEach(c=>a.add(c.name))});for(let u of e.rules.filter(Se.isParserRule)){if(ec(u))continue;let c=(0,xt.isDataTypeRule)(u),l=!u.returnType&&!u.dataType,d=(0,xt.getTypeNameWithoutError)(u);if(!c&&d&&a.has(d)===l){if((l||((n=u.returnType)===null||n===void 0?void 0:n.ref)!==void 0)&&u.inferredType===void 0)r("error",s(d,l),{node:u,property:"name",code:lr.MissingReturns});else if(l||((i=u.returnType)===null||i===void 0?void 0:i.ref)!==void 0){let h=(0,so.findNodeForKeyword)(u.inferredType.$cstNode,"infers");r("error",s(d,l),{node:u.inferredType,property:"name",code:lr.InvalidInfers,data:(0,ay.toDocumentSegment)(h)})}}else if(c&&l){let h=(0,so.findNodeForKeyword)(u.$cstNode,"infer");r("error","Data type rules cannot infer a type.",{node:u,property:"inferredType",code:lr.InvalidInfers,data:(0,ay.toDocumentSegment)(h)})}}for(let u of(0,oo.streamAllContents)(e).filter(Se.isAction)){let c=this.getActionType(u);if(c){let l=Boolean(u.inferredType),d=(0,xt.getTypeNameWithoutError)(u);if(u.type&&d&&a.has(d)===l){let h=l?(0,so.findNodeForKeyword)(u.$cstNode,"infer"):(0,so.findNodeForKeyword)(u.$cstNode,"{");r("error",s(d,l),{node:u,property:"type",code:l?lr.SuperfluousInfer:lr.MissingInfer,data:(0,ay.toDocumentSegment)(h)})}else if(c&&d&&a.has(d)&&l&&u.$cstNode){let h=(0,so.findNodeForProperty)((o=u.inferredType)===null||o===void 0?void 0:o.$cstNode,"name"),v=(0,so.findNodeForKeyword)(u.$cstNode,"{");h&&v&&r("error",`${d} is a declared type and cannot be redefined.`,{node:u,property:"type",code:lr.SuperfluousInfer,data:{start:v.range.end,end:h.range.start}})}}}function s(u,c){return c?`The type '${u}' is already explicitly declared and cannot be inferred.`:`The type '${u}' is not explicitly declared and must be inferred.`}}getActionType(e){var r;if(e.type)return(r=e.type)===null||r===void 0?void 0:r.ref;if(e.inferredType)return e.inferredType}checkGrammarHiddenTokens(e,r){e.definesHiddenTokens&&r("error","Hidden terminals are declared at the terminal definition.",{node:e,property:"definesHiddenTokens",code:lr.HiddenGrammarTokens})}checkHiddenTerminalRule(e,r){e.hidden&&e.fragment&&r("error","Cannot use terminal fragments as hidden tokens.",{node:e,property:"hidden"})}checkEmptyTerminalRule(e,r){try{let n=(0,xt.terminalRegex)(e);new RegExp(n).test("")&&r("error","This terminal could match an empty string.",{node:e,property:"name"})}catch{}}checkUsedHiddenTerminalRule(e,r){let n=(0,oo.getContainerOfType)(e,i=>Se.isTerminalRule(i)||Se.isParserRule(i));if(n){if("hidden"in n&&n.hidden)return;let i=e.rule.ref;Se.isTerminalRule(i)&&i.hidden&&r("error","Cannot use hidden terminal in non-hidden rule",{node:e,property:"rule"})}}checkUsedFragmentTerminalRule(e,r){let n=e.rule.ref;Se.isTerminalRule(n)&&n.fragment&&(0,oo.getContainerOfType)(e,Se.isParserRule)&&r("error","Cannot use terminal fragments as part of parser rules.",{node:e,property:"rule"})}checkCrossReferenceSyntax(e,r){e.deprecatedSyntax&&r("error","'|' is deprecated. Please, use ':' instead.",{node:e,property:"deprecatedSyntax",code:lr.CrossRefTokenSyntax})}checkPackageImport(e,r){(0,xt.resolveImport)(this.documents,e)===void 0?r("error","Import cannot be resolved.",{node:e,property:"path"}):e.path.endsWith(".langium")&&r("warning","Imports do not need file extensions.",{node:e,property:"path",code:lr.UnnecessaryFileExtension})}checkInvalidCharacterRange(e,r){if(e.right){let n="Character ranges cannot use more than one character",i=!1;e.left.value.length>1&&(i=!0,r("error",n,{node:e.left,property:"value"})),e.right.value.length>1&&(i=!0,r("error",n,{node:e.right,property:"value"})),i||r("hint","Consider using regex instead of character ranges",{node:e,code:lr.UseRegexTokens})}}checkGrammarForUnusedRules(e,r){let n=(0,so.getAllReachableRules)(e,!0);for(let i of e.rules)Se.isTerminalRule(i)&&i.hidden||ec(i)||n.has(i)||r("hint","This rule is declared but never referenced.",{node:i,property:"name",tags:[oy.DiagnosticTag.Unnecessary]})}checkClashingTerminalNames(e,r){let n=new ao.MultiMap,i=new Set;for(let c of e.rules)Se.isTerminalRule(c)&&c.name&&n.add(c.name,c),Se.isParserRule(c)&&(0,oo.streamAllContents)(c).filter(Se.isKeyword).forEach(d=>i.add(d.value));let o=new ao.MultiMap,a=new ao.MultiMap;for(let c of e.imports){let l=(0,xt.resolveTransitiveImports)(this.documents,c);for(let d of l)for(let h of d.rules)Se.isTerminalRule(h)&&h.name?o.add(h.name,c):Se.isParserRule(h)&&h.name&&(0,oo.streamAllContents)(h).filter(Se.isKeyword).forEach(g=>a.add(g.value,c))}for(let c of n.values())if(i.has(c.name))r("error","Terminal name clashes with existing keyword.",{node:c,property:"name"});else if(a.has(c.name)){let l=a.get(c.name);r("error",`Terminal name clashes with imported keyword from "${l[0].path}".`,{node:c,property:"name"})}let s=new ao.MultiMap;for(let c of i)for(let l of o.get(c))s.add(l,c);for(let[c,l]of s.entriesGroupedByKey())l.length>0&&r("error",`Imported terminals (${l.join(", ")}) clash with locally defined keywords.`,{node:c,property:"path"});let u=new ao.MultiMap;for(let[c,l]of o.entriesGroupedByKey()){let d=a.get(c);d.length>0&&l.filter(h=>!d.includes(h)).forEach(h=>u.add(h,c))}for(let[c,l]of u.entriesGroupedByKey())l.length>0&&r("error",`Imported terminals (${l.join(", ")}) clash with imported keywords.`,{node:c,property:"path"})}checkRuleName(e,r){if(e.name&&!ec(e)){let n=e.name.substring(0,1);n.toUpperCase()!==n&&r("warning","Rule name should start with an upper case letter.",{node:e,property:"name",code:lr.RuleNameUppercase})}}checkTypeReservedName(e,r){this.checkReservedName(e,"name",r)}checkAssignmentReservedName(e,r){this.checkReservedName(e,"feature",r)}checkParserRuleReservedName(e,r){e.inferredType||this.checkReservedName(e,"name",r)}checkReservedName(e,r,n){let i=e[r];typeof i=="string"&&NB.has(i)&&n("error",`'${i}' is a reserved name of the JavaScript runtime.`,{node:e,property:r})}checkKeyword(e,r){(0,oo.getContainerOfType)(e,uy.isParserRule)&&(e.value.length===0?r("error","Keywords cannot be empty.",{node:e}):e.value.trim().length===0?r("error","Keywords cannot only consist of whitespace characters.",{node:e}):/\s/g.test(e.value)&&r("warning","Keywords should not contain whitespace characters.",{node:e}))}checkUnorderedGroup(e,r){e.elements.forEach(n=>{(0,xt.isOptionalCardinality)(n.cardinality)&&r("error","Optional elements in Unordered groups are currently not supported",{node:n,code:lr.OptionalUnorderedGroup})})}checkRuleParametersUsed(e,r){let n=e.parameters;if(n.length>0){let i=(0,oo.streamAllContents)(e).filter(Se.isParameterReference);for(let o of n)i.some(a=>a.parameter.ref===o)||r("hint",`Parameter '${o.name}' is unused.`,{node:o,tags:[oy.DiagnosticTag.Unnecessary]})}}checkParserRuleDataType(e,r){if(ec(e))return;let n=(0,xt.hasDataTypeReturn)(e),i=(0,xt.isDataTypeRule)(e);!n&&i?r("error","This parser rule does not create an object. Add a primitive return type or an action to the start of the rule to force object instantiation.",{node:e,property:"name"}):n&&!i&&r("error","Normal parser rules are not allowed to return a primitive value. Use a datatype rule for that.",{node:e,property:e.dataType?"dataType":"returnType"})}checkAssignmentToFragmentRule(e,r){e.terminal&&(0,uy.isRuleCall)(e.terminal)&&(0,uy.isParserRule)(e.terminal.rule.ref)&&e.terminal.rule.ref.fragment&&r("error",`Cannot use fragment rule '${e.terminal.rule.ref.name}' for assignment of property '${e.feature}'.`,{node:e,property:"terminal"})}checkAssignmentTypes(e,r){if(!e.terminal)return;let n;(0,oo.streamAllContents)(e.terminal).map(o=>Se.isCrossReference(o)?"ref":"other").find(o=>n?o!==n:(n=o,!1))&&r("error",this.createMixedTypeError(e.feature),{node:e,property:"terminal"})}checkInterfacePropertyTypes(e,r){for(let n of e.attributes)if(n.type){let i=(0,CB.typeDefinitionToPropertyType)(n.type),o=(0,cy.flattenPlainType)(i),a=!1,s=!1;for(let u of o)(0,cy.isPlainReferenceType)(u)?a=!0:(0,cy.isPlainReferenceType)(u)||(s=!0);a&&s&&r("error",this.createMixedTypeError(n.name),{node:n,property:"type"})}}createMixedTypeError(e){return`Mixing a cross-reference with other types is not supported. Consider splitting property "${e}" into two or more different properties.`}checkTerminalRuleReturnType(e,r){var n;!((n=e.type)===null||n===void 0)&&n.name&&!(0,xt.isPrimitiveType)(e.type.name)&&r("error","Terminal rules can only return primitive types like 'string', 'boolean', 'number', 'Date' or 'bigint'.",{node:e.type,property:"name"})}checkRuleCallParameters(e,r){let n=e.rule.ref;if(Se.isParserRule(n)){let i=n.parameters.length,o=e.arguments.length;i!==o&&r("error",`Rule '${n.name}' expects ${i} arguments, but got ${o}.`,{node:e})}else Se.isTerminalRule(n)&&e.arguments.length>0&&r("error","Terminal rules do not accept any arguments",{node:e})}checkCrossRefNameAssignment(e,r){!e.terminal&&e.type.ref&&!(0,so.findNameAssignment)(e.type.ref)&&r("error","Cannot infer terminal or data type rule for cross reference.",{node:e,property:"type"})}checkCrossRefTerminalType(e,r){Se.isRuleCall(e.terminal)&&Se.isParserRule(e.terminal.rule.ref)&&!(0,xt.isDataTypeRule)(e.terminal.rule.ref)&&r("error","Parser rules cannot be used for cross references.",{node:e.terminal,property:"rule"})}checkCrossRefType(e,r){let n=this.checkReferenceToRuleButNotType(e?.type);n&&r("error",n,{node:e,property:"type"})}checkCrossReferenceToTypeUnion(e,r){if(Se.isType(e.type.ref)&&Se.isUnionType(e.type.ref.type)){let n=rP(e.type.ref.type);n.length>0&&r("error",`Cross-reference on type union is only valid if all alternatives are AST nodes. ${n.join(", ")} ${n.length>1?"are":"is"} not ${n.length>1?"":"an "}AST node${n.length>1?"s":""}.`,{node:e,property:"type"})}}checkFragmentsInTypes(e,r){var n,i;Se.isParserRule((n=e.typeRef)===null||n===void 0?void 0:n.ref)&&(!((i=e.typeRef)===null||i===void 0)&&i.ref.fragment)&&r("error","Cannot use rule fragments in types.",{node:e,property:"typeRef"})}checkReferenceTypeUnion(e,r){Se.isSimpleType(e.referenceType)||r("error","Only direct rule references are allowed in reference types.",{node:e,property:"referenceType"})}checkReferenceToRuleButNotType(e){if(e&&Se.isParserRule(e.ref)&&!(0,xt.isDataTypeRule)(e.ref)&&(e.ref.returnType||e.ref.inferredType)){let r=(0,xt.getTypeNameWithoutError)(e.ref);if(r)return`Use the rule type '${r}' instead of the typed rule name '${e.ref.name}' for cross references.`}}checkAssignmentWithFeatureName(e,r){e.feature==="name"&&Se.isCrossReference(e.terminal)&&r("warning",'The "name" property is not recommended for cross-references.',{node:e,property:"feature"})}};dr.LangiumGrammarValidator=ly;function ec(t){return!t.definition||!t.definition.$cstNode||t.definition.$cstNode.length===0}var NB=new Set(["Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array","Uint32Array","Float32Array","Float64Array","BigInt64Array","BigUint64Array","Map","Set","WeakMap","WeakSet","Error","AggregateError","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError","BigInt","RegExp","Number","Object","Function","Symbol","String","Math","NaN","Infinity","isFinite","isNaN","Buffer","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","globalThis","decodeURIComponent","decodeURI","encodeURIComponent","encodeURI","parseInt","parseFloat","Promise","Generator","GeneratorFunction","AsyncFunction","AsyncGenerator","AsyncGeneratorFunction","Reflect","Proxy","Date","Intl","eval","undefined"]);function rP(t){let e=[];return t.types.forEach(r=>{var n;Se.isSimpleType(r)&&(!((n=r.typeRef)===null||n===void 0)&&n.ref?Se.isType(r.typeRef.ref)&&(Se.isUnionType(r.typeRef.ref.type)?e.push(...rP(r.typeRef.ref.type)):e.push(r.typeRef.ref.name)):r.stringType?e.push(`"${r.stringType}"`):r.primitiveType&&e.push(r.primitiveType))}),Array.from(new Set(e))}});var Ad=f(yn=>{"use strict";Object.defineProperty(yn,"__esModule",{value:!0});yn.DocumentValidator=yn.toDiagnosticSeverity=yn.getDiagnosticRange=yn.DefaultDocumentValidator=void 0;var Wr=Ie(),nP=vt(),kB=be(),wB=qe(),Rd=_r(),fy=class{constructor(e){this.validationRegistry=e.validation.ValidationRegistry,this.metadata=e.LanguageMetaData}async validateDocument(e,r=Wr.CancellationToken.None){let n=e.parseResult,i=[];await(0,Rd.interruptAndCheck)(r);for(let o of n.lexerErrors){let a={severity:Wr.DiagnosticSeverity.Error,range:{start:{line:o.line-1,character:o.column-1},end:{line:o.line-1,character:o.column+o.length-1}},message:o.message,code:bd.LexingError,source:this.getSource()};i.push(a)}for(let o of n.parserErrors){let a;if(isNaN(o.token.startOffset)){if("previousToken"in o){let s=o.previousToken;if(isNaN(s.startOffset))a=Wr.Range.create(0,0,0,0);else{let u=Wr.Position.create(s.endLine-1,s.endColumn);a=Wr.Range.create(u,u)}}}else a=(0,wB.tokenToRange)(o.token);if(a){let s={severity:Wr.DiagnosticSeverity.Error,range:a,message:o.message,code:bd.ParsingError,source:this.getSource()};i.push(s)}}for(let o of e.references){let a=o.error;if(a){let s={containerType:a.container.$type,property:a.property,refText:a.reference.$refText},u={node:a.container,property:a.property,index:a.index,code:bd.LinkingError,data:s};i.push(this.toDiagnostic("error",a.message,u))}}try{i.push(...await this.validateAst(n.value,e,r))}catch(o){if((0,Rd.isOperationCancelled)(o))throw o;console.error("An error occurred during validation:",o)}return await(0,Rd.interruptAndCheck)(r),i}async validateAst(e,r,n=Wr.CancellationToken.None){let i=[],o=(a,s,u)=>{i.push(this.toDiagnostic(a,s,u))};return await Promise.all((0,kB.streamAst)(e).map(async a=>{await(0,Rd.interruptAndCheck)(n);let s=this.validationRegistry.getChecks(a.$type);for(let u of s)await u(a,o,n)})),i}toDiagnostic(e,r,n){return{message:r,range:iP(n),severity:oP(e),code:n.code,codeDescription:n.codeDescription,tags:n.tags,relatedInformation:n.relatedInformation,data:n.data,source:this.getSource()}}getSource(){return this.metadata.languageId}};yn.DefaultDocumentValidator=fy;function iP(t){if(Wr.Range.is(t.range))return t.range;let e;return typeof t.property=="string"?e=(0,nP.findNodeForProperty)(t.node.$cstNode,t.property,t.index):typeof t.keyword=="string"&&(e=(0,nP.findNodeForKeyword)(t.node.$cstNode,t.keyword,t.index)),e??(e=t.node.$cstNode),e?e.range:{start:{line:0,character:0},end:{line:0,character:0}}}yn.getDiagnosticRange=iP;function oP(t){switch(t){case"error":return Wr.DiagnosticSeverity.Error;case"warning":return Wr.DiagnosticSeverity.Warning;case"info":return Wr.DiagnosticSeverity.Information;case"hint":return Wr.DiagnosticSeverity.Hint;default:throw new Error("Invalid diagnostic severity: "+t)}}yn.toDiagnosticSeverity=oP;var bd;(function(t){t.LexingError="lexing-error",t.ParsingError="parsing-error",t.LinkingError="linking-error"})(bd=yn.DocumentValidator||(yn.DocumentValidator={}))});var lP=f(zn=>{"use strict";var OB=zn&&zn.__createBinding||(Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]}),DB=zn&&zn.__setModuleDefault||(Object.create?function(t,e){Object.defineProperty(t,"default",{enumerable:!0,value:e})}:function(t,e){t.default=e}),IB=zn&&zn.__importStar||function(t){if(t&&t.__esModule)return t;var e={};if(t!=null)for(var r in t)r!=="default"&&Object.prototype.hasOwnProperty.call(t,r)&&OB(e,t,r);return DB(e,t),e};Object.defineProperty(zn,"__esModule",{value:!0});zn.LangiumGrammarCodeActionProvider=void 0;var Br=Ie(),xB=Un(),aP=be(),sP=qe(),qB=vt(),uP=Yo(),cP=Ci(),LB=Ad(),py=IB(ke()),Kr=dy(),hy=class{constructor(e){this.reflection=e.shared.AstReflection,this.indexManager=e.shared.workspace.IndexManager}getCodeActions(e,r){let n=[],i=o=>o&&n.push(o);for(let o of r.context.diagnostics)this.createCodeActions(o,e,i);return n}createCodeActions(e,r,n){switch(e.code){case Kr.IssueCodes.GrammarNameUppercase:case Kr.IssueCodes.RuleNameUppercase:n(this.makeUpperCase(e,r));break;case Kr.IssueCodes.HiddenGrammarTokens:n(this.fixHiddenTerminals(e,r));break;case Kr.IssueCodes.UseRegexTokens:n(this.fixRegexTokens(e,r));break;case Kr.IssueCodes.EntryRuleTokenSyntax:n(this.addEntryKeyword(e,r));break;case Kr.IssueCodes.CrossRefTokenSyntax:n(this.fixCrossRefSyntax(e,r));break;case Kr.IssueCodes.UnnecessaryFileExtension:n(this.fixUnnecessaryFileExtension(e,r));break;case Kr.IssueCodes.MissingReturns:n(this.fixMissingReturns(e,r));break;case Kr.IssueCodes.InvalidInfers:case Kr.IssueCodes.InvalidReturns:n(this.fixInvalidReturnsInfers(e,r));break;case Kr.IssueCodes.MissingInfer:n(this.fixMissingInfer(e,r));break;case Kr.IssueCodes.SuperfluousInfer:n(this.fixSuperfluousInfer(e,r));break;case LB.DocumentValidator.LinkingError:{let i=e.data;i&&i.containerType==="RuleCall"&&i.property==="rule"&&n(this.addNewRule(e,i,r)),i&&this.lookInGlobalScope(e,i,r).forEach(n);break}}}fixMissingReturns(e,r){let n=r.textDocument.getText(e.range);if(n)return{title:`Add explicit return type for parser rule ${n}`,kind:Br.CodeActionKind.QuickFix,diagnostics:[e],edit:{changes:{[r.textDocument.uri]:[{range:e.range,newText:`${n} returns ${n}`}]}}}}fixInvalidReturnsInfers(e,r){let n=e.data;if(n){let i=r.textDocument.getText(n.range);return{title:`Correct ${i} usage`,kind:Br.CodeActionKind.QuickFix,diagnostics:[e],edit:{changes:{[r.textDocument.uri]:[{range:n.range,newText:i==="infers"?"returns":"infers"}]}}}}}fixMissingInfer(e,r){let n=e.data;if(n)return{title:"Correct 'infer' usage",kind:Br.CodeActionKind.QuickFix,diagnostics:[e],edit:{changes:{[r.textDocument.uri]:[{range:{start:n.range.end,end:n.range.end},newText:"infer "}]}}}}fixSuperfluousInfer(e,r){if(e.data)return{title:"Remove the 'infer' keyword",kind:Br.CodeActionKind.QuickFix,diagnostics:[e],edit:{changes:{[r.textDocument.uri]:[{range:e.data,newText:""}]}}}}fixUnnecessaryFileExtension(e,r){let n=Object.assign({},e.range.end);n.character-=1;let i=Object.assign({},n);return i.character-=8,{title:"Remove file extension",kind:Br.CodeActionKind.QuickFix,diagnostics:[e],isPreferred:!0,edit:{changes:{[r.textDocument.uri]:[{range:{start:i,end:n},newText:""}]}}}}makeUpperCase(e,r){let n={start:e.range.start,end:{line:e.range.start.line,character:e.range.start.character+1}};return{title:"First letter to upper case",kind:Br.CodeActionKind.QuickFix,diagnostics:[e],isPreferred:!0,edit:{changes:{[r.textDocument.uri]:[{range:n,newText:r.textDocument.getText(n).toUpperCase()}]}}}}addEntryKeyword(e,r){return{title:"Add entry keyword",kind:Br.CodeActionKind.QuickFix,diagnostics:[e],isPreferred:!0,edit:{changes:{[r.textDocument.uri]:[{range:{start:e.range.start,end:e.range.start},newText:"entry "}]}}}}fixRegexTokens(e,r){let n=r.textDocument.offsetAt(e.range.start),i=r.parseResult.value.$cstNode;if(i){let o=(0,sP.findLeafNodeAtOffset)(i,n),a=(0,aP.getContainerOfType)(o?.element,py.isCharacterRange);if(a&&a.right&&a.$cstNode){let s=a.left.value,u=a.right.value;return{title:"Refactor into regular expression",kind:Br.CodeActionKind.QuickFix,diagnostics:[e],isPreferred:!0,edit:{changes:{[r.textDocument.uri]:[{range:a.$cstNode.range,newText:`/[${(0,uP.escapeRegExp)(s)}-${(0,uP.escapeRegExp)(u)}]/`}]}}}}}}fixCrossRefSyntax(e,r){return{title:"Replace '|' with ':'",kind:Br.CodeActionKind.QuickFix,diagnostics:[e],isPreferred:!0,edit:{changes:{[r.textDocument.uri]:[{range:e.range,newText:":"}]}}}}fixHiddenTerminals(e,r){let n=r.parseResult.value,i=n.hiddenTokens,o=[],a=(0,qB.findNodeForProperty)(n.$cstNode,"definesHiddenTokens");if(a){let s=a.range.start,u=a.offset,c=n.$cstNode.text.indexOf(")",u)+1;o.push({newText:"",range:{start:s,end:r.textDocument.positionAt(c)}})}for(let s of i){let u=s.ref;if(u&&py.isTerminalRule(u)&&!u.hidden&&u.$cstNode){let c=u.$cstNode.range.start;o.push({newText:"hidden ",range:{start:c,end:c}})}}return{title:"Fix hidden terminals",kind:Br.CodeActionKind.QuickFix,diagnostics:[e],isPreferred:!0,edit:{changes:{[r.textDocument.uri]:o}}}}addNewRule(e,r,n){let i=n.textDocument.offsetAt(e.range.start),o=n.parseResult.value.$cstNode;if(o){let a=(0,sP.findLeafNodeAtOffset)(o,i),s=(0,aP.getContainerOfType)(a?.element,py.isParserRule);if(s&&s.$cstNode)return{title:`Add new rule '${r.refText}'`,kind:Br.CodeActionKind.QuickFix,diagnostics:[e],isPreferred:!1,edit:{changes:{[n.textDocument.uri]:[{range:{start:s.$cstNode.range.end,end:s.$cstNode.range.end},newText:`

`+r.refText+`:
    /* TODO implement rule */ {infer `+r.refText+"};"}]}}}}}lookInGlobalScope(e,r,n){var i,o;let a={container:{$type:r.containerType},property:r.property,reference:{$refText:r.refText}},s=this.reflection.getReferenceType(a),u=this.indexManager.allElements(s).filter(h=>h.name===r.refText),c=[],l=-1,d=-1;for(let h of u){if((0,cP.equalURI)(h.documentUri,n.uri))continue;let v=MB(n.uri,h.documentUri),g,R="",E=n.parseResult.value,N=E.imports.find(A=>A.path&&v<A.path);if(N)g=(i=N.$cstNode)===null||i===void 0?void 0:i.range.start;else if(E.imports.length>0){let A=E.imports[E.imports.length-1].$cstNode.range.end;A&&(g={line:A.line+1,character:0})}else E.rules.length>0&&(g=(o=E.rules[0].$cstNode)===null||o===void 0?void 0:o.range.start,R=`
`);g&&((l<0||v.length<d)&&(l=c.length,d=v.length),c.push({title:`Add import to '${v}'`,kind:Br.CodeActionKind.QuickFix,diagnostics:[e],isPreferred:!1,edit:{changes:{[n.textDocument.uri]:[{range:{start:g,end:g},newText:`import '${v}'
${R}`}]}}}))}return l>=0&&(c[l].isPreferred=!0),c}};zn.LangiumGrammarCodeActionProvider=hy;function MB(t,e){let r=xB.Utils.dirname(t),n=(0,cP.relativeURI)(r,e);return!n.startsWith("./")&&!n.startsWith("../")&&(n="./"+n),n.endsWith(".langium")&&(n=n.substring(0,n.length-8)),n}});var Sd=f(Pd=>{"use strict";Object.defineProperty(Pd,"__esModule",{value:!0});Pd.DefaultFoldingRangeProvider=void 0;var my=Ie(),$B=be(),FB=qe(),gy=class{constructor(e){this.commentNames=e.parser.GrammarConfig.multilineCommentRules}getFoldingRanges(e){let r=[],n=i=>r.push(i);return this.collectFolding(e,n),r}collectFolding(e,r){var n;let i=(n=e.parseResult)===null||n===void 0?void 0:n.value;if(i){if(this.shouldProcessContent(i)){let o=(0,$B.streamAllContents)(i).iterator(),a;do if(a=o.next(),!a.done){let s=a.value;this.shouldProcess(s)&&this.collectObjectFolding(e,s,r),this.shouldProcessContent(s)||o.prune()}while(!a.done)}this.collectCommentFolding(e,i,r)}}shouldProcess(e){return!0}shouldProcessContent(e){return!0}collectObjectFolding(e,r,n){let i=r.$cstNode;if(i){let o=this.toFoldingRange(e,i);o&&n(o)}}collectCommentFolding(e,r,n){let i=r.$cstNode;if(i){for(let o of(0,FB.flattenCst)(i))if(this.commentNames.includes(o.tokenType.name)){let a=this.toFoldingRange(e,o,my.FoldingRangeKind.Comment);a&&n(a)}}}toFoldingRange(e,r,n){let i=r.range,o=i.start,a=i.end;if(!(a.line-o.line<2))return this.includeLastFoldingLine(r,n)||(a=e.textDocument.positionAt(e.textDocument.offsetAt({line:a.line,character:0})-1)),my.FoldingRange.create(o.line,a.line,o.character,a.character,n)}includeLastFoldingLine(e,r){if(r===my.FoldingRangeKind.Comment)return!1;let n=e.text,i=n.charAt(n.length-1);return!(i==="}"||i===")"||i==="]")}};Pd.DefaultFoldingRangeProvider=gy});var dP=f(Cd=>{"use strict";Object.defineProperty(Cd,"__esModule",{value:!0});Cd.LangiumGrammarFoldingRangeProvider=void 0;var jB=Sd(),UB=ke(),yy=class extends jB.DefaultFoldingRangeProvider{shouldProcessContent(e){return!(0,UB.isParserRule)(e)}};Cd.LangiumGrammarFoldingRangeProvider=yy});var Ty=f(vn=>{"use strict";Object.defineProperty(vn,"__esModule",{value:!0});vn.Formatting=vn.FormattingRegion=vn.DefaultNodeFormatter=vn.AbstractFormatter=void 0;var Ed=vt(),vy=er(),GB=be(),fP=qe(),tc=Ft(),_y=class{constructor(){this.collector=()=>{}}getNodeFormatter(e){return new Nd(e,this.collector)}formatDocument(e,r){let n=e.parseResult;return n.lexerErrors.length===0&&n.parserErrors.length===0?this.doDocumentFormat(e,r.options):[]}isFormatRangeErrorFree(e,r){let n=e.parseResult;return n.lexerErrors.length||n.parserErrors.length?Math.min(...n.lexerErrors.map(o=>{var a;return(a=o.line)!==null&&a!==void 0?a:Number.MAX_VALUE}),...n.parserErrors.map(o=>{var a;return(a=o.token.startLine)!==null&&a!==void 0?a:Number.MAX_VALUE}))>r.end.line:!0}formatDocumentRange(e,r){return this.isFormatRangeErrorFree(e,r.range)?this.doDocumentFormat(e,r.options,r.range):[]}formatDocumentOnType(e,r){let n={start:{character:0,line:r.position.line},end:r.position};return this.isFormatRangeErrorFree(e,n)?this.doDocumentFormat(e,r.options,n):[]}get formatOnTypeOptions(){}doDocumentFormat(e,r,n){let i=new Map,o=(s,u,c)=>{var l,d;let h=this.nodeModeToKey(s,u),v=i.get(h),g=(l=c.options.priority)!==null&&l!==void 0?l:0,R=(d=v?.options.priority)!==null&&d!==void 0?d:0;(!v||R<=g)&&i.set(h,c)};this.collector=o,this.iterateAstFormatting(e,n);let a=this.iterateCstFormatting(e,i,r,n);return this.avoidOverlappingEdits(e.textDocument,a)}avoidOverlappingEdits(e,r){let n=[];for(let i of r){let o=n[n.length-1];if(o){let a=e.offsetAt(i.range.start),s=e.offsetAt(o.range.end);a<s&&n.pop()}n.push(i)}return n}iterateAstFormatting(e,r){let n=e.parseResult.value;this.format(n);let i=(0,GB.streamAllContents)(n).iterator(),o;do if(o=i.next(),!o.done){let a=o.value;this.insideRange(a.$cstNode.range,r)?this.format(a):i.prune()}while(!o.done)}nodeModeToKey(e,r){return`${e.offset}:${e.end}:${r}`}insideRange(e,r){return!r||e.start.line<=r.start.line&&e.end.line>=r.end.line||e.start.line>=r.start.line&&e.end.line<=r.end.line||e.start.line<=r.end.line&&e.end.line>=r.end.line}isNecessary(e,r){return r.getText(e.range)!==e.newText}iterateCstFormatting(e,r,n,i){let o={indentation:0,options:n,document:e.textDocument},a=[],u=this.iterateCstTree(e,o).iterator(),c,l;do if(l=u.next(),!l.done){let d=l.value,h=(0,vy.isLeafCstNode)(d),v=this.nodeModeToKey(d,"prepend"),g=r.get(v);if(r.delete(v),g){let N=this.createTextEdit(c,d,g,o);for(let A of N)A&&this.insideRange(A.range,i)&&this.isNecessary(A,e.textDocument)&&a.push(A)}let R=this.nodeModeToKey(d,"append"),E=r.get(R);if(r.delete(R),E){let N=(0,fP.getNextNode)(d);if(N){let A=this.createTextEdit(d,N,E,o);for(let b of A)b&&this.insideRange(b.range,i)&&this.isNecessary(b,e.textDocument)&&a.push(b)}}if(!g&&d.hidden){let N=this.createHiddenTextEdits(c,d,void 0,o);for(let A of N)A&&this.insideRange(A.range,i)&&this.isNecessary(A,e.textDocument)&&a.push(A)}h&&(c=d)}while(!l.done);return a}createHiddenTextEdits(e,r,n,i){var o;let a=r.range.start.line;if(e&&e.range.end.line===a)return[];let s=[],u={start:{character:0,line:a},end:r.range.start},c=i.document.getText(u),l=this.findFittingMove(u,(o=n?.moves)!==null&&o!==void 0?o:[],i),d=this.getExistingIndentationCharacterCount(c,i),v=this.getIndentationCharacterCount(i,l)-d;if(v===0)return[];let g="";v>0&&(g=(i.options.insertSpaces?" ":"	").repeat(v));let R=r.text.split(`
`);R[0]=c+R[0];for(let E=0;E<R.length;E++){let N=a+E,A={character:0,line:N};if(v>0)s.push({newText:g,range:{start:A,end:A}});else{let b=R[E],O=0;for(;O<b.length;O++){let $=b.charAt(O);if($!==" "&&$!=="	")break}s.push({newText:"",range:{start:A,end:{line:N,character:Math.min(O,Math.abs(v))}}})}}return s}getExistingIndentationCharacterCount(e,r){let n=" ".repeat(r.options.tabSize);return(r.options.insertSpaces?e.replaceAll("	",n):e.replaceAll(n,"	")).length}getIndentationCharacterCount(e,r){let n=e.indentation;return r&&r.tabs&&(n+=r.tabs),(e.options.insertSpaces?e.options.tabSize:1)*n}createTextEdit(e,r,n,i){var o;if(r.hidden)return this.createHiddenTextEdits(e,r,n,i);let a={start:(o=e?.range.end)!==null&&o!==void 0?o:{character:0,line:0},end:r.range.start},s=this.findFittingMove(a,n.moves,i);if(!s)return[];let u=s.characters,c=s.lines,l=s.tabs,d=i.indentation;i.indentation+=l??0;let h=[];return u!==void 0?h.push(this.createSpaceTextEdit(a,u,n.options)):c!==void 0?h.push(this.createLineTextEdit(a,c,i,n.options)):l!==void 0&&h.push(this.createTabTextEdit(a,Boolean(e),i)),(0,vy.isLeafCstNode)(r)&&(i.indentation=d),h}createSpaceTextEdit(e,r,n){if(e.start.line===e.end.line){let o=e.end.character-e.start.character;r=this.fitIntoOptions(r,o,n)}return{newText:" ".repeat(r),range:e}}createLineTextEdit(e,r,n,i){let o=e.end.line-e.start.line;r=this.fitIntoOptions(r,o,i);let s=(n.options.insertSpaces?" ".repeat(n.options.tabSize):"	").repeat(n.indentation);return{newText:`${`
`.repeat(r)}${s}`,range:e}}createTabTextEdit(e,r,n){let o=(n.options.insertSpaces?" ".repeat(n.options.tabSize):"	").repeat(n.indentation),a=r?1:0,s=Math.max(e.end.line-e.start.line,a);return{newText:`${`
`.repeat(s)}${o}`,range:e}}fitIntoOptions(e,r,n){return n.allowMore?e=Math.max(r,e):n.allowLess&&(e=Math.min(r,e)),e}findFittingMove(e,r,n){if(r.length===0)return;if(r.length===1)return r[0];let i=e.end.line-e.start.line;for(let o of r){if(o.lines!==void 0&&i<=o.lines)return o;if(o.lines===void 0&&i===0)return o}return r[r.length-1]}iterateCstTree(e,r){let i=e.parseResult.value.$cstNode;return i?new tc.TreeStreamImpl(i,o=>this.iterateCst(o,r)):tc.EMPTY_STREAM}iterateCst(e,r){if(!(0,vy.isCompositeCstNode)(e))return tc.EMPTY_STREAM;let n=r.indentation;return new tc.StreamImpl(()=>({index:0}),i=>i.index<e.children.length?{done:!1,value:e.children[i.index++]}:(r.indentation=n,tc.DONE_RESULT))}};vn.AbstractFormatter=_y;var Nd=class{constructor(e,r){this.astNode=e,this.collector=r}node(e){return new Tr(e.$cstNode?[e.$cstNode]:[],this.collector)}nodes(...e){let r=[];for(let n of e)n.$cstNode&&r.push(n.$cstNode);return new Tr(r,this.collector)}property(e,r){let n=(0,Ed.findNodeForProperty)(this.astNode.$cstNode,e,r);return new Tr(n?[n]:[],this.collector)}properties(...e){let r=[];for(let n of e){let i=(0,Ed.findNodesForProperty)(this.astNode.$cstNode,n);r.push(...i)}return new Tr(r,this.collector)}keyword(e,r){let n=(0,Ed.findNodeForKeyword)(this.astNode.$cstNode,e,r);return new Tr(n?[n]:[],this.collector)}keywords(...e){let r=[];for(let n of e){let i=(0,Ed.findNodesForKeyword)(this.astNode.$cstNode,n);r.push(...i)}return new Tr(r,this.collector)}cst(e){return new Tr([...e],this.collector)}interior(e,r){let n=e.nodes,i=r.nodes;if(n.length!==1||i.length!==1)return new Tr([],this.collector);let o=n[0],a=i[0];if(o.offset>a.offset){let s=o;o=a,a=s}return new Tr((0,fP.getInteriorNodes)(o,a),this.collector)}};vn.DefaultNodeFormatter=Nd;var Tr=class{constructor(e,r){this.nodes=e,this.collector=r}prepend(e){for(let r of this.nodes)this.collector(r,"prepend",e);return this}append(e){for(let r of this.nodes)this.collector(r,"append",e);return this}surround(e){for(let r of this.nodes)this.collector(r,"prepend",e),this.collector(r,"append",e);return this}slice(e,r){return new Tr(this.nodes.slice(e,r),this.collector)}};vn.FormattingRegion=Tr;var HB;(function(t){function e(...l){return{options:{},moves:l.flatMap(d=>d.moves).sort(c)}}t.fit=e;function r(l){return i(0,l)}t.noSpace=r;function n(l){return i(1,l)}t.oneSpace=n;function i(l,d){return{options:d??{},moves:[{characters:l}]}}t.spaces=i;function o(l){return a(1,l)}t.newLine=o;function a(l,d){return{options:d??{},moves:[{lines:l}]}}t.newLines=a;function s(l){return{options:l??{},moves:[{tabs:1,lines:1}]}}t.indent=s;function u(l){return{options:l??{},moves:[{tabs:0}]}}t.noIndent=u;function c(l,d){var h,v,g,R,E,N;let A=(h=l.lines)!==null&&h!==void 0?h:0,b=(v=d.lines)!==null&&v!==void 0?v:0,O=(g=l.tabs)!==null&&g!==void 0?g:0,$=(R=d.tabs)!==null&&R!==void 0?R:0,B=(E=l.characters)!==null&&E!==void 0?E:0,ee=(N=d.characters)!==null&&N!==void 0?N:0;return A<b?-1:A>b?1:O<$?-1:O>$?1:B<ee?-1:B>ee?1:0}})(HB=vn.Formatting||(vn.Formatting={}))});var pP=f(Vn=>{"use strict";var WB=Vn&&Vn.__createBinding||(Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]}),BB=Vn&&Vn.__setModuleDefault||(Object.create?function(t,e){Object.defineProperty(t,"default",{enumerable:!0,value:e})}:function(t,e){t.default=e}),KB=Vn&&Vn.__importStar||function(t){if(t&&t.__esModule)return t;var e={};if(t!=null)for(var r in t)r!=="default"&&Object.prototype.hasOwnProperty.call(t,r)&&WB(e,t,r);return BB(e,t),e};Object.defineProperty(Vn,"__esModule",{value:!0});Vn.LangiumGrammarFormatter=void 0;var Ce=Ty(),uo=KB(ke()),Ry=class extends Ce.AbstractFormatter{format(e){if(uo.isCrossReference(e))this.getNodeFormatter(e).properties("type","terminal").surround(Ce.Formatting.noSpace());else if(uo.isParserRule(e)){let r=this.getNodeFormatter(e);r.keywords("entry","fragment","returns").append(Ce.Formatting.oneSpace()),(e.inferredType||e.returnType||e.dataType)&&e.parameters.length===0?r.property("name").append(Ce.Formatting.oneSpace()):r.property("name").append(Ce.Formatting.noSpace()),r.properties("parameters").append(Ce.Formatting.noSpace()),r.keywords(",").append(Ce.Formatting.oneSpace()),r.keywords("<").append(Ce.Formatting.noSpace());let n=r.keyword(";"),i=r.keyword(":");i.prepend(Ce.Formatting.noSpace()),r.interior(i,n).prepend(Ce.Formatting.indent()),n.prepend(Ce.Formatting.fit(Ce.Formatting.noSpace(),Ce.Formatting.newLine())),r.node(e).prepend(Ce.Formatting.noIndent())}else if(uo.isTerminalRule(e)){let r=this.getNodeFormatter(e);e.type&&(r.property("name").append(Ce.Formatting.oneSpace()),r.keyword("returns").append(Ce.Formatting.oneSpace())),r.keywords("hidden","terminal","fragment").append(Ce.Formatting.oneSpace()),r.keyword(":").prepend(Ce.Formatting.noSpace()),r.keyword(";").prepend(Ce.Formatting.fit(Ce.Formatting.noSpace(),Ce.Formatting.newLine())),r.node(e).prepend(Ce.Formatting.noIndent())}else if(uo.isAction(e)){let r=this.getNodeFormatter(e);r.keyword("{").append(Ce.Formatting.noSpace()),r.keywords(".","+=","=").surround(Ce.Formatting.noSpace()),r.keyword("}").prepend(Ce.Formatting.noSpace())}else if(uo.isInferredType(e))this.getNodeFormatter(e).keywords("infer","infers").append(Ce.Formatting.oneSpace());else if(uo.isAssignment(e))this.getNodeFormatter(e).keywords("=","+=","?=").surround(Ce.Formatting.noSpace());else if(uo.isRuleCall(e)){let r=this.getNodeFormatter(e);r.keyword("<").surround(Ce.Formatting.noSpace()),r.keyword(",").append(Ce.Formatting.oneSpace()),r.properties("arguments").append(Ce.Formatting.noSpace())}uo.isAbstractElement(e)&&this.getNodeFormatter(e).property("cardinality").prepend(Ce.Formatting.noSpace())}};Vn.LangiumGrammarFormatter=Ry});var Od=f(Et=>{"use strict";Object.defineProperty(Et,"__esModule",{value:!0});Et.SemanticTokensDecoder=Et.AbstractSemanticTokenProvider=Et.SemanticTokensBuilder=Et.DefaultSemanticTokenOptions=Et.AllSemanticTokenModifiers=Et.AllSemanticTokenTypes=void 0;var fe=Ie(),kd=vt(),zB=be(),VB=_r(),YB=qe();Et.AllSemanticTokenTypes={[fe.SemanticTokenTypes.class]:0,[fe.SemanticTokenTypes.comment]:1,[fe.SemanticTokenTypes.enum]:2,[fe.SemanticTokenTypes.enumMember]:3,[fe.SemanticTokenTypes.event]:4,[fe.SemanticTokenTypes.function]:5,[fe.SemanticTokenTypes.interface]:6,[fe.SemanticTokenTypes.keyword]:7,[fe.SemanticTokenTypes.macro]:8,[fe.SemanticTokenTypes.method]:9,[fe.SemanticTokenTypes.modifier]:10,[fe.SemanticTokenTypes.namespace]:11,[fe.SemanticTokenTypes.number]:12,[fe.SemanticTokenTypes.operator]:13,[fe.SemanticTokenTypes.parameter]:14,[fe.SemanticTokenTypes.property]:15,[fe.SemanticTokenTypes.regexp]:16,[fe.SemanticTokenTypes.string]:17,[fe.SemanticTokenTypes.struct]:18,[fe.SemanticTokenTypes.type]:19,[fe.SemanticTokenTypes.typeParameter]:20,[fe.SemanticTokenTypes.variable]:21};Et.AllSemanticTokenModifiers={[fe.SemanticTokenModifiers.abstract]:1<<0,[fe.SemanticTokenModifiers.async]:1<<1,[fe.SemanticTokenModifiers.declaration]:1<<2,[fe.SemanticTokenModifiers.defaultLibrary]:1<<3,[fe.SemanticTokenModifiers.definition]:1<<4,[fe.SemanticTokenModifiers.deprecated]:1<<5,[fe.SemanticTokenModifiers.documentation]:1<<6,[fe.SemanticTokenModifiers.modification]:1<<7,[fe.SemanticTokenModifiers.readonly]:1<<8,[fe.SemanticTokenModifiers.static]:1<<9};Et.DefaultSemanticTokenOptions={legend:{tokenTypes:Object.keys(Et.AllSemanticTokenTypes),tokenModifiers:Object.keys(Et.AllSemanticTokenModifiers)},full:{delta:!0},range:!0};var wd=class extends fe.SemanticTokensBuilder{constructor(){super(...arguments),this._tokens=[]}push(e,r,n,i,o){this._tokens.push({line:e,char:r,length:n,tokenType:i,tokenModifiers:o})}build(){return this.applyTokens(),super.build()}buildEdits(){return this.applyTokens(),super.buildEdits()}applyTokens(){for(let e of this._tokens.sort(this.compareTokens))super.push(e.line,e.char,e.length,e.tokenType,e.tokenModifiers);this._tokens=[]}compareTokens(e,r){return e.line===r.line?e.char-r.char:e.line-r.line}};Et.SemanticTokensBuilder=wd;var by=class{constructor(e){this.tokensBuilders=new Map,e.shared.workspace.TextDocuments.onDidClose(r=>{this.tokensBuilders.delete(r.document.uri)}),e.shared.lsp.LanguageServer.onInitialize(r=>{var n;this.initialize((n=r.capabilities.textDocument)===null||n===void 0?void 0:n.semanticTokens)})}initialize(e){this.clientCapabilities=e}async semanticHighlight(e,r,n=fe.CancellationToken.None){return this.currentRange=void 0,this.currentDocument=e,this.currentTokensBuilder=this.getDocumentTokensBuilder(e),await this.computeHighlighting(e,this.createAcceptor(),n),this.currentTokensBuilder.build()}async semanticHighlightRange(e,r,n=fe.CancellationToken.None){return this.currentRange=r.range,this.currentDocument=e,this.currentTokensBuilder=this.getDocumentTokensBuilder(e),await this.computeHighlighting(e,this.createAcceptor(),n),this.currentTokensBuilder.build()}async semanticHighlightDelta(e,r,n=fe.CancellationToken.None){return this.currentRange=void 0,this.currentDocument=e,this.currentTokensBuilder=this.getDocumentTokensBuilder(e),this.currentTokensBuilder.previousResult(r.previousResultId),await this.computeHighlighting(e,this.createAcceptor(),n),this.currentTokensBuilder.buildEdits()}createAcceptor(){return r=>{"line"in r?this.highlightToken({range:{start:{line:r.line,character:r.char},end:{line:r.line,character:r.char+r.length}},type:r.type,modifier:r.modifier}):"range"in r?this.highlightToken(r):"keyword"in r?this.highlightKeyword(r):"property"in r?this.highlightProperty(r):this.highlightNode({node:r.cst,type:r.type,modifier:r.modifier})}}getDocumentTokensBuilder(e){let r=this.tokensBuilders.get(e.uri.toString());if(r)return r;let n=new wd;return this.tokensBuilders.set(e.uri.toString(),n),n}async computeHighlighting(e,r,n){let i=e.parseResult.value,o=(0,zB.streamAst)(i,{range:this.currentRange}).iterator(),a;do if(a=o.next(),!a.done){await(0,VB.interruptAndCheck)(n);let s=a.value;this.highlightElement(s,r)==="prune"&&o.prune()}while(!a.done)}highlightToken(e){var r;let{range:n,type:i}=e,o=e.modifier;if(this.currentRange&&!(0,YB.inRange)(n,this.currentRange)||!this.currentDocument||!this.currentTokensBuilder)return;let a=Et.AllSemanticTokenTypes[i],s=0;if(o!==void 0){typeof o=="string"&&(o=[o]);for(let l of o){let d=Et.AllSemanticTokenModifiers[l];s|=d}}let u=n.start.line,c=n.end.line;if(u===c){let l=n.start.character,d=n.end.character-l;this.currentTokensBuilder.push(u,l,d,a,s)}else if(!((r=this.clientCapabilities)===null||r===void 0)&&r.multilineTokenSupport){let l=n.start.character,d=this.currentDocument.textDocument.offsetAt(n.start),h=this.currentDocument.textDocument.offsetAt(n.end);this.currentTokensBuilder.push(u,l,h-d,a,s)}else{let l=n.start,d=this.currentDocument.textDocument.offsetAt({line:u+1,character:0});this.currentTokensBuilder.push(l.line,l.character,d-l.character-1,a,s);for(let h=u+1;h<c;h++){let v=d;d=this.currentDocument.textDocument.offsetAt({line:h+1,character:0}),this.currentTokensBuilder.push(h,0,d-v-1,a,s)}this.currentTokensBuilder.push(c,0,n.end.character,a,s)}}highlightProperty(e){let r=[];if(typeof e.index=="number"){let o=(0,kd.findNodeForProperty)(e.node.$cstNode,e.property,e.index);o&&r.push(o)}else r.push(...(0,kd.findNodesForProperty)(e.node.$cstNode,e.property));let{type:n,modifier:i}=e;for(let o of r)this.highlightNode({node:o,type:n,modifier:i})}highlightKeyword(e){let{node:r,keyword:n,type:i,index:o,modifier:a}=e,s=[];if(typeof o=="number"){let u=(0,kd.findNodeForKeyword)(r.$cstNode,n,o);u&&s.push(u)}else s.push(...(0,kd.findNodesForKeyword)(r.$cstNode,n));for(let u of s)this.highlightNode({node:u,type:i,modifier:a})}highlightNode(e){let{node:r,type:n,modifier:i}=e,o=r.range;this.highlightToken({range:o,type:n,modifier:i})}};Et.AbstractSemanticTokenProvider=by;var XB;(function(t){function e(n,i){let o=new Map;Object.entries(Et.AllSemanticTokenTypes).forEach(([u,c])=>o.set(c,u));let a=0,s=0;return r(n.data,5).map(u=>{a+=u[0],u[0]!==0&&(s=0),s+=u[1];let c=u[2];return{offset:i.textDocument.offsetAt({line:a,character:s}),tokenType:o.get(u[3]),tokenModifiers:u[4],text:i.textDocument.getText({start:{line:a,character:s},end:{line:a,character:s+c}})}})}t.decode=e;function r(n,i){let o=[];for(let a=0;a<n.length;a+=i){let s=n.slice(a,a+i);o.push(s)}return o}})(XB=Et.SemanticTokensDecoder||(Et.SemanticTokensDecoder={}))});var hP=f(Dd=>{"use strict";Object.defineProperty(Dd,"__esModule",{value:!0});Dd.LangiumGrammarSemanticTokenProvider=void 0;var co=Ie(),JB=Od(),lo=ke(),Ay=class extends JB.AbstractSemanticTokenProvider{highlightElement(e,r){var n;(0,lo.isAssignment)(e)?r({node:e,property:"feature",type:co.SemanticTokenTypes.property}):(0,lo.isAction)(e)?e.feature&&r({node:e,property:"feature",type:co.SemanticTokenTypes.property}):(0,lo.isReturnType)(e)?r({node:e,property:"name",type:co.SemanticTokenTypes.type}):(0,lo.isSimpleType)(e)?(e.primitiveType||e.typeRef)&&r({node:e,property:e.primitiveType?"primitiveType":"typeRef",type:co.SemanticTokenTypes.type}):(0,lo.isParameter)(e)?r({node:e,property:"name",type:co.SemanticTokenTypes.parameter}):(0,lo.isParameterReference)(e)?r({node:e,property:"parameter",type:co.SemanticTokenTypes.parameter}):(0,lo.isRuleCall)(e)?!((n=e.rule.ref)===null||n===void 0)&&n.fragment&&r({node:e,property:"rule",type:co.SemanticTokenTypes.type}):(0,lo.isTypeAttribute)(e)&&r({node:e,property:"name",type:co.SemanticTokenTypes.property})}};Dd.LangiumGrammarSemanticTokenProvider=Ay});var gP=f(Id=>{"use strict";Object.defineProperty(Id,"__esModule",{value:!0});Id.LangiumGrammarNameProvider=void 0;var QB=Za(),ZB=vt(),mP=ke(),Py=class extends QB.DefaultNameProvider{getName(e){return(0,mP.isAssignment)(e)?e.feature:super.getName(e)}getNameNode(e){return(0,mP.isAssignment)(e)?(0,ZB.findNodeForProperty)(e.$cstNode,"feature"):super.getNameNode(e)}};Id.LangiumGrammarNameProvider=Py});var qd=f(xd=>{"use strict";Object.defineProperty(xd,"__esModule",{value:!0});xd.DefaultReferences=void 0;var eK=vt(),yP=er(),tK=be(),vP=qe(),rK=Ft(),nK=Ci(),Sy=class{constructor(e){this.nameProvider=e.references.NameProvider,this.index=e.shared.workspace.IndexManager,this.nodeLocator=e.workspace.AstNodeLocator}findDeclaration(e){if(e){let r=(0,eK.findAssignment)(e),n=e.element;if(r&&n){let i=n[r.feature];if((0,yP.isReference)(i))return i.ref;if(Array.isArray(i)){for(let o of i)if((0,yP.isReference)(o)&&o.$refNode&&o.$refNode.offset<=e.offset&&o.$refNode.end>=e.end)return o.ref}}if(n){let i=this.nameProvider.getNameNode(n);if(i&&(i===e||(0,vP.isCstChildNode)(e,i)))return n}}}findDeclarationNode(e){let r=this.findDeclaration(e);if(r?.$cstNode){let n=this.nameProvider.getNameNode(r);return n??r.$cstNode}}findReferences(e,r){let n=[];if(r.includeDeclaration){let o=this.getReferenceToSelf(e);o&&n.push(o)}let i=this.index.findAllReferences(e,this.nodeLocator.getAstNodePath(e));return r.documentUri&&(i=i.filter(o=>(0,nK.equalURI)(o.sourceUri,r.documentUri))),n.push(...i),(0,rK.stream)(n)}getReferenceToSelf(e){let r=this.nameProvider.getNameNode(e);if(r){let n=(0,tK.getDocument)(e),i=this.nodeLocator.getAstNodePath(e);return{sourceUri:n.uri,sourcePath:i,targetUri:n.uri,targetPath:i,segment:(0,vP.toDocumentSegment)(r),local:!0}}}};xd.DefaultReferences=Sy});var AP=f(Ld=>{"use strict";Object.defineProperty(Ld,"__esModule",{value:!0});Ld.LangiumGrammarReferences=void 0;var iK=qd(),_n=be(),_P=qe(),TP=vt(),oK=Ft(),RP=Ci(),Tn=ke(),bP=jt(),Cy=Ja(),Ey=class extends iK.DefaultReferences{constructor(e){super(e),this.documents=e.shared.workspace.LangiumDocuments}findDeclaration(e){let r=e.element,n=(0,TP.findAssignment)(e);if(n&&n.feature==="feature"){if((0,Tn.isAssignment)(r))return this.findAssignmentDeclaration(r);if((0,Tn.isAction)(r))return this.findActionDeclaration(r)}return super.findDeclaration(e)}findReferences(e,r){var n;return(0,Tn.isTypeAttribute)(e)?this.findReferencesToTypeAttribute(e,(n=r.includeDeclaration)!==null&&n!==void 0?n:!1):super.findReferences(e,r)}findReferencesToTypeAttribute(e,r){let n=[],i=(0,_n.getContainerOfType)(e,Tn.isInterface);if(i){if(r){let s=this.getReferenceToSelf(e);s&&n.push(s)}let o=(0,Cy.collectChildrenTypes)(i,this,this.documents,this.nodeLocator),a=[];o.forEach(s=>{let u=this.findRulesWithReturnType(s);a.push(...u)}),a.forEach(s=>{let u=this.createReferencesToAttribute(s,e);n.push(...u)})}return(0,oK.stream)(n)}createReferencesToAttribute(e,r){let n=[];if((0,Tn.isParserRule)(e)){let i=(0,bP.extractAssignments)(e.definition).find(o=>o.feature===r.name);if(i?.$cstNode){let o=this.nameProvider.getNameNode(i);o&&n.push({sourceUri:(0,_n.getDocument)(i).uri,sourcePath:this.nodeLocator.getAstNodePath(i),targetUri:(0,_n.getDocument)(r).uri,targetPath:this.nodeLocator.getAstNodePath(r),segment:(0,_P.toDocumentSegment)(o),local:(0,RP.equalURI)((0,_n.getDocument)(i).uri,(0,_n.getDocument)(r).uri)})}}else{if(e.feature===r.name){let o=(0,TP.findNodeForProperty)(e.$cstNode,"feature");o&&n.push({sourceUri:(0,_n.getDocument)(e).uri,sourcePath:this.nodeLocator.getAstNodePath(e),targetUri:(0,_n.getDocument)(r).uri,targetPath:this.nodeLocator.getAstNodePath(r),segment:(0,_P.toDocumentSegment)(o),local:(0,RP.equalURI)((0,_n.getDocument)(e).uri,(0,_n.getDocument)(r).uri)})}let i=(0,_n.getContainerOfType)(e,Tn.isParserRule);n.push(...this.createReferencesToAttribute(i,r))}return n}findAssignmentDeclaration(e){var r;let n=(0,_n.getContainerOfType)(e,Tn.isParserRule),i=(0,bP.getActionAtElement)(e);if(i){let o=this.findActionDeclaration(i,e.feature);if(o)return o}if(!((r=n?.returnType)===null||r===void 0)&&r.ref&&((0,Tn.isInterface)(n.returnType.ref)||(0,Tn.isType)(n.returnType.ref))){let o=(0,Cy.collectSuperTypes)(n.returnType.ref);for(let a of o){let s=a.attributes.find(u=>u.name===e.feature);if(s)return s}}return e}findActionDeclaration(e,r){var n;if(!((n=e.type)===null||n===void 0)&&n.ref){let i=r??e.feature,o=(0,Cy.collectSuperTypes)(e.type.ref);for(let a of o){let s=a.attributes.find(u=>u.name===i);if(s)return s}}}findRulesWithReturnType(e){let r=[];return this.index.findAllReferences(e,this.nodeLocator.getAstNodePath(e)).forEach(i=>{let o=this.documents.getOrCreateDocument(i.sourceUri),a=this.nodeLocator.getAstNode(o.parseResult.value,i.sourcePath);((0,Tn.isParserRule)(a)||(0,Tn.isAction)(a))&&r.push(a)}),r}};Ld.LangiumGrammarReferences=Ey});var wy=f(zr=>{"use strict";var aK=zr&&zr.__createBinding||(Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]}),sK=zr&&zr.__setModuleDefault||(Object.create?function(t,e){Object.defineProperty(t,"default",{enumerable:!0,value:e})}:function(t,e){t.default=e}),uK=zr&&zr.__importStar||function(t){if(t&&t.__esModule)return t;var e={};if(t!=null)for(var r in t)r!=="default"&&Object.prototype.hasOwnProperty.call(t,r)&&aK(e,t,r);return sK(e,t),e};Object.defineProperty(zr,"__esModule",{value:!0});zr.findFirstFeatures=zr.findNextFeatures=void 0;var rr=uK(ke()),Ei=jt(),cK=er(),lK=be(),dK=vt();function fK(t,e){let r={stacks:t,tokens:e};return pK(r),r.stacks.flat().forEach(i=>{i.property=void 0}),CP(r.stacks).map(i=>i[i.length-1])}zr.findNextFeatures=fK;function Ny(t){let{next:e,cardinalities:r,visited:n,plus:i}=t,o=[],a=e.feature;if(n.has(a))return[];n.add(a);let s,u=a;for(;u.$container;)if(rr.isGroup(u.$container)){s=u.$container;break}else if(rr.isAbstractElement(u.$container))u=u.$container;else break;if((0,Ei.isArrayCardinality)(u.cardinality)){let c=ss({next:{feature:u,type:e.type,new:!1},cardinalities:r,visited:n,plus:i});for(let l of c)i.add(l.feature);o.push(...c)}if(s){let c=s.elements.indexOf(u);c!==void 0&&c<s.elements.length-1&&o.push(...SP({feature:s,type:e.type,new:!1},c+1,r,n,i)),o.every(l=>(0,Ei.isOptionalCardinality)(l.feature.cardinality)||(0,Ei.isOptionalCardinality)(r.get(l.feature))||i.has(l.feature))&&o.push(...Ny({next:{feature:s,type:e.type,new:!1},cardinalities:r,visited:n,plus:i}))}return o}function PP(t){return(0,cK.isAstNode)(t)&&(t={feature:t}),ss({next:t,cardinalities:new Map,visited:new Set,plus:new Set})}zr.findFirstFeatures=PP;function ss(t){var e,r,n;let{next:i,cardinalities:o,visited:a,plus:s}=t;if(i===void 0)return[];let{feature:u,type:c}=i;if(rr.isGroup(u)){if(a.has(u))return[];a.add(u)}if(rr.isGroup(u))return SP(i,0,o,a,s).map(l=>Md(l,u.cardinality,o));if(rr.isAlternatives(u)||rr.isUnorderedGroup(u))return u.elements.flatMap(l=>ss({next:{feature:l,new:!1,type:c},cardinalities:o,visited:a,plus:s})).map(l=>Md(l,u.cardinality,o));if(rr.isAssignment(u)){let l={feature:u.terminal,new:!1,type:c,property:(e=i.property)!==null&&e!==void 0?e:u.feature};return ss({next:l,cardinalities:o,visited:a,plus:s}).map(d=>Md(d,u.cardinality,o))}else{if(rr.isAction(u))return Ny({next:{feature:u,new:!0,type:(0,Ei.getTypeName)(u),property:(r=i.property)!==null&&r!==void 0?r:u.feature},cardinalities:o,visited:a,plus:s});if(rr.isRuleCall(u)&&rr.isParserRule(u.rule.ref)){let l=u.rule.ref,d={feature:l.definition,new:!0,type:l.fragment?void 0:(n=(0,Ei.getExplicitRuleType)(l))!==null&&n!==void 0?n:l.name,property:i.property};return ss({next:d,cardinalities:o,visited:a,plus:s}).map(h=>Md(h,u.cardinality,o))}else return[i]}}function Md(t,e,r){return r.set(t.feature,e),t}function SP(t,e,r,n,i){var o;let a=[],s;for(;e<t.feature.elements.length&&(s={feature:t.feature.elements[e++],new:!1,type:t.type},a.push(...ss({next:s,cardinalities:r,visited:n,plus:i})),!!(0,Ei.isOptionalCardinality)((o=s.feature.cardinality)!==null&&o!==void 0?o:r.get(s.feature))););return a}function pK(t){for(let e of t.tokens){let r=CP(t.stacks,e);t.stacks=r}}function CP(t,e){let r=[];for(let n of t)r.push(...hK(n,e));return r}function hK(t,e){let r=new Map,n=new Set(t.map(o=>o.feature).filter(mK)),i=[];for(;t.length>0;){let o=t.pop(),a=Ny({next:o,cardinalities:r,plus:n,visited:new Set}).filter(s=>e?ky(s.feature,e):!0);for(let s of a)i.push([...t,s]);if(!a.every(s=>(0,Ei.isOptionalCardinality)(s.feature.cardinality)||(0,Ei.isOptionalCardinality)(r.get(s.feature))))break}return i}function mK(t){if(t.cardinality==="+")return!0;let e=(0,lK.getContainerOfType)(t,rr.isAssignment);return!!(e&&e.cardinality==="+")}function ky(t,e){if(rr.isKeyword(t))return t.value===e.image;if(rr.isRuleCall(t))return gK(t.rule.ref,e);if(rr.isCrossReference(t)){let r=(0,dK.getCrossReferenceTerminal)(t);if(r)return ky(r,e)}return!1}function gK(t,e){return rr.isParserRule(t)?PP(t.definition).some(n=>ky(n.feature,e)):rr.isTerminalRule(t)?new RegExp((0,Ei.terminalRegex)(t)).test(e.image):!1}});var Fd=f(Vr=>{"use strict";var yK=Vr&&Vr.__createBinding||(Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]}),vK=Vr&&Vr.__setModuleDefault||(Object.create?function(t,e){Object.defineProperty(t,"default",{enumerable:!0,value:e})}:function(t,e){t.default=e}),_K=Vr&&Vr.__importStar||function(t){if(t&&t.__esModule)return t;var e={};if(t!=null)for(var r in t)r!=="default"&&Object.prototype.hasOwnProperty.call(t,r)&&yK(e,t,r);return vK(e,t),e};Object.defineProperty(Vr,"__esModule",{value:!0});Vr.DefaultCompletionProvider=Vr.mergeCompletionProviderOptions=void 0;var rc=Ie(),nc=_K(ke()),TK=jt(),RK=be(),EP=qe(),NP=vt(),Oy=Ft(),$d=wy();function bK(t){let e=Array.from(new Set(t.flatMap(n=>{var i;return(i=n?.triggerCharacters)!==null&&i!==void 0?i:[]}))),r=Array.from(new Set(t.flatMap(n=>{var i;return(i=n?.allCommitCharacters)!==null&&i!==void 0?i:[]})));return{triggerCharacters:e.length>0?e:void 0,allCommitCharacters:r.length>0?r:void 0}}Vr.mergeCompletionProviderOptions=bK;var Dy=class{constructor(e){this.scopeProvider=e.references.ScopeProvider,this.grammar=e.Grammar,this.completionParser=e.parser.CompletionParser,this.nameProvider=e.references.NameProvider,this.grammarConfig=e.parser.GrammarConfig}async getCompletion(e,r){var n,i;let a=e.parseResult.value.$cstNode;if(!a)return;let s=[],u=e.textDocument,c=u.getText(),l=u.offsetAt(r.position),d=$=>{let B=this.fillCompletionItem(u,l,$);B&&s.push(B)},h=this.backtrackToAnyToken(c,l),v=(n=(0,EP.findLeafNodeAtOffset)(a,h))===null||n===void 0?void 0:n.element,g={document:e,textDocument:u,node:v,offset:l,position:r.position};if(!v){let $=(0,NP.getEntryRule)(this.grammar);return await this.completionForRule(g,$,d),rc.CompletionList.create(this.deduplicateItems(s),!0)}let R=[g];if(h===l&&h>0){let $=(i=(0,EP.findLeafNodeAtOffset)(a,h-1))===null||i===void 0?void 0:i.element;$!==v&&R.push({document:e,textDocument:u,node:$,offset:l,position:r.position})}let E=this.backtrackToTokenStart(c,l),N=this.findFeaturesAt(u,E),A=[],b=this.canReparse()&&l!==E;b&&(A=this.findFeaturesAt(u,l));let O=$=>nc.isKeyword($.feature)?$.feature.value:$.feature;return await Promise.all((0,Oy.stream)(N).distinct(O).map($=>this.completionForContexts(R,$,d))),b&&await Promise.all((0,Oy.stream)(A).exclude(N,O).distinct(O).map($=>this.completionForContexts(R,$,d))),rc.CompletionList.create(this.deduplicateItems(s),!0)}deduplicateItems(e){return(0,Oy.stream)(e).distinct(r=>`${r.kind}_${r.label}_${r.detail}`).toArray()}canReparse(){return!1}findFeaturesAt(e,r){let n=e.getText({start:rc.Position.create(0,0),end:e.positionAt(r)}),i=this.completionParser.parse(n),o=i.tokens;if(i.tokenIndex===0){let u=(0,NP.getEntryRule)(this.grammar),c=(0,$d.findFirstFeatures)({feature:u.definition,new:!0,type:(0,TK.getExplicitRuleType)(u)});return o.length>0?(o.shift(),(0,$d.findNextFeatures)(c.map(l=>[l]),o)):c}let a=[...o].splice(i.tokenIndex);return(0,$d.findNextFeatures)([i.elementStack.map(u=>({feature:u}))],a)}backtrackToAnyToken(e,r){for(r>=e.length&&(r=e.length-1);r>0&&/\s/.test(e.charAt(r));)r--;return r}backtrackToTokenStart(e,r){if(r<1)return r;let n=this.grammarConfig.nameRegexp,i=e.charAt(r-1);for(;r>0&&n.test(i);)r--,i=e.charAt(r-1);return r}async completionForRule(e,r,n){if(nc.isParserRule(r)){let i=(0,$d.findFirstFeatures)(r.definition);await Promise.all(i.map(o=>this.completionFor(e,o,n)))}}async completionForContexts(e,r,n){for(let i of e)await this.completionFor(i,r,n)}completionFor(e,r,n){if(nc.isKeyword(r.feature))return this.completionForKeyword(e,r.feature,n);if(nc.isCrossReference(r.feature)&&e.node)return this.completionForCrossReference(e,r,n)}completionForCrossReference(e,r,n){let i=(0,RK.getContainerOfType)(r.feature,nc.isAssignment),o=e.node;if(i&&o){if(r.type&&(r.new||o.$type!==r.type)&&(o={$type:r.type,$container:o,$containerProperty:r.property}),!e)return;let a={reference:{},container:o,property:i.feature};try{let s=this.scopeProvider.getScope(a),u=new Set;s.getAllElements().forEach(c=>{!u.has(c.name)&&this.filterCrossReference(c)&&(n(this.createReferenceCompletionItem(c)),u.add(c.name))})}catch(s){console.error(s)}}}createReferenceCompletionItem(e){return{nodeDescription:e,kind:rc.CompletionItemKind.Reference,detail:e.type,sortText:"0"}}filterCrossReference(e){return!0}completionForKeyword(e,r,n){r.value.match(/[\w]/)&&n({label:r.value,kind:rc.CompletionItemKind.Keyword,detail:"Keyword",sortText:"1"})}fillCompletionItem(e,r,n){var i,o;let a;if(typeof n.label=="string")a=n.label;else if("node"in n){let l=this.nameProvider.getName(n.node);if(!l)return;a=l}else if("nodeDescription"in n)a=n.nodeDescription.name;else return;let s;typeof((i=n.textEdit)===null||i===void 0?void 0:i.newText)=="string"?s=n.textEdit.newText:typeof n.insertText=="string"?s=n.insertText:s=a;let u=(o=n.textEdit)!==null&&o!==void 0?o:this.buildCompletionTextEdit(e,r,a,s);return u?{additionalTextEdits:n.additionalTextEdits,command:n.command,commitCharacters:n.commitCharacters,data:n.data,detail:n.detail,documentation:n.documentation,filterText:n.filterText,insertText:n.insertText,insertTextFormat:n.insertTextFormat,insertTextMode:n.insertTextMode,kind:n.kind,labelDetails:n.labelDetails,preselect:n.preselect,sortText:n.sortText,tags:n.tags,textEditText:n.textEditText,textEdit:u,label:a}:void 0}buildCompletionTextEdit(e,r,n,i){let o=e.getText(),a=this.backtrackToTokenStart(o,r),s=o.substring(a,r);if(this.charactersFuzzyMatch(s,n)){let u=e.positionAt(a),c=e.positionAt(r);return{newText:i,range:{start:u,end:c}}}else return}isWordCharacterAt(e,r){return this.grammarConfig.nameRegexp.test(e.charAt(r))}charactersFuzzyMatch(e,r){if(e.length===0)return!0;r=r.toLowerCase();let n=!1,i,o=0,a=r.length;for(let s=0;s<a;s++){let u=r.charCodeAt(s),c=e.charCodeAt(o);if((u===c||this.toUpperCharCode(u)===this.toUpperCharCode(c))&&(n||(n=i===void 0||this.isWordTransition(i,u)),n&&o++,o===e.length))return!0;i=u}return!1}isWordTransition(e,r){return kP<=e&&e<=wP&&AK<=r&&r<=PK||e===OP&&r!==OP}toUpperCharCode(e){return kP<=e&&e<=wP?e-32:e}};Vr.DefaultCompletionProvider=Dy;var kP="a".charCodeAt(0),wP="z".charCodeAt(0),AK="A".charCodeAt(0),PK="Z".charCodeAt(0),OP="_".charCodeAt(0)});var qy=f(jd=>{"use strict";Object.defineProperty(jd,"__esModule",{value:!0});jd.AbstractCallHierarchyProvider=void 0;var SK=Ie(),DP=Un(),Iy=qe(),xy=class{constructor(e){this.grammarConfig=e.parser.GrammarConfig,this.nameProvider=e.references.NameProvider,this.documents=e.shared.workspace.LangiumDocuments,this.references=e.references.References}prepareCallHierarchy(e,r){let n=e.parseResult.value,i=(0,Iy.findDeclarationNodeAtOffset)(n.$cstNode,e.textDocument.offsetAt(r.position),this.grammarConfig.nameRegexp);if(!i)return;let o=this.references.findDeclarationNode(i);if(o)return this.getCallHierarchyItems(o.element,e)}getCallHierarchyItems(e,r){let n=this.nameProvider.getNameNode(e),i=this.nameProvider.getName(e);if(!(!n||!e.$cstNode||i===void 0))return[Object.assign({kind:SK.SymbolKind.Method,name:i,range:e.$cstNode.range,selectionRange:n.range,uri:r.uri.toString()},this.getCallHierarchyItem(e))]}getCallHierarchyItem(e){}incomingCalls(e){let r=this.documents.getOrCreateDocument(DP.URI.parse(e.item.uri)),n=r.parseResult.value,i=(0,Iy.findDeclarationNodeAtOffset)(n.$cstNode,r.textDocument.offsetAt(e.item.range.start),this.grammarConfig.nameRegexp);if(!i)return;let o=this.references.findReferences(i.element,{includeDeclaration:!1});return this.getIncomingCalls(i.element,o)}outgoingCalls(e){let r=this.documents.getOrCreateDocument(DP.URI.parse(e.item.uri)),n=r.parseResult.value,i=(0,Iy.findDeclarationNodeAtOffset)(n.$cstNode,r.textDocument.offsetAt(e.item.range.start),this.grammarConfig.nameRegexp);if(i)return this.getOutgoingCalls(i.element)}};jd.AbstractCallHierarchyProvider=xy});var xP=f(IP=>{"use strict";Object.defineProperty(IP,"__esModule",{value:!0})});var LP=f(qP=>{"use strict";Object.defineProperty(qP,"__esModule",{value:!0})});var $P=f(MP=>{"use strict";Object.defineProperty(MP,"__esModule",{value:!0})});var My=f(Ud=>{"use strict";Object.defineProperty(Ud,"__esModule",{value:!0});Ud.DefaultDefinitionProvider=void 0;var CK=Ie(),EK=be(),NK=qe(),Ly=class{constructor(e){this.nameProvider=e.references.NameProvider,this.references=e.references.References,this.grammarConfig=e.parser.GrammarConfig}getDefinition(e,r){let n=e.parseResult.value;if(n.$cstNode){let i=n.$cstNode,o=(0,NK.findDeclarationNodeAtOffset)(i,e.textDocument.offsetAt(r.position),this.grammarConfig.nameRegexp);if(o)return this.collectLocationLinks(o,r)}}collectLocationLinks(e,r){var n;let i=this.findLink(e);if(i)return[CK.LocationLink.create(i.targetDocument.textDocument.uri,((n=i.target.element.$cstNode)!==null&&n!==void 0?n:i.target).range,i.target.range,i.source.range)]}findLink(e){let r=this.references.findDeclarationNode(e);if(r?.element){let n=(0,EK.getDocument)(r.element);if(r&&n)return{source:e,target:r,targetDocument:n}}}};Ud.DefaultDefinitionProvider=Ly});var Fy=f(Gd=>{"use strict";Object.defineProperty(Gd,"__esModule",{value:!0});Gd.DefaultDocumentHighlightProvider=void 0;var kK=Ie(),wK=be(),OK=qe(),DK=Ci(),$y=class{constructor(e){this.references=e.references.References,this.nameProvider=e.references.NameProvider,this.grammarConfig=e.parser.GrammarConfig}getDocumentHighlight(e,r){let n=e.parseResult.value.$cstNode;if(!n)return;let i=(0,OK.findDeclarationNodeAtOffset)(n,e.textDocument.offsetAt(r.position),this.grammarConfig.nameRegexp);if(!i)return;let o=this.references.findDeclaration(i);if(o){let a=(0,DK.equalURI)((0,wK.getDocument)(o).uri,e.uri),s={documentUri:e.uri,includeDeclaration:a};return this.references.findReferences(o,s).map(c=>this.createDocumentHighlight(c)).toArray()}}createDocumentHighlight(e){return kK.DocumentHighlight.create(e.segment.range)}};Gd.DefaultDocumentHighlightProvider=$y});var jP=f(FP=>{"use strict";Object.defineProperty(FP,"__esModule",{value:!0})});var Uy=f(Hd=>{"use strict";Object.defineProperty(Hd,"__esModule",{value:!0});Hd.DefaultDocumentSymbolProvider=void 0;var IK=Ie(),xK=be(),jy=class{constructor(e){this.nameProvider=e.references.NameProvider}getSymbols(e){return this.getSymbol(e,e.parseResult.value)}getSymbol(e,r){let n=r.$cstNode,i=this.nameProvider.getNameNode(r);if(i&&n){let o=this.nameProvider.getName(r);return[{kind:this.getSymbolKind(r.$type),name:o??i.text,range:n.range,selectionRange:i.range,children:this.getChildSymbols(e,r)}]}else return this.getChildSymbols(e,r)||[]}getChildSymbols(e,r){let n=[];for(let i of(0,xK.streamContents)(r)){let o=this.getSymbol(e,i);n.push(...o)}if(n.length>0)return n}getSymbolKind(e){return IK.SymbolKind.Field}};Hd.DefaultDocumentSymbolProvider=jy});var UP=f(Wd=>{"use strict";Object.defineProperty(Wd,"__esModule",{value:!0});Wd.AbstractExecuteCommandHandler=void 0;var qK=Ie(),Gy=class{get commands(){return Array.from(this.registeredCommands.keys())}constructor(){this.registeredCommands=new Map,this.registerCommands(this.createCommandAcceptor())}async executeCommand(e,r,n=qK.CancellationToken.None){let i=this.registeredCommands.get(e);if(i)return i(r,n)}createCommandAcceptor(){return(e,r)=>this.registeredCommands.set(e,r)}};Wd.AbstractExecuteCommandHandler=Gy});var Wy=f(us=>{"use strict";Object.defineProperty(us,"__esModule",{value:!0});us.MultilineCommentHoverProvider=us.AstNodeHoverProvider=void 0;var LK=qe(),Bd=class{constructor(e){this.references=e.references.References,this.grammarConfig=e.parser.GrammarConfig}getHoverContent(e,r){var n,i;let o=(i=(n=e.parseResult)===null||n===void 0?void 0:n.value)===null||i===void 0?void 0:i.$cstNode;if(o){let a=e.textDocument.offsetAt(r.position),s=(0,LK.findDeclarationNodeAtOffset)(o,a,this.grammarConfig.nameRegexp);if(s&&s.offset+s.length>a){let u=this.references.findDeclaration(s);if(u)return this.getAstNodeHoverContent(u)}}}};us.AstNodeHoverProvider=Bd;var Hy=class extends Bd{constructor(e){super(e),this.documentationProvider=e.documentation.DocumentationProvider}getAstNodeHoverContent(e){let r=this.documentationProvider.getDocumentation(e);if(r)return{contents:{kind:"markdown",value:r}}}};us.MultilineCommentHoverProvider=Hy});var GP=f(Kd=>{"use strict";Object.defineProperty(Kd,"__esModule",{value:!0});Kd.AbstractGoToImplementationProvider=void 0;var MK=Ie(),$K=qe(),By=class{constructor(e){this.references=e.references.References,this.grammarConfig=e.parser.GrammarConfig}getImplementation(e,r,n=MK.CancellationToken.None){let i=e.parseResult.value;if(i.$cstNode){let o=(0,$K.findDeclarationNodeAtOffset)(i.$cstNode,e.textDocument.offsetAt(r.position),this.grammarConfig.nameRegexp);if(o){let a=this.references.findDeclaration(o);if(a)return this.collectGoToImplementationLocationLinks(a,n)}}}};Kd.AbstractGoToImplementationProvider=By});var HP=f(zd=>{"use strict";Object.defineProperty(zd,"__esModule",{value:!0});zd.AbstractInlayHintProvider=void 0;var FK=Ie(),jK=be(),UK=_r(),Ky=class{async getInlayHints(e,r,n=FK.CancellationToken.None){let i=e.parseResult.value,o=[],a=s=>o.push(s);for(let s of(0,jK.streamAst)(i,{range:r.range}))await(0,UK.interruptAndCheck)(n),this.computeInlayHint(s,a);return o}};zd.AbstractInlayHintProvider=Ky});var fo=f(Ni=>{"use strict";Object.defineProperty(Ni,"__esModule",{value:!0});Ni.DefaultLangiumDocuments=Ni.DefaultLangiumDocumentFactory=Ni.DocumentState=void 0;var GK=(Jm(),AR(Xm)),HK=Un(),WK=Ft(),cs;(function(t){t[t.Changed=0]="Changed",t[t.Parsed=1]="Parsed",t[t.IndexedContent=2]="IndexedContent",t[t.ComputedScopes=3]="ComputedScopes",t[t.Linked=4]="Linked",t[t.IndexedReferences=5]="IndexedReferences",t[t.Validated=6]="Validated"})(cs=Ni.DocumentState||(Ni.DocumentState={}));var zy=class{constructor(e){this.serviceRegistry=e.ServiceRegistry,this.textDocuments=e.workspace.TextDocuments,this.fileSystemProvider=e.workspace.FileSystemProvider}fromTextDocument(e,r){return this.create(r??HK.URI.parse(e.uri),e)}fromString(e,r){return this.create(r,e)}fromModel(e,r){return this.create(r,{$model:e})}create(e,r){if(r??(r=this.textDocuments.get(e.toString())),r??(r=this.getContentFromFileSystem(e)),typeof r=="string"){let n=this.parse(e,r);return this.createLangiumDocument(n,e,void 0,r)}else if("$model"in r){let n={value:r.$model,parserErrors:[],lexerErrors:[]};return this.createLangiumDocument(n,e)}else{let n=this.parse(e,r.getText());return this.createLangiumDocument(n,e,r)}}createLangiumDocument(e,r,n,i){let o;if(n)o={parseResult:e,uri:r,state:cs.Parsed,references:[],textDocument:n};else{let a=this.createTextDocumentGetter(r,i);o={parseResult:e,uri:r,state:cs.Parsed,references:[],get textDocument(){return a()}}}return e.value.$document=o,o}update(e){let r=this.textDocuments.get(e.uri.toString()),n=r?r.getText():this.getContentFromFileSystem(e.uri);if(r)Object.defineProperty(e,"textDocument",{value:r});else{let i=this.createTextDocumentGetter(e.uri,n);Object.defineProperty(e,"textDocument",{get:i})}return e.parseResult=this.parse(e.uri,n),e.parseResult.value.$document=e,e.state=cs.Parsed,e}getContentFromFileSystem(e){return this.fileSystemProvider.readFileSync(e)}parse(e,r){return this.serviceRegistry.getServices(e).parser.LangiumParser.parse(r)}createTextDocumentGetter(e,r){let n=this.serviceRegistry,i;return()=>i??(i=GK.TextDocument.create(e.toString(),n.getServices(e).LanguageMetaData.languageId,0,r??""))}};Ni.DefaultLangiumDocumentFactory=zy;var Vy=class{constructor(e){this.documentMap=new Map,this.langiumDocumentFactory=e.workspace.LangiumDocumentFactory}get all(){return(0,WK.stream)(this.documentMap.values())}addDocument(e){let r=e.uri.toString();if(this.documentMap.has(r))throw new Error(`A document with the URI '${r}' is already present.`);this.documentMap.set(r,e)}getOrCreateDocument(e){let r=e.toString(),n=this.documentMap.get(r);return n||(n=this.langiumDocumentFactory.create(e),this.documentMap.set(r,n),n)}hasDocument(e){return this.documentMap.has(e.toString())}invalidateDocument(e){let r=e.toString(),n=this.documentMap.get(r);return n&&(n.state=cs.Changed,n.references=[],n.precomputedScopes=void 0,n.diagnostics=[]),n}deleteDocument(e){let r=e.toString(),n=this.documentMap.get(r);return n&&(n.state=cs.Changed,this.documentMap.delete(r)),n}};Ni.DefaultLangiumDocuments=Vy});var Xy=f(ls=>{"use strict";Object.defineProperty(ls,"__esModule",{value:!0});ls.mergeSignatureHelpOptions=ls.AbstractSignatureHelpProvider=void 0;var BK=Ie(),KK=qe(),Yy=class{provideSignatureHelp(e,r,n=BK.CancellationToken.None){let o=e.parseResult.value.$cstNode;if(o){let a=(0,KK.findLeafNodeAtOffset)(o,e.textDocument.offsetAt(r.position));if(a)return this.getSignatureFromElement(a.element,n)}}get signatureHelpOptions(){return{triggerCharacters:["("],retriggerCharacters:[","]}}};ls.AbstractSignatureHelpProvider=Yy;function zK(t){let e=[],r=[];t.forEach(i=>{i?.triggerCharacters&&e.push(...i.triggerCharacters),i?.retriggerCharacters&&r.push(...i.retriggerCharacters)});let n={triggerCharacters:e.length>0?Array.from(new Set(e)).sort():void 0,retriggerCharacters:r.length>0?Array.from(new Set(r)).sort():void 0};return n.triggerCharacters?n:void 0}ls.mergeSignatureHelpOptions=zK});var Zy=f(X=>{"use strict";Object.defineProperty(X,"__esModule",{value:!0});X.createRequestHandler=X.createServerRequestHandler=X.createCallHierarchyRequestHandler=X.addCallHierarchyHandler=X.addCodeLensHandler=X.addSignatureHelpHandler=X.addDocumentLinkHandler=X.addExecuteCommandHandler=X.addConfigurationChangeHandler=X.addSemanticTokenHandler=X.addInlayHintHandler=X.addRenameHandler=X.addFormattingHandler=X.addFoldingRangeHandler=X.addHoverHandler=X.addDocumentHighlightsHandler=X.addGoToDeclarationHandler=X.addGoToImplementationHandler=X.addGoToTypeDefinitionHandler=X.addGotoDefinitionHandler=X.addDocumentSymbolHandler=X.addCodeActionHandler=X.addFindReferencesHandler=X.addCompletionHandler=X.addDiagnosticsHandler=X.addDocumentsHandler=X.startLanguageServer=X.DefaultLanguageServer=void 0;var Zo=Ie(),ic=Un(),WP=Gu(),VK=_r(),YK=fo(),XK=Fd(),JK=Od(),QK=Xy(),Jy=class{constructor(e){this.onInitializeEmitter=new Zo.Emitter,this.onInitializedEmitter=new Zo.Emitter,this.services=e}get onInitialize(){return this.onInitializeEmitter.event}get onInitialized(){return this.onInitializedEmitter.event}async initialize(e){return this.eagerLoadServices(),this.onInitializeEmitter.fire(e),this.onInitializeEmitter.dispose(),this.buildInitializeResult(e)}eagerLoadServices(){(0,WP.eagerLoad)(this.services),this.services.ServiceRegistry.all.forEach(e=>(0,WP.eagerLoad)(e))}hasService(e){return this.services.ServiceRegistry.all.some(r=>e(r)!==void 0)}buildInitializeResult(e){var r;let n=this.services.ServiceRegistry.all,i=this.hasService(K=>K.lsp.Formatter),o=n.map(K=>{var le;return(le=K.lsp.Formatter)===null||le===void 0?void 0:le.formatOnTypeOptions}).find(K=>Boolean(K)),a=this.hasService(K=>K.lsp.CodeActionProvider),s=this.hasService(K=>K.lsp.SemanticTokenProvider),u=(r=this.services.lsp.ExecuteCommandHandler)===null||r===void 0?void 0:r.commands,c=this.services.lsp.DocumentLinkProvider,l=(0,QK.mergeSignatureHelpOptions)(n.map(K=>{var le;return(le=K.lsp.SignatureHelp)===null||le===void 0?void 0:le.signatureHelpOptions})),d=this.hasService(K=>K.lsp.TypeProvider),h=this.hasService(K=>K.lsp.ImplementationProvider),v=this.hasService(K=>K.lsp.CompletionProvider),g=(0,XK.mergeCompletionProviderOptions)(n.map(K=>{var le;return(le=K.lsp.CompletionProvider)===null||le===void 0?void 0:le.completionOptions})),R=this.hasService(K=>K.lsp.ReferencesProvider),E=this.hasService(K=>K.lsp.DocumentSymbolProvider),N=this.hasService(K=>K.lsp.DefinitionProvider),A=this.hasService(K=>K.lsp.DocumentHighlightProvider),b=this.hasService(K=>K.lsp.FoldingRangeProvider),O=this.hasService(K=>K.lsp.HoverProvider),$=this.hasService(K=>K.lsp.RenameProvider),B=this.hasService(K=>K.lsp.CallHierarchyProvider),ee=this.services.lsp.CodeLensProvider,Fe=this.hasService(K=>K.lsp.DeclarationProvider),Ne=this.services.lsp.InlayHintProvider;return{capabilities:{workspace:{workspaceFolders:{supported:!0}},executeCommandProvider:u&&{commands:u},textDocumentSync:Zo.TextDocumentSyncKind.Incremental,completionProvider:v?g:void 0,referencesProvider:R,documentSymbolProvider:E,definitionProvider:N,typeDefinitionProvider:d,documentHighlightProvider:A,codeActionProvider:a,documentFormattingProvider:i,documentRangeFormattingProvider:i,documentOnTypeFormattingProvider:o,foldingRangeProvider:b,hoverProvider:O,renameProvider:$?{prepareProvider:!0}:void 0,semanticTokensProvider:s?JK.DefaultSemanticTokenOptions:void 0,signatureHelpProvider:l,implementationProvider:h,callHierarchyProvider:B?{}:void 0,documentLinkProvider:c?{resolveProvider:Boolean(c.resolveDocumentLink)}:void 0,codeLensProvider:ee?{resolveProvider:Boolean(ee.resolveCodeLens)}:void 0,declarationProvider:Fe,inlayHintProvider:Ne?{resolveProvider:Boolean(Ne.resolveInlayHint)}:void 0}}}async initialized(e){this.onInitializedEmitter.fire(e),this.onInitializedEmitter.dispose()}};X.DefaultLanguageServer=Jy;function ZK(t){let e=t.lsp.Connection;if(!e)throw new Error("Starting a language server requires the languageServer.Connection service to be set.");BP(e,t),KP(e,t),zP(e,t),VP(e,t),XP(e,t),JP(e,t),QP(e,t),ZP(e,t),tS(e,t),nS(e,t),iS(e,t),YP(e,t),oS(e,t),rS(e,t),aS(e,t),sS(e,t),cS(e,t),dS(e,t),pS(e,t),fS(e,t),lS(e,t),uS(e,t),eS(e,t),e.onInitialize(n=>t.lsp.LanguageServer.initialize(n)),e.onInitialized(n=>t.lsp.LanguageServer.initialized(n)),t.workspace.TextDocuments.listen(e),e.listen()}X.startLanguageServer=ZK;function BP(t,e){let r=e.workspace.DocumentBuilder,n=e.workspace.MutexLock;function i(a,s){n.lock(u=>r.update(a,s,u))}e.workspace.TextDocuments.onDidChangeContent(a=>{i([ic.URI.parse(a.document.uri)],[])}),t.onDidChangeWatchedFiles(a=>{let s=[],u=[];for(let c of a.changes){let l=ic.URI.parse(c.uri);c.type===Zo.FileChangeType.Deleted?u.push(l):s.push(l)}i(s,u)})}X.addDocumentsHandler=BP;function KP(t,e){e.workspace.DocumentBuilder.onBuildPhase(YK.DocumentState.Validated,async(n,i)=>{for(let o of n)if(o.diagnostics&&t.sendDiagnostics({uri:o.uri.toString(),diagnostics:o.diagnostics}),i.isCancellationRequested)return})}X.addDiagnosticsHandler=KP;function zP(t,e){t.onCompletion(Yt((r,n,i,o)=>{var a;return(a=r.lsp.CompletionProvider)===null||a===void 0?void 0:a.getCompletion(n,i,o)},e))}X.addCompletionHandler=zP;function VP(t,e){t.onReferences(Yt((r,n,i,o)=>{var a;return(a=r.lsp.ReferencesProvider)===null||a===void 0?void 0:a.findReferences(n,i,o)},e))}X.addFindReferencesHandler=VP;function YP(t,e){t.onCodeAction(Yt((r,n,i,o)=>{var a;return(a=r.lsp.CodeActionProvider)===null||a===void 0?void 0:a.getCodeActions(n,i,o)},e))}X.addCodeActionHandler=YP;function XP(t,e){t.onDocumentSymbol(Yt((r,n,i,o)=>{var a;return(a=r.lsp.DocumentSymbolProvider)===null||a===void 0?void 0:a.getSymbols(n,i,o)},e))}X.addDocumentSymbolHandler=XP;function JP(t,e){t.onDefinition(Yt((r,n,i,o)=>{var a;return(a=r.lsp.DefinitionProvider)===null||a===void 0?void 0:a.getDefinition(n,i,o)},e))}X.addGotoDefinitionHandler=JP;function QP(t,e){t.onTypeDefinition(Yt((r,n,i,o)=>{var a;return(a=r.lsp.TypeProvider)===null||a===void 0?void 0:a.getTypeDefinition(n,i,o)},e))}X.addGoToTypeDefinitionHandler=QP;function ZP(t,e){t.onImplementation(Yt((r,n,i,o)=>{var a;return(a=r.lsp.ImplementationProvider)===null||a===void 0?void 0:a.getImplementation(n,i,o)},e))}X.addGoToImplementationHandler=ZP;function eS(t,e){t.onDeclaration(Yt((r,n,i,o)=>{var a;return(a=r.lsp.DeclarationProvider)===null||a===void 0?void 0:a.getDeclaration(n,i,o)},e))}X.addGoToDeclarationHandler=eS;function tS(t,e){t.onDocumentHighlight(Yt((r,n,i,o)=>{var a;return(a=r.lsp.DocumentHighlightProvider)===null||a===void 0?void 0:a.getDocumentHighlight(n,i,o)},e))}X.addDocumentHighlightsHandler=tS;function rS(t,e){t.onHover(Yt((r,n,i,o)=>{var a;return(a=r.lsp.HoverProvider)===null||a===void 0?void 0:a.getHoverContent(n,i,o)},e))}X.addHoverHandler=rS;function nS(t,e){t.onFoldingRanges(Yt((r,n,i,o)=>{var a;return(a=r.lsp.FoldingRangeProvider)===null||a===void 0?void 0:a.getFoldingRanges(n,i,o)},e))}X.addFoldingRangeHandler=nS;function iS(t,e){t.onDocumentFormatting(Yt((r,n,i,o)=>{var a;return(a=r.lsp.Formatter)===null||a===void 0?void 0:a.formatDocument(n,i,o)},e)),t.onDocumentRangeFormatting(Yt((r,n,i,o)=>{var a;return(a=r.lsp.Formatter)===null||a===void 0?void 0:a.formatDocumentRange(n,i,o)},e)),t.onDocumentOnTypeFormatting(Yt((r,n,i,o)=>{var a;return(a=r.lsp.Formatter)===null||a===void 0?void 0:a.formatDocumentOnType(n,i,o)},e))}X.addFormattingHandler=iS;function oS(t,e){t.onRenameRequest(Yt((r,n,i,o)=>{var a;return(a=r.lsp.RenameProvider)===null||a===void 0?void 0:a.rename(n,i,o)},e)),t.onPrepareRename(Yt((r,n,i,o)=>{var a;return(a=r.lsp.RenameProvider)===null||a===void 0?void 0:a.prepareRename(n,i,o)},e))}X.addRenameHandler=oS;function aS(t,e){var r;let n=e.lsp.InlayHintProvider;if(n){t.languages.inlayHint.on(ki((o,a,s,u)=>n.getInlayHints(a,s,u),e));let i=(r=n.resolveInlayHint)===null||r===void 0?void 0:r.bind(n);i&&t.languages.inlayHint.resolve(async(o,a)=>{try{return await i(o,a)}catch(s){return ea(s)}})}}X.addInlayHintHandler=aS;function sS(t,e){let r={data:[]};t.languages.semanticTokens.on(ki((n,i,o,a)=>n.lsp.SemanticTokenProvider?n.lsp.SemanticTokenProvider.semanticHighlight(i,o,a):r,e)),t.languages.semanticTokens.onDelta(ki((n,i,o,a)=>n.lsp.SemanticTokenProvider?n.lsp.SemanticTokenProvider.semanticHighlightDelta(i,o,a):r,e)),t.languages.semanticTokens.onRange(ki((n,i,o,a)=>n.lsp.SemanticTokenProvider?n.lsp.SemanticTokenProvider.semanticHighlightRange(i,o,a):r,e))}X.addSemanticTokenHandler=sS;function uS(t,e){t.onDidChangeConfiguration(r=>{r.settings&&e.workspace.ConfigurationProvider.updateConfiguration(r)})}X.addConfigurationChangeHandler=uS;function cS(t,e){let r=e.lsp.ExecuteCommandHandler;r&&t.onExecuteCommand(async(n,i)=>{var o;try{return await r.executeCommand(n.command,(o=n.arguments)!==null&&o!==void 0?o:[],i)}catch(a){return ea(a)}})}X.addExecuteCommandHandler=cS;function lS(t,e){var r;let n=e.lsp.DocumentLinkProvider;if(n){t.onDocumentLinks(ki((o,a,s,u)=>n.getDocumentLinks(a,s,u),e));let i=(r=n.resolveDocumentLink)===null||r===void 0?void 0:r.bind(n);i&&t.onDocumentLinkResolve(async(o,a)=>{try{return await i(o,a)}catch(s){return ea(s)}})}}X.addDocumentLinkHandler=lS;function dS(t,e){t.onSignatureHelp(ki((r,n,i,o)=>{var a;return(a=r.lsp.SignatureHelp)===null||a===void 0?void 0:a.provideSignatureHelp(n,i,o)},e))}X.addSignatureHelpHandler=dS;function fS(t,e){var r;let n=e.lsp.CodeLensProvider;if(n){t.onCodeLens(ki((o,a,s,u)=>n.provideCodeLens(a,s,u),e));let i=(r=n.resolveCodeLens)===null||r===void 0?void 0:r.bind(n);i&&t.onCodeLensResolve(async(o,a)=>{try{return await i(o,a)}catch(s){return ea(s)}})}}X.addCodeLensHandler=fS;function pS(t,e){t.languages.callHierarchy.onPrepare(ki((r,n,i,o)=>{var a;return r.lsp.CallHierarchyProvider&&(a=r.lsp.CallHierarchyProvider.prepareCallHierarchy(n,i,o))!==null&&a!==void 0?a:null},e)),t.languages.callHierarchy.onIncomingCalls(Qy((r,n,i)=>{var o;return r.lsp.CallHierarchyProvider&&(o=r.lsp.CallHierarchyProvider.incomingCalls(n,i))!==null&&o!==void 0?o:null},e)),t.languages.callHierarchy.onOutgoingCalls(Qy((r,n,i)=>{var o;return r.lsp.CallHierarchyProvider&&(o=r.lsp.CallHierarchyProvider.outgoingCalls(n,i))!==null&&o!==void 0?o:null},e))}X.addCallHierarchyHandler=pS;function Qy(t,e){let r=e.ServiceRegistry;return async(n,i)=>{let o=ic.URI.parse(n.item.uri),a=r.getServices(o);if(!a){let s=`Could not find service instance for uri: '${o.toString()}'`;throw console.error(s),new Error(s)}try{return await t(a,n,i)}catch(s){return ea(s)}}}X.createCallHierarchyRequestHandler=Qy;function ki(t,e){let r=e.workspace.LangiumDocuments,n=e.ServiceRegistry;return async(i,o)=>{let a=ic.URI.parse(i.textDocument.uri),s=n.getServices(a);if(!s)throw console.error(`Could not find service instance for uri: '${a.toString()}'`),new Error;let u=r.getOrCreateDocument(a);if(!u)throw new Error;try{return await t(s,u,i,o)}catch(c){return ea(c)}}}X.createServerRequestHandler=ki;function Yt(t,e){let r=e.workspace.LangiumDocuments,n=e.ServiceRegistry;return async(i,o)=>{let a=ic.URI.parse(i.textDocument.uri),s=n.getServices(a);if(!s)return console.error(`Could not find service instance for uri: '${a.toString()}'`),null;let u=r.getOrCreateDocument(a);if(!u)return null;try{return await t(s,u,i,o)}catch(c){return ea(c)}}}X.createRequestHandler=Yt;function ea(t){if((0,VK.isOperationCancelled)(t))return new Zo.ResponseError(Zo.LSPErrorCodes.RequestCancelled,"The request has been cancelled.");if(t instanceof Zo.ResponseError)return t;throw t}});var tv=f(Vd=>{"use strict";Object.defineProperty(Vd,"__esModule",{value:!0});Vd.DefaultReferencesProvider=void 0;var ez=Ie(),tz=qe(),ev=class{constructor(e){this.nameProvider=e.references.NameProvider,this.references=e.references.References,this.grammarConfig=e.parser.GrammarConfig}findReferences(e,r){let n=e.parseResult.value.$cstNode;if(!n)return[];let i=(0,tz.findDeclarationNodeAtOffset)(n,e.textDocument.offsetAt(r.position),this.grammarConfig.nameRegexp);return i?this.getReferences(i,r,e):[]}getReferences(e,r,n){let i=[],o=this.references.findDeclaration(e);if(o){let a={includeDeclaration:r.context.includeDeclaration};this.references.findReferences(o,a).forEach(s=>{i.push(ez.Location.create(s.sourceUri.toString(),s.segment.range))})}return i}};Vd.DefaultReferencesProvider=ev});var nv=f(Yd=>{"use strict";Object.defineProperty(Yd,"__esModule",{value:!0});Yd.DefaultRenameProvider=void 0;var rz=Ie(),nz=Za(),hS=qe(),rv=class{constructor(e){this.references=e.references.References,this.nameProvider=e.references.NameProvider,this.grammarConfig=e.parser.GrammarConfig}async rename(e,r){let n={},i=e.parseResult.value.$cstNode;if(!i)return;let o=e.textDocument.offsetAt(r.position),a=(0,hS.findDeclarationNodeAtOffset)(i,o,this.grammarConfig.nameRegexp);if(!a)return;let s=this.references.findDeclaration(a);if(!s)return;let u={onlyLocal:!1,includeDeclaration:!0};return this.references.findReferences(s,u).forEach(l=>{let d=rz.TextEdit.replace(l.segment.range,r.newName),h=l.sourceUri.toString();n[h]?n[h].push(d):n[h]=[d]}),{changes:n}}prepareRename(e,r){return this.renameNodeRange(e,r.position)}renameNodeRange(e,r){let n=e.parseResult.value.$cstNode,i=e.textDocument.offsetAt(r);if(n&&i){let o=(0,hS.findDeclarationNodeAtOffset)(n,i,this.grammarConfig.nameRegexp);if(!o)return;if(this.references.findDeclaration(o)||this.isNameNode(o))return o.range}}isNameNode(e){return e?.element&&(0,nz.isNamed)(e.element)&&e===this.nameProvider.getNameNode(e.element)}};Yd.DefaultRenameProvider=rv});var mS=f(Xd=>{"use strict";Object.defineProperty(Xd,"__esModule",{value:!0});Xd.AbstractTypeDefinitionProvider=void 0;var iz=Ie(),oz=qe(),iv=class{constructor(e){this.references=e.references.References}getTypeDefinition(e,r,n=iz.CancellationToken.None){let i=e.parseResult.value;if(i.$cstNode){let o=(0,oz.findDeclarationNodeAtOffset)(i.$cstNode,e.textDocument.offsetAt(r.position));if(o){let a=this.references.findDeclaration(o);if(a)return this.collectGoToTypeLocationLinks(a,n)}}}};Xd.AbstractTypeDefinitionProvider=iv});var ov=f(Me=>{"use strict";var az=Me&&Me.__createBinding||(Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]}),ht=Me&&Me.__exportStar||function(t,e){for(var r in t)r!=="default"&&!Object.prototype.hasOwnProperty.call(e,r)&&az(e,t,r)};Object.defineProperty(Me,"__esModule",{value:!0});ht(Fd(),Me);ht(wy(),Me);ht(qy(),Me);ht(xP(),Me);ht(LP(),Me);ht($P(),Me);ht(My(),Me);ht(Fy(),Me);ht(jP(),Me);ht(Uy(),Me);ht(UP(),Me);ht(Sd(),Me);ht(Ty(),Me);ht(Wy(),Me);ht(GP(),Me);ht(HP(),Me);ht(Zy(),Me);ht(tv(),Me);ht(nv(),Me);ht(Od(),Me);ht(Xy(),Me);ht(mS(),Me)});var gS=f(Jd=>{"use strict";Object.defineProperty(Jd,"__esModule",{value:!0});Jd.LangiumGrammarDefinitionProvider=void 0;var av=Ie(),sz=ov(),uz=be(),cz=vt(),lz=ke(),dz=jt(),sv=class extends sz.DefaultDefinitionProvider{constructor(e){super(e),this.documents=e.shared.workspace.LangiumDocuments}collectLocationLinks(e,r){var n,i,o,a,s,u;let c="path";if((0,lz.isGrammarImport)(e.element)&&((n=(0,cz.findAssignment)(e))===null||n===void 0?void 0:n.feature)===c){let l=(0,dz.resolveImport)(this.documents,e.element);if(l?.$document){let d=(i=this.findTargetObject(l))!==null&&i!==void 0?i:l,h=(a=(o=this.nameProvider.getNameNode(d))===null||o===void 0?void 0:o.range)!==null&&a!==void 0?a:av.Range.create(0,0,0,0),v=(u=(s=d.$cstNode)===null||s===void 0?void 0:s.range)!==null&&u!==void 0?u:av.Range.create(0,0,0,0);return[av.LocationLink.create(l.$document.uri.toString(),v,h,e.range)]}return}return super.collectLocationLinks(e,r)}findTargetObject(e){return e.isDeclared?e:(0,uz.streamContents)(e).head()}};Jd.LangiumGrammarDefinitionProvider=sv});var vS=f(Zd=>{"use strict";Object.defineProperty(Zd,"__esModule",{value:!0});Zd.LangiumGrammarCallHierarchyProvider=void 0;var yS=Ie(),fz=qy(),uv=be(),pz=qe(),Qd=ke(),cv=class extends fz.AbstractCallHierarchyProvider{getIncomingCalls(e,r){if(!(0,Qd.isParserRule)(e))return;let n=new Map;if(r.forEach(i=>{let a=this.documents.getOrCreateDocument(i.sourceUri).parseResult.value;if(!a.$cstNode)return;let s=(0,pz.findLeafNodeAtOffset)(a.$cstNode,i.segment.offset);if(!s)return;let u=(0,uv.getContainerOfType)(s.element,Qd.isParserRule);if(!u||!u.$cstNode)return;let c=this.nameProvider.getNameNode(u);if(!c)return;let l=i.sourceUri.toString(),d=l+"@"+c.text;n.has(d)?n.set(d,{parserRule:u.$cstNode,nameNode:c,targetNodes:[...n.get(d).targetNodes,s],docUri:l}):n.set(d,{parserRule:u.$cstNode,nameNode:c,targetNodes:[s],docUri:l})}),n.size!==0)return Array.from(n.values()).map(i=>({from:{kind:yS.SymbolKind.Method,name:i.nameNode.text,range:i.parserRule.range,selectionRange:i.nameNode.range,uri:i.docUri},fromRanges:i.targetNodes.map(o=>o.range)}))}getOutgoingCalls(e){if(!(0,Qd.isParserRule)(e))return;let r=(0,uv.streamAllContents)(e).filter(Qd.isRuleCall).toArray(),n=new Map;if(r.forEach(i=>{var o;let a=i.$cstNode;if(!a)return;let s=(o=i.rule.ref)===null||o===void 0?void 0:o.$cstNode;if(!s)return;let u=this.nameProvider.getNameNode(s.element);if(!u)return;let c=(0,uv.getDocument)(s.element).uri.toString(),l=c+"@"+u.text;n.has(l)?n.set(l,{refCstNode:s,to:u,from:[...n.get(l).from,a.range],docUri:c}):n.set(l,{refCstNode:s,to:u,from:[a.range],docUri:c})}),n.size!==0)return Array.from(n.values()).map(i=>({to:{kind:yS.SymbolKind.Method,name:i.to.text,range:i.refCstNode.range,selectionRange:i.to.range,uri:i.docUri},fromRanges:i.from}))}};Zd.LangiumGrammarCallHierarchyProvider=cv});var RS=f(rf=>{"use strict";Object.defineProperty(rf,"__esModule",{value:!0});rf.LangiumGrammarValidationResourcesCollector=void 0;var hz=gn(),TS=Ft(),ef=ke(),_S=jt(),tf=Ja(),mz=Kg(),lv=class{constructor(e){this.documents=e.shared.workspace.LangiumDocuments}collectValidationResources(e){let r=(0,mz.collectValidationAst)(e,this.documents);return{typeToValidationInfo:this.collectValidationInfo(r),typeToSuperProperties:this.collectSuperProperties(r)}}collectValidationInfo({astResources:e,inferred:r,declared:n}){let i=new Map,o=gz(e);for(let s of(0,tf.mergeTypesAndInterfaces)(r))i.set(s.name,{inferred:s,inferredNodes:o.get(s.name)});let a=(0,TS.stream)(e.interfaces).concat(e.types).reduce((s,u)=>s.set(u.name,u),new Map);for(let s of(0,tf.mergeTypesAndInterfaces)(n)){let u=a.get(s.name);if(u){let c=i.get(s.name);i.set(s.name,Object.assign(Object.assign({},c??{}),{declared:s,declaredNode:u}))}}return i}collectSuperProperties({inferred:e,declared:r}){let n=new Map,i=(0,tf.mergeInterfaces)(e,r),o=new Map(i.map(a=>[a.name,a]));for(let a of(0,tf.mergeInterfaces)(e,r))n.set(a.name,this.addSuperProperties(a,o,new Set));return n}addSuperProperties(e,r,n){if(n.has(e.name))return[];n.add(e.name);let i=[...e.properties];for(let o of e.superTypes){let a=r.get(o.name);a&&i.push(...this.addSuperProperties(a,r,n))}return i}};rf.LangiumGrammarValidationResourcesCollector=lv;function gz({parserRules:t,datatypeRules:e}){let r=new hz.MultiMap;(0,TS.stream)(t).concat(e).forEach(i=>r.add((0,_S.getRuleType)(i),i));function n(i){if((0,ef.isAction)(i)){let o=(0,_S.getActionType)(i);o&&r.add(o,i)}((0,ef.isAlternatives)(i)||(0,ef.isGroup)(i)||(0,ef.isUnorderedGroup)(i))&&i.elements.forEach(o=>n(o))}return t.forEach(i=>n(i.definition)),r}});var bS=f(po=>{"use strict";Object.defineProperty(po,"__esModule",{value:!0});po.isInferredAndDeclared=po.isInferred=po.isDeclared=void 0;function yz(t){return t&&"declared"in t}po.isDeclared=yz;function vz(t){return t&&"inferred"in t}po.isInferred=vz;function _z(t){return t&&"inferred"in t&&"declared"in t}po.isInferredAndDeclared=_z});var PS=f(Yr=>{"use strict";var Tz=Yr&&Yr.__createBinding||(Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]}),Rz=Yr&&Yr.__setModuleDefault||(Object.create?function(t,e){Object.defineProperty(t,"default",{enumerable:!0,value:e})}:function(t,e){t.default=e}),bz=Yr&&Yr.__importStar||function(t){if(t&&t.__esModule)return t;var e={};if(t!=null)for(var r in t)r!=="default"&&Object.prototype.hasOwnProperty.call(t,r)&&Tz(e,t,r);return Rz(e,t),e};Object.defineProperty(Yr,"__esModule",{value:!0});Yr.LangiumGrammarTypesValidator=Yr.registerTypeValidationChecks=void 0;var ds=bz(ke()),Az=gn(),Pz=jt(),Ze=Xa(),dv=bS();function Sz(t){let e=t.validation.ValidationRegistry,r=t.validation.LangiumGrammarTypesValidator,n={Action:[r.checkActionIsNotUnionType],Grammar:[r.checkDeclaredTypesConsistency,r.checkDeclaredAndInferredTypesConsistency]};e.register(n,r)}Yr.registerTypeValidationChecks=Sz;var fv=class{checkDeclaredTypesConsistency(e,r){var n;let i=(n=e.$document)===null||n===void 0?void 0:n.validationResources;if(i){for(let o of i.typeToValidationInfo.values())if((0,dv.isDeclared)(o)&&(0,Ze.isInterfaceType)(o.declared)&&ds.isInterface(o.declaredNode)){let a=o;Ez(a,r),Nz(a,r)}}}checkDeclaredAndInferredTypesConsistency(e,r){var n;let i=(n=e.$document)===null||n===void 0?void 0:n.validationResources;if(i)for(let o of i.typeToValidationInfo.values())(0,dv.isInferred)(o)&&o.inferred instanceof Ze.InterfaceType&&Cz(o.inferred,r),(0,dv.isInferredAndDeclared)(o)&&Oz(o,i,r)}checkActionIsNotUnionType(e,r){ds.isType(e.type)&&r("error","Actions cannot create union types.",{node:e,property:"type"})}};Yr.LangiumGrammarTypesValidator=fv;function Cz(t,e){t.properties.forEach(r=>{var n;let i=(0,Ze.flattenPropertyUnion)(r.type);if(i.length>1){let o=s=>(0,Ze.isReferenceType)(s)?"ref":"other",a=o(i[0]);if(i.slice(1).some(s=>o(s)!==a)){let s=(n=r.astNodes.values().next())===null||n===void 0?void 0:n.value;s&&e("error",`Mixing a cross-reference with other types is not supported. Consider splitting property "${r.name}" into two or more different properties.`,{node:s})}}})}function Ez({declared:t,declaredNode:e},r){Array.from(t.superTypes).forEach((n,i)=>{n&&((0,Ze.isUnionType)(n)&&r("error","Interfaces cannot extend union types.",{node:e,property:"superTypes",index:i}),n.declared||r("error","Extending an inferred type is discouraged.",{node:e,property:"superTypes",index:i}))})}function Nz({declared:t,declaredNode:e},r){let n=t.properties.reduce((a,s)=>a.add(s.name,s),new Az.MultiMap);for(let[a,s]of n.entriesGroupedByKey())if(s.length>1)for(let u of s)r("error",`Cannot have two properties with the same name '${a}'.`,{node:Array.from(u.astNodes)[0],property:"name"});let i=Array.from(t.superTypes);for(let a=0;a<i.length;a++)for(let s=a+1;s<i.length;s++){let u=i[a],c=i[s],l=(0,Ze.isInterfaceType)(u)?u.superProperties:[],d=(0,Ze.isInterfaceType)(c)?c.superProperties:[],h=kz(l,d);h.length>0&&r("error",`Cannot simultaneously inherit from '${u}' and '${c}'. Their ${h.map(v=>"'"+v+"'").join(", ")} properties are not identical.`,{node:e,property:"name"})}let o=new Set;for(let a of i){let s=(0,Ze.isInterfaceType)(a)?a.superProperties:[];for(let u of s)o.add(u.name)}for(let a of t.properties)if(o.has(a.name)){let s=e.attributes.find(u=>u.name===a.name);s&&r("error",`Cannot redeclare property '${a.name}'. It is already inherited from another interface.`,{node:s,property:"name"})}}function kz(t,e){let r=[];for(let n of t){let i=e.find(o=>o.name===n.name);i&&!wz(n,i)&&r.push(n.name)}return r}function wz(t,e){return(0,Ze.isTypeAssignable)(t.type,e.type)&&(0,Ze.isTypeAssignable)(e.type,t.type)}function Oz(t,e,r){let{inferred:n,declared:i,declaredNode:o,inferredNodes:a}=t,s=i.name,u=d=>h=>a.forEach(v=>r("error",`${h}${d?` ${d}`:""}.`,v?.inferredType?{node:v?.inferredType,property:"name"}:{node:v,property:ds.isAction(v)?"type":"name"})),c=(d,h)=>d.forEach(v=>r("error",h,{node:v,property:ds.isAssignment(v)||ds.isAction(v)?"feature":"name"})),l=d=>{a.forEach(h=>{ds.isParserRule(h)&&(0,Pz.extractAssignments)(h.definition).find(g=>g.feature===d)===void 0&&r("error",`Property '${d}' is missing in a rule '${h.name}', but is required in type '${s}'.`,{node:h,property:"parameters"})})};if((0,Ze.isUnionType)(n)&&(0,Ze.isUnionType)(i))Dz(n.type,i.type,u(`in a rule that returns type '${s}'`));else if((0,Ze.isInterfaceType)(n)&&(0,Ze.isInterfaceType)(i))Iz(n,i,e,u(`in a rule that returns type '${s}'`),c,l);else{let d=`Inferred and declared versions of type '${s}' both have to be interfaces or unions.`;u()(d),r("error",d,{node:o,property:"name"})}}function Dz(t,e,r){(0,Ze.isTypeAssignable)(t,e)||r(`Cannot assign type '${(0,Ze.propertyTypeToString)(t,"DeclaredType")}' to '${(0,Ze.propertyTypeToString)(e,"DeclaredType")}'`)}function AS(t){return t.optional||(0,Ze.isMandatoryPropertyType)(t.type)}function Iz(t,e,r,n,i,o){let a=new Set(t.properties.map(d=>d.name)),s=new Map(t.allProperties.map(d=>[d.name,d])),u=new Map(e.superProperties.map(d=>[d.name,d])),c=d=>{if((0,Ze.isPropertyUnion)(d))return{types:d.types.map(h=>c(h))};if((0,Ze.isReferenceType)(d))return{referenceType:c(d.referenceType)};if((0,Ze.isArrayType)(d))return{elementType:c(d.elementType)};if((0,Ze.isValueType)(d)){let h=r.typeToValidationInfo.get(d.value.name);return h?{value:"declared"in h?h.declared:h.inferred}:d}return d};for(let[d,h]of s.entries()){let v=u.get(d);if(v){let g=(0,Ze.propertyTypeToString)(h.type,"DeclaredType"),R=(0,Ze.propertyTypeToString)(v.type,"DeclaredType");if(!(0,Ze.isTypeAssignable)(c(h.type),v.type)){let N=`The assigned type '${g}' is not compatible with the declared property '${d}' of type '${R}'.`;i(h.astNodes,N)}h.optional&&!AS(v)&&o(d)}else a.has(d)&&i(h.astNodes,`A property '${d}' is not expected.`)}let l=new Set;for(let[d,h]of u.entries())!s.get(d)&&!AS(h)&&l.add(d);if(l.size>0){let d=l.size>1?"Properties":"A property",h=l.size>1?"are expected":"is expected",v=Array.from(l).map(g=>`'${g}'`).sort().join(", ");n(`${d} ${v} ${h}.`)}}});var pv=f(ta=>{"use strict";Object.defineProperty(ta,"__esModule",{value:!0});ta.createLangiumGrammarServices=ta.LangiumGrammarModule=void 0;var SS=nf(),CS=Gu(),ES=zA(),NS=tP(),kS=dy(),xz=lP(),qz=dP(),Lz=pP(),Mz=hP(),$z=gP(),Fz=AP(),jz=gS(),Uz=vS(),Gz=RS(),wS=PS(),Hz=_r(),Wz=fo();ta.LangiumGrammarModule={validation:{LangiumGrammarValidator:t=>new kS.LangiumGrammarValidator(t),ValidationResourcesCollector:t=>new Gz.LangiumGrammarValidationResourcesCollector(t),LangiumGrammarTypesValidator:()=>new wS.LangiumGrammarTypesValidator},lsp:{FoldingRangeProvider:t=>new qz.LangiumGrammarFoldingRangeProvider(t),CodeActionProvider:t=>new xz.LangiumGrammarCodeActionProvider(t),SemanticTokenProvider:t=>new Mz.LangiumGrammarSemanticTokenProvider(t),Formatter:()=>new Lz.LangiumGrammarFormatter,DefinitionProvider:t=>new jz.LangiumGrammarDefinitionProvider(t),CallHierarchyProvider:t=>new Uz.LangiumGrammarCallHierarchyProvider(t)},references:{ScopeComputation:t=>new NS.LangiumGrammarScopeComputation(t),ScopeProvider:t=>new NS.LangiumGrammarScopeProvider(t),References:t=>new Fz.LangiumGrammarReferences(t),NameProvider:()=>new $z.LangiumGrammarNameProvider}};function Bz(t,e){let r=(0,CS.inject)((0,SS.createDefaultSharedModule)(t),ES.LangiumGrammarGeneratedSharedModule,e),n=(0,CS.inject)((0,SS.createDefaultModule)({shared:r}),ES.LangiumGrammarGeneratedModule,ta.LangiumGrammarModule);return Kz(r,n),r.ServiceRegistry.register(n),(0,kS.registerValidationChecks)(n),(0,wS.registerTypeValidationChecks)(n),{shared:r,grammar:n}}ta.createLangiumGrammarServices=Bz;function Kz(t,e){t.workspace.DocumentBuilder.onBuildPhase(Wz.DocumentState.IndexedReferences,async(n,i)=>{for(let o of n){await(0,Hz.interruptAndCheck)(i);let a=e.validation.ValidationResourcesCollector,s=o.parseResult.value;o.validationResources=a.collectValidationResources(s)}})}});var hv=f(fs=>{"use strict";Object.defineProperty(fs,"__esModule",{value:!0});fs.EmptyFileSystem=fs.EmptyFileSystemProvider=void 0;var of=class{readFile(){throw new Error("Method not implemented.")}readFileSync(){throw new Error("Method not implemented.")}async readDirectory(){return[]}};fs.EmptyFileSystemProvider=of;fs.EmptyFileSystem={fileSystemProvider:()=>new of}});var vt=f(pe=>{"use strict";var zz=pe&&pe.__createBinding||(Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]}),Vz=pe&&pe.__setModuleDefault||(Object.create?function(t,e){Object.defineProperty(t,"default",{enumerable:!0,value:e})}:function(t,e){t.default=e}),Yz=pe&&pe.__importStar||function(t){if(t&&t.__esModule)return t;var e={};if(t!=null)for(var r in t)r!=="default"&&Object.prototype.hasOwnProperty.call(t,r)&&zz(e,t,r);return Vz(e,t),e};Object.defineProperty(pe,"__esModule",{value:!0});pe.createServicesForGrammar=pe.loadGrammarFromJson=pe.findNameAssignment=pe.findAssignment=pe.findNodesForKeywordInternal=pe.findNodeForKeyword=pe.findNodesForKeyword=pe.findNodeForProperty=pe.findNodesForProperty=pe.isCommentTerminal=pe.getCrossReferenceTerminal=pe.getAllReachableRules=pe.getHiddenRules=pe.getEntryRule=void 0;var IS=Un(),OS=nf(),DS=Gu(),Xz=Vg(),fr=Yz(ke()),Jz=jt(),xS=pv(),Qz=er(),ps=be(),Zz=qe(),mv=hv();function qS(t){return t.rules.find(e=>fr.isParserRule(e)&&e.entry)}pe.getEntryRule=qS;function LS(t){return t.rules.filter(e=>fr.isTerminalRule(e)&&e.hidden)}pe.getHiddenRules=LS;function eV(t,e){let r=new Set,n=qS(t);if(!n)return new Set(t.rules);let i=[n].concat(LS(t));for(let a of i)MS(a,r,e);let o=new Set;for(let a of t.rules)(r.has(a.name)||fr.isTerminalRule(a)&&a.hidden)&&o.add(a);return o}pe.getAllReachableRules=eV;function MS(t,e,r){e.add(t.name),(0,ps.streamAllContents)(t).forEach(n=>{if(fr.isRuleCall(n)||r&&fr.isTerminalRuleCall(n)){let i=n.rule.ref;i&&!e.has(i.name)&&MS(i,e,r)}})}function tV(t){if(t.terminal)return t.terminal;if(t.type.ref){let e=$S(t.type.ref);return e?.terminal}}pe.getCrossReferenceTerminal=tV;function rV(t){return t.hidden&&!" ".match((0,Jz.terminalRegex)(t))}pe.isCommentTerminal=rV;function nV(t,e){return!t||!e?[]:gv(t,e,t.element,!0)}pe.findNodesForProperty=nV;function iV(t,e,r){if(!t||!e)return;let n=gv(t,e,t.element,!0);if(n.length!==0)return r!==void 0?r=Math.max(0,Math.min(r,n.length-1)):r=0,n[r]}pe.findNodeForProperty=iV;function gv(t,e,r,n){if(!n){let i=(0,ps.getContainerOfType)(t.feature,fr.isAssignment);if(i&&i.feature===e)return[t]}return(0,Qz.isCompositeCstNode)(t)&&t.element===r?t.children.flatMap(i=>gv(i,e,r,!1)):[]}function oV(t,e){return t?yv(t,e,t?.element):[]}pe.findNodesForKeyword=oV;function aV(t,e,r){if(!t)return;let n=yv(t,e,t?.element);if(n.length!==0)return r!==void 0?r=Math.max(0,Math.min(r,n.length-1)):r=0,n[r]}pe.findNodeForKeyword=aV;function yv(t,e,r){if(t.element!==r)return[];if(fr.isKeyword(t.feature)&&t.feature.value===e)return[t];let n=(0,Zz.streamCst)(t).iterator(),i,o=[];do if(i=n.next(),!i.done){let a=i.value;a.element===r?fr.isKeyword(a.feature)&&a.feature.value===e&&o.push(a):n.prune()}while(!i.done);return o}pe.findNodesForKeywordInternal=yv;function sV(t){var e;let r=t.element;for(;r===((e=t.parent)===null||e===void 0?void 0:e.element);){let n=(0,ps.getContainerOfType)(t.feature,fr.isAssignment);if(n)return n;t=t.parent}}pe.findAssignment=sV;function $S(t){return fr.isInferredType(t)&&(t=t.$container),FS(t,new Map)}pe.findNameAssignment=$S;function FS(t,e){var r;function n(i,o){let a;return(0,ps.getContainerOfType)(i,fr.isAssignment)||(a=FS(o,e)),e.set(t,a),a}if(e.has(t))return e.get(t);e.set(t,void 0);for(let i of(0,ps.streamAllContents)(t)){if(fr.isAssignment(i)&&i.feature.toLowerCase()==="name")return e.set(t,i),i;if(fr.isRuleCall(i)&&fr.isParserRule(i.rule.ref))return n(i,i.rule.ref);if(fr.isSimpleType(i)&&(!((r=i.typeRef)===null||r===void 0)&&r.ref))return n(i,i.typeRef.ref)}}function uV(t){var e;let r=(0,xS.createLangiumGrammarServices)(mv.EmptyFileSystem).grammar,n=r.serializer.JsonSerializer.deserialize(t);return r.shared.workspace.LangiumDocumentFactory.fromModel(n,IS.URI.parse(`memory://${(e=n.name)!==null&&e!==void 0?e:"grammar"}.langium`)),n}pe.loadGrammarFromJson=uV;async function cV(t){var e,r,n,i,o,a;let s=(e=t.grammarServices)!==null&&e!==void 0?e:(0,xS.createLangiumGrammarServices)(mv.EmptyFileSystem).grammar,u=IS.URI.parse("memory:///grammar.langium"),c=s.shared.workspace.LangiumDocumentFactory,l=typeof t.grammar=="string"?c.fromString(t.grammar,u):(0,ps.getDocument)(t.grammar),d=l.parseResult.value;await s.shared.workspace.DocumentBuilder.build([l],{validationChecks:"none"});let v=(r=t.parserConfig)!==null&&r!==void 0?r:{skipValidations:!1},g=(n=t.languageMetaData)!==null&&n!==void 0?n:{caseInsensitive:!1,fileExtensions:[`.${(o=(i=d.name)===null||i===void 0?void 0:i.toLowerCase())!==null&&o!==void 0?o:"unknown"}`],languageId:(a=d.name)!==null&&a!==void 0?a:"UNKNOWN"},R={AstReflection:()=>(0,Xz.interpretAstReflection)(d)},E={Grammar:()=>d,LanguageMetaData:()=>g,parser:{ParserConfig:()=>v}},N=(0,DS.inject)((0,OS.createDefaultSharedModule)(mv.EmptyFileSystem),R,t.sharedModule),A=(0,DS.inject)((0,OS.createDefaultModule)({shared:N}),E,t.module);return N.ServiceRegistry.register(A),A}pe.createServicesForGrammar=cV});var vv=f(af=>{"use strict";Object.defineProperty(af,"__esModule",{value:!0});af.createGrammarConfig=void 0;var lV=qe(),dV=vt(),fV=Yo(),pV=ke(),hV=jt();function mV(t){let e=[],r=t.Grammar;for(let n of r.rules)(0,pV.isTerminalRule)(n)&&(0,dV.isCommentTerminal)(n)&&(0,fV.isMultilineComment)((0,hV.terminalRegex)(n))&&e.push(n.name);return{multilineCommentRules:e,nameRegexp:lV.DefaultNameRegexp}}af.createGrammarConfig=mV});var _v=f(sf=>{"use strict";Object.defineProperty(sf,"__esModule",{value:!0});sf.VERSION=void 0;sf.VERSION="10.4.2"});var hs=f((ype,jS)=>{var gV=Object.prototype;function yV(t){var e=t&&t.constructor,r=typeof e=="function"&&e.prototype||gV;return t===r}jS.exports=yV});var Tv=f((vpe,US)=>{function vV(t,e){return function(r){return t(e(r))}}US.exports=vV});var HS=f((_pe,GS)=>{var _V=Tv(),TV=_V(Object.keys,Object);GS.exports=TV});var Rv=f((Tpe,WS)=>{var RV=hs(),bV=HS(),AV=Object.prototype,PV=AV.hasOwnProperty;function SV(t){if(!RV(t))return bV(t);var e=[];for(var r in Object(t))PV.call(t,r)&&r!="constructor"&&e.push(r);return e}WS.exports=SV});var bv=f((Rpe,BS)=>{var CV=typeof global=="object"&&global&&global.Object===Object&&global;BS.exports=CV});var Rn=f((bpe,KS)=>{var EV=bv(),NV=typeof self=="object"&&self&&self.Object===Object&&self,kV=EV||NV||Function("return this")();KS.exports=kV});var ra=f((Ape,zS)=>{var wV=Rn(),OV=wV.Symbol;zS.exports=OV});var JS=f((Ppe,XS)=>{var VS=ra(),YS=Object.prototype,DV=YS.hasOwnProperty,IV=YS.toString,oc=VS?VS.toStringTag:void 0;function xV(t){var e=DV.call(t,oc),r=t[oc];try{t[oc]=void 0;var n=!0}catch{}var i=IV.call(t);return n&&(e?t[oc]=r:delete t[oc]),i}XS.exports=xV});var ZS=f((Spe,QS)=>{var qV=Object.prototype,LV=qV.toString;function MV(t){return LV.call(t)}QS.exports=MV});var ho=f((Cpe,rC)=>{var eC=ra(),$V=JS(),FV=ZS(),jV="[object Null]",UV="[object Undefined]",tC=eC?eC.toStringTag:void 0;function GV(t){return t==null?t===void 0?UV:jV:tC&&tC in Object(t)?$V(t):FV(t)}rC.exports=GV});var bn=f((Epe,nC)=>{function HV(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")}nC.exports=HV});var ms=f((Npe,iC)=>{var WV=ho(),BV=bn(),KV="[object AsyncFunction]",zV="[object Function]",VV="[object GeneratorFunction]",YV="[object Proxy]";function XV(t){if(!BV(t))return!1;var e=WV(t);return e==zV||e==VV||e==KV||e==YV}iC.exports=XV});var aC=f((kpe,oC)=>{var JV=Rn(),QV=JV["__core-js_shared__"];oC.exports=QV});var cC=f((wpe,uC)=>{var Av=aC(),sC=function(){var t=/[^.]+$/.exec(Av&&Av.keys&&Av.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();function ZV(t){return!!sC&&sC in t}uC.exports=ZV});var Pv=f((Ope,lC)=>{var e2=Function.prototype,t2=e2.toString;function r2(t){if(t!=null){try{return t2.call(t)}catch{}try{return t+""}catch{}}return""}lC.exports=r2});var fC=f((Dpe,dC)=>{var n2=ms(),i2=cC(),o2=bn(),a2=Pv(),s2=/[\\^$.*+?()[\]{}|]/g,u2=/^\[object .+?Constructor\]$/,c2=Function.prototype,l2=Object.prototype,d2=c2.toString,f2=l2.hasOwnProperty,p2=RegExp("^"+d2.call(f2).replace(s2,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function h2(t){if(!o2(t)||i2(t))return!1;var e=n2(t)?p2:u2;return e.test(a2(t))}dC.exports=h2});var hC=f((Ipe,pC)=>{function m2(t,e){return t?.[e]}pC.exports=m2});var mo=f((xpe,mC)=>{var g2=fC(),y2=hC();function v2(t,e){var r=y2(t,e);return g2(r)?r:void 0}mC.exports=v2});var yC=f((qpe,gC)=>{var _2=mo(),T2=Rn(),R2=_2(T2,"DataView");gC.exports=R2});var uf=f((Lpe,vC)=>{var b2=mo(),A2=Rn(),P2=b2(A2,"Map");vC.exports=P2});var TC=f((Mpe,_C)=>{var S2=mo(),C2=Rn(),E2=S2(C2,"Promise");_C.exports=E2});var Sv=f(($pe,RC)=>{var N2=mo(),k2=Rn(),w2=N2(k2,"Set");RC.exports=w2});var AC=f((Fpe,bC)=>{var O2=mo(),D2=Rn(),I2=O2(D2,"WeakMap");bC.exports=I2});var ys=f((jpe,wC)=>{var Cv=yC(),Ev=uf(),Nv=TC(),kv=Sv(),wv=AC(),kC=ho(),gs=Pv(),PC="[object Map]",x2="[object Object]",SC="[object Promise]",CC="[object Set]",EC="[object WeakMap]",NC="[object DataView]",q2=gs(Cv),L2=gs(Ev),M2=gs(Nv),$2=gs(kv),F2=gs(wv),na=kC;(Cv&&na(new Cv(new ArrayBuffer(1)))!=NC||Ev&&na(new Ev)!=PC||Nv&&na(Nv.resolve())!=SC||kv&&na(new kv)!=CC||wv&&na(new wv)!=EC)&&(na=function(t){var e=kC(t),r=e==x2?t.constructor:void 0,n=r?gs(r):"";if(n)switch(n){case q2:return NC;case L2:return PC;case M2:return SC;case $2:return CC;case F2:return EC}return e});wC.exports=na});var An=f((Upe,OC)=>{function j2(t){return t!=null&&typeof t=="object"}OC.exports=j2});var IC=f((Gpe,DC)=>{var U2=ho(),G2=An(),H2="[object Arguments]";function W2(t){return G2(t)&&U2(t)==H2}DC.exports=W2});var ac=f((Hpe,LC)=>{var xC=IC(),B2=An(),qC=Object.prototype,K2=qC.hasOwnProperty,z2=qC.propertyIsEnumerable,V2=xC(function(){return arguments}())?xC:function(t){return B2(t)&&K2.call(t,"callee")&&!z2.call(t,"callee")};LC.exports=V2});var xe=f((Wpe,MC)=>{var Y2=Array.isArray;MC.exports=Y2});var cf=f((Bpe,$C)=>{var X2=9007199254740991;function J2(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=X2}$C.exports=J2});var Pn=f((Kpe,FC)=>{var Q2=ms(),Z2=cf();function e3(t){return t!=null&&Z2(t.length)&&!Q2(t)}FC.exports=e3});var UC=f((zpe,jC)=>{function t3(){return!1}jC.exports=t3});var uc=f((sc,vs)=>{var r3=Rn(),n3=UC(),WC=typeof sc=="object"&&sc&&!sc.nodeType&&sc,GC=WC&&typeof vs=="object"&&vs&&!vs.nodeType&&vs,i3=GC&&GC.exports===WC,HC=i3?r3.Buffer:void 0,o3=HC?HC.isBuffer:void 0,a3=o3||n3;vs.exports=a3});var KC=f((Vpe,BC)=>{var s3=ho(),u3=cf(),c3=An(),l3="[object Arguments]",d3="[object Array]",f3="[object Boolean]",p3="[object Date]",h3="[object Error]",m3="[object Function]",g3="[object Map]",y3="[object Number]",v3="[object Object]",_3="[object RegExp]",T3="[object Set]",R3="[object String]",b3="[object WeakMap]",A3="[object ArrayBuffer]",P3="[object DataView]",S3="[object Float32Array]",C3="[object Float64Array]",E3="[object Int8Array]",N3="[object Int16Array]",k3="[object Int32Array]",w3="[object Uint8Array]",O3="[object Uint8ClampedArray]",D3="[object Uint16Array]",I3="[object Uint32Array]",et={};et[S3]=et[C3]=et[E3]=et[N3]=et[k3]=et[w3]=et[O3]=et[D3]=et[I3]=!0;et[l3]=et[d3]=et[A3]=et[f3]=et[P3]=et[p3]=et[h3]=et[m3]=et[g3]=et[y3]=et[v3]=et[_3]=et[T3]=et[R3]=et[b3]=!1;function x3(t){return c3(t)&&u3(t.length)&&!!et[s3(t)]}BC.exports=x3});var _s=f((Ype,zC)=>{function q3(t){return function(e){return t(e)}}zC.exports=q3});var dc=f((cc,Ts)=>{var L3=bv(),VC=typeof cc=="object"&&cc&&!cc.nodeType&&cc,lc=VC&&typeof Ts=="object"&&Ts&&!Ts.nodeType&&Ts,M3=lc&&lc.exports===VC,Ov=M3&&L3.process,$3=function(){try{var t=lc&&lc.require&&lc.require("util").types;return t||Ov&&Ov.binding&&Ov.binding("util")}catch{}}();Ts.exports=$3});var lf=f((Xpe,JC)=>{var F3=KC(),j3=_s(),YC=dc(),XC=YC&&YC.isTypedArray,U3=XC?j3(XC):F3;JC.exports=U3});var Or=f((Jpe,QC)=>{var G3=Rv(),H3=ys(),W3=ac(),B3=xe(),K3=Pn(),z3=uc(),V3=hs(),Y3=lf(),X3="[object Map]",J3="[object Set]",Q3=Object.prototype,Z3=Q3.hasOwnProperty;function e4(t){if(t==null)return!0;if(K3(t)&&(B3(t)||typeof t=="string"||typeof t.splice=="function"||z3(t)||Y3(t)||W3(t)))return!t.length;var e=H3(t);if(e==X3||e==J3)return!t.size;if(V3(t))return!G3(t).length;for(var r in t)if(Z3.call(t,r))return!1;return!0}QC.exports=e4});var Rs=f((Qpe,ZC)=>{function t4(t,e){for(var r=-1,n=t==null?0:t.length,i=Array(n);++r<n;)i[r]=e(t[r],r,t);return i}ZC.exports=t4});var tE=f((Zpe,eE)=>{function r4(){this.__data__=[],this.size=0}eE.exports=r4});var bs=f((ehe,rE)=>{function n4(t,e){return t===e||t!==t&&e!==e}rE.exports=n4});var fc=f((the,nE)=>{var i4=bs();function o4(t,e){for(var r=t.length;r--;)if(i4(t[r][0],e))return r;return-1}nE.exports=o4});var oE=f((rhe,iE)=>{var a4=fc(),s4=Array.prototype,u4=s4.splice;function c4(t){var e=this.__data__,r=a4(e,t);if(r<0)return!1;var n=e.length-1;return r==n?e.pop():u4.call(e,r,1),--this.size,!0}iE.exports=c4});var sE=f((nhe,aE)=>{var l4=fc();function d4(t){var e=this.__data__,r=l4(e,t);return r<0?void 0:e[r][1]}aE.exports=d4});var cE=f((ihe,uE)=>{var f4=fc();function p4(t){return f4(this.__data__,t)>-1}uE.exports=p4});var dE=f((ohe,lE)=>{var h4=fc();function m4(t,e){var r=this.__data__,n=h4(r,t);return n<0?(++this.size,r.push([t,e])):r[n][1]=e,this}lE.exports=m4});var pc=f((ahe,fE)=>{var g4=tE(),y4=oE(),v4=sE(),_4=cE(),T4=dE();function As(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}As.prototype.clear=g4;As.prototype.delete=y4;As.prototype.get=v4;As.prototype.has=_4;As.prototype.set=T4;fE.exports=As});var hE=f((she,pE)=>{var R4=pc();function b4(){this.__data__=new R4,this.size=0}pE.exports=b4});var gE=f((uhe,mE)=>{function A4(t){var e=this.__data__,r=e.delete(t);return this.size=e.size,r}mE.exports=A4});var vE=f((che,yE)=>{function P4(t){return this.__data__.get(t)}yE.exports=P4});var TE=f((lhe,_E)=>{function S4(t){return this.__data__.has(t)}_E.exports=S4});var hc=f((dhe,RE)=>{var C4=mo(),E4=C4(Object,"create");RE.exports=E4});var PE=f((fhe,AE)=>{var bE=hc();function N4(){this.__data__=bE?bE(null):{},this.size=0}AE.exports=N4});var CE=f((phe,SE)=>{function k4(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}SE.exports=k4});var NE=f((hhe,EE)=>{var w4=hc(),O4="__lodash_hash_undefined__",D4=Object.prototype,I4=D4.hasOwnProperty;function x4(t){var e=this.__data__;if(w4){var r=e[t];return r===O4?void 0:r}return I4.call(e,t)?e[t]:void 0}EE.exports=x4});var wE=f((mhe,kE)=>{var q4=hc(),L4=Object.prototype,M4=L4.hasOwnProperty;function $4(t){var e=this.__data__;return q4?e[t]!==void 0:M4.call(e,t)}kE.exports=$4});var DE=f((ghe,OE)=>{var F4=hc(),j4="__lodash_hash_undefined__";function U4(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=F4&&e===void 0?j4:e,this}OE.exports=U4});var xE=f((yhe,IE)=>{var G4=PE(),H4=CE(),W4=NE(),B4=wE(),K4=DE();function Ps(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}Ps.prototype.clear=G4;Ps.prototype.delete=H4;Ps.prototype.get=W4;Ps.prototype.has=B4;Ps.prototype.set=K4;IE.exports=Ps});var ME=f((vhe,LE)=>{var qE=xE(),z4=pc(),V4=uf();function Y4(){this.size=0,this.__data__={hash:new qE,map:new(V4||z4),string:new qE}}LE.exports=Y4});var FE=f((_he,$E)=>{function X4(t){var e=typeof t;return e=="string"||e=="number"||e=="symbol"||e=="boolean"?t!=="__proto__":t===null}$E.exports=X4});var mc=f((The,jE)=>{var J4=FE();function Q4(t,e){var r=t.__data__;return J4(e)?r[typeof e=="string"?"string":"hash"]:r.map}jE.exports=Q4});var GE=f((Rhe,UE)=>{var Z4=mc();function e6(t){var e=Z4(this,t).delete(t);return this.size-=e?1:0,e}UE.exports=e6});var WE=f((bhe,HE)=>{var t6=mc();function r6(t){return t6(this,t).get(t)}HE.exports=r6});var KE=f((Ahe,BE)=>{var n6=mc();function i6(t){return n6(this,t).has(t)}BE.exports=i6});var VE=f((Phe,zE)=>{var o6=mc();function a6(t,e){var r=o6(this,t),n=r.size;return r.set(t,e),this.size+=r.size==n?0:1,this}zE.exports=a6});var df=f((She,YE)=>{var s6=ME(),u6=GE(),c6=WE(),l6=KE(),d6=VE();function Ss(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}Ss.prototype.clear=s6;Ss.prototype.delete=u6;Ss.prototype.get=c6;Ss.prototype.has=l6;Ss.prototype.set=d6;YE.exports=Ss});var JE=f((Che,XE)=>{var f6=pc(),p6=uf(),h6=df(),m6=200;function g6(t,e){var r=this.__data__;if(r instanceof f6){var n=r.__data__;if(!p6||n.length<m6-1)return n.push([t,e]),this.size=++r.size,this;r=this.__data__=new h6(n)}return r.set(t,e),this.size=r.size,this}XE.exports=g6});var ff=f((Ehe,QE)=>{var y6=pc(),v6=hE(),_6=gE(),T6=vE(),R6=TE(),b6=JE();function Cs(t){var e=this.__data__=new y6(t);this.size=e.size}Cs.prototype.clear=v6;Cs.prototype.delete=_6;Cs.prototype.get=T6;Cs.prototype.has=R6;Cs.prototype.set=b6;QE.exports=Cs});var eN=f((Nhe,ZE)=>{var A6="__lodash_hash_undefined__";function P6(t){return this.__data__.set(t,A6),this}ZE.exports=P6});var rN=f((khe,tN)=>{function S6(t){return this.__data__.has(t)}tN.exports=S6});var hf=f((whe,nN)=>{var C6=df(),E6=eN(),N6=rN();function pf(t){var e=-1,r=t==null?0:t.length;for(this.__data__=new C6;++e<r;)this.add(t[e])}pf.prototype.add=pf.prototype.push=E6;pf.prototype.has=N6;nN.exports=pf});var Dv=f((Ohe,iN)=>{function k6(t,e){for(var r=-1,n=t==null?0:t.length;++r<n;)if(e(t[r],r,t))return!0;return!1}iN.exports=k6});var mf=f((Dhe,oN)=>{function w6(t,e){return t.has(e)}oN.exports=w6});var Iv=f((Ihe,aN)=>{var O6=hf(),D6=Dv(),I6=mf(),x6=1,q6=2;function L6(t,e,r,n,i,o){var a=r&x6,s=t.length,u=e.length;if(s!=u&&!(a&&u>s))return!1;var c=o.get(t),l=o.get(e);if(c&&l)return c==e&&l==t;var d=-1,h=!0,v=r&q6?new O6:void 0;for(o.set(t,e),o.set(e,t);++d<s;){var g=t[d],R=e[d];if(n)var E=a?n(R,g,d,e,t,o):n(g,R,d,t,e,o);if(E!==void 0){if(E)continue;h=!1;break}if(v){if(!D6(e,function(N,A){if(!I6(v,A)&&(g===N||i(g,N,r,n,o)))return v.push(A)})){h=!1;break}}else if(!(g===R||i(g,R,r,n,o))){h=!1;break}}return o.delete(t),o.delete(e),h}aN.exports=L6});var xv=f((xhe,sN)=>{var M6=Rn(),$6=M6.Uint8Array;sN.exports=$6});var cN=f((qhe,uN)=>{function F6(t){var e=-1,r=Array(t.size);return t.forEach(function(n,i){r[++e]=[i,n]}),r}uN.exports=F6});var gf=f((Lhe,lN)=>{function j6(t){var e=-1,r=Array(t.size);return t.forEach(function(n){r[++e]=n}),r}lN.exports=j6});var mN=f((Mhe,hN)=>{var dN=ra(),fN=xv(),U6=bs(),G6=Iv(),H6=cN(),W6=gf(),B6=1,K6=2,z6="[object Boolean]",V6="[object Date]",Y6="[object Error]",X6="[object Map]",J6="[object Number]",Q6="[object RegExp]",Z6="[object Set]",e9="[object String]",t9="[object Symbol]",r9="[object ArrayBuffer]",n9="[object DataView]",pN=dN?dN.prototype:void 0,qv=pN?pN.valueOf:void 0;function i9(t,e,r,n,i,o,a){switch(r){case n9:if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset)return!1;t=t.buffer,e=e.buffer;case r9:return!(t.byteLength!=e.byteLength||!o(new fN(t),new fN(e)));case z6:case V6:case J6:return U6(+t,+e);case Y6:return t.name==e.name&&t.message==e.message;case Q6:case e9:return t==e+"";case X6:var s=H6;case Z6:var u=n&B6;if(s||(s=W6),t.size!=e.size&&!u)return!1;var c=a.get(t);if(c)return c==e;n|=K6,a.set(t,e);var l=G6(s(t),s(e),n,i,o,a);return a.delete(t),l;case t9:if(qv)return qv.call(t)==qv.call(e)}return!1}hN.exports=i9});var yf=f(($he,gN)=>{function o9(t,e){for(var r=-1,n=e.length,i=t.length;++r<n;)t[i+r]=e[r];return t}gN.exports=o9});var Lv=f((Fhe,yN)=>{var a9=yf(),s9=xe();function u9(t,e,r){var n=e(t);return s9(t)?n:a9(n,r(t))}yN.exports=u9});var vf=f((jhe,vN)=>{function c9(t,e){for(var r=-1,n=t==null?0:t.length,i=0,o=[];++r<n;){var a=t[r];e(a,r,t)&&(o[i++]=a)}return o}vN.exports=c9});var Mv=f((Uhe,_N)=>{function l9(){return[]}_N.exports=l9});var _f=f((Ghe,RN)=>{var d9=vf(),f9=Mv(),p9=Object.prototype,h9=p9.propertyIsEnumerable,TN=Object.getOwnPropertySymbols,m9=TN?function(t){return t==null?[]:(t=Object(t),d9(TN(t),function(e){return h9.call(t,e)}))}:f9;RN.exports=m9});var AN=f((Hhe,bN)=>{function g9(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}bN.exports=g9});var gc=f((Whe,PN)=>{var y9=9007199254740991,v9=/^(?:0|[1-9]\d*)$/;function _9(t,e){var r=typeof t;return e=e??y9,!!e&&(r=="number"||r!="symbol"&&v9.test(t))&&t>-1&&t%1==0&&t<e}PN.exports=_9});var $v=f((Bhe,SN)=>{var T9=AN(),R9=ac(),b9=xe(),A9=uc(),P9=gc(),S9=lf(),C9=Object.prototype,E9=C9.hasOwnProperty;function N9(t,e){var r=b9(t),n=!r&&R9(t),i=!r&&!n&&A9(t),o=!r&&!n&&!i&&S9(t),a=r||n||i||o,s=a?T9(t.length,String):[],u=s.length;for(var c in t)(e||E9.call(t,c))&&!(a&&(c=="length"||i&&(c=="offset"||c=="parent")||o&&(c=="buffer"||c=="byteLength"||c=="byteOffset")||P9(c,u)))&&s.push(c);return s}SN.exports=N9});var Dr=f((Khe,CN)=>{var k9=$v(),w9=Rv(),O9=Pn();function D9(t){return O9(t)?k9(t):w9(t)}CN.exports=D9});var Fv=f((zhe,EN)=>{var I9=Lv(),x9=_f(),q9=Dr();function L9(t){return I9(t,q9,x9)}EN.exports=L9});var wN=f((Vhe,kN)=>{var NN=Fv(),M9=1,$9=Object.prototype,F9=$9.hasOwnProperty;function j9(t,e,r,n,i,o){var a=r&M9,s=NN(t),u=s.length,c=NN(e),l=c.length;if(u!=l&&!a)return!1;for(var d=u;d--;){var h=s[d];if(!(a?h in e:F9.call(e,h)))return!1}var v=o.get(t),g=o.get(e);if(v&&g)return v==e&&g==t;var R=!0;o.set(t,e),o.set(e,t);for(var E=a;++d<u;){h=s[d];var N=t[h],A=e[h];if(n)var b=a?n(A,N,h,e,t,o):n(N,A,h,t,e,o);if(!(b===void 0?N===A||i(N,A,r,n,o):b)){R=!1;break}E||(E=h=="constructor")}if(R&&!E){var O=t.constructor,$=e.constructor;O!=$&&"constructor"in t&&"constructor"in e&&!(typeof O=="function"&&O instanceof O&&typeof $=="function"&&$ instanceof $)&&(R=!1)}return o.delete(t),o.delete(e),R}kN.exports=j9});var $N=f((Yhe,MN)=>{var jv=ff(),U9=Iv(),G9=mN(),H9=wN(),ON=ys(),DN=xe(),IN=uc(),W9=lf(),B9=1,xN="[object Arguments]",qN="[object Array]",Tf="[object Object]",K9=Object.prototype,LN=K9.hasOwnProperty;function z9(t,e,r,n,i,o){var a=DN(t),s=DN(e),u=a?qN:ON(t),c=s?qN:ON(e);u=u==xN?Tf:u,c=c==xN?Tf:c;var l=u==Tf,d=c==Tf,h=u==c;if(h&&IN(t)){if(!IN(e))return!1;a=!0,l=!1}if(h&&!l)return o||(o=new jv),a||W9(t)?U9(t,e,r,n,i,o):G9(t,e,u,r,n,i,o);if(!(r&B9)){var v=l&&LN.call(t,"__wrapped__"),g=d&&LN.call(e,"__wrapped__");if(v||g){var R=v?t.value():t,E=g?e.value():e;return o||(o=new jv),i(R,E,r,n,o)}}return h?(o||(o=new jv),H9(t,e,r,n,i,o)):!1}MN.exports=z9});var Uv=f((Xhe,UN)=>{var V9=$N(),FN=An();function jN(t,e,r,n,i){return t===e?!0:t==null||e==null||!FN(t)&&!FN(e)?t!==t&&e!==e:V9(t,e,r,n,jN,i)}UN.exports=jN});var HN=f((Jhe,GN)=>{var Y9=ff(),X9=Uv(),J9=1,Q9=2;function Z9(t,e,r,n){var i=r.length,o=i,a=!n;if(t==null)return!o;for(t=Object(t);i--;){var s=r[i];if(a&&s[2]?s[1]!==t[s[0]]:!(s[0]in t))return!1}for(;++i<o;){s=r[i];var u=s[0],c=t[u],l=s[1];if(a&&s[2]){if(c===void 0&&!(u in t))return!1}else{var d=new Y9;if(n)var h=n(c,l,u,t,e,d);if(!(h===void 0?X9(l,c,J9|Q9,n,d):h))return!1}}return!0}GN.exports=Z9});var Gv=f((Qhe,WN)=>{var e8=bn();function t8(t){return t===t&&!e8(t)}WN.exports=t8});var KN=f((Zhe,BN)=>{var r8=Gv(),n8=Dr();function i8(t){for(var e=n8(t),r=e.length;r--;){var n=e[r],i=t[n];e[r]=[n,i,r8(i)]}return e}BN.exports=i8});var Hv=f((eme,zN)=>{function o8(t,e){return function(r){return r==null?!1:r[t]===e&&(e!==void 0||t in Object(r))}}zN.exports=o8});var YN=f((tme,VN)=>{var a8=HN(),s8=KN(),u8=Hv();function c8(t){var e=s8(t);return e.length==1&&e[0][2]?u8(e[0][0],e[0][1]):function(r){return r===t||a8(r,t,e)}}VN.exports=c8});var Es=f((rme,XN)=>{var l8=ho(),d8=An(),f8="[object Symbol]";function p8(t){return typeof t=="symbol"||d8(t)&&l8(t)==f8}XN.exports=p8});var Rf=f((nme,JN)=>{var h8=xe(),m8=Es(),g8=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,y8=/^\w*$/;function v8(t,e){if(h8(t))return!1;var r=typeof t;return r=="number"||r=="symbol"||r=="boolean"||t==null||m8(t)?!0:y8.test(t)||!g8.test(t)||e!=null&&t in Object(e)}JN.exports=v8});var ek=f((ime,ZN)=>{var QN=df(),_8="Expected a function";function Wv(t,e){if(typeof t!="function"||e!=null&&typeof e!="function")throw new TypeError(_8);var r=function(){var n=arguments,i=e?e.apply(this,n):n[0],o=r.cache;if(o.has(i))return o.get(i);var a=t.apply(this,n);return r.cache=o.set(i,a)||o,a};return r.cache=new(Wv.Cache||QN),r}Wv.Cache=QN;ZN.exports=Wv});var rk=f((ome,tk)=>{var T8=ek(),R8=500;function b8(t){var e=T8(t,function(n){return r.size===R8&&r.clear(),n}),r=e.cache;return e}tk.exports=b8});var ik=f((ame,nk)=>{var A8=rk(),P8=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,S8=/\\(\\)?/g,C8=A8(function(t){var e=[];return t.charCodeAt(0)===46&&e.push(""),t.replace(P8,function(r,n,i,o){e.push(i?o.replace(S8,"$1"):n||r)}),e});nk.exports=C8});var lk=f((sme,ck)=>{var ok=ra(),E8=Rs(),N8=xe(),k8=Es(),w8=1/0,ak=ok?ok.prototype:void 0,sk=ak?ak.toString:void 0;function uk(t){if(typeof t=="string")return t;if(N8(t))return E8(t,uk)+"";if(k8(t))return sk?sk.call(t):"";var e=t+"";return e=="0"&&1/t==-w8?"-0":e}ck.exports=uk});var Bv=f((ume,dk)=>{var O8=lk();function D8(t){return t==null?"":O8(t)}dk.exports=D8});var yc=f((cme,fk)=>{var I8=xe(),x8=Rf(),q8=ik(),L8=Bv();function M8(t,e){return I8(t)?t:x8(t,e)?[t]:q8(L8(t))}fk.exports=M8});var Ns=f((lme,pk)=>{var $8=Es(),F8=1/0;function j8(t){if(typeof t=="string"||$8(t))return t;var e=t+"";return e=="0"&&1/t==-F8?"-0":e}pk.exports=j8});var bf=f((dme,hk)=>{var U8=yc(),G8=Ns();function H8(t,e){e=U8(e,t);for(var r=0,n=e.length;t!=null&&r<n;)t=t[G8(e[r++])];return r&&r==n?t:void 0}hk.exports=H8});var gk=f((fme,mk)=>{var W8=bf();function B8(t,e,r){var n=t==null?void 0:W8(t,e);return n===void 0?r:n}mk.exports=B8});var vk=f((pme,yk)=>{function K8(t,e){return t!=null&&e in Object(t)}yk.exports=K8});var Kv=f((hme,_k)=>{var z8=yc(),V8=ac(),Y8=xe(),X8=gc(),J8=cf(),Q8=Ns();function Z8(t,e,r){e=z8(e,t);for(var n=-1,i=e.length,o=!1;++n<i;){var a=Q8(e[n]);if(!(o=t!=null&&r(t,a)))break;t=t[a]}return o||++n!=i?o:(i=t==null?0:t.length,!!i&&J8(i)&&X8(a,i)&&(Y8(t)||V8(t)))}_k.exports=Z8});var Rk=f((mme,Tk)=>{var e5=vk(),t5=Kv();function r5(t,e){return t!=null&&t5(t,e,e5)}Tk.exports=r5});var Ak=f((gme,bk)=>{var n5=Uv(),i5=gk(),o5=Rk(),a5=Rf(),s5=Gv(),u5=Hv(),c5=Ns(),l5=1,d5=2;function f5(t,e){return a5(t)&&s5(e)?u5(c5(t),e):function(r){var n=i5(r,t);return n===void 0&&n===e?o5(r,t):n5(e,n,l5|d5)}}bk.exports=f5});var ia=f((yme,Pk)=>{function p5(t){return t}Pk.exports=p5});var Ck=f((vme,Sk)=>{function h5(t){return function(e){return e?.[t]}}Sk.exports=h5});var Nk=f((_me,Ek)=>{var m5=bf();function g5(t){return function(e){return m5(e,t)}}Ek.exports=g5});var wk=f((Tme,kk)=>{var y5=Ck(),v5=Nk(),_5=Rf(),T5=Ns();function R5(t){return _5(t)?y5(T5(t)):v5(t)}kk.exports=R5});var Xr=f((Rme,Ok)=>{var b5=YN(),A5=Ak(),P5=ia(),S5=xe(),C5=wk();function E5(t){return typeof t=="function"?t:t==null?P5:typeof t=="object"?S5(t)?A5(t[0],t[1]):b5(t):C5(t)}Ok.exports=E5});var Ik=f((bme,Dk)=>{function N5(t){return function(e,r,n){for(var i=-1,o=Object(e),a=n(e),s=a.length;s--;){var u=a[t?s:++i];if(r(o[u],u,o)===!1)break}return e}}Dk.exports=N5});var qk=f((Ame,xk)=>{var k5=Ik(),w5=k5();xk.exports=w5});var Mk=f((Pme,Lk)=>{var O5=qk(),D5=Dr();function I5(t,e){return t&&O5(t,e,D5)}Lk.exports=I5});var Fk=f((Sme,$k)=>{var x5=Pn();function q5(t,e){return function(r,n){if(r==null)return r;if(!x5(r))return t(r,n);for(var i=r.length,o=e?i:-1,a=Object(r);(e?o--:++o<i)&&n(a[o],o,a)!==!1;);return r}}$k.exports=q5});var go=f((Cme,jk)=>{var L5=Mk(),M5=Fk(),$5=M5(L5);jk.exports=$5});var Gk=f((Eme,Uk)=>{var F5=go(),j5=Pn();function U5(t,e){var r=-1,n=j5(t)?Array(t.length):[];return F5(t,function(i,o,a){n[++r]=e(i,o,a)}),n}Uk.exports=U5});var Ut=f((Nme,Hk)=>{var G5=Rs(),H5=Xr(),W5=Gk(),B5=xe();function K5(t,e){var r=B5(t)?G5:W5;return r(t,H5(e,3))}Hk.exports=K5});var zv=f((kme,Wk)=>{function z5(t,e){for(var r=-1,n=t==null?0:t.length;++r<n&&e(t[r],r,t)!==!1;);return t}Wk.exports=z5});var Kk=f((wme,Bk)=>{var V5=ia();function Y5(t){return typeof t=="function"?t:V5}Bk.exports=Y5});var Gt=f((Ome,zk)=>{var X5=zv(),J5=go(),Q5=Kk(),Z5=xe();function eY(t,e){var r=Z5(t)?X5:J5;return r(t,Q5(e))}zk.exports=eY});var Yk=f((Dme,Vk)=>{var tY=Rs();function rY(t,e){return tY(e,function(r){return t[r]})}Vk.exports=rY});var Yn=f((Ime,Xk)=>{var nY=Yk(),iY=Dr();function oY(t){return t==null?[]:nY(t,iY(t))}Xk.exports=oY});var Qk=f((xme,Jk)=>{var aY=Object.prototype,sY=aY.hasOwnProperty;function uY(t,e){return t!=null&&sY.call(t,e)}Jk.exports=uY});var Ir=f((qme,Zk)=>{var cY=Qk(),lY=Kv();function dY(t,e){return t!=null&&lY(t,e,cY)}Zk.exports=dY});var Vv=f((Lme,ew)=>{var fY=mo(),pY=function(){try{var t=fY(Object,"defineProperty");return t({},"",{}),t}catch{}}();ew.exports=pY});var Af=f((Mme,rw)=>{var tw=Vv();function hY(t,e,r){e=="__proto__"&&tw?tw(t,e,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[e]=r}rw.exports=hY});var vc=f(($me,nw)=>{var mY=Af(),gY=bs(),yY=Object.prototype,vY=yY.hasOwnProperty;function _Y(t,e,r){var n=t[e];(!(vY.call(t,e)&&gY(n,r))||r===void 0&&!(e in t))&&mY(t,e,r)}nw.exports=_Y});var ks=f((Fme,iw)=>{var TY=vc(),RY=Af();function bY(t,e,r,n){var i=!r;r||(r={});for(var o=-1,a=e.length;++o<a;){var s=e[o],u=n?n(r[s],t[s],s,r,t):void 0;u===void 0&&(u=t[s]),i?RY(r,s,u):TY(r,s,u)}return r}iw.exports=bY});var aw=f((jme,ow)=>{var AY=ks(),PY=Dr();function SY(t,e){return t&&AY(e,PY(e),t)}ow.exports=SY});var uw=f((Ume,sw)=>{function CY(t){var e=[];if(t!=null)for(var r in Object(t))e.push(r);return e}sw.exports=CY});var lw=f((Gme,cw)=>{var EY=bn(),NY=hs(),kY=uw(),wY=Object.prototype,OY=wY.hasOwnProperty;function DY(t){if(!EY(t))return kY(t);var e=NY(t),r=[];for(var n in t)n=="constructor"&&(e||!OY.call(t,n))||r.push(n);return r}cw.exports=DY});var _c=f((Hme,dw)=>{var IY=$v(),xY=lw(),qY=Pn();function LY(t){return qY(t)?IY(t,!0):xY(t)}dw.exports=LY});var pw=f((Wme,fw)=>{var MY=ks(),$Y=_c();function FY(t,e){return t&&MY(e,$Y(e),t)}fw.exports=FY});var vw=f((Tc,ws)=>{var jY=Rn(),yw=typeof Tc=="object"&&Tc&&!Tc.nodeType&&Tc,hw=yw&&typeof ws=="object"&&ws&&!ws.nodeType&&ws,UY=hw&&hw.exports===yw,mw=UY?jY.Buffer:void 0,gw=mw?mw.allocUnsafe:void 0;function GY(t,e){if(e)return t.slice();var r=t.length,n=gw?gw(r):new t.constructor(r);return t.copy(n),n}ws.exports=GY});var Tw=f((Bme,_w)=>{function HY(t,e){var r=-1,n=t.length;for(e||(e=Array(n));++r<n;)e[r]=t[r];return e}_w.exports=HY});var bw=f((Kme,Rw)=>{var WY=ks(),BY=_f();function KY(t,e){return WY(t,BY(t),e)}Rw.exports=KY});var Yv=f((zme,Aw)=>{var zY=Tv(),VY=zY(Object.getPrototypeOf,Object);Aw.exports=VY});var Xv=f((Vme,Pw)=>{var YY=yf(),XY=Yv(),JY=_f(),QY=Mv(),ZY=Object.getOwnPropertySymbols,eX=ZY?function(t){for(var e=[];t;)YY(e,JY(t)),t=XY(t);return e}:QY;Pw.exports=eX});var Cw=f((Yme,Sw)=>{var tX=ks(),rX=Xv();function nX(t,e){return tX(t,rX(t),e)}Sw.exports=nX});var Jv=f((Xme,Ew)=>{var iX=Lv(),oX=Xv(),aX=_c();function sX(t){return iX(t,aX,oX)}Ew.exports=sX});var kw=f((Jme,Nw)=>{var uX=Object.prototype,cX=uX.hasOwnProperty;function lX(t){var e=t.length,r=new t.constructor(e);return e&&typeof t[0]=="string"&&cX.call(t,"index")&&(r.index=t.index,r.input=t.input),r}Nw.exports=lX});var Pf=f((Qme,Ow)=>{var ww=xv();function dX(t){var e=new t.constructor(t.byteLength);return new ww(e).set(new ww(t)),e}Ow.exports=dX});var Iw=f((Zme,Dw)=>{var fX=Pf();function pX(t,e){var r=e?fX(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.byteLength)}Dw.exports=pX});var qw=f((ege,xw)=>{var hX=/\w*$/;function mX(t){var e=new t.constructor(t.source,hX.exec(t));return e.lastIndex=t.lastIndex,e}xw.exports=mX});var jw=f((tge,Fw)=>{var Lw=ra(),Mw=Lw?Lw.prototype:void 0,$w=Mw?Mw.valueOf:void 0;function gX(t){return $w?Object($w.call(t)):{}}Fw.exports=gX});var Gw=f((rge,Uw)=>{var yX=Pf();function vX(t,e){var r=e?yX(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}Uw.exports=vX});var Ww=f((nge,Hw)=>{var _X=Pf(),TX=Iw(),RX=qw(),bX=jw(),AX=Gw(),PX="[object Boolean]",SX="[object Date]",CX="[object Map]",EX="[object Number]",NX="[object RegExp]",kX="[object Set]",wX="[object String]",OX="[object Symbol]",DX="[object ArrayBuffer]",IX="[object DataView]",xX="[object Float32Array]",qX="[object Float64Array]",LX="[object Int8Array]",MX="[object Int16Array]",$X="[object Int32Array]",FX="[object Uint8Array]",jX="[object Uint8ClampedArray]",UX="[object Uint16Array]",GX="[object Uint32Array]";function HX(t,e,r){var n=t.constructor;switch(e){case DX:return _X(t);case PX:case SX:return new n(+t);case IX:return TX(t,r);case xX:case qX:case LX:case MX:case $X:case FX:case jX:case UX:case GX:return AX(t,r);case CX:return new n;case EX:case wX:return new n(t);case NX:return RX(t);case kX:return new n;case OX:return bX(t)}}Hw.exports=HX});var zw=f((ige,Kw)=>{var WX=bn(),Bw=Object.create,BX=function(){function t(){}return function(e){if(!WX(e))return{};if(Bw)return Bw(e);t.prototype=e;var r=new t;return t.prototype=void 0,r}}();Kw.exports=BX});var Yw=f((oge,Vw)=>{var KX=zw(),zX=Yv(),VX=hs();function YX(t){return typeof t.constructor=="function"&&!VX(t)?KX(zX(t)):{}}Vw.exports=YX});var Jw=f((age,Xw)=>{var XX=ys(),JX=An(),QX="[object Map]";function ZX(t){return JX(t)&&XX(t)==QX}Xw.exports=ZX});var tO=f((sge,eO)=>{var e7=Jw(),t7=_s(),Qw=dc(),Zw=Qw&&Qw.isMap,r7=Zw?t7(Zw):e7;eO.exports=r7});var nO=f((uge,rO)=>{var n7=ys(),i7=An(),o7="[object Set]";function a7(t){return i7(t)&&n7(t)==o7}rO.exports=a7});var sO=f((cge,aO)=>{var s7=nO(),u7=_s(),iO=dc(),oO=iO&&iO.isSet,c7=oO?u7(oO):s7;aO.exports=c7});var fO=f((lge,dO)=>{var l7=ff(),d7=zv(),f7=vc(),p7=aw(),h7=pw(),m7=vw(),g7=Tw(),y7=bw(),v7=Cw(),_7=Fv(),T7=Jv(),R7=ys(),b7=kw(),A7=Ww(),P7=Yw(),S7=xe(),C7=uc(),E7=tO(),N7=bn(),k7=sO(),w7=Dr(),O7=_c(),D7=1,I7=2,x7=4,uO="[object Arguments]",q7="[object Array]",L7="[object Boolean]",M7="[object Date]",$7="[object Error]",cO="[object Function]",F7="[object GeneratorFunction]",j7="[object Map]",U7="[object Number]",lO="[object Object]",G7="[object RegExp]",H7="[object Set]",W7="[object String]",B7="[object Symbol]",K7="[object WeakMap]",z7="[object ArrayBuffer]",V7="[object DataView]",Y7="[object Float32Array]",X7="[object Float64Array]",J7="[object Int8Array]",Q7="[object Int16Array]",Z7="[object Int32Array]",eJ="[object Uint8Array]",tJ="[object Uint8ClampedArray]",rJ="[object Uint16Array]",nJ="[object Uint32Array]",Xe={};Xe[uO]=Xe[q7]=Xe[z7]=Xe[V7]=Xe[L7]=Xe[M7]=Xe[Y7]=Xe[X7]=Xe[J7]=Xe[Q7]=Xe[Z7]=Xe[j7]=Xe[U7]=Xe[lO]=Xe[G7]=Xe[H7]=Xe[W7]=Xe[B7]=Xe[eJ]=Xe[tJ]=Xe[rJ]=Xe[nJ]=!0;Xe[$7]=Xe[cO]=Xe[K7]=!1;function Sf(t,e,r,n,i,o){var a,s=e&D7,u=e&I7,c=e&x7;if(r&&(a=i?r(t,n,i,o):r(t)),a!==void 0)return a;if(!N7(t))return t;var l=S7(t);if(l){if(a=b7(t),!s)return g7(t,a)}else{var d=R7(t),h=d==cO||d==F7;if(C7(t))return m7(t,s);if(d==lO||d==uO||h&&!i){if(a=u||h?{}:P7(t),!s)return u?v7(t,h7(a,t)):y7(t,p7(a,t))}else{if(!Xe[d])return i?t:{};a=A7(t,d,s)}}o||(o=new l7);var v=o.get(t);if(v)return v;o.set(t,a),k7(t)?t.forEach(function(E){a.add(Sf(E,e,r,E,t,o))}):E7(t)&&t.forEach(function(E,N){a.set(N,Sf(E,e,r,N,t,o))});var g=c?u?T7:_7:u?O7:w7,R=l?void 0:g(t);return d7(R||t,function(E,N){R&&(N=E,E=t[N]),f7(a,N,Sf(E,e,r,N,t,o))}),a}dO.exports=Sf});var wi=f((dge,pO)=>{var iJ=fO(),oJ=4;function aJ(t){return iJ(t,oJ)}pO.exports=aJ});var hO=f(Os=>{"use strict";Object.defineProperty(Os,"__esModule",{value:!0});Os.PRINT_WARNING=Os.PRINT_ERROR=void 0;function sJ(t){console&&console.error&&console.error("Error: ".concat(t))}Os.PRINT_ERROR=sJ;function uJ(t){console&&console.warn&&console.warn("Warning: ".concat(t))}Os.PRINT_WARNING=uJ});var mO=f(Cf=>{"use strict";Object.defineProperty(Cf,"__esModule",{value:!0});Cf.timer=void 0;function cJ(t){var e=new Date().getTime(),r=t(),n=new Date().getTime(),i=n-e;return{time:i,value:r}}Cf.timer=cJ});var gO=f((exports,module)=>{"use strict";Object.defineProperty(exports,"__esModule",{value:!0});exports.toFastProperties=void 0;function toFastProperties(toBecomeFast){function FakeConstructor(){}FakeConstructor.prototype=toBecomeFast;var fakeInstance=new FakeConstructor;function fakeAccess(){return typeof fakeInstance.bar}return fakeAccess(),fakeAccess(),toBecomeFast;eval(toBecomeFast)}exports.toFastProperties=toFastProperties});var Ds=f(Xn=>{"use strict";Object.defineProperty(Xn,"__esModule",{value:!0});Xn.toFastProperties=Xn.timer=Xn.PRINT_ERROR=Xn.PRINT_WARNING=void 0;var yO=hO();Object.defineProperty(Xn,"PRINT_WARNING",{enumerable:!0,get:function(){return yO.PRINT_WARNING}});Object.defineProperty(Xn,"PRINT_ERROR",{enumerable:!0,get:function(){return yO.PRINT_ERROR}});var lJ=mO();Object.defineProperty(Xn,"timer",{enumerable:!0,get:function(){return lJ.timer}});var dJ=gO();Object.defineProperty(Xn,"toFastProperties",{enumerable:!0,get:function(){return dJ.toFastProperties}})});var Ef=f((mge,vO)=>{function fJ(t,e,r){var n=-1,i=t.length;e<0&&(e=-e>i?0:i+e),r=r>i?i:r,r<0&&(r+=i),i=e>r?0:r-e>>>0,e>>>=0;for(var o=Array(i);++n<i;)o[n]=t[n+e];return o}vO.exports=fJ});var TO=f((gge,_O)=>{var pJ=/\s/;function hJ(t){for(var e=t.length;e--&&pJ.test(t.charAt(e)););return e}_O.exports=hJ});var bO=f((yge,RO)=>{var mJ=TO(),gJ=/^\s+/;function yJ(t){return t&&t.slice(0,mJ(t)+1).replace(gJ,"")}RO.exports=yJ});var CO=f((vge,SO)=>{var vJ=bO(),AO=bn(),_J=Es(),PO=0/0,TJ=/^[-+]0x[0-9a-f]+$/i,RJ=/^0b[01]+$/i,bJ=/^0o[0-7]+$/i,AJ=parseInt;function PJ(t){if(typeof t=="number")return t;if(_J(t))return PO;if(AO(t)){var e=typeof t.valueOf=="function"?t.valueOf():t;t=AO(e)?e+"":e}if(typeof t!="string")return t===0?t:+t;t=vJ(t);var r=RJ.test(t);return r||bJ.test(t)?AJ(t.slice(2),r?2:8):TJ.test(t)?PO:+t}SO.exports=PJ});var kO=f((_ge,NO)=>{var SJ=CO(),EO=1/0,CJ=17976931348623157e292;function EJ(t){if(!t)return t===0?t:0;if(t=SJ(t),t===EO||t===-EO){var e=t<0?-1:1;return e*CJ}return t===t?t:0}NO.exports=EJ});var Is=f((Tge,wO)=>{var NJ=kO();function kJ(t){var e=NJ(t),r=e%1;return e===e?r?e-r:e:0}wO.exports=kJ});var Nf=f((Rge,OO)=>{var wJ=Ef(),OJ=Is();function DJ(t,e,r){var n=t==null?0:t.length;return n?(e=r||e===void 0?1:OJ(e),wJ(t,e<0?0:e,n)):[]}OO.exports=DJ});var Rc=f((bge,DO)=>{var IJ=ho(),xJ=xe(),qJ=An(),LJ="[object String]";function MJ(t){return typeof t=="string"||!xJ(t)&&qJ(t)&&IJ(t)==LJ}DO.exports=MJ});var xO=f((Age,IO)=>{var $J=ho(),FJ=An(),jJ="[object RegExp]";function UJ(t){return FJ(t)&&$J(t)==jJ}IO.exports=UJ});var Qv=f((Pge,MO)=>{var GJ=xO(),HJ=_s(),qO=dc(),LO=qO&&qO.isRegExp,WJ=LO?HJ(LO):GJ;MO.exports=WJ});var jO=f((Sge,FO)=>{var BJ=vc(),KJ=yc(),zJ=gc(),$O=bn(),VJ=Ns();function YJ(t,e,r,n){if(!$O(t))return t;e=KJ(e,t);for(var i=-1,o=e.length,a=o-1,s=t;s!=null&&++i<o;){var u=VJ(e[i]),c=r;if(u==="__proto__"||u==="constructor"||u==="prototype")return t;if(i!=a){var l=s[u];c=n?n(l,u,s):void 0,c===void 0&&(c=$O(l)?l:zJ(e[i+1])?[]:{})}BJ(s,u,c),s=s[u]}return t}FO.exports=YJ});var GO=f((Cge,UO)=>{var XJ=bf(),JJ=jO(),QJ=yc();function ZJ(t,e,r){for(var n=-1,i=e.length,o={};++n<i;){var a=e[n],s=XJ(t,a);r(s,a)&&JJ(o,QJ(a,t),s)}return o}UO.exports=ZJ});var Zv=f((Ege,HO)=>{var eQ=Rs(),tQ=Xr(),rQ=GO(),nQ=Jv();function iQ(t,e){if(t==null)return{};var r=eQ(nQ(t),function(n){return[n]});return e=tQ(e),rQ(t,r,function(n,i){return e(n,i[0])})}HO.exports=iQ});var BO=f((Nge,WO)=>{function oQ(t,e,r){switch(r.length){case 0:return t.call(e);case 1:return t.call(e,r[0]);case 2:return t.call(e,r[0],r[1]);case 3:return t.call(e,r[0],r[1],r[2])}return t.apply(e,r)}WO.exports=oQ});var VO=f((kge,zO)=>{var aQ=BO(),KO=Math.max;function sQ(t,e,r){return e=KO(e===void 0?t.length-1:e,0),function(){for(var n=arguments,i=-1,o=KO(n.length-e,0),a=Array(o);++i<o;)a[i]=n[e+i];i=-1;for(var s=Array(e+1);++i<e;)s[i]=n[i];return s[e]=r(a),aQ(t,this,s)}}zO.exports=sQ});var XO=f((wge,YO)=>{function uQ(t){return function(){return t}}YO.exports=uQ});var ZO=f((Oge,QO)=>{var cQ=XO(),JO=Vv(),lQ=ia(),dQ=JO?function(t,e){return JO(t,"toString",{configurable:!0,enumerable:!1,value:cQ(e),writable:!0})}:lQ;QO.exports=dQ});var tD=f((Dge,eD)=>{var fQ=800,pQ=16,hQ=Date.now;function mQ(t){var e=0,r=0;return function(){var n=hQ(),i=pQ-(n-r);if(r=n,i>0){if(++e>=fQ)return arguments[0]}else e=0;return t.apply(void 0,arguments)}}eD.exports=mQ});var nD=f((Ige,rD)=>{var gQ=ZO(),yQ=tD(),vQ=yQ(gQ);rD.exports=vQ});var kf=f((xge,iD)=>{var _Q=ia(),TQ=VO(),RQ=nD();function bQ(t,e){return RQ(TQ(t,e,_Q),t+"")}iD.exports=bQ});var bc=f((qge,oD)=>{var AQ=bs(),PQ=Pn(),SQ=gc(),CQ=bn();function EQ(t,e,r){if(!CQ(r))return!1;var n=typeof e;return(n=="number"?PQ(r)&&SQ(e,r.length):n=="string"&&e in r)?AQ(r[e],t):!1}oD.exports=EQ});var sD=f((Lge,aD)=>{var NQ=kf(),kQ=bc();function wQ(t){return NQ(function(e,r){var n=-1,i=r.length,o=i>1?r[i-1]:void 0,a=i>2?r[2]:void 0;for(o=t.length>3&&typeof o=="function"?(i--,o):void 0,a&&kQ(r[0],r[1],a)&&(o=i<3?void 0:o,i=1),e=Object(e);++n<i;){var s=r[n];s&&t(e,s,n,o)}return e})}aD.exports=wQ});var Ac=f((Mge,uD)=>{var OQ=vc(),DQ=ks(),IQ=sD(),xQ=Pn(),qQ=hs(),LQ=Dr(),MQ=Object.prototype,$Q=MQ.hasOwnProperty,FQ=IQ(function(t,e){if(qQ(e)||xQ(e)){DQ(e,LQ(e),t);return}for(var r in e)$Q.call(e,r)&&OQ(t,r,e[r])});uD.exports=FQ});var Of=f(Pe=>{"use strict";var Oi=Pe&&Pe.__extends||function(){var t=function(e,r){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(n[o]=i[o])},t(e,r)};return function(e,r){if(typeof r!="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");t(e,r);function n(){this.constructor=e}e.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),xs=Pe&&Pe.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(Pe,"__esModule",{value:!0});Pe.serializeProduction=Pe.serializeGrammar=Pe.Terminal=Pe.Alternation=Pe.RepetitionWithSeparator=Pe.Repetition=Pe.RepetitionMandatoryWithSeparator=Pe.RepetitionMandatory=Pe.Option=Pe.Alternative=Pe.Rule=Pe.NonTerminal=Pe.AbstractProduction=void 0;var cD=xs(Ut()),jQ=xs(Gt()),e_=xs(Rc()),UQ=xs(Qv()),Jn=xs(Zv()),Qn=xs(Ac());function GQ(t){return HQ(t)?t.LABEL:t.name}function HQ(t){return(0,e_.default)(t.LABEL)&&t.LABEL!==""}var Zn=function(){function t(e){this._definition=e}return Object.defineProperty(t.prototype,"definition",{get:function(){return this._definition},set:function(e){this._definition=e},enumerable:!1,configurable:!0}),t.prototype.accept=function(e){e.visit(this),(0,jQ.default)(this.definition,function(r){r.accept(e)})},t}();Pe.AbstractProduction=Zn;var lD=function(t){Oi(e,t);function e(r){var n=t.call(this,[])||this;return n.idx=1,(0,Qn.default)(n,(0,Jn.default)(r,function(i){return i!==void 0})),n}return Object.defineProperty(e.prototype,"definition",{get:function(){return this.referencedRule!==void 0?this.referencedRule.definition:[]},set:function(r){},enumerable:!1,configurable:!0}),e.prototype.accept=function(r){r.visit(this)},e}(Zn);Pe.NonTerminal=lD;var dD=function(t){Oi(e,t);function e(r){var n=t.call(this,r.definition)||this;return n.orgText="",(0,Qn.default)(n,(0,Jn.default)(r,function(i){return i!==void 0})),n}return e}(Zn);Pe.Rule=dD;var fD=function(t){Oi(e,t);function e(r){var n=t.call(this,r.definition)||this;return n.ignoreAmbiguities=!1,(0,Qn.default)(n,(0,Jn.default)(r,function(i){return i!==void 0})),n}return e}(Zn);Pe.Alternative=fD;var pD=function(t){Oi(e,t);function e(r){var n=t.call(this,r.definition)||this;return n.idx=1,(0,Qn.default)(n,(0,Jn.default)(r,function(i){return i!==void 0})),n}return e}(Zn);Pe.Option=pD;var hD=function(t){Oi(e,t);function e(r){var n=t.call(this,r.definition)||this;return n.idx=1,(0,Qn.default)(n,(0,Jn.default)(r,function(i){return i!==void 0})),n}return e}(Zn);Pe.RepetitionMandatory=hD;var mD=function(t){Oi(e,t);function e(r){var n=t.call(this,r.definition)||this;return n.idx=1,(0,Qn.default)(n,(0,Jn.default)(r,function(i){return i!==void 0})),n}return e}(Zn);Pe.RepetitionMandatoryWithSeparator=mD;var gD=function(t){Oi(e,t);function e(r){var n=t.call(this,r.definition)||this;return n.idx=1,(0,Qn.default)(n,(0,Jn.default)(r,function(i){return i!==void 0})),n}return e}(Zn);Pe.Repetition=gD;var yD=function(t){Oi(e,t);function e(r){var n=t.call(this,r.definition)||this;return n.idx=1,(0,Qn.default)(n,(0,Jn.default)(r,function(i){return i!==void 0})),n}return e}(Zn);Pe.RepetitionWithSeparator=yD;var vD=function(t){Oi(e,t);function e(r){var n=t.call(this,r.definition)||this;return n.idx=1,n.ignoreAmbiguities=!1,n.hasPredicates=!1,(0,Qn.default)(n,(0,Jn.default)(r,function(i){return i!==void 0})),n}return Object.defineProperty(e.prototype,"definition",{get:function(){return this._definition},set:function(r){this._definition=r},enumerable:!1,configurable:!0}),e}(Zn);Pe.Alternation=vD;var wf=function(){function t(e){this.idx=1,(0,Qn.default)(this,(0,Jn.default)(e,function(r){return r!==void 0}))}return t.prototype.accept=function(e){e.visit(this)},t}();Pe.Terminal=wf;function WQ(t){return(0,cD.default)(t,Pc)}Pe.serializeGrammar=WQ;function Pc(t){function e(o){return(0,cD.default)(o,Pc)}if(t instanceof lD){var r={type:"NonTerminal",name:t.nonTerminalName,idx:t.idx};return(0,e_.default)(t.label)&&(r.label=t.label),r}else{if(t instanceof fD)return{type:"Alternative",definition:e(t.definition)};if(t instanceof pD)return{type:"Option",idx:t.idx,definition:e(t.definition)};if(t instanceof hD)return{type:"RepetitionMandatory",idx:t.idx,definition:e(t.definition)};if(t instanceof mD)return{type:"RepetitionMandatoryWithSeparator",idx:t.idx,separator:Pc(new wf({terminalType:t.separator})),definition:e(t.definition)};if(t instanceof yD)return{type:"RepetitionWithSeparator",idx:t.idx,separator:Pc(new wf({terminalType:t.separator})),definition:e(t.definition)};if(t instanceof gD)return{type:"Repetition",idx:t.idx,definition:e(t.definition)};if(t instanceof vD)return{type:"Alternation",idx:t.idx,definition:e(t.definition)};if(t instanceof wf){var n={type:"Terminal",name:t.terminalType.name,label:GQ(t.terminalType),idx:t.idx};(0,e_.default)(t.label)&&(n.terminalLabel=t.label);var i=t.terminalType.PATTERN;return t.terminalType.PATTERN&&(n.pattern=(0,UQ.default)(i)?i.source:i),n}else{if(t instanceof dD)return{type:"Rule",name:t.name,orgText:t.orgText,definition:e(t.definition)};throw Error("non exhaustive match")}}}Pe.serializeProduction=Pc});var _D=f(Df=>{"use strict";Object.defineProperty(Df,"__esModule",{value:!0});Df.GAstVisitor=void 0;var ei=Of(),BQ=function(){function t(){}return t.prototype.visit=function(e){var r=e;switch(r.constructor){case ei.NonTerminal:return this.visitNonTerminal(r);case ei.Alternative:return this.visitAlternative(r);case ei.Option:return this.visitOption(r);case ei.RepetitionMandatory:return this.visitRepetitionMandatory(r);case ei.RepetitionMandatoryWithSeparator:return this.visitRepetitionMandatoryWithSeparator(r);case ei.RepetitionWithSeparator:return this.visitRepetitionWithSeparator(r);case ei.Repetition:return this.visitRepetition(r);case ei.Alternation:return this.visitAlternation(r);case ei.Terminal:return this.visitTerminal(r);case ei.Rule:return this.visitRule(r);default:throw Error("non exhaustive match")}},t.prototype.visitNonTerminal=function(e){},t.prototype.visitAlternative=function(e){},t.prototype.visitOption=function(e){},t.prototype.visitRepetition=function(e){},t.prototype.visitRepetitionMandatory=function(e){},t.prototype.visitRepetitionMandatoryWithSeparator=function(e){},t.prototype.visitRepetitionWithSeparator=function(e){},t.prototype.visitAlternation=function(e){},t.prototype.visitTerminal=function(e){},t.prototype.visitRule=function(e){},t}();Df.GAstVisitor=BQ});var RD=f((jge,TD)=>{var KQ=go();function zQ(t,e){var r;return KQ(t,function(n,i,o){return r=e(n,i,o),!r}),!!r}TD.exports=zQ});var If=f((Uge,bD)=>{var VQ=Dv(),YQ=Xr(),XQ=RD(),JQ=xe(),QQ=bc();function ZQ(t,e,r){var n=JQ(t)?VQ:XQ;return r&&QQ(t,e,r)&&(e=void 0),n(t,YQ(e,3))}bD.exports=ZQ});var PD=f((Gge,AD)=>{function eZ(t,e){for(var r=-1,n=t==null?0:t.length;++r<n;)if(!e(t[r],r,t))return!1;return!0}AD.exports=eZ});var CD=f((Hge,SD)=>{var tZ=go();function rZ(t,e){var r=!0;return tZ(t,function(n,i,o){return r=!!e(n,i,o),r}),r}SD.exports=rZ});var Sc=f((Wge,ED)=>{var nZ=PD(),iZ=CD(),oZ=Xr(),aZ=xe(),sZ=bc();function uZ(t,e,r){var n=aZ(t)?nZ:iZ;return r&&sZ(t,e,r)&&(e=void 0),n(t,oZ(e,3))}ED.exports=uZ});var t_=f((Bge,ND)=>{function cZ(t,e,r,n){for(var i=t.length,o=r+(n?1:-1);n?o--:++o<i;)if(e(t[o],o,t))return o;return-1}ND.exports=cZ});var wD=f((Kge,kD)=>{function lZ(t){return t!==t}kD.exports=lZ});var DD=f((zge,OD)=>{function dZ(t,e,r){for(var n=r-1,i=t.length;++n<i;)if(t[n]===e)return n;return-1}OD.exports=dZ});var xf=f((Vge,ID)=>{var fZ=t_(),pZ=wD(),hZ=DD();function mZ(t,e,r){return e===e?hZ(t,e,r):fZ(t,pZ,r)}ID.exports=mZ});var Di=f((Yge,xD)=>{var gZ=xf(),yZ=Pn(),vZ=Rc(),_Z=Is(),TZ=Yn(),RZ=Math.max;function bZ(t,e,r,n){t=yZ(t)?t:TZ(t),r=r&&!n?_Z(r):0;var i=t.length;return r<0&&(r=RZ(i+r,0)),vZ(t)?r<=i&&t.indexOf(e,r)>-1:!!i&&gZ(t,e,r)>-1}xD.exports=bZ});var qD=f(Jr=>{"use strict";var n_=Jr&&Jr.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(Jr,"__esModule",{value:!0});Jr.getProductionDslName=Jr.isBranchingProd=Jr.isOptionalProd=Jr.isSequenceProd=void 0;var AZ=n_(If()),PZ=n_(Sc()),SZ=n_(Di()),at=Of();function CZ(t){return t instanceof at.Alternative||t instanceof at.Option||t instanceof at.Repetition||t instanceof at.RepetitionMandatory||t instanceof at.RepetitionMandatoryWithSeparator||t instanceof at.RepetitionWithSeparator||t instanceof at.Terminal||t instanceof at.Rule}Jr.isSequenceProd=CZ;function r_(t,e){e===void 0&&(e=[]);var r=t instanceof at.Option||t instanceof at.Repetition||t instanceof at.RepetitionWithSeparator;return r?!0:t instanceof at.Alternation?(0,AZ.default)(t.definition,function(n){return r_(n,e)}):t instanceof at.NonTerminal&&(0,SZ.default)(e,t)?!1:t instanceof at.AbstractProduction?(t instanceof at.NonTerminal&&e.push(t),(0,PZ.default)(t.definition,function(n){return r_(n,e)})):!1}Jr.isOptionalProd=r_;function EZ(t){return t instanceof at.Alternation}Jr.isBranchingProd=EZ;function NZ(t){if(t instanceof at.NonTerminal)return"SUBRULE";if(t instanceof at.Option)return"OPTION";if(t instanceof at.Alternation)return"OR";if(t instanceof at.RepetitionMandatory)return"AT_LEAST_ONE";if(t instanceof at.RepetitionMandatoryWithSeparator)return"AT_LEAST_ONE_SEP";if(t instanceof at.RepetitionWithSeparator)return"MANY_SEP";if(t instanceof at.Repetition)return"MANY";if(t instanceof at.Terminal)return"CONSUME";throw Error("non exhaustive match")}Jr.getProductionDslName=NZ});var _t=f(he=>{"use strict";Object.defineProperty(he,"__esModule",{value:!0});he.isSequenceProd=he.isBranchingProd=he.isOptionalProd=he.getProductionDslName=he.GAstVisitor=he.serializeProduction=he.serializeGrammar=he.Alternative=he.Alternation=he.RepetitionWithSeparator=he.RepetitionMandatoryWithSeparator=he.RepetitionMandatory=he.Repetition=he.Option=he.NonTerminal=he.Terminal=he.Rule=void 0;var Qr=Of();Object.defineProperty(he,"Rule",{enumerable:!0,get:function(){return Qr.Rule}});Object.defineProperty(he,"Terminal",{enumerable:!0,get:function(){return Qr.Terminal}});Object.defineProperty(he,"NonTerminal",{enumerable:!0,get:function(){return Qr.NonTerminal}});Object.defineProperty(he,"Option",{enumerable:!0,get:function(){return Qr.Option}});Object.defineProperty(he,"Repetition",{enumerable:!0,get:function(){return Qr.Repetition}});Object.defineProperty(he,"RepetitionMandatory",{enumerable:!0,get:function(){return Qr.RepetitionMandatory}});Object.defineProperty(he,"RepetitionMandatoryWithSeparator",{enumerable:!0,get:function(){return Qr.RepetitionMandatoryWithSeparator}});Object.defineProperty(he,"RepetitionWithSeparator",{enumerable:!0,get:function(){return Qr.RepetitionWithSeparator}});Object.defineProperty(he,"Alternation",{enumerable:!0,get:function(){return Qr.Alternation}});Object.defineProperty(he,"Alternative",{enumerable:!0,get:function(){return Qr.Alternative}});Object.defineProperty(he,"serializeGrammar",{enumerable:!0,get:function(){return Qr.serializeGrammar}});Object.defineProperty(he,"serializeProduction",{enumerable:!0,get:function(){return Qr.serializeProduction}});var kZ=_D();Object.defineProperty(he,"GAstVisitor",{enumerable:!0,get:function(){return kZ.GAstVisitor}});var qf=qD();Object.defineProperty(he,"getProductionDslName",{enumerable:!0,get:function(){return qf.getProductionDslName}});Object.defineProperty(he,"isOptionalProd",{enumerable:!0,get:function(){return qf.isOptionalProd}});Object.defineProperty(he,"isBranchingProd",{enumerable:!0,get:function(){return qf.isBranchingProd}});Object.defineProperty(he,"isSequenceProd",{enumerable:!0,get:function(){return qf.isSequenceProd}})});var Lf=f(qs=>{"use strict";var $D=qs&&qs.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(qs,"__esModule",{value:!0});qs.RestWalker=void 0;var wZ=$D(Nf()),LD=$D(Gt()),Rr=_t(),OZ=function(){function t(){}return t.prototype.walk=function(e,r){var n=this;r===void 0&&(r=[]),(0,LD.default)(e.definition,function(i,o){var a=(0,wZ.default)(e.definition,o+1);if(i instanceof Rr.NonTerminal)n.walkProdRef(i,a,r);else if(i instanceof Rr.Terminal)n.walkTerminal(i,a,r);else if(i instanceof Rr.Alternative)n.walkFlat(i,a,r);else if(i instanceof Rr.Option)n.walkOption(i,a,r);else if(i instanceof Rr.RepetitionMandatory)n.walkAtLeastOne(i,a,r);else if(i instanceof Rr.RepetitionMandatoryWithSeparator)n.walkAtLeastOneSep(i,a,r);else if(i instanceof Rr.RepetitionWithSeparator)n.walkManySep(i,a,r);else if(i instanceof Rr.Repetition)n.walkMany(i,a,r);else if(i instanceof Rr.Alternation)n.walkOr(i,a,r);else throw Error("non exhaustive match")})},t.prototype.walkTerminal=function(e,r,n){},t.prototype.walkProdRef=function(e,r,n){},t.prototype.walkFlat=function(e,r,n){var i=r.concat(n);this.walk(e,i)},t.prototype.walkOption=function(e,r,n){var i=r.concat(n);this.walk(e,i)},t.prototype.walkAtLeastOne=function(e,r,n){var i=[new Rr.Option({definition:e.definition})].concat(r,n);this.walk(e,i)},t.prototype.walkAtLeastOneSep=function(e,r,n){var i=MD(e,r,n);this.walk(e,i)},t.prototype.walkMany=function(e,r,n){var i=[new Rr.Option({definition:e.definition})].concat(r,n);this.walk(e,i)},t.prototype.walkManySep=function(e,r,n){var i=MD(e,r,n);this.walk(e,i)},t.prototype.walkOr=function(e,r,n){var i=this,o=r.concat(n);(0,LD.default)(e.definition,function(a){var s=new Rr.Alternative({definition:[a]});i.walk(s,o)})},t}();qs.RestWalker=OZ;function MD(t,e,r){var n=[new Rr.Option({definition:[new Rr.Terminal({terminalType:t.separator})].concat(t.definition)})],i=n.concat(e,r);return i}});var GD=f((Zge,UD)=>{var FD=ra(),DZ=ac(),IZ=xe(),jD=FD?FD.isConcatSpreadable:void 0;function xZ(t){return IZ(t)||DZ(t)||!!(jD&&t&&t[jD])}UD.exports=xZ});var Mf=f((eye,WD)=>{var qZ=yf(),LZ=GD();function HD(t,e,r,n,i){var o=-1,a=t.length;for(r||(r=LZ),i||(i=[]);++o<a;){var s=t[o];e>0&&r(s)?e>1?HD(s,e-1,r,n,i):qZ(i,s):n||(i[i.length]=s)}return i}WD.exports=HD});var Sn=f((tye,BD)=>{var MZ=Mf();function $Z(t){var e=t==null?0:t.length;return e?MZ(t,1):[]}BD.exports=$Z});var i_=f((rye,KD)=>{var FZ=xf();function jZ(t,e){var r=t==null?0:t.length;return!!r&&FZ(t,e,0)>-1}KD.exports=jZ});var o_=f((nye,zD)=>{function UZ(t,e,r){for(var n=-1,i=t==null?0:t.length;++n<i;)if(r(e,t[n]))return!0;return!1}zD.exports=UZ});var $f=f((iye,VD)=>{function GZ(){}VD.exports=GZ});var XD=f((oye,YD)=>{var a_=Sv(),HZ=$f(),WZ=gf(),BZ=1/0,KZ=a_&&1/WZ(new a_([,-0]))[1]==BZ?function(t){return new a_(t)}:HZ;YD.exports=KZ});var s_=f((aye,JD)=>{var zZ=hf(),VZ=i_(),YZ=o_(),XZ=mf(),JZ=XD(),QZ=gf(),ZZ=200;function eee(t,e,r){var n=-1,i=VZ,o=t.length,a=!0,s=[],u=s;if(r)a=!1,i=YZ;else if(o>=ZZ){var c=e?null:JZ(t);if(c)return QZ(c);a=!1,i=XZ,u=new zZ}else u=e?[]:s;e:for(;++n<o;){var l=t[n],d=e?e(l):l;if(l=r||l!==0?l:0,a&&d===d){for(var h=u.length;h--;)if(u[h]===d)continue e;e&&u.push(d),s.push(l)}else i(u,d,r)||(u!==s&&u.push(d),s.push(l))}return s}JD.exports=eee});var Ff=f((sye,QD)=>{var tee=s_();function ree(t){return t&&t.length?tee(t):[]}QD.exports=ree});var l_=f(Zr=>{"use strict";var c_=Zr&&Zr.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(Zr,"__esModule",{value:!0});Zr.firstForTerminal=Zr.firstForBranching=Zr.firstForSequence=Zr.first=void 0;var nee=c_(Sn()),eI=c_(Ff()),iee=c_(Ut()),ZD=_t(),u_=_t();function jf(t){if(t instanceof ZD.NonTerminal)return jf(t.referencedRule);if(t instanceof ZD.Terminal)return nI(t);if((0,u_.isSequenceProd)(t))return tI(t);if((0,u_.isBranchingProd)(t))return rI(t);throw Error("non exhaustive match")}Zr.first=jf;function tI(t){for(var e=[],r=t.definition,n=0,i=r.length>n,o,a=!0;i&&a;)o=r[n],a=(0,u_.isOptionalProd)(o),e=e.concat(jf(o)),n=n+1,i=r.length>n;return(0,eI.default)(e)}Zr.firstForSequence=tI;function rI(t){var e=(0,iee.default)(t.definition,function(r){return jf(r)});return(0,eI.default)((0,nee.default)(e))}Zr.firstForBranching=rI;function nI(t){return[t.terminalType]}Zr.firstForTerminal=nI});var d_=f(Uf=>{"use strict";Object.defineProperty(Uf,"__esModule",{value:!0});Uf.IN=void 0;Uf.IN="_~IN~_"});var uI=f(br=>{"use strict";var oee=br&&br.__extends||function(){var t=function(e,r){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(n[o]=i[o])},t(e,r)};return function(e,r){if(typeof r!="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");t(e,r);function n(){this.constructor=e}e.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),iI=br&&br.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(br,"__esModule",{value:!0});br.buildInProdFollowPrefix=br.buildBetweenProdsFollowPrefix=br.computeAllProdsFollows=br.ResyncFollowsWalker=void 0;var aee=Lf(),see=l_(),uee=iI(Gt()),cee=iI(Ac()),oI=d_(),lee=_t(),aI=function(t){oee(e,t);function e(r){var n=t.call(this)||this;return n.topProd=r,n.follows={},n}return e.prototype.startWalking=function(){return this.walk(this.topProd),this.follows},e.prototype.walkTerminal=function(r,n,i){},e.prototype.walkProdRef=function(r,n,i){var o=sI(r.referencedRule,r.idx)+this.topProd.name,a=n.concat(i),s=new lee.Alternative({definition:a}),u=(0,see.first)(s);this.follows[o]=u},e}(aee.RestWalker);br.ResyncFollowsWalker=aI;function dee(t){var e={};return(0,uee.default)(t,function(r){var n=new aI(r).startWalking();(0,cee.default)(e,n)}),e}br.computeAllProdsFollows=dee;function sI(t,e){return t.name+e+oI.IN}br.buildBetweenProdsFollowPrefix=sI;function fee(t){var e=t.terminalType.name;return e+t.idx+oI.IN}br.buildInProdFollowPrefix=fee});var oa=f((dye,cI)=>{function pee(t){return t===void 0}cI.exports=pee});var dI=f((fye,lI)=>{function hee(t){return t&&t.length?t[0]:void 0}lI.exports=hee});var Ls=f((pye,fI)=>{fI.exports=dI()});var Cc=f((hye,pI)=>{function mee(t){for(var e=-1,r=t==null?0:t.length,n=0,i=[];++e<r;){var o=t[e];o&&(i[n++]=o)}return i}pI.exports=mee});var f_=f((mye,hI)=>{var gee=go();function yee(t,e){var r=[];return gee(t,function(n,i,o){e(n,i,o)&&r.push(n)}),r}hI.exports=yee});var gI=f((gye,mI)=>{var vee="Expected a function";function _ee(t){if(typeof t!="function")throw new TypeError(vee);return function(){var e=arguments;switch(e.length){case 0:return!t.call(this);case 1:return!t.call(this,e[0]);case 2:return!t.call(this,e[0],e[1]);case 3:return!t.call(this,e[0],e[1],e[2])}return!t.apply(this,e)}}mI.exports=_ee});var Gf=f((yye,yI)=>{var Tee=vf(),Ree=f_(),bee=Xr(),Aee=xe(),Pee=gI();function See(t,e){var r=Aee(t)?Tee:Ree;return r(t,Pee(bee(e,3)))}yI.exports=See});var _I=f((vye,vI)=>{var Cee=hf(),Eee=i_(),Nee=o_(),kee=Rs(),wee=_s(),Oee=mf(),Dee=200;function Iee(t,e,r,n){var i=-1,o=Eee,a=!0,s=t.length,u=[],c=e.length;if(!s)return u;r&&(e=kee(e,wee(r))),n?(o=Nee,a=!1):e.length>=Dee&&(o=Oee,a=!1,e=new Cee(e));e:for(;++i<s;){var l=t[i],d=r==null?l:r(l);if(l=n||l!==0?l:0,a&&d===d){for(var h=c;h--;)if(e[h]===d)continue e;u.push(l)}else o(e,d,n)||u.push(l)}return u}vI.exports=Iee});var RI=f((_ye,TI)=>{var xee=Pn(),qee=An();function Lee(t){return qee(t)&&xee(t)}TI.exports=Lee});var Hf=f((Tye,AI)=>{var Mee=_I(),$ee=Mf(),Fee=kf(),bI=RI(),jee=Fee(function(t,e){return bI(t)?Mee(t,$ee(e,1,bI,!0)):[]});AI.exports=jee});var SI=f((Rye,PI)=>{var Uee=xf(),Gee=Is(),Hee=Math.max;function Wee(t,e,r){var n=t==null?0:t.length;if(!n)return-1;var i=r==null?0:Gee(r);return i<0&&(i=Hee(n+i,0)),Uee(t,e,i)}PI.exports=Wee});var EI=f((bye,CI)=>{var Bee=Xr(),Kee=Pn(),zee=Dr();function Vee(t){return function(e,r,n){var i=Object(e);if(!Kee(e)){var o=Bee(r,3);e=zee(e),r=function(s){return o(i[s],s,i)}}var a=t(e,r,n);return a>-1?i[o?e[a]:a]:void 0}}CI.exports=Vee});var kI=f((Aye,NI)=>{var Yee=t_(),Xee=Xr(),Jee=Is(),Qee=Math.max;function Zee(t,e,r){var n=t==null?0:t.length;if(!n)return-1;var i=r==null?0:Jee(r);return i<0&&(i=Qee(n+i,0)),Yee(t,Xee(e,3),i)}NI.exports=Zee});var Wf=f((Pye,wI)=>{var ete=EI(),tte=kI(),rte=ete(tte);wI.exports=rte});var Ec=f((Sye,OI)=>{var nte=vf(),ite=f_(),ote=Xr(),ate=xe();function ste(t,e){var r=ate(t)?nte:ite;return r(t,ote(e,3))}OI.exports=ste});var p_=f((Cye,II)=>{var ute=kf(),cte=bs(),lte=bc(),dte=_c(),DI=Object.prototype,fte=DI.hasOwnProperty,pte=ute(function(t,e){t=Object(t);var r=-1,n=e.length,i=n>2?e[2]:void 0;for(i&&lte(e[0],e[1],i)&&(n=1);++r<n;)for(var o=e[r],a=dte(o),s=-1,u=a.length;++s<u;){var c=a[s],l=t[c];(l===void 0||cte(l,DI[c])&&!fte.call(t,c))&&(t[c]=o[c])}return t});II.exports=pte});var qI=f((Eye,xI)=>{function hte(t,e,r,n){var i=-1,o=t==null?0:t.length;for(n&&o&&(r=t[++i]);++i<o;)r=e(r,t[i],i,t);return r}xI.exports=hte});var MI=f((Nye,LI)=>{function mte(t,e,r,n,i){return i(t,function(o,a,s){r=n?(n=!1,o):e(r,o,a,s)}),r}LI.exports=mte});var Ii=f((kye,$I)=>{var gte=qI(),yte=go(),vte=Xr(),_te=MI(),Tte=xe();function Rte(t,e,r){var n=Tte(t)?gte:_te,i=arguments.length<3;return n(t,vte(e,4),r,i,yte)}$I.exports=Rte});var Kf=f(Ms=>{"use strict";Object.defineProperty(Ms,"__esModule",{value:!0});Ms.clearRegExpParserCache=Ms.getRegExpAst=void 0;var bte=Ju(),Bf={},Ate=new bte.RegExpParser;function Pte(t){var e=t.toString();if(Bf.hasOwnProperty(e))return Bf[e];var r=Ate.pattern(e);return Bf[e]=r,r}Ms.getRegExpAst=Pte;function Ste(){Bf={}}Ms.clearRegExpParserCache=Ste});var WI=f(nr=>{"use strict";var Cte=nr&&nr.__extends||function(){var t=function(e,r){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(n[o]=i[o])},t(e,r)};return function(e,r){if(typeof r!="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");t(e,r);function n(){this.constructor=e}e.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),$s=nr&&nr.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(nr,"__esModule",{value:!0});nr.canMatchCharCode=nr.firstCharOptimizedIndices=nr.getOptimizedStartCodesIndices=nr.failedOptimizationPrefixMsg=void 0;var UI=Ju(),Ete=$s(xe()),Nte=$s(Sc()),kte=$s(Gt()),h_=$s(Wf()),wte=$s(Yn()),g_=$s(Di()),FI=Ds(),GI=Kf(),xi=y_(),HI="Complement Sets are not supported for first char optimization";nr.failedOptimizationPrefixMsg=`Unable to use "first char" lexer optimizations:
`;function Ote(t,e){e===void 0&&(e=!1);try{var r=(0,GI.getRegExpAst)(t),n=Vf(r.value,{},r.flags.ignoreCase);return n}catch(o){if(o.message===HI)e&&(0,FI.PRINT_WARNING)("".concat(nr.failedOptimizationPrefixMsg)+"	Unable to optimize: < ".concat(t.toString(),` >
`)+`	Complement Sets cannot be automatically optimized.
	This will disable the lexer's first char optimizations.
	See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#COMPLEMENT for details.`);else{var i="";e&&(i=`
	This will disable the lexer's first char optimizations.
	See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#REGEXP_PARSING for details.`),(0,FI.PRINT_ERROR)("".concat(nr.failedOptimizationPrefixMsg,`
`)+"	Failed parsing: < ".concat(t.toString(),` >
`)+"	Using the regexp-to-ast library version: ".concat(UI.VERSION,`
`)+"	Please open an issue at: https://github.com/bd82/regexp-to-ast/issues"+i)}}return[]}nr.getOptimizedStartCodesIndices=Ote;function Vf(t,e,r){switch(t.type){case"Disjunction":for(var n=0;n<t.value.length;n++)Vf(t.value[n],e,r);break;case"Alternative":for(var i=t.value,n=0;n<i.length;n++){var o=i[n];switch(o.type){case"EndAnchor":case"GroupBackReference":case"Lookahead":case"NegativeLookahead":case"StartAnchor":case"WordBoundary":case"NonWordBoundary":continue}var a=o;switch(a.type){case"Character":zf(a.value,e,r);break;case"Set":if(a.complement===!0)throw Error(HI);(0,kte.default)(a.value,function(c){if(typeof c=="number")zf(c,e,r);else{var l=c;if(r===!0)for(var d=l.from;d<=l.to;d++)zf(d,e,r);else{for(var d=l.from;d<=l.to&&d<xi.minOptimizationVal;d++)zf(d,e,r);if(l.to>=xi.minOptimizationVal)for(var h=l.from>=xi.minOptimizationVal?l.from:xi.minOptimizationVal,v=l.to,g=(0,xi.charCodeToOptimizedIndex)(h),R=(0,xi.charCodeToOptimizedIndex)(v),E=g;E<=R;E++)e[E]=E}}});break;case"Group":Vf(a.value,e,r);break;default:throw Error("Non Exhaustive Match")}var s=a.quantifier!==void 0&&a.quantifier.atLeast===0;if(a.type==="Group"&&m_(a)===!1||a.type!=="Group"&&s===!1)break}break;default:throw Error("non exhaustive match!")}return(0,wte.default)(e)}nr.firstCharOptimizedIndices=Vf;function zf(t,e,r){var n=(0,xi.charCodeToOptimizedIndex)(t);e[n]=n,r===!0&&Dte(t,e)}function Dte(t,e){var r=String.fromCharCode(t),n=r.toUpperCase();if(n!==r){var i=(0,xi.charCodeToOptimizedIndex)(n.charCodeAt(0));e[i]=i}else{var o=r.toLowerCase();if(o!==r){var i=(0,xi.charCodeToOptimizedIndex)(o.charCodeAt(0));e[i]=i}}}function jI(t,e){return(0,h_.default)(t.value,function(r){if(typeof r=="number")return(0,g_.default)(e,r);var n=r;return(0,h_.default)(e,function(i){return n.from<=i&&i<=n.to})!==void 0})}function m_(t){var e=t.quantifier;return e&&e.atLeast===0?!0:t.value?(0,Ete.default)(t.value)?(0,Nte.default)(t.value,m_):m_(t.value):!1}var Ite=function(t){Cte(e,t);function e(r){var n=t.call(this)||this;return n.targetCharCodes=r,n.found=!1,n}return e.prototype.visitChildren=function(r){if(this.found!==!0){switch(r.type){case"Lookahead":this.visitLookahead(r);return;case"NegativeLookahead":this.visitNegativeLookahead(r);return}t.prototype.visitChildren.call(this,r)}},e.prototype.visitCharacter=function(r){(0,g_.default)(this.targetCharCodes,r.value)&&(this.found=!0)},e.prototype.visitSet=function(r){r.complement?jI(r,this.targetCharCodes)===void 0&&(this.found=!0):jI(r,this.targetCharCodes)!==void 0&&(this.found=!0)},e}(UI.BaseRegExpVisitor);function xte(t,e){if(e instanceof RegExp){var r=(0,GI.getRegExpAst)(e),n=new Ite(t);return n.visit(r),n.found}else return(0,h_.default)(e,function(i){return(0,g_.default)(t,i.charCodeAt(0))})!==void 0}nr.canMatchCharCode=xte});var y_=f(H=>{"use strict";var zI=H&&H.__extends||function(){var t=function(e,r){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(n[o]=i[o])},t(e,r)};return function(e,r){if(typeof r!="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");t(e,r);function n(){this.constructor=e}e.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),mt=H&&H.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(H,"__esModule",{value:!0});H.charCodeToOptimizedIndex=H.minOptimizationVal=H.buildLineBreakIssueMessage=H.LineTerminatorOptimizedTester=H.isShortPattern=H.isCustomPattern=H.cloneEmptyGroups=H.performWarningRuntimeChecks=H.performRuntimeChecks=H.addStickyFlag=H.addStartOfInput=H.findUnreachablePatterns=H.findModesThatDoNotExist=H.findInvalidGroupType=H.findDuplicatePatterns=H.findUnsupportedFlags=H.findStartOfInputAnchor=H.findEmptyMatchRegExps=H.findEndOfInputAnchor=H.findInvalidPatterns=H.findMissingPatterns=H.validatePatterns=H.analyzeTokenTypes=H.enableSticky=H.disableSticky=H.SUPPORT_STICKY=H.MODES=H.DEFAULT_MODE=void 0;var VI=Ju(),$e=Nc(),qte=mt(Ls()),YI=mt(Or()),XI=mt(Cc()),Xf=mt(xe()),Lte=mt(Yn()),Mte=mt(Sn()),JI=mt(Gf()),QI=mt(Hf()),BI=mt(SI()),st=mt(Ut()),qi=mt(Gt()),Li=mt(Rc()),Qf=mt(ms()),__=mt(oa()),$te=mt(Wf()),ir=mt(Ir()),Fte=mt(Dr()),yo=mt(Qv()),ti=mt(Ec()),jte=mt(p_()),Jf=mt(Ii()),Zf=mt(Di()),KI=Ds(),Fs=WI(),ZI=Kf(),aa="PATTERN";H.DEFAULT_MODE="defaultMode";H.MODES="modes";H.SUPPORT_STICKY=typeof new RegExp("(?:)").sticky=="boolean";function Ute(){H.SUPPORT_STICKY=!1}H.disableSticky=Ute;function Gte(){H.SUPPORT_STICKY=!0}H.enableSticky=Gte;function Hte(t,e){e=(0,jte.default)(e,{useSticky:H.SUPPORT_STICKY,debug:!1,safeMode:!1,positionTracking:"full",lineTerminatorCharacters:["\r",`
`],tracer:function(A,b){return b()}});var r=e.tracer;r("initCharCodeToOptimizedIndexMap",function(){Zte()});var n;r("Reject Lexer.NA",function(){n=(0,JI.default)(t,function(A){return A[aa]===$e.Lexer.NA})});var i=!1,o;r("Transform Patterns",function(){i=!1,o=(0,st.default)(n,function(A){var b=A[aa];if((0,yo.default)(b)){var O=b.source;return O.length===1&&O!=="^"&&O!=="$"&&O!=="."&&!b.ignoreCase?O:O.length===2&&O[0]==="\\"&&!(0,Zf.default)(["d","D","s","S","t","r","n","t","0","c","b","B","f","v","w","W"],O[1])?O[1]:e.useSticky?R_(b):T_(b)}else{if((0,Qf.default)(b))return i=!0,{exec:b};if(typeof b=="object")return i=!0,b;if(typeof b=="string"){if(b.length===1)return b;var $=b.replace(/[\\^$.*+?()[\]{}|]/g,"\\$&"),B=new RegExp($);return e.useSticky?R_(B):T_(B)}else throw Error("non exhaustive match")}})});var a,s,u,c,l;r("misc mapping",function(){a=(0,st.default)(n,function(A){return A.tokenTypeIdx}),s=(0,st.default)(n,function(A){var b=A.GROUP;if(b!==$e.Lexer.SKIPPED){if((0,Li.default)(b))return b;if((0,__.default)(b))return!1;throw Error("non exhaustive match")}}),u=(0,st.default)(n,function(A){var b=A.LONGER_ALT;if(b){var O=(0,Xf.default)(b)?(0,st.default)(b,function($){return(0,BI.default)(n,$)}):[(0,BI.default)(n,b)];return O}}),c=(0,st.default)(n,function(A){return A.PUSH_MODE}),l=(0,st.default)(n,function(A){return(0,ir.default)(A,"POP_MODE")})});var d;r("Line Terminator Handling",function(){var A=px(e.lineTerminatorCharacters);d=(0,st.default)(n,function(b){return!1}),e.positionTracking!=="onlyOffset"&&(d=(0,st.default)(n,function(b){return(0,ir.default)(b,"LINE_BREAKS")?!!b.LINE_BREAKS:dx(b,A)===!1&&(0,Fs.canMatchCharCode)(A,b.PATTERN)}))});var h,v,g,R;r("Misc Mapping #2",function(){h=(0,st.default)(n,A_),v=(0,st.default)(o,lx),g=(0,Jf.default)(n,function(A,b){var O=b.GROUP;return(0,Li.default)(O)&&O!==$e.Lexer.SKIPPED&&(A[O]=[]),A},{}),R=(0,st.default)(o,function(A,b){return{pattern:o[b],longerAlt:u[b],canLineTerminator:d[b],isCustom:h[b],short:v[b],group:s[b],push:c[b],pop:l[b],tokenTypeIdx:a[b],tokenType:n[b]}})});var E=!0,N=[];return e.safeMode||r("First Char Optimization",function(){N=(0,Jf.default)(n,function(A,b,O){if(typeof b.PATTERN=="string"){var $=b.PATTERN.charCodeAt(0),B=b_($);v_(A,B,R[O])}else if((0,Xf.default)(b.START_CHARS_HINT)){var ee;(0,qi.default)(b.START_CHARS_HINT,function(Ne){var Je=typeof Ne=="string"?Ne.charCodeAt(0):Ne,K=b_(Je);ee!==K&&(ee=K,v_(A,K,R[O]))})}else if((0,yo.default)(b.PATTERN))if(b.PATTERN.unicode)E=!1,e.ensureOptimizations&&(0,KI.PRINT_ERROR)("".concat(Fs.failedOptimizationPrefixMsg)+"	Unable to analyze < ".concat(b.PATTERN.toString(),` > pattern.
`)+`	The regexp unicode flag is not currently supported by the regexp-to-ast library.
	This will disable the lexer's first char optimizations.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNICODE_OPTIMIZE`);else{var Fe=(0,Fs.getOptimizedStartCodesIndices)(b.PATTERN,e.ensureOptimizations);(0,YI.default)(Fe)&&(E=!1),(0,qi.default)(Fe,function(Ne){v_(A,Ne,R[O])})}else e.ensureOptimizations&&(0,KI.PRINT_ERROR)("".concat(Fs.failedOptimizationPrefixMsg)+"	TokenType: <".concat(b.name,`> is using a custom token pattern without providing <start_chars_hint> parameter.
`)+`	This will disable the lexer's first char optimizations.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_OPTIMIZE`),E=!1;return A},[])}),{emptyGroups:g,patternIdxToConfig:R,charCodeToPatternIdxToConfig:N,hasCustom:i,canBeOptimized:E}}H.analyzeTokenTypes=Hte;function Wte(t,e){var r=[],n=ex(t);r=r.concat(n.errors);var i=tx(n.valid),o=i.valid;return r=r.concat(i.errors),r=r.concat(Bte(o)),r=r.concat(sx(o)),r=r.concat(ux(o,e)),r=r.concat(cx(o)),r}H.validatePatterns=Wte;function Bte(t){var e=[],r=(0,ti.default)(t,function(n){return(0,yo.default)(n[aa])});return e=e.concat(rx(r)),e=e.concat(ix(r)),e=e.concat(ox(r)),e=e.concat(ax(r)),e=e.concat(nx(r)),e}function ex(t){var e=(0,ti.default)(t,function(i){return!(0,ir.default)(i,aa)}),r=(0,st.default)(e,function(i){return{message:"Token Type: ->"+i.name+"<- missing static 'PATTERN' property",type:$e.LexerDefinitionErrorType.MISSING_PATTERN,tokenTypes:[i]}}),n=(0,QI.default)(t,e);return{errors:r,valid:n}}H.findMissingPatterns=ex;function tx(t){var e=(0,ti.default)(t,function(i){var o=i[aa];return!(0,yo.default)(o)&&!(0,Qf.default)(o)&&!(0,ir.default)(o,"exec")&&!(0,Li.default)(o)}),r=(0,st.default)(e,function(i){return{message:"Token Type: ->"+i.name+"<- static 'PATTERN' can only be a RegExp, a Function matching the {CustomPatternMatcherFunc} type or an Object matching the {ICustomPattern} interface.",type:$e.LexerDefinitionErrorType.INVALID_PATTERN,tokenTypes:[i]}}),n=(0,QI.default)(t,e);return{errors:r,valid:n}}H.findInvalidPatterns=tx;var Kte=/[^\\][$]/;function rx(t){var e=function(i){zI(o,i);function o(){var a=i!==null&&i.apply(this,arguments)||this;return a.found=!1,a}return o.prototype.visitEndAnchor=function(a){this.found=!0},o}(VI.BaseRegExpVisitor),r=(0,ti.default)(t,function(i){var o=i.PATTERN;try{var a=(0,ZI.getRegExpAst)(o),s=new e;return s.visit(a),s.found}catch{return Kte.test(o.source)}}),n=(0,st.default)(r,function(i){return{message:`Unexpected RegExp Anchor Error:
	Token Type: ->`+i.name+`<- static 'PATTERN' cannot contain end of input anchor '$'
	See chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS	for details.`,type:$e.LexerDefinitionErrorType.EOI_ANCHOR_FOUND,tokenTypes:[i]}});return n}H.findEndOfInputAnchor=rx;function nx(t){var e=(0,ti.default)(t,function(n){var i=n.PATTERN;return i.test("")}),r=(0,st.default)(e,function(n){return{message:"Token Type: ->"+n.name+"<- static 'PATTERN' must not match an empty string",type:$e.LexerDefinitionErrorType.EMPTY_MATCH_PATTERN,tokenTypes:[n]}});return r}H.findEmptyMatchRegExps=nx;var zte=/[^\\[][\^]|^\^/;function ix(t){var e=function(i){zI(o,i);function o(){var a=i!==null&&i.apply(this,arguments)||this;return a.found=!1,a}return o.prototype.visitStartAnchor=function(a){this.found=!0},o}(VI.BaseRegExpVisitor),r=(0,ti.default)(t,function(i){var o=i.PATTERN;try{var a=(0,ZI.getRegExpAst)(o),s=new e;return s.visit(a),s.found}catch{return zte.test(o.source)}}),n=(0,st.default)(r,function(i){return{message:`Unexpected RegExp Anchor Error:
	Token Type: ->`+i.name+`<- static 'PATTERN' cannot contain start of input anchor '^'
	See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS	for details.`,type:$e.LexerDefinitionErrorType.SOI_ANCHOR_FOUND,tokenTypes:[i]}});return n}H.findStartOfInputAnchor=ix;function ox(t){var e=(0,ti.default)(t,function(n){var i=n[aa];return i instanceof RegExp&&(i.multiline||i.global)}),r=(0,st.default)(e,function(n){return{message:"Token Type: ->"+n.name+"<- static 'PATTERN' may NOT contain global('g') or multiline('m')",type:$e.LexerDefinitionErrorType.UNSUPPORTED_FLAGS_FOUND,tokenTypes:[n]}});return r}H.findUnsupportedFlags=ox;function ax(t){var e=[],r=(0,st.default)(t,function(o){return(0,Jf.default)(t,function(a,s){return o.PATTERN.source===s.PATTERN.source&&!(0,Zf.default)(e,s)&&s.PATTERN!==$e.Lexer.NA&&(e.push(s),a.push(s)),a},[])});r=(0,XI.default)(r);var n=(0,ti.default)(r,function(o){return o.length>1}),i=(0,st.default)(n,function(o){var a=(0,st.default)(o,function(u){return u.name}),s=(0,qte.default)(o).PATTERN;return{message:"The same RegExp pattern ->".concat(s,"<-")+"has been used in all of the following Token Types: ".concat(a.join(", ")," <-"),type:$e.LexerDefinitionErrorType.DUPLICATE_PATTERNS_FOUND,tokenTypes:o}});return i}H.findDuplicatePatterns=ax;function sx(t){var e=(0,ti.default)(t,function(n){if(!(0,ir.default)(n,"GROUP"))return!1;var i=n.GROUP;return i!==$e.Lexer.SKIPPED&&i!==$e.Lexer.NA&&!(0,Li.default)(i)}),r=(0,st.default)(e,function(n){return{message:"Token Type: ->"+n.name+"<- static 'GROUP' can only be Lexer.SKIPPED/Lexer.NA/A String",type:$e.LexerDefinitionErrorType.INVALID_GROUP_TYPE_FOUND,tokenTypes:[n]}});return r}H.findInvalidGroupType=sx;function ux(t,e){var r=(0,ti.default)(t,function(i){return i.PUSH_MODE!==void 0&&!(0,Zf.default)(e,i.PUSH_MODE)}),n=(0,st.default)(r,function(i){var o="Token Type: ->".concat(i.name,"<- static 'PUSH_MODE' value cannot refer to a Lexer Mode ->").concat(i.PUSH_MODE,"<-")+"which does not exist";return{message:o,type:$e.LexerDefinitionErrorType.PUSH_MODE_DOES_NOT_EXIST,tokenTypes:[i]}});return n}H.findModesThatDoNotExist=ux;function cx(t){var e=[],r=(0,Jf.default)(t,function(n,i,o){var a=i.PATTERN;return a===$e.Lexer.NA||((0,Li.default)(a)?n.push({str:a,idx:o,tokenType:i}):(0,yo.default)(a)&&Yte(a)&&n.push({str:a.source,idx:o,tokenType:i})),n},[]);return(0,qi.default)(t,function(n,i){(0,qi.default)(r,function(o){var a=o.str,s=o.idx,u=o.tokenType;if(i<s&&Vte(a,n.PATTERN)){var c="Token: ->".concat(u.name,`<- can never be matched.
`)+"Because it appears AFTER the Token Type ->".concat(n.name,"<-")+`in the lexer's definition.
See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNREACHABLE`;e.push({message:c,type:$e.LexerDefinitionErrorType.UNREACHABLE_PATTERN,tokenTypes:[n,u]})}})}),e}H.findUnreachablePatterns=cx;function Vte(t,e){if((0,yo.default)(e)){var r=e.exec(t);return r!==null&&r.index===0}else{if((0,Qf.default)(e))return e(t,0,[],{});if((0,ir.default)(e,"exec"))return e.exec(t,0,[],{});if(typeof e=="string")return e===t;throw Error("non exhaustive match")}}function Yte(t){var e=[".","\\","[","]","|","^","$","(",")","?","*","+","{"];return(0,$te.default)(e,function(r){return t.source.indexOf(r)!==-1})===void 0}function T_(t){var e=t.ignoreCase?"i":"";return new RegExp("^(?:".concat(t.source,")"),e)}H.addStartOfInput=T_;function R_(t){var e=t.ignoreCase?"iy":"y";return new RegExp("".concat(t.source),e)}H.addStickyFlag=R_;function Xte(t,e,r){var n=[];return(0,ir.default)(t,H.DEFAULT_MODE)||n.push({message:"A MultiMode Lexer cannot be initialized without a <"+H.DEFAULT_MODE+`> property in its definition
`,type:$e.LexerDefinitionErrorType.MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE}),(0,ir.default)(t,H.MODES)||n.push({message:"A MultiMode Lexer cannot be initialized without a <"+H.MODES+`> property in its definition
`,type:$e.LexerDefinitionErrorType.MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY}),(0,ir.default)(t,H.MODES)&&(0,ir.default)(t,H.DEFAULT_MODE)&&!(0,ir.default)(t.modes,t.defaultMode)&&n.push({message:"A MultiMode Lexer cannot be initialized with a ".concat(H.DEFAULT_MODE,": <").concat(t.defaultMode,">")+`which does not exist
`,type:$e.LexerDefinitionErrorType.MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST}),(0,ir.default)(t,H.MODES)&&(0,qi.default)(t.modes,function(i,o){(0,qi.default)(i,function(a,s){if((0,__.default)(a))n.push({message:"A Lexer cannot be initialized using an undefined Token Type. Mode:"+"<".concat(o,"> at index: <").concat(s,`>
`),type:$e.LexerDefinitionErrorType.LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED});else if((0,ir.default)(a,"LONGER_ALT")){var u=(0,Xf.default)(a.LONGER_ALT)?a.LONGER_ALT:[a.LONGER_ALT];(0,qi.default)(u,function(c){!(0,__.default)(c)&&!(0,Zf.default)(i,c)&&n.push({message:"A MultiMode Lexer cannot be initialized with a longer_alt <".concat(c.name,"> on token <").concat(a.name,"> outside of mode <").concat(o,`>
`),type:$e.LexerDefinitionErrorType.MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE})})}})}),n}H.performRuntimeChecks=Xte;function Jte(t,e,r){var n=[],i=!1,o=(0,XI.default)((0,Mte.default)((0,Lte.default)(t.modes))),a=(0,JI.default)(o,function(u){return u[aa]===$e.Lexer.NA}),s=px(r);return e&&(0,qi.default)(a,function(u){var c=dx(u,s);if(c!==!1){var l=fx(u,c),d={message:l,type:c.issue,tokenType:u};n.push(d)}else(0,ir.default)(u,"LINE_BREAKS")?u.LINE_BREAKS===!0&&(i=!0):(0,Fs.canMatchCharCode)(s,u.PATTERN)&&(i=!0)}),e&&!i&&n.push({message:`Warning: No LINE_BREAKS Found.
	This Lexer has been defined to track line and column information,
	But none of the Token Types can be identified as matching a line terminator.
	See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#LINE_BREAKS 
	for details.`,type:$e.LexerDefinitionErrorType.NO_LINE_BREAKS_FLAGS}),n}H.performWarningRuntimeChecks=Jte;function Qte(t){var e={},r=(0,Fte.default)(t);return(0,qi.default)(r,function(n){var i=t[n];if((0,Xf.default)(i))e[n]=[];else throw Error("non exhaustive match")}),e}H.cloneEmptyGroups=Qte;function A_(t){var e=t.PATTERN;if((0,yo.default)(e))return!1;if((0,Qf.default)(e))return!0;if((0,ir.default)(e,"exec"))return!0;if((0,Li.default)(e))return!1;throw Error("non exhaustive match")}H.isCustomPattern=A_;function lx(t){return(0,Li.default)(t)&&t.length===1?t.charCodeAt(0):!1}H.isShortPattern=lx;H.LineTerminatorOptimizedTester={test:function(t){for(var e=t.length,r=this.lastIndex;r<e;r++){var n=t.charCodeAt(r);if(n===10)return this.lastIndex=r+1,!0;if(n===13)return t.charCodeAt(r+1)===10?this.lastIndex=r+2:this.lastIndex=r+1,!0}return!1},lastIndex:0};function dx(t,e){if((0,ir.default)(t,"LINE_BREAKS"))return!1;if((0,yo.default)(t.PATTERN)){try{(0,Fs.canMatchCharCode)(e,t.PATTERN)}catch(r){return{issue:$e.LexerDefinitionErrorType.IDENTIFY_TERMINATOR,errMsg:r.message}}return!1}else{if((0,Li.default)(t.PATTERN))return!1;if(A_(t))return{issue:$e.LexerDefinitionErrorType.CUSTOM_LINE_BREAK};throw Error("non exhaustive match")}}function fx(t,e){if(e.issue===$e.LexerDefinitionErrorType.IDENTIFY_TERMINATOR)return`Warning: unable to identify line terminator usage in pattern.
`+"	The problem is in the <".concat(t.name,`> Token Type
`)+"	 Root cause: ".concat(e.errMsg,`.
`)+"	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#IDENTIFY_TERMINATOR";if(e.issue===$e.LexerDefinitionErrorType.CUSTOM_LINE_BREAK)return`Warning: A Custom Token Pattern should specify the <line_breaks> option.
`+"	The problem is in the <".concat(t.name,`> Token Type
`)+"	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_LINE_BREAK";throw Error("non exhaustive match")}H.buildLineBreakIssueMessage=fx;function px(t){var e=(0,st.default)(t,function(r){return(0,Li.default)(r)?r.charCodeAt(0):r});return e}function v_(t,e,r){t[e]===void 0?t[e]=[r]:t[e].push(r)}H.minOptimizationVal=256;var Yf=[];function b_(t){return t<H.minOptimizationVal?t:Yf[t]}H.charCodeToOptimizedIndex=b_;function Zte(){if((0,YI.default)(Yf)){Yf=new Array(65536);for(var t=0;t<65536;t++)Yf[t]=t>255?255+~~(t/255):t}}});var ep=f((Iye,hx)=>{function ere(t){var e=t==null?0:t.length;return e?t[e-1]:void 0}hx.exports=ere});var ua=f(ce=>{"use strict";var ri=ce&&ce.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(ce,"__esModule",{value:!0});ce.isTokenType=ce.hasExtendingTokensTypesMapProperty=ce.hasExtendingTokensTypesProperty=ce.hasCategoriesProperty=ce.hasShortKeyProperty=ce.singleAssignCategoriesToksMap=ce.assignCategoriesMapProp=ce.assignCategoriesTokensProp=ce.assignTokenDefaultProps=ce.expandCategories=ce.augmentTokenTypes=ce.tokenIdxToClass=ce.tokenShortNameIdx=ce.tokenStructuredMatcherNoCategories=ce.tokenStructuredMatcher=void 0;var tre=ri(Or()),rre=ri(Cc()),nre=ri(xe()),ire=ri(Sn()),ore=ri(Hf()),are=ri(Ut()),sa=ri(Gt()),kc=ri(Ir()),sre=ri(Di()),ure=ri(wi());function cre(t,e){var r=t.tokenTypeIdx;return r===e.tokenTypeIdx?!0:e.isParent===!0&&e.categoryMatchesMap[r]===!0}ce.tokenStructuredMatcher=cre;function lre(t,e){return t.tokenTypeIdx===e.tokenTypeIdx}ce.tokenStructuredMatcherNoCategories=lre;ce.tokenShortNameIdx=1;ce.tokenIdxToClass={};function dre(t){var e=mx(t);gx(e),vx(e),yx(e),(0,sa.default)(e,function(r){r.isParent=r.categoryMatches.length>0})}ce.augmentTokenTypes=dre;function mx(t){for(var e=(0,ure.default)(t),r=t,n=!0;n;){r=(0,rre.default)((0,ire.default)((0,are.default)(r,function(o){return o.CATEGORIES})));var i=(0,ore.default)(r,e);e=e.concat(i),(0,tre.default)(i)?n=!1:r=i}return e}ce.expandCategories=mx;function gx(t){(0,sa.default)(t,function(e){_x(e)||(ce.tokenIdxToClass[ce.tokenShortNameIdx]=e,e.tokenTypeIdx=ce.tokenShortNameIdx++),P_(e)&&!(0,nre.default)(e.CATEGORIES)&&(e.CATEGORIES=[e.CATEGORIES]),P_(e)||(e.CATEGORIES=[]),Tx(e)||(e.categoryMatches=[]),Rx(e)||(e.categoryMatchesMap={})})}ce.assignTokenDefaultProps=gx;function yx(t){(0,sa.default)(t,function(e){e.categoryMatches=[],(0,sa.default)(e.categoryMatchesMap,function(r,n){e.categoryMatches.push(ce.tokenIdxToClass[n].tokenTypeIdx)})})}ce.assignCategoriesTokensProp=yx;function vx(t){(0,sa.default)(t,function(e){S_([],e)})}ce.assignCategoriesMapProp=vx;function S_(t,e){(0,sa.default)(t,function(r){e.categoryMatchesMap[r.tokenTypeIdx]=!0}),(0,sa.default)(e.CATEGORIES,function(r){var n=t.concat(e);(0,sre.default)(n,r)||S_(n,r)})}ce.singleAssignCategoriesToksMap=S_;function _x(t){return(0,kc.default)(t,"tokenTypeIdx")}ce.hasShortKeyProperty=_x;function P_(t){return(0,kc.default)(t,"CATEGORIES")}ce.hasCategoriesProperty=P_;function Tx(t){return(0,kc.default)(t,"categoryMatches")}ce.hasExtendingTokensTypesProperty=Tx;function Rx(t){return(0,kc.default)(t,"categoryMatchesMap")}ce.hasExtendingTokensTypesMapProperty=Rx;function fre(t){return(0,kc.default)(t,"tokenTypeIdx")}ce.isTokenType=fre});var C_=f(tp=>{"use strict";Object.defineProperty(tp,"__esModule",{value:!0});tp.defaultLexerErrorProvider=void 0;tp.defaultLexerErrorProvider={buildUnableToPopLexerModeMessage:function(t){return"Unable to pop Lexer Mode after encountering Token ->".concat(t.image,"<- The Mode Stack is empty")},buildUnexpectedCharactersMessage:function(t,e,r,n,i){return"unexpected character: ->".concat(t.charAt(e),"<- at offset: ").concat(e,",")+" skipped ".concat(r," characters.")}}});var Nc=f($i=>{"use strict";var xr=$i&&$i.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty($i,"__esModule",{value:!0});$i.Lexer=$i.LexerDefinitionErrorType=void 0;var Mi=y_(),E_=xr($f()),rp=xr(Or()),pre=xr(xe()),hre=xr(ep()),mre=xr(Gf()),bx=xr(Ut()),N_=xr(Gt()),gre=xr(Dr()),yre=xr(oa()),Ax=xr(ia()),Px=xr(Ac()),vre=xr(Ii()),Sx=xr(wi()),k_=Ds(),_re=ua(),Tre=C_(),Rre=Kf(),bre;(function(t){t[t.MISSING_PATTERN=0]="MISSING_PATTERN",t[t.INVALID_PATTERN=1]="INVALID_PATTERN",t[t.EOI_ANCHOR_FOUND=2]="EOI_ANCHOR_FOUND",t[t.UNSUPPORTED_FLAGS_FOUND=3]="UNSUPPORTED_FLAGS_FOUND",t[t.DUPLICATE_PATTERNS_FOUND=4]="DUPLICATE_PATTERNS_FOUND",t[t.INVALID_GROUP_TYPE_FOUND=5]="INVALID_GROUP_TYPE_FOUND",t[t.PUSH_MODE_DOES_NOT_EXIST=6]="PUSH_MODE_DOES_NOT_EXIST",t[t.MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE=7]="MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE",t[t.MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY=8]="MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY",t[t.MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST=9]="MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST",t[t.LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED=10]="LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED",t[t.SOI_ANCHOR_FOUND=11]="SOI_ANCHOR_FOUND",t[t.EMPTY_MATCH_PATTERN=12]="EMPTY_MATCH_PATTERN",t[t.NO_LINE_BREAKS_FLAGS=13]="NO_LINE_BREAKS_FLAGS",t[t.UNREACHABLE_PATTERN=14]="UNREACHABLE_PATTERN",t[t.IDENTIFY_TERMINATOR=15]="IDENTIFY_TERMINATOR",t[t.CUSTOM_LINE_BREAK=16]="CUSTOM_LINE_BREAK",t[t.MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE=17]="MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE"})(bre=$i.LexerDefinitionErrorType||($i.LexerDefinitionErrorType={}));var wc={deferDefinitionErrorsHandling:!1,positionTracking:"full",lineTerminatorsPattern:/\n|\r\n?/g,lineTerminatorCharacters:[`
`,"\r"],ensureOptimizations:!1,safeMode:!1,errorMessageProvider:Tre.defaultLexerErrorProvider,traceInitPerf:!1,skipValidations:!1,recoveryEnabled:!0};Object.freeze(wc);var Are=function(){function t(e,r){r===void 0&&(r=wc);var n=this;if(this.lexerDefinition=e,this.lexerDefinitionErrors=[],this.lexerDefinitionWarning=[],this.patternIdxToConfig={},this.charCodeToPatternIdxToConfig={},this.modes=[],this.emptyGroups={},this.trackStartLines=!0,this.trackEndLines=!0,this.hasCustom=!1,this.canModeBeOptimized={},this.TRACE_INIT=function(o,a){if(n.traceInitPerf===!0){n.traceInitIndent++;var s=new Array(n.traceInitIndent+1).join("	");n.traceInitIndent<n.traceInitMaxIdent&&console.log("".concat(s,"--> <").concat(o,">"));var u=(0,k_.timer)(a),c=u.time,l=u.value,d=c>10?console.warn:console.log;return n.traceInitIndent<n.traceInitMaxIdent&&d("".concat(s,"<-- <").concat(o,"> time: ").concat(c,"ms")),n.traceInitIndent--,l}else return a()},typeof r=="boolean")throw Error(`The second argument to the Lexer constructor is now an ILexerConfig Object.
a boolean 2nd argument is no longer supported`);this.config=(0,Px.default)({},wc,r);var i=this.config.traceInitPerf;i===!0?(this.traceInitMaxIdent=1/0,this.traceInitPerf=!0):typeof i=="number"&&(this.traceInitMaxIdent=i,this.traceInitPerf=!0),this.traceInitIndent=-1,this.TRACE_INIT("Lexer Constructor",function(){var o,a=!0;n.TRACE_INIT("Lexer Config handling",function(){if(n.config.lineTerminatorsPattern===wc.lineTerminatorsPattern)n.config.lineTerminatorsPattern=Mi.LineTerminatorOptimizedTester;else if(n.config.lineTerminatorCharacters===wc.lineTerminatorCharacters)throw Error(`Error: Missing <lineTerminatorCharacters> property on the Lexer config.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#MISSING_LINE_TERM_CHARS`);if(r.safeMode&&r.ensureOptimizations)throw Error('"safeMode" and "ensureOptimizations" flags are mutually exclusive.');n.trackStartLines=/full|onlyStart/i.test(n.config.positionTracking),n.trackEndLines=/full/i.test(n.config.positionTracking),(0,pre.default)(e)?o={modes:{defaultMode:(0,Sx.default)(e)},defaultMode:Mi.DEFAULT_MODE}:(a=!1,o=(0,Sx.default)(e))}),n.config.skipValidations===!1&&(n.TRACE_INIT("performRuntimeChecks",function(){n.lexerDefinitionErrors=n.lexerDefinitionErrors.concat((0,Mi.performRuntimeChecks)(o,n.trackStartLines,n.config.lineTerminatorCharacters))}),n.TRACE_INIT("performWarningRuntimeChecks",function(){n.lexerDefinitionWarning=n.lexerDefinitionWarning.concat((0,Mi.performWarningRuntimeChecks)(o,n.trackStartLines,n.config.lineTerminatorCharacters))})),o.modes=o.modes?o.modes:{},(0,N_.default)(o.modes,function(l,d){o.modes[d]=(0,mre.default)(l,function(h){return(0,yre.default)(h)})});var s=(0,gre.default)(o.modes);if((0,N_.default)(o.modes,function(l,d){n.TRACE_INIT("Mode: <".concat(d,"> processing"),function(){if(n.modes.push(d),n.config.skipValidations===!1&&n.TRACE_INIT("validatePatterns",function(){n.lexerDefinitionErrors=n.lexerDefinitionErrors.concat((0,Mi.validatePatterns)(l,s))}),(0,rp.default)(n.lexerDefinitionErrors)){(0,_re.augmentTokenTypes)(l);var h;n.TRACE_INIT("analyzeTokenTypes",function(){h=(0,Mi.analyzeTokenTypes)(l,{lineTerminatorCharacters:n.config.lineTerminatorCharacters,positionTracking:r.positionTracking,ensureOptimizations:r.ensureOptimizations,safeMode:r.safeMode,tracer:n.TRACE_INIT})}),n.patternIdxToConfig[d]=h.patternIdxToConfig,n.charCodeToPatternIdxToConfig[d]=h.charCodeToPatternIdxToConfig,n.emptyGroups=(0,Px.default)({},n.emptyGroups,h.emptyGroups),n.hasCustom=h.hasCustom||n.hasCustom,n.canModeBeOptimized[d]=h.canBeOptimized}})}),n.defaultMode=o.defaultMode,!(0,rp.default)(n.lexerDefinitionErrors)&&!n.config.deferDefinitionErrorsHandling){var u=(0,bx.default)(n.lexerDefinitionErrors,function(l){return l.message}),c=u.join(`-----------------------
`);throw new Error(`Errors detected in definition of Lexer:
`+c)}(0,N_.default)(n.lexerDefinitionWarning,function(l){(0,k_.PRINT_WARNING)(l.message)}),n.TRACE_INIT("Choosing sub-methods implementations",function(){if(Mi.SUPPORT_STICKY?(n.chopInput=Ax.default,n.match=n.matchWithTest):(n.updateLastIndex=E_.default,n.match=n.matchWithExec),a&&(n.handleModes=E_.default),n.trackStartLines===!1&&(n.computeNewColumn=Ax.default),n.trackEndLines===!1&&(n.updateTokenEndLineColumnLocation=E_.default),/full/i.test(n.config.positionTracking))n.createTokenInstance=n.createFullToken;else if(/onlyStart/i.test(n.config.positionTracking))n.createTokenInstance=n.createStartOnlyToken;else if(/onlyOffset/i.test(n.config.positionTracking))n.createTokenInstance=n.createOffsetOnlyToken;else throw Error('Invalid <positionTracking> config option: "'.concat(n.config.positionTracking,'"'));n.hasCustom?(n.addToken=n.addTokenUsingPush,n.handlePayload=n.handlePayloadWithCustom):(n.addToken=n.addTokenUsingMemberAccess,n.handlePayload=n.handlePayloadNoCustom)}),n.TRACE_INIT("Failed Optimization Warnings",function(){var l=(0,vre.default)(n.canModeBeOptimized,function(d,h,v){return h===!1&&d.push(v),d},[]);if(r.ensureOptimizations&&!(0,rp.default)(l))throw Error("Lexer Modes: < ".concat(l.join(", "),` > cannot be optimized.
`)+`	 Disable the "ensureOptimizations" lexer config flag to silently ignore this and run the lexer in an un-optimized mode.
	 Or inspect the console log for details on how to resolve these issues.`)}),n.TRACE_INIT("clearRegExpParserCache",function(){(0,Rre.clearRegExpParserCache)()}),n.TRACE_INIT("toFastProperties",function(){(0,k_.toFastProperties)(n)})})}return t.prototype.tokenize=function(e,r){if(r===void 0&&(r=this.defaultMode),!(0,rp.default)(this.lexerDefinitionErrors)){var n=(0,bx.default)(this.lexerDefinitionErrors,function(o){return o.message}),i=n.join(`-----------------------
`);throw new Error(`Unable to Tokenize because Errors detected in definition of Lexer:
`+i)}return this.tokenizeInternal(e,r)},t.prototype.tokenizeInternal=function(e,r){var n=this,i,o,a,s,u,c,l,d,h,v,g,R,E,N,A,b,O=e,$=O.length,B=0,ee=0,Fe=this.hasCustom?0:Math.floor(e.length/10),Ne=new Array(Fe),Je=[],K=this.trackStartLines?1:void 0,le=this.trackStartLines?1:void 0,L=(0,Mi.cloneEmptyGroups)(this.emptyGroups),q=this.trackStartLines,F=this.config.lineTerminatorsPattern,W=0,ie=[],oe=[],J=[],dt=[];Object.freeze(dt);var rt;function Dt(){return ie}function tn(Lt){var nn=(0,Mi.charCodeToOptimizedIndex)(Lt),on=oe[nn];return on===void 0?dt:on}var Er=function(Lt){if(J.length===1&&Lt.tokenType.PUSH_MODE===void 0){var nn=n.config.errorMessageProvider.buildUnableToPopLexerModeMessage(Lt);Je.push({offset:Lt.startOffset,line:Lt.startLine,column:Lt.startColumn,length:Lt.image.length,message:nn})}else{J.pop();var on=(0,hre.default)(J);ie=n.patternIdxToConfig[on],oe=n.charCodeToPatternIdxToConfig[on],W=ie.length;var xn=n.canModeBeOptimized[on]&&n.config.safeMode===!1;oe&&xn?rt=tn:rt=Dt}};function ba(Lt){J.push(Lt),oe=this.charCodeToPatternIdxToConfig[Lt],ie=this.patternIdxToConfig[Lt],W=ie.length,W=ie.length;var nn=this.canModeBeOptimized[Lt]&&this.config.safeMode===!1;oe&&nn?rt=tn:rt=Dt}ba.call(this,r);for(var ar,Aa=this.config.recoveryEnabled;B<$;){c=null;var Pa=O.charCodeAt(B),Sa=rt(Pa),vu=Sa.length;for(i=0;i<vu;i++){ar=Sa[i];var gt=ar.pattern;l=null;var pi=ar.short;if(pi!==!1?Pa===pi&&(c=gt):ar.isCustom===!0?(b=gt.exec(O,B,Ne,L),b!==null?(c=b[0],b.payload!==void 0&&(l=b.payload)):c=null):(this.updateLastIndex(gt,B),c=this.match(gt,e,B)),c!==null){if(u=ar.longerAlt,u!==void 0){var _u=u.length;for(a=0;a<_u;a++){var On=ie[u[a]],xo=On.pattern;if(d=null,On.isCustom===!0?(b=xo.exec(O,B,Ne,L),b!==null?(s=b[0],b.payload!==void 0&&(d=b.payload)):s=null):(this.updateLastIndex(xo,B),s=this.match(xo,e,B)),s&&s.length>c.length){c=s,l=d,ar=On;break}}}break}}if(c!==null){if(h=c.length,v=ar.group,v!==void 0&&(g=ar.tokenTypeIdx,R=this.createTokenInstance(c,B,g,ar.tokenType,K,le,h),this.handlePayload(R,l),v===!1?ee=this.addToken(Ne,ee,R):L[v].push(R)),e=this.chopInput(e,h),B=B+h,le=this.computeNewColumn(le,h),q===!0&&ar.canLineTerminator===!0){var Dn=0,qo=void 0,Mr=void 0;F.lastIndex=0;do qo=F.test(c),qo===!0&&(Mr=F.lastIndex-1,Dn++);while(qo===!0);Dn!==0&&(K=K+Dn,le=h-Mr,this.updateTokenEndLineColumnLocation(R,v,Mr,Dn,K,le,h))}this.handleModes(ar,Er,ba,R)}else{for(var rn=B,Ca=K,Ea=le,Nr=Aa===!1;Nr===!1&&B<$;)for(e=this.chopInput(e,1),B++,o=0;o<W;o++){var In=ie[o],gt=In.pattern,pi=In.short;if(pi!==!1?O.charCodeAt(B)===pi&&(Nr=!0):In.isCustom===!0?Nr=gt.exec(O,B,Ne,L)!==null:(this.updateLastIndex(gt,B),Nr=gt.exec(e)!==null),Nr===!0)break}if(E=B-rn,A=this.config.errorMessageProvider.buildUnexpectedCharactersMessage(O,rn,E,Ca,Ea),Je.push({offset:rn,line:Ca,column:Ea,length:E,message:A}),Aa===!1)break}}return this.hasCustom||(Ne.length=ee),{tokens:Ne,groups:L,errors:Je}},t.prototype.handleModes=function(e,r,n,i){if(e.pop===!0){var o=e.push;r(i),o!==void 0&&n.call(this,o)}else e.push!==void 0&&n.call(this,e.push)},t.prototype.chopInput=function(e,r){return e.substring(r)},t.prototype.updateLastIndex=function(e,r){e.lastIndex=r},t.prototype.updateTokenEndLineColumnLocation=function(e,r,n,i,o,a,s){var u,c;r!==void 0&&(u=n===s-1,c=u?-1:0,i===1&&u===!0||(e.endLine=o+c,e.endColumn=a-1+-c))},t.prototype.computeNewColumn=function(e,r){return e+r},t.prototype.createOffsetOnlyToken=function(e,r,n,i){return{image:e,startOffset:r,tokenTypeIdx:n,tokenType:i}},t.prototype.createStartOnlyToken=function(e,r,n,i,o,a){return{image:e,startOffset:r,startLine:o,startColumn:a,tokenTypeIdx:n,tokenType:i}},t.prototype.createFullToken=function(e,r,n,i,o,a,s){return{image:e,startOffset:r,endOffset:r+s-1,startLine:o,endLine:o,startColumn:a,endColumn:a+s-1,tokenTypeIdx:n,tokenType:i}},t.prototype.addTokenUsingPush=function(e,r,n){return e.push(n),r},t.prototype.addTokenUsingMemberAccess=function(e,r,n){return e[r]=n,r++,r},t.prototype.handlePayloadNoCustom=function(e,r){},t.prototype.handlePayloadWithCustom=function(e,r){r!==null&&(e.payload=r)},t.prototype.matchWithTest=function(e,r,n){var i=e.test(r);return i===!0?r.substring(n,e.lastIndex):null},t.prototype.matchWithExec=function(e,r){var n=e.exec(r);return n!==null?n[0]:null},t.SKIPPED="This marks a skipped Token pattern, this means each token identified by it willbe consumed and then thrown into oblivion, this can be used to for example to completely ignore whitespace.",t.NA=/NOT_APPLICABLE/,t}();$i.Lexer=Are});var ca=f(qt=>{"use strict";var w_=qt&&qt.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(qt,"__esModule",{value:!0});qt.tokenMatcher=qt.createTokenInstance=qt.EOF=qt.createToken=qt.hasTokenLabel=qt.tokenName=qt.tokenLabel=void 0;var Pre=w_(Rc()),Fi=w_(Ir()),Sre=w_(oa()),Cre=Nc(),O_=ua();function Ere(t){return xx(t)?t.LABEL:t.name}qt.tokenLabel=Ere;function Nre(t){return t.name}qt.tokenName=Nre;function xx(t){return(0,Pre.default)(t.LABEL)&&t.LABEL!==""}qt.hasTokenLabel=xx;var kre="parent",Cx="categories",Ex="label",Nx="group",kx="push_mode",wx="pop_mode",Ox="longer_alt",Dx="line_breaks",Ix="start_chars_hint";function qx(t){return wre(t)}qt.createToken=qx;function wre(t){var e=t.pattern,r={};if(r.name=t.name,(0,Sre.default)(e)||(r.PATTERN=e),(0,Fi.default)(t,kre))throw`The parent property is no longer supported.
See: https://github.com/chevrotain/chevrotain/issues/564#issuecomment-349062346 for details.`;return(0,Fi.default)(t,Cx)&&(r.CATEGORIES=t[Cx]),(0,O_.augmentTokenTypes)([r]),(0,Fi.default)(t,Ex)&&(r.LABEL=t[Ex]),(0,Fi.default)(t,Nx)&&(r.GROUP=t[Nx]),(0,Fi.default)(t,wx)&&(r.POP_MODE=t[wx]),(0,Fi.default)(t,kx)&&(r.PUSH_MODE=t[kx]),(0,Fi.default)(t,Ox)&&(r.LONGER_ALT=t[Ox]),(0,Fi.default)(t,Dx)&&(r.LINE_BREAKS=t[Dx]),(0,Fi.default)(t,Ix)&&(r.START_CHARS_HINT=t[Ix]),r}qt.EOF=qx({name:"EOF",pattern:Cre.Lexer.NA});(0,O_.augmentTokenTypes)([qt.EOF]);function Ore(t,e,r,n,i,o,a,s){return{image:e,startOffset:r,endOffset:n,startLine:i,endLine:o,startColumn:a,endColumn:s,tokenTypeIdx:t.tokenTypeIdx,tokenType:t}}qt.createTokenInstance=Ore;function Dre(t,e){return(0,O_.tokenStructuredMatcher)(t,e)}qt.tokenMatcher=Dre});var Us=f(Cn=>{"use strict";var x_=Cn&&Cn.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(Cn,"__esModule",{value:!0});Cn.defaultGrammarValidatorErrorProvider=Cn.defaultGrammarResolverErrorProvider=Cn.defaultParserErrorProvider=void 0;var js=ca(),I_=x_(Ls()),vo=x_(Ut()),Ire=x_(Ii()),D_=_t(),Lx=_t();Cn.defaultParserErrorProvider={buildMismatchTokenMessage:function(t){var e=t.expected,r=t.actual,n=t.previous,i=t.ruleName,o=(0,js.hasTokenLabel)(e),a=o?"--> ".concat((0,js.tokenLabel)(e)," <--"):"token of type --> ".concat(e.name," <--"),s="Expecting ".concat(a," but found --> '").concat(r.image,"' <--");return s},buildNotAllInputParsedMessage:function(t){var e=t.firstRedundant,r=t.ruleName;return"Redundant input, expecting EOF but found: "+e.image},buildNoViableAltMessage:function(t){var e=t.expectedPathsPerAlt,r=t.actual,n=t.previous,i=t.customUserDescription,o=t.ruleName,a="Expecting: ",s=(0,I_.default)(r).image,u=`
but found: '`+s+"'";if(i)return a+i+u;var c=(0,Ire.default)(e,function(v,g){return v.concat(g)},[]),l=(0,vo.default)(c,function(v){return"[".concat((0,vo.default)(v,function(g){return(0,js.tokenLabel)(g)}).join(", "),"]")}),d=(0,vo.default)(l,function(v,g){return"  ".concat(g+1,". ").concat(v)}),h=`one of these possible Token sequences:
`.concat(d.join(`
`));return a+h+u},buildEarlyExitMessage:function(t){var e=t.expectedIterationPaths,r=t.actual,n=t.customUserDescription,i=t.ruleName,o="Expecting: ",a=(0,I_.default)(r).image,s=`
but found: '`+a+"'";if(n)return o+n+s;var u=(0,vo.default)(e,function(l){return"[".concat((0,vo.default)(l,function(d){return(0,js.tokenLabel)(d)}).join(","),"]")}),c=`expecting at least one iteration which starts with one of these possible Token sequences::
  `+"<".concat(u.join(" ,"),">");return o+c+s}};Object.freeze(Cn.defaultParserErrorProvider);Cn.defaultGrammarResolverErrorProvider={buildRuleNotFoundError:function(t,e){var r="Invalid grammar, reference to a rule which is not defined: ->"+e.nonTerminalName+`<-
inside top level rule: ->`+t.name+"<-";return r}};Cn.defaultGrammarValidatorErrorProvider={buildDuplicateFoundError:function(t,e){function r(l){return l instanceof D_.Terminal?l.terminalType.name:l instanceof D_.NonTerminal?l.nonTerminalName:""}var n=t.name,i=(0,I_.default)(e),o=i.idx,a=(0,Lx.getProductionDslName)(i),s=r(i),u=o>0,c="->".concat(a).concat(u?o:"","<- ").concat(s?"with argument: ->".concat(s,"<-"):"",`
                  appears more than once (`).concat(e.length," times) in the top level rule: ->").concat(n,`<-.                  
                  For further details see: https://chevrotain.io/docs/FAQ.html#NUMERICAL_SUFFIXES 
                  `);return c=c.replace(/[ \t]+/g," "),c=c.replace(/\s\s+/g,`
`),c},buildNamespaceConflictError:function(t){var e=`Namespace conflict found in grammar.
`+"The grammar has both a Terminal(Token) and a Non-Terminal(Rule) named: <".concat(t.name,`>.
`)+`To resolve this make sure each Terminal and Non-Terminal names are unique
This is easy to accomplish by using the convention that Terminal names start with an uppercase letter
and Non-Terminal names start with a lower case letter.`;return e},buildAlternationPrefixAmbiguityError:function(t){var e=(0,vo.default)(t.prefixPath,function(i){return(0,js.tokenLabel)(i)}).join(", "),r=t.alternation.idx===0?"":t.alternation.idx,n="Ambiguous alternatives: <".concat(t.ambiguityIndices.join(" ,"),`> due to common lookahead prefix
`)+"in <OR".concat(r,"> inside <").concat(t.topLevelRule.name,`> Rule,
`)+"<".concat(e,`> may appears as a prefix path in all these alternatives.
`)+`See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#COMMON_PREFIX
For Further details.`;return n},buildAlternationAmbiguityError:function(t){var e=(0,vo.default)(t.prefixPath,function(i){return(0,js.tokenLabel)(i)}).join(", "),r=t.alternation.idx===0?"":t.alternation.idx,n="Ambiguous Alternatives Detected: <".concat(t.ambiguityIndices.join(" ,"),"> in <OR").concat(r,">")+" inside <".concat(t.topLevelRule.name,`> Rule,
`)+"<".concat(e,`> may appears as a prefix path in all these alternatives.
`);return n=n+`See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#AMBIGUOUS_ALTERNATIVES
For Further details.`,n},buildEmptyRepetitionError:function(t){var e=(0,Lx.getProductionDslName)(t.repetition);t.repetition.idx!==0&&(e+=t.repetition.idx);var r="The repetition <".concat(e,"> within Rule <").concat(t.topLevelRule.name,`> can never consume any tokens.
`)+"This could lead to an infinite loop.";return r},buildTokenNameError:function(t){return"deprecated"},buildEmptyAlternationError:function(t){var e="Ambiguous empty alternative: <".concat(t.emptyChoiceIdx+1,">")+" in <OR".concat(t.alternation.idx,"> inside <").concat(t.topLevelRule.name,`> Rule.
`)+"Only the last alternative may be an empty alternative.";return e},buildTooManyAlternativesError:function(t){var e=`An Alternation cannot have more than 256 alternatives:
`+"<OR".concat(t.alternation.idx,"> inside <").concat(t.topLevelRule.name,`> Rule.
 has `).concat(t.alternation.definition.length+1," alternatives.");return e},buildLeftRecursionError:function(t){var e=t.topLevelRule.name,r=(0,vo.default)(t.leftRecursionPath,function(o){return o.name}),n="".concat(e," --> ").concat(r.concat([e]).join(" --> ")),i=`Left Recursion found in grammar.
`+"rule: <".concat(e,`> can be invoked from itself (directly or indirectly)
`)+`without consuming any Tokens. The grammar path that causes this is: 
 `.concat(n,`
`)+` To fix this refactor your grammar to remove the left recursion.
see: https://en.wikipedia.org/wiki/LL_parser#Left_factoring.`;return i},buildInvalidRuleNameError:function(t){return"deprecated"},buildDuplicateRuleNameError:function(t){var e;t.topLevelRule instanceof D_.Rule?e=t.topLevelRule.name:e=t.topLevelRule;var r="Duplicate definition, rule: ->".concat(e,"<- is already defined in the grammar: ->").concat(t.grammarName,"<-");return r}}});var Fx=f(ni=>{"use strict";var xre=ni&&ni.__extends||function(){var t=function(e,r){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(n[o]=i[o])},t(e,r)};return function(e,r){if(typeof r!="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");t(e,r);function n(){this.constructor=e}e.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),Mx=ni&&ni.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(ni,"__esModule",{value:!0});ni.GastRefResolverVisitor=ni.resolveGrammar=void 0;var qre=Ar(),Lre=Mx(Gt()),Mre=Mx(Yn()),$re=_t();function Fre(t,e){var r=new $x(t,e);return r.resolveRefs(),r.errors}ni.resolveGrammar=Fre;var $x=function(t){xre(e,t);function e(r,n){var i=t.call(this)||this;return i.nameToTopRule=r,i.errMsgProvider=n,i.errors=[],i}return e.prototype.resolveRefs=function(){var r=this;(0,Lre.default)((0,Mre.default)(this.nameToTopRule),function(n){r.currTopLevel=n,n.accept(r)})},e.prototype.visitNonTerminal=function(r){var n=this.nameToTopRule[r.nonTerminalName];if(n)r.referencedRule=n;else{var i=this.errMsgProvider.buildRuleNotFoundError(this.currTopLevel,r);this.errors.push({message:i,type:qre.ParserDefinitionErrorType.UNRESOLVED_SUBRULE_REF,ruleName:this.currTopLevel.name,unresolvedRefName:r.nonTerminalName})}},e}($re.GAstVisitor);ni.GastRefResolverVisitor=$x});var Ux=f((jye,jx)=>{function jre(t,e,r,n){for(var i=-1,o=t==null?0:t.length;++i<o;){var a=t[i];e(n,a,r(a),t)}return n}jx.exports=jre});var Hx=f((Uye,Gx)=>{var Ure=go();function Gre(t,e,r,n){return Ure(t,function(i,o,a){e(n,i,r(i),a)}),n}Gx.exports=Gre});var Bx=f((Gye,Wx)=>{var Hre=Ux(),Wre=Hx(),Bre=Xr(),Kre=xe();function zre(t,e){return function(r,n){var i=Kre(r)?Hre:Wre,o=e?e():{};return i(r,t,Bre(n,2),o)}}Wx.exports=zre});var q_=f((Hye,Kx)=>{var Vre=Af(),Yre=Bx(),Xre=Object.prototype,Jre=Xre.hasOwnProperty,Qre=Yre(function(t,e,r){Jre.call(t,r)?t[r].push(e):Vre(t,r,[e])});Kx.exports=Qre});var np=f((Wye,zx)=>{var Zre=Mf(),ene=Ut();function tne(t,e){return Zre(ene(t,e),1)}zx.exports=tne});var ip=f((Bye,Vx)=>{var rne=Ef(),nne=Is();function ine(t,e,r){var n=t==null?0:t.length;return n?(e=r||e===void 0?1:nne(e),e=n-e,rne(t,0,e<0?0:e)):[]}Vx.exports=ine});var Dc=f(ut=>{"use strict";var da=ut&&ut.__extends||function(){var t=function(e,r){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(n[o]=i[o])},t(e,r)};return function(e,r){if(typeof r!="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");t(e,r);function n(){this.constructor=e}e.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),fa=ut&&ut.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(ut,"__esModule",{value:!0});ut.nextPossibleTokensAfter=ut.possiblePathsFrom=ut.NextTerminalAfterAtLeastOneSepWalker=ut.NextTerminalAfterAtLeastOneWalker=ut.NextTerminalAfterManySepWalker=ut.NextTerminalAfterManyWalker=ut.AbstractNextTerminalAfterProductionWalker=ut.NextAfterTokenWalker=ut.AbstractNextPossibleTokensWalker=void 0;var Xx=Lf(),ap=fa(Ls()),op=fa(Or()),Yx=fa(ip()),pr=fa(Nf()),one=fa(ep()),ane=fa(Gt()),la=fa(wi()),sne=l_(),de=_t(),Jx=function(t){da(e,t);function e(r,n){var i=t.call(this)||this;return i.topProd=r,i.path=n,i.possibleTokTypes=[],i.nextProductionName="",i.nextProductionOccurrence=0,i.found=!1,i.isAtEndOfPath=!1,i}return e.prototype.startWalking=function(){if(this.found=!1,this.path.ruleStack[0]!==this.topProd.name)throw Error("The path does not start with the walker's top Rule!");return this.ruleStack=(0,la.default)(this.path.ruleStack).reverse(),this.occurrenceStack=(0,la.default)(this.path.occurrenceStack).reverse(),this.ruleStack.pop(),this.occurrenceStack.pop(),this.updateExpectedNext(),this.walk(this.topProd),this.possibleTokTypes},e.prototype.walk=function(r,n){n===void 0&&(n=[]),this.found||t.prototype.walk.call(this,r,n)},e.prototype.walkProdRef=function(r,n,i){if(r.referencedRule.name===this.nextProductionName&&r.idx===this.nextProductionOccurrence){var o=n.concat(i);this.updateExpectedNext(),this.walk(r.referencedRule,o)}},e.prototype.updateExpectedNext=function(){(0,op.default)(this.ruleStack)?(this.nextProductionName="",this.nextProductionOccurrence=0,this.isAtEndOfPath=!0):(this.nextProductionName=this.ruleStack.pop(),this.nextProductionOccurrence=this.occurrenceStack.pop())},e}(Xx.RestWalker);ut.AbstractNextPossibleTokensWalker=Jx;var une=function(t){da(e,t);function e(r,n){var i=t.call(this,r,n)||this;return i.path=n,i.nextTerminalName="",i.nextTerminalOccurrence=0,i.nextTerminalName=i.path.lastTok.name,i.nextTerminalOccurrence=i.path.lastTokOccurrence,i}return e.prototype.walkTerminal=function(r,n,i){if(this.isAtEndOfPath&&r.terminalType.name===this.nextTerminalName&&r.idx===this.nextTerminalOccurrence&&!this.found){var o=n.concat(i),a=new de.Alternative({definition:o});this.possibleTokTypes=(0,sne.first)(a),this.found=!0}},e}(Jx);ut.NextAfterTokenWalker=une;var Oc=function(t){da(e,t);function e(r,n){var i=t.call(this)||this;return i.topRule=r,i.occurrence=n,i.result={token:void 0,occurrence:void 0,isEndOfRule:void 0},i}return e.prototype.startWalking=function(){return this.walk(this.topRule),this.result},e}(Xx.RestWalker);ut.AbstractNextTerminalAfterProductionWalker=Oc;var cne=function(t){da(e,t);function e(){return t!==null&&t.apply(this,arguments)||this}return e.prototype.walkMany=function(r,n,i){if(r.idx===this.occurrence){var o=(0,ap.default)(n.concat(i));this.result.isEndOfRule=o===void 0,o instanceof de.Terminal&&(this.result.token=o.terminalType,this.result.occurrence=o.idx)}else t.prototype.walkMany.call(this,r,n,i)},e}(Oc);ut.NextTerminalAfterManyWalker=cne;var lne=function(t){da(e,t);function e(){return t!==null&&t.apply(this,arguments)||this}return e.prototype.walkManySep=function(r,n,i){if(r.idx===this.occurrence){var o=(0,ap.default)(n.concat(i));this.result.isEndOfRule=o===void 0,o instanceof de.Terminal&&(this.result.token=o.terminalType,this.result.occurrence=o.idx)}else t.prototype.walkManySep.call(this,r,n,i)},e}(Oc);ut.NextTerminalAfterManySepWalker=lne;var dne=function(t){da(e,t);function e(){return t!==null&&t.apply(this,arguments)||this}return e.prototype.walkAtLeastOne=function(r,n,i){if(r.idx===this.occurrence){var o=(0,ap.default)(n.concat(i));this.result.isEndOfRule=o===void 0,o instanceof de.Terminal&&(this.result.token=o.terminalType,this.result.occurrence=o.idx)}else t.prototype.walkAtLeastOne.call(this,r,n,i)},e}(Oc);ut.NextTerminalAfterAtLeastOneWalker=dne;var fne=function(t){da(e,t);function e(){return t!==null&&t.apply(this,arguments)||this}return e.prototype.walkAtLeastOneSep=function(r,n,i){if(r.idx===this.occurrence){var o=(0,ap.default)(n.concat(i));this.result.isEndOfRule=o===void 0,o instanceof de.Terminal&&(this.result.token=o.terminalType,this.result.occurrence=o.idx)}else t.prototype.walkAtLeastOneSep.call(this,r,n,i)},e}(Oc);ut.NextTerminalAfterAtLeastOneSepWalker=fne;function Qx(t,e,r){r===void 0&&(r=[]),r=(0,la.default)(r);var n=[],i=0;function o(c){return c.concat((0,pr.default)(t,i+1))}function a(c){var l=Qx(o(c),e,r);return n.concat(l)}for(;r.length<e&&i<t.length;){var s=t[i];if(s instanceof de.Alternative)return a(s.definition);if(s instanceof de.NonTerminal)return a(s.definition);if(s instanceof de.Option)n=a(s.definition);else if(s instanceof de.RepetitionMandatory){var u=s.definition.concat([new de.Repetition({definition:s.definition})]);return a(u)}else if(s instanceof de.RepetitionMandatoryWithSeparator){var u=[new de.Alternative({definition:s.definition}),new de.Repetition({definition:[new de.Terminal({terminalType:s.separator})].concat(s.definition)})];return a(u)}else if(s instanceof de.RepetitionWithSeparator){var u=s.definition.concat([new de.Repetition({definition:[new de.Terminal({terminalType:s.separator})].concat(s.definition)})]);n=a(u)}else if(s instanceof de.Repetition){var u=s.definition.concat([new de.Repetition({definition:s.definition})]);n=a(u)}else{if(s instanceof de.Alternation)return(0,ane.default)(s.definition,function(c){(0,op.default)(c.definition)===!1&&(n=a(c.definition))}),n;if(s instanceof de.Terminal)r.push(s.terminalType);else throw Error("non exhaustive match")}i++}return n.push({partialPath:r,suffixDef:(0,pr.default)(t,i)}),n}ut.possiblePathsFrom=Qx;function pne(t,e,r,n){var i="EXIT_NONE_TERMINAL",o=[i],a="EXIT_ALTERNATIVE",s=!1,u=e.length,c=u-n-1,l=[],d=[];for(d.push({idx:-1,def:t,ruleStack:[],occurrenceStack:[]});!(0,op.default)(d);){var h=d.pop();if(h===a){s&&(0,one.default)(d).idx<=c&&d.pop();continue}var v=h.def,g=h.idx,R=h.ruleStack,E=h.occurrenceStack;if(!(0,op.default)(v)){var N=v[0];if(N===i){var A={idx:g,def:(0,pr.default)(v),ruleStack:(0,Yx.default)(R),occurrenceStack:(0,Yx.default)(E)};d.push(A)}else if(N instanceof de.Terminal)if(g<u-1){var b=g+1,O=e[b];if(r(O,N.terminalType)){var A={idx:b,def:(0,pr.default)(v),ruleStack:R,occurrenceStack:E};d.push(A)}}else if(g===u-1)l.push({nextTokenType:N.terminalType,nextTokenOccurrence:N.idx,ruleStack:R,occurrenceStack:E}),s=!0;else throw Error("non exhaustive match");else if(N instanceof de.NonTerminal){var $=(0,la.default)(R);$.push(N.nonTerminalName);var B=(0,la.default)(E);B.push(N.idx);var A={idx:g,def:N.definition.concat(o,(0,pr.default)(v)),ruleStack:$,occurrenceStack:B};d.push(A)}else if(N instanceof de.Option){var ee={idx:g,def:(0,pr.default)(v),ruleStack:R,occurrenceStack:E};d.push(ee),d.push(a);var Fe={idx:g,def:N.definition.concat((0,pr.default)(v)),ruleStack:R,occurrenceStack:E};d.push(Fe)}else if(N instanceof de.RepetitionMandatory){var Ne=new de.Repetition({definition:N.definition,idx:N.idx}),Je=N.definition.concat([Ne],(0,pr.default)(v)),A={idx:g,def:Je,ruleStack:R,occurrenceStack:E};d.push(A)}else if(N instanceof de.RepetitionMandatoryWithSeparator){var K=new de.Terminal({terminalType:N.separator}),Ne=new de.Repetition({definition:[K].concat(N.definition),idx:N.idx}),Je=N.definition.concat([Ne],(0,pr.default)(v)),A={idx:g,def:Je,ruleStack:R,occurrenceStack:E};d.push(A)}else if(N instanceof de.RepetitionWithSeparator){var ee={idx:g,def:(0,pr.default)(v),ruleStack:R,occurrenceStack:E};d.push(ee),d.push(a);var K=new de.Terminal({terminalType:N.separator}),le=new de.Repetition({definition:[K].concat(N.definition),idx:N.idx}),Je=N.definition.concat([le],(0,pr.default)(v)),Fe={idx:g,def:Je,ruleStack:R,occurrenceStack:E};d.push(Fe)}else if(N instanceof de.Repetition){var ee={idx:g,def:(0,pr.default)(v),ruleStack:R,occurrenceStack:E};d.push(ee),d.push(a);var le=new de.Repetition({definition:N.definition,idx:N.idx}),Je=N.definition.concat([le],(0,pr.default)(v)),Fe={idx:g,def:Je,ruleStack:R,occurrenceStack:E};d.push(Fe)}else if(N instanceof de.Alternation)for(var L=N.definition.length-1;L>=0;L--){var q=N.definition[L],F={idx:g,def:q.definition.concat((0,pr.default)(v)),ruleStack:R,occurrenceStack:E};d.push(F),d.push(a)}else if(N instanceof de.Alternative)d.push({idx:g,def:N.definition.concat((0,pr.default)(v)),ruleStack:R,occurrenceStack:E});else if(N instanceof de.Rule)d.push(hne(N,g,R,E));else throw Error("non exhaustive match")}}return l}ut.nextPossibleTokensAfter=pne;function hne(t,e,r,n){var i=(0,la.default)(r);i.push(t.name);var o=(0,la.default)(n);return o.push(1),{idx:e,def:t.definition,ruleStack:i,occurrenceStack:o}}});var Gs=f(Te=>{"use strict";var rq=Te&&Te.__extends||function(){var t=function(e,r){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(n[o]=i[o])},t(e,r)};return function(e,r){if(typeof r!="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");t(e,r);function n(){this.constructor=e}e.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),ma=Te&&Te.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(Te,"__esModule",{value:!0});Te.areTokenCategoriesNotUsed=Te.isStrictPrefixOfPath=Te.containsPath=Te.getLookaheadPathsForOptionalProd=Te.getLookaheadPathsForOr=Te.lookAheadSequenceFromAlternatives=Te.buildSingleAlternativeLookaheadFunction=Te.buildAlternativesLookAheadFunc=Te.buildLookaheadFuncForOptionalProd=Te.buildLookaheadFuncForOr=Te.getLookaheadPaths=Te.getProdType=Te.PROD_TYPE=void 0;var M_=ma(Or()),nq=ma(Sn()),ha=ma(Sc()),sp=ma(Ut()),pa=ma(Gt()),Zx=ma(Ir()),iq=ma(Ii()),eq=Dc(),mne=Lf(),up=ua(),_o=_t(),gne=_t(),Nt;(function(t){t[t.OPTION=0]="OPTION",t[t.REPETITION=1]="REPETITION",t[t.REPETITION_MANDATORY=2]="REPETITION_MANDATORY",t[t.REPETITION_MANDATORY_WITH_SEPARATOR=3]="REPETITION_MANDATORY_WITH_SEPARATOR",t[t.REPETITION_WITH_SEPARATOR=4]="REPETITION_WITH_SEPARATOR",t[t.ALTERNATION=5]="ALTERNATION"})(Nt=Te.PROD_TYPE||(Te.PROD_TYPE={}));function oq(t){if(t instanceof _o.Option||t==="Option")return Nt.OPTION;if(t instanceof _o.Repetition||t==="Repetition")return Nt.REPETITION;if(t instanceof _o.RepetitionMandatory||t==="RepetitionMandatory")return Nt.REPETITION_MANDATORY;if(t instanceof _o.RepetitionMandatoryWithSeparator||t==="RepetitionMandatoryWithSeparator")return Nt.REPETITION_MANDATORY_WITH_SEPARATOR;if(t instanceof _o.RepetitionWithSeparator||t==="RepetitionWithSeparator")return Nt.REPETITION_WITH_SEPARATOR;if(t instanceof _o.Alternation||t==="Alternation")return Nt.ALTERNATION;throw Error("non exhaustive match")}Te.getProdType=oq;function yne(t){var e=t.occurrence,r=t.rule,n=t.prodType,i=t.maxLookahead,o=oq(n);return o===Nt.ALTERNATION?F_(e,r,i):j_(e,r,o,i)}Te.getLookaheadPaths=yne;function vne(t,e,r,n,i,o){var a=F_(t,e,r),s=U_(a)?up.tokenStructuredMatcherNoCategories:up.tokenStructuredMatcher;return o(a,n,s,i)}Te.buildLookaheadFuncForOr=vne;function _ne(t,e,r,n,i,o){var a=j_(t,e,i,r),s=U_(a)?up.tokenStructuredMatcherNoCategories:up.tokenStructuredMatcher;return o(a[0],s,n)}Te.buildLookaheadFuncForOptionalProd=_ne;function Tne(t,e,r,n){var i=t.length,o=(0,ha.default)(t,function(u){return(0,ha.default)(u,function(c){return c.length===1})});if(e)return function(u){for(var c=(0,sp.default)(u,function(b){return b.GATE}),l=0;l<i;l++){var d=t[l],h=d.length,v=c[l];if(v!==void 0&&v.call(this)===!1)continue;e:for(var g=0;g<h;g++){for(var R=d[g],E=R.length,N=0;N<E;N++){var A=this.LA(N+1);if(r(A,R[N])===!1)continue e}return l}}};if(o&&!n){var a=(0,sp.default)(t,function(u){return(0,nq.default)(u)}),s=(0,iq.default)(a,function(u,c,l){return(0,pa.default)(c,function(d){(0,Zx.default)(u,d.tokenTypeIdx)||(u[d.tokenTypeIdx]=l),(0,pa.default)(d.categoryMatches,function(h){(0,Zx.default)(u,h)||(u[h]=l)})}),u},{});return function(){var u=this.LA(1);return s[u.tokenTypeIdx]}}else return function(){for(var u=0;u<i;u++){var c=t[u],l=c.length;e:for(var d=0;d<l;d++){for(var h=c[d],v=h.length,g=0;g<v;g++){var R=this.LA(g+1);if(r(R,h[g])===!1)continue e}return u}}}}Te.buildAlternativesLookAheadFunc=Tne;function Rne(t,e,r){var n=(0,ha.default)(t,function(c){return c.length===1}),i=t.length;if(n&&!r){var o=(0,nq.default)(t);if(o.length===1&&(0,M_.default)(o[0].categoryMatches)){var a=o[0],s=a.tokenTypeIdx;return function(){return this.LA(1).tokenTypeIdx===s}}else{var u=(0,iq.default)(o,function(c,l,d){return c[l.tokenTypeIdx]=!0,(0,pa.default)(l.categoryMatches,function(h){c[h]=!0}),c},[]);return function(){var c=this.LA(1);return u[c.tokenTypeIdx]===!0}}}else return function(){e:for(var c=0;c<i;c++){for(var l=t[c],d=l.length,h=0;h<d;h++){var v=this.LA(h+1);if(e(v,l[h])===!1)continue e}return!0}return!1}}Te.buildSingleAlternativeLookaheadFunction=Rne;var bne=function(t){rq(e,t);function e(r,n,i){var o=t.call(this)||this;return o.topProd=r,o.targetOccurrence=n,o.targetProdType=i,o}return e.prototype.startWalking=function(){return this.walk(this.topProd),this.restDef},e.prototype.checkIsTarget=function(r,n,i,o){return r.idx===this.targetOccurrence&&this.targetProdType===n?(this.restDef=i.concat(o),!0):!1},e.prototype.walkOption=function(r,n,i){this.checkIsTarget(r,Nt.OPTION,n,i)||t.prototype.walkOption.call(this,r,n,i)},e.prototype.walkAtLeastOne=function(r,n,i){this.checkIsTarget(r,Nt.REPETITION_MANDATORY,n,i)||t.prototype.walkOption.call(this,r,n,i)},e.prototype.walkAtLeastOneSep=function(r,n,i){this.checkIsTarget(r,Nt.REPETITION_MANDATORY_WITH_SEPARATOR,n,i)||t.prototype.walkOption.call(this,r,n,i)},e.prototype.walkMany=function(r,n,i){this.checkIsTarget(r,Nt.REPETITION,n,i)||t.prototype.walkOption.call(this,r,n,i)},e.prototype.walkManySep=function(r,n,i){this.checkIsTarget(r,Nt.REPETITION_WITH_SEPARATOR,n,i)||t.prototype.walkOption.call(this,r,n,i)},e}(mne.RestWalker),aq=function(t){rq(e,t);function e(r,n,i){var o=t.call(this)||this;return o.targetOccurrence=r,o.targetProdType=n,o.targetRef=i,o.result=[],o}return e.prototype.checkIsTarget=function(r,n){r.idx===this.targetOccurrence&&this.targetProdType===n&&(this.targetRef===void 0||r===this.targetRef)&&(this.result=r.definition)},e.prototype.visitOption=function(r){this.checkIsTarget(r,Nt.OPTION)},e.prototype.visitRepetition=function(r){this.checkIsTarget(r,Nt.REPETITION)},e.prototype.visitRepetitionMandatory=function(r){this.checkIsTarget(r,Nt.REPETITION_MANDATORY)},e.prototype.visitRepetitionMandatoryWithSeparator=function(r){this.checkIsTarget(r,Nt.REPETITION_MANDATORY_WITH_SEPARATOR)},e.prototype.visitRepetitionWithSeparator=function(r){this.checkIsTarget(r,Nt.REPETITION_WITH_SEPARATOR)},e.prototype.visitAlternation=function(r){this.checkIsTarget(r,Nt.ALTERNATION)},e}(gne.GAstVisitor);function tq(t){for(var e=new Array(t),r=0;r<t;r++)e[r]=[];return e}function L_(t){for(var e=[""],r=0;r<t.length;r++){for(var n=t[r],i=[],o=0;o<e.length;o++){var a=e[o];i.push(a+"_"+n.tokenTypeIdx);for(var s=0;s<n.categoryMatches.length;s++){var u="_"+n.categoryMatches[s];i.push(a+u)}}e=i}return e}function Ane(t,e,r){for(var n=0;n<t.length;n++)if(n!==r)for(var i=t[n],o=0;o<e.length;o++){var a=e[o];if(i[a]===!0)return!1}return!0}function $_(t,e){for(var r=(0,sp.default)(t,function(l){return(0,eq.possiblePathsFrom)([l],1)}),n=tq(r.length),i=(0,sp.default)(r,function(l){var d={};return(0,pa.default)(l,function(h){var v=L_(h.partialPath);(0,pa.default)(v,function(g){d[g]=!0})}),d}),o=r,a=1;a<=e;a++){var s=o;o=tq(s.length);for(var u=function(l){for(var d=s[l],h=0;h<d.length;h++){var v=d[h].partialPath,g=d[h].suffixDef,R=L_(v),E=Ane(i,R,l);if(E||(0,M_.default)(g)||v.length===e){var N=n[l];if(sq(N,v)===!1){N.push(v);for(var A=0;A<R.length;A++){var b=R[A];i[l][b]=!0}}}else{var O=(0,eq.possiblePathsFrom)(g,a+1,v);o[l]=o[l].concat(O),(0,pa.default)(O,function($){var B=L_($.partialPath);(0,pa.default)(B,function(ee){i[l][ee]=!0})})}}},c=0;c<s.length;c++)u(c)}return n}Te.lookAheadSequenceFromAlternatives=$_;function F_(t,e,r,n){var i=new aq(t,Nt.ALTERNATION,n);return e.accept(i),$_(i.result,r)}Te.getLookaheadPathsForOr=F_;function j_(t,e,r,n){var i=new aq(t,r);e.accept(i);var o=i.result,a=new bne(e,t,r),s=a.startWalking(),u=new _o.Alternative({definition:o}),c=new _o.Alternative({definition:s});return $_([u,c],n)}Te.getLookaheadPathsForOptionalProd=j_;function sq(t,e){e:for(var r=0;r<t.length;r++){var n=t[r];if(n.length===e.length){for(var i=0;i<n.length;i++){var o=e[i],a=n[i],s=o===a||a.categoryMatchesMap[o.tokenTypeIdx]!==void 0;if(s===!1)continue e}return!0}}return!1}Te.containsPath=sq;function Pne(t,e){return t.length<e.length&&(0,ha.default)(t,function(r,n){var i=e[n];return r===i||i.categoryMatchesMap[r.tokenTypeIdx]})}Te.isStrictPrefixOfPath=Pne;function U_(t){return(0,ha.default)(t,function(e){return(0,ha.default)(e,function(r){return(0,ha.default)(r,function(n){return(0,M_.default)(n.categoryMatches)})})})}Te.areTokenCategoriesNotUsed=U_});var qc=f(me=>{"use strict";var H_=me&&me.__extends||function(){var t=function(e,r){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(n[o]=i[o])},t(e,r)};return function(e,r){if(typeof r!="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");t(e,r);function n(){this.constructor=e}e.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),G_=me&&me.__assign||function(){return G_=Object.assign||function(t){for(var e,r=1,n=arguments.length;r<n;r++){e=arguments[r];for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])}return t},G_.apply(this,arguments)},Ht=me&&me.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(me,"__esModule",{value:!0});me.checkPrefixAlternativesAmbiguities=me.validateSomeNonEmptyLookaheadPath=me.validateTooManyAlts=me.RepetitionCollector=me.validateAmbiguousAlternationAlternatives=me.validateEmptyOrAlternative=me.getFirstNoneTerminal=me.validateNoLeftRecursion=me.validateRuleIsOverridden=me.validateRuleDoesNotAlreadyExist=me.OccurrenceValidationCollector=me.identifyProductionForDuplicates=me.validateGrammar=me.validateLookahead=void 0;var uq=Ht(Ls()),cp=Ht(Or()),Sne=Ht(Nf()),cq=Ht(Sn()),Cne=Ht(Ec()),Ene=Ht(Gf()),Nne=Ht(Hf()),To=Ht(Ut()),xc=Ht(Gt()),kne=Ht(q_()),W_=Ht(Ii()),wne=Ht(Zv()),One=Ht(Yn()),B_=Ht(Di()),ji=Ht(np()),Dne=Ht(wi()),Nn=Ar(),K_=_t(),Hs=Gs(),Ine=Dc(),En=_t(),z_=_t(),xne=Ht(ip()),qne=Ht(Cc()),Lne=ua();function Mne(t){var e=t.lookaheadStrategy.validate({rules:t.rules,tokenTypes:t.tokenTypes,grammarName:t.grammarName});return(0,To.default)(e,function(r){return G_({type:Nn.ParserDefinitionErrorType.CUSTOM_LOOKAHEAD_VALIDATION},r)})}me.validateLookahead=Mne;function $ne(t,e,r,n){var i=(0,ji.default)(t,function(u){return Fne(u,r)}),o=Bne(t,e,r),a=(0,ji.default)(t,function(u){return gq(u,r)}),s=(0,ji.default)(t,function(u){return pq(u,t,n,r)});return i.concat(o,a,s)}me.validateGrammar=$ne;function Fne(t,e){var r=new fq;t.accept(r);var n=r.allProductions,i=(0,kne.default)(n,lq),o=(0,wne.default)(i,function(s){return s.length>1}),a=(0,To.default)((0,One.default)(o),function(s){var u=(0,uq.default)(s),c=e.buildDuplicateFoundError(t,s),l=(0,K_.getProductionDslName)(u),d={message:c,type:Nn.ParserDefinitionErrorType.DUPLICATE_PRODUCTIONS,ruleName:t.name,dslName:l,occurrence:u.idx},h=dq(u);return h&&(d.parameter=h),d});return a}function lq(t){return"".concat((0,K_.getProductionDslName)(t),"_#_").concat(t.idx,"_#_").concat(dq(t))}me.identifyProductionForDuplicates=lq;function dq(t){return t instanceof En.Terminal?t.terminalType.name:t instanceof En.NonTerminal?t.nonTerminalName:""}var fq=function(t){H_(e,t);function e(){var r=t!==null&&t.apply(this,arguments)||this;return r.allProductions=[],r}return e.prototype.visitNonTerminal=function(r){this.allProductions.push(r)},e.prototype.visitOption=function(r){this.allProductions.push(r)},e.prototype.visitRepetitionWithSeparator=function(r){this.allProductions.push(r)},e.prototype.visitRepetitionMandatory=function(r){this.allProductions.push(r)},e.prototype.visitRepetitionMandatoryWithSeparator=function(r){this.allProductions.push(r)},e.prototype.visitRepetition=function(r){this.allProductions.push(r)},e.prototype.visitAlternation=function(r){this.allProductions.push(r)},e.prototype.visitTerminal=function(r){this.allProductions.push(r)},e}(z_.GAstVisitor);me.OccurrenceValidationCollector=fq;function pq(t,e,r,n){var i=[],o=(0,W_.default)(e,function(s,u){return u.name===t.name?s+1:s},0);if(o>1){var a=n.buildDuplicateRuleNameError({topLevelRule:t,grammarName:r});i.push({message:a,type:Nn.ParserDefinitionErrorType.DUPLICATE_RULE_NAME,ruleName:t.name})}return i}me.validateRuleDoesNotAlreadyExist=pq;function jne(t,e,r){var n=[],i;return(0,B_.default)(e,t)||(i="Invalid rule override, rule: ->".concat(t,"<- cannot be overridden in the grammar: ->").concat(r,"<-")+"as it is not defined in any of the super grammars ",n.push({message:i,type:Nn.ParserDefinitionErrorType.INVALID_RULE_OVERRIDE,ruleName:t})),n}me.validateRuleIsOverridden=jne;function hq(t,e,r,n){n===void 0&&(n=[]);var i=[],o=Ic(e.definition);if((0,cp.default)(o))return[];var a=t.name,s=(0,B_.default)(o,t);s&&i.push({message:r.buildLeftRecursionError({topLevelRule:t,leftRecursionPath:n}),type:Nn.ParserDefinitionErrorType.LEFT_RECURSION,ruleName:a});var u=(0,Nne.default)(o,n.concat([t])),c=(0,ji.default)(u,function(l){var d=(0,Dne.default)(n);return d.push(l),hq(t,l,r,d)});return i.concat(c)}me.validateNoLeftRecursion=hq;function Ic(t){var e=[];if((0,cp.default)(t))return e;var r=(0,uq.default)(t);if(r instanceof En.NonTerminal)e.push(r.referencedRule);else if(r instanceof En.Alternative||r instanceof En.Option||r instanceof En.RepetitionMandatory||r instanceof En.RepetitionMandatoryWithSeparator||r instanceof En.RepetitionWithSeparator||r instanceof En.Repetition)e=e.concat(Ic(r.definition));else if(r instanceof En.Alternation)e=(0,cq.default)((0,To.default)(r.definition,function(a){return Ic(a.definition)}));else if(!(r instanceof En.Terminal))throw Error("non exhaustive match");var n=(0,K_.isOptionalProd)(r),i=t.length>1;if(n&&i){var o=(0,Sne.default)(t);return e.concat(Ic(o))}else return e}me.getFirstNoneTerminal=Ic;var V_=function(t){H_(e,t);function e(){var r=t!==null&&t.apply(this,arguments)||this;return r.alternations=[],r}return e.prototype.visitAlternation=function(r){this.alternations.push(r)},e}(z_.GAstVisitor);function Une(t,e){var r=new V_;t.accept(r);var n=r.alternations,i=(0,ji.default)(n,function(o){var a=(0,xne.default)(o.definition);return(0,ji.default)(a,function(s,u){var c=(0,Ine.nextPossibleTokensAfter)([s],[],Lne.tokenStructuredMatcher,1);return(0,cp.default)(c)?[{message:e.buildEmptyAlternationError({topLevelRule:t,alternation:o,emptyChoiceIdx:u}),type:Nn.ParserDefinitionErrorType.NONE_LAST_EMPTY_ALT,ruleName:t.name,occurrence:o.idx,alternative:u+1}]:[]})});return i}me.validateEmptyOrAlternative=Une;function Gne(t,e,r){var n=new V_;t.accept(n);var i=n.alternations;i=(0,Ene.default)(i,function(a){return a.ignoreAmbiguities===!0});var o=(0,ji.default)(i,function(a){var s=a.idx,u=a.maxLookahead||e,c=(0,Hs.getLookaheadPathsForOr)(s,t,u,a),l=Wne(c,a,t,r),d=yq(c,a,t,r);return l.concat(d)});return o}me.validateAmbiguousAlternationAlternatives=Gne;var mq=function(t){H_(e,t);function e(){var r=t!==null&&t.apply(this,arguments)||this;return r.allProductions=[],r}return e.prototype.visitRepetitionWithSeparator=function(r){this.allProductions.push(r)},e.prototype.visitRepetitionMandatory=function(r){this.allProductions.push(r)},e.prototype.visitRepetitionMandatoryWithSeparator=function(r){this.allProductions.push(r)},e.prototype.visitRepetition=function(r){this.allProductions.push(r)},e}(z_.GAstVisitor);me.RepetitionCollector=mq;function gq(t,e){var r=new V_;t.accept(r);var n=r.alternations,i=(0,ji.default)(n,function(o){return o.definition.length>255?[{message:e.buildTooManyAlternativesError({topLevelRule:t,alternation:o}),type:Nn.ParserDefinitionErrorType.TOO_MANY_ALTS,ruleName:t.name,occurrence:o.idx}]:[]});return i}me.validateTooManyAlts=gq;function Hne(t,e,r){var n=[];return(0,xc.default)(t,function(i){var o=new mq;i.accept(o);var a=o.allProductions;(0,xc.default)(a,function(s){var u=(0,Hs.getProdType)(s),c=s.maxLookahead||e,l=s.idx,d=(0,Hs.getLookaheadPathsForOptionalProd)(l,i,u,c),h=d[0];if((0,cp.default)((0,cq.default)(h))){var v=r.buildEmptyRepetitionError({topLevelRule:i,repetition:s});n.push({message:v,type:Nn.ParserDefinitionErrorType.NO_NON_EMPTY_LOOKAHEAD,ruleName:i.name})}})}),n}me.validateSomeNonEmptyLookaheadPath=Hne;function Wne(t,e,r,n){var i=[],o=(0,W_.default)(t,function(s,u,c){return e.definition[c].ignoreAmbiguities===!0||(0,xc.default)(u,function(l){var d=[c];(0,xc.default)(t,function(h,v){c!==v&&(0,Hs.containsPath)(h,l)&&e.definition[v].ignoreAmbiguities!==!0&&d.push(v)}),d.length>1&&!(0,Hs.containsPath)(i,l)&&(i.push(l),s.push({alts:d,path:l}))}),s},[]),a=(0,To.default)(o,function(s){var u=(0,To.default)(s.alts,function(l){return l+1}),c=n.buildAlternationAmbiguityError({topLevelRule:r,alternation:e,ambiguityIndices:u,prefixPath:s.path});return{message:c,type:Nn.ParserDefinitionErrorType.AMBIGUOUS_ALTS,ruleName:r.name,occurrence:e.idx,alternatives:s.alts}});return a}function yq(t,e,r,n){var i=(0,W_.default)(t,function(a,s,u){var c=(0,To.default)(s,function(l){return{idx:u,path:l}});return a.concat(c)},[]),o=(0,qne.default)((0,ji.default)(i,function(a){var s=e.definition[a.idx];if(s.ignoreAmbiguities===!0)return[];var u=a.idx,c=a.path,l=(0,Cne.default)(i,function(h){return e.definition[h.idx].ignoreAmbiguities!==!0&&h.idx<u&&(0,Hs.isStrictPrefixOfPath)(h.path,c)}),d=(0,To.default)(l,function(h){var v=[h.idx+1,u+1],g=e.idx===0?"":e.idx,R=n.buildAlternationPrefixAmbiguityError({topLevelRule:r,alternation:e,ambiguityIndices:v,prefixPath:h.path});return{message:R,type:Nn.ParserDefinitionErrorType.AMBIGUOUS_PREFIX_ALTS,ruleName:r.name,occurrence:g,alternatives:v}});return d}));return o}me.checkPrefixAlternativesAmbiguities=yq;function Bne(t,e,r){var n=[],i=(0,To.default)(e,function(o){return o.name});return(0,xc.default)(t,function(o){var a=o.name;if((0,B_.default)(i,a)){var s=r.buildNamespaceConflictError(o);n.push({message:s,type:Nn.ParserDefinitionErrorType.CONFLICT_TOKENS_RULES_NAMESPACE,ruleName:a})}}),n}});var Rq=f(Ro=>{"use strict";var vq=Ro&&Ro.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(Ro,"__esModule",{value:!0});Ro.validateGrammar=Ro.resolveGrammar=void 0;var Kne=vq(Gt()),_q=vq(p_()),zne=Fx(),Vne=qc(),Tq=Us();function Yne(t){var e=(0,_q.default)(t,{errMsgProvider:Tq.defaultGrammarResolverErrorProvider}),r={};return(0,Kne.default)(t.rules,function(n){r[n.name]=n}),(0,zne.resolveGrammar)(r,e.errMsgProvider)}Ro.resolveGrammar=Yne;function Xne(t){return t=(0,_q.default)(t,{errMsgProvider:Tq.defaultGrammarValidatorErrorProvider}),(0,Vne.validateGrammar)(t.rules,t.tokenTypes,t.errMsgProvider,t.grammarName)}Ro.validateGrammar=Xne});var Ws=f(or=>{"use strict";var Lc=or&&or.__extends||function(){var t=function(e,r){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(n[o]=i[o])},t(e,r)};return function(e,r){if(typeof r!="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");t(e,r);function n(){this.constructor=e}e.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),Jne=or&&or.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(or,"__esModule",{value:!0});or.EarlyExitException=or.NotAllInputParsedException=or.NoViableAltException=or.MismatchedTokenException=or.isRecognitionException=void 0;var Qne=Jne(Di()),bq="MismatchedTokenException",Aq="NoViableAltException",Pq="EarlyExitException",Sq="NotAllInputParsedException",Cq=[bq,Aq,Pq,Sq];Object.freeze(Cq);function Zne(t){return(0,Qne.default)(Cq,t.name)}or.isRecognitionException=Zne;var lp=function(t){Lc(e,t);function e(r,n){var i=this.constructor,o=t.call(this,r)||this;return o.token=n,o.resyncedTokens=[],Object.setPrototypeOf(o,i.prototype),Error.captureStackTrace&&Error.captureStackTrace(o,o.constructor),o}return e}(Error),eie=function(t){Lc(e,t);function e(r,n,i){var o=t.call(this,r,n)||this;return o.previousToken=i,o.name=bq,o}return e}(lp);or.MismatchedTokenException=eie;var tie=function(t){Lc(e,t);function e(r,n,i){var o=t.call(this,r,n)||this;return o.previousToken=i,o.name=Aq,o}return e}(lp);or.NoViableAltException=tie;var rie=function(t){Lc(e,t);function e(r,n){var i=t.call(this,r,n)||this;return i.name=Sq,i}return e}(lp);or.NotAllInputParsedException=rie;var nie=function(t){Lc(e,t);function e(r,n,i){var o=t.call(this,r,n)||this;return o.previousToken=i,o.name=Pq,o}return e}(lp);or.EarlyExitException=nie});var X_=f(kt=>{"use strict";var iie=kt&&kt.__extends||function(){var t=function(e,r){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(n[o]=i[o])},t(e,r)};return function(e,r){if(typeof r!="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");t(e,r);function n(){this.constructor=e}e.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),bo=kt&&kt.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(kt,"__esModule",{value:!0});kt.attemptInRepetitionRecovery=kt.Recoverable=kt.InRuleRecoveryException=kt.IN_RULE_RECOVERY_EXCEPTION=kt.EOF_FOLLOW_KEY=void 0;var Mc=ca(),oie=bo(Or()),Eq=bo(ip()),aie=bo(Sn()),Y_=bo(Ut()),Nq=bo(Wf()),sie=bo(Ir()),uie=bo(Di()),cie=bo(wi()),lie=Ws(),die=d_(),fie=Ar();kt.EOF_FOLLOW_KEY={};kt.IN_RULE_RECOVERY_EXCEPTION="InRuleRecoveryException";var kq=function(t){iie(e,t);function e(r){var n=t.call(this,r)||this;return n.name=kt.IN_RULE_RECOVERY_EXCEPTION,n}return e}(Error);kt.InRuleRecoveryException=kq;var pie=function(){function t(){}return t.prototype.initRecoverable=function(e){this.firstAfterRepMap={},this.resyncFollows={},this.recoveryEnabled=(0,sie.default)(e,"recoveryEnabled")?e.recoveryEnabled:fie.DEFAULT_PARSER_CONFIG.recoveryEnabled,this.recoveryEnabled&&(this.attemptInRepetitionRecovery=wq)},t.prototype.getTokenToInsert=function(e){var r=(0,Mc.createTokenInstance)(e,"",NaN,NaN,NaN,NaN,NaN,NaN);return r.isInsertedInRecovery=!0,r},t.prototype.canTokenTypeBeInsertedInRecovery=function(e){return!0},t.prototype.canTokenTypeBeDeletedInRecovery=function(e){return!0},t.prototype.tryInRepetitionRecovery=function(e,r,n,i){for(var o=this,a=this.findReSyncTokenType(),s=this.exportLexerState(),u=[],c=!1,l=this.LA(1),d=this.LA(1),h=function(){var v=o.LA(0),g=o.errorMessageProvider.buildMismatchTokenMessage({expected:i,actual:l,previous:v,ruleName:o.getCurrRuleFullName()}),R=new lie.MismatchedTokenException(g,l,o.LA(0));R.resyncedTokens=(0,Eq.default)(u),o.SAVE_ERROR(R)};!c;)if(this.tokenMatcher(d,i)){h();return}else if(n.call(this)){h(),e.apply(this,r);return}else this.tokenMatcher(d,a)?c=!0:(d=this.SKIP_TOKEN(),this.addToResyncTokens(d,u));this.importLexerState(s)},t.prototype.shouldInRepetitionRecoveryBeTried=function(e,r,n){return!(n===!1||this.tokenMatcher(this.LA(1),e)||this.isBackTracking()||this.canPerformInRuleRecovery(e,this.getFollowsForInRuleRecovery(e,r)))},t.prototype.getFollowsForInRuleRecovery=function(e,r){var n=this.getCurrentGrammarPath(e,r),i=this.getNextPossibleTokenTypes(n);return i},t.prototype.tryInRuleRecovery=function(e,r){if(this.canRecoverWithSingleTokenInsertion(e,r)){var n=this.getTokenToInsert(e);return n}if(this.canRecoverWithSingleTokenDeletion(e)){var i=this.SKIP_TOKEN();return this.consumeToken(),i}throw new kq("sad sad panda")},t.prototype.canPerformInRuleRecovery=function(e,r){return this.canRecoverWithSingleTokenInsertion(e,r)||this.canRecoverWithSingleTokenDeletion(e)},t.prototype.canRecoverWithSingleTokenInsertion=function(e,r){var n=this;if(!this.canTokenTypeBeInsertedInRecovery(e)||(0,oie.default)(r))return!1;var i=this.LA(1),o=(0,Nq.default)(r,function(a){return n.tokenMatcher(i,a)})!==void 0;return o},t.prototype.canRecoverWithSingleTokenDeletion=function(e){if(!this.canTokenTypeBeDeletedInRecovery(e))return!1;var r=this.tokenMatcher(this.LA(2),e);return r},t.prototype.isInCurrentRuleReSyncSet=function(e){var r=this.getCurrFollowKey(),n=this.getFollowSetFromFollowKey(r);return(0,uie.default)(n,e)},t.prototype.findReSyncTokenType=function(){for(var e=this.flattenFollowSet(),r=this.LA(1),n=2;;){var i=(0,Nq.default)(e,function(o){var a=(0,Mc.tokenMatcher)(r,o);return a});if(i!==void 0)return i;r=this.LA(n),n++}},t.prototype.getCurrFollowKey=function(){if(this.RULE_STACK.length===1)return kt.EOF_FOLLOW_KEY;var e=this.getLastExplicitRuleShortName(),r=this.getLastExplicitRuleOccurrenceIndex(),n=this.getPreviousExplicitRuleShortName();return{ruleName:this.shortRuleNameToFullName(e),idxInCallingRule:r,inRule:this.shortRuleNameToFullName(n)}},t.prototype.buildFullFollowKeyStack=function(){var e=this,r=this.RULE_STACK,n=this.RULE_OCCURRENCE_STACK;return(0,Y_.default)(r,function(i,o){return o===0?kt.EOF_FOLLOW_KEY:{ruleName:e.shortRuleNameToFullName(i),idxInCallingRule:n[o],inRule:e.shortRuleNameToFullName(r[o-1])}})},t.prototype.flattenFollowSet=function(){var e=this,r=(0,Y_.default)(this.buildFullFollowKeyStack(),function(n){return e.getFollowSetFromFollowKey(n)});return(0,aie.default)(r)},t.prototype.getFollowSetFromFollowKey=function(e){if(e===kt.EOF_FOLLOW_KEY)return[Mc.EOF];var r=e.ruleName+e.idxInCallingRule+die.IN+e.inRule;return this.resyncFollows[r]},t.prototype.addToResyncTokens=function(e,r){return this.tokenMatcher(e,Mc.EOF)||r.push(e),r},t.prototype.reSyncTo=function(e){for(var r=[],n=this.LA(1);this.tokenMatcher(n,e)===!1;)n=this.SKIP_TOKEN(),this.addToResyncTokens(n,r);return(0,Eq.default)(r)},t.prototype.attemptInRepetitionRecovery=function(e,r,n,i,o,a,s){},t.prototype.getCurrentGrammarPath=function(e,r){var n=this.getHumanReadableRuleStack(),i=(0,cie.default)(this.RULE_OCCURRENCE_STACK),o={ruleStack:n,occurrenceStack:i,lastTok:e,lastTokOccurrence:r};return o},t.prototype.getHumanReadableRuleStack=function(){var e=this;return(0,Y_.default)(this.RULE_STACK,function(r){return e.shortRuleNameToFullName(r)})},t}();kt.Recoverable=pie;function wq(t,e,r,n,i,o,a){var s=this.getKeyForAutomaticLookahead(n,i),u=this.firstAfterRepMap[s];if(u===void 0){var c=this.getCurrRuleFullName(),l=this.getGAstProductions()[c],d=new o(l,i);u=d.startWalking(),this.firstAfterRepMap[s]=u}var h=u.token,v=u.occurrence,g=u.isEndOfRule;this.RULE_STACK.length===1&&g&&h===void 0&&(h=Mc.EOF,v=1),!(h===void 0||v===void 0)&&this.shouldInRepetitionRecoveryBeTried(h,v,a)&&this.tryInRepetitionRecovery(t,e,r,h)}kt.attemptInRepetitionRecovery=wq});var dp=f(Ee=>{"use strict";Object.defineProperty(Ee,"__esModule",{value:!0});Ee.getKeyForAutomaticLookahead=Ee.AT_LEAST_ONE_SEP_IDX=Ee.MANY_SEP_IDX=Ee.AT_LEAST_ONE_IDX=Ee.MANY_IDX=Ee.OPTION_IDX=Ee.OR_IDX=Ee.BITS_FOR_ALT_IDX=Ee.BITS_FOR_RULE_IDX=Ee.BITS_FOR_OCCURRENCE_IDX=Ee.BITS_FOR_METHOD_TYPE=void 0;Ee.BITS_FOR_METHOD_TYPE=4;Ee.BITS_FOR_OCCURRENCE_IDX=8;Ee.BITS_FOR_RULE_IDX=12;Ee.BITS_FOR_ALT_IDX=8;Ee.OR_IDX=1<<Ee.BITS_FOR_OCCURRENCE_IDX;Ee.OPTION_IDX=2<<Ee.BITS_FOR_OCCURRENCE_IDX;Ee.MANY_IDX=3<<Ee.BITS_FOR_OCCURRENCE_IDX;Ee.AT_LEAST_ONE_IDX=4<<Ee.BITS_FOR_OCCURRENCE_IDX;Ee.MANY_SEP_IDX=5<<Ee.BITS_FOR_OCCURRENCE_IDX;Ee.AT_LEAST_ONE_SEP_IDX=6<<Ee.BITS_FOR_OCCURRENCE_IDX;function hie(t,e,r){return r|e|t}Ee.getKeyForAutomaticLookahead=hie;var Qye=32-Ee.BITS_FOR_ALT_IDX});var Q_=f(Ao=>{"use strict";var fp=Ao&&Ao.__spreadArray||function(t,e,r){if(r||arguments.length===2)for(var n=0,i=e.length,o;n<i;n++)(o||!(n in e))&&(o||(o=Array.prototype.slice.call(e,0,n)),o[n]=e[n]);return t.concat(o||Array.prototype.slice.call(e))},Oq=Ao&&Ao.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(Ao,"__esModule",{value:!0});Ao.LLkLookaheadStrategy=void 0;var J_=Oq(np()),mie=Oq(Or()),pp=Us(),gie=Ar(),hp=qc(),$c=Gs(),yie=function(){function t(e){var r;this.maxLookahead=(r=e?.maxLookahead)!==null&&r!==void 0?r:gie.DEFAULT_PARSER_CONFIG.maxLookahead}return t.prototype.validate=function(e){var r=this.validateNoLeftRecursion(e.rules);if((0,mie.default)(r)){var n=this.validateEmptyOrAlternatives(e.rules),i=this.validateAmbiguousAlternationAlternatives(e.rules,this.maxLookahead),o=this.validateSomeNonEmptyLookaheadPath(e.rules,this.maxLookahead),a=fp(fp(fp(fp([],r,!0),n,!0),i,!0),o,!0);return a}return r},t.prototype.validateNoLeftRecursion=function(e){return(0,J_.default)(e,function(r){return(0,hp.validateNoLeftRecursion)(r,r,pp.defaultGrammarValidatorErrorProvider)})},t.prototype.validateEmptyOrAlternatives=function(e){return(0,J_.default)(e,function(r){return(0,hp.validateEmptyOrAlternative)(r,pp.defaultGrammarValidatorErrorProvider)})},t.prototype.validateAmbiguousAlternationAlternatives=function(e,r){return(0,J_.default)(e,function(n){return(0,hp.validateAmbiguousAlternationAlternatives)(n,r,pp.defaultGrammarValidatorErrorProvider)})},t.prototype.validateSomeNonEmptyLookaheadPath=function(e,r){return(0,hp.validateSomeNonEmptyLookaheadPath)(e,r,pp.defaultGrammarValidatorErrorProvider)},t.prototype.buildLookaheadForAlternation=function(e){return(0,$c.buildLookaheadFuncForOr)(e.prodOccurrence,e.rule,e.maxLookahead,e.hasPredicates,e.dynamicTokensEnabled,$c.buildAlternativesLookAheadFunc)},t.prototype.buildLookaheadForOptional=function(e){return(0,$c.buildLookaheadFuncForOptionalProd)(e.prodOccurrence,e.rule,e.maxLookahead,e.dynamicTokensEnabled,(0,$c.getProdType)(e.prodType),$c.buildSingleAlternativeLookaheadFunction)},t}();Ao.LLkLookaheadStrategy=yie});var qq=f(ii=>{"use strict";var vie=ii&&ii.__extends||function(){var t=function(e,r){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(n[o]=i[o])},t(e,r)};return function(e,r){if(typeof r!="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");t(e,r);function n(){this.constructor=e}e.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),Iq=ii&&ii.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(ii,"__esModule",{value:!0});ii.collectMethods=ii.LooksAhead=void 0;var ga=Iq(Gt()),Z_=Iq(Ir()),Dq=Ar(),Ui=dp(),_ie=_t(),Bs=_t(),Tie=Q_(),Rie=function(){function t(){}return t.prototype.initLooksAhead=function(e){this.dynamicTokensEnabled=(0,Z_.default)(e,"dynamicTokensEnabled")?e.dynamicTokensEnabled:Dq.DEFAULT_PARSER_CONFIG.dynamicTokensEnabled,this.maxLookahead=(0,Z_.default)(e,"maxLookahead")?e.maxLookahead:Dq.DEFAULT_PARSER_CONFIG.maxLookahead,this.lookaheadStrategy=(0,Z_.default)(e,"lookaheadStrategy")?e.lookaheadStrategy:new Tie.LLkLookaheadStrategy({maxLookahead:this.maxLookahead}),this.lookAheadFuncsCache=new Map},t.prototype.preComputeLookaheadFunctions=function(e){var r=this;(0,ga.default)(e,function(n){r.TRACE_INIT("".concat(n.name," Rule Lookahead"),function(){var i=xq(n),o=i.alternation,a=i.repetition,s=i.option,u=i.repetitionMandatory,c=i.repetitionMandatoryWithSeparator,l=i.repetitionWithSeparator;(0,ga.default)(o,function(d){var h=d.idx===0?"":d.idx;r.TRACE_INIT("".concat((0,Bs.getProductionDslName)(d)).concat(h),function(){var v=r.lookaheadStrategy.buildLookaheadForAlternation({prodOccurrence:d.idx,rule:n,maxLookahead:d.maxLookahead||r.maxLookahead,hasPredicates:d.hasPredicates,dynamicTokensEnabled:r.dynamicTokensEnabled}),g=(0,Ui.getKeyForAutomaticLookahead)(r.fullRuleNameToShort[n.name],Ui.OR_IDX,d.idx);r.setLaFuncCache(g,v)})}),(0,ga.default)(a,function(d){r.computeLookaheadFunc(n,d.idx,Ui.MANY_IDX,"Repetition",d.maxLookahead,(0,Bs.getProductionDslName)(d))}),(0,ga.default)(s,function(d){r.computeLookaheadFunc(n,d.idx,Ui.OPTION_IDX,"Option",d.maxLookahead,(0,Bs.getProductionDslName)(d))}),(0,ga.default)(u,function(d){r.computeLookaheadFunc(n,d.idx,Ui.AT_LEAST_ONE_IDX,"RepetitionMandatory",d.maxLookahead,(0,Bs.getProductionDslName)(d))}),(0,ga.default)(c,function(d){r.computeLookaheadFunc(n,d.idx,Ui.AT_LEAST_ONE_SEP_IDX,"RepetitionMandatoryWithSeparator",d.maxLookahead,(0,Bs.getProductionDslName)(d))}),(0,ga.default)(l,function(d){r.computeLookaheadFunc(n,d.idx,Ui.MANY_SEP_IDX,"RepetitionWithSeparator",d.maxLookahead,(0,Bs.getProductionDslName)(d))})})})},t.prototype.computeLookaheadFunc=function(e,r,n,i,o,a){var s=this;this.TRACE_INIT("".concat(a).concat(r===0?"":r),function(){var u=s.lookaheadStrategy.buildLookaheadForOptional({prodOccurrence:r,rule:e,maxLookahead:o||s.maxLookahead,dynamicTokensEnabled:s.dynamicTokensEnabled,prodType:i}),c=(0,Ui.getKeyForAutomaticLookahead)(s.fullRuleNameToShort[e.name],n,r);s.setLaFuncCache(c,u)})},t.prototype.getKeyForAutomaticLookahead=function(e,r){var n=this.getLastExplicitRuleShortName();return(0,Ui.getKeyForAutomaticLookahead)(n,e,r)},t.prototype.getLaFuncFromCache=function(e){return this.lookAheadFuncsCache.get(e)},t.prototype.setLaFuncCache=function(e,r){this.lookAheadFuncsCache.set(e,r)},t}();ii.LooksAhead=Rie;var bie=function(t){vie(e,t);function e(){var r=t!==null&&t.apply(this,arguments)||this;return r.dslMethods={option:[],alternation:[],repetition:[],repetitionWithSeparator:[],repetitionMandatory:[],repetitionMandatoryWithSeparator:[]},r}return e.prototype.reset=function(){this.dslMethods={option:[],alternation:[],repetition:[],repetitionWithSeparator:[],repetitionMandatory:[],repetitionMandatoryWithSeparator:[]}},e.prototype.visitOption=function(r){this.dslMethods.option.push(r)},e.prototype.visitRepetitionWithSeparator=function(r){this.dslMethods.repetitionWithSeparator.push(r)},e.prototype.visitRepetitionMandatory=function(r){this.dslMethods.repetitionMandatory.push(r)},e.prototype.visitRepetitionMandatoryWithSeparator=function(r){this.dslMethods.repetitionMandatoryWithSeparator.push(r)},e.prototype.visitRepetition=function(r){this.dslMethods.repetition.push(r)},e.prototype.visitAlternation=function(r){this.dslMethods.alternation.push(r)},e}(_ie.GAstVisitor),mp=new bie;function xq(t){mp.reset(),t.accept(mp);var e=mp.dslMethods;return mp.reset(),e}ii.collectMethods=xq});var Lq=f(oi=>{"use strict";Object.defineProperty(oi,"__esModule",{value:!0});oi.addNoneTerminalToCst=oi.addTerminalToCst=oi.setNodeLocationFull=oi.setNodeLocationOnlyOffset=void 0;function Aie(t,e){isNaN(t.startOffset)===!0?(t.startOffset=e.startOffset,t.endOffset=e.endOffset):t.endOffset<e.endOffset&&(t.endOffset=e.endOffset)}oi.setNodeLocationOnlyOffset=Aie;function Pie(t,e){isNaN(t.startOffset)===!0?(t.startOffset=e.startOffset,t.startColumn=e.startColumn,t.startLine=e.startLine,t.endOffset=e.endOffset,t.endColumn=e.endColumn,t.endLine=e.endLine):t.endOffset<e.endOffset&&(t.endOffset=e.endOffset,t.endColumn=e.endColumn,t.endLine=e.endLine)}oi.setNodeLocationFull=Pie;function Sie(t,e,r){t.children[r]===void 0?t.children[r]=[e]:t.children[r].push(e)}oi.addTerminalToCst=Sie;function Cie(t,e,r){t.children[e]===void 0?t.children[e]=[r]:t.children[e].push(r)}oi.addNoneTerminalToCst=Cie});var Mq=f(gp=>{"use strict";Object.defineProperty(gp,"__esModule",{value:!0});gp.defineNameProp=void 0;var Eie="name";function Nie(t,e){Object.defineProperty(t,Eie,{enumerable:!1,configurable:!0,writable:!1,value:e})}gp.defineNameProp=Nie});var Wq=f(Xt=>{"use strict";var Gi=Xt&&Xt.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(Xt,"__esModule",{value:!0});Xt.validateMissingCstMethods=Xt.validateVisitor=Xt.CstVisitorDefinitionError=Xt.createBaseVisitorConstructorWithDefaults=Xt.createBaseSemanticVisitorConstructor=Xt.defaultVisit=void 0;var kie=Gi(Or()),wie=Gi(Cc()),Oie=Gi(xe()),$q=Gi(Ut()),Die=Gi(Gt()),Iie=Gi(Ec()),xie=Gi(Dr()),qie=Gi(ms()),Lie=Gi(oa()),Fq=Mq();function jq(t,e){for(var r=(0,xie.default)(t),n=r.length,i=0;i<n;i++)for(var o=r[i],a=t[o],s=a.length,u=0;u<s;u++){var c=a[u];c.tokenTypeIdx===void 0&&this[c.name](c.children,e)}}Xt.defaultVisit=jq;function Mie(t,e){var r=function(){};(0,Fq.defineNameProp)(r,t+"BaseSemantics");var n={visit:function(i,o){if((0,Oie.default)(i)&&(i=i[0]),!(0,Lie.default)(i))return this[i.name](i.children,o)},validateVisitor:function(){var i=Gq(this,e);if(!(0,kie.default)(i)){var o=(0,$q.default)(i,function(a){return a.msg});throw Error("Errors Detected in CST Visitor <".concat(this.constructor.name,`>:
	`)+"".concat(o.join(`

`).replace(/\n/g,`
	`)))}}};return r.prototype=n,r.prototype.constructor=r,r._RULE_NAMES=e,r}Xt.createBaseSemanticVisitorConstructor=Mie;function $ie(t,e,r){var n=function(){};(0,Fq.defineNameProp)(n,t+"BaseSemanticsWithDefaults");var i=Object.create(r.prototype);return(0,Die.default)(e,function(o){i[o]=jq}),n.prototype=i,n.prototype.constructor=n,n}Xt.createBaseVisitorConstructorWithDefaults=$ie;var Uq;(function(t){t[t.REDUNDANT_METHOD=0]="REDUNDANT_METHOD",t[t.MISSING_METHOD=1]="MISSING_METHOD"})(Uq=Xt.CstVisitorDefinitionError||(Xt.CstVisitorDefinitionError={}));function Gq(t,e){var r=Hq(t,e);return r}Xt.validateVisitor=Gq;function Hq(t,e){var r=(0,Iie.default)(e,function(i){return(0,qie.default)(t[i])===!1}),n=(0,$q.default)(r,function(i){return{msg:"Missing visitor method: <".concat(i,"> on ").concat(t.constructor.name," CST Visitor."),type:Uq.MISSING_METHOD,methodName:i}});return(0,wie.default)(n)}Xt.validateMissingCstMethods=Hq});var Vq=f(zs=>{"use strict";var yp=zs&&zs.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(zs,"__esModule",{value:!0});zs.TreeBuilder=void 0;var Ks=Lq(),hr=yp($f()),Fie=yp(Ir()),Bq=yp(Dr()),Kq=yp(oa()),zq=Wq(),jie=Ar(),Uie=function(){function t(){}return t.prototype.initTreeBuilder=function(e){if(this.CST_STACK=[],this.outputCst=e.outputCst,this.nodeLocationTracking=(0,Fie.default)(e,"nodeLocationTracking")?e.nodeLocationTracking:jie.DEFAULT_PARSER_CONFIG.nodeLocationTracking,!this.outputCst)this.cstInvocationStateUpdate=hr.default,this.cstFinallyStateUpdate=hr.default,this.cstPostTerminal=hr.default,this.cstPostNonTerminal=hr.default,this.cstPostRule=hr.default;else if(/full/i.test(this.nodeLocationTracking))this.recoveryEnabled?(this.setNodeLocationFromToken=Ks.setNodeLocationFull,this.setNodeLocationFromNode=Ks.setNodeLocationFull,this.cstPostRule=hr.default,this.setInitialNodeLocation=this.setInitialNodeLocationFullRecovery):(this.setNodeLocationFromToken=hr.default,this.setNodeLocationFromNode=hr.default,this.cstPostRule=this.cstPostRuleFull,this.setInitialNodeLocation=this.setInitialNodeLocationFullRegular);else if(/onlyOffset/i.test(this.nodeLocationTracking))this.recoveryEnabled?(this.setNodeLocationFromToken=Ks.setNodeLocationOnlyOffset,this.setNodeLocationFromNode=Ks.setNodeLocationOnlyOffset,this.cstPostRule=hr.default,this.setInitialNodeLocation=this.setInitialNodeLocationOnlyOffsetRecovery):(this.setNodeLocationFromToken=hr.default,this.setNodeLocationFromNode=hr.default,this.cstPostRule=this.cstPostRuleOnlyOffset,this.setInitialNodeLocation=this.setInitialNodeLocationOnlyOffsetRegular);else if(/none/i.test(this.nodeLocationTracking))this.setNodeLocationFromToken=hr.default,this.setNodeLocationFromNode=hr.default,this.cstPostRule=hr.default,this.setInitialNodeLocation=hr.default;else throw Error('Invalid <nodeLocationTracking> config option: "'.concat(e.nodeLocationTracking,'"'))},t.prototype.setInitialNodeLocationOnlyOffsetRecovery=function(e){e.location={startOffset:NaN,endOffset:NaN}},t.prototype.setInitialNodeLocationOnlyOffsetRegular=function(e){e.location={startOffset:this.LA(1).startOffset,endOffset:NaN}},t.prototype.setInitialNodeLocationFullRecovery=function(e){e.location={startOffset:NaN,startLine:NaN,startColumn:NaN,endOffset:NaN,endLine:NaN,endColumn:NaN}},t.prototype.setInitialNodeLocationFullRegular=function(e){var r=this.LA(1);e.location={startOffset:r.startOffset,startLine:r.startLine,startColumn:r.startColumn,endOffset:NaN,endLine:NaN,endColumn:NaN}},t.prototype.cstInvocationStateUpdate=function(e){var r={name:e,children:Object.create(null)};this.setInitialNodeLocation(r),this.CST_STACK.push(r)},t.prototype.cstFinallyStateUpdate=function(){this.CST_STACK.pop()},t.prototype.cstPostRuleFull=function(e){var r=this.LA(0),n=e.location;n.startOffset<=r.startOffset?(n.endOffset=r.endOffset,n.endLine=r.endLine,n.endColumn=r.endColumn):(n.startOffset=NaN,n.startLine=NaN,n.startColumn=NaN)},t.prototype.cstPostRuleOnlyOffset=function(e){var r=this.LA(0),n=e.location;n.startOffset<=r.startOffset?n.endOffset=r.endOffset:n.startOffset=NaN},t.prototype.cstPostTerminal=function(e,r){var n=this.CST_STACK[this.CST_STACK.length-1];(0,Ks.addTerminalToCst)(n,r,e),this.setNodeLocationFromToken(n.location,r)},t.prototype.cstPostNonTerminal=function(e,r){var n=this.CST_STACK[this.CST_STACK.length-1];(0,Ks.addNoneTerminalToCst)(n,r,e),this.setNodeLocationFromNode(n.location,e.location)},t.prototype.getBaseCstVisitorConstructor=function(){if((0,Kq.default)(this.baseCstVisitorConstructor)){var e=(0,zq.createBaseSemanticVisitorConstructor)(this.className,(0,Bq.default)(this.gastProductionsCache));return this.baseCstVisitorConstructor=e,e}return this.baseCstVisitorConstructor},t.prototype.getBaseCstVisitorConstructorWithDefaults=function(){if((0,Kq.default)(this.baseCstVisitorWithDefaultsConstructor)){var e=(0,zq.createBaseVisitorConstructorWithDefaults)(this.className,(0,Bq.default)(this.gastProductionsCache),this.getBaseCstVisitorConstructor());return this.baseCstVisitorWithDefaultsConstructor=e,e}return this.baseCstVisitorWithDefaultsConstructor},t.prototype.getLastExplicitRuleShortName=function(){var e=this.RULE_STACK;return e[e.length-1]},t.prototype.getPreviousExplicitRuleShortName=function(){var e=this.RULE_STACK;return e[e.length-2]},t.prototype.getLastExplicitRuleOccurrenceIndex=function(){var e=this.RULE_OCCURRENCE_STACK;return e[e.length-1]},t}();zs.TreeBuilder=Uie});var Xq=f(vp=>{"use strict";Object.defineProperty(vp,"__esModule",{value:!0});vp.LexerAdapter=void 0;var Yq=Ar(),Gie=function(){function t(){}return t.prototype.initLexerAdapter=function(){this.tokVector=[],this.tokVectorLength=0,this.currIdx=-1},Object.defineProperty(t.prototype,"input",{get:function(){return this.tokVector},set:function(e){if(this.selfAnalysisDone!==!0)throw Error("Missing <performSelfAnalysis> invocation at the end of the Parser's constructor.");this.reset(),this.tokVector=e,this.tokVectorLength=e.length},enumerable:!1,configurable:!0}),t.prototype.SKIP_TOKEN=function(){return this.currIdx<=this.tokVector.length-2?(this.consumeToken(),this.LA(1)):Yq.END_OF_FILE},t.prototype.LA=function(e){var r=this.currIdx+e;return r<0||this.tokVectorLength<=r?Yq.END_OF_FILE:this.tokVector[r]},t.prototype.consumeToken=function(){this.currIdx++},t.prototype.exportLexerState=function(){return this.currIdx},t.prototype.importLexerState=function(e){this.currIdx=e},t.prototype.resetLexerState=function(){this.currIdx=-1},t.prototype.moveToTerminatedState=function(){this.currIdx=this.tokVector.length-1},t.prototype.getLexerPosition=function(){return this.exportLexerState()},t}();vp.LexerAdapter=Gie});var Qq=f(Vs=>{"use strict";var Jq=Vs&&Vs.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(Vs,"__esModule",{value:!0});Vs.RecognizerApi=void 0;var Hie=Jq(Yn()),Wie=Jq(Di()),Bie=Ws(),eT=Ar(),Kie=Us(),zie=qc(),Vie=_t(),Yie=function(){function t(){}return t.prototype.ACTION=function(e){return e.call(this)},t.prototype.consume=function(e,r,n){return this.consumeInternal(r,e,n)},t.prototype.subrule=function(e,r,n){return this.subruleInternal(r,e,n)},t.prototype.option=function(e,r){return this.optionInternal(r,e)},t.prototype.or=function(e,r){return this.orInternal(r,e)},t.prototype.many=function(e,r){return this.manyInternal(e,r)},t.prototype.atLeastOne=function(e,r){return this.atLeastOneInternal(e,r)},t.prototype.CONSUME=function(e,r){return this.consumeInternal(e,0,r)},t.prototype.CONSUME1=function(e,r){return this.consumeInternal(e,1,r)},t.prototype.CONSUME2=function(e,r){return this.consumeInternal(e,2,r)},t.prototype.CONSUME3=function(e,r){return this.consumeInternal(e,3,r)},t.prototype.CONSUME4=function(e,r){return this.consumeInternal(e,4,r)},t.prototype.CONSUME5=function(e,r){return this.consumeInternal(e,5,r)},t.prototype.CONSUME6=function(e,r){return this.consumeInternal(e,6,r)},t.prototype.CONSUME7=function(e,r){return this.consumeInternal(e,7,r)},t.prototype.CONSUME8=function(e,r){return this.consumeInternal(e,8,r)},t.prototype.CONSUME9=function(e,r){return this.consumeInternal(e,9,r)},t.prototype.SUBRULE=function(e,r){return this.subruleInternal(e,0,r)},t.prototype.SUBRULE1=function(e,r){return this.subruleInternal(e,1,r)},t.prototype.SUBRULE2=function(e,r){return this.subruleInternal(e,2,r)},t.prototype.SUBRULE3=function(e,r){return this.subruleInternal(e,3,r)},t.prototype.SUBRULE4=function(e,r){return this.subruleInternal(e,4,r)},t.prototype.SUBRULE5=function(e,r){return this.subruleInternal(e,5,r)},t.prototype.SUBRULE6=function(e,r){return this.subruleInternal(e,6,r)},t.prototype.SUBRULE7=function(e,r){return this.subruleInternal(e,7,r)},t.prototype.SUBRULE8=function(e,r){return this.subruleInternal(e,8,r)},t.prototype.SUBRULE9=function(e,r){return this.subruleInternal(e,9,r)},t.prototype.OPTION=function(e){return this.optionInternal(e,0)},t.prototype.OPTION1=function(e){return this.optionInternal(e,1)},t.prototype.OPTION2=function(e){return this.optionInternal(e,2)},t.prototype.OPTION3=function(e){return this.optionInternal(e,3)},t.prototype.OPTION4=function(e){return this.optionInternal(e,4)},t.prototype.OPTION5=function(e){return this.optionInternal(e,5)},t.prototype.OPTION6=function(e){return this.optionInternal(e,6)},t.prototype.OPTION7=function(e){return this.optionInternal(e,7)},t.prototype.OPTION8=function(e){return this.optionInternal(e,8)},t.prototype.OPTION9=function(e){return this.optionInternal(e,9)},t.prototype.OR=function(e){return this.orInternal(e,0)},t.prototype.OR1=function(e){return this.orInternal(e,1)},t.prototype.OR2=function(e){return this.orInternal(e,2)},t.prototype.OR3=function(e){return this.orInternal(e,3)},t.prototype.OR4=function(e){return this.orInternal(e,4)},t.prototype.OR5=function(e){return this.orInternal(e,5)},t.prototype.OR6=function(e){return this.orInternal(e,6)},t.prototype.OR7=function(e){return this.orInternal(e,7)},t.prototype.OR8=function(e){return this.orInternal(e,8)},t.prototype.OR9=function(e){return this.orInternal(e,9)},t.prototype.MANY=function(e){this.manyInternal(0,e)},t.prototype.MANY1=function(e){this.manyInternal(1,e)},t.prototype.MANY2=function(e){this.manyInternal(2,e)},t.prototype.MANY3=function(e){this.manyInternal(3,e)},t.prototype.MANY4=function(e){this.manyInternal(4,e)},t.prototype.MANY5=function(e){this.manyInternal(5,e)},t.prototype.MANY6=function(e){this.manyInternal(6,e)},t.prototype.MANY7=function(e){this.manyInternal(7,e)},t.prototype.MANY8=function(e){this.manyInternal(8,e)},t.prototype.MANY9=function(e){this.manyInternal(9,e)},t.prototype.MANY_SEP=function(e){this.manySepFirstInternal(0,e)},t.prototype.MANY_SEP1=function(e){this.manySepFirstInternal(1,e)},t.prototype.MANY_SEP2=function(e){this.manySepFirstInternal(2,e)},t.prototype.MANY_SEP3=function(e){this.manySepFirstInternal(3,e)},t.prototype.MANY_SEP4=function(e){this.manySepFirstInternal(4,e)},t.prototype.MANY_SEP5=function(e){this.manySepFirstInternal(5,e)},t.prototype.MANY_SEP6=function(e){this.manySepFirstInternal(6,e)},t.prototype.MANY_SEP7=function(e){this.manySepFirstInternal(7,e)},t.prototype.MANY_SEP8=function(e){this.manySepFirstInternal(8,e)},t.prototype.MANY_SEP9=function(e){this.manySepFirstInternal(9,e)},t.prototype.AT_LEAST_ONE=function(e){this.atLeastOneInternal(0,e)},t.prototype.AT_LEAST_ONE1=function(e){return this.atLeastOneInternal(1,e)},t.prototype.AT_LEAST_ONE2=function(e){this.atLeastOneInternal(2,e)},t.prototype.AT_LEAST_ONE3=function(e){this.atLeastOneInternal(3,e)},t.prototype.AT_LEAST_ONE4=function(e){this.atLeastOneInternal(4,e)},t.prototype.AT_LEAST_ONE5=function(e){this.atLeastOneInternal(5,e)},t.prototype.AT_LEAST_ONE6=function(e){this.atLeastOneInternal(6,e)},t.prototype.AT_LEAST_ONE7=function(e){this.atLeastOneInternal(7,e)},t.prototype.AT_LEAST_ONE8=function(e){this.atLeastOneInternal(8,e)},t.prototype.AT_LEAST_ONE9=function(e){this.atLeastOneInternal(9,e)},t.prototype.AT_LEAST_ONE_SEP=function(e){this.atLeastOneSepFirstInternal(0,e)},t.prototype.AT_LEAST_ONE_SEP1=function(e){this.atLeastOneSepFirstInternal(1,e)},t.prototype.AT_LEAST_ONE_SEP2=function(e){this.atLeastOneSepFirstInternal(2,e)},t.prototype.AT_LEAST_ONE_SEP3=function(e){this.atLeastOneSepFirstInternal(3,e)},t.prototype.AT_LEAST_ONE_SEP4=function(e){this.atLeastOneSepFirstInternal(4,e)},t.prototype.AT_LEAST_ONE_SEP5=function(e){this.atLeastOneSepFirstInternal(5,e)},t.prototype.AT_LEAST_ONE_SEP6=function(e){this.atLeastOneSepFirstInternal(6,e)},t.prototype.AT_LEAST_ONE_SEP7=function(e){this.atLeastOneSepFirstInternal(7,e)},t.prototype.AT_LEAST_ONE_SEP8=function(e){this.atLeastOneSepFirstInternal(8,e)},t.prototype.AT_LEAST_ONE_SEP9=function(e){this.atLeastOneSepFirstInternal(9,e)},t.prototype.RULE=function(e,r,n){if(n===void 0&&(n=eT.DEFAULT_RULE_CONFIG),(0,Wie.default)(this.definedRulesNames,e)){var i=Kie.defaultGrammarValidatorErrorProvider.buildDuplicateRuleNameError({topLevelRule:e,grammarName:this.className}),o={message:i,type:eT.ParserDefinitionErrorType.DUPLICATE_RULE_NAME,ruleName:e};this.definitionErrors.push(o)}this.definedRulesNames.push(e);var a=this.defineRule(e,r,n);return this[e]=a,a},t.prototype.OVERRIDE_RULE=function(e,r,n){n===void 0&&(n=eT.DEFAULT_RULE_CONFIG);var i=(0,zie.validateRuleIsOverridden)(e,this.definedRulesNames,this.className);this.definitionErrors=this.definitionErrors.concat(i);var o=this.defineRule(e,r,n);return this[e]=o,o},t.prototype.BACKTRACK=function(e,r){return function(){this.isBackTrackingStack.push(1);var n=this.saveRecogState();try{return e.apply(this,r),!0}catch(i){if((0,Bie.isRecognitionException)(i))return!1;throw i}finally{this.reloadRecogState(n),this.isBackTrackingStack.pop()}}},t.prototype.getGAstProductions=function(){return this.gastProductionsCache},t.prototype.getSerializedGastProductions=function(){return(0,Vie.serializeGrammar)((0,Hie.default)(this.gastProductionsCache))},t}();Vs.RecognizerApi=Yie});var aL=f(Xs=>{"use strict";var ai=Xs&&Xs.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(Xs,"__esModule",{value:!0});Xs.RecognizerEngine=void 0;var Zq=ai(Or()),tT=ai(xe()),rT=ai(Sn()),eL=ai(Sc()),Xie=ai(Ff()),Jie=ai(bn()),Fc=ai(Ir()),jc=ai(Yn()),tL=ai(Ii()),rL=ai(wi()),qr=dp(),_p=Ws(),nL=Gs(),Ys=Dc(),iL=Ar(),Qie=X_(),oL=ca(),Uc=ua(),Zie=function(){function t(){}return t.prototype.initRecognizerEngine=function(e,r){if(this.className=this.constructor.name,this.shortRuleNameToFull={},this.fullRuleNameToShort={},this.ruleShortNameIdx=256,this.tokenMatcher=Uc.tokenStructuredMatcherNoCategories,this.subruleIdx=0,this.definedRulesNames=[],this.tokensMap={},this.isBackTrackingStack=[],this.RULE_STACK=[],this.RULE_OCCURRENCE_STACK=[],this.gastProductionsCache={},(0,Fc.default)(r,"serializedGrammar"))throw Error(`The Parser's configuration can no longer contain a <serializedGrammar> property.
	See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_6-0-0
	For Further details.`);if((0,tT.default)(e)){if((0,Zq.default)(e))throw Error(`A Token Vocabulary cannot be empty.
	Note that the first argument for the parser constructor
	is no longer a Token vector (since v4.0).`);if(typeof e[0].startOffset=="number")throw Error(`The Parser constructor no longer accepts a token vector as the first argument.
	See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_4-0-0
	For Further details.`)}if((0,tT.default)(e))this.tokensMap=(0,tL.default)(e,function(s,u){return s[u.name]=u,s},{});else if((0,Fc.default)(e,"modes")&&(0,eL.default)((0,rT.default)((0,jc.default)(e.modes)),Uc.isTokenType)){var n=(0,rT.default)((0,jc.default)(e.modes)),i=(0,Xie.default)(n);this.tokensMap=(0,tL.default)(i,function(s,u){return s[u.name]=u,s},{})}else if((0,Jie.default)(e))this.tokensMap=(0,rL.default)(e);else throw new Error("<tokensDictionary> argument must be An Array of Token constructors, A dictionary of Token constructors or an IMultiModeLexerDefinition");this.tokensMap.EOF=oL.EOF;var o=(0,Fc.default)(e,"modes")?(0,rT.default)((0,jc.default)(e.modes)):(0,jc.default)(e),a=(0,eL.default)(o,function(s){return(0,Zq.default)(s.categoryMatches)});this.tokenMatcher=a?Uc.tokenStructuredMatcherNoCategories:Uc.tokenStructuredMatcher,(0,Uc.augmentTokenTypes)((0,jc.default)(this.tokensMap))},t.prototype.defineRule=function(e,r,n){if(this.selfAnalysisDone)throw Error("Grammar rule <".concat(e,`> may not be defined after the 'performSelfAnalysis' method has been called'
`)+"Make sure that all grammar rule definitions are done before 'performSelfAnalysis' is called.");var i=(0,Fc.default)(n,"resyncEnabled")?n.resyncEnabled:iL.DEFAULT_RULE_CONFIG.resyncEnabled,o=(0,Fc.default)(n,"recoveryValueFunc")?n.recoveryValueFunc:iL.DEFAULT_RULE_CONFIG.recoveryValueFunc,a=this.ruleShortNameIdx<<qr.BITS_FOR_METHOD_TYPE+qr.BITS_FOR_OCCURRENCE_IDX;this.ruleShortNameIdx++,this.shortRuleNameToFull[a]=e,this.fullRuleNameToShort[e]=a;var s;this.outputCst===!0?s=function(){for(var l=[],d=0;d<arguments.length;d++)l[d]=arguments[d];try{this.ruleInvocationStateUpdate(a,e,this.subruleIdx),r.apply(this,l);var h=this.CST_STACK[this.CST_STACK.length-1];return this.cstPostRule(h),h}catch(v){return this.invokeRuleCatch(v,i,o)}finally{this.ruleFinallyStateUpdate()}}:s=function(){for(var l=[],d=0;d<arguments.length;d++)l[d]=arguments[d];try{return this.ruleInvocationStateUpdate(a,e,this.subruleIdx),r.apply(this,l)}catch(h){return this.invokeRuleCatch(h,i,o)}finally{this.ruleFinallyStateUpdate()}};var u=Object.assign(s,{ruleName:e,originalGrammarAction:r});return u},t.prototype.invokeRuleCatch=function(e,r,n){var i=this.RULE_STACK.length===1,o=r&&!this.isBackTracking()&&this.recoveryEnabled;if((0,_p.isRecognitionException)(e)){var a=e;if(o){var s=this.findReSyncTokenType();if(this.isInCurrentRuleReSyncSet(s))if(a.resyncedTokens=this.reSyncTo(s),this.outputCst){var u=this.CST_STACK[this.CST_STACK.length-1];return u.recoveredNode=!0,u}else return n();else{if(this.outputCst){var u=this.CST_STACK[this.CST_STACK.length-1];u.recoveredNode=!0,a.partialCstResult=u}throw a}}else{if(i)return this.moveToTerminatedState(),n();throw a}}else throw e},t.prototype.optionInternal=function(e,r){var n=this.getKeyForAutomaticLookahead(qr.OPTION_IDX,r);return this.optionInternalLogic(e,r,n)},t.prototype.optionInternalLogic=function(e,r,n){var i=this,o=this.getLaFuncFromCache(n),a;if(typeof e!="function"){a=e.DEF;var s=e.GATE;if(s!==void 0){var u=o;o=function(){return s.call(i)&&u.call(i)}}}else a=e;if(o.call(this)===!0)return a.call(this)},t.prototype.atLeastOneInternal=function(e,r){var n=this.getKeyForAutomaticLookahead(qr.AT_LEAST_ONE_IDX,e);return this.atLeastOneInternalLogic(e,r,n)},t.prototype.atLeastOneInternalLogic=function(e,r,n){var i=this,o=this.getLaFuncFromCache(n),a;if(typeof r!="function"){a=r.DEF;var s=r.GATE;if(s!==void 0){var u=o;o=function(){return s.call(i)&&u.call(i)}}}else a=r;if(o.call(this)===!0)for(var c=this.doSingleRepetition(a);o.call(this)===!0&&c===!0;)c=this.doSingleRepetition(a);else throw this.raiseEarlyExitException(e,nL.PROD_TYPE.REPETITION_MANDATORY,r.ERR_MSG);this.attemptInRepetitionRecovery(this.atLeastOneInternal,[e,r],o,qr.AT_LEAST_ONE_IDX,e,Ys.NextTerminalAfterAtLeastOneWalker)},t.prototype.atLeastOneSepFirstInternal=function(e,r){var n=this.getKeyForAutomaticLookahead(qr.AT_LEAST_ONE_SEP_IDX,e);this.atLeastOneSepFirstInternalLogic(e,r,n)},t.prototype.atLeastOneSepFirstInternalLogic=function(e,r,n){var i=this,o=r.DEF,a=r.SEP,s=this.getLaFuncFromCache(n);if(s.call(this)===!0){o.call(this);for(var u=function(){return i.tokenMatcher(i.LA(1),a)};this.tokenMatcher(this.LA(1),a)===!0;)this.CONSUME(a),o.call(this);this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal,[e,a,u,o,Ys.NextTerminalAfterAtLeastOneSepWalker],u,qr.AT_LEAST_ONE_SEP_IDX,e,Ys.NextTerminalAfterAtLeastOneSepWalker)}else throw this.raiseEarlyExitException(e,nL.PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR,r.ERR_MSG)},t.prototype.manyInternal=function(e,r){var n=this.getKeyForAutomaticLookahead(qr.MANY_IDX,e);return this.manyInternalLogic(e,r,n)},t.prototype.manyInternalLogic=function(e,r,n){var i=this,o=this.getLaFuncFromCache(n),a;if(typeof r!="function"){a=r.DEF;var s=r.GATE;if(s!==void 0){var u=o;o=function(){return s.call(i)&&u.call(i)}}}else a=r;for(var c=!0;o.call(this)===!0&&c===!0;)c=this.doSingleRepetition(a);this.attemptInRepetitionRecovery(this.manyInternal,[e,r],o,qr.MANY_IDX,e,Ys.NextTerminalAfterManyWalker,c)},t.prototype.manySepFirstInternal=function(e,r){var n=this.getKeyForAutomaticLookahead(qr.MANY_SEP_IDX,e);this.manySepFirstInternalLogic(e,r,n)},t.prototype.manySepFirstInternalLogic=function(e,r,n){var i=this,o=r.DEF,a=r.SEP,s=this.getLaFuncFromCache(n);if(s.call(this)===!0){o.call(this);for(var u=function(){return i.tokenMatcher(i.LA(1),a)};this.tokenMatcher(this.LA(1),a)===!0;)this.CONSUME(a),o.call(this);this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal,[e,a,u,o,Ys.NextTerminalAfterManySepWalker],u,qr.MANY_SEP_IDX,e,Ys.NextTerminalAfterManySepWalker)}},t.prototype.repetitionSepSecondInternal=function(e,r,n,i,o){for(;n();)this.CONSUME(r),i.call(this);this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal,[e,r,n,i,o],n,qr.AT_LEAST_ONE_SEP_IDX,e,o)},t.prototype.doSingleRepetition=function(e){var r=this.getLexerPosition();e.call(this);var n=this.getLexerPosition();return n>r},t.prototype.orInternal=function(e,r){var n=this.getKeyForAutomaticLookahead(qr.OR_IDX,r),i=(0,tT.default)(e)?e:e.DEF,o=this.getLaFuncFromCache(n),a=o.call(this,i);if(a!==void 0){var s=i[a];return s.ALT.call(this)}this.raiseNoAltException(r,e.ERR_MSG)},t.prototype.ruleFinallyStateUpdate=function(){if(this.RULE_STACK.pop(),this.RULE_OCCURRENCE_STACK.pop(),this.cstFinallyStateUpdate(),this.RULE_STACK.length===0&&this.isAtEndOfInput()===!1){var e=this.LA(1),r=this.errorMessageProvider.buildNotAllInputParsedMessage({firstRedundant:e,ruleName:this.getCurrRuleFullName()});this.SAVE_ERROR(new _p.NotAllInputParsedException(r,e))}},t.prototype.subruleInternal=function(e,r,n){var i;try{var o=n!==void 0?n.ARGS:void 0;return this.subruleIdx=r,i=e.apply(this,o),this.cstPostNonTerminal(i,n!==void 0&&n.LABEL!==void 0?n.LABEL:e.ruleName),i}catch(a){throw this.subruleInternalError(a,n,e.ruleName)}},t.prototype.subruleInternalError=function(e,r,n){throw(0,_p.isRecognitionException)(e)&&e.partialCstResult!==void 0&&(this.cstPostNonTerminal(e.partialCstResult,r!==void 0&&r.LABEL!==void 0?r.LABEL:n),delete e.partialCstResult),e},t.prototype.consumeInternal=function(e,r,n){var i;try{var o=this.LA(1);this.tokenMatcher(o,e)===!0?(this.consumeToken(),i=o):this.consumeInternalError(e,o,n)}catch(a){i=this.consumeInternalRecovery(e,r,a)}return this.cstPostTerminal(n!==void 0&&n.LABEL!==void 0?n.LABEL:e.name,i),i},t.prototype.consumeInternalError=function(e,r,n){var i,o=this.LA(0);throw n!==void 0&&n.ERR_MSG?i=n.ERR_MSG:i=this.errorMessageProvider.buildMismatchTokenMessage({expected:e,actual:r,previous:o,ruleName:this.getCurrRuleFullName()}),this.SAVE_ERROR(new _p.MismatchedTokenException(i,r,o))},t.prototype.consumeInternalRecovery=function(e,r,n){if(this.recoveryEnabled&&n.name==="MismatchedTokenException"&&!this.isBackTracking()){var i=this.getFollowsForInRuleRecovery(e,r);try{return this.tryInRuleRecovery(e,i)}catch(o){throw o.name===Qie.IN_RULE_RECOVERY_EXCEPTION?n:o}}else throw n},t.prototype.saveRecogState=function(){var e=this.errors,r=(0,rL.default)(this.RULE_STACK);return{errors:e,lexerState:this.exportLexerState(),RULE_STACK:r,CST_STACK:this.CST_STACK}},t.prototype.reloadRecogState=function(e){this.errors=e.errors,this.importLexerState(e.lexerState),this.RULE_STACK=e.RULE_STACK},t.prototype.ruleInvocationStateUpdate=function(e,r,n){this.RULE_OCCURRENCE_STACK.push(n),this.RULE_STACK.push(e),this.cstInvocationStateUpdate(r)},t.prototype.isBackTracking=function(){return this.isBackTrackingStack.length!==0},t.prototype.getCurrRuleFullName=function(){var e=this.getLastExplicitRuleShortName();return this.shortRuleNameToFull[e]},t.prototype.shortRuleNameToFullName=function(e){return this.shortRuleNameToFull[e]},t.prototype.isAtEndOfInput=function(){return this.tokenMatcher(this.LA(1),oL.EOF)},t.prototype.reset=function(){this.resetLexerState(),this.subruleIdx=0,this.isBackTrackingStack=[],this.errors=[],this.RULE_STACK=[],this.CST_STACK=[],this.RULE_OCCURRENCE_STACK=[]},t}();Xs.RecognizerEngine=Zie});var lL=f(Js=>{"use strict";var cL=Js&&Js.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(Js,"__esModule",{value:!0});Js.ErrorHandler=void 0;var nT=Ws(),eoe=cL(Ir()),sL=cL(wi()),uL=Gs(),toe=Ar(),roe=function(){function t(){}return t.prototype.initErrorHandler=function(e){this._errors=[],this.errorMessageProvider=(0,eoe.default)(e,"errorMessageProvider")?e.errorMessageProvider:toe.DEFAULT_PARSER_CONFIG.errorMessageProvider},t.prototype.SAVE_ERROR=function(e){if((0,nT.isRecognitionException)(e))return e.context={ruleStack:this.getHumanReadableRuleStack(),ruleOccurrenceStack:(0,sL.default)(this.RULE_OCCURRENCE_STACK)},this._errors.push(e),e;throw Error("Trying to save an Error which is not a RecognitionException")},Object.defineProperty(t.prototype,"errors",{get:function(){return(0,sL.default)(this._errors)},set:function(e){this._errors=e},enumerable:!1,configurable:!0}),t.prototype.raiseEarlyExitException=function(e,r,n){for(var i=this.getCurrRuleFullName(),o=this.getGAstProductions()[i],a=(0,uL.getLookaheadPathsForOptionalProd)(e,o,r,this.maxLookahead),s=a[0],u=[],c=1;c<=this.maxLookahead;c++)u.push(this.LA(c));var l=this.errorMessageProvider.buildEarlyExitMessage({expectedIterationPaths:s,actual:u,previous:this.LA(0),customUserDescription:n,ruleName:i});throw this.SAVE_ERROR(new nT.EarlyExitException(l,this.LA(1),this.LA(0)))},t.prototype.raiseNoAltException=function(e,r){for(var n=this.getCurrRuleFullName(),i=this.getGAstProductions()[n],o=(0,uL.getLookaheadPathsForOr)(e,i,this.maxLookahead),a=[],s=1;s<=this.maxLookahead;s++)a.push(this.LA(s));var u=this.LA(0),c=this.errorMessageProvider.buildNoViableAltMessage({expectedPathsPerAlt:o,actual:a,previous:u,customUserDescription:r,ruleName:this.getCurrRuleFullName()});throw this.SAVE_ERROR(new nT.NoViableAltException(c,this.LA(1),u))},t}();Js.ErrorHandler=roe});var pL=f(Qs=>{"use strict";var fL=Qs&&Qs.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(Qs,"__esModule",{value:!0});Qs.ContentAssist=void 0;var dL=Dc(),noe=fL(Ls()),ioe=fL(oa()),ooe=function(){function t(){}return t.prototype.initContentAssist=function(){},t.prototype.computeContentAssist=function(e,r){var n=this.gastProductionsCache[e];if((0,ioe.default)(n))throw Error("Rule ->".concat(e,"<- does not exist in this grammar."));return(0,dL.nextPossibleTokensAfter)([n],r,this.tokenMatcher,this.maxLookahead)},t.prototype.getNextPossibleTokenTypes=function(e){var r=(0,noe.default)(e.ruleStack),n=this.getGAstProductions(),i=n[r],o=new dL.NextAfterTokenWalker(i,e).startWalking();return o},t}();Qs.ContentAssist=ooe});var bL=f(Zs=>{"use strict";var eu=Zs&&Zs.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(Zs,"__esModule",{value:!0});Zs.GastRecorder=void 0;var Tp=eu(ep()),aoe=eu(xe()),soe=eu(If()),uoe=eu(Gt()),yL=eu(ms()),Hc=eu(Ir()),si=_t(),coe=Nc(),vL=ua(),_L=ca(),loe=Ar(),doe=dp(),bp={description:"This Object indicates the Parser is during Recording Phase"};Object.freeze(bp);var hL=!0,mL=Math.pow(2,doe.BITS_FOR_OCCURRENCE_IDX)-1,TL=(0,_L.createToken)({name:"RECORDING_PHASE_TOKEN",pattern:coe.Lexer.NA});(0,vL.augmentTokenTypes)([TL]);var RL=(0,_L.createTokenInstance)(TL,`This IToken indicates the Parser is in Recording Phase
	See: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details`,-1,-1,-1,-1,-1,-1);Object.freeze(RL);var foe={name:`This CSTNode indicates the Parser is in Recording Phase
	See: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details`,children:{}},poe=function(){function t(){}return t.prototype.initGastRecorder=function(e){this.recordingProdStack=[],this.RECORDING_PHASE=!1},t.prototype.enableRecording=function(){var e=this;this.RECORDING_PHASE=!0,this.TRACE_INIT("Enable Recording",function(){for(var r=function(i){var o=i>0?i:"";e["CONSUME".concat(o)]=function(a,s){return this.consumeInternalRecord(a,i,s)},e["SUBRULE".concat(o)]=function(a,s){return this.subruleInternalRecord(a,i,s)},e["OPTION".concat(o)]=function(a){return this.optionInternalRecord(a,i)},e["OR".concat(o)]=function(a){return this.orInternalRecord(a,i)},e["MANY".concat(o)]=function(a){this.manyInternalRecord(i,a)},e["MANY_SEP".concat(o)]=function(a){this.manySepFirstInternalRecord(i,a)},e["AT_LEAST_ONE".concat(o)]=function(a){this.atLeastOneInternalRecord(i,a)},e["AT_LEAST_ONE_SEP".concat(o)]=function(a){this.atLeastOneSepFirstInternalRecord(i,a)}},n=0;n<10;n++)r(n);e.consume=function(i,o,a){return this.consumeInternalRecord(o,i,a)},e.subrule=function(i,o,a){return this.subruleInternalRecord(o,i,a)},e.option=function(i,o){return this.optionInternalRecord(o,i)},e.or=function(i,o){return this.orInternalRecord(o,i)},e.many=function(i,o){this.manyInternalRecord(i,o)},e.atLeastOne=function(i,o){this.atLeastOneInternalRecord(i,o)},e.ACTION=e.ACTION_RECORD,e.BACKTRACK=e.BACKTRACK_RECORD,e.LA=e.LA_RECORD})},t.prototype.disableRecording=function(){var e=this;this.RECORDING_PHASE=!1,this.TRACE_INIT("Deleting Recording methods",function(){for(var r=e,n=0;n<10;n++){var i=n>0?n:"";delete r["CONSUME".concat(i)],delete r["SUBRULE".concat(i)],delete r["OPTION".concat(i)],delete r["OR".concat(i)],delete r["MANY".concat(i)],delete r["MANY_SEP".concat(i)],delete r["AT_LEAST_ONE".concat(i)],delete r["AT_LEAST_ONE_SEP".concat(i)]}delete r.consume,delete r.subrule,delete r.option,delete r.or,delete r.many,delete r.atLeastOne,delete r.ACTION,delete r.BACKTRACK,delete r.LA})},t.prototype.ACTION_RECORD=function(e){},t.prototype.BACKTRACK_RECORD=function(e,r){return function(){return!0}},t.prototype.LA_RECORD=function(e){return loe.END_OF_FILE},t.prototype.topLevelRuleRecord=function(e,r){try{var n=new si.Rule({definition:[],name:e});return n.name=e,this.recordingProdStack.push(n),r.call(this),this.recordingProdStack.pop(),n}catch(i){if(i.KNOWN_RECORDER_ERROR!==!0)try{i.message=i.message+`
	 This error was thrown during the "grammar recording phase" For more info see:
	https://chevrotain.io/docs/guide/internals.html#grammar-recording`}catch{throw i}throw i}},t.prototype.optionInternalRecord=function(e,r){return Gc.call(this,si.Option,e,r)},t.prototype.atLeastOneInternalRecord=function(e,r){Gc.call(this,si.RepetitionMandatory,r,e)},t.prototype.atLeastOneSepFirstInternalRecord=function(e,r){Gc.call(this,si.RepetitionMandatoryWithSeparator,r,e,hL)},t.prototype.manyInternalRecord=function(e,r){Gc.call(this,si.Repetition,r,e)},t.prototype.manySepFirstInternalRecord=function(e,r){Gc.call(this,si.RepetitionWithSeparator,r,e,hL)},t.prototype.orInternalRecord=function(e,r){return hoe.call(this,e,r)},t.prototype.subruleInternalRecord=function(e,r,n){if(Rp(r),!e||(0,Hc.default)(e,"ruleName")===!1){var i=new Error("<SUBRULE".concat(gL(r),"> argument is invalid")+" expecting a Parser method reference but got: <".concat(JSON.stringify(e),">")+`
 inside top level rule: <`.concat(this.recordingProdStack[0].name,">"));throw i.KNOWN_RECORDER_ERROR=!0,i}var o=(0,Tp.default)(this.recordingProdStack),a=e.ruleName,s=new si.NonTerminal({idx:r,nonTerminalName:a,label:n?.LABEL,referencedRule:void 0});return o.definition.push(s),this.outputCst?foe:bp},t.prototype.consumeInternalRecord=function(e,r,n){if(Rp(r),!(0,vL.hasShortKeyProperty)(e)){var i=new Error("<CONSUME".concat(gL(r),"> argument is invalid")+" expecting a TokenType reference but got: <".concat(JSON.stringify(e),">")+`
 inside top level rule: <`.concat(this.recordingProdStack[0].name,">"));throw i.KNOWN_RECORDER_ERROR=!0,i}var o=(0,Tp.default)(this.recordingProdStack),a=new si.Terminal({idx:r,terminalType:e,label:n?.LABEL});return o.definition.push(a),RL},t}();Zs.GastRecorder=poe;function Gc(t,e,r,n){n===void 0&&(n=!1),Rp(r);var i=(0,Tp.default)(this.recordingProdStack),o=(0,yL.default)(e)?e:e.DEF,a=new t({definition:[],idx:r});return n&&(a.separator=e.SEP),(0,Hc.default)(e,"MAX_LOOKAHEAD")&&(a.maxLookahead=e.MAX_LOOKAHEAD),this.recordingProdStack.push(a),o.call(this),i.definition.push(a),this.recordingProdStack.pop(),bp}function hoe(t,e){var r=this;Rp(e);var n=(0,Tp.default)(this.recordingProdStack),i=(0,aoe.default)(t)===!1,o=i===!1?t:t.DEF,a=new si.Alternation({definition:[],idx:e,ignoreAmbiguities:i&&t.IGNORE_AMBIGUITIES===!0});(0,Hc.default)(t,"MAX_LOOKAHEAD")&&(a.maxLookahead=t.MAX_LOOKAHEAD);var s=(0,soe.default)(o,function(u){return(0,yL.default)(u.GATE)});return a.hasPredicates=s,n.definition.push(a),(0,uoe.default)(o,function(u){var c=new si.Alternative({definition:[]});a.definition.push(c),(0,Hc.default)(u,"IGNORE_AMBIGUITIES")?c.ignoreAmbiguities=u.IGNORE_AMBIGUITIES:(0,Hc.default)(u,"GATE")&&(c.ignoreAmbiguities=!0),r.recordingProdStack.push(c),u.ALT.call(r),r.recordingProdStack.pop()}),bp}function gL(t){return t===0?"":"".concat(t)}function Rp(t){if(t<0||t>mL){var e=new Error("Invalid DSL Method idx value: <".concat(t,`>
	`)+"Idx value must be a none negative value smaller than ".concat(mL+1));throw e.KNOWN_RECORDER_ERROR=!0,e}}});var AL=f(tu=>{"use strict";var moe=tu&&tu.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(tu,"__esModule",{value:!0});tu.PerformanceTracer=void 0;var goe=moe(Ir()),yoe=Ds(),voe=Ar(),_oe=function(){function t(){}return t.prototype.initPerformanceTracer=function(e){if((0,goe.default)(e,"traceInitPerf")){var r=e.traceInitPerf,n=typeof r=="number";this.traceInitMaxIdent=n?r:1/0,this.traceInitPerf=n?r>0:r}else this.traceInitMaxIdent=0,this.traceInitPerf=voe.DEFAULT_PARSER_CONFIG.traceInitPerf;this.traceInitIndent=-1},t.prototype.TRACE_INIT=function(e,r){if(this.traceInitPerf===!0){this.traceInitIndent++;var n=new Array(this.traceInitIndent+1).join("	");this.traceInitIndent<this.traceInitMaxIdent&&console.log("".concat(n,"--> <").concat(e,">"));var i=(0,yoe.timer)(r),o=i.time,a=i.value,s=o>10?console.warn:console.log;return this.traceInitIndent<this.traceInitMaxIdent&&s("".concat(n,"<-- <").concat(e,"> time: ").concat(o,"ms")),this.traceInitIndent--,a}else return r()},t}();tu.PerformanceTracer=_oe});var PL=f(Ap=>{"use strict";Object.defineProperty(Ap,"__esModule",{value:!0});Ap.applyMixins=void 0;function Toe(t,e){e.forEach(function(r){var n=r.prototype;Object.getOwnPropertyNames(n).forEach(function(i){if(i!=="constructor"){var o=Object.getOwnPropertyDescriptor(n,i);o&&(o.get||o.set)?Object.defineProperty(t.prototype,i,o):t.prototype[i]=r.prototype[i]}})})}Ap.applyMixins=Toe});var Ar=f(Ge=>{"use strict";var NL=Ge&&Ge.__extends||function(){var t=function(e,r){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(n[o]=i[o])},t(e,r)};return function(e,r){if(typeof r!="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");t(e,r);function n(){this.constructor=e}e.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),ru=Ge&&Ge.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(Ge,"__esModule",{value:!0});Ge.EmbeddedActionsParser=Ge.CstParser=Ge.Parser=Ge.EMPTY_ALT=Ge.ParserDefinitionErrorType=Ge.DEFAULT_RULE_CONFIG=Ge.DEFAULT_PARSER_CONFIG=Ge.END_OF_FILE=void 0;var iT=ru(Or()),Roe=ru(Ut()),boe=ru(Gt()),Po=ru(Yn()),SL=ru(Ir()),kL=ru(wi()),Aoe=Ds(),Poe=uI(),CL=ca(),wL=Us(),EL=Rq(),Soe=X_(),Coe=qq(),Eoe=Vq(),Noe=Xq(),koe=Qq(),woe=aL(),Ooe=lL(),Doe=pL(),Ioe=bL(),xoe=AL(),qoe=PL(),Loe=qc();Ge.END_OF_FILE=(0,CL.createTokenInstance)(CL.EOF,"",NaN,NaN,NaN,NaN,NaN,NaN);Object.freeze(Ge.END_OF_FILE);Ge.DEFAULT_PARSER_CONFIG=Object.freeze({recoveryEnabled:!1,maxLookahead:3,dynamicTokensEnabled:!1,outputCst:!0,errorMessageProvider:wL.defaultParserErrorProvider,nodeLocationTracking:"none",traceInitPerf:!1,skipValidations:!1});Ge.DEFAULT_RULE_CONFIG=Object.freeze({recoveryValueFunc:function(){},resyncEnabled:!0});var Moe;(function(t){t[t.INVALID_RULE_NAME=0]="INVALID_RULE_NAME",t[t.DUPLICATE_RULE_NAME=1]="DUPLICATE_RULE_NAME",t[t.INVALID_RULE_OVERRIDE=2]="INVALID_RULE_OVERRIDE",t[t.DUPLICATE_PRODUCTIONS=3]="DUPLICATE_PRODUCTIONS",t[t.UNRESOLVED_SUBRULE_REF=4]="UNRESOLVED_SUBRULE_REF",t[t.LEFT_RECURSION=5]="LEFT_RECURSION",t[t.NONE_LAST_EMPTY_ALT=6]="NONE_LAST_EMPTY_ALT",t[t.AMBIGUOUS_ALTS=7]="AMBIGUOUS_ALTS",t[t.CONFLICT_TOKENS_RULES_NAMESPACE=8]="CONFLICT_TOKENS_RULES_NAMESPACE",t[t.INVALID_TOKEN_NAME=9]="INVALID_TOKEN_NAME",t[t.NO_NON_EMPTY_LOOKAHEAD=10]="NO_NON_EMPTY_LOOKAHEAD",t[t.AMBIGUOUS_PREFIX_ALTS=11]="AMBIGUOUS_PREFIX_ALTS",t[t.TOO_MANY_ALTS=12]="TOO_MANY_ALTS",t[t.CUSTOM_LOOKAHEAD_VALIDATION=13]="CUSTOM_LOOKAHEAD_VALIDATION"})(Moe=Ge.ParserDefinitionErrorType||(Ge.ParserDefinitionErrorType={}));function $oe(t){return t===void 0&&(t=void 0),function(){return t}}Ge.EMPTY_ALT=$oe;var Pp=function(){function t(e,r){this.definitionErrors=[],this.selfAnalysisDone=!1;var n=this;if(n.initErrorHandler(r),n.initLexerAdapter(),n.initLooksAhead(r),n.initRecognizerEngine(e,r),n.initRecoverable(r),n.initTreeBuilder(r),n.initContentAssist(),n.initGastRecorder(r),n.initPerformanceTracer(r),(0,SL.default)(r,"ignoredIssues"))throw new Error(`The <ignoredIssues> IParserConfig property has been deprecated.
	Please use the <IGNORE_AMBIGUITIES> flag on the relevant DSL method instead.
	See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#IGNORING_AMBIGUITIES
	For further details.`);this.skipValidations=(0,SL.default)(r,"skipValidations")?r.skipValidations:Ge.DEFAULT_PARSER_CONFIG.skipValidations}return t.performSelfAnalysis=function(e){throw Error("The **static** `performSelfAnalysis` method has been deprecated.	\nUse the **instance** method with the same name instead.")},t.prototype.performSelfAnalysis=function(){var e=this;this.TRACE_INIT("performSelfAnalysis",function(){var r;e.selfAnalysisDone=!0;var n=e.className;e.TRACE_INIT("toFastProps",function(){(0,Aoe.toFastProperties)(e)}),e.TRACE_INIT("Grammar Recording",function(){try{e.enableRecording(),(0,boe.default)(e.definedRulesNames,function(o){var a=e[o],s=a.originalGrammarAction,u;e.TRACE_INIT("".concat(o," Rule"),function(){u=e.topLevelRuleRecord(o,s)}),e.gastProductionsCache[o]=u})}finally{e.disableRecording()}});var i=[];if(e.TRACE_INIT("Grammar Resolving",function(){i=(0,EL.resolveGrammar)({rules:(0,Po.default)(e.gastProductionsCache)}),e.definitionErrors=e.definitionErrors.concat(i)}),e.TRACE_INIT("Grammar Validations",function(){if((0,iT.default)(i)&&e.skipValidations===!1){var o=(0,EL.validateGrammar)({rules:(0,Po.default)(e.gastProductionsCache),tokenTypes:(0,Po.default)(e.tokensMap),errMsgProvider:wL.defaultGrammarValidatorErrorProvider,grammarName:n}),a=(0,Loe.validateLookahead)({lookaheadStrategy:e.lookaheadStrategy,rules:(0,Po.default)(e.gastProductionsCache),tokenTypes:(0,Po.default)(e.tokensMap),grammarName:n});e.definitionErrors=e.definitionErrors.concat(o,a)}}),(0,iT.default)(e.definitionErrors)&&(e.recoveryEnabled&&e.TRACE_INIT("computeAllProdsFollows",function(){var o=(0,Poe.computeAllProdsFollows)((0,Po.default)(e.gastProductionsCache));e.resyncFollows=o}),e.TRACE_INIT("ComputeLookaheadFunctions",function(){var o,a;(a=(o=e.lookaheadStrategy).initialize)===null||a===void 0||a.call(o,{rules:(0,Po.default)(e.gastProductionsCache)}),e.preComputeLookaheadFunctions((0,Po.default)(e.gastProductionsCache))})),!t.DEFER_DEFINITION_ERRORS_HANDLING&&!(0,iT.default)(e.definitionErrors))throw r=(0,Roe.default)(e.definitionErrors,function(o){return o.message}),new Error(`Parser Definition Errors detected:
 `.concat(r.join(`
-------------------------------
`)))})},t.DEFER_DEFINITION_ERRORS_HANDLING=!1,t}();Ge.Parser=Pp;(0,qoe.applyMixins)(Pp,[Soe.Recoverable,Coe.LooksAhead,Eoe.TreeBuilder,Noe.LexerAdapter,woe.RecognizerEngine,koe.RecognizerApi,Ooe.ErrorHandler,Doe.ContentAssist,Ioe.GastRecorder,xoe.PerformanceTracer]);var Foe=function(t){NL(e,t);function e(r,n){n===void 0&&(n=Ge.DEFAULT_PARSER_CONFIG);var i=(0,kL.default)(n);return i.outputCst=!0,t.call(this,r,i)||this}return e}(Pp);Ge.CstParser=Foe;var joe=function(t){NL(e,t);function e(r,n){n===void 0&&(n=Ge.DEFAULT_PARSER_CONFIG);var i=(0,kL.default)(n);return i.outputCst=!1,t.call(this,r,i)||this}return e}(Pp);Ge.EmbeddedActionsParser=joe});var DL=f(So=>{"use strict";var Uoe=So&&So.__extends||function(){var t=function(e,r){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(n[o]=i[o])},t(e,r)};return function(e,r){if(typeof r!="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");t(e,r);function n(){this.constructor=e}e.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),nu=So&&So.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(So,"__esModule",{value:!0});So.buildModel=void 0;var OL=_t(),Wc=nu(Ut()),Goe=nu(Sn()),Hoe=nu(Yn()),Woe=nu(If()),Boe=nu(q_()),Koe=nu(Ac());function zoe(t){var e=new Voe,r=(0,Hoe.default)(t);return(0,Wc.default)(r,function(n){return e.visitRule(n)})}So.buildModel=zoe;var Voe=function(t){Uoe(e,t);function e(){return t!==null&&t.apply(this,arguments)||this}return e.prototype.visitRule=function(r){var n=this.visitEach(r.definition),i=(0,Boe.default)(n,function(a){return a.propertyName}),o=(0,Wc.default)(i,function(a,s){var u=!(0,Woe.default)(a,function(l){return!l.canBeNull}),c=a[0].type;return a.length>1&&(c=(0,Wc.default)(a,function(l){return l.type})),{name:s,type:c,optional:u}});return{name:r.name,properties:o}},e.prototype.visitAlternative=function(r){return this.visitEachAndOverrideWith(r.definition,{canBeNull:!0})},e.prototype.visitOption=function(r){return this.visitEachAndOverrideWith(r.definition,{canBeNull:!0})},e.prototype.visitRepetition=function(r){return this.visitEachAndOverrideWith(r.definition,{canBeNull:!0})},e.prototype.visitRepetitionMandatory=function(r){return this.visitEach(r.definition)},e.prototype.visitRepetitionMandatoryWithSeparator=function(r){return this.visitEach(r.definition).concat({propertyName:r.separator.name,canBeNull:!0,type:Sp(r.separator)})},e.prototype.visitRepetitionWithSeparator=function(r){return this.visitEachAndOverrideWith(r.definition,{canBeNull:!0}).concat({propertyName:r.separator.name,canBeNull:!0,type:Sp(r.separator)})},e.prototype.visitAlternation=function(r){return this.visitEachAndOverrideWith(r.definition,{canBeNull:!0})},e.prototype.visitTerminal=function(r){return[{propertyName:r.label||r.terminalType.name,canBeNull:!1,type:Sp(r)}]},e.prototype.visitNonTerminal=function(r){return[{propertyName:r.label||r.nonTerminalName,canBeNull:!1,type:Sp(r)}]},e.prototype.visitEachAndOverrideWith=function(r,n){return(0,Wc.default)(this.visitEach(r),function(i){return(0,Koe.default)({},i,n)})},e.prototype.visitEach=function(r){var n=this;return(0,Goe.default)((0,Wc.default)(r,function(i){return n.visit(i)}))},e}(OL.GAstVisitor);function Sp(t){return t instanceof OL.NonTerminal?{kind:"rule",name:t.referencedRule.name}:{kind:"token"}}});var xL=f((gve,IL)=>{var Yoe=Ef();function Xoe(t,e,r){var n=t.length;return r=r===void 0?n:r,!e&&r>=n?t:Yoe(t,e,r)}IL.exports=Xoe});var oT=f((yve,qL)=>{var Joe="\\ud800-\\udfff",Qoe="\\u0300-\\u036f",Zoe="\\ufe20-\\ufe2f",eae="\\u20d0-\\u20ff",tae=Qoe+Zoe+eae,rae="\\ufe0e\\ufe0f",nae="\\u200d",iae=RegExp("["+nae+Joe+tae+rae+"]");function oae(t){return iae.test(t)}qL.exports=oae});var ML=f((vve,LL)=>{function aae(t){return t.split("")}LL.exports=aae});var BL=f((_ve,WL)=>{var $L="\\ud800-\\udfff",sae="\\u0300-\\u036f",uae="\\ufe20-\\ufe2f",cae="\\u20d0-\\u20ff",lae=sae+uae+cae,dae="\\ufe0e\\ufe0f",fae="["+$L+"]",aT="["+lae+"]",sT="\\ud83c[\\udffb-\\udfff]",pae="(?:"+aT+"|"+sT+")",FL="[^"+$L+"]",jL="(?:\\ud83c[\\udde6-\\uddff]){2}",UL="[\\ud800-\\udbff][\\udc00-\\udfff]",hae="\\u200d",GL=pae+"?",HL="["+dae+"]?",mae="(?:"+hae+"(?:"+[FL,jL,UL].join("|")+")"+HL+GL+")*",gae=HL+GL+mae,yae="(?:"+[FL+aT+"?",aT,jL,UL,fae].join("|")+")",vae=RegExp(sT+"(?="+sT+")|"+yae+gae,"g");function _ae(t){return t.match(vae)||[]}WL.exports=_ae});var zL=f((Tve,KL)=>{var Tae=ML(),Rae=oT(),bae=BL();function Aae(t){return Rae(t)?bae(t):Tae(t)}KL.exports=Aae});var YL=f((Rve,VL)=>{var Pae=xL(),Sae=oT(),Cae=zL(),Eae=Bv();function Nae(t){return function(e){e=Eae(e);var r=Sae(e)?Cae(e):void 0,n=r?r[0]:e.charAt(0),i=r?Pae(r,1).join(""):e.slice(1);return n[t]()+i}}VL.exports=Nae});var JL=f((bve,XL)=>{var kae=YL(),wae=kae("toUpperCase");XL.exports=wae});var tM=f(iu=>{"use strict";var ou=iu&&iu.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(iu,"__esModule",{value:!0});iu.genDts=void 0;var Oae=ou(Sn()),Dae=ou(xe()),Cp=ou(Ut()),Iae=ou(Ii()),xae=ou(Ff()),ZL=ou(JL());function qae(t,e){var r=[];return r=r.concat('import type { CstNode, ICstVisitor, IToken } from "chevrotain";'),r=r.concat((0,Oae.default)((0,Cp.default)(t,function(n){return Lae(n)}))),e.includeVisitorInterface&&(r=r.concat(jae(e.visitorInterfaceName,t))),r.join(`

`)+`
`}iu.genDts=qae;function Lae(t){var e=Mae(t),r=$ae(t);return[e,r]}function Mae(t){var e=eM(t.name),r=uT(t.name);return"export interface ".concat(e,` extends CstNode {
  name: "`).concat(t.name,`";
  children: `).concat(r,`;
}`)}function $ae(t){var e=uT(t.name);return"export type ".concat(e,` = {
  `).concat((0,Cp.default)(t.properties,function(r){return Fae(r)}).join(`
  `),`
};`)}function Fae(t){var e=Gae(t.type);return"".concat(t.name).concat(t.optional?"?":"",": ").concat(e,"[];")}function jae(t,e){return"export interface ".concat(t,`<IN, OUT> extends ICstVisitor<IN, OUT> {
  `).concat((0,Cp.default)(e,function(r){return Uae(r)}).join(`
  `),`
}`)}function Uae(t){var e=uT(t.name);return"".concat(t.name,"(children: ").concat(e,", param?: IN): OUT;")}function Gae(t){if((0,Dae.default)(t)){var e=(0,xae.default)((0,Cp.default)(t,function(n){return QL(n)})),r=(0,Iae.default)(e,function(n,i){return n+" | "+i});return"("+r+")"}else return QL(t)}function QL(t){return t.kind==="token"?"IToken":eM(t.name)}function eM(t){return(0,ZL.default)(t)+"CstNode"}function uT(t){return(0,ZL.default)(t)+"CstChildren"}});var rM=f(au=>{"use strict";var Ep=au&&au.__assign||function(){return Ep=Object.assign||function(t){for(var e,r=1,n=arguments.length;r<n;r++){e=arguments[r];for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])}return t},Ep.apply(this,arguments)};Object.defineProperty(au,"__esModule",{value:!0});au.generateCstDts=void 0;var Hae=DL(),Wae=tM(),Bae={includeVisitorInterface:!0,visitorInterfaceName:"ICstNodeVisitor"};function Kae(t,e){var r=Ep(Ep({},Bae),e),n=(0,Hae.buildModel)(t);return(0,Wae.genDts)(n,r)}au.generateCstDts=Kae});var iM=f(Np=>{"use strict";Object.defineProperty(Np,"__esModule",{value:!0});Np.createSyntaxDiagramsCode=void 0;var nM=_v();function zae(t,e){var r=e===void 0?{}:e,n=r.resourceBase,i=n===void 0?"https://unpkg.com/chevrotain@".concat(nM.VERSION,"/diagrams/"):n,o=r.css,a=o===void 0?"https://unpkg.com/chevrotain@".concat(nM.VERSION,"/diagrams/diagrams.css"):o,s=`
<!-- This is a generated file -->
<!DOCTYPE html>
<meta charset="utf-8">
<style>
  body {
    background-color: hsl(30, 20%, 95%)
  }
</style>

`,u=`
<link rel='stylesheet' href='`.concat(a,`'>
`),c=`
<script src='`.concat(i,`vendor/railroad-diagrams.js'><\/script>
<script src='`).concat(i,`src/diagrams_builder.js'><\/script>
<script src='`).concat(i,`src/diagrams_behavior.js'><\/script>
<script src='`).concat(i,`src/main.js'><\/script>
`),l=`
<div id="diagrams" align="center"></div>    
`,d=`
<script>
    window.serializedGrammar = `.concat(JSON.stringify(t,null,"  "),`;
<\/script>
`),h=`
<script>
    var diagramsDiv = document.getElementById("diagrams");
    main.drawDiagramsFromSerializedGrammar(serializedGrammar, diagramsDiv);
<\/script>
`;return s+u+c+l+d+h}Np.createSyntaxDiagramsCode=zae});var ya=f(U=>{"use strict";Object.defineProperty(U,"__esModule",{value:!0});U.Parser=U.createSyntaxDiagramsCode=U.clearCache=U.generateCstDts=U.GAstVisitor=U.serializeProduction=U.serializeGrammar=U.Terminal=U.Rule=U.RepetitionWithSeparator=U.RepetitionMandatoryWithSeparator=U.RepetitionMandatory=U.Repetition=U.Option=U.NonTerminal=U.Alternative=U.Alternation=U.defaultLexerErrorProvider=U.NoViableAltException=U.NotAllInputParsedException=U.MismatchedTokenException=U.isRecognitionException=U.EarlyExitException=U.defaultParserErrorProvider=U.LLkLookaheadStrategy=U.getLookaheadPaths=U.tokenName=U.tokenMatcher=U.tokenLabel=U.EOF=U.createTokenInstance=U.createToken=U.LexerDefinitionErrorType=U.Lexer=U.EMPTY_ALT=U.ParserDefinitionErrorType=U.EmbeddedActionsParser=U.CstParser=U.VERSION=void 0;var Vae=_v();Object.defineProperty(U,"VERSION",{enumerable:!0,get:function(){return Vae.VERSION}});var kp=Ar();Object.defineProperty(U,"CstParser",{enumerable:!0,get:function(){return kp.CstParser}});Object.defineProperty(U,"EmbeddedActionsParser",{enumerable:!0,get:function(){return kp.EmbeddedActionsParser}});Object.defineProperty(U,"ParserDefinitionErrorType",{enumerable:!0,get:function(){return kp.ParserDefinitionErrorType}});Object.defineProperty(U,"EMPTY_ALT",{enumerable:!0,get:function(){return kp.EMPTY_ALT}});var oM=Nc();Object.defineProperty(U,"Lexer",{enumerable:!0,get:function(){return oM.Lexer}});Object.defineProperty(U,"LexerDefinitionErrorType",{enumerable:!0,get:function(){return oM.LexerDefinitionErrorType}});var su=ca();Object.defineProperty(U,"createToken",{enumerable:!0,get:function(){return su.createToken}});Object.defineProperty(U,"createTokenInstance",{enumerable:!0,get:function(){return su.createTokenInstance}});Object.defineProperty(U,"EOF",{enumerable:!0,get:function(){return su.EOF}});Object.defineProperty(U,"tokenLabel",{enumerable:!0,get:function(){return su.tokenLabel}});Object.defineProperty(U,"tokenMatcher",{enumerable:!0,get:function(){return su.tokenMatcher}});Object.defineProperty(U,"tokenName",{enumerable:!0,get:function(){return su.tokenName}});var Yae=Gs();Object.defineProperty(U,"getLookaheadPaths",{enumerable:!0,get:function(){return Yae.getLookaheadPaths}});var Xae=Q_();Object.defineProperty(U,"LLkLookaheadStrategy",{enumerable:!0,get:function(){return Xae.LLkLookaheadStrategy}});var Jae=Us();Object.defineProperty(U,"defaultParserErrorProvider",{enumerable:!0,get:function(){return Jae.defaultParserErrorProvider}});var Bc=Ws();Object.defineProperty(U,"EarlyExitException",{enumerable:!0,get:function(){return Bc.EarlyExitException}});Object.defineProperty(U,"isRecognitionException",{enumerable:!0,get:function(){return Bc.isRecognitionException}});Object.defineProperty(U,"MismatchedTokenException",{enumerable:!0,get:function(){return Bc.MismatchedTokenException}});Object.defineProperty(U,"NotAllInputParsedException",{enumerable:!0,get:function(){return Bc.NotAllInputParsedException}});Object.defineProperty(U,"NoViableAltException",{enumerable:!0,get:function(){return Bc.NoViableAltException}});var Qae=C_();Object.defineProperty(U,"defaultLexerErrorProvider",{enumerable:!0,get:function(){return Qae.defaultLexerErrorProvider}});var ui=_t();Object.defineProperty(U,"Alternation",{enumerable:!0,get:function(){return ui.Alternation}});Object.defineProperty(U,"Alternative",{enumerable:!0,get:function(){return ui.Alternative}});Object.defineProperty(U,"NonTerminal",{enumerable:!0,get:function(){return ui.NonTerminal}});Object.defineProperty(U,"Option",{enumerable:!0,get:function(){return ui.Option}});Object.defineProperty(U,"Repetition",{enumerable:!0,get:function(){return ui.Repetition}});Object.defineProperty(U,"RepetitionMandatory",{enumerable:!0,get:function(){return ui.RepetitionMandatory}});Object.defineProperty(U,"RepetitionMandatoryWithSeparator",{enumerable:!0,get:function(){return ui.RepetitionMandatoryWithSeparator}});Object.defineProperty(U,"RepetitionWithSeparator",{enumerable:!0,get:function(){return ui.RepetitionWithSeparator}});Object.defineProperty(U,"Rule",{enumerable:!0,get:function(){return ui.Rule}});Object.defineProperty(U,"Terminal",{enumerable:!0,get:function(){return ui.Terminal}});var cT=_t();Object.defineProperty(U,"serializeGrammar",{enumerable:!0,get:function(){return cT.serializeGrammar}});Object.defineProperty(U,"serializeProduction",{enumerable:!0,get:function(){return cT.serializeProduction}});Object.defineProperty(U,"GAstVisitor",{enumerable:!0,get:function(){return cT.GAstVisitor}});var Zae=rM();Object.defineProperty(U,"generateCstDts",{enumerable:!0,get:function(){return Zae.generateCstDts}});function ese(){console.warn(`The clearCache function was 'soft' removed from the Chevrotain API.
	 It performs no action other than printing this message.
	 Please avoid using it as it will be completely removed in the future`)}U.clearCache=ese;var tse=iM();Object.defineProperty(U,"createSyntaxDiagramsCode",{enumerable:!0,get:function(){return tse.createSyntaxDiagramsCode}});var rse=function(){function t(){throw new Error(`The Parser class has been deprecated, use CstParser or EmbeddedActionsParser instead.	
See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_7-0-0`)}return t}();U.Parser=rse});var dM=f(V=>{"use strict";var aM=V&&V.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(V,"__esModule",{value:!0});V.createATN=V.RuleTransition=V.EpsilonTransition=V.AtomTransition=V.AbstractTransition=V.ATN_LOOP_END=V.ATN_PLUS_LOOP_BACK=V.ATN_STAR_LOOP_ENTRY=V.ATN_STAR_LOOP_BACK=V.ATN_BLOCK_END=V.ATN_RULE_STOP=V.ATN_TOKEN_START=V.ATN_STAR_BLOCK_START=V.ATN_PLUS_BLOCK_START=V.ATN_RULE_START=V.ATN_BASIC=V.ATN_INVALID_TYPE=V.buildATNKey=void 0;var sM=aM(Ut()),nse=aM(Ec()),Pr=ya();function zc(t,e,r){return`${t.name}_${e}_${r}`}V.buildATNKey=zc;V.ATN_INVALID_TYPE=0;V.ATN_BASIC=1;V.ATN_RULE_START=2;V.ATN_PLUS_BLOCK_START=4;V.ATN_STAR_BLOCK_START=5;V.ATN_TOKEN_START=6;V.ATN_RULE_STOP=7;V.ATN_BLOCK_END=8;V.ATN_STAR_LOOP_BACK=9;V.ATN_STAR_LOOP_ENTRY=10;V.ATN_PLUS_LOOP_BACK=11;V.ATN_LOOP_END=12;var uu=class{constructor(e){this.target=e}isEpsilon(){return!1}};V.AbstractTransition=uu;var wp=class extends uu{constructor(e,r){super(e),this.tokenType=r}};V.AtomTransition=wp;var Op=class extends uu{constructor(e){super(e)}isEpsilon(){return!0}};V.EpsilonTransition=Op;var Kc=class extends uu{constructor(e,r,n){super(e),this.rule=r,this.followState=n}isEpsilon(){return!0}};V.RuleTransition=Kc;function ise(t){let e={decisionMap:{},decisionStates:[],ruleToStartState:new Map,ruleToStopState:new Map,states:[]};ose(e,t);let r=t.length;for(let n=0;n<r;n++){let i=t[n],o=va(e,i,i);o!==void 0&&gse(e,i,o)}return e}V.createATN=ise;function ose(t,e){let r=e.length;for(let n=0;n<r;n++){let i=e[n],o=Wt(t,i,void 0,{type:V.ATN_RULE_START}),a=Wt(t,i,void 0,{type:V.ATN_RULE_STOP});o.stop=a,t.ruleToStartState.set(i,o),t.ruleToStopState.set(i,a)}}function uM(t,e,r){return r instanceof Pr.Terminal?lT(t,e,r.terminalType,r):r instanceof Pr.NonTerminal?mse(t,e,r):r instanceof Pr.Alternation?lse(t,e,r):r instanceof Pr.Option?dse(t,e,r):r instanceof Pr.Repetition?ase(t,e,r):r instanceof Pr.RepetitionWithSeparator?sse(t,e,r):r instanceof Pr.RepetitionMandatory?use(t,e,r):r instanceof Pr.RepetitionMandatoryWithSeparator?cse(t,e,r):va(t,e,r)}function ase(t,e,r){let n=Wt(t,e,r,{type:V.ATN_STAR_BLOCK_START});Co(t,n);let i=cu(t,e,n,r,va(t,e,r));return lM(t,e,r,i)}function sse(t,e,r){let n=Wt(t,e,r,{type:V.ATN_STAR_BLOCK_START});Co(t,n);let i=cu(t,e,n,r,va(t,e,r)),o=lT(t,e,r.separator,r);return lM(t,e,r,i,o)}function use(t,e,r){let n=Wt(t,e,r,{type:V.ATN_PLUS_BLOCK_START});Co(t,n);let i=cu(t,e,n,r,va(t,e,r));return cM(t,e,r,i)}function cse(t,e,r){let n=Wt(t,e,r,{type:V.ATN_PLUS_BLOCK_START});Co(t,n);let i=cu(t,e,n,r,va(t,e,r)),o=lT(t,e,r.separator,r);return cM(t,e,r,i,o)}function lse(t,e,r){let n=Wt(t,e,r,{type:V.ATN_BASIC});Co(t,n);let i=(0,sM.default)(r.definition,a=>uM(t,e,a));return cu(t,e,n,r,...i)}function dse(t,e,r){let n=Wt(t,e,r,{type:V.ATN_BASIC});Co(t,n);let i=cu(t,e,n,r,va(t,e,r));return fse(t,e,r,i)}function va(t,e,r){let n=(0,nse.default)((0,sM.default)(r.definition,i=>uM(t,e,i)),i=>i!==void 0);return n.length===1?n[0]:n.length===0?void 0:hse(t,n)}function cM(t,e,r,n,i){let o=n.left,a=n.right,s=Wt(t,e,r,{type:V.ATN_PLUS_LOOP_BACK});Co(t,s);let u=Wt(t,e,r,{type:V.ATN_LOOP_END});return o.loopback=s,u.loopback=s,t.decisionMap[zc(e,i?"RepetitionMandatoryWithSeparator":"RepetitionMandatory",r.idx)]=s,wt(a,s),i===void 0?(wt(s,o),wt(s,u)):(wt(s,u),wt(s,i.left),wt(i.right,o)),{left:o,right:u}}function lM(t,e,r,n,i){let o=n.left,a=n.right,s=Wt(t,e,r,{type:V.ATN_STAR_LOOP_ENTRY});Co(t,s);let u=Wt(t,e,r,{type:V.ATN_LOOP_END}),c=Wt(t,e,r,{type:V.ATN_STAR_LOOP_BACK});return s.loopback=c,u.loopback=c,wt(s,o),wt(s,u),wt(a,c),i!==void 0?(wt(c,u),wt(c,i.left),wt(i.right,o)):wt(c,s),t.decisionMap[zc(e,i?"RepetitionWithSeparator":"Repetition",r.idx)]=s,{left:s,right:u}}function fse(t,e,r,n){let i=n.left,o=n.right;return wt(i,o),t.decisionMap[zc(e,"Option",r.idx)]=i,n}function Co(t,e){return t.decisionStates.push(e),e.decision=t.decisionStates.length-1,e.decision}function cu(t,e,r,n,...i){let o=Wt(t,e,n,{type:V.ATN_BLOCK_END,start:r});r.end=o;for(let s of i)s!==void 0?(wt(r,s.left),wt(s.right,o)):wt(r,o);let a={left:r,right:o};return t.decisionMap[zc(e,pse(n),n.idx)]=r,a}function pse(t){if(t instanceof Pr.Alternation)return"Alternation";if(t instanceof Pr.Option)return"Option";if(t instanceof Pr.Repetition)return"Repetition";if(t instanceof Pr.RepetitionWithSeparator)return"RepetitionWithSeparator";if(t instanceof Pr.RepetitionMandatory)return"RepetitionMandatory";if(t instanceof Pr.RepetitionMandatoryWithSeparator)return"RepetitionMandatoryWithSeparator";throw new Error("Invalid production type encountered")}function hse(t,e){let r=e.length;for(let o=0;o<r-1;o++){let a=e[o],s;a.left.transitions.length===1&&(s=a.left.transitions[0]);let u=s instanceof Kc,c=s,l=e[o+1].left;a.left.type===V.ATN_BASIC&&a.right.type===V.ATN_BASIC&&s!==void 0&&(u&&c.followState===a.right||s.target===a.right)?(u?c.followState=l:s.target=l,yse(t,a.right)):wt(a.right,l)}let n=e[0],i=e[r-1];return{left:n.left,right:i.right}}function lT(t,e,r,n){let i=Wt(t,e,n,{type:V.ATN_BASIC}),o=Wt(t,e,n,{type:V.ATN_BASIC});return dT(i,new wp(o,r)),{left:i,right:o}}function mse(t,e,r){let n=r.referencedRule,i=t.ruleToStartState.get(n),o=Wt(t,e,r,{type:V.ATN_BASIC}),a=Wt(t,e,r,{type:V.ATN_BASIC}),s=new Kc(i,n,a);return dT(o,s),{left:o,right:a}}function gse(t,e,r){let n=t.ruleToStartState.get(e);wt(n,r.left);let i=t.ruleToStopState.get(e);return wt(r.right,i),{left:n,right:i}}function wt(t,e){let r=new Op(e);dT(t,r)}function Wt(t,e,r,n){let i=Object.assign({atn:t,production:r,epsilonOnlyTransitions:!1,rule:e,transitions:[],nextTokenWithinRule:[],stateNumber:t.states.length},n);return t.states.push(i),i}function dT(t,e){t.transitions.length===0&&(t.epsilonOnlyTransitions=e.isEpsilon()),t.transitions.push(e)}function yse(t,e){t.states.splice(t.states.indexOf(e),1)}});var pM=f(ci=>{"use strict";var vse=ci&&ci.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(ci,"__esModule",{value:!0});ci.getATNConfigKey=ci.ATNConfigSet=ci.DFA_ERROR=void 0;var _se=vse(Ut());ci.DFA_ERROR={};var fT=class{constructor(){this.map={},this.configs=[]}get size(){return this.configs.length}finalize(){this.map={}}add(e){let r=fM(e);r in this.map||(this.map[r]=this.configs.length,this.configs.push(e))}get elements(){return this.configs}get alts(){return(0,_se.default)(this.configs,e=>e.alt)}get key(){let e="";for(let r in this.map)e+=r+":";return e}};ci.ATNConfigSet=fT;function fM(t,e=!0){return`${e?`a${t.alt}`:""}s${t.state.stateNumber}:${t.stack.map(r=>r.stateNumber.toString()).join("_")}`}ci.getATNConfigKey=fM});var mM=f((kve,hM)=>{var Tse=Es();function Rse(t,e,r){for(var n=-1,i=t.length;++n<i;){var o=t[n],a=e(o);if(a!=null&&(s===void 0?a===a&&!Tse(a):r(a,s)))var s=a,u=o}return u}hM.exports=Rse});var yM=f((wve,gM)=>{function bse(t,e){return t<e}gM.exports=bse});var _M=f((Ove,vM)=>{var Ase=mM(),Pse=yM(),Sse=ia();function Cse(t){return t&&t.length?Ase(t,Sse,Pse):void 0}vM.exports=Cse});var RM=f((Dve,TM)=>{var Ese=Xr(),Nse=s_();function kse(t,e){return t&&t.length?Nse(t,Ese(e,2)):[]}TM.exports=kse});var NM=f(lu=>{"use strict";var No=lu&&lu.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(lu,"__esModule",{value:!0});lu.LLStarLookaheadStrategy=void 0;var Lr=ya(),kn=dM(),Eo=pM(),wse=No(_M()),Ose=No(np()),Dse=No(RM()),Vc=No(Ut()),Ise=No(Sn()),pT=No(Gt()),xse=No(Or()),bM=No(Ii());function qse(t,e){let r={};return n=>{let i=n.toString(),o=r[i];return o!==void 0||(o={atnStartState:t,decision:e,states:{}},r[i]=o),o}}var Dp=class{constructor(){this.predicates=[]}is(e){return e>=this.predicates.length||this.predicates[e]}set(e,r){this.predicates[e]=r}toString(){let e="",r=this.predicates.length;for(let n=0;n<r;n++)e+=this.predicates[n]===!0?"1":"0";return e}},AM=new Dp,mT=class extends Lr.LLkLookaheadStrategy{constructor(e){var r;super(),this.logging=(r=e?.logging)!==null&&r!==void 0?r:n=>console.log(n)}initialize(e){this.atn=(0,kn.createATN)(e.rules),this.dfas=Lse(this.atn)}validateAmbiguousAlternationAlternatives(){return[]}validateEmptyOrAlternatives(){return[]}buildLookaheadForAlternation(e){let{prodOccurrence:r,rule:n,hasPredicates:i,dynamicTokensEnabled:o}=e,a=this.dfas,s=this.logging,u=(0,kn.buildATNKey)(n,"Alternation",r),l=this.atn.decisionMap[u].decision,d=(0,Vc.default)((0,Lr.getLookaheadPaths)({maxLookahead:1,occurrence:r,prodType:"Alternation",rule:n}),h=>(0,Vc.default)(h,v=>v[0]));if(PM(d,!1)&&!o){let h=(0,bM.default)(d,(v,g,R)=>((0,pT.default)(g,E=>{E&&(v[E.tokenTypeIdx]=R,(0,pT.default)(E.categoryMatches,N=>{v[N]=R}))}),v),{});return i?function(v){var g;let R=this.LA(1),E=h[R.tokenTypeIdx];if(v!==void 0&&E!==void 0){let N=(g=v[E])===null||g===void 0?void 0:g.GATE;if(N!==void 0&&N.call(this)===!1)return}return E}:function(){let v=this.LA(1);return h[v.tokenTypeIdx]}}else return i?function(h){let v=new Dp,g=h===void 0?0:h.length;for(let E=0;E<g;E++){let N=h?.[E].GATE;v.set(E,N===void 0||N.call(this))}let R=hT.call(this,a,l,v,s);return typeof R=="number"?R:void 0}:function(){let h=hT.call(this,a,l,AM,s);return typeof h=="number"?h:void 0}}buildLookaheadForOptional(e){let{prodOccurrence:r,rule:n,prodType:i,dynamicTokensEnabled:o}=e,a=this.dfas,s=this.logging,u=(0,kn.buildATNKey)(n,i,r),l=this.atn.decisionMap[u].decision,d=(0,Vc.default)((0,Lr.getLookaheadPaths)({maxLookahead:1,occurrence:r,prodType:i,rule:n}),h=>(0,Vc.default)(h,v=>v[0]));if(PM(d)&&d[0][0]&&!o){let h=d[0],v=(0,Ise.default)(h);if(v.length===1&&(0,xse.default)(v[0].categoryMatches)){let R=v[0].tokenTypeIdx;return function(){return this.LA(1).tokenTypeIdx===R}}else{let g=(0,bM.default)(v,(R,E)=>(E!==void 0&&(R[E.tokenTypeIdx]=!0,(0,pT.default)(E.categoryMatches,N=>{R[N]=!0})),R),{});return function(){let R=this.LA(1);return g[R.tokenTypeIdx]===!0}}}return function(){let h=hT.call(this,a,l,AM,s);return typeof h=="object"?!1:h===0}}};lu.LLStarLookaheadStrategy=mT;function PM(t,e=!0){let r=new Set;for(let n of t){let i=new Set;for(let o of n){if(o===void 0){if(e)break;return!1}let a=[o.tokenTypeIdx].concat(o.categoryMatches);for(let s of a)if(r.has(s)){if(!i.has(s))return!1}else r.add(s),i.add(s)}}return!0}function Lse(t){let e=t.decisionStates.length,r=Array(e);for(let n=0;n<e;n++)r[n]=qse(t.decisionStates[n],n);return r}function hT(t,e,r,n){let i=t[e](r),o=i.start;if(o===void 0){let s=zse(i.atnStartState);o=EM(i,CM(s)),i.start=o}return Mse.apply(this,[i,o,r,n])}function Mse(t,e,r,n){let i=e,o=1,a=[],s=this.LA(o++);for(;;){let u=Hse(i,s);if(u===void 0&&(u=$se.apply(this,[t,i,s,o,r,n])),u===Eo.DFA_ERROR)return Gse(a,i,s);if(u.isAcceptState===!0)return u.prediction;i=u,a.push(s),s=this.LA(o++)}}function $se(t,e,r,n,i,o){let a=Wse(e.configs,r,i);if(a.size===0)return SM(t,e,r,Eo.DFA_ERROR),Eo.DFA_ERROR;let s=CM(a),u=Kse(a,i);if(u!==void 0)s.isAcceptState=!0,s.prediction=u,s.configs.uniqueAlt=u;else if(Jse(a)){let c=(0,wse.default)(a.alts);s.isAcceptState=!0,s.prediction=c,s.configs.uniqueAlt=c,Fse.apply(this,[t,n,a.alts,o])}return s=SM(t,e,r,s),s}function Fse(t,e,r,n){let i=[];for(let c=1;c<=e;c++)i.push(this.LA(c).tokenType);let o=t.atnStartState,a=o.rule,s=o.production,u=jse({topLevelRule:a,ambiguityIndices:r,production:s,prefixPath:i});n(u)}function jse(t){let e=(0,Vc.default)(t.prefixPath,i=>(0,Lr.tokenLabel)(i)).join(", "),r=t.production.idx===0?"":t.production.idx,n=`Ambiguous Alternatives Detected: <${t.ambiguityIndices.join(", ")}> in <${Use(t.production)}${r}> inside <${t.topLevelRule.name}> Rule,
<${e}> may appears as a prefix path in all these alternatives.
`;return n=n+`See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#AMBIGUOUS_ALTERNATIVES
For Further details.`,n}function Use(t){if(t instanceof Lr.NonTerminal)return"SUBRULE";if(t instanceof Lr.Option)return"OPTION";if(t instanceof Lr.Alternation)return"OR";if(t instanceof Lr.RepetitionMandatory)return"AT_LEAST_ONE";if(t instanceof Lr.RepetitionMandatoryWithSeparator)return"AT_LEAST_ONE_SEP";if(t instanceof Lr.RepetitionWithSeparator)return"MANY_SEP";if(t instanceof Lr.Repetition)return"MANY";if(t instanceof Lr.Terminal)return"CONSUME";throw Error("non exhaustive match")}function Gse(t,e,r){let n=(0,Ose.default)(e.configs.elements,o=>o.state.transitions),i=(0,Dse.default)(n.filter(o=>o instanceof kn.AtomTransition).map(o=>o.tokenType),o=>o.tokenTypeIdx);return{actualToken:r,possibleTokenTypes:i,tokenPath:t}}function Hse(t,e){return t.edges[e.tokenTypeIdx]}function Wse(t,e,r){let n=new Eo.ATNConfigSet,i=[];for(let a of t.elements){if(r.is(a.alt)===!1)continue;if(a.state.type===kn.ATN_RULE_STOP){i.push(a);continue}let s=a.state.transitions.length;for(let u=0;u<s;u++){let c=a.state.transitions[u],l=Bse(c,e);l!==void 0&&n.add({state:l,alt:a.alt,stack:a.stack})}}let o;if(i.length===0&&n.size===1&&(o=n),o===void 0){o=new Eo.ATNConfigSet;for(let a of n.elements)Ip(a,o)}if(i.length>0&&!Yse(o))for(let a of i)o.add(a);return o}function Bse(t,e){if(t instanceof kn.AtomTransition&&(0,Lr.tokenMatcher)(e,t.tokenType))return t.target}function Kse(t,e){let r;for(let n of t.elements)if(e.is(n.alt)===!0){if(r===void 0)r=n.alt;else if(r!==n.alt)return}return r}function CM(t){return{configs:t,edges:{},isAcceptState:!1,prediction:-1}}function SM(t,e,r,n){return n=EM(t,n),e.edges[r.tokenTypeIdx]=n,n}function EM(t,e){if(e===Eo.DFA_ERROR)return e;let r=e.configs.key,n=t.states[r];return n!==void 0?n:(e.configs.finalize(),t.states[r]=e,e)}function zse(t){let e=new Eo.ATNConfigSet,r=t.transitions.length;for(let n=0;n<r;n++){let o={state:t.transitions[n].target,alt:n,stack:[]};Ip(o,e)}return e}function Ip(t,e){let r=t.state;if(r.type===kn.ATN_RULE_STOP){if(t.stack.length>0){let i=[...t.stack],a={state:i.pop(),alt:t.alt,stack:i};Ip(a,e)}else e.add(t);return}r.epsilonOnlyTransitions||e.add(t);let n=r.transitions.length;for(let i=0;i<n;i++){let o=r.transitions[i],a=Vse(t,o);a!==void 0&&Ip(a,e)}}function Vse(t,e){if(e instanceof kn.EpsilonTransition)return{state:e.target,alt:t.alt,stack:t.stack};if(e instanceof kn.RuleTransition){let r=[...t.stack,e.followState];return{state:e.target,alt:t.alt,stack:r}}}function Yse(t){for(let e of t.elements)if(e.state.type===kn.ATN_RULE_STOP)return!0;return!1}function Xse(t){for(let e of t.elements)if(e.state.type!==kn.ATN_RULE_STOP)return!1;return!0}function Jse(t){if(Xse(t))return!0;let e=Qse(t.elements);return Zse(e)&&!eue(e)}function Qse(t){let e=new Map;for(let r of t){let n=(0,Eo.getATNConfigKey)(r,!1),i=e.get(n);i===void 0&&(i={},e.set(n,i)),i[r.alt]=!0}return e}function Zse(t){for(let e of Array.from(t.values()))if(Object.keys(e).length>1)return!0;return!1}function eue(t){for(let e of Array.from(t.values()))if(Object.keys(e).length===1)return!0;return!1}});var kM=f(xp=>{"use strict";Object.defineProperty(xp,"__esModule",{value:!0});xp.LLStarLookaheadStrategy=void 0;var tue=NM();Object.defineProperty(xp,"LLStarLookaheadStrategy",{enumerable:!0,get:function(){return tue.LLStarLookaheadStrategy}})});var yT=f(en=>{"use strict";Object.defineProperty(en,"__esModule",{value:!0});en.RootCstNodeImpl=en.CompositeCstNodeImpl=en.LeafCstNodeImpl=en.AbstractCstNode=en.CstNodeBuilder=void 0;var wM=qa(),rue=er(),OM=qe(),gT=class{constructor(){this.nodeStack=[]}get current(){return this.nodeStack[this.nodeStack.length-1]}buildRootNode(e){return this.rootNode=new qp(e),this.nodeStack=[this.rootNode],this.rootNode}buildCompositeNode(e){let r=new Jc;return r.feature=e,r.root=this.rootNode,this.current.children.push(r),this.nodeStack.push(r),r}buildLeafNode(e,r){let n=new Xc(e.startOffset,e.image.length,(0,OM.tokenToRange)(e),e.tokenType,!1);return n.feature=r,n.root=this.rootNode,this.current.children.push(n),n}removeNode(e){let r=e.parent;if(r){let n=r.children.indexOf(e);n>=0&&r.children.splice(n,1)}}construct(e){let r=this.current;typeof e.$type=="string"&&(this.current.element=e),e.$cstNode=r;let n=this.nodeStack.pop();n?.children.length===0&&this.removeNode(n)}addHiddenTokens(e){for(let r of e){let n=new Xc(r.startOffset,r.image.length,(0,OM.tokenToRange)(r),r.tokenType,!0);n.root=this.rootNode,this.addHiddenToken(this.rootNode,n)}}addHiddenToken(e,r){let{offset:n,end:i}=r;for(let o=0;o<e.children.length;o++){let a=e.children[o],{offset:s,end:u}=a;if((0,rue.isCompositeCstNode)(a)&&n>s&&i<u){this.addHiddenToken(a,r);return}else if(i<=s){e.children.splice(o,0,r);return}}e.children.push(r)}};en.CstNodeBuilder=gT;var Yc=class{get hidden(){return!1}get element(){var e,r;let n=typeof((e=this._element)===null||e===void 0?void 0:e.$type)=="string"?this._element:(r=this.parent)===null||r===void 0?void 0:r.element;if(!n)throw new Error("This node has no associated AST element");return n}set element(e){this._element=e}get text(){return this.root.fullText.substring(this.offset,this.end)}};en.AbstractCstNode=Yc;var Xc=class extends Yc{get offset(){return this._offset}get length(){return this._length}get end(){return this._offset+this._length}get hidden(){return this._hidden}get tokenType(){return this._tokenType}get range(){return this._range}constructor(e,r,n,i,o=!1){super(),this._hidden=o,this._offset=e,this._tokenType=i,this._length=r,this._range=n}};en.LeafCstNodeImpl=Xc;var Jc=class extends Yc{constructor(){super(...arguments),this.children=new Qc(this)}get offset(){var e,r;return(r=(e=this.firstNonHiddenNode)===null||e===void 0?void 0:e.offset)!==null&&r!==void 0?r:0}get length(){return this.end-this.offset}get end(){var e,r;return(r=(e=this.lastNonHiddenNode)===null||e===void 0?void 0:e.end)!==null&&r!==void 0?r:0}get range(){let e=this.firstNonHiddenNode,r=this.lastNonHiddenNode;if(e&&r){if(this._rangeCache===void 0){let{range:n}=e,{range:i}=r;this._rangeCache={start:n.start,end:i.end.line<n.start.line?n.start:i.end}}return this._rangeCache}else return{start:wM.Position.create(0,0),end:wM.Position.create(0,0)}}get firstNonHiddenNode(){for(let e of this.children)if(!e.hidden)return e;return this.children[0]}get lastNonHiddenNode(){for(let e=this.children.length-1;e>=0;e--){let r=this.children[e];if(!r.hidden)return r}return this.children[this.children.length-1]}};en.CompositeCstNodeImpl=Jc;var Qc=class extends Array{constructor(e){super(),this.parent=e,Object.setPrototypeOf(this,Qc.prototype)}push(...e){return this.addParents(e),super.push(...e)}unshift(...e){return this.addParents(e),super.unshift(...e)}splice(e,r,...n){return this.addParents(n),super.splice(e,r,...n)}addParents(e){for(let r of e)r.parent=this.parent}},qp=class extends Jc{get text(){return this._text.substring(this.offset,this.end)}get fullText(){return this._text}constructor(e){super(),this._text="",this._text=e??""}};en.RootCstNodeImpl=qp});var Fp=f(mr=>{"use strict";Object.defineProperty(mr,"__esModule",{value:!0});mr.LangiumCompletionParser=mr.LangiumParserErrorMessageProvider=mr.LangiumParser=mr.AbstractLangiumParser=mr.DatatypeSymbol=void 0;var Mp=ya(),nue=kM(),Lp=ke(),DM=jt(),IM=be(),iue=yT();mr.DatatypeSymbol=Symbol("Datatype");function vT(t){return t.$type===mr.DatatypeSymbol}var xM="\u200B",qM=t=>t.endsWith(xM)?t:t+xM,Zc=class{constructor(e){this._unorderedGroups=new Map,this.lexer=e.parser.Lexer;let r=this.lexer.definition;this.wrapper=new RT(r,e.parser.ParserConfig)}alternatives(e,r){this.wrapper.wrapOr(e,r)}optional(e,r){this.wrapper.wrapOption(e,r)}many(e,r){this.wrapper.wrapMany(e,r)}atLeastOne(e,r){this.wrapper.wrapAtLeastOne(e,r)}isRecording(){return this.wrapper.IS_RECORDING}get unorderedGroups(){return this._unorderedGroups}getRuleStack(){return this.wrapper.RULE_STACK}finalize(){this.wrapper.wrapSelfAnalysis()}};mr.AbstractLangiumParser=Zc;var _T=class extends Zc{get current(){return this.stack[this.stack.length-1]}constructor(e){super(e),this.nodeBuilder=new iue.CstNodeBuilder,this.stack=[],this.assignmentMap=new Map,this.linker=e.references.Linker,this.converter=e.parser.ValueConverter,this.astReflection=e.shared.AstReflection}rule(e,r){let n=e.fragment?void 0:(0,DM.isDataTypeRule)(e)?mr.DatatypeSymbol:(0,DM.getTypeName)(e),i=this.wrapper.DEFINE_RULE(qM(e.name),this.startImplementation(n,r).bind(this));return e.entry&&(this.mainRule=i),i}parse(e){this.nodeBuilder.buildRootNode(e);let r=this.lexer.tokenize(e);this.wrapper.input=r.tokens;let n=this.mainRule.call(this.wrapper,{});return this.nodeBuilder.addHiddenTokens(r.hidden),this.unorderedGroups.clear(),{value:n,lexerErrors:r.errors,parserErrors:this.wrapper.errors}}startImplementation(e,r){return n=>{if(!this.isRecording()){let o={$type:e};this.stack.push(o),e===mr.DatatypeSymbol&&(o.value="")}let i;try{i=r(n)}catch{i=void 0}return!this.isRecording()&&i===void 0&&(i=this.construct()),i}}consume(e,r,n){let i=this.wrapper.wrapConsume(e,r);if(!this.isRecording()&&!i.isInsertedInRecovery){let o=this.nodeBuilder.buildLeafNode(i,n),{assignment:a,isCrossRef:s}=this.getAssignment(n),u=this.current;if(a){let c=(0,Lp.isKeyword)(n)?i.image:this.converter.convert(i.image,o);this.assign(a.operator,a.feature,c,o,s)}else if(vT(u)){let c=i.image;(0,Lp.isKeyword)(n)||(c=this.converter.convert(c,o).toString()),u.value+=c}}}subrule(e,r,n,i){let o;this.isRecording()||(o=this.nodeBuilder.buildCompositeNode(n));let a=this.wrapper.wrapSubrule(e,r,i);!this.isRecording()&&o&&o.length>0&&this.performSubruleAssignment(a,n,o)}performSubruleAssignment(e,r,n){let{assignment:i,isCrossRef:o}=this.getAssignment(r);if(i)this.assign(i.operator,i.feature,e,n,o);else if(!i){let a=this.current;if(vT(a))a.value+=e.toString();else{let s=e.$type,u=this.assignWithoutOverride(e,a);s&&(u.$type=s);let c=u;this.stack.pop(),this.stack.push(c)}}}action(e,r){if(!this.isRecording()){let n=this.current;if(!n.$cstNode&&r.feature&&r.operator){n=this.construct(!1);let o=n.$cstNode.feature;this.nodeBuilder.buildCompositeNode(o)}let i={$type:e};this.stack.pop(),this.stack.push(i),r.feature&&r.operator&&this.assign(r.operator,r.feature,n,n.$cstNode,!1)}}construct(e=!0){if(this.isRecording())return;let r=this.current;return(0,IM.linkContentToContainer)(r),this.nodeBuilder.construct(r),e&&this.stack.pop(),vT(r)?this.converter.convert(r.value,r.$cstNode):(this.assignMandatoryProperties(r),r)}assignMandatoryProperties(e){let r=this.astReflection.getTypeMetaData(e.$type);for(let n of r.mandatory){let i=e[n.name];n.type==="array"&&!Array.isArray(i)?e[n.name]=[]:n.type==="boolean"&&i===void 0&&(e[n.name]=!1)}}getAssignment(e){if(!this.assignmentMap.has(e)){let r=(0,IM.getContainerOfType)(e,Lp.isAssignment);this.assignmentMap.set(e,{assignment:r,isCrossRef:r?(0,Lp.isCrossReference)(r.terminal):!1})}return this.assignmentMap.get(e)}assign(e,r,n,i,o){let a=this.current,s;switch(o&&typeof n=="string"?s=this.linker.buildReference(a,r,i,n):s=n,e){case"=":{a[r]=s;break}case"?=":{a[r]=!0;break}case"+=":Array.isArray(a[r])||(a[r]=[]),a[r].push(s)}}assignWithoutOverride(e,r){for(let[n,i]of Object.entries(r)){let o=e[n];o===void 0?e[n]=i:Array.isArray(o)&&Array.isArray(i)&&(i.push(...o),e[n]=i)}return e}get definitionErrors(){return this.wrapper.definitionErrors}};mr.LangiumParser=_T;var $p=class{buildMismatchTokenMessage({expected:e,actual:r}){return`Expecting ${e.LABEL?"`"+e.LABEL+"`":e.name.endsWith(":KW")?`keyword '${e.name.substring(0,e.name.length-3)}'`:`token of type '${e.name}'`} but found \`${r.image}\`.`}buildNotAllInputParsedMessage({firstRedundant:e}){return`Expecting end of file but found \`${e.image}\`.`}buildNoViableAltMessage(e){return Mp.defaultParserErrorProvider.buildNoViableAltMessage(e)}buildEarlyExitMessage(e){return Mp.defaultParserErrorProvider.buildEarlyExitMessage(e)}};mr.LangiumParserErrorMessageProvider=$p;var TT=class extends Zc{constructor(){super(...arguments),this.tokens=[],this.elementStack=[],this.lastElementStack=[],this.nextTokenIndex=0,this.stackSize=0}action(){}construct(){}parse(e){this.resetState();let r=this.lexer.tokenize(e);return this.tokens=r.tokens,this.wrapper.input=[...this.tokens],this.mainRule.call(this.wrapper,{}),this.unorderedGroups.clear(),{tokens:this.tokens,elementStack:[...this.lastElementStack],tokenIndex:this.nextTokenIndex}}rule(e,r){let n=this.wrapper.DEFINE_RULE(qM(e.name),this.startImplementation(r).bind(this));return e.entry&&(this.mainRule=n),n}resetState(){this.elementStack=[],this.lastElementStack=[],this.nextTokenIndex=0,this.stackSize=0}startImplementation(e){return r=>{let n=this.keepStackSize();try{e(r)}finally{this.resetStackSize(n)}}}removeUnexpectedElements(){this.elementStack.splice(this.stackSize)}keepStackSize(){let e=this.elementStack.length;return this.stackSize=e,e}resetStackSize(e){this.removeUnexpectedElements(),this.stackSize=e}consume(e,r,n){this.wrapper.wrapConsume(e,r),this.isRecording()||(this.lastElementStack=[...this.elementStack,n],this.nextTokenIndex=this.currIdx+1)}subrule(e,r,n,i){this.before(n),this.wrapper.wrapSubrule(e,r,i),this.after(n)}before(e){this.isRecording()||this.elementStack.push(e)}after(e){if(!this.isRecording()){let r=this.elementStack.lastIndexOf(e);r>=0&&this.elementStack.splice(r)}}get currIdx(){return this.wrapper.currIdx}};mr.LangiumCompletionParser=TT;var oue={recoveryEnabled:!0,nodeLocationTracking:"full",skipValidations:!0,errorMessageProvider:new $p},RT=class extends Mp.EmbeddedActionsParser{constructor(e,r){let n=r&&"maxLookahead"in r;super(e,Object.assign(Object.assign(Object.assign({},oue),{lookaheadStrategy:n?new Mp.LLkLookaheadStrategy({maxLookahead:r.maxLookahead}):new nue.LLStarLookaheadStrategy}),r))}get IS_RECORDING(){return this.RECORDING_PHASE}DEFINE_RULE(e,r){return this.RULE(e,r)}wrapSelfAnalysis(){this.performSelfAnalysis()}wrapConsume(e,r){return this.consume(e,r)}wrapSubrule(e,r,n){return this.subrule(e,r,{ARGS:[n]})}wrapOr(e,r){this.or(e,r)}wrapOption(e,r){this.option(e,r)}wrapMany(e,r){this.many(e,r)}wrapAtLeastOne(e,r){this.atLeastOne(e,r)}}});var AT=f(du=>{"use strict";Object.defineProperty(du,"__esModule",{value:!0});du.assertUnreachable=du.ErrorWithLocation=void 0;var bT=class extends Error{constructor(e,r){super(e?`${r} at ${e.range.start.line}:${e.range.start.character}`:r)}};du.ErrorWithLocation=bT;function aue(t){throw new Error("Error! The input value was not handled.")}du.assertUnreachable=aue});var ST=f(Up=>{"use strict";Object.defineProperty(Up,"__esModule",{value:!0});Up.createParser=void 0;var LM=ya(),He=ke(),el=AT(),sue=Ft(),MM=jt(),$M=vt();function uue(t,e,r){return cue({parser:e,tokens:r,rules:new Map,ruleNames:new Map},t),e}Up.createParser=uue;function cue(t,e){let r=(0,$M.getAllReachableRules)(e,!1),n=(0,sue.stream)(e.rules).filter(He.isParserRule).filter(i=>r.has(i));for(let i of n){let o=Object.assign(Object.assign({},t),{consume:1,optional:1,subrule:1,many:1,or:1});o.rules.set(i.name,t.parser.rule(i,_a(o,i.definition)))}}function _a(t,e,r=!1){let n;if((0,He.isKeyword)(e))n=gue(t,e);else if((0,He.isAction)(e))n=lue(t,e);else if((0,He.isAssignment)(e))n=_a(t,e.terminal);else if((0,He.isCrossReference)(e))n=FM(t,e);else if((0,He.isRuleCall)(e))n=due(t,e);else if((0,He.isAlternatives)(e))n=pue(t,e);else if((0,He.isUnorderedGroup)(e))n=hue(t,e);else if((0,He.isGroup)(e))n=mue(t,e);else throw new el.ErrorWithLocation(e.$cstNode,`Unexpected element type: ${e.$type}`);return jM(t,r?void 0:jp(e),n,e.cardinality)}function lue(t,e){let r=(0,MM.getTypeName)(e);return()=>t.parser.action(r,e)}function due(t,e){let r=e.rule.ref;if((0,He.isParserRule)(r)){let n=t.subrule++,i=e.arguments.length>0?fue(r,e.arguments):()=>({});return o=>t.parser.subrule(n,UM(t,r),e,i(o))}else if((0,He.isTerminalRule)(r)){let n=t.consume++,i=PT(t,r.name);return()=>t.parser.consume(n,i,e)}else if(r)(0,el.assertUnreachable)(r);else throw new el.ErrorWithLocation(e.$cstNode,`Undefined rule type: ${e.$type}`)}function fue(t,e){let r=e.map(n=>Hi(n.value));return n=>{let i={};for(let o=0;o<r.length;o++){let a=t.parameters[o],s=r[o];i[a.name]=s(n)}return i}}function Hi(t){if((0,He.isDisjunction)(t)){let e=Hi(t.left),r=Hi(t.right);return n=>e(n)||r(n)}else if((0,He.isConjunction)(t)){let e=Hi(t.left),r=Hi(t.right);return n=>e(n)&&r(n)}else if((0,He.isNegation)(t)){let e=Hi(t.value);return r=>!e(r)}else if((0,He.isParameterReference)(t)){let e=t.parameter.ref.name;return r=>r!==void 0&&r[e]===!0}else if((0,He.isLiteralCondition)(t)){let e=Boolean(t.true);return()=>e}(0,el.assertUnreachable)(t)}function pue(t,e){if(e.elements.length===1)return _a(t,e.elements[0]);{let r=[];for(let i of e.elements){let o={ALT:_a(t,i,!0)},a=jp(i);a&&(o.GATE=Hi(a)),r.push(o)}let n=t.or++;return i=>t.parser.alternatives(n,r.map(o=>{let a={ALT:()=>o.ALT(i)},s=o.GATE;return s&&(a.GATE=()=>s(i)),a}))}}function hue(t,e){if(e.elements.length===1)return _a(t,e.elements[0]);let r=[];for(let s of e.elements){let u={ALT:_a(t,s,!0)},c=jp(s);c&&(u.GATE=Hi(c)),r.push(u)}let n=t.or++,i=(s,u)=>{let c=u.getRuleStack().join("-");return`uGroup_${s}_${c}`},o=s=>t.parser.alternatives(n,r.map((u,c)=>{let l={ALT:()=>!0},d=t.parser;l.ALT=()=>{if(u.ALT(s),!d.isRecording()){let v=i(n,d);d.unorderedGroups.get(v)||d.unorderedGroups.set(v,[]);let g=d.unorderedGroups.get(v);typeof g?.[c]>"u"&&(g[c]=!0)}};let h=u.GATE;return h?l.GATE=()=>h(s):l.GATE=()=>{let v=d.unorderedGroups.get(i(n,d));return!v?.[c]},l})),a=jM(t,jp(e),o,"*");return s=>{a(s),t.parser.isRecording()||t.parser.unorderedGroups.delete(i(n,t.parser))}}function mue(t,e){let r=e.elements.map(n=>_a(t,n));return n=>r.forEach(i=>i(n))}function jp(t){if((0,He.isGroup)(t))return t.guardCondition}function FM(t,e,r=e.terminal){if(r)if((0,He.isRuleCall)(r)&&(0,He.isParserRule)(r.rule.ref)){let n=t.subrule++;return i=>t.parser.subrule(n,UM(t,r.rule.ref),e,i)}else if((0,He.isRuleCall)(r)&&(0,He.isTerminalRule)(r.rule.ref)){let n=t.consume++,i=PT(t,r.rule.ref.name);return()=>t.parser.consume(n,i,e)}else if((0,He.isKeyword)(r)){let n=t.consume++,i=PT(t,r.value);return()=>t.parser.consume(n,i,e)}else throw new Error("Could not build cross reference parser");else{if(!e.type.ref)throw new Error("Could not resolve reference to type: "+e.type.$refText);let n=(0,$M.findNameAssignment)(e.type.ref),i=n?.terminal;if(!i)throw new Error("Could not find name assignment for type: "+(0,MM.getTypeName)(e.type.ref));return FM(t,e,i)}}function gue(t,e){let r=t.consume++,n=t.tokens[e.value];if(!n)throw new Error("Could not find token for keyword: "+e.value);return()=>t.parser.consume(r,n,e)}function jM(t,e,r,n){let i=e&&Hi(e);if(!n)if(i){let o=t.or++;return a=>t.parser.alternatives(o,[{ALT:()=>r(a),GATE:()=>i(a)},{ALT:(0,LM.EMPTY_ALT)(),GATE:()=>!i(a)}])}else return r;if(n==="*"){let o=t.many++;return a=>t.parser.many(o,{DEF:()=>r(a),GATE:i?()=>i(a):void 0})}else if(n==="+"){let o=t.many++;if(i){let a=t.or++;return s=>t.parser.alternatives(a,[{ALT:()=>t.parser.atLeastOne(o,{DEF:()=>r(s)}),GATE:()=>i(s)},{ALT:(0,LM.EMPTY_ALT)(),GATE:()=>!i(s)}])}else return a=>t.parser.atLeastOne(o,{DEF:()=>r(a)})}else if(n==="?"){let o=t.optional++;return a=>t.parser.optional(o,{DEF:()=>r(a),GATE:i?()=>i(a):void 0})}else(0,el.assertUnreachable)(n)}function UM(t,e){let r=yue(t,e),n=t.rules.get(r);if(!n)throw new Error(`Rule "${r}" not found."`);return n}function yue(t,e){if((0,He.isParserRule)(e))return e.name;if(t.ruleNames.has(e))return t.ruleNames.get(e);{let r=e,n=r.$container,i=e.$type;for(;!(0,He.isParserRule)(n);)((0,He.isGroup)(n)||(0,He.isAlternatives)(n)||(0,He.isUnorderedGroup)(n))&&(i=n.elements.indexOf(r).toString()+":"+i),r=n,n=n.$container;return i=n.name+":"+i,t.ruleNames.set(e,i),i}}function PT(t,e){let r=t.tokens[e];if(!r)throw new Error(`Token "${e}" not found."`);return r}});var CT=f(Gp=>{"use strict";Object.defineProperty(Gp,"__esModule",{value:!0});Gp.createCompletionParser=void 0;var vue=Fp(),_ue=ST();function Tue(t){let e=t.Grammar,r=t.parser.Lexer,n=new vue.LangiumCompletionParser(t);return(0,_ue.createParser)(e,n,r.definition),n.finalize(),n}Gp.createCompletionParser=Tue});var ET=f(fu=>{"use strict";Object.defineProperty(fu,"__esModule",{value:!0});fu.prepareLangiumParser=fu.createLangiumParser=void 0;var Rue=Fp(),bue=ST();function Aue(t){let e=GM(t);return e.finalize(),e}fu.createLangiumParser=Aue;function GM(t){let e=t.Grammar,r=t.parser.Lexer,n=new Rue.LangiumParser(t);return(0,bue.createParser)(e,n,r.definition)}fu.prepareLangiumParser=GM});var wT=f(Wp=>{"use strict";Object.defineProperty(Wp,"__esModule",{value:!0});Wp.DefaultTokenBuilder=void 0;var Pue=ya(),NT=ke(),Sue=jt(),Cue=be(),Eue=vt(),Hp=Yo(),Nue=Ft(),kT=class{buildTokens(e,r){let n=(0,Nue.stream)((0,Eue.getAllReachableRules)(e,!1)),i=this.buildTerminalTokens(n),o=this.buildKeywordTokens(n,i,r);return i.forEach(a=>{let s=a.PATTERN;typeof s=="object"&&s&&"test"in s&&(0,Hp.isWhitespaceRegExp)(s)?o.unshift(a):o.push(a)}),o}buildTerminalTokens(e){return e.filter(NT.isTerminalRule).filter(r=>!r.fragment).map(r=>this.buildTerminalToken(r)).toArray()}buildTerminalToken(e){let r=(0,Sue.terminalRegex)(e),n={name:e.name,PATTERN:new RegExp(r)};return e.hidden&&(n.GROUP=(0,Hp.isWhitespaceRegExp)(r)?Pue.Lexer.SKIPPED:"hidden"),n}buildKeywordTokens(e,r,n){return e.filter(NT.isParserRule).flatMap(i=>(0,Cue.streamAllContents)(i).filter(NT.isKeyword)).distinct(i=>i.value).toArray().sort((i,o)=>o.value.length-i.value.length).map(i=>this.buildKeywordToken(i,r,Boolean(n?.caseInsensitive)))}buildKeywordToken(e,r,n){return{name:e.value,PATTERN:this.buildKeywordPattern(e,n),LONGER_ALT:this.findLongerAlt(e,r)}}buildKeywordPattern(e,r){return r?new RegExp((0,Hp.getCaseInsensitivePattern)(e.value)):e.value}findLongerAlt(e,r){return r.reduce((n,i)=>{let o=i?.PATTERN;return o?.source&&(0,Hp.partialMatches)("^"+o.source+"$",e.value)&&n.push(i),n},[])}};Wp.DefaultTokenBuilder=kT});var DT=f(Ot=>{"use strict";Object.defineProperty(Ot,"__esModule",{value:!0});Ot.convertBoolean=Ot.convertNumber=Ot.convertDate=Ot.convertBigint=Ot.convertInt=Ot.convertID=Ot.convertRegexLiteral=Ot.convertString=Ot.DefaultValueConverter=void 0;var HM=ke(),kue=jt(),wue=vt(),OT=class{convert(e,r){let n=r.feature;if((0,HM.isCrossReference)(n)&&(n=(0,wue.getCrossReferenceTerminal)(n)),(0,HM.isRuleCall)(n)){let i=n.rule.ref;if(!i)throw new Error("This cst node was not parsed by a rule.");return this.runConverter(i,e,r)}return e}runConverter(e,r,n){var i;switch(e.name.toUpperCase()){case"INT":return zM(r);case"STRING":return WM(r);case"ID":return KM(r);case"REGEXLITERAL":return BM(r)}switch((i=(0,kue.getRuleType)(e))===null||i===void 0?void 0:i.toLowerCase()){case"number":return XM(r);case"boolean":return JM(r);case"bigint":return VM(r);case"date":return YM(r);default:return r}}};Ot.DefaultValueConverter=OT;function WM(t){let e="";for(let r=1;r<t.length-1;r++){let n=t.charAt(r);if(n==="\\"){let i=t.charAt(++r);e+=Oue(i)}else e+=n}return e}Ot.convertString=WM;function Oue(t){switch(t){case"b":return"\b";case"f":return"\f";case"n":return`
`;case"r":return"\r";case"t":return"	";case"v":return"\v";case"0":return"\0";default:return t}}function BM(t){return t.substring(1,t.length-1)}Ot.convertRegexLiteral=BM;function KM(t){return t.charAt(0)==="^"?t.substring(1):t}Ot.convertID=KM;function zM(t){return parseInt(t)}Ot.convertInt=zM;function VM(t){return BigInt(t)}Ot.convertBigint=VM;function YM(t){return new Date(t)}Ot.convertDate=YM;function XM(t){return Number(t)}Ot.convertNumber=XM;function JM(t){return t.toLowerCase()==="true"}Ot.convertBoolean=JM});var qT=f(Kp=>{"use strict";Object.defineProperty(Kp,"__esModule",{value:!0});Kp.DefaultLinker=void 0;var Due=Ie(),pu=er(),Bp=be(),Iue=_r(),IT=fo(),xT=class{constructor(e){this.reflection=e.shared.AstReflection,this.langiumDocuments=()=>e.shared.workspace.LangiumDocuments,this.scopeProvider=e.references.ScopeProvider,this.astNodeLocator=e.workspace.AstNodeLocator}async link(e,r=Due.CancellationToken.None){for(let n of(0,Bp.streamAst)(e.parseResult.value))await(0,Iue.interruptAndCheck)(r),(0,Bp.streamReferences)(n).forEach(i=>this.doLink(i,e));e.state=IT.DocumentState.Linked}doLink(e,r){let n=e.reference;if(n._ref===void 0)try{let i=this.getCandidate(e);if((0,pu.isLinkingError)(i))n._ref=i;else if(n._nodeDescription=i,this.langiumDocuments().hasDocument(i.documentUri)){let o=this.loadAstNode(i);n._ref=o??this.createLinkingError(e,i)}}catch(i){n._ref=Object.assign(Object.assign({},e),{message:`An error occurred while resolving reference to '${n.$refText}': ${i}`})}r.references.push(n)}unlink(e){for(let r of e.references)delete r._ref,delete r._nodeDescription;e.references=[]}getCandidate(e){let n=this.scopeProvider.getScope(e).getElement(e.reference.$refText);return n??this.createLinkingError(e)}buildReference(e,r,n,i){let o=this,a={$refNode:n,$refText:i,get ref(){var s;if((0,pu.isAstNode)(this._ref))return this._ref;if((0,pu.isAstNodeDescription)(this._nodeDescription)){let u=o.loadAstNode(this._nodeDescription);this._ref=u??o.createLinkingError({reference:a,container:e,property:r},this._nodeDescription)}else if(this._ref===void 0){let u=o.getLinkedNode({reference:a,container:e,property:r});if(u.error&&(0,Bp.getDocument)(e).state<IT.DocumentState.ComputedScopes)return;this._ref=(s=u.node)!==null&&s!==void 0?s:u.error,this._nodeDescription=u.descr}return(0,pu.isAstNode)(this._ref)?this._ref:void 0},get $nodeDescription(){return this._nodeDescription},get error(){return(0,pu.isLinkingError)(this._ref)?this._ref:void 0}};return a}getLinkedNode(e){try{let r=this.getCandidate(e);if((0,pu.isLinkingError)(r))return{error:r};let n=this.loadAstNode(r);return n?{node:n,descr:r}:{descr:r,error:this.createLinkingError(e,r)}}catch(r){return{error:Object.assign(Object.assign({},e),{message:`An error occurred while resolving reference to '${e.reference.$refText}': ${r}`})}}}loadAstNode(e){if(e.node)return e.node;let r=this.langiumDocuments().getOrCreateDocument(e.documentUri);return this.astNodeLocator.getAstNode(r.parseResult.value,e.path)}createLinkingError(e,r){let n=(0,Bp.getDocument)(e.container);n.state<IT.DocumentState.ComputedScopes&&console.warn(`Attempted reference resolution before document reached ComputedScopes state (${n.uri}).`);let i=this.reflection.getReferenceType(e);return Object.assign(Object.assign({},e),{message:`Could not resolve reference to ${i} named '${e.reference.$refText}'.`,targetDescription:r})}};Kp.DefaultLinker=xT});var MT=f(zp=>{"use strict";Object.defineProperty(zp,"__esModule",{value:!0});zp.DefaultJsonSerializer=void 0;var tl=er(),xue=be(),que=vt();function QM(t){return typeof t=="object"&&!!t&&("$ref"in t||"$error"in t)}var LT=class{constructor(e){this.ignoreProperties=new Set(["$container","$containerProperty","$containerIndex","$document","$cstNode"]),this.astNodeLocator=e.workspace.AstNodeLocator,this.nameProvider=e.references.NameProvider}serialize(e,r){let n=r?.replacer,i=(a,s)=>this.replacer(a,s,r);return JSON.stringify(e,n?(a,s)=>n(a,s,i):i,r?.space)}deserialize(e){let r=JSON.parse(e);return this.linkNode(r,r),r}replacer(e,r,{refText:n,sourceText:i,textRegions:o}={}){var a,s,u;if(!this.ignoreProperties.has(e))if((0,tl.isReference)(r)){let c=r.ref,l=n?r.$refText:void 0;return c?{$refText:l,$ref:"#"+(c&&this.astNodeLocator.getAstNodePath(c))}:{$refText:l,$error:(s=(a=r.error)===null||a===void 0?void 0:a.message)!==null&&s!==void 0?s:"Could not resolve reference"}}else{let c;if(o&&(0,tl.isAstNode)(r)&&(c=this.addAstNodeRegionWithAssignmentsTo(Object.assign({},r)),(!e||r.$document)&&c?.$textRegion))try{c.$textRegion.documentURI=(0,xue.getDocument)(r).uri.toString()}catch{}return i&&!e&&(0,tl.isAstNode)(r)&&(c??(c=Object.assign({},r)),c.$sourceText=(u=r.$cstNode)===null||u===void 0?void 0:u.text),c??r}}addAstNodeRegionWithAssignmentsTo(e){let r=n=>({offset:n.offset,end:n.end,length:n.length,range:n.range});if(e.$cstNode){let n=e.$textRegion=r(e.$cstNode),i=n.assignments={};return Object.keys(e).filter(o=>!o.startsWith("$")).forEach(o=>{let a=(0,que.findNodesForProperty)(e.$cstNode,o).map(r);a.length!==0&&(i[o]=a)}),e}}linkNode(e,r,n,i,o){for(let[s,u]of Object.entries(e))if(Array.isArray(u))for(let c=0;c<u.length;c++){let l=u[c];QM(l)?u[c]=this.reviveReference(e,s,r,l):(0,tl.isAstNode)(l)&&this.linkNode(l,r,e,s,c)}else QM(u)?e[s]=this.reviveReference(e,s,r,u):(0,tl.isAstNode)(u)&&this.linkNode(u,r,e,s);let a=e;a.$container=n,a.$containerProperty=i,a.$containerIndex=o}reviveReference(e,r,n,i){let o=i.$refText;if(i.$ref){let a=this.getRefNode(n,i.$ref);return o||(o=this.nameProvider.getName(a)),{$refText:o??"",ref:a}}else if(i.$error){let a={$refText:o??""};return a.error={container:e,property:r,message:i.$error,reference:a},a}else return}getRefNode(e,r){return this.astNodeLocator.getAstNode(e,r.substring(1))}};zp.DefaultJsonSerializer=LT});var FT=f(Vp=>{"use strict";Object.defineProperty(Vp,"__esModule",{value:!0});Vp.DefaultServiceRegistry=void 0;var Lue=Un(),$T=class{register(e){if(!this.singleton&&!this.map){this.singleton=e;return}if(!this.map&&(this.map={},this.singleton)){for(let r of this.singleton.LanguageMetaData.fileExtensions)this.map[r]=this.singleton;this.singleton=void 0}for(let r of e.LanguageMetaData.fileExtensions)this.map[r]!==void 0&&this.map[r]!==e&&console.warn(`The file extension ${r} is used by multiple languages. It is now assigned to '${e.LanguageMetaData.languageId}'.`),this.map[r]=e}getServices(e){if(this.singleton!==void 0)return this.singleton;if(this.map===void 0)throw new Error("The service registry is empty. Use `register` to register the services of a language.");let r=Lue.Utils.extname(e),n=this.map[r];if(!n)throw new Error(`The service registry contains no services for the extension '${r}'.`);return n}get all(){return this.singleton!==void 0?[this.singleton]:this.map!==void 0?Object.values(this.map):[]}};Vp.DefaultServiceRegistry=$T});var UT=f(Yp=>{"use strict";Object.defineProperty(Yp,"__esModule",{value:!0});Yp.ValidationRegistry=void 0;var Mue=gn(),$ue=_r(),jT=class{constructor(e){this.validationChecks=new Mue.MultiMap,this.reflection=e.shared.AstReflection}register(e,r=this){for(let[n,i]of Object.entries(e)){let o=i;if(Array.isArray(o))for(let a of o)this.doRegister(n,this.wrapValidationException(a,r));else typeof o=="function"&&this.doRegister(n,this.wrapValidationException(o,r))}}wrapValidationException(e,r){return async(n,i,o)=>{try{await e.call(r,n,i,o)}catch(a){if((0,$ue.isOperationCancelled)(a))throw a;console.error("An error occurred during validation:",a);let s=a instanceof Error?a.message:String(a);a instanceof Error&&a.stack&&console.error(a.stack),i("error","An error occurred during validation: "+s,{node:n})}}}doRegister(e,r){if(e==="AstNode"){this.validationChecks.add("AstNode",r);return}for(let n of this.reflection.getAllSubTypes(e))this.validationChecks.add(n,r)}getChecks(e){return this.validationChecks.get(e).concat(this.validationChecks.get("AstNode"))}};Yp.ValidationRegistry=jT});var BT=f(hu=>{"use strict";Object.defineProperty(hu,"__esModule",{value:!0});hu.DefaultReferenceDescriptionProvider=hu.DefaultAstNodeDescriptionProvider=void 0;var Fue=Ie(),jue=er(),Xp=be(),GT=qe(),Uue=_r(),Gue=Ci(),HT=class{constructor(e){this.astNodeLocator=e.workspace.AstNodeLocator,this.nameProvider=e.references.NameProvider}createDescription(e,r,n=(0,Xp.getDocument)(e)){var i;r??(r=this.nameProvider.getName(e));let o=this.astNodeLocator.getAstNodePath(e);if(!r)throw new Error(`Node at path ${o} has no name.`);let a=(i=this.nameProvider.getNameNode(e))!==null&&i!==void 0?i:e.$cstNode;return{node:e,name:r,nameSegment:(0,GT.toDocumentSegment)(a),selectionSegment:(0,GT.toDocumentSegment)(e.$cstNode),type:e.$type,documentUri:n.uri,path:o}}};hu.DefaultAstNodeDescriptionProvider=HT;var WT=class{constructor(e){this.nodeLocator=e.workspace.AstNodeLocator}async createDescriptions(e,r=Fue.CancellationToken.None){let n=[],i=e.parseResult.value;for(let o of(0,Xp.streamAst)(i))await(0,Uue.interruptAndCheck)(r),(0,Xp.streamReferences)(o).filter(a=>!(0,jue.isLinkingError)(a)).forEach(a=>{let s=this.createDescription(a);s&&n.push(s)});return n}createDescription(e){let r=e.reference.$nodeDescription,n=e.reference.$refNode;if(!r||!n)return;let i=(0,Xp.getDocument)(e.container).uri;return{sourceUri:i,sourcePath:this.nodeLocator.getAstNodePath(e.container),targetUri:r.documentUri,targetPath:r.path,segment:(0,GT.toDocumentSegment)(n),local:(0,Gue.equalURI)(r.documentUri,i)}}};hu.DefaultReferenceDescriptionProvider=WT});var zT=f(Jp=>{"use strict";Object.defineProperty(Jp,"__esModule",{value:!0});Jp.DefaultAstNodeLocator=void 0;var KT=class{constructor(){this.segmentSeparator="/",this.indexSeparator="@"}getAstNodePath(e){if(e.$container){let r=this.getAstNodePath(e.$container),n=this.getPathSegment(e);return r+this.segmentSeparator+n}return""}getPathSegment({$containerProperty:e,$containerIndex:r}){if(!e)throw new Error("Missing '$containerProperty' in AST node.");return r!==void 0?e+this.indexSeparator+r:e}getAstNode(e,r){return r.split(this.segmentSeparator).reduce((i,o)=>{if(!i||o.length===0)return i;let a=o.indexOf(this.indexSeparator);if(a>0){let s=o.substring(0,a),u=parseInt(o.substring(a+1)),c=i[s];return c?.[u]}return i[o]},e)}};Jp.DefaultAstNodeLocator=KT});var YT=f(Qp=>{"use strict";Object.defineProperty(Qp,"__esModule",{value:!0});Qp.DefaultConfigurationProvider=void 0;var Hue=At(),VT=class{constructor(e){this.settings={},this.workspaceConfig=!1,this.initialized=!1,this.serviceRegistry=e.ServiceRegistry,this.connection=e.lsp.Connection,e.lsp.LanguageServer.onInitialize(r=>{var n,i;this.workspaceConfig=(i=(n=r.capabilities.workspace)===null||n===void 0?void 0:n.configuration)!==null&&i!==void 0?i:!1}),e.lsp.LanguageServer.onInitialized(r=>{var n;let i=this.serviceRegistry.all;(n=e.lsp.Connection)===null||n===void 0||n.client.register(Hue.DidChangeConfigurationNotification.type,{section:i.map(o=>this.toSectionName(o.LanguageMetaData.languageId))})})}async initialize(){if(this.workspaceConfig&&this.connection){let r=this.serviceRegistry.all.map(i=>({section:this.toSectionName(i.LanguageMetaData.languageId)})),n=await this.connection.workspace.getConfiguration(r);r.forEach((i,o)=>{this.updateSectionConfiguration(i.section,n[o])})}this.initialized=!0}updateConfiguration(e){e.settings&&Object.keys(e.settings).forEach(r=>{this.updateSectionConfiguration(r,e.settings[r])})}updateSectionConfiguration(e,r){this.settings[e]=r}async getConfiguration(e,r){this.initialized||await this.initialize();let n=this.toSectionName(e);if(this.settings[n])return this.settings[n][r]}toSectionName(e){return`${e}`}};Qp.DefaultConfigurationProvider=VT});var QT=f(eh=>{"use strict";Object.defineProperty(eh,"__esModule",{value:!0});eh.DefaultDocumentBuilder=void 0;var Zp=Ie(),Wue=gn(),XT=_r(),li=fo(),JT=class{constructor(e){this.updateListeners=[],this.buildPhaseListeners=new Wue.MultiMap,this.langiumDocuments=e.workspace.LangiumDocuments,this.langiumDocumentFactory=e.workspace.LangiumDocumentFactory,this.indexManager=e.workspace.IndexManager,this.serviceRegistry=e.ServiceRegistry}async build(e,r={},n=Zp.CancellationToken.None){await this.buildDocuments(e,r,n)}async update(e,r,n=Zp.CancellationToken.None){for(let s of r)this.langiumDocuments.deleteDocument(s);this.indexManager.remove(r);for(let s of e)this.langiumDocuments.invalidateDocument(s);for(let s of this.updateListeners)s(e,r);await(0,XT.interruptAndCheck)(n);let i=e.map(s=>this.langiumDocuments.getOrCreateDocument(s)),o=this.collectDocuments(i,r),a={validationChecks:"all"};await this.buildDocuments(o,a,n)}onUpdate(e){return this.updateListeners.push(e),Zp.Disposable.create(()=>{let r=this.updateListeners.indexOf(e);r>=0&&this.updateListeners.splice(r,1)})}collectDocuments(e,r){let n=e.map(a=>a.uri).concat(r),i=this.indexManager.getAffectedDocuments(n).toArray();i.forEach(a=>{this.serviceRegistry.getServices(a.uri).references.Linker.unlink(a),a.state=Math.min(a.state,li.DocumentState.ComputedScopes)});let o=new Set([...e,...i,...this.langiumDocuments.all.filter(a=>a.state<li.DocumentState.Validated)]);return Array.from(o)}async buildDocuments(e,r,n){await this.runCancelable(e,li.DocumentState.Parsed,n,o=>this.langiumDocumentFactory.update(o)),await this.runCancelable(e,li.DocumentState.IndexedContent,n,o=>this.indexManager.updateContent(o,n)),await this.runCancelable(e,li.DocumentState.ComputedScopes,n,o=>this.computeScopes(o,n)),await this.runCancelable(e,li.DocumentState.Linked,n,o=>this.serviceRegistry.getServices(o.uri).references.Linker.link(o,n)),await this.runCancelable(e,li.DocumentState.IndexedReferences,n,o=>this.indexManager.updateReferences(o,n));let i=e.filter(o=>this.shouldValidate(o,r));await this.runCancelable(i,li.DocumentState.Validated,n,o=>this.validate(o,n))}async runCancelable(e,r,n,i){let o=e.filter(a=>a.state<r);for(let a of o)await(0,XT.interruptAndCheck)(n),await i(a);await this.notifyBuildPhase(o,r,n)}onBuildPhase(e,r){return this.buildPhaseListeners.add(e,r),Zp.Disposable.create(()=>{this.buildPhaseListeners.delete(e,r)})}async notifyBuildPhase(e,r,n){if(e.length===0)return;let i=this.buildPhaseListeners.get(r);for(let o of i)await(0,XT.interruptAndCheck)(n),await o(e,n)}async computeScopes(e,r){let n=this.serviceRegistry.getServices(e.uri).references.ScopeComputation;e.precomputedScopes=await n.computeLocalScopes(e,r),e.state=li.DocumentState.ComputedScopes}shouldValidate(e,r){return r.validationChecks==="all"}async validate(e,r){let i=await this.serviceRegistry.getServices(e.uri).validation.DocumentValidator.validateDocument(e,r);e.diagnostics=i,e.state=li.DocumentState.Validated}};eh.DefaultDocumentBuilder=JT});var rR=f(th=>{"use strict";Object.defineProperty(th,"__esModule",{value:!0});th.DefaultIndexManager=void 0;var ZM=Ie(),Bue=be(),ZT=Ft(),eR=Ci(),e1=fo(),tR=class{constructor(e){this.simpleIndex=new Map,this.referenceIndex=new Map,this.globalScopeCache=new Map,this.serviceRegistry=e.ServiceRegistry,this.astReflection=e.AstReflection,this.langiumDocuments=()=>e.workspace.LangiumDocuments}findAllReferences(e,r){let n=(0,Bue.getDocument)(e).uri,i=[];return this.referenceIndex.forEach(o=>{o.forEach(a=>{(0,eR.equalURI)(a.targetUri,n)&&a.targetPath===r&&i.push(a)})}),(0,ZT.stream)(i)}allElements(e=""){this.globalScopeCache.has("")||this.globalScopeCache.set("",Array.from(this.simpleIndex.values()).flat());let r=this.globalScopeCache.get(e);if(r)return(0,ZT.stream)(r);{let n=this.globalScopeCache.get("").filter(i=>this.astReflection.isSubtype(i.type,e));return this.globalScopeCache.set(e,n),(0,ZT.stream)(n)}}remove(e){for(let r of e){let n=r.toString();this.simpleIndex.delete(n),this.referenceIndex.delete(n),this.globalScopeCache.clear()}}async updateContent(e,r=ZM.CancellationToken.None){this.globalScopeCache.clear();let i=await this.serviceRegistry.getServices(e.uri).references.ScopeComputation.computeExports(e,r);for(let o of i)o.node=void 0;this.simpleIndex.set(e.uri.toString(),i),e.state=e1.DocumentState.IndexedContent}async updateReferences(e,r=ZM.CancellationToken.None){let i=await this.serviceRegistry.getServices(e.uri).workspace.ReferenceDescriptionProvider.createDescriptions(e,r);this.referenceIndex.set(e.uri.toString(),i),e.state=e1.DocumentState.IndexedReferences}getAffectedDocuments(e){return this.langiumDocuments().all.filter(r=>{if(e.some(n=>(0,eR.equalURI)(r.uri,n)))return!1;for(let n of e)if(this.isAffected(r,n))return!0;return!1})}isAffected(e,r){let n=r.toString(),i=e.uri.toString();if(e.references.some(a=>a.error!==void 0))return!0;let o=this.referenceIndex.get(i);return o?o.filter(a=>!a.local).some(a=>(0,eR.equalURI)(a.targetUri,n)):!1}};th.DefaultIndexManager=tR});var oR=f(rh=>{"use strict";Object.defineProperty(rh,"__esModule",{value:!0});rh.DefaultWorkspaceManager=void 0;var Kue=Ie(),nR=Un(),zue=_r(),iR=class{constructor(e){this.serviceRegistry=e.ServiceRegistry,this.langiumDocuments=e.workspace.LangiumDocuments,this.documentBuilder=e.workspace.DocumentBuilder,this.fileSystemProvider=e.workspace.FileSystemProvider,this.mutex=e.workspace.MutexLock,e.lsp.LanguageServer.onInitialize(r=>{var n;this.folders=(n=r.workspaceFolders)!==null&&n!==void 0?n:void 0}),e.lsp.LanguageServer.onInitialized(r=>{this.mutex.lock(n=>{var i;return this.initializeWorkspace((i=this.folders)!==null&&i!==void 0?i:[],n)})})}async initializeWorkspace(e,r=Kue.CancellationToken.None){let n=this.serviceRegistry.all.flatMap(a=>a.LanguageMetaData.fileExtensions),i=[],o=a=>{i.push(a),this.langiumDocuments.hasDocument(a.uri)||this.langiumDocuments.addDocument(a)};await this.loadAdditionalDocuments(e,o),await Promise.all(e.map(a=>[a,this.getRootFolder(a)]).map(async a=>this.traverseFolder(...a,n,o))),await(0,zue.interruptAndCheck)(r),await this.documentBuilder.build(i,void 0,r)}loadAdditionalDocuments(e,r){return Promise.resolve()}getRootFolder(e){return nR.URI.parse(e.uri)}async traverseFolder(e,r,n,i){let o=await this.fileSystemProvider.readDirectory(r);await Promise.all(o.map(async a=>{if(this.includeEntry(e,a,n)){if(a.isDirectory)await this.traverseFolder(e,a.uri,n,i);else if(a.isFile){let s=this.langiumDocuments.getOrCreateDocument(a.uri);i(s)}}}))}includeEntry(e,r,n){let i=nR.Utils.basename(r.uri);if(i.startsWith("."))return!1;if(r.isDirectory)return i!=="node_modules"&&i!=="out";if(r.isFile){let o=nR.Utils.extname(r.uri);return n.includes(o)}return!1}};rh.DefaultWorkspaceManager=iR});var cR=f(di=>{"use strict";Object.defineProperty(di,"__esModule",{value:!0});di.isTokenTypeDictionary=di.isIMultiModeLexerDefinition=di.isTokenTypeArray=di.DefaultLexer=void 0;var Vue=ya(),aR=class{constructor(e){let r=e.parser.TokenBuilder.buildTokens(e.Grammar,{caseInsensitive:e.LanguageMetaData.caseInsensitive});this.tokenTypes=this.toTokenTypeDictionary(r);let n=sR(r)?Object.values(r):r;this.chevrotainLexer=new Vue.Lexer(n)}get definition(){return this.tokenTypes}tokenize(e){var r;let n=this.chevrotainLexer.tokenize(e);return{tokens:n.tokens,errors:n.errors,hidden:(r=n.groups.hidden)!==null&&r!==void 0?r:[]}}toTokenTypeDictionary(e){if(sR(e))return e;let r=uR(e)?Object.values(e.modes).flat():e,n={};return r.forEach(i=>n[i.name]=i),n}};di.DefaultLexer=aR;function t1(t){return Array.isArray(t)&&(t.length===0||"name"in t[0])}di.isTokenTypeArray=t1;function uR(t){return t&&"modes"in t&&"defaultMode"in t}di.isIMultiModeLexerDefinition=uR;function sR(t){return!t1(t)&&!uR(t)}di.isTokenTypeDictionary=sR});var pR=f(mu=>{"use strict";Object.defineProperty(mu,"__esModule",{value:!0});mu.isJSDoc=mu.parseJSDoc=void 0;var Oe=Ie(),Yue=Un(),Xue=ed(),Jue=Yo();function Que(t,e,r){let n,i;typeof t=="string"?(i=e,n=r):(i=t.range.start,n=e),i||(i=Oe.Position.create(0,0));let o=i1(t),a=fR(n),s=tce({lines:o,position:i,options:a});return ace({index:0,tokens:s,position:i})}mu.parseJSDoc=Que;function Zue(t,e){let r=fR(e),n=i1(t);if(n.length===0)return!1;let i=n[0],o=n[n.length-1],a=r.start,s=r.end;return Boolean(a?.exec(i))&&Boolean(s?.exec(o))}mu.isJSDoc=Zue;function i1(t){let e="";return typeof t=="string"?e=t:e=t.text,e.split(Xue.NEWLINE_REGEXP)}var r1=/\s*(@([\p{L}][\p{L}\p{N}]*)?)/uy,ece=/\{(@[\p{L}][\p{L}\p{N}]*)(\s*)([^\r\n}]+)?\}/gu;function tce(t){var e,r,n;let i=[],o=t.position.line,a=t.position.character;for(let s=0;s<t.lines.length;s++){let u=s===0,c=s===t.lines.length-1,l=t.lines[s],d=0;if(u&&t.options.start){let v=(e=t.options.start)===null||e===void 0?void 0:e.exec(l);v&&(d=v.index+v[0].length)}else{let v=(r=t.options.line)===null||r===void 0?void 0:r.exec(l);v&&(d=v.index+v[0].length)}if(c){let v=(n=t.options.end)===null||n===void 0?void 0:n.exec(l);v&&(l=l.substring(0,v.index))}if(l=l.substring(0,oce(l)),dR(l,0)>=l.length){if(i.length>0){let v=Oe.Position.create(o,a);i.push({type:"break",content:"",range:Oe.Range.create(v,v)})}}else{r1.lastIndex=d;let v=r1.exec(l);if(v){let g=v[0],R=v[1],E=Oe.Position.create(o,a+d),N=Oe.Position.create(o,a+d+g.length);i.push({type:"tag",content:R,range:Oe.Range.create(E,N)}),d+=g.length,d=dR(l,d)}if(d<l.length){let g=l.substring(d),R=Array.from(g.matchAll(ece));i.push(...rce(R,g,o,a+d))}}o++,a=0}return i.length>0&&i[i.length-1].type==="break"?i.slice(0,-1):i}function rce(t,e,r,n){let i=[];if(t.length===0){let o=Oe.Position.create(r,n),a=Oe.Position.create(r,n+e.length);i.push({type:"text",content:e,range:Oe.Range.create(o,a)})}else{let o=0;for(let s of t){let u=s.index,c=e.substring(o,u);c.length>0&&i.push({type:"text",content:e.substring(o,u),range:Oe.Range.create(Oe.Position.create(r,o+n),Oe.Position.create(r,u+n))});let l=c.length+1,d=s[1];if(i.push({type:"inline-tag",content:d,range:Oe.Range.create(Oe.Position.create(r,o+l+n),Oe.Position.create(r,o+l+d.length+n))}),l+=d.length,s.length===4){l+=s[2].length;let h=s[3];i.push({type:"text",content:h,range:Oe.Range.create(Oe.Position.create(r,o+l+n),Oe.Position.create(r,o+l+h.length+n))})}else i.push({type:"text",content:"",range:Oe.Range.create(Oe.Position.create(r,o+l+n),Oe.Position.create(r,o+l+n))});o=u+s[0].length}let a=e.substring(o);a.length>0&&i.push({type:"text",content:a,range:Oe.Range.create(Oe.Position.create(r,o+n),Oe.Position.create(r,o+n+a.length))})}return i}var nce=/\S/,ice=/\s*$/;function dR(t,e){let r=t.substring(e).match(nce);return r?e+r.index:t.length}function oce(t){let e=t.match(ice);if(e&&typeof e.index=="number")return e.index}function ace(t){var e,r,n,i;let o=Oe.Position.create(t.position.line,t.position.character);if(t.tokens.length===0)return new nh([],Oe.Range.create(o,o));let a=[];for(;t.index<t.tokens.length;){let c=sce(t,a[a.length-1]);c&&a.push(c)}let s=(r=(e=a[0])===null||e===void 0?void 0:e.range.start)!==null&&r!==void 0?r:o,u=(i=(n=a[a.length-1])===null||n===void 0?void 0:n.range.end)!==null&&i!==void 0?i:o;return new nh(a,Oe.Range.create(s,u))}function sce(t,e){let r=t.tokens[t.index];if(r.type==="tag")return a1(t,!1);if(r.type==="text"||r.type==="inline-tag")return o1(t);uce(r,e),t.index++}function uce(t,e){if(e){let r=new ih("",t.range);"inlines"in e?e.inlines.push(r):e.content.inlines.push(r)}}function o1(t){let e=t.tokens[t.index],r=e,n=e,i=[];for(;e&&e.type!=="break"&&e.type!=="tag";)i.push(cce(t)),n=e,e=t.tokens[t.index];return new nl(i,Oe.Range.create(r.range.start,n.range.end))}function cce(t){return t.tokens[t.index].type==="inline-tag"?a1(t,!0):s1(t)}function a1(t,e){let r=t.tokens[t.index++],n=r.content.substring(1),i=t.tokens[t.index];if(i?.type==="text")if(e){let o=s1(t);return new rl(n,new nl([o],o.range),e,Oe.Range.create(r.range.start,o.range.end))}else{let o=o1(t);return new rl(n,o,e,Oe.Range.create(r.range.start,o.range.end))}else{let o=r.range;return new rl(n,new nl([],o),e,o)}}function s1(t){let e=t.tokens[t.index++];return new ih(e.content,e.range)}function fR(t){if(!t)return fR({start:"/**",end:"*/",line:"*"});let{start:e,end:r,line:n}=t;return{start:lR(e,!0),end:lR(r,!1),line:lR(n,!0)}}function lR(t,e){if(typeof t=="string"||typeof t=="object"){let r=typeof t=="string"?(0,Jue.escapeRegExp)(t):t.source;return e?new RegExp(`^\\s*${r}`):new RegExp(`\\s*${r}\\s*$`)}else return t}var nh=class{constructor(e,r){this.elements=e,this.range=r}getTag(e){return this.getAllTags().find(r=>r.name===e)}getTags(e){return this.getAllTags().filter(r=>r.name===e)}getAllTags(){return this.elements.filter(e=>"name"in e)}toString(){let e="";for(let r of this.elements)if(e.length===0)e=r.toString();else{let n=r.toString();e+=n1(e)+n}return e.trim()}toMarkdown(e){let r="";for(let n of this.elements)if(r.length===0)r=n.toMarkdown(e);else{let i=n.toMarkdown(e);r+=n1(r)+i}return r.trim()}},rl=class{constructor(e,r,n,i){this.name=e,this.content=r,this.inline=n,this.range=i}toString(){let e=`@${this.name}`,r=this.content.toString();return this.content.inlines.length===1?e=`${e} ${r}`:this.content.inlines.length>1&&(e=`${e}
${r}`),this.inline?`{${e}}`:e}toMarkdown(e){let r=this.content.toMarkdown(e);if(this.inline){let o=lce(this.name,r,e??{});if(typeof o=="string")return o}let n="";e?.tag==="italic"||e?.tag===void 0?n="*":e?.tag==="bold"?n="**":e?.tag==="bold-italic"&&(n="***");let i=`${n}@${this.name}${n}`;return this.content.inlines.length===1?i=`${i} \u2014 ${r}`:this.content.inlines.length>1&&(i=`${i}
${r}`),this.inline?`{${i}}`:i}};function lce(t,e,r){var n,i;if(t==="linkplain"||t==="linkcode"||t==="link"){let o=e.indexOf(" "),a=e;if(o>0){let u=dR(e,o);a=e.substring(u),e=e.substring(0,o)}return(t==="linkcode"||t==="link"&&r.link==="code")&&(a=`\`${a}\``),(i=(n=r.renderLink)===null||n===void 0?void 0:n.call(r,e,a))!==null&&i!==void 0?i:dce(e,a)}}function dce(t,e){try{return Yue.URI.parse(t,!0),`[${e}](${t})`}catch{return t}}var nl=class{constructor(e,r){this.inlines=e,this.range=r}toString(){let e="";for(let r=0;r<this.inlines.length;r++){let n=this.inlines[r],i=this.inlines[r+1];e+=n.toString(),i&&i.range.start.line>n.range.start.line&&(e+=`
`)}return e}toMarkdown(e){let r="";for(let n=0;n<this.inlines.length;n++){let i=this.inlines[n],o=this.inlines[n+1];r+=i.toMarkdown(e),o&&o.range.start.line>i.range.start.line&&(r+=`
`)}return r}},ih=class{constructor(e,r){this.text=e,this.range=r}toString(){return this.text}toMarkdown(){return this.text}};function n1(t){return t.endsWith(`
`)?`
`:`

`}});var c1=f(oh=>{"use strict";Object.defineProperty(oh,"__esModule",{value:!0});oh.JSDocDocumentationProvider=void 0;var fce=er(),pce=be(),hce=qe(),u1=pR(),hR=class{constructor(e){this.indexManager=e.shared.workspace.IndexManager,this.grammarConfig=e.parser.GrammarConfig}getDocumentation(e){let r=(0,hce.findCommentNode)(e.$cstNode,this.grammarConfig.multilineCommentRules);if((0,fce.isLeafCstNode)(r)&&(0,u1.isJSDoc)(r))return(0,u1.parseJSDoc)(r).toMarkdown({renderLink:(i,o)=>this.documentationLinkRenderer(e,i,o)})}documentationLinkRenderer(e,r,n){var i;let o=(i=this.findNameInPrecomputedScopes(e,r))!==null&&i!==void 0?i:this.findNameInGlobalScope(e,r);if(o&&o.nameSegment){let a=o.nameSegment.range.start.line+1,s=o.nameSegment.range.start.character+1,u=o.documentUri.with({fragment:`L${a},${s}`});return`[${n}](${u.toString()})`}else return}findNameInPrecomputedScopes(e,r){let i=(0,pce.getDocument)(e).precomputedScopes;if(!i)return;let o=e;do{let s=i.get(o).find(u=>u.name===r);if(s)return s;o=o.$container}while(o)}findNameInGlobalScope(e,r){return this.indexManager.allElements().find(i=>i.name===r)}};oh.JSDocDocumentationProvider=hR});var mR=f(ko=>{"use strict";var mce=ko&&ko.__createBinding||(Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]}),l1=ko&&ko.__exportStar||function(t,e){for(var r in t)r!=="default"&&!Object.prototype.hasOwnProperty.call(e,r)&&mce(e,t,r)};Object.defineProperty(ko,"__esModule",{value:!0});l1(c1(),ko);l1(pR(),ko)});var nf=f(gu=>{"use strict";Object.defineProperty(gu,"__esModule",{value:!0});gu.createDefaultSharedModule=gu.createDefaultModule=void 0;var gce=Ie(),yce=(Jm(),AR(Xm)),vce=vv(),_ce=CT(),Tce=Fd(),Rce=Fy(),bce=Uy(),Ace=Sd(),Pce=My(),Sce=Wy(),Cce=Zy(),Ece=tv(),Nce=nv(),kce=ET(),wce=wT(),Oce=DT(),Dce=qT(),Ice=Za(),xce=qd(),qce=vd(),Lce=Td(),Mce=MT(),$ce=FT(),Fce=_r(),jce=Ad(),Uce=UT(),d1=BT(),Gce=zT(),Hce=YT(),Wce=QT(),f1=fo(),Bce=rR(),Kce=oR(),zce=cR(),Vce=mR();function Yce(t){return{documentation:{DocumentationProvider:e=>new Vce.JSDocDocumentationProvider(e)},parser:{GrammarConfig:e=>(0,vce.createGrammarConfig)(e),LangiumParser:e=>(0,kce.createLangiumParser)(e),CompletionParser:e=>(0,_ce.createCompletionParser)(e),ValueConverter:()=>new Oce.DefaultValueConverter,TokenBuilder:()=>new wce.DefaultTokenBuilder,Lexer:e=>new zce.DefaultLexer(e)},lsp:{CompletionProvider:e=>new Tce.DefaultCompletionProvider(e),DocumentSymbolProvider:e=>new bce.DefaultDocumentSymbolProvider(e),HoverProvider:e=>new Sce.MultilineCommentHoverProvider(e),FoldingRangeProvider:e=>new Ace.DefaultFoldingRangeProvider(e),ReferencesProvider:e=>new Ece.DefaultReferencesProvider(e),DefinitionProvider:e=>new Pce.DefaultDefinitionProvider(e),DocumentHighlightProvider:e=>new Rce.DefaultDocumentHighlightProvider(e),RenameProvider:e=>new Nce.DefaultRenameProvider(e)},workspace:{AstNodeLocator:()=>new Gce.DefaultAstNodeLocator,AstNodeDescriptionProvider:e=>new d1.DefaultAstNodeDescriptionProvider(e),ReferenceDescriptionProvider:e=>new d1.DefaultReferenceDescriptionProvider(e)},references:{Linker:e=>new Dce.DefaultLinker(e),NameProvider:()=>new Ice.DefaultNameProvider,ScopeProvider:e=>new Lce.DefaultScopeProvider(e),ScopeComputation:e=>new qce.DefaultScopeComputation(e),References:e=>new xce.DefaultReferences(e)},serializer:{JsonSerializer:e=>new Mce.DefaultJsonSerializer(e)},validation:{DocumentValidator:e=>new jce.DefaultDocumentValidator(e),ValidationRegistry:e=>new Uce.ValidationRegistry(e)},shared:()=>t.shared}}gu.createDefaultModule=Yce;function Xce(t){return{ServiceRegistry:()=>new $ce.DefaultServiceRegistry,lsp:{Connection:()=>t.connection,LanguageServer:e=>new Cce.DefaultLanguageServer(e)},workspace:{LangiumDocuments:e=>new f1.DefaultLangiumDocuments(e),LangiumDocumentFactory:e=>new f1.DefaultLangiumDocumentFactory(e),DocumentBuilder:e=>new Wce.DefaultDocumentBuilder(e),TextDocuments:()=>new gce.TextDocuments(yce.TextDocument),IndexManager:e=>new Bce.DefaultIndexManager(e),WorkspaceManager:e=>new Kce.DefaultWorkspaceManager(e),FileSystemProvider:e=>t.fileSystemProvider(e),MutexLock:()=>new Fce.MutexLock,ConfigurationProvider:e=>new Hce.DefaultConfigurationProvider(e)}}}gu.createDefaultSharedModule=Xce});var h1=f(p1=>{"use strict";Object.defineProperty(p1,"__esModule",{value:!0})});var y1=f(wo=>{"use strict";Object.defineProperty(wo,"__esModule",{value:!0});wo.joinTracedToNodeIf=wo.joinTracedToNode=wo.joinToNode=void 0;var gR=Wo();function m1(t,e=String,{filter:r,prefix:n,suffix:i,separator:o,appendNewLineIfNotEmpty:a}={}){return Qce(t,(s,u,c,l)=>{if(r&&!r(u,c,l))return s;let d=e(u,c,l);return(s??(s=new gR.CompositeGeneratorNode)).append(n&&n(u,c,l)).append(d).append(i&&i(u,c,l)).appendIf(!l&&d!==void 0,o).appendNewLineIfNotEmptyIf(!s.isEmpty()&&!!a)})}wo.joinToNode=m1;function g1(t,e){return(r,n=String,i)=>(0,gR.traceToNode)(t,e)(m1(r,t&&e?(o,a,s)=>(0,gR.traceToNode)(t,e,a)(n(o,a,s)):n,i))}wo.joinTracedToNode=g1;function Jce(t,e,r){return t?g1(typeof e=="function"?e():e,r):()=>{}}wo.joinTracedToNodeIf=Jce;function Qce(t,e,r){let n=t[Symbol.iterator](),i=n.next(),o=0,a=r;for(;!i.done;){let s=n.next();a=e(a,i.value,o,Boolean(s.done)),i=s,o++}return a}});var v1=f(gr=>{"use strict";var Zce=gr&&gr.__createBinding||(Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]}),yR=gr&&gr.__exportStar||function(t,e){for(var r in t)r!=="default"&&!Object.prototype.hasOwnProperty.call(e,r)&&Zce(e,t,r)};Object.defineProperty(gr,"__esModule",{value:!0});gr.normalizeEOL=gr.expandToStringWithNL=gr.expandToString=void 0;yR(Wo(),gr);yR(y1(),gr);yR(fg(),gr);var vR=ed();Object.defineProperty(gr,"expandToString",{enumerable:!0,get:function(){return vR.expandToString}});Object.defineProperty(gr,"expandToStringWithNL",{enumerable:!0,get:function(){return vR.expandToStringWithNL}});Object.defineProperty(gr,"normalizeEOL",{enumerable:!0,get:function(){return vR.normalizeEOL}})});var T1=f(_1=>{"use strict";Object.defineProperty(_1,"__esModule",{value:!0})});var R1=f(fi=>{"use strict";var ele=fi&&fi.__createBinding||(Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]}),ah=fi&&fi.__exportStar||function(t,e){for(var r in t)r!=="default"&&!Object.prototype.hasOwnProperty.call(e,r)&&ele(e,t,r)};Object.defineProperty(fi,"__esModule",{value:!0});ah(Vg(),fi);ah(vv(),fi);ah(pv(),fi);ah(T1(),fi)});var A1=f(b1=>{"use strict";Object.defineProperty(b1,"__esModule",{value:!0})});var P1=f(Sr=>{"use strict";var tle=Sr&&Sr.__createBinding||(Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]}),Oo=Sr&&Sr.__exportStar||function(t,e){for(var r in t)r!=="default"&&!Object.prototype.hasOwnProperty.call(e,r)&&tle(e,t,r)};Object.defineProperty(Sr,"__esModule",{value:!0});Oo(CT(),Sr);Oo(yT(),Sr);Oo(ET(),Sr);Oo(Fp(),Sr);Oo(cR(),Sr);Oo(A1(),Sr);Oo(wT(),Sr);Oo(DT(),Sr)});var S1=f(wn=>{"use strict";var rle=wn&&wn.__createBinding||(Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]}),il=wn&&wn.__exportStar||function(t,e){for(var r in t)r!=="default"&&!Object.prototype.hasOwnProperty.call(e,r)&&rle(e,t,r)};Object.defineProperty(wn,"__esModule",{value:!0});il(qT(),wn);il(Za(),wn);il(qd(),wn);il(vd(),wn);il(Td(),wn)});var C1=f(Ta=>{"use strict";var nle=Ta&&Ta.__createBinding||(Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]}),ile=Ta&&Ta.__exportStar||function(t,e){for(var r in t)r!=="default"&&!Object.prototype.hasOwnProperty.call(e,r)&&nle(e,t,r)};Object.defineProperty(Ta,"__esModule",{value:!0});ile(MT(),Ta)});var E1=f(yr=>{"use strict";var ole=yr&&yr.__createBinding||(Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]}),Wi=yr&&yr.__exportStar||function(t,e){for(var r in t)r!=="default"&&!Object.prototype.hasOwnProperty.call(e,r)&&ole(e,t,r)};Object.defineProperty(yr,"__esModule",{value:!0});Wi(be(),yr);Wi(gn(),yr);Wi(qe(),yr);Wi(AT(),yr);Wi(vt(),yr);Wi(_r(),yr);Wi(Yo(),yr);Wi(Ft(),yr);Wi(Ci(),yr)});var k1=f(Do=>{"use strict";var ale=Do&&Do.__createBinding||(Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]}),N1=Do&&Do.__exportStar||function(t,e){for(var r in t)r!=="default"&&!Object.prototype.hasOwnProperty.call(e,r)&&ale(e,t,r)};Object.defineProperty(Do,"__esModule",{value:!0});N1(Ad(),Do);N1(UT(),Do)});var w1=f(Cr=>{"use strict";var sle=Cr&&Cr.__createBinding||(Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]}),Io=Cr&&Cr.__exportStar||function(t,e){for(var r in t)r!=="default"&&!Object.prototype.hasOwnProperty.call(e,r)&&sle(e,t,r)};Object.defineProperty(Cr,"__esModule",{value:!0});Io(BT(),Cr);Io(zT(),Cr);Io(YT(),Cr);Io(QT(),Cr);Io(fo(),Cr);Io(hv(),Cr);Io(rR(),Cr);Io(oR(),Cr)});var ol=f(We=>{"use strict";var O1=We&&We.__createBinding||(Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]}),ule=We&&We.__setModuleDefault||(Object.create?function(t,e){Object.defineProperty(t,"default",{enumerable:!0,value:e})}:function(t,e){t.default=e}),vr=We&&We.__exportStar||function(t,e){for(var r in t)r!=="default"&&!Object.prototype.hasOwnProperty.call(e,r)&&O1(e,t,r)},cle=We&&We.__importStar||function(t){if(t&&t.__esModule)return t;var e={};if(t!=null)for(var r in t)r!=="default"&&Object.prototype.hasOwnProperty.call(t,r)&&O1(e,t,r);return ule(e,t),e};Object.defineProperty(We,"__esModule",{value:!0});We.GrammarAST=void 0;vr(nf(),We);vr(Gu(),We);vr(FT(),We);vr(h1(),We);vr(er(),We);vr(mR(),We);vr(v1(),We);vr(R1(),We);vr(ov(),We);vr(P1(),We);vr(S1(),We);vr(C1(),We);vr(E1(),We);vr(k1(),We);vr(w1(),We);var lle=cle(ke());We.GrammarAST=lle});var I1=f((y_e,D1)=>{"use strict";D1.exports=Ie()});var x1=f(tt=>{"use strict";Object.defineProperty(tt,"__esModule",{value:!0});tt.reflection=tt.ForecastAstReflection=tt.isPerson=tt.Person=tt.isModel=tt.Model=tt.isGreeting=tt.Greeting=void 0;var dle=ol();tt.Greeting="Greeting";function fle(t){return tt.reflection.isInstance(t,tt.Greeting)}tt.isGreeting=fle;tt.Model="Model";function ple(t){return tt.reflection.isInstance(t,tt.Model)}tt.isModel=ple;tt.Person="Person";function hle(t){return tt.reflection.isInstance(t,tt.Person)}tt.isPerson=hle;var sh=class extends dle.AbstractAstReflection{getAllTypes(){return["Greeting","Model","Person"]}computeIsSubtype(e,r){switch(e){default:return!1}}getReferenceType(e){let r=`${e.container.$type}:${e.property}`;switch(r){case"Greeting:person":return tt.Person;default:throw new Error(`${r} is not a valid reference id.`)}}getTypeMetaData(e){switch(e){case"Model":return{name:"Model",mandatory:[{name:"greetings",type:"array"},{name:"persons",type:"array"}]};default:return{name:e,mandatory:[]}}}};tt.ForecastAstReflection=sh;tt.reflection=new sh});var q1=f(ch=>{"use strict";Object.defineProperty(ch,"__esModule",{value:!0});ch.ForecastGrammar=void 0;var mle=ol(),uh,gle=()=>uh!=null?uh:uh=(0,mle.loadGrammarFromJson)(`{
  "$type": "Grammar",
  "isDeclared": true,
  "name": "Forecast",
  "rules": [
    {
      "$type": "ParserRule",
      "name": "Model",
      "entry": true,
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "persons",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@1"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "greetings",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@2"
              },
              "arguments": []
            }
          }
        ],
        "cardinality": "*"
      },
      "definesHiddenTokens": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Person",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "person"
          },
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@4"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Greeting",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "Hello"
          },
          {
            "$type": "Assignment",
            "feature": "person",
            "operator": "=",
            "terminal": {
              "$type": "CrossReference",
              "type": {
                "$ref": "#/rules@1"
              },
              "terminal": {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@4"
                },
                "arguments": []
              },
              "deprecatedSyntax": false
            }
          },
          {
            "$type": "Keyword",
            "value": "!"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "TerminalRule",
      "hidden": true,
      "name": "WS",
      "definition": {
        "$type": "RegexToken",
        "regex": "\\\\s+"
      },
      "fragment": false
    },
    {
      "$type": "TerminalRule",
      "name": "ID",
      "definition": {
        "$type": "RegexToken",
        "regex": "[_a-zA-Z][\\\\w_]*"
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "INT",
      "type": {
        "$type": "ReturnType",
        "name": "number"
      },
      "definition": {
        "$type": "RegexToken",
        "regex": "[0-9]+"
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "STRING",
      "definition": {
        "$type": "RegexToken",
        "regex": "\\"(\\\\\\\\.|[^\\"\\\\\\\\])*\\"|'(\\\\\\\\.|[^'\\\\\\\\])*'"
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "hidden": true,
      "name": "ML_COMMENT",
      "definition": {
        "$type": "RegexToken",
        "regex": "\\\\/\\\\*[\\\\s\\\\S]*?\\\\*\\\\/"
      },
      "fragment": false
    },
    {
      "$type": "TerminalRule",
      "hidden": true,
      "name": "SL_COMMENT",
      "definition": {
        "$type": "RegexToken",
        "regex": "\\\\/\\\\/[^\\\\n\\\\r]*"
      },
      "fragment": false
    }
  ],
  "definesHiddenTokens": false,
  "hiddenTokens": [],
  "imports": [],
  "interfaces": [],
  "types": [],
  "usedGrammars": []
}`);ch.ForecastGrammar=gle});var L1=f(Bi=>{"use strict";Object.defineProperty(Bi,"__esModule",{value:!0});Bi.ForecastGeneratedModule=Bi.ForecastGeneratedSharedModule=Bi.ForecastLanguageMetaData=void 0;var yle=x1(),vle=q1();Bi.ForecastLanguageMetaData={languageId:"forecast",fileExtensions:[".4cast"],caseInsensitive:!1};Bi.ForecastGeneratedSharedModule={AstReflection:()=>new yle.ForecastAstReflection};Bi.ForecastGeneratedModule={Grammar:()=>(0,vle.ForecastGrammar)(),LanguageMetaData:()=>Bi.ForecastLanguageMetaData,parser:{}}});var M1=f(yu=>{"use strict";Object.defineProperty(yu,"__esModule",{value:!0});yu.ForecastValidator=yu.registerValidationChecks=void 0;function _le(t){let e=t.validation.ValidationRegistry,r=t.validation.ForecastValidator,n={Person:r.checkPersonStartsWithCapital};e.register(n,r)}yu.registerValidationChecks=_le;var _R=class{checkPersonStartsWithCapital(e,r){if(e.name){let n=e.name.substring(0,1);n.toUpperCase()!==n&&r("warning","Person name should start with a capital.",{node:e,property:"name"})}}};yu.ForecastValidator=_R});var j1=f(Ra=>{"use strict";Object.defineProperty(Ra,"__esModule",{value:!0});Ra.createForecastServices=Ra.ForecastModule=void 0;var lh=ol(),$1=L1(),F1=M1();Ra.ForecastModule={validation:{ForecastValidator:()=>new F1.ForecastValidator}};function Tle(t){let e=(0,lh.inject)((0,lh.createDefaultSharedModule)(t),$1.ForecastGeneratedSharedModule),r=(0,lh.inject)((0,lh.createDefaultModule)({shared:e}),$1.ForecastGeneratedModule,Ra.ForecastModule);return e.ServiceRegistry.register(r),(0,F1.registerValidationChecks)(r),{shared:e,Forecast:r}}Ra.createForecastServices=Tle});var Cle=f(G1=>{Object.defineProperty(G1,"__esModule",{value:!0});var U1=ol(),TR=I1(),Rle=j1(),ble=new TR.BrowserMessageReader(self),Ale=new TR.BrowserMessageWriter(self),Ple=(0,TR.createConnection)(ble,Ale),{shared:Sle}=(0,Rle.createForecastServices)(Object.assign({connection:Ple},U1.EmptyFileSystem));(0,U1.startLanguageServer)(Sle)});Cle();})();
