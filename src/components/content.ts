import { Bi } from "./lang";

/* ============================================================
   EQUALITY ENGINE — content backbone
   All bilingual data lives here; components are pure presentation.
   A civilization-scale exploration of equality, hierarchy, justice,
   rights, power, opportunity and the coordination systems that hold
   complex societies together. Educational and comparative — it takes
   no ideology as the final word.

   Accent keys map to the institutional palette:
     azure = equality / coordination (the primary)
     gold  = law / justice / rights
     cyan  = economy / wealth / mobility
     rose  = power / hierarchy / resentment (the tension pole)
     aura  = technology / AI / the integrative future
     silver= neutral institutional
   ============================================================ */

export type AccentKey = "azure" | "gold" | "cyan" | "rose" | "aura" | "silver";
export const ACCENT: Record<AccentKey, string> = {
  azure: "#5b8cff",
  gold: "#e3b24f",
  cyan: "#3fd1c7",
  rose: "#ff6f91",
  aura: "#9b8cff",
  silver: "#c2cce4",
};

/* ---------- The three great tensions every civilization negotiates ---------- */
export type Tension = { key: AccentKey; left: Bi; right: Bi; han: string; gloss: Bi; question: Bi };
export const TENSIONS: Tension[] = [
  {
    key: "azure", han: "衡", left: { en: "Equality", zh: "平等" }, right: { en: "Hierarchy", zh: "等级" },
    gloss: { en: "Flat structures share dignity and dampen abuse, but large groups need someone to decide. Every society chooses how steep its ladder may be — and who is allowed to climb it.", zh: "扁平的结构分享尊严、抑制滥权，但庞大的群体需要有人做决定。每个社会都在抉择：它的阶梯可以多陡——又允许谁去攀登。" },
    question: { en: "How much hierarchy can equality survive?", zh: "平等能承受多少等级？" },
  },
  {
    key: "cyan", han: "序", left: { en: "Freedom", zh: "自由" }, right: { en: "Coordination", zh: "协调" },
    gloss: { en: "Liberty lets each person pursue their own good; coordination lets millions act as one. Too little order and nothing scales; too much and the person disappears into the plan.", zh: "自由让每个人追求自己的善；协调让千百万人如一体行动。秩序太少则无物可成规模；太多则个人消融于计划之中。" },
    question: { en: "Whose plan, and who may say no?", zh: "谁的计划，又有谁能说不？" },
  },
  {
    key: "rose", han: "义", left: { en: "Merit", zh: "贤能" }, right: { en: "Solidarity", zh: "团结" },
    gloss: { en: "Reward effort and talent and you spur innovation — and breed a new aristocracy of the gifted. Guarantee the floor for all and you protect dignity — and may dull the spur. Justice lives in the negotiation.", zh: "奖赏努力与天赋，便能激励创新——也孕育出一个「天才的新贵族」。为所有人保障底线，便守护了尊严——却可能磨钝了激励。正义，活在二者的协商之中。" },
    question: { en: "What is earned, and what is owed?", zh: "什么是挣得的，什么是亏欠的？" },
  },
];

