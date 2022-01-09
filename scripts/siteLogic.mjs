import { Track, Loop, Wave } from "./classes.mjs";

//internal bookkeeping for loops and waves for (hopefully) easier modification
const track = new Track();
const maxWaveStack = 0;
const rowlist = [];

const ids = { loop: 0, row: 0 };
function generate(type, name) {
	const out = document.createElement(type);
	const attr = document.createAttribute("id");
	attr.value = name + ids[name];
	ids[name]++;
	out.setAttributeNode(attr);
	return out;
}

function addNewLoop(name) {
	//loop1 loop2 funny c: || newtf stands for new text field

	for (const i in rowlist) {
		const ntd = document.createElement("td");
		const attr = document.createAttribute("id");
		attr.value = `${track.loops.length - 1} ${i}`;
		ntd.setAttributeNode(attr);
		attr = document.createAttribute("nowrap");
		ntd.setAttributeNode(attr);
		rowlist[i].append(ntd);
	}

	const newS = generate("td", "loop");
	const nowrap = document.createAttribute("nowrap");
	newS.setAttributeNode(nowrap);

	const btn = document.createElement("input");
	const attr = document.createAttribute("type");
	attr.value = "button";
	btn.setAttributeNode(attr);
	attr = document.createAttribute("value");
	attr.value = "Add wave";
	btn.setAttributeNode(attr);
	btn.addEventListener("click", function () {
		const i = btn.parentElement.getAttribute("id");
		track.loops[i.substring(i.length - 1, i.length) * 1].waves.push(new Wave());
		buildHtml();
	});
	newS.appendChild(btn);

	btn = document.createElement("input");
	attr = document.createAttribute("type");
	attr.value = "button";
	btn.setAttributeNode(attr);
	attr = document.createAttribute("value");
	attr.value = "Deconste";
	btn.setAttributeNode(attr);
	btn.addEventListener("click", function () {
		deconsteLoop(btn.parentElement.getAttribute("id").substring(4, 5) * 1);
	});
	newS.appendChild(btn);

	const newtf = document.createElement("input");
	attr = document.createAttribute("type");
	attr.value = "text";
	newtf.setAttributeNode(attr);
	attr = document.createAttribute("size");
	attr.value = "8";
	newtf.setAttributeNode(attr);
	attr = document.createAttribute("value");
	attr.value = name;
	newtf.setAttributeNode(attr);
	newtf.oninput = function () {
		evaluateHtml();
	};
	newS.appendChild(newtf);

	document.getElementById("looplist").appendChild(newS);
}
//int: internal element
function addWave(refID, o, int) {
	if (track.loops[refID].waves.length >= maxWaveStack) {
		const row = generate("tr", "row");
		for (const x in track.loops) {
			const ntd = document.createElement("td");
			const attr = document.createAttribute("id");
			attr.value = `${x} ${rowlist.length}`;
			ntd.setAttributeNode(attr);
			attr = document.createAttribute("nowrap");
			ntd.setAttributeNode(attr);
			row.append(ntd);
		}
		rowlist.push(row);
		looplistRows.append(row);
		maxWaveStack++;
	}
	// else { // TODO: this never gets used?
		//const row = document.getElementById(`row${track.loops[refID].waves.length}`);
	//}
	const nW = document.createElement("span");

	const add = document.createElement("input");
	const a = document.createAttribute("type");
	a.value = "text";
	add.setAttributeNode(a);
	a = document.createAttribute("size");
	a.value = "2";
	add.setAttributeNode(a);
	a = document.createAttribute("value");
	a.value = int.type;
	add.setAttributeNode(a);
	add.oninput = function () {
		evaluateHtml();
	};
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
	add.oninput = function () {
		evaluateHtml();
	};
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
	add.oninput = function () {
		evaluateHtml();
	};
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
	add.oninput = function () {
		evaluateHtml();
	};
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
	add.oninput = function () {
		evaluateHtml();
	};
	nW.append(add);

	add = document.createElement("input");
	a = document.createAttribute("type");
	a.value = "button";
	add.setAttributeNode(a);
	a = document.createAttribute("value");
	a.value = "Deconste";
	add.setAttributeNode(a);
	add.addEventListener("click", function () {
		deconsteWave(nW);
	});
	nW.append(add);

	document.getElementById(refID + " " + o).append(nW);
	a = document.createAttribute("id");
	a.value = refID + "b" + o;
	nW.setAttributeNode(a);
}
function deconsteWave(element) {
	const targetArray =
		track.loops[
			element
				.getAttribute("id")
				.substring(0, element.getAttribute("id").indexOf("b")) * 1
		].waves;
	const toRemove =
		targetArray[
		element
			.getAttribute("id")
			.substring(
				element.getAttribute("id").indexOf("b") + 1,
				element.getAttribute("id").length
			) * 1
		];
	const copy = [];
	for (const target of targetArray)
		if (target != toRemove)
			copy.push(target);
	console.log(targetArray, copy, toRemove);
	track.loops[
		element
			.getAttribute("id")
			.substring(0, element.getAttribute("id").indexOf("b")) * 1
	].waves = copy;
	buildHtml();
}
function deconsteLoop(index) {
	const copy = [];
	for (const i of track.loops)
		if (i != index)
			copy.push(track.loops[i]);
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
	const a = document.createElement("tbody");
	const att = document.createAttribute("id");
	att.value = "looplistRows";
	a.setAttributeNode(att);
	const add = document.createElement("tr");
	att = document.createAttribute("id");
	att.value = "looplist";
	add.setAttributeNode(att);
	a.append(add);
	document.getElementById("tab").append(a);
	for (const loop of track.loops)
		addNewLoop(loop.name);
	for (const i in track.loops)
		for (const j in track.loops[i].waves)
			addWave(i, j, track.loops[i].waves[j]);
	evaluateHtml();
}
function evaluateHtml() {
	try {
		track.m = document.getElementById("loopDuration").value;
		track.loopLen =
			(document.getElementById("sampleRate").value * track.m) / 1000;
		for (const x in track.loops) {
			track.loops[x].name = document.getElementById(`loop${x}`).lastChild.value;
			for (const y in track.loops[x].waves) {
				const children = document.getElementById(`${x}b${y}`).children;
				const customs = [];
				for (const el of children)
					if (el.getAttribute("type") == "text")
						customs.push(el);
				const h = track.loops[x].waves[y];
				h.type = customs[0].value;
				h.fx = customs[1].value;
				h.vol = customs[2].value;
				h.frq = customs[3].value;
				h.hol = customs[4].value;
				track.loops[x].waves[y] = h;
			}
		}
		document.getElementById("output").value = track.parse();
	} catch (e) { } // TODO: just catching a massive statement like this is terrible
}

const templates = {};
templates.loopTemplate = generate("span", "loop");
//prepare event listener
document.getElementById("loopAdder").addEventListener("click", function () {
	track.loops.push(new Loop());
	buildHtml();
});