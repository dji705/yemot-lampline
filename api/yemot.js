import { runAgent } from "../lib/agent.js";

const DEFAULT_PROMPT = "שלום, הגעתם לעוזר הקולי. אפשר להקליד את השאלה ולאשר בסולמית.";

function getInput(req) {
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const query = req.query || {};
  return { ...query, ...body };
}

function pick(obj, names) {
  for (const name of names) {
    if (obj[name] !== undefined && obj[name] !== null && String(obj[name]).trim() !== "") {
      return String(obj[name]).trim();
    }
  }
  return "";
}

function yemotRead(text, options = {}) {
  const safe = String(text || "").replace(/[\r\n=]/g, " ").trim();
  const maxDigits = options.maxDigits || 1;
  const timeout = options.timeout || 7;
  const voice = options.voice || "t-";
  return `read=${voice}${safe}=wm_nav,no,1,1,${maxDigits},Digits,no,no,,,${timeout},Ok`;
}

export default async function handler(req, res) {
  if (req.method === "GET" && req.query?.health === "1") {
    return res.status(200).json({ ok: true, service: "yemot-lampline", version: "0.1.0" });
  }
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const input = getInput(req);
    const digits = pick(input, ["Digits", "digits", "ApiDigits", "api_digits"]);
    const caller = pick(input, ["ApiPhone", "ApiPhoneNumber", "phone", "caller"]);
    const callId = pick(input, ["ApiCallId", "call_id", "callId"]);
    const extension = pick(input, ["ApiExtension", "extension"]);
    const question = pick(input, ["text", "question", "speech", "query"]);

    if (digits === "*" || input.ApiHangup === "yes") {
      return res.status(200).type("text/plain; charset=utf-8").send(" למערכת שלום");
    }

    if (!digits && !question) {
      return res.status(200).type("text/plain; charset=utf-8").send(yemotRead(DEFAULT_PROMPT, { maxDigits: 30 }));
    }

    const userText = question || (digits && digits !== "#" ? `המשתמש הקליד: ${digits}` : "");
    if (!userText) {
      return res.status(200).type("text/plain; charset=utf-8").send(yemotRead("לא התקבלה שאלה. אפשר לנסות שוב.", { maxDigits: 30 }));
    }

    const answer = await runAgent({
      message: userText,
      sessionId: callId || caller || extension || "anonymous",
      caller,
      extension
    });

    return res.status(200).type("text/plain; charset=utf-8").send(yemotRead(answer, { maxDigits: 30 }));
  } catch (error) {
    console.error("Yemot handler error:", error);
    return res.status(200).type("text/plain; charset=utf-8").send(yemotRead("אירעה תקלה זמנית. נא לנסות שוב מאוחר יותר.", { maxDigits: 30 }));
  }
}