/* ---------- 01–09 systems (the meta-model is the 10th, rendered separately) ---------- */
export type Section = { num: string; id: string; title: Bi; sub: Bi; body: Bi; accent: AccentKey };
export const SECTIONS: Section[] = [
  {
    num: "01", id: "origin", accent: "azure",
    title: { en: "The Origin of Equality", zh: "平等的起源" },
    sub: { en: "How coordination became cooperation", zh: "协调如何成为合作" },
    body: {
      en: "Equality was not handed down by philosophers; it was forged by survival. For most of human history we lived in small bands that were fiercely, deliberately equal — not because they were gentle, but because no one could afford a tyrant. Hunter-gatherers police would-be bullies with ridicule, disobedience and, in the last resort, the spear: a reverse dominance hierarchy in which the group dominates the strongman. Then agriculture let surplus be stored, stored surplus could be seized, and the seized surplus built the first kings. Every coordination system since — empire, church, market, constitution, network — is another answer to the same question our ancestors faced around a fire: how do we act together without one of us swallowing the rest?",
      zh: "平等并非哲人颁布；它由生存锻造而成。在人类历史的大部分时间里，我们生活在小小的部落之中，那里激烈而刻意地平等——不是因为温良，而是因为没有人供养得起一个暴君。狩猎采集者用嘲笑、不服从、乃至最后的长矛来制衡潜在的霸者：一种「逆向支配等级」，由群体支配强人。随后，农业使盈余得以储存，储存的盈余可被夺取，被夺取的盈余建起了最早的君王。此后每一种协调系统——帝国、教会、市场、宪法、网络——都是对我们祖先在火堆旁面对的同一问题的又一次作答：我们如何共同行动，而不让其中一人吞噬其余？",
    },
  },
  {
    num: "02", id: "biology", accent: "rose",
    title: { en: "Biology, Hierarchy & Human Nature", zh: "生物学、等级与人性" },
    sub: { en: "Is the ladder written in us?", zh: "阶梯是否写在我们体内？" },
    body: {
      en: "Look across social species and hierarchy is everywhere — but so is its opposite. Chimpanzees run despotic regimes of an alpha and his coalition; bonobos, our equally close cousins, are held flat by female alliances; wolves negotiate; ants have castes but no bosses. Humans are the strange animal that contains all of these at once. We carry ancient circuits for dominance and submission, and we carry just as ancient instincts for fairness, reciprocity and outrage at the cheat. The honest answer to 'is hierarchy inevitable?' is that some structure is, but its steepness is not. We are not condemned to kings, nor capable of pure flatness. We are built to argue, endlessly, about the slope.",
      zh: "环视社会性物种，等级无处不在——但它的反面同样如此。黑猩猩实行由一个雄性首领及其同盟把持的专制；倭黑猩猩，与我们同样亲近的表亲，却被雌性联盟压成扁平；狼群相互协商；蚂蚁有种姓却无上司。人类是同时容纳这一切的奇异动物。我们携带着关于支配与臣服的古老回路，也携带着同样古老的本能——公平、互惠，以及面对欺骗者时的义愤。对「等级是否不可避免」最诚实的回答是：某种结构不可避免，但它的陡峭程度并非如此。我们既未被判处君王，也无能力达成纯粹的扁平。我们生来，就是要无尽地争论那道斜坡。",
    },
  },
  {
    num: "03", id: "law", accent: "gold",
    title: { en: "Justice, Rights & Law", zh: "正义、权利与法律" },
    sub: { en: "Fairness, written down and enforced", zh: "被写下并被执行的公平" },
    body: {
      en: "A right is a promise a society makes to itself: that some treatment of a person is off the table no matter who holds power today. Law is how that promise is made enforceable — fairness given teeth. The arc is long and uneven. Hammurabi's code still priced a commoner's eye below a noble's; Roman law invented the citizen and excluded the slave; Magna Carta bound a king for the first time; the great declarations of the eighteenth and twentieth centuries reached for the radical claim that rights belong to a person simply for being one. Legal traditions differ — common law reasons from cases, civil law from codes, Islamic law from revealed principle, Confucian order from ritual and role — but each is an attempt to replace the rule of the strongest with the rule of something that does not move when the strong push on it.",
      zh: "权利，是一个社会对自身许下的承诺：对一个人的某些对待是不可逾越的，无论今日谁掌握权力。法律，是使这一承诺得以执行的方式——被赋予牙齿的公平。这道弧线漫长而崎岖。汉谟拉比法典仍把平民的眼睛标价于贵族之下；罗马法发明了「公民」，却排斥了奴隶；《大宪章》第一次约束了国王；十八与二十世纪的伟大宣言，伸手去够那个激进的主张——权利属于一个人，仅仅因为他是一个人。各法律传统彼此相异——普通法从判例推理，大陆法从法典，伊斯兰法从启示的原则，儒家秩序从礼与角色——但每一种都是一次尝试：以某种「当强者推它时不会移动」之物的统治，取代最强者的统治。",
    },
  },
  {
    num: "04", id: "economy", accent: "cyan",
    title: { en: "Economic Equality & Wealth", zh: "经济平等与财富" },
    sub: { en: "The distribution problem", zh: "分配难题" },
    body: {
      en: "Wealth concentrates the way water flows downhill: returns to capital outrun wages, advantages compound, and inheritance carries the result into the next generation before it has done anything. Left alone, almost every market economy drifts toward a few owning most — until war, revolution, plague or deliberate policy resets the board. Every system is a different answer to the same tension between innovation and fairness. Capitalism rewards risk and floods the world with goods, but lets the gap widen; socialism guarantees the floor, but can dull the engine; mixed economies tax and transfer to keep both alive at once; emerging decentralized economies promise to distribute the ledger itself. The hard truth is that there is no distribution that is simultaneously most productive, most equal and most free. A society chooses where on that surface to stand, and keeps choosing.",
      zh: "财富的集中如水之下流：资本的回报跑赢工资，优势复利累积，而继承在下一代尚未做任何事之前，便已把结果交到他们手中。若放任不管，几乎每一个市场经济都漂向「少数人占有大部分」——直到战争、革命、瘟疫或刻意的政策重置了棋盘。每一种制度，都是对「创新与公平」这同一张力的不同作答。资本主义奖赏冒险、以货物淹没世界，却任由差距扩大；社会主义保障底线，却可能磨钝引擎；混合经济以税收与转移，试图同时让二者存活；新兴的去中心化经济，则许诺去分配账本本身。残酷的真相是：不存在一种分配能同时最高产、最平等、最自由。一个社会选择立足于那张曲面上的何处——并不断地，重新选择。",
    },
  },
  {
    num: "05", id: "opportunity", accent: "azure",
    title: { en: "Education, Opportunity & Mobility", zh: "教育、机会与流动" },
    sub: { en: "Where you start vs. where you arrive", zh: "你的起点与你的归宿" },
    body: {
      en: "Most people will accept unequal outcomes if they believe the race was fair. So the deepest promise of a modern society is not equal results but equal opportunity — that a child's destiny should not be sealed by the accident of their birth. The promise is almost never kept. Education, the supposed great leveler, tracks the wealth of parents; networks open doors that talent cannot find the handle to; geography decides which schools and jobs a child can even see; and inherited advantage launders itself, in a single generation, into the appearance of merit. Perfect equality of opportunity may be impossible — it would require equalizing families, and we will not abolish the family. But the gap between the mobility a society promises and the mobility it delivers is one of the most reliable predictors of how angry it is about to become.",
      zh: "若人们相信赛跑是公平的，多数人能接受不平等的结果。因此，一个现代社会最深的承诺，并非结果的平等，而是机会的平等——一个孩子的命运，不应被其出生的偶然所封印。这承诺几乎从未被兑现。教育，这本应的「伟大拉平器」，却追随父母的财富；人脉打开了天赋摸不到把手的门；地理决定了一个孩子甚至能否看见哪些学校与工作；而被继承的优势，在一代人之内，便把自己漂白成「贤能」的模样。完美的机会平等或许不可能——它要求拉平家庭，而我们不会废除家庭。但一个社会所许诺的流动，与它实际兑现的流动之间的鸿沟，是「它即将有多愤怒」最可靠的预测指标之一。",
    },
  },
  {
    num: "06", id: "technology", accent: "aura",
    title: { en: "Technology, AI & Digital Inequality", zh: "技术、AI 与数字不平等" },
    sub: { en: "The new fault line", zh: "新的断层线" },
    body: {
      en: "Every general-purpose technology redraws the map of who has power. The printing press broke the clergy's monopoly on truth; the factory made some men owners and most men hands. Digital systems and AI are the latest redrawing, and they cut both ways. They can flatten — putting a library, a market and a university in every pocket. They can also concentrate as nothing before them: a handful of firms own the models, the data and the attention; an algorithm can encode a century of bias and apply it at the speed of light to millions who never see the rule that judged them; surveillance falls hardest on those with the least power to refuse it; and automation can sever the old link between contributing labor and earning a living. The question is not whether AI is good or bad for equality. It is who owns it, who is legible to it, and who gets to contest its verdicts.",
      zh: "每一种通用技术都会重绘「谁拥有权力」的地图。印刷术打破了神职阶层对真理的垄断；工厂使少数人成为所有者，使多数人成为「人手」。数字系统与 AI 是最新的一次重绘，而它双向切割。它能拉平——把一座图书馆、一个市场、一所大学放进每个人的口袋。它也能以前所未有的方式集中：少数公司拥有模型、数据与注意力；一个算法能把一个世纪的偏见编码，并以光速施加于数百万从未见过那条审判自己之规则的人；监控最沉重地压在最无力拒绝它的人身上；而自动化，能斩断「贡献劳动」与「赚取生计」之间古老的连结。问题不在于 AI 对平等是好是坏。问题在于：谁拥有它，谁对它「可读」，又有谁能去申辩它的裁决。",
    },
  },
  {
    num: "07", id: "civilizations", accent: "gold",
    title: { en: "The Civilization Comparison Engine", zh: "文明比较引擎" },
    sub: { en: "Many answers to one question", zh: "对同一问题的众多作答" },
    body: {
      en: "No civilization solved equality; each made a characteristic bargain. Athens invented citizen self-rule and rested it on a majority of slaves and the exclusion of women. Rome built a ladder a freed slave's grandson could climb to the Senate, and a machine of conquest beneath it. Imperial China opened the bureaucracy to talent through the most meritocratic exam the pre-modern world produced, inside a deeply hierarchical Confucian order. The Islamic caliphates granted striking legal protections and a charitable floor, structured by faith and status. Medieval Europe froze society into estates, then accidentally birthed the corporation, the university and the rights-bearing town. Modern liberal democracies declared everyone equal before the law while tolerating vast inequality of wealth. Compare them not to crown a winner but to see the trade-space — the menu of bargains humanity has actually tried.",
      zh: "没有任何文明解决了平等；每一个都做出了一笔具有自身特征的交易。雅典发明了公民自治，却把它建立在占多数的奴隶与对女性的排斥之上。罗马造了一道阶梯，一个被释奴隶的孙子可循之登上元老院，其下则是一台征服的机器。帝制中国以前现代世界所产生的最重贤能的考试，向才智者开放官僚体系，而这一切都在一个等级森严的儒家秩序之内。伊斯兰诸哈里发国授予了惊人的法律保护与一道慈善的底线，由信仰与身份所构造。中世纪欧洲把社会冻结为等级，却意外地诞生了公司、大学与拥有权利的城镇。现代自由民主宣告人人在法律面前平等，同时容忍着巨大的财富不平等。比较它们，不是为了加冕一个胜者，而是为了看见那片「取舍的空间」——人类实际尝试过的、那一份交易的菜单。",
    },
  },
  {
    num: "08", id: "psychology", accent: "rose",
    title: { en: "The Psychology of Fairness & Resentment", zh: "公平与怨恨的心理学" },
    sub: { en: "Equality as an emotion", zh: "作为情绪的平等" },
    body: {
      en: "Offer a monkey a cucumber for a task, then hand its neighbor a grape for the same task, and the first monkey will hurl the cucumber back in your face. The sense of fairness is older than our species, and it is not about absolute wealth — it is about relative standing, visible disrespect, and broken expectations. People will burn down a fortune they cannot share before they will watch a rival take it unjustly. This is why inequality destabilizes long before anyone starves: humiliation, exclusion and the spectacle of unearned privilege register as threats to the self. Resentment is not mere envy; often it is the moral sense detecting a violated bargain. A society that wants stability cannot only feed people. It must let them keep their dignity, see a fair process, and feel recognized — or the cucumber comes back.",
      zh: "为一只猴子完成一项任务而给它一根黄瓜，再为同样的任务递给它邻座一颗葡萄，第一只猴子会把黄瓜砸回你脸上。公平感比我们这一物种更古老，而它无关绝对的财富——它关乎相对的位置、可见的不敬，以及被打破的预期。人们宁可烧毁一笔自己无法分享的财富，也不愿眼看着对手不义地将其取走。这正是为何不平等远在有人挨饿之前便已动摇根基：羞辱、排斥，以及「不劳而获之特权」的景观，都被登记为对自我的威胁。怨恨并非单纯的嫉妒；它常常是道德感在侦测一桩被违背的交易。一个想要稳定的社会，不能只喂饱人。它必须让人保有尊严、看见公平的程序、感到被承认——否则，黄瓜便会飞回来。",
    },
  },
  {
    num: "09", id: "future", accent: "aura",
    title: { en: "Future Equality Systems", zh: "未来的平等系统" },
    sub: { en: "Equality when machines make the goods", zh: "当机器生产货物时的平等" },
    body: {
      en: "Run the engine forward into a world where intelligence is cheap and most production is automated. The link between labor and income — the spine of every economy for ten thousand years — may finally snap. That could mean a post-scarcity dawn: universal resource floors, digital citizenship, AI-managed allocation that no human cabal can capture, decentralized communities that govern themselves. Or it could mean the deepest inequality in history: a tiny class that owns the machines, a vast class that owns nothing the machines need, and a surveillance state of unprecedented reach. The technology does not choose; the ownership does. The same automation underwrites both utopia and a permanent aristocracy of capital. Which one arrives depends on decisions about power and distribution that are being made, right now, while the question still looks abstract.",
      zh: "让引擎向前运转，进入一个智能廉价、多数生产被自动化的世界。劳动与收入之间的连结——一万年来每一个经济体的脊梁——或许将终于断裂。那可能意味着一个后稀缺的黎明：普世的资源底线、数字公民身份、无任何人类小集团能够俘获的 AI 配置、自我治理的去中心化社群。它也可能意味着历史上最深的不平等：一个拥有机器的微小阶层，一个不拥有任何机器所需之物的庞大阶层，以及一个触角空前的监控国家。技术不做选择；所有权才做。同样的自动化，既为乌托邦、也为一个永久的资本贵族制背书。哪一个到来，取决于关于权力与分配的种种决定——它们正在此刻被做出，而这问题看上去尚且抽象。",
    },
  },
];

