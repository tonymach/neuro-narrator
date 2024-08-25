# Neuroscience-Inspired Narrative AI System

## Project Overview

This project aims to create a narrative AI system inspired by neuroscience principles. It combines elements of storytelling, artificial intelligence, and basic neuroscientific concepts to simulate a more biologically plausible AI agent interacting within a fantasy world.

## Objectives

1. Create an AI system that mimics certain aspects of human cognition and brain function.
2. Develop a dynamic narrative environment that responds to both user input and the AI's internal state.
3. Implement simplified models of neurological processes to influence AI behavior and decision-making.
4. Explore the intersection of artificial intelligence and neuroscience in a creative, interactive context.

## Neuroscience Foundations

Our system is inspired by several key neuroscience concepts:

1. **Brain Waves**: We simulate four types of brain waves (alpha, beta, theta, delta) to influence the AI's cognitive state. These waves are based on the actual brain wave patterns observed in human EEG studies.

2. **Sleep-Wake Cycle**: The system implements a basic circadian rhythm, differentiating between sleep and wake states. This affects memory consolidation and overall neural activity, similar to how human sleep cycles influence cognitive function.

3. **Neural Plasticity**: The AI's goals and memories are dynamic, changing based on experiences and interactions, mimicking the brain's ability to form and modify neural connections.

4. **Memory Systems**: We implement both short-term and long-term memory storage, inspired by the human brain's different memory systems (e.g., working memory and long-term potentiation).

5. **Emotional States**: The AI experiences varying emotional states that influence its decision-making and responses, reflecting the interplay between emotion and cognition in the human brain.

6. **Attention Mechanisms**: The system uses simulated neural activity levels and brain waves to modulate attention, affecting which memories and stimuli are prioritized.

## Implementation

The system is built using the following technologies and approaches:

- **Backend**: Node.js with Express.js for the server-side logic.
- **Database**: MongoDB for storing the AI's memories, goals, and world state.
- **AI Model**: OpenAI's GPT model (gpt-4o-mini) for natural language processing and generation.
- **Frontend**: HTML, CSS, and JavaScript for a simple, interactive user interface.

Key components of the system include:

1. **World State**: Represents the current state of the fantasy world, including location, time, weather, and recent events.

2. **AI State**: Encapsulates the AI's internal condition, including goals, memories, emotional state, and simulated brain activity.

3. **Brain Wave Simulation**: Uses simple sinusoidal functions to simulate different brain wave patterns over time.

4. **Memory Consolidation**: Periodically processes and transfers short-term memories to long-term storage, especially during simulated sleep states.

5. **Dynamic Goal System**: Creates and updates goals based on the AI's experiences and actions.

6. **Narrative Generation**: Uses the AI model to create rich, context-aware narrative responses based on user actions and the current world/AI state.

## Future Directions

This project serves as a starting point for exploring the integration of neuroscience principles in AI systems. Future enhancements could include:

- More complex neural network models to simulate brain regions and their interactions.
- Implementation of reinforcement learning mechanisms to model reward-based learning.
- Integration of visual or auditory processing inspired by sensory cortex functions.
- Expansion of the emotional model to include more nuanced states and their neurological correlates.
- Development of more sophisticated memory retrieval and association mechanisms.

## Conclusion

By combining elements of storytelling, AI, and neuroscience, this project aims to create a unique, biologically-inspired interactive experience. It serves as both an educational tool for understanding basic neuroscience concepts and a playground for exploring new approaches to AI system design.
