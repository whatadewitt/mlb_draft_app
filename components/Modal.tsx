import { useEffect, useState } from "react";
import { FLAGS } from "../utils/constants";

const Modal = ({ player, updateFn, closeFn }) => {
  const [notes, setNotes] = useState("");
  const [flag, setFlag] = useState("");
  const [customPrice, setCustomPrice] = useState(0);

  useEffect(() => {
    if (!player) return;

    if (player.avoid) {
      setFlag(FLAGS.AVOID);
    } else if (player.target) {
      setFlag(FLAGS.TARGET);
    } else if (player.injured) {
      setFlag(FLAGS.INJURED);
    } else {
      setFlag("");
    }

    setNotes(player.notes);
    setCustomPrice(player.customPrice || 0);
  }, [player]);

  const updatePlayer = () => {
    updateFn({
      ...player,
      avoid: flag === FLAGS.AVOID,
      target: flag === FLAGS.TARGET,
      injured: flag === FLAGS.INJURED,
      notes,
      customPrice,
    });
  };

  if (!player) return null;

  return (
    <div className="modal">
      <h3>{player.name}</h3>

      <select
        name="flag"
        value={flag}
        onChange={(e) => setFlag(e.target.value)}
      >
        <option value="">No Flag</option>
        <option value="target">Target</option>
        <option value="avoid">Avoid</option>
        <option value="injured">Injured</option>
      </select>
      <div>Custom Price:</div>
      <input
        type="number"
        value={customPrice}
        onChange={(e) => setCustomPrice(parseInt(e.target.value, 10))}
      />
      <div>Notes:</div>
      <textarea
        name="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <div className="buttons">
        <button className="modalButton" onClick={closeFn}>
          Close
        </button>
        <button type="submit" className="modalButton" onClick={updatePlayer}>
          Save &amp; Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
