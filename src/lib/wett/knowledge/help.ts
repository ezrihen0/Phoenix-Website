import type { WettReport, WettSystemType } from "../schema";
import { activeChimneyRoute, workflowFor } from "./index";

export type WettHelpGuidance = {
  id: string;
  title: string;
  summary: string;
  checks: string[];
  accessGuidance?: string;
  evidenceGuidance?: string;
  caution?: string;
  manufacturerDependent?: boolean;
  photoTargetId?: string;
};

export type TechnicianHelpContext = {
  business: "Phoenix";
  province: "Alberta";
  systemType?: string;
  systemLabel?: string;
  currentSection?: string;
  inspectionGroup?: string;
  inspectionItem?: string;
  chimneyConfiguration?: string;
  manufacturer?: string;
  model?: string;
  listingStatus?: string;
  inspectionLevel?: string;
  currentStatus?: string;
  helpId: string;
  helpTitle: string;
};

export type TechnicianHelpAnswer = {
  quickAnswer: string;
  verifyNext: string[];
  sourcePath: string;
  caution: string;
};

const ACCESS =
  "Use UTI only when this item exists but cannot be inspected because it is concealed, inaccessible, unsafe, or beyond the inspection level. Do not use UTI for a missing manual, an unknown model, a missing tag, or a forgotten measurement.";

const PHOTO = "Photograph a material defect or a real access limit on this item.";

type Draft = Omit<WettHelpGuidance, "id"> & { id?: string };

function guide(system: string, key: string, draft: Draft): WettHelpGuidance {
  return {
    id: `${system}:${key}`,
    accessGuidance: draft.accessGuidance ?? ACCESS,
    evidenceGuidance: draft.evidenceGuidance ?? PHOTO,
    title: draft.title,
    summary: draft.summary,
    checks: draft.checks,
    caution: draft.caution,
    manufacturerDependent: draft.manufacturerDependent,
    photoTargetId: draft.photoTargetId,
  };
}

const groups = new Map<string, WettHelpGuidance>();
const items = new Map<string, WettHelpGuidance>();
const measurements = new Map<string, WettHelpGuidance>();
const cleaning = new Map<string, WettHelpGuidance>();

function group(system: WettSystemType, key: string, draft: Draft) {
  groups.set(`${system}:${key}`, guide(system, key, draft));
}

function item(system: WettSystemType, key: string, draft: Draft) {
  items.set(`${system}:${key}`, guide(system, key, { ...draft, photoTargetId: draft.photoTargetId ?? key }));
}

function measure(system: WettSystemType, key: string, draft: Draft) {
  measurements.set(`${system}:${key}`, guide(system, `measure-${key}`, draft));
}

const depositCaution =
  "Cleaning follows the combustible deposits you can see. A date more than 12 months ago does not set Cleaning Required. Inspection interval and cleaning stay separate.";

group("wood-stove", "appliance", {
  title: "Wood stove",
  summary: "Inspect the stove you can see: firebox, door, and air path.",
  checks: ["Firebrick or refractory", "Baffle", "Door, glass, and gaskets", "Air controls", "Observed damage or modification"],
  caution: "A crack, worn gasket, or mark is an observation. It does not set Not Compliant by itself.",
});

item("wood-stove", "ws-firebrick", {
  title: "Firebrick / refractory",
  summary: "Inspect the firebox lining that is visible.",
  checks: ["Cracks", "Missing pieces", "Loose brick", "Spalling", "Previous repairs"],
  caution: "Record the crack you see. Do not turn a small crack into a failure without the requirement that applies to this stove.",
});

item("wood-stove", "ws-baffle", {
  title: "Baffle",
  summary: "Inspect the baffle and internal plates where the firebox can be seen.",
  checks: ["Present and seated", "Cracks or warping", "Missing pieces", "Blocked flow path"],
  caution: "If the baffle is hidden by the firebox design, use UTI on the baffle only.",
});

item("wood-stove", "ws-door", {
  title: "Door / glass / gasket",
  summary: "Inspect the door assembly you can see.",
  checks: ["Glass condition", "Cracks or damage", "Door alignment", "Latch", "Door gasket", "Glass gasket", "Visible overheating"],
  caution: "A worn gasket is an observed maintenance condition. Do not turn it into a code deficiency unless the applicable requirement supports that conclusion.",
});

item("wood-stove", "ws-air", {
  title: "Air controls",
  summary: "Inspect the air controls that are part of this stove.",
  checks: ["Controls move", "Broken or seized parts", "Blocked inlets", "Modifications"],
  caution: "Do not judge burn performance from the control position alone.",
});

