import { Track, Loop, Wave } from "./classes.mjs";

//internal bookkeeping for loops and waves for (hopefully) easier modification
// TODO: can these be scoped better?
const track = new Track();
let maxWaveStack = 0;
let rowlist = []; // TODO: this is only set once at buildHTML, is that neccecary?
let ids = { loop: 0, row: 0 }; // TODO: this is only set once at buildHTML, is that neccecary? it's also barely used, so 

// TODO: this function is definetly unneccecary
function generate(type, name) {
	const out = document.createElement(type);
	out.id = name + ids[name];
	ids[name]++;
	return out;
}

function addNewLoop(name) {
	//loop1 loop2 funny c: || newtf stands for new text field

	for (const i in rowlist) {
		const ntd = document.createElement("td");
		ntd.id = `${track.loops.length - 1} ${i}`;
		ntd.nowrap = "";
		rowlist[i].append(ntd);
	}

	const newS = generate("td", "loop");
	newS.nowrap = "";

	const btn = document.createElement("input");
	btn.type = "button";
	btn.value = "Add wave";
	btn.addEventListener("click", function () {
		const i = btn.parentElement.id;
		track.loops[i.substring(i.length - 1, i.length) * 1].waves.push(new Wave());
		buildHtml();
	});
	newS.append(btn);

	btn = document.createElement("input");
	btn.type = "button";
	btn.value = "Deconste";
	btn.addEventListener("click", function () {
		deconsteLoop(btn.parentElement.id.substring(4, 5) * 1);
	});
	newS.append(btn);

	const newtf = document.createElement("input");
	newtf.type = "text";
	newtf.size = "8";
	newtf.value = name;
	newtf.addEventListener("click", () => evaluateHtml());
	newS.append(newtf);

	document.getElementById("looplist").append(newS);
}
//int: internal element
function addWave(refID, o, int) {
	if (track.loops[refID].waves.length >= maxWaveStack) {
		const row = generate("tr", "row");
		for (const x in track.loops) {
			const ntd = document.createElement("td");
			ntd.id = `${x} ${rowlist.length}`;
			ntd.nowrap = "";
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

	for (const value of [
		int.type,
		int.fx,
		int.vol,
		int.frq,
		int.hol,
	]) {
		const add = document.createElement("input");
		add.type = "text";
		add.size = "2";
		add.value = value;
		add.addEventListener("input", () => evaluateHtml());
		nW.append(add);
	}

	const add = document.createElement("input");
	add.type = "button";
	add.value = "Deconste";
	add.addEventListener("click", () => deconsteWave(nW));
	nW.append(add);

	document.getElementById(`${refID} ${o}`).append(nW);
	nW.id = `${refID}b${o}`;
}
function deconsteWave(element) {
	const targetArray =
		track.loops[
			element.id.substring(0, element.id.indexOf("b")) * 1
		].waves;
	const toRemove =
		targetArray[
		element.id.substring(
			element.id.indexOf("b") + 1,
			element.id.length
		) * 1
		];
	const copy = [];
	for (const target of targetArray)
		if (target != toRemove)
			copy.push(target);
	console.log(targetArray, copy, toRemove);
	track.loops[
		element.id.substring(0, element.id.indexOf("b")) * 1
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
	rowlist = []; // TODO: is initializing these globals neccecary?
	maxWaveStack = 0;
	ids = { loop: 0, row: 0 };

	document.getElementById("looplistRows").remove();
	const a = document.createElement("tbody");
	a.id = "looplistRows";
	const add = document.createElement("tr");
	add.id = "looplist";
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
					if (el.type == "text")
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