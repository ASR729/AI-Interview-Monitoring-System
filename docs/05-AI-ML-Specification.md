**AI / ML SYSTEM SPECIFICATION**

**AI Interview Monitoring and Detection System**

**AI Interview Integrity Platform**

Document 5 — AI/ML Specification | Version 1.0

**Purpose of this document  
**Define the AI/ML architecture, signal definitions, model responsibilities, data requirements, inference flow, fusion/risk logic, evaluation methodology, limitations and validation plan for the product defined in PRD v1.0. This document is an engineering specification and does not claim that any model has already been trained or validated.

**Document Field**

**Value**

Project

AI Interview Monitoring and Detection System

Document

AI/ML Specification

Version

1.0

Baseline

PRD v1.0

Primary AI Objective

Detect and correlate observable signals associated with potential interview-integrity risks

AI Decision Principle

Evidence + confidence + context + human review

Current MVP Focus

Computer-vision monitoring, structured suspicious events, real-time alerts and evidence

Advanced Modules

Audio, speech-to-text, NLP and richer fusion are proposed/deferred unless validated and implemented

Model Results

No performance result is claimed until measured on a defined evaluation dataset

**Requirement traceability starts with PRD-FR-005 through PRD-FR-014 and PRD-NFR-002/005/007.**

# 1\. Scope and Relationship to the PRD

This specification expands the AI-related requirements established in the Product Requirements Document. It must remain consistent with the product boundary defined there. In particular, the system is not specified as a definitive automated cheating detector. It is specified as a multimodal monitoring and risk-analysis system that produces observable events, confidence values, evidence references and aggregate integrity-risk indicators for human review.

**PRD Reference**

**AI/ML Responsibility in this Document**

PRD-FR-005 — Video Monitoring

Define CV signals, extraction, inference and event generation.

PRD-FR-006 — Suspicious Event Detection

Define event taxonomy, feature logic and detection pipeline.

PRD-FR-007 — Real-Time Alerts

Define AI output contract consumed by alerting.

PRD-FR-008 — Evidence Context

Define evidence metadata and traceability.

PRD-FR-009 — Risk / Integrity View

Define fusion/risk-engine inputs and outputs.

PRD-FR-010 — Interview Report

Define AI-derived report information.

PRD-FR-011 — Audio Analysis

Define proposed audio module.

PRD-FR-012 — NLP Analysis

Define proposed transcript/NLP module.

PRD-FR-013 — Screen Activity Monitoring

Define integration boundary for non-AI activity signals.

PRD-FR-014 — Review Workflow

Ensure outputs remain reviewable at event level.

# 2\. AI/ML Objectives

-   Convert selected raw interview signals into structured, timestamped observations.
-   Detect supported suspicious-event patterns using measurable rules and/or trained models.
-   Combine evidence from different modalities without treating any single modality as conclusive.
-   Provide confidence and context for each model-derived event.
-   Support low-latency event generation for live recruiter alerts where technically feasible.
-   Preserve model/rule version information for reproducibility and auditability.
-   Enable offline evaluation before a model is promoted to live inference.
-   Keep individual AI modules replaceable so the product can evolve without rewriting the entire platform.

**Critical boundary  
**The AI system detects signals and patterns. It does not directly observe a candidate's intent. Words such as 'cheating detected', 'deception detected' or 'candidate is guilty' should not be used as the raw AI output.

# 3\. AI/ML Architecture Overview

The intended multimodal processing flow is:

**High-level pipeline  
**Camera / Microphone / Transcript / Permitted Activity Signals → Pre-processing → Specialized Signal Detectors → Event Normalization → Temporal Correlation → Fusion/Risk Engine → Alert + Evidence + Report

**Layer**

**Responsibility**

Input Layer

Receive permitted video/audio/text/activity streams associated with an interview session.

Pre-processing

Sampling, resizing, normalization, audio preprocessing, transcript segmentation and quality checks.

CV Engine

Extract observable visual signals and generate CV events.

Audio Engine

Extract speech/audio features and optional audio events.

ASR Engine

Convert speech to timestamped text for downstream analysis.

NLP Engine

Analyze transcript/response features where the module is enabled.

Activity Engine

Normalize technically available browser/system activity events.

Event Normalizer

Convert heterogeneous outputs into a common event schema.

Temporal Correlator

Group related events within time windows.

Fusion/Risk Engine

Combine evidence and confidence into an interpretable risk indicator.

Alert Engine

Apply alert thresholds and send recruiter-facing events.

Evidence Store

Persist event metadata and references to supporting evidence.

Evaluation Layer

Measure model and system performance offline before release.

# 4\. AI/ML Module Inventory

**Module ID**

**Module**

**Status**

**Primary Output**

AI-MOD-001

