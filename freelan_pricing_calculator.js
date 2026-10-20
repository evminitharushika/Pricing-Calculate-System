const $ = id => document.getElementById(id);
const fmt = n => 'Rs. ' + (Number.isFinite(n) ? n : 0).toLocaleString('en-LK',{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtRate = n => 'Rs. ' + (Number.isFinite(n) ? n : 0).toLocaleString('en-LK',{minimumFractionDigits:3,maximumFractionDigits:3});
const readNumber = input => {
  const value = input.value.trim();
  const number = value === '' ? 0 : Number(value);
  const valid = value === '' || (Number.isFinite(number) && number >= 0);
  input.classList.toggle('input-invalid', !valid);
  input.setAttribute('aria-invalid', String(!valid));
  input.title = valid ? '' : 'Enter a valid non-negative number.';
  return valid ? number : 0;
};
const num = id => readNumber($(id));
const addAmount = (base, pct) => base * pct / 100;
const positiveNumber = input => {
  const number = readNumber(input);
  const valid = input.value.trim() !== '' && number > 0 && !input.classList.contains('input-invalid');
  input.classList.toggle('input-invalid', !valid);
  input.setAttribute('aria-invalid', String(!valid));
  input.title = valid ? '' : 'Enter a packet weight greater than zero.';
  return valid ? number : 0;
};
let rowCounter = 0;
let deferredInstallPrompt = null;
function addRow(name='', price='', pct='0', pweight=''){
  rowCounter++;
  const tr = document.createElement('tr');
  tr.innerHTML = `<td><div class="item-cell"><input class="item-input item-name" aria-label="Item name" placeholder="e.g. Product / Row ${rowCounter}" value="${String(name).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}"><button class="remove" aria-label="Remove row" title="Remove row">×</button></div></td>
  <td><input class="item-price" aria-label="Base price" type="number" min="0" step="0.01" placeholder="0.00" value="${price}"></td>
  <td><input class="item-pct" aria-label="Add-on percentage" type="number" min="0" step="0.01" value="${pct}"></td>
  <td class="row-total">Rs. 0.00</td>
  <td><input class="item-weight" aria-label="PWeight" type="number" min="0" step="0.01" placeholder="0.00" value="${pweight}"></td>`;
  tr.querySelectorAll('input').forEach(input => input.addEventListener('input', updateAll));
  tr.querySelector('.remove').addEventListener('click', () => {tr.remove(); updateAll();});
  $('items').appendChild(tr); updateAll();
}
function updateAll(){
  let totalRecipesCost=0;
  document.querySelectorAll('#items tr').forEach(tr=>{
    const p=readNumber(tr.querySelector('.item-price'));
    const pct=readNumber(tr.querySelector('.item-pct'));
    readNumber(tr.querySelector('.item-weight'));
    const cost=addAmount(p,pct);
    totalRecipesCost+=cost;
    tr.querySelector('.row-total').textContent=fmt(cost);
  });
  $('factoryTotal').textContent=fmt(totalRecipesCost);
  const costAddPct=num('costAddPercentage');
  const costAddAmount=addAmount(totalRecipesCost,costAddPct);
  const adjustedRecipesCost=totalRecipesCost+costAddAmount;
  $('costAddAmount').textContent=fmt(costAddAmount);
  $('adjustedRecipesCost').textContent=fmt(adjustedRecipesCost);
  const factoryGPPct=num('factoryGP');
  const factoryNPPct=num('factoryNP');
  const gpAmount=addAmount(adjustedRecipesCost,factoryGPPct);
  const npAmount=addAmount(adjustedRecipesCost,factoryNPPct);
  const fgp=adjustedRecipesCost+gpAmount;
  const fnp=adjustedRecipesCost+npAmount;
  $('factoryGPAmount').textContent=fmt(gpAmount);
  $('factoryNPAmount').textContent=fmt(npAmount);
  $('factoryGPAmountFormula').textContent=`${fmt(adjustedRecipesCost)} × ${factoryGPPct}%`;
  $('factoryNPAmountFormula').textContent=`${fmt(adjustedRecipesCost)} × ${factoryNPPct}%`;
  $('factoryGPPrice').textContent=fmt(fgp);
  $('factoryGPFormula').textContent=`${fmt(adjustedRecipesCost)} + ${fmt(gpAmount)}`;
  $('freelanPurchasePrice').value=fmt(fgp);
  const packetWeight=positiveNumber($('freelanPacketWeight'));
  const additionalPct=num('freelanAdditionalPercentage');
  const yValue=packetWeight > 0 ? fgp / packetWeight : 0;
  const xValue=addAmount(fgp,additionalPct);
  const retailPrice=xValue+yValue;
  $('teaPacketCost').textContent=fmtRate(yValue);
  $('teaPacketAdditionalAmount').textContent=fmtRate(xValue);
  $('freelanRetailPrice').textContent=fmt(retailPrice);
  const freelanGP = fgp;
  const freelanNP = fnp;
  const agencyGP = applyStagePercentage(freelanGP,num('agencyGP'));
  const agencyNP = applyStagePercentage(freelanNP,num('agencyNP'));
  setStage('agency',freelanGP,freelanNP);
  setStage('shops',agencyGP,agencyNP);
}
function applyStagePercentage(base, pct){
  return base + addAmount(base,pct);
}
function setStage(stage, priorGP, priorNP){
  const pctGP = num(`${stage}GP`);
  const pctNP = num(`${stage}NP`);
  const gp=applyStagePercentage(priorGP,pctGP), np=applyStagePercentage(priorNP,pctNP);
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
['costAddPercentage','factoryGP','factoryNP','freelanPacketWeight','freelanAdditionalPercentage','agencyGP','agencyNP','shopsGP','shopsNP'].forEach(id=>$(id).addEventListener('input',updateAll));
$('addRow').addEventListener('click',()=>addRow());
$('clearRows').addEventListener('click',()=>{ $('items').innerHTML=''; updateAll();});
$('resetAll').addEventListener('click',()=>{
  if(!confirm('Reset all item rows and percentage inputs?')) return;
  $('items').innerHTML='';
  ['costAddPercentage','factoryGP','factoryNP','freelanAdditionalPercentage','agencyGP','agencyNP','shopsGP','shopsNP'].forEach(id=>$(id).value='0');
  $('freelanPacketWeight').value='';
  rowCounter=0; addRow(); addRow(); addRow();
  document.querySelector('.tab[data-tab="factory"]').click();
});
addRow(); addRow(); addRow(); updateAll();

const installButton = $('installApp');
const installStatus = $('installStatus');
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

if (isStandalone) {
  installButton.hidden = true;
}

function showInstallInstructions(){
  installButton.hidden = false;
  installButton.querySelector('.install-label').textContent = 'How to install';
  installStatus.textContent = 'Use your browser menu and choose “Add to Home screen” or “Install app”.';
}

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installButton.hidden = false;
  installButton.querySelector('.install-label').textContent = 'Install App';
  installStatus.textContent = '';
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  installButton.hidden = true;
  installStatus.textContent = 'App installed successfully.';
});

installButton.addEventListener('click', async () => {
  if (!deferredInstallPrompt) {
    showInstallInstructions();
    return;
  }

  deferredInstallPrompt.prompt();
  const result = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;

  if (result.outcome === 'accepted') {
    installButton.hidden = true;
    installStatus.textContent = 'Installing Pricing Calculate System...';
  } else {
    installStatus.textContent = 'Installation cancelled. You can install it later.';
  }
});

if (!isStandalone) {
  window.setTimeout(() => {
    if (!deferredInstallPrompt) showInstallInstructions();
  }, 1500);
}
