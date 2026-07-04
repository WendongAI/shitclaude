// Vercel Serverless Function — IP Geolocation + VPN Detection
// Uses ip-api.com (free, no key required)

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded ? forwarded.split(",")[0].trim() : req.socket.remoteAddress;

  // Skip local/private IPs
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return res.status(200).json({
      ip: "local",
      status: "local",
      country: "Unknown",
      countryCode: "??",
      region: "",
      city: "",
      timezone: "",
      isp: "",
      org: "",
      as: "",
      isVPN: false,
      isProxy: false,
      isDatacenter: false,
      query: "",
    });
  }

  try {
    // ip-api.com batch endpoint (single IP)
    const apiRes = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city,timezone,isp,org,as,query,proxy,hosting`,
      { signal: AbortSignal.timeout(5000) }
    );
    const data = await apiRes.json();

    if (data.status === "success") {
      return res.status(200).json({
        ip: data.query,
        status: "ok",
        country: data.country,
        countryCode: data.countryCode,
        region: data.regionName,
        city: data.city,
        timezone: data.timezone,
        isp: data.isp,
        org: data.org,
        as: data.as,
        isVPN: false,
        isProxy: !!data.proxy,
        isDatacenter: !!data.hosting,
      });
    }

    return res.status(200).json({
      ip,
      status: "lookup_failed",
      country: "Unknown",
      countryCode: "??",
      region: "",
      city: "",
      timezone: "",
      isp: "",
      org: "",
      as: "",
      isVPN: false,
      isProxy: false,
      isDatacenter: false,
      query: ip,
    });
  } catch (err) {
    return res.status(200).json({
      ip,
      status: "error",
      country: "Unknown",
      countryCode: "??",
      region: "",
      city: "",
      timezone: "",
      isp: "",
      org: "",
      as: "",
      isVPN: false,
      isProxy: false,
      isDatacenter: false,
      query: ip,
      error: err.message,
    });
  }
};
