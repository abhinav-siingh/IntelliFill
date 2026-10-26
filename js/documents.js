const DOCUMENTS_API = `${BACKEND_URL}/api/documents/extracted`;

function renderDocuments() {
  const box = document.getElementById("formContainer");
  if (!box) return;
  box.innerHTML = `<div class="documents-panel">
    <div class="upload-intro"><div><h2>Add your documents</h2><p>Upload up to five files at a time. IntelliFill extracts profile details locally before saving structured fields to your account.</p></div><span class="format-pill">PDF · DOCX · TXT · Images</span></div>
    <div class="document-slots">${Array.from({length:5},(_,i)=>`<label class="document-slot" data-slot="${i}"><span class="slot-number">0${i+1}</span><span class="slot-copy"><strong>Document ${i+1}</strong><small class="document-name">Drop a file here or browse</small></span><span class="browse-label">Browse</span><input type="file" class="document-file" accept=".pdf,.docx,.txt,image/*" aria-label="Choose document ${i+1}"></label>`).join("")}</div>
    <div class="upload-actions"><button id="processDocuments" class="primaryBtn">Process selected documents <span aria-hidden="true">→</span></button><span class="upload-limit">Maximum 5 files · 15 MB each</span></div>
    <div id="documentStatus" role="status" aria-live="polite">Choose up to five files to begin.</div>
    <section class="saved-section"><div class="saved-heading"><div><h3>Your saved documents</h3><p>Original files are stored on this device.</p></div><span class="saved-count" id="savedCount">0</span></div><div id="savedDocuments"></div></section>
  </div>`;
  document.querySelectorAll(".document-file").forEach(input => {
    const slot=input.closest(".document-slot");
    const sync=()=>{ const file=input.files[0]; slot.classList.toggle("has-file",!!file); slot.querySelector(".document-name").textContent=file?`${file.name} · ${(file.size/1024/1024).toFixed(2)} MB`:"Drop a file here or browse"; };
    input.addEventListener("change",sync);
    slot.addEventListener("dragover",event=>{event.preventDefault();slot.classList.add("dragging");});
    slot.addEventListener("dragleave",()=>slot.classList.remove("dragging"));
    slot.addEventListener("drop",event=>{event.preventDefault();slot.classList.remove("dragging");if(event.dataTransfer.files.length){input.files=event.dataTransfer.files;sync();}});
  });
  document.getElementById("processDocuments").addEventListener("click", processSelectedDocuments);
  refreshDocumentsList();
}

async function refreshDocumentsList() {
  const list = document.getElementById("savedDocuments"); if (!list) return;
  try {
    const docs = await loadDocuments();
    const count=document.getElementById("savedCount"); if(count) count.textContent=String(docs.length);
    list.innerHTML = docs.length ? docs.sort((a,b)=>new Date(b.uploadedAt)-new Date(a.uploadedAt)).map(d => `<article class="saved-document"><span class="saved-file-icon">${escapeDocumentHtml((d.name.split('.').pop()||'FILE').slice(0,4).toUpperCase())}</span><span class="saved-file-info"><strong>${escapeDocumentHtml(d.name)}</strong><small>${(d.size/1024/1024).toFixed(2)} MB · ${escapeDocumentHtml(new Date(d.uploadedAt).toLocaleDateString())}</small></span><span class="saved-status ${d.status==='Saved'?'is-saved':'is-error'}">${escapeDocumentHtml(d.status || "Saved")}</span><button data-reprocess-document="${escapeDocumentHtml(d.id)}" aria-label="Reprocess ${escapeDocumentHtml(d.name)}">Reprocess</button><button data-delete-document="${escapeDocumentHtml(d.id)}" aria-label="Delete ${escapeDocumentHtml(d.name)}">Delete</button>${d.result ? `<details><summary>View extracted fields</summary><pre>${escapeDocumentHtml(JSON.stringify(d.result.fields, null, 2))}</pre></details>` : ""}</article>`).join("") : `<p class="empty-documents">No documents yet. Your uploaded files will appear here.</p>`;
    list.querySelectorAll("[data-reprocess-document]").forEach(btn => btn.addEventListener("click", async () => {
      const saved=docs.find(item=>item.id===btn.dataset.reprocessDocument);
      if(!saved?.blob){const status=document.getElementById("documentStatus");if(status)status.textContent="The original file is unavailable. Please select it again to reprocess.";return;}
      btn.disabled=true;const file=saved.blob.name?saved.blob:new File([saved.blob],saved.name,{type:saved.type||"application/pdf"});
      await processOneDocument(file,saved);btn.disabled=false;
    }));    list.querySelectorAll("[data-delete-document]").forEach(btn => btn.addEventListener("click", async () => {
      await deleteDocument(btn.dataset.deleteDocument); await refreshDocumentsList();
    }));
  } catch (_) { list.textContent = "Could not load saved documents."; }
}

