class Track {
  //pass the amount of milliseconds for a loop to play, the desired sample rate and an array of loops
  constructor(loopLengthMillis = 500, sampleRate = 8000, loopList = []) {
    this.m = loopLengthMillis;
    this.loopLen = (loopLengthMillis * sampleRate) / 1000;
    this.loops = loopList;
  }
  parse() {
    let index = JSON.parse("[" + document.getElementById("loopIndex").value + "]");
    let out = "a=" + this.loopLen + ",\nb=" + this.m/this.loopLen + ",\n["
    for (let i = 0; i < index.length; i++) {
      out += this.loops[index[i]].parse() + ",\n";
    }
    out = out.substring(0, out.length - 2);
    out += "][floor(t/a)%" + index.length + "]"
    return out;
  }
}
class Loop {
  //pass an array of waves
  constructor(waveList = [], n = "New Loop") {
    this.name = n;
    this.waves = waveList;
    this.rate = this.waves.length;
  }
  parse() {
    let out = "[";
    for (let i = 0; i < this.waves.length; i++) {
      out += this.waves[i].parse(this.waves.length) + ",\n";
    }
    out = out.substring(0, out.length - 2);
    out += "][floor(t*" + this.waves.length + "/a%" + this.waves.length + ")]"
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
  }
  parse(alen) {
    let out = "";
    switch (this.type) {
      case "sine":
        out =
          "(sin(t*" +
          Math.log10(1.5 + this.frq / 16) +
          ")*" +
          this.vol / 2 +
          ")+" +
          this.vol / 2;
        break;
      case "square":
        out =
          "((t*" +
          this.frq +
          "%" +
          255 +
          ">" +
          (255 - this.hol) +
          ")*" +
          this.vol +
          ")";
        break;
      case "sawtooth":
        out = "(t*" + (this.frq * this.vol) / 255 + "%" + this.vol + ")";
        break;
      case "laser":
        out =
          "(" +
          39.6 * this.frq * this.vol +
          "/(t%a/" +
          this.hol +
          ")%" +
          this.vol +
          ")";
        break;
      case "halflaser":
        out =
          "(" +
          39.6 * this.frq * this.vol +
          "/(t%a/" +
          this.hol +
          ")%" +
          this.vol +
          ")*(t%a<a/2)";
        break;
    }
    switch (this.fx) {
      case "note":
        out += "*(1-(t*" + alen + "%a)/a)";
        break;
      case "cresc":
        out += "*((t*" + alen + "%a)/a)";
        break;
      case "rise":
        out += "*(1-pow(1-(t*" + alen + "%a)/a,b))";
        break;
      case "fall":
        out += "*(1-pow((t*" + alen + "%a)/a,b))";
        break;
    }
    return out;
  }
}