Computer Vision

MVP

Visual observations and CV events

AI-MOD-002

Audio Feature Analysis

Proposed

Audio quality/features and optional events

AI-MOD-003

Speech-to-Text / ASR

Proposed

Timestamped transcript segments

AI-MOD-004

NLP Analysis

Proposed

Text/response indicators

AI-MOD-005

Behavioural Signal Engine

MVP/Proposed

Normalized behavioural features/events

AI-MOD-006

Suspicious Event Detector

MVP

Event type, confidence, evidence reference

AI-MOD-007

Temporal Correlation

Proposed

Grouped event patterns

AI-MOD-008

Fusion / Risk Engine

P1

Risk indicators and contributing evidence

AI-MOD-009

Model Evaluation Pipeline

Required

Metrics and validation reports

AI-MOD-010

Model/Rule Registry

Proposed

Version and configuration metadata

# 5\. Computer Vision Specification

The CV module is the most important AI component in the initial MVP. Its purpose is to detect observable visual conditions that may be relevant to interview integrity. It should not infer deception from facial appearance.

## 5.1 CV Inputs

-   Candidate webcam frames, subject to browser/device permissions.
-   Interview session identifier.
-   Frame timestamp.
-   Optional frame-quality metadata such as resolution or capture status.

## 5.2 CV Processing

1.  Receive a sampled video frame rather than assuming every frame must be processed by an expensive model.
2.  Validate frame quality and discard unusable frames.
3.  Detect the candidate face/person where supported.
4.  Extract selected landmarks or geometric information where justified.
5.  Track short-term temporal state across frames.
6.  Generate normalized observations and confidence values.
7.  Emit an event only when a defined rule/model condition is satisfied.

## 5.3 Initial CV Signal Set

**Signal ID**

**Signal**

**Meaning**

**Initial Use**

CV-SIG-001

Face Present

Whether a face is detected in a frame/window.

MVP

CV-SIG-002

Multiple Faces

More than one face/person is detected in a frame/window.

MVP candidate

CV-SIG-003

Face Absence

Expected candidate face is absent for a defined interval.

MVP candidate

CV-SIG-004

Head Orientation

Approximate head orientation/pose relative to camera.

Proposed

CV-SIG-005

Gaze Direction

Approximate gaze/eye direction if reliably measurable.

Proposed

CV-SIG-006

Frame Quality

Blur, exposure or other quality condition that affects inference.

Required support signal

Exact thresholds, sampling rates and model selection are TBD until prototype benchmarking. A signal should not become a suspicious event merely because it occurs once; temporal persistence and context should be considered.

## 5.4 CV Technology Direction

The PRD identifies OpenCV and MediaPipe as the baseline CV direction. OpenCV is intended for video/frame handling and general computer-vision processing. MediaPipe is a candidate framework for face/landmark-related processing. Exact APIs, models and versions will be selected during implementation after feasibility testing.

# 6\. Audio Analysis Specification

Audio analysis is proposed for later stages. The product should prioritize speech capture and transcription before attempting higher-risk inferences such as emotion or stress. Acoustic characteristics must not be treated as proof of deception.

## 6.1 Audio Inputs

-   Microphone audio stream, subject to explicit permission.
-   Interview/session ID.
-   Audio timestamps.
-   Sampling-rate and quality metadata.

## 6.2 Candidate Audio Features

**Feature Group**

**Examples**

**Product Interpretation**

Speech Activity

Speech/non-speech segments

Supports timing and transcript segmentation

Timing

Pause duration, speaking duration

Contextual behavioural signal only

Rate

Approximate speech rate

Contextual feature; not deception proof

Energy

Amplitude/energy statistics

Technical/acoustic feature

Spectral Features

MFCC or related features

May support classification tasks if validated

Audio Quality

Noise/clipping/signal quality

Used to qualify downstream confidence

## 6.3 Audio Boundary

**Do not use emotion/stress as a standalone cheating detector  
**Voice stress and emotion-related models can be affected by language, microphone quality, environment, disability, anxiety, culture and many other factors. If such features are researched later, they must remain secondary signals and undergo separate validation.

# 7\. Speech-to-Text / ASR Specification

The ASR component converts permitted interview speech into timestamped text for transcript storage and downstream NLP. It is not itself a cheating detector.

## 7.1 ASR Requirements

-   Accept supported audio input.
-   Produce transcript text with timestamps or segment boundaries where available.
-   Preserve language information where the selected model supports it.
-   Expose transcription confidence/quality information where available from the selected implementation.
-   Handle temporary audio-quality failures without crashing the interview session.
-   Record ASR model/version metadata for reproducibility.

## 7.2 Initial Model Direction

