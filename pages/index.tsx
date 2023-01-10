import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { importPlayerData } from "./api/players";
import { GetStaticProps } from "next";
import { useReducer, useState } from "react";
import { filterReducer } from "../utils/reducers";
import { initialFilterState, MODES, SORT_BY } from "../utils/constants";
import List from "../components/List";
import cx from "classnames";
import { Player } from "../utils/types";
import Modal from "../components/Modal";

export interface IPageProps {
  players: any;
}

const Home = ({ playerData: playerDataProp }) => {
  const [playerData, setPlayerData] = useState(playerDataProp);
  const [mode, setMode] = useState(MODES.DRAFT);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(SORT_BY.PRICE);
  const [filter, setFilter] = useState("");
  const [hideFilters, dispatch] = useReducer(filterReducer, initialFilterState); // todo: move search and filter in here
  const [activePlayer, setActivePlayer] = useState();

  const toggleMode = () => {
    return setMode(mode === MODES.DRAFT ? MODES.EDIT : MODES.DRAFT);
  };

  const clearFilters = () => {
    setSearch("");
    setFilter("");
    dispatch({ type: "reset" });
  };

  const updatePlayers = (player) => {
    // todo: hook
    const positions = player.position.split("/");
    positions.forEach((pos) => {
      if (playerData[pos]) {
        const positionalData: Player[] = playerData[pos];
        const idx = positionalData.findIndex(({ id }) => id === player.id);
        positionalData[idx] = player;

        setPlayerData({
          ...playerData,
          [pos]: positionalData,
        });
      }
    });
    setActivePlayer(null);
  };

  const updatePlayer = async (updatedPlayer) => {
    await fetch("/api/player/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPlayer),
    });

    updatePlayers(updatedPlayer);
  };

  const editPlayer = async (player) => {
    const updatedPlayer = { ...player };

    if (mode === MODES.DRAFT) {
      updatedPlayer.drafted = !updatedPlayer.drafted;
      await fetch("/api/player/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPlayer),
      });
      updatePlayers(updatedPlayer);
    } else {
      setActivePlayer(player);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Draft App</title>
      </Head>

      <div className="head">
        <input
          className="search"
          type="text"
          value={search}
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul className="filters">
          {Object.keys(playerData).map((key) => (
            <li
              key={key}
              className={`button ${key === filter ? "active" : ""}`}
              onClick={() => (key !== filter ? setFilter(key) : setFilter(""))}
            >
              {key}
            </li>
          ))}
        </ul>

        <div className="hideFilters">
          <label>
            <input
              type="checkbox"
              checked={hideFilters.drafted}
              onChange={() => dispatch({ type: "drafted" })}
            />
            Hide Drafted Players
          </label>

          <label>
            <input
              type="checkbox"
              checked={hideFilters.injured}
              onChange={() => dispatch({ type: "injured" })}
            />
            Hide Injured Players
          </label>

          <label>
            <input
              type="checkbox"
              checked={hideFilters.negative}
              onChange={() => dispatch({ type: "negative" })}
            />
            Hide Negative Value Players
          </label>

          <label>
            <input
              type="checkbox"
              checked={hideFilters.avoid}
              onChange={() => dispatch({ type: "avoid" })}
            />
            Hide "Avoid" Players
          </label>

          <label>
            <select
              onChange={(e) => {
                setSortBy(e.target.value);
              }}
            >
              <option value={SORT_BY.PRICE}>Sort By Price</option>
              <option value={SORT_BY.ADP}>Sort By ADP</option>
            </select>
          </label>
        </div>

        <div className={cx("modeToggle", mode)} onClick={toggleMode}>
          {mode === MODES.DRAFT ? "Draft" : "Edit"} Mode
        </div>

        <div className="clearFilters" onClick={clearFilters}>
          Clear Filters
        </div>
      </div>
      <div className="board">
        {Object.entries(playerData).map(([key, val]) => {
          if (filter !== "" && key !== filter) {
            return null;
          }

          return (
            <List
              key={key}
              position={key}
              players={val}
              search={new RegExp(search, "i")}
              hide={hideFilters}
              playerAction={editPlayer}
              sort={sortBy}
              filters={hideFilters}
            />
          );
        })}
      </div>

      <div
        className={cx("modalOverlay", {
          show: activePlayer && mode === MODES.EDIT,
        })}
      >
        <Modal
          player={activePlayer}
          updateFn={updatePlayer}
          closeFn={() => setActivePlayer(null)}
        />
        <input
          type="hidden"
          name="id"
          value={activePlayer ? activePlayer.id : ""}
        />
        <input
          type="hidden"
          name="drafted"
          value={activePlayer ? activePlayer.drafted : ""}
        />
      </div>
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async ({
  params,
}): Promise<{ props: any }> => {
  const playerData = await importPlayerData();

  console.log(playerData);
  return {
    props: { playerData },
  };
};
