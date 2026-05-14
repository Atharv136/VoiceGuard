// Quick test to verify the multipart upload to our backend works
import { request } from "node:http";

function generateTestWav(seconds = 8, sampleRate = 16000) {
  const numSamples = sampleRate * seconds;
  const bps = 16;
  const nc = 1;
  const dataSize = numSamples * nc * (bps / 8);
  const buf = Buffer.alloc(44 + dataSize);

  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(nc, 22);
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * nc * (bps / 8), 28);
  buf.writeUInt16LE(nc * (bps / 8), 32);
  buf.writeUInt16LE(bps, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const env = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.5 * t); // slow envelope
    // Mix frequencies to simulate voice-like formants
    const s = env * (
      Math.sin(2 * Math.PI * 200 * t) * 0.4 +
      Math.sin(2 * Math.PI * 400 * t) * 0.3 +
      Math.sin(2 * Math.PI * 800 * t) * 0.2 +
      Math.sin(2 * Math.PI * 1600 * t) * 0.1 +
      (Math.random() - 0.5) * 0.05 // slight noise
    );
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 30000), 44 + i * 2);
  }
  return buf;
}

async function test() {
  const buf = generateTestWav(10, 16000);
  const boundary = "----VG" + Math.random().toString(36).slice(2, 16);

  const header = Buffer.from(
    "--" + boundary + "\r\n" +
    'Content-Disposition: form-data; name="audio"; filename="test.wav"\r\n' +
    "Content-Type: audio/wav\r\n\r\n"
  );
  const footer = Buffer.from("\r\n--" + boundary + "--\r\n");
  const body = Buffer.concat([header, buf, footer]);

  const opts = {
    hostname: "localhost", port: 3001, path: "/api/analyze",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data; boundary=" + boundary,
      "Content-Length": body.length,
    },
  };

  console.log(`Sending ${(buf.length/1024).toFixed(1)}KB WAV...`);
  const st = Date.now();

  const res = await new Promise((resolve, reject) => {
    const req = request(opts, (r) => {
      const chunks = [];
      r.on("data", c => chunks.push(c));
      r.on("end", () => resolve({ status: r.statusCode, body: Buffer.concat(chunks).toString() }));
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });

  const elapsed = ((Date.now() - st) / 1000).toFixed(1);
  console.log(`Response in ${elapsed}s — Status ${res.status}`);
  try { console.log(JSON.stringify(JSON.parse(res.body), null, 2)); }
  catch { console.log(res.body.slice(0, 500)); }
}

test().catch(console.error);