OpenAI Whisper is a technically viable candidate for local ASR because its official repository describes it as a general-purpose speech-recognition model with multilingual speech recognition and translation capabilities. Hugging Face Transformers also provides automatic-speech-recognition pipelines and supports Whisper model integration. Exact model size must be selected based on measured latency, memory and accuracy on the project's test audio; no specific model is declared final in this version.

## 7.3 ASR Quality Metrics

**Metric**

**Purpose**

WER — Word Error Rate

Measure transcription error rate for supported languages/test sets.

Segment Timestamp Quality

Check whether transcript segments align adequately with speech events.

Latency

Measure time from audio availability to usable transcript output.

Failure Rate

Measure percentage of audio segments that cannot be transcribed reliably.

# 8\. NLP Specification

NLP is intended to analyze transcript content and response characteristics for potential AI-assistance indicators and interview context. It should not be represented as a reliable detector of AI-generated text by itself.

## 8.1 NLP Inputs

-   Timestamped transcript segments.
-   Interview question or prompt, where available and permitted.
-   Candidate response segment.
-   Response latency metadata.
-   Language metadata.
-   Optional role/job context, if explicitly configured by the recruiter.

## 8.2 NLP Feature Groups

**Feature Group**

**Examples**

**Status**

Response Timing

Time from question end to response start; response duration

Proposed

Text Statistics

Length, token count, sentence length distribution

Proposed

Linguistic Structure

Part-of-speech/linguistic patterns where useful

Proposed

Semantic Relevance

Similarity between question and response; topic relevance

Proposed

Consistency

Contradictions or abrupt changes within the interview

Future/Research

Technical Specificity

Presence of expected concepts in technical answers

Future/Research

AI-Assistance Indicators

Patterns that may warrant review

Research/TBD

## 8.3 NLP Safety Boundary

**No standalone AI-text verdict  
**AI-generated-text detection is not treated as a definitive capability. A model may produce an indicator that a response has characteristics associated with assisted/generated text, but that indicator must be combined with other evidence and reviewed by a human.

# 9\. Behavioural Signal Specification

Behavioural signals are time-varying observations derived from one or more modalities. The system should distinguish a raw signal from an interpreted suspicious event.

**Level**

**Example**

**Meaning**

Raw observation

Face detected = false

Direct output of a detector.

Feature

Face absent for 4 seconds

Temporal feature derived from observations.

Event

FACE\_ABSENCE\_LONG

Rule/model has classified a feature pattern as an event.

Correlated event

FACE\_ABSENCE + MULTIPLE\_FACE

Two events overlap in time.

Risk indicator

Elevated integrity risk

Fusion layer combines evidence; not a verdict.

## 9.1 Candidate Behavioural Signals

**Signal ID**

**Signal**

**Source**

**Interpretation**

BEH-001

Face presence continuity

CV

Visibility/monitoring condition

BEH-002

Multiple-face occurrence

CV

Potential external-person signal; requires review

BEH-003

Extended face absence

CV

Potential monitoring interruption; context required

BEH-004

Repeated gaze/head deviation

CV

Contextual signal only

BEH-005

Response latency anomaly

ASR/NLP

Contextual timing signal

BEH-006

Extended silence

Audio/ASR

May reflect thinking, connection issues or other causes

BEH-007

Screen/window activity event

Browser/activity layer

Potential external-assistance signal if technically observable

The presence of a behavioural signal does not determine intent. Event generation and risk aggregation must preserve this distinction.

# 10\. Suspicious-Event Detection

Suspicious-event detection converts observations/features into standardized events. The first implementation may use deterministic rules for well-defined events and introduce trained classifiers only where sufficient labelled data exists.

## 10.1 Event Taxonomy

**Event ID**

**Event**

**Trigger Concept**

**Initial Priority**

EVT-CV-001

FACE\_ABSENCE

Expected face unavailable beyond configured interval

High

EVT-CV-002

MULTIPLE\_FACES

More than one face detected over defined persistence window

High

EVT-CV-003

REPEATED\_HEAD\_DEVIATION

Repeated head orientation pattern over a time window

Low/Medium

EVT-AUD-001

EXTENDED\_SILENCE

Silence exceeds configured contextual threshold

Low

EVT-NLP-001

RESPONSE\_PATTERN\_ANOMALY

Validated NLP feature pattern requiring review

TBD

EVT-ACT-001

WINDOW\_OR\_TAB\_EVENT

Supported browser/activity event occurs

Medium

EVT-SYS-001

MONITORING\_INTERRUPTION

Camera/audio/screen signal unexpectedly unavailable

High operational

Severity labels above are product-design placeholders, not validated thresholds. Final severity policy is TBD.

## 10.2 Event Contract

**Field**

**Required**

**Description**

event\_id

Yes

Unique event identifier.

