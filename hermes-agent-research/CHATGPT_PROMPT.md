# ChatGPT-Prompt: Hochwertiger LinkedIn-Post zu Hermes Agent

> Copy-Paste-fertig. In ChatGPT (GPT-4 / GPT-5) einfügen, **deine eigenen Angaben in `[KLAMMERN]`** ergänzen, abschicken.

---

## DER PROMPT

```
ROLLE
Du bist ein erfahrener LinkedIn-Ghostwriter und KI-Stratege, der für Tech-Founder
und Senior-Operators schreibt. Du beherrschst die Anatomie viraler LinkedIn-Posts:
starker Hook in Zeile 1, kurze Zeilen, weiße Flächen, eine klare These, ein
konkretes Beispiel, ein zum Nachdenken anregender Schluss, ein Call-for-Discussion.
Du schreibst auf Deutsch, klingst aber nicht steril – sondern wie ein Mensch, der
Ahnung hat und Position bezieht.

ZIEL
Schreibe einen LinkedIn-Post zum Thema „Hermes Agent" (Open-Source-AI-Agent von
Nous Research, Release Februar 2026). Der Post soll:
- in den ersten 1–2 Zeilen einen Scroll-Stopper-Hook liefern
- eine klare, eigenständige These vertreten (nicht nur referieren)
- mindestens einen überraschenden Fakt bringen
- Glaubwürdigkeit zeigen, indem auch eine Limitation/Kritik benannt wird
- eine konkrete Implikation für [ZIELGRUPPE: z. B. „CTOs in mittelständischen
  SaaS-Unternehmen" / „Solo-Founder" / „Marketing-Leiter"] formulieren
- mit einer Frage oder Mini-Provokation enden, die Kommentare auslöst
- 180–250 Wörter lang sein
- 3–6 sehr sparsame, gezielte Hashtags am Ende führen
- KEINE Emojis im Übermaß (max. 1–2 funktionale, optional)
- KEINE Buzzword-Soße („Game-Changer", „Revolution", „Disruption"…)

KONTEXT — RECHERCHE-FAKTEN, DIE DU NUTZEN KANNST
(Quelle: offizielle Nous-Research-Seiten, GitHub, The New Stack, Decrypt,
Medium-Reviews, Stand April 2026)

WAS HERMES AGENT IST:
- Open-Source-AI-Agent von Nous Research, MIT-Lizenz, Release 25. Februar 2026
- 119.000+ GitHub-Stars in 8 Wochen, 17.700+ Forks, aktuelle Version v0.11.0
- Tagline: „The agent that grows with you"
- Läuft auf eigener Infrastruktur — von $5-VPS bis Serverless-GPU

KERN-DIFFERENZIATOR (das Kernargument):
- Erster Mainstream-Agent mit echter Lern-Schleife: erzeugt aus Erfahrung
  autonom „Skills" (Markdown-Dokumente in ~/.hermes/skills/), die er bei
  ähnlichen Tasks wiederverwendet UND während der Nutzung verbessert
- 3-Schichten-Memory: Session / Persistent / Skills, gespeichert in lokaler
  SQLite mit FTS5-Volltextsuche über alle vergangenen Sessions
- Nicht das beste Coding-Tool (das bleibt Claude Code), nicht die breiteste
  Integration (OpenClaw) — aber der erste glaubwürdige Beweis für die These
  „ein Agent, der mit der eigenen Domäne wächst"

TECHNISCHE ECKDATEN:
- 40+ Built-in Tools (Web, Browser via Playwright, SSH, Vision, TTS, MCP)
- 15+ Messaging-Plattformen aus einem Gateway (Telegram, Discord, Slack,
  WhatsApp, Signal, Email…)
- 200+ Modelle nutzbar via OpenRouter, Nous Portal, NVIDIA NIM, OpenAI, custom
- Setup in ~60 Sekunden, 6 Deploy-Backends (local, Docker, SSH, Daytona,
  Singularity, Modal)
- Cost-Beispiel: ~$14/Monat all-in (z. B. MiniMax M2.7 Flat $9 + $5 VPS)

EHRLICHE LIMITATIONEN (eine davon im Post nennen, für Credibility):
- Self-Evaluation unzuverlässig — der Agent denkt oft, er habe gut gearbeitet,
  auch wenn nicht
- Meta-Cognition-Kosten: Skill-Extraction + Memory-Nudges können auf
  Frontier-Modellen den Task-Cost übersteigen
- Keine Compliance-Features (signierte Provenance, Audit-Logs) → nicht für
  regulierte Branchen (Fintech/Healthcare/Legal) bereit
- v0.x: API-Breaking-Changes möglich
- Skills generalisieren nicht über Domänen-Grenzen hinweg

DEINE EIGENEN ANGABEN (BITTE EINSETZEN):
- Zielgruppe: [ZIELGRUPPE EINTRAGEN]
- Mein Hintergrund / Authority: [z. B. „Ich baue seit 8 Jahren AI-Workflows
  für SaaS-Teams"]
- Persönlicher Twist / Anekdote (optional, aber stark!): [z. B. „Letzte Woche
  habe ich Hermes auf einem $5-Hetzner-VPS deployed und nach 3 Tagen…"]
- Meine These in einem Satz: [z. B. „2026 hört der Wettbewerbsvorteil auf,
  beim besten Modell zu liegen — er beginnt beim am besten trainierten Agent
  in deiner spezifischen Domäne."]
- Tonalität: [auswählen: nüchtern-analytisch / pointiert-provokant /
  founder-persönlich]
- CTA-Frage am Ende: [optional vorgeben, sonst lass ChatGPT 2 Optionen liefern]

OUTPUT-FORMAT
1. Liefere DREI Varianten des Posts:
   Variante A: nüchtern-analytisch (für CTOs/Engineers)
   Variante B: founder-persönlich mit Anekdote (für LinkedIn-Reach)
   Variante C: provokant-thesenstark (für Diskussions-Trigger)
2. Unter jeder Variante: 1 Satz Begründung, warum dieser Hook funktioniert
3. Am Ende: 8 alternative Hook-Zeilen, die ich gegen die finale Hook tauschen
   kann
4. Schließe mit 5 Hashtag-Sets (jeweils 4–6 Tags), passend zur deutschen
   LinkedIn-Tech-Bubble

QUALITÄTS-CHECK BEVOR DU ANTWORTEST
- Ist Zeile 1 ein echter Pattern-Interrupt, kein „Heute möchte ich euch…"?
- Steht eine eigene These im Post, oder ist es nur Nacherzählung?
- Wurde mindestens ein konkreter Fakt mit Zahl genannt?
- Wurde eine Limitation benannt (Credibility-Marker)?
- Endet der Post mit einer Frage, die echtes Engagement triggert?
- Klingt es wie ein Mensch oder wie eine Pressemitteilung?
- Sind alle Sätze unter 20 Wörtern?

Los geht's.
```

