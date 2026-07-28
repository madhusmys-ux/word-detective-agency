import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Search, Flame, Award, ArrowRight, RotateCcw, FileText, Split, BookOpen, Shuffle, Star, Users, BarChart3, ArrowLeft, Sparkles, Shield } from "lucide-react";
import { storage } from "./storage";

// ---------------------------------------------------------------------------
// Word bank — 11+ / GL-Assessment level vocabulary
// ---------------------------------------------------------------------------
const WORDS = [
  { word: "abundant", definition: "existing in large quantities; plentiful", synonym: "plentiful", antonym: "scarce", sentence: "Fresh water was ___ in the valley, so the village never worried about drought." },
  { word: "adversary", definition: "an opponent or enemy", synonym: "opponent", antonym: "ally", sentence: "The knight faced his fiercest ___ in the final battle." },
  { word: "ample", definition: "enough or more than enough", synonym: "sufficient", antonym: "insufficient", sentence: "We had ___ time to finish the test before the bell rang." },
  { word: "benevolent", definition: "kind and generous", synonym: "kindly", antonym: "cruel", sentence: "The ___ king gave food to every family in the kingdom." },
  { word: "candid", definition: "truthful and straightforward; frank", synonym: "honest", antonym: "deceptive", sentence: "Her ___ answer surprised the interviewer, who expected excuses." },
  { word: "cautious", definition: "careful to avoid danger or mistakes", synonym: "careful", antonym: "reckless", sentence: "The ___ hiker checked the weather before setting off." },
  { word: "diligent", definition: "showing care and effort in work", synonym: "hardworking", antonym: "lazy", sentence: "The ___ student revised every evening before the exam." },
  { word: "eloquent", definition: "fluent and persuasive in speaking", synonym: "articulate", antonym: "inarticulate", sentence: "The ___ speaker held the audience's attention for an hour." },
  { word: "frivolous", definition: "not having any serious purpose; silly", synonym: "trivial", antonym: "serious", sentence: "The judge dismissed the ___ complaint immediately." },
  { word: "genuine", definition: "truly what it is said to be; authentic", synonym: "authentic", antonym: "fake", sentence: "The collector verified that the painting was ___." },
  { word: "hostile", definition: "unfriendly; antagonistic", synonym: "unfriendly", antonym: "friendly", sentence: "The ___ crowd booed the referee's decision." },
  { word: "immense", definition: "extremely large", synonym: "enormous", antonym: "tiny", sentence: "The ship was ___, towering over the harbour." },
  { word: "jubilant", definition: "feeling great happiness and triumph", synonym: "joyful", antonym: "miserable", sentence: "The team was ___ after winning the championship." },
  { word: "keen", definition: "eager or enthusiastic", synonym: "eager", antonym: "reluctant", sentence: "She was ___ to start her new violin lessons." },
  { word: "lament", definition: "to express sorrow or regret", synonym: "mourn", antonym: "celebrate", sentence: "The villagers began to ___ the loss of their harvest." },
  { word: "meticulous", definition: "very careful and precise", synonym: "thorough", antonym: "careless", sentence: "The scientist was ___ when recording her results." },
  { word: "notorious", definition: "famous for something bad", synonym: "infamous", antonym: "unknown", sentence: "The pirate was ___ for his daring raids." },
  { word: "obstinate", definition: "stubbornly refusing to change one's mind", synonym: "stubborn", antonym: "flexible", sentence: "The ___ donkey refused to move another step." },
  { word: "plausible", definition: "seeming reasonable or probable", synonym: "believable", antonym: "unlikely", sentence: "His excuse sounded ___, but the teacher wasn't convinced." },
  { word: "quaint", definition: "attractively unusual or old-fashioned", synonym: "charming", antonym: "modern", sentence: "They stayed in a ___ cottage by the sea." },
  { word: "reluctant", definition: "unwilling and hesitant", synonym: "unwilling", antonym: "eager", sentence: "He was ___ to share his last biscuit." },
  { word: "scarce", definition: "insufficient for the demand; rare", synonym: "rare", antonym: "abundant", sentence: "During the drought, water became ___." },
  { word: "tedious", definition: "too long, slow, or dull; tiresome", synonym: "boring", antonym: "exciting", sentence: "Copying the whole chapter out was a ___ task." },
  { word: "unanimous", definition: "fully in agreement", synonym: "united", antonym: "divided", sentence: "The jury reached a ___ verdict." },
  { word: "vivid", definition: "producing powerful feelings or clear images in the mind", synonym: "brilliant", antonym: "dull", sentence: "She gave a ___ description of the sunset." },
  { word: "wary", definition: "feeling caution about possible dangers", synonym: "cautious", antonym: "trusting", sentence: "The cat was ___ of the new visitor." },
  { word: "zealous", definition: "having great energy and enthusiasm for a cause", synonym: "passionate", antonym: "apathetic", sentence: "The ___ volunteers worked all weekend to clean the park." },
  { word: "arduous", definition: "involving hard effort; difficult and tiring", synonym: "strenuous", antonym: "easy", sentence: "The climb to the summit was long and ___." },
  { word: "concise", definition: "giving information clearly in few words", synonym: "brief", antonym: "wordy", sentence: "Her report was ___ and easy to follow." },
  { word: "docile", definition: "ready to accept control; easily managed", synonym: "obedient", antonym: "unruly", sentence: "The old horse was gentle and ___." },
  { word: "fortitude", definition: "courage shown when facing pain or hardship", synonym: "courage", antonym: "cowardice", sentence: "She showed great ___ during her recovery." },
  { word: "gregarious", definition: "fond of company; sociable", synonym: "sociable", antonym: "shy", sentence: "He was a ___ person who loved parties." },
  { word: "hinder", definition: "to create difficulty for; delay", synonym: "obstruct", antonym: "assist", sentence: "Heavy rain began to ___ the rescue effort." },
  { word: "impartial", definition: "treating all sides equally; unbiased", synonym: "unbiased", antonym: "biased", sentence: "The referee must remain ___ throughout the match." },
  { word: "jovial", definition: "cheerful and friendly", synonym: "merry", antonym: "gloomy", sentence: "The ___ shopkeeper greeted every customer with a joke." },
  { word: "lucid", definition: "easy to understand; clear", synonym: "clear", antonym: "confusing", sentence: "The teacher gave a ___ explanation of the experiment." },
  { word: "meagre", definition: "lacking in quantity; small", synonym: "scanty", antonym: "plentiful", sentence: "They survived on a ___ portion of bread each day." },
  { word: "novice", definition: "a person new to a skill or activity", synonym: "beginner", antonym: "expert", sentence: "As a ___, she still needed help tuning her guitar." },
  { word: "opulent", definition: "luxurious and expensive-looking", synonym: "lavish", antonym: "modest", sentence: "The palace had an ___ golden ceiling." },
  { word: "perilous", definition: "full of danger", synonym: "dangerous", antonym: "safe", sentence: "The ___ mountain path had no guardrail." },
  { word: "quell", definition: "to put an end to; suppress", synonym: "subdue", antonym: "incite", sentence: "Soldiers were sent in to ___ the uprising." },
  { word: "rigid", definition: "unable to bend; strict", synonym: "stiff", antonym: "flexible", sentence: "The metal rod was completely ___." },
  { word: "sombre", definition: "dark or dull; gloomy", synonym: "gloomy", antonym: "cheerful", sentence: "A ___ mood fell over the room after the news." },
  { word: "tranquil", definition: "free from disturbance; calm", synonym: "peaceful", antonym: "chaotic", sentence: "The lake was perfectly ___ at dawn." },
  { word: "urge", definition: "to strongly encourage or advise", synonym: "encourage", antonym: "discourage", sentence: "Her coach began to ___ her to try harder." },
  { word: "vague", definition: "not clearly expressed or defined", synonym: "unclear", antonym: "precise", sentence: "His directions were too ___ to follow." },
  { word: "wither", definition: "to shrivel or become weak", synonym: "shrivel", antonym: "flourish", sentence: "Without water, the plants began to ___." },
  { word: "yield", definition: "to give way or produce", synonym: "surrender", antonym: "resist", sentence: "The old bridge might ___ under too much weight." },

  // --- Expanded bank ---
  { word: "adamant", definition: "refusing to change one's mind; firmly decided", synonym: "insistent", antonym: "flexible", sentence: "She was ___ that the missing coin would be found before nightfall." },
  { word: "adept", definition: "very skilled or proficient at something", synonym: "skilful", antonym: "inept", sentence: "The mechanic was ___ at fixing even the oldest engines." },
  { word: "agile", definition: "able to move quickly and easily", synonym: "nimble", antonym: "clumsy", sentence: "The ___ gymnast landed the vault without a wobble." },
  { word: "aloof", definition: "distant and uninvolved; not friendly", synonym: "distant", antonym: "sociable", sentence: "The new pupil seemed ___ on his first day, sitting alone at lunch." },
  { word: "ambiguous", definition: "open to more than one interpretation; unclear", synonym: "unclear", antonym: "explicit", sentence: "The witness gave an ___ account that could be read two ways." },
  { word: "amiable", definition: "friendly and pleasant", synonym: "friendly", antonym: "hostile", sentence: "Their ___ neighbour always waved and stopped to chat." },
  { word: "apprehensive", definition: "anxious or fearful about the future", synonym: "worried", antonym: "confident", sentence: "She felt ___ as she waited outside the headteacher's office." },
  { word: "ardent", definition: "very enthusiastic or passionate", synonym: "passionate", antonym: "indifferent", sentence: "He was an ___ supporter of the local football club." },
  { word: "audacious", definition: "showing a willingness to take bold risks", synonym: "daring", antonym: "timid", sentence: "The ___ escape plan involved climbing over the prison wall in daylight." },
  { word: "austere", definition: "severe or strict in appearance or manner; plain", synonym: "stark", antonym: "luxurious", sentence: "The monk's ___ room contained only a bed and a candle." },
  { word: "banish", definition: "to send someone away as punishment", synonym: "expel", antonym: "welcome", sentence: "The king chose to ___ the traitor rather than execute him." },
  { word: "belligerent", definition: "hostile and aggressive", synonym: "combative", antonym: "peaceful", sentence: "The ___ customer shouted at the waiter over a small mistake." },
  { word: "benign", definition: "gentle and kindly; not harmful", synonym: "harmless", antonym: "malignant", sentence: "The old dog looked fierce but had a ___ temperament." },
  { word: "bewilder", definition: "to confuse someone completely", synonym: "baffle", antonym: "clarify", sentence: "The maze of corridors began to ___ the new students." },
  { word: "boisterous", definition: "noisy, energetic, and cheerful", synonym: "rowdy", antonym: "subdued", sentence: "The ___ crowd cheered loudly as the runners crossed the line." },
  { word: "brittle", definition: "hard but easily broken", synonym: "fragile", antonym: "sturdy", sentence: "The old paper was so ___ that it crumbled at the corners." },
  { word: "brusque", definition: "blunt or abrupt in manner", synonym: "curt", antonym: "gentle", sentence: "The manager's ___ reply left the intern feeling unwelcome." },
  { word: "capricious", definition: "changing mood or behaviour suddenly and unpredictably", synonym: "fickle", antonym: "consistent", sentence: "The weather on the coast was ___, sunny one minute and stormy the next." },
  { word: "coherent", definition: "logical and consistent; easy to follow", synonym: "logical", antonym: "muddled", sentence: "She gave a ___ explanation of how the machine worked." },
  { word: "complacent", definition: "too satisfied with oneself to notice danger", synonym: "self-satisfied", antonym: "vigilant", sentence: "Winning easily made the team ___ before the final." },
  { word: "compassionate", definition: "feeling or showing sympathy for others' suffering", synonym: "caring", antonym: "callous", sentence: "The ___ nurse stayed late to comfort the frightened child." },
  { word: "congenial", definition: "pleasant and friendly; agreeable", synonym: "amicable", antonym: "unpleasant", sentence: "They spent a ___ evening chatting by the fire." },
  { word: "conspicuous", definition: "clearly visible; attracting attention", synonym: "noticeable", antonym: "inconspicuous", sentence: "Her bright red coat made her ___ in the grey crowd." },
  { word: "contemplate", definition: "to think about something deeply", synonym: "ponder", antonym: "ignore", sentence: "He sat by the lake to ___ his next move." },
  { word: "courteous", definition: "polite and respectful", synonym: "polite", antonym: "rude", sentence: "The ___ waiter pulled out a chair for the elderly guest." },
  { word: "credible", definition: "able to be believed; convincing", synonym: "believable", antonym: "implausible", sentence: "The detective needed a more ___ witness before making an arrest." },
  { word: "daunting", definition: "seeming difficult to deal with; intimidating", synonym: "intimidating", antonym: "reassuring", sentence: "The mountain looked ___ from the base camp." },
  { word: "decisive", definition: "able to make decisions quickly and confidently", synonym: "resolute", antonym: "indecisive", sentence: "A good captain must be ___ under pressure." },
  { word: "deficient", definition: "lacking something essential; incomplete", synonym: "lacking", antonym: "sufficient", sentence: "The soil was ___ in nutrients, so the crop failed." },
  { word: "deplete", definition: "to use up a resource or supply", synonym: "exhaust", antonym: "replenish", sentence: "Weeks at sea began to ___ their supply of fresh water." },
  { word: "despondent", definition: "in low spirits from loss of hope", synonym: "dejected", antonym: "hopeful", sentence: "He grew ___ after failing the test a second time." },
  { word: "deter", definition: "to discourage someone from doing something", synonym: "discourage", antonym: "encourage", sentence: "The tall fence was meant to ___ trespassers." },
  { word: "devious", definition: "cunning and deceitful", synonym: "cunning", antonym: "honest", sentence: "The ___ fox tricked the crow into dropping its cheese." },
  { word: "diminish", definition: "to make or become smaller", synonym: "decrease", antonym: "increase", sentence: "Her enthusiasm did not ___, even after the long delay." },
  { word: "discreet", definition: "careful not to attract attention or reveal secrets", synonym: "tactful", antonym: "indiscreet", sentence: "The assistant made a ___ exit before the argument began." },
  { word: "dismal", definition: "depressing or gloomy", synonym: "bleak", antonym: "cheerful", sentence: "The match ended in a ___ defeat for the home team." },
  { word: "dubious", definition: "hesitant or doubting; of questionable value", synonym: "doubtful", antonym: "certain", sentence: "She gave the salesman a ___ look before signing anything." },
  { word: "earnest", definition: "sincere and serious in intention", synonym: "sincere", antonym: "flippant", sentence: "He made an ___ apology for arriving so late." },
  { word: "eccentric", definition: "unconventional and slightly strange", synonym: "quirky", antonym: "conventional", sentence: "The ___ inventor kept forty clocks in his workshop." },
  { word: "elated", definition: "extremely happy and excited", synonym: "delighted", antonym: "dejected", sentence: "The team was ___ when they heard the final score." },
  { word: "elude", definition: "to escape or avoid skilfully", synonym: "evade", antonym: "confront", sentence: "The thief managed to ___ the guards for another night." },
  { word: "enthral", definition: "to captivate someone's attention completely", synonym: "captivate", antonym: "bore", sentence: "The storyteller's tale began to ___ every child in the room." },
  { word: "equivocal", definition: "open to two interpretations; ambiguous", synonym: "ambiguous", antonym: "unambiguous", sentence: "His ___ answer left the reporters more confused than before." },
  { word: "erratic", definition: "not consistent or regular in behaviour", synonym: "unpredictable", antonym: "steady", sentence: "The old engine made an ___ rattling noise." },
  { word: "exasperate", definition: "to irritate someone intensely", synonym: "infuriate", antonym: "soothe", sentence: "The endless delays began to ___ the waiting passengers." },
  { word: "exemplary", definition: "serving as a desirable model; excellent", synonym: "outstanding", antonym: "poor", sentence: "Her ___ behaviour earned her the head girl badge." },
  { word: "exuberant", definition: "full of energy and enthusiasm", synonym: "lively", antonym: "listless", sentence: "The ___ puppy bounded around the garden all afternoon." },
  { word: "falter", definition: "to lose strength or momentum; hesitate", synonym: "waver", antonym: "persist", sentence: "Her voice began to ___ as she reached the final verse." },
  { word: "feasible", definition: "possible to do easily or conveniently", synonym: "achievable", antonym: "impractical", sentence: "The engineers decided the bridge design was ___ after all." },
  { word: "fervent", definition: "having or showing intense feeling", synonym: "passionate", antonym: "apathetic", sentence: "She made a ___ plea for the animals to be rehomed." },
  { word: "flourish", definition: "to grow or develop well; thrive", synonym: "thrive", antonym: "wither", sentence: "The garden began to ___ once the rain finally arrived." },
  { word: "formidable", definition: "inspiring fear or respect through impressiveness", synonym: "imposing", antonym: "weak", sentence: "The champion was a ___ opponent for any newcomer." },
  { word: "fraudulent", definition: "obtained or done by deception; dishonest", synonym: "deceitful", antonym: "genuine", sentence: "The company was fined for making ___ claims about its products." },
  { word: "frugal", definition: "careful with money; not wasteful", synonym: "thrifty", antonym: "extravagant", sentence: "Years of ___ living allowed them to save enough for a house." },
  { word: "futile", definition: "producing no useful result; pointless", synonym: "pointless", antonym: "worthwhile", sentence: "Their attempts to bail out the sinking boat proved ___." },
  { word: "garrulous", definition: "excessively talkative", synonym: "talkative", antonym: "taciturn", sentence: "The ___ taxi driver talked for the entire journey." },
  { word: "gaunt", definition: "thin and haggard, especially from illness or hunger", synonym: "haggard", antonym: "plump", sentence: "After weeks at sea, the sailors looked ___ and pale." },
  { word: "grim", definition: "very serious or forbidding", synonym: "stern", antonym: "cheerful", sentence: "The doctor's ___ expression worried the waiting family." },
  { word: "gruelling", definition: "extremely tiring and demanding", synonym: "exhausting", antonym: "effortless", sentence: "The ___ race left every runner collapsed at the finish line." },
  { word: "haggard", definition: "looking exhausted, especially from lack of sleep", synonym: "worn", antonym: "refreshed", sentence: "He looked ___ after staying up all night to finish the essay." },
  { word: "hamper", definition: "to hinder or prevent progress", synonym: "impede", antonym: "assist", sentence: "Heavy fog began to ___ the search party's progress." },
  { word: "haphazard", definition: "lacking order or organisation; random", synonym: "disorganised", antonym: "methodical", sentence: "The books were stacked in a ___ pile on the floor." },
  { word: "harmonious", definition: "free from conflict; forming a pleasing whole", synonym: "peaceful", antonym: "discordant", sentence: "The choir's voices blended into a ___ melody." },
  { word: "haughty", definition: "arrogantly proud and disdainful", synonym: "arrogant", antonym: "humble", sentence: "The ___ duchess refused to speak to the servants." },
  { word: "hazardous", definition: "risky; dangerous", synonym: "perilous", antonym: "safe", sentence: "The icy road proved ___ for the delivery van." },
  { word: "humdrum", definition: "lacking excitement or variety; dull", synonym: "monotonous", antonym: "exciting", sentence: "She longed to escape her ___ routine and travel the world." },
  { word: "idle", definition: "not active or in use; avoiding work", synonym: "inactive", antonym: "industrious", sentence: "The factory machines stood ___ during the strike." },
  { word: "illuminate", definition: "to light up; to make clear", synonym: "light up", antonym: "darken", sentence: "A single lamp began to ___ the dusty attic." },
  { word: "imminent", definition: "about to happen very soon", synonym: "impending", antonym: "distant", sentence: "Dark clouds warned of an ___ storm." },
  { word: "impeccable", definition: "in accordance with the highest standards; flawless", synonym: "flawless", antonym: "imperfect", sentence: "The waiter's ___ manners impressed every guest." },
  { word: "impede", definition: "to delay or block progress", synonym: "hinder", antonym: "facilitate", sentence: "Fallen branches began to ___ the rescue team's path." },
  { word: "imperative", definition: "extremely important; essential", synonym: "essential", antonym: "optional", sentence: "It was ___ that the letter arrive before Friday." },
  { word: "impetuous", definition: "acting quickly without thought", synonym: "rash", antonym: "cautious", sentence: "His ___ decision to jump in cost him his new watch." },
  { word: "implore", definition: "to beg someone earnestly", synonym: "beseech", antonym: "demand", sentence: "She began to ___ the guard to let her pass." },
  { word: "inadvertent", definition: "not resulting from careful thought; accidental", synonym: "unintentional", antonym: "deliberate", sentence: "His ___ comment upset her more than he realised." },
  { word: "incessant", definition: "never stopping; continuous", synonym: "constant", antonym: "intermittent", sentence: "The ___ drumming of rain kept them awake all night." },
  { word: "incredulous", definition: "unwilling or unable to believe something", synonym: "disbelieving", antonym: "convinced", sentence: "She gave an ___ stare when he claimed to have met the Queen." },
  { word: "indifferent", definition: "having no particular interest or sympathy", synonym: "unconcerned", antonym: "passionate", sentence: "He remained ___ to the team's defeat." },
  { word: "indignant", definition: "feeling anger at unfair treatment", synonym: "outraged", antonym: "content", sentence: "She was ___ when accused of cheating on the test." },
  { word: "industrious", definition: "hardworking and diligent", synonym: "hardworking", antonym: "idle", sentence: "The ___ ants carried crumbs back to the nest all summer." },
  { word: "inevitable", definition: "certain to happen; unavoidable", synonym: "unavoidable", antonym: "avoidable", sentence: "With the bridge closed, a delay was ___." },
  { word: "ingenious", definition: "clever, original, and inventive", synonym: "inventive", antonym: "unimaginative", sentence: "The ___ contraption could sort coins by size alone." },
  { word: "innate", definition: "inborn; natural rather than learned", synonym: "inherent", antonym: "acquired", sentence: "The kitten showed an ___ talent for hunting mice." },
  { word: "insolent", definition: "rude and disrespectful", synonym: "impertinent", antonym: "respectful", sentence: "The teacher was shocked by the pupil's ___ reply." },
  { word: "intrepid", definition: "fearless and adventurous", synonym: "fearless", antonym: "cowardly", sentence: "The ___ explorer set off alone into the frozen wilderness." },
  { word: "intricate", definition: "very complicated or detailed", synonym: "complex", antonym: "simple", sentence: "The clockmaker admired the watch's ___ inner workings." },
  { word: "irate", definition: "extremely angry", synonym: "furious", antonym: "calm", sentence: "The ___ customer demanded to see the manager at once." },
  { word: "irrational", definition: "not logical or reasonable", synonym: "illogical", antonym: "rational", sentence: "His fear of the harmless spider seemed entirely ___." },
  { word: "jaded", definition: "tired, bored, or lacking enthusiasm from overexposure", synonym: "weary", antonym: "enthusiastic", sentence: "After ten shows in a row, the actors felt ___." },
  { word: "jagged", definition: "having a rough, sharply uneven edge", synonym: "serrated", antonym: "smooth", sentence: "The climbers picked their way across the ___ rocks." },
  { word: "jeopardy", definition: "danger of loss, harm, or failure", synonym: "peril", antonym: "safety", sentence: "The whole expedition was put in ___ by the broken radio." },
  { word: "laborious", definition: "requiring considerable time and effort", synonym: "strenuous", antonym: "effortless", sentence: "Cataloguing every book in the library was a ___ task." },
  { word: "lavish", definition: "sumptuously rich or luxurious", synonym: "extravagant", antonym: "sparse", sentence: "The wedding was a ___ affair with a live orchestra." },
  { word: "lethargic", definition: "sluggish and lacking energy", synonym: "sluggish", antonym: "energetic", sentence: "The heat made the whole class feel ___ by midday." },
  { word: "listless", definition: "lacking energy or enthusiasm", synonym: "languid", antonym: "lively", sentence: "The dog lay ___ in the shade all afternoon." },
  { word: "lofty", definition: "of imposing height; noble in character", synonym: "elevated", antonym: "humble", sentence: "The castle's ___ towers could be seen from miles away." },
  { word: "lucrative", definition: "producing a great deal of profit", synonym: "profitable", antonym: "unprofitable", sentence: "The lemonade stand turned out to be surprisingly ___." },
  { word: "ludicrous", definition: "absurd; ridiculous", synonym: "absurd", antonym: "sensible", sentence: "It was ___ to expect the tiny car to fit five passengers." },
  { word: "magnanimous", definition: "generous or forgiving, especially towards a rival", synonym: "generous", antonym: "petty", sentence: "The victor was ___ in praising his defeated opponent." },
  { word: "malicious", definition: "intending to do harm", synonym: "spiteful", antonym: "kind", sentence: "Someone had spread a ___ rumour about the new student." },
  { word: "meander", definition: "to follow a winding course", synonym: "wind", antonym: "beeline", sentence: "The river began to ___ slowly through the valley." },
  { word: "melancholy", definition: "a feeling of deep, thoughtful sadness", synonym: "sorrowful", antonym: "joyful", sentence: "A ___ mood settled over the house after the news." },
  { word: "menace", definition: "a threat or danger", synonym: "threat", antonym: "safeguard", sentence: "The escaped bull was a real ___ to the village." },
  { word: "mundane", definition: "lacking excitement; ordinary", synonym: "ordinary", antonym: "extraordinary", sentence: "Even the most ___ chore felt bearable with music playing." },
  { word: "murky", definition: "dark and gloomy; not clear", synonym: "cloudy", antonym: "clear", sentence: "The ___ pond water hid whatever lay beneath." },
  { word: "naive", definition: "showing a lack of experience or judgement", synonym: "unworldly", antonym: "shrewd", sentence: "It was ___ of him to trust a stranger with his savings." },
  { word: "nimble", definition: "quick and light in movement", synonym: "agile", antonym: "clumsy", sentence: "The ___ squirrel leapt from branch to branch." },
  { word: "nonchalant", definition: "casually calm and relaxed; unconcerned", synonym: "unruffled", antonym: "anxious", sentence: "He gave a ___ shrug, as if the exam hadn't worried him at all." },
  { word: "nostalgic", definition: "longing for the past", synonym: "wistful", antonym: "forward-looking", sentence: "The old photographs made her feel ___ for her childhood home." },
  { word: "nurture", definition: "to care for and help develop", synonym: "foster", antonym: "neglect", sentence: "The teacher worked hard to ___ every pupil's talent." },
  { word: "oblivious", definition: "unaware of what is happening around one", synonym: "unaware", antonym: "conscious", sentence: "He was completely ___ to the surprise party being planned." },
  { word: "obscure", definition: "not well known; unclear", synonym: "unclear", antonym: "well-known", sentence: "The meaning of the ancient inscription remained ___." },
  { word: "obsolete", definition: "no longer in use; outdated", synonym: "outdated", antonym: "current", sentence: "The old typewriter became ___ once computers arrived." },
  { word: "ominous", definition: "giving the impression that something bad will happen", synonym: "threatening", antonym: "promising", sentence: "An ___ silence fell over the forest before the storm." },
  { word: "ornate", definition: "elaborately decorated", synonym: "elaborate", antonym: "plain", sentence: "The ___ ceiling was covered in gold leaf and carvings." },
  { word: "ostentatious", definition: "designed to impress; showy", synonym: "showy", antonym: "understated", sentence: "His ___ gold watch drew stares wherever he went." },
  { word: "pacify", definition: "to calm or soothe someone who is angry", synonym: "appease", antonym: "provoke", sentence: "The zookeeper tried to ___ the frightened elephant." },
  { word: "paramount", definition: "more important than anything else", synonym: "supreme", antonym: "minor", sentence: "Safety was of ___ importance during the expedition." },
  { word: "passive", definition: "accepting what happens without resisting", synonym: "submissive", antonym: "active", sentence: "He remained ___ while his classmates argued around him." },
  { word: "peculiar", definition: "strange or unusual", synonym: "odd", antonym: "ordinary", sentence: "A ___ smell drifted from the abandoned house." },
  { word: "penitent", definition: "feeling or showing sorrow for wrongdoing", synonym: "remorseful", antonym: "unrepentant", sentence: "The ___ boy apologised to his sister for breaking her toy." },
  { word: "perceptive", definition: "having keen insight or understanding", synonym: "insightful", antonym: "oblivious", sentence: "The ___ detective noticed the muddy footprint others had missed." },
  { word: "pessimistic", definition: "expecting the worst outcome", synonym: "gloomy", antonym: "optimistic", sentence: "He took a ___ view of the team's chances after the injury." },
  { word: "petty", definition: "of little importance; small-minded", synonym: "trivial", antonym: "significant", sentence: "The two friends fell out over a ___ disagreement." },
  { word: "plight", definition: "a difficult or dangerous situation", synonym: "predicament", antonym: "advantage", sentence: "News of the villagers' ___ reached the capital within days." },
  { word: "plummet", definition: "to fall or drop straight down suddenly", synonym: "plunge", antonym: "soar", sentence: "The kite began to ___ once the wind died down." },
  { word: "ponder", definition: "to think about something carefully", synonym: "consider", antonym: "disregard", sentence: "She paused to ___ the riddle before answering." },
  { word: "pragmatic", definition: "dealing with things sensibly and realistically", synonym: "practical", antonym: "idealistic", sentence: "The coach took a ___ approach, focusing on what the team could control." },
  { word: "precarious", definition: "not securely held; likely to fall", synonym: "unstable", antonym: "secure", sentence: "The ladder rested at a ___ angle against the wall." },
  { word: "presumptuous", definition: "overconfident or bold in an unwelcome way", synonym: "impertinent", antonym: "modest", sentence: "It seemed ___ of him to sit in the head teacher's chair." },
  { word: "pristine", definition: "in its original, spotless condition", synonym: "immaculate", antonym: "soiled", sentence: "The museum kept the ancient vase in ___ condition." },
  { word: "prodigious", definition: "remarkably or impressively great in extent", synonym: "immense", antonym: "insignificant", sentence: "The young pianist showed ___ talent for her age." },
  { word: "provoke", definition: "to stimulate or cause a reaction, often anger", synonym: "incite", antonym: "pacify", sentence: "The barking dog began to ___ the cat next door." },
  { word: "prudent", definition: "acting with care and thought for the future", synonym: "sensible", antonym: "reckless", sentence: "It was ___ of them to save some money each month." },
  { word: "quaver", definition: "to shake or tremble, especially in the voice", synonym: "tremble", antonym: "steady", sentence: "Her voice began to ___ as she read the sad poem aloud." },
  { word: "querulous", definition: "complaining in a petulant or whining way", synonym: "grumbling", antonym: "content", sentence: "The ___ passenger complained about every bump in the road." },
  { word: "quibble", definition: "to argue about a trivial matter", synonym: "cavil", antonym: "agree", sentence: "The two lawyers began to ___ over a single missing comma." },
  { word: "radiant", definition: "shining brightly; glowing with happiness", synonym: "glowing", antonym: "dull", sentence: "The bride looked ___ as she walked down the aisle." },
  { word: "ravenous", definition: "extremely hungry", synonym: "famished", antonym: "satisfied", sentence: "After the long hike, the whole group felt ___." },
  { word: "rebuke", definition: "to express sharp disapproval; reprimand", synonym: "reprimand", antonym: "praise", sentence: "The captain began to ___ the sailor for his carelessness." },
  { word: "recluse", definition: "a person who lives alone and avoids others", synonym: "hermit", antonym: "socialite", sentence: "The old ___ hadn't left his cottage in years." },
  { word: "resilient", definition: "able to recover quickly from difficulties", synonym: "tough", antonym: "fragile", sentence: "The ___ community rebuilt within months of the flood." },
  { word: "resolute", definition: "admirably determined; unwavering", synonym: "determined", antonym: "irresolute", sentence: "She remained ___ in her decision despite the criticism." },
  { word: "reticent", definition: "not revealing thoughts or feelings readily", synonym: "reserved", antonym: "outspoken", sentence: "He was oddly ___ about what had happened at the meeting." },
  { word: "revere", definition: "to feel deep respect or admiration for", synonym: "admire", antonym: "despise", sentence: "The villagers had come to ___ the old healer." },
  { word: "ridicule", definition: "to mock or make fun of someone", synonym: "mock", antonym: "praise", sentence: "The comedian began to ___ the outdated fashion trends." },
  { word: "robust", definition: "strong and healthy; sturdy", synonym: "sturdy", antonym: "frail", sentence: "The ___ old bridge had survived a hundred winters." },
  { word: "ruthless", definition: "having no pity or compassion", synonym: "merciless", antonym: "merciful", sentence: "The ___ pirate showed no mercy to the captured crew." },
  { word: "sagacious", definition: "showing keen judgement and wisdom", synonym: "wise", antonym: "foolish", sentence: "The ___ old owl was known for solving every riddle." },
  { word: "sceptical", definition: "not easily convinced; having doubts", synonym: "doubtful", antonym: "credulous", sentence: "The scientists remained ___ of the surprising results." },
  { word: "serene", definition: "calm, peaceful, and untroubled", synonym: "calm", antonym: "turbulent", sentence: "The lake looked ___ under the early morning mist." },
  { word: "shrewd", definition: "having sharp powers of judgement; astute", synonym: "astute", antonym: "naive", sentence: "The ___ trader spotted the flaw in the deal at once." },
  { word: "sinister", definition: "giving the impression of evil intentions", synonym: "menacing", antonym: "reassuring", sentence: "A ___ figure lurked at the edge of the alley." },
  { word: "sluggish", definition: "slow-moving; lacking energy", synonym: "lethargic", antonym: "brisk", sentence: "The traffic crawled along at a ___ pace all morning." },
  { word: "solemn", definition: "formal and serious", synonym: "grave", antonym: "cheerful", sentence: "A ___ hush fell over the hall as the names were read." },
  { word: "spontaneous", definition: "done without planning; impulsive", synonym: "impulsive", antonym: "planned", sentence: "They made a ___ decision to drive to the coast for the day." },
  { word: "sporadic", definition: "occurring occasionally and irregularly", synonym: "intermittent", antonym: "constant", sentence: "___ bursts of rain interrupted the otherwise sunny afternoon." },
  { word: "stagnant", definition: "not flowing or developing; still", synonym: "motionless", antonym: "flowing", sentence: "Mosquitoes bred in the ___ pool behind the barn." },
  { word: "staunch", definition: "firm and loyal in attitude", synonym: "steadfast", antonym: "disloyal", sentence: "She remained a ___ supporter of the campaign for years." },
  { word: "stern", definition: "strict and serious in manner", synonym: "severe", antonym: "lenient", sentence: "The ___ headmaster rarely smiled during assembly." },
  { word: "stoic", definition: "enduring pain without complaint", synonym: "unflinching", antonym: "emotional", sentence: "He remained ___ throughout the long and painful treatment." },
  { word: "subdue", definition: "to overcome or bring under control", synonym: "suppress", antonym: "incite", sentence: "It took three firefighters to ___ the blaze." },
  { word: "sullen", definition: "bad-tempered and sulky; gloomy", synonym: "morose", antonym: "cheerful", sentence: "He gave a ___ shrug and refused to answer any questions." },
  { word: "superficial", definition: "existing only on the surface; not thorough", synonym: "shallow", antonym: "profound", sentence: "Her knowledge of the topic turned out to be rather ___." },
  { word: "superfluous", definition: "more than is needed; unnecessary", synonym: "excessive", antonym: "essential", sentence: "The extra paragraph felt ___ once the letter was shortened." },
  { word: "surly", definition: "bad-tempered and unfriendly", synonym: "sullen", antonym: "amiable", sentence: "The ___ shopkeeper barely looked up from his newspaper." },
  { word: "taciturn", definition: "reserved and saying very little", synonym: "reticent", antonym: "talkative", sentence: "The ___ farmer answered every question with a single word." },
  { word: "tangible", definition: "able to be touched or clearly perceived; real", synonym: "concrete", antonym: "abstract", sentence: "The team needed ___ proof before they would believe the claim." },
  { word: "tarnish", definition: "to damage the reputation of; to lose lustre", synonym: "sully", antonym: "polish", sentence: "The scandal began to ___ the mayor's once-spotless reputation." },
  { word: "tenacious", definition: "holding firmly to something; persistent", synonym: "persistent", antonym: "yielding", sentence: "The ___ climber refused to give up despite the storm." },
  { word: "tentative", definition: "not certain or fixed; hesitant", synonym: "provisional", antonym: "definite", sentence: "They made a ___ plan to meet again the following week." },
  { word: "terse", definition: "brief and to the point; curt", synonym: "curt", antonym: "verbose", sentence: "His ___ reply suggested he didn't want to talk further." },
  { word: "timid", definition: "lacking courage or confidence; shy", synonym: "shy", antonym: "bold", sentence: "The ___ kitten hid under the sofa whenever visitors arrived." },
  { word: "torment", definition: "to cause severe suffering; to tease cruelly", synonym: "torture", antonym: "comfort", sentence: "The older boys liked to ___ the new student with silly nicknames." },
  { word: "transient", definition: "lasting only for a short time", synonym: "fleeting", antonym: "permanent", sentence: "The rainbow was ___, gone within a few minutes." },
  { word: "treacherous", definition: "dangerous and unpredictable; disloyal", synonym: "perfidious", antonym: "trustworthy", sentence: "The ___ mountain path had claimed several careless climbers." },
  { word: "trivial", definition: "of little value or importance", synonym: "insignificant", antonym: "significant", sentence: "They argued for an hour over a completely ___ matter." },
  { word: "turbulent", definition: "characterised by conflict or confusion; not calm", synonym: "chaotic", antonym: "calm", sentence: "The plane shook through a patch of ___ air." },
  { word: "unassuming", definition: "not pretentious or arrogant; modest", synonym: "modest", antonym: "arrogant", sentence: "Despite his fame, the actor remained remarkably ___." },
  { word: "uncanny", definition: "strange or mysterious in an unsettling way", synonym: "eerie", antonym: "ordinary", sentence: "The twins had an ___ habit of finishing each other's sentences." },
  { word: "undermine", definition: "to weaken gradually or secretly", synonym: "weaken", antonym: "strengthen", sentence: "Constant criticism began to ___ her confidence." },
  { word: "uneasy", definition: "feeling anxious or uncomfortable", synonym: "apprehensive", antonym: "relaxed", sentence: "An ___ silence spread through the classroom." },
  { word: "unkempt", definition: "untidy in appearance; not groomed", synonym: "dishevelled", antonym: "neat", sentence: "After the storm, the garden looked wild and ___." },
  { word: "unprecedented", definition: "never done or known before", synonym: "unparalleled", antonym: "common", sentence: "The heatwave brought ___ temperatures to the region." },
  { word: "unruly", definition: "disorderly and difficult to control", synonym: "unmanageable", antonym: "obedient", sentence: "The substitute teacher struggled with the ___ class." },
  { word: "unwavering", definition: "steady and not changing; firm", synonym: "steadfast", antonym: "hesitant", sentence: "Her ___ support helped him through the difficult season." },
  { word: "valiant", definition: "possessing or showing courage", synonym: "brave", antonym: "cowardly", sentence: "The knight made a ___ attempt to rescue the villagers." },
  { word: "venerable", definition: "accorded great respect due to age or wisdom", synonym: "esteemed", antonym: "disreputable", sentence: "The ___ professor had taught at the university for fifty years." },
  { word: "verbose", definition: "using more words than needed; wordy", synonym: "wordy", antonym: "concise", sentence: "His ___ essay took three pages to make a simple point." },
  { word: "versatile", definition: "able to adapt to many different functions", synonym: "adaptable", antonym: "limited", sentence: "The ___ tool could tighten screws, cut wire, and open cans." },
  { word: "vex", definition: "to make someone annoyed or worried", synonym: "irritate", antonym: "soothe", sentence: "The unsolved riddle continued to ___ the whole class." },
  { word: "vigilant", definition: "keeping careful watch for possible danger", synonym: "watchful", antonym: "careless", sentence: "The lifeguard stayed ___ throughout the busy afternoon." },
  { word: "vigorous", definition: "strong, healthy, and full of energy", synonym: "energetic", antonym: "feeble", sentence: "A ___ round of applause greeted the winning team." },
  { word: "vindictive", definition: "having a strong desire for revenge", synonym: "spiteful", antonym: "forgiving", sentence: "His ___ response surprised everyone who knew him as kind." },
  { word: "virtuous", definition: "having high moral standards", synonym: "righteous", antonym: "immoral", sentence: "The story's ___ hero always chose honesty over ease." },
  { word: "volatile", definition: "liable to change rapidly and unpredictably", synonym: "unstable", antonym: "stable", sentence: "The ___ stock market rose and fell within the same hour." },
  { word: "voracious", definition: "having a very eager approach to an activity", synonym: "insatiable", antonym: "moderate", sentence: "She was a ___ reader, finishing three books a week." },
  { word: "waver", definition: "to move indecisively; hesitate", synonym: "hesitate", antonym: "persist", sentence: "His resolve began to ___ as the deadline approached." },
  { word: "whimsical", definition: "playfully quaint or fanciful", synonym: "fanciful", antonym: "serious", sentence: "The film had a ___ charm that delighted younger viewers." },
  { word: "wistful", definition: "having a feeling of vague longing", synonym: "nostalgic", antonym: "content", sentence: "She gave a ___ smile as she looked through the old photographs." },
  { word: "wretched", definition: "in a very unhappy or unfortunate state", synonym: "miserable", antonym: "content", sentence: "The shipwrecked sailors spent a ___ night on the rocks." },
  { word: "yearn", definition: "to have an intense feeling of longing", synonym: "long", antonym: "disdain", sentence: "After months away, he began to ___ for home." },
];

