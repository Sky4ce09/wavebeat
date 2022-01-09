var outstr;
class Track {
  //pass the amount of milliseconds for a loop to play, the desired sample rate and an array of loops
  constructor(loopLengthMillis = 500, sampleRate = 8000, loopList = []) {
    this.loopLen = (loopLengthMillis * sampleRate) / 1000;
    this.loops = loopList;
  }
}
class Loop {
  //pass an array of waves
  constructor(waveList = [], n = "New Loop") {
    this.name = n;
    this.waves = waveList;
    this.rate = this.waves.length;
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
  parse() {
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
        out = "((t*" + this.frq + "%" + 255 + ">" + (255 - this.hol) + ")*" + this.vol + ")";
        break;
      case "sawtooth":
        out = "(t*" + (this.frq * this.vol) / 255 + "%" + this.vol + ")";
        break;
      case "notesaw":
        out = "(t*" + (this.frq * this.vol) / 255 + "%" + this.vol + ")*(1-(t%a)/a)";
        break;
      case "rnotesaw":
        out = "(t*" + (this.frq * this.vol) / 255 + "%" + this.vol + ")*((t%a)/a)";
        break;
      case "hysaw":
        out = "(t*" + (this.frq * this.vol) / 255 + "%" + this.vol + ")*(1-pow((t%a)/a,b))";
        break;
      case "rhysaw":
        out = "(t*" + (this.frq * this.vol) / 255 + "%" + this.vol + ")*(1-pow(1-(t%a)/a,b))";
        break;
      case "laser":
        out = "(" + 39.6 * this.frq * this.vol + "/(t%a/" + this.hol + ")%" + this.vol + ")";
        break;
      case "halflaser":
        out =
          "(" + 39.6 * this.frq * this.vol + "/(t%a/" + this.hol + ")%" + this.vol + ")*(t%a<a/2)";
        break;
    }
  }
}