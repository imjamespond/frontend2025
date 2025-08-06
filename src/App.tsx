// App.tsx
import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { State, WebRTCDemo } from "./WebRTC";

const App = () => {
  const webrtc = new WebRTCDemo({
    onConnState(state) {
      setState(state);
    },
    onMessage(message) {
      setMessages(message);
    },
  });
  onMount(() => {
    console.log("App mounted");
  });
  onCleanup(() => {
    console.log("App onCleanup");
    webrtc.destroy();
  });

  const [state, setState] = createSignal<State>();
  const [text, setText] = createSignal("");
  const [messages, _setMessages] = createSignal("");
  const setMessages = (message: string) => {
    _setMessages((prev) => prev + message + "\n");
  };

  const connected = createMemo(() => state() === "connected");
  const offer = createMemo(() => state() === "offer");

  return (
    <div>
      <button disabled={offer() === false} onClick={() => webrtc.createOffer()}>
        创建 Offer
      </button>
      <button onClick={() => webrtc.cli.send(JSON.stringify("foobar"))}>测试信令</button>
      <br />
      <textarea
        rows={3}
        value={text()}
        onChange={(e) => setText(e.target.value)}
        onFocus={(e) => e.target.select()}
      ></textarea>
      <button
        disabled={connected() === false}
        onClick={() => {
          webrtc.sendMessage(JSON.stringify(text()));
        }}
      >
        发送
      </button>
      <p>
        Id: {webrtc.id}, State: {state() ?? "unknown"}
      </p>
      <h6>Message:</h6>
      <div class="break">{messages()}</div>
    </div>
  );
};

export default App;