group("wood-stove", "clearances", {
  title: "Clearances",
  summary: "Record the clearances this installation uses, then compare them only to a verified requirement for this model.",
  checks: ["Side, rear, corner, ceiling, or alcove clearances that apply", "What the clearance is measured from"],
  caution: "Do not substitute a generic clearance table for the certified clearance.",
  manufacturerDependent: true,
});

group("wood-stove", "combustion-air", {
  title: "Combustion air",
  summary: "Record the Alberta combustion-air and depressurization observations for this installation.",
  checks: ["Air supply that was observed", "Signs of poor draft or spillage that were observed"],
  caution: "Keep this as an Alberta observation. Do not import another province's outdoor-air rule.",
});

group("wood-stove", "fire-code", {
  title: "Combustible deposits",
  summary: "Decide whether this stove system needs cleaning from the deposits you can see.",
  checks: ["Soot", "Flaky deposits", "Glazed creosote", "Heavy accumulation", "Blockage in the accessible path"],
  caution: depositCaution,
});

group("wood-stove", "chimney-masonry", {
  title: "Masonry chimney",
  summary: "Inspect the accessible masonry chimney and connector path serving this stove.",
  checks: ["Flue pipe or connector", "Visible flue or liner", "Masonry condition", "Termination you can see"],
  caution: "A concealed length is UTI for that length only. Do not call the whole chimney compliant from the stove room.",
});

group("wood-stove", "chimney-chase", {
  title: "Factory-built pipe in a chase",
  summary: "Inspect the accessible factory-built chimney that runs inside a chase.",
  checks: ["Pipe and joints", "Supports", "Firestops and attic shield where accessible", "Chase top, flashing, storm collar, and termination"],
  caution: "This is not a masonry crown. A closed chase interior is UTI for the part you cannot see.",
  manufacturerDependent: true,
});

group("wood-stove", "chimney-direct", {
  title: "Factory-built pipe through the roof",
  summary: "Inspect the exposed factory-built chimney on the direct roof route.",
  checks: ["Pipe and joints", "Ceiling support and shields", "Flashing, storm collar, and termination"],
  caution: "Do not add a chase cover or a masonry crown when this route has neither.",
  manufacturerDependent: true,
});

group("wood-stove", "chimney-unknown", {
  title: "Chimney route",
  summary: "The chimney route is not established yet.",
  checks: ["What can be seen from the appliance", "Whether the route is masonry, chase, or direct"],
  caution: "Do not complete chase, direct-pipe, or crown items for a route that was not identified.",
});

measure("wood-stove", "hearth", {
  title: "Hearth / floor protection",
  summary: "Record the floor protection under and in front of this stove.",
  checks: ["Front and side extensions", "Protection type", "Thermal requirement only when the verified source asks for it"],
  caution: "Tile or a noncombustible look is not proof of thermal protection.",
  manufacturerDependent: true,
});

measure("wood-stove", "connector", {
  title: "Connector",
  summary: "Inspect and measure the flue pipe or connector between the stove and the chimney.",
  checks: ["Diameter", "Clearance to combustibles", "Horizontal run", "Rise or slope", "Joints and fasteners you can see"],
  caution: "Use the stove manual, the listed connector instructions, or CSA B365-17 where that source applies. Do not invent the required clearance.",
  manufacturerDependent: true,
});

measure("wood-stove", "mantel", {
  title: "Mantel",
  summary: "If a mantel is present, record its material and the combustible clearance from the source that applies to this stove.",
  checks: ["Present or absent", "Combustible, non-combustible, or unknown", "Projection and vertical distance only when the mantel is combustible"],
  caution: "Do not calculate a clearance from mantel depth or projection.",
  manufacturerDependent: true,
});

measure("wood-stove", "chimney-masonry", {
  title: "Chimney measurements",
  summary: "Record masonry chimney dimensions that were actually measured.",
  checks: ["Flue or liner size", "Termination height", "Nearby roof relationship"],
  caution: "Leave a dimension blank when it was not measured. Do not convert a blank into Compliant.",
});

measure("wood-stove", "chimney-factory", {
  title: "Factory-built chimney measurements",
  summary: "Record dimensions the chimney manufacturer requires, when they were measured.",
  checks: ["Diameter", "Height", "Required clearances", "Support or offset only when the manual asks"],
  caution: "These come from the chimney manufacturer, not from a masonry fireplace rule.",
  manufacturerDependent: true,
});

group("fireplace-insert", "appliance", {
  title: "Insert firebox",
  summary: "Inspect the insert that is installed in the fireplace.",
  checks: ["Firebrick or refractory", "Baffle", "Door and glass", "Gaskets", "Observed damage or modification"],
  caution: "A crack or worn gasket is an observation. It does not set Not Compliant by itself.",
});