/* ---------- Concept panels per section ---------- */
export type Panel = { t: Bi; d: Bi; k?: AccentKey };
export const PANELS: Record<string, Panel[]> = {
  origin: [
    { k: "azure", t: { en: "Reverse dominance", zh: "逆向支配" }, d: { en: "Foragers gang up to humble anyone who grabs too much power. The group polices the bully — egalitarianism as active vigilance, not innocence.", zh: "采集者结成同盟，挫败任何攫取过多权力之人。群体制衡霸者——平等主义是主动的警惕，而非天真。" } },
    { k: "gold", t: { en: "The surplus trap", zh: "盈余陷阱" }, d: { en: "Storable grain made wealth seizable for the first time. Hierarchy did not invent greed; it invented something worth hoarding.", zh: "可储存的谷物，第一次使财富可被夺取。等级并未发明贪婪；它发明了某种值得囤积之物。" } },
    { k: "cyan", t: { en: "Scaling cooperation", zh: "合作的规模化" }, d: { en: "A band trusts faces; a million strangers need money, law, religion and bureaucracy to act as one. Each is a coordination technology.", zh: "部落信任面孔；百万陌生人则需要货币、法律、宗教与官僚才能如一体行动。每一者都是一种协调技术。" } },
    { k: "rose", t: { en: "The first kings", zh: "最初的君王" }, d: { en: "Whoever controlled irrigation, granaries or the gods controlled the surplus — and the surplus, in time, controlled everyone else.", zh: "谁控制了灌溉、粮仓或诸神，谁就控制了盈余——而盈余，终将控制其余所有人。" } },
  ],
  biology: [
    { k: "rose", t: { en: "The despotic ape", zh: "专制的猿" }, d: { en: "Chimpanzee politics is a coalition game: an alpha rules only as long as allies let him. Power is real, but never absolute or secure.", zh: "黑猩猩的政治是一场同盟博弈：首领的统治，只在盟友容许时持续。权力是真实的，却从不绝对、从不安稳。" } },
    { k: "azure", t: { en: "The bonobo path", zh: "倭黑猩猩之路" }, d: { en: "Female alliances keep bonobo society flat and far less violent — proof that a closely related ape can run on coalition, not domination.", zh: "雌性联盟使倭黑猩猩社会保持扁平、远为不暴力——证明一种近亲之猿，可以靠联盟、而非支配来运转。" } },
    { k: "gold", t: { en: "Fairness instinct", zh: "公平本能" }, d: { en: "Capuchins reject unequal pay; children protest 'not fair' before they can do arithmetic. The sense precedes the philosophy.", zh: "卷尾猴拒绝不平等的报酬；孩子在会算术之前便抗议「不公平」。这份感受，先于哲学。" } },
    { k: "silver", t: { en: "Status & health", zh: "地位与健康" }, d: { en: "Rank gets under the skin: low status raises stress hormones and shortens lives, in baboons and in humans alike.", zh: "等级钻进皮肤之下：低地位抬高应激激素、缩短寿命——在狒狒与人类身上皆然。" } },
  ],
  law: [
    { k: "gold", t: { en: "Rule of law", zh: "法治" }, d: { en: "The radical idea that the ruler is also bound — that law stands above the strongest hand, not in it.", zh: "那个激进的观念：统治者本身也受约束——法律高于最强之手，而非握于其中。" } },
    { k: "azure", t: { en: "Equality before law", zh: "法律面前平等" }, d: { en: "Same rules, same court, same weight of testimony — regardless of birth. Ancient in aspiration, recent in even partial practice.", zh: "同样的规则、同样的法庭、同样分量的证词——不论出身。其志古老，其哪怕部分的实践，却晚近。" } },
    { k: "cyan", t: { en: "Procedural justice", zh: "程序正义" }, d: { en: "People accept losing if the process was fair and they were heard. How a verdict is reached can matter more than the verdict.", zh: "若程序公平、自己被聆听，人们能接受败诉。一个裁决如何抵达，可能比裁决本身更重要。" } },
    { k: "rose", t: { en: "Rights on paper", zh: "纸上的权利" }, d: { en: "A right no court will enforce is a wish. The gap between declared and delivered rights is where injustice quietly lives.", zh: "一项无法庭执行的权利，只是愿望。被宣告的权利与被兑现的权利之间的鸿沟，正是不义悄然栖居之地。" } },
  ],
  economy: [
    { k: "cyan", t: { en: "r > g", zh: "r > g" }, d: { en: "When returns to capital outpace economic growth, inherited wealth compounds faster than wages — and the gap widens by default.", zh: "当资本回报跑赢经济增长，被继承的财富复利累积得快过工资——差距，便默认地扩大。" } },
    { k: "gold", t: { en: "Gini coefficient", zh: "基尼系数" }, d: { en: "One number from 0 (all equal) to 1 (one owns all). It compresses a whole distribution — and hides where the gap actually bites.", zh: "一个从 0（全然平等）到 1（一人独占）的数字。它压缩了整个分布——也藏起了差距实际啃噬之处。" } },
    { k: "azure", t: { en: "Redistribution", zh: "再分配" }, d: { en: "Tax and transfer redraw the curve after the market draws it. The live argument is how much reshaping the engine can take.", zh: "税收与转移，在市场绘制曲线之后将其重绘。鲜活的争论在于：引擎能承受多少这般的再塑形。" } },
    { k: "rose", t: { en: "Universal basic income", zh: "全民基本收入" }, d: { en: "A floor paid to everyone, unconditionally. A simple idea that forces the deepest question: what do we owe each other for nothing?", zh: "无条件地付给每个人的一道底线。一个简单的构想，却逼出最深的问题：我们彼此之间，无偿地，亏欠着什么？" } },
  ],
  opportunity: [
    { k: "azure", t: { en: "The Great Gatsby curve", zh: "了不起的盖茨比曲线" }, d: { en: "More unequal societies are also less mobile: where the gap is wide, your parents' position predicts yours more tightly.", zh: "越不平等的社会，往往也越不流动：差距越大，父母的位置便越紧地预言你的位置。" } },
    { k: "gold", t: { en: "Education as sorter", zh: "作为分拣器的教育" }, d: { en: "Schooling can lift or it can launder privilege into 'merit.' Same institution, opposite effects, depending on who can access it.", zh: "教育能提升，也能把特权漂白成「贤能」。同一种制度，依「谁能进入」而产生相反的效果。" } },
    { k: "cyan", t: { en: "Networks & geography", zh: "人脉与地理" }, d: { en: "Most jobs come through who you know and where you are. Opportunity is local, and the map of it is wildly uneven.", zh: "多数工作来自你认识谁、你身在何处。机会是局部的，而它的地图，参差得惊人。" } },
    { k: "silver", t: { en: "The family", zh: "家庭" }, d: { en: "We cannot equalize opportunity without touching the family — the one inequality almost no one is willing to abolish.", zh: "不触及家庭，我们便无法拉平机会——而家庭，是几乎无人愿意废除的那一种不平等。" } },
  ],
  technology: [
    { k: "aura", t: { en: "Algorithmic bias", zh: "算法偏见" }, d: { en: "Models learn the past, including its prejudice, then apply it at scale to people who never see the rule that ranked them.", zh: "模型习得过去，连同它的偏见，再将其规模化地施加于从未见过那条评判自己之规则的人。" } },
    { k: "rose", t: { en: "Surveillance asymmetry", zh: "监控的不对称" }, d: { en: "The powerful watch the powerless far more than the reverse. Visibility itself becomes a form of inequality.", zh: "有权者监视无权者，远多于反向。「可见性」本身，成为一种不平等。" } },
    { k: "azure", t: { en: "Centralized vs. decentralized", zh: "中心化与去中心化" }, d: { en: "Does the system gather power into a platform, or spread it across a network? The architecture decides who can be excluded.", zh: "系统是把权力聚拢进一个平台，还是把它散布于一张网络？架构，决定了谁可以被排除。" } },
    { k: "cyan", t: { en: "Automation & the wage", zh: "自动化与工资" }, d: { en: "When machines do the work, the income that once flowed to labor flows to whoever owns the machines instead.", zh: "当机器做工，曾经流向劳动的收入，转而流向机器的拥有者。" } },
  ],
  civilizations: [
    { k: "gold", t: { en: "Citizenship", zh: "公民身份" }, d: { en: "Every society draws a circle of who counts as a full member. The history of equality is largely the history of that circle widening.", zh: "每个社会都画出一个「谁算作完整成员」的圆。平等的历史，大体就是那个圆不断扩大的历史。" } },
    { k: "azure", t: { en: "Caste vs. class", zh: "种姓与阶级" }, d: { en: "Caste fixes your place at birth and forbids the exit; class is steep but, in principle, porous. The difference is whether the door is locked.", zh: "种姓在出生时固定你的位置、禁止离开；阶级陡峭，但原则上可渗透。差别在于：那扇门，是否被锁上。" } },
    { k: "cyan", t: { en: "Meritocracy's paradox", zh: "贤能制的悖论" }, d: { en: "Rewarding talent feels just, yet hardens into a new aristocracy that believes it earned everything — and owes nothing.", zh: "奖赏才智令人觉得正义，却硬化为一个新的贵族制——它相信自己挣得了一切，又一无所欠。" } },
    { k: "silver", t: { en: "The bargain", zh: "那笔交易" }, d: { en: "No civilization was simply equal or unequal. Each traded some equalities for others — and the trade defined its character.", zh: "没有任何文明只是单纯地平等或不平等。每一个都以某些平等换取另一些——而这交易，定义了它的性格。" } },
  ],
  psychology: [
    { k: "rose", t: { en: "Relative, not absolute", zh: "相对，而非绝对" }, d: { en: "We judge our standing against neighbors, not against history. A richer society can feel more unfair than a poorer, fairer one.", zh: "我们以邻人、而非以历史来衡量自己的处境。一个更富裕的社会，可能比一个更贫穷、更公平的社会，感觉更不公。" } },
    { k: "azure", t: { en: "Ultimatum game", zh: "最后通牒博弈" }, d: { en: "Offered an unfair split of free money, people across cultures reject it — paying to punish unfairness. Spite is a moral signal.", zh: "面对一笔免费之钱的不公分配，跨文化的人们都会拒绝它——付出代价以惩罚不公。怨忿，是一种道德信号。" } },
    { k: "gold", t: { en: "Recognition", zh: "承认" }, d: { en: "Much conflict is not over bread but over respect — the demand to be seen as an equal, to not be humiliated.", zh: "许多冲突并非为了面包，而是为了尊重——那要求被视为平等、不被羞辱的诉求。" } },
    { k: "cyan", t: { en: "Legitimacy", zh: "正当性" }, d: { en: "People tolerate steep inequality they believe is deserved, and revolt against gentle inequality they believe is rigged.", zh: "人们容忍他们认为「应得」的陡峭不平等，却反抗他们认为「被操纵」的温和不平等。" } },
  ],
  future: [
    { k: "aura", t: { en: "Post-scarcity", zh: "后稀缺" }, d: { en: "If machines meet every material need, scarcity of goods ends — but scarcity of status, attention and meaning does not.", zh: "若机器满足一切物质需求，货物的稀缺便告终——但地位、注意力与意义的稀缺，并未终结。" } },
    { k: "azure", t: { en: "Digital citizenship", zh: "数字公民身份" }, d: { en: "A new circle of belonging — identity, voice and rights that live across borders, on infrastructure no single state controls.", zh: "一个新的归属之圆——身份、声音与权利，跨越国界，活在没有单一国家能控制的基础设施之上。" } },
    { k: "cyan", t: { en: "Decentralized governance", zh: "去中心化治理" }, d: { en: "Can rules enforced by code and held by no one resist capture better than rules held by a state? An old hope, a new substrate.", zh: "由代码执行、不为任何人持有的规则，能否比国家持有的规则更好地抵抗俘获？古老的希望，全新的基底。" } },
    { k: "rose", t: { en: "Capital's last aristocracy", zh: "资本的最后贵族" }, d: { en: "The dark mirror: those who own the machines need no one, owe no one, and answer to no one. Automation's worst case is feudal.", zh: "那面黑暗的镜子：拥有机器之人，无需任何人、不欠任何人、不向任何人负责。自动化的最坏情形，是封建的。" } },
  ],
};

