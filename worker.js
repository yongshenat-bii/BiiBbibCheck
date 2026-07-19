// Cloudflare Worker — CORS proxy for racetigertiming portal endpoint.
// Generic pass-through: the frontend supplies partner / raceId / portalId
// in the POST body, the worker forwards them unchanged.

const TARGET = "https://nc.racetigertiming.com/live/portal";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS });
    }

    // Accept the form body the frontend sends and pass it through.
    const body = await request.text();

    const upstream = await fetch(TARGET, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body || "partner=000001&raceId=105191&portalId=1",
    });

    const upstreamBody = await upstream.text();
    return new Response(upstreamBody, {
      status: upstream.status,
      headers: {
        ...CORS,
        "Content-Type": "application/json;charset=UTF-8",
        "Cache-Control": "no-store",
      },
    });
  },
};
