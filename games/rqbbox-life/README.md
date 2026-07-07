# RQBBOX LIFE

**Flagship Life-Sandbox Simulation for RQBBOX OS / RQBBOX Experience OS 1.0**

> *Version 1.0.0 — July 2026*

---

## Table of Contents

1. [Game Concept](#1-game-concept)
2. [Feature List](#2-feature-list)
3. [World Description](#3-world-description)
4. [Characters & NPC Roles](#4-characters--npc-roles)
5. [UI Mockups (Text-Based)](#5-ui-mockups-text-based)
6. [Logo Description](#6-logo-description)
7. [RQBBOX Experience OS 1.0 Integration Notes](#7-rqbbox-mode-integration-notes)
8. [Gameplay Loop & Progression](#8-gameplay-loop--progression)
9. [Monetization (Non-Pay-to-Win)](#9-monetization-non-pay-to-win)
10. [Technical Architecture](#10-technical-architecture)

---

## 1. Game Concept

RQBBOX LIFE is a neon-drenched, open-ended life simulation where every player writes their own story. Set in the sprawling, futuristic **RQBBOX City**, players start with nothing and build everything: career, home, relationships, wealth, and legacy.

Inspired by the sandbox freedom of Tondachai Life and the modular polish of the RQBBOX ecosystem, RQBBOX LIFE blends **deep simulation systems**, **real-time day/night phases**, **procedural NPC relationships**, and **quick-session gameplay** designed for both casual pick-up-and-play and long-form immersive sessions.

### Core Pillars

| Pillar | Description |
|--------|-------------|
| **Freedom** | No scripted path. Every activity, job, purchase, and relationship is player-driven. |
| **Progression** | Stats, career levels, housing tiers, vehicle upgrades, and social standing create a tangible sense of growth. |
| **Atmosphere** | A cyberpunk-lite, neon-accented world with dynamic weather, day/night cycles, and a pulsing synthwave soul. |
| **Modularity** | Every system (jobs, housing, vehicles, social, events) is self-contained, extensible, and plugin-ready. |
| **RQBBOX DNA** | Full integration with RQBBOX Experience OS 1.0 overlays, Quick Resume, achievements, cloud saves, and controller-first UX. |

---

## 2. Feature List

### Character System
- Custom name and lifestyle archetype (Explorer, Socialite, Hustler, Creator)
- 6 core stats: **Health**, **Energy**, **Happiness**, **Social**, **Career**, **Money**
- Visual age progression with stat-modifying birthdays every 10 days
- Stat caps of 100 (except Money) with diminishing returns and decay

### Phase-Based Day System
- 4 daily phases: **Morning** (prepare), **Day** (work/explore), **Evening** (wind down), **Night** (rest/revel)
- 6-8 unique activities per phase with contextual stat effects
- Passive daily income from jobs, passive costs from lifestyle
- Phase actions are independent — play 1 or all 4 phases per session

### Job & Career System
- 10 career paths from Cashier to CEO, each with unique pay and requirements
- Career level tracks professional growth; unlocks higher-tier jobs
- Vehicle and social requirements gate certain careers
- Daily wages paid automatically at day rollover

### Housing System
- 6 tiers: Studio Apartment → Downtown Loft → Suburban House → Penthouse Suite → Smart Villa → Cyber Estate
- Higher tiers provide better energy recovery and happiness bonuses
- Each tier changes the narrative description of your residence

### Vehicle System
- 7 vehicles: Bicycle → Scooter → Compact Car → Sports Coupe → Electric SUV → Hypercar → Hoverbike
- Vehicles gate certain jobs (e.g., Delivery Driver) and side hustles
- Speed stat has narrative effects on commute efficiency

### Shop & Inventory
- 10 purchasable items (consumables, boosters, skill books)
- Items provide immediate stat boosts; some can be sold back
- Inventory tracked with quantities, visible in HUD sidebar

### Social System
- Procedurally generated NPCs with names and personality traits
- Friendship levels from 10-100% displayed as hearts
- "Meet New People" action adds friends based on Social stat
- Social events, friend conflicts, and relationship decay

### Dynamic Events
- 8 random event types (promotions, found money, health scares, festivals, side quests, etc.)
- 15% chance per action, max 2 per day to prevent overload
- Branching choices with different stat outcomes (good/bad)

### Weather System
- 6 weather types: Clear, Cloudy, Rainy, Stormy, Snowy, Rainbow
- Changes every 3 days with atmospheric display in the HUD

### Achievement System
- 15 achievements tracking milestones across all systems
- Unlock notifications via animated overlay popup
- Persisted across sessions via localStorage

### RQBBOX OS Features
- **Cloud Save** via localStorage with save/load
- **Quick Resume** compatible (save state preserves full game)
- **FPS Counter** in top bar
- **Performance Mode** toggle (future GPU optimizations)
- **Controller Support** via Gamepad API (A/B/Start bindings)
- **Screenshot Ready** (Ctrl+Shift+S via RQBBOX Experience OS 1.0)

---

## 3. World Description

### RQBBOX City

A sprawling neon metropolis where digital and physical realities blur. The city is divided into several distinct districts, though in the current version they are represented as phase-based activity contexts:

| District | Vibe | Activities |
|----------|------|------------|
| **Neon Core** | City center with towering holographic billboards, elevated walkways, and 24/7 energy | Shopping, dining, nightlife, festivals |
| **Circuit Park** | A massive green space ringed by glowing LED trees and interactive art installations | Exercise, stargazing, socializing, walking |
| **Data Row** | The tech and business district with sleek glass towers and autonomous transit | Jobs (tech, corporate), libraries, coffee shops |
| **Harbor Lights** | Waterfront district with converted warehouses, indie cafés, and artisan shops | Side hustles, dining out, hobby studios |
| **Residential Spires** | Stacked living towers with sky gardens and communal spaces | Home base, cooking, TV, game nights |
| **The Glow Markets** | Underground bazaar network with neon awnings and holo-vendors | Shopping, odd jobs, meeting new people |

### Visual Atmosphere
- **Sky**: Deep indigo with cyan-tinged clouds; sunsets are magenta-to-teal gradients
- **Lighting**: Every surface has subtle glow-mapping; neon strip lighting defines paths
- **Soundscape**: Synthwave ambient with dynamic intensity shifts based on phase (chill morning → energetic day → mellow evening → pulsing night)
- **Tech Level**: Near-future cyberpunk-lite — holograms, AI assistants, hover-vehicles exist alongside analog shops and street food

---

## 4. Characters & NPC Roles

### Procedural NPC System

All NPCs are procedurally generated with two key attributes:

| Attribute | Pool |
|-----------|------|
| **Names** | Alex, Jordan, Sam, Riley, Casey, Quinn, Taylor, Morgan, Avery, Reese, Skyler, Parker, Drew, Harper, Emerson, Blake, Cameron, Dakota, Hayden, Sage |
| **Traits** | Friendly, Shy, Energetic, Calm, Funny, Serious, Creative, Logical, Adventurous, Cozy |

### NPC Roles (Future Expansion)

| Role | Description | Planned Feature |
|------|-------------|-----------------|
| **Mentor** | Guides new players; appears randomly in early days | Tutorial system |
| **Rival** | Competes for jobs, social standing, or romantic interests | Competitive events |
| **Landlord** | Manages housing upgrades and rent collection | Expanded housing |
| **Merchant** | Runs shops; offers rare items on rotation | Dynamic economy |
| **Quest Giver** | Offers time-limited side missions | Mission system |
| **Dateable NPCs** | Romance system with relationship trees | Social expansion |

### Current NPC Implementation
- 20 base names × 10 traits = 200 unique NPC combinations
- Friendship level (0-100%) tracked per NPC
- Maximum 15 friends in active social circle

---

## 5. UI Mockups (Text-Based)

### Main Menu
```
┌──────────────────────────────────────────────┐
│                                              │
│             RQBBOX                           │
│         L I F E — S I M U L A T I O N        │
│                                              │
│        ┌──────────────────────────┐          │
│        │       NEW LIFE           │  ◄ cyan  │
│        ├──────────────────────────┤          │
│        │        ABOUT             │          │
│        └──────────────────────────┘          │
│                                              │
│              v1.0 · RQBBOX OS               │
└──────────────────────────────────────────────┘
```

### Character Creator
```
┌──────────────────────────────────────────────┐
│           CREATE YOUR LIFE                   │
│                                              │
│  NAME: [________________________]            │
│                                              │
│  STYLE:                                      │
│  ┌──────────┐ ┌──────────┐                  │
│  │🌍Explorer│ │🎉Socialite│                  │
│  ├──────────┤ ├──────────┤                  │
│  │💼 Hustler│ │🎨 Creator │                  │
│  └──────────┘ └──────────┘                  │
│                                              │
│  ┌──────────────────────────┐                │
│  │       BEGIN LIFE         │                │
│  └──────────────────────────┘                │
└──────────────────────────────────────────────┘
```

### Game HUD (Phase View)
```
┌─RQBBOX LIFE──┬─MORNING──┬─☀️ Clear──┬─Day 1·Age 18──┬─FPS: 60─┐
│ ❤️████████ 100│⚡████████ 100│😊████████  80│👥█████    50│ 💼███     10│ 💰$500    │
├────────────────────────────────────────────────────────────────────┤
│                                                      │             │
│ 🌅 MORNING                                           │   💰 $500   │
│ Start your day. What will you do?                    │   BALANCE   │
│                                                      │             │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐              │ 🏠 Studio   │
│ │🧘Meditate │ │🏃Exercise│ │🍳Cook    │              │   Apt       │
│ │Calm mind  │ │Stay fit  │ │Breakfast │              │             │
│ │😊+8⚡+5   │ │❤️+10⚡-5 │ │❤️+8⚡+10 │              │ 🚲 Bicycle  │
│ └──────────┘ └──────────┘ └──────────┘              │             │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐              │ 💼 Unempl. │
│ │📰Read    │ │🚿Shower  │ │💻Remote  │              │             │
│ │News      │ │Fresh     │ │Work      │              │🎒 Inventory │
│ │💼+3😊+2  │ │⚡+8😊+3  │ │💰+30⚡-5 │              │ [Empty]     │
│ └──────────┘ └──────────┘ └──────────┘              │             │
│                                                      │ 👥 Friends  │
│ [NEXT PHASE →]                                       │ Meet people │
│ ─────────────────────────────────────                │             │
│ LIFE LOG                                             │ 🛒 Shop     │
│ [Day 1] Your new life begins...                      │ 💼 Careers  │
│                                                      │ 🏠 Housing  │
│                                                      │ 🚗 Vehicles │
│                                                      │ 👥 Social   │
│                                                      │ ⏸ Pause    │
└──────────────────────────────────────────────────────┴─────────────┘
```

### Overlay: Shop
```
┌──────────────────────────────────────────────┐
│  ✕                                           │
│           🛒 SHOP                            │
│    Buy items to boost your stats and life.   │
│                                              │
│  ☕ Energy Coffee ............... $15         │
│     Boost energy +15                         │
│  🍱 Healthy Meal ................ $25         │
│     Boost health +10, energy +10             │
│  🎁 Gift Box .................... $30         │
│     +15 social when gifted                   │
│  🎮 Game Cartridge .............. $50         │
│     +20 happiness when played                │
│  📚 Skill Book .................. $40         │
│     +5 career progress                        │
│  ...                                          │
└──────────────────────────────────────────────┘
```

### Overlay: Pause Menu (RQBBOX Experience OS 1.0 Style)
```
┌──────────────────────────────────────────────┐
│                                              │
│              ⏸ PAUSED                       │
│                                              │
│        ┌──────────┐  ┌──────────┐            │
│        │    ▶     │  │   🏆     │            │
│        │  Resume  │  │Achievem. │            │
│        ├──────────┤  ├──────────┤            │
│        │    ⚡    │  │   💾     │            │
│        │Perf: OFF │  │Save&Quit │            │
│        └──────────┘  └──────────┘            │
│                                              │
│    RQBBOX Experience OS 1.0 · Ctrl+Shift+P               │
└──────────────────────────────────────────────┘
```

### Event Popup
```
┌──────────────────────────────────────────────┐
│                                              │
│                 🍀                          │
│           FOUND MONEY!                      │
│                                              │
│   You found an envelope with cash on the     │
│   sidewalk. What do you do?                  │
│                                              │
│    ┌──────────┐    ┌──────────┐              │
│    │ Keep it  │    │Turn it in│              │
│    │  +$100   │    │ +Social  │              │
│    └──────────┘    └──────────┘              │
└──────────────────────────────────────────────┘
```

### Age-Up Screen
```
┌──────────────────────────────────────────────┐
│                                              │
│            🎂 AGE 21                        │
│                                              │
│    A new year of life begins.                │
│                                              │
│  ┌──────────────┐ ┌──────────────┐           │
│  │ 😊 Happiness │ │ 💼 Career    │           │
│  │    +3        │ │    +5        │           │
│  └──────────────┘ └──────────────┘           │
│                                              │
│         [ CONTINUE ]                         │
└──────────────────────────────────────────────┘
```

---

## 6. Logo Description

The **RQBBOX LIFE** logo follows the RQBBOX OS brand identity while establishing its own sub-brand character.

### Design
```
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█  ██████╗ ██████╗ ██████╗ ██████╗ ██╗  ██╗
█  ██╔══██╗██╔══██╗╚══██╔══╝██╔═══╝ ╚██╗██╔╝
█  ██████╔╝██████╔╝   ██║   ██║      ╚███╔╝
█  ██╔══██╗██╔══██╗   ██║   ██║      ██╔██╗
█  ██║  ██║██║  ██║   ██║   ╚██████╗██╔╝ ██╗
█  ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝╚═╝  ╚═╝
█                                              
█           ██╗     ██╗███████╗███████╗        
█           ██║     ██║██╔════╝██╔════╝        
█           ██║  █  ██║█████╗  █████╗          
█           ██║ ██╗ ██║██╔══╝  ██╔══╝          
█           ╚███╔███╔╝██║     ██║              
█            ╚══╝╚══╝ ╚═╝     ╚═╝              
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
```

### Visual Specifications
- **Primary text**: "RQBBOX" set in heavy weight (800), letter-spacing 4px, filled with the signature green gradient (#0a5c0a → #1db954)
- **Secondary text**: "LIFE" set below in light weight (200), letter-spacing 8px, filled with cyan (#00d4ff → #0088cc)
- **Icon mark**: A central triangular "play" symbol inside dual concentric circles, pulsing with a cyan glow, representing the life force / heartbeat of the simulation
- **Background**: Deep navy (#0a0a1a → #101030) with subtle grid overlay (3% opacity)
- **Version badge**: Pill-shaped badge in bottom-right with green border
- **Animation**: The play icon pulses at 2s intervals to suggest life and energy

### Usage
- Full logo on splash screen and main menu
- Compact mark (icon only) as the game tile in RQBBOX Experience OS 1.0 game library
- Text-only variant ("RQBBOX LIFE") in the HUD top bar

---

## 7. RQBBOX Experience OS 1.0 Integration Notes

### Architecture

RQBBOX LIFE is designed as a **first-class RQBBOX Experience OS 1.0 application**, living in the `games/rqbbox-life/` directory alongside other native titles. Integration points:

| Component | Integration |
|-----------|-------------|
| **Launcher** | Registered in `games/catalog.json` as `"id": "rqbbox-life"` |
| **Dashboard Tile** | Launches via RQBBOX Experience OS 1.0's game launcher (`/api/launch`) |
| **Quick Resume** | Game state serialized to `localStorage`; can be saved/restored via `POST /api/quick-resume` |
| **FPS Overlay** | Built-in FPS counter in top bar (matches RQBBOX Experience OS 1.0 style) |
| **Performance Mode** | Toggle in pause menu that disables visual effects and frees memory |
| **Capture** | RQBBOX Experience OS 1.0 screenshot/DVR captures the game via the overlay |
| **Controller** | Uses Gamepad API with standard RQBBOX Experience OS 1.0 bindings |
| **Achievements** | Fire achievement notifications using the same style as RQBBOX Experience OS 1.0 system |
| **Theme Engine** | CSS variables can be swapped via RQBBOX Experience OS 1.0's theme system |
| **Cloud Sync** | Save data can be synced through RQBBOX OS profile system |

### Controller Bindings

| Button | Action |
|--------|--------|
| **D-pad** | Navigate activities and menu items |
| **A** | Select / confirm activity |
| **B** | Back / close overlay / dismiss event |
| **Start** | Open/close pause menu |
| **Guide** | Open RQBBOX Experience OS 1.0 Guide overlay |

### Quick Resume Protocol

```
1. Player pauses game → "Save & Quit" selected
2. State serialized to JSON → stored in localStorage + optionally sent to /api/quick-resume
3. On relaunch, detect save → offer "Continue" option on main menu
4. State fully restored including day, phase, stats, inventory, friends, job, housing, vehicles
```

### Performance Mode Effects

| Setting | Effect |
|---------|--------|
| **Balanced** (default) | Full animations, backdrop blur, glow effects |
| **Performance ON** | Disables backdrop blur, reduces animation frames, removes particle effects, simplifies shadows |
| **Max FPS** | Caps at 60fps with vsync, reduces UI update frequency |

### RQBBOX OS Editions Support

| Edition | Support |
|---------|---------|
| **Lite** | Basic life sim with core phases, stats, and activities |
| **Pro** | Full game including all overlays, events, achievements, controller support |
| **Creator** | Pro + plugin hooks for custom events, items, jobs, and theme overrides |

---

## 8. Gameplay Loop & Progression

### Core Loop

```
        ┌─────────────────────────────────────────┐
        │                                         │
        │   MORNING (6 activities)                │
        │   Prepare for the day                   │
        │         │                               │
        │         ▼                               │
        │   DAY (8 activities)                    │
        │   Work, explore, shop, socialize        │
        │         │                               │
        │         ▼                               │
        │   EVENING (7 activities)                │
        │   Unwind, hobbies, social               │
        │         │                               │
        │         ▼                               │
        │   NIGHT (6 activities)                  │
        │   Rest, party, night work               │
        │         │                               │
        │         ▼                               │
        │   DAY ROLLOVER                          │
        │   • Passive income from job             │
        │   • Living expenses deducted            │
        │   • House rest bonus applied            │
        │   • Stat decay (health -2, etc.)        │
        │   • Weather update (every 3 days)       │
        │   • Age up check (every 10 days)        │
        │   • Achievement check                   │
        │         │                               │
        │         ▼                               │
        │   Repeat cycle with new day             │
        │                                         │
        └─────────────────────────────────────────┘
```

### Progression Arcs

#### Short-Term (Per Day)
- Complete all 4 phases for maximum daily progress
- Buy items for immediate stat boosts
- Make 1-2 new friends per day (Social permitting)
- Respond to random events for bonuses

#### Medium-Term (Per 10 Days / Age Up)
- Age up with cumulative stat bonuses
- Save money for housing upgrade ($5k → $15k → $40k → etc.)
- Advance career level to unlock better jobs
- Upgrade vehicle tier for job access and speed

#### Long-Term (Per 30+ Days)
- Reach career level 50+ for top-tier jobs (CEO, Doctor)
- Accumulate $100k+ for luxury housing and hypercars
- Build a social circle of 10+ friends
- Unlock 15 achievements
- Reach age milestones (30, 50+)

### Emergent Stories

The combination of **phase activities**, **random events**, **career progression**, and **social dynamics** creates emergent narratives:

- *"I started as a Cashier, saved up for a Scooter, got a Delivery job, then studied at the Library every night until I qualified as a Software Engineer. Now I live in a Penthouse."*
- *"I ignored my health for too long. Got a health scare event, spent my savings on meds, had to rebuild from scratch."*
- *"I made friends with a Creative named Blake, we hung out every evening. By Day 40, my social circle had 12 friends and I got the 'Life of the Party' achievement."*

### Difficulty Balance

| Stat | Decay Rate | Recovery Methods |
|------|-----------|------------------|
| **Health** | -2/day | Exercise, cook, meds, sleep |
| **Energy** | Recharges at night | Sleep, house rest bonus, coffee |
| **Happiness** | -3/day | Hobbies, social, shopping, dining |
| **Social** | -2/day | Socialize, meet people, events |
| **Career** | Static (only increases) | Work, study, skill books |
| **Money** | Living costs + optional spend | Job income, side hustles, events |

---

## 9. Monetization (Non-Pay-to-Win)

RQBBOX LIFE follows the RQBBOX OS philosophy: **all core gameplay is free and complete**. Monetization is optional, cosmetic, and content-expanding only.

### Model: Premium Expansion Packs

| Pack | Price | Content |
|------|-------|---------|
| **Base Game** | Free | Full simulation as described — all jobs, housing, vehicles, items, events, achievements |
| **Neon Nights Pack** | $4.99 | 3 new Night activities (club DJing, rooftop parties, night markets), 5 exclusive NPCs, 2 new weather types (Aurora, Neon Fog), soundtrack expansion |
| **Urban Explorer Pack** | $4.99 | 2 new Day districts (Arcade Row, Rooftop Gardens), 10 side quests, 3 new vehicles (Electric Skateboard, Tuk-Tuk, Gyrocopter), camera mode |
| **Social Butterfly Pack** | $4.99 | Romance system with 6 dateable NPCs, gift-giving mechanics, relationship milestones, wedding event, pet system (cat/dog) |
| **Creator Toolkit** | $9.99 | Custom event editor, custom item creator, custom job designer, theme overrides, shareable content packs |

### Optional: Cosmetic Store (In-Game Currency Only)
- All cosmetics purchasable with earned in-game money ($$), not real currency
- Outfit skins for the player avatar
- Vehicle paint jobs
- House interior themes
- Nameplate borders and chat styles

### Strictly No Pay-to-Win
- No stat boosts purchasable with real money
- No time skips or energy refills for purchase
- No exclusive jobs/items behind paywalls
- Expansion packs add content categories, not power advantages

### RQBBOX OS Cross-Buy
- Purchases sync via RQBBOX Cloud profile
- Content packs usable across any device running RQBBOX OS
- Save data portable between editions

---

## 10. Technical Architecture

### Current Implementation (v1.0)
- **Engine**: Vanilla HTML5 + CSS3 + JavaScript (ES6)
- **Rendering**: DOM-based UI with CSS transitions/animations
- **Storage**: localStorage for save data + achievements
- **Controller**: Gamepad API with polling loop
- **Dependencies**: Zero external libraries — fully self-contained
- **File Size**: ~45KB (index.html) + ~3KB (icon.svg)

### HTML Structure
```
games/rqbbox-life/
├── index.html        # Full game (splash, menu, creator, HUD, overlays, game logic)
├── icon.svg          # Game tile icon
└── README.md         # This document
```

### State Architecture
```
state = {
  player: { name, style, age, health, energy, happiness, social, money, career },
  day, phase, weather, eventsToday,
  house, vehicle, job,
  inventory: [itemIds],
  friends: [{ name, trait, level }],
  achievements: [achievementIds],
  eventLog: [{ text, type, day, phase }],
  // meta
  totalDaysPlayed, totalMoneyEarned, jobsHeld, friendsMade, itemsBought
}
```

### Future Architecture (v2.0+ Roadmap)

| Component | Target Tech | Status |
|-----------|-------------|--------|
| Canvas rendering for city view | HTML5 Canvas + requestAnimationFrame | Planned |
| Audio engine with dynamic soundtrack | Web Audio API (synthwave generator) | Planned |
| WebGL particle effects (neon rain, city lights) | Three.js or raw WebGL | Investigation |
| Multiplayer social zones | WebSocket + simple position sync | Investigation |
| RQBBOX Cloud API sync | Fetch to RQBBOX OS /api/cloud | Planned |
| Plugin engine (custom events/items) | Sandboxed eval + schema validation | Planned |
| Mobile touch controls | Touch event layer | Planned |
| Localization (i18n) | JSON string tables | Planned |

### Performance Targets
- **Load time**: < 1s on modern hardware (single file, no external requests)
- **Memory**: < 50MB heap usage
- **FPS**: 60fps on mid-range hardware, 30fps minimum on low-end
- **Save size**: ~5-10KB per save slot
- **Controller latency**: < 16ms input-to-action

---

## RQBBOX

*Plug Into Gaming.*

**RQBBOX LIFE** — Live your neon life. Build your legacy.

© 2026 RhysTech. Part of the RQBBOX OS ecosystem.
