import { useState, useEffect, useMemo } from "react";

const ENERGY_LEVELS = [
  { id: "empty", icon: "🌑", label: "Empty", desc: "Running on fumes, barely here" },
  { id: "low", icon: "🌒", label: "Low", desc: "Tired, ready to surrender to rest" },
  { id: "balanced", icon: "🌓", label: "Balanced", desc: "Gently winding, somewhere in between" },
  { id: "wired", icon: "🌔", label: "Wired", desc: "Mind still spinning its stories" },
  { id: "buzzing", icon: "🌕", label: "Buzzing", desc: "Can't seem to find the ground" },
];

const TIME_OPTIONS = [
  { id: "5", label: "5", unit: "min", sub: "A breath of stillness" },
  { id: "15", label: "15", unit: "min", sub: "A soft pause" },
  { id: "30", label: "30", unit: "min", sub: "A proper ritual" },
  { id: "45", label: "45+", unit: "min", sub: "Full ceremony" },
];

const MOON_CYCLE = ["🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘"];

// ─── Local ritual library ───────────────────────────────────────────────────
const RITUALS = {
  empty: {
    "5":  {
      routine_title: "Soft Landing",
      greeting: "You made it through. That alone is enough — you don't need to earn rest tonight, you just need to receive it.",
      steps: [
        { duration: "2 min", title: "Release Breath", description: "Lie down or sit wherever you are. Take three slow exhales, longer than the inhale. Let your body know the day is over and it's safe to put everything down.", intention: "I do not have to carry this into tomorrow." },
        { duration: "3 min", title: "One Small Kindness", description: "Place a hand on your heart. Think of one tiny thing you did today that required something of you — showing up, making a meal, staying soft when it was hard. Let that be enough.", intention: "Even fumes are a form of fuel." },
      ],
      reflection_prompts: [
        "What is one thing your body is asking for right now — just for tonight?",
        "What small act of yours today went unseen but still mattered?",
        "What does tomorrow need from you that tonight does not?",
      ],
      closing_affirmation: "You are not behind. You are exactly in the middle of becoming. Rest is not a reward for doing enough — it is how the creative in you refills.",
    },
    "15": {
      routine_title: "Ember & Rest",
      greeting: "Even the most tended fire needs to breathe down to embers sometimes. Tonight you don't tend — you simply are.",
      steps: [
        { duration: "4 min", title: "Body Scan", description: "Lie down. Start at your feet and slowly move your awareness upward, noticing without fixing. This is the artist's first skill — observation without judgment.", intention: "I notice. I do not need to change." },
        { duration: "5 min", title: "Warm Drink & Stillness", description: "Make something warm — tea, water with lemon, anything. Hold the mug with both hands and let the warmth travel in. No phone. Just heat, hands, and quiet.", intention: "I nourish myself like I nourish those I love." },
        { duration: "6 min", title: "Drift Writing", description: "Open a notebook and write without lifting the pen for five minutes. Not journaling — just whatever words come. Nonsense is welcome. This empties the tank gently.", intention: "The page holds what I cannot." },
      ],
      reflection_prompts: [
        "Where in your body did today land heaviest?",
        "What are you grateful for tonight that required no effort to receive — a texture, a light, a smell?",
        "What is one thing you're willing to leave unresolved until morning?",
      ],
      closing_affirmation: "Your sensitivity is not a flaw to manage — it is the very instrument through which your creativity and your caring flow. Rest it gently tonight.",
    },
    "30": {
      routine_title: "The Tender Restoration",
      greeting: "You've given a lot today — to the people you love, to your work, to the world. This next thirty minutes belongs entirely to you.",
      steps: [
        { duration: "8 min", title: "Restorative Stretch", description: "Lie on the floor with your legs up the wall, or in child's pose. Set a timer and do nothing but breathe. Let gravity work. The forest floor holds the tree — let something hold you.", intention: "I let go of holding myself up." },
        { duration: "7 min", title: "Sensory Reset", description: "Dim the lights. Light something — a candle, incense — or open a window to cool air. Engage just your senses for several minutes: what do you smell, feel, hear? Come back to your body as a place worth inhabiting.", intention: "My senses are always home." },
        { duration: "10 min", title: "Drift Writing", description: "Write freely for ten minutes — not about your day, but about something you long for, a place that calls to you, something you want to make or become. A feeling you haven't named yet. Let the dreamer in you lead.", intention: "Curiosity is the antidote to depletion." },
        { duration: "5 min", title: "Closing Breath", description: "Three deep breaths in through the nose, out through the mouth. On the last exhale, whisper or think: 'I am enough. I did enough. It is safe to rest.' Repeat until you feel it soften something.", intention: "Enough is not a destination — it's a practice." },
      ],
      reflection_prompts: [
        "What version of yourself showed up today — and what did they need that they didn't get?",
        "What moment of beauty did today offer you, however small?",
        "If tomorrow had one intention — not a task — what would it be?",
      ],
      closing_affirmation: "The inner work you've done has built something remarkable in you — a person who can be emptied and still trust the refilling. Trust it tonight. The forest always grows back.",
    },
    "45": {
      routine_title: "The Deep Restoration",
      greeting: "Tonight, Sage asks only one thing of you: nothing. Let this hour be a ceremony of pure receiving.",
      steps: [
        { duration: "10 min", title: "Legs Up the Wall", description: "Find a wall, lie on your back, legs extended upward. Set a timer for ten minutes and simply breathe. This is a full nervous system reset — the body knows what to do when you stop directing it.", intention: "I trust my body's ancient wisdom." },
        { duration: "10 min", title: "Sensory Immersion", description: "Bath, shower, or simply washing your face and hands with intention. Feel the temperature of the water. The texture of a towel. Anoint yourself with something that smells like comfort — lotion, oil, whatever you have. You deserve ceremony.", intention: "I tend to myself as I tend to what I love." },
        { duration: "15 min", title: "Artist's Pages", description: "Sit with a notebook and draw or write — whichever comes first. No goal. Sketch a place that calls to you. Write a letter to your future self living exactly as you dream. Let this be the creative exhale your daytime self doesn't get enough of.", intention: "My art is not separate from my healing — it is the healing." },
        { duration: "10 min", title: "Gratitude & Release", description: "Write three things you're grateful for — one from someone you love, one from nature, and one from your own inner world. Then write one thing you're releasing to the night. The night is an excellent keeper of what we cannot carry.", intention: "I release what is not mine to hold until morning." },
      ],
      reflection_prompts: [
        "What part of you was most alive today — even briefly?",
        "What would someone who loves you say was the best thing about you today, even if they didn't say it out loud?",
        "What does your most peaceful, fully-expressed self know that you sometimes forget?",
      ],
      closing_affirmation: "You have been sober, present, and growing for years now — through divorce, through the daily weight of loving and working and becoming. Tonight, let that woman rest. She has earned this softness. She always has.",
    },
  },
  low: {
    "5": {
      routine_title: "Moonfall Ease",
      greeting: "The tiredness you feel tonight is not weakness — it is the body wisely asking to return. Let's make this homecoming gentle.",
      steps: [
        { duration: "2 min", title: "Permission Breath", description: "Close your eyes and take three slow breaths. With each exhale, give yourself permission out loud or in your mind: to rest, to stop, to be done for today.", intention: "Surrender is not giving up — it is letting in." },
        { duration: "3 min", title: "Gratitude Whisper", description: "Name three things from today — tiny ones welcome. The coffee that was hot. A moment someone you love laughed. The fact that you got through it.", intention: "Goodness doesn't announce itself — I notice it anyway." },
      ],
      reflection_prompts: [
        "What is your body asking you to put down tonight?",
        "What was unexpectedly kind about today?",
        "What are you looking forward to, however quietly?",
      ],
      closing_affirmation: "You don't have to be radiant every night. Some nights you are simply someone who kept going, and that is its own kind of sacred.",
    },
    "15": {
      routine_title: "The Gentle Unraveling",
      greeting: "There's a particular grace to being tired and still choosing to tend yourself. That is who you are — someone who tends.",
      steps: [
        { duration: "5 min", title: "Warm Water Ritual", description: "Wash your face or soak your feet in warm water. Feel the temperature as a full sensory event. Warm water has been a signal of safety for humans for millennia — let it work on you tonight.", intention: "Water carries what I cannot." },
        { duration: "5 min", title: "Three Good Things", description: "In a notebook or just in your mind, name three things that were genuinely good today — moments, feelings, small victories. The tired brain filters for problems; this rebalances it intentionally.", intention: "I train my attention to find what's good." },
        { duration: "5 min", title: "Breath Countdown", description: "Lie down. Breathe in for 4 counts, hold for 4, out for 8. Repeat five times. This activates your parasympathetic system and signals the body: the day is done, and you are safe.", intention: "Safety is not somewhere I arrive — it's something I breathe into being." },
      ],
      reflection_prompts: [
        "What were you carrying today that wasn't actually yours to carry?",
        "What sensory pleasure did today offer — a taste, a warmth, a quiet moment?",
        "What does rest feel like in your body when you truly allow it?",
      ],
      closing_affirmation: "The person who shows up tired and still chooses care over collapse — that person is doing the work. You've been doing it. Rest now.",
    },
    "30": {
      routine_title: "Roots Down, Stars Up",
      greeting: "Tonight your ritual is less about doing and more about arriving — back into your body, back into the quiet that's always been waiting for you.",
      steps: [
        { duration: "8 min", title: "Grounding Walk or Stand", description: "If you can, step outside briefly — even just onto a porch. Feel the air. Look up. If you can't go outside, stand barefoot on the floor and press your feet down. You are rooted, even when it doesn't feel that way.", intention: "I am held by more than I can see." },
        { duration: "7 min", title: "Gentle Movement", description: "Slow neck rolls, shoulder circles, gentle spinal twists. This isn't exercise — it's conversation with your body. Notice where you're tight and breathe toward it without demanding it change.", intention: "My body has been working all day — I thank it now." },
        { duration: "10 min", title: "Stream of Consciousness Write", description: "Set a timer for ten minutes and write without stopping. Start with 'Tonight I feel...' and go from there. Don't edit. Don't perform. This is the private page — it belongs entirely to you.", intention: "I know myself better than I think I do." },
        { duration: "5 min", title: "Moon Acknowledgment", description: "Look at the moon if you can — or simply acknowledge it's there, above the clouds, doing its ancient work. You are in a cycle too. Trust the phase you're in.", intention: "I am in process, not behind." },
      ],
      reflection_prompts: [
        "What feeling moved through you today that you didn't have time to fully feel?",
        "What are you grateful for in someone you love right now — something specific, something fresh?",
        "If your most fully-expressed future self wrote you a note tonight, what would it say?",
      ],
      closing_affirmation: "You are in the most alive chapter of your becoming, even when it feels like maintenance and exhaustion. The roots you're putting down right now — in the work you're doing, in presence, in honesty — will hold the tallest version of you. Rest, and trust the roots.",
    },
    "45": {
      routine_title: "The Full Moon Bath",
      greeting: "Tonight has more space in it than it looks. Let's use it for something that fills rather than drains.",
      steps: [
        { duration: "12 min", title: "Bath or Shower Ceremony", description: "This is not a hygiene task tonight — it is a ritual. Light something. Use something that smells good. Wash slowly. Imagine the water taking what the day left behind — the fluorescent office light, the meetings, the mental load. You are rinsing it all away.", intention: "I am allowed to feel clean in body and spirit." },
        { duration: "10 min", title: "Slow Stretch & Body Gratitude", description: "After drying off, do ten minutes of gentle, slow stretching on your bed or floor. With each stretch, name one thing your body did today that deserved thanks — your hands, your voice, your lungs, your heart.", intention: "This body carries me faithfully. I honor it." },
        { duration: "13 min", title: "Artist's Evening Pages", description: "Write or draw for thirteen minutes — try both if you want. You don't need a subject. Start with a color that matches your mood, then let it become something. Whatever your creative impulse is — this is not a hobby. It is who you are.", intention: "Making something, however small, is an act of aliveness." },
        { duration: "10 min", title: "Reading & Wind Down", description: "Read something that has nothing to do with work — poetry, fiction, anything that feeds the part of you that the practical demands of the day cannot reach. Let someone else's words carry you gently toward sleep.", intention: "I feed my imagination as faithfully as I feed those I love." },
      ],
      reflection_prompts: [
        "What part of the day did you navigate better than you give yourself credit for?",
        "What in the natural world caught your eye today — what would you have captured if you'd had the time?",
        "What is one thing you want to grow — in yourself or in your life — over the next season?",
      ],
      closing_affirmation: "Whatever you're carrying — the commitments, the people you love, the daily weight of showing up. And still — still — you come here, to yourself, at the end of the day. That is not small. That is everything.",
    },
  },
  balanced: {
    "5": {
      routine_title: "The In-Between Hour",
      greeting: "You're in that sweet, rare middle space tonight — not emptied, not wired. Let's use it to close the day with intention.",
      steps: [
        { duration: "2 min", title: "Gratitude Breath", description: "One slow breath for something that went well. One for something hard you moved through. One for something you're looking forward to. Three breaths, three anchors.", intention: "I close well so I can open fresh." },
        { duration: "3 min", title: "Tomorrow's Seed", description: "Write or think of one single intention for tomorrow — not a task, but a way of being. Curious. Patient. Bold. Plant it tonight.", intention: "I choose how I meet tomorrow, beginning now." },
      ],
      reflection_prompts: [
        "What felt most aligned today — most like yourself?",
        "What are you grateful for in the quiet of this in-between feeling?",
        "What is one thing you want to carry into tomorrow from today?",
      ],
      closing_affirmation: "Balance is not a permanent state — it's a moment to recognize and honor. You found it tonight. Rest in it.",
    },
    "15": {
      routine_title: "Equinox Evening",
      greeting: "A balanced night is worth celebrating — not with noise, but with intention. You're here, you're whole, and the evening is yours.",
      steps: [
        { duration: "5 min", title: "Creative Spark", description: "Open your sketchbook, notes app, or a scrap of paper. Spend five minutes with something you've been meaning to think about — an idea you want to make, a dream you're moving toward, a feeling you want to capture. No product required; just playtime.", intention: "Creativity doesn't need conditions — just permission." },
        { duration: "5 min", title: "Gratitude Depth", description: "Write three gratitudes, but go deeper than surface. Not just 'the people I love' but something specific they did or were today. Not just 'health' but the specific thing your body did that you appreciated.", intention: "Specificity is the language of genuine thankfulness." },
        { duration: "5 min", title: "Tomorrow's Landscape", description: "Lightly envision tomorrow — not a to-do list but a feeling. How do you want to feel in the morning? At lunch? After work? Sketch the emotional landscape of a good day tomorrow.", intention: "I participate in creating my own experience." },
      ],
      reflection_prompts: [
        "What felt true about you today that you want to remember?",
        "What sensory memory from today do you want to hold onto?",
        "What is quietly growing in you right now that you can feel but not yet name?",
      ],
      closing_affirmation: "The person you're becoming — the one who creates and tends and grows and loves fiercely — they are already here. You don't have to wait to arrive. You are arriving, right now.",
    },
    "30": {
      routine_title: "The Steady Flame",
      greeting: "You came tonight with some of yourself still intact — that's a gift. Let's tend that flame so it burns clear.",
      steps: [
        { duration: "8 min", title: "Movement You Love", description: "Dance in your kitchen. Walk around the block. Stretch into something that feels good. Move for the joy of movement for eight minutes — this is not exercise, it is aliveness.", intention: "My body is not a problem to manage — it is a pleasure to inhabit." },
        { duration: "7 min", title: "Color & Canvas Time", description: "Whatever art tools you have — even a pencil and a receipt — spend seven minutes making marks. No goal. Respond to how you feel with color or line. The creator in you is in there every single night.", intention: "I make something. Therefore I am alive." },
        { duration: "10 min", title: "Reflective Write", description: "Free-write for ten minutes about something you're integrating — a realization, a shift, a pattern you've noticed in yourself. Your inner work didn't end with the big breakthroughs; this is where it lives now, in the daily noticing.", intention: "Integration is the quiet revolution." },
        { duration: "5 min", title: "Evening Breath Practice", description: "Sit comfortably and breathe in a 4-7-8 pattern: inhale 4, hold 7, exhale 8. Do this five times. It is one of the most direct paths to the parasympathetic system — your body's own peace signal.", intention: "Peace is not outside me. I breathe it awake." },
      ],
      reflection_prompts: [
        "What did you learn about yourself today — even something small?",
        "What would you tell a friend who had your exact day?",
        "What is one thing you're integrating right now that you can feel shifting?",
      ],
      closing_affirmation: "Your steadiness is hard-won. It was built in hard seasons and quiet choices — in the inner work, in showing up anyway. A balanced night is a testament to that work. Receive it.",
    },
    "45": {
      routine_title: "The Full Tending",
      greeting: "Tonight you have the rarest thing: a little equilibrium and a little time. Sage wants you to use every minute of it for yourself.",
      steps: [
        { duration: "10 min", title: "Nourishing Movement", description: "Yoga, a slow walk, stretching with music you love — choose something that honors your body as the living instrument it is. Move with appreciation rather than obligation.", intention: "I am in a body that has carried me faithfully." },
        { duration: "12 min", title: "Creative Practice", description: "Real time tonight for your art. Sketch, paint, write poetry, collage — whatever calls. This isn't productive art, it's devotional art. The creator in you needs this practice just as a garden needs water.", intention: "My art is not a someday thing. It is a right now thing." },
        { duration: "13 min", title: "Deep Reflection Writing", description: "Write about something meaningful — your vision for the next chapter, what integration has felt like this season, what you're proud of in yourself that you rarely say aloud. Go deep. You can handle what you find there.", intention: "I know myself. I am not afraid of what I find." },
        { duration: "10 min", title: "Closing Ceremony", description: "Make something warm to drink. Sit somewhere you love in your home. Do nothing deliberate. Let your mind wander. This is the closing — the moment of simply being without agenda.", intention: "Being is enough. Being is, in fact, everything." },
      ],
      reflection_prompts: [
        "What aspect of your inner life is most alive right now — what are you actively becoming?",
        "What specific thing about someone you love lit you up this week?",
        "If you could tell the version of you from five years ago one thing about where you are now, what would it be?",
      ],
      closing_affirmation: "You have remade yourself with intention and courage — not once but continuously. That takes a kind of strength that has no name in the language of performance reviews or productivity. It is the creator's strength. The caregiver's strength. The awake human's strength. Rest now, and let it all settle deeper.",
    },
  },
  wired: {
    "5": {
      routine_title: "The Slow Descent",
      greeting: "The mind is still running its laps, isn't it? That's alright — we're not fighting it tonight. We're just going to gently invite it down.",
      steps: [
        { duration: "2 min", title: "Brain Dump", description: "Grab paper and write every spinning thought for two minutes — rapid, messy, unfiltered. Get it out of your head and onto the page. The page is a better container for this than your nervous system.", intention: "I give my mind a place to put things down." },
        { duration: "3 min", title: "4-7-8 Breathing", description: "Inhale for 4 counts, hold for 7, exhale for 8. Repeat four times. This directly activates the vagus nerve — your body's own off switch. It works even when your mind argues with it.", intention: "My body knows how to rest. I just have to ask." },
      ],
      reflection_prompts: [
        "What is the thing your mind is most stuck on tonight — can you name it clearly?",
        "What would it feel like to set that thing down just until morning?",
        "What does your body need most right now?",
      ],
      closing_affirmation: "The spinning mind is a sign that you care deeply. But caring deeply does not require suffering deeply. Let the night hold what you cannot solve tonight.",
    },
    "15": {
      routine_title: "Unwinding the Coil",
      greeting: "You're a little coiled tonight — and we're going to unwind you slowly, the way you'd work a stubborn knot, with patience rather than force.",
      steps: [
        { duration: "5 min", title: "Physical Release", description: "Shake your hands. Roll your shoulders. Jump lightly in place or do ten slow squats. Wired energy lives in the body and needs somewhere to go before the mind will quiet. Move it through you.", intention: "I discharge what I cannot think my way out of." },
        { duration: "5 min", title: "Thought Inventory", description: "Write for five minutes: what's actually on your mind? Not journaling — inventory. Name every concern, idea, or loop. Seeing them listed shrinks them. Your mind will stop repeating what it knows you've captured.", intention: "Named, it loses its grip." },
        { duration: "5 min", title: "Sensory Anchor", description: "Hold something cold or warm. Listen to rain sounds or silence. Smell something grounding — coffee, wood, something from nature, whatever signals safety to you. Use your senses to pull you back into the present body, where the future's worries don't exist.", intention: "I live here, in this body, in this breath." },
      ],
      reflection_prompts: [
        "What is the real thing underneath the spinning tonight — what is it actually about?",
        "What would you tell someone you love if they came to you wired and couldn't wind down?",
        "What is one thing that is genuinely okay right now, even if other things aren't?",
      ],
      closing_affirmation: "Your active mind has carried so much — a career, relationships, years of inner work. Tonight, give it the gift of rest. The problems will still be there tomorrow — and you'll meet them better from sleep.",
    },
    "30": {
      routine_title: "The Gentle Tether",
      greeting: "The stories your mind is spinning tonight are real to it — but they are not the whole truth. Let's find your way back to solid ground.",
      steps: [
        { duration: "8 min", title: "Vigorous Release Movement", description: "Dance hard to one or two songs. Shake, jump, move with intensity for eight minutes. This isn't calming — it's discharge. You need to spend the nervous energy before you can access the quiet underneath it.", intention: "I move through, not away from, what I feel." },
        { duration: "7 min", title: "Thought Sorting", description: "Draw a simple line down a page: left side 'within my control tonight,' right side 'not mine tonight.' Sort your spinning thoughts into these columns. This externalizes the sorting your mind is trying to do internally — and does it much faster.", intention: "I choose what I carry tonight." },
        { duration: "10 min", title: "Nature Visualization", description: "Lie down and close your eyes. Imagine the place where you feel most yourself — real or imagined. The textures, the sounds, the quality of light. Walk yourself through it slowly. This is not escapism: this is practicing the life you're building.", intention: "I am already moving toward my true home." },
        { duration: "5 min", title: "Box Breathing", description: "Inhale 4, hold 4, exhale 4, hold 4. Repeat for five minutes. Box breathing is used by special forces to regulate under pressure — your spinning mind qualifies.", intention: "I regulate. I return. I rest." },
      ],
      reflection_prompts: [
        "What is the story your mind keeps telling tonight — and is it true?",
        "What is something from today that was genuinely in your control and that you handled?",
        "What would the most grounded, easeful version of you say to the wired version right now?",
      ],
      closing_affirmation: "The inner work you've done means you know what's actually happening when the mind races — it's protection, not truth. You know how to work with this. Be gentle with yourself tonight, and firm with the stories that aren't serving you.",
    },
    "45": {
      routine_title: "The Full Unraveling",
      greeting: "Tonight needs a full ceremony — because you deserve more than a five-minute calm-down. You deserve a real return to yourself.",
      steps: [
        { duration: "10 min", title: "Expressive Movement", description: "Music you love, volume up, full movement for ten minutes. Shake, stretch, dance, punch the air if you need to. The wired state is energy that needs to travel — send it through your body and out.", intention: "I am not stuck. I am moving." },
        { duration: "10 min", title: "Complete Thought Dump", description: "Set a timer. Write everything: worries, resentments, ideas, lists, half-finished thoughts, the thing you didn't say. Do not stop writing. This is not reflection yet — this is evacuation. Get it all onto the page.", intention: "The page is big enough to hold all of this." },
        { duration: "10 min", title: "Warm Immersion", description: "Bath, shower, or foot soak. Make it deliberate. Use something that smells like calm — eucalyptus, lavender, whatever grounds you. This shifts the sensory input entirely and gives your nervous system new information: you are safe, you are warm, it is night.", intention: "Water has always known how to carry things away." },
        { duration: "10 min", title: "Yoga Nidra or Guided Rest", description: "Lie flat with a pillow under your knees. Close your eyes. Slowly name each part of your body from toes to crown, releasing it. Breathe long and slow. This is the oldest human sleep practice. Let it work on you.", intention: "I dissolve into the ground that holds everything." },
        { duration: "5 min", title: "One True Thing", description: "Before sleep, write or say aloud one thing that is undeniably true and good — about someone you love, about who you've become, about what is working. End on solid ground.", intention: "Truth is my anchor." },
      ],
      reflection_prompts: [
        "What is the thing beneath the wired feeling — what is it actually trying to protect you from?",
        "What has been genuinely good about this season of your life, even when it's been hard?",
        "What does your most grounded self — the one who walks in the woods and paints — want you to know tonight?",
      ],
      closing_affirmation: "You have navigated enormous inner terrain. The version of you that faces a wired mind tonight is not lost — they are skilled, practiced, and capable of exactly this kind of return. Rest is not surrender. It is strategy. It is love.",
    },
  },
  buzzing: {
    "5": {
      routine_title: "Finding the Ground",
      greeting: "You're up high tonight — in your head, in the buzz. That's okay. We're just going to gently, gently bring you back to the earth.",
      steps: [
        { duration: "2 min", title: "5-4-3-2-1 Grounding", description: "Name 5 things you can see. 4 you can touch. 3 you can hear. 2 you can smell. 1 you can taste. Do it slowly. This is your nervous system's emergency return home.", intention: "I am here, in this body, in this room, in this moment." },
        { duration: "3 min", title: "Cold Water Reset", description: "Splash cold water on your face or hold your wrists under cold water. This activates the dive reflex and slows your heart rate within seconds. It is not metaphor — it is physiology. Let your body do this for you.", intention: "My body knows the way back." },
      ],
      reflection_prompts: [
        "What is driving the buzz tonight — can you name one specific source?",
        "What is one thing that is stable and okay right now, in this exact moment?",
        "What does your body need — not your mind, your body?",
      ],
      closing_affirmation: "The buzz always passes. It has every time before. You know this. Let tonight be one more proof.",
    },
    "15": {
      routine_title: "The Descent Practice",
      greeting: "You've been somewhere high tonight — in energy, in thought, in the unnamed hum. Sage is here to walk you down, one breath at a time.",
      steps: [
        { duration: "5 min", title: "Grounding Movement", description: "Stand barefoot if you can. Bend your knees slightly. Sway. Press your feet into the floor and feel the ground push back. March in place slowly. This is primitive — it works for the same reason fire works. It reconnects you to the body.", intention: "Ground. Body. Earth. Now." },
        { duration: "5 min", title: "Timed Exhale Breathing", description: "Breathe in for 4 counts. Breathe out for 8. The extended exhale is the key — it's the physiological signal for 'safe.' Do this for five full minutes. Even if your mind fights it, your body will respond.", intention: "Each exhale is a step down from wherever I've been." },
        { duration: "5 min", title: "Grounding Write", description: "Write five things that are real and stable in your life right now — the things that ground you, the people you love, the commitments you're keeping, your body. Write the solid ground. Read it back slowly.", intention: "I return to what is real." },
      ],
      reflection_prompts: [
        "What was the trigger or accumulation that led to tonight's buzz?",
        "What in your life right now is genuinely solid — something you can stand on?",
        "What has helped you come back to yourself before, when you were here?",
      ],
      closing_affirmation: "You have been choosing groundedness — in every hard season, in every quiet choice no one else sees. The buzz is temporary. The person choosing their ground is permanent. Come home to yourself tonight.",
    },
    "30": {
      routine_title: "The Return Ceremony",
      greeting: "The buzz is real — and you know, from your inner work, that it has something to say. Tonight we'll listen to it and then gently set it down.",
      steps: [
        { duration: "8 min", title: "Physical Discharge", description: "Jump, shake, dance hard, do burpees — whatever moves energy through your body. Buzzing energy needs to move through, not be suppressed. Give it full permission to express physically for eight minutes.", intention: "I move it through, not down." },
        { duration: "7 min", title: "Stream of Consciousness Purge", description: "Write without stopping for seven minutes — every thought, every spin, every fear, every dream, every loop. No punctuation required. No coherence required. Just get it out of the internal loop and onto paper where it becomes information rather than atmosphere.", intention: "Written, it is no longer weather — it is data." },
        { duration: "10 min", title: "Guided Body Scan", description: "Lie down. Starting at your feet, slowly move your awareness through your body, spending three breaths on each section. Don't try to relax — just observe. Noticing without fixing is one of the most powerful practices in your toolkit.", intention: "I witness myself without needing to fix myself." },
        { duration: "5 min", title: "Anchor Breath", description: "One hand on chest, one on belly. Feel them both move. Breathe into your belly first, then let your chest expand. Exhale belly, then chest. Five minutes of this full breath brings you entirely back into your body.", intention: "The breath is always the way home." },
      ],
      reflection_prompts: [
        "What is the buzz actually made of tonight — what are its ingredients?",
        "When you imagine your most peaceful future self, what does their nervous system feel like?",
        "What do you need to release tonight so that tomorrow can be calmer?",
      ],
      closing_affirmation: "You are not the buzz. You never have been. You are the awareness underneath it — the one watching, choosing, doing the work. That awareness is calm. It is capable. It has been here through everything. Find it tonight and rest.",
    },
    "45": {
      routine_title: "The Full Grounding Ceremony",
      greeting: "Tonight deserves the full practice — because when you're buzzing, half measures just skim the surface. Sage has the whole hour with you.",
      steps: [
        { duration: "12 min", title: "High-Intensity Release", description: "Ten full minutes of music and movement — dance, shake, anything that lets the buzzing energy travel through your body and out. This is not aggression; it is alchemy. You're transmuting agitation into something spent. Then two minutes of slow, deliberate walking to begin the descent.", intention: "I alchemize energy. I do not suppress it." },
        { duration: "10 min", title: "Complete Purge Writing", description: "Every thought. Every fear. Every loop. Every unsaid thing. Ten minutes, no stopping. When the timer goes off, draw a line under it and write: 'This is not my night's work. This is tomorrow's, if it still matters.' Close the notebook.", intention: "I decide what tonight is for." },
        { duration: "10 min", title: "Immersion Reset", description: "Hot shower or bath with intention. Cold rinse at the end if you can tolerate it — 30 seconds of cool water shifts the nervous system dramatically. Dry off slowly. Dress in something soft. You are beginning the landing.", intention: "I signal my body: the day is complete." },
        { duration: "8 min", title: "Yoga Nidra Body Scan", description: "Lie flat. Name each body part silently and release it: left foot, right foot, left calf, right calf... move all the way up, spending one breath per section. By the time you reach your crown, your nervous system will be measurably quieter.", intention: "Part by part, I come home to myself." },
        { duration: "5 min", title: "Gratitude Anchoring", description: "Name five things you are grateful for about your specific life — someone who loves you, a commitment you're keeping, one thing you created, one way you've grown, one thing your body did today. Say them aloud if you can. The vibration of spoken gratitude is its own medicine.", intention: "Gratitude is not naive — it is my most sophisticated navigation tool." },
      ],
      reflection_prompts: [
        "What is the deepest layer of tonight's buzz — what is it protecting, and from what?",
        "What is the most stable, solid, true thing about your life right now?",
        "What would it feel like to wake up tomorrow with a quiet mind — and what would you do with that morning?",
      ],
      closing_affirmation: "You have done the hardest kind of work a person can do — looked clearly at yourself and chosen, again and again, to grow. A buzzing night doesn't undo that. It just asks for the tools you've built. You have them. Use them tonight, and then rest. The quiet is always underneath. Always.",
    },
  },
};