/* ---------- 01 · Coordination-systems timeline ---------- */
export type TLEvent = { when: Bi; title: Bi; desc: Bi; equality: number; k: AccentKey };
export const COORD_TIMELINE: TLEvent[] = [
  { k: "azure", equality: 88, when: { en: "~300 kya", zh: "约 30 万年前" }, title: { en: "The egalitarian band", zh: "平等的部落" }, desc: { en: "Small foraging groups stay deliberately flat: sharing is enforced, bullies are humbled, and no one accumulates much. Equality by active resistance to hierarchy.", zh: "小型采集群体刻意保持扁平：分享被强制，霸者被挫败，无人积累太多。平等，源于对等级的主动抵抗。" } },
  { k: "rose", equality: 42, when: { en: "~12 kya", zh: "约 1.2 万年前" }, title: { en: "Agriculture & surplus", zh: "农业与盈余" }, desc: { en: "Settled farming creates storable wealth — and the first durable hierarchies of those who control it. The flat world begins to tilt.", zh: "定居农耕创造了可储存的财富——以及最早的、由控制它者构成的持久等级。扁平的世界，开始倾斜。" } },
  { k: "rose", equality: 22, when: { en: "~5 kya", zh: "约 5000 年前" }, title: { en: "The first states", zh: "最初的国家" }, desc: { en: "Kings, priests and scribes coordinate thousands through writing, taxation and divine right. Coordination soars; equality collapses.", zh: "君王、祭司与书吏，以文字、税收与神授之权协调成千上万人。协调腾飞；平等崩塌。" } },
  { k: "gold", equality: 34, when: { en: "~500 BCE", zh: "约公元前 500" }, title: { en: "Citizens & codes", zh: "公民与法典" }, desc: { en: "Athens, Rome and the Axial sages invent citizenship, written law and the idea that rule should answer to something higher than the ruler.", zh: "雅典、罗马与轴心时代的哲人，发明了公民身份、成文法，以及「统治应向高于统治者之物负责」的观念。" } },
  { k: "rose", equality: 26, when: { en: "~800–1500", zh: "约 800–1500" }, title: { en: "Estates & castes", zh: "等级与种姓" }, desc: { en: "Feudal Europe, caste India and aristocratic orders freeze society into inherited ranks. Your birth is your destiny, sanctified by heaven.", zh: "封建欧洲、种姓印度与贵族秩序，把社会冻结为世袭的等级。你的出生即你的命运，并被上天神圣化。" } },
  { k: "gold", equality: 48, when: { en: "1776–1789", zh: "1776–1789" }, title: { en: "The age of declarations", zh: "宣言的时代" }, desc: { en: "American and French revolutions declare rights universal in principle — even as slavery, property and sex still gate them in practice.", zh: "美国与法国革命，在原则上宣告权利普世——尽管在实践中，奴隶制、财产与性别仍为之设障。" } },
  { k: "cyan", equality: 38, when: { en: "~1850", zh: "约 1850" }, title: { en: "Industrial divide", zh: "工业的分野" }, desc: { en: "Factories generate unprecedented wealth and unprecedented gaps. A new working class and a new owning class face off across the machine.", zh: "工厂制造出空前的财富与空前的差距。一个新的工人阶级与一个新的所有者阶级，隔着机器对峙。" } },
  { k: "azure", equality: 62, when: { en: "1945–1980", zh: "1945–1980" }, title: { en: "The great leveling", zh: "大拉平" }, desc: { en: "After two wars and a depression, welfare states, unions, mass education and progressive tax compress inequality across the developed world.", zh: "在两场战争与一次大萧条之后，福利国家、工会、大众教育与累进税制，在整个发达世界压缩了不平等。" } },
  { k: "cyan", equality: 44, when: { en: "1980–2020", zh: "1980–2020" }, title: { en: "The great divergence", zh: "大分流" }, desc: { en: "Globalization and technology lift billions out of poverty worldwide, while top-end wealth concentrates and within-nation gaps reopen.", zh: "全球化与技术使全球数十亿人脱贫，与此同时，顶端财富集中，国家内部的差距重新拉开。" } },
  { k: "aura", equality: 50, when: { en: "Now →", zh: "此刻 →" }, title: { en: "The algorithmic fork", zh: "算法的岔路" }, desc: { en: "AI and automation could distribute capability to all — or concentrate power as never before. The slope from here is not yet decided.", zh: "AI 与自动化，可能将能力分配给所有人——或以前所未有的方式集中权力。从此处起的斜坡，尚未被决定。" } },
];