item("fireplace-insert", "ins-firebrick", {
  title: "Insert firebox",
  summary: "Inspect the insert lining you can see.",
  checks: ["Cracks", "Missing pieces", "Loose brick", "Warping"],
  caution: "Do not judge a small crack as a failure without the insert manufacturer's requirement.",
  manufacturerDependent: true,
});

item("fireplace-insert", "ins-glass", {
  title: "Door / glass",
  summary: "Inspect the insert door and glass.",
  checks: ["Glass cracks or damage", "Door alignment", "Latch", "Gaskets", "Visible overheating"],
  caution: "Gasket wear is a maintenance observation unless a verified requirement says otherwise.",
});

group("fireplace-insert", "liner", {
  title: "Liner",
  summary: "Inspect the liner and the connection you can see. The liner is a component, not the chimney type.",
  checks: ["Accessible liner", "Adaptor and seal", "Alignment and support", "Damper modification where the original fireplace is masonry"],
  caution: "A hidden connection is UTI on that item only.",
  manufacturerDependent: true,
});

item("fireplace-insert", "ins-liner-connection", {
  title: "Liner connection",
  summary: "Inspect the adaptor, seal, alignment, and support where they can be seen.",
  checks: ["Adaptor seated", "Seal", "Alignment", "Support"],
  caution: "If the connection is concealed at this inspection level, use UTI on this item only. Do not mark the liner compliant from the termination.",
  manufacturerDependent: true,
});

item("fireplace-insert", "ins-damper-mod", {
  title: "Damper modification",
  summary: "Record whether the original damper was modified or removed, where that can be seen.",
  checks: ["Damper still present", "Blocked, removed, or clamped", "How the liner passes the damper area"],
  caution: "If the insert hides the damper, use UTI on this item only.",
});

group("fireplace-insert", "original", {
  title: "Original fireplace",
  summary: "Inspect only the original fireplace parts the insert still leaves visible.",
  checks: ["Damper", "Smoke chamber", "Modifications that were observed"],
  caution: "Do not describe a hidden smoke chamber as compliant.",
});

item("fireplace-insert", "ins-smoke", {
  title: "Smoke chamber access",
  summary: "Inspect the original smoke chamber only where it can be seen around the insert.",
  checks: ["Visible masonry", "Cracks or open joints", "Obstructions", "Combustible intrusion where visible"],
  caution: "If the insert or surround hides the chamber, use UTI on this item only. Do not assume the hidden chamber is compliant.",
});

group("fireplace-insert", "chimney-masonry", {
  title: "Chimney",
  summary: "Inspect the accessible masonry chimney above the insert and liner.",
  checks: ["Visible flue or liner", "Masonry", "Flashing", "Termination"],
  caution: "The liner is not the chimney. Concealed chimney length is UTI for that length only.",
});

group("fireplace-insert", "chimney-chase", {
  title: "Factory-built chimney",
  summary: "Inspect the accessible factory-built chimney serving this insert.",
  checks: ["Pipe and joints", "Supports and shields", "Termination"],
  caution: "Do not apply masonry crown items to factory-built pipe.",
  manufacturerDependent: true,
});

group("fireplace-insert", "chimney-direct", {
  title: "Factory-built pipe through the roof",
  summary: "Inspect the exposed factory-built route.",
  checks: ["Pipe and joints", "Supports", "Flashing, storm collar, and termination"],
  caution: "Do not add chase or crown items that this route does not have.",
  manufacturerDependent: true,
});

group("fireplace-insert", "chimney-unknown", {
  title: "Chimney route",
  summary: "The chimney route for this insert is not established.",
  checks: ["Original fireplace type", "What chimney material is visible"],
  caution: "Do not complete a chimney branch that was not identified.",
});

measure("fireplace-insert", "hearth", {
  title: "Hearth",
  summary: "Record the hearth extension this insert requires and what was measured.",
  checks: ["Front and side extensions", "Raised-insert condition when it applies"],
  caution: "Insert hearth requirements can be manufacturer-specific. Do not reuse a generic masonry hearth dimension.",
  manufacturerDependent: true,
});

measure("fireplace-insert", "facing-mantel", {
  title: "Mantel / facing",
  summary: "Record mantel and facing clearances from the insert manufacturer's instructions.",
  checks: ["Mantel present", "Mantel material", "Combustible clearance and projection when the mantel is combustible", "Top and side facing"],
  caution: "These clearances are model-specific. Do not calculate them from mantel depth.",
  manufacturerDependent: true,
});

