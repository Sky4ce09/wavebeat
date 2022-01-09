//internal bookkeeping for loops and waves for (hopefully) easier modification
var track = new Track();
var maxWaveStack = 0;
var rowlist = [];

var ids = { loop: 0, row: 0 };
function generate(type, name) {
  let out = document.createElement(type);
  let attr = document.createAttribute("id");
  attr.value = name + ids[name];
  ids[name]++;
  out.setAttributeNode(attr);
  return out;
}

function addNewLoop(name) {
  //loop1 loop2 funny c: || newtf stands for new text field

  for (let i = 0; i < rowlist.length; i++) {
    let ntd = document.createElement("td");
    let attr = document.createAttribute("id");
    attr.value = track.loops.length - 1 + " " + i;
    ntd.setAttributeNode(attr);
    attr = document.createAttribute("nowrap");
    ntd.setAttributeNode(attr);
    rowlist[i].append(ntd);
  }

  let newS = generate("td", "loop");
  let nowrap = document.createAttribute("nowrap");
  newS.setAttributeNode(nowrap);

  let newtf;
  let attr;

  let btn = document.createElement("input");
  attr = document.createAttribute("type");
  attr.value = "button";
  btn.setAttributeNode(attr);
  attr = document.createAttribute("value");
  attr.value = "Add wave";
  btn.setAttributeNode(attr);
  btn.addEventListener("click", function () {
    let i = btn.parentElement.getAttribute("id");
    track.loops[i.substring(i.length - 1, i.length) * 1].waves.push(new Wave());
    buildHtml();
  });
  newS.appendChild(btn);

  btn = document.createElement("input");
  attr = document.createAttribute("type");
  attr.value = "button";
  btn.setAttributeNode(attr);
  attr = document.createAttribute("value");
  attr.value = "Delete";
  btn.setAttributeNode(attr);
  btn.addEventListener("click", function () {
    deleteLoop(btn.parentElement.getAttribute("id").substring(4,5) * 1);
  });
  newS.appendChild(btn);
  
  newtf = document.createElement("input");
  attr = document.createAttribute("type");
  attr.value = "text";
  newtf.setAttributeNode(attr);
  attr = document.createAttribute("size");
  attr.value = "8";
  newtf.setAttributeNode(attr);
  attr = document.createAttribute("value");
  attr.value = name;
  newtf.setAttributeNode(attr);
  newtf.oninput = function(){evaluateHtml()}
  newS.appendChild(newtf);

  document.getElementById("looplist").appendChild(newS);
}
//int: internal element
function addWave(refID, o, int) {
  let row;
  if (track.loops[refID].waves.length >= maxWaveStack) {
    row = generate("tr", "row");
    for (let x = 0; x < track.loops.length; x++) {
      let ntd = document.createElement("td");
      let attr = document.createAttribute("id");
      attr.value = x + " " + rowlist.length;
      ntd.setAttributeNode(attr);
      attr = document.createAttribute("nowrap");
      ntd.setAttributeNode(attr);
      row.append(ntd);
    }
    rowlist.push(row);
    looplistRows.append(row);
    maxWaveStack++;
  } else {
    row = document.getElementById("row" + track.loops[refID].waves.length);
  }
  let nW = document.createElement("span");

  let add = document.createElement("input");
  let a = document.createAttribute("type");
  a.value = "text";
  add.setAttributeNode(a);
  a = document.createAttribute("size");
  a.value = "2";
  add.setAttributeNode(a);
  a = document.createAttribute("value");
  a.value = int.type;
  add.setAttributeNode(a);
  add.oninput = function(){evaluateHtml()}
  nW.append(add);

  add = document.createElement("input");
  a = document.createAttribute("type");
  a.value = "text";
  add.setAttributeNode(a);
  a = document.createAttribute("size");
  a.value = "2";
  add.setAttributeNode(a);
  a = document.createAttribute("value");
  a.value = int.fx;
  add.setAttributeNode(a);
  add.oninput = function(){evaluateHtml()}
  nW.append(add);

  add = document.createElement("input");
  a = document.createAttribute("type");
  a.value = "text";
  add.setAttributeNode(a);
  a = document.createAttribute("size");
  a.value = "1";
  add.setAttributeNode(a);
  a = document.createAttribute("value");
  a.value = int.vol;
  add.setAttributeNode(a);
  add.oninput = function(){evaluateHtml()}
  nW.append(add);

  add = document.createElement("input");
  a = document.createAttribute("type");
  a.value = "text";
  add.setAttributeNode(a);
  a = document.createAttribute("size");
  a.value = "1";
  add.setAttributeNode(a);
  a = document.createAttribute("value");
  a.value = int.frq;
  add.setAttributeNode(a);
  add.oninput = function(){evaluateHtml()}
  nW.append(add);

  add = document.createElement("input");
  a = document.createAttribute("type");
  a.value = "text";
  add.setAttributeNode(a);
  a = document.createAttribute("size");
  a.value = "1";
  add.setAttributeNode(a);
  a = document.createAttribute("value");
  a.value = int.hol;
  add.setAttributeNode(a);
  add.oninput = function(){evaluateHtml()}
  nW.append(add);

  add = document.createElement("input");
  a = document.createAttribute("type");
  a.value = "button";
  add.setAttributeNode(a);
  a = document.createAttribute("value");
  a.value = "Delete";
  add.setAttributeNode(a);
  add.addEventListener("click", function () {
    deleteWave(nW);
  });
  nW.append(add);

  document.getElementById(refID + " " + o).append(nW);
  a = document.createAttribute("id");
  a.value = refID + "b" + o;
  nW.setAttributeNode(a);
}
function deleteWave(element) {
  let targetArray =
    track.loops[
      element
        .getAttribute("id")
        .substring(0, element.getAttribute("id").indexOf("b")) * 1
    ].waves;
  let toRemove =
    targetArray[
      element
        .getAttribute("id")
        .substring(
          element.getAttribute("id").indexOf("b") + 1,
          element.getAttribute("id").length
        ) * 1
    ];
  let copy = [];
  for (let i = 0; i < targetArray.length; i++) {
    if (targetArray[i] != toRemove) {
      copy.push(targetArray[i]);
    }
  }
  console.log(targetArray, copy, toRemove);
  track.loops[
    element
      .getAttribute("id")
      .substring(0, element.getAttribute("id").indexOf("b")) * 1
  ].waves = copy;
  buildHtml();
}
function deleteLoop(index) {
  let copy = [];
  for (let i = 0; i < track.loops.length; i++) {
    if (i != index) {
      copy.push(track.loops[i]);
    }
  }
  track.loops = copy;
  buildHtml();
}
//i am desperate. this function should be unnecessary.
//it does make short work of gaps between waves tho
function buildHtml() {
  rowlist = [];
  maxWaveStack = 0;
  ids = { loop: 0, row: 0 };
  document.getElementById("looplistRows").remove();
  let a = document.createElement("tbody");
  att = document.createAttribute("id");
  att.value = "looplistRows";
  a.setAttributeNode(att);
  let add = document.createElement("tr");
  att = document.createAttribute("id");
  att.value = "looplist";
  add.setAttributeNode(att);
  a.append(add);
  document.getElementById("tab").append(a);
  for (let i = 0; i < track.loops.length; i++) {
    addNewLoop(track.loops[i].name);
  }
  for (let i = 0; i < track.loops.length; i++) {
    for (let j = 0; j < track.loops[i].waves.length; j++) {
      addWave(i, j, track.loops[i].waves[j]);
    }
  }
  evaluateHtml();
}
function evaluateHtml() {
  try {
    if (document.getElementById("loopIndex").value != "") {
      track.m = document.getElementById("loopDuration").value;
      track.loopLen = document.getElementById("sampleRate").value * track.m / 1000;
      for (let x = 0; x < track.loops.length; x++) {
        track.loops[x].name = document.getElementById("loop" + x).lastChild.value;
        for (let y = 0; y < track.loops[x].waves.length; y++) {
          let children = document.getElementById(x + "b" + y).children;
          let customs = [];
          for (let el of children) {
            if (el.getAttribute("type") == "text") {
              customs.push(el);
            }
          }
          let h = track.loops[x].waves[y];
          h.type = customs[0].value;
          h.fx = customs[1].value;
          h.vol = customs[2].value;
          h.frq = customs[3].value;
          h.hol = customs[4].value;
          track.loops[x].waves[y] = h;
        }
      }
      document.getElementById("output").value = track.parse();
    }
  } catch (e) {}
}
let templateAtt;
var templates = {};
templates.loopTemplate = generate("span", "loop");
//prepare event listener
document.getElementById("loopAdder").addEventListener("click", function () {
  track.loops.push(new Loop());
  buildHtml();
});
