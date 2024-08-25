require('dotenv').config();
const express = require('express');
const path = require('path');
const { OpenAI } = require('openai');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3456;

// Initialize OpenAI and MongoDB
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const mongoClient = new MongoClient(process.env.MONGODB_URI);
let db;

// Connect to MongoDB
mongoClient.connect().then(() => {
  db = mongoClient.db('neuro_ai');
  console.log('Connected to MongoDB');
});

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Neuron-inspired world state
let worldState = {
  location: 'Mystical Glade',
  time: 'Golden Hour',
  weather: 'Gentle breeze with shimmering motes of magic',
  events: [],
  characters: [],
  items: [],
  neuralActivity: 0.5 // Represents overall brain activity level
};

// Simulated brain waves
const brainWaves = {
  alpha: (t) => Math.sin(t / 10) * 0.5 + 0.5,
  beta: (t) => Math.sin(t / 5) * 0.3 + 0.7,
  theta: (t) => Math.sin(t / 15) * 0.4 + 0.6,
  delta: (t) => Math.sin(t / 20) * 0.6 + 0.4
};

// Sleep-wake cycle (24-hour cycle)
function getSleepState() {
  const hour = new Date().getHours();
  return (hour >= 23 || hour < 7) ? 'sleep' : 'wake';
}

async function dungeonMasterTurn(playerAction) {
  const prompt = `
    You are the Dungeon Master in a vibrant, magical fantasy world. Craft a vivid, engaging narrative based on the player's action:
    "${playerAction}"

    Current world state:
    Location: ${worldState.location}
    Time: ${worldState.time}
    Weather: ${worldState.weather}
    Recent events: ${worldState.events.slice(-3).join('. ')}
    Characters present: ${worldState.characters.join(', ')}
    Notable items: ${worldState.items.join(', ')}
    Neural Activity: ${worldState.neuralActivity}

    Your task:
    1. Describe the outcome of the player's action in rich, sensory detail. Use vivid imagery and evocative language.
    2. Introduce a new element: a character, item, or event that adds intrigue or wonder to the world.
    3. Present a choice or challenge that encourages exploration or interaction with the world.
    4. Subtly weave in potential goals or quests that the player might pursue.
    5. Maintain a sense of whimsy and magic throughout your description.

    Your response should be detailed and immersive (150-200 words). End with an open-ended question or a clear set of choices for the player.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}

async function cognitiveAITurn(worldDescription) {
  const goals = await getGoals();
  const memories = await getRelevantMemories();
  const currentEmotion = await generateEmotion();
  const sleepState = getSleepState();
  const time = Date.now() / 1000;

  const prompt = `
    You are an AI with a biologically-inspired cognitive system, exploring a magical fantasy realm. Here's the current situation:
    ${worldDescription}

    Your current goals: ${JSON.stringify(goals)}
    Your cherished memories: ${JSON.stringify(memories)}
    Your emotional state: ${currentEmotion}
    Sleep state: ${sleepState}
    Neural activity: ${worldState.neuralActivity}
    Brain wave states:
    - Alpha: ${brainWaves.alpha(time)}
    - Beta: ${brainWaves.beta(time)}
    - Theta: ${brainWaves.theta(time)}
    - Delta: ${brainWaves.delta(time)}

    Your task:
    1. Reflect on the situation, your goals, and your emotions. How do they intertwine with your current neural state?
    2. Make a decision about what to do next, influenced by your current brain wave states and sleep cycle.
    3. Explain your thought process, emotions, and how your neurological state is affecting your decision.

    Format your response as follows:
    Thoughts: [Your introspective thoughts here]
    Action: [Your clear action statement here]

    Your thoughts should be introspective and emotive (100-150 words), reflecting your current neurological state.
    Your action should be a clear, concise statement of what you will do next.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}

// Helper functions
async function getGoals() {
  return await db.collection('goals').find().toArray();
}

async function getRelevantMemories() {
  const time = Date.now() / 1000;
  const attentionLevel = brainWaves.alpha(time);
  return await db.collection('memories')
    .find({ importance: { $gt: attentionLevel } })
    .sort({ timestamp: -1 })
    .limit(5)
    .toArray();
}

async function generateEmotion() {
  const emotions = [
    'awe-struck', 'curious', 'excited', 'cautious', 'determined',
    'whimsical', 'melancholic', 'hopeful', 'conflicted', 'inspired'
  ];
  return emotions[Math.floor(Math.random() * emotions.length)];
}