---

## So nutzt du den Prompt optimal

1. **`[KLAMMERN]` ausfüllen** — vor allem Zielgruppe, deine Authority und idealerweise eine echte Anekdote. Eine eigene Erfahrung mit Hermes (auch wenn nur ein Test-Setup) macht den Post 10x glaubwürdiger.
2. **Variante wählen, nicht ChatGPT entscheiden lassen.** Die drei Varianten sind absichtlich unterschiedlich – wähle, die zu deinem bisherigen Ton passt.
3. **Hook tauschen.** Die ersten 1–2 Zeilen entscheiden über den Reach. Spiele mit den 8 alternativen Hooks.
4. **Mit eigener Stimme nachpolieren.** ChatGPT liefert das Skelett — die letzten 10 % (eigene Wendungen, Insider-Begriffe deiner Bubble) machen den Unterschied zwischen „solide" und „viral".
5. **Bild dazu:** Empfehlung — ein Screenshot deines Hermes-Terminals oder ein simples Diagramm der 3-Schichten-Memory. Bilder verdoppeln auf LinkedIn typischerweise den Reach.

---

## Bonus: 3 vorformulierte Hook-Optionen, falls du sofort starten willst

1. *„Ein Open-Source-Agent hat in 8 Wochen 119.000 GitHub-Stars eingesammelt. Und fast niemand in meiner deutschen Bubble redet darüber."*
2. *„Wir hören auf, KI-Tools zu kaufen. Wir fangen an, KI-Mitarbeiter zu trainieren."*
3. *„$14 im Monat. Eigene Infrastruktur. Ein Agent, der besser wird, je länger er für dich arbeitet. Hermes ist der erste Beweis, dass dieses Versprechen kein Marketing-Sprech ist."*
