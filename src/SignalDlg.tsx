import { WebRTCDemo } from "./WebRTC";
import { useDlg } from "./components/dlg";
import { mqtts, topic } from "./config";
import { MQTTClient } from "./mqtt";

export function useSignalDlg(webrtc: WebRTCDemo) {
  const title = "设置信令";
  const content = (
    <>
      {/* <select onChange={(e) => {}}>
        <option value={stuns[0]}>Stun</option>
        {stuns.map((item) => (
          <option value={item}>{item}</option>
        ))}
      </select> */}
      <select
        onChange={(e) => {
          webrtc.signal = new MQTTClient({ url: e.target.value, topic });
        }}
      >
        <option value={mqtts[0]}>MQTT</option>
        {mqtts.map((item) => (
          <option value={item}>{item}</option>
        ))}
      </select>
    </>
  );

  return useDlg({ title, content });
}