function reviewExtractedFields(result) {
  const status=document.getElementById("documentStatus");
  return new Promise(resolve=>{
    const entries=Object.entries(result.fields);
    status.innerHTML="";
    const panel=document.createElement("div"); panel.className="extraction-review";
    const heading=document.createElement("strong"); heading.textContent=`Review ${entries.length} extracted profile fields`;
    const note=document.createElement("p"); note.textContent="Edit any value before applying it. Only the reviewed values will be saved to your profile.";
    const list=document.createElement("dl");
    for(const [path,value] of entries){const term=document.createElement("dt");term.textContent=path.replaceAll("."," › ");const desc=document.createElement("dd");const input=document.createElement("input");input.type="text";input.value=value;input.dataset.extractedPath=path;input.setAttribute("aria-label",`Edit ${path.replaceAll("."," ")}`);desc.append(input);list.append(term,desc);}
    const actions=document.createElement("div"); actions.className="review-actions";
    const apply=document.createElement("button");apply.type="button";apply.className="review-apply";apply.textContent="Apply reviewed fields";
    const skip=document.createElement("button");skip.type="button";skip.className="review-skip";skip.textContent="Skip document";
    apply.addEventListener("click",()=>{for(const input of list.querySelectorAll("[data-extracted-path]")){const path=input.dataset.extractedPath;const value=input.value.trim();if(value)result.fields[path]=value;else delete result.fields[path];}resolve(Object.keys(result.fields).length>0);},{once:true});skip.addEventListener("click",()=>resolve(false),{once:true});
    actions.append(apply,skip);panel.append(heading,note,list,actions);status.append(panel);
  });
}
function escapeDocumentHtml(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

function getProfileValueForExtractedPath(path, profile) {
  const simple={"career.skills":["professional","skills"],"career.currentStatus":["professional","currentStatus"],"career.preferredRole":["professional","preferredRole"],"career.experience":["professional","experience"],"career.preferredLocation":["professional","preferredLocation"]};
  const education={"education.tenthBoard":"tenthBoard","education.twelfthBoard":"twelfthBoard","education.graduationDegree":"graduationDegree","education.college":"college","education.course":"course","education.graduationYear":"graduationYear","education.graduationPercentage":"graduationPercentage","education.mastersDegree":"mastersDegree","education.mastersCollege":"mastersCollege","education.mastersYear":"mastersYear","education.mastersPercentage":"mastersPercentage"};
  if(simple[path])return profile?.[simple[path][0]]?.[simple[path][1]];
  if(education[path])return profile?.education?.[education[path]];
  const match=path.match(/^(personal|address|social)\.(.+)$/);
  if(match)return profile?.[match[1]]?.[match[2]];
  const grade=path.match(/^education\.(class10|class12)\.(institution|passingYear|score)$/);
  if(grade){const suffix=grade[1]==="class10"?"tenth":"twelfth";const key={institution:`${suffix}School`,passingYear:`${suffix}PassingYear`,score:`${suffix}Percentage`}[grade[2]];return profile?.education?.[key];}
  return undefined;
}
function applyExtractedFieldsToLocalProfile(fields, targetProfile) {
  const pathMap={
    "personal.firstName":["personal","firstName"],"personal.lastName":["personal","lastName"],"personal.email":["personal","email"],"personal.phone":["personal","phone"],"personal.dob":["personal","dob"],"personal.gender":["personal","gender"],"personal.fatherName":["personal","fatherName"],"personal.motherName":["personal","motherName"],
    "address.address":["address","address"],"address.city":["address","city"],"address.state":["address","state"],"address.country":["address","country"],"address.pinCode":["address","pinCode"],
    "career.skills":["professional","skills"],"career.currentStatus":["professional","currentStatus"],"career.preferredRole":["professional","preferredRole"],"career.experience":["professional","experience"],"career.preferredLocation":["professional","preferredLocation"],
    "social.linkedin":["social","linkedin"],"social.github":["social","github"],"social.portfolio":["social","portfolio"]
  };
  const educationMap={"education.tenthBoard":"tenthBoard","education.twelfthBoard":"twelfthBoard","education.graduationDegree":"graduationDegree","education.college":"college","education.course":"course","education.graduationYear":"graduationYear","education.graduationPercentage":"graduationPercentage","education.mastersDegree":"mastersDegree","education.mastersCollege":"mastersCollege","education.mastersYear":"mastersYear","education.mastersPercentage":"mastersPercentage"};
  for(const section of ["personal","address","education","professional","social"]) targetProfile[section] ||= {};
  for(const [path,value] of Object.entries(fields)){
    if(value===undefined||value===null)continue;
    if(pathMap[path]){const [section,key]=pathMap[path];targetProfile[section][key]=value;}
    if(educationMap[path])targetProfile.education[educationMap[path]]=value;
    const m=path.match(/^education\.(class10|class12)\.(institution|passingYear|score)$/);
    if(m){const suffix=m[1]==="class10"?"tenth":"twelfth";const key={institution:`${suffix}School`,passingYear:`${suffix}PassingYear`,score:`${suffix}Percentage`}[m[2]];targetProfile.education[key]=value;}
  }
}
async function sendStructuredDocument(result) {
  const session = await loadAuthSession();
  if (!session?.token) throw new Error("Sign in from the IntelliFill popup before processing documents.");
  const response = await fetch(DOCUMENTS_API, { method:"POST", headers:{"Content-Type":"application/json", "Authorization":`Bearer ${session.token}`}, body:JSON.stringify({documentId:result.documentId, sourceName:result.source, fields:result.fields, extractedAt:result.extractedAt}) });
  const body = await response.json().catch(()=>({}));
  if (!response.ok || body.success === false) throw new Error(body.message || `Backend save failed (${response.status}).`);
}

async function processOneDocument(file, record) {
  const status=document.getElementById("documentStatus");
  let stage="starting document processing";
  try {
    stage="saving the original document locally";
    record.status="Processing";await saveDocument(record);
    stage="reading the document on this device";
    status.textContent=`Reading ${file.name} on this device…`;
    const parsed=await extractDocumentText(file);
    if(!parsed.text)throw new Error("No readable text was found. Check the scan quality and try again.");
    stage="extracting profile fields";
    const result=extractStructuredData(parsed.text,file.name,record.id);
    stage="loading your profile";
    let targetProfile;
    if(typeof profileData!=="undefined")targetProfile=profileData;
    else targetProfile=await loadProfile()||{personal:{},address:{},education:{},professional:{},social:{}};
    // During reprocessing, clear old parser mistakes only when the profile still exactly matches that document's old value.
    const previousFields={...(record.result?.fields||{}),...(record.staleValues||{})};
    record.staleValues||={};
    for(const [path,oldValue] of Object.entries(previousFields)){
      if(!(path in result.fields)&&oldValue&&getProfileValueForExtractedPath(path,targetProfile)===oldValue){result.fields[path]="";record.staleValues[path]=oldValue;}
      else if(getProfileValueForExtractedPath(path,targetProfile)!==oldValue)delete record.staleValues[path];
    }
    if(!Object.keys(result.fields).length)throw new Error("No reliable profile fields were found. Check the document or enter the values manually.");
    stage="waiting for extracted-field review";
    if(!await reviewExtractedFields(result)){record.status="Skipped after review";record.result=result;await saveDocument(record);await refreshDocumentsList();return "skipped";}
    stage="saving reviewed fields to your IntelliFill account";
    await sendStructuredDocument(result);
    stage="updating the local profile";
    record.status="Saved";record.result=result;record.staleValues={};await saveDocument(record);
    const cached=await chrome.storage.local.get("intellifill_extracted_documents");
    const records=cached.intellifill_extracted_documents||[];
    const oldIndex=records.findIndex(item=>item.documentId===record.id);
    const cachedResult={documentId:record.id,fields:result.fields};
    if(oldIndex>=0)records[oldIndex]=cachedResult;else records.push(cachedResult);
    await chrome.storage.local.set({intellifill_extracted_documents:records.slice(-100)});
    applyExtractedFieldsToLocalProfile(result.fields,targetProfile);
    if(typeof autoSave==="function")await autoSave();else await saveProfile(targetProfile);
    status.textContent=`Applied ${Object.keys(result.fields).length} reviewed fields from ${file.name}.`;
    await refreshDocumentsList();
    return "saved";
  } catch(error) {
    const detail=readableDocumentError(error);
    console.error(`[IntelliFill] Document failed while ${stage}:`,error);
    record.status=`Failed while ${stage}: ${detail}`;
    if(status)status.textContent=record.status;
    try { await saveDocument(record); } catch(saveError) { console.error("Could not save document failure details:",saveError); }
    try { await refreshDocumentsList(); } catch(refreshError) { console.error("Could not refresh saved documents:",refreshError); }
    return "failed";
  }
}

function readableDocumentError(error) {
  if(typeof error==="string"&&error.trim())return error.trim().slice(0,240);
  if(error&&typeof error.message==="string"&&error.message.trim())return error.message.trim().slice(0,240);
  if(error&&typeof error.name==="string"&&error.name)return `${error.name} (no further details were provided)`.slice(0,240);
  try { const details=JSON.stringify(error); if(details&&details!=="{}")return details.slice(0,240); } catch(_) {}
  return "Unexpected error without details. Open the page developer console for the logged cause.";
}

async function processSelectedDocuments() {
  const files=[...document.querySelectorAll(".document-file")].flatMap(input=>[...input.files]);
  const status=document.getElementById("documentStatus");
  if(!files.length){status.textContent="Choose one or more files first.";return;}
  if(files.length>5){status.textContent="You can process at most five documents at a time.";return;}
  const button=document.getElementById("processDocuments");button.disabled=true;
  let saved=0,failed=0,skipped=0;
  for(const file of files){
    const record={id:crypto.randomUUID(),name:file.name,type:file.type||file.name.split(".").pop(),size:file.size,uploadedAt:new Date().toISOString(),status:"Processing",blob:file};
    await saveDocument(record);
    const result=await processOneDocument(file,record);
    if(result==="saved")saved++;else if(result==="failed")failed++;else skipped++;
  }
  status.textContent=`Applied ${saved} document${saved===1?"":"s"}; ${skipped} skipped; ${failed} failed.`;
  button.disabled=false;document.querySelectorAll(".document-file").forEach(input=>input.value="");
}
if (document.body.dataset.page === "documents") renderDocuments();