group("masonry-fireplace", "firebox", {
  title: "Firebox",
  summary: "Inspect the visible firebox masonry.",
  checks: ["Firebrick and mortar", "Cracks", "Spalling or missing brick", "Floor", "Previous repairs", "Combustible intrusion where visible"],
  caution: "A crack is an observation. It does not set Not Compliant by itself.",
});

group("masonry-fireplace", "damper", {
  title: "Damper",
  summary: "Inspect the damper that is visible.",
  checks: ["Present", "Operates", "Corrosion", "Deformation", "Obstruction", "Modification"],
  caution: "If the damper cannot be reached within this inspection level, use UTI on the damper only.",
});

group("masonry-fireplace", "smoke", {
  title: "Smoke chamber",
  summary: "Inspect the visible smoke-chamber masonry and the transition above the firebox.",
  checks: ["Cracks", "Open joints", "Deterioration", "Previous repairs", "Abrupt ledges or obstructions", "Combustible intrusion where visible"],
  accessGuidance: "Only classify what is visible within the selected inspection level. If the relevant area is concealed or inaccessible, use UTI for the smoke chamber.",
  evidenceGuidance: "Photograph any material defect or limitation.",
  caution: "Do not assume the concealed upper smoke chamber is compliant.",
});

group("masonry-fireplace", "opening", {
  title: "Hearth / opening",
  summary: "Inspect the hearth, opening, mantel, and nearby combustibles.",
  checks: ["Hearth cracks or gaps", "Exposed combustible flooring", "Mantel or trim present", "Combustible material at the opening"],
  caution: "Do not apply a current new-construction dimension automatically to a historic fireplace. Do not calculate a mantel clearance from its depth.",
});

group("masonry-fireplace", "chimney-masonry", {
  title: "Masonry chimney",
  summary: "Inspect the accessible chimney above this fireplace. Use the ? on each component for the specific check.",
  checks: ["Flue or liner", "Chimney masonry", "Crown", "Rain cap", "Flashing", "Cleanout"],
  caution: "A liner is a component, not a chimney type. Attic or concealed areas that were not accessed are UTI on that item only.",
});

group("masonry-fireplace", "air", {
  title: "Combustion air",
  summary: "Record the Alberta combustion-air observation for this fireplace.",
  checks: ["Air supply that was observed", "Room or makeup-air notes that were observed"],
  caution: "Keep the observation in Alberta practice.",
});

item("masonry-fireplace", "mf-flue", {
  title: "Flue / liner",
  summary: "Inspect the visible flue or liner.",
  checks: ["Joints", "Cracks", "Erosion", "Missing sections", "Deposits", "Obstruction"],
  caution: "A concealed length is UTI for that length only. Do not describe a hidden liner as measured or compliant.",
});

item("masonry-fireplace", "mf-masonry", {
  title: "Chimney masonry",
  summary: "Inspect accessible brick, block, or stone.",
  checks: ["Mortar", "Spalling", "Cracking", "Leaning or separation", "Previous repairs", "Water damage"],
  caution: "Record what you can reach. Do not grade concealed masonry from the ground.",
});

item("masonry-fireplace", "mf-crown", {
  title: "Crown",
  summary: "Inspect the masonry crown on this chimney.",
  checks: ["Cracks", "Slope", "Bond to the flue", "Deteriorated mortar"],
  caution: "Use the crown item only on a masonry chimney. Do not call a chase cover a crown.",
});

item("masonry-fireplace", "mf-termination", {
  title: "Rain cap / termination",
  summary: "Record the termination device that was visible.",
  checks: ["Cap or no cap", "Screen", "Damage", "Obstruction"],
  caution: "Do not invent a height that was not measured.",
});

item("masonry-fireplace", "mf-flashing", {
  title: "Flashing",
  summary: "Inspect accessible flashing and how it meets the roof.",
  checks: ["Open seams", "Rust", "Pulled fasteners", "Gaps at the chimney"],
  caution: "If the roof edge cannot be reached safely, use UTI on flashing only.",
});

item("masonry-fireplace", "mf-cleanout", {
  title: "Cleanout",
  summary: "Inspect the cleanout where this chimney has one.",
  checks: ["Door present", "Closes", "Frame condition", "Debris blocking the opening"],
  caution: "If no cleanout was found and the base is concealed, say what you could not see. Do not invent a cleanout.",
});

measure("masonry-fireplace", "hearth", {
  title: "Hearth",
  summary: "Record the hearth extensions that were measured.",
  checks: ["Front extension", "Side extensions", "Gaps or combustible flooring at the hearth edge"],
  caution: "Where the current Alberta masonry fireplace provision applies, it is context for the measurement. Do not mark an older installation Not Compliant from that baseline alone.",
});

