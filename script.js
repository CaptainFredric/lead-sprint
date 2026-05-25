const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0
});

const prospectStorageKey = "leadSprintProspects";
const sellerStorageKey = "leadSprintSeller";
const handoffStorageKey = "leadSprintHandoff";

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
  const seller = getSellerSettings();
  const bookingLine = seller.bookingUrl
    ? `If useful, grab a teardown slot here: ${seller.bookingUrl}`
    : "Would it be worth a 15-minute look this week?";

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
    bookingLine,
    "",
    "Best,",
    seller.sellerName || ""
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
const copyProposal = document.querySelector("#copyProposal");
const saveProspect = document.querySelector("#saveProspect");
const exportProspects = document.querySelector("#exportProspects");
const copyFollowUp = document.querySelector("#copyFollowUp");
const campaignNiche = document.querySelector("#campaignNiche");
const campaignOffer = document.querySelector("#campaignOffer");
const campaignValue = document.querySelector("#campaignValue");
const campaignBuyer = document.querySelector("#campaignBuyer");
const campaignAngle = document.querySelector("#campaignAngle");
const campaignLeaks = document.querySelector("#campaignLeaks");
const campaignObjection = document.querySelector("#campaignObjection");
const applyCampaign = document.querySelector("#applyCampaign");
const copyCampaign = document.querySelector("#copyCampaign");
const campaignNote = document.querySelector("#campaignNote");
const prospectRows = document.querySelector("#prospectRows");
const proposalText = document.querySelector("#proposalText");
const proposalMeta = document.querySelector("#proposalMeta");
const printProposal = document.querySelector("#printProposal");
const plannerInputs = {
  revenueTarget: document.querySelector("#revenueTarget"),
  averageDeal: document.querySelector("#averageDeal"),
  replyRate: document.querySelector("#replyRate"),
  callRate: document.querySelector("#callRate"),
  closeRatePlanner: document.querySelector("#closeRatePlanner"),
  workdays: document.querySelector("#workdays")
};
const plannerValueLabels = document.querySelectorAll("[data-planner-value-for]");
const pilotsNeeded = document.querySelector("#pilotsNeeded");
const weeklyEmails = document.querySelector("#weeklyEmails");
const dailyProspects = document.querySelector("#dailyProspects");
const copyDailyPlan = document.querySelector("#copyDailyPlan");
const plannerNote = document.querySelector("#plannerNote");
const careInputs = {
  careSprintClients: document.querySelector("#careSprintClients"),
  careConversionRate: document.querySelector("#careConversionRate"),
  careFee: document.querySelector("#careFee"),
  careHours: document.querySelector("#careHours"),
  careMonths: document.querySelector("#careMonths")
};
const careValueLabels = document.querySelectorAll("[data-care-value-for]");
const careClients = document.querySelector("#careClients");
const careMrr = document.querySelector("#careMrr");
const careArr = document.querySelector("#careArr");
const careLoad = document.querySelector("#careLoad");
const copyCarePitch = document.querySelector("#copyCarePitch");
const careNote = document.querySelector("#careNote");
const carePitch = document.querySelector("#carePitch");
const monthlyReportForm = document.querySelector("#monthlyReportForm");
const monthlyInputs = {
  client: document.querySelector("#monthlyClient"),
  period: document.querySelector("#monthlyPeriod"),
  forms: document.querySelector("#monthlyForms"),
  calls: document.querySelector("#monthlyCalls"),
  status: document.querySelector("#monthlyStatus"),
  update: document.querySelector("#monthlyUpdate"),
  observation: document.querySelector("#monthlyObservation"),
  next: document.querySelector("#monthlyNext")
};
const monthlyScore = document.querySelector("#monthlyScore");
const monthlyStatusLine = document.querySelector("#monthlyStatusLine");
const monthlyProof = document.querySelector("#monthlyProof");
const monthlyRenewalCue = document.querySelector("#monthlyRenewalCue");
const copyMonthlyReport = document.querySelector("#copyMonthlyReport");
const monthlyReport = document.querySelector("#monthlyReport");
const monthlyNote = document.querySelector("#monthlyNote");
const proofLoopForm = document.querySelector("#proofLoopForm");
const proofInputs = {
  client: document.querySelector("#proofClient"),
  referralTarget: document.querySelector("#proofReferralTarget"),
  permission: document.querySelector("#proofPermission"),
  channel: document.querySelector("#proofChannel"),
  win: document.querySelector("#proofWin"),
  metric: document.querySelector("#proofMetric"),
  quote: document.querySelector("#proofQuote")
};
const proofScore = document.querySelector("#proofScore");
const proofStatus = document.querySelector("#proofStatus");
const proofAsk = document.querySelector("#proofAsk");
const proofUse = document.querySelector("#proofUse");
const copyProofKit = document.querySelector("#copyProofKit");
const proofKit = document.querySelector("#proofKit");
const proofNote = document.querySelector("#proofNote");
const sellerForm = document.querySelector("#sellerForm");
const sellerName = document.querySelector("#sellerName");
const sellerEmail = document.querySelector("#sellerEmail");
const bookingUrl = document.querySelector("#bookingUrl");
const depositUrl = document.querySelector("#depositUrl");
const serviceArea = document.querySelector("#serviceArea");
const sellerNote = document.querySelector("#sellerNote");
const sellerPreview = document.querySelector("#sellerPreview");
const sellerPreviewDetail = document.querySelector("#sellerPreviewDetail");
const resetSeller = document.querySelector("#resetSeller");
const openBooking = document.querySelector("#openBooking");
const openDeposit = document.querySelector("#openDeposit");
const copyKickoff = document.querySelector("#copyKickoff");
const footerIdentity = document.querySelector("#footerIdentity");
const handoffForm = document.querySelector("#handoffForm");
const handoffInputs = {
  client: document.querySelector("#handoffClient"),
  liveUrl: document.querySelector("#handoffUrl"),
  service: document.querySelector("#handoffService"),
  leadDestination: document.querySelector("#leadDestination")
};
const handoffChecks = [...document.querySelectorAll("input[name='handoffCheck']")];
const handoffProgress = document.querySelector("#handoffProgress");
const handoffProgressBar = document.querySelector("#handoffProgressBar");
const handoffStatus = document.querySelector("#handoffStatus");
const handoffMissing = document.querySelector("#handoffMissing");
const handoffSummary = document.querySelector("#handoffSummary");
const handoffActions = document.querySelector("#handoffActions");
const handoffReport = document.querySelector("#handoffReport");
const saveHandoff = document.querySelector("#saveHandoff");
const resetHandoff = document.querySelector("#resetHandoff");
const copyHandoff = document.querySelector("#copyHandoff");
const handoffNote = document.querySelector("#handoffNote");

