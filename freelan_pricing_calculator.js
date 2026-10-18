const $ = id => document.getElementById(id);
const fmt = n => 'Rs. ' + (Number.isFinite(n) ? n : 0).toLocaleString('en-LK',{minimumFractionDigits:2,maximumFractionDigits:2});
const num = id => Math.max(0, parseFloat($(id).value) || 0);
const addPercent = (base, pct) => base * (1 + pct / 100);
let rowCounter = 0;
function addRow(name='', price='', pct='0'){
  rowCounter++;
  const tr = document.createElement('tr');
  tr.innerHTML = `<td><input class="item-input item-name" aria-label="Item name" placeholder="e.g. Product / Row ${rowCounter}" value="${String(name).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}"></td>
  <td><input class="item-price" aria-label="Base price" type="number" min="0" step="0.01" placeholder="0.00" value="${price}"></td>
  <td><input class="item-pct" aria-label="Add-on percentage" type="number" min="0" step="0.01" value="${pct}"></td>
  <td class="row-total">Rs. 0.00</td><td><button class="remove" aria-label="Remove row" title="Remove row">x</button></td>`;
  tr.querySelectorAll('input').forEach(input => input.addEventListener('input', updateAll));
  tr.querySelector('.remove').addEventListener('click', () => {tr.remove(); updateAll();});
  $('items').appendChild(tr); updateAll();
}
function updateAll(){
  let base=0, final=0;
  document.querySelectorAll('#items tr').forEach(tr=>{
    const p=Math.max(0,parseFloat(tr.querySelector('.item-price').value)||0);
    const pct=Math.max(0,parseFloat(tr.querySelector('.item-pct').value)||0);
    const total=addPercent(p,pct); base+=p; final+=total;
    tr.querySelector('.row-total').textContent=fmt(total);
  });
  $('baseTotal').textContent=fmt(base); $('addedTotal').textContent=fmt(final-base); $('factoryTotal').textContent=fmt(final);
  const fgp=addPercent(final,num('factoryGP')), fnp=addPercent(final,num('factoryNP'));
  $('factoryGPPrice').textContent=fmt(fgp); $('factoryNPPrice').textContent=fmt(fnp);
  $('factoryGPFormula').textContent=`${fmt(final)} + ${num('factoryGP')}% add-on`;
  $('factoryNPFormula').textContent=`${fmt(final)} + ${num('factoryNP')}% add-on`;
  const freelanGP = addPercent(fgp,num('freelanGP'));
  const freelanNP = addPercent(fnp,num('freelanNP'));
  const agencyGP = addPercent(freelanGP,num('agencyGP'));
  const agencyNP = addPercent(freelanNP,num('agencyNP'));
  setStage('freelan',fgp,fnp);
  setStage('agency',freelanGP,freelanNP);
  setStage('shops',agencyGP,agencyNP);
}
function setStage(stage, priorGP, priorNP){
  const pctGP = num(`${stage}GP`);
  const pctNP = num(`${stage}NP`);
  const gp=addPercent(priorGP,pctGP), np=addPercent(priorNP,pctNP);
  $(`in${stage[0].toUpperCase()+stage.slice(1)}GP`).textContent=fmt(priorGP);
  $(`in${stage[0].toUpperCase()+stage.slice(1)}NP`).textContent=fmt(priorNP);
  $(`${stage}GPPrice`).textContent=fmt(gp); $(`${stage}NPPrice`).textContent=fmt(np);
  $(`${stage}GPFormula`).textContent=`${fmt(priorGP)} + ${pctGP}% add-on`;
  $(`${stage}NPFormula`).textContent=`${fmt(priorNP)} + ${pctNP}% add-on`;
}
document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t===tab));
  document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.id===tab.dataset.tab));
}));
['factoryGP','factoryNP','freelanGP','freelanNP','agencyGP','agencyNP','shopsGP','shopsNP'].forEach(id=>$(id).addEventListener('input',updateAll));
$('addRow').addEventListener('click',()=>addRow());
$('clearRows').addEventListener('click',()=>{ $('items').innerHTML=''; updateAll();});
$('resetAll').addEventListener('click',()=>{
  if(!confirm('Reset all item rows and percentage inputs?')) return;
  $('items').innerHTML='';
  ['factoryGP','factoryNP','freelanGP','freelanNP','agencyGP','agencyNP','shopsGP','shopsNP'].forEach(id=>$(id).value='0');
  rowCounter=0; addRow(); addRow(); addRow();
  document.querySelector('.tab[data-tab="factory"]').click();
});
addRow(); addRow(); addRow(); updateAll();
