# Hermes Agent — Deep Research Briefing

> Stand: April 2026 — Recherche aus offiziellen Quellen, Reviews, Community-Berichten und Vergleichsanalysen.

---

## 1. Was ist Hermes Agent?

Hermes Agent ist ein **Open-Source, autonomer KI-Agent** von **Nous Research** (dem Lab hinter den Hermes-, Nomos- und Psyche-Modellfamilien). Veröffentlicht am **25. Februar 2026** unter **MIT-Lizenz**.

**Kernidee — der „Agent that grows with you":**
Anders als Coding-Copiloten (an die IDE gebunden) oder Chatbot-Wrapper (zustandslos um eine API herum), ist Hermes ein **selbst-verbessernder Agent**, der:
- auf der eigenen Infrastruktur des Nutzers lebt
- über Sessions hinweg erinnert, was er gelernt hat
- mit jeder Nutzung tatsächlich besser wird

---

## 2. Key Facts & Zahlen

| Metrik | Wert |
|---|---|
| Release | 25. Februar 2026 |
| GitHub Stars (April 2026) | **119.000+** (nach 7 Wochen schon 95.000) |
| Forks | 17.700+ |
| Aktuelle Version | v0.11.0 (23. April 2026) |
| Lizenz | MIT |
| Setup-Zeit | ~60 Sekunden |
| Min. Hosting-Kosten | $5/Monat VPS |
| Built-in Tools | 40+ |
| Unterstützte Plattformen | 15+ Messaging-Channels |
| Modell-Backends | 200+ via OpenRouter, plus Nous Portal, NIM, OpenAI, HF, custom |
| Sprachen-Stack | Python (87,5%), TypeScript (8,9%) |

---

## 3. Architektur & Kern-Capabilities

### 3-Schichten-Memory
1. **Session Memory** — aktuelle Konversation
2. **Persistent Memory** — Fakten, Präferenzen, User-Modell über Sessions hinweg
3. **Skill Memory** — bewährte Lösungs-Patterns als wiederverwendbare Markdown-Dokumente in `~/.hermes/skills/`

**Persistenz-Layer:** SQLite (`hermes_state.py`) mit **FTS5-Volltextsuche** über alle vergangenen Sessions, kombiniert mit LLM-gestützter Summarization. Keine externen DB-Server nötig.

### Self-Improving Skills Loop
Wenn Hermes einen nicht-trivialen Workflow löst, schreibt er **autonom ein Skill-Dokument** (Approach, Tools, funktionierende Schritte). Diese Skills:
- werden bei späterer Nutzung gefunden und wiederverwendet
- verbessern sich **während der Nutzung** selbst
- sind durchsuchbar und teilbar (über offene `agentskills.io`-Marketplace-Spezifikation)

### Autonome Ausführung
- Multi-Step Tasks ohne Human-in-the-Loop
- **Subagent-Spawning** für parallele Workstreams
- **Built-in Cron Scheduler** für unbeaufsichtigte Automationen
- 6 Terminal-Backends: local, Docker, SSH, Daytona, Singularity, Modal

### 40+ Built-in Tools
Web-Search, File-Ops, Shell-Execution, SSH-Remote, Browser-Automation (Playwright), Vision, TTS, Image-Generation, MCP-Server-Integration, Batch-Processing.

### 15+ Messaging-Plattformen aus einem Gateway
CLI, Telegram, Discord, Slack, WhatsApp, Signal, Matrix, Mattermost, Email, SMS, DingTalk, Feishu, WeCom, BlueBubbles, Home Assistant.

---

## 4. Was Hermes von ChatGPT/Claude/OpenClaw unterscheidet

> **Drei Philosophien, drei Camps (2026):**
> - **Claude Code:** „Werde unverzichtbar in deiner Codebase." (Coding-Spezialist)
> - **OpenClaw:** „Werde der Automation-Layer deines Lebens." (statisches Skill-System, breite Plattform-Integration)
> - **Hermes Agent:** „Wachse in das hinein, was du brauchst — und werde mit jeder Nutzung besser."

**Differenziatoren von Hermes:**
1. **Echte episodische Erinnerung** über Sessions (nicht nur RAG)
2. **Selbst-erzeugte Skills** statt vordefinierter Workflows
3. **Infrastruktur-Agnostik** — von $5-VPS bis Serverless-GPU
4. **Modell-Freiheit** — 200+ Modelle, kein Vendor-Lock-in
5. **Persönliches User-Modell**, das sich vertieft

Ein OpenAI-Tools-Hub-Review (April 2026) bestätigt: *„Das episodische Gedächtnis funktioniert wirklich, aber sein Wert kumuliert über Zeit. Nach 20–30 Tasks in einer Domäne sieht man messbare Verbesserung."*

---

## 5. Reale Use Cases