let latestAudit = null;

const defaultSeller = {
  sellerName: "",
  sellerEmail: "",
  bookingUrl: "",
  depositUrl: "",
  serviceArea: ""
};

const campaignData = {
  homeServices: {
    label: "Home services",
    offer: "$750 pilot",
    value: "$850+",
    buyer: "Owner/operator",
    auditNiche: "home services",
    auditValue: 850,
    angle: "Make emergency quote and call paths easier to find from mobile.",
    leaks: [
      "No clear call or quote action above the fold",
      "Mobile layout feels hard to scan",
      "No obvious call or form tracking"
    ],
    objection: "They may already get referrals. Position the sprint as capturing the ready buyers who check the site before calling."
  },
  wellness: {
    label: "Health and wellness",
    offer: "$1,500 growth sprint",
    value: "$600+",
    buyer: "Practice owner",
    auditNiche: "health and wellness",
    auditValue: 650,
    angle: "Turn trust, reviews, and appointment intent into a clearer booking path.",
    leaks: [
      "Reviews or proof are missing near the offer",
      "Quote form is buried or asks too much",
      "Mobile layout feels hard to scan"
    ],
    objection: "They may worry about sounding salesy. Frame the work as trust, clarity, and appointment flow."
  },
  legal: {
    label: "Legal practices",
    offer: "$1,500 growth sprint",
    value: "$2,000+",
    buyer: "Managing partner",
    auditNiche: "legal",
    auditValue: 2000,
    angle: "Clarify the intake path for urgent, high-value cases.",
    leaks: [
      "No clear call or quote action above the fold",
      "Reviews or proof are missing near the offer",
      "No obvious call or form tracking"
    ],
    objection: "They may want SEO first. Start with the visitors already arriving and make intake easier to complete."
  },
  auto: {
    label: "Auto services",
    offer: "$750 pilot",
    value: "$500+",
    buyer: "Shop owner",
    auditNiche: "auto services",
    auditValue: 550,
    angle: "Make quote requests, service menus, and proof easier to scan on mobile.",
    leaks: [
      "Mobile layout feels hard to scan",
      "Quote form is buried or asks too much",
      "Reviews or proof are missing near the offer"
    ],
    objection: "They may rely on phone calls. Show how cleaner mobile pages and click tracking make calls easier to win."
  },
  events: {
    label: "Wedding and events",
    offer: "$1,500 growth sprint",
    value: "$1,200+",
    buyer: "Founder",
    auditNiche: "events",
    auditValue: 1200,
    angle: "Turn visual interest into a faster inquiry path with proof and availability cues.",
    leaks: [
      "Reviews or proof are missing near the offer",
      "Quote form is buried or asks too much",
      "No obvious call or form tracking"
    ],
    objection: "They may think portfolio visuals are enough. Position the sprint around inquiries, dates, and booking confidence."
  },
  professional: {
    label: "Professional services",
    offer: "$750 pilot",
    value: "$1,000+",
    buyer: "Principal",
    auditNiche: "professional services",
    auditValue: 1000,
    angle: "Make expertise, fit, and consultation requests easier to understand.",
    leaks: [
      "No clear call or quote action above the fold",
      "Quote form is buried or asks too much",
      "No obvious call or form tracking"
    ],
    objection: "They may not see the site as a sales channel. Tie the sprint to qualified consultation requests."
  }
};

function getSellerSettings() {
  try {
    return {
      ...defaultSeller,
      ...(JSON.parse(localStorage.getItem(sellerStorageKey)) || {})
    };
  } catch {
    return { ...defaultSeller };
  }
}

function setSellerSettings(settings) {
  localStorage.setItem(sellerStorageKey, JSON.stringify(settings));
}