const RANKS = [
  { name: "Rookie", minAttempts: 0, minAccuracy: 0 },
  { name: "Junior Detective", minAttempts: 15, minAccuracy: 50 },
  { name: "Detective", minAttempts: 30, minAccuracy: 62 },
  { name: "Senior Detective", minAttempts: 50, minAccuracy: 72 },
  { name: "Chief Inspector", minAttempts: 80, minAccuracy: 82 },
  { name: "Master Detective", minAttempts: 120, minAccuracy: 90 },
];

const ROUND_LENGTH = 10;
const profileKey = (name) => `wda-progress-${name.toLowerCase().trim()}`;
const DYNAMIC_WORDS_KEY = "wda-dynamic-words";
const GEN_COUNT = 6;
const KID_NAME = "Vishnu";

const PRAISE = [
  "Brilliant deduction, Detective!",
  "Case cracked!",
  "Sharp eyes — nicely spotted!",
  "You nailed it!",
  "Elementary, my dear detective!",
  "Outstanding detective work!",
  "That's a case closed in record time!",
];
const ENCOURAGE = [
  "Good try — here's the clue you needed:",
  "Not quite, but now you'll know it:",
  "Close one! Here's the answer:",
  "Nice attempt — remember this one for next time:",
  "So close! Here's what it means:",
];