interview\_id

Yes

Interview session associated with event.

timestamp

Yes

Event occurrence time.

event\_type

Yes

Stable event taxonomy identifier.

source

Yes

CV, audio, ASR, NLP, activity, system, etc.

confidence

When applicable

Model/rule confidence or probability representation.

severity

Yes

Configured product severity.

evidence\_reference

When available

Reference to supporting frame/audio/transcript/activity evidence.

model\_version

When model-derived

Model identifier/version.

rule\_version

When rule-derived

Rule/configuration version.

status

Yes

Event review state where supported.

# 11\. Temporal Correlation

Many interview signals are ambiguous when viewed independently. Temporal correlation allows the system to determine whether multiple events occur within a meaningful time window.

**Concept**

**Example**

Event window

Group events occurring within a configurable interval.

Persistence

Require a condition to remain present for a minimum duration before emitting an event.

Repetition

Count repeated occurrences over a larger window.

Co-occurrence

Identify multiple modalities active at approximately the same time.

Sequence

Represent meaningful order, e.g. question → long pause → response.

**Design rule  
**Temporal correlation should reduce noise, not manufacture certainty. Correlation increases contextual evidence; it does not prove intent.

# 12\. Fusion / Integrity-Risk Engine

The fusion engine combines normalized events from multiple modules into an interpretable risk indicator. The exact mathematical formula is intentionally not finalized in v1.0 because weights and thresholds require empirical validation.

## 12.1 Inputs

-   Event type.
-   Event confidence.
-   Event severity.
-   Event persistence/duration.
-   Event frequency.
-   Temporal proximity to other events.
-   Modality/source.
-   Evidence availability.
-   Model/rule version.
-   Optional interview-level context permitted by product configuration.

## 12.2 Proposed Fusion Strategy

The initial implementation should use a transparent rule/weighted aggregation approach rather than an opaque end-to-end neural model. This makes the product easier to debug and evaluate. A future learned fusion model may be considered only after a sufficiently large, representative and labelled dataset exists.

**Fusion Stage**

**Operation**

1\. Normalize

Convert outputs from different modules to a common schema.

2\. Validate

Reject malformed/low-quality events and attach data-quality flags.

3\. Weight

Apply validated configuration to event classes and confidence.

4\. Correlate

Increase contextual importance when independently meaningful events overlap or repeat, subject to validation.

5\. Bound

Keep risk indicator within a defined range and preserve contributing evidence.

6\. Explain

Return top contributing events rather than only a single number.

7\. Alert

Compare result/events with validated alert thresholds.

## 12.3 Risk Output Contract

**Field**

**Description**

risk\_level

Low/medium/high or another validated categorical scale.

risk\_score

Optional numeric score; exact scale and formula TBD.

contributing\_events

List of events materially affecting the indicator.

confidence\_summary

Summary of confidence/quality across contributing evidence.

evidence\_references

Links/references to supporting evidence.

explanation

Human-readable reason based on observable events.

model\_versions

Versions of models involved.

# 13\. Feature Engineering Specification

**Feature Family**

**Examples**

**Derived From**

**Validation Need**

Visual

Face count, face presence ratio, absence duration

CV

Required

Temporal

Event frequency, duration, recurrence

Event stream

Required

Audio

Speech ratio, pause duration, acoustic features

Audio/ASR

Required if used

Text

Response length, semantic relevance, response timing

ASR/NLP

Required if used

Activity

Window/tab event count, screen status

Activity layer

Required if technically available

Quality

Frame quality, audio quality, ASR confidence

Input/model metadata

Required

Cross-modal

Events overlapping across modalities

Fusion layer

High validation need

Feature leakage must be avoided during model training. Features that directly reveal the target label through dataset construction or annotation artefacts should not be used as shortcuts.

# 14\. Dataset Strategy

The project should use a combination of public datasets for general model capabilities and a small, consent-based project dataset for interview-specific event validation. Public datasets should not be assumed to represent the project's exact interview-integrity task.

## 14.1 Dataset Categories

**Dataset Type**

**Purpose**

**Status**

General CV datasets

Validate/generalize face/landmark/vision components

To select

Speech datasets

Validate ASR/audio processing

To select

Language datasets

Develop/test NLP components

To select

Interview baseline dataset

Represent normal interview behaviour

Project-generated

Controlled suspicious-event dataset

Represent defined scenarios such as multiple faces or face absence

Project-generated, consent-based

Adversarial/edge-case set

Test difficult lighting, noise, accents, connectivity and benign unusual behaviour

Project-generated

## 14.2 Project Scenario Classes

**Class**

**Example Scenario**

NORMAL-001

Normal interview with candidate visible and no designed intervention.

CV-001

Candidate temporarily leaves camera view.