measure("masonry-fireplace", "mantel", {
  title: "Mantel / combustibles",
  summary: "Inspect combustible material at the masonry fireplace opening.",
  checks: ["Mantel present", "Combustible, non-combustible, or unknown", "Height above the opening and projection when the mantel is combustible", "Trim and other projections"],
  caution: "Use the fireplace-opening combustible provision that applies, including historical applicability. Do not calculate a clearance from mantel depth, and do not use a factory-built model clearance.",
});

measure("masonry-fireplace", "flue", {
  title: "Flue / liner",
  summary: "Record flue dimensions and liner condition that were observable.",
  checks: ["Flue size", "Liner top projection", "Visible liner condition"],
  caution: "Concealed liner dimensions are not measured values.",
});

measure("masonry-fireplace", "crown", {
  title: "Crown / termination height",
  summary: "Record crown and termination measurements that were taken.",
  checks: ["Crown drip", "Height above the roof", "Nearby roof or structure"],
  caution: "Leave a height blank when it was not measured.",
});

group("factory-built-fireplace", "model", {
  title: "Model identification",
  summary: "Identify the listed fireplace before using a model-specific requirement.",
  checks: ["Manufacturer", "Model", "Serial", "Certification label", "Listing"],
  accessGuidance: "A missing label is not UTI. Check again, then record whether another identity source exists.",
  caution: "Do not guess the model from the facing. If there is no reliable identity, the model-specific requirement stays not verified.",
  manufacturerDependent: true,
});

group("factory-built-fireplace", "manual", {
  title: "Manufacturer manual",
  summary: "Record the manual when it is established.",
  checks: ["Title", "Part or revision", "Date"],
  accessGuidance: "A missing manual is a manufacturer-lookup limit, not UTI.",
  caution: "Do not invent a manual revision.",
  manufacturerDependent: true,
});

group("factory-built-fireplace", "firebox", {
  title: "Firebox",
  summary: "Inspect the factory-built firebox components you can see.",
  checks: ["Refractory", "Grate", "Doors or screens", "Air passages", "Shell condition", "Modifications"],
  caution: "There is no universal crack or door rule. The listing and manual control the conclusion.",
  manufacturerDependent: true,
});

item("factory-built-fireplace", "fb-refractory", {
  title: "Refractory / firebox components",
  summary: "Inspect the factory refractory and the firebox parts around it.",
  checks: ["Refractory panels", "Missing pieces", "Significant cracks", "Warping", "Grate", "Doors or screens", "Air passages", "Unauthorized modifications"],
  caution: "The exact manufacturer instructions determine whether a crack or damaged panel requires replacement. Do not automatically classify every small refractory crack as Not Compliant.",
  manufacturerDependent: true,
});

item("factory-built-fireplace", "fb-grate", {
  title: "Grate",
  summary: "Inspect the grate where this model has one.",
  checks: ["Present", "Warped or burned through", "Not the listed grate"],
  caution: "If this model has no grate, use N/A. Do not treat a missing grate as a defect until the manual says one is required.",
  manufacturerDependent: true,
});

item("factory-built-fireplace", "fb-doors", {
  title: "Doors / screens",
  summary: "Inspect doors and screens against this model's listing.",
  checks: ["Present as listed", "Glass or screen damage", "Alignment", "Latch", "Substituted parts"],
  caution: "There is no universal door or screen configuration.",
  manufacturerDependent: true,
});

item("factory-built-fireplace", "fb-air-passages", {
  title: "Air passages",
  summary: "Inspect air passages, louvers, and cooling-air openings that are part of this model.",
  checks: ["Openings blocked", "Crushed louvers", "Facing covering a required opening", "Modifications"],
  caution: "Do not decide that an opening is required from appearance. Use the manual when the question is model-specific.",
  manufacturerDependent: true,
});

group("factory-built-fireplace", "compatibility", {
  title: "Component compatibility",
  summary: "Record whether the chimney and fireplace components were identified as compatible.",
  checks: ["Fireplace listing", "Chimney brand and series", "Mixed or unknown parts"],
  caution: "Unknown compatibility stays not verified. Do not pass it from a similar-looking system.",
  manufacturerDependent: true,
});

group("factory-built-fireplace", "air", {
  title: "Outdoor air / combustion air",
  summary: "Record the Alberta outdoor-air or combustion-air observation for this fireplace.",
  checks: ["Outside-air inlet if this model uses one", "Blockage or disconnection that was seen"],
  caution: "Follow this model's instructions and Alberta practice.",
  manufacturerDependent: true,
});

