// App.tsx
import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import { State, WebRTCDemo } from "./WebRTC";

const App = () => {
  const webrtc = new WebRTCDemo({
    onConnState(state) {
      setState(state);
    },
    onMessage(message) {
      addMsg(message);
    },
    onPeerID(id) {
      setPeerIds((prev) => {
        const list = prev.filter((item) => item !== id);
        list.unshift(id);
        return list;
      });
    },
  });
  onMount(() => {
    console.log("App mounted");
  });
  onCleanup(() => {
    console.log("App onCleanup");
    webrtc.destroy();
  });

  let peerId: string = "";

  const [peerIds, setPeerIds] = createSignal<string[]>([]);
  const [state, setState] = createSignal<State>();
  const [text, setText] = createSignal("");
  const [messages, setMessages] = createSignal("");
  const addMsg = (message: string) => {
    setMessages((prev) => prev + message + "\n");
  };

  const connected = createMemo(() => state() === "connected");
  const subscribed = createMemo(() => state() === "subscribed");

  return (
    <div>
      <p>
        <button disabled={subscribed() === false} onClick={() => webrtc.signal({ id: webrtc.id, type: "PeerID" })}>
          广播 ID
        </button>
        <label for="peer_ids">Peer ID List: </label>
        <select
          id="peer_ids"
          style="width: 320px;"
          onChange={(e) => {
            console.log("select peer id", e.target.value);
            peerId = e.target.value;
          }}
        >
          <option value="">{`==========请${peerIds().length > 0 ? "选择" : "广播"} Peer ID===========`}</option>
          <For each={peerIds()}>{(item) => <option value={item}>{item}</option>}</For>
        </select>
        <button
          disabled={subscribed() === false}
          onClick={() => {
            if (peerId) webrtc.createOffer(peerId);
            else alert("请选择 Peer ID");
          }}
        >
          发送 Offer
        </button>
      </p>
      <p>
        <textarea
          id="text"
          rows={3}
          value={text()}
          onChange={(e) => setText(e.target.value)}
          onFocus={(e) => e.target.select()}
        />
      </p>
      <p>
        <button
          disabled={connected() === false}
          onClick={() => {
            webrtc.sendMessage(JSON.stringify(text()));
          }}
        >
          发送
        </button>
      </p>
      <p>
        Id: <mark>{webrtc.id}</mark>, State:{" "}
        <b>
          <i>{state() ?? "unknown"}</i>
        </b>
      </p>
      <p>Message:</p>
      <div class="break font">{messages()}</div>
    </div>
  );
};

export default App;
