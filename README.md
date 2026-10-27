# Unicode Font Styles

![Stars](https://img.shields.io/github/stars/jackcharles7288-ops/unicode-font-styles?style=flat&color=b98a2f)
![Forks](https://img.shields.io/github/forks/jackcharles7288-ops/unicode-font-styles?style=flat&color=b98a2f)
![License](https://img.shields.io/badge/license-MIT-green)

**Free fancy font styles for everyone.** Type plain text, get 𝓯𝓪𝓷𝓬𝔂 Unicode text for Instagram bios, Discord names, TikTok captions, gaming names and WhatsApp. No paywall, no signup, no premium pack. The styles other apps charge for, free forever.

### ▶ Live demo: https://jackcharles7288-ops.github.io/unicode-font-styles/

Type your name on the demo page and copy any style with one click.

## Why this exists

Most font generator apps lock their best styles behind a premium subscription. Text styling is just Unicode, it belongs to everyone. So this library gives the styles away as open source code: copy the file, use it in your own project, ship it in your app, sell your app if you like. MIT licensed, no strings.

Built by **Iris Labs**, the beginner-dev studio behind [Fonti](https://fonti.cool), a free generator with 350+ styles.

## Features

- 18 text styles: Bold, Italic, Bold Italic, Script, Bold Script, Fraktur (Gothic), Bold Fraktur, Double-Struck, Monospace, Sans, Sans Bold, Sans Italic, Sans Bold Italic, Circled, Small Caps, Fullwidth, Squared, Black Squared
- Light glitch (zalgo) generator
- 5 layered effects: underline, double underline, strikethrough, slash, overline
- 24 decorative name frames (꧁༺ 𝔫𝔞𝔪𝔢 ༻꧂ style)
- **Unlimited mode**: `combos()` mixes fonts, frames and effects into fresh styles on every call, the supply never runs out (the demo page has a "Generate 24 more" button that never repeats itself)
- Full A to Z charts with numbers where Unicode supports them, including the tricky Letterlike exceptions (ℬ ℰ ℱ ℭ ℍ ℕ ℝ and friends) handled correctly
- Zero dependencies, one small file, works in the browser and in Node
- Kaomoji faces and ready bio layouts on the demo page

## Quick start

**CDN (fastest):**

```html
<script src="https://cdn.jsdelivr.net/gh/jackcharles7288-ops/unicode-font-styles@main/unicode-font-styles.js"></script>
```

**Or just download** `unicode-font-styles.js` from this repo and include it. That is the whole library, one file.

## Usage

```js
// Browser: the script adds a global FontiStyles object
// Node:    const FontiStyles = require("./unicode-font-styles.js");

FontiStyles.convert("Fonti", "boldScript");   // 𝓕𝓸𝓷𝓽𝓲
FontiStyles.convert("Fonti", "fraktur");      // 𝔉𝔬𝔫𝔱𝔦
FontiStyles.convert("Fonti", "circled");      // Ⓕⓞⓝⓣⓘ
FontiStyles.convert("Fonti", "smallCaps");    // ꜰᴏɴᴛɪ

FontiStyles.zalgo("glitch me", 3);            // light glitch text
FontiStyles.effect(FontiStyles.convert("Fonti", "bold"), "underline");  // 𝐅̲𝐨̲𝐧̲𝐭̲𝐢̲
FontiStyles.frame(FontiStyles.convert("Nova", "fraktur"), 0);
// ꧁༺ 𝔑𝔬𝔳𝔞 ༻꧂

FontiStyles.combos("Nova", 24, 42);           // 24 fresh mixed styles, new seed = new styles, forever

FontiStyles.listStyles();                     // [{ id, label }, ...]
```

## The chart: A to Z in 17 styles

### Bold

Uppercase: 𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙

Lowercase: 𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳

Numbers: 𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗

### Italic

Uppercase: 𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍

Lowercase: 𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧

### Bold Italic

Uppercase: 𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁

Lowercase: 𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛

### Script (Cursive)

Uppercase: 𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵

Lowercase: 𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏

### Bold Script

Uppercase: 𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩

Lowercase: 𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃

### Fraktur (Gothic)

Uppercase: 𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ

Lowercase: 𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷

### Bold Fraktur

Uppercase: 𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅

Lowercase: 𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟

### Double-Struck

Uppercase: 𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ

Lowercase: 𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫

Numbers: 𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡

### Monospace

Uppercase: 𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉

Lowercase: 𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣

Numbers: 𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿

### Sans

Uppercase: 𝖠𝖡𝖢𝖣𝖤𝖥𝖦𝖧𝖨𝖩𝖪𝖫𝖬𝖭𝖮𝖯𝖰𝖱𝖲𝖳𝖴𝖵𝖶𝖷𝖸𝖹

Lowercase: 𝖺𝖻𝖼𝖽𝖾𝖿𝗀𝗁𝗂𝗃𝗄𝗅𝗆𝗇𝗈𝗉𝗊𝗋𝗌𝗍𝗎𝗏𝗐𝗑𝗒𝗓

Numbers: 𝟢𝟣𝟤𝟥𝟦𝟧𝟨𝟩𝟪𝟫

### Sans Bold

Uppercase: 𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭

Lowercase: 𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇

Numbers: 𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵

### Sans Italic

Uppercase: 𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡

Lowercase: 𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻

### Sans Bold Italic

Uppercase: 𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕

Lowercase: 𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯

### Circled

Uppercase: ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ

Lowercase: ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ

Numbers: ⓪①②③④⑤⑥⑦⑧⑨

### Small Caps

Uppercase: ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ

## Word examples

- Bold: 𝐅𝐨𝐧𝐭𝐢 · 𝐈𝐫𝐢𝐬 𝐋𝐚𝐛𝐬 · 𝐀𝐞𝐬𝐭𝐡𝐞𝐭𝐢𝐜
- Script (Cursive): ℱℴ𝓃𝓉𝒾 · ℐ𝓇𝒾𝓈 ℒ𝒶𝒷𝓈 · 𝒜ℯ𝓈𝓉𝒽ℯ𝓉𝒾𝒸
- Bold Script: 𝓕𝓸𝓷𝓽𝓲 · 𝓘𝓻𝓲𝓼 𝓛𝓪𝓫𝓼 · 𝓐𝓮𝓼𝓽𝓱𝓮𝓽𝓲𝓬
- Fraktur (Gothic): 𝔉𝔬𝔫𝔱𝔦 · ℑ𝔯𝔦𝔰 𝔏𝔞𝔟𝔰 · 𝔄𝔢𝔰𝔱𝔥𝔢𝔱𝔦𝔠
- Double-Struck: 𝔽𝕠𝕟𝕥𝕚 · 𝕀𝕣𝕚𝕤 𝕃𝕒𝕓𝕤 · 𝔸𝕖𝕤𝕥𝕙𝕖𝕥𝕚𝕔
- Circled: Ⓕⓞⓝⓣⓘ · Ⓘⓡⓘⓢ Ⓛⓐⓑⓢ · Ⓐⓔⓢⓣⓗⓔⓣⓘⓒ
- Small Caps: ꜰonti · ɪris ʟabs · ᴀesthetic

## Kaomoji faces (copy and paste)

Cute text faces made from Unicode symbols, the classic kaomoji style:

```
Happy:    (◕‿◕)  (｡◕‿◕｡)  (◕‿◕✿)  (≧◡≦)  (◡‿◡✿)  (◠‿◠)  (✿◠‿◠)  (´◡`)
Love:     (｡♥‿♥｡)  (˘³˘)♥  (づ｡◕‿‿◕｡)づ  (♥ω♥*)  (◍•ᴗ•◍)  ♡(˘ᴗ˘)♡
Fun:      (¬‿¬)  ( ͡° ͜ʖ ͡°)  (◔◡◔)  ¯\_(ツ)_/¯  (¬_¬)  (ಠ_ಠ)  (ಠ‿ಠ)
Angry:    (╯°□°）╯︵ ┻━┻  (┛◉Д◉)┛彡┻━┻  (ಠ益ಠ)  (¬_¬")
Animals:  ʕ•ᴥ•ʔ  ʕ•̫͡•ʔ  (ᵔᴥᵔ)  (=^-ω-^=)  ᶘ ᵒᴥᵒᶅ  (◕ᴥ◕)
Strong:   ᕕ( ᐛ )ᕗ  ᕙ(⇀‸↼‶)ᕗ  ᕦ(ò_óˇ)ᕤ
```

## Ready Instagram bio layouts

```
✦ 𝒹𝓇𝑒𝒶𝓂𝒾𝓃𝑔 𝒾𝓃 𝓈𝑜𝒻𝓉 𝓂𝑜𝑜𝓃𝓁𝒾𝑔𝒽𝓉 ✦
──────────
☾ coffee, books & quiet days ☾

── .✦ calm & creative ✦. ──
making small things with love
♡ est. in my soft era ♡

⋆｡˚ ☁︎ ˚｡⋆ daydreaming ⋆｡˚ ☁︎ ˚｡⋆
slow living, soft heart
✿ handle with care ✿
```

## Discord and gaming name frames

```
꧁༺ 𝔉𝔬𝔫𝔱𝔦 ༻꧂
★彡 𝗙𝗼𝗻𝘁𝗶 彡★
✧ 𝓕𝓸𝓷𝓽𝓲 ✧
♛ ꜰᴏɴᴛɪ ♛
⚡ 𝔽𝕠𝕟𝕥𝕚 ⚡
```

### Fullwidth (Vaporwave)

Uppercase: ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ

Lowercase: ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ

Numbers: ０１２３４５６７８９

### Squared

Uppercase: 🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉

### Black Squared

Uppercase: 🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉

## An honest note

Fancy letters are Unicode symbols, not real fonts. Most apps show them fine, but screen readers may read them strangely and a few platforms strip some styles. Keep important names in plain text too, so everyone can find and tag you.

## More styles

This repo covers the everyday classics. The full Fonti collection of 350+ styles, including bubble letters, upside down text, heavy glitch and hundreds of symbol frames, lives at **https://fonti.cool**, also free.

## Contributing

Found a style that is missing or a letter that maps wrong? Open an issue or a pull request. New styles are welcome, the only rule is they must be real Unicode that people can copy and paste anywhere.

## License

MIT. Do anything you like with it. A star on this repo and a link back are appreciated but never required.

---

Built in public by Iris Labs. If this saved you a subscription, star the repo so the next person finds it too.
