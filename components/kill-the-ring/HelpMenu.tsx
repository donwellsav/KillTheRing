'use client'

// Help menu for Kill The Ring application
// Updated with advanced algorithm documentation from DAFx-16, DBX, and KU Leuven research
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HelpCircle } from 'lucide-react'

export function HelpMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button suppressHydrationWarning variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground" aria-label="Help">
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline text-xs">Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-lg">Kill The Ring Help</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-4 mb-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="modes">Modes</TabsTrigger>
            <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
          </TabsList>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tips">Tips</TabsTrigger>
            <TabsTrigger value="troubleshoot">Troubleshoot</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="math">The Math</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="mt-4 space-y-4">
            <Section title="What is Kill The Ring?">
              <p>
                Kill The Ring is a real-time acoustic feedback detection and analysis tool for professional live sound engineers.
                It uses multiple detection algorithms based on peer-reviewed acoustic research to identify feedback frequencies,
                resonant rings, and problematic tones with high accuracy and minimal false positives.
              </p>
              <p className="mt-2">
                The system provides specific EQ recommendations and tracks algorithm confidence scores to help you make
                informed decisions during live events.
              </p>
            </Section>

            <Section title="Quick Start">
              <ol className="list-decimal list-inside space-y-2">
                <li>Click the flashing <strong>START</strong> speaker button in the header to begin monitoring</li>
                <li>Detected issues appear in the <strong>Active Issues</strong> sidebar, sorted by frequency</li>
                <li>Each issue card shows frequency, pitch, severity, and recommended GEQ/PEQ cuts</li>
                <li>Tap <strong>Apply</strong> on a card to log the cut to the <strong>EQ Notepad</strong> tab</li>
                <li>Use the <strong>Algo</strong> tab in Settings to tune advanced detection algorithms</li>
                <li>Enable <strong>Show Algorithm Scores</strong> to see real-time MSD, Phase, and Compression status</li>
                <li>Export session logs for post-event analysis</li>
              </ol>
            </Section>

            <Section title="Key Features">
              <ul className="space-y-2">
                <li><strong>Multi-Algorithm Detection:</strong> MSD, Phase Coherence, Spectral Flatness, and Comb Pattern analysis working together</li>
                <li><strong>Compression Detection:</strong> Automatically adapts thresholds for dynamically compressed content (true dynamic range + crest factor)</li>
                <li><strong>Content-Aware:</strong> Detects speech vs music vs compressed audio and adjusts sensitivity</li>
                <li><strong>Comb Pattern Prediction:</strong> Identifies feedback acoustic paths using round-trip delay spacing and predicts future feedback frequencies</li>
                <li><strong>RT60-Aware Q Thresholds:</strong> Room reverberation time adjusts the Q threshold so reverberant room modes are not confused with feedback</li>
                <li><strong>Real-Time Algorithm Status:</strong> See exactly what each algorithm is detecting</li>
              </ul>
            </Section>

            <Section title="Display Areas">
              <ul className="space-y-2">
                <li><strong>Large Panel (top):</strong> Selected graph enlarged for detail. Switch between RTA Spectrum, 31-Band GEQ, and Waterfall.</li>
                <li><strong>Small Panels (bottom row):</strong> The two non-active graphs, live and clickable.</li>
                <li><strong>Left Sidebar - Issues tab:</strong> Active detected issues with Apply buttons. RUNAWAY issues pulse red.</li>
                <li><strong>Left Sidebar - EQ Notepad tab:</strong> Accumulates applied cuts for easy reference and export.</li>
                <li><strong>Algorithm Status Bar:</strong> Shows current algorithm mode, content type, MSD buffer status, and compression detection (enable in Settings).</li>
              </ul>
            </Section>
          </TabsContent>

          {/* CONTROLS */}
          <TabsContent value="controls" className="mt-4 space-y-4">
            <Section title="Header Controls">
              <ul className="space-y-3">
                <li>
                  <strong>Start / Stop (Speaker Button):</strong> Begin or pause audio analysis. The LIVE indicator appears while running.
                </li>
                <li>
                  <strong>Input Gain (meter slider):</strong> Digital boost applied before analysis (-40 to +40 dB, default +15 dB). Increase if feedback is not being detected; reduce if clipping.
                </li>
                <li>
                  <strong>Mode:</strong> Detection sensitivity preset. Default is <strong>Feedback Hunt</strong>.
                </li>
                <li>
                  <strong>Logs / Sessions / Settings:</strong> Access session data, history, and configuration.
                </li>
              </ul>
            </Section>

            <Section title="Sidebar - Detection Controls">
              <p className="mb-2">Primary real-time tuning tools in the left sidebar:</p>
              <ul className="space-y-2">
                <li><strong>Mode dropdown:</strong> Sets detection sensitivity preset.</li>
                <li><strong>Freq Range chips:</strong> Four presets - Vocal (200-8kHz), Monitor (300-3kHz), Full (20-20kHz), Sub (20-250Hz).</li>
                <li><strong>Auto Music-Aware toggle:</strong> Automatically switches sensitivity when the band starts/stops playing.</li>
                <li><strong>Threshold:</strong> Primary sensitivity (4-8 dB aggressive, 10-14 dB balanced, 16+ dB conservative).</li>
                <li><strong>Ring:</strong> Resonance detection sensitivity (2-4 dB calibration, 5-7 dB normal, 8+ dB shows).</li>
                <li><strong>Growth:</strong> Amplitude growth rate threshold (0.5-1 dB/s catches early, 3+ dB/s only runaway).</li>
              </ul>
            </Section>

            <Section title="Settings Panel Tabs">
              <ul className="space-y-2">
                <li><strong>Analysis tab:</strong> FFT Size, Spectrum Smoothing, Hold Time, Confidence Threshold, Room Acoustics.</li>
                <li><strong>Algo tab:</strong> Algorithm Mode, MSD History Buffer, Phase Coherence Threshold, Fusion Threshold, Compression Detection, Comb Pattern Detection, Algorithm Score Display.</li>
                <li><strong>Display tab:</strong> Max Issues Shown, Graph Label Size, EQ Recommendation Style.</li>
                <li><strong>Export tab:</strong> Session log export in CSV, JSON, or plain text formats.</li>
              </ul>
            </Section>

            <Section title="EQ Recommendations">
              <ul className="space-y-2">
                <li><strong>GEQ:</strong> Nearest ISO 31-band center frequency with suggested cut depth.</li>
                <li><strong>PEQ:</strong> Precise frequency, Q value, and gain for parametric EQ.</li>
                <li><strong>EQ Style:</strong> Surgical (narrow Q, deep cuts) vs Heavy (wide Q, moderate cuts).</li>
              </ul>
            </Section>
          </TabsContent>

          {/* MODES */}
          <TabsContent value="modes" className="mt-4 space-y-4">
            <Section title="Operation Modes">
              <ul className="space-y-3">
                <li>
                  <strong>Feedback Hunt (Default):</strong> Balanced PA mode. Threshold 8 dB, Ring 4 dB, Growth 1.5 dB/s. Good general sensitivity with fewer false positives.
                </li>
                <li>
                  <strong>Aggressive:</strong> Maximum sensitivity for system calibration. Threshold 6 dB, Ring 3 dB, Growth 1 dB/s.
                </li>
                <li>
                  <strong>Vocal Ring:</strong> Tuned for speech frequencies (200 Hz-8 kHz). Threshold 6 dB, Ring 4 dB, Growth 1.5 dB/s.
                </li>
                <li>
                  <strong>Music-Aware:</strong> Reduced sensitivity for performance. Threshold 12 dB, Ring 5 dB, Growth 3 dB/s, music filter enabled.
                </li>
                <li>
                  <strong>Calibration:</strong> Ultra-sensitive for initial setup. Threshold 4 dB, Ring 4 dB, Growth 0.5 dB/s.
                </li>
              </ul>
            </Section>

            <Section title="Auto Music-Aware">
              <p className="mb-2">
                The <strong>Auto Music-Aware</strong> toggle automatically switches sensitivity based on signal level:
              </p>
              <ul className="space-y-2">
                <li>When signal rises 15 dB above noise floor, enters music-aware mode</li>
                <li>When signal drops back, returns to base mode after 1 second</li>
                <li>A Speech/Music pill shows the current automatic state</li>
              </ul>
            </Section>

            <Section title="Choosing a Mode">
              <ul className="space-y-2">
                <li>Default / general soundcheck: <strong>Feedback Hunt</strong></li>
                <li>Initial system setup / ring-out: <strong>Calibration</strong> or <strong>Aggressive</strong></li>
                <li>Monitor tuning: <strong>Vocal Ring</strong></li>
                <li>During live performance: <strong>Music-Aware</strong> or enable <strong>Auto Music-Aware</strong></li>
              </ul>
            </Section>
          </TabsContent>

          {/* ALGORITHMS */}
          <TabsContent value="algorithms" className="mt-4 space-y-4">
            <Section title="Advanced Detection System">
              <p>
                Kill The Ring uses multiple detection algorithms from peer-reviewed acoustic research.
                Each algorithm detects different characteristics of feedback, and they vote together
                for maximum accuracy and minimal false positives.
              </p>
            </Section>

            <Section title="MSD - Magnitude Slope Deviation">
              <p className="mb-2">
                From the <strong>DAFx-16 paper</strong>. The key insight: feedback amplitude grows
                <strong> linearly in dB scale</strong> over time, meaning its second derivative (MSD) is near zero.
                Music has constantly varying amplitude — high MSD.
              </p>
              <ul className="space-y-1">
                <li><strong>Speech accuracy:</strong> 100% detection with just 7 frames (~160 ms at 48 kHz / 8192-pt FFT)</li>
                <li><strong>Classical music:</strong> 100% detection with 13 frames (~300 ms)</li>
                <li><strong>Rock/compressed:</strong> Requires compression detection assistance (phase coherence takes over)</li>
                <li><strong>Efficiency:</strong> Summing MSD method is 140x faster than the original DFT-based algorithm</li>
              </ul>
              <p className="mt-2 text-xs">
                An energy gate ensures silent bins (signal below noise floor) never produce false positives — a key
                real-world fix not present in the original paper implementation.
              </p>
            </Section>

            <Section title="Phase Coherence Analysis">
              <p className="mb-2">
                From <strong>Nyquist stability theory</strong>. True feedback is a regenerative pure tone that
                maintains constant phase across consecutive frames. Music has unpredictable phase variation.
                Phase coherence is measured as the mean phasor magnitude of frame-to-frame phase differences:
              </p>
              <ul className="space-y-1">
                <li><strong>High coherence ({'>'} 0.85):</strong> Phase-locked — strong feedback indicator</li>
                <li><strong>Medium coherence (0.65-0.85):</strong> Uncertain — check other algorithms</li>
                <li><strong>Low coherence ({'<'} 0.65):</strong> Random phase — likely music</li>
              </ul>
              <p className="mt-2 text-xs">
                Phase is extracted using a per-bin Goertzel filter (targeted only at active peak bins, not all 4096 bins)
                to keep CPU cost below ~0.5 ms per frame.
              </p>
            </Section>

            <Section title="Spectral Flatness + Kurtosis">
              <p className="mb-2">
                Feedback is a <strong>near-pure tone</strong> with very low spectral flatness (Wiener entropy) around the
                frequency. The amplitude distribution also has high kurtosis (very peaky, non-Gaussian).
              </p>
              <ul className="space-y-1">
                <li><strong>Spectral Flatness {'<'} 0.05:</strong> Pure-tone content (strong feedback indicator)</li>
                <li><strong>Kurtosis {'>'} 10:</strong> Strongly peaked amplitude distribution</li>
                <li><strong>Note:</strong> A feedback tone {'<'} 0.05 flatness is correctly routed to the fusion engine as unknown content type — not classified as speech — to avoid over-weighting MSD alone</li>
              </ul>
            </Section>

            <Section title="Comb Filter Pattern Detection">
              <p className="mb-2">
                From the <strong>DBX paper</strong>. A single mic-to-speaker acoustic path with round-trip
                delay <em>d/c</em> causes feedback at evenly spaced frequencies.
              </p>
              <ul className="space-y-1">
                <li><strong>Comb spacing:</strong> df = c / d (where c = 343 m/s, d = path length in metres)</li>
                <li><strong>Path estimation:</strong> d = c / df (inverse of the above)</li>
                <li><strong>Pattern detection:</strong> GCD of all inter-peak spacings; 3+ peaks must match within 5%</li>
                <li><strong>Prediction:</strong> Next expected feedback frequencies calculated from df</li>
              </ul>
              <p className="mt-2 text-xs">
                Note: the formula is <em>df = c / d</em>, not c / (2d). The c / (2d) formula applies to
                standing waves in a closed tube (reflections at both ends). For an open acoustic feedback
                loop the round-trip adds one full delay period per cycle.
              </p>
            </Section>

            <Section title="Compression Detection (True Dynamic Range)">
              <p className="mb-2">
                The DAFx-16 research found that <strong>dynamically compressed content</strong> (rock/pop music)
                causes false positives because sustained notes have flat amplitude curves similar to early feedback.
                Detection uses two independent metrics:
              </p>
              <ul className="space-y-1">
                <li><strong>Crest Factor</strong> = mean(peak_dB - RMS_dB) per frame. Normal: 12-14 dB. Compressed: {'<'} 6 dB</li>
                <li><strong>True Dynamic Range</strong> = max(peak_dB) - min(RMS_dB) over the history window. Normal: {'>'} 20 dB. Compressed: {'<'} 8 dB</li>
                <li><strong>Adaptation:</strong> When either threshold triggers, phase coherence gets more weight in fusion</li>
              </ul>
              <p className="mt-2 text-xs">
                The previous implementation stored only crest-factor variance (not true dynamic range).
                This caused heavily compressed rock tracks to slip past the compression gate.
              </p>
            </Section>

            <Section title="RT60-Aware Q Thresholds">
              <p className="mb-2">
                Rooms with long reverberation times (RT60) produce high-Q room modes that can look like
                feedback peaks. The Q threshold adapts using the Hopkins relationship:
              </p>
              <ul className="space-y-1">
                <li><strong>Q_room = pi * f * RT60 / 6.9</strong></li>
                <li>If measured Q {'<'} Q_room: probable room mode — feedback probability reduced by up to -0.15</li>
                <li>If measured Q {'>'} 1.5 x Q_room: unusually sharp — feedback probability boosted by up to +0.10</li>
              </ul>
            </Section>

            <Section title="Algorithm Fusion">
              <p className="mb-2">
                All algorithms vote together with content-aware weighting. Weights sum to 1.0 and are
                applied as a weighted average:
              </p>
              <ul className="space-y-1">
                <li><strong>Speech:</strong> MSD 45%, Phase 25%, Spectral 15%, Comb 5%, Legacy 10%</li>
                <li><strong>Music:</strong> MSD 20%, Phase 40%, Spectral 15%, Comb 10%, Legacy 15%</li>
                <li><strong>Compressed:</strong> MSD 15%, Phase 45%, Spectral 20%, Comb 10%, Legacy 10%</li>
                <li><strong>Unknown:</strong> MSD 30%, Phase 35%, Spectral 15%, Comb 10%, Legacy 10%</li>
              </ul>
              <p className="mt-2 text-xs">
                The system automatically detects content type and applies appropriate weights.
                When a comb pattern is found, its weight is doubled in the numerator to act as a
                strong tiebreaker while remaining normalised.
              </p>
            </Section>

            <Section title="Algorithm Settings (Algo Tab)">
              <ul className="space-y-2">
                <li><strong>Algorithm Mode:</strong> Auto, MSD Only, Phase Only, Combined (MSD+Phase), or All</li>
                <li><strong>MSD History Buffer:</strong> Number of frames (7-50). More = accurate but slower. Allocates at MAX_FRAMES (30) to avoid silent-window resize bugs.</li>
                <li><strong>Phase Coherence Threshold:</strong> 40-95%. Higher = stricter, fewer false positives</li>
                <li><strong>Fusion Feedback Threshold:</strong> 40-90%. Combined probability needed for positive detection</li>
                <li><strong>Compression Detection:</strong> Enable/disable adaptive threshold adjustment</li>
                <li><strong>Comb Pattern Detection:</strong> Enable/disable acoustic path identification</li>
              </ul>
            </Section>
          </TabsContent>

          {/* TIPS */}
          <TabsContent value="tips" className="mt-4 space-y-4">
            <Section title="Workflow Best Practices">
              <ol className="list-decimal list-inside space-y-2">
                <li>Start with <strong>Calibration</strong> mode during initial system setup</li>
                <li>Enable <strong>Show Algorithm Scores</strong> to see what each algorithm is detecting</li>
                <li>Watch the <strong>MSD frame count</strong> — wait for 15+ frames before trusting results</li>
                <li>If you see <strong>COMPRESSED</strong> in the status bar, phase coherence is most reliable</li>
                <li>Use <strong>Comb Pattern</strong> predictions to preemptively address upcoming feedback frequencies</li>
                <li>Switch to <strong>Feedback Hunt</strong> for general PA monitoring</li>
                <li>Enable <strong>Auto Music-Aware</strong> so sensitivity adjusts automatically during shows</li>
                <li>Apply cuts conservatively — start with 3 dB and increase only if needed</li>
              </ol>
            </Section>

            <Section title="Getting Better Results">
              <ul className="space-y-2">
                <li><strong>Position matters:</strong> Place your analysis mic where feedback occurs</li>
                <li><strong>Gain staging:</strong> Ensure signal is strong but not clipping (default +15 dB)</li>
                <li><strong>Increase MSD frames:</strong> For compressed music, try 30-50 frames</li>
                <li><strong>Lower Phase threshold:</strong> For noisy environments, try 65-70%</li>
                <li><strong>Watch Content Type:</strong> The auto-detected type tells you which algorithms are most reliable</li>
                <li><strong>RT60 setting:</strong> Enter your room's measured RT60 in Room Acoustics — this improves Q threshold accuracy and Schroeder frequency calculation</li>
              </ul>
            </Section>

            <Section title="Understanding Algorithm Scores">
              <ul className="space-y-2">
                <li><strong>MSD HIGH:</strong> Second derivative near zero — strong feedback indicator</li>
                <li><strong>Phase LOCKED:</strong> Consistent phase relationship — strong feedback indicator</li>
                <li><strong>Spectral PURE:</strong> Very low flatness — single tone present</li>
                <li><strong>Comb PATTERN:</strong> Regular frequency spacing — feedback loop identified</li>
                <li><strong>COMPRESSED:</strong> Dynamic compression detected — phase is most reliable</li>
              </ul>
            </Section>

            <Section title="Common Feedback Frequency Ranges">
              <ul className="space-y-2">
                <li><strong>200-500 Hz:</strong> Muddy buildup, boxy vocals, room modes</li>
                <li><strong>500 Hz-1 kHz:</strong> Nasal/honky tones, vocal feedback zone</li>
                <li><strong>1-3 kHz:</strong> Presence/intelligibility range, harsh feedback</li>
                <li><strong>3-6 kHz:</strong> Sibilance, cymbal harshness, piercing feedback</li>
                <li><strong>6-8 kHz:</strong> Air/brightness, high-frequency ringing</li>
              </ul>
            </Section>
          </TabsContent>

          {/* TROUBLESHOOT */}
          <TabsContent value="troubleshoot" className="mt-4 space-y-4">
            <Section title="No Audio Input">
              <ul className="space-y-2">
                <li>Check browser microphone permissions (camera/mic icon in address bar)</li>
                <li>Ensure correct input device is selected in system audio settings</li>
                <li>Try refreshing the page and granting permissions again</li>
                <li>Microphone access requires HTTPS in most browsers</li>
              </ul>
            </Section>

            <Section title="Too Many False Positives">
              <ul className="space-y-2">
                <li>Switch to <strong>Music-Aware</strong> mode during performance</li>
                <li>In the <strong>Algo tab</strong>: Raise Phase Coherence Threshold to 80-85%</li>
                <li>In the <strong>Algo tab</strong>: Raise Fusion Feedback Threshold to 75-85%</li>
                <li>Increase <strong>MSD History Buffer</strong> to 30-50 frames for compressed music</li>
                <li>Enable <strong>Compression Detection</strong> for rock/pop content</li>
                <li>Raise <strong>Threshold</strong> in sidebar (try 10-14 dB)</li>
              </ul>
            </Section>

            <Section title="Missing Feedback Detection">
              <ul className="space-y-2">
                <li>Lower <strong>Threshold</strong> in sidebar (try 4-6 dB)</li>
                <li>Increase <strong>Input Gain</strong> if signal level is low</li>
                <li>Switch to <strong>Aggressive</strong> or <strong>Calibration</strong> mode</li>
                <li>In the <strong>Algo tab</strong>: Lower Phase Coherence Threshold to 60-65%</li>
                <li>In the <strong>Algo tab</strong>: Lower Fusion Feedback Threshold to 50-55%</li>
                <li>Increase <strong>FFT Size</strong> to 16384 for better low-frequency resolution</li>
              </ul>
            </Section>

            <Section title="Compressed Music False Positives">
              <p className="mb-2">
                Dynamically compressed music (rock, pop, EDM) triggers false positives because
                sustained notes have flat amplitude envelopes — the same signature as early feedback.
                The system detects this via crest factor and true dynamic range.
              </p>
              <ul className="space-y-2">
                <li>Enable <strong>Compression Detection</strong> in the Algo tab</li>
                <li>Increase <strong>MSD History Buffer</strong> to 40-50 frames</li>
                <li>Watch the Algorithm Status Bar — when it shows COMPRESSED, phase coherence is most reliable</li>
                <li>Use <strong>Phase Only</strong> algorithm mode for heavily compressed content</li>
              </ul>
            </Section>

            <Section title="Slow or Laggy Display">
              <ul className="space-y-2">
                <li>Reduce <strong>FFT Size</strong> to 4096 in Settings</li>
                <li>Reduce <strong>MSD History Buffer</strong> to 15-20 frames</li>
                <li>Disable <strong>Show Algorithm Scores</strong> and <strong>Show Phase Display</strong></li>
                <li>Close other browser tabs to free CPU resources</li>
              </ul>
            </Section>
          </TabsContent>

          {/* TECHNICAL */}
          <TabsContent value="technical" className="mt-4 space-y-4">
            <Section title="Analysis Engine">
              <ul className="space-y-2">
                <li><strong>FFT Analysis:</strong> Fast Fourier Transform via Web Audio API AnalyserNode. Default 8192 bins at 48 kHz = 5.86 Hz/bin resolution</li>
                <li><strong>Peak Detection:</strong> Local maxima exceeding adaptive noise floor and detection threshold, with quadratic interpolation for sub-bin accuracy</li>
                <li><strong>Track Persistence:</strong> Peaks tracked across frames to distinguish sustained feedback from transients (50 cents tolerance)</li>
                <li><strong>Harmonic Filtering:</strong> Suppresses harmonics (up to 8th) of detected fundamentals to avoid double-counting</li>
                <li><strong>Phase Extraction:</strong> Targeted Goertzel filter on active peak bins only — avoids full-spectrum FFT (100x cheaper than naive approach)</li>
                <li><strong>Algorithm Fusion:</strong> MSD, Phase, Spectral, and Comb algorithms vote with content-aware weighting</li>
              </ul>
            </Section>

            <Section title="Default Configuration">
              <ul className="space-y-2">
                <li><strong>Mode:</strong> Feedback Hunt</li>
                <li><strong>Frequency range:</strong> 200 Hz - 8 kHz (vocal-focused)</li>
                <li><strong>Feedback threshold:</strong> 8 dB</li>
                <li><strong>Ring threshold:</strong> 4 dB</li>
                <li><strong>Growth rate:</strong> 1.5 dB/s</li>
                <li><strong>FFT size:</strong> 8192</li>
                <li><strong>Frequency resolution:</strong> 48000 / 8192 = 5.86 Hz/bin</li>
                <li><strong>Smoothing:</strong> 60%</li>
                <li><strong>Hold time:</strong> 3 s</li>
                <li><strong>Input gain:</strong> +15 dB</li>
                <li><strong>Confidence threshold:</strong> 40%</li>
                <li><strong>Algorithm mode:</strong> Combined (MSD + Phase)</li>
                <li><strong>MSD min frames:</strong> 15</li>
                <li><strong>Phase coherence threshold:</strong> 75%</li>
                <li><strong>Fusion feedback threshold:</strong> 65%</li>
              </ul>
            </Section>

            <Section title="Severity Levels">
              <ul className="space-y-2">
                <li><strong className="text-red-500">RUNAWAY:</strong> Active feedback rapidly increasing — address immediately</li>
                <li><strong className="text-orange-500">GROWING:</strong> Feedback building but not yet critical</li>
                <li><strong className="text-yellow-500">RESONANCE:</strong> Stable resonant peak that could become feedback</li>
                <li><strong className="text-purple-500">RING:</strong> Subtle ring that may need attention</li>
                <li><strong className="text-cyan-500">WHISTLE:</strong> Detected whistle or sibilance</li>
                <li><strong className="text-green-500">INSTRUMENT:</strong> Likely musical content, not feedback</li>
              </ul>
            </Section>

            <Section title="GEQ Band Mapping">
              <p className="mb-2">Detected frequencies map to nearest ISO 31-band center frequency:</p>
              <p className="text-xs font-mono bg-muted p-2 rounded leading-relaxed">
                20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1k, 1.25k, 1.6k, 2k, 2.5k, 3.15k, 4k, 5k, 6.3k, 8k, 10k, 12.5k, 16k, 20k Hz
              </p>
            </Section>

            <Section title="Browser Requirements">
              <ul className="space-y-2">
                <li><strong>Web Audio API + getUserMedia:</strong> Required for real-time audio processing</li>
                <li><strong>Supported:</strong> Chrome 74+, Firefox 76+, Safari 14.1+, Edge 79+</li>
                <li><strong>Sample rate:</strong> Uses system default (typically 44.1 kHz or 48 kHz)</li>
                <li><strong>HTTPS:</strong> Required for microphone access in production</li>
              </ul>
            </Section>
          </TabsContent>

          {/* THE MATH */}
          <TabsContent value="math" className="mt-4 space-y-4">
            <Section title="FFT and Spectral Analysis">
              <p className="mb-2">
                The core analysis uses the <strong>Fast Fourier Transform</strong> to decompose audio into frequency bins:
              </p>
              <div className="bg-muted p-3 rounded font-mono text-xs space-y-1">
                <p>Frequency resolution: <strong>df = fs / N</strong></p>
                <p>At 8192-pt FFT, 48 kHz: df = 48000 / 8192 = <strong>5.86 Hz/bin</strong></p>
                <p>At 8192-pt FFT, 44.1 kHz: df = 44100 / 8192 = <strong>5.38 Hz/bin</strong></p>
                <p>Bin to Hz: <strong>f = bin * (fs / N)</strong></p>
                <p>Number of unique bins: N/2 + 1 = <strong>4097</strong> (Nyquist limit)</p>
              </div>
              <p className="mt-2 text-xs">
                Quadratic interpolation refines peak frequency beyond bin resolution (Grandke, 1983):
              </p>
              <div className="bg-muted p-3 rounded font-mono text-xs space-y-1">
                <p>d = 0.5 * (y[k-1] - y[k+1]) / (y[k-1] - 2*y[k] + y[k+1])</p>
                <p>f_true = (k + d) * (fs / N)</p>
                <p>Valid when y[k] is the local maximum (y[k-1] and y[k+1] both less than y[k])</p>
              </div>
            </Section>

            <Section title="MSD Algorithm (DAFx-16)">
              <p className="mb-2">
                The <strong>Magnitude Slope Deviation</strong> algorithm exploits the fact that feedback
                grows exponentially in amplitude, which appears <strong>linear in dB scale</strong>:
              </p>
              <div className="bg-muted p-3 rounded font-mono text-xs space-y-1">
                <p>Feedback amplitude: A(t) = A0 * e^(a*t)</p>
                <p>In dB: L(t) = L0 + (20*a / ln(10)) * t  — a straight line</p>
                <p>First derivative: dL/dt = constant</p>
                <p>Second derivative: <strong>d2L/dt2 = 0  (feedback has zero curvature)</strong></p>
                <p>Music: dL/dt varies — second derivative is large and fluctuating</p>
              </div>
              <p className="mt-2 text-xs">
                The Summing MSD is the mean squared second derivative over N frames:
              </p>
              <div className="bg-muted p-3 rounded font-mono text-xs space-y-1">
                <p><strong>MSD(k,m) = (1/M) * SUM[n=2 to M-1] (G[n+1] - 2*G[n] + G[n-1])^2</strong></p>
                <p>G[n] = magnitude of bin k at frame n, in dB</p>
                <p>M = number of history frames (default 15)</p>
                <p>MSD near 0.0: straight-line amplitude — likely feedback</p>
                <p>MSD above 0.1: curved amplitude — likely music (threshold per DAFx-16)</p>
              </div>
              <p className="mt-2 text-xs">
                Detection threshold is 0.1 (dB/frame)^2, normalised per frame from the paper's value of
                1.0 (dB/frame)^2 over 16 frames (16 - 2 terms = 14 denominator → 1.0/14 ≈ 0.071).
                An energy gate rejects silent bins ({'<'} -70 dBFS) to prevent false positives during silence.
                The Summing MSD method is <strong>140x more computationally efficient</strong> than the
                original algorithm while maintaining 100% detection accuracy for speech and classical music.
              </p>
            </Section>

            <Section title="Phase Coherence (Nyquist Criterion)">
              <p className="mb-2">
                True feedback occurs when the <strong>Nyquist stability criterion</strong> is satisfied simultaneously for magnitude and phase:
              </p>
              <div className="bg-muted p-3 rounded font-mono text-xs space-y-1">
                <p>Magnitude condition: |G(w) * H(w)| {'>'} 1  (loop gain exceeds unity)</p>
                <p>Phase condition: angle(G(w) * H(w)) = n * 2*pi  (loop phase is multiple of 360 deg)</p>
              </div>
              <p className="mt-2 text-xs">
                The second condition means feedback locks to a specific phase. Phase coherence C(k) measures
                how phase-locked a bin is over N consecutive frames, using the mean phasor magnitude:
              </p>
              <div className="bg-muted p-3 rounded font-mono text-xs space-y-1">
                <p><strong>C(k) = | (1/N) * SUM[n=1 to N] exp(j * dPhi(k,n)) |</strong></p>
                <p>dPhi(k,n) = phi(k,n) - phi(k, n-1)  (frame-to-frame phase difference)</p>
                <p>C(k) in [0, 1]: 1 = perfectly phase-locked, 0 = random phase</p>
                <p>Feedback threshold: C {'>'} 0.85</p>
                <p>Music typical: C {'<'} 0.65</p>
              </div>
              <p className="mt-2 text-xs">
                Phase is extracted using a <strong>Goertzel filter</strong> (per-bin DFT) applied only to
                active peak bins, not all 4096 bins. Cost: ~8 bins x 8192 samples = 65k multiply-adds
                per frame (vs. 33M for a naive full-spectrum approach).
              </p>
            </Section>

            <Section title="Spectral Flatness (Wiener Entropy)">
              <p className="mb-2">
                Measures how tone-like vs noise-like a signal is. Ranges from 0 (pure tone) to 1 (white noise):
              </p>
              <div className="bg-muted p-3 rounded font-mono text-xs space-y-1">
                <p><strong>SF = geometric_mean(X) / arithmetic_mean(X)</strong></p>
                <p>     = exp( (1/N) * SUM[k] ln(X[k]) ) / ( (1/N) * SUM[k] X[k] )</p>
                <p>X[k] = power spectrum magnitude at bin k</p>
              </div>
              <p className="mt-2 text-xs">Interpretation:</p>
              <ul className="text-xs mt-1 space-y-1">
                <li>SF = 0: Single-frequency pure tone = <strong>feedback</strong></li>
                <li>SF {'<'} 0.05: Very tonal (pure tone or near-pure) — routed as unknown, not speech</li>
                <li>SF 0.05-0.15: Tonal with harmonics — instrument or early feedback</li>
                <li>SF {'>'} 0.2: Broadband — music or noise</li>
                <li>SF = 1: White noise (flat power spectrum)</li>
              </ul>
            </Section>

            <Section title="Kurtosis">
              <p className="mb-2">
                Excess kurtosis measures the "peakedness" of the amplitude distribution relative to a Gaussian.
                Feedback produces a highly impulsive (very peaked) distribution:
              </p>
              <div className="bg-muted p-3 rounded font-mono text-xs space-y-1">
                <p><strong>K = E[(X - mu)^4] / (E[(X - mu)^2])^2 - 3</strong></p>
                <p>Gaussian noise: K = 0</p>
                <p>Pure sine (feedback): K = -1.5  (sub-Gaussian — uniformly distributed phase)</p>
                <p>Impulsive/clipped: K {'>'} 0  (super-Gaussian)</p>
              </div>
              <p className="mt-2 text-xs">
                Note: a pure sine wave has negative excess kurtosis (-1.5), not positive.
                Sustained feedback in a reverberant room can have kurtosis near zero to slightly negative.
                High positive kurtosis indicates transient impulses or clipping, not steady-state feedback.
              </p>
            </Section>

            <Section title="Comb Filter Pattern (DBX)">
              <p className="mb-2">
                A single open acoustic feedback path (mic to speaker, round-trip delay tau = d/c)
                creates feedback at frequencies where the loop phase is a multiple of 2*pi:
              </p>
              <div className="bg-muted p-3 rounded font-mono text-xs space-y-1">
                <p>Condition: 2*pi*f*tau = n * 2*pi  ={">"} f_n = n / tau = n * c / d</p>
                <p><strong>Comb spacing: df = c / d</strong></p>
                <p>Path length from spacing: <strong>d = c / df</strong></p>
                <p>c = 343 m/s (speed of sound at 20 degC)</p>
              </div>
              <p className="mt-2 text-xs">
                The c/(2d) formula applies to <em>standing waves in a closed tube</em> (Melde's equation),
                where reflections at both ends halve the fundamental frequency. An open acoustic feedback
                loop has no hard reflection — the delay is a one-way path traversed each loop cycle,
                giving comb spacing df = c/d.
              </p>
              <p className="mt-2 text-xs">Example: 3-metre mic-to-speaker distance</p>
              <div className="bg-muted p-3 rounded font-mono text-xs space-y-1">
                <p>df = 343 / 3 = 114 Hz</p>
                <p>Feedback modes at: 114, 228, 343, 457, 571 Hz ...</p>
              </div>
              <p className="mt-2 text-xs">Detection algorithm:</p>
              <ol className="text-xs mt-1 space-y-1 list-decimal list-inside">
                <li>Collect all currently active peak frequencies</li>
                <li>Compute all pairwise frequency differences</li>
                <li>Find greatest common divisor (GCD) of the differences (5% tolerance)</li>
                <li>If 3 or more peaks align to the GCD pattern, flag as comb</li>
                <li>Predicted next frequencies: f_pred = n * df for integer n</li>
              </ol>
            </Section>

            <Section title="Compression Detection (True Dynamic Range)">
              <p className="mb-2">
                Two metrics are computed over a sliding window of amplitude history frames:
              </p>
              <div className="bg-muted p-3 rounded font-mono text-xs space-y-1">
                <p><strong>Crest Factor = mean( peak_dB[n] - RMS_dB[n] )  over N frames</strong></p>
                <p>Normal uncompressed: CF = 12-14 dB</p>
                <p>Compressed (brick-wall limited): CF {'<'} 6 dB</p>
                <p></p>
                <p><strong>True Dynamic Range = max( peak_dB ) - min( RMS_dB )  over N frames</strong></p>
                <p>Normal programme: DR {'>'} 20 dB</p>
                <p>Heavily compressed: DR {'<'} 8 dB</p>
              </div>
              <p className="mt-2 text-xs">
                Previous implementations stored only (peak - RMS) per frame, which measured
                crest-factor variance — not the actual dynamic range of the programme.
                True dynamic range uses separate peak and RMS histories to compare the loudest
                peak to the quietest sustained passage.
                Threshold multiplier scales up to 1.5x for heavily limited content.
              </p>
            </Section>

            <Section title="RT60 Q Threshold (Hopkins, 2007)">
              <p className="mb-2">
                A room mode at frequency f with RT60 reverberation time has Q factor:
              </p>
              <div className="bg-muted p-3 rounded font-mono text-xs space-y-1">
                <p><strong>Q_room = pi * f * RT60 / 6.9</strong></p>
                <p>Derived from Sabine: T60 = 6.9 / (pi * f * eta),  Q = 1/eta</p>
              </div>
              <p className="mt-2 text-xs">
                Example: 500 Hz mode in a room with RT60 = 1.0 s gives Q_room = pi * 500 * 1.0 / 6.9 = 227.
                A spectral peak at 500 Hz with Q = 200 is below Q_room — it is likely a room mode.
                A peak with Q = 400 ({'>'} 1.5 * Q_room = 340) is unusually sharp — more likely feedback.
              </p>
            </Section>

            <Section title="Modal Density (Hopkins, 2007 — Eq. 1.77)">
              <p className="mb-2">
                The number of room modes per Hz at frequency f in a rectangular room:
              </p>
              <div className="bg-muted p-3 rounded font-mono text-xs space-y-1">
                <p><strong>n(f) = 4*pi*f^2*V/c^3  +  pi*f*S/(2*c^2)  +  L/(8*c)</strong></p>
                <p>V = room volume (m^3),  S = total surface area (m^2)</p>
                <p>L = total edge length (m),  c = 343 m/s</p>
              </div>
              <p className="mt-2 text-xs">
                Interpretation for feedback detection:
              </p>
              <ul className="text-xs mt-1 space-y-1">
                <li>n(f) {'<'} 0.5 modes/Hz: Sparse modal field — individual peaks are ambiguous (could be mode or feedback)</li>
                <li>n(f) {'>'} 2 modes/Hz: Dense modal field — modes blend together; a sharp narrow peak stands out as feedback</li>
              </ul>
            </Section>

            <Section title="Schroeder Frequency (Hopkins, 2007)">
              <p className="mb-2">
                Below the Schroeder frequency, individual room modes dominate and peaks are likely room
                resonances, not feedback. Above it, the modal field is statistically diffuse.
              </p>
              <div className="bg-muted p-3 rounded font-mono text-xs space-y-1">
                <p><strong>f_S = 2000 * sqrt(T60 / V)</strong></p>
                <p>T60 = RT60 reverberation time (seconds)</p>
                <p>V = room volume (m^3)</p>
              </div>
              <p className="mt-2 text-xs">Examples:</p>
              <div className="bg-muted p-3 rounded font-mono text-xs space-y-1">
                <p>Conference room: T60=0.7s, V=250m^3  {"=>"} f_S = 2000*sqrt(0.7/250) = <strong>89 Hz</strong></p>
                <p>Small venue:     T60=1.2s, V=500m^3  {"=>"} f_S = 2000*sqrt(1.2/500) = <strong>98 Hz</strong></p>
                <p>Large hall:      T60=2.5s, V=5000m^3 {"=>"} f_S = 2000*sqrt(2.5/5000) = <strong>45 Hz</strong></p>
              </div>
              <p className="mt-2 text-xs">
                Peaks below f_S receive a -0.25 reduction in feedback probability (Schroeder penalty).
              </p>
            </Section>

            <Section title="Q Factor Estimation">
              <p className="mb-2">
                Q measures resonance sharpness. Estimated from the -3 dB bandwidth of a spectral peak:
              </p>
              <div className="bg-muted p-3 rounded font-mono text-xs space-y-1">
                <p><strong>Q = f_center / BW_3dB</strong></p>
                <p>BW_3dB = upper_-3dB_freq - lower_-3dB_freq</p>
              </div>
              <p className="mt-2 text-xs">Reference values:</p>
              <ul className="text-xs mt-1 space-y-1">
                <li>Q {'<'} 4: Broad peak — room mode or instrument body resonance</li>
                <li>Q 4-20: Moderate — instrument fundamental or early feedback</li>
                <li>Q 20-100: Narrow — strong resonance, probable feedback candidate</li>
                <li>Q {'>'} 100: Very narrow — almost certainly feedback or test tone</li>
              </ul>
              <p className="mt-2 text-xs">
                Q thresholds are adjusted by the RT60-aware formula above and by frequency band
                (LOW band uses 0.6x multiplier; HIGH band uses 1.2x multiplier).
              </p>
            </Section>

            <Section title="A-Weighting (IEC 61672-1:2013)">
              <p className="mb-2">
                Optional A-weighting emphasizes frequencies where human hearing is most sensitive (1-5 kHz).
                Defined analytically per IEC 61672-1:
              </p>
              <div className="bg-muted p-3 rounded font-mono text-xs space-y-1">
                <p>R_A(f) = (12194^2 * f^4)</p>
                <p>        / [ (f^2 + 20.6^2) * (f^2 + 12194^2)</p>
                <p>            * sqrt(f^2 + 107.7^2) * sqrt(f^2 + 737.9^2) ]</p>
                <p>A(f)   = 20 * log10(R_A(f)) + 2.0 dB</p>
              </div>
              <p className="mt-2 text-xs">
                Key A-weighted levels: 1 kHz = 0 dB, 4 kHz = +1 dB, 100 Hz = -19.1 dB, 20 Hz = -50.4 dB.
              </p>
            </Section>

            <Section title="References">
              <ul className="text-xs space-y-1">
                <li><strong>DAFx-16:</strong> Peeters et al. — Magnitude Slope Deviation algorithm for howling detection. 140x efficiency vs. original. Proc. DAFx, 2016.</li>
                <li><strong>DBX:</strong> Comb filter pattern analysis and acoustic path estimation for feedback suppression systems.</li>
                <li><strong>KU Leuven (arXiv 2512.01466, 2025):</strong> 2-channel AFC algorithm with PEM-AFROW framework for closed-loop acoustic feedback control.</li>
                <li><strong>Hopkins, C. (2007).</strong> <em>Sound Insulation.</em> Butterworth-Heinemann. Modal density (Eq. 1.77), Schroeder frequency, RT60 Q relationships.</li>
                <li><strong>Grandke, T. (1983).</strong> Interpolation algorithms for discrete Fourier transforms of weighted signals. <em>IEEE Trans. Instrum. Meas.</em>, 32(2), 350-355.</li>
                <li><strong>IEC 61672-1:2013.</strong> Electroacoustics — Sound level meters — Part 1: Specifications. Defines A-weighting curves.</li>
                <li><strong>Nyquist, H. (1932).</strong> Regeneration theory. <em>Bell System Technical Journal</em>, 11(1), 126-147.</li>
                <li><strong>Smaart v8 User Guide.</strong> Rational Acoustics. Coherence measurement methodology for transfer function analysis.</li>
              </ul>
            </Section>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
      <div className="text-sm text-muted-foreground leading-relaxed">
        {children}
      </div>
    </div>
  )
}
