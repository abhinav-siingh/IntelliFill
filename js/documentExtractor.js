/* Local, label-led extraction. Ambiguous values are skipped rather than guessed. */
function labelValue(lines, aliases, {max=160, multiline=true}={}) {
  const source=aliases.join("|");
  const label=new RegExp(`^\\s*(?:(?:Q(?:uestion)?\\s*)?\\d{1,3}[.)\\-:]?\\s*)?(?:${source})\\b\\s*(?:[:：=\\-]|\\s{1,2})\\s*(.*?)\\s*$`,"i");
  const alone=new RegExp(`^\\s*(?:(?:Q(?:uestion)?\\s*)?\\d{1,3}[.)\\-:]?\\s*)?(?:${source})\\b\\s*[:：=\\-]?\\s*$`,"i");
  const labelLike=/^(?:q(?:uestion)?\s*)?\d{0,3}[.)\-:]?\s*(?:first|last|full|candidate|applicant|father|mother|spouse|guardian|gender|sex|date|dob|email|e-?mail|phone|mobile|contact|address|city|district|state|country|pin|postal|zip|class|grade|school|board|college|university|degree|course|year|percentage|marks|score|skills|experience|company|employer|linkedin|github|website)\b/i;
  for(let i=0;i<lines.length;i++){
    const m=lines[i].match(label); let value=m?.[1]?.trim();
    if(!value && alone.test(lines[i]) && multiline && lines[i+1] && !labelLike.test(lines[i+1])) value=lines[i+1].trim();
    if(!value) continue;
    value=value.replace(/^(?:[:：=\-]|is\s*[:：=]?|value\s*[:：=])\s*/,"").replace(/\s+(?:\d{1,3}[.)\-:]?\s*)?(?:first|last|full|candidate|applicant|father(?:'s)?|mother(?:'s)?|date of birth|dob|gender|sex|email|mobile|phone|address|city|state|country|pin(?:code)?|postal code|zip code|10th|12th|graduation|qualification|skills)\b(?=\s*(?:[:：=]|\s{2,})).*$/i,"").replace(/\s+/g," ").replace(/[;,\s]+$/g,"").trim();
    if(!value || value.length>max || labelLike.test(value) || /^[\d\W_]+$/.test(value)) continue;
    return value;
  }
  return null;
}
function validName(value){return !!value && value.length<=80 && /^[\p{L}][\p{L}\p{M} .'-]*$/u.test(value) && !/\b(commission|department|government|application|form|staff selection|instructions|basic|details|personal|contact|information|declaration|registration|candidate|applicant|resume|curriculum vitae|education|experience|skills|address)\b/i.test(value) && value.split(/\s+/).length>=1 && value.split(/\s+/).length<=5;}
function validDate(value){
  const m=value.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
  const iso=value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const monthDate=/^(?:\d{1,2}\s+[A-Za-z]{3,9}|[A-Za-z]{3,9}\s+\d{1,2}),?\s+\d{4}$/.test(value);
  if(!m&&!iso&&monthDate){const parsed=new Date(value);if(!Number.isNaN(parsed.getTime())&&parsed<=new Date()&&parsed.getFullYear()>=1900)return `${parsed.getFullYear()}-${String(parsed.getMonth()+1).padStart(2,"0")}-${String(parsed.getDate()).padStart(2,"0")}`;}
  let y,mo,d;
  if(iso){[,y,mo,d]=iso.map(Number);} else if(m){[,d,mo,y]=m.map(Number);if(y<100)y+=y<30?2000:1900;}
  if(!y||!mo||!d)return null;
  const dt=new Date(y,mo-1,d); if(dt.getFullYear()!==y||dt.getMonth()!==mo-1||dt.getDate()!==d||y<1900||dt>Date.now())return null;
  return `${String(y).padStart(4,"0")}-${String(mo).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
}
function put(map,path,value,validate=v=>!!v){if(value&&validate(value))map[path]=value.trim();}
function resumeSection(lines, section) {
  const headings={
    contact:["contact","contact information","personal details","personal information"],
    summary:["summary","profile","professional summary","objective","career objective"],
    skills:["skills","technical skills","core skills","key skills","competencies","technologies"],
    experience:["experience","work experience","professional experience","employment history","work history","career history"],
    education:["education","educational background","academic background","academic qualifications"],
    projects:["projects","personal projects","academic projects"],
    certifications:["certifications","certificates","licenses"]
  };
  const normalize=line=>line.replace(/^[\s•*|–—-]+/,"").replace(/[:：]+$/ ,"").trim().toLowerCase();
  const isHeading=(line,group)=>headings[group].some(h=>normalize(line)===h||normalize(line).startsWith(h+" "));
  const allHeadings=Object.values(headings).flat();
  const start=lines.findIndex(line=>isHeading(line,section));
  if(start<0)return [];
  let end=lines.length;
  for(let i=start+1;i<lines.length;i++)if(allHeadings.some(h=>normalize(lines[i])===h||normalize(lines[i]).startsWith(h+" "))){end=i;break;}
  return lines.slice(start+1,end);
}
function isResumeDocument(lines, filename) {
  const file=String(filename||"").toLowerCase();
  const text=lines.join(" ").toLowerCase();
  if(/application|admit.?card|registration|marksheet|mark.?sheet|certificate|government.?form|application.?form/.test(file))return false;
  if(/application form|basic details|declaration|registration number|roll number|post applied for/.test(text))return false;
  const normalized=lines.map(line=>line.replace(/^[\s•*|–—-]+/,"").replace(/[:：]+$/ ,"").trim().toLowerCase());
  const headingGroups=[
    ["skills","technical skills","core skills","key skills","competencies"],
    ["experience","work experience","professional experience","employment history","work history"],
    ["education","educational background","academic background"],
    ["projects","personal projects"],
    ["certifications","certificates"],
    ["summary","professional summary","career objective"]
  ];
  const count=headingGroups.filter(group=>normalized.some(line=>group.some(h=>line===h||line.startsWith(h+" ")))).length;
  const clearResumeName=/resume|curriculum.?vitae|\bcv\b/i.test(file);
  const hasWorkHeading=normalized.some(line=>/^(experience|work experience|professional experience|employment history|work history)$/.test(line));
  return clearResumeName||(count>=2&&hasWorkHeading)||count>=3;
}
function validPhone(value) {
  const digits=String(value||"").replace(/\D/g,"");
  if(digits.length===10)return (/^[6-9]/.test(digits)||/[ ().-]/.test(value))&&!/[A-Za-z]/.test(value);
  if(digits.length===11&&digits.startsWith("0"))return /^[6-9]/.test(digits.slice(1));
  if(digits.length===12&&digits.startsWith("91"))return /^[6-9]/.test(digits.slice(2));
  return String(value||"").trim().startsWith("+")&&digits.length>=10&&digits.length<=15&&!/[A-Za-z]/.test(value);
}
function extractResumeFields(lines, fullText, map) {
  const sectionNames=["contact","contact information","personal details","personal information","summary","profile","professional summary","objective","career objective","skills","technical skills","core skills","key skills","competencies","technologies","experience","work experience","professional experience","employment history","work history","career history","education","educational background","academic background","academic qualifications","projects","personal projects","academic projects","certifications","certificates","licenses"];
  const cleanHeading=line=>line.replace(/^[\s•*|–—-]+/,"").replace(/[:：]+$/ ,"").trim().toLowerCase();
  const headerEnd=lines.findIndex(line=>sectionNames.some(h=>cleanHeading(line)===h||cleanHeading(line).startsWith(h+" ")));
  const header=lines.slice(0,headerEnd<0?Math.min(lines.length,10):headerEnd);
  if(!map["personal.firstName"]){
    const candidate=header.map(line=>line.split(/\s*[|•]\s*/)[0].trim()).find(line=>validName(line)&&line.trim().split(/\s+/).length>=2&&!/\b(resume|curriculum vitae|engineer|developer|designer|manager|scientist|consultant|university|college|technologies|company|limited|incorporated)\b/i.test(line)&&!/@|https?:|\d{3}/.test(line));
    if(candidate){const pieces=candidate.trim().split(/\s+/);map["personal.firstName"]=pieces.shift();if(pieces.length&&!map["personal.lastName"])map["personal.lastName"]=pieces.join(" ");}
  }
  if(!map["personal.email"]){const email=fullText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);if(email)map["personal.email"]=email[0];}
  if(!map["personal.phone"]){
    for(const line of [...header,...resumeSection(lines,"contact")]){for(const match of line.matchAll(/(?:\+\d[\d ().-]{8,}\d|\b\d[\d ().-]{8,}\d\b)/g)){if(validPhone(match[0])){map["personal.phone"]=match[0].trim();break;}}if(map["personal.phone"])break;}
  }
  for(const [kind,path] of [["linkedin","social.linkedin"],["github","social.github"],["portfolio","social.portfolio"]]){
    if(map[path])continue;
    const re=kind==="linkedin"?/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s|,]+/i:kind==="github"?/(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s|,]+/i:/https?:\/\/[^\s|,]+/i;
    const found=fullText.match(re);
    if(found){const value=found[0].replace(/[),.;]+$/g,"");map[path]=/^https?:/.test(value)?value:"https://"+value;}
  }  const skills=resumeSection(lines,"skills");
  if(skills.length&&!map["career.skills"]){const value=skills.join(", ").replace(/[•|]/g,",").replace(/\s*,\s*/g,", ").replace(/,+/g,",").trim();put(map,"career.skills",value,v=>v.length>=2&&v.length<=300);}
  if(!map["career.preferredRole"]){const title=header.find(line=>/\b(engineer|developer|designer|analyst|manager|consultant|architect|administrator|scientist|intern)\b/i.test(line)&&line.length<90);if(title)map["career.preferredRole"]=title.trim();}  const work=resumeSection(lines,"experience");
  if(work.length){
    if(!map["career.currentStatus"])map["career.currentStatus"]="Working Professional";
    const roleLine=work.find(line=>/[A-Za-z]{3}/.test(line)&&!/(19|20)\d{2}/.test(line));
    if(roleLine&&!map["career.preferredRole"]){const role=roleLine.replace(/^[\s•*|–—-]+/,"").split(/\s+(?:at|@|\||—|–|, )\s*/i)[0].trim();if(role.length>=3&&role.length<=80&&!/^(responsibilities|achievements|experience)$/i.test(role))map["career.preferredRole"]=role;}
    if(!map["career.experience"]){const tenure=fullText.match(/\b(\d+(?:\.\d+)?\s*\+?\s*years?(?:\s+of\s+experience)?)\b/i);map["career.experience"]=tenure?tenure[1].replace(/\s+/g," "):"Experience listed on resume";}
  }
  const education=resumeSection(lines,"education");
  if(education.length){
    const degreePattern=/\b(?:B\.?\s?(?:Tech|E|Sc|Com|A|BA|CA|Pharm)|M\.?\s?(?:Tech|E|Sc|Com|A|BA|CA|Pharm)|MBA|MCA|Ph\.?D\.?|Bachelor(?:'s)?(?:\s+of\s+[A-Za-z&]+){0,4}|Master(?:'s)?(?:\s+of\s+[A-Za-z&]+){0,4}|Diploma(?:\s+in\s+[A-Za-z&]+){0,3})\b/i;
    const degreeLine=education.find(line=>degreePattern.test(line));
    if(degreeLine&&!map["education.graduationDegree"]){const match=degreeLine.match(degreePattern);if(match)map["education.graduationDegree"]=match[0].trim();}
    const collegeLine=education.find(line=>/\b(college|university|institute|institution)\b/i.test(line)&&line.length<130);
    if(collegeLine&&!map["education.college"])map["education.college"]=collegeLine.replace(/^[\s•*|–—-]+/,"").trim();
    const years=education.flatMap(line=>[...line.matchAll(/\b(?:19|20)\d{2}\b/g)].map(match=>match[0]));
    if(years.length&&!map["education.graduationYear"])map["education.graduationYear"]=years[years.length-1];
    const grade=education.join(" ").match(/(?:CGPA|GPA|percentage|score|marks)\s*[:：-]?\s*(\d{1,3}(?:\.\d{1,2})?\s*%?)/i);
    if(grade&&!map["education.graduationPercentage"])map["education.graduationPercentage"]=grade[1].trim();
    if(!map["education.course"]&&degreeLine){const course=degreeLine.match(/\b(?:in|major(?:ing)?\s+in)\s+([A-Za-z][A-Za-z &.-]{2,45})/i);if(course)map["education.course"]=course[1].replace(/\s+(?:19|20)\d{2}.*$/g,"").trim();}
  }
  if(!work.length&&education.length&&!map["career.currentStatus"])map["career.currentStatus"]="Student";
}
function extractStructuredData(text, filename, documentId){
  const normalized=String(text||"").replace(/\r/g,"").replace(/[\u00a0\t]/g," ");
  const lines=normalized.split("\n").map(s=>s.trim()).filter(Boolean);
  const map={};
  const first=labelValue(lines,["first\\s+name","given\\s+name"]);
  const last=labelValue(lines,["last\\s+name","surname","family\\s+name"]);
  const full=labelValue(lines,["candidate\\s+name(?:\\s*\\([^)]*\\))?","applicant\\s+name","full\\s+name","name\\s+of\\s+(?:the\\s+)?(?:candidate|applicant)","name(?:\\s*\\([^)]*(?:candidate|applicant)[^)]*\\))?"]);
  if(first)put(map,"personal.firstName",first,validName);
  if(last)put(map,"personal.lastName",last,validName);
  if(full&&!first&&!last&&validName(full)){const parts=full.trim().split(/\s+/);map["personal.firstName"]=parts.shift();if(parts.length)map["personal.lastName"]=parts.join(" ");}
  const email=labelValue(lines,["e-?mail(?:\\s+address)?","email id"]);
  put(map,"personal.email",email,v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v));
  const phone=labelValue(lines,["mobile(?:\\s*(?:number|no\\.?))?(?:\\s*\\([^)]*\\))?","phone(?:\\s*(?:number|no\\.?))?(?:\\s*\\([^)]*\\))?","contact\\s+(?:number|no\\.?)(?:\\s*\\([^)]*\\))?","telephone(?:\\s+number)?","cell(?:\\s+number)?"]);
  put(map,"personal.phone",phone,validPhone);
  const dob=labelValue(lines,["date\\s+of\\s+birth(?:\\s*\\([^)]*\\))?","dob(?:\\s*\\([^)]*\\))?","birth\\s+date","birthdate","date\\s+of\\s+birth\\s*(?:as\\s+per\\s+records)?"]);
  put(map,"personal.dob",dob?validDate(dob):null);
  const gender=labelValue(lines,["gender","sex"]);
  put(map,"personal.gender",gender,v=>/^(male|female|other|prefer not to say)$/i.test(v));
  const father=labelValue(lines,["father(?:'s)?\\s+name","name\\s+of\\s+father"]);
  const mother=labelValue(lines,["mother(?:'s)?\\s+name","name\\s+of\\s+mother"]);
  const spouse=labelValue(lines,["husband(?:'s)?\\s+name","spouse(?:'s)?\\s+name"]);
  put(map,"personal.fatherName",father,validName); put(map,"personal.motherName",mother,validName);
  if(spouse)put(map,"personal.spouseName",spouse,validName);
  const address=labelValue(lines,["residential\\s+address","present\\s+address","permanent\\s+address","address"],{max:240});
  put(map,"address.address",address,v=>v.length>4);
  for(const [aliases,key] of [ [["city","town"],"city"],[["district"],"district"],[["state","province"],"state"],[["country"],"country"],[["pin(?:\\s*code)?","pin\\s*(?:no\\.?|number)","postal\\s*code","zip\\s*code"],"pinCode"] ]){
    const v=labelValue(lines,aliases,{max:80});
    put(map,`address.${key}`,v,key==="pinCode"?x=>/^\d{5,10}$/.test(x.replace(/\s/g,"")):x=>x.length<=80&&!/^\d+$/.test(x));
  }
  const all=lines.join("\n");
  const addEdu=(aliases,path,validate=()=>true,max=120)=>put(map,path,labelValue(lines,aliases,{max}),validate);
  addEdu(["10th\\s+(?:school|institution)(?:\\s+name)?","secondary\\s+school(?:\\s+name)?"],"education.class10.institution",v=>v.length>1);
  addEdu(["10th\\s+board","class\\s+10\\s+board","secondary\\s+board"],"education.tenthBoard");
  addEdu(["10th\\s+(?:passing\\s+)?year","class\\s+10\\s+(?:passing\\s+)?year","year\\s+of\\s+passing\\s+10th"],"education.class10.passingYear",v=>/^(19|20)\d{2}$/.test(v),8);
  addEdu(["10th\\s+(?:percentage|marks|score)","class\\s+10\\s+(?:percentage|marks|score)"],"education.class10.score",v=>/^\d{1,3}(?:\.\d{1,2})?\s*%?$/.test(v),12);
  addEdu(["12th\\s+(?:school|institution)(?:\\s+name)?","senior\\s+secondary\\s+school"],"education.class12.institution",v=>v.length>1);
  addEdu(["12th\\s+board","class\\s+12\\s+board","senior\\s+secondary\\s+board"],"education.twelfthBoard");
  addEdu(["12th\\s+(?:passing\\s+)?year","class\\s+12\\s+(?:passing\\s+)?year","year\\s+of\\s+passing\\s+12th"],"education.class12.passingYear",v=>/^(19|20)\d{2}$/.test(v),8);
  addEdu(["12th\\s+(?:percentage|marks|score)","class\\s+12\\s+(?:percentage|marks|score)"],"education.class12.score",v=>/^\d{1,3}(?:\.\d{1,2})?\s*%?$/.test(v),12);
  addEdu(["graduation\\s+degree","degree","qualification"],"education.graduationDegree",v=>v.length<=100);
  addEdu(["graduation\\s+(?:college|university)","college(?:\\s+name)?","university(?:\\s+name)?"],"education.college");
  addEdu(["course(?:\\s*/\\s*branch)?","branch","specialization"],"education.course");
  addEdu(["graduation\\s+(?:passing\\s+)?year","year\\s+of\\s+graduation"],"education.graduationYear",v=>/^(19|20)\d{2}$/.test(v),8);
  addEdu(["graduation\\s+(?:percentage|cgpa|score)"],"education.graduationPercentage",v=>/^\d{1,3}(?:\.\d{1,2})?\s*%?$/.test(v),12);
  addEdu(["master(?:'s)?\\s+degree","post\\s+graduation\\s+degree"],"education.mastersDegree");
  addEdu(["master(?:'s)?\\s+(?:college|university)","post\\s+graduation\\s+(?:college|university)"],"education.mastersCollege");
  addEdu(["master(?:'s)?\\s+(?:passing\\s+)?year","post\\s+graduation\\s+year"],"education.mastersYear",v=>/^(19|20)\d{2}$/.test(v),8);
  addEdu(["master(?:'s)?\\s+(?:percentage|cgpa|score)"],"education.mastersPercentage",v=>/^\d{1,3}(?:\.\d{1,2})?\s*%?$/.test(v),12);
  const skills=labelValue(lines,["technical\\s+skills","skills"],{max:300});
  put(map,"career.skills",skills,v=>v.length>=2&&!/^(yes|no|n\/a)$/i.test(v));
  const status=labelValue(lines,["current\\s+status","employment\\s+status"]);put(map,"career.currentStatus",status);
  put(map,"career.preferredRole",labelValue(lines,["preferred\\s+(?:job\\s+)?role","position\\s+applied\\s+for"]));
  put(map,"career.experience",labelValue(lines,["total\\s+experience","work\\s+experience","experience"]));
  put(map,"career.preferredLocation",labelValue(lines,["preferred\\s+location","job\\s+location"]));
  for(const [label,path] of [["linkedin","social.linkedin"],["github","social.github"],["portfolio","social.portfolio"]]){
    const v=labelValue(lines,[label+"(?:\\s+url|\\s+profile)?"]);if(v&&/^https?:\/\//i.test(v))map[path]=v;
  }
  if(isResumeDocument(lines,filename))extractResumeFields(lines,normalized,map);
  // Keep extraction tied to known profile fields; never invent profile data from headings or arbitrary paragraphs.
  return {documentId,source:filename,extractedAt:new Date().toISOString(),fields:map};
}

