CV-002

Second person enters frame.

CV-003

Candidate repeatedly looks away from camera.

ACT-001

Candidate performs a permitted/controlled window or tab event where technically observable.

AUD-001

Background noise or temporary speech interruption.

ASR-001

Different accents/noise conditions affecting transcription.

NLP-001

Normal spontaneous response with varying length and latency.

The dataset must include benign cases that resemble suspicious signals. This is essential for measuring false-positive behaviour.

# 15\. Annotation and Labelling

**Annotation Field**

**Definition**

sample\_id

Unique sample/segment identifier.

interview\_id

Associated controlled interview session where applicable.

start\_time

Start timestamp.

end\_time

End timestamp.

modality

Video/audio/text/activity.

event\_label

Ground-truth event class.

scenario\_label

Controlled scenario class.

severity\_label

Reference severity if the annotation protocol defines one.

annotator\_id

Reviewer/annotator identifier where required.

agreement\_status

Whether multiple annotators agree where applicable.

notes

Contextual notes and edge cases.

Ground truth must describe what was intentionally present in the controlled scenario, not an annotator's unsupported conclusion about a person's intent. For example, 'second face present' is preferable to labelling the candidate 'cheating'.

# 16\. Data Splitting and Leakage Prevention

1.  Separate training, validation and test data where a trainable model is used.
2.  Keep related frames/segments from the same interview session in the same split to avoid near-duplicate leakage.
3.  Do not randomly distribute adjacent video frames across train and test sets.
4.  If multiple recordings come from the same participant, consider participant-level separation when appropriate.
5.  Freeze the test set before final model selection where feasible.
6.  Record dataset version and preprocessing configuration with every evaluation.

# 17\. Model Selection Policy

No model should be selected because it is popular or large. Selection should be based on the task, measured performance, latency, memory use, licensing, deployment feasibility and data requirements.

**Criterion**

**Question**

Task fit

Does the model actually perform the required task?

Accuracy/quality

Does it perform adequately on the project's test conditions?

Latency

Can it operate within the required live-monitoring budget?

Memory/compute

Can it run on the available development/target hardware?

Robustness

How does it behave under noise, lighting, accents and ordinary variation?

License

Can the model/code be used under the intended project/product use?

Explainability

Can useful evidence/confidence be exposed?

Maintainability

Can the model be updated/replaced without major system redesign?

# 18\. Inference Architecture

Inference is divided into real-time and offline workloads.

**Workload**

**Examples**

**Expected Behaviour**

Real-time

Face presence, multiple faces, monitoring interruption, selected activity events

Low-latency event generation

Near-real-time

ASR segments, selected audio/NLP features

Process in short windows where feasible

Post-interview

Full transcript analysis, report generation, aggregate analytics

Can use more compute; does not block live interview

Offline

Training, evaluation, threshold tuning

Never used directly on production traffic

## 18.1 Inference Steps

1.  Receive input for an active interview session.
2.  Perform quality checks and preprocessing.
3.  Run appropriate modality-specific detector/model.
4.  Convert raw model output to normalized signal.
5.  Apply temporal logic where required.
6.  Create an event if validated conditions are met.
7.  Attach evidence and model/rule metadata.
8.  Send event to the fusion/alert pipeline.
9.  Persist required event metadata.

# 19\. Performance and Latency Requirements

The PRD intentionally leaves exact latency targets TBD until a working prototype is benchmarked. The following measurement categories must be collected rather than guessed.

**Metric**

**Definition**

Capture-to-inference latency

Time from input availability to model output.

Inference latency

Model processing time per frame/audio/text unit.

Event-generation latency

Time from model output to normalized event.

Alert latency

Time from qualifying event to recruiter-visible alert.

Throughput

Inputs/events processed per second or per concurrent interview.

Resource utilization

CPU/GPU/memory usage under representative load.

**No fabricated benchmark  
**Any numerical latency target or concurrency figure must be introduced only after a measured benchmark or an explicitly documented engineering target.

# 20\. Evaluation Framework

Evaluation must occur at both model/module level and complete-system level.

## 20.1 Classification Metrics

**Metric**

**Purpose**

Precision

How often predicted positive events are actually present in the test ground truth.

Recall

How much of the ground-truth event set is detected.

F1-score

Harmonic mean of precision and recall.

False Positive Rate

Frequency of benign cases incorrectly flagged.

False Negative Rate

Frequency of target events missed.

Confusion Matrix

Detailed distribution of classification errors.

## 20.2 ASR Metrics

**Metric**

**Purpose**

WER

Primary transcription error metric for supported language/test conditions.

Latency

Operational suitability for live/near-live use.

Segment alignment

Quality of timestamps/segments where required.

## 20.3 System Metrics

