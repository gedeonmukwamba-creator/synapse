/* Synapse — Résumé de cours / Fiche synthèse */

SCREENS.summary = function(p){
  const html = `
    <div class="summary-wrap">
      <div class="crumbs">
        <button onclick="go('library')">Bibliothèque</button><span class="sep">${ic('chevR')}</span>
        <button onclick="go('subject',{subId:'biochem'})">Biochimie</button><span class="sep">${ic('chevR')}</span>
        <span class="cur">Résumé</span>
      </div>

      <div style="display:flex;gap:12px;justify-content:flex-end;margin-bottom:16px;flex-wrap:wrap">
        <button class="btn btn-ghost" onclick="toggleFiche()" id="ficheBtn">${ic('flashcard')} Mode fiche</button>
        <button class="btn btn-ghost" onclick="shareSummary()">${ic('share')} Partager</button>
        <button class="btn btn-accent" onclick="downloadPDF()">${ic('download')} Télécharger en PDF</button>
      </div>

      <article class="card summary-sheet" id="sheet">
        <div class="ss-eyebrow">Biochimie · Chapitre 1</div>
        <h1>Les glucides : structure & classification</h1>
        <div class="ss-meta">
          <span>${ic('clock')} ${SUMMARY.readMins} min de lecture</span>
          <span>${ic('refresh')} MAJ ${SUMMARY.updated}</span>
          <span>${ic('checkCircle')} Validé par le tuteur</span>
        </div>

        <div class="callout key">
          <div class="co-head">${ic('star')} À retenir absolument</div>
          <p>Les glucides sont des <strong>polyhydroxyaldéhydes ou polyhydroxycétones</strong>. On les classe en oses (simples) et osides (complexes). Le glucose (C₆H₁₂O₆) est le carburant énergétique central de l'organisme.</p>
        </div>

        <div class="prose">
          <h2>1. Définition & rôle biologique</h2>
          <p>Les glucides, ou <strong>hydrates de carbone</strong>, ont pour formule générale <strong>Cₙ(H₂O)ₙ</strong>. Ils assurent trois grandes fonctions :</p>
          <ul>
            <li><strong>Énergétique</strong> : le glucose fournit <mark>4 kcal/g</mark> et alimente la glycolyse.</li>
            <li><strong>Structurale</strong> : la cellulose (végétaux), la chitine, les glycoprotéines membranaires.</li>
            <li><strong>Réserve</strong> : le glycogène (foie & muscle) chez l'animal, l'amidon chez le végétal.</li>
          </ul>

          <h2>2. Classification</h2>
          <p>On distingue les <strong>oses</strong> (monosaccharides non hydrolysables) et les <strong>osides</strong> (hydrolysables en oses).</p>
          <table class="def-table">
            <thead><tr><th>Classe</th><th>Exemple</th><th>Caractéristique</th></tr></thead>
            <tbody>
              <tr><td>Monosaccharide</td><td>Glucose, Fructose</td><td>1 seul ose</td></tr>
              <tr><td>Disaccharide</td><td>Saccharose, Lactose</td><td>2 oses liés (liaison osidique)</td></tr>
              <tr><td>Oligosaccharide</td><td>Maltodextrines</td><td>3 à 10 oses</td></tr>
              <tr><td>Polysaccharide</td><td>Amidon, Glycogène</td><td>&gt; 10 oses</td></tr>
            </tbody>
          </table>

          <h2>3. Les oses : aldoses & cétoses</h2>
          <p>Un ose porte une fonction <strong>carbonyle</strong>. S'il s'agit d'un aldéhyde, c'est un <strong>aldose</strong> (ex. glucose) ; s'il s'agit d'une cétone, c'est un <strong>cétose</strong> (ex. fructose).</p>
          <div class="callout note">
            <div class="co-head">${ic('bulb')} Astuce mémoire</div>
            <p>« <strong>GLU-cose = aldéhyde</strong> » (en bout de chaîne, carbone 1) ; « <strong>FRU-ctose = cétone</strong> » (sur le carbone 2). Le fructose est le plus sucré des oses naturels.</p>
          </div>

          <h3>Isomérie & carbone asymétrique</h3>
          <p>La position du <strong>OH sur l'avant-dernier carbone</strong> détermine la série <strong>D</strong> (OH à droite) ou <strong>L</strong> (OH à gauche) en projection de Fischer. <mark>La quasi-totalité des oses naturels sont de série D.</mark></p>

          <h2>4. Cyclisation & formes anomériques</h2>
          <p>En solution, le glucose se cyclise (pont hémiacétalique) en <strong>pyranose</strong> (cycle à 6) ou <strong>furanose</strong> (cycle à 5). Apparaît alors un carbone anomérique donnant les formes <strong>α</strong> et <strong>β</strong>.</p>

          <div class="callout warn">
            <div class="co-head">${ic('warn')} Erreur fréquente à l'examen</div>
            <p>Ne pas confondre <strong>épimères</strong> (diffèrent sur 1 seul carbone — ex. glucose/galactose) et <strong>anomères</strong> (diffèrent sur le carbone anomérique — α vs β).</p>
          </div>

          <h2>5. Les liaisons osidiques</h2>
          <ul>
            <li><strong>Saccharose</strong> = glucose + fructose (liaison α-1,2)</li>
            <li><strong>Lactose</strong> = galactose + glucose (liaison β-1,4)</li>
            <li><strong>Maltose</strong> = glucose + glucose (liaison α-1,4)</li>
          </ul>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:30px;padding-top:22px;border-top:1px solid var(--line);flex-wrap:wrap">
          <div class="sub" style="color:var(--muted);font-size:13.5px">Prêt à te tester sur ce chapitre ?</div>
          <button class="btn btn-primary" onclick="go('quiz')">${ic('quiz')} Passer le QCM</button>
        </div>
      </article>
    </div>`;

  return { html };
};

function toggleFiche(){
  const sheet = $('#sheet'); const btn = $('#ficheBtn');
  const on = sheet.classList.toggle('fiche-mode');
  if(on){
    sheet.style.maxWidth = '520px'; sheet.style.margin = '0 auto';
    sheet.style.fontSize = '0.94em';
    btn.innerHTML = ic('summary')+' Mode cours';
    toast('Mode fiche — format compact mobile', 'flashcard');
  } else {
    sheet.style.maxWidth = ''; sheet.style.fontSize = '';
    btn.innerHTML = ic('flashcard')+' Mode fiche';
  }
}
function shareSummary(){
  if(navigator.clipboard) navigator.clipboard.writeText('https://synapse.upc/fiche/biochem-glucides').catch(()=>{});
  toast('Lien de la fiche copié !', 'copy');
}
function downloadPDF(){
  toast('Préparation du PDF…', 'download');
  setTimeout(()=> window.print(), 600);
}