function emptyProgress() {
  return {
    xp: 0,
    stats: {},
    casesSolved: 0,
    bestStreak: 0,
    typeStats: { synonym: { correct: 0, total: 0 }, antonym: { correct: 0, total: 0 }, cloze: { correct: 0, total: 0 }, meaning: { correct: 0, total: 0 } },
    sessions: [],
  };
}

// Rank is based on accuracy (efficiency), not raw XP volume — gated by a minimum
// number of attempts so a small lucky streak can't inflate rank early on.
function getRank(progress) {
  const totals = Object.values(progress.typeStats).reduce(
    (acc, t) => ({ correct: acc.correct + t.correct, total: acc.total + t.total }),
    { correct: 0, total: 0 }
  );
  const accuracy = totals.total > 0 ? (totals.correct / totals.total) * 100 : 0;
  let current = RANKS[0];
  for (const r of RANKS) {
    if (totals.total >= r.minAttempts && accuracy >= r.minAccuracy) current = r;
  }
  const idx = RANKS.indexOf(current);
  const next = RANKS[idx + 1] || null;
  return { current: current.name, accuracy: Math.round(accuracy), attempts: totals.total, next };
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickN(pool, n, excludeIdx) {
  const idxs = pool.map((_, i) => i).filter((i) => i !== excludeIdx);
  return shuffle(idxs).slice(0, n);
}

const MODES = {
  synonymAntonym: { label: "Synonyms & Antonyms", icon: Split, types: ["synonym", "antonym"], tagline: "Same word, opposite word — spot the difference.", color: "#22C55E", badge: "🔄" },
  cloze: { label: "Sentence Detective", icon: FileText, types: ["cloze"], tagline: "Find the word that completes the case file.", color: "#FF5A6E", badge: "✏️" },
  meaning: { label: "Word Meanings", icon: BookOpen, types: ["meaningWordToDef", "meaningDefToWord"], tagline: "Match each word to what it really means.", color: "#3FB6F0", badge: "📖" },
  mixed: { label: "Full Investigation", icon: Shuffle, types: ["synonym", "antonym", "cloze", "meaningWordToDef", "meaningDefToWord"], tagline: "Every case type, all mixed together.", color: "#8B5CF6", badge: "🌪️ Hardest" },
};
const REVIEW_TYPES = ["synonym", "antonym", "cloze", "meaningWordToDef", "meaningDefToWord"];
const REVIEW_MODE = { label: "Review Missed Cases", icon: RotateCcw, color: "#FF5A6E" };
const MASTERY_STREAK = 3; // consecutive correct answers needed to call a word "mastered"

function typeCategory(t) {
  if (t === "synonym") return "synonym";
  if (t === "antonym") return "antonym";
  if (t === "cloze") return "cloze";
  return "meaning";
}

function weightedWordOrder(stats, count, pool) {
  const weighted = pool.map((w, idx) => {
    const s = stats[w.word] || { correct: 0, incorrect: 0, seen: 0 };
    const weight = s.seen === 0 ? 6 : (3 * (s.incorrect + 1)) / (s.correct + 1);
    return { idx, weight };
  });
  const chosen = [];
  const poolCopy = [...weighted];
  while (chosen.length < count && poolCopy.length > 0) {
    const total = poolCopy.reduce((sum, p) => sum + p.weight, 0);
    let r = Math.random() * total;
    let pick = 0;
    for (let i = 0; i < poolCopy.length; i++) {
      r -= poolCopy[i].weight;
      if (r <= 0) { pick = i; break; }
    }
    chosen.push(poolCopy[pick].idx);
    poolCopy.splice(pick, 1);
  }
  while (chosen.length < count) chosen.push(Math.floor(Math.random() * pool.length));
  return chosen;
}

function buildQuestion(wordIdx, type, pool) {
  const w = pool[wordIdx];
  const learn = { word: w.word, definition: w.definition, synonym: w.synonym, antonym: w.antonym, sentence: w.sentence };
  if (type === "synonym" || type === "antonym") {
    const field = type;
    const correct = w[field];
    const distractIdx = pickN(pool, 3, wordIdx);
    const distractors = distractIdx.map((i) => pool[i][field]).filter((d) => d !== correct);
    const options = shuffle([correct, ...distractors.slice(0, 3)]);
    return {
      wordIdx, type, learn,
      prompt: `Which word means the ${type === "synonym" ? "SAME" : "OPPOSITE"} as`,
      focus: w.word.toUpperCase(),
      options, correct,
    };
  }
  if (type === "cloze") {
    const distractIdx = pickN(pool, 3, wordIdx);
    const options = shuffle([w.word, ...distractIdx.map((i) => pool[i].word)]);
    return {
      wordIdx, type, learn,
      prompt: "Which word completes the case file?",
      focus: w.sentence.replace("___", "_____"),
      options, correct: w.word,
    };
  }
  if (type === "meaningWordToDef") {
    const distractIdx = pickN(pool, 3, wordIdx);
    const options = shuffle([w.definition, ...distractIdx.map((i) => pool[i].definition)]);
    return {
      wordIdx, type, learn,
      prompt: "What does this word mean?",
      focus: w.word.toUpperCase(),
      options, correct: w.definition,
    };
  }
  const distractIdx = pickN(pool, 3, wordIdx);
  const options = shuffle([w.word, ...distractIdx.map((i) => pool[i].word)]);
  return {
    wordIdx, type, learn,
    prompt: "Which word matches this meaning?",
    focus: `"${w.definition}"`,
    options, correct: w.word,
  };
}

export default function App() {
  const [screen, setScreen] = useState("loading"); // loading | profileSelect | menu | playing | roundEnd | dashboard | admin | masteredWords
  const [currentProfile, setCurrentProfile] = useState(null);
  const [modeKey, setModeKey] = useState(null);
  const [progress, setProgress] = useState(emptyProgress());
  const [dynamicWords, setDynamicWords] = useState([]);
  const [genLoading, setGenLoading] = useState(false);
  const [genMessage, setGenMessage] = useState("");
  const [round, setRound] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [roundXp, setRoundXp] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [dashboardProfile, setDashboardProfile] = useState(null);
  const [dashboardProgress, setDashboardProgress] = useState(null);
  const saveTimer = useRef(null);

  const wordPool = useMemo(() => [...WORDS, ...dynamicWords], [dynamicWords]);

  useEffect(() => {
    setScreen("profileSelect");
    (async () => {
      try {
        const res = await storage.get(DYNAMIC_WORDS_KEY);
        const dyn = res && res.value ? JSON.parse(res.value) : [];
        setDynamicWords(Array.isArray(dyn) ? dyn : []);
      } catch (e) {}
    })();
  }, []);

  async function chooseProfile(name) {
    if (name === "Admin") {
      setCurrentProfile("Admin");
      let prog = emptyProgress();
      try {
        const res = await storage.get(profileKey(KID_NAME));
        if (res && res.value) prog = { ...emptyProgress(), ...JSON.parse(res.value) };
      } catch (e) {}
      setDashboardProfile(KID_NAME);
      setDashboardProgress(prog);
      setGenMessage("");
      setScreen("admin");
      return;
    }
    let prog = emptyProgress();
    try {
      const res = await storage.get(profileKey(name));
      if (res && res.value) prog = { ...emptyProgress(), ...JSON.parse(res.value) };
    } catch (e) {}
    setCurrentProfile(name);
    setProgress(prog);
    setGenMessage("");
    setScreen("menu");
  }

  const persist = useCallback((next) => {
    setProgress(next);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await storage.set(profileKey(currentProfile), JSON.stringify(next));
      } catch (e) {}
    }, 300);
  }, [currentProfile]);

  async function generateWords() {
    if (genLoading) return;
    setGenLoading(true);
    setGenMessage("");
    try {
      const existingNames = wordPool.map((w) => w.word);
      const statsSource = (dashboardProgress && dashboardProgress.stats) || {};
      const weak = Object.entries(statsSource)
        .map(([word, s]) => ({ word, acc: s.seen > 0 ? s.correct / s.seen : 1, seen: s.seen }))
        .filter((s) => s.seen >= 2)
        .sort((a, b) => a.acc - b.acc)
        .slice(0, 6)
        .map((s) => s.word);

      const prompt = `You write vocabulary flashcards for the UK 11+ entrance exam and GL Assessment verbal reasoning test.
Generate exactly ${GEN_COUNT} NEW English vocabulary words at this difficulty level (similar register to words such as "meticulous", "benevolent", "obstinate", "candid").
Do not use any of these words, in any form: ${existingNames.join(", ")}.
${weak.length ? `The learner has struggled with these words: ${weak.join(", ")}. Where it fits naturally, include a couple of new words from a related semantic field or similar register to reinforce that vocabulary, but do not reuse the words themselves.` : ""}
Return ONLY a raw JSON array, no markdown fences, no commentary, of exactly ${GEN_COUNT} objects. Each object must have exactly these keys:
"word": lowercase single word
"definition": a concise dictionary-style definition suitable for an 11-year-old
"synonym": a single close synonym word
"antonym": a single clear antonym word
"sentence": one example sentence using the word's context, with the word itself replaced by exactly "___"`;

      const response = await fetch("/api/generate-words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      const text = (data.content || []).map((b) => b.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      if (!Array.isArray(parsed)) throw new Error("Unexpected response format");

      const existingLower = new Set(wordPool.map((w) => w.word.toLowerCase()));
      const fresh = parsed
        .filter((w) => w && typeof w.word === "string" && typeof w.definition === "string" &&
          typeof w.synonym === "string" && typeof w.antonym === "string" &&
          typeof w.sentence === "string" && w.sentence.includes("___") &&
          !existingLower.has(w.word.toLowerCase().trim()))
        .map((w) => ({
          word: w.word.toLowerCase().trim(),
          definition: w.definition.trim(),
          synonym: w.synonym.trim(),
          antonym: w.antonym.trim(),
          sentence: w.sentence.trim(),
        }));

      if (fresh.length === 0) {
        setGenMessage("Headquarters didn't send anything new that time — give it another try.");
      } else {
        const nextDynamic = [...dynamicWords, ...fresh];
        setDynamicWords(nextDynamic);
        try { await storage.set(DYNAMIC_WORDS_KEY, JSON.stringify(nextDynamic)); } catch (e) {}
        setGenMessage(`${fresh.length} new word${fresh.length > 1 ? "s" : ""} added. The archive now holds ${WORDS.length + nextDynamic.length} words.`);
      }
    } catch (e) {
      setGenMessage("Couldn't reach headquarters. Check your connection and try again.");
    } finally {
      setGenLoading(false);
    }
  }

  function startRound(key) {
    const types = MODES[key].types;
    const order = weightedWordOrder(progress.stats, ROUND_LENGTH, wordPool);
    const built = order.map((idx) => buildQuestion(idx, types[Math.floor(Math.random() * types.length)], wordPool));
    setModeKey(key);
    setRound(built);
    setQIndex(0);
    setQuestion(built[0]);
    setSelected(null);
    setAnswered(false);
    setStreak(0);
    setRoundCorrect(0);
    setRoundXp(0);
    setScreen("playing");
  }

  function startReviewRound() {
    const idxByWord = new Map(wordPool.map((w, i) => [w.word, i]));
    const needsReview = Object.entries(progress.stats)
      .filter(([, s]) => s.incorrect > 0 && (s.streak || 0) < MASTERY_STREAK)
      .sort((a, b) => (a[1].streak || 0) - (b[1].streak || 0) || b[1].incorrect - a[1].incorrect)
      .map(([w]) => idxByWord.get(w))
      .filter((i) => i !== undefined);
    if (needsReview.length === 0) return;
    // If there are fewer weak words than a full round, repeat them so he still gets a proper round of practice.
    const idxs = [];
    while (idxs.length < Math.min(ROUND_LENGTH, needsReview.length * 3) && idxs.length < ROUND_LENGTH) {
      idxs.push(needsReview[idxs.length % needsReview.length]);
    }
    const built = idxs.map((idx) => buildQuestion(idx, REVIEW_TYPES[Math.floor(Math.random() * REVIEW_TYPES.length)], wordPool));
    setModeKey("review");
    setRound(built);
    setQIndex(0);
    setQuestion(built[0]);
    setSelected(null);
    setAnswered(false);
    setStreak(0);
    setRoundCorrect(0);
    setRoundXp(0);
    setScreen("playing");
  }

  function answer(opt) {
    if (answered) return;
    setSelected(opt);
    setAnswered(true);
    const correct = opt === question.correct;
    const w = wordPool[question.wordIdx].word;
    const s = { ...(progress.stats[w] || { correct: 0, incorrect: 0, seen: 0, streak: 0 }) };
    s.seen += 1;
    if (correct) { s.correct += 1; s.streak = (s.streak || 0) + 1; } else { s.incorrect += 1; s.streak = 0; }
    const cat = typeCategory(question.type);
    const prevCat = progress.typeStats[cat] || { correct: 0, total: 0 };
    const newTypeStats = { ...progress.typeStats, [cat]: { correct: prevCat.correct + (correct ? 1 : 0), total: prevCat.total + 1 } };
    const newStreak = correct ? streak + 1 : 0;
    const gained = correct ? 10 + Math.min(newStreak * 2, 20) : 0;
    setStreak(newStreak);
    setFeedbackMsg(correct ? PRAISE[Math.floor(Math.random() * PRAISE.length)] : ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)]);
    if (correct) { setRoundCorrect((c) => c + 1); setRoundXp((x) => x + gained); }
    persist({
      ...progress,
      xp: progress.xp + gained,
      stats: { ...progress.stats, [w]: s },
      casesSolved: progress.casesSolved + (correct ? 1 : 0),
      bestStreak: Math.max(progress.bestStreak, newStreak),
      typeStats: newTypeStats,
    });
  }

  function next() {
    const nextIdx = qIndex + 1;
    if (nextIdx >= round.length) {
      const label = modeKey === "review" ? REVIEW_MODE.label : MODES[modeKey].label;
      const session = { ts: Date.now(), mode: label, correct: roundCorrect, total: round.length, xp: roundXp };
      persist({ ...progress, sessions: [...progress.sessions, session].slice(-30) });
      setScreen("roundEnd");
      return;
    }
    setQIndex(nextIdx);
    setQuestion(round[nextIdx]);
    setSelected(null);
    setAnswered(false);
  }

  async function openDashboard() {
    setDashboardProfile(KID_NAME);
    let prog = emptyProgress();
    try {
      const res = await storage.get(profileKey(KID_NAME));
      if (res && res.value) prog = { ...emptyProgress(), ...JSON.parse(res.value) };
    } catch (e) {}
    setDashboardProgress(prog);
    setScreen("dashboard");
  }

  if (screen === "loading") {
    return (
      <div style={styles.page}>
        <div style={{ ...styles.card, textAlign: "center" }}>
          <p style={{ fontFamily: FONT_DISPLAY, color: INK }}>Opening the case files…</p>
        </div>
      </div>
    );
  }

  const rank = getRank(progress);

  return (
    <div style={styles.page}>
      <FontLoader />
      <div style={styles.container}>
        {screen !== "profileSelect" && screen !== "admin" && (
          <Header
            progress={progress}
            rank={rank}
            profileName={currentProfile}
            onSwitchProfile={() => setScreen("profileSelect")}
            onDashboard={openDashboard}
          />
        )}
        {screen === "profileSelect" && <ProfileSelect onChoose={chooseProfile} />}
        {screen === "menu" && (
          <MenuScreen
            onStart={startRound}
            onReview={startReviewRound}
            onBrowseMastered={() => setScreen("masteredWords")}
            progress={progress}
            poolSize={wordPool.length}
            profileName={currentProfile}
          />
        )}
        {screen === "masteredWords" && (
          <MasteredWordsScreen
            progress={progress}
            wordPool={wordPool}
            onBack={() => setScreen("menu")}
          />
        )}
        {screen === "playing" && question && (
          <PlayScreen
            question={question}
            qIndex={qIndex}
            total={round.length}
            selected={selected}
            answered={answered}
            streak={streak}
            feedbackMsg={feedbackMsg}
            onAnswer={answer}
            onNext={next}
            modeLabel={modeKey === "review" ? REVIEW_MODE.label : MODES[modeKey].label}
          />
        )}
        {screen === "roundEnd" && (
          <RoundEndScreen
            correct={roundCorrect}
            total={round.length}
            xpGained={roundXp}
            onReplay={() => (modeKey === "review" ? startReviewRound() : startRound(modeKey))}
            onMenu={() => setScreen("menu")}
          />
        )}
        {screen === "dashboard" && dashboardProgress && (
          <DashboardScreen
            profiles={[KID_NAME]}
            profileName={dashboardProfile}
            progress={dashboardProgress}
            onSelectProfile={() => {}}
            onBack={() => setScreen(currentProfile === KID_NAME ? "menu" : "profileSelect")}
          />
        )}
        {screen === "admin" && dashboardProgress && (
          <AdminScreen
            progress={dashboardProgress}
            poolSize={wordPool.length}
            onGenerate={generateWords}
            genLoading={genLoading}
            genMessage={genMessage}
            onBack={() => setScreen("profileSelect")}
          />
        )}
      </div>
    </div>
  );
}

