import { useState } from 'react';
import { Mic, Trash2, X } from 'lucide-react';
import AudioRecorder from './AudioRecorder';
import AudioPlayer from './AudioPlayer';
import { Button, Modal } from '../ui';
import { useToast } from '../../hooks/useToast';

interface VocabularyAudioManagerProps {
  vocabularyId: string;
  word: string;
  existingAudioUrl?: string;
  onAudioUpdate: (audioUrl: string | null) => void;
}

export default function VocabularyAudioManager({
  vocabularyId,
  word,
  existingAudioUrl,
  onAudioUpdate,
}: VocabularyAudioManagerProps) {
  const [showRecorder, setShowRecorder] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { success, error } = useToast();

  const handleSaveRecording = async (audioBlob: Blob) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, `${word}-recording.webm`);
      formData.append('vocabularyId', vocabularyId);

      const response = await fetch('/api/audio/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onAudioUpdate(result.audioUrl);
        setShowRecorder(false);
        success('Recording saved successfully!');
      } else {
        error(result.error || 'Failed to save recording');
      }
    } catch (err) {
      console.error('Upload error:', err);
      error('Failed to upload recording');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteRecording = async () => {
    if (!existingAudioUrl) return;

    const confirmed = confirm('Are you sure you want to delete this recording?');
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch('/api/audio/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vocabularyId,
          audioUrl: existingAudioUrl,
        }),
      });

      const result = await response.json();

      if (result.success) {
        onAudioUpdate(null);
        success('Recording deleted successfully!');
      } else {
        error(result.error || 'Failed to delete recording');
      }
    } catch (err) {
      console.error('Delete error:', err);
      error('Failed to delete recording');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Existing Recording */}
      {existingAudioUrl && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Your Recording
            </h3>
            <Button
              onClick={handleDeleteRecording}
              variant="danger"
              size="sm"
              isLoading={isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
          <AudioPlayer src={existingAudioUrl} variant="default" />
        </div>
      )}

      {/* Record Button */}
      {!existingAudioUrl && (
        <Button
          onClick={() => setShowRecorder(true)}
          variant="primary"
          className="w-full"
        >
          <Mic className="w-4 h-4 mr-2" />
          Record Your Pronunciation
        </Button>
      )}

      {/* Re-record Button */}
      {existingAudioUrl && (
        <Button
          onClick={() => setShowRecorder(true)}
          variant="secondary"
          className="w-full"
        >
          <Mic className="w-4 h-4 mr-2" />
          Record Again
        </Button>
      )}

      {/* Recorder Modal */}
      <Modal
        isOpen={showRecorder}
        onClose={() => setShowRecorder(false)}
        title={`Record pronunciation for "${word}"`}
        size="lg"
      >
        <AudioRecorder
          onSave={handleSaveRecording}
          onCancel={() => setShowRecorder(false)}
        />
      </Modal>
    </div>
  );
}