group("factory-built-fireplace", "chimney-chase", {
  title: "Pipe / chimney in a chase",
  summary: "Inspect the accessible factory-built chimney inside the chase.",
  checks: ["Pipe sections and joints", "Supports and offsets", "Firestops", "Attic insulation shield", "Chase clearance", "Chase top, flashing, storm collar, and termination"],
  caution: "A chase cover is not a masonry crown. Concealed pipe is UTI for that section only.",
  manufacturerDependent: true,
});

item("factory-built-fireplace", "fb-chase-pipe", {
  title: "Pipe / chimney",
  summary: "Inspect visible factory-built pipe sections and joints.",
  checks: ["Locking joints", "Bands", "Separation", "Dents", "Corrosion"],
  caution: "Do not mark concealed pipe compliant from the exposed termination.",
  manufacturerDependent: true,
});

item("factory-built-fireplace", "fb-chase-supports", {
  title: "Supports",
  summary: "Inspect accessible supports and offsets.",
  checks: ["Support present where visible", "Offset elbows", "Movement or missing fasteners"],
  caution: "Do not assume a concealed support is present.",
  manufacturerDependent: true,
});

item("factory-built-fireplace", "fb-chase-shields", {
  title: "Firestops and attic insulation shield",
  summary: "Inspect accessible firestops and the attic insulation shield.",
  checks: ["Firestop at the ceiling or floor", "Attic shield", "Insulation kept out of the required space"],
  caution: "If the attic was not accessed, use UTI on this item only.",
});

item("factory-built-fireplace", "fb-chase-clearance", {
  title: "Chase",
  summary: "Record accessible pipe clearance inside the chase.",
  checks: ["Clearance you can see", "Combustibles in the chase", "Finished surfaces that block the view"],
  caution: "A finished chase you cannot see is UTI for that concealed clearance.",
  manufacturerDependent: true,
});

item("factory-built-fireplace", "fb-chase-cover", {
  title: "Flashing, storm collar, and termination",
  summary: "Inspect the chase top, flashing, storm collar, and termination.",
  checks: ["Chase cover", "Flashing", "Storm collar", "Cap", "Nearby roof clearance you can see"],
  caution: "This is not a masonry crown.",
  manufacturerDependent: true,
});

group("factory-built-fireplace", "chimney-direct", {
  title: "Pipe through the roof",
  summary: "Inspect the exposed factory-built chimney. There is no chase on this route.",
  checks: ["Pipe and joints", "Ceiling support", "Firestop and attic shield", "Flashing, storm collar, and termination"],
  caution: "Do not inspect a chase cover or a masonry crown on this route.",
  manufacturerDependent: true,
});

item("factory-built-fireplace", "fb-direct-supports", {
  title: "Supports and shields",
  summary: "Inspect the ceiling support, firestop, and attic insulation shield where this route uses them.",
  checks: ["Ceiling support", "Firestop", "Attic shield"],
  caution: "Use UTI only for the shield or support you cannot access.",
});

item("factory-built-fireplace", "fb-direct-roof", {
  title: "Flashing, storm collar, and termination",
  summary: "Inspect roof flashing, the storm collar, and the termination.",
  checks: ["Flashing", "Storm collar", "Cap", "Distance to a nearby roof or structure that was seen"],
  caution: "Do not add a chase cover or masonry crown.",
  manufacturerDependent: true,
});

group("factory-built-fireplace", "chimney-unknown", {
  title: "Chimney route",
  summary: "The factory-built chimney route is not verified.",
  checks: ["Chase or direct path", "What is visible at the ceiling and roof"],
  caution: "Do not complete chase or direct-pipe items until the route is known.",
});

measure("factory-built-fireplace", "manufacturer-clearances", {
  title: "Mantel / facing",
  summary: "Record mantel, facing, and side clearances from this model's instructions.",
  checks: ["Mantel present", "Mantel material", "Height and projection when the mantel is combustible", "Side and top facing clearances this model uses"],
  caution: "This clearance is model-specific. Do not calculate it from mantel depth, and do not reuse a masonry fireplace opening rule.",
  manufacturerDependent: true,
});

measure("factory-built-fireplace", "hearth", {
  title: "Hearth",
  summary: "Record the hearth extension this model requires and what was measured.",
  checks: ["Front", "Sides"],
  caution: "Use the manufacturer hearth requirement. Do not substitute the masonry 400 mm / 200 mm baseline.",
  manufacturerDependent: true,
});