function FontLoader() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Baloo+2:wght@500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');
      @keyframes stampIn {
        0% { opacity: 0; transform: scale(1.6) rotate(-12deg); }
        60% { opacity: 1; transform: scale(0.92) rotate(-12deg); }
        100% { opacity: 1; transform: scale(1) rotate(-12deg); }
      }
      @keyframes riseIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(170px) rotate(360deg); opacity: 0; }
      }
      .stamp { animation: stampIn 0.35s ease-out; }
      .rise { animation: riseIn 0.3s ease-out; }
      .spin { animation: spin 1s linear infinite; }
      @media (prefers-reduced-motion: reduce) {
        .stamp, .rise { animation: none; }
        .spin { animation: spin 1.4s linear infinite; }
      }
      @media (prefers-reduced-motion: reduce) {
        [style*="confettiFall"] { animation: none !important; opacity: 0 !important; }
      }
      .opt-btn:focus-visible { outline: 3px solid #C9A227; outline-offset: 2px; }
      .case-btn:focus-visible { outline: 3px solid #C9A227; outline-offset: 2px; }
      .link-btn:focus-visible { outline: 2px solid #C9A227; outline-offset: 2px; }
      .gen-btn:focus-visible { outline: 3px solid #C9A227; outline-offset: 2px; }
      .gen-btn:disabled { opacity: 0.7; cursor: default; }
    `}</style>
  );
}

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const INK = "#231A4D";
const PAPER = "#FFF8EC";
const GOLD = "#FFC93C";
const RUST = "#FF5A6E";
const PINE = "#22C55E";
const SKY = "#3FB6F0";
const GRAPE = "#8B5CF6";
const FONT_DISPLAY = "'Special Elite', 'Courier New', monospace";
const FONT_FUN = "'Baloo 2', 'Special Elite', system-ui, sans-serif";
const FONT_BODY = "'Inter', system-ui, sans-serif";

const RANK_EMOJI = {
  "Rookie": "🐣",
  "Junior Detective": "🔍",
  "Detective": "🕵️",
  "Senior Detective": "🎖️",
  "Chief Inspector": "👮",
  "Master Detective": "🏆",
};

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#241755",
    backgroundImage: `radial-gradient(circle at 12% 18%, rgba(255,255,255,0.22) 1.5px, transparent 1.5px), radial-gradient(circle at 68% 78%, rgba(255,255,255,0.16) 1.5px, transparent 1.5px), radial-gradient(circle at 85% 20%, rgba(255,255,255,0.14) 1px, transparent 1px), radial-gradient(circle at 30% 55%, #8B5CF6 0%, #4C2A9E 40%, #1c1140 100%)`,
    backgroundSize: "46px 46px, 64px 64px, 38px 38px, cover",
    backgroundRepeat: "repeat, repeat, repeat, no-repeat",
    padding: "20px 14px 40px",
    fontFamily: FONT_BODY,
  },
  container: { maxWidth: 640, margin: "0 auto" },
  card: {
    background: PAPER,
    borderRadius: 14,
    padding: 24,
    boxShadow: "0 14px 30px rgba(0,0,0,0.35)",
  },
};

function Header({ progress, rank, profileName, onSwitchProfile, onDashboard }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: GOLD }}>
        <span style={{ fontSize: 18 }}>✨</span>
        <Search size={22} />
        <h1 style={{ fontFamily: FONT_FUN, fontWeight: 700, fontSize: 21, letterSpacing: 0.3, margin: 0, color: "#FFF6E9" }}>
          THE WORD DETECTIVE AGENCY
        </h1>
        <span style={{ fontSize: 18 }}>✨</span>
      </div>
      <p style={{ color: "#C9BEEE", fontSize: 12.5, marginTop: 4, letterSpacing: 0.4 }}>
        CASE FILE · 11+ VOCABULARY INVESTIGATION {profileName ? `· Detective ${profileName}` : ""}
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
        <Pill icon={<Award size={14} />} text={`${RANK_EMOJI[rank.current] || ""} ${rank.current}`} />
        <Pill icon={<Star size={14} />} text={`${progress.xp} XP`} />
        <Pill icon={<FileText size={14} />} text={`${progress.casesSolved} solved`} />
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 10 }}>
        <button className="link-btn" onClick={onDashboard} style={linkBtnStyle}><BarChart3 size={13} /> Progress dashboard</button>
        <button className="link-btn" onClick={onSwitchProfile} style={linkBtnStyle}><Users size={13} /> Switch player</button>
      </div>
    </div>
  );
}