/* ---------- 02 · Species on the egalitarian↔despotic axis ---------- */
export type Species = { key: string; name: Bi; egalitarian: number; structure: Bi; lesson: Bi; k: AccentKey };
export const SPECIES: Species[] = [
  { key: "ants", k: "silver", egalitarian: 30, name: { en: "Ants & bees", zh: "蚂蚁与蜜蜂" }, structure: { en: "Rigid castes by birth — queen, workers, soldiers — but no individual 'boss' giving orders. Order without rulers.", zh: "由出生决定的刚性种姓——蜂后、工蚁、兵蚁——却没有发号施令的个体「上司」。无统治者的秩序。" }, lesson: { en: "Hierarchy of role is not the same as domination by a person.", zh: "角色的等级，不等于被一个人支配。" } },
  { key: "chimps", k: "rose", egalitarian: 22, name: { en: "Chimpanzees", zh: "黑猩猩" }, structure: { en: "A despotic alpha rules through a coalition and intimidation, but only while allies allow it. Politics, with violence.", zh: "一个专制的首领，靠同盟与恐吓统治，但仅在盟友容许时。带着暴力的政治。" }, lesson: { en: "Even 'absolute' power is a coalition that can collapse.", zh: "即便「绝对」的权力，也是一个会崩塌的同盟。" } },
  { key: "wolves", k: "gold", egalitarian: 48, name: { en: "Wolves", zh: "狼" }, structure: { en: "A breeding pair leads a family; the famous 'alpha struggle' is mostly a captivity artifact. Cooperation under parents.", zh: "一对繁殖配偶率领一个家庭；著名的「头狼之争」大多是圈养的假象。在父母之下合作。" }, lesson: { en: "Leadership can be parental and functional, not tyrannical.", zh: "领导可以是亲职性的、功能性的，而非暴政性的。" } },
  { key: "bonobos", k: "azure", egalitarian: 78, name: { en: "Bonobos", zh: "倭黑猩猩" }, structure: { en: "Female alliances keep males in check; conflict is defused socially. As related to us as chimps, and far flatter.", zh: "雌性联盟制约雄性；冲突被社会性地化解。与我们的亲缘和黑猩猩一样近，却扁平得多。" }, lesson: { en: "A close cousin proves domination is a choice, not a fate.", zh: "一位近亲证明：支配是一种选择，而非宿命。" } },
  { key: "foragers", k: "azure", egalitarian: 90, name: { en: "Hunter-gatherers", zh: "狩猎采集者" }, structure: { en: "Reverse dominance: the group actively humbles anyone who grabs power, through mockery, sharing rules and exit. Equality, enforced.", zh: "逆向支配：群体以嘲弄、分享规则与「退出」，主动挫败任何攫取权力之人。被强制的平等。" }, lesson: { en: "The flattest human societies were the most vigilant, not the most innocent.", zh: "最扁平的人类社会，是最警惕的，而非最天真的。" } },
  { key: "modern", k: "cyan", egalitarian: 38, name: { en: "Modern humans", zh: "现代人类" }, structure: { en: "Re-stratified by wealth, institutions and information after 10,000 years of surplus — yet still carrying the forager's fairness instinct.", zh: "在一万年的盈余之后，被财富、制度与信息重新分层——却仍携带着采集者的公平本能。" }, lesson: { en: "We run hierarchical software on egalitarian hardware — hence the friction.", zh: "我们在平等主义的硬件上，运行着等级制的软件——摩擦由此而来。" } },
];

