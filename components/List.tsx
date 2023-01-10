import cx from "classnames";
import { useCallback } from "react";
import { SORT_BY } from "../utils/constants";

const List = ({ position, players, search, playerAction, sort, hide }) => {
  const playerSort = useCallback(
    (a, b) => {
      if (sort === SORT_BY.ADP) {
        return a.adp - b.adp;
      } else {
        const aPrice = a.customPrice || a.price;
        const bPrice = b.customPrice || b.price;

        return bPrice - aPrice;
      }
    },
    [sort]
  );

  const playerFilter = useCallback(
    ({ name, drafted, price, injured, avoid }) => {
      let filter = search.test(name);

      if (
        (hide.drafted && drafted) ||
        (hide.avoid && avoid) ||
        (hide.injured && injured) ||
        (hide.negative && price < 0)
      ) {
        filter = false;
      }

      return filter;
    },
    [hide, search]
  );

  return (
    <div className="list">
      <div className="header">
        <div className="value">Val</div>
        <div className="value adjusted">iVal</div>
        <div className="position">{position}</div>
      </div>
      <div className="players">
        {players
          .filter(playerFilter)
          .sort(playerSort)
          .map((player) => (
            <div
              className={cx("player", player.id, {
                kept: player.cost,
                drafted: player.cost || player.drafted,
                notes: player.notes,
                injured: player.injured,
                target: player.target,
                avoid: player.avoid,
              })}
              data-position={player.position}
              key={player.id}
              title={player.notes}
              onClick={() => playerAction(player)}
            >
              <div className="cell value">
                ${player.customPrice || Math.round(player.price)}
              </div>
              <div className="cell value adjusted">
                $
                {Math.round(
                  player.customPrice
                    ? player.customPrice * (player.iPrice / player.price)
                    : player.iPrice
                )}
              </div>
              <div className="cell name">{player.name}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default List;
