const fs = require('fs');
let content = fs.readFileSync('apps/sierra-estates-realty/app/admin/AdminPortal.tsx', 'utf8');

// 1. Leads Page Patch
const leadsStart = content.indexOf('function LeadsPage({ T }) {');
const leadsEnd = content.indexOf('const filtered=useMemo(()=>LEADS_DATA.filter', leadsStart);

if (leadsStart > -1 && leadsEnd > -1) {
  const originalLeadsLogic = content.slice(leadsStart, leadsEnd);
  const newLeadsLogic = `function LeadsPage({ T }) {
  const [q,setQ]=useState('');
  const [importModal,setImportModal]=useState(false);
  const [apiLeads, setApiLeads] = useState([]);
  useEffect(() => {
    fetch('/api/admin/leads').then(r=>r.json()).then(d => {
      if (d.success) setApiLeads(d.leads || []);
    }).catch(console.error);
  }, []);
  
  const currentLeads = apiLeads.length > 0 ? apiLeads : LEADS_DATA;
  `;
  content = content.replace(originalLeadsLogic, newLeadsLogic);
  content = content.replace(/LEADS_DATA\.filter/g, 'currentLeads.filter');
}

// 2. Curator Page Patch (Listings + Property Finder Ads)
const curatorStart = content.indexOf('function CuratorPage({ T }) {');
const listingsDeclStart = content.indexOf('const listings = [', curatorStart);
const listingsDeclEnd = content.indexOf('];', listingsDeclStart) + 2;

if (curatorStart > -1 && listingsDeclStart > -1) {
  const originalListingsLogic = content.slice(curatorStart, listingsDeclEnd);
  const newListingsLogic = `function CuratorPage({ T }) {
  const [selectedCpd, setSelectedCpd] = useState('Mivida');
  const [priceAdj, setPriceAdj] = useState(0);
  const cpds = Object.entries(COMPOUNDS_DATA);
  const selected = COMPOUNDS_DATA[selectedCpd];
  const [apiListings, setApiListings] = useState([]);

  useEffect(() => {
    fetch('/api/admin/listings').then(r=>r.json()).then(d => {
      if (d.success) setApiListings(d.listings || []);
    }).catch(console.error);
  }, []);

  const generateAd = (id) => {
    alert('Generating Property Finder Ad for listing ' + id + ' using The Curator AI...');
  };

  const listings = apiListings.length > 0 ? apiListings : [
    {code:'SE-MVD-APT-0041',type:'Apartment',area:95,beds:3,basePrice:5800000,quality:88,status:'parsed'},
    {code:'SE-MVD-VLA-0039',type:'Villa',area:320,beds:5,basePrice:22000000,quality:96,status:'indexed'},
    {code:'SE-MVD-TWH-0038',type:'Twin House',area:240,beds:4,basePrice:14500000,quality:79,status:'processing'},
    {code:'SE-MVD-DPX-0037',type:'Duplex',area:210,beds:3,basePrice:11200000,quality:85,status:'parsed'},
  ];`;
  content = content.replace(originalListingsLogic, newListingsLogic);
}

// 3. Add Property Finder Button to Curator Table
const tableHeaderStr = `<th>{T('status')}</th></tr></thead>`;
if (content.includes(tableHeaderStr)) {
  content = content.replace(tableHeaderStr, `<th>{T('status')}</th><th>Actions</th></tr></thead>`);
}

const tableBodyStr = `<td><span className={\`chip \${l.status==='indexed'?'chip-green':l.status==='parsed'?'chip-blue':'chip-amber'}\`}>{l.status}</span></td>
                </tr>`;
if (content.includes(tableBodyStr)) {
  content = content.replace(tableBodyStr, `<td><span className={\`chip \${l.status==='indexed'?'chip-green':l.status==='parsed'?'chip-blue':'chip-amber'}\`}>{l.status}</span></td>
                  <td><button className="btn btn-gold" style={{padding:'4px 8px',fontSize:10}} onClick={() => generateAd(l.code)}>📢 Make PF Ad</button></td>
                </tr>`);
}

// 4. Workflows Patch
const wfStart = content.indexOf('function WorkflowsPage({ T }) {');
if (wfStart > -1) {
  content = content.replace(
    'const [wfs,setWfs]=useState(WORKFLOWS.map(w=>({...w})));',
    `const [wfs,setWfs]=useState(WORKFLOWS.map(w=>({...w})));
  useEffect(() => {
    fetch('/api/admin/workflows').then(r=>r.json()).then(d => {
      if (d.success && d.workflows?.length > 0) {
        setWfs(d.workflows.map(w => ({ name: w.name, nameAr: w.nameAr, desc: w.desc, status: w.status, runs: w.runs, last: w.last })));
      }
    });
  }, []);`
  );
}

fs.writeFileSync('apps/sierra-estates-realty/app/admin/AdminPortal.tsx', content, 'utf8');
console.log('AdminPortal patched successfully.');
