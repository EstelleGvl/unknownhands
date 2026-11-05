const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync('assets/js/explore/app.js', 'utf8');
const start = source.indexOf('function exportMapAsPng(');
const end = source.indexOf('\n}', start) + 2;
const original = {style:{cursor:'grab'},getBoundingClientRect:()=>({left:100,top:200}),querySelectorAll:()=>[{
  getBoundingClientRect:()=>({left:80,top:170,width:1000,height:600}),
  cloneNode:()=>({style:{},attributes:{},setAttribute(name,value){this.attributes[name]=value;}})
}]};
let image, captures = 0, downloads = 0;
const clone = {querySelectorAll:()=>[{remove(){}}],appendChild(node){image=node;}};
const context = vm.createContext({
  document:{getElementById:()=>original},
  window:{globalMap:{fitBounds(){throw Error('Export must preserve viewport');}}},
  XMLSerializer:class {serializeToString(svg){assert.equal(svg.style.transform,'none');assert.equal(svg.attributes.width,1000);return '<svg/>'; }},
  html2canvas:async (element, options) => {
    captures++;
    assert.equal(element,original);
    assert.equal(options.allowTaint,false);
    options.onclone({getElementById:()=>clone,createElement:()=>({style:{}})});
    assert.match(image.style.cssText,/left:-20px;top:-30px;width:1000px;height:600px/);
    return {toBlob:callback=>callback({})};
  },
  downloadFile(){downloads++;},alert(message){throw Error(message);},console
});
vm.runInContext(source.slice(start,end),context);
context.exportMapAsPng('map','test.png');
setImmediate(()=>{
  assert.equal(captures,1);
  assert.equal(downloads,1);
  assert.equal(original.style.cursor,'grab');
  console.log('PASS: single capture, unchanged viewport, flattened SVG offsets, cursor restored.');
});