**Metric**

**Purpose**

Alert latency

Operational responsiveness.

Events per interview

Monitor event generation volume and noise.

False alerts per interview

Critical user-experience metric.

Resource usage

Determine hardware/cloud requirements.

Failure/recovery rate

Measure behaviour during component/network failures.

# 21\. Threshold Selection

Thresholds for event persistence, confidence, severity and risk alerts must be determined from validation data rather than intuition alone.

1.  Define the target event and acceptable false-positive behaviour.
2.  Use a validation set to examine candidate thresholds.
3.  Measure precision/recall trade-offs.
4.  Check performance across relevant scenario subgroups and environmental conditions.
5.  Select thresholds with documented rationale.
6.  Freeze thresholds for a test run.
7.  Evaluate on a held-out test set.
8.  Record the threshold configuration version.

# 22\. Robustness and Edge-Case Testing

**Condition**

**Examples**

Lighting

Low light, backlight, bright room

Camera

Low resolution, camera movement, partial obstruction

Background

Room movement, another person, clutter

Audio

Noise, echo, low microphone quality, overlapping sound

Speech

Different accents, speaking rates, pauses

Connectivity

Temporary packet loss, stream interruption

Browser

Permission changes, unsupported capability, tab/window lifecycle

Benign behaviour

Looking away to think, taking notes where allowed, temporary absence

Benign edge cases are especially important because the product's most important risk is not only missing suspicious events, but also incorrectly flagging normal candidate behaviour.

# 23\. Fairness and Bias Evaluation

The system should not assume that visual, audio or language patterns have the same meaning across all users. Evaluation must therefore consider relevant sources of variation in the intended user population.

-   Different lighting and camera quality.
-   Different accents and speech rates.
-   Language variation supported by the product.
-   Accessibility-related behaviours where the system is intended to be used.
-   Different physical environments.
-   Benign behavioural variation.

The exact demographic/fairness evaluation protocol is TBD and should be defined before any production claim about fairness or broad reliability.

# 24\. Explainability and Evidence Requirements

**Output**

**Required Explanation**

Event

What happened, when, source modality and confidence.

Risk indicator

Which events contributed and why they were considered relevant.

Alert

Why the alert was triggered and what evidence is available.

Report

Summary of notable events with timestamps and supporting references.

**Evidence-first design  
**The UI and API should expose contributing events and evidence references alongside any aggregate risk indicator. A numeric score without an explanation is not sufficient for the intended recruiter workflow.

# 25\. Model Lifecycle and Versioning

**Stage**

**Requirement**

Research

Candidate models may be tested offline.

Experiment

Record dataset version, preprocessing, model version and configuration.

Validation

Evaluate against frozen/controlled validation data.

Release Candidate

Run regression and robustness tests.

Production

Deploy only after defined acceptance criteria are met.

Monitoring

Track inference failures, input-quality drift and event distributions.

Rollback

Maintain ability to return to a previous validated model/rule version.

Every model-derived event should be attributable to a model/version identifier whenever technically applicable.

# 26\. Data and Input Quality Controls

-   Reject or flag frames that are too poor for reliable CV inference.
-   Record audio-quality issues that may affect ASR/audio analysis.
-   Record missing/invalid transcript segments.
-   Distinguish 'not detected' from 'could not determine' where possible.
-   Propagate quality flags to downstream modules.
-   Do not convert technical failure into suspicious behaviour.

**Important distinction  
**Camera unavailable because of a technical failure is not automatically the same event as a candidate intentionally leaving the camera view.

# 27\. AI Failure and Degradation Strategy

**Failure**

**Required Behaviour**

CV unavailable

Continue interview if product policy permits; generate operational monitoring event rather than cheating event.

ASR unavailable

Continue without NLP-dependent analysis where possible; mark transcript unavailable.

NLP unavailable

Do not block core interview monitoring.

Temporary model timeout

Retry according to controlled policy; avoid duplicate events.

Low-confidence input

Reduce downstream reliance and expose quality state.

Service unavailable

Log failure and surface system-health status to authorized operators.

This supports PRD-NFR-005: non-critical AI components should fail gracefully rather than making the entire interview unusable.

# 28\. AI/ML Security Requirements

-   Restrict access to raw media, transcripts and model outputs by role.
-   Do not expose internal model credentials or service keys to the browser.
-   Validate all event payloads received from inference services.
-   Protect model/configuration endpoints from unauthorized modification.
-   Version and audit changes to model/rule configuration.
-   Avoid storing unnecessary raw model inputs when event-level evidence is sufficient.
-   Protect stored evidence and transcripts according to the system's security and privacy requirements.

# 29\. Deployment Strategy

