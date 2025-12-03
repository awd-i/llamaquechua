# **Llamas Don’t Hallucinate:  
Terminal Framework for Measuring Translation “Surprise” for Endangered Languages using Quechua**  
**Aidan Whitedeer**

---

## **Abstract**

Low-resource translation systems frequently hallucinate, especially for Indigenous languages with limited training data. This project builds an interactive system, **_Llamas Don't Hallucinate_**, that compares gpt-4o's Quechua translations against Google Translate and quantifies the “surprise’’ of their differences using information theory. We model Quechua word generation with a smoothed multinomial distribution, compute entropy, cross-entropy, and KL divergence, and use CLT-based confidence intervals to estimate translation reliability. A web interface with a llama terminal OS exposes these metrics sentence-by-sentence, and an experiment mode aggregates results over 100 randomly generated sentences.

---

## **1. Motivation**

Quechua is one of the most widely spoken Indigenous languages in the Andes yet remains severely underrepresented in modern NLP datasets. LLMs can produce fluent-looking Quechua but often hallucinate—inventing morphology, borrowing from Spanish or Aymara, or drifting from the intended meaning. Because gold-standard corpora are scarce, we need practical proxies to detect this drift.

This project treats **Google Translate** as an empirical reference and **ChatGPT gpt-4o** as the model under evaluation. The goal is not to claim Google is perfect but to measure how much GPT’s distribution over Quechua tokens deviates from what a deployed production system produces on the same inputs. KL divergence becomes our hallucination score, while token accuracy and confidence intervals quantify how stable this score is.

---

## **2. System Design**

The system has two modes, both created with Google Cloud Translation API and OpenAI GPT-4o.

### **Interactive mode**

The user types an English sentence. The backend:

1. Calls Google Translate (EN → SP → QU).  
2. Calls ChatGPT (EN → QU) with a translation-focused prompt.  
3. Tokenizes both outputs (lowercasing, simple punctuation splitting).

The frontend displays both translations side-by-side with matched tokens highlighted, a panel of information-theoretic metrics, and a floating llama avatar that gives natural-language feedback (e.g., “KL is low, the models agree’’ vs. “KL is high, double-check this translation’’).

### **Experiment mode**

The backend first uses ChatGPT to generate **100 random English sentences** on everyday topics. For each sentence it queries both translation systems, aggregates counts over the corpus, and computes:

- global entropy \(H(G)\) of Google’s Quechua distribution  
- cross-entropy \(H(G,C)\) using ChatGPT's distribution  
- KL divergence \(D_{KL}(G||C)\)  
- token-level match accuracy and CLT confidence intervals  
- a “confusion dictionary’’ of systematic word-level mismatches  

---

## **3. System Logic // Probability Core**

Let \(V\) be the vocabulary of all unique tokens produced by either system. Let \(n_G(w)\) and \(n_C(w)\) be the occurrences of token \(w\) in Google and ChatGPT outputs, with totals:

\[
N_G = \sum_{w\in V} n_G(w), \qquad N_C = \sum_{w\in V} n_C(w)
\]

### **3.1 Multinomial Distribution & MLE**

We estimate token probabilities with Laplace-smoothed MLE:

\[
\hat{p}_G(w) = \frac{n_G(w) + \lambda}{N_G + \lambda|V|}, \qquad
\hat{p}_C(w) = \frac{n_C(w) + \lambda}{N_C + \lambda|V|}
\]

with \(\lambda = 1.0\).

### **3.2 Entropy & Surprise**

\[
H(G) = - \sum_{w \in V} \hat{p}_G(w)\log_2 \hat{p}_G(w)
\]

Cross-entropy:

\[
H(G, C) = - \sum_{w \in V} \hat{p}_G(w)\log_2 \hat{p}_C(w)
\]

### **3.3 KL Divergence (Hallucination Score)**

\[
D_{KL}(G||C) = H(G, C) - H(G)
\]

Interpretation:

- ~0: close match  
- >0.5: significant divergence  
- >1.0: high hallucination likelihood  

### **3.4 Confidence Intervals (CLT)**

Define match indicators \(X_i = 1\) if tokens match, else 0. Let  

\[
\hat{p} = \frac{1}{n}\sum_{i=1}^n X_i
\]

Then:

\[
\mathrm{CI}_{95\%} = \hat{p} \pm 1.96\sqrt{\frac{\hat{p}(1-\hat{p})}{n}}
\]

---

## **4. Empirical Findings (100-Sentence Sample)**

Metrics comparing Google Translate vs ChatGPT gpt-4o:

- **Entropy (Google baseline):** 5.454 bits  
- **Cross-entropy:** 7.508 bits  
- **KL divergence:** **2.054 bits** → strong hallucination signal  
- **Token-level accuracy:** 6.7%  
- **95% CI:** [6.7%, 14.3%]  
- **Per-sentence KL distribution:** most 0.20–0.34 bits  
- **Confusion dictionary:** consistent Spanish borrowings (e.g., *hoy*, *codigo*)  

### **Key findings**

Even in one run, KL divergence exceeds two bits, token-match accuracy is below 10%, and confidence intervals show the mismatch is statistically meaningful. Spanish contamination in ChatGPT’s output is a major driver of divergence. Despite being a single run, the system already detects strong distributional drift.

---

## **5. Multi-Model Prototyping & Manual Refinement**

The project was drafted using several AI systems before being refined by hand.

### **ChatGPT**

Generated the initial blueprint: multinomial MLE, entropy metrics, KL divergence, and structural layout for the writeup.

### **Antigravity**

Used as the coding environment to auto-generate a prototype from prompts.

### **Claude**

Used for minor code cleanup and refinement.

### **Hand tuning**

All mathematical details, smoothing choices, CLT criteria, and llama-UI thresholds were rewritten and verified manually to ensure correctness and transparency.

