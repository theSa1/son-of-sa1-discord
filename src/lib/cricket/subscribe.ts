import { decompressFromBase64 } from "lz-string";
import { Client } from "paho-mqtt";
import { getBaseMessage } from "./get-base-msg";
import jsonpatch from "fast-json-patch";
import fs from "fs/promises";
import { getCurrentScoreboard } from "./get-current-scoreboard";
import type { MatchDetailsType, UsefulMatchStats } from "./types";
import { getUsefulStats } from "./get-useful-stats";
import { updateMatchData } from "./update-match-data";
import { Client as DiscordClient } from "discord.js";

export const subscribe = async (
  matchId: string,
  seriesId: string,
  untilTimestamp: number,
  discordClient: DiscordClient
) => {
  const client = new Client(
    "vernemqingress.hs-cricinfo.com",
    443,
    Math.random().toString(36).substr(2, 17)
  );

  let lastBaseMessageId = "";
  let currentMatch: {
    match: MatchDetailsType;
  } | null = null;
  let isShuttingDown = false;

  const initialMatch = await getCurrentScoreboard(matchId, seriesId);

  let currentMatchUsefulStats: null | UsefulMatchStats = getUsefulStats(
    initialMatch.match
  );

  updateMatchData(currentMatchUsefulStats, discordClient);

  function cleanup() {
    if (client.isConnected()) {
      client.disconnect();
    }

    client.onMessageArrived = () => {};
    client.onConnectionLost = () => {};
    isShuttingDown = true;

    console.log("Cleaned up MQTT client");
  }

  client.connect({
    userName: "cricinfo_app_ro",
    password: "cricinfo_public_read",
    keepAliveInterval: 50,
    cleanSession: !0,
    useSSL: true,
    reconnect: !0,
    onSuccess: function () {
      console.log("Connected to MQTT broker");
      client.subscribe(`/cricinfo/prod/match/${matchId}/details`);
    },
    onFailure: function (e) {
      console.log("Error Connecting", e.errorMessage);
    },
  });

  client.onMessageArrived = async function (message) {
    if (isShuttingDown) return;
    const data = JSON.parse(decompressFromBase64(message.payloadString)) as {
      type: "DIFF" | "BASE";
      version: "2.0";
      value: any[];
      timestamp: number;
      baseTimestamp: number;
      baseMessageId: string;
    };

    if (data.baseMessageId !== lastBaseMessageId) {
      currentMatch = (await getBaseMessage(data.baseMessageId)) as {
        match: MatchDetailsType;
      };
      lastBaseMessageId = data.baseMessageId;
    }

    if (data.type === "DIFF") {
      const baseCopy = JSON.parse(JSON.stringify(currentMatch));
      const result = jsonpatch.applyPatch(baseCopy, data.value, false, false);
      currentMatch = result.newDocument;
    }

    if (currentMatch) {
      const lastMatch = JSON.stringify(currentMatchUsefulStats);
      currentMatchUsefulStats = getUsefulStats(currentMatch.match);
      if (JSON.stringify(currentMatchUsefulStats) !== lastMatch) {
        updateMatchData(currentMatchUsefulStats, discordClient);
      }
    }
  };

  client.onConnectionLost = (responseObject) => {
    if (isShuttingDown) return;

    console.log("Connection lost: " + responseObject.errorMessage);

    setTimeout(() => {
      if (!isShuttingDown) {
        console.log("Retrying connection...");
        subscribe(matchId, seriesId, untilTimestamp, discordClient);
      }
    }, 5000);
  };

  const now = Date.now();
  const delay = Math.max(0, untilTimestamp - now);

  setTimeout(() => {
    cleanup();
  }, delay);
};