The AI service is planned as a Python/FastAPI service separated from the main Node.js application backend. The initial implementation should be modular rather than distributed into many independent services.

**Initial deployment shape  
**React/Vite frontend → Node.js/Express application backend → Python/FastAPI AI service → AI modules → event/fusion layer → MongoDB/evidence storage

Local inference is preferred during the zero-cost development stage where hardware permits. Cloud inference and paid GPU resources should be considered only after profiling demonstrates a real need.

# 30\. AI/ML Technology Stack

**Component**

**Baseline / Candidate**

**Decision Status**

CV framework

OpenCV

Baseline

Face/landmark processing

MediaPipe or validated equivalent

Baseline direction; exact implementation TBD

AI/ML runtime

Python

Confirmed

AI API

FastAPI

Baseline

NLP framework

Hugging Face Transformers

Baseline direction

ASR

OpenAI Whisper or compatible validated ASR model

Candidate; final model TBD

Audio features

Librosa or equivalent

Candidate; exact features TBD

Numerical processing

NumPy / standard scientific Python stack

Proposed

Deep-learning runtime

PyTorch or compatible runtime required by selected model

TBD by model selection

Model registry/versioning

Application-level model metadata initially

Proposed

Hugging Face Transformers officially supports pipelines for NLP, audio, computer vision and related multimodal tasks. The official Whisper repository documents multilingual ASR and local inference. These facts support the technology direction, but they do not establish that a particular model is best for this project.

# 31\. Dataset Governance

-   Use only data for which the project has an appropriate right/permission to use.
-   For project-generated interview scenarios, obtain participant consent appropriate to the research/development context.
-   Document dataset source, license/permission, collection date, preprocessing and intended use.
-   Separate personally identifiable information from model-training identifiers where practical.
-   Do not include unnecessary sensitive personal information in labels.
-   Track dataset versions so evaluation results remain reproducible.

# 32\. Experiment Tracking

**Field**

**Required Information**

Experiment ID

Unique experiment identifier.

Objective

Specific hypothesis/question being tested.

Dataset version

Exact dataset used.

Preprocessing

Transformations and sampling.

Model

Name, version/checkpoint and configuration.

Hyperparameters

Relevant training/inference settings.

Hardware

CPU/GPU/RAM environment.

Metrics

All reported evaluation metrics.

Thresholds

Any decision thresholds tested/selected.

Result

Measured result and interpretation.

Decision

Keep/reject/iterate, with rationale.

# 33\. Training / Fine-Tuning Strategy

The initial product should prefer pretrained models and deterministic feature/rule logic where they adequately solve the task. Fine-tuning should be introduced only when the project has sufficient task-specific labelled data and a measurable reason to do so.

**Approach**

**Use When**

**Status**

Pretrained inference

General task can be handled without task-specific training

Preferred starting point

Rule-based detection

Event is directly observable and thresholdable

Preferred for early MVP events

Classical ML

Engineered features have sufficient labelled data

Optional

Fine-tuning

Task-specific data is sufficient and baseline performance is inadequate

Future/conditional

Custom deep model

Strong evidence requires custom architecture and enough data

Not planned for MVP

# 34\. Fusion Evaluation

Fusion must be evaluated against the same controlled scenario ground truth used to evaluate component detectors. The project should compare the fused system against individual signals to determine whether multimodal correlation actually improves useful performance.

**Comparison**

**Purpose**

CV-only vs CV + activity

Determine value of activity signals.

CV-only vs multimodal

Determine whether additional modalities improve event detection.

Single-event alerting vs temporal correlation

Measure reduction in noisy alerts.

Fixed rule fusion vs learned fusion

Only if a sufficiently large dataset exists.

No claim of improvement should be made until the comparison is measured.

# 35\. AI/ML Acceptance Criteria

1.  Every production AI event can be mapped to an interview ID and timestamp.
2.  Model-derived events record model/version metadata where applicable.
3.  Event outputs use the standardized schema defined in this document.
4.  The system distinguishes technical monitoring failure from suspicious behaviour.
5.  Core MVP CV events can be evaluated on a defined, consent-based test set.
6.  Precision, recall, F1 and false-positive behaviour are measured for supported classifiers/events where applicable.
7.  ASR performance is measured before transcript-dependent NLP is used for product claims.
8.  Fusion logic exposes contributing events rather than only a score.
9.  No AI output is presented as definitive proof of cheating/deception.
10.  Release decisions are based on measured validation rather than assumed model capability.

# 36\. AI/ML Requirement Traceability

**AI/ML Requirement ID**

**Related PRD Requirement**

**Downstream Documents**

AI-REQ-001

PRD-FR-005

Architecture, Development, Testing

AI-REQ-002

PRD-FR-006

SRS, Architecture, Testing

AI-REQ-003

PRD-FR-007

