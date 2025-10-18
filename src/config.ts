const stunStr =
  "stun:stun.miwifi.com,tcp://turn.cloudflare.com:80,udp://turn.cloudflare.com:53,udp://stun.l.google.com:19302,udp://stun.miwifi.com:3478,global.turn.twilio.com:3478,stun.nextcloud.com:443";
export const stuns = stunStr.split(",");
const mqttStr = "ws://broker.hivemq.com:8000/mqtt,ws://broker.emqx.io:8083/mqtt,ws://test.mosquitto.org:8080/mqtt";
export const mqtts = mqttStr.split(",");

export const topic = "test/webrtc/topic";
