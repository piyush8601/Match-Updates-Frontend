import React, { useState } from "react";
import "./css/CommentaryForm.css";
import { addCommentary } from "@/api/matches";

interface CommentaryFormProps {
  matchId: string;
  onCommentaryAdded: () => void;
}

const CommentaryForm: React.FC<CommentaryFormProps> = ({ matchId, onCommentaryAdded }) => {
  const [over, setOver] = useState("");
  const [ball, setBall] = useState("");
  const [description, setDescription] = useState("");
  const [runs, setRuns] = useState("");
  const [isSix, setIsSix] = useState(false);
  const [isFour, setIsFour] = useState(false);
  const [isWicket, setIsWicket] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {

      const data = {
        over: Number(over), 
        ball: Number(ball),
        runs: Number(runs),
        description: description || undefined,
        isSix: isSix,
        isFour: isFour,
        isWicket: isWicket,
      }

      const response = await addCommentary(matchId, data);
      if (!response) {
        throw new Error("Failed to add commentary");
      }

      setOver("");
      setBall("");
      setDescription("");
      setRuns("");
      setIsSix(false);
      setIsFour(false);
      setIsWicket(false);
      onCommentaryAdded();
    } catch (err: any) {
      setError(err.message || "Failed to add commentary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h3 className="form-title">Add Commentary</h3>
      {error && <p className="form-error">{error}</p>}

      <div className="form-grid">
        <div>
          <label htmlFor="over" className="form-label">
            Over
          </label>
          <input
            type="number"
            id="over"
            value={over}
            onChange={(e) => setOver(e.target.value)}
            min={0}
            required
            className="form-input"
          />
        </div>

        <div>
          <label htmlFor="ball" className="form-label">
            Ball
          </label>
          <input
            type="number"
            id="ball"
            value={ball}
            onChange={(e) => setBall(e.target.value)}
            min={0}
            max={6}
            required
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="runs" className="form-label">
          Runs
        </label>
        <input
          type="number"
          id="runs"
          value={runs}
          onChange={(e) => setRuns(e.target.value)}
          min={0}
          required
          className="form-input"
        />
      </div>

      <div className="form-grid">
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="isSix"
            checked={isSix}
            onChange={(e) => {
              setIsSix(e.target.checked);
              if (e.target.checked) {
                setIsFour(false);
                setIsWicket(false)
                setRuns("6");
              }
            }}
            className="form-checkbox"
          />
          <label htmlFor="isSix" className="form-label checkbox-label">
            Six
          </label>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="isFour"
            checked={isFour}
            onChange={(e) => {
              setIsFour(e.target.checked);
              if (e.target.checked) {
                setIsSix(false);
                setIsWicket(false);
                setRuns("4");
              }
            }}
            className="form-checkbox"
          />
          <label htmlFor="isFour" className="form-label checkbox-label">
            Four
          </label>
        </div>
      </div>

      <div className="checkbox-group">
        <input
          type="checkbox"
          id="isWicket"
          checked={isWicket}
          onChange={(e) => {
            setIsWicket(e.target.checked);
            if (e.target.checked) {
              setIsSix(false);
              setIsFour(false);
              setRuns("0");
            }
          }}
          className="form-checkbox"
        />
        <label htmlFor="isWicket" className="form-label checkbox-label">
          Wicket
        </label>
      </div>

      <button type="submit" disabled={loading} className="form-button">
        {loading ? "Adding..." : "Add Commentary"}
      </button>
    </form>
  );
};

export default CommentaryForm;
