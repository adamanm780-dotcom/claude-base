# Deep Research: Hermes Agent (Selbstverbesserungssystem) vs. OpenClaw

> Research-Datum: 2026-04-27
> Zweck: Grundlage für einen ChatGPT Image 2 Prompt, der den Vergleich visualisiert.

---

## 1. Hermes Agent – Nous Research

### Identität & Branding
- Hersteller: **Nous Research**, veröffentlicht Februar 2026
- Symbol: **Caduceus** ☤ (Hermesstab mit zwei verschlungenen Schlangen, geflügelt) – Anlehnung an den griechischen Götterboten
- Bildsprache: mythologisch, klassisch, "wachsend mit dir" (the agent that grows with you)
- Skin/Theme-System: konfigurierbare Banner-Farben, Spinner-Faces, Branding-Texte

### Selbstverbesserungssystem (Kernfeature)
1. **Skill-Erzeugung**: Nach komplexen Aufgaben (≥ 5 Tool-Calls) erstellt der Agent autonom eine `SKILL.md` (YAML-Frontmatter + Sektionen *When to Use, Quick Reference, Procedure, Pitfalls, Verification*).
2. **Self-Evaluation-Checkpoint**: Alle 15 Tool-Calls fragt sich der Agent, ob das Ergebnis als wiederverwendbare Prozedur taugt.
3. **Skill-Refinement**: Bestehende Skills verbessern sich während der Nutzung selbst, sobald ein besserer Weg entdeckt wird.
4. **Drei-Schicht-Memory**:
   - Layer 1 – *Frozen System Prompt* (immer geladen)
   - Layer 2 – *Episodic Memory / Skills* (`~/.hermes/skills/`)
   - Layer 3 – *Session Search* (SQLite FTS5 + LLM-Summarization)
5. **Token-effizientes Loading**: Level 0 (nur Namen, ~3K Tokens für 40+ Skills) → Level 1 (volles SKILL.md) → Level 2 (Referenzdateien).
6. **Honcho dialectic user modeling**: persistentes Modell des Users über Sessions hinweg.

### Laufzeit-Backends
local · Docker · SSH · Daytona · Singularity · Modal (serverless)

### Designphilosophie
**Agent-first**: der Execution-Loop ("do, learn, improve") steht im Zentrum, alles drumherum dient der Tiefe des Lernens.

---

## 2. OpenClaw – Peter Steinberger / Community

### Identität & Branding
- Ursprung: November 2025 als *Clawdbot* (Wortspiel auf "Claude" + "Claw"), umbenannt zu *Moltbot* (Jan 2026) nach Anthropic-Markenstreit, dann zu **OpenClaw**
- Symbol: **Roter Hummer** (fierce, smiling lobster) – Pixel-Art-Variante (`pixel-lobster.svg`)
- Metapher: **Molting** – der Hummer wirft seinen Panzer ab, um zu wachsen → Open-Source-Wachstum
- Subkultur: "Crustafarianism" (Community-Lore mit 64 Propheten, 115 Versen)
- GitHub: meiststarred-Repo der Geschichte (~347 K Stars, April 2026)

### Architektur (Gateway-first)
- Zentrale **Orchestrations-/Gateway-Schicht** routet Requests
- Persistente Daemon-Schicht mit Heartbeat-Scheduler
- 12+ Messaging-Plattformen: WhatsApp, Telegram, Slack, Discord, Signal, iMessage, IRC, Teams, Matrix, Feishu, LINE, WeChat …
- Eigene API-Keys (Claude, GPT, Gemini, Ollama lokal)
- ReAct-Loop, Tool-Layer, Skill-/Prompt-System
- 162+ produktionsreife Agent-Templates (`awesome-openclaw-agents`)

### Skills bei OpenClaw
- **statisch**: vom User geschrieben und gepflegt (`SOUL.md`-Konfigs)
- kein autonomes Self-Improvement
- größeres Skill-Ökosystem, dafür manuell

### Designphilosophie
**Gateway-first**: maximale Reichweite, breite Plattform-Abdeckung, "always-on personal assistant".

---

## 3. Direkter Vergleich

| Dimension | Hermes Agent | OpenClaw |
|---|---|---|
| Maskottchen / Symbol | Caduceus ☤ (geflügelter Schlangenstab) | Roter Pixel-Hummer 🦞 |
| Philosophie | Agent-first, Tiefe des Lernens | Gateway-first, Reichweite |
| Skills | autonom erzeugt + selbstverbessernd | statisch, vom User geschrieben |
| Memory | 3-Layer (Prompt + Skills + FTS5) | persistent zwischen Sessions, weniger strukturiert |
| Self-Improvement | **Kernfeature** (Checkpoint alle 15 Tool-Calls) | nicht nativ |
| Plattformen | CLI + 6 Execution-Backends | 12+ Messenger als Frontend |
| User-Modell | Honcho dialectic | Channel-basierte Sessions |
| Setup | einfacher, weniger Integrationen | komplex, sehr breit |
| Wachstums-Metapher | mythologisch (Götterbote, Wachstum) | biologisch (Molting / Häutung) |

**Take-away**: Hermes lernt durch sich selbst, OpenClaw skaliert durch Anbindung. Beide adressieren "persistent agents", aber von entgegengesetzten Enden.

---

## 4. ChatGPT Image 2 Prompt (DE → empfohlen auf EN für beste Ergebnisse)

### 4.1 Empfohlener Prompt (Englisch, optimiert für GPT Image 2)