const linkBtnStyle = {
  background: "none", border: "none", color: "#9DA9C7", fontSize: 12, cursor: "pointer",
  display: "flex", alignItems: "center", gap: 5, textDecoration: "underline", padding: 0,
};

function Pill({ icon, text }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6, background: "rgba(255,201,60,0.16)",
      border: `1px solid ${GOLD}66`, color: GOLD, padding: "4px 10px", borderRadius: 999, fontSize: 12.5, fontWeight: 600,
    }}>
      {icon}{text}
    </div>
  );
}

function ProfileSelect({ onChoose }) {
  return (
    <div className="rise">
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: GOLD }}>
          <span style={{ fontSize: 18 }}>✨</span>
          <Search size={22} />
          <h1 style={{ fontFamily: FONT_FUN, fontWeight: 700, fontSize: 21, letterSpacing: 0.3, margin: 0, color: "#FFF6E9" }}>
            THE WORD DETECTIVE AGENCY
          </h1>
          <span style={{ fontSize: 18 }}>✨</span>
        </div>
        <p style={{ color: "#C9BEEE", fontSize: 13, marginTop: 6 }}>Who's on the case today? 🔎</p>
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        <button className="case-btn" onClick={() => onChoose(KID_NAME)} style={{
          display: "flex", alignItems: "center", gap: 16, textAlign: "left", background: PAPER,
          border: "none", borderRadius: 16, padding: "20px 20px", cursor: "pointer", position: "relative",
          boxShadow: "0 10px 26px rgba(0,0,0,0.32)",
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%", background: `linear-gradient(135deg, ${GOLD}, #FF9F45)`,
            color: INK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0,
            boxShadow: "0 4px 12px rgba(255,201,60,0.55)",
          }}>
            🕵️
          </div>
          <div>
            <div style={{ fontFamily: FONT_FUN, fontWeight: 700, color: INK, fontSize: 20 }}>{KID_NAME}</div>
            <div style={{ color: "#5b6a8f", fontSize: 13, marginTop: 2 }}>Tap in and start investigating! 🚀</div>
          </div>
          <span style={{ position: "absolute", top: 10, right: 14, fontSize: 18 }}>🌟</span>
        </button>

        <button className="case-btn" onClick={() => onChoose("Admin")} style={{
          display: "flex", alignItems: "center", gap: 16, textAlign: "left", background: "rgba(255,248,236,0.9)",
          border: "none", borderRadius: 14, padding: "16px 20px", cursor: "pointer",
          boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: "50%", background: INK, color: GOLD,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Shield size={19} />
          </div>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, color: INK, fontSize: 15.5 }}>Admin</div>
            <div style={{ color: "#5b6a8f", fontSize: 12 }}>Manage the archive & track progress</div>
          </div>
        </button>
      </div>
    </div>
  );
}