measure("factory-built-fireplace", "firebox", {
  title: "Refractory components",
  summary: "These measurement-section checks are the firebox parts. Classify them from the manufacturer instructions.",
  checks: ["Panels", "Cracks", "Missing pieces", "Air passages", "Modifications"],
  caution: "Do not automatically classify every small refractory crack as Not Compliant.",
  manufacturerDependent: true,
});

measure("factory-built-fireplace", "doors", {
  title: "Doors / screens",
  summary: "Compare the doors or screen with the listing.",
  checks: ["Present", "Type", "Condition", "Listed component"],
  caution: "There is no universal screen rule for a factory-built fireplace.",
  manufacturerDependent: true,
});

measure("factory-built-fireplace", "chimney", {
  title: "Pipe / chimney",
  summary: "Record chimney dimensions the manufacturer requires, when they were measured.",
  checks: ["Diameter", "Height", "Roof relationship", "Framing clearance only where accessible"],
  caution: "Do not invent a required clearance.",
  manufacturerDependent: true,
});

function cleaningGuide(system: WettSystemType, summary: string, checks: string[]) {
  cleaning.set(
    system,
    guide(system, "cleaning", {
      title: "Combustible deposits",
      summary,
      checks,
      caution: depositCaution,
      photoTargetId: "cleaning-deposits",
    }),
  );
}

cleaningGuide("wood-stove", "Look for combustible deposits in the stove, the connector, and the accessible chimney.", [
  "Firebox where it matters",
  "Flue pipe or connector",
  "Accessible chimney or flue",
]);
cleaningGuide("fireplace-insert", "Look for combustible deposits in the insert, the liner, and the accessible chimney.", [
  "Insert firebox",
  "Liner and the visible connection",
  "Termination and accessible chimney",
]);
cleaningGuide("masonry-fireplace", "Look for combustible deposits in the firebox, the visible smoke chamber, and the accessible flue.", [
  "Firebox",
  "Smoke chamber where visible",
  "Flue or liner",
  "Accessible chimney",
]);
cleaningGuide("factory-built-fireplace", "Look for combustible deposits in the firebox and the accessible factory-built chimney.", [
  "Firebox or refractory area",
  "Factory-built chimney or pipe",
  "Accessible termination",
]);

export const FIELD_GUIDE_TOPICS: WettHelpGuidance[] = [
  guide("shared", "status", {
    title: "How statuses work",
    summary: "The status records your conclusion for that item.",
    checks: ["Compliant means the item met the requirement you verified", "Not Compliant needs the observation and the source that supports it", "N/A means the item does not apply", "UTI means the item exists but could not be inspected"],
    caution: "A visual note of no visible deficiency does not set Compliant. The form does not set Not Compliant for you.",
  }),
  guide("shared", "uti", {
    title: "When to use UTI",
    summary: "UTI is for an item that exists but cannot be inspected.",
    checks: ["Concealed", "Inaccessible", "Unsafe access", "Beyond the inspection level", "Another real access limit"],
    caution: "Do not use UTI for a missing manual, an unknown model, a missing tag, an unresolved source, or a forgotten measurement.",
  }),
  guide("shared", "photo", {
    title: "How photo evidence works",
    summary: "A photo proves the observation you record. It attaches to that inspection item.",
    checks: ["Take the photo on the item it belongs to", "Use an existing report photo only when it shows that item"],
    caution: "A photo is strongly encouraged for a serious defect. It is not labeled as an official WETT mandatory photo, and it does not by itself set the status.",
  }),
  guide("shared", "lookup", {
    title: "How Manufacturer Lookup works",
    summary: "Use lookup when the requirement depends on the exact manufacturer and model.",
    checks: ["Confirm the model first", "Ask for the requirement", "Read the result", "Use the requirement only if you accept it"],
    caution: "Phoenix does not invent a clearance. If no verified match is on file, the requirement stays not verified. Official manufacturer portals are not searched from this screen.",
    manufacturerDependent: true,
  }),
  guide("shared", "rewrite", {
    title: "How AI Rewrite works",
    summary: "Rewrite with AI can improve wording you already wrote.",
    checks: ["Your original text stays stored", "Read the candidate", "Accept it only if it still says what you observed"],
    caution: "AI must not change a status, a measurement, a deposit level, or a cleaning assessment. It must not invent a defect.",
  }),
  guide("shared", "recommendation", {
    title: "How recommendations work",
    summary: "A recommendation is the corrective option you attach to a recorded issue.",
    checks: ["It stays linked to the inspection item or finding", "Cleaning recommended and cleaning required appear here only when you select them"],
    caution: "If nothing needs correction, this section can stay off the report.",
  }),
  guide("shared", "complete", {
    title: "How to complete a report",
    summary: "Finish the sections, then review and finalize.",
    checks: ["Identity", "Each applicable inspection item", "Measurements you recorded", "Cleaning assessment from what you saw", "Your sign-off"],
    caution: "Help does not have to be opened to continue. Finalizing still needs the recorded inspection, not a guessed status.",
  }),
];

