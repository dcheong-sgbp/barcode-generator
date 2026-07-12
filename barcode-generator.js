/**
 * <barcode-generator> — Code 128B barcode on canvas, with PNG download. Zero dependencies.
 * Built & maintained by SGBP — Singapore Build Partners (https://sgbp.tech). MIT.
 */
// Code 128 module-width patterns, index = code value (0..106). 106 = stop (7 elements).
const C128 = ["212222","222122","222221","121223","121322","131222","122213","122312","132212","221213","221312","231212","112232","122132","122231","113222","123122","123221","223211","221132","221231","213212","223112","312131","311222","321122","321221","312212","322112","322211","212123","212321","232121","111323","131123","131321","112313","132113","132311","211313","231113","231311","112133","112331","132131","113123","113321","133121","313121","211331","231131","213113","213311","213131","311123","311321","331121","312113","312311","332111","314111","221411","431111","111224","111422","121124","121421","141122","141221","112214","112412","122114","122411","142112","142211","241211","221114","413111","241112","134111","111242","121142","121241","114212","124112","124211","411212","421112","421211","212141","214121","412121","111143","111341","131141","114113","114311","411113","411311","113141","114131","311141","411131","211412","211214","211232","2331112"];
class BarcodeGenerator extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { this.render(); }
  // returns {codes:[...], check} for Code128B, or null if a char is out of range
  _encode(text) {
    const codes = [104]; // Start B
    let sum = 104;
    for (let i = 0; i < text.length; i++) {
      const v = text.charCodeAt(i) - 32;
      if (v < 0 || v > 95) return null; // printable ASCII 32..126 only
      codes.push(v); sum += v * (i + 1);
    }
    const check = sum % 103;
    codes.push(check, 106); // checksum + Stop
    return { codes, check };
  }
  _draw(text) {
    const $ = (s) => this.shadowRoot.querySelector(s);
    const c = $("#cv"), err = $("#err");
    const enc = text ? this._encode(text) : null;
    if (!text) { const ctx = c.getContext("2d"); ctx.clearRect(0, 0, c.width, c.height); err.textContent = ""; return; }
    if (!enc) { err.textContent = "Only standard characters (letters, digits, common symbols) are supported."; return; }
    err.textContent = "";
    // build module string
    let mods = "";
    enc.codes.forEach((code) => { mods += C128[code]; });
    const totalUnits = mods.split("").reduce((a, d) => a + +d, 0);
    const unit = 2, quiet = 10, h = 90, labelH = 22;
    c.width = totalUnits * unit + quiet * 2;
    c.height = h + labelH;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#000";
    let x = quiet, bar = true;
    // pattern digits alternate bar/space starting with a bar
    for (const el of mods.split("")) {
      const w = (+el) * unit;
      if (bar) ctx.fillRect(x, 0, w, h);
      x += w; bar = !bar;
    }
    ctx.fillStyle = "#111"; ctx.font = "14px ui-monospace,Menlo,monospace"; ctx.textAlign = "center";
    ctx.fillText(text, c.width / 2, h + 16);
  }
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        *,*::before,*::after{box-sizing:border-box}
        :host{display:block;width:100%;max-width:560px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
        .card{border:1px solid #e2e2e2;border-radius:12px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.06);padding:16px}
        label{display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:600;color:#555;margin-bottom:6px}
        .mini{font:inherit;font-size:11px;font-weight:700;color:#EB0028;background:none;border:0;cursor:pointer}
        input{width:100%;padding:10px 12px;border:1px solid #ccc;border-radius:8px;font-size:16px}
        .stage{margin-top:14px;background:#fafafa;border:1px solid #eee;border-radius:10px;padding:14px;overflow-x:auto;text-align:center}
        canvas{max-width:100%;height:auto}
        .err{color:#c5221f;font-size:12.5px;font-weight:600;margin-top:8px;min-height:16px}
        .dl{margin-top:12px;font:inherit;font-size:12px;font-weight:700;color:#fff;background:#EB0028;border:0;border-radius:8px;padding:9px 14px;cursor:pointer}
        .type{font-size:11px;color:#888;margin-top:8px}
      </style>
      <div class="card">
        <label>Text / number to encode <button class="mini" id="clear">Clear</button></label>
        <input id="in" type="text" value="SGBP-2026" spellcheck="false" autocomplete="off">
        <div class="stage"><canvas id="cv" width="200" height="110"></canvas></div>
        <div class="err" id="err"></div>
        <button class="dl" id="dl">Download PNG</button>
        <div class="type">Symbology: Code 128 (type B)</div>
      </div>`;
    const $ = (s) => this.shadowRoot.querySelector(s);
    const redraw = () => this._draw($("#in").value);
    $("#in").addEventListener("input", redraw);
    $("#clear").addEventListener("click", () => { $("#in").value = ""; redraw(); $("#in").focus(); });
    $("#dl").addEventListener("click", () => {
      const c = $("#cv"); const a = document.createElement("a");
      a.href = c.toDataURL("image/png"); a.download = "barcode.png"; a.click();
    });
    redraw();
  }
}
if (!customElements.get("barcode-generator")) customElements.define("barcode-generator", BarcodeGenerator);
