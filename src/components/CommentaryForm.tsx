import React, { useState } from 'react';

interface CommentaryFormProps {
  matchId: string;
  onCommentaryAdded: () => void;
}

const eventTypeOptions = [
  { value: 'run', label: 'Run' },
  { value: 'wicket', label: 'Wicket' },
  { value: 'wide', label: 'Wide' },
  { value: 'no_ball', label: 'No Ball' },
  { value: 'bye', label: 'Bye' },
  { value: 'leg_bye', label: 'Leg Bye' },
  { value: 'dot', label: 'Dot' },
  { value: 'four', label: 'Four' },
  { value: 'six', label: 'Six' },
];

const CommentaryForm: React.FC<CommentaryFormProps> = ({ matchId, onCommentaryAdded }) => {
  const [over, setOver] = useState('');
  const [ball, setBall] = useState('');
  const [description, setDescription] = useState('');
  const [runs, setRuns] = useState('');
  const [eventType, setEventType] = useState('run');
  const [isWicket, setIsWicket] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3001/matches/${matchId}/commentary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          over: Number(over),
          ball: Number(ball),
          description,
          runs: Number(runs),
          eventType,
          isWicket,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add commentary');
      }

      setOver('');
      setBall('');
      setDescription('');
      setRuns('');
      setEventType('run');
      setIsWicket(false);

      onCommentaryAdded();
    } catch (err: any) {
      setError(err.message || 'Failed to add commentary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white text-black rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Add Commentary</h3>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="over" className="block text-sm font-medium text-gray-700">Over</label>
          <input
            type="number"
            id="over"
            value={over}
            onChange={(e) => setOver(e.target.value)}
            min={0}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="ball" className="block text-sm font-medium text-gray-700">Ball</label>
          <input
            type="number"
            id="ball"
            value={ball}
            onChange={(e) => setBall(e.target.value)}
            min={1}
            max={6}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">Event Type</label>
        <select
          id="eventType"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        >
          {eventTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="runs" className="block text-sm font-medium text-gray-700">Runs</label>
          <input
            type="number"
            id="runs"
            value={runs}
            onChange={(e) => setRuns(e.target.value)}
            min={0}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            id="isWicket"
            checked={isWicket}
            onChange={(e) => setIsWicket(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="isWicket" className="text-sm font-medium text-gray-700">Wicket</label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {loading ? 'Adding...' : 'Add Commentary'}
      </button>
    </form>
  );
};

export default CommentaryForm;