function MenuScreen({ onStart, onReview, onBrowseMastered, progress, poolSize, profileName }) {
  const totalSeen = Object.keys(progress.stats).length;
  const needsReview = Object.values(progress.stats).filter((s) => s.incorrect > 0 && (s.streak || 0) < MASTERY_STREAK).length;
  const mastered = Object.values(progress.stats).filter((s) => (s.streak || 0) >= MASTERY_STREAK).length;
  return (
    <div className="rise">
      <div style={{ ...styles.card, marginBottom: 16, textAlign: "center" }}>
        <p style={{ margin: 0, color: INK, fontSize: 19, fontWeight: 700, fontFamily: FONT_FUN }}>
          Hey Detective {profileName}! 👋
        </p>
        <p style={{ margin: "6px 0 0", color: "#5b6a8f", fontSize: 13.5, lineHeight: 1.5 }}>
          Every round is <strong>10 cases</strong>. Pick a case type below to start cracking them!
        </p>
        {totalSeen > 0 && (
          <p style={{ margin: "8px 0 0", color: "#5b6a8f", fontSize: 12 }}>
            🔎 {totalSeen} of {poolSize} words investigated{mastered > 0 ? ` · 🏅 ${mastered} mastered` : ""}
          </p>
        )}
      </div>

      {needsReview > 0 && (
        <button className="case-btn" onClick={onReview} style={{
          display: "flex", alignItems: "center", gap: 14, textAlign: "left", position: "relative",
          width: "100%", background: "#fff", border: `2px dashed ${RUST}`, borderRadius: 12, padding: "16px 18px",
          cursor: "pointer", marginBottom: 12, boxShadow: "0 8px 18px rgba(0,0,0,0.2)",
        }}>
          <div style={{
            width: 46, height: 46, borderRadius: 10, background: RUST, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <RotateCcw size={21} />
          </div>
          <div>
            <div style={{ fontFamily: FONT_FUN, fontWeight: 700, color: INK, fontSize: 17 }}>Review Missed Cases 🔁</div>
            <div style={{ color: "#5b6a8f", fontSize: 12.5, marginTop: 2 }}>
              {needsReview} word{needsReview > 1 ? "s" : ""} need{needsReview === 1 ? "s" : ""} another look — let's lock them in!
            </div>
          </div>
        </button>
      )}

      {mastered > 0 && (
        <button className="case-btn" onClick={onBrowseMastered} style={{
          display: "flex", alignItems: "center", gap: 14, textAlign: "left", position: "relative",
          width: "100%", background: "#fff", border: `2px solid ${PINE}`, borderRadius: 12, padding: "16px 18px",
          cursor: "pointer", marginBottom: 12, boxShadow: "0 8px 18px rgba(0,0,0,0.2)",
        }}>
          <div style={{
            width: 46, height: 46, borderRadius: 10, background: PINE, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <BookOpen size={21} />
          </div>
          <div>
            <div style={{ fontFamily: FONT_FUN, fontWeight: 700, color: INK, fontSize: 17 }}>Browse Mastered Words 📚</div>
            <div style={{ color: "#5b6a8f", fontSize: 12.5, marginTop: 2 }}>
              {mastered} word{mastered > 1 ? "s" : ""} locked in — tap any word to refresh your memory!
            </div>
          </div>
        </button>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {Object.entries(MODES).map(([key, m]) => {
          const Icon = m.icon;
          return (
            <button key={key} className="case-btn" onClick={() => onStart(key)} style={{
              display: "flex", alignItems: "center", gap: 14, textAlign: "left", position: "relative",
              background: PAPER, border: "none", borderRadius: 12, padding: "17px 18px",
              cursor: "pointer", boxShadow: "0 8px 18px rgba(0,0,0,0.28)",
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: 10, background: m.color, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Icon size={21} />
              </div>
              <div>
                <div style={{ fontFamily: FONT_FUN, fontWeight: 700, color: INK, fontSize: 17 }}>{m.label}</div>
                <div style={{ color: "#5b6a8f", fontSize: 12.5, marginTop: 2 }}>{m.tagline}</div>
              </div>
              {m.badge && (
                <span style={{
                  position: "absolute", top: 10, right: 12, fontSize: 12, fontWeight: 700,
                  color: INK, background: "rgba(255,201,60,0.35)", padding: "3px 9px", borderRadius: 999,
                }}>
                  {m.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MasteredWordsScreen({ progress, wordPool, onBack }) {
  const [openWord, setOpenWord] = useState(null);
  const byWord = new Map(wordPool.map((w) => [w.word, w]));
  const masteredList = Object.entries(progress.stats)
    .filter(([, s]) => (s.streak || 0) >= MASTERY_STREAK)
    .map(([word]) => byWord.get(word))
    .filter(Boolean)
    .sort((a, b) => a.word.localeCompare(b.word));

  return (
    <div className="rise">
      <button className="link-btn" onClick={onBack} style={{ ...linkBtnStyle, marginBottom: 14 }}>
        <ArrowLeft size={13} /> Back to case board
      </button>

      <div style={{ ...styles.card, marginBottom: 16 }}>
        <p style={{ margin: 0, color: INK, fontSize: 18, fontWeight: 700, fontFamily: FONT_FUN }}>
          📚 Mastered Words
        </p>
        <p style={{ margin: "6px 0 0", color: "#5b6a8f", fontSize: 13, lineHeight: 1.5 }}>
          {masteredList.length} word{masteredList.length === 1 ? "" : "s"} locked in memory. Tap any word to peek at its meaning again, just in case it's gone fuzzy!
        </p>
      </div>

      {masteredList.length === 0 && (
        <p style={{ color: "#9DA9C7", fontSize: 13.5, textAlign: "center" }}>No mastered words yet — keep investigating!</p>
      )}

      <div style={{ display: "grid", gap: 10 }}>
        {masteredList.map((w) => {
          const isOpen = openWord === w.word;
          return (
            <div key={w.word} style={{ background: PAPER, borderRadius: 10, boxShadow: "0 6px 14px rgba(0,0,0,0.22)", overflow: "hidden" }}>
              <button
                className="case-btn"
                onClick={() => setOpenWord(isOpen ? null : w.word)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  textAlign: "left", background: "transparent", border: "none", padding: "14px 16px", cursor: "pointer",
                }}
              >
                <span style={{ fontFamily: FONT_FUN, fontWeight: 700, color: INK, fontSize: 15.5 }}>
                  🏅 {w.word}
                </span>
                <span style={{ color: "#5b6a8f", fontSize: 18, transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}>›</span>
              </button>
              {isOpen && (
                <div className="rise" style={{ padding: "0 16px 16px", borderTop: `2px dashed ${INK}22` }}>
                  <p style={{ margin: "12px 0 8px", fontSize: 13.5, color: "#3d4a6b", lineHeight: 1.45 }}>{w.definition}</p>
                  <p style={{ margin: "0 0 10px", fontSize: 13, color: "#5b6a8f", fontStyle: "italic", lineHeight: 1.45 }}>
                    "{w.sentence.replace("___", w.word)}"
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, background: "rgba(34,197,94,0.13)", color: PINE, padding: "3px 10px", borderRadius: 999, fontWeight: 600 }}>
                      means: {w.synonym}
                    </span>
                    <span style={{ fontSize: 12, background: "rgba(255,90,110,0.13)", color: RUST, padding: "3px 10px", borderRadius: 999, fontWeight: 600 }}>
                      opposite: {w.antonym}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Confetti() {
  const pieces = useMemo(() => {
    const colors = [GOLD, PINE, RUST, "#4C7BD9", "#E0B83C"];
    return Array.from({ length: 18 }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.25,
      duration: 0.7 + Math.random() * 0.6,
      rotate: Math.random() * 360,
      color: colors[i % colors.length],
    }));
  }, []);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", borderRadius: 10 }}>
      {pieces.map((p, i) => (
        <span key={i} style={{
          position: "absolute", top: -10, left: `${p.left}%`, width: 6, height: 11,
          background: p.color, borderRadius: 2,
          transform: `rotate(${p.rotate}deg)`,
          animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
        }} />
      ))}
    </div>
  );
}

function PlayScreen({ question, qIndex, total, selected, answered, streak, feedbackMsg, onAnswer, onNext, modeLabel }) {
  const isCorrectAnswer = answered && selected === question.correct;
  return (
    <div className="rise">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, padding: "0 4px" }}>
        <span style={{ color: "#9DA9C7", fontSize: 12, fontFamily: FONT_DISPLAY }}>{modeLabel} · CASE {qIndex + 1}/{total}</span>
        {streak > 1 && (
          <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#FFB84D", fontSize: 12.5, fontWeight: 700 }}>
            <Flame size={14} /> {streak} streak
          </span>
        )}
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 14, padding: "0 4px" }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i < qIndex ? GOLD : i === qIndex ? "#F4ECD8" : "rgba(255,255,255,0.15)",
          }} />
        ))}
      </div>

      <div style={{ ...styles.card, position: "relative" }}>
        {isCorrectAnswer && <Confetti key={qIndex} />}
        <div style={{
          position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)",
          width: 16, height: 16, borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, #e8e8e8, #8a8a8a 70%)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
        }} />
        <p style={{ margin: 0, color: "#5b6a8f", fontSize: 13, fontWeight: 600 }}>{question.prompt}</p>
        <p style={{
          fontFamily: question.type === "cloze" || question.type === "meaningDefToWord" ? FONT_BODY : FONT_FUN,
          fontWeight: question.type === "cloze" || question.type === "meaningDefToWord" ? 400 : 700,
          fontSize: question.type === "cloze" || question.type === "meaningDefToWord" ? 17 : 25,
          fontStyle: question.type === "meaningDefToWord" ? "italic" : "normal",
          color: INK, margin: "8px 0 18px", lineHeight: 1.4,
        }}>
          {question.focus}
        </p>

        <div style={{ display: "grid", gap: 10 }}>
          {question.options.map((opt) => {
            const isCorrect = opt === question.correct;
            const isSelected = opt === selected;
            let bg = "#fff", border = "#d8cfb5", color = INK;
            if (answered && isCorrect) { bg = "#e7f3ec"; border = PINE; color = PINE; }
            else if (answered && isSelected && !isCorrect) { bg = "#f7e6e6"; border = RUST; color = RUST; }
            return (
              <button key={opt} className="opt-btn" disabled={answered} onClick={() => onAnswer(opt)} style={{
                textAlign: "left", padding: "13px 14px", borderRadius: 8, border: `2px solid ${border}`,
                background: bg, color, fontSize: 15, fontWeight: 500, cursor: answered ? "default" : "pointer",
                fontFamily: FONT_BODY,
              }}>
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="stamp" style={{
            marginTop: 16, display: "inline-block", border: `3px solid ${isCorrectAnswer ? PINE : RUST}`,
            color: isCorrectAnswer ? PINE : RUST, padding: "4px 12px", borderRadius: 6,
            fontFamily: FONT_DISPLAY, fontSize: 13, transform: "rotate(-6deg)",
          }}>
            {isCorrectAnswer ? "✅ CASE SOLVED" : "🔎 KEEP INVESTIGATING"}
          </div>
        )}

        {answered && feedbackMsg && (
          <p style={{ margin: "10px 0 0", fontSize: 13.5, fontWeight: 700, color: isCorrectAnswer ? PINE : INK }}>
            {isCorrectAnswer ? "🎉 " : "💡 "}{feedbackMsg}
          </p>
        )}
      </div>

      {answered && (
        <div className="rise" style={{
          marginTop: 12, background: "#fff", border: `2px dashed ${INK}33`, borderRadius: 10, padding: 14,
        }}>
          <p style={{ margin: "0 0 8px", fontFamily: FONT_DISPLAY, fontSize: 11.5, color: INK, textTransform: "uppercase", letterSpacing: 0.6 }}>
            📓 Detective's Notebook
          </p>
          <p style={{ margin: "0 0 5px", fontSize: 17, color: INK, fontWeight: 700, fontFamily: FONT_FUN }}>{question.learn.word.toUpperCase()}</p>
          <p style={{ margin: "0 0 8px", fontSize: 13.5, color: "#3d4a6b", lineHeight: 1.45 }}>{question.learn.definition}</p>
          <p style={{ margin: "0 0 10px", fontSize: 13, color: "#5b6a8f", fontStyle: "italic", lineHeight: 1.45 }}>
            "{question.learn.sentence.replace("___", question.learn.word)}"
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, background: "rgba(34,197,94,0.13)", color: PINE, padding: "3px 10px", borderRadius: 999, fontWeight: 600 }}>
              means: {question.learn.synonym}
            </span>
            <span style={{ fontSize: 12, background: "rgba(255,90,110,0.13)", color: RUST, padding: "3px 10px", borderRadius: 999, fontWeight: 600 }}>
              opposite: {question.learn.antonym}
            </span>
          </div>
        </div>
      )}

      {answered && (
        <button onClick={onNext} style={{
          marginTop: 14, width: "100%", padding: "13px 0", borderRadius: 8, border: "none",
          background: GOLD, color: INK, fontWeight: 700, fontSize: 15, display: "flex",
          alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer",
        }}>
          {qIndex + 1 >= total ? "See results" : "Next case"} <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}

function RoundEndScreen({ correct, total, xpGained, onReplay, onMenu }) {
  const pct = Math.round((correct / total) * 100);
  const emoji = pct === 100 ? "🏆" : pct >= 70 ? "🎉" : pct >= 40 ? "💪" : "🔎";
  const msg = pct === 100 ? "Flawless investigation!" : pct >= 70 ? "Strong detective work." : pct >= 40 ? "Good progress — a few clues got away." : "Tricky case. Worth another look.";
  return (
    <div className="rise" style={{ ...styles.card, textAlign: "center" }}>
      <div style={{ fontSize: 46, marginBottom: 4 }}>{emoji}</div>
      <h2 style={{ fontFamily: FONT_FUN, fontWeight: 700, color: INK, fontSize: 21, margin: "0 0 4px" }}>Case File Closed</h2>
      <p style={{ color: "#5b6a8f", margin: "0 0 18px", fontSize: 13.5 }}>{msg}</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 20 }}>
        <Stat label="Solved" value={`${correct}/${total}`} />
        <Stat label="XP earned" value={`+${xpGained}`} />
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        <button onClick={onReplay} style={{
          padding: "12px 0", borderRadius: 8, border: "none", background: INK, color: GOLD,
          fontWeight: 700, fontSize: 14.5, cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", gap: 8,
        }}>
          <RotateCcw size={16} /> Investigate another round
        </button>
        <button onClick={onMenu} style={{
          padding: "12px 0", borderRadius: 8, border: `2px solid ${INK}`, background: "transparent",
          color: INK, fontWeight: 700, fontSize: 14.5, cursor: "pointer",
        }}>
          Back to case board
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: INK }}>{value}</div>
      <div style={{ fontSize: 11.5, color: "#5b6a8f", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
    </div>
  );
}

const CATEGORY_LABELS = { synonym: "Synonyms", antonym: "Antonyms", cloze: "Sentence context", meaning: "Word meanings" };

function DashboardScreen({ profiles, profileName, progress, onSelectProfile, onBack }) {
  const rank = getRank(progress);
  const overallTotal = Object.values(progress.typeStats).reduce((s, t) => s + t.total, 0);
  const overallCorrect = Object.values(progress.typeStats).reduce((s, t) => s + t.correct, 0);
  const overallPct = overallTotal > 0 ? Math.round((overallCorrect / overallTotal) * 100) : 0;

  const mistakeWords = Object.entries(progress.stats)
    .map(([word, s]) => ({ word, ...s, streak: s.streak || 0 }))
    .filter((s) => s.incorrect > 0);
  const needsReview = mistakeWords
    .filter((s) => s.streak < MASTERY_STREAK)
    .sort((a, b) => a.streak - b.streak || b.incorrect - a.incorrect)
    .slice(0, 8);
  const masteredWords = mistakeWords
    .filter((s) => s.streak >= MASTERY_STREAK)
    .slice(0, 8);

  const recentSessions = [...progress.sessions].reverse().slice(0, 8);

  return (
    <div className="rise">
      <button className="link-btn" onClick={onBack} style={{ ...linkBtnStyle, marginBottom: 14 }}>
        <ArrowLeft size={13} /> Back
      </button>

      {profiles.length > 1 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          {profiles.map((p) => (
            <button key={p} onClick={() => onSelectProfile(p)} style={{
              padding: "6px 12px", borderRadius: 999, border: `1px solid ${p === profileName ? GOLD : "rgba(255,255,255,0.25)"}`,
              background: p === profileName ? "rgba(255,201,60,0.18)" : "transparent",
              color: p === profileName ? GOLD : "#9DA9C7", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
            }}>
              {p}
            </button>
          ))}
        </div>
      )}

      <div style={{ ...styles.card, marginBottom: 14 }}>
        <h2 style={{ fontFamily: FONT_DISPLAY, color: INK, fontSize: 18, margin: "0 0 2px" }}>{profileName}'s progress</h2>
        <p style={{ color: "#5b6a8f", fontSize: 12.5, margin: "0 0 6px" }}>{RANK_EMOJI[rank.current] || ""} {rank.current} · {progress.xp} XP · {progress.casesSolved} cases solved</p>
        <p style={{ color: "#5b6a8f", fontSize: 11.5, margin: "0 0 16px" }}>
          Rank is based on accuracy, not XP volume — currently {rank.accuracy}% correct across {rank.attempts} answered.
          {rank.next && ` Next rank (${rank.next.name}) needs ${rank.next.minAccuracy}%+ accuracy over at least ${rank.next.minAttempts} answers.`}
        </p>

        <div style={{ display: "flex", gap: 20, marginBottom: 18 }}>
          <Stat label="Overall accuracy" value={overallTotal > 0 ? `${overallPct}%` : "—"} />
          <Stat label="Best streak" value={progress.bestStreak} />
          <Stat label="Rounds played" value={progress.sessions.length} />
        </div>

        <p style={{ color: "#5b6a8f", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 10px" }}>Accuracy by skill</p>
        <div style={{ display: "grid", gap: 10, marginBottom: 4 }}>
          {Object.entries(progress.typeStats).map(([cat, s]) => {
            const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : null;
            return (
              <div key={cat}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: INK, marginBottom: 3 }}>
                  <span>{CATEGORY_LABELS[cat]}</span>
                  <span style={{ color: "#5b6a8f" }}>{pct === null ? "not tried yet" : `${pct}% (${s.correct}/${s.total})`}</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "#e6ddc4", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct || 0}%`, background: pct === null ? "transparent" : pct >= 70 ? PINE : pct >= 40 ? GOLD : RUST, borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {(needsReview.length > 0 || masteredWords.length > 0) && (
        <div style={{ ...styles.card, marginBottom: 14 }}>
          <p style={{ color: "#5b6a8f", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 4px" }}>Mastery tracker</p>
          <p style={{ color: "#5b6a8f", fontSize: 12, margin: "0 0 12px", lineHeight: 1.4 }}>
            A word counts as mastered once it's answered correctly {MASTERY_STREAK} times in a row — that's how we know it's stuck.
          </p>
          {needsReview.length > 0 && (
            <div style={{ marginBottom: masteredWords.length > 0 ? 16 : 0 }}>
              <p style={{ color: RUST, fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, margin: "0 0 8px" }}>Still needs review</p>
              <div style={{ display: "grid", gap: 8 }}>
                {needsReview.map((w) => (
                  <div key={w.word} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, color: INK }}>
                    <span style={{ fontWeight: 600 }}>{w.word}</span>
                    <span style={{ color: "#5b6a8f" }}>{w.streak}/{MASTERY_STREAK} correct in a row</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {masteredWords.length > 0 && (
            <div>
              <p style={{ color: PINE, fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, margin: "0 0 8px" }}>Locked in memory ✓</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {masteredWords.map((w) => (
                  <span key={w.word} style={{ fontSize: 12.5, fontWeight: 600, color: PINE, background: "rgba(34,197,94,0.13)", padding: "3px 10px", borderRadius: 999 }}>
                    {w.word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ ...styles.card }}>
        <p style={{ color: "#5b6a8f", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 10px" }}>Recent rounds</p>
        {recentSessions.length === 0 && <p style={{ color: "#5b6a8f", fontSize: 13 }}>No rounds played yet.</p>}
        <div style={{ display: "grid", gap: 8 }}>
          {recentSessions.map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: INK }}>
              <span>{new Date(s.ts).toLocaleDateString(undefined, { month: "short", day: "numeric" })} · {s.mode}</span>
              <span style={{ color: "#5b6a8f" }}>{s.correct}/{s.total} · +{s.xp} XP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminScreen({ progress, poolSize, onGenerate, genLoading, genMessage, onBack }) {
  return (
    <div className="rise">
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: GOLD }}>
          <Shield size={20} />
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 19, letterSpacing: 1, margin: 0, color: "#F4ECD8" }}>
            ADMIN PANEL
          </h1>
        </div>
        <p style={{ color: "#9DA9C7", fontSize: 12.5, marginTop: 4 }}>
          Manage the case archive & track {KID_NAME}'s progress
        </p>
      </div>

      <div style={{ ...styles.card, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 8, background: INK, color: GOLD,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Sparkles size={18} className={genLoading ? "spin" : ""} />
          </div>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, color: INK, fontSize: 15 }}>Word archive</div>
            <div style={{ color: "#5b6a8f", fontSize: 12 }}>{poolSize} words available to {KID_NAME}</div>
          </div>
        </div>
        <p style={{ margin: "0 0 12px", color: INK, fontSize: 13, lineHeight: 1.45 }}>
          Request {GEN_COUNT} new 11+ level words, chosen to reinforce whatever {KID_NAME} has found trickiest.
        </p>
        <button
          className="gen-btn"
          onClick={onGenerate}
          disabled={genLoading}
          style={{
            width: "100%", padding: "11px 0", borderRadius: 8, border: "none",
            background: GOLD, color: INK, fontWeight: 700, fontSize: 14, cursor: genLoading ? "default" : "pointer",
          }}
        >
          {genLoading ? "Contacting headquarters…" : "Request new words"}
        </button>
        {genMessage && (
          <p style={{ margin: "10px 0 0", color: "#5b6a8f", fontSize: 12.5, lineHeight: 1.4 }}>{genMessage}</p>
        )}
      </div>

      <LegacyImportPanel />

      <DashboardScreen
        profiles={[KID_NAME]}
        profileName={KID_NAME}
        progress={progress}
        onSelectProfile={() => {}}
        onBack={onBack}
      />
    </div>
  );
}

function LegacyImportPanel() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function runImport() {
    setBusy(true);
    setStatus("");
    try {
      const parsed = JSON.parse(text.trim());
      const keys = Object.keys(parsed);
      if (keys.length === 0) throw new Error("No keys found in pasted text.");
      let written = 0;
      for (const k of keys) {
        if (parsed[k] === null || parsed[k] === undefined) continue;
        await storage.set(k, parsed[k]);
        written += 1;
      }
      setStatus(`✅ Imported ${written} record${written === 1 ? "" : "s"}. Switch to ${KID_NAME}'s profile to confirm progress shows up.`);
      setText("");
    } catch (e) {
      setStatus(`❌ Couldn't import: ${e.message}. Make sure you pasted the full text from the export bookmarklet.`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ ...styles.card, marginBottom: 14 }}>
      <div style={{ fontFamily: FONT_DISPLAY, color: INK, fontSize: 15, marginBottom: 6 }}>
        One-time: import old progress
      </div>
      <p style={{ margin: "0 0 10px", color: "#5b6a8f", fontSize: 12.5, lineHeight: 1.4 }}>
        Paste the text copied from the export bookmarklet (run on the old Claude artifact link), then tap Import.
        You only need to do this once. Safe to delete this panel afterward.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Paste the {"wda-progress-vishnu": ...} text here'
        rows={4}
        style={{
          width: "100%", padding: 10, borderRadius: 8, border: "2px solid #d8cfb5",
          fontSize: 12.5, fontFamily: "monospace", marginBottom: 10, boxSizing: "border-box",
        }}
      />
      <button
        onClick={runImport}
        disabled={busy || !text.trim()}
        style={{
          width: "100%", padding: "10px 0", borderRadius: 8, border: "none",
          background: busy || !text.trim() ? "#c9c2a8" : GOLD, color: INK, fontWeight: 700,
          fontSize: 13.5, cursor: busy || !text.trim() ? "default" : "pointer",
        }}
      >
        {busy ? "Importing…" : "Import"}
      </button>
      {status && <p style={{ margin: "10px 0 0", fontSize: 12.5, color: INK, lineHeight: 1.4 }}>{status}</p>}
    </div>
  );
}
