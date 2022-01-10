class Track {
	//pass the amount of milliseconds for a loop to play, the desired sample rate and an array of loops
	constructor(loopLengthMillis = 500, sampleRate = 8000, loopList = []) {
		this.m = loopLengthMillis;
		this.loopLen = (loopLengthMillis * sampleRate) / 1000;
		this.loops = loopList;

		Object.seal(this);
	}
	parse() {
		const indiciesString = document.getElementById("loopIndex").value;
		let indiciesLen;

		let out = `a=${this.loopLen},\nb=${this.m / this.loopLen},\n[\n`;
		if (indiciesString === "") {
			out += `\t// NOTE: no loop indices!\n`;
			indiciesLen = 0;
		} else {
			const indicies = indiciesString.split(/ |,/g);
			indiciesLen = indicies.length;
			for (const index of indicies) {
				const indexNum = parseInt(index);
				if (index >= 0 && index < this.loops.length)
					out += `\t${this.loops[index].parse()},\n`;
				else
					out += `\tundefined, // WARNING: invalid loop index ${JSON.stringify(index)}!\n`;
			}
		}
		out += `][floor(t/a)%${indiciesLen}]`;
		return out;
	}
}
class Loop {
	//pass an array of waves
	constructor(waveList = [], n = "New Loop") {
		this.name = n;
		this.waves = waveList;
		this.rate = this.waves.length;

		Object.seal(this);
	}
	parse() {
		let out = `[\n`;
		if (this.waves.length === 0)
			out += `\t\t// NOTE: no waves!\n`;
		else
			for (const wave of this.waves)
				out += `\t\t${wave.parse(this.waves.length)},\n`;
		out += `\t][floor(t*${this.waves.length}/a%${this.waves.length})]`;
		return out;
	}
}
class Wave {
	//pass a type (string), the volume, the frequency and the hold (a special parameter)
	constructor(
		form = "square",
		effect = "note",
		volume = 80,
		frequency = 8,
		hold = 127
	) {
		this.type = form;
		this.fx = effect;
		this.vol = volume;
		this.frq = frequency;
		this.hol = hold;

		Object.seal(this);
	}
	parse(alen) {
		let out = null;
		switch (this.type) {
			case "sine":
				out = `(sin(t*${Math.log10(1.5 + this.frq / 16)})*${this.vol / 2})+${this.vol / 2}`;
				break;
			case "square":
				out = `((t*${this.frq}%255>${255 - this.hol})*${this.vol})`;
				break;
			case "sawtooth":
				out = `(t*${(this.frq * this.vol) / 255}%${this.vol})`;
				break;
			case "laser":
				out = `(${39.6 * this.frq * this.vol}/(t*${alen}%(a/${alen})/${this.hol})%${this.vol})`;
				break;
			case "halflaser":
				out = `(${39.6 * this.frq * this.vol}/(t*${alen}%(a/${alen})/${this.hol})%${this.vol})*(t%a<a/2)`;
				break;
		}
		if (out !== null)
			for (const effect of this.fx.split(/ |,/g))
				switch (effect) {
					case "note":
						out += `*(1-(t*${alen}%a)/a)`;
						break;
					case "cresc":
						out += `*((t*${alen}%a)/a)`;
						break;
					case "rise":
						out += `*(1-pow(1-(t*${alen}%a)/a,b))`;
						break;
					case "fall":
						out += `*(1-pow((t*${alen}%a)/a,b))`;
						break;
					case "rand":
						out += `*random()`;
						break;
				}
		return out ?? 0;
	}
}

export { Track, Loop, Wave };