import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRelayDetail, type RelayDetailData } from "../api/relayDetailApi";

export const useRelayDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<RelayDetailData | null>(null);

  useEffect(() => {
    let active = true;

    getRelayDetail(Number(id)).then((data) => {
      if (active) setDetail(data);
    });

    return () => {
      active = false;
    };
  }, [id]);

  return { detail };
};
