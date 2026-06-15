import { useEffect, useState } from "react";
import { getRelayDetail, type RelayDetailData } from "../api/relayDetailApi";

export const useRelayDetail = (id?: number) => {
  const [detail, setDetail] = useState<RelayDetailData | null>(null);

  useEffect(() => {
    let active = true;

    getRelayDetail(id).then((data) => {
      if (active) setDetail(data);
    });

    return () => {
      active = false;
    };
  }, [id]);

  return { detail };
};
