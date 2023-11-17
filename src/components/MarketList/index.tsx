import React, { useEffect, useState } from "react";
import styles from "./MarketList.module.scss";
import { MarketItemType } from "../../core/types/MarketItemType";
import classnames from "classnames";
import {
  GET_MARKETS_ENDPOINT,
  GET_MARKETS_WS_ENDPOINT,
} from "../../core/api/endpoints";

const MarketList = () => {
  const [markets, setMarkets] = useState<any | null>(null);
  const [updatedPrice, setUpdatedPrice] = useState<any>({});

  useEffect(() => {
    getMarkets();
    const socket = new WebSocket(GET_MARKETS_WS_ENDPOINT);
    socket.onopen = () => {
      socket.send(JSON.stringify({ method: "sub_to_price_info" }));
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setUpdatedPrice(data);
    };

    return () => {
      socket.close();
    };
  }, []);

  const getMarkets = () => {
    fetch(GET_MARKETS_ENDPOINT).then((response) => {
      response.json().then((data) => {
        console.log(data.results);
        const temp: any = {};
        data.results.forEach((item: MarketItemType) => {
          temp[item.id] = item;
        });
        console.log({ temp });
        setMarkets(temp);
        // setMarkets(data.results)
      });
    });
  };

  return (
    <div className={styles.Container}>
      <h2 className={styles.Container__title}>Market List</h2>
      {markets ? (
        <div className={styles.Container__content}>
          {Object.keys(markets)?.map((key) => (
            <div key={markets[key].id} className={styles.MarketCard}>
              <div className={styles.MarketCard__header}>
                {markets[key].title}
              </div>
              <div className={styles.MarketCard__details}>
                <p>Code: {markets[key].code}</p>
                <p>
                  Price:{" "}
                  {updatedPrice?.[key]
                    ? updatedPrice[key].price
                    : markets[key].price}
                </p>
                <p
                  className={classnames(styles["MarketCard__details--change"])}
                >
                  Change:
                  <span
                    className={classnames({
                      [styles["MarketCard__details--change-decrease"]]:
                        (updatedPrice?.[key]
                          ? updatedPrice[key].change
                          : markets[key].internal_price_info.change) < 0,
                    })}
                  >
                    {updatedPrice?.[key]
                      ? updatedPrice[key].change
                      : markets[key].internal_price_info.change || 0}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.Container__loading}>
          <h1>Loading...</h1>
        </div>
      )}
    </div>
  );
};

export default MarketList;