function normalizeUrl(value) {
  if (!value) {
    return "";
  }

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysIso(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function formatDateLabel(value) {
  if (!value) {
    return "Not set";
  }

  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
}

function currentMonthValue() {
  return new Date().toISOString().slice(0, 7);
}

function formatMonthLabel(value) {
  if (!value) {
    return "This month";
  }

  const date = new Date(`${value}-01T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });
}

function sellerContactLine() {
  const seller = getSellerSettings();
  const parts = [seller.sellerEmail, seller.serviceArea].filter(Boolean);
  return parts.length ? parts.join(" | ") : "No public contact details are saved yet.";
}

function renderSellerSettings() {
  const seller = getSellerSettings();
  sellerName.value = seller.sellerName;
  sellerEmail.value = seller.sellerEmail;
  bookingUrl.value = seller.bookingUrl;
  depositUrl.value = seller.depositUrl;
  serviceArea.value = seller.serviceArea;

  sellerPreview.textContent = seller.sellerName || "Lead Sprint operator";
  sellerPreviewDetail.textContent = sellerContactLine();
  footerIdentity.textContent = `${seller.sellerName || "Lead Sprint"}${seller.serviceArea ? ` | ${seller.serviceArea}` : ""}${seller.sellerEmail ? ` | ${seller.sellerEmail}` : ""}`;
}

function getHandoffState() {
  try {
    return JSON.parse(localStorage.getItem(handoffStorageKey));
  } catch {
    return null;
  }
}

function setHandoffState(state) {
  localStorage.setItem(handoffStorageKey, JSON.stringify(state));
}

function loadHandoffState() {
  const state = getHandoffState();
  if (!state) {
    return;
  }

  handoffInputs.client.value = state.client || "";
  handoffInputs.liveUrl.value = state.liveUrl || "";
  handoffInputs.service.value = state.service || "";
  handoffInputs.leadDestination.value = state.leadDestination || "";
  handoffChecks.forEach((check) => {
    check.checked = (state.completedChecks || []).includes(check.value);
  });
}

function handoffDetailStatus(data) {
  const missingDetails = [
    data.enteredClient ? "" : "client name",
    data.enteredLiveUrl ? "" : "live URL",
    data.enteredService ? "" : "primary service",
    data.leadDestination ? "" : "lead destination"
  ].filter(Boolean);

  if (missingDetails.length === 0) {
    return "Client details are complete.";
  }

  return `Add ${missingDetails.join(", ")} before sending the report.`;
}

function buildHandoffData() {
  const completedChecks = handoffChecks.filter((check) => check.checked).map((check) => check.value);
  const missingChecks = handoffChecks.filter((check) => !check.checked).map((check) => check.value);
  const progress = handoffChecks.length
    ? Math.round((completedChecks.length / handoffChecks.length) * 100)
    : 0;
  const clientInput = handoffInputs.client.value.trim();
  const liveUrlInput = handoffInputs.liveUrl.value.trim();
  const serviceInput = handoffInputs.service.value.trim();
  const client = clientInput || latestAudit?.business || "Client";
  const liveUrl = liveUrlInput || latestAudit?.website || "";
  const service = serviceInput || latestAudit?.niche || "primary service";
  const leadDestination = handoffInputs.leadDestination.value.trim();
  const detailsComplete = Boolean(clientInput && liveUrlInput && serviceInput && leadDestination);

  let status = "Keep testing before handoff.";
  if (progress === 100 && detailsComplete) {
    status = "Ready to hand off.";
  } else if (progress >= 75) {
    status = "Nearly ready. Finish the open items.";
  } else if (progress >= 45) {
    status = "Core checks are underway.";
  }

  return {
    client,
    liveUrl,
    service,
    leadDestination,
    enteredClient: clientInput,
    enteredLiveUrl: liveUrlInput,
    enteredService: serviceInput,
    completedChecks,
    missingChecks,
    progress,
    detailsComplete,
    status,
    generatedAt: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  };
}

function makeHandoffActions(data) {
  const actions = [];
  if (data.missingChecks.some((item) => item.includes("Lead form"))) {
    actions.push("Run another test lead with the client watching, then confirm inbox delivery.");
  }
  if (data.missingChecks.some((item) => item.includes("events"))) {
    actions.push("Verify form submit and call-click events after the first live inquiry.");
  }
  if (data.missingChecks.some((item) => item.includes("30-day"))) {
    actions.push("Write the next three conversion improvements before pitching the care plan.");
  }
  if (data.missingChecks.some((item) => item.includes("speed"))) {
    actions.push("Check load speed, broken links, and console errors after launch.");
  }

  return [
    ...actions,
    `Review ${data.service} inquiries weekly and note where ready buyers hesitate.`,
    "Add one fresh proof point, review, or before/after note near the main call to action.",
    "Offer the care plan once the client has seen the first tracked lead path working."
  ].slice(0, 3);
}

function makeHandoffReport(data) {
  const seller = getSellerSettings();
  const completed = data.completedChecks.length
    ? data.completedChecks.map((item) => `- ${item}`).join("\n")
    : "- No launch checks completed yet";
  const missing = data.missingChecks.length
    ? data.missingChecks.map((item) => `- ${item}`).join("\n")
    : "- No open launch checks";
  const missingDetails = [
    data.enteredClient ? "" : "- Client name",
    data.enteredLiveUrl ? "" : "- Live URL",
    data.enteredService ? "" : "- Primary service",
    data.leadDestination ? "" : "- Lead destination"
  ].filter(Boolean);
  const actions = makeHandoffActions(data).map((item) => `- ${item}`).join("\n");
  const sellerBlock = [
    seller.sellerName ? `Prepared by: ${seller.sellerName}` : "Prepared by: Lead Sprint",
    seller.sellerEmail ? `Contact: ${seller.sellerEmail}` : "",
    seller.serviceArea ? `Service area: ${seller.serviceArea}` : ""
  ].filter(Boolean);

  return [
    `Lead Sprint Handoff Report: ${data.client}`,
    ...sellerBlock,
    `Generated: ${data.generatedAt}`,
    "",
    `Live URL: ${data.liveUrl || "not added yet"}`,
    `Primary service: ${data.service}`,
    `Lead destination: ${data.leadDestination || "not added yet"}`,
    `Launch readiness: ${data.progress}%`,
    "",
    "Completed checks:",
    completed,
    "",
    "Open checks:",
    missing,
    "",
    "Open details:",
    missingDetails.length ? missingDetails.join("\n") : "- No open details",
    "",
    "Client note:",
    data.progress === 100 && data.detailsComplete
      ? "The sprint is ready for handoff. The page, lead path, and measurement checks have been verified."
      : "The sprint is close, but the open checks should be finished before the delivery window is considered complete.",
    "",
    "Next 30-day actions:",
    actions,
    "",
    "Care plan offer:",
    `Keep the lead path healthy with monthly edits, form tests, analytics notes, and small conversion improvements for ${formatter.format(Number(careInputs.careFee.value))}/month.`
  ].join("\n");
}

function renderHandoff() {
  const data = buildHandoffData();
  const missingCount = data.missingChecks.length;
  const actions = makeHandoffActions(data);

  handoffProgress.textContent = `${data.progress}%`;
  handoffProgressBar.style.width = `${data.progress}%`;
  handoffStatus.textContent = data.status;
  handoffMissing.textContent = missingCount === 1 ? "1 check left" : `${missingCount} checks left`;
  handoffSummary.textContent = missingCount === 0
    ? handoffDetailStatus(data)
    : "Finish the lead routing, tracking, mobile, and report checks before delivery.";
  handoffActions.innerHTML = actions.map((action) => `<li>${escapeHtml(action)}</li>`).join("");
  handoffReport.value = makeHandoffReport(data);

  return data;
}

function selectedCampaign() {
  return campaignData[campaignNiche.value] || campaignData.homeServices;
}

function renderCampaign() {
  const campaign = selectedCampaign();
  campaignOffer.textContent = campaign.offer;
  campaignValue.textContent = campaign.value;
  campaignBuyer.textContent = campaign.buyer;
  campaignAngle.textContent = campaign.angle;
  campaignObjection.textContent = campaign.objection;
  campaignLeaks.innerHTML = campaign.leaks.map((leak) => `<li>${escapeHtml(leak)}</li>`).join("");
}

function makeCampaignBrief(campaign) {
  return [
    `${campaign.label} Lead Sprint campaign`,
    "",
    `First offer: ${campaign.offer}`,
    `Typical job value: ${campaign.value}`,
    `Best buyer: ${campaign.buyer}`,
    "",
    "Opening angle:",
    campaign.angle,
    "",
    "Lead leaks to inspect:",
    ...campaign.leaks.map((leak) => `- ${leak}`),
    "",
    "Objection handle:",
    campaign.objection,
    "",
    "First email move:",
    "Find one visible lead leak, name it plainly, and ask whether a 15-minute teardown would be useful this week."
  ].join("\n");
}

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
  const pack = recommendedPackage(audit);

  auditScore.textContent = audit.score;
  auditAngle.textContent = audit.angle;
  auditLine.textContent = audit.firstLine;
  auditNext.textContent = audit.nextAction;
  proposalText.value = makeProposal(audit);
  proposalMeta.textContent = `${pack.name}, ${formatter.format(pack.price)}, ${pack.timeline}`;
  renderHandoff();
  renderMonthlyReport();
  renderProofLoop();
}

function makeAuditEmail(audit) {
  const seller = getSellerSettings();
  const proofLine = audit.jobValue
    ? `For ${audit.niche}, even one booked job around ${formatter.format(audit.jobValue)} can make a focused website cleanup worth testing.`
    : `For ${audit.niche}, even one extra booked job can make a focused website cleanup worth testing.`;
  const bookingLine = seller.bookingUrl
    ? `If useful, grab a teardown slot here: ${seller.bookingUrl}`
    : "Would it be worth a 15-minute look this week?";

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
    bookingLine,
    "",
    "Best,",
    seller.sellerName || ""
  ].join("\n");
}

function recommendedPackage(audit) {
  if (audit.score >= 82 || audit.leaks.length >= 4) {
    return {
      name: "Growth Sprint",
      price: 1500,
      timeline: "5 working days",
      scope: "one focused page refresh, quote path, analytics events, review placement, response templates, and two conversion improvements"
    };
  }

  return {
    name: "Pilot Sprint",
    price: 750,
    timeline: "72 hours",
    scope: "one focused page refresh, quote path, analytics events, inbox routing, and a handoff report"
  };
}

function makeProposal(audit) {
  const seller = getSellerSettings();
  const pack = recommendedPackage(audit);
  const leakList = audit.leaks.length
    ? audit.leaks.map((leak) => `- ${leak}`).join("\n")
    : "- The current lead path is unclear";
  const contactBlock = [
    seller.sellerName ? `Seller: ${seller.sellerName}` : "",
    seller.sellerEmail ? `Email: ${seller.sellerEmail}` : "",
    seller.serviceArea ? `Service area: ${seller.serviceArea}` : "",
    seller.bookingUrl ? `Booking: ${seller.bookingUrl}` : "",
    seller.depositUrl ? `Deposit: ${seller.depositUrl}` : ""
  ].filter(Boolean);
  const nextStep = seller.bookingUrl || seller.depositUrl
    ? [
        seller.bookingUrl ? `1. Book the teardown: ${seller.bookingUrl}` : "1. Confirm a 15-minute teardown time.",
        seller.depositUrl ? `2. Start the sprint deposit: ${seller.depositUrl}` : "2. Confirm payment terms before build starts.",
        "3. Send website access, brand assets, and the main service to prioritize."
      ].join("\n")
    : "Approve the sprint, send access, and confirm the main service you want more inquiries for.";

  return [
    `${pack.name} Proposal for ${audit.business}`,
    ...(contactBlock.length ? ["", ...contactBlock] : []),
    "",
    `Website: ${audit.website || "not provided"}`,
    `Niche: ${audit.niche}`,
    `Priority score: ${audit.score}/100`,
    `Recommended angle: ${audit.angle}`,
    "",
    "What I noticed:",
    leakList,
    "",
    "Recommended sprint:",
    `I recommend the ${pack.name}: ${pack.scope}.`,
    "",
    "Why this is not just a website build:",
    "The value is in diagnosing the first lead leaks, rewriting the conversion path, implementing the changes, testing form and call flow, verifying analytics events, and handing over the next action list.",
    "",
    "Price and timing:",
    `${formatter.format(pack.price)} for ${pack.timeline} after access and intake are complete.`,
    "",
    "Completion promise:",
    "If the mobile page, lead path, and tracking events are not verified by the delivery deadline, the fee pauses until those items are complete.",
    "",
    "Next step:",
    nextStep,
    "",
    seller.sellerName ? `Prepared by ${seller.sellerName}` : "Prepared by Lead Sprint"
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

function withPipelineDefaults(prospect) {
  return {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    touchCount: 0,
    nextFollowUp: addDaysIso(2),
    ...prospect
  };
}

function nextPipelineState(prospect) {
  const states = [
    { status: "Follow up", days: 3 },
    { status: "Book review", days: 2 },
    { status: "Proposal sent", days: 4 },
    { status: "Close or park", days: 7 },
    { status: "Later", days: 14 }
  ];
  const nextIndex = Math.min(Number(prospect.touchCount || 0), states.length - 1);
  const next = states[nextIndex];

  return {
    ...prospect,
    status: next.status,
    touchCount: Number(prospect.touchCount || 0) + 1,
    updatedAt: new Date().toISOString(),
    nextFollowUp: addDaysIso(next.days)
  };
}

function findPrimaryProspect() {
  const prospects = getSavedProspects();
  return [...prospects].sort((a, b) => {
    const dateCompare = String(a.nextFollowUp || "").localeCompare(String(b.nextFollowUp || ""));
    return dateCompare || Number(b.score || 0) - Number(a.score || 0);
  })[0];
}

function renderProspects() {
  const prospects = getSavedProspects();
  if (prospects.length === 0) {
    prospectRows.innerHTML = '<tr><td colspan="6">No saved prospects yet.</td></tr>';
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
          <td>
            <strong>${escapeHtml(prospect.status || "Contact today")}</strong><br>
            <span>${escapeHtml(prospect.angle)}</span>
          </td>
          <td>${formatDateLabel(prospect.nextFollowUp)}</td>
          <td>
            <button class="table-action" type="button" data-action="advance" data-id="${prospect.id}">Advance</button>
            <button class="table-action" type="button" data-action="remove" data-id="${prospect.id}">Remove</button>
          </td>
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

campaignNiche.addEventListener("change", () => {
  renderCampaign();
  campaignNote.textContent = "Campaign angle updated.";
});

applyCampaign.addEventListener("click", () => {
  const campaign = selectedCampaign();
  document.querySelector("#auditNiche").value = campaign.auditNiche;
  document.querySelector("#auditValue").value = campaign.auditValue;
  document.querySelectorAll("input[name='leadLeak']").forEach((input) => {
    input.checked = campaign.leaks.includes(input.value);
  });
  latestAudit = buildAudit();
  renderAudit(latestAudit);
  campaignNote.textContent = `${campaign.label} campaign applied to the audit console.`;
});

copyCampaign.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(makeCampaignBrief(selectedCampaign()));
    campaignNote.textContent = "Campaign brief copied.";
  } catch {
    campaignNote.textContent = "Clipboard was unavailable. Use the visible campaign brief.";
  }
});

auditForm.addEventListener("submit", (event) => {
  event.preventDefault();
  latestAudit = buildAudit();
  renderAudit(latestAudit);
  auditNote.textContent = "Prospect scored. Copy the email or save the lead to your local pipeline.";
});

auditForm.addEventListener("input", () => {
  latestAudit = buildAudit();
  renderAudit(latestAudit);
});

auditForm.addEventListener("change", () => {
  latestAudit = buildAudit();
  renderAudit(latestAudit);
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

copyProposal.addEventListener("click", async () => {
  latestAudit = latestAudit || buildAudit();
  renderAudit(latestAudit);

  try {
    await navigator.clipboard.writeText(proposalText.value);
    auditNote.textContent = "Mini-proposal copied.";
  } catch {
    proposalText.focus();
    proposalText.select();
    auditNote.textContent = "Clipboard was unavailable. The proposal text is selected.";
  }
});

saveProspect.addEventListener("click", () => {
  latestAudit = latestAudit || buildAudit();
  renderAudit(latestAudit);
  const prospects = getSavedProspects();
  const savedLead = withPipelineDefaults(latestAudit);
  const filteredProspects = prospects.filter((prospect) => {
    const sameWebsite = savedLead.website && prospect.website === savedLead.website;
    const sameBusiness = prospect.business === savedLead.business;
    return !(sameWebsite || sameBusiness);
  });
  setSavedProspects([savedLead, ...filteredProspects].slice(0, 50));
  renderProspects();
  auditNote.textContent = "Lead saved locally in this browser.";
});

exportProspects.addEventListener("click", () => {
  const prospects = getSavedProspects();
  if (prospects.length === 0) {
    auditNote.textContent = "Save at least one prospect before exporting.";
    return;
  }

  const header = ["Business", "Website", "Niche", "Job Value", "Score", "Angle", "Status", "Next Follow-Up", "Lead Leaks"];
  const rows = prospects.map((prospect) => [
    prospect.business,
    prospect.website,
    prospect.niche,
    prospect.jobValue,
    prospect.score,
    prospect.angle,
    prospect.status,
    prospect.nextFollowUp,
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

prospectRows.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const id = Number(button.dataset.id);
  const prospects = getSavedProspects();
  if (button.dataset.action === "remove") {
    setSavedProspects(prospects.filter((prospect) => Number(prospect.id) !== id));
    renderProspects();
    auditNote.textContent = "Lead removed from the local pipeline.";
    return;
  }

  if (button.dataset.action === "advance") {
    setSavedProspects(
      prospects.map((prospect) => (Number(prospect.id) === id ? nextPipelineState(prospect) : prospect))
    );
    renderProspects();
    auditNote.textContent = "Pipeline step advanced and follow-up date updated.";
  }
});

function makeFollowUpEmail(prospect) {
  const seller = getSellerSettings();
  const bookingLine = seller.bookingUrl
    ? `If it is useful, you can book a short teardown here: ${seller.bookingUrl}`
    : "Would a short teardown be useful this week?";

  return [
    `Subject: Re: quick idea for ${prospect.business}`,
    "",
    `Hi ${prospect.business},`,
    "",
    `Quick follow-up on ${prospect.website || "your website"}. The issue I would look at first is: ${prospect.angle.toLowerCase()}.`,
    "",
    "The goal is not a big redesign. It is to make the ready-to-buy visitor path clearer, verify the form or call flow, and make sure the result is trackable.",
    "",
    bookingLine,
    "",
    "Best,",
    seller.sellerName || ""
  ].join("\n");
}

copyFollowUp.addEventListener("click", async () => {
  const prospect = findPrimaryProspect();
  if (!prospect) {
    auditNote.textContent = "Save a prospect before copying a follow-up.";
    return;
  }

  try {
    await navigator.clipboard.writeText(makeFollowUpEmail(prospect));
    auditNote.textContent = `Follow-up copied for ${prospect.business}.`;
  } catch {
    auditNote.textContent = "Clipboard was unavailable. Copy a mini-proposal instead.";
  }
});

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function setPlannerValueLabels() {
  plannerValueLabels.forEach((label) => {
    const target = plannerInputs[label.dataset.plannerValueFor];
    if (!target) {
      return;
    }

    const value = Number(target.value);
    if (["revenueTarget", "averageDeal"].includes(target.id)) {
      label.textContent = formatter.format(value);
      return;
    }

    if (["replyRate", "callRate", "closeRatePlanner"].includes(target.id)) {
      label.textContent = `${value}%`;
      return;
    }

    label.textContent = numberFormatter.format(value);
  });
}

function calculatePlanner() {
  const monthlyRevenue = Number(plannerInputs.revenueTarget.value);
  const averageDeal = Number(plannerInputs.averageDeal.value);
  const replyRate = Number(plannerInputs.replyRate.value) / 100;
  const callRate = Number(plannerInputs.callRate.value) / 100;
  const closeRate = Number(plannerInputs.closeRatePlanner.value) / 100;
  const sellingDays = Number(plannerInputs.workdays.value);

  const pilots = Math.max(1, Math.ceil(monthlyRevenue / averageDeal));
  const callsPerMonth = Math.ceil(pilots / closeRate);
  const repliesPerMonth = Math.ceil(callsPerMonth / callRate);
  const emailsPerMonth = Math.ceil(repliesPerMonth / replyRate);
  const emailsPerWeek = Math.ceil(emailsPerMonth / 4.33);
  const daily = Math.ceil(emailsPerWeek / sellingDays);

  pilotsNeeded.textContent = numberFormatter.format(pilots);
  weeklyEmails.textContent = numberFormatter.format(emailsPerWeek);
  dailyProspects.textContent = numberFormatter.format(daily);

  return {
    pilots,
    callsPerMonth,
    repliesPerMonth,
    emailsPerMonth,
    emailsPerWeek,
    daily,
    sellingDays
  };
}

Object.values(plannerInputs).forEach((input) => {
  input.addEventListener("input", () => {
    setPlannerValueLabels();
    calculatePlanner();
  });
});

function formatHours(value) {
  return Number.isInteger(value) ? `${value} hrs` : `${value.toFixed(1)} hrs`;
}

function setCareValueLabels() {
  careValueLabels.forEach((label) => {
    const target = careInputs[label.dataset.careValueFor];
    if (!target) {
      return;
    }

    const value = Number(target.value);
    if (target.id === "careFee") {
      label.textContent = formatter.format(value);
      return;
    }

    if (target.id === "careConversionRate") {
      label.textContent = `${value}%`;
      return;
    }

    if (target.id === "careHours") {
      label.textContent = value.toFixed(1);
      return;
    }

    if (target.id === "careMonths") {
      label.textContent = `${value} months`;
      return;
    }

    label.textContent = numberFormatter.format(value);
  });
}

function calculateCarePlan() {
  const sprintClients = Number(careInputs.careSprintClients.value);
  const conversionRate = Number(careInputs.careConversionRate.value) / 100;
  const monthlyFee = Number(careInputs.careFee.value);
  const hoursPerClient = Number(careInputs.careHours.value);
  const months = Number(careInputs.careMonths.value);
  const retainedClients = Math.max(1, Math.ceil(sprintClients * conversionRate * months));
  const monthlyRevenue = retainedClients * monthlyFee;
  const annualRunRate = monthlyRevenue * 12;
  const monthlyHours = retainedClients * hoursPerClient;

  careClients.textContent = numberFormatter.format(retainedClients);
  careMrr.textContent = formatter.format(monthlyRevenue);
  careArr.textContent = formatter.format(annualRunRate);
  careLoad.textContent = formatHours(monthlyHours);

  const plan = {
    sprintClients,
    conversionRate,
    monthlyFee,
    hoursPerClient,
    months,
    retainedClients,
    monthlyRevenue,
    annualRunRate,
    monthlyHours
  };
  carePitch.value = makeCarePitch(plan);
  return plan;
}

function makeCarePitch(plan) {
  const seller = getSellerSettings();
  const bookingLine = seller.bookingUrl
    ? `If you want to keep momentum, we can confirm it here: ${seller.bookingUrl}`
    : "If you want to keep momentum, I can add this to the handoff plan today.";

  return [
    "Care Plan Close Script",
    "",
    "The sprint gets the lead path live and tested. The care plan keeps it from quietly drifting out of shape.",
    "",
    `For ${formatter.format(plan.monthlyFee)}/month, I will handle monthly form testing, uptime checks, analytics notes, small copy or content edits, and one practical conversion improvement at a time.`,
    "",
    `The delivery load is designed to stay lean: about ${formatHours(plan.hoursPerClient)} per client per month, with a clear monthly note showing what was checked, what changed, and what to watch next.`,
    "",
    `If ${plan.retainedClients} sprint clients stay on care over ${plan.months} months, that creates ${formatter.format(plan.monthlyRevenue)} in monthly recurring revenue and a ${formatter.format(plan.annualRunRate)} annual run rate.`,
    "",
    "Suggested close:",
    "Would you like me to keep testing the form, watching the lead path, and making one small improvement each month so the site keeps earning instead of becoming another finished project?",
    "",
    bookingLine,
    "",
    `Prepared by ${seller.sellerName || "Lead Sprint"}`
  ].join("\n");
}

function monthlyClientName() {
  return monthlyInputs.client.value.trim() || handoffInputs.client.value.trim() || latestAudit?.business || "Client";
}

function buildMonthlyReportData() {
  const forms = Math.max(0, Number(monthlyInputs.forms.value) || 0);
  const calls = Math.max(0, Number(monthlyInputs.calls.value) || 0);
  const leadActions = forms + calls;
  const update = monthlyInputs.update.value.trim();
  const observation = monthlyInputs.observation.value.trim();
  const next = monthlyInputs.next.value.trim();
  const status = monthlyInputs.status.value;
  const statusPenalty = status === "fix" ? 18 : status === "watch" ? 8 : 0;
  const score = Math.max(
    0,
    Math.min(
      100,
      42 + Math.min(26, leadActions * 3) + (update ? 14 : 0) + (observation ? 10 : 0) + (next ? 8 : 0) - statusPenalty
    )
  );

  let statusLine = "Send the report and ask to continue care.";
  if (score < 55) {
    statusLine = "Fix the open issue before asking for renewal.";
  } else if (score < 75) {
    statusLine = "Send the report with a clear next improvement.";
  }

  let renewalCue = "This is a good month to keep the plan active without discounting.";
  if (status === "fix") {
    renewalCue = "Lead with the fix, then renew once the path is stable.";
  } else if (status === "watch") {
    renewalCue = "Frame renewal around watching one visible bottleneck.";
  }

  return {
    client: monthlyClientName(),
    period: monthlyInputs.period.value || currentMonthValue(),
    periodLabel: formatMonthLabel(monthlyInputs.period.value || currentMonthValue()),
    forms,
    calls,
    leadActions,
    status,
    update,
    observation,
    next,
    score,
    statusLine,
    renewalCue
  };
}

function makeMonthlyReport(data) {
  const seller = getSellerSettings();
  const monthlyFee = formatter.format(Number(careInputs.careFee.value));
  const updateLine = data.update || "No small edit was shipped yet; next month should include one visible improvement.";
  const observationLine = data.observation || "The lead path was checked, and the next report should include a sharper observation.";
  const nextLine = data.next || "Choose one small conversion improvement before the next monthly note.";
  const sellerLines = [
    seller.sellerName ? `Prepared by: ${seller.sellerName}` : "Prepared by: Lead Sprint",
    seller.sellerEmail ? `Contact: ${seller.sellerEmail}` : ""
  ].filter(Boolean);

  return [
    `Care Plan Monthly Note: ${data.client}`,
    `Period: ${data.periodLabel}`,
    ...sellerLines,
    "",
    "What I checked:",
    `- Form leads reviewed: ${data.forms}`,
    `- Call clicks reviewed: ${data.calls}`,
    `- Care status: ${data.status === "fix" ? "needs a fix" : data.status === "watch" ? "watch closely" : "healthy"}`,
    "",
    "What changed:",
    `- ${updateLine}`,
    "",
    "What I noticed:",
    observationLine,
    "",
    "Next small win:",
    `- ${nextLine}`,
    "",
    "Renewal note:",
    `The ${monthlyFee}/month care plan keeps the lead path tested, watched, and improved so the sprint does not become a finished project that slowly goes stale.`,
    "",
    `Retention health: ${data.score}/100`
  ].join("\n");
}

function renderMonthlyReport() {
  const data = buildMonthlyReportData();
  monthlyScore.textContent = data.score;
  monthlyStatusLine.textContent = data.statusLine;
  monthlyProof.textContent = `${numberFormatter.format(data.leadActions)} tracked lead actions reviewed, ${data.update ? "one improvement shipped" : "no improvement logged yet"}, ${data.next ? "next action ready" : "next action needed"}.`;
  monthlyRenewalCue.textContent = data.renewalCue;
  monthlyReport.value = makeMonthlyReport(data);
  return data;
}

function buildProofLoopData() {
  const monthly = buildMonthlyReportData();
  const client = proofInputs.client.value.trim() || monthly.client;
  const referralTarget = proofInputs.referralTarget.value.trim() || "another local service owner";
  const win = proofInputs.win.value.trim() || monthly.update || monthly.observation || "The lead path is now tested and easier to maintain.";
  const metric = proofInputs.metric.value.trim() || `${numberFormatter.format(monthly.leadActions)} tracked lead actions reviewed in ${monthly.periodLabel}`;
  const quote = proofInputs.quote.value.trim();
  const permission = proofInputs.permission.value;
  const channel = proofInputs.channel.value;
  const permissionScore = permission === "public" ? 22 : permission === "anonymized" ? 16 : 8;
  const score = Math.min(
    100,
    (win ? 24 : 0) + (metric ? 20 : 0) + (quote ? 25 : 0) + permissionScore + (referralTarget ? 9 : 0) + 5
  );

  let status = "Ask for a short quote and one referral.";
  if (score >= 90) {
    status = "Ready to use in outreach and referral asks.";
  } else if (!quote) {
    status = "Ask for one plain-language client quote.";
  } else if (permission === "private") {
    status = "Use this privately until permission improves.";
  }

  let ask = "Ask for permission to use an anonymized version of the monthly win.";
  if (permission === "public") {
    ask = "Ask for approval to use the quote, client name, and short case-study snippet.";
  } else if (permission === "private") {
    ask = "Ask whether this can move from private note to anonymized proof.";
  }

  let use = "Add this to outreach as a short proof note, not a full case study yet.";
  if (score >= 90 && permission === "public") {
    use = "Use this as a named mini case study in outreach, proposals, and follow-ups.";
  } else if (score >= 75) {
    use = "Use this as anonymized proof in teardown emails and sales calls.";
  }

  return {
    client,
    referralTarget,
    win,
    metric,
    quote,
    permission,
    channel,
    score,
    status,
    ask,
    use
  };
}

function makeProofKit(data) {
  const seller = getSellerSettings();
  const channelLine = data.channel === "phone"
    ? "Best channel: bring this up on the next call, then send the written version."
    : data.channel === "linkedin"
      ? "Best channel: use this as a short LinkedIn follow-up after sending the monthly note."
      : "Best channel: send this by email after the monthly note.";
  const permissionLabel = data.permission === "public"
    ? "Public case study"
    : data.permission === "private"
      ? "Private sales note"
      : "Anonymized proof";
  const quoteLine = data.quote || "If you are comfortable, could you send one sentence about what feels clearer or easier now?";
  const snippetClient = data.permission === "public" ? data.client : "a local service business";

  return [
    `Proof Kit: ${data.client}`,
    `Permission level: ${permissionLabel}`,
    channelLine,
    "",
    "Testimonial request:",
    `Hi ${data.client},`,
    "",
    "I am wrapping the monthly care note and wanted to ask a quick favor.",
    "",
    `The useful win this month was: ${data.win}`,
    `The simple proof point is: ${data.metric}.`,
    "",
    "Would you be comfortable with me using a short version of that as proof when explaining the Lead Sprint to similar businesses?",
    data.permission === "public"
      ? "If yes, I would use your business name and keep the wording short."
      : "If yes, I can keep it anonymized and avoid using your business name.",
    "",
    "A one-sentence quote is plenty. Something like:",
    `"${quoteLine}"`,
    "",
    "Mini case-study snippet:",
    `${snippetClient} used a focused Lead Sprint and care plan to keep the website lead path tested, clearer, and easier to improve. ${data.win} ${data.metric}.`,
    data.quote ? `Client reaction: "${data.quote}"` : "Client reaction: quote requested.",
    "",
    "Referral ask:",
    `Do you know ${data.referralTarget} who might benefit from the same kind of website lead-path cleanup?`,
    "If yes, I can send a short teardown note rather than a big agency pitch.",
    "",
    "Outreach proof line:",
    `I recently helped ${snippetClient} keep their website lead path healthier: ${data.metric.toLowerCase()}, with the next improvement already planned.`,
    "",
    `Prepared by ${seller.sellerName || "Lead Sprint"}`
  ].join("\n");
}

function renderProofLoop() {
  const data = buildProofLoopData();
  proofScore.textContent = data.score;
  proofStatus.textContent = data.status;
  proofAsk.textContent = data.ask;
  proofUse.textContent = data.use;
  proofKit.value = makeProofKit(data);
  return data;
}

Object.values(careInputs).forEach((input) => {
  input.addEventListener("input", () => {
    setCareValueLabels();
    calculateCarePlan();
    renderHandoff();
    renderMonthlyReport();
    renderProofLoop();
  });
});

copyDailyPlan.addEventListener("click", async () => {
  const plan = calculatePlanner();
  const text = [
    "Lead Sprint daily outreach plan",
    "",
    `Monthly pilots needed: ${plan.pilots}`,
    `Calls needed per month: ${plan.callsPerMonth}`,
    `Replies needed per month: ${plan.repliesPerMonth}`,
    `Emails needed per week: ${plan.emailsPerWeek}`,
    `Daily prospecting target: ${plan.daily} over ${plan.sellingDays} selling days`,
    "",
    "Daily block:",
    `- Find ${plan.daily} prospects with one visible lead leak`,
    `- Send ${plan.daily} personalized teardown notes`,
    "- Advance yesterday's saved leads",
    "- Copy follow-ups for due prospects",
    "- Book teardown calls before doing custom proposal work"
  ].join("\n");

  try {
    await navigator.clipboard.writeText(text);
    plannerNote.textContent = "Daily outreach plan copied.";
  } catch {
    plannerNote.textContent = "Clipboard was unavailable. Use the visible planner numbers.";
  }
});

copyCarePitch.addEventListener("click", async () => {
  calculateCarePlan();

  try {
    await navigator.clipboard.writeText(carePitch.value);
    careNote.textContent = "Care plan pitch copied.";
  } catch {
    carePitch.focus();
    carePitch.select();
    careNote.textContent = "Clipboard was unavailable. The care pitch is selected.";
  }
});

monthlyReportForm.addEventListener("input", () => {
  renderMonthlyReport();
  renderProofLoop();
  monthlyNote.textContent = "";
});

monthlyReportForm.addEventListener("change", () => {
  renderMonthlyReport();
  renderProofLoop();
  monthlyNote.textContent = "";
});

copyMonthlyReport.addEventListener("click", async () => {
  renderMonthlyReport();

  try {
    await navigator.clipboard.writeText(monthlyReport.value);
    monthlyNote.textContent = "Monthly report copied.";
  } catch {
    monthlyReport.focus();
    monthlyReport.select();
    monthlyNote.textContent = "Clipboard was unavailable. The monthly report is selected.";
  }
});

proofLoopForm.addEventListener("input", () => {
  renderProofLoop();
  proofNote.textContent = "";
});

proofLoopForm.addEventListener("change", () => {
  renderProofLoop();
  proofNote.textContent = "";
});

copyProofKit.addEventListener("click", async () => {
  renderProofLoop();

  try {
    await navigator.clipboard.writeText(proofKit.value);
    proofNote.textContent = "Proof kit copied.";
  } catch {
    proofKit.focus();
    proofKit.select();
    proofNote.textContent = "Clipboard was unavailable. The proof kit is selected.";
  }
});

handoffForm.addEventListener("input", () => {
  renderHandoff();
  renderMonthlyReport();
  renderProofLoop();
  handoffNote.textContent = "";
});

handoffForm.addEventListener("change", () => {
  renderHandoff();
  renderMonthlyReport();
  renderProofLoop();
  handoffNote.textContent = "";
});

saveHandoff.addEventListener("click", () => {
  const data = renderHandoff();
  setHandoffState({
    client: handoffInputs.client.value.trim(),
    liveUrl: handoffInputs.liveUrl.value.trim(),
    service: handoffInputs.service.value.trim(),
    leadDestination: handoffInputs.leadDestination.value.trim(),
    completedChecks: data.completedChecks,
    updatedAt: new Date().toISOString()
  });
  handoffNote.textContent = "Launch QA saved locally in this browser.";
});

resetHandoff.addEventListener("click", () => {
  localStorage.removeItem(handoffStorageKey);
  handoffForm.reset();
  renderHandoff();
  handoffNote.textContent = "Launch QA reset.";
});

copyHandoff.addEventListener("click", async () => {
  renderHandoff();

  try {
    await navigator.clipboard.writeText(handoffReport.value);
    handoffNote.textContent = "Handoff report copied.";
  } catch {
    handoffReport.focus();
    handoffReport.select();
    handoffNote.textContent = "Clipboard was unavailable. The handoff report is selected.";
  }
});

sellerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  setSellerSettings({
    sellerName: sellerName.value.trim(),
    sellerEmail: sellerEmail.value.trim(),
    bookingUrl: normalizeUrl(bookingUrl.value.trim()),
    depositUrl: normalizeUrl(depositUrl.value.trim()),
    serviceArea: serviceArea.value.trim()
  });
  renderSellerSettings();
  latestAudit = latestAudit || buildAudit();
  renderAudit(latestAudit);
  renderHandoff();
  calculateCarePlan();
  renderMonthlyReport();
  renderProofLoop();
  sellerNote.textContent = "Seller setup saved locally in this browser.";
});

resetSeller.addEventListener("click", () => {
  localStorage.removeItem(sellerStorageKey);
  renderSellerSettings();
  latestAudit = latestAudit || buildAudit();
  renderAudit(latestAudit);
  renderHandoff();
  calculateCarePlan();
  renderMonthlyReport();
  renderProofLoop();
  sellerNote.textContent = "Seller setup reset.";
});

openBooking.addEventListener("click", () => {
  const url = normalizeUrl(getSellerSettings().bookingUrl);
  if (!url) {
    sellerNote.textContent = "Add and save a booking link first.";
    return;
  }
  window.open(url, "_blank", "noopener");
});

openDeposit.addEventListener("click", () => {
  const url = normalizeUrl(getSellerSettings().depositUrl);
  if (!url) {
    sellerNote.textContent = "Add and save a deposit link first.";
    return;
  }
  window.open(url, "_blank", "noopener");
});

copyKickoff.addEventListener("click", async () => {
  const audit = latestAudit || buildAudit();
  const seller = getSellerSettings();
  const checklist = [
    `Kickoff checklist for ${audit.business}`,
    "",
    "- Confirm the main service to prioritize",
    "- Confirm service area and strongest proof points",
    "- Send website/CMS access",
    "- Send logo, colors, photos, and three reviews",
    "- Confirm where form submissions should route",
    "- Confirm analytics access or tracking install path",
    "- Send three competitors or reference sites",
    "- Approve delivery window and revision boundary",
    seller.depositUrl ? `- Pay sprint deposit: ${seller.depositUrl}` : "- Confirm payment before build starts",
    "",
    `Prepared by ${seller.sellerName || "Lead Sprint"}`
  ].join("\n");

  try {
    await navigator.clipboard.writeText(checklist);
    sellerNote.textContent = "Kickoff checklist copied.";
  } catch {
    sellerNote.textContent = "Clipboard was unavailable. Copy from the proposal panel instead.";
  }
});

printProposal.addEventListener("click", () => {
  latestAudit = latestAudit || buildAudit();
  renderAudit(latestAudit);
  document.body.classList.add("print-proposal");
  window.print();
  window.setTimeout(() => document.body.classList.remove("print-proposal"), 300);
});

renderSellerSettings();
renderCampaign();
loadHandoffState();
monthlyInputs.period.value = currentMonthValue();
setPlannerValueLabels();
calculatePlanner();
setCareValueLabels();
calculateCarePlan();
latestAudit = buildAudit();
renderAudit(latestAudit);
renderProspects();
renderHandoff();
renderMonthlyReport();
renderProofLoop();