/* ---------- 03 · Rights-expansion ladder ---------- */
export type Rung = { when: Bi; title: Bi; desc: Bi; reach: number; k: AccentKey };
export const RIGHTS_LADDER: Rung[] = [
  { k: "gold", reach: 8, when: { en: "c. 1754 BCE", zh: "约公元前 1754" }, title: { en: "Code of Hammurabi", zh: "汉谟拉比法典" }, desc: { en: "Law written in stone for all to see — but it prices a noble's life above a commoner's, and a commoner's above a slave's.", zh: "刻于石上、供众目共睹的法律——但它把贵族的命标价于平民之上，平民之上又有奴隶之下。" } },
  { k: "gold", reach: 14, when: { en: "509 BCE →", zh: "公元前 509 →" }, title: { en: "Roman citizenship", zh: "罗马公民权" }, desc: { en: "The citizen gains rights of trial, property and appeal — a status that, remarkably, could be extended to conquered peoples and freed slaves.", zh: "公民获得审判、财产与上诉之权——一种身份，且引人注目地，可被扩展至被征服的民族与被释的奴隶。" } },
  { k: "gold", reach: 20, when: { en: "1215", zh: "1215" }, title: { en: "Magna Carta", zh: "大宪章" }, desc: { en: "Barons force a king to accept that even he is under the law. A charter for the powerful that became a seed for everyone.", zh: "贵族迫使国王承认：即便是他，也在法律之下。一份为权贵而立的宪章，成了为所有人而播的种子。" } },
  { k: "azure", reach: 40, when: { en: "1776 · 1789", zh: "1776 · 1789" }, title: { en: "Rights of man", zh: "人权" }, desc: { en: "American and French declarations assert that all men are created equal and bear inalienable rights — in principle universal, in practice gated.", zh: "美国与法国的宣言主张人人生而平等、负有不可剥夺之权利——原则上普世，实践中设障。" } },
  { k: "azure", reach: 54, when: { en: "1865 · 1920", zh: "1865 · 1920" }, title: { en: "Abolition & suffrage", zh: "废奴与选举权" }, desc: { en: "Slavery is abolished and the vote slowly extends beyond propertied men to all races and to women — the circle widens by struggle.", zh: "奴隶制被废除，选举权缓慢地从有产男性扩展至所有种族与女性——那个圆，靠斗争而扩大。" } },
  { k: "gold", reach: 74, when: { en: "1948", zh: "1948" }, title: { en: "Universal Declaration", zh: "世界人权宣言" }, desc: { en: "After total war, the world writes down what every human is owed for being human — the most ambitious moral claim ever signed.", zh: "在全面战争之后，世界写下了「每个人因身为人而被亏欠之物」——史上签署过的、最雄心的道德主张。" } },
  { k: "cyan", reach: 84, when: { en: "1960s →", zh: "1960 年代 →" }, title: { en: "Civil & social rights", zh: "公民与社会权利" }, desc: { en: "Anti-discrimination law, social protection and the rights of minorities, workers and the disabled move equality from the page into daily life.", zh: "反歧视法、社会保障，以及少数群体、劳工与残障者的权利，把平等从纸面，移入日常生活。" } },
  { k: "aura", reach: 90, when: { en: "Now →", zh: "此刻 →" }, title: { en: "Digital & planetary rights", zh: "数字与行星权利" }, desc: { en: "Privacy, data, algorithmic due process, climate and the rights of future generations test whether the circle can widen past the present human.", zh: "隐私、数据、算法的正当程序、气候，以及后代的权利，正在考验：那个圆，能否扩展到当下的人类之外。" } },
];