const shared = new Map(FIELD_GUIDE_TOPICS.map((topic) => [topic.id.replace("shared:", ""), topic]));

export function inspectionGroupHelp(systemType: WettSystemType | undefined, groupId: string) {
  if (!systemType) return undefined;
  return groups.get(`${systemType}:${groupId}`);
}

export function inspectionItemHelp(systemType: WettSystemType | undefined, itemId: string) {
  if (!systemType) return undefined;
  return items.get(`${systemType}:${itemId}`);
}

export function measurementGroupHelp(systemType: WettSystemType | undefined, groupId: string) {
  if (!systemType) return undefined;
  return measurements.get(`${systemType}:${groupId}`);
}

export function cleaningHelp(systemType: WettSystemType | undefined) {
  if (!systemType) return undefined;
  return cleaning.get(systemType);
}

export function sharedHelp(topic: "status" | "uti" | "photo" | "lookup" | "rewrite" | "recommendation" | "complete" | "finding") {
  if (topic === "finding") {
    return guide("shared", "finding", {
      title: "Additional finding",
      summary: "Use this for an observed issue that is not already an inspection item.",
      checks: ["What you saw", "Where it is", "A photo of that condition"],
      caution: "Do not add a finding from help text. Record only what you observed.",
    });
  }
  return shared.get(topic);
}

export function helpCatalog() {
  return [...groups.values(), ...items.values(), ...measurements.values(), ...cleaning.values(), ...FIELD_GUIDE_TOPICS];
}

export function helpContextFromReport(
  report: Pick<WettReport, "system" | "venting" | "inspection">,
  extra: {
    helpId: string;
    helpTitle: string;
    currentSection?: string;
    inspectionGroup?: string;
    inspectionItem?: string;
    currentStatus?: string;
  },
): TechnicianHelpContext {
  const system = report.system;
  const listed = system.type && system.type !== "masonry-fireplace" ? system : undefined;
  return {
    business: "Phoenix",
    province: "Alberta",
    systemType: system.type,
    systemLabel: workflowFor(system.type)?.label,
    currentSection: extra.currentSection,
    inspectionGroup: extra.inspectionGroup,
    inspectionItem: extra.inspectionItem,
    chimneyConfiguration: system.type ? activeChimneyRoute(report) : undefined,
    manufacturer: listed?.manufacturer,
    model: listed?.model,
    listingStatus: listed?.listingStatus,
    inspectionLevel: report.inspection.inspectionLevel,
    currentStatus: extra.currentStatus,
    helpId: extra.helpId,
    helpTitle: extra.helpTitle,
  };
}

export const TECHNICIAN_HELP_RULES = [
  "You answer a Phoenix technician's question about the current check.",
  "Business is Phoenix. Province is Alberta.",
  "Explain, guide, and suggest what to inspect or photograph.",
  "You may name the likely source category, such as the manufacturer manual, the listing, or Alberta code, only as a path to verify.",
  "You may point the technician to Manufacturer Lookup when the item is model-specific.",
  "Do not invent an observation, measurement, photo, model, source document, or code clause.",
  "Do not change inspection status or any technician input.",
  "Do not create a finding.",
  "Do not create a recommendation.",
  "Do not finalize a WETT conclusion.",
  "Do not write that Alberta law requires annual chimney sweeping or one sweep every year.",
  "Do not apply Ontario installation rules.",
  "Keep the answer short.",
  "Return JSON with exactly these fields: quickAnswer, verifyNext, sourcePath, caution.",
];

export function technicianHelpSystemPrompt() {
  return TECHNICIAN_HELP_RULES.join(" ");
}

export const AI_HELP_UNAVAILABLE = "AI help is currently unavailable. The field guide remains available.";

export function readTechnicianHelpAnswer(value: unknown): TechnicianHelpAnswer | undefined {
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  const quickAnswer = typeof record.quickAnswer === "string" ? record.quickAnswer.trim() : "";
  const sourcePath = typeof record.sourcePath === "string" ? record.sourcePath.trim() : "";
  const caution = typeof record.caution === "string" ? record.caution.trim() : "";
  const verifyNext = Array.isArray(record.verifyNext) ? record.verifyNext.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0).map((entry) => entry.trim()).slice(0, 6) : [];
  if (!quickAnswer || !sourcePath || !caution) return undefined;
  return { quickAnswer, verifyNext, sourcePath, caution };
}
