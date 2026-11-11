// Tarif verisi denetimi: www/index.html içindeki INGREDIENTS ve RECIPES tablolarını okur.
// Hata bulursa 1 koduyla çıkar; CI derlemeden önce bunu çalıştırır.
//   node scripts/check-recipes.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const htmlPath = fileURLToPath(new URL('../www/index.html', import.meta.url));
const html = readFileSync(htmlPath, 'utf8');

function extract(startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  if (start < 0) throw new Error(`Bulunamadı: ${startMarker}`);
  const end = html.indexOf(endMarker, start);
  if (end < 0) throw new Error(`Bitiş bulunamadı: ${startMarker}`);
  return html.slice(start, end);
}

// INGREDIENTS ile RECIPES arka arkaya tanımlı; BADGES tanımından hemen öncesine kadar alınır.
const source = extract('var INGREDIENTS = {', 'var BADGES = [');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(source + '\nthis.INGREDIENTS = INGREDIENTS; this.RECIPES = RECIPES;', ctx);
const { INGREDIENTS, RECIPES } = ctx;

const errors = [];
const names = new Map();
const signatures = new Map();

for (const r of RECIPES) {
  if (!r.name) errors.push('Adı olmayan tarif var.');
  if (names.has(r.name)) errors.push(`Aynı adla iki tarif: ${r.name}`);
  names.set(r.name, true);

  if (!Array.isArray(r.parts) || r.parts.length === 0) {
    errors.push(`${r.name}: parça listesi boş.`);
    continue;
  }
  for (const p of r.parts) {
    if (!INGREDIENTS[p]) errors.push(`${r.name}: tanımsız parça "${p}".`);
  }
  if (!r.cup || typeof r.cup.min !== 'number' || typeof r.cup.max !== 'number' || r.cup.min > r.cup.max) {
    errors.push(`${r.name}: bardak bilgisi eksik ya da hatalı.`);
  }

  // Aynı bloklarla ve aynı bardakla kurulan iki tarif oyunda ayırt edilemez.
  const sig = r.parts.join('+') + '|' + (r.cup ? r.cup.type : '') + '|' + (r.iced ? 'soguk' : 'sicak');
  if (signatures.has(sig)) {
    errors.push(`${r.name} ile ${signatures.get(sig)} aynı bloklardan ve aynı bardaktan oluşuyor (${r.parts.join(', ')}).`);
  } else {
    signatures.set(sig, r.name);
  }
}

if (errors.length) {
  console.error(`Tarif denetimi başarısız (${errors.length} sorun):`);
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}
console.log(`Tarif denetimi geçti: ${RECIPES.length} tarif, ${Object.keys(INGREDIENTS).length} parça.`);
