import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer.jsx";
const LOCAL = import.meta.env.VITE_BACKEND_URL;
const PRODUCTION_URL = import.meta.env.VITE_PRODUCTION_URL;
const apiURL = LOCAL || PRODUCTION_URL;

function DisplayLecturetteQuestion() {
  const [stage, setStage] = useState("loading"); // loading, showTopic, showSpeech
  const [lecturette, setLecturette] = useState(null);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes = 180 sec
  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [timerStarted, setTimerStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [firstTranscript, setFirstTranscript] = useState("");
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestionText, setSuggestionText] = useState("");
  const [score, setScore] = useState(null);
  const [checkingScore, setCheckingScore] = useState(false);
  // Submit Lecturette test result to backend
  const submitLecturetteTestResult = useCallback(async () => {
    const testResult = {
      testName: "Lecturette Test",
      score: 1, // or your scoring logic
      timeTaken: 180 - timeLeft, // seconds taken
      dateTaken: new Date().toISOString(),
    };

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`${apiURL}/v1/addLecturetteTestResult`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(testResult),
      });
    } catch (err) {
      console.error("Failed to save Lecturette test result", err);
    }
  }, [timeLeft]);

  useEffect(() => {
    const fetchLecturette = async () => {
      try {
        const response = await fetch(
          `${apiURL}/alltest/lecturette/DisplayLecturetteQuestion`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch lecturette topic");
        }
        const data = await response.json();
        setLecturette(data);
        setStage("showTopic");
      } catch (error) {
        console.error("Error fetching lecturette:", error);
      }
    };

    fetchLecturette();
  }, []);

  // Start user media (camera + mic) when topic shows
  useEffect(() => {
    let mounted = true;
    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
          audio: true,
        });

        if (!mounted) {
          // if component unmounted before stream ready
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        setMediaStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // mute preview to avoid echo during local practice
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.warn("Could not access camera/microphone:", err);
      }
    };

    if (stage === "showTopic") startMedia();

    return () => {
      mounted = false;
    };
  }, [stage]);

  // Start/stop SpeechRecognition when timerStarted toggles
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Browser doesn't support Web Speech API
      return;
    }

    if (stage !== "showTopic") return;

    if (timerStarted) {
      try {
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = "en-US";

        recog.onstart = () => {
          setIsRecording(true);
        };

        recog.onresult = (event) => {
          let interim = "";
          let final = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const res = event.results[i];
            if (res.isFinal) final += res[0].transcript;
            else interim += res[0].transcript;
          }
          // update live transcript
          setTranscript((prev) => {
            // prefer final when available
            return (prev && prev.length > 0 && !final) ? prev : (prev + final + interim);
          });

          if (final && !firstTranscript) {
            setFirstTranscript(final.trim());
          }
        };

        recog.onerror = (e) => {
          console.warn("Speech recognition error", e);
        };

        recog.onend = () => {
          setIsRecording(false);
          // auto-restart if timer still running
          if (timerStarted && stage === "showTopic") {
            try {
              recog.start();
              setIsRecording(true);
            } catch {
              // ignore start errors
            }
          }
        };

        recognitionRef.current = recog;
        recog.start();
      } catch (e) {
        console.warn("Failed to start speech recognition:", e);
      }
    } else {
      // stop recognition if running
      const r = recognitionRef.current;
      if (r) {
        try {
          r.onend = null;
          r.stop();
        } catch {
          // ignore
        }
        recognitionRef.current = null;
      }
      setIsRecording(false);
    }

    return () => {
      const r = recognitionRef.current;
      if (r) {
        try {
          r.onend = null;
          r.stop();
        } catch {
          // ignore
        }
        recognitionRef.current = null;
      }
      setIsRecording(false);
    };
  }, [timerStarted, stage, firstTranscript]);

  useEffect(() => {
    let timer;
    // only countdown when user has started the timer
    if (stage === "showTopic" && timerStarted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (stage === "showTopic" && timerStarted && timeLeft === 0) {
      setStage("showSpeech");
      submitLecturetteTestResult();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, stage, timerStarted, submitLecturetteTestResult]);

  // clean up media when leaving or unmounting
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [mediaStream]);

  const stopHandler = () => {
    setStage("showSpeech");
    submitLecturetteTestResult();
  };

  const toggleMic = () => {
    if (!mediaStream) return;
    const audioTracks = mediaStream.getAudioTracks();
    audioTracks.forEach((t) => (t.enabled = !t.enabled));
    setMicEnabled((s) => !s);
  };

  const toggleCamera = () => {
    if (!mediaStream) return;
    const videoTracks = mediaStream.getVideoTracks();
    videoTracks.forEach((t) => (t.enabled = !t.enabled));
    setCameraEnabled((s) => !s);
  };

  const goToAllTest = () => {
    navigate("/alltest");
  };

  const localGenerateSuggestion = (text) => {
    // Simple local heuristics to produce suggestions when backend not available
    const suggestions = [];
    if (!text || text.trim().length < 20) {
      suggestions.push("Your response is very short — try to add more structure and examples.");
      suggestions.push("Include a brief introduction, 2-3 supporting points, and a short conclusion.");
      suggestions.push("Speak slowly and clearly; avoid filler words like 'um' or 'like'.");
    } else {
      suggestions.push("Structure: Add a one-sentence intro, 2-3 supporting points, and a one-line conclusion.");
      suggestions.push("Clarity: Replace long sentences with 1-2 concise sentences; avoid repetition.");
      suggestions.push("Delivery: Slow down slightly and pause between points to sound confident.");
    }
    return suggestions.join('\n\n');
  };

  const handleGetSuggestion = async () => {
    const text = firstTranscript || transcript || lecturette?.speech || '';
    if (!text) {
      setSuggestionText('No recorded text available to suggest on.');
      return;
    }

    setSuggestionLoading(true);
    setSuggestionText('');
    try {
      // Try backend Gemini route if available
      const res = await fetch('/v1/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speechText: text, topic: lecturette?.topic || '' }),
      });

      if (res.ok) {
        const data = await res.json();
        const txt = data?.text || data?.result || '';
        if (txt) setSuggestionText(String(txt));
        else setSuggestionText(localGenerateSuggestion(text));
      } else {
        setSuggestionText(localGenerateSuggestion(text));
      }
    } catch (e) {
      // fallback to local generation
      console.warn('Suggestion generation failed', e);
      setSuggestionText(localGenerateSuggestion(text));
    } finally {
      setSuggestionLoading(false);
    }
  };

  const computeScoreFromText = (text) => {
    if (!text || !text.trim()) return { score: 0, reasons: ['No speech detected'] };
    const words = text.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const avgWordLen = words.reduce((s,w)=>s+w.length,0)/wordCount;
    const fillerMatches = (text.match(/\b(um+|uh+|like|you know|so)\b/gi) || []).length;

    // base score
    let s = 50;
    s += Math.min(25, Math.floor(wordCount / 4)); // more content increases score up to +25
    s += avgWordLen > 4 ? 10 : 0; // slightly favor richer vocabulary
    s -= fillerMatches * 7; // penalize fillers
    if (s > 100) s = 100;
    if (s < 0) s = 0;

    const reasons = [];
    reasons.push(`Words: ${wordCount}`);
    reasons.push(`Avg word length: ${avgWordLen.toFixed(1)}`);
    if (fillerMatches > 0) reasons.push(`Filler words detected: ${fillerMatches}`);
    if (wordCount < 30) reasons.push('Try to expand your answer with 2–3 supporting points.');
    return { score: Math.round(s), reasons };
  };

  const handleCheckScore = async () => {
    setCheckingScore(true);
    try {
      const text = firstTranscript || transcript || lecturette?.speech || '';
      if (!text) {
        setScore({ score: 0, reasons: ['No speech detected'] });
        return;
      }

      // Try backend model-based assessment first
      try {
        const res = await fetch('/v1/gemini/assess', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ speechText: text }),
        });

        if (res.ok) {
          const data = await res.json();
          // Expecting { score: number (0-10), reasons: [string], raw }
          if (typeof data.score === 'number') {
            const reasons = Array.isArray(data.reasons) && data.reasons.length ? data.reasons : (data.raw ? [data.raw] : []);
            setScore({ score: data.score, reasons });
            return;
          }
        }
      } catch (e) {
        console.warn('Backend assess call failed, falling back to local heuristic', e);
      }

      // Fallback: use local heuristic and map 0-100 -> 0-10
      const local = computeScoreFromText(text);
      const mapped = Math.round((local.score || 0) / 10);
      const reasons = local.reasons || [];
      setScore({ score: mapped, reasons });
    } catch (err) {
      console.error('Score check failed', err);
    } finally {
      setCheckingScore(false);
    }
  };

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(1, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec} MIN`;
  };

  if (stage === "loading" || !lecturette) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-700">Loading Lecturette Topic...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 py-10 px-4">
      <div className="mx-auto w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Topic & timer */}
        <div className="md:col-span-2 bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{lecturette.topic}</h1>
            <div className="text-right">
              <div className="inline-block bg-gray-100 text-gray-900 font-semibold py-2 px-4 rounded-full text-lg">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          <div className="mt-4 text-gray-700">
            <p className="mb-4">Prepare your ideas and start the TIMER. </p>

            {stage === "showTopic" && (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {!timerStarted ? (
                  <>
                    <button
                      onClick={() => setTimerStarted(true)}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md shadow"
                    >
                      Start Timer
                    </button>

                    <button
                      onClick={() => {
                        setTimeLeft(180);
                        setTimerStarted(false);
                      }}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md shadow"
                    >
                      Reset
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={stopHandler}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow"
                    >
                      Stop & Proceed
                    </button>

                    <button
                      onClick={() => {
                        setTimeLeft(180);
                        setTimerStarted(false);
                      }}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md shadow"
                    >
                      Reset Timer
                    </button>
                  </>
                )}
              </div>
            )}

            {stage === "showSpeech" && (
              <div className="mt-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm text-left mb-4">
                  <p className="text-gray-800">{lecturette.speech}</p>
                </div>
                {firstTranscript && (
                  <div className="bg-white p-3 rounded border mt-3">
                    <strong className="text-gray-700">Recorded first transcript:</strong>
                    <p className="mt-2 text-gray-800">{firstTranscript}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={handleGetSuggestion}
                    disabled={suggestionLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow"
                  >
                    {suggestionLoading ? 'Generating...' : 'Get Suggestion'}
                  </button>

                  <button
                    onClick={handleCheckScore}
                    disabled={checkingScore}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md shadow"
                  >
                    {checkingScore ? 'Checking...' : 'Check Your Score'}
                  </button>
                </div>

                {suggestionText && (
                  <div className="mt-4 bg-white p-4 rounded-md border">
                    <h4 className="font-semibold mb-2">Suggestions</h4>
                    <div className="whitespace-pre-line text-gray-800">{suggestionText}</div>
                  </div>
                )}

                {score && (
                  <div className="mt-4 bg-white p-4 rounded-md border">
                    <h4 className="font-semibold mb-2">Estimated Score: {score.score}/10</h4>
                    <div className="text-sm text-gray-700">
                      {(score.reasons || []).map((r, i) => (
                        <div key={i}>• {r}</div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={goToAllTest}
                  className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-md shadow mt-4"
                >
                  Go to All Test
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Interview preview */}
        <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg flex flex-col items-center">
          <div className="w-full text-center mb-3">
            <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 3a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z" />
              </svg>
              Interview Mode
            </div>
          </div>

          <div className="w-full bg-black rounded-md overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <video ref={videoRef} className="w-full h-full object-cover bg-black" playsInline />
          </div>

          {/* recording indicator & live transcript */}
          <div className="w-full mt-3">
            {isRecording && (
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow" />
                <div className="text-sm text-red-600 font-medium">Recording...</div>
              </div>
            )}

            {transcript && (
              <div className="bg-gray-50 p-2 rounded text-sm text-gray-800 mb-2 w-full">
                <strong className="text-gray-700">Live transcript:</strong>
                <div className="mt-1">{transcript}</div>
              </div>
            )}

            <div className="w-full mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-600">You (Candidate)</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMic}
                  className={`px-3 py-2 rounded-md text-white font-semibold ${micEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 hover:bg-gray-500'}`}
                >
                  {micEnabled ? 'Mic On' : 'Mic Off'}
                </button>

                <button
                  onClick={toggleCamera}
                  className={`px-3 py-2 rounded-md text-white font-semibold ${cameraEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 hover:bg-gray-500'}`}
                >
                  {cameraEnabled ? 'Camera On' : 'Camera Off'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default DisplayLecturetteQuestion;