function generateRitual(energyId, timeId, profile = {}) {
  const base = RITUALS[energyId]?.[timeId] || RITUALS["balanced"]["15"];

  // Deep clone — never mutate the source library
  const ritual = JSON.parse(JSON.stringify(base));

  const name     = (profile.name     || "").trim();
  const anchor   = (profile.anchor   || "").trim();
  const returnTo = (profile.returnTo || "").trim();

  // ── Weave name into greeting — warm aside, not a blunt prepend ─────────────
  if (name) {
    const sentences = ritual.greeting.split(". ");
    if (sentences.length >= 2) {
      sentences[1] = sentences[1].replace(/^You/, name);
      ritual.greeting = sentences.join(". ");
    }
  }

  // ── Weave returnTo into steps that reference grounding / visualization ────
  if (returnTo) {
    ritual.steps = ritual.steps.map(step => {
      const d = step.description;

      if (d.includes("place where you feel most yourself — real or imagined")) {
        step.description = d.replace(
          "a place where you feel most yourself — real or imagined. The textures, the sounds, the quality of light. Walk yourself through it slowly.",
          "a place where you feel most yourself — the thing that grounds you and calls you home. Let its textures, sounds, and feelings come alive in your mind. Stay there slowly."
        );
      }

      if (d.includes("Smell something grounding — coffee, wood, something from nature.")) {
        step.description = d.replace(
          "Smell something grounding — coffee, wood, something from nature.",
          "Reach for whatever signals safety to you — something warm, something familiar, anything that says home."
        );
      }

      if (step.title === "Grounding Write" && d.includes("the commitments you're keeping")) {
        step.description = d.replace(
          "the people you love, the commitments you're keeping, your home, your body",
          "the things that ground you, the people you love, your commitments, your home, your body"
        );
      }

      return step;
    });
  }

  // ── Weave anchor into closing affirmation ─────────────────────────────────
  if (anchor) {
    ritual.closing_affirmation = ritual.closing_affirmation
      + " The things you named that keep you going — they are real. They are yours. Let them hold you tonight.";
  }

  return ritual;
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function NightlySage() {
  const [step, setStep] = useState("intro");
  const [visible, setVisible] = useState(true);
  const [energy, setEnergy] = useState(null);
  const [time, setTime] = useState(null);
  const [routine, setRoutine] = useState(null);
  const [moonIdx, setMoonIdx] = useState(0);
  const [expandedStep, setExpandedStep] = useState(null);
  const [reflections, setReflections] = useState({});
  const [gratitude, setGratitude] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [stepNotes, setStepNotes] = useState({});
  const [stepMoods, setStepMoods] = useState({});
  const [stepDone, setStepDone] = useState({});
  const [userName, setUserName] = useState("");
  const [userAnchor, setUserAnchor] = useState("");
  const [userReturn, setUserReturn] = useState("");
  const [editingProfile, setEditingProfile] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [justCompleted, setJustCompleted] = useState({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("nightlysage_profile");
    if (saved) {
      const p = JSON.parse(saved);
      setUserName(p.name || "");
      setUserAnchor(p.anchor || "");
      setUserReturn(p.returnTo || "");
    } else {
      setStep("onboard1");
    }
  }, []);

  useEffect(() => {
    if (step !== "generating") return;
    const id = setInterval(() => setMoonIdx(m => (m + 1) % MOON_CYCLE.length), 280);
    return () => clearInterval(id);
  }, [step]);

  useEffect(() => {
    if (step !== "generating") return;
    const t = setTimeout(() => {
      const ritual = generateRitual(energy, time, { name: userName, anchor: userAnchor, returnTo: userReturn });
      setRoutine(ritual);
      const init = {};
      (ritual.reflection_prompts || []).forEach((_, i) => { init[i] = ""; });
      setReflections(init);
      setVisible(false);
      setTimeout(() => { setStep("routine"); setVisible(true); }, 380);
    }, 1800);
    return () => clearTimeout(t);
  }, [step, energy, time, userName, userAnchor, userReturn]);

  const stars = useMemo(() => Array.from({ length: 55 }, (_, i) => ({
    id: i,
    left: `${(i * 137.508) % 100}%`,
    top: `${(i * 97.3) % 100}%`,
    size: (i % 3) * 0.6 + 0.5,
    opacity: ((i % 4) + 1) * 0.1,
    cls: `s${(i % 3) + 1}`,
  })), []);

  const go = (nextStep) => {
    setVisible(false);
    setTimeout(() => {
      setStep(nextStep);
      setVisible(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 380);
  };

  const buildEmailBody = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
    const energyLabel = ENERGY_LEVELS.find(e => e.id === energy)?.label;
    const displayName = userName.trim() ? userName.trim() : "Friend";
    let b = `🌙 NIGHTLY SAGE — EVENING RITUAL\n${today}\nFor: ${displayName}  |  Energy: ${energyLabel}  |  Time: ${time} min\n\n`;
    b += `✦ ${routine?.routine_title?.toUpperCase()} ✦\n\n${personalize(routine?.greeting)}\n\n`;
    if (userAnchor.trim() || userReturn.trim()) {
      b += `━━━━━━━━━━━━━━━━━━━━━━\nYOUR ANCHORS\n━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      if (userAnchor.trim()) b += `What keeps you going: ${userAnchor.trim()}\n`;
      if (userReturn.trim()) b += `What brings you back: ${userReturn.trim()}\n`;
      b += "\n";
    }
    b += `━━━━━━━━━━━━━━━━━━━━━━\nTONIGHT'S PRACTICE\n━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    routine?.steps?.forEach((st, i) => {
      b += `${i+1}. ${st.title}  (${st.duration})\n${personalize(st.description)}\n✦ ${personalize(st.intention)}\n`;
      if (stepMoods[i]) b += `Feeling: ${stepMoods[i]}\n`;
      if (stepNotes[i]?.trim()) b += `Notes: ${stepNotes[i].trim()}\n`;
      b += "\n";
    });
    b += `━━━━━━━━━━━━━━━━━━━━━━\nMY REFLECTIONS\n━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    routine?.reflection_prompts?.forEach((p, i) => { b += `${personalize(p)}\n${reflections[i] || "—"}\n\n`; });
    if (gratitude.trim()) b += `━━━━━━━━━━━━━━━━━━━━━━\nGRATITUDE\n━━━━━━━━━━━━━━━━━━━━━━\n\n${gratitude}\n\n`;
    b += `━━━━━━━━━━━━━━━━━━━━━━\n\n${personalize(routine?.closing_affirmation)}\n\nWith love always,\nSage 🌙`;
    return b;
  };

  const sendEmail = () => {
    const subject = encodeURIComponent(`🌙 ${routine?.routine_title} — ${new Date().toLocaleDateString()}`);
    const body = encodeURIComponent(buildEmailBody());
    window.open(`mailto:${emailInput}?subject=${subject}&body=${body}`);
    setEmailSent(true);
    setTimeout(() => go("complete"), 1000);
  };

  const saveProfile = (name, anchor, returnTo) => {
    const profile = { name, anchor, returnTo };
    localStorage.setItem("nightlysage_profile", JSON.stringify(profile));
    setUserName(name);
    setUserAnchor(anchor);
    setUserReturn(returnTo);
  };

  const personalize = (text) => {
    if (!text) return text;
    const name = userName.trim();
    const anchor = userAnchor.trim();
    const returnTo = userReturn.trim();
    return text
      .replace(/\{\{NAME_COMMA\}\}/g, name ? `, ${name}` : "")
      .replace(/\{\{ANCHOR\}\}/g, anchor || "the work you're doing")
      .replace(/\{\{ANCHOR_BRACKET\}\}/g, anchor ? ` — ${anchor} —` : "")
      .replace(/\{\{RETURN\}\}/g, returnTo || "whatever grounds you");
  };

  const clearProfile = () => {
    localStorage.removeItem("nightlysage_profile");
    setUserName(""); setUserAnchor(""); setUserReturn("");
    setEnergy(null); setTime(null); setRoutine(null);
    setReflections({}); setGratitude(""); setEmailInput(""); setEmailSent(false);
    setExpandedStep(null); setStepNotes({}); setStepMoods({}); setStepDone({});
    setJustCompleted({}); setCopied(false);
    go("onboard1");
  };

  const copyToClipboard = () => {
    const body = buildEmailBody();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(body).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => {
        const el = document.createElement("textarea");
        el.value = body;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const startOver = () => {
    setEnergy(null); setTime(null); setRoutine(null);
    setReflections({}); setGratitude(""); setEmailInput(""); setEmailSent(false);
    setExpandedStep(null); setMoonIdx(0);
    setStepNotes({}); setStepMoods({}); setStepDone({}); setJustCompleted({}); setCopied(false);
    go("intro");
  };

  const C = {
    bg: "#07101a", cream: "#f0e8dc", muted: "#9aabb8", dimmed: "#4a5a6a",
    sage: "#8aaa8e", amber: "#d4a853", amberDim: "rgba(212,168,83,0.6)",
    border: "rgba(255,255,255,0.07)", activeBorder: "rgba(212,168,83,0.45)",
    activeBg: "rgba(212,168,83,0.05)", surface: "rgba(255,255,255,0.03)",
    font: "'Jost', sans-serif", serif: "'Cormorant Garamond', serif",
  };

  const btnStyle = (disabled) => ({
    display: "block", width: "100%", padding: "16px", marginTop: "20px", minHeight: "48px",
    borderRadius: "11px", border: "none",
    background: disabled ? "rgba(138,170,142,0.15)" : "linear-gradient(135deg,#8aaa8e,#6b9470)",
    color: disabled ? C.dimmed : "#071510",
    fontSize: "10.5px", letterSpacing: "3.5px", textTransform: "uppercase",
    fontWeight: "500", fontFamily: C.font, cursor: disabled ? "not-allowed" : "pointer",
  });

  const ghostBtn = {
    display: "block", width: "100%", padding: "14px", marginTop: "8px", minHeight: "48px",
    borderRadius: "11px", border: `1px solid ${C.border}`,
    background: "transparent", color: C.dimmed, fontSize: "10.5px",
    letterSpacing: "2.5px", textTransform: "uppercase", fontFamily: C.font, cursor: "pointer",
  };

  const card = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: "18px", padding: "20px", marginTop: "24px" };
  const tag = { display: "block", fontSize: "10px", letterSpacing: "3.5px", textTransform: "uppercase", color: C.sage, marginBottom: "16px" };
  const hdg = { fontFamily: C.serif, fontWeight: "300", color: C.cream, lineHeight: 1.1, margin: 0 };
  const divider = { height: "1px", background: "rgba(255,255,255,0.05)", margin: "20px 0" };
  const textareaStyle = { width: "100%", background: "rgba(255,255,255,0.025)", border: `1px solid ${C.border}`, borderRadius: "10px", padding: "13px", color: C.cream, fontSize: "13.5px", fontFamily: C.font, lineHeight: 1.7, resize: "none", minHeight: "74px", marginBottom: "20px", display: "block", boxSizing: "border-box" };

  const allDone = step === "routine" && routine
    ? routine.steps.every((_, i) => stepDone[i])
    : false;
  const MOODS = ["🌿 Grounded","💧 Released","✨ Alive","🌫️ Processing","💛 Grateful","😴 Sleepy"];

  const DAY_NOTES = {
    0: "Sunday — a day to be slow in. You made it through the week.",
    1: "Monday — the week asked something of you right away. That takes a kind of courage.",
    2: "Tuesday — the week is in full swing. You're still here.",
    3: "Wednesday — halfway through. That's not nothing.",
    4: "Thursday — almost there. The finish line is in sight.",
    5: "Friday — the week carried a lot. You made it.",
    6: "Saturday — the weekend is yours. Let tonight be a real rest.",
  };
  const dayNote = DAY_NOTES[new Date().getDay()];

  return (
    <div style={{ minHeight: "100dvh", background: `radial-gradient(ellipse at 30% 15%, #0d1f35 0%, ${C.bg} 55%)`, fontFamily: C.font, position: "relative", overflowX: "hidden" }}>
      <style>{`
        @keyframes s1 { 0%,100%{opacity:0.35;} 50%{opacity:0.06;} }
        @keyframes s2 { 0%,100%{opacity:0.22;} 50%{opacity:0.04;} }
        @keyframes s3 { 0%,100%{opacity:0.15;} 50%{opacity:0.03;} }
        @keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-9px);} }
        @keyframes pulse { 0%,100%{opacity:0.55;} 50%{opacity:1;} }
        .s1{animation:s1 3.2s ease-in-out infinite;}
        .s2{animation:s2 4.5s -1.4s ease-in-out infinite;}
        .s3{animation:s3 5.8s -2.6s ease-in-out infinite;}
        @keyframes completePulse { 0%{box-shadow:0 0 0 0 rgba(138,170,142,0.5);} 70%{box-shadow:0 0 0 10px rgba(138,170,142,0);} 100%{box-shadow:0 0 0 0 rgba(138,170,142,0);} }
        @keyframes checkPop { 0%{transform:scale(0);opacity:0;} 60%{transform:scale(1.3);} 100%{transform:scale(1);opacity:1;} }
        .complete-pulse{animation:completePulse 0.6s ease-out forwards;}
        .check-pop{animation:checkPop 0.35s cubic-bezier(0.175,0.885,0.32,1.275) forwards;}
        button:hover{opacity:0.82;}
        input,textarea,select{font-size:16px!important;}
        *{-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none;}
        *{box-sizing:border-box;-webkit-font-smoothing:antialiased;}
        textarea::placeholder,input::placeholder{color:#3a4a58;}
        textarea:focus,input:focus{border-color:rgba(138,170,142,0.4)!important;outline:none;}
      `}</style>

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {stars.map(st => (
          <div key={st.id} className={st.cls} style={{ position: "absolute", left: st.left, top: st.top, width: `${st.size}px`, height: `${st.size}px`, borderRadius: "50%", background: "#ddeeff", opacity: st.opacity }} />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", padding: "32px 16px 80px", position: "relative", zIndex: 1 }}>
        <div style={{ width: "100%", maxWidth: "480px", transition: "opacity 0.38s ease, transform 0.38s ease", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)" }}>

          {step === "onboard1" && (
            <div>
              <div style={{ textAlign: "center", paddingTop: "32px", marginBottom: "8px" }}>
                <span style={{ fontSize: "48px", display: "block", marginBottom: "16px", animation: "float 5s ease-in-out infinite" }}>🌙</span>
                <span style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: C.sage }}>Welcome</span>
                <h1 style={{ ...hdg, fontSize: "clamp(34px,8vw,52px)", marginTop: "6px" }}>Nightly Sage</h1>
                <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "16px", color: C.muted, marginTop: "8px" }}>A wise companion for the end of your day</p>
              </div>
              <div style={card}>
                <span style={tag}>Before we begin</span>
                <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "16px", color: C.muted, lineHeight: 1.8, margin: "0 0 20px" }}>
                  Sage would love to know a little about you — so your rituals feel made for you, not for anyone.
                </p>
                <label style={{ display: "block", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: C.sage, marginBottom: "10px" }}>What should I call you?</label>
                <input
                  type="text"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  placeholder="Your name…"
                  style={{ width: "100%", background: "rgba(255,255,255,0.025)", border: `1px solid ${C.border}`, borderRadius: "10px", padding: "13px", color: C.cream, fontSize: "14px", fontFamily: C.font, display: "block", boxSizing: "border-box", marginBottom: "6px", WebkitAppearance: "none" }}
                />
                <button style={btnStyle(false)} onClick={() => go("onboard2")}>Continue →</button>
                <button style={ghostBtn} onClick={() => { saveProfile(userName, "", ""); go("intro"); }}>Skip setup</button>
                <div style={{ marginTop: "32px", textAlign: "center" }}>
                  <p style={{ fontSize: "11px", color: C.dimmed, lineHeight: 1.7, margin: "0 0 8px", fontFamily: C.font }}>
                    🔒 Your answers are stored only in this browser and used to personalize your ritual and summary email.<br/>
                    They are never tracked or shared. Clearing your browser data will reset them.
                  </p>
                  <button
                    onClick={() => setShowHowItWorks(true)}
                    style={{ background: "none", border: "none", color: C.sage, fontSize: "11px", fontFamily: C.font, cursor: "pointer", textDecoration: "underline", padding: "0", marginBottom: "12px", display: "block", marginLeft: "auto", marginRight: "auto" }}
                  >
                    How does this work under the hood? →
                  </button>
                  <p style={{ fontSize: "10px", color: "#2e3e4e", letterSpacing: "2px", textTransform: "uppercase", fontFamily: C.font, margin: 0 }}>
                    A Sage &amp; Steph creation · v0.1
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === "onboard2" && (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <span style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: C.sage, display: "block", marginBottom: "6px" }}>About you — 1 of 2</span>
                <h2 style={{ ...hdg, fontSize: "clamp(26px,6vw,40px)" }}>What keeps<br/>you going?</h2>
              </div>
              <div style={card}>
                <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "16px", color: C.muted, lineHeight: 1.8, margin: "0 0 20px" }}>
                  What's one thing you're proud of that keeps you going — a commitment, a practice, a person, a hard season you're still standing after?
                </p>
                <textarea
                  style={{ ...textareaStyle, minHeight: "90px" }}
                  placeholder="Something you're proud of… (optional)"
                  value={userAnchor}
                  onChange={e => setUserAnchor(e.target.value)}
                />
                <button style={btnStyle(false)} onClick={() => go("onboard3")}>Continue →</button>
                <button style={ghostBtn} onClick={() => { setUserAnchor(""); go("onboard3"); }}>Skip this one</button>
              </div>
            </div>
          )}

          {step === "onboard3" && (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <span style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: C.sage, display: "block", marginBottom: "6px" }}>About you — 2 of 2</span>
                <h2 style={{ ...hdg, fontSize: "clamp(26px,6vw,40px)" }}>What brings<br/>you back?</h2>
              </div>
              <div style={card}>
                <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "16px", color: C.muted, lineHeight: 1.8, margin: "0 0 20px" }}>
                  When life feels heavy, what brings you back to yourself? A person, a place, a song, a ritual, a smell — anything that signals home to you.
                </p>
                <textarea
                  style={{ ...textareaStyle, minHeight: "90px" }}
                  placeholder="What grounds you… (optional)"
                  value={userReturn}
                  onChange={e => setUserReturn(e.target.value)}
                />
                <button style={btnStyle(false)} onClick={() => { saveProfile(userName, userAnchor, userReturn); go("intro"); }}>
                  {userName.trim() ? `I'm ready, let's begin →` : "I'm ready, let's begin →"}
                </button>
                <button style={ghostBtn} onClick={() => { setUserReturn(""); saveProfile(userName, userAnchor, ""); go("intro"); }}>Skip this one</button>
              </div>
            </div>
          )}

          {step === "intro" && (
            <div>
              <div style={{ textAlign: "center", paddingTop: "24px", marginBottom: "8px" }}>
                <span style={{ fontSize: "56px", display: "block", marginBottom: "18px", animation: "float 5s ease-in-out infinite" }}>🌙</span>
                <span style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: C.sage }}>Nightly Sage</span>
                <h1 style={{ ...hdg, fontSize: "clamp(40px,9vw,62px)", marginTop: "6px" }}>Nightly<br/>Sage</h1>
                <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "17px", color: C.muted, marginTop: "10px" }}>
                  {userName.trim() ? `Good evening, ${userName.trim()}.` : "A wise companion for the end of your day."}
                </p>
                <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "14px", color: C.dimmed, marginTop: "6px", lineHeight: 1.6 }}>
                  {dayNote}
                </p>
              </div>
              <div style={card}>
                <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "16px", color: C.muted, lineHeight: 1.85, textAlign: "center", margin: "0 0 4px" }}>
                  Every evening is a chance to close the day with intention, gather what was good, and rest into who you're becoming.
                </p>
                <button style={btnStyle(false)} onClick={() => go("energy")}>Begin Tonight's Practice</button>
              </div>
              <div style={{ textAlign: "center", marginTop: "28px" }}>
                <button
                  onClick={() => setShowHowItWorks(true)}
                  style={{ background: "none", border: "none", color: C.sage, fontSize: "11px", fontFamily: C.font, cursor: "pointer", textDecoration: "underline", padding: "0", marginBottom: "10px", display: "block", marginLeft: "auto", marginRight: "auto" }}
                >
                  How does this work under the hood? →
                </button>
                <p style={{ fontSize: "10px", color: "#2e3e4e", letterSpacing: "2px", textTransform: "uppercase", fontFamily: C.font, margin: 0 }}>
                  A Sage &amp; Steph creation · v0.1
                </p>
              </div>
            </div>
          )}

          {step === "energy" && (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <span style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: C.sage, display: "block", marginBottom: "6px" }}>Step 1 of 2</span>
                <h2 style={{ ...hdg, fontSize: "clamp(30px,6vw,44px)" }}>How is your<br/>energy right now?</h2>
              </div>
              <div style={card}>
                <span style={tag}>Choose what feels true</span>
                {ENERGY_LEVELS.map(e => (
                  <button key={e.id} onClick={() => setEnergy(e.id)} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", minHeight: "64px", borderRadius: "11px", border: `1px solid ${energy===e.id ? C.activeBorder : C.border}`, background: energy===e.id ? C.activeBg : "transparent", cursor: "pointer", marginBottom: "8px", width: "100%", textAlign: "left" }}>
                    <span style={{ fontSize: "24px", flexShrink: 0 }}>{e.icon}</span>
                    <span>
                      <span style={{ display: "block", fontFamily: C.serif, fontSize: "19px", color: energy===e.id ? C.amber : C.cream }}>{e.label}</span>
                      <span style={{ display: "block", fontSize: "12px", color: C.dimmed, marginTop: "2px" }}>{e.desc}</span>
                    </span>
                    {energy===e.id && <span style={{ marginLeft: "auto", color: C.amber }}>✦</span>}
                  </button>
                ))}
                <button style={btnStyle(!energy)} disabled={!energy} onClick={() => go("time")}>Continue</button>
                <button style={ghostBtn} onClick={() => go("intro")}>← Back</button>
              </div>
            </div>
          )}

          {step === "time" && (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <span style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: C.sage, display: "block", marginBottom: "6px" }}>Step 2 of 2</span>
                <h2 style={{ ...hdg, fontSize: "clamp(30px,6vw,44px)" }}>How long do<br/>you have?</h2>
              </div>
              <div style={card}>
                <span style={tag}>Time for your ritual</span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {TIME_OPTIONS.map(t => (
                    <button key={t.id} onClick={() => setTime(t.id)} style={{ padding: "20px 10px", minHeight: "110px", borderRadius: "12px", textAlign: "center", border: `1px solid ${time===t.id ? C.activeBorder : C.border}`, background: time===t.id ? C.activeBg : "transparent", cursor: "pointer" }}>
                      <span style={{ display: "block", fontFamily: C.serif, fontSize: "34px", fontWeight: "300", color: time===t.id ? C.amber : C.cream, lineHeight: 1 }}>{t.label}</span>
                      <span style={{ display: "block", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: time===t.id ? C.amberDim : C.dimmed, marginTop: "4px" }}>{t.unit}</span>
                      <span style={{ display: "block", fontSize: "11px", color: C.dimmed, marginTop: "6px" }}>{t.sub}</span>
                    </button>
                  ))}
                </div>
                <button style={btnStyle(!time)} disabled={!time} onClick={() => go("generating")}>Weave My Ritual ✦</button>
                <button style={ghostBtn} onClick={() => go("energy")}>← Back</button>
              </div>
            </div>
          )}

          {step === "generating" && (
            <div style={{ textAlign: "center", paddingTop: "60px" }}>
              <span style={{ fontSize: "68px", display: "block", marginBottom: "24px", animation: "pulse 1.4s ease-in-out infinite" }}>{MOON_CYCLE[moonIdx]}</span>
              <h2 style={{ fontFamily: C.serif, fontWeight: "300", fontSize: "30px", color: C.cream, margin: "0 0 10px" }}>Sage is weaving your ritual…</h2>
              <p style={{ fontFamily: C.serif, fontStyle: "italic", color: C.muted, fontSize: "16px" }}>
                Reading the energy of tonight
              </p>
            </div>
          )}

          {step === "routine" && routine && (
            <div>
              <span style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: C.sage, display: "block", marginBottom: "8px" }}>Tonight's Practice</span>
              <h2 style={{ ...hdg, fontSize: "clamp(26px,5vw,40px)", fontStyle: "italic", marginBottom: "10px" }}>{routine.routine_title}</h2>
              <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "15.5px", color: C.muted, lineHeight: 1.8 }}>{personalize(routine.greeting)}</p>
              <div style={card}>
                <span style={tag}>Your steps — tap to expand</span>
                {routine.steps.map((st, i) => {
                  const isOpen = expandedStep === i;
                  const isDone = !!stepDone[i];
                  const mood = stepMoods[i];
                  return (
                  <div key={i} style={{ marginBottom: "8px" }}>
                    <div onClick={() => setExpandedStep(isOpen ? null : i)} className={justCompleted[i] ? "complete-pulse" : ""} style={{ padding: "16px 14px", minHeight: "56px", borderRadius: "11px", cursor: "pointer", border: `1px solid ${isDone ? "rgba(138,170,142,0.5)" : isOpen ? C.activeBorder : C.border}`, background: isDone ? "rgba(138,170,142,0.06)" : isOpen ? C.activeBg : "transparent", transition: "all 0.2s" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: C.serif, fontSize: "19px", color: isDone ? C.sage : C.cream }}>{st.title}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "11px", color: C.sage, letterSpacing: "1px" }}>{st.duration}</span>
                          {isDone && <span style={{ fontSize: "14px", color: C.sage }}>✓</span>}
                        </div>
                      </div>
                      {mood && !isOpen && <span style={{ fontSize: "11px", color: C.amberDim, display: "block", marginTop: "4px" }}>{mood}</span>}
                    </div>

                    {isOpen && (
                      <div style={{ padding: "16px", borderRadius: "0 0 11px 11px", border: `1px solid ${C.activeBorder}`, borderTop: "none", background: C.activeBg }}>
                        <p style={{ fontSize: "13.5px", color: "#8fa0b0", lineHeight: 1.75, margin: "0 0 12px" }}>{personalize(st.description)}</p>
                        <p style={{ fontFamily: C.serif, fontStyle: "italic", color: C.amber, fontSize: "14px", margin: "0 0 16px", paddingTop: "10px", borderTop: `1px solid rgba(255,255,255,0.05)` }}>✦ {personalize(st.intention)}</p>

                        <div style={divider} />

                        <span style={{ ...tag, marginBottom: "10px" }}>How did this land?</span>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "7px", marginBottom: "14px" }}>
                          {MOODS.map(m => (
                            <button key={m} onClick={e => { e.stopPropagation(); setStepMoods(s => ({ ...s, [i]: s[i] === m ? null : m })); }} style={{ padding: "7px 6px", borderRadius: "20px", border: `1px solid ${mood===m ? C.activeBorder : C.border}`, background: mood===m ? C.activeBg : "transparent", color: mood===m ? C.amber : C.muted, fontSize: "10.5px", fontFamily: C.font, cursor: "pointer", textAlign: "center", width: "100%" }}>
                              {m}
                            </button>
                          ))}
                        </div>

                        <textarea
                          onClick={e => e.stopPropagation()}
                          style={{ ...textareaStyle, minHeight: "60px", marginBottom: "14px" }}
                          placeholder="Any notes for yourself…"
                          value={stepNotes[i] || ""}
                          onChange={e => setStepNotes(s => ({ ...s, [i]: e.target.value }))}
                        />

                        <button onClick={e => {
                            e.stopPropagation();
                            const nowDone = !stepDone[i];
                            setStepDone(s => ({ ...s, [i]: nowDone }));
                            if (nowDone) setJustCompleted(s => ({ ...s, [i]: true }));
                            setExpandedStep(null);
                          }} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "11px", borderRadius: "9px", border: `1px solid ${isDone ? "rgba(138,170,142,0.5)" : C.border}`, background: isDone ? "rgba(138,170,142,0.1)" : "transparent", color: isDone ? C.sage : C.muted, fontSize: "10.5px", letterSpacing: "2.5px", textTransform: "uppercase", fontFamily: C.font, cursor: "pointer" }}>
                          <span className={justCompleted[i] ? "check-pop" : ""} style={{ fontSize: "14px" }}>{isDone ? "✓" : "○"}</span>
                          {isDone ? "Marked complete" : "Mark as complete"}
                        </button>
                      </div>
                    )}
                  </div>
                  );
                })}
                <div style={divider} />
                <button style={{ ...btnStyle(false), background: allDone ? "linear-gradient(135deg,#d4a853,#b8893a)" : "linear-gradient(135deg,#8aaa8e,#6b9470)", animation: allDone ? "pulse 2s ease-in-out infinite" : "none", color: "#071510" }} onClick={() => go("celebrate")}>
                  {allDone ? "All Steps Complete ✦" : "Begin Reflection →"}
                </button>
              </div>
            </div>
          )}

          {step === "celebrate" && routine && (
            <div style={{ textAlign: "center", paddingTop: "40px" }}>
              <span style={{ fontSize: "72px", display: "block", marginBottom: "20px", animation: "float 4s ease-in-out infinite" }}>{allDone ? "✨" : "🌙"}</span>
              <span style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: C.sage, display: "block", marginBottom: "10px" }}>
                {allDone ? "You showed up" : "Whenever you're ready"}
              </span>
              <h2 style={{ ...hdg, fontSize: "clamp(28px,5vw,42px)", marginBottom: "16px" }}>
                {allDone ? "Every step. All the way through." : "The practice is yours"}
              </h2>
              {routine && (
                <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "15px", color: C.sage, marginBottom: "4px" }}>
                  {`${Object.values(stepDone).filter(Boolean).length} of ${routine.steps.length} steps completed`}
                </p>
              )}
              <div style={card}>
                <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "16px", color: C.muted, lineHeight: 1.85, textAlign: "center", margin: "0 0 20px" }}>
                  {allDone
                    ? "That wasn't nothing. Choosing yourself at the end of a full day — that's the practice. Now let's close it gently."
                    : "However much you did tonight was exactly right. There's nothing to finish perfectly here — only to feel, and to rest. Let's close the day."}
                </p>
                <button style={{ ...btnStyle(false), background: "linear-gradient(135deg,#d4a853,#b8893a)", color: "#071510" }} onClick={() => go("reflection")}>
                  Begin Your Reflection ✦
                </button>
              </div>
            </div>
          )}

          {step === "reflection" && routine && (
            <div>
              <span style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: C.sage, display: "block", marginBottom: "8px" }}>
                {userName.trim() ? `${userName.trim()}'s Reflection` : "Your Reflection"}
              </span>
              <h2 style={{ ...hdg, fontSize: "clamp(28px,5vw,42px)", marginBottom: "24px" }}>Close the day<br/>with honesty</h2>
              <div style={card}>
                <span style={tag}>Three questions from Sage</span>
                {routine.reflection_prompts.map((prompt, i) => (
                  <div key={i}>
                    <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "17px", color: C.muted, lineHeight: 1.7, margin: "0 0 10px" }}>{personalize(prompt)}</p>
                    <textarea style={textareaStyle} placeholder="Write freely, or leave empty…" value={reflections[i] || ""} onChange={e => setReflections(r => ({ ...r, [i]: e.target.value }))} />
                  </div>
                ))}
                <div style={divider} />
                <span style={tag}>One thing I'm grateful for tonight</span>
                <textarea style={{ ...textareaStyle, minHeight: "60px" }} placeholder="Even something small counts…" value={gratitude} onChange={e => setGratitude(e.target.value)} />
                <div style={divider} />
                <span style={tag}>Send this to your future self</span>
                <input type="email" style={{ width: "100%", background: "rgba(255,255,255,0.025)", border: `1px solid ${C.border}`, borderRadius: "10px", padding: "13px", color: C.cream, fontSize: "13.5px", fontFamily: C.font, display: "block", boxSizing: "border-box" }} placeholder="your@email.com" value={emailInput} onChange={e => setEmailInput(e.target.value)} />
                <button style={{ ...btnStyle(!emailInput.includes("@")), marginTop: "14px" }} disabled={!emailInput.includes("@")} onClick={sendEmail}>
                  {emailSent ? "✦ Opening Your Email…" : "Send to Future You ✉"}
                </button>
                <button
                  style={{ ...ghostBtn, marginTop: "8px", color: copied ? C.sage : C.dimmed, borderColor: copied ? "rgba(138,170,142,0.3)" : C.border }}
                  onClick={copyToClipboard}
                >
                  {copied ? "✓ Copied to clipboard" : "Copy summary to clipboard"}
                </button>
                <button style={{ ...ghostBtn, marginTop: "6px" }} onClick={() => go("complete")}>Skip &amp; complete</button>
              </div>
            </div>
          )}

          {step === "complete" && routine && (
            <div style={{ textAlign: "center", paddingTop: "20px" }}>
              <span style={{ fontSize: "80px", display: "block", marginBottom: "20px", animation: "float 4s ease-in-out infinite" }}>🌙</span>
              <span style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: C.sage, display: "block", marginBottom: "8px" }}>
                {userName.trim() ? `Rest well, ${userName.trim()}` : "Rest well"}
              </span>
              <h2 style={{ ...hdg, fontSize: "clamp(32px,6vw,48px)", marginBottom: "24px" }}>Tonight is complete</h2>
              <div style={card}>
                <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "17px", color: C.muted, lineHeight: 1.85, textAlign: "center", margin: "0 0 20px" }}>{personalize(routine.closing_affirmation)}</p>
                <div style={divider} />
                <p style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: "14px", color: C.dimmed, textAlign: "center", margin: "0 0 20px" }}>— Sage 🌙</p>
                <button style={btnStyle(false)} onClick={startOver}>Begin a New Ritual</button>
                <button style={{ ...ghostBtn, marginTop: "12px" }} onClick={() => { setEditingProfile(true); go("onboard1"); }}>Update my profile</button>
                <button style={{ ...ghostBtn, fontSize: "10px", color: "#4a3a3a", borderColor: "rgba(255,255,255,0.03)", marginTop: "4px" }} onClick={clearProfile}>Start fresh</button>
              </div>
            </div>
          )}

        </div>
      </div>
      {showHowItWorks && (
        <div
          onClick={() => setShowHowItWorks(false)}
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(7,16,26,0.93)", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0 0 0 0" }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "480px", background: "#0d1e30", borderRadius: "24px 24px 0 0", padding: "32px 24px 48px", maxHeight: "88vh", overflowY: "auto" }}
          >
            <div style={{ width: "40px", height: "4px", background: "rgba(255,255,255,0.12)", borderRadius: "2px", margin: "0 auto 28px" }} />
            <span style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: C.sage, display: "block", marginBottom: "10px" }}>Transparency</span>
            <h2 style={{ fontFamily: C.serif, fontWeight: "300", color: C.cream, fontSize: "28px", lineHeight: 1.2, margin: "0 0 24px" }}>How Nightly Sage Works</h2>

            {[
              {
                title: "What this app is",
                body: "A static web application — meaning it runs entirely inside your browser. There is no backend server, no database, no account system. Nothing is transmitted to any server when you use it."
              },
              {
                title: "Your ritual content",
                body: "All rituals are written directly into the app — 20 combinations across 5 energy states and 4 time slots. Nothing is generated by an AI in real time during your session. What you read was written by a human, for humans, with care."
              },
              {
                title: "Your onboarding answers",
                body: "Your name and the answers you share are stored only in your browser's localStorage — a small file that lives on your device and nowhere else. It never leaves your device. Clearing your browser or cookie data removes it completely."
              },
              {
                title: "The summary email",
                body: "If you choose to send yourself a summary, it is built entirely in your browser and handed to your own email app via a standard mailto: link. Nightly Sage never sees, handles, stores, or transmits that email."
              },
              {
                title: "What is collected",
                body: "Nothing. No analytics, no tracking pixels, no third-party scripts, no account creation. The only data that exists is what you choose to store locally in your own browser."
              },
              {
                title: "Who built this",
                body: "Nightly Sage is a Sage & Steph creation — a personal project built with intention, care, and a deep commitment to the wellbeing of anyone who uses it."
              },
            ].map(({ title, body }) => (
              <div key={title} style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ display: "block", fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: C.sage, marginBottom: "8px" }}>{title}</span>
                <p style={{ fontFamily: C.serif, fontSize: "16px", color: C.muted, lineHeight: 1.8, margin: 0 }}>{body}</p>
              </div>
            ))}

            <button style={{ ...btnStyle(false), marginTop: "8px" }} onClick={() => setShowHowItWorks(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