/* ---------- 07 · Civilization comparison ---------- */
export type Civilization = {
  key: string; name: Bi; era: Bi; accent: string;
  governance: Bi; circle: Bi; ladder: Bi; strength: Bi; blindspot: Bi;
  // equality profile, 0–100
  legal: number; mobility: number; voice: number; floor: number;
};
export const CIVILIZATIONS: Civilization[] = [
  {
    key: "athens", accent: "#5b8cff", name: { en: "Classical Athens", zh: "古典雅典" }, era: { en: "5th c. BCE", zh: "公元前 5 世纪" },
    governance: { en: "Direct democracy of citizens — lottery for office, assembly for all decisions.", zh: "公民的直接民主——以抽签任职，以公民大会决一切事。" },
    circle: { en: "Free adult male citizens only — perhaps 15% of residents; women, slaves and foreigners excluded.", zh: "仅限自由成年男性公民——或占居民约 15%；女性、奴隶与外邦人被排除。" },
    ladder: { en: "Radical equality inside the circle, total exclusion outside it.", zh: "圈内激进的平等，圈外彻底的排斥。" },
    strength: { en: "Invented self-rule and equal political voice among citizens.", zh: "发明了自治，以及公民间平等的政治声音。" },
    blindspot: { en: "Rested entirely on slavery and the silencing of the majority.", zh: "完全建立在奴隶制与对多数者的噤声之上。" },
    legal: 55, mobility: 20, voice: 80, floor: 30,
  },
  {
    key: "rome", accent: "#e3b24f", name: { en: "Republican & Imperial Rome", zh: "共和与帝制罗马" }, era: { en: "509 BCE–476 CE", zh: "公元前 509–公元 476" },
    governance: { en: "Mixed republic, then empire — law, the Senate, and a citizenship that could be granted.", zh: "混合共和，继而帝国——法律、元老院，以及一种可被授予的公民权。" },
    circle: { en: "Widening citizenship: from Romans to Italians to, by 212 CE, nearly all free men of the empire.", zh: "不断扩大的公民权：从罗马人到意大利人，至公元 212 年，几乎涵盖帝国全体自由男性。" },
    ladder: { en: "Steep but climbable — a freedman's grandson could reach the elite.", zh: "陡峭却可攀——一个被释奴隶的孙子，可登上精英之列。" },
    strength: { en: "Developed law as a portable, impersonal system and extended status outward.", zh: "把法律发展为一套可移植、非人格化的体系，并向外扩展身份。" },
    blindspot: { en: "Built on mass slavery and conquest; equality stopped at the property line.", zh: "建立在大规模奴隶制与征服之上；平等止步于财产的界线。" },
    legal: 65, mobility: 45, voice: 40, floor: 35,
  },
  {
    key: "china", accent: "#3fd1c7", name: { en: "Imperial China", zh: "帝制中国" }, era: { en: "Han–Qing", zh: "汉至清" },
    governance: { en: "Centralized bureaucracy legitimized by the Mandate of Heaven and Confucian order.", zh: "由天命与儒家秩序赋予正当性的中央集权官僚体系。" },
    circle: { en: "Subjects, not citizens — but the exam was open to commoners across a vast realm.", zh: "是臣民，而非公民——但科举向广阔疆域内的平民开放。" },
    ladder: { en: "The imperial examination: the pre-modern world's most meritocratic ladder, inside a strict hierarchy.", zh: "科举制：前现代世界最重贤能的阶梯，置于一套严格的等级之内。" },
    strength: { en: "Selected officials by talent, not just birth — a radical idea for its age.", zh: "以才智、而非仅以出身选拔官员——一个就其时代而言激进的观念。" },
    blindspot: { en: "Meritocracy at the top sat atop a deeply unequal, patriarchal society.", zh: "顶层的贤能制，坐落在一个深度不平等、父权制的社会之上。" },
    legal: 50, mobility: 55, voice: 25, floor: 45,
  },
  {
    key: "islam", accent: "#9b8cff", name: { en: "Islamic Caliphates", zh: "伊斯兰诸哈里发国" }, era: { en: "7th–13th c.", zh: "7–13 世纪" },
    governance: { en: "Rule under sharia — law derived from revelation, binding ruler and ruled alike in principle.", zh: "在伊斯兰教法之下的统治——源自启示的法律，原则上同时约束统治者与被统治者。" },
    circle: { en: "Believers as a community of equals before God; protected status (dhimma) for other faiths; slavery persisted.", zh: "信徒作为在真主面前平等的共同体；对其他信仰的「迪米」保护身份；奴隶制延续。" },
    ladder: { en: "Scholarship and faith offered mobility; a charitable floor (zakat) was a religious duty.", zh: "学问与信仰提供了流动；一道慈善的底线（天课）是宗教义务。" },
    strength: { en: "Codified legal protections and an obligatory floor for the poor, ahead of its time.", zh: "把法律保护与对贫者的强制性底线制度化，超前于其时代。" },
    blindspot: { en: "Status differed by faith, sex and free/enslaved condition.", zh: "身份依信仰、性别与「自由/被奴役」的状态而不同。" },
    legal: 60, mobility: 50, voice: 30, floor: 60,
  },
  {
    key: "feudal", accent: "#ff6f91", name: { en: "Medieval Europe", zh: "中世纪欧洲" }, era: { en: "5th–15th c.", zh: "5–15 世纪" },
    governance: { en: "Feudal estates — a pyramid of mutual obligation from serf to lord to king, blessed by the Church.", zh: "封建等级——从农奴到领主到国王、由教会祝圣的、相互义务的金字塔。" },
    circle: { en: "Three estates fixed by birth: those who pray, those who fight, those who work.", zh: "由出生固定的三个等级：祈祷者、作战者、劳作者。" },
    ladder: { en: "Mostly locked — but the town, the guild and the Church offered narrow exits.", zh: "大体被锁——但城镇、行会与教会，提供了狭窄的出口。" },
    strength: { en: "Accidentally birthed the corporation, the university and the chartered, rights-bearing town.", zh: "意外地诞生了公司、大学，以及拥有特许状与权利的城镇。" },
    blindspot: { en: "Birth was destiny; most people were bound to the land and the rank they were born to.", zh: "出生即命运；多数人被束缚于土地，与他们生来的等级。" },
    legal: 35, mobility: 25, voice: 15, floor: 40,
  },
  {
    key: "liberal", accent: "#c2cce4", name: { en: "Modern Liberal Democracy", zh: "现代自由民主" }, era: { en: "20th–21st c.", zh: "20–21 世纪" },
    governance: { en: "Constitutional government, universal suffrage, rule of law and an open market economy.", zh: "立宪政府、普选权、法治，与开放的市场经济。" },
    circle: { en: "In principle every adult citizen; the long fight has been to make the principle real for all.", zh: "原则上每一个成年公民；漫长的斗争，正是让这原则对所有人成真。" },
    ladder: { en: "Formally open, practically sticky — declared mobility outruns delivered mobility.", zh: "形式上开放，实际上黏滞——被宣告的流动，跑赢了被兑现的流动。" },
    strength: { en: "Equality before the law and universal political voice, at a scale never before achieved.", zh: "法律面前的平等与普遍的政治声音，达到了前所未有的规模。" },
    blindspot: { en: "Tolerates vast wealth inequality that can quietly buy back political voice.", zh: "容忍着巨大的财富不平等——而它能悄然买回政治的声音。" },
    legal: 85, mobility: 55, voice: 80, floor: 65,
  },
];