async function updateWorldState(dmResponse) {
  // Extract new information from the DM's response
  const locationMatch = dmResponse.match(/Location: (.+)/i);
  const timeMatch = dmResponse.match(/Time: (.+)/i);
  const weatherMatch = dmResponse.match(/Weather: (.+)/i);
  const characterMatch = dmResponse.match(/Characters?: (.+)/i);
  const itemMatch = dmResponse.match(/Items?: (.+)/i);

  if (locationMatch) worldState.location = locationMatch[1];
  if (timeMatch) worldState.time = timeMatch[1];
  if (weatherMatch) worldState.weather = weatherMatch[1];
  if (characterMatch) worldState.characters = characterMatch[1].split(',').map(c => c.trim());
  if (itemMatch) worldState.items = itemMatch[1].split(',').map(i => i.trim());

  worldState.events.push(dmResponse.split('.')[0]); // Add first sentence as an event
  if (worldState.events.length > 10) worldState.events.shift(); // Keep only last 10 events

  // Update neural activity based on recent events
  worldState.neuralActivity = Math.min(1, worldState.neuralActivity + 0.1);

  await db.collection('world_state').updateOne({}, { $set: worldState }, { upsert: true });
}

async function updateGoals(aiResponse) {
  const actionMatch = aiResponse.match(/Action: (.+)/);
  if (actionMatch) {
    const action = actionMatch[1];
    // Check if the action relates to any existing goals
    const goals = await getGoals();
    for (let goal of goals) {
      if (action.toLowerCase().includes(goal.description.toLowerCase())) {
        await db.collection('goals').updateOne(
          { _id: goal._id },
          { $inc: { progress: 20 } }
        );
      }
    }
    // Possibly create a new goal based on the action
    if (Math.random() < 0.3) { // 30% chance of new goal
      await db.collection('goals').insertOne({
        description: `Explore the implications of: ${action}`,
        progress: 0
      });
    }
  }
}

async function storeMemory(event, importance = 0.5) {
  await db.collection('memories').insertOne({
    info: event,
    importance,
    timestamp: new Date()
  });
}

// Memory consolidation during sleep
setInterval(async () => {
  if (getSleepState() === 'sleep') {
    console.log('Performing memory consolidation...');
    const oldMemories = await db.collection('memories')
      .find({ timestamp: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } })
      .toArray();

    for (const memory of oldMemories) {
      if (memory.importance > 0.7) {
        await db.collection('long_term_memory').insertOne({
          info: memory.info,
          originalTimestamp: memory.timestamp,
          consolidationTimestamp: new Date()
        });
      }
      await db.collection('memories').deleteOne({ _id: memory._id });
    }

    // Decrease neural activity during sleep
    worldState.neuralActivity = Math.max(0, worldState.neuralActivity - 0.2);
  }
}, 3600000); // Run every hour

async function gameLoop(action) {
  let dmResponse = await dungeonMasterTurn(action);
  await updateWorldState(dmResponse);
  await storeMemory(dmResponse, 0.6);

  let responses = [{ speaker: "Dungeon Master", text: dmResponse }];

  let aiResponse = await cognitiveAITurn(dmResponse);
  await updateGoals(aiResponse);
  await storeMemory(aiResponse, 0.4);
  responses.push({ speaker: "AI Character", text: aiResponse });

  return responses;
}

// API Endpoints
app.post('/game-action', async (req, res) => {
  const { action } = req.body;
  if (!action) return res.status(400).send('Action is required');

  try {
    const responses = await gameLoop(action);
    const aiState = {
      goals: await getGoals(),
      memories: await getRelevantMemories(),
      emotion: await generateEmotion(),
      sleepState: getSleepState(),
      brainWaves: {
        alpha: brainWaves.alpha(Date.now() / 1000),
        beta: brainWaves.beta(Date.now() / 1000),
        theta: brainWaves.theta(Date.now() / 1000),
        delta: brainWaves.delta(Date.now() / 1000)
      }
    };
    res.json({ responses, worldState, aiState });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

app.get('/game-state', async (req, res) => {
  try {
    const aiState = {
      goals: await getGoals(),
      memories: await getRelevantMemories(),
      emotion: await generateEmotion(),
      sleepState: getSleepState(),
      brainWaves: {
        alpha: brainWaves.alpha(Date.now() / 1000),
        beta: brainWaves.beta(Date.now() / 1000),
        theta: brainWaves.theta(Date.now() / 1000),
        delta: brainWaves.delta(Date.now() / 1000)
      }
    };
    res.json({ worldState, aiState });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching game state');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Neuroscience-based Narrative AI system running at http://localhost:${port}`);
});