```
A cinematic split-screen illustration comparing two AI agent philosophies, in the
style of a high-end editorial tech magazine cover. 16:9 ratio, dramatic studio
lighting, ultra-detailed.

LEFT SIDE — "HERMES AGENT (Self-Improving)":
A luminous golden caduceus (winged staff with two entwined serpents) floating in
a marble Greek-temple setting, glowing softly. Around the staff, a recursive
spiral of holographic markdown documents labeled "SKILL.md" orbits like rings of
Saturn — each ring slightly more refined than the previous, visualizing a
"do → learn → improve" loop. Subtle data streams form three translucent memory
layers stacked behind the staff (frozen prompt, episodic skills, session search).
Color palette: deep navy, ivory, warm gold, soft cyan accents. Greek mythology
meets sci-fi minimalism.

RIGHT SIDE — "OPENCLAW":
A fierce, friendly pixel-art red lobster mascot standing on a glowing control
panel / orchestration gateway, claws outstretched. From its claws extend bright
neon cables branching into floating chat bubbles of 12+ messaging platforms
(Telegram, Slack, Discord, WhatsApp, Signal, iMessage, Matrix, Teams, etc.).
Behind the lobster, a translucent shed lobster shell ("molting") symbolizes
open-source growth. Static SOUL.md scrolls hover at its sides — handcrafted, not
self-evolving. Color palette: crimson red, terminal green, electric blue,
charcoal black.

CENTER DIVIDER:
A thin vertical glowing seam labeled "AGENT-FIRST  ⇆  GATEWAY-FIRST". Small
caption tags float along the seam: "depth of learning" on the left, "breadth of
reach" on the right.

Style: editorial, photoreal-meets-illustration, crisp typography, balanced
composition, no text artifacts, premium tech aesthetic, 8K detail.
```

### 4.2 Kürzere deutsche Variante (falls direkt auf Deutsch gewünscht)

```
Ein cineastisches Split-Screen-Bild im Stil eines hochwertigen Tech-Magazin-Covers,
16:9, dramatische Studio-Beleuchtung, ultra-detailliert.

LINKS – "HERMES AGENT" (selbstverbessernd):
Ein leuchtender goldener Caduceus (geflügelter Stab mit zwei verschlungenen
Schlangen) in einem Marmor-Tempel. Um ihn rotieren wie Saturnringe holografische
"SKILL.md"-Dokumente in einer rekursiven Spirale (do → learn → improve). Hinter
dem Stab drei transparente Memory-Schichten. Farben: Mitternachtsblau, Elfenbein,
warmes Gold, Cyan-Akzente.

RECHTS – "OPENCLAW":
Ein freundlich-grimmiger roter Pixel-Hummer auf einem leuchtenden Orchestrations-
Gateway. Aus seinen Scheren wachsen Neon-Kabel zu 12 Messenger-Sprechblasen
(Telegram, Slack, Discord, WhatsApp, Signal, iMessage, Matrix …). Im Hintergrund
ein durchsichtiger abgeworfener Hummerpanzer (Molting = Open-Source-Wachstum),
seitlich statische SOUL.md-Schriftrollen. Farben: Karminrot, Terminal-Grün,
Elektroblau, Anthrazit.

MITTE: Schmale leuchtende Trennlinie mit Beschriftung
"AGENT-FIRST  ⇆  GATEWAY-FIRST", links "depth of learning", rechts
"breadth of reach".

Stil: Editorial, Photoreal trifft Illustration, klare Typografie, ausgewogene
Komposition, Premium-Tech-Look, 8K.
```

### 4.3 Tipps für GPT Image 2
- Seitenverhältnis explizit angeben (`16:9` oder `--ar 16:9`).
- "no text artifacts" / "clean typography" hilft gegen verzerrten Text.
- Wenn Logos exakt sein sollen: zusätzlich Referenzbild des Caduceus / Hummers hochladen ("use this as visual reference for the central symbol").
- Für Druck/Präsentation: am Ende `8K, ultra-detailed, sharp focus` ergänzen.

---

## Quellen

- [Hermes Agent Documentation](https://hermes-agent.nousresearch.com/docs/)
- [GitHub – NousResearch/hermes-agent](https://github.com/nousresearch/hermes-agent)
- [Self-Improving AI – The Hermes Feature That Actually Works](https://hermes-agent.ai/blog/self-improving-ai-guide)
- [Hermes Agent: A Self-Improving AI Agent That Runs Anywhere – DEV](https://dev.to/arshtechpro/hermes-agent-a-self-improving-ai-agent-that-runs-anywhere-2b7d)
- [How Hermes Agent Memory Works – 3-Layer System](https://hermes-agent.ai/blog/hermes-agent-memory-system)
- [Hermes Agent Skins & Themes](https://hermes-agent.nousresearch.com/docs/user-guide/features/skins)
- [OpenClaw – Personal AI Assistant](https://openclaw.ai/)
- [GitHub – openclaw/openclaw](https://github.com/openclaw/openclaw)
- [OpenClaw – Wikipedia](https://en.wikipedia.org/wiki/OpenClaw)
- [OpenClaw lore](https://docs.openclaw.ai/start/lore)
- [OpenClaw vs. Hermes Agent – The New Stack](https://thenewstack.io/persistent-ai-agents-compared/)
- [Hermes Agent vs OpenClaw – screenshotone blog](https://screenshotone.com/blog/hermes-agent-versus-openclaw/)
- [Technical Deep Dive: Hermes vs. OpenClaw – Trilogy AI](https://trilogyai.substack.com/p/technical-deep-dive-hermes-vs-openclaw)
- [What Is Hermes Agent? The OpenClaw Alternative – MindStudio](https://www.mindstudio.ai/blog/what-is-hermes-agent-openclaw-alternative)