/* ---------- Meta-model · Civilizational Equality ---------- */
export type Dim = { key: string; label: Bi; gloss: Bi };
export const EQ_DIMS: Dim[] = [
  { key: "opportunity", label: { en: "Fair opportunity", zh: "公平机会" }, gloss: { en: "how little your birth determines your destiny", zh: "你的出生在多大程度上「不」决定你的命运" } },
  { key: "power", label: { en: "Power distribution", zh: "权力分布" }, gloss: { en: "how widely authority is spread rather than concentrated", zh: "权威被广泛散布、而非集中的程度" } },
  { key: "legal", label: { en: "Legal protection", zh: "法律保护" }, gloss: { en: "whether the same rules and courts protect everyone", zh: "同样的规则与法庭是否保护每一个人" } },
  { key: "mobility", label: { en: "Social mobility", zh: "社会流动" }, gloss: { en: "the real chance to move beyond where you began", zh: "超越起点、向上移动的真实机会" } },
  { key: "information", label: { en: "Information access", zh: "信息获取" }, gloss: { en: "who can reach knowledge, media and the means to be heard", zh: "谁能触及知识、媒介与「被听见」的手段" } },
  { key: "economic", label: { en: "Economic participation", zh: "经济参与" }, gloss: { en: "the share of people with a real stake in production", zh: "在生产中拥有真实份额的人口比例" } },
  { key: "dignity", label: { en: "Dignity preservation", zh: "尊严维护" }, gloss: { en: "whether all are treated as equals in worth, not just in law", zh: "所有人是否在价值上、而不仅在法律上，被当作平等者对待" } },
];

export type EqSystem = {
  key: string; name: Bi; era: Bi; accent: string; note: Bi;
  opportunity: number; power: number; legal: number; mobility: number; information: number; economic: number; dignity: number;
};
export const EQ_SYSTEMS: EqSystem[] = [
  { key: "band", accent: "#5b8cff", name: { en: "Forager band", zh: "采集部落" }, era: { en: "deep past", zh: "远古" }, opportunity: 80, power: 88, legal: 40, mobility: 60, information: 55, economic: 85, dignity: 82, note: { en: "Flat by enforced sharing and resistance to bullies — but small, poor, and with little formal law.", zh: "靠强制分享与对霸者的抵抗而扁平——但规模小、贫穷，且鲜有成文之法。" } },
  { key: "athens", accent: "#9b8cff", name: { en: "Athenian democracy", zh: "雅典民主" }, era: { en: "5th c. BCE", zh: "公元前 5 世纪" }, opportunity: 35, power: 72, legal: 55, mobility: 25, information: 45, economic: 40, dignity: 38, note: { en: "Radical equality among citizens, total exclusion of the slave majority and all women.", zh: "公民间激进的平等，对占多数的奴隶与全体女性的彻底排斥。" } },
  { key: "china", accent: "#3fd1c7", name: { en: "Imperial China", zh: "帝制中国" }, era: { en: "Han–Qing", zh: "汉至清" }, opportunity: 55, power: 30, legal: 48, mobility: 58, information: 40, economic: 50, dignity: 45, note: { en: "The meritocratic exam opened the top; a strict patriarchal hierarchy held below it.", zh: "贤能的科举开放了顶层；其下，则是严格的父权等级。" } },
  { key: "caste", accent: "#ff6f91", name: { en: "Caste / estate society", zh: "种姓 / 等级社会" }, era: { en: "medieval", zh: "中世纪" }, opportunity: 12, power: 18, legal: 25, mobility: 10, information: 20, economic: 25, dignity: 22, note: { en: "Birth fixes place and forbids exit — the steepest, most locked ladder humans have built.", zh: "出生固定位置、禁止离开——人类建造过的、最陡峭、最被锁死的阶梯。" } },
  { key: "capitalist", accent: "#e3b24f", name: { en: "Industrial capitalism", zh: "工业资本主义" }, era: { en: "19th–20th c.", zh: "19–20 世纪" }, opportunity: 55, power: 45, legal: 70, mobility: 50, information: 60, economic: 55, dignity: 55, note: { en: "Formal legal equality and rising wealth, alongside wide and compounding economic gaps.", zh: "形式上的法律平等与上升的财富，伴随着宽广且复利累积的经济差距。" } },
  { key: "nordic", accent: "#7fe0d6", name: { en: "Social democracy", zh: "社会民主" }, era: { en: "modern Nordic", zh: "现代北欧" }, opportunity: 82, power: 72, legal: 88, mobility: 80, information: 85, economic: 80, dignity: 85, note: { en: "High floors, strong mobility and broad voice — the most balanced large societies yet measured.", zh: "高底线、强流动与广泛的声音——迄今所测量过的、最平衡的大型社会。" } },
  { key: "surveillance", accent: "#9aa6c2", name: { en: "Digital surveillance state", zh: "数字监控国家" }, era: { en: "emerging", zh: "新兴" }, opportunity: 45, power: 18, legal: 40, mobility: 45, information: 30, economic: 50, dignity: 35, note: { en: "Material gains and order, bought with concentrated power and a sharp asymmetry of who is watched.", zh: "以集中的权力，与「谁被监视」的尖锐不对称，换取物质的所得与秩序。" } },
  { key: "balanced", accent: "#a9c4ff", name: { en: "A coordinated future", zh: "协调的未来" }, era: { en: "aspirational", zh: "理想的" }, opportunity: 90, power: 85, legal: 92, mobility: 86, information: 90, economic: 88, dignity: 92, note: { en: "A hypothetical society that keeps all seven high at once — the target sustainable equality points toward.", zh: "一个假想的社会，使七维同时保持高位——可持续平等所指向的标靶。" } },
];

/* ---------- 09 · Future scenarios (FutureEqualitySim classification) ---------- */
export type Scenario = { key: string; min: number; name: Bi; desc: Bi; k: AccentKey };
export const SCENARIOS: Scenario[] = [
  { key: "feudal", min: 0, k: "rose", name: { en: "Techno-feudalism", zh: "技术封建主义" }, desc: { en: "A tiny class owns the machines and needs no one else. Automation severs labor from income, surveillance locks the order in place, and a permanent aristocracy of capital forms.", zh: "一个微小的阶层拥有机器，不再需要任何其他人。自动化斩断劳动与收入，监控把秩序锁定，一个永久的资本贵族制就此形成。" } },
  { key: "stratified", min: 34, k: "gold", name: { en: "Stratified plenty", zh: "分层的丰裕" }, desc: { en: "Enormous total wealth, deeply unequally held. Most needs are met, but power and opportunity stay concentrated and resentment simmers beneath the comfort.", zh: "巨大的总财富，被深度不均地持有。多数需求被满足，但权力与机会保持集中，怨恨在舒适之下闷烧。" } },
  { key: "social", min: 60, k: "azure", name: { en: "Coordinated commons", zh: "协调的共有" }, desc: { en: "Strong floors, broad voice and shared infrastructure spread the gains of automation. Innovation and fairness are held in working tension rather than traded away.", zh: "强健的底线、广泛的声音与共享的基础设施，把自动化的所得散布开来。创新与公平被维持在有效的张力中，而非被牺牲。" } },
  { key: "flourishing", min: 84, k: "aura", name: { en: "Post-scarcity flourishing", zh: "后稀缺的繁荣" }, desc: { en: "Material scarcity ends and dignity is universal; power is distributed, opportunity is real for all, and people are free to pursue meaning rather than survival.", zh: "物质稀缺终结，尊严普世；权力被分配，机会对所有人成真，人们得以自由地追求意义，而非生存。" } },
];

/* dimensions used by the FutureEqualitySim sliders (same seven) */
export const FUTURE_DIMS = EQ_DIMS;