### Solo / Indie / Researcher
- Always-on Personal Agent über Telegram/Signal
- Long-running Research-Experimente
- Skill-Akkumulation in Spezial-Domänen

### Enterprise / Teams
- **Sales/RevOps:** CRM-Deltas, Eskalationen, Pipeline-Changes als tägliches Slack-Briefing
- **DevOps:** PR-Reviews, Monitoring-Alerts, scheduled Reports
- **Knowledge Work:** wiederkehrende Recherche-Workflows, die auf vorherigen Runs aufbauen
- **Long-running Workflows**, die Server-Restarts überleben

### Cost-Modell-Beispiel
MiniMax M2.7 Flat-Plan ($9/Monat) + $5 VPS = ~**$14/Monat all-in** für einen persönlichen, persistenten Agent.

---

## 6. Limitationen & ehrliche Kritik (wichtig für glaubwürdigen Post)

| Limitation | Bedeutung |
|---|---|
| **Self-Evaluation unzuverlässig** | „Hermes denkt fast immer, er hätte gut gearbeitet — auch wenn nicht." |
| **Meta-Cognition-Kosten** | Skill-Extraction, Memory-Nudges und User-Modelling laufen zusätzliche LLM-Calls — auf Frontier-Modellen kann die Meta-Rechnung den eigentlichen Task-Cost übersteigen |
| **Compliance-Lücke** | Keine signierte Skill-Provenance, kein Approval-Workflow, kein Immutable Audit-Log → **nicht für Fintech/Healthcare/Legal-Backends geeignet** (Stand v0.x) |
| **API-Stabilität** | v0.x → Breaking Changes zwischen Minor-Releases möglich |
| **Domänen-Generalisierung** | Skills aus „GitHub-PR-Summary" transferieren NICHT zu „DB-Migration planen" |
| **Manual-Edit-Overwrites** | Auto-Generation kann manuelle Skill-Anpassungen überschreiben — Power-User-Pain |
| **Decision Burden** | Flexibilität (Modell, Runtime, Interface) zwingt zu mehr Vorab-Entscheidungen als bei One-Click-Tools |

---

## 7. Strategische Einordnung — warum das jetzt relevant ist

Die KI-Agent-Landschaft 2026 hat sich aus den **stateless Chatbots von 2024** weiterentwickelt zu **persistenten Agenten mit Werkzeug-Zugriff und Zeit-Dimension**. Der Markt belohnt Systeme, die:
- **Memory über Sessions** tragen
- **Tasks zeitgesteuert** ausführen
- **mit weniger Hand-Holding** durch Tools agieren

Hermes ist nicht das beste Coding-Tool (das bleibt Claude Code) und nicht die breiteste Plattform-Integration (OpenClaw). Aber Hermes ist die **erste glaubwürdige Verkörperung der Idee „ein Agent, der mit dir wächst"** — und das ist eine Verschiebung, die in den nächsten 12–18 Monaten alle anderen Anbieter zum Reagieren zwingen wird.

**Die These für einen LinkedIn-Post:**
> Wir hören auf, KI-„Tools" zu kaufen, und fangen an, **KI-Mitarbeiter** aufzubauen, die unsere Domäne mit der Zeit lernen. Hermes ist der erste Beweis, dass das funktionieren kann — open-source, selbst-gehostet, MIT-lizenziert. Der Beginn einer Ära, in der Wettbewerbsvorteil nicht mehr aus dem besten Modell kommt, sondern aus dem **am besten trainierten Agent in deiner spezifischen Domäne.**

---

## 8. Quellen (eine Auswahl der wichtigsten)

- Offiziell: [hermes-agent.nousresearch.com](https://hermes-agent.nousresearch.com/) · [GitHub: NousResearch/hermes-agent](https://github.com/nousresearch/hermes-agent)
- Vergleich: [The New Stack — OpenClaw vs Hermes](https://thenewstack.io/persistent-ai-agents-compared/) · [Decrypt — Hermes Coming for OpenClaw](https://decrypt.co/364211/what-is-hermes-open-source-ai-agent-openclaw-competitor)
- Reviews: [Medium — Krzysztof Słomka](https://kisztof.medium.com/hermes-agent-review-nous-researchs-self-improving-ai-agent-e72bc244435a) · [Hermes Agent 30-Tage-Review](https://hermes-agent.ai/blog/hermes-agent-review-2026)
- Architektur-Tiefen: [vectorize.io — How Memory Actually Works](https://vectorize.io/articles/hermes-agent-memory-explained) · [mranand.substack.com — Inside Hermes Agent](https://mranand.substack.com/p/inside-hermes-agent-how-a-self-improving)
- Enterprise-Use: [Marketing Scoop — Real Business Workflows](https://www.marketingscoop.com/tech/automation/what-is-hermes-agent-and-how-teams-use-it-to-automate-real-business-workflows/) · [Turing Post — Hermes 101](https://www.turingpost.com/p/hermes)
