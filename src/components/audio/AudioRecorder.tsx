import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Trash2, Upload } from 'lucide-react';
import { Button } from '../ui';

interface AudioRecorderProps {
  onSave: (audioBlob: Blob) => void;
  onCancel?: () => void;
}

export default function AudioRecorder({ onSave, onCancel }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      setError('Failed to access microphone. Please grant permission.');
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const discardRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    if (onCancel) onCancel();
  };

  const handleSave = () => {
    if (audioBlob) {
      onSave(audioBlob);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Recording Controls */}
      {!audioBlob && (
        <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {/* Duration Display */}
          <div className="text-3xl font-mono font-bold text-gray-900 dark:text-gray-100">
            {formatDuration(duration)}
          </div>

          {/* Recording Indicator */}
          {isRecording && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Recording...</span>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex gap-3">
            {!isRecording ? (
              <Button onClick={startRecording} variant="primary" size="lg">
                <Mic className="w-5 h-5 mr-2" />
                Start Recording
              </Button>
            ) : (
              <Button onClick={stopRecording} variant="danger" size="lg">
                <Square className="w-5 h-5 mr-2" />
                Stop Recording
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Playback Controls */}
      {audioBlob && audioUrl && (
        <div className="space-y-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Recording Complete
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Duration: {formatDuration(duration)}
              </p>
            </div>
            <Button onClick={playRecording} variant="secondary" size="sm">
              <Play className="w-4 h-4 mr-2" />
              Play
            </Button>
          </div>

          {/* Audio Element */}
          <audio src={audioUrl} controls className="w-full" />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleSave} variant="primary" className="flex-1">
              <Upload className="w-4 h-4 mr-2" />
              Save Recording
            </Button>
            <Button onClick={discardRecording} variant="danger">
              <Trash2 className="w-4 h-4 mr-2" />
              Discard
            </Button>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!isRecording && !audioBlob && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p className="font-medium mb-2">Tips for recording:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Find a quiet environment</li>
            <li>Speak clearly and at a normal pace</li>
            <li>Hold the microphone at a consistent distance</li>
            <li>You can re-record if you're not satisfied</li>
          </ul>
        </div>
      )}
    </div>
  );
}
