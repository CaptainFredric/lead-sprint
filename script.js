const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0
});

const prospectStorageKey = "leadSprintProspects";

const calculatorInputs = {
  visits: document.querySelector("#visits"),
  conversion: document.querySelector("#conversion"),
  closeRate: document.querySelector("#closeRate"),
  jobValue: document.querySelector("#jobValue")
};

const valueLabels = document.querySelectorAll("[data-value-for]");
const extraRevenue = document.querySelector("#extraRevenue");
const extraLeads = document.querySelector("#extraLeads");
const payback = document.querySelector("#payback");
const roiNarrative = document.querySelector("#roiNarrative");

function setValueLabels() {
  valueLabels.forEach((label) => {
    const target = calculatorInputs[label.dataset.valueFor];
    if (!target) {
      return;
    }

    const value = Number(target.value);
    if (target.id === "jobValue") {
      label.textContent = formatter.format(value);
      return;
    }

    if (target.id === "conversion") {
      label.textContent = `${value.toFixed(1)}%`;
      return;
    }

    if (target.id === "closeRate") {
      label.textContent = `${value}%`;
      return;
    }

    label.textContent = numberFormatter.format(value);
  });
}

function calculateRoi() {
  const visits = Number(calculatorInputs.visits.value);
  const currentConversion = Number(calculatorInputs.conversion.value) / 100;
  const closeRate = Number(calculatorInputs.closeRate.value) / 100;
  const jobValue = Number(calculatorInputs.jobValue.value);
  const sprintPrice = 750;
  const improvedConversion = Math.min(currentConversion + 0.025, 0.16);

  const currentInquiries = visits * currentConversion;
  const improvedInquiries = visits * improvedConversion;
  const addedInquiries = Math.max(improvedInquiries - currentInquiries, 0);
  const addedBookedJobs = addedInquiries * closeRate;
  const addedRevenue = addedBookedJobs * jobValue;
  const paybackMonths = addedRevenue > 0 ? sprintPrice / addedRevenue : 0;

  extraRevenue.textContent = formatter.format(addedRevenue);
  extraLeads.textContent = numberFormatter.format(addedInquiries);
  if (addedRevenue <= 0) {
    payback.textContent = "needs traffic";
  } else if (paybackMonths < 0.1) {
    payback.textContent = "under 1 week";
  } else {
    payback.textContent = `${paybackMonths.toFixed(1)} months`;
  }

  roiNarrative.textContent =
    addedRevenue >= sprintPrice
      ? "In this scenario, one month of extra booked work could cover the pilot."
      : "This still may work, but the sales case should focus on trust, tracking, and follow-up before revenue lift.";
}

Object.values(calculatorInputs).forEach((input) => {
  input.addEventListener("input", () => {
    setValueLabels();
    calculateRoi();
  });
});

setValueLabels();
calculateRoi();

const intakeForm = document.querySelector("#intakeForm");
const formNote = document.querySelector("#formNote");

intakeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const businessName = document.querySelector("#businessName").value.trim();
  const websiteUrl = document.querySelector("#websiteUrl").value.trim();
  const mainService = document.querySelector("#mainService").value.trim();
  const observedIssue = document.querySelector("#observedIssue").value;

  const subject = `Quick idea for ${businessName || "your website"}`;
  const body = [
    `Hi ${businessName || "there"},`,
    "",
    `I was reviewing ${websiteUrl || "your website"} and noticed the ${observedIssue}.`,
    "",
    mainService
      ? `For a service like ${mainService}, that can quietly cost you qualified inquiries.`
      : "That can quietly cost you qualified inquiries.",
    "",
    "I run a focused 72-hour Lead Sprint: mobile refresh, clearer offer, quote form, analytics events, and a short handoff report.",
    "",
    "The pilot is $750. If the form, mobile page, and analytics events are not verified by the end of day three, the fee pauses until those items are complete.",
    "",
    "Would it be worth a 15-minute look this week?",
    "",
    "Best,"
  ].join("\n");

  const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
  formNote.textContent = "Email draft opened. Personalize the first two lines before sending.";
});

const auditForm = document.querySelector("#auditForm");
const auditScore = document.querySelector("#auditScore");
const auditAngle = document.querySelector("#auditAngle");
const auditLine = document.querySelector("#auditLine");
const auditNext = document.querySelector("#auditNext");
const auditNote = document.querySelector("#auditNote");
const copyAuditEmail = document.querySelector("#copyAuditEmail");
const saveProspect = document.querySelector("#saveProspect");
const exportProspects = document.querySelector("#exportProspects");
const prospectRows = document.querySelector("#prospectRows");

let latestAudit = null;

function getCheckedLeaks() {
  return [...document.querySelectorAll("input[name='leadLeak']:checked")].map((input) => ({
    label: input.value,
    weight: Number(input.dataset.weight)
  }));
}

