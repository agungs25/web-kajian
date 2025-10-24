// script.js — logika filter & render
function normalizePhone(num){
  const digits=(num||'').replace(/[^0-9]/g,'');
  if(!digits) return null;
  const fixed = digits.startsWith('0') ? '62'+digits.slice(1) : (digits.startsWith('62')?digits:'62'+digits);
  return 'https://wa.me/'+fixed;
}

function updateUstadzOptions(kota){
  let filtered = dataKajian;
  if(kota && kota !== '__all__') filtered = dataKajian.filter(x=>x.kota===kota);
  const ustadzSet = new Set(filtered.map(x=>x.ustadz));
  const ustSel = document.getElementById('filterUstadz');
  ustSel.innerHTML = '<option value="__all__">Semua Ustadz</option>' +
    Array.from(ustadzSet).sort().map(u=>`<option value="${u}">${u}</option>`).join('');
}

function initFilters(){
  const kotaSet = new Set(dataKajian.map(x=>x.kota));
  const kotaSel = document.getElementById('filterKota');
  kotaSel.innerHTML = '<option value="__all__">Semua Kota</option>' +
    Array.from(kotaSet).sort().map(k=>`<option value="${k}">${k}</option>`).join('');
  updateUstadzOptions('__all__');
}

function cardHTML(item){
  const kontak=(item.kontak||[]).filter(Boolean);
  const kontakLinks = kontak.map(k=>{
    const href=normalizePhone(k);
    return href?`<a class="btn btn-wa" href="${href}" target="_blank">📱 ${k}</a>`:'';
  }).join(' ');
  const mapBtn = item.maps?`<a class="btn btn-map" target="_blank" href="${item.maps}">📍 Lihat Peta</a>`:'';
  const bab = item.bab?`<div class="meta">📖 Bab: <strong>${item.bab}</strong></div>`:'';
  return `<div class="card">
    <h3>${item.tempat}</h3>
    <div class="meta">${item.alamat}</div>
    <div class="meta">🕒 ${item.waktu}</div>
    <div class="meta">📚 <strong>${item.kitab}</strong></div>
    ${bab}
    <div class="meta">👤 ${item.ustadz}</div>
    <div class="actions">${mapBtn} ${kontakLinks||''}</div>
  </div>`;
}

function applyFilter(){
  const kotaVal=document.getElementById('filterKota').value;
  const ustVal=document.getElementById('filterUstadz').value;
  let list = dataKajian.slice();
  if(kotaVal!=='__all__') list = list.filter(x=>x.kota===kotaVal);
  if(ustVal!=='__all__') list = list.filter(x=>x.ustadz===ustVal);
  document.getElementById('grid').innerHTML = list.map(cardHTML).join('');
  document.getElementById('countText').textContent = `${list.length} kajian ditampilkan`+((kotaVal!=='__all__'||ustVal!=='__all__')?' (terfilter)':' (semua)');
}

document.addEventListener('DOMContentLoaded',()=>{
  initFilters();
  applyFilter();
  document.getElementById('filterKota').addEventListener('change', (e)=>{
    updateUstadzOptions(e.target.value);
    applyFilter();
  });
  document.getElementById('filterUstadz').addEventListener('change', applyFilter);
});