Architecture, UI/UX, Testing

AI-REQ-004

PRD-FR-008

Database, Architecture, Testing

AI-REQ-005

PRD-FR-009

SRS, UI/UX, Testing

AI-REQ-006

PRD-FR-010

Database, UI/UX, Testing

AI-REQ-007

PRD-FR-011

SRS, Architecture, Development

AI-REQ-008

PRD-FR-012

SRS, Architecture, Development

AI-REQ-009

PRD-NFR-002

Architecture, Infrastructure, Testing

AI-REQ-010

PRD-NFR-005

Architecture, Development, Testing

AI-REQ-011

PRD-NFR-007

Architecture, Development

These IDs are the AI/ML baseline for later implementation and testing documents. Additional detailed IDs may be added in the SRS or implementation plan, but existing identifiers should not be silently redefined.

# 37\. Open AI/ML Decisions

**ID**

**Decision**

**Why It Is Not Final Yet**

AI-TBD-001

Exact CV detector/model

Requires prototype comparison and hardware benchmark.

AI-TBD-002

CV sampling rate

Depends on latency/resource measurements.

AI-TBD-003

Exact face/gaze/head-pose implementation

Requires feasibility and robustness testing.

AI-TBD-004

ASR model size

Accuracy/latency/memory trade-off.

AI-TBD-005

Supported languages

Must match project scope and validated data.

AI-TBD-006

Exact NLP model

Requires task definition and evaluation data.

AI-TBD-007

AI-assistance detection methodology

High uncertainty and requires validation.

AI-TBD-008

Risk score formula

Weights must be validated; no arbitrary final formula.

AI-TBD-009

Alert thresholds

Must be selected from validation results.

AI-TBD-010

Training vs pretrained models

Depends on data volume and baseline results.

AI-TBD-011

Production inference hardware

Depends on profiling and concurrency targets.

# 38\. Recommended AI/ML Development Order

1.  Build CV capture and face-presence monitoring.
2.  Implement standardized event schema.
3.  Implement basic suspicious-event rules for clearly observable CV conditions.
4.  Implement evidence references and timestamps.
5.  Implement real-time event transport to the recruiter dashboard.
6.  Benchmark CV latency and resource usage.
7.  Create consent-based controlled evaluation scenarios.
8.  Measure CV event precision/recall and false-positive behaviour.
9.  Add temporal correlation.
10.  Add ASR only after the CV/event pipeline is stable.
11.  Evaluate transcript quality before building transcript-dependent NLP.
12.  Add NLP experiments as offline analysis first.
13.  Add fusion/risk engine after individual event quality is measured.
14.  Validate fusion and alert thresholds on held-out scenarios.
15.  Only then consider richer audio/AI-assistance/deepfake modules.

# 39\. Known Limitations

-   Webcam-based signals cannot establish what is happening outside the camera's field of view.
-   Browser security restrictions limit some screen/window monitoring capabilities.
-   ASR quality varies with language, accent, noise and recording quality.
-   NLP-based AI-assistance detection is an uncertain research problem and should not be presented as definitive.
-   Visual or vocal behaviour can have many benign explanations.
-   A multimodal score can organize evidence but cannot eliminate uncertainty.
-   The product's reliability must be established empirically on representative test scenarios.

# 40\. External Technical References Used for This Specification

The following sources were checked for capability descriptions of the proposed technical stack. They do not constitute evidence that a particular model is suitable for this project; suitability must still be evaluated.

**Source**

**URL**

**Relevant Point**

OpenAI Whisper — official GitHub repository

https://github.com/openai/whisper

General-purpose ASR; multilingual speech recognition/translation; model and usage information.

Hugging Face Transformers — Pipelines documentation

https://huggingface.co/docs/transformers/main/main\_classes/pipelines

Supported inference pipelines across NLP, audio, vision and multimodal tasks.

Hugging Face Transformers — Pipeline tutorial

https://huggingface.co/docs/transformers/main/pipeline\_tutorial

Inference pipeline architecture and task support.

# 41\. Handoff to Subsequent Documents

This AI/ML Specification must be consumed by the system architecture, database, UI/UX, development and testing documents. The architecture must implement the module boundaries and data flow described here. The database must represent event/evidence/model metadata required by the event contract. The UI/UX specification must display events, confidence, evidence and risk indicators without turning them into definitive judgments. The development plan must sequence implementation according to Section 38. The testing plan must use the evaluation framework in Sections 20–24.

**Document dependency  
**PRD v1.0 → SRS → System Architecture → Database Specification → AI/ML Specification → UI/UX → Development → Infrastructure → Testing → Product Roadmap. Where this document identifies a TBD, later documents must not silently invent a value; the decision must be explicitly resolved and recorded.