function buildAudit() {
  const business = document.querySelector("#auditBusiness").value.trim();
  const website = document.querySelector("#auditWebsite").value.trim();
  const niche = document.querySelector("#auditNiche").value;
  const jobValue = Number(document.querySelector("#auditValue").value) || 0;
  const leaks = getCheckedLeaks();
  const leakScore = leaks.reduce((total, leak) => total + leak.weight, 0);
  const valueScore = jobValue >= 1000 ? 18 : jobValue >= 500 ? 12 : 6;
  const score = Math.min(100, 18 + leakScore + valueScore);
  const primaryLeak = leaks[0]?.label || "Website lead path is unclear";

  let angle = "Mobile quote path cleanup";
  if (primaryLeak.includes("tracking")) {
    angle = "Call and form tracking setup";
  } else if (primaryLeak.includes("Reviews")) {
    angle = "Trust and review placement";
  } else if (primaryLeak.includes("form")) {
    angle = "Lead form friction cleanup";
  } else if (primaryLeak.includes("Mobile")) {
    angle = "Mobile layout conversion cleanup";
  }

  const firstLine = `I noticed ${website || "your website"} has an issue worth fixing: ${primaryLeak.toLowerCase()}.`;
  const nextAction =
    score >= 75
      ? "High-priority prospect: send a teardown email today and ask for a 15-minute review."
      : score >= 55
        ? "Good prospect: send the email after adding one more specific observation."
        : "Lower urgency: save for later or wait until you find a stronger conversion problem.";

  return {
    id: Date.now(),
    business: business || "Unnamed business",
    website,
    niche,
    jobValue,
    leaks: leaks.map((leak) => leak.label),
    score,
    angle,
    firstLine,
    nextAction,
    status: score >= 75 ? "Contact today" : score >= 55 ? "Warm prospect" : "Later"
  };
}

function renderAudit(audit) {
  auditScore.textContent = audit.score;
  auditAngle.textContent = audit.angle;
  auditLine.textContent = audit.firstLine;
  auditNext.textContent = audit.nextAction;
}

function makeAuditEmail(audit) {
  const proofLine = audit.jobValue
    ? `For ${audit.niche}, even one booked job around ${formatter.format(audit.jobValue)} can make a focused website cleanup worth testing.`
    : `For ${audit.niche}, even one extra booked job can make a focused website cleanup worth testing.`;

  return [
    `Subject: Quick idea for ${audit.business}`,
    "",
    `Hi ${audit.business},`,
    "",
    audit.firstLine,
    "",
    proofLine,
    "",
    "I run a 72-hour Lead Sprint: mobile refresh, clearer offer, quote form, analytics events, and a short handoff report.",
    "",
    "The pilot is $750. If the form, mobile page, and analytics events are not verified by the end of day three, the fee pauses until those items are complete.",
    "",
    "Would it be worth a 15-minute look this week?",
    "",
    "Best,"
  ].join("\n");
}

function getSavedProspects() {
  try {
    return JSON.parse(localStorage.getItem(prospectStorageKey)) || [];
  } catch {
    return [];
  }
}

function setSavedProspects(prospects) {
  localStorage.setItem(prospectStorageKey, JSON.stringify(prospects));
}

function renderProspects() {
  const prospects = getSavedProspects();
  if (prospects.length === 0) {
    prospectRows.innerHTML = '<tr><td colspan="5">No saved prospects yet.</td></tr>';
    return;
  }

  prospectRows.innerHTML = prospects
    .map(
      (prospect) => `
        <tr>
          <td>
            <strong>${escapeHtml(prospect.business)}</strong><br>
            <span>${escapeHtml(prospect.website || "No URL saved")}</span>
          </td>
          <td>${escapeHtml(prospect.niche)}</td>
          <td>${prospect.score}</td>
          <td>${escapeHtml(prospect.angle)}</td>
          <td>${escapeHtml(prospect.status)}</td>
        </tr>
      `
    )
    .join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return entities[character];
  });
}

auditForm.addEventListener("submit", (event) => {
  event.preventDefault();
  latestAudit = buildAudit();
  renderAudit(latestAudit);
  auditNote.textContent = "Prospect scored. Copy the email or save the lead to your local pipeline.";
});

copyAuditEmail.addEventListener("click", async () => {
  latestAudit = latestAudit || buildAudit();
  renderAudit(latestAudit);
  const email = makeAuditEmail(latestAudit);

  try {
    await navigator.clipboard.writeText(email);
    auditNote.textContent = "Outreach email copied.";
  } catch {
    auditNote.textContent = "Clipboard was unavailable. Use the Start section to open a mail draft.";
  }
});

saveProspect.addEventListener("click", () => {
  latestAudit = latestAudit || buildAudit();
  renderAudit(latestAudit);
  const prospects = getSavedProspects();
  setSavedProspects([latestAudit, ...prospects].slice(0, 50));
  renderProspects();
  auditNote.textContent = "Lead saved locally in this browser.";
});

exportProspects.addEventListener("click", () => {
  const prospects = getSavedProspects();
  if (prospects.length === 0) {
    auditNote.textContent = "Save at least one prospect before exporting.";
    return;
  }

  const header = ["Business", "Website", "Niche", "Job Value", "Score", "Angle", "Status", "Lead Leaks"];
  const rows = prospects.map((prospect) => [
    prospect.business,
    prospect.website,
    prospect.niche,
    prospect.jobValue,
    prospect.score,
    prospect.angle,
    prospect.status,
    prospect.leaks.join("; ")
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "lead-sprint-prospects.csv";
  link.click();
  URL.revokeObjectURL(url);
  auditNote.textContent = "CSV exported.";
});

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

latestAudit = buildAudit();
renderAudit(latestAudit);
renderProspects();
