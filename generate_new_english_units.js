const fs = require("fs");
const path = require("path");

function writeUnitFile(filename, data) {
  const targetPath = path.join(__dirname, "questions", filename);
  fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), "utf8");
}

function formatId(prefix, index) {
  return `${prefix}-${String(index + 1).padStart(3, "0")}`;
}

function shuffle(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function generatePastBeProgressiveQuestions(prefix) {
  const questions = [];

  const singularSubjects = [
    { text: "I", explanation: "I の過去形では be 動詞は was を使います。", bePast: "was" },
    { text: "He", explanation: "単数主語（He）では過去形に was を使います。", bePast: "was" },
    { text: "She", explanation: "単数主語（She）では過去形に was を使います。", bePast: "was" },
    { text: "It", explanation: "It のような単数主語では過去形に was を使います。", bePast: "was" },
    { text: "Tom", explanation: "Tom のような単数主語では過去形に was を使います。", bePast: "was" },
    { text: "My sister", explanation: "単数主語なので過去形に was を使います。", bePast: "was" },
    { text: "The weather", explanation: "The weather は単数扱いなので was を使います。", bePast: "was" },
    { text: "My hometown", explanation: "My hometown のような単数主語は was を使います。", bePast: "was" }
  ];

  const pluralSubjects = [
    { text: "We", explanation: "We の過去形では be 動詞は were を使います。", bePast: "were" },
    { text: "You", explanation: "You（あなたたちは）では過去形に were を使います。", bePast: "were" },
    { text: "They", explanation: "複数主語（They）では過去形に were を使います。", bePast: "were" },
    { text: "My parents", explanation: "複数主語なので過去形に were を使います。", bePast: "were" },
    { text: "The students", explanation: "複数主語なので過去形に were を使います。", bePast: "were" },
    { text: "My friends", explanation: "複数主語なので過去形に were を使います。", bePast: "were" },
    { text: "Our teachers", explanation: "複数主語なので過去形に were を使います。", bePast: "were" },
    { text: "The shops", explanation: "複数の店を表すので were を使います。", bePast: "were" }
  ];

  const pastContextsSingular = [
    { context: "at the city library", time: "last Saturday afternoon" },
    { context: "very tired after the club activity", time: "yesterday evening" },
    { context: "in Kyoto on a school trip", time: "last autumn" },
    { context: "absent from school", time: "two days ago" },
    { context: "full of handmade posters", time: "during the festival" },
    { context: "interested in science experiments", time: "last month" },
    { context: "responsible for cleaning the classroom", time: "last week" },
    { context: "in front of the station", time: "at 7 p.m. last night" },
    { context: "the leader of the dance team", time: "last year" },
    { context: "excited about the soccer match", time: "last Sunday" },
    { context: "worried about the math test", time: "yesterday morning" },
    { context: "busy preparing a speech", time: "last Friday" },
    { context: "free after the meeting", time: "yesterday afternoon" },
    { context: "sure about the answer", time: "during the quiz" },
    { context: "late for the train", time: "this morning" },
    { context: "ready for the presentation", time: "last period" }
  ];

  const pastContextsPlural = [
    { context: "in the music room", time: "after classes yesterday" },
    { context: "cheerful about the results", time: "last night" },
    { context: "responsible for the decorations", time: "during the festival" },
    { context: "serious about their future plans", time: "last week" },
    { context: "members of the art club", time: "two years ago" },
    { context: "interested in studying abroad", time: "last semester" },
    { context: "late for the rehearsal", time: "on Monday" },
    { context: "hungry after the practice", time: "yesterday evening" },
    { context: "at the community center", time: "last Sunday" },
    { context: "free after the exam", time: "yesterday afternoon" },
    { context: "ready for the volunteer work", time: "this morning" },
    { context: "busy making posters", time: "last Friday" },
    { context: "confident about the speech", time: "yesterday" },
    { context: "at home because of the storm", time: "last weekend" },
    { context: "famous for their chorus", time: "last year" },
    { context: "supportive of the new idea", time: "at the meeting" }
  ];

  const beChoiceSets = {
    was: ["was", "were", "am", "are"],
    were: ["were", "was", "are", "is"]
  };

  const beNegativeChoiceSets = {
    was: ["wasn't", "weren't", "isn't", "aren't"],
    were: ["weren't", "wasn't", "aren't", "isn't"]
  };

  const singularNegatives = [
    { subject: "He", detail: "___ late for school yesterday.", explanation: "単数主語（He）なので was を使い、否定は wasn't です。", bePast: "was" },
    { subject: "She", detail: "___ afraid of the dark when she was little.", explanation: "単数主語（She）なので was を使い、否定は wasn't です。", bePast: "was" },
    { subject: "It", detail: "___ sunny last Sunday.", explanation: "It は単数扱いなので was を使い、否定は wasn't です。", bePast: "was" },
    { subject: "Tom", detail: "___ interested in math two years ago.", explanation: "Tom は単数主語なので was を使い、否定は wasn't です。", bePast: "was" },
    { subject: "My brother", detail: "___ at home last night.", explanation: "単数主語なので was を使い、否定は wasn't です。", bePast: "was" },
    { subject: "The movie", detail: "___ boring at all.", explanation: "単数主語なので was を使い、否定は wasn't です。", bePast: "was" },
    { subject: "The festival", detail: "___ canceled last year.", explanation: "単数主語なので was を使い、否定は wasn't です。", bePast: "was" },
    { subject: "Her answer", detail: "___ correct on the test.", explanation: "単数主語なので was を使い、否定は wasn't です。", bePast: "was" }
  ];

  const pluralNegatives = [
    { subject: "They", detail: "___ ready for the contest yesterday.", explanation: "複数主語なので were を使い、否定は weren't です。", bePast: "were" },
    { subject: "We", detail: "___ able to finish the work last night.", explanation: "We は複数扱いなので were を使い、否定は weren't です。", bePast: "were" },
    { subject: "You", detail: "___ noisy in the library yesterday.", explanation: "You は複数扱いなので were を使い、否定は weren't です。", bePast: "were" },
    { subject: "My friends", detail: "___ interested in that game last year.", explanation: "複数主語なので were を使い、否定は weren't です。", bePast: "were" },
    { subject: "The lights", detail: "___ on last night.", explanation: "複数主語なので were を使い、否定は weren't です。", bePast: "were" },
    { subject: "The students", detail: "___ noisy during the exam.", explanation: "複数主語なので were を使い、否定は weren't です。", bePast: "were" },
    { subject: "The stores", detail: "___ open on New Year's Day.", explanation: "複数主語なので were を使い、否定は weren't です。", bePast: "were" },
    { subject: "Our teachers", detail: "___ strict last year.", explanation: "複数主語なので were を使い、否定は weren't です。", bePast: "were" }
  ];

  const questionPrompts = [
    { prompt: "___ she at the library yesterday afternoon?", explanation: "主語が she なので疑問文では Was を文頭に置きます。", answer: "Was" },
    { prompt: "___ they late for the meeting last night?", explanation: "主語が they なので疑問文では Were を文頭に置きます。", answer: "Were" },
    { prompt: "___ you happy with the result yesterday?", explanation: "主語が you なので疑問文では Were を文頭に置きます。", answer: "Were" },
    { prompt: "___ Tom sick two days ago?", explanation: "単数主語なので疑問文では Was を文頭に置きます。", answer: "Was" },
    { prompt: "___ the students excited about the trip last week?", explanation: "複数主語なので疑問文では Were を文頭に置きます。", answer: "Were" },
    { prompt: "___ it cold in Hokkaido last winter?", explanation: "It なので疑問文では Was を文頭に置きます。", answer: "Was" },
    { prompt: "___ your parents at home last weekend?", explanation: "複数主語なので疑問文では Were を文頭に置きます。", answer: "Were" },
    { prompt: "___ the concert interesting last night?", explanation: "concert は単数扱いなので疑問文では Was を文頭に置きます。", answer: "Was" },
    { prompt: "___ there a meeting after school yesterday?", explanation: "There を主語とする疑問文では Was there...? となります。", answer: "Was" },
    { prompt: "___ there any buses after 10 p.m. last night?", explanation: "複数を表すので Were there...? となります。", answer: "Were" },
    { prompt: "___ your brothers in Tokyo last summer?", explanation: "複数主語なので Were を使います。", answer: "Were" },
    { prompt: "___ the festival crowded last weekend?", explanation: "festival は単数扱いなので Was を使います。", answer: "Was" }
  ];

  const pastProgressiveSubjects = [
    { text: "I", clauseText: "I", bePast: "was", explanation: "I の過去進行形は was + 動詞ing です。", isPlural: false },
    { text: "He", clauseText: "he", bePast: "was", explanation: "He の過去進行形は was + 動詞ing です。", isPlural: false },
    { text: "She", clauseText: "she", bePast: "was", explanation: "She の過去進行形は was + 動詞ing です。", isPlural: false },
    { text: "It", clauseText: "it", bePast: "was", explanation: "It の過去進行形は was + 動詞ing です。", isPlural: false },
    { text: "My father", clauseText: "my father", bePast: "was", explanation: "単数主語なので was + 動詞ing です。", isPlural: false },
    { text: "Tom", clauseText: "Tom", bePast: "was", explanation: "単数主語なので was + 動詞ing です。", isPlural: false },
    { text: "You", clauseText: "you", bePast: "were", explanation: "You の過去進行形は were + 動詞ing です。", isPlural: true },
    { text: "We", clauseText: "we", bePast: "were", explanation: "We の過去進行形は were + 動詞ing です。", isPlural: true },
    { text: "They", clauseText: "they", bePast: "were", explanation: "They の過去進行形は were + 動詞ing です。", isPlural: true },
    { text: "My friends", clauseText: "my friends", bePast: "were", explanation: "複数主語なので were + 動詞ing です。", isPlural: true },
    { text: "The students", clauseText: "the students", bePast: "were", explanation: "複数主語なので were + 動詞ing です。", isPlural: true },
    { text: "The children", clauseText: "the children", bePast: "were", explanation: "複数主語なので were + 動詞ing です。", isPlural: true }
  ];

  const progressiveActivities = [
    { ing: "cooking dinner", simplePast: "cooked dinner", base: "cook dinner" },
    { ing: "studying math", simplePast: "studied math", base: "study math" },
    { ing: "writing a report", simplePast: "wrote a report", base: "write a report" },
    { ing: "reading a mystery novel", simplePast: "read a mystery novel", base: "read a mystery novel" },
    { ing: "cleaning the classroom", simplePast: "cleaned the classroom", base: "clean the classroom" },
    { ing: "watching a science show", simplePast: "watched a science show", base: "watch a science show" },
    { ing: "playing basketball", simplePast: "played basketball", base: "play basketball" },
    { ing: "practicing the piano", simplePast: "practiced the piano", base: "practice the piano" },
    { ing: "preparing for the debate", simplePast: "prepared for the debate", base: "prepare for the debate" },
    { ing: "fixing his bicycle", simplePast: "fixed his bicycle", base: "fix his bicycle" },
    { ing: "drawing a landscape", simplePast: "drew a landscape", base: "draw a landscape" },
    { ing: "talking with the teacher", simplePast: "talked with the teacher", base: "talk with the teacher" },
    { ing: "planning the trip", simplePast: "planned the trip", base: "plan the trip" },
    { ing: "waiting for the bus", simplePast: "waited for the bus", base: "wait for the bus" },
    { ing: "baking cookies", simplePast: "baked cookies", base: "bake cookies" },
    { ing: "repairing the computer", simplePast: "repaired the computer", base: "repair the computer" },
    { ing: "doing her homework", simplePast: "did her homework", base: "do her homework" },
    { ing: "checking the schedule", simplePast: "checked the schedule", base: "check the schedule" },
    { ing: "looking for his keys", simplePast: "looked for his keys", base: "look for his keys" },
    { ing: "listening to the radio", simplePast: "listened to the radio", base: "listen to the radio" },
    { ing: "gardening in the yard", simplePast: "gardened in the yard", base: "garden in the yard" },
    { ing: "painting the fence", simplePast: "painted the fence", base: "paint the fence" },
    { ing: "checking emails", simplePast: "checked emails", base: "check emails" },
    { ing: "shopping online", simplePast: "shopped online", base: "shop online" },
    { ing: "sewing a costume", simplePast: "sewed a costume", base: "sew a costume" },
    { ing: "organizing the files", simplePast: "organized the files", base: "organize the files" },
    { ing: "watering the flowers", simplePast: "watered the flowers", base: "water the flowers" },
    { ing: "stretching before practice", simplePast: "stretched before practice", base: "stretch before practice" },
    { ing: "learning new vocabulary", simplePast: "learned new vocabulary", base: "learn new vocabulary" },
    { ing: "reviewing for the quiz", simplePast: "reviewed for the quiz", base: "review for the quiz" },
    { ing: "taking pictures", simplePast: "took pictures", base: "take pictures" },
    { ing: "designing posters", simplePast: "designed posters", base: "design posters" },
    { ing: "sending a message", simplePast: "sent a message", base: "send a message" },
    { ing: "polishing his shoes", simplePast: "polished his shoes", base: "polish his shoes" },
    { ing: "typing a document", simplePast: "typed a document", base: "type a document" },
    { ing: "walking the dog", simplePast: "walked the dog", base: "walk the dog" },
    { ing: "stretching on the floor", simplePast: "stretched on the floor", base: "stretch on the floor" },
    { ing: "speaking on the phone", simplePast: "spoke on the phone", base: "speak on the phone" },
    { ing: "researching the topic", simplePast: "researched the topic", base: "research the topic" },
    { ing: "planning a surprise", simplePast: "planned a surprise", base: "plan a surprise" }
  ];

  const timeClauses = [
    { connector: "When", clause: "the teacher entered the room" },
    { connector: "When", clause: "the phone rang" },
    { connector: "While", clause: "the rain was falling" },
    { connector: "When", clause: "his friend visited him" },
    { connector: "While", clause: "the power was out" },
    { connector: "When", clause: "the bell rang" },
    { connector: "While", clause: "everyone else was sleeping" },
    { connector: "When", clause: "the principal called" },
    { connector: "While", clause: "the movie was starting" },
    { connector: "When", clause: "the door suddenly opened" },
    { connector: "While", clause: "the sun was setting" },
    { connector: "When", clause: "the announcement began" },
    { connector: "When", clause: "the earthquake happened" },
    { connector: "While", clause: "their parents were talking" },
    { connector: "When", clause: "the guests arrived" },
    { connector: "While", clause: "the music was playing" }
  ];

  const specificTimes = [
    "at 8 p.m. last night",
    "at noon yesterday",
    "at 7:30 this morning",
    "at 5:15 yesterday evening",
    "at 10 o'clock last Saturday",
    "at midnight last night",
    "at 6 a.m. yesterday",
    "at 3 p.m. last Sunday",
    "at 4:45 yesterday afternoon",
    "at 9:20 last Friday",
    "at 11:30 last Monday",
    "at 2 p.m. yesterday",
    "at 1:15 last Thursday",
    "at 8:40 last night",
    "at 6:50 yesterday morning",
    "at 5 p.m. on Tuesday"
  ];

  // Generate statements for singular subjects
  pastContextsSingular.slice(0, 14).forEach((context, idx) => {
    const subject = singularSubjects[idx % singularSubjects.length];
    const sentence = `${subject.text} ___ ${context.context} ${context.time}.`;
    const choices = beChoiceSets[subject.bePast];
    questions.push({
      id: "", // placeholder
      question: sentence,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `${subject.explanation} 時の説明として、過去の状態を表す文なので ${subject.bePast} を選びます。`
    });
  });

  // Generate statements for plural subjects
  pastContextsPlural.slice(0, 14).forEach((context, idx) => {
    const subject = pluralSubjects[idx % pluralSubjects.length];
    const sentence = `${subject.text} ___ ${context.context} ${context.time}.`;
    const choices = beChoiceSets[subject.bePast];
    questions.push({
      id: "",
      question: sentence,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `${subject.explanation} 過去の状態を表すので ${subject.bePast} を選びます。`
    });
  });

  // Generate negatives
  singularNegatives.forEach((item) => {
    const choices = beNegativeChoiceSets[item.bePast];
    questions.push({
      id: "",
      question: `${item.subject} ${item.detail}`,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `${item.explanation} 否定文なので ${choices[0]} を選びます。`
    });
  });

  pluralNegatives.forEach((item) => {
    const choices = beNegativeChoiceSets[item.bePast];
    questions.push({
      id: "",
      question: `${item.subject} ${item.detail}`,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `${item.explanation} 否定文なので ${choices[0]} を選びます。`
    });
  });

  // Generate questions
  questionPrompts.forEach((item) => {
    const choices = item.answer === "Was" ? ["Was", "Were", "Is", "Do"] : ["Were", "Was", "Are", "Did"];
    questions.push({
      id: "",
      question: item.prompt,
      type: "multiple",
      choices,
      answer: 0,
      explanation: item.explanation
    });
  });

  // Past progressive type A: "at specific time"
  const timeBasedCombos = [];
  for (let i = 0; i < specificTimes.length; i++) {
    const subject = pastProgressiveSubjects[i % pastProgressiveSubjects.length];
    const activity = progressiveActivities[i % progressiveActivities.length];
    const sentence = `${subject.text} ___ ${activity.ing} ${specificTimes[i]}.`;
    const correct = `${subject.bePast} ${activity.ing}`;
    const wrong1 = `${subject.bePast === "was" ? "were" : "was"} ${activity.ing}`;
    const wrong2 = `${subject.bePast} ${activity.simplePast}`;
    const wrong3 = `${subject.bePast === "was" ? "is" : "are"} ${activity.ing}`;
    const choices = [correct, wrong1, wrong2, wrong3];
    timeBasedCombos.push({
      id: "",
      question: sentence,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `${subject.explanation} 過去進行形は be 動詞の過去形 + 動詞の ing 形で表します。`
    });
  }
  questions.push(...timeBasedCombos);

  // Past progressive type B: "when clause"
  const clauseCombos = [];
  for (let i = 0; i < timeClauses.length; i++) {
    const subject = pastProgressiveSubjects[(i + 4) % pastProgressiveSubjects.length];
    const activity = progressiveActivities[(i + 10) % progressiveActivities.length];
    const clause = `${timeClauses[i].connector} ${timeClauses[i].clause}`;
    const sentence = `${clause}, ${subject.clauseText} ___ ${activity.ing}.`;
    const correct = `${subject.bePast} ${activity.ing}`;
    const wrong1 = `${subject.bePast === "was" ? "were" : "was"} ${activity.ing}`;
    const wrong2 = `${subject.bePast} ${activity.simplePast}`;
    const wrong3 = `${subject.bePast === "was" ? "is" : "are"} ${activity.ing}`;
    const choices = [correct, wrong1, wrong2, wrong3];
    clauseCombos.push({
      id: "",
      question: sentence,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `${subject.explanation} 「〜していたとき」を表す過去進行形なので ${correct} を選びます。`
    });
  }
  questions.push(...clauseCombos);

  const progressivePatternItems = [
    {
      question: "While we ___ soccer, it started to rain.",
      correct: "were playing",
      wrongs: ["played", "play", "have played"],
      explanation: "we という複数主語なので were + playing で過去進行形を作ります。"
    },
    {
      question: "When I called, she ___ a letter to her friend.",
      correct: "was writing",
      wrongs: ["wrote", "is writing", "has written"],
      explanation: "she という単数主語なので was + writing で過去進行形を作ります。"
    },
    {
      question: "They ___ dinner when the guest arrived.",
      correct: "were having",
      wrongs: ["had", "have", "have had"],
      explanation: "they は複数主語なので were having を使って「〜していた」を表します。"
    },
    {
      question: "I ___ to music when you knocked on the door.",
      correct: "was listening",
      wrongs: ["listened", "am listening", "have listened"],
      explanation: "I の過去進行形は was listening となります。"
    },
    {
      question: "He ___ in the pool while it was raining.",
      correct: "was swimming",
      wrongs: ["swam", "is swimming", "has swum"],
      explanation: "he の過去進行形なので was swimming を使います。"
    },
    {
      question: "The students ___ a science experiment when the fire alarm rang.",
      correct: "were conducting",
      wrongs: ["conducted", "conduct", "have conducted"],
      explanation: "複数主語なので were conducting を用いて過去進行形にします。"
    },
    {
      question: "My mother ___ the dishes while I was finishing my homework.",
      correct: "was washing",
      wrongs: ["washed", "is washing", "has washed"],
      explanation: "my mother は単数主語なので was washing となります。"
    },
    {
      question: "You ___ the guitar when the strings broke.",
      correct: "were playing",
      wrongs: ["played", "play", "have played"],
      explanation: "you の過去進行形は were playing を使います。"
    },
    {
      question: "The lights ___ when the storm hit the town.",
      correct: "were flickering",
      wrongs: ["flickered", "are flickering", "have flickered"],
      explanation: "The lights という複数主語なので were flickering を使います。"
    },
    {
      question: "She ___ to the radio when her favorite song came on.",
      correct: "was listening",
      wrongs: ["listened", "listens", "has listened"],
      explanation: "she の過去進行形なので was listening を選びます。"
    },
    {
      question: "They ___ around the fire while we told stories.",
      correct: "were sitting",
      wrongs: ["sat", "sit", "have sat"],
      explanation: "they は複数主語なので were sitting を用います。"
    },
    {
      question: "My father ___ the car when the phone rang.",
      correct: "was washing",
      wrongs: ["washed", "is washing", "has washed"],
      explanation: "my father は単数主語なので was washing を使います。"
    }
  ];

  progressivePatternItems.forEach((item) => {
    const choices = [item.correct, ...item.wrongs];
    questions.push({
      id: "",
      question: item.question,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `${item.explanation} 過去進行形は be 動詞の過去形 + 動詞の ing 形です。`
    });
  });

  if (questions.length !== 100) {
    throw new Error(`Question count mismatch for past-be-progressive: ${questions.length}`);
  }

  const numbered = questions.map((q, index) => ({
    ...q,
    id: formatId(prefix, index)
  }));

  return numbered;
}

function generateFutureExpressionsQuestions(prefix) {
  const questions = [];

  const predictionIntros = [
    "I think",
    "She believes",
    "They say",
    "Our coach says",
    "The news reports",
    "Our teacher expects",
    "Scientists predict"
  ];

  const willPredictionEvents = [
    { subject: "our team", verbPhrase: "win the championship this year", hint: "試合の結果を予想しています。" },
    { subject: "she", verbPhrase: "pass the entrance exam", hint: "合格するかどうかを予想しています。" },
    { subject: "the volunteers", verbPhrase: "finish the project on time", hint: "未来の出来事を予想しています。" },
    { subject: "my brother", verbPhrase: "arrive in Osaka before noon", hint: "到着時刻を予想しています。" },
    { subject: "the exchange student", verbPhrase: "visit our class next month", hint: "来訪予定を予想しています。" },
    { subject: "it", verbPhrase: "rain in the afternoon", hint: "天気の予想なので will を使います。" },
    { subject: "the museum", verbPhrase: "be crowded during Golden Week", hint: "未来の混雑を予想しています。" },
    { subject: "the new smartphone", verbPhrase: "sell out quickly", hint: "商品の売れ行きを予想しています。" },
    { subject: "they", verbPhrase: "call us back soon", hint: "今後の行動を予想しています。" },
    { subject: "the typhoon", verbPhrase: "reach Kyushu tomorrow morning", hint: "台風の到達を予想しています。" },
    { subject: "our teacher", verbPhrase: "show us new photos next week", hint: "未来の行動を予想しています。" },
    { subject: "the train", verbPhrase: "leave at six tomorrow", hint: "列車の発車を予想しています。" },
    { subject: "the company", verbPhrase: "hire more engineers next year", hint: "企業の動きを予想しています。" },
    { subject: "I", verbPhrase: "find a better idea soon", hint: "自分の未来の行動を予想しています。" }
  ];

  willPredictionEvents.forEach((event, idx) => {
    const intro = predictionIntros[idx % predictionIntros.length];
    const sentence = `${intro} ${event.subject} ___ ${event.verbPhrase}.`;
    const choices = ["will", "is going to", "can", "did"];
    questions.push({
      id: "",
      question: sentence,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `${event.hint} 未来の予測は通常 will + 動詞の原形で表します。`
    });
  });

  const planSubjects = [
    { text: "I", be: "am", explanation: "I には am going to を使います。" },
    { text: "She", be: "is", explanation: "She には is going to を使います。" },
    { text: "He", be: "is", explanation: "He には is going to を使います。" },
    { text: "We", be: "are", explanation: "We には are going to を使います。" },
    { text: "They", be: "are", explanation: "They には are going to を使います。" },
    { text: "My parents", be: "are", explanation: "複数主語なので are going to を使います。" },
    { text: "Our class", be: "is", explanation: "単数扱いなので is going to を使います。" }
  ];

  const planActivities = [
    { phrase: "visit the science museum on Saturday", hint: "事前に決めた予定を表しています。" },
    { phrase: "start a new reading club next month", hint: "前もって決めた計画です。" },
    { phrase: "practice for the speech contest after school", hint: "予定された行動を話しています。" },
    { phrase: "plant vegetables in the school garden", hint: "計画済みの活動を表しています。" },
    { phrase: "buy tickets for the summer festival", hint: "前もって準備した行動です。" },
    { phrase: "clean the community center this weekend", hint: "決めてある予定を表しています。" },
    { phrase: "launch a podcast about books", hint: "準備している計画です。" },
    { phrase: "hold a charity concert in July", hint: "計画しているイベントです。" },
    { phrase: "organize a beach clean-up next Sunday", hint: "前から決めている活動です。" },
    { phrase: "visit their grandparents during the holiday", hint: "予定された訪問です。" },
    { phrase: "decorate the classroom for the festival", hint: "準備している作業です。" },
    { phrase: "apply for an exchange program", hint: "事前に決めた行動です。" },
    { phrase: "study English with an online tutor", hint: "計画済みの勉強です。" },
    { phrase: "open a small online shop together", hint: "話し合って決めた計画です。" }
  ];

  planActivities.forEach((activity, idx) => {
    const subject = planSubjects[idx % planSubjects.length];
    const correct = `${subject.be} going to`;
    const wrong1 = subject.be === "am" ? "is going to" : "are going to";
    const wrong3 = subject.be === "are" ? "am going to" : "are going to";
    const wrongOptions = subject.be === "am"
      ? [wrong1, "will", "are going to"]
      : subject.be === "are"
        ? ["is going to", "will", "am going to"]
        : ["are going to", "will", "am going to"];
    const choices = [correct, ...wrongOptions];
    questions.push({
      id: "",
      question: `${subject.text} ___ ${activity.phrase}.`,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `${subject.explanation} ${activity.hint}`
    });
  });

  const willNegativeScenarios = [
    { subject: "He", action: "finish the project because he is sick", hint: "できないと考えている未来なので won't を使います。" },
    { subject: "She", action: "join the trip because she has another plan", hint: "予定がない未来を表します。" },
    { subject: "They", action: "attend the concert without tickets", hint: "実現しない予定を表します。" },
    { subject: "I", action: "forget your kindness", hint: "未来の否定を表現しています。" },
    { subject: "We", action: "start without you", hint: "意思による未来の否定です。" },
    { subject: "The store", action: "open on New Year's Day", hint: "未来の事実の否定を述べています。" },
    { subject: "My sister", action: "eat sweets because she is on a diet", hint: "今後しない予定です。" },
    { subject: "The train", action: "stop at this station", hint: "未来の運行を否定します。" },
    { subject: "I", action: "be late for the meeting", hint: "自信をもってしないと言っています。" },
    { subject: "Our teacher", action: "give us homework today", hint: "未来の出来事を否定しています。" }
  ];

  willNegativeScenarios.forEach((scenario) => {
    const sentence = `${scenario.subject} ___ ${scenario.action}.`;
    const choices = ["won't", "will", "doesn't", "is"];
    questions.push({
      id: "",
      question: sentence,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `${scenario.hint} will not の短縮形 won't を用います。`
    });
  });

  const goingNegativeData = [
    {
      subject: { text: "She", be: "is", explanation: "She には is を使い、否定は is not going to です。" },
      phrase: "eat dessert tonight because she feels sick",
      hint: "予定を否定しています。"
    },
    {
      subject: { text: "He", be: "is", explanation: "He には is を使い、否定は is not going to です。" },
      phrase: "play soccer after school because of the rain",
      hint: "やらない予定を表します。"
    },
    {
      subject: { text: "I", be: "am", explanation: "I には am を使い、否定は am not going to です。" },
      phrase: "stay up late before the exam",
      hint: "自分の予定を否定しています。"
    },
    {
      subject: { text: "We", be: "are", explanation: "We には are を使い、否定は are not going to です。" },
      phrase: "take the bus today because it is full",
      hint: "乗らない予定を表します。"
    },
    {
      subject: { text: "They", be: "are", explanation: "They には are を使い、否定は are not going to です。" },
      phrase: "travel abroad this winter",
      hint: "行かない予定を述べています。"
    },
    {
      subject: { text: "My parents", be: "are", explanation: "複数主語なので are not going to です。" },
      phrase: "buy a new car this year",
      hint: "購入しない予定です。"
    },
    {
      subject: { text: "Our class", be: "is", explanation: "単数扱いの Our class には is not going to を使います。" },
      phrase: "hold a party this month",
      hint: "開催しない予定です。"
    },
    {
      subject: { text: "The club members", be: "are", explanation: "複数主語なので are not going to を使います。" },
      phrase: "use smartphones during practice",
      hint: "しないと決めた予定です。"
    },
    {
      subject: { text: "He", be: "is", explanation: "He には is not going to を使います。" },
      phrase: "eat sweets because he is on a diet",
      hint: "やらない予定です。"
    },
    {
      subject: { text: "I", be: "am", explanation: "I には am not going to を使います。" },
      phrase: "forget to call my grandmother tonight",
      hint: "自分の予定を否定しています。"
    }
  ];

  goingNegativeData.forEach((data) => {
    const subject = data.subject;
    const correct = `${subject.be} not going to`;
    const wrongs = [
      `${subject.be} going to`,
      subject.be === "is" ? "are not going to" : "is not going to",
      "will not"
    ];
    const choices = [correct, ...wrongs];
    questions.push({
      id: "",
      question: `${subject.text} ___ ${data.phrase}.`,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `${subject.explanation} ${data.hint}`
    });
  });

  const willQuestionPrompts = [
    { sentence: "___ you help me with my homework tonight?", hint: "丁寧に依頼する疑問文です。" },
    { sentence: "___ she come to the meeting tomorrow?", hint: "未来の予定を尋ねています。" },
    { sentence: "___ they join us for the picnic?", hint: "参加を尋ねる疑問文です。" },
    { sentence: "___ he lend you the comic books?", hint: "意思を尋ねる疑問文です。" },
    { sentence: "___ we see fireworks this weekend?", hint: "未来の出来事について尋ねています。" },
    { sentence: "___ it be sunny on Sports Day?", hint: "未来の天気を尋ねています。" },
    { sentence: "___ your parents allow you to go abroad?", hint: "許可を尋ねています。" },
    { sentence: "___ the bus arrive on time?", hint: "運行予定を尋ねています。" },
    { sentence: "___ the teacher check our notebooks today?", hint: "予定を尋ねています。" },
    { sentence: "___ she call you after the lesson?", hint: "未来の行動を尋ねています。" }
  ];

  willQuestionPrompts.forEach((item) => {
    const choices = ["Will", "Do", "Are", "Did"];
    questions.push({
      id: "",
      question: item.sentence,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `${item.hint} 未来を尋ねる疑問文では Will を文頭に置きます。`
    });
  });

  const goingQuestionScenarios = [
    { sentence: "___ she going to join the art club next year?", hint: "be going to の疑問文です。", be: "is" },
    { sentence: "___ they going to stay at a hotel in Kyoto?", hint: "複数主語の be going to 疑問文です。", be: "are" },
    { sentence: "___ you going to take the English test in June?", hint: "You の疑問文では Are を使います。", be: "are" },
    { sentence: "___ he going to buy a new bicycle?", hint: "単数主語なので Is を使います。", be: "is" },
    { sentence: "___ we going to have a quiz tomorrow?", hint: "We の疑問文なので Are を使います。", be: "are" },
    { sentence: "___ Tom going to study abroad this summer?", hint: "Tom は単数なので Is を使います。", be: "is" },
    { sentence: "___ your friends going to visit Osaka?", hint: "複数主語なので Are を使います。", be: "are" },
    { sentence: "___ the club going to invite a guest speaker?", hint: "単数扱いなので Is を使います。", be: "is" },
    { sentence: "___ your sister going to practice the violin tonight?", hint: "単数主語なので Is を使います。", be: "is" },
    { sentence: "___ they going to clean the beach on Saturday?", hint: "複数主語なので Are を使います。", be: "are" }
  ];

  goingQuestionScenarios.forEach((item) => {
    const correct = item.be === "is" ? "Is" : "Are";
    const choices = [correct, correct === "Is" ? "Are" : "Is", "Do", "Will"];
    questions.push({
      id: "",
      question: item.sentence,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `${item.hint} be 動詞の疑問文では ${correct} を文頭に置きます。`
    });
  });

  const evidenceScenarios = [
    { lead: "Look at those dark clouds.", subject: { text: "It", be: "is" }, event: "rain soon", hint: "目に見える証拠があるので be going to を使います。" },
    { lead: "That child has his textbooks open.", subject: { text: "He", be: "is" }, event: "study now", hint: "すぐに起こりそうな行動です。" },
    { lead: "The wind is getting stronger.", subject: { text: "The typhoon", be: "is" }, event: "hit the island tonight", hint: "兆候がある未来です。" },
    { lead: "Those boxes are packed by the door.", subject: { text: "They", be: "are" }, event: "move out today", hint: "準備が整っている様子です。" },
    { lead: "There is no food in the fridge.", subject: { text: "We", be: "are" }, event: "eat out tonight", hint: "状況から判断した未来です。" },
    { lead: "His bag is full of sketchbooks.", subject: { text: "He", be: "is" }, event: "draw pictures in the park", hint: "兆候から判断しています。" },
    { lead: "The signal on her phone is weak.", subject: { text: "Her call", be: "is" }, event: "fail soon", hint: "目に見える変化から判断しています。" },
    { lead: "The leaves are turning yellow.", subject: { text: "The trees", be: "are" }, event: "lose their leaves soon", hint: "季節の兆候です。" },
    { lead: "The alarm clock is set for 5 a.m.", subject: { text: "He", be: "is" }, event: "get up early tomorrow", hint: "準備済みなので be going to を使います。" },
    { lead: "There are many chairs being arranged.", subject: { text: "There", be: "is" }, event: "be a meeting here", hint: "確かな準備がある未来です。" },
    { lead: "The stage lights are turning on.", subject: { text: "The show", be: "is" }, event: "start in a few minutes", hint: "まもなく起こることです。" },
    { lead: "She has her running shoes on.", subject: { text: "She", be: "is" }, event: "go for a jog", hint: "準備から判断しています。" }
  ];

  evidenceScenarios.forEach((scenario) => {
    const correct = `${scenario.subject.be} going to`;
    const wrongs = [
      `${scenario.subject.be} not going to`,
      "will",
      scenario.subject.be === "is" ? "are going to" : "is going to"
    ];
    const sentence = `${scenario.lead} ${scenario.subject.text} ___ ${scenario.event}.`;
    questions.push({
      id: "",
      question: sentence,
      type: "multiple",
      choices: [correct, ...wrongs],
      answer: 0,
      explanation: `${scenario.hint}`
    });
  });

  const instantDecisionScenarios = [
    { context: "I forgot to reply to her message.", continuation: "I ___ send her a text now.", hint: "今決めたことなので will を使います。" },
    { context: "The phone is ringing.", continuation: "I ___ answer it.", hint: "その場で決めた行動です。" },
    { context: "We have no milk left.", continuation: "I ___ go to the store right away.", hint: "瞬間的な決定です。" },
    { context: "It's cold in here.", continuation: "I ___ close the window.", hint: "その場での申し出です。" },
    { context: "Someone is knocking at the door.", continuation: "I ___ check who it is.", hint: "その場で決めているので will を使います。" },
    { context: "You look tired.", continuation: "I ___ carry your bag.", hint: "申し出を表す will です。" },
    { context: "You can't find your pen.", continuation: "I ___ lend you mine.", hint: "申し出の will です。" },
    { context: "It is too dark to walk.", continuation: "I ___ turn on the light.", hint: "その場で決めた行動です。" },
    { context: "He doesn't understand the question.", continuation: "I ___ explain it to him.", hint: "申し出で使う will です。" },
    { context: "We don't have enough chairs.", continuation: "I ___ bring some from the next room.", hint: "瞬間の決定なので will を使います。" }
  ];

  instantDecisionScenarios.forEach((scenario) => {
    const sentence = `${scenario.context} ${scenario.continuation}`;
    const choices = ["will", "am going to", "can", "was"];
    questions.push({
      id: "",
      question: sentence,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `${scenario.hint}`
    });
  });

  const scheduleScenarios = [
    { subject: "The meeting", event: "___ start at nine tomorrow.", hint: "決まっている予定です。" },
    { subject: "Our flight", event: "___ leave at 7 a.m. on Monday.", hint: "時刻表で決まっている予定です。" },
    { subject: "The movie", event: "___ begin at half past six.", hint: "決まった時間の予定です。" },
    { subject: "The new shop", event: "___ open next weekend.", hint: "公式に決まった予定です。" },
    { subject: "The science fair", event: "___ take place in November.", hint: "予定されている行事です。" },
    { subject: "The train", event: "___ arrive at platform three.", hint: "時刻表による予定です。" },
    { subject: "The online seminar", event: "___ start at 8 p.m. tonight.", hint: "開始時刻が決まっています。" },
    { subject: "Our presentation", event: "___ finish by 4 p.m.", hint: "終了時刻が決まっています。" },
    { subject: "Club practice", event: "___ resume next Tuesday.", hint: "再開の予定が決まっています。" },
    { subject: "The festival", event: "___ open its gates at ten.", hint: "開始時刻が決まっています。" }
  ];

  scheduleScenarios.forEach((scenario) => {
    const sentence = `${scenario.subject} ${scenario.event}`;
    const choices = ["will", "is going to", "can", "did"];
    questions.push({
      id: "",
      question: sentence,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `${scenario.hint} 未来の予定を述べる文で will を用いています。`
    });
  });

  if (questions.length !== 100) {
    throw new Error(`Question count mismatch for future-expressions: ${questions.length}`);
  }

  return questions.map((q, index) => ({
    ...q,
    id: formatId(prefix, index)
  }));
}

function generateConjunctionQuestions(prefix) {
  const questions = [];

  const conjunctionSets = [
    {
      conjunction: "and",
      distractors: ["but", "so", "because"],
      explanation: "同じ種類の出来事や情報をつなぐときは and を使います。",
      pairs: [
        { before: "He cleaned his room", after: "washed the dishes afterwards" },
        { before: "We visited the museum", after: "took many pictures" },
        { before: "She wrote the report", after: "sent it to the teacher" },
        { before: "My brother cooked dinner", after: "set the table" },
        { before: "The wind was strong", after: "the rain was cold" },
        { before: "The students studied hard", after: "they passed the test" },
        { before: "I bought some apples", after: "made a pie for dessert" },
        { before: "They planted flowers", after: "watered the garden every day" }
      ]
    },
    {
      conjunction: "but",
      distractors: ["and", "so", "because"],
      explanation: "対立する内容を並べるときは but を使います。",
      pairs: [
        { before: "I wanted to go hiking", after: "it started to rain" },
        { before: "She practiced very hard", after: "she didn't win the game" },
        { before: "He likes math", after: "his brother prefers English" },
        { before: "We planned a picnic", after: "the park was closed" },
        { before: "My sister is shy", after: "she loves singing on stage" },
        { before: "The book looked difficult", after: "it was easy to read" },
        { before: "I brought an umbrella", after: "I didn't need to use it" },
        { before: "They wanted to play outside", after: "it was already dark" }
      ]
    },
    {
      conjunction: "or",
      distractors: ["and", "but", "because"],
      explanation: "選択肢を示すときは or を使います。",
      pairs: [
        { before: "Would you like tea", after: "would you prefer coffee" },
        { before: "We can go by train", after: "we can take the bus" },
        { before: "Do you want to study now", after: "do you want to review later" },
        { before: "Shall we watch a movie", after: "shall we play board games" },
        { before: "He must choose soccer club", after: "join the music club" },
        { before: "You can read a book", after: "listen to music quietly" },
        { before: "Should I call him", after: "send him a message" },
        { before: "Do you want curry", after: "do you want pasta" }
      ]
    },
    {
      conjunction: "so",
      distractors: ["because", "but", "although"],
      explanation: "原因の結果を述べるときは so を使います。",
      pairs: [
        { before: "It was raining hard,", after: "we stayed at home" },
        { before: "She forgot her notebook,", after: "I lent her mine" },
        { before: "He studied every night,", after: "he passed the exam" },
        { before: "The movie was very popular,", after: "all the tickets sold out" },
        { before: "The road was icy,", after: "they drove very slowly" },
        { before: "The alarm didn't ring,", after: "he was late for school" },
        { before: "The cake looked delicious,", after: "everyone wanted a slice" },
        { before: "We were hungry,", after: "we cooked pasta" }
      ]
    },
    {
      conjunction: "because",
      distractors: ["so", "and", "but"],
      explanation: "理由を述べるときは because を使います。",
      pairs: [
        { before: "We stayed home", after: "it was snowing heavily" },
        { before: "She went to bed early", after: "she was very tired" },
        { before: "He was absent", after: "he caught a cold" },
        { before: "They enjoyed the trip", after: "the weather was perfect" },
        { before: "I couldn't read the menu", after: "it was in French" },
        { before: "We had to hurry", after: "the train was leaving soon" },
        { before: "She was late", after: "the bus broke down" },
        { before: "He is famous", after: "he writes inspiring novels" }
      ]
    },
    {
      conjunction: "if",
      distractors: ["when", "because", "so"],
      explanation: "「もし〜なら」という条件を表すときは if を使います。",
      pairs: [
        { before: "___ it rains tomorrow,", after: "we will cancel the match" },
        { before: "___ you study hard,", after: "you will improve" },
        { before: "___ he calls you,", after: "please tell me" },
        { before: "___ we finish early,", after: "let's play basketball" },
        { before: "___ you feel sick,", after: "go to the nurse's office" },
        { before: "___ the store is closed,", after: "we will come back later" },
        { before: "___ she forgets her homework,", after: "the teacher will be angry" },
        { before: "___ you see Ken,", after: "ask him about the schedule" }
      ],
      isFrontBlank: true
    },
    {
      conjunction: "when",
      distractors: ["if", "after", "while"],
      explanation: "「〜するとき」には when を使います。",
      pairs: [
        { before: "Call me", after: "you arrive at the station" },
        { before: "Wash your hands", after: "you get home" },
        { before: "He was reading", after: "I visited him" },
        { before: "She smiled", after: "she saw the present" },
        { before: "We were nervous", after: "the test began" },
        { before: "They cheered", after: "their team scored" },
        { before: "I was surprised", after: "he spoke Japanese fluently" },
        { before: "Take notes", after: "you listen to the explanation" }
      ]
    },
    {
      conjunction: "while",
      distractors: ["when", "because", "after"],
      explanation: "同時進行を表すときは while を使います。",
      pairs: [
        { before: "She was studying", after: "her brother was playing games" },
        { before: "He listened to music", after: "he was riding the train" },
        { before: "They talked quietly", after: "the teacher was writing on the board" },
        { before: "I was cooking", after: "my sister was setting the table" },
        { before: "We waited", after: "the doctor was examining the patient" },
        { before: "The children were laughing", after: "they played in the park" },
        { before: "The lights went out", after: "we were watching a movie" },
        { before: "He took notes", after: "the speaker was explaining the plan" }
      ]
    },
    {
      conjunction: "before",
      distractors: ["after", "until", "when"],
      explanation: "「〜する前に」には before を使います。",
      pairs: [
        { before: "Brush your teeth", after: "you go to bed" },
        { before: "Check your answers", after: "you submit the test" },
        { before: "She reviews her notes", after: "she starts a new lesson" },
        { before: "We took a photo", after: "we entered the museum" },
        { before: "He warms up", after: "he runs a marathon" },
        { before: "Call me", after: "you leave school" },
        { before: "They practice", after: "they perform on stage" },
        { before: "I always stretch", after: "I go jogging" }
      ]
    },
    {
      conjunction: "after",
      distractors: ["before", "while", "until"],
      explanation: "「〜した後で」には after を使います。",
      pairs: [
        { before: "We ate dinner", after: "we finished our homework" },
        { before: "She took a nap", after: "she completed the project" },
        { before: "They went to a cafe", after: "they watched the movie" },
        { before: "I will call you", after: "I arrive home" },
        { before: "He washed the car", after: "he played soccer" },
        { before: "We cleaned the classroom", after: "the class was over" },
        { before: "She listened to music", after: "she practiced piano" },
        { before: "They relaxed", after: "they finished the marathon" }
      ]
    },
    {
      conjunction: "until",
      distractors: ["before", "since", "because"],
      explanation: "「〜するまで」には until を使います。",
      pairs: [
        { before: "He waited", after: "the last train arrived" },
        { before: "We studied", after: "the bell rang" },
        { before: "She worked", after: "midnight" },
        { before: "They talked", after: "the cafe closed" },
        { before: "I will stay here", after: "you come back" },
        { before: "Keep practicing", after: "you can do it smoothly" },
        { before: "The store stayed open", after: "everyone finished shopping" },
        { before: "He kept trying", after: "he solved the problem" }
      ]
    },
    {
      conjunction: "although",
      distractors: ["because", "so", "until"],
      explanation: "「〜だけれども」を表すときは although を使います。",
      pairs: [
        { before: "___ she was tired,", after: "she kept studying" },
        { before: "___ it was late,", after: "they continued playing chess" },
        { before: "___ he is young,", after: "he speaks like an adult" },
        { before: "___ the road was narrow,", after: "the bus passed safely" },
        { before: "___ it was raining,", after: "the runners kept going" },
        { before: "___ I practice a lot,", after: "I still get nervous" },
        { before: "___ she failed once,", after: "she didn't give up" },
        { before: "___ the weather was terrible,", after: "the festival was fun" }
      ],
      isFrontBlank: true
    }
  ];

  const unlessPairs = [
    { before: "You can't go out", after: "you finish your homework" },
    { before: "The alarm won't stop", after: "you press this button" },
    { before: "We can't leave", after: "everyone arrives" },
    { before: "He won't succeed", after: "he keeps trying" }
  ];

  conjunctionSets.forEach((set) => {
    set.pairs.forEach((pair) => {
      const isFrontBlank = set.isFrontBlank || false;
      const base = isFrontBlank
        ? `${pair.before} ${pair.after}.`
        : `${pair.before} ___ ${pair.after}.`;

      const formattedQuestion = base
        .replace(/\s{2,}/g, " ")
        .trim()
        .replace(/\s\./g, ".");

      const explanation = pair.explanation
        ? `${pair.explanation} ${set.explanation}`
        : set.explanation;

      questions.push({
        id: "",
        question: formattedQuestion,
        type: "multiple",
        choices: [set.conjunction, ...set.distractors],
        answer: 0,
        explanation
      });
    });
  });

  unlessPairs.forEach((pair) => {
    const question = `${pair.before} ___ ${pair.after}.`;
    questions.push({
      id: "",
      question,
      type: "multiple",
      choices: ["unless", "if", "although", "because"],
      answer: 0,
      explanation: "「〜しない限り」という条件には unless を用います。"
    });
  });

  if (questions.length !== 100) {
    throw new Error(`Question count mismatch for conjunctions: ${questions.length}`);
  }

  return questions.map((q, index) => ({
    ...q,
    id: formatId(prefix, index)
  }));
}

function generateModalVerbQuestions(prefix) {
  const questions = [];

  const abilityScenarios = [
    { subject: "Saki", action: "speak three languages fluently", can: true, hint: "能力があることを表しています。" },
    { subject: "Ken", action: "solve this math puzzle quickly", can: true, hint: "できることを述べています。" },
    { subject: "They", action: "run five kilometers without stopping", can: true, hint: "十分な能力があるという意味です。" },
    { subject: "The robot", action: "carry heavy boxes for us", can: true, hint: "ロボットにできることを表しています。" },
    { subject: "My father", action: "cook Italian dishes very well", can: true, hint: "得意なことを表しています。" },
    { subject: "The students", action: "design a simple website", can: true, hint: "可能なことを述べています。" },
    { subject: "Ayaka", action: "play the violin beautifully", can: true, hint: "能力があるという意味です。" },
    { subject: "We", action: "see the mountains from this window", can: true, hint: "見えることを表しています。" },
    { subject: "The club members", action: "finish the project by Friday", can: true, hint: "可能であることを述べています。" },
    { subject: "You", action: "answer the quiz without looking at the textbook", can: true, hint: "できることを示しています。" },
    { subject: "Babies", action: "tie their own shoelaces", can: false, hint: "乳児にはできないことです。" },
    { subject: "This computer", action: "work without electricity", can: false, hint: "電気なしでは動けません。" },
    { subject: "My little brother", action: "drive a car", can: false, hint: "法律的にも不可能です。" },
    { subject: "Penguins", action: "fly in the sky", can: false, hint: "ペンギンは飛べません。" },
    { subject: "The old phone", action: "connect to high-speed Wi-Fi", can: false, hint: "古い携帯にはできません。" },
    { subject: "Our dog", action: "talk like a human", can: false, hint: "犬には話せません。" },
    { subject: "Fish", action: "live on land for a long time", can: false, hint: "水生動物にはできません。" },
    { subject: "This train", action: "stop at every tiny village", can: false, hint: "各駅停車ではありません。" },
    { subject: "This plant", action: "grow without sunlight", can: false, hint: "植物は光合成が必要です。" },
    { subject: "I", action: "lift this heavy piano alone", can: false, hint: "一人では持ち上げられません。" }
  ];

  abilityScenarios.forEach((scenario) => {
    const correct = scenario.can ? "can" : "can't";
    const distractors = scenario.can ? ["can't", "must", "should"] : ["can", "must", "should"];
    const choices = [correct, ...distractors];
    questions.push({
      id: "",
      question: `${scenario.subject} ___ ${scenario.action}.`,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `${scenario.hint} そのため ${correct} を使います。`
    });
  });

  const mustScenarios = [
    { subject: "You", action: "wear a helmet when you ride a bike", type: "must", hint: "安全のための義務です。" },
    { subject: "Students", action: "hand in the report by Monday", type: "must", hint: "締め切りの必須条件です。" },
    { subject: "He", action: "take his medicine every day", type: "must", hint: "健康のために必要です。" },
    { subject: "We", action: "be quiet in the library", type: "must", hint: "図書館では静かにする義務があります。" },
    { subject: "She", action: "finish the presentation before Friday", type: "must", hint: "締め切りがあります。" },
    { subject: "They", action: "check in two hours before the flight", type: "must", hint: "航空会社の決まりです。" },
    { subject: "Passengers", action: "fasten their seat belts", type: "must", hint: "安全上の義務です。" },
    { subject: "You", action: "not use your phone during the exam", type: "mustn't", hint: "禁止されている行為です。" },
    { subject: "We", action: "not feed the animals in this zoo", type: "mustn't", hint: "動物園の決まりです。" },
    { subject: "He", action: "not smoke in this building", type: "mustn't", hint: "館内禁煙です。" },
    { subject: "She", action: "not share the test questions online", type: "mustn't", hint: "ルール違反だからです。" },
    { subject: "Drivers", action: "not drive over the speed limit", type: "mustn't", hint: "法律で禁止されています。" },
    { subject: "They", action: "not enter the lab without permission", type: "mustn't", hint: "許可が必要です。" },
    { subject: "You", action: "not forget to lock the door", type: "must", hint: "安全のため必ず必要です。" }
  ];

  mustScenarios.forEach((scenario) => {
    const correct = scenario.type === "must" ? "must" : "mustn't";
    const choices = scenario.type === "must"
      ? ["must", "should", "can", "don't have to"]
      : ["mustn't", "must", "should", "have to"];
    questions.push({
      id: "",
      question: `${scenario.subject} ___ ${scenario.action}.`,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `${scenario.hint} そのため ${correct} を用います。`
    });
  });

  const haveToScenarios = [
    { subject: "I", action: "finish this homework tonight", required: true, hint: "自分でやらなければならない外的義務です。" },
    { subject: "She", action: "take care of her little sister after school", required: true, hint: "やる必要がある状況です。" },
    { subject: "We", action: "wear uniforms at this school", required: true, hint: "校則で決まっています。" },
    { subject: "They", action: "practice every morning", required: true, hint: "チームの決まりです。" },
    { subject: "He", action: "be at the office by 8 a.m.", required: true, hint: "会社のルールです。" },
    { subject: "The members", action: "bring their own lunch", required: true, hint: "持参しなければなりません。" },
    { subject: "You", action: "not come to school on Sunday", required: false, hint: "日曜日は休みなので必要ありません。" },
    { subject: "We", action: "pay to enter this museum", required: false, hint: "入館は無料です。" },
    { subject: "She", action: "cook tonight because they are going out", required: false, hint: "家族が外食するので必要ありません。" },
    { subject: "He", action: "bring his laptop to the meeting", required: false, hint: "貸出用が用意されています。" },
    { subject: "They", action: "work on Saturday this week", required: false, hint: "今週の土曜日は休みです。" },
    { subject: "Students", action: "buy new textbooks this year", required: false, hint: "学校が配布します。" }
  ];

  haveToScenarios.forEach((scenario) => {
    const beThirdPerson = ["He", "She", "It", "The club", "The team", "The teacher"].some((name) =>
      scenario.subject.startsWith(name)
    );
    const subjectHas = scenario.subject === "She" || scenario.subject === "He" || scenario.subject.startsWith("The") && !scenario.subject.includes("members");
    const correct = scenario.required
      ? subjectHas ? "has to" : "have to"
      : subjectHas ? "doesn't have to" : "don't have to";
    const choices = scenario.required
      ? [correct, subjectHas ? "have to" : "has to", "mustn't", "shouldn't"]
      : [correct, subjectHas ? "has to" : "have to", "must", "should"];
    questions.push({
      id: "",
      question: `${scenario.subject} ___ ${scenario.action}.`,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `${scenario.hint} したがって ${correct} を使います。`
    });
  });

  const shouldScenarios = [
    { subject: "You", action: "take a break if you feel tired", positive: true, hint: "助言として「〜したほうがよい」です。" },
    { subject: "He", action: "see a doctor about that cough", positive: true, hint: "病院に行くことを勧めています。" },
    { subject: "We", action: "save some money every month", positive: true, hint: "貯金を勧めています。" },
    { subject: "She", action: "practice her speech once more", positive: true, hint: "練習を勧めています。" },
    { subject: "They", action: "arrive early for the concert", positive: true, hint: "早めの到着を勧めています。" },
    { subject: "You", action: "read the instructions carefully", positive: true, hint: "注意深く読むことを勧めています。" },
    { subject: "He", action: "talk to his parents about the problem", positive: true, hint: "相談することを勧めています。" },
    { subject: "You", action: "not eat too much junk food", positive: false, hint: "健康のため避けるべきです。" },
    { subject: "She", action: "not stay up so late every night", positive: false, hint: "夜更かししないほうがよいです。" },
    { subject: "They", action: "not skip the warm-up exercises", positive: false, hint: "準備運動を飛ばすべきではありません。" },
    { subject: "We", action: "not ignore the teacher's advice", positive: false, hint: "助言を無視しないほうがよいです。" },
    { subject: "He", action: "not spend all his money on games", positive: false, hint: "ゲームに全て使うべきではありません。" },
    { subject: "You", action: "not forget to say thank you", positive: false, hint: "感謝を忘れないほうがよいです。" },
    { subject: "She", action: "not walk alone at night", positive: false, hint: "一人で歩くのは避けるべきです。" }
  ];

  shouldScenarios.forEach((scenario) => {
    const correct = scenario.positive ? "should" : "shouldn't";
    const choices = scenario.positive
      ? ["should", "must", "can", "would"]
      : ["shouldn't", "should", "can't", "must"];
    questions.push({
      id: "",
      question: `${scenario.subject} ___ ${scenario.action}.`,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `${scenario.hint} そのため ${correct} を選びます。`
    });
  });

  const mayMightScenarios = [
    { question: "It ___ rain this evening, so take an umbrella.", correct: "may", hint: "可能性を表す may。" },
    { question: "She ___ be late because the train is delayed.", correct: "might", hint: "起こり得る遅れを表します。" },
    { question: "___ I open the window?", correct: "May", hint: "丁寧な許可の求め方です。" },
    { question: "They ___ visit us during the holidays.", correct: "may", hint: "未来の可能性を表します。" },
    { question: "He ___ not come today because he is sick.", correct: "might", hint: "来ないかもしれない可能性です。" },
    { question: "___ we leave our bags here?", correct: "May", hint: "許可を求める表現です。" },
    { question: "The roads ___ be icy tomorrow morning.", correct: "may", hint: "未来の可能性です。" },
    { question: "She ___ know the answer, but I'm not sure.", correct: "might", hint: "推量を表します。" },
    { question: "You ___ borrow my bike if you need it.", correct: "may", hint: "許可を与える表現です。" },
    { question: "He ___ be at the library now.", correct: "might", hint: "現在の推量です。" }
  ];

  mayMightScenarios.forEach((scenario) => {
    const firstChoice = scenario.correct;
    const rest = scenario.correct.toLowerCase() === "may"
      ? ["might", "must", "can"]
      : ["may", "must", "can"];
    const choices = [firstChoice, ...rest];
    questions.push({
      id: "",
      question: scenario.question,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `${scenario.hint}`
    });
  });

  const politeRequestScenarios = [
    { question: "___ you pass me the salt, please?", correct: "Could", hint: "丁寧な依頼には Could you...? がよく使われます。" },
    { question: "___ you lend me your notes later?", correct: "Could", hint: "丁寧に頼んでいます。" },
    { question: "___ you show me how to use this app?", correct: "Could", hint: "丁寧なお願いです。" },
    { question: "___ you open the window a little?", correct: "Could", hint: "丁寧な依頼です。" },
    { question: "___ you help me carry these boxes?", correct: "Could", hint: "手伝いをお願いしています。" },
    { question: "___ you tell me the way to the station?", correct: "Could", hint: "道を尋ねるときの丁寧な表現です。" },
    { question: "___ you join us for dinner tonight?", correct: "Would", hint: "丁寧な勧誘には Would you...? を使います。" },
    { question: "___ you like to have some tea?", correct: "Would", hint: "申し出を表す表現です。" },
    { question: "___ you mind closing the door?", correct: "Would", hint: "Would you mind...? の形です。" },
    { question: "___ you please sit here?", correct: "Would", hint: "丁寧なお願いです。" }
  ];

  politeRequestScenarios.forEach((scenario) => {
    const choices = scenario.correct === "Could"
      ? ["Could", "Can", "May", "Should"]
      : ["Would", "Will", "Can", "Should"];
    questions.push({
      id: "",
      question: scenario.question,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `${scenario.hint}`
    });
  });

  const hadBetterScenarios = [
    { subject: "You", action: "take an umbrella today", negative: false, hint: "強い勧告として had better を使います。" },
    { subject: "He", action: "see a doctor soon", negative: false, hint: "早く受診したほうがよいという助言です。" },
    { subject: "We", action: "check the train schedule once more", negative: false, hint: "念のため確認したほうがよいです。" },
    { subject: "They", action: "leave home early", negative: false, hint: "遅れないように勧めています。" },
    { subject: "You", action: "back up your files", negative: false, hint: "データを守るための強い助言です。" },
    { subject: "She", action: "apologize to her friend", negative: false, hint: "謝ったほうがよい状況です。" },
    { subject: "You", action: "not be late for the interview", negative: true, hint: "強い禁止的助言です。" },
    { subject: "He", action: "not forget the meeting documents", negative: true, hint: "忘れないよう釘をさしています。" },
    { subject: "They", action: "not stay up too late", negative: true, hint: "健康のため控えるべきです。" },
    { subject: "We", action: "not ignore the teacher's warning", negative: true, hint: "警告を無視しないよう勧めています。" }
  ];

  hadBetterScenarios.forEach((scenario) => {
    const correct = scenario.negative ? "had better not" : "had better";
    const choices = scenario.negative
      ? ["had better not", "shouldn't", "don't have to", "mustn't"]
      : ["had better", "should", "have to", "must"];
    questions.push({
      id: "",
      question: `${scenario.subject} ___ ${scenario.action}.`,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `${scenario.hint} よって ${correct} を使います。`
    });
  });

  const wouldLikeScenarios = [
    { subject: "I", action: "visit the art museum this afternoon", hint: "丁寧な希望を表す表現です。" },
    { subject: "We", action: "try the new bakery in town", hint: "丁寧に願望を述べています。" },
    { subject: "She", action: "learn how to play the guitar", hint: "やりたいことを丁寧に述べています。" },
    { subject: "He", action: "join the volunteer group", hint: "参加の希望を表しています。" },
    { subject: "They", action: "travel to Okinawa next spring", hint: "旅行の希望を表しています。" },
    { subject: "My parents", action: "meet your family soon", hint: "丁寧に希望を伝えています。" },
    { subject: "Our teacher", action: "see your project plan", hint: "丁寧な依頼です。" },
    { subject: "I", action: "order the special lunch set", hint: "注文の希望です。" },
    { subject: "We", action: "have a meeting tomorrow morning", hint: "丁寧に提案しています。" },
    { subject: "The exchange students", action: "learn about Japanese festivals", hint: "知りたい希望です。" }
  ];

  wouldLikeScenarios.forEach((scenario) => {
    const choices = ["would like to", "want to", "should", "have to"];
    questions.push({
      id: "",
      question: `${scenario.subject} ___ ${scenario.action}.`,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `${scenario.hint} 「〜したい」という丁寧な表現は would like to を使います。`
    });
  });

  if (questions.length !== 100) {
    throw new Error(`Question count mismatch for modal verbs: ${questions.length}`);
  }

  return questions.map((q, index) => ({
    ...q,
    id: formatId(prefix, index)
  }));
}

function generateThereBeQuestions(prefix) {
  const questions = [];

  const presentSingular = [
    "There ___ a bakery near the station.",
    "There ___ a letter for you on the table.",
    "There ___ a library across from the park.",
    "There ___ a tall tree in front of our house.",
    "There ___ a message on the whiteboard.",
    "There ___ a test tomorrow morning.",
    "There ___ a pencil on the floor.",
    "There ___ a museum in this small town.",
    "There ___ a taxi waiting outside.",
    "There ___ a concert at the hall tonight.",
    "There ___ a problem with this printer.",
    "There ___ a rainbow after the rain.",
    "There ___ a movie I want to see.",
    "There ___ a soccer match at the stadium.",
    "There ___ a call for you from Mr. Sato.",
    "There ___ a chair next to the window.",
    "There ___ a cafeteria on the first floor.",
    "There ___ a festival in our city this weekend.",
    "There ___ a bus stop near the school.",
    "There ___ an emergency exit at the back."
  ];

  const presentPlural = [
    "There ___ three apples on the plate.",
    "There ___ many students in the gym.",
    "There ___ two computers in the library.",
    "There ___ some pictures on the wall.",
    "There ___ several parks in this town.",
    "There ___ five questions on the quiz.",
    "There ___ enough seats for everyone.",
    "There ___ a lot of stars in the sky tonight.",
    "There ___ new houses on that street.",
    "There ___ many books about history here.",
    "There ___ buses every ten minutes.",
    "There ___ candles on the birthday cake.",
    "There ___ volunteers helping at the event.",
    "There ___ two errors in this report.",
    "There ___ plenty of snacks on the table.",
    "There ___ interesting exhibits at the museum.",
    "There ___ bicycles parked near the gate.",
    "There ___ clouds in the blue sky.",
    "There ___ instructions on the back of the box.",
    "There ___ fresh flowers in the vase."
  ];

  const presentNegative = [
    { sentence: "There ___ any milk left in the fridge.", correct: "isn't" },
    { sentence: "There ___ any classes after lunch today.", correct: "aren't" },
    { sentence: "There ___ a bus to the city tonight.", correct: "isn't" },
    { sentence: "There ___ enough chairs for all the guests.", correct: "aren't" },
    { sentence: "There ___ a bank on this street.", correct: "isn't" },
    { sentence: "There ___ any mistakes in her essay.", correct: "aren't" },
    { sentence: "There ___ time to waste.", correct: "isn't" },
    { sentence: "There ___ many people at the station early in the morning.", correct: "aren't" },
    { sentence: "There ___ a doctor available right now.", correct: "isn't" },
    { sentence: "There ___ any tickets left for the concert.", correct: "aren't" }
  ];

  const presentQuestions = [
    { sentence: "___ there a supermarket near here?", correct: "Is" },
    { sentence: "___ there any homework for tomorrow?", correct: "Is" },
    { sentence: "___ there two pencils in your bag?", correct: "Are" },
    { sentence: "___ there any seats available?", correct: "Are" },
    { sentence: "___ there a bus at noon?", correct: "Is" },
    { sentence: "___ there many foreign students in your school?", correct: "Are" },
    { sentence: "___ there a restaurant on this island?", correct: "Is" },
    { sentence: "___ there any problems with the plan?", correct: "Are" },
    { sentence: "___ there a train that goes directly to Kyoto?", correct: "Is" },
    { sentence: "___ there any messages for me?", correct: "Are" }
  ];

  const pastSingular = [
    "There ___ a big earthquake last night.",
    "There ___ a meeting yesterday afternoon.",
    "There ___ a strange noise outside.",
    "There ___ a letter from my friend on the desk yesterday.",
    "There ___ a traffic jam on my way home.",
    "There ___ an interesting program on TV last night.",
    "There ___ a festival in town last weekend.",
    "There ___ a test in English last Friday.",
    "There ___ a storm over the mountains.",
    "There ___ a problem with the computer yesterday."
  ];

  const pastPlural = [
    "There ___ many people at the station this morning.",
    "There ___ three concerts during the festival.",
    "There ___ several mistakes in his report.",
    "There ___ two trains that were delayed yesterday.",
    "There ___ a lot of stars in the sky last night.",
    "There ___ many visitors at the museum on Sunday.",
    "There ___ loud noises coming from the street.",
    "There ___ clouds in the sky before the storm.",
    "There ___ chairs lined up in the hallway before the ceremony.",
    "There ___ new paintings on display last month."
  ];

  const pastNegative = [
    { sentence: "There ___ any buses after midnight.", correct: "weren't" },
    { sentence: "There ___ a train to Kyoto yesterday.", correct: "wasn't" },
    { sentence: "There ___ many people at the library on Sunday.", correct: "weren't" },
    { sentence: "There ___ time to finish the project yesterday.", correct: "wasn't" },
    { sentence: "There ___ any letters for you this morning.", correct: "weren't" },
    { sentence: "There ___ a meeting last Friday.", correct: "wasn't" },
    { sentence: "There ___ enough chairs at the event.", correct: "weren't" },
    { sentence: "There ___ a doctor on duty last night.", correct: "wasn't" },
    { sentence: "There ___ lights on in the building last night.", correct: "weren't" },
    { sentence: "There ___ anything interesting on TV yesterday.", correct: "wasn't" }
  ];

  const pastQuestions = [
    { sentence: "___ there a typhoon last weekend?", correct: "Was" },
    { sentence: "___ there many people at the concert yesterday?", correct: "Were" },
    { sentence: "___ there a science test on Monday?", correct: "Was" },
    { sentence: "___ there any seats left on the train?", correct: "Were" },
    { sentence: "___ there a message for me?", correct: "Was" },
    { sentence: "___ there two meetings yesterday?", correct: "Were" },
    { sentence: "___ there a problem with the computer yesterday?", correct: "Was" },
    { sentence: "___ there any accidents on the highway last night?", correct: "Were" },
    { sentence: "___ there a library in this town ten years ago?", correct: "Was" },
    { sentence: "___ there many tourists in Kyoto last spring?", correct: "Were" }
  ];

  presentSingular.forEach((sentence) => {
    questions.push({
      id: "",
      question: sentence,
      type: "multiple",
      choices: ["is", "are", "was", "were"],
      answer: 0,
      explanation: "単数名詞を受けているので現在形は there is を用います。"
    });
  });

  presentPlural.forEach((sentence) => {
    questions.push({
      id: "",
      question: sentence,
      type: "multiple",
      choices: ["are", "is", "was", "were"],
      answer: 0,
      explanation: "複数を表しているので現在形は there are を使います。"
    });
  });

  presentNegative.forEach((item) => {
    const choices = item.correct === "isn't"
      ? ["isn't", "aren't", "wasn't", "weren't"]
      : ["aren't", "isn't", "wasn't", "weren't"];
    questions.push({
      id: "",
      question: item.sentence,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `否定文なので ${item.correct} を用います。`
    });
  });

  presentQuestions.forEach((item) => {
    const choices = item.correct === "Is"
      ? ["Is", "Are", "Was", "Were"]
      : ["Are", "Is", "Was", "Were"];
    questions.push({
      id: "",
      question: item.sentence,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `疑問文の文頭では ${item.correct} there...? の形になります。`
    });
  });

  pastSingular.forEach((sentence) => {
    questions.push({
      id: "",
      question: sentence,
      type: "multiple",
      choices: ["was", "were", "is", "are"],
      answer: 0,
      explanation: "過去の単数の出来事なので there was を使います。"
    });
  });

  pastPlural.forEach((sentence) => {
    questions.push({
      id: "",
      question: sentence,
      type: "multiple",
      choices: ["were", "was", "are", "is"],
      answer: 0,
      explanation: "過去の複数の存在を表すので there were を用います。"
    });
  });

  pastNegative.forEach((item) => {
    const choices = item.correct === "wasn't"
      ? ["wasn't", "weren't", "isn't", "aren't"]
      : ["weren't", "wasn't", "isn't", "aren't"];
    questions.push({
      id: "",
      question: item.sentence,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `過去の否定を表すため ${item.correct} を選びます。`
    });
  });

  pastQuestions.forEach((item) => {
    const choices = item.correct === "Was"
      ? ["Was", "Were", "Is", "Are"]
      : ["Were", "Was", "Is", "Are"];
    questions.push({
      id: "",
      question: item.sentence,
      type: "multiple",
      choices,
      answer: 0,
      explanation: `過去の疑問文では ${item.correct} there...? を使います。`
    });
  });

  if (questions.length !== 100) {
    throw new Error(`Question count mismatch for there-be: ${questions.length}`);
  }

  return questions.map((q, index) => ({
    ...q,
    id: formatId(prefix, index)
  }));
}

function generateGerundInfinitiveNounQuestions(prefix) {
  const questions = [];

  const gerundVerbData = [
    { sentence: "She enjoys ___ the piano after school.", correct: "playing", distractors: ["to play", "play", "played"], hint: "enjoy の後は動詞 ing 形を用います。" },
    { sentence: "We finished ___ the report before dinner.", correct: "writing", distractors: ["to write", "write", "wrote"], hint: "finish の後は動詞 ing 形です。" },
    { sentence: "He kept ___ even though it was late.", correct: "studying", distractors: ["to study", "study", "studied"], hint: "keep の後は動詞 ing 形です。" },
    { sentence: "They practiced ___ the new dance.", correct: "performing", distractors: ["to perform", "perform", "performed"], hint: "practice の後は動詞 ing 形です。" },
    { sentence: "I don't mind ___ in line for an hour.", correct: "waiting", distractors: ["to wait", "wait", "waited"], hint: "mind の後は動詞 ing 形です。" },
    { sentence: "She suggested ___ to the museum on Sunday.", correct: "going", distractors: ["to go", "go", "went"], hint: "suggest の後は動詞 ing 形です。" },
    { sentence: "He avoided ___ eye contact with the teacher.", correct: "making", distractors: ["to make", "make", "made"], hint: "avoid の後は動詞 ing 形です。" },
    { sentence: "We enjoyed ___ around the castle.", correct: "walking", distractors: ["to walk", "walk", "walked"], hint: "enjoy の後は動詞 ing 形です。" },
    { sentence: "They considered ___ the club." , correct: "joining", distractors: ["to join", "join", "joined"], hint: "consider の後は動詞 ing 形です。" },
    { sentence: "She admitted ___ the vase by accident.", correct: "breaking", distractors: ["to break", "break", "broke"], hint: "admit の後は動詞 ing 形です。" },
    { sentence: "He dislikes ___ on rainy days.", correct: "driving", distractors: ["to drive", "drive", "drove"], hint: "dislike の後は動詞 ing 形です。" },
    { sentence: "We missed ___ our friends during the trip.", correct: "seeing", distractors: ["to see", "see", "saw"], hint: "miss の後は動詞 ing 形です。" },
    { sentence: "She is busy ___ preparations for the festival.", correct: "making", distractors: ["to make", "make", "made"], hint: "be busy の後は動詞 ing 形です。" },
    { sentence: "They avoided ___ their homework until the last minute.", correct: "doing", distractors: ["to do", "do", "did"], hint: "avoid の後は動詞 ing 形です。" },
    { sentence: "I can't help ___ when I hear this song.", correct: "dancing", distractors: ["to dance", "dance", "danced"], hint: "can't help の後は動詞 ing 形です。" },
    { sentence: "She stopped ___ to answer the phone.", correct: "reading", distractors: ["to read", "read", "reads"], hint: "stop の後に元の行為をやめる場合は動詞 ing 形です。" },
    { sentence: "He admitted ___ nervous before the speech.", correct: "feeling", distractors: ["to feel", "feel", "felt"], hint: "admit の後は動詞 ing 形です。" },
    { sentence: "They enjoy ___ puzzles together.", correct: "solving", distractors: ["to solve", "solve", "solved"], hint: "enjoy の後は動詞 ing 形です。" },
    { sentence: "We finished ___ the decorations in the classroom.", correct: "putting up", distractors: ["to put up", "put up", "put"], hint: "finish の後は動詞 ing 形です。" },
    { sentence: "She suggested ___ the questions again.", correct: "reviewing", distractors: ["to review", "review", "reviewed"], hint: "suggest の後は動詞 ing 形です。" },
    { sentence: "He avoided ___ late by leaving early.", correct: "being", distractors: ["to be", "be", "was"], hint: "avoid の後は動詞 ing 形です。" },
    { sentence: "They practiced ___ the speech many times.", correct: "giving", distractors: ["to give", "give", "gave"], hint: "practice の後は動詞 ing 形です。" },
    { sentence: "I don't mind ___ the heavy bags.", correct: "carrying", distractors: ["to carry", "carry", "carried"], hint: "mind の後は動詞 ing 形です。" },
    { sentence: "She kept ___ even when she was tired.", correct: "smiling", distractors: ["to smile", "smile", "smiled"], hint: "keep の後は動詞 ing 形です。" },
    { sentence: "We enjoyed ___ stories by the campfire.", correct: "telling", distractors: ["to tell", "tell", "told"], hint: "enjoy の後は動詞 ing 形です。" }
  ];

  const infinitiveVerbData = [
    { sentence: "He decided ___ abroad next year.", correct: "to study", distractors: ["studying", "study", "studied"], hint: "decide の後は to 不定詞を用います。" },
    { sentence: "She hopes ___ a doctor in the future.", correct: "to become", distractors: ["becoming", "become", "became"], hint: "hope の後は to 不定詞です。" },
    { sentence: "We plan ___ a science club.", correct: "to start", distractors: ["starting", "start", "started"], hint: "plan の後は to 不定詞です。" },
    { sentence: "They want ___ early tomorrow.", correct: "to leave", distractors: ["leaving", "leave", "left"], hint: "want の後は to 不定詞です。" },
    { sentence: "I decided ___ the blue one.", correct: "to choose", distractors: ["choosing", "choose", "chose"], hint: "decide の後は to 不定詞です。" },
    { sentence: "She promised ___ me later.", correct: "to call", distractors: ["calling", "call", "called"], hint: "promise の後は to 不定詞です。" },
    { sentence: "He needs ___ the report by Friday.", correct: "to finish", distractors: ["finishing", "finish", "finished"], hint: "need の後は to 不定詞をよく使います。" },
    { sentence: "They agreed ___ the rules.", correct: "to follow", distractors: ["following", "follow", "followed"], hint: "agree の後は to 不定詞です。" },
    { sentence: "We decided ___ lunch outside.", correct: "to have", distractors: ["having", "have", "had"], hint: "decide の後は to 不定詞です。" },
    { sentence: "She expects ___ her friends at the station.", correct: "to meet", distractors: ["meeting", "meet", "met"], hint: "expect の後は to 不定詞です。" },
    { sentence: "He promised ___ the secret.", correct: "to keep", distractors: ["keeping", "keep", "kept"], hint: "promise の後は to 不定詞です。" },
    { sentence: "They decided ___ the movie later.", correct: "to watch", distractors: ["watching", "watch", "watched"], hint: "decide の後は to 不定詞です。" },
    { sentence: "We hope ___ the championship.", correct: "to win", distractors: ["winning", "win", "won"], hint: "hope の後は to 不定詞です。" },
    { sentence: "She wants ___ the choir.", correct: "to join", distractors: ["joining", "join", "joined"], hint: "want の後は to 不定詞です。" },
    { sentence: "He decided ___ his own lunch.", correct: "to bring", distractors: ["bringing", "bring", "brought"], hint: "decide の後は to 不定詞です。" },
    { sentence: "They promised ___ us next month.", correct: "to visit", distractors: ["visiting", "visit", "visited"], hint: "promise の後は to 不定詞です。" },
    { sentence: "We hope ___ to Okinawa in summer.", correct: "to travel", distractors: ["traveling", "travel", "traveled"], hint: "hope の後は to 不定詞です。" },
    { sentence: "She plans ___ her grandparents this weekend.", correct: "to see", distractors: ["seeing", "see", "saw"], hint: "plan の後は to 不定詞です。" },
    { sentence: "He expects ___ a letter soon.", correct: "to receive", distractors: ["receiving", "receive", "received"], hint: "expect の後は to 不定詞です。" },
    { sentence: "They decided ___ a new member.", correct: "to invite", distractors: ["inviting", "invite", "invited"], hint: "decide の後は to 不定詞です。" },
    { sentence: "We need ___ a bigger classroom.", correct: "to find", distractors: ["finding", "find", "found"], hint: "need の後は to 不定詞です。" },
    { sentence: "She promised ___ him every day.", correct: "to text", distractors: ["texting", "text", "texted"], hint: "promise の後は to 不定詞です。" },
    { sentence: "He hopes ___ the lead role in the play.", correct: "to get", distractors: ["getting", "get", "got"], hint: "hope の後は to 不定詞です。" },
    { sentence: "They expect ___ many visitors during the festival.", correct: "to welcome", distractors: ["welcoming", "welcome", "welcomed"], hint: "expect の後は to 不定詞です。" },
    { sentence: "I want ___ a letter to my host family.", correct: "to write", distractors: ["writing", "write", "wrote"], hint: "want の後は to 不定詞です。" }
  ];

  const gerundSubjectData = [
    { sentence: "___ early helps me study more.", correct: "Getting up", distractors: ["To get up", "Get up", "Gets up"], hint: "文の主語としては動名詞を用います。" },
    { sentence: "___ new vocabulary is fun.", correct: "Learning", distractors: ["To learn", "Learn", "Learned"], hint: "主語としての「〜すること」は動名詞です。" },
    { sentence: "___ to music relaxes me.", correct: "Listening", distractors: ["To listen", "Listen", "Listens"], hint: "文の主語に置くときは動名詞を使います。" },
    { sentence: "___ friends from other countries is exciting.", correct: "Meeting", distractors: ["To meet", "Meet", "Meets"], hint: "主語としては動名詞が自然です。" },
    { sentence: "___ too much sugar is unhealthy.", correct: "Eating", distractors: ["To eat", "Eat", "Eats"], hint: "行為そのものを主語にする場合は動名詞です。" },
    { sentence: "___ in front of many people takes courage.", correct: "Speaking", distractors: ["To speak", "Speak", "Speaks"], hint: "主語として動作を表すときは動名詞です。" },
    { sentence: "___ letters by hand is rare today.", correct: "Writing", distractors: ["To write", "Write", "Writes"], hint: "動作名詞としての動名詞です。" },
    { sentence: "___ puzzles keeps my brain active.", correct: "Solving", distractors: ["To solve", "Solve", "Solved"], hint: "主語としての行為は動名詞です。" },
    { sentence: "___ others makes me happy.", correct: "Helping", distractors: ["To help", "Help", "Helps"], hint: "主語として動作を表すときは動名詞です。" },
    { sentence: "___ the guitar takes practice.", correct: "Playing", distractors: ["To play", "Play", "Plays"], hint: "主語の役割を果たすのは動名詞です。" },
    { sentence: "___ new recipes is my hobby.", correct: "Trying", distractors: ["To try", "Try", "Tries"], hint: "趣味としての行為を主語にする場合は動名詞です。" },
    { sentence: "___ quietly in the library is important.", correct: "Reading", distractors: ["To read", "Read", "Reads"], hint: "動作を表す主語は動名詞です。" },
    { sentence: "___ kindness to others changes the world.", correct: "Showing", distractors: ["To show", "Show", "Shows"], hint: "主語の位置では動名詞が自然です。" },
    { sentence: "___ exercise every day keeps you healthy.", correct: "Doing", distractors: ["To do", "Do", "Does"], hint: "動作を主語にするときは動名詞です。" },
    { sentence: "___ waste is an important goal.", correct: "Reducing", distractors: ["To reduce", "Reduce", "Reduces"], hint: "目標としての「減らすこと」は動名詞です。" }
  ];

  const infinitiveSubjectData = [
    { sentence: "___ new things is exciting.", correct: "To learn", distractors: ["Learning", "Learn", "Learns"], hint: "形式的に to 不定詞を主語に置いています。" },
    { sentence: "___ others is important.", correct: "To help", distractors: ["Helping", "Help", "Helps"], hint: "一般的な行為を述べるときに to 不定詞を使います。" },
    { sentence: "___ early is good for your health.", correct: "To get up", distractors: ["Getting up", "Get up", "Gets up"], hint: "一般的なことを述べる際の to 不定詞。" },
    { sentence: "___ mistakes is natural.", correct: "To make", distractors: ["Making", "Make", "Makes"], hint: "行為全体を述べるときの to 不定詞です。" },
    { sentence: "___ honest is always right.", correct: "To be", distractors: ["Being", "Be", "Is"], hint: "to 不定詞が主語の役割を果たします。" },
    { sentence: "___ abroad someday is her dream.", correct: "To study", distractors: ["Studying", "Study", "Studied"], hint: "夢を述べるときに to 不定詞を使っています。" },
    { sentence: "___ quietly during class is polite.", correct: "To listen", distractors: ["Listening", "Listen", "Listens"], hint: "一般的なルールを述べる to 不定詞。" },
    { sentence: "___ enough sleep is difficult during exams.", correct: "To get", distractors: ["Getting", "Get", "Gets"], hint: "抽象的な行為を表すため to 不定詞を使います。" },
    { sentence: "___ an instrument takes time.", correct: "To play", distractors: ["Playing", "Play", "Plays"], hint: "「〜すること」を表す to 不定詞です。" },
    { sentence: "___ new ideas is important for scientists.", correct: "To create", distractors: ["Creating", "Create", "Creates"], hint: "一般論として to 不定詞を用います。" },
    { sentence: "___ healthy food is not easy for everyone.", correct: "To cook", distractors: ["Cooking", "Cook", "Cooks"], hint: "「〜すること」を表す to 不定詞です。" },
    { sentence: "___ a new language requires effort.", correct: "To learn", distractors: ["Learning", "Learn", "Learns"], hint: "一般的事実を示す to 不定詞です。" },
    { sentence: "___ abroad broadens your mind.", correct: "To travel", distractors: ["Traveling", "Travel", "Travels"], hint: "to 不定詞で「旅行すること」を表します。" },
    { sentence: "___ carefully is necessary in science experiments.", correct: "To observe", distractors: ["Observing", "Observe", "Observes"], hint: "to 不定詞を主語に使う例です。" },
    { sentence: "___ in a choir is one of her goals.", correct: "To sing", distractors: ["Singing", "Sing", "Sings"], hint: "目的・目標を表すときの to 不定詞です。" }
  ];

  const itToInfinitiveData = [
    { sentence: "It is important ___ every day.", correct: "to exercise", distractors: ["exercising", "exercise", "exercised"], hint: "It is + 形容詞 + to 動詞 の形です。" },
    { sentence: "It is difficult ___ a new language in a short time.", correct: "to learn", distractors: ["learning", "learn", "learned"], hint: "It is + 形容詞 + to 動詞 のパターンです。" },
    { sentence: "It is exciting ___ new cultures.", correct: "to experience", distractors: ["experiencing", "experience", "experienced"], hint: "It is + 形容詞 + to 動詞 の形です。" },
    { sentence: "It is necessary ___ your homework today.", correct: "to finish", distractors: ["finishing", "finish", "finished"], hint: "It is + 形容詞 + to 動詞 の形です。" },
    { sentence: "It is kind of you ___ me with the project.", correct: "to help", distractors: ["helping", "help", "helped"], hint: "It is + 形容詞 + of + 人 + to 動詞 の形です。" },
    { sentence: "It is hard ___ the heavy box alone.", correct: "to lift", distractors: ["lifting", "lift", "lifted"], hint: "It is + 形容詞 + to 動詞 のパターンです。" },
    { sentence: "It is polite ___ thank-you letters.", correct: "to write", distractors: ["writing", "write", "wrote"], hint: "礼儀として to 不定詞を使います。" },
    { sentence: "It is fun ___ board games with family.", correct: "to play", distractors: ["playing", "play", "played"], hint: "It is + 形容詞 + to 動詞 の形です。" },
    { sentence: "It is important ___ honest with friends.", correct: "to be", distractors: ["being", "be", "been"], hint: "It is + 形容詞 + to be の形です。" },
    { sentence: "It is useful ___ notes during class.", correct: "to take", distractors: ["taking", "take", "took"], hint: "It is + 形容詞 + to 動詞 の形です。" }
  ];

  const gerundPrepositionData = [
    { sentence: "She is good at ___ stories to children.", correct: "telling", distractors: ["to tell", "tell", "told"], hint: "前置詞の後は動詞 ing 形です。" },
    { sentence: "He is interested in ___ about space.", correct: "learning", distractors: ["to learn", "learn", "learned"], hint: "in の後は動詞 ing 形です。" },
    { sentence: "They talked about ___ a school festival.", correct: "planning", distractors: ["to plan", "plan", "planned"], hint: "about の後は動詞 ing 形です。" },
    { sentence: "We are looking forward to ___ you soon.", correct: "seeing", distractors: ["to see", "see", "saw"], hint: "to (前置詞) の後は動詞 ing 形です。" },
    { sentence: "She apologized for ___ late.", correct: "coming", distractors: ["to come", "come", "came"], hint: "for の後は動詞 ing 形です。" },
    { sentence: "He is afraid of ___ mistakes.", correct: "making", distractors: ["to make", "make", "made"], hint: "of の後は動詞 ing 形です。" },
    { sentence: "They succeeded in ___ the puzzle.", correct: "solving", distractors: ["to solve", "solve", "solved"], hint: "in の後は動詞 ing 形です。" },
    { sentence: "We spent time ___ the classroom.", correct: "cleaning", distractors: ["to clean", "clean", "cleaned"], hint: "spend time の後は動詞 ing 形です。" },
    { sentence: "She is busy ___ posters for the event.", correct: "making", distractors: ["to make", "make", "made"], hint: "be busy の後は動詞 ing 形です。" },
    { sentence: "He thanked us for ___ him move.", correct: "helping", distractors: ["to help", "help", "helped"], hint: "for の後は動詞 ing 形です。" }
  ];

  // Build questions
  const categories = [
    gerundVerbData,
    infinitiveVerbData,
    gerundSubjectData,
    infinitiveSubjectData,
    itToInfinitiveData,
    gerundPrepositionData
  ];

  categories.forEach((category) => {
    category.forEach((item) => {
      const distractors = item.distractors || [];
      const choices = [item.correct, ...distractors];
      questions.push({
        id: "",
        question: item.sentence,
        type: "multiple",
        choices,
        answer: 0,
        explanation: item.hint
      });
    });
  });

  if (questions.length !== 100) {
    throw new Error(`Question count mismatch for gerund-infinitive noun: ${questions.length}`);
  }

  return questions.map((q, index) => ({
    ...q,
    id: formatId(prefix, index)
  }));
}

function generateInfinitiveQuestions(prefix) {
  const questions = [];

  const purposeData = [
    { sentence: "She went to the library ___ some reference books.", correct: "to borrow", distractors: ["borrowing", "borrow", "borrowed"], hint: "目的を表す to 不定詞です。" },
    { sentence: "He opened the window ___ fresh air in.", correct: "to let", distractors: ["letting", "let", "lets"], hint: "目的「〜するために」を表します。" },
    { sentence: "They visited the museum ___ the new exhibition.", correct: "to see", distractors: ["seeing", "see", "saw"], hint: "目的を説明する to 不定詞。" },
    { sentence: "We went to the supermarket ___ some fruits.", correct: "to buy", distractors: ["buying", "buy", "bought"], hint: "目的「買うため」です。" },
    { sentence: "She stayed up late ___ her homework finished.", correct: "to get", distractors: ["getting", "get", "got"], hint: "目的を表す to 不定詞です。" },
    { sentence: "He called his friend ___ the schedule.", correct: "to check", distractors: ["checking", "check", "checked"], hint: "目的「確認するため」です。" },
    { sentence: "They left early ___ the first train.", correct: "to catch", distractors: ["catching", "catch", "caught"], hint: "目的を示す to 不定詞です。" },
    { sentence: "I visited the teacher ___ some advice.", correct: "to ask for", distractors: ["asking for", "ask for", "asked for"], hint: "目的を表す to 不定詞です。" },
    { sentence: "She went downtown ___ a gift for her sister.", correct: "to find", distractors: ["finding", "find", "found"], hint: "目的「見つけるため」です。" },
    { sentence: "He went to the gym ___ stronger.", correct: "to become", distractors: ["becoming", "become", "became"], hint: "目的を表す to 不定詞です。" },
    { sentence: "We gathered in the hall ___ the announcement.", correct: "to hear", distractors: ["hearing", "hear", "heard"], hint: "目的を表します。" },
    { sentence: "She stayed after school ___ the classroom.", correct: "to clean", distractors: ["cleaning", "clean", "cleaned"], hint: "目的を示す to 不定詞です。" },
    { sentence: "They met again ___ their next trip.", correct: "to plan", distractors: ["planning", "plan", "planned"], hint: "目的「計画するため」です。" },
    { sentence: "He put on his glasses ___ the board clearly.", correct: "to see", distractors: ["seeing", "see", "saw"], hint: "目的を表す to 不定詞です。" },
    { sentence: "She visited the park ___ pictures of the flowers.", correct: "to take", distractors: ["taking", "take", "took"], hint: "目的を表す to 不定詞です。" },
    { sentence: "We stopped by the shop ___ some snacks.", correct: "to buy", distractors: ["buying", "buy", "bought"], hint: "目的を示します。" },
    { sentence: "He went outside ___ with his friends.", correct: "to play", distractors: ["playing", "play", "played"], hint: "目的「遊ぶため」です。" },
    { sentence: "They sat in front ___ the fireworks show.", correct: "to watch", distractors: ["watching", "watch", "watched"], hint: "目的を表す to 不定詞です。" },
    { sentence: "I opened the book ___ the answer.", correct: "to look for", distractors: ["looking for", "look for", "looked for"], hint: "目的を示す to 不定詞です。" },
    { sentence: "She hurried home ___ dinner for her family.", correct: "to cook", distractors: ["cooking", "cook", "cooked"], hint: "目的を表します。" }
  ];

  const objectToData = [
    { sentence: "The teacher told us ___ quietly.", correct: "to work", distractors: ["working", "work", "worked"], hint: "tell + 人 + to 動詞 の形です。" },
    { sentence: "My parents advised me ___ a coat.", correct: "to wear", distractors: ["wearing", "wear", "wore"], hint: "advise + 人 + to 動詞。" },
    { sentence: "She asked him ___ the door.", correct: "to open", distractors: ["opening", "open", "opened"], hint: "ask + 人 + to 動詞 の形です。" },
    { sentence: "He told his sister ___ careful.", correct: "to be", distractors: ["being", "be", "been"], hint: "tell + 人 + to be の形です。" },
    { sentence: "They invited us ___ their club.", correct: "to join", distractors: ["joining", "join", "joined"], hint: "invite + 人 + to 動詞。" },
    { sentence: "The doctor advised her ___ more water.", correct: "to drink", distractors: ["drinking", "drink", "drank"], hint: "advise + 人 + to 動詞。" },
    { sentence: "My mother reminded me ___ the lights off.", correct: "to turn", distractors: ["turning", "turn", "turned"], hint: "remind + 人 + to 動詞。" },
    { sentence: "The coach told the team ___ harder.", correct: "to practice", distractors: ["practicing", "practice", "practiced"], hint: "tell + 人 + to 動詞。" },
    { sentence: "He asked me ___ him with the bags.", correct: "to help", distractors: ["helping", "help", "helped"], hint: "ask + 人 + to 動詞。" },
    { sentence: "She told the kids ___ quiet in the library.", correct: "to keep", distractors: ["keeping", "keep", "kept"], hint: "tell + 人 + to 動詞。" },
    { sentence: "They encouraged us ___ in the contest.", correct: "to participate", distractors: ["participating", "participate", "participated"], hint: "encourage + 人 + to 動詞。" },
    { sentence: "The teacher asked the students ___ their homework.", correct: "to submit", distractors: ["submitting", "submit", "submitted"], hint: "ask + 人 + to 動詞。" },
    { sentence: "My friend told me ___ the new café.", correct: "to try", distractors: ["trying", "try", "tried"], hint: "tell + 人 + to 動詞。" },
    { sentence: "She told him ___ his dreams.", correct: "to chase", distractors: ["chasing", "chase", "chased"], hint: "tell + 人 + to 動詞。" },
    { sentence: "They asked us ___ the meeting on time.", correct: "to attend", distractors: ["attending", "attend", "attended"], hint: "ask + 人 + to 動詞。" },
    { sentence: "He reminded her ___ the library books.", correct: "to return", distractors: ["returning", "return", "returned"], hint: "remind + 人 + to 動詞。" },
    { sentence: "My parents told me ___ polite to elders.", correct: "to be", distractors: ["being", "be", "been"], hint: "tell + 人 + to be の形です。" },
    { sentence: "The guide advised us ___ close to the animals.", correct: "not to get", distractors: ["to not get", "not getting", "get"], hint: "advise + 人 + not to 動詞。" },
    { sentence: "She asked the waiter ___ us some water.", correct: "to bring", distractors: ["bringing", "bring", "brought"], hint: "ask + 人 + to 動詞。" },
    { sentence: "He told me ___ the truth.", correct: "to tell", distractors: ["telling", "tell", "told"], hint: "tell + 人 + to 動詞。"}
  ];

  const tooToData = [
    { sentence: "This box is too heavy ___ alone.", correct: "to carry", distractors: ["carrying", "carry", "carried"], hint: "too 〜 to 動詞 の形です。" },
    { sentence: "He was too tired ___ homework.", correct: "to finish", distractors: ["finishing", "finish", "finished"], hint: "too + 形容詞 + to 動詞。" },
    { sentence: "The question was too difficult ___ quickly.", correct: "to answer", distractors: ["answering", "answer", "answered"], hint: "too difficult to 動詞。" },
    { sentence: "She is too shy ___ in front of the class.", correct: "to speak", distractors: ["speaking", "speak", "spoke"], hint: "too 形容詞 to 動詞。" },
    { sentence: "It was too dark ___ any pictures.", correct: "to take", distractors: ["taking", "take", "took"], hint: "too 形容詞 to 動詞。" },
    { sentence: "The road was too narrow ___ two cars.", correct: "to pass", distractors: ["passing", "pass", "passed"], hint: "too 形容詞 to 動詞。" },
    { sentence: "He is too young ___ a part-time job.", correct: "to get", distractors: ["getting", "get", "got"], hint: "too 形容詞 to 動詞。" },
    { sentence: "The bag was too full ___ closed.", correct: "to be", distractors: ["being", "be", "been"], hint: "too ... to be ... の形です。" },
    { sentence: "She felt too sleepy ___ the movie.", correct: "to watch", distractors: ["watching", "watch", "watched"], hint: "too 形容詞 to 動詞。" },
    { sentence: "The sound was too loud ___ in the room.", correct: "to stay", distractors: ["staying", "stay", "stayed"], hint: "too 形容詞 to 動詞。" }
  ];

  const enoughToData = [
    { sentence: "He is strong enough ___ the heavy door.", correct: "to open", distractors: ["opening", "open", "opened"], hint: "形容詞 + enough + to 動詞 の形です。" },
    { sentence: "She is old enough ___ on her own.", correct: "to travel", distractors: ["traveling", "travel", "traveled"], hint: "～するのに十分な... の表現です。" },
    { sentence: "The water is warm enough ___.", correct: "to swim in", distractors: ["swimming in", "swim in", "swam in"], hint: "enough の後は to 動詞です。" },
    { sentence: "He studied hard enough ___ the exam.", correct: "to pass", distractors: ["passing", "pass", "passed"], hint: "enough を伴う to 不定詞。" },
    { sentence: "The room is big enough ___ twenty people.", correct: "to hold", distractors: ["holding", "hold", "held"], hint: "十分な大きさを表す to 動詞です。" },
    { sentence: "We arrived early enough ___ good seats.", correct: "to get", distractors: ["getting", "get", "got"], hint: "enough の後は to 動詞です。" },
    { sentence: "The soup is cool enough ___ now.", correct: "to eat", distractors: ["eating", "eat", "ate"], hint: "十分冷めているので to 動詞。" },
    { sentence: "She is confident enough ___ the speech.", correct: "to give", distractors: ["giving", "give", "gave"], hint: "enough + to 動詞 を使います。" },
    { sentence: "The ladder is long enough ___ the roof.", correct: "to reach", distractors: ["reaching", "reach", "reached"], hint: "十分な長さを示す to 動詞です。" },
    { sentence: "He saved enough money ___ a new bike.", correct: "to buy", distractors: ["buying", "buy", "bought"], hint: "enough + to 動詞 の形です。" }
  ];

  const questionWordToData = [
    { sentence: "I don't know how ___ this machine.", correct: "to use", distractors: ["using", "use", "used"], hint: "疑問詞 + to 動詞 の形です。" },
    { sentence: "Please tell me what ___ next.", correct: "to do", distractors: ["doing", "do", "did"], hint: "what to 動詞 の形です。" },
    { sentence: "He asked where ___ the bus.", correct: "to catch", distractors: ["catching", "catch", "caught"], hint: "where to 動詞 の形です。" },
    { sentence: "She couldn't decide which dress ___ for the party.", correct: "to wear", distractors: ["wearing", "wear", "wore"], hint: "which to 動詞 の形です。" },
    { sentence: "We need to think about who ___ first.", correct: "to invite", distractors: ["inviting", "invite", "invited"], hint: "who to 動詞 の形です。" },
    { sentence: "Do you know when ___ the museum?", correct: "to visit", distractors: ["visiting", "visit", "visited"], hint: "when to 動詞 の形です。" },
    { sentence: "She taught us how ___ the software.", correct: "to use", distractors: ["using", "use", "used"], hint: "how to 動詞 の形です。" },
    { sentence: "He wondered what ___ to the teacher.", correct: "to say", distractors: ["saying", "say", "said"], hint: "what to 動詞 の形です。" },
    { sentence: "They couldn't decide where ___ lunch.", correct: "to have", distractors: ["having", "have", "had"], hint: "where to 動詞 の形です。" },
    { sentence: "Please show me how ___ this puzzle.", correct: "to solve", distractors: ["solving", "solve", "solved"], hint: "how to 動詞 の形です。" }
  ];

  const adjectiveToData = [
    { sentence: "He was happy ___ his old friends again.", correct: "to see", distractors: ["seeing", "see", "saw"], hint: "形容詞の後に to 不定詞を使っています。" },
    { sentence: "She was surprised ___ the news.", correct: "to hear", distractors: ["hearing", "hear", "heard"], hint: "形容詞 + to 動詞 の形です。" },
    { sentence: "We were sad ___ the story.", correct: "to hear", distractors: ["hearing", "hear", "heard"], hint: "感情を表す形容詞 + to 動詞。" },
    { sentence: "He was proud ___ the prize.", correct: "to receive", distractors: ["receiving", "receive", "received"], hint: "形容詞 + to 動詞 の形です。" },
    { sentence: "She was relieved ___ the exam was over.", correct: "to know", distractors: ["knowing", "know", "knew"], hint: "形容詞 + to 動詞 の形です。" },
    { sentence: "They were excited ___ the amusement park.", correct: "to visit", distractors: ["visiting", "visit", "visited"], hint: "形容詞 + to 動詞 の形です。" },
    { sentence: "I'm afraid ___ mistakes.", correct: "to make", distractors: ["making", "make", "made"], hint: "感情を表す形容詞 + to 動詞。" },
    { sentence: "She was glad ___ my letter.", correct: "to receive", distractors: ["receiving", "receive", "received"], hint: "形容詞 + to 動詞。" },
    { sentence: "They were shocked ___ the price.", correct: "to see", distractors: ["seeing", "see", "saw"], hint: "形容詞 + to 動詞 の形です。" },
    { sentence: "We were lucky ___ tickets for the show.", correct: "to get", distractors: ["getting", "get", "got"], hint: "形容詞 + to 動詞 の形です。" }
  ];

  const itTakesData = [
    { sentence: "It takes ten minutes ___ to the station.", correct: "to walk", distractors: ["walking", "walk", "walked"], hint: "It takes + 時間 + to 動詞 の形です。" },
    { sentence: "It took me a week ___ the model.", correct: "to finish", distractors: ["finishing", "finish", "finished"], hint: "It takes/took ... to 動詞。" },
    { sentence: "It takes a lot of practice ___ the piano well.", correct: "to play", distractors: ["playing", "play", "played"], hint: "It takes ... to 動詞。" },
    { sentence: "It took them an hour ___ the tent.", correct: "to set up", distractors: ["setting up", "set up", "set"], hint: "It takes ... to 動詞。" },
    { sentence: "It takes courage ___ your ideas.", correct: "to share", distractors: ["sharing", "share", "shared"], hint: "It takes ... to 動詞。" },
    { sentence: "It took us five minutes ___ the answer.", correct: "to find", distractors: ["finding", "find", "found"], hint: "It takes ... to 動詞。" },
    { sentence: "It takes patience ___ a foreign language.", correct: "to learn", distractors: ["learning", "learn", "learned"], hint: "It takes ... to 動詞。" },
    { sentence: "It took the team a month ___ the robot.", correct: "to build", distractors: ["building", "build", "built"], hint: "It takes ... to 動詞。" },
    { sentence: "It takes time ___ trust.", correct: "to gain", distractors: ["gaining", "gain", "gained"], hint: "It takes ... to 動詞。" },
    { sentence: "It took her a moment ___ the joke.", correct: "to understand", distractors: ["understanding", "understand", "understood"], hint: "It takes ... to 動詞。" }
  ];

  const negativeToData = [
    { sentence: "Be careful not ___ your keys.", correct: "to lose", distractors: ["losing", "lose", "lost"], hint: "not to 動詞 で「〜しないように」です。" },
    { sentence: "He tried not ___ late again.", correct: "to be", distractors: ["being", "be", "was"], hint: "try not to 動詞 の形です。" },
    { sentence: "Remember not ___ the door unlocked.", correct: "to leave", distractors: ["leaving", "leave", "left"], hint: "remember not to 動詞。" },
    { sentence: "She promised not ___ the secret.", correct: "to tell", distractors: ["telling", "tell", "told"], hint: "promise not to 動詞。" },
    { sentence: "They decided not ___ in the rain.", correct: "to play", distractors: ["playing", "play", "played"], hint: "decide not to 動詞。" },
    { sentence: "I tried not ___ too nervous.", correct: "to feel", distractors: ["feeling", "feel", "felt"], hint: "try not to 動詞。" },
    { sentence: "Be sure not ___ the plants every day.", correct: "to forget to water", distractors: ["forgetting to water", "forget to water", "forgot watering"], hint: "be sure not to 動詞 の形です。" },
    { sentence: "She promised not ___ anyone about the plan.", correct: "to tell", distractors: ["telling", "tell", "told"], hint: "promise not to 動詞。" },
    { sentence: "We decided not ___ the noisy restaurant.", correct: "to enter", distractors: ["entering", "enter", "entered"], hint: "decide not to 動詞。" },
    { sentence: "Please try not ___ your voice.", correct: "to raise", distractors: ["raising", "raise", "raised"], hint: "try not to 動詞。" }
  ];

  const categories = [
    purposeData,
    objectToData,
    tooToData,
    enoughToData,
    questionWordToData,
    adjectiveToData,
    itTakesData,
    negativeToData
  ];

  categories.forEach((category) => {
    category.forEach((item) => {
      const choices = [item.correct, ...item.distractors];
      questions.push({
        id: "",
        question: item.sentence,
        type: "multiple",
        choices,
        answer: 0,
        explanation: item.hint
      });
    });
  });

  if (questions.length !== 100) {
    throw new Error(`Question count mismatch for infinitive unit: ${questions.length}`);
  }

  return questions.map((q, index) => ({
    ...q,
    id: formatId(prefix, index)
  }));
}

function generateComparisonQuestions(prefix) {
  const questions = [];

  const comparativeRegular = [
    { sentence: "This puzzle is ___ than that one.", correct: "easier", distractors: ["more easy", "easy", "easiest"], hint: "比較級は easy → easier です。" },
    { sentence: "Today is ___ than yesterday.", correct: "hotter", distractors: ["more hot", "hot", "hottest"], hint: "hot の比較級は hotter です。" },
    { sentence: "My bag is ___ than yours.", correct: "heavier", distractors: ["more heavy", "heavy", "heaviest"], hint: "heavy の比較級は heavier です。" },
    { sentence: "The river is ___ than the lake.", correct: "longer", distractors: ["more long", "long", "longest"], hint: "long の比較級は longer です。" },
    { sentence: "This math problem is ___ than the last one.", correct: "harder", distractors: ["more hard", "hard", "hardest"], hint: "hard の比較級は harder です。" },
    { sentence: "The blue sofa is ___ than the green one.", correct: "more comfortable", distractors: ["comfortabler", "comfortable", "most comfortable"], hint: "長い形容詞は more + 形容詞 です。" },
    { sentence: "Spring is ___ than winter here.", correct: "warmer", distractors: ["more warm", "warm", "warmest"], hint: "warm の比較級は warmer です。" },
    { sentence: "She is ___ than her brother.", correct: "taller", distractors: ["more tall", "tall", "tallest"], hint: "tall の比較級は taller です。" },
    { sentence: "This road is ___ than the other one.", correct: "wider", distractors: ["more wide", "wide", "widest"], hint: "wide の比較級は wider です。" },
    { sentence: "My new shoes are ___ than the old ones.", correct: "more expensive", distractors: ["expensiver", "expensive", "most expensive"], hint: "expensive は more を使います。" },
    { sentence: "The second quiz was ___ than the first.", correct: "shorter", distractors: ["more short", "short", "shortest"], hint: "short の比較級は shorter です。" },
    { sentence: "This street is ___ than that one.", correct: "cleaner", distractors: ["more clean", "clean", "cleanest"], hint: "clean の比較級は cleaner です。" },
    { sentence: "My explanation is ___ than his.", correct: "clearer", distractors: ["more clear", "clear", "clearest"], hint: "clear の比較級は clearer です。" },
    { sentence: "Summer vacation is ___ than spring break.", correct: "longer", distractors: ["more long", "long", "longest"], hint: "long の比較級は longer です。" },
    { sentence: "She is ___ than her classmates.", correct: "more diligent", distractors: ["diligenter", "diligent", "most diligent"], hint: "diligent は more を使います。" },
    { sentence: "This park is ___ than the one near my house.", correct: "bigger", distractors: ["more big", "big", "biggest"], hint: "big の比較級は bigger です。" },
    { sentence: "This movie is ___ than the book.", correct: "more interesting", distractors: ["interestinger", "interesting", "most interesting"], hint: "interesting は more を使います。" },
    { sentence: "The new tablet is ___ than the old model.", correct: "lighter", distractors: ["more light", "light", "lightest"], hint: "light の比較級は lighter です。" },
    { sentence: "This song is ___ than that one.", correct: "more popular", distractors: ["popularer", "popular", "most popular"], hint: "popular は more を使います。" },
    { sentence: "Our classroom is ___ than theirs.", correct: "brighter", distractors: ["more bright", "bright", "brightest"], hint: "bright の比較級は brighter です。" }
  ];

  const comparativeIrregular = [
    { sentence: "My English is ___ than before.", correct: "better", distractors: ["gooder", "good", "best"], hint: "good の比較級は better です。" },
    { sentence: "This task is ___ than I expected.", correct: "worse", distractors: ["badder", "bad", "worst"], hint: "bad の比較級は worse です。" },
    { sentence: "He can run ___ than his brother.", correct: "faster", distractors: ["fast", "fastest", "more fast"], hint: "fast の比較級は faster です。" },
    { sentence: "This road is ___ than that one.", correct: "farther", distractors: ["further", "far", "farest"], hint: "far の比較級の一つは farther です。" },
    { sentence: "Her ideas are ___ than mine.", correct: "better", distractors: ["best", "good", "gooder"], hint: "good の比較級は better です。" },
    { sentence: "The blue sweater looks ___ on you than the red one.", correct: "better", distractors: ["good", "best", "gooder"], hint: "good の比較級は better です。" },
    { sentence: "This year we have ___ homework than last year.", correct: "less", distractors: ["fewer", "little", "least"], hint: "不可算名詞には less を使います。" },
    { sentence: "He drove ___ than usual to catch the train.", correct: "faster", distractors: ["fast", "fastest", "more fast"], hint: "fast の比較級は faster です。" },
    { sentence: "The new textbook is ___ to understand than the old one.", correct: "easier", distractors: ["easy", "easiest", "more easy"], hint: "easy の比較級は easier です。" },
    { sentence: "This path is ___ than the main road.", correct: "narrower", distractors: ["more narrow", "narrow", "narrowest"], hint: "narrow の比較級は narrower です。" }
  ];

  const superlativeRegular = [
    { sentence: "Mount Fuji is the ___ mountain in Japan.", correct: "highest", distractors: ["higher", "high", "more high"], hint: "最上級は high → highest です。" },
    { sentence: "This is the ___ story I have ever heard.", correct: "funniest", distractors: ["funnier", "funny", "more funny"], hint: "funny の最上級は funniest です。" },
    { sentence: "He is the ___ student in our class.", correct: "tallest", distractors: ["taller", "tall", "more tall"], hint: "tall の最上級は tallest です。" },
    { sentence: "This is the ___ question on the test.", correct: "hardest", distractors: ["harder", "hard", "more hard"], hint: "hard の最上級は hardest です。" },
    { sentence: "She is the ___ dancer in the group.", correct: "best", distractors: ["better", "good", "most good"], hint: "good の最上級は best です。" },
    { sentence: "August is the ___ month of the year here.", correct: "hottest", distractors: ["hotter", "hot", "more hot"], hint: "hot の最上級は hottest です。" },
    { sentence: "This is the ___ way to get there.", correct: "easiest", distractors: ["easier", "easy", "more easy"], hint: "easy の最上級は easiest です。" },
    { sentence: "That was the ___ movie I've seen this year.", correct: "most exciting", distractors: ["more exciting", "excitingest", "exciting"], hint: "長い形容詞の最上級は most + 形容詞 です。" },
    { sentence: "She is the ___ singer in the choir.", correct: "most popular", distractors: ["more popular", "popular", "popularer"], hint: "popular の最上級は most popular です。" },
    { sentence: "This is the ___ restaurant in town.", correct: "most famous", distractors: ["more famous", "famousest", "famous"], hint: "famous の最上級は most famous です。" },
    { sentence: "He is the ___ player on the team.", correct: "strongest", distractors: ["stronger", "strong", "more strong"], hint: "strong の最上級は strongest です。" },
    { sentence: "This is the ___ answer of all.", correct: "shortest", distractors: ["shorter", "short", "more short"], hint: "short の最上級は shortest です。" },
    { sentence: "She lives in the ___ house in the village.", correct: "largest", distractors: ["larger", "large", "more large"], hint: "large の最上級は largest です。" },
    { sentence: "It was the ___ day of the year.", correct: "coldest", distractors: ["colder", "cold", "more cold"], hint: "cold の最上級は coldest です。" },
    { sentence: "This lake is the ___ in the region.", correct: "deepest", distractors: ["deeper", "deep", "more deep"], hint: "deep の最上級は deepest です。" },
    { sentence: "She solved the problem the ___.", correct: "fastest", distractors: ["faster", "fast", "more fast"], hint: "fast の最上級は fastest です。" },
    { sentence: "He gave the ___ presentation today.", correct: "best", distractors: ["better", "good", "most good"], hint: "good の最上級は best です。" },
    { sentence: "This is the ___ bridge in the city.", correct: "longest", distractors: ["longer", "long", "more long"], hint: "long の最上級は longest です。" },
    { sentence: "This is the ___ book I have.", correct: "thickest", distractors: ["thicker", "thick", "more thick"], hint: "thick の最上級は thickest です。" },
    { sentence: "He is the ___ member of the club.", correct: "youngest", distractors: ["younger", "young", "more young"], hint: "young の最上級は youngest です。" }
  ];

  const superlativeIrregular = [
    { sentence: "She is the ___ runner on the team.", correct: "fastest", distractors: ["faster", "fast", "more fast"], hint: "fast の最上級は fastest です。" },
    { sentence: "He got the ___ score in the class.", correct: "highest", distractors: ["higher", "high", "more high"], hint: "high の最上級は highest です。" },
    { sentence: "This is the ___ museum I've ever visited.", correct: "most interesting", distractors: ["more interesting", "interesting", "interestingest"], hint: "most + 形容詞 です。" },
    { sentence: "She sings the ___ in the choir.", correct: "best", distractors: ["better", "good", "most good"], hint: "good の最上級は best です。" },
    { sentence: "It was the ___ day in memory.", correct: "worst", distractors: ["worse", "bad", "baddest"], hint: "bad の最上級は worst です。" },
    { sentence: "He came up with the ___ solution.", correct: "best", distractors: ["better", "good", "most good"], hint: "good の最上級は best です。" },
    { sentence: "This was the ___ of his worries.", correct: "least", distractors: ["less", "little", "lesser"], hint: "little の最上級は least です。" },
    { sentence: "She traveled the ___ distance among us.", correct: "farthest", distractors: ["farther", "far", "more far"], hint: "far の最上級は farthest/furthest です。" },
    { sentence: "It is the ___ known fact about the island.", correct: "best", distractors: ["better", "good", "most good"], hint: "best を使います。" },
    { sentence: "He is the ___ of the three brothers.", correct: "eldest", distractors: ["older", "oldest", "old"], hint: "家族関係では eldest を使えます。" }
  ];

  const asAsData = [
    { sentence: "This blue bag is as ___ as the red one.", correct: "expensive", distractors: ["more expensive", "expensiver", "expensivest"], hint: "as...as の中は原級を使います。" },
    { sentence: "He is as ___ as his father.", correct: "tall", distractors: ["taller", "tallest", "more tall"], hint: "as...as で原級を使います。" },
    { sentence: "My bike is as ___ as yours.", correct: "new", distractors: ["newer", "newest", "more new"], hint: "原級 new を使います。" },
    { sentence: "She sings as ___ as a professional singer.", correct: "well", distractors: ["better", "best", "good"], hint: "as...as の中は well です。" },
    { sentence: "This road is as ___ as that one.", correct: "wide", distractors: ["wider", "widest", "more wide"], hint: "原級 wide を使います。" },
    { sentence: "The movie was as ___ as the book.", correct: "interesting", distractors: ["more interesting", "interester", "interestingest"], hint: "原級 interesting を使います。" },
    { sentence: "He runs as ___ as his brother.", correct: "fast", distractors: ["faster", "fastest", "more fast"], hint: "原級 fast を使います。" },
    { sentence: "Our school festival was as ___ as last year's.", correct: "exciting", distractors: ["more exciting", "excitingest", "excited"], hint: "原級 exciting を使います。" },
    { sentence: "She is as ___ as a college student.", correct: "busy", distractors: ["busier", "busiest", "more busy"], hint: "原級 busy を使います。" },
    { sentence: "This cake tastes as ___ as the one my mom makes.", correct: "good", distractors: ["better", "best", "well"], hint: "taste の原級 good を使います。" },
    { sentence: "The classroom is as ___ as the library.", correct: "quiet", distractors: ["quieter", "quietest", "more quiet"], hint: "原級 quiet を使います。" },
    { sentence: "He can speak English as ___ as his sister.", correct: "fluently", distractors: ["more fluently", "fluent", "most fluent"], hint: "副詞の原級 fluently を使います。" },
    { sentence: "This test is as ___ as the practice test.", correct: "difficult", distractors: ["more difficult", "difficulter", "difficultest"], hint: "原級 difficult を使います。" },
    { sentence: "Our town is as ___ as the neighboring town.", correct: "safe", distractors: ["safer", "safest", "more safe"], hint: "原級 safe を使います。" },
    { sentence: "The robot cleans the room as ___ as we do.", correct: "carefully", distractors: ["more carefully", "careful", "most carefully"], hint: "副詞の原級 carefully を使います。" }
  ];

  const notAsData = [
    { sentence: "This book is not as ___ as that one.", correct: "thick", distractors: ["thicker", "thickest", "more thick"], hint: "not as...as の中は原級です。" },
    { sentence: "The train today is not as ___ as yesterday.", correct: "crowded", distractors: ["more crowded", "crowder", "crowdest"], hint: "原級 crowded を使います。" },
    { sentence: "My bag is not as ___ as yours.", correct: "heavy", distractors: ["heavier", "heaviest", "more heavy"], hint: "原級 heavy を使います。" },
    { sentence: "This river is not as ___ as the Nile.", correct: "long", distractors: ["longer", "longest", "more long"], hint: "原級 long を使います。" },
    { sentence: "His answer was not as ___ as hers.", correct: "clear", distractors: ["clearer", "clearest", "more clear"], hint: "原級 clear を使います。" },
    { sentence: "This room is not as ___ as the living room.", correct: "bright", distractors: ["brighter", "brightest", "more bright"], hint: "原級 bright を使います。" },
    { sentence: "My test score is not as ___ as my friend's.", correct: "high", distractors: ["higher", "highest", "more high"], hint: "原級 high を使います。" },
    { sentence: "The movie wasn't as ___ as I expected.", correct: "funny", distractors: ["funnier", "funniest", "more funny"], hint: "原級 funny を使います。" },
    { sentence: "This soup isn't as ___ as last time.", correct: "salty", distractors: ["saltier", "saltiest", "more salty"], hint: "原級 salty を使います。" },
    { sentence: "The hike wasn't as ___ as we thought.", correct: "hard", distractors: ["harder", "hardest", "more hard"], hint: "原級 hard を使います。" }
  ];

  const comparativeAdverbData = [
    { sentence: "He ran ___ than his teammates.", correct: "faster", distractors: ["fast", "fastest", "more fast"], hint: "副詞 fast の比較級は faster です。" },
    { sentence: "She sings ___ than anyone else in the class.", correct: "more beautifully", distractors: ["beautifully", "most beautifully", "beautifuler"], hint: "beautifully の比較級は more beautifully です。" },
    { sentence: "Tom solved the puzzle ___ than Ken.", correct: "more quickly", distractors: ["quickly", "quicklier", "most quickly"], hint: "quickly の比較級は more quickly です。" },
    { sentence: "This computer works ___ than that old one.", correct: "more smoothly", distractors: ["smoothly", "smoother", "most smoothly"], hint: "smoothly の比較級は more smoothly です。" },
    { sentence: "She answered the questions ___ than I did.", correct: "more accurately", distractors: ["accurately", "most accurately", "accurater"], hint: "accurately の比較級は more accurately です。" },
    { sentence: "He speaks English ___ than before.", correct: "more fluently", distractors: ["fluently", "fluentlier", "most fluently"], hint: "fluently の比較級は more fluently です。" },
    { sentence: "They worked ___ than we expected.", correct: "harder", distractors: ["hard", "hardest", "more hard"], hint: "hard の比較級は harder です。" },
    { sentence: "She drives ___ than her sister.", correct: "more carefully", distractors: ["carefully", "carefuller", "most carefully"], hint: "carefully の比較級は more carefully です。" },
    { sentence: "The river flows ___ in spring than in summer.", correct: "faster", distractors: ["fast", "fastest", "more fast"], hint: "fast の比較級は faster です。" },
    { sentence: "We arrived ___ than the others.", correct: "earlier", distractors: ["early", "earliest", "more early"], hint: "early の比較級は earlier です。" }
  ];

  const quantityComparativeData = [
    { sentence: "We need ___ chairs than last time.", correct: "more", distractors: ["most", "many", "much"], hint: "多いの比較級は more です。" },
    { sentence: "She has ___ books than I do.", correct: "fewer", distractors: ["few", "fewest", "less"], hint: "可算名詞には fewer を使います。" },
    { sentence: "There is ___ water in this bottle than in that one.", correct: "less", distractors: ["least", "few", "fewer"], hint: "不可算名詞には less を使います。" },
    { sentence: "He made ___ mistakes this time.", correct: "fewer", distractors: ["few", "fewest", "less"], hint: "可算名詞 mistake には fewer。" },
    { sentence: "We spent ___ money on the trip than we planned.", correct: "more", distractors: ["most", "many", "much"], hint: "more を使います。" }
  ];

  const categories = [
    comparativeRegular,
    comparativeIrregular,
    superlativeRegular,
    superlativeIrregular,
    asAsData,
    notAsData,
    comparativeAdverbData,
    quantityComparativeData
  ];

  categories.forEach((category) => {
    category.forEach((item) => {
      const choices = [item.correct, ...item.distractors];
      questions.push({
        id: "",
        question: item.sentence,
        type: "multiple",
        choices,
        answer: 0,
        explanation: item.hint
      });
    });
  });

  if (questions.length !== 100) {
    throw new Error(`Question count mismatch for comparison unit: ${questions.length}`);
  }

  return questions.map((q, index) => ({
    ...q,
    id: formatId(prefix, index)
  }));
}

function generatePassiveVoiceQuestions(prefix) {
  const questions = [];

  const presentPassiveData = [
    { sentence: "The classroom ___ every Friday.", correct: "is cleaned", distractors: ["are cleaned", "was cleaned", "clean"], hint: "主語が単数なので is + 過去分詞です。" },
    { sentence: "These letters ___ by our teacher.", correct: "are written", distractors: ["is written", "were written", "write"], hint: "複数主語なので are + 過去分詞です。" },
    { sentence: "Lunch ___ at noon at this school.", correct: "is served", distractors: ["are served", "was served", "serve"], hint: "受動態は be + 過去分詞です。" },
    { sentence: "Many languages ___ in this museum.", correct: "are spoken", distractors: ["is spoken", "were spoken", "speak"], hint: "複数主語なので are spoken です。" },
    { sentence: "The homework ___ online.", correct: "is submitted", distractors: ["are submitted", "was submitted", "submit"], hint: "単数扱いなので is + 過去分詞です。" },
    { sentence: "Our school festival ___ by students.", correct: "is planned", distractors: ["are planned", "was planned", "plan"], hint: "be + 過去分詞で受動態を作ります。" },
    { sentence: "Many trees ___ by the city every year.", correct: "are planted", distractors: ["is planted", "were planted", "plant"], hint: "複数主語なので are planted です。" },
    { sentence: "This book ___ in many countries.", correct: "is read", distractors: ["are read", "was read", "readed"], hint: "read の過去分詞は read（発音はレッド）です。" },
    { sentence: "Exams ___ in the gym.", correct: "are held", distractors: ["is held", "were held", "hold"], hint: "複数名詞なので are held です。" },
    { sentence: "The song ___ on the radio every morning.", correct: "is played", distractors: ["are played", "was played", "play"], hint: "単数主語なので is played です。" },
    { sentence: "The rules ___ to all members.", correct: "are explained", distractors: ["is explained", "were explained", "explain"], hint: "複数名詞なので are explained です。" },
    { sentence: "Fresh bread ___ in this bakery.", correct: "is baked", distractors: ["are baked", "was baked", "bake"], hint: "受動態 is baked です。" },
    { sentence: "The classroom walls ___ bright blue.", correct: "are painted", distractors: ["is painted", "were painted", "paint"], hint: "複数主語なので are painted です。" },
    { sentence: "English ___ as a global language.", correct: "is recognized", distractors: ["are recognized", "was recognized", "recognize"], hint: "単数扱いなので is recognized です。" },
    { sentence: "All announcements ___ in Japanese and English.", correct: "are made", distractors: ["is made", "were made", "make"], hint: "複数主語なので are made です。" },
    { sentence: "Homework ___ on Monday.", correct: "is checked", distractors: ["are checked", "was checked", "check"], hint: "単数扱いで is checked です。" },
    { sentence: "Tickets ___ at the entrance.", correct: "are sold", distractors: ["is sold", "were sold", "sell"], hint: "複数名詞なので are sold です。" },
    { sentence: "This poster ___ by the art club.", correct: "is designed", distractors: ["are designed", "was designed", "design"], hint: "受動態 is designed です。" },
    { sentence: "Hot lunch ___ to students every day.", correct: "is given", distractors: ["are given", "was given", "give"], hint: "単数主語なので is given です。" },
    { sentence: "Announcements ___ at the morning meeting.", correct: "are made", distractors: ["is made", "were made", "make"], hint: "複数主語なので are made です。" }
  ];

  const pastPassiveData = [
    { sentence: "The window ___ by Tom yesterday.", correct: "was cleaned", distractors: ["is cleaned", "were cleaned", "cleaned"], hint: "過去の単数主語なので was + 過去分詞です。" },
    { sentence: "These photos ___ last week.", correct: "were taken", distractors: ["was taken", "are taken", "take"], hint: "複数主語なので were taken です。" },
    { sentence: "The concert ___ on Sunday.", correct: "was held", distractors: ["is held", "were held", "hold"], hint: "過去の単数主語なので was held です。" },
    { sentence: "The letters ___ yesterday.", correct: "were sent", distractors: ["was sent", "are sent", "send"], hint: "複数主語なので were sent です。" },
    { sentence: "Dinner ___ by my father last night.", correct: "was cooked", distractors: ["is cooked", "were cooked", "cook"], hint: "単数主語で過去なので was cooked です。" },
    { sentence: "The story ___ by a famous author.", correct: "was written", distractors: ["were written", "is written", "wrote"], hint: "受動態は was written です。" },
    { sentence: "The old building ___ in 1920.", correct: "was built", distractors: ["is built", "were built", "build"], hint: "過去で単数なので was built です。" },
    { sentence: "All the tickets ___ in one day.", correct: "were sold", distractors: ["was sold", "are sold", "sell"], hint: "複数主語なので were sold です。" },
    { sentence: "This room ___ last month.", correct: "was painted", distractors: ["were painted", "is painted", "paint"], hint: "単数主語で過去なので was painted です。" },
    { sentence: "The exam papers ___ on Friday.", correct: "were graded", distractors: ["was graded", "are graded", "grade"], hint: "複数主語なので were graded です。" },
    { sentence: "The message ___ to all students.", correct: "was sent", distractors: ["were sent", "is sent", "send"], hint: "単数なので was sent です。" },
    { sentence: "These songs ___ in the 1990s.", correct: "were recorded", distractors: ["was recorded", "are recorded", "record"], hint: "複数主語で過去なので were recorded です。" },
    { sentence: "The prize ___ to the best team.", correct: "was given", distractors: ["were given", "is given", "give"], hint: "単数主語なので was given です。" },
    { sentence: "The homework ___ yesterday.", correct: "was collected", distractors: ["were collected", "is collected", "collect"], hint: "単数で過去なので was collected です。" },
    { sentence: "The lights ___ at midnight.", correct: "were turned off", distractors: ["was turned off", "are turned off", "turn off"], hint: "複数で過去なので were turned off です。" },
    { sentence: "A new bridge ___ in 2015.", correct: "was built", distractors: ["were built", "is built", "build"], hint: "単数で過去なので was built です。" },
    { sentence: "The car ___ by my brother.", correct: "was washed", distractors: ["were washed", "is washed", "wash"], hint: "単数主語なので was washed です。" },
    { sentence: "These flowers ___ from our garden.", correct: "were picked", distractors: ["was picked", "are picked", "pick"], hint: "複数主語なので were picked です。" },
    { sentence: "The movie ___ in Canada.", correct: "was filmed", distractors: ["were filmed", "is filmed", "film"], hint: "単数主語なので was filmed です。" },
    { sentence: "The old documents ___ carefully.", correct: "were stored", distractors: ["was stored", "are stored", "store"], hint: "複数主語なので were stored です。" }
  ];

  const presentContinuousPassiveData = [
    { sentence: "The dishes ___ being washed now.", correct: "are", full: "are being washed", distractors: ["is", "was", "be"], hint: "複数主語で現在進行形の受動態です。" },
    { sentence: "The classroom ___ being cleaned at the moment.", correct: "is", distractors: ["are", "was", "be"], hint: "単数主語なので is being cleaned です。" },
    { sentence: "New books ___ being added to the library.", correct: "are", distractors: ["is", "was", "be"], hint: "複数主語なので are being added です。" },
    { sentence: "Lunch ___ being prepared by the cooking club.", correct: "is", distractors: ["are", "was", "were"], hint: "単数主語なので is being prepared です。" },
    { sentence: "The stage decorations ___ being set up now.", correct: "are", distractors: ["is", "was", "be"], hint: "複数主語 are being set up です。" },
    { sentence: "Our bikes ___ being repaired this afternoon.", correct: "are", distractors: ["is", "was", "be"], hint: "複数主語 are being repaired です。" },
    { sentence: "A film ___ being shot in this town.", correct: "is", distractors: ["are", "was", "were"], hint: "単数主語 is being shot です。" },
    { sentence: "The posters ___ being put on the walls.", correct: "are", distractors: ["is", "was", "were"], hint: "複数主語 are being put です。" },
    { sentence: "Dinner ___ being served right now.", correct: "is", distractors: ["are", "was", "be"], hint: "単数主語 is being served です。" },
    { sentence: "The questions ___ being answered in order.", correct: "are", distractors: ["is", "was", "were"], hint: "複数主語 are being answered です。" }
  ];

  const pastContinuousPassiveData = [
    { sentence: "The room ___ being painted when I arrived.", correct: "was", distractors: ["were", "is", "be"], hint: "過去進行形の受動態で単数です。" },
    { sentence: "The dishes ___ being washed when the phone rang.", correct: "were", distractors: ["was", "are", "be"], hint: "複数主語 were being washed です。" },
    { sentence: "The game ___ being broadcast live.", correct: "was", distractors: ["were", "is", "be"], hint: "単数主語 was being broadcast です。" },
    { sentence: "The students ___ being interviewed yesterday afternoon.", correct: "were", distractors: ["was", "are", "be"], hint: "複数主語 were being interviewed です。" },
    { sentence: "Dinner ___ being cooked when I got home.", correct: "was", distractors: ["were", "is", "be"], hint: "単数主語 was being cooked です。" },
    { sentence: "The documents ___ being copied at that time.", correct: "were", distractors: ["was", "are", "be"], hint: "複数主語 were being copied です。" },
    { sentence: "The stage ___ being prepared all morning.", correct: "was", distractors: ["were", "is", "be"], hint: "単数主語 was being prepared です。" },
    { sentence: "The roads ___ being repaired last night.", correct: "were", distractors: ["was", "are", "be"], hint: "複数主語 were being repaired です。" },
    { sentence: "The posters ___ being taken down when we arrived.", correct: "were", distractors: ["was", "are", "be"], hint: "複数主語 were being taken down です。" },
    { sentence: "The cake ___ being decorated for the party.", correct: "was", distractors: ["were", "is", "be"], hint: "単数主語 was being decorated です。" }
  ];

  const presentPerfectPassiveData = [
    { sentence: "All the seats ___ already taken.", correct: "have been", distractors: ["has been", "were", "are"], hint: "複数主語なので have been + 過去分詞です。" },
    { sentence: "The project ___ finished yet.", correct: "has not been", distractors: ["have not been", "was not", "is not"], hint: "単数主語で現在完了受動態です。" },
    { sentence: "The photos ___ uploaded to the website.", correct: "have been", distractors: ["has been", "were", "are"], hint: "複数主語 have been + 過去分詞。" },
    { sentence: "Dinner ___ already served.", correct: "has been", distractors: ["have been", "was", "is"], hint: "単数主語 has been + 過去分詞です。" },
    { sentence: "All the tasks ___ completed on time.", correct: "have been", distractors: ["has been", "were", "are"], hint: "複数主語 have been completed です。" },
    { sentence: "The results ___ announced yet.", correct: "have not been", distractors: ["has not been", "were not", "are not"], hint: "複数主語 have not been announced です。" },
    { sentence: "My essay ___ returned by the teacher.", correct: "has been", distractors: ["have been", "was", "is"], hint: "単数主語 has been returned です。" },
    { sentence: "The tickets ___ sold out already.", correct: "have been", distractors: ["has been", "were", "are"], hint: "複数主語 have been sold out です。" },
    { sentence: "A new library ___ built in our town.", correct: "has been", distractors: ["have been", "was", "is"], hint: "単数主語 has been built です。" },
    { sentence: "The windows ___ cleaned this week.", correct: "have been", distractors: ["has been", "were", "are"], hint: "複数主語 have been cleaned です。" }
  ];

  const modalPassiveData = [
    { sentence: "The report must ___ by Friday.", correct: "be finished", distractors: ["finish", "be finish", "be finishing"], hint: "must + be + 過去分詞 で受動態。" },
    { sentence: "This document can ___ online.", correct: "be viewed", distractors: ["view", "be view", "be viewing"], hint: "can + be + 過去分詞 です。" },
    { sentence: "The homework should ___ tomorrow.", correct: "be submitted", distractors: ["submit", "be submit", "be submitting"], hint: "should + be + 過去分詞。" },
    { sentence: "These rules have to ___ by everyone.", correct: "be followed", distractors: ["follow", "be follow", "be following"], hint: "have to + be + 過去分詞。" },
    { sentence: "The problem might ___ soon.", correct: "be solved", distractors: ["solve", "be solve", "be solving"], hint: "might + be + 過去分詞。" },
    { sentence: "All seats will ___ for the guests.", correct: "be reserved", distractors: ["reserve", "be reserve", "be reserving"], hint: "will + be + 過去分詞。" },
    { sentence: "The laptops must not ___ during the exam.", correct: "be used", distractors: ["use", "be use", "be using"], hint: "must not + be + 過去分詞。" },
    { sentence: "The packages can ___ at the counter.", correct: "be picked up", distractors: ["pick up", "be pick up", "be picking up"], hint: "can + be + 過去分詞。" },
    { sentence: "This gate should ___ closed at night.", correct: "be kept", distractors: ["keep", "be keep", "be keeping"], hint: "should + be + 過去分詞。" },
    { sentence: "The machines may ___ tomorrow.", correct: "be checked", distractors: ["check", "be check", "be checking"], hint: "may + be + 過去分詞。" }
  ];

  const futurePassiveData = [
    { sentence: "A new gym ___ next year.", correct: "will be built", distractors: ["will build", "is built", "was built"], hint: "未来の受動態は will be + 過去分詞。" },
    { sentence: "The results ___ next Monday.", correct: "will be announced", distractors: ["will announce", "are announced", "were announced"], hint: "will be + 過去分詞。" },
    { sentence: "English classes ___ in the new building.", correct: "will be held", distractors: ["will hold", "are held", "were held"], hint: "will be held で受動態です。" },
    { sentence: "Lunch ___ to all participants.", correct: "will be provided", distractors: ["will provide", "is provided", "was provided"], hint: "will be + 過去分詞。" },
    { sentence: "The winners ___ tomorrow.", correct: "will be chosen", distractors: ["will choose", "are chosen", "were chosen"], hint: "未来受動態です。" },
    { sentence: "Homework ___ via the online system.", correct: "will be checked", distractors: ["will check", "is checked", "was checked"], hint: "will be + 過去分詞。" },
    { sentence: "The classroom ___ by the local artist.", correct: "will be decorated", distractors: ["will decorate", "is decorated", "was decorated"], hint: "未来の受動態です。" },
    { sentence: "All members ___ of the change.", correct: "will be informed", distractors: ["will inform", "are informed", "were informed"], hint: "will be + 過去分詞。" },
    { sentence: "A new library card system ___ soon.", correct: "will be introduced", distractors: ["will introduce", "is introduced", "was introduced"], hint: "will be + 過去分詞。" },
    { sentence: "The game schedule ___ later this week.", correct: "will be posted", distractors: ["will post", "is posted", "was posted"], hint: "未来受動態です。" }
  ];

  const passiveQuestionData = [
    { sentence: "___ this castle built in the 17th century?", correct: "Was", distractors: ["Is", "Were", "Did"], hint: "過去の単数なので Was で始めます。" },
    { sentence: "___ the letters sent yesterday?", correct: "Were", distractors: ["Was", "Are", "Did"], hint: "複数・過去なので Were です。" },
    { sentence: "___ this movie shown on TV last night?", correct: "Was", distractors: ["Is", "Were", "Did"], hint: "単数・過去なので Was です。" },
    { sentence: "___ these books translated into English?", correct: "Are", distractors: ["Is", "Were", "Do"], hint: "現在・複数なので Are です。" },
    { sentence: "___ the classroom cleaned every day?", correct: "Is", distractors: ["Are", "Was", "Do"], hint: "単数・現在なので Is です。" },
    { sentence: "___ the winners announced already?", correct: "Have", distractors: ["Has", "Are", "Did"], hint: "現在完了・複数なので Have they been...? ですが選択は Have。" },
    { sentence: "___ your homework done?", correct: "Is", distractors: ["Are", "Was", "Do"], hint: "単数扱いなので Is です。" },
    { sentence: "___ the tickets sold out yet?", correct: "Have", distractors: ["Has", "Are", "Did"], hint: "現在完了の疑問文です。" },
    { sentence: "___ the stage being prepared now?", correct: "Is", distractors: ["Are", "Was", "Do"], hint: "現在進行形受動態の疑問文です。" },
    { sentence: "___ the meeting going to be held tomorrow?", correct: "Is", distractors: ["Are", "Was", "Do"], hint: "be going to 受動態の疑問文です。" }
  ];

  const categories = [
    presentPassiveData,
    pastPassiveData,
    presentContinuousPassiveData,
    pastContinuousPassiveData,
    presentPerfectPassiveData,
    modalPassiveData,
    futurePassiveData,
    passiveQuestionData
  ];

  categories.forEach((category) => {
    category.forEach((item) => {
      const choices = [item.correct, ...item.distractors];
      questions.push({
        id: "",
        question: item.sentence,
        type: "multiple",
        choices,
        answer: 0,
        explanation: item.hint
      });
    });
  });

  if (questions.length !== 100) {
    throw new Error(`Question count mismatch for passive voice unit: ${questions.length}`);
  }

  return questions.map((q, index) => ({
    ...q,
    id: formatId(prefix, index)
  }));
}

function generatePresentPerfectQuestions(prefix) {
  const questions = [];

  const basicAuxData = [
    { sentence: "She ___ finished her homework.", correct: "has", distractors: ["have", "had", "was"], hint: "三人称単数なので has finished です。" },
    { sentence: "They ___ completed the project.", correct: "have", distractors: ["has", "had", "were"], hint: "複数主語なので have completed です。" },
    { sentence: "He ___ lost his keys again.", correct: "has", distractors: ["have", "had", "is"], hint: "三人称単数なので has lost です。" },
    { sentence: "I ___ seen that movie twice.", correct: "have", distractors: ["has", "had", "am"], hint: "一人称単数は have seen です。" },
    { sentence: "Lisa ___ just called you.", correct: "has", distractors: ["have", "had", "is"], hint: "三人称単数なので has called です。" },
    { sentence: "The students ___ cleaned the classroom already.", correct: "have", distractors: ["has", "had", "are"], hint: "複数主語なので have cleaned です。" },
    { sentence: "My brother ___ broken his smartphone.", correct: "has", distractors: ["have", "had", "is"], hint: "三人称単数なので has broken です。" },
    { sentence: "We ___ visited the museum before.", correct: "have", distractors: ["has", "had", "are"], hint: "複数主語なので have visited です。" },
    { sentence: "The train ___ left the station.", correct: "has", distractors: ["have", "had", "is"], hint: "単数主語なので has left です。" },
    { sentence: "You ___ improved a lot this year.", correct: "have", distractors: ["has", "had", "are"], hint: "You には have が続きます。" },
    { sentence: "Emma ___ never eaten sushi.", correct: "has", distractors: ["have", "had", "is"], hint: "三人称単数です。" },
    { sentence: "They ___ just arrived at the airport.", correct: "have", distractors: ["has", "had", "are"], hint: "複数主語なので have arrived です。" },
    { sentence: "The teacher ___ given us extra homework.", correct: "has", distractors: ["have", "had", "is"], hint: "単数主語なので has given です。" },
    { sentence: "My grandparents ___ lived here for decades.", correct: "have", distractors: ["has", "had", "are"], hint: "複数主語 have lived です。" },
    { sentence: "He ___ written three novels.", correct: "has", distractors: ["have", "had", "is"], hint: "三人称単数です。" },
    { sentence: "Our team ___ won the match.", correct: "has", distractors: ["have", "had", "is"], hint: "team は単数扱いで has won です。" },
    { sentence: "We ___ been friends since childhood.", correct: "have", distractors: ["has", "had", "are"], hint: "複数主語なので have been です。" },
    { sentence: "The cat ___ caught another mouse.", correct: "has", distractors: ["have", "had", "is"], hint: "三人称単数です。" },
    { sentence: "I ___ finished reading the book.", correct: "have", distractors: ["has", "had", "am"], hint: "I には have finished です。" },
    { sentence: "They ___ forgotten the password.", correct: "have", distractors: ["has", "had", "are"], hint: "複数主語なので have forgotten です。" }
  ];

  const negativeData = [
    { sentence: "She ___ finished the report yet.", correct: "hasn't", distractors: ["haven't", "doesn't", "isn't"], hint: "三人称単数の否定形は hasn't です。" },
    { sentence: "They ___ decided on a theme.", correct: "haven't", distractors: ["hasn't", "don't", "aren't"], hint: "複数主語の否定は haven't です。" },
    { sentence: "He ___ visited the art museum yet.", correct: "hasn't", distractors: ["haven't", "didn't", "isn't"], hint: "三人称単数の否定は hasn't です。" },
    { sentence: "I ___ seen the new episode.", correct: "haven't", distractors: ["hasn't", "didn't", "am not"], hint: "I の否定は haven't seen です。" },
    { sentence: "The bus ___ arrived yet.", correct: "hasn't", distractors: ["haven't", "didn't", "isn't"], hint: "単数主語の否定は hasn't arrived です。" },
    { sentence: "We ___ heard from him recently.", correct: "haven't", distractors: ["hasn't", "don't", "aren't"], hint: "複数主語の否定は haven't heard です。" },
    { sentence: "My sister ___ done her chores yet.", correct: "hasn't", distractors: ["haven't", "didn't", "isn't"], hint: "三人称単数です。" },
    { sentence: "The students ___ finished the test.", correct: "haven't", distractors: ["hasn't", "didn't", "aren't"], hint: "複数主語 haven't finished です。" },
    { sentence: "It ___ stopped raining yet.", correct: "hasn't", distractors: ["haven't", "didn't", "isn't"], hint: "単数主語 hasn't stopped です。" },
    { sentence: "You ___ answered my question.", correct: "haven't", distractors: ["hasn't", "didn't", "aren't"], hint: "You の否定は haven't answered です。" }
  ];

  const durationData = [
    { sentence: "We have lived in Tokyo ___ five years.", correct: "for", distractors: ["since", "during", "from"], hint: "期間を表すので for です。" },
    { sentence: "She has known him ___ elementary school.", correct: "since", distractors: ["for", "during", "from"], hint: "起点を表すので since です。" },
    { sentence: "I have studied piano ___ 2018.", correct: "since", distractors: ["for", "during", "from"], hint: "開始時点なので since です。" },
    { sentence: "They have been friends ___ childhood.", correct: "since", distractors: ["for", "during", "until"], hint: "起点を表す since を使います。" },
    { sentence: "He has worked here ___ a long time.", correct: "for", distractors: ["since", "during", "from"], hint: "期間を表す for です。" },
    { sentence: "My parents have been married ___ twenty-five years.", correct: "for", distractors: ["since", "during", "from"], hint: "期間 for twenty-five years。" },
    { sentence: "Our club has practiced ___ last month.", correct: "since", distractors: ["for", "during", "from"], hint: "起点 since last month。" },
    { sentence: "The shop has been closed ___ Monday.", correct: "since", distractors: ["for", "during", "from"], hint: "since Monday です。" },
    { sentence: "We have had this car ___ three years.", correct: "for", distractors: ["since", "during", "from"], hint: "期間を表す for です。" },
    { sentence: "She has played the violin ___ she was six.", correct: "since", distractors: ["for", "during", "after"], hint: "過去の時点以来 since を用います。" },
    { sentence: "I have waited ___ two hours.", correct: "for", distractors: ["since", "during", "from"], hint: "期間を表す for two hours。" },
    { sentence: "The festival has continued ___ many years.", correct: "for", distractors: ["since", "during", "from"], hint: "期間を表す for です。" },
    { sentence: "He has collected stamps ___ he was a child.", correct: "since", distractors: ["for", "during", "after"], hint: "起点 since he was a child。" },
    { sentence: "They have stayed in Kyoto ___ a week.", correct: "for", distractors: ["since", "during", "from"], hint: "期間 for a week。" },
    { sentence: "We have known each other ___ junior high.", correct: "since", distractors: ["for", "during", "after"], hint: "起点 since junior high。" },
    { sentence: "My dog has lived with us ___ 2012.", correct: "since", distractors: ["for", "during", "from"], hint: "since 2012 です。" },
    { sentence: "She has practiced calligraphy ___ months.", correct: "for", distractors: ["since", "during", "from"], hint: "期間 for months。" },
    { sentence: "The company has existed ___ 1970.", correct: "since", distractors: ["for", "during", "from"], hint: "since 1970 です。" },
    { sentence: "He has not eaten meat ___ five years.", correct: "for", distractors: ["since", "during", "from"], hint: "期間を表す for five years。" },
    { sentence: "I have used this app ___ last spring.", correct: "since", distractors: ["for", "during", "after"], hint: "起点 since last spring。" }
  ];

  const alreadyJustYetData = [
    { sentence: "I have ___ finished my homework.", correct: "already", distractors: ["yet", "ever", "still"], hint: "肯定文で「すでに」は already です。" },
    { sentence: "She has ___ gotten home.", correct: "just", distractors: ["already", "yet", "still"], hint: "直前を表す just を使います。" },
    { sentence: "Have you eaten dinner ___?", correct: "yet", distractors: ["already", "just", "still"], hint: "疑問文では yet を使います。" },
    { sentence: "They haven't arrived ___.", correct: "yet", distractors: ["already", "just", "still"], hint: "否定文では yet を用います。" },
    { sentence: "We have ___ started the game.", correct: "just", distractors: ["already", "yet", "still"], hint: "just で「ちょうど」です。" },
    { sentence: "He has ___ cleaned his room.", correct: "already", distractors: ["yet", "just", "still"], hint: "肯定文の「もう〜した」は already。" },
    { sentence: "Have they ___ seen the announcement?", correct: "already", distractors: ["yet", "just", "still"], hint: "疑問文でも already を使えます。" },
    { sentence: "I haven't read that book ___.", correct: "yet", distractors: ["already", "just", "still"], hint: "否定文で yet。" },
    { sentence: "She has ___ left for the airport.", correct: "already", distractors: ["yet", "just", "still"], hint: "肯定文で already。" },
    { sentence: "The train has ___ departed.", correct: "just", distractors: ["already", "yet", "still"], hint: "直前なら just。" },
    { sentence: "Have you ___ finished the report?", correct: "already", distractors: ["yet", "just", "still"], hint: "進行中か確認する表現です。" },
    { sentence: "They have ___ opened the new shop.", correct: "just", distractors: ["already", "yet", "still"], hint: "最近起こったことには just。" },
    { sentence: "We haven't decided the title ___.", correct: "yet", distractors: ["already", "just", "still"], hint: "否定文で yet。" },
    { sentence: "My brother has ___ washed the dishes.", correct: "already", distractors: ["yet", "just", "still"], hint: "既に終わった so already。" },
    { sentence: "Has the movie started ___?", correct: "yet", distractors: ["already", "just", "still"], hint: "疑問文で yet。" },
    { sentence: "She hasn't emailed me ___.", correct: "yet", distractors: ["already", "just", "still"], hint: "否定文で yet。" },
    { sentence: "The teacher has ___ explained the rules.", correct: "already", distractors: ["yet", "just", "still"], hint: "肯定文で already。" },
    { sentence: "I have ___ visited that museum.", correct: "already", distractors: ["yet", "just", "still"], hint: "既に訪問済み。" },
    { sentence: "He has ___ returned from the trip.", correct: "just", distractors: ["already", "yet", "still"], hint: "直前 just。" },
    { sentence: "Have you called him ___?", correct: "yet", distractors: ["already", "just", "still"], hint: "疑問文で yet。" }
  ];

  const experienceData = [
    { sentence: "Have you ___ visited Okinawa?", correct: "ever", distractors: ["never", "yet", "already"], hint: "経験を尋ねる疑問文では ever。" },
    { sentence: "She has ___ climbed a mountain.", correct: "never", distractors: ["ever", "yet", "already"], hint: "経験がない場合は never。" },
    { sentence: "I have ___ tried natto before.", correct: "never", distractors: ["ever", "yet", "already"], hint: "「一度もない」は never。" },
    { sentence: "Have they ___ seen a shooting star?", correct: "ever", distractors: ["never", "yet", "already"], hint: "経験を尋ねるので ever。" },
    { sentence: "He has ___ been abroad.", correct: "never", distractors: ["ever", "yet", "already"], hint: "経験ゼロは never。" },
    { sentence: "Have you ___ heard this song?", correct: "ever", distractors: ["never", "yet", "already"], hint: "経験の有無を尋ねる表現です。" },
    { sentence: "We have ___ visited Kyoto many times.", correct: "already", distractors: ["ever", "yet", "never"], hint: "すでに何度も訪れたので already。" },
    { sentence: "She has ___ met a famous actor.", correct: "never", distractors: ["ever", "yet", "already"], hint: "経験がないので never。" },
    { sentence: "Has he ___ tried skiing?", correct: "ever", distractors: ["never", "yet", "already"], hint: "経験を尋ねるので ever。" },
    { sentence: "They have ___ gone camping in winter.", correct: "never", distractors: ["ever", "yet", "already"], hint: "経験がないので never。" }
  ];

  const beenGoneData = [
    { sentence: "Tom has ___ London; he'll be back tomorrow.", correct: "been to", distractors: ["gone to", "been", "go to"], hint: "戻ってくる場合は has been to を使います。" },
    { sentence: "Lisa has ___ the supermarket and hasn't returned yet.", correct: "gone to", distractors: ["been to", "been", "go to"], hint: "まだ戻っていない場合は has gone to です。" },
    { sentence: "Have you ever ___ Hokkaido?", correct: "been to", distractors: ["gone to", "go to", "been"], hint: "訪れた経験は have been to です。" },
    { sentence: "My parents have ___ Kyoto many times.", correct: "been to", distractors: ["gone to", "go to", "been"], hint: "訪問経験を表す been to。" },
    { sentence: "He has ___ the library to return some books.", correct: "gone to", distractors: ["been to", "been", "go to"], hint: "まだ戻っていないので has gone to。" },
    { sentence: "They have ___ Spain twice.", correct: "been to", distractors: ["gone to", "been", "go to"], hint: "訪問経験を表す been to。" },
    { sentence: "Our teacher has ___ Osaka for a meeting.", correct: "gone to", distractors: ["been to", "been", "go to"], hint: "現在不在なら has gone to。" },
    { sentence: "I have ___ that museum before.", correct: "been to", distractors: ["gone to", "been", "go to"], hint: "経験を表す been to。" },
    { sentence: "She has ___ the dentist and will be late.", correct: "gone to", distractors: ["been to", "been", "go to"], hint: "現在いないので has gone to。" },
    { sentence: "Have they ___ Europe?", correct: "been to", distractors: ["gone to", "go to", "been"], hint: "経験を尋ねるので been to。" }
  ];

  const questionAuxData = [
    { sentence: "___ you finished your homework yet?", correct: "Have", distractors: ["Has", "Did", "Do"], hint: "主語が you なので Have で始めます。" },
    { sentence: "___ she ever been to Australia?", correct: "Has", distractors: ["Have", "Did", "Does"], hint: "三人称単数なので Has。" },
    { sentence: "How long ___ you lived here?", correct: "have", distractors: ["has", "did", "do"], hint: "you に続く助動詞は have です。" },
    { sentence: "Where ___ he gone?", correct: "has", distractors: ["have", "did", "does"], hint: "he に合わせて has gone?" },
    { sentence: "___ they already eaten?", correct: "Have", distractors: ["Has", "Did", "Do"], hint: "複数主語なので Have です。" },
    { sentence: "___ your sister taken the exam yet?", correct: "Has", distractors: ["Have", "Did", "Does"], hint: "三人称単数なので Has。" },
    { sentence: "What ___ you done for the festival?", correct: "have", distractors: ["has", "did", "do"], hint: "you なので have done。" },
    { sentence: "Why ___ he missed so many classes?", correct: "has", distractors: ["have", "did", "does"], hint: "三人称単数で has missed。" },
    { sentence: "___ your friends arrived yet?", correct: "Have", distractors: ["Has", "Did", "Do"], hint: "複数主語なので Have arrived。" },
    { sentence: "How many books ___ you read this year?", correct: "have", distractors: ["has", "did", "do"], hint: "you の疑問文で have。" }
  ];

  const categories = [
    basicAuxData,
    negativeData,
    durationData,
    alreadyJustYetData,
    experienceData,
    beenGoneData,
    questionAuxData
  ];

  categories.forEach((category) => {
    category.forEach((item) => {
      const choices = [item.correct, ...item.distractors];
      questions.push({
        id: "",
        question: item.sentence,
        type: "multiple",
        choices,
        answer: 0,
        explanation: item.hint
      });
    });
  });

  if (questions.length !== 100) {
    throw new Error(`Question count mismatch for present perfect unit: ${questions.length}`);
  }

  return questions.map((q, index) => ({
    ...q,
    id: formatId(prefix, index)
  }));
}

module.exports = {
  writeUnitFile,
  formatId,
  shuffle,
  generatePastBeProgressiveQuestions,
  generateFutureExpressionsQuestions,
  generateConjunctionQuestions,
  generateModalVerbQuestions,
  generateThereBeQuestions,
  generateGerundInfinitiveNounQuestions,
  generateInfinitiveQuestions,
  generateComparisonQuestions,
  generatePassiveVoiceQuestions,
  generatePresentPerfectQuestions
};

if (require.main === module) {
  const units = [
    {
      file: "english-past-be-progressive.json",
      unitId: "past-be-progressive",
      unitName: "過去形（be動詞）・過去進行形",
      idPrefix: "eng-pbp",
      generator: generatePastBeProgressiveQuestions
    },
    {
      file: "english-future-expressions.json",
      unitId: "future-expressions",
      unitName: "未来を表す文",
      idPrefix: "eng-fut",
      generator: generateFutureExpressionsQuestions
    },
    {
      file: "english-conjunctions.json",
      unitId: "conjunctions",
      unitName: "接続詞",
      idPrefix: "eng-conj",
      generator: generateConjunctionQuestions
    },
    {
      file: "english-modal-verbs.json",
      unitId: "modal-verbs",
      unitName: "助動詞",
      idPrefix: "eng-mod",
      generator: generateModalVerbQuestions
    },
    {
      file: "english-there-be.json",
      unitId: "there-be",
      unitName: "There is/There are ～",
      idPrefix: "eng-there",
      generator: generateThereBeQuestions
    },
    {
      file: "english-gerund-infinitive-noun.json",
      unitId: "gerund-infinitive-noun",
      unitName: "～すること（動名詞と不定詞）",
      idPrefix: "eng-gi",
      generator: generateGerundInfinitiveNounQuestions
    },
    {
      file: "english-infinitive.json",
      unitId: "to-infinitive",
      unitName: "不定詞",
      idPrefix: "eng-inf",
      generator: generateInfinitiveQuestions
    },
    {
      file: "english-comparison.json",
      unitId: "comparison",
      unitName: "比較",
      idPrefix: "eng-comp",
      generator: generateComparisonQuestions
    },
    {
      file: "english-passive-voice.json",
      unitId: "passive-voice",
      unitName: "受動態（受け身）",
      idPrefix: "eng-pass",
      generator: generatePassiveVoiceQuestions
    },
    {
      file: "english-present-perfect.json",
      unitId: "present-perfect",
      unitName: "現在完了",
      idPrefix: "eng-pp",
      generator: generatePresentPerfectQuestions
    }
  ];

  units.forEach((unit) => {
    const questions = unit.generator(unit.idPrefix);
    const data = {
      subject: "english",
      subjectName: "英語",
      unitId: unit.unitId,
      unitName: unit.unitName,
      category: "文法",
      questions
    };
    writeUnitFile(unit.file, data);
    console.log(`Generated ${unit.file} with ${questions.length} questions.`);
  });
}
