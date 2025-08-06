// App.tsx
import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import { State, WebRTCDemo } from "./WebRTC";

const App = () => {
  const webrtc = new WebRTCDemo({
    onConnState(state) {
      setState(state);
    },
    onMessage(message) {
      setMessages(message);
    },
    onPeerID(id){
setPeerIds(prev=>{
  const list = prev.filter(item=>item!==id)
list.unshift(id)
  return list
})
    }
  });
  onMount(() => {
    console.log("App mounted");
  });
  onCleanup(() => {
    console.log("App onCleanup");
    webrtc.destroy();
  });

  const [peerIds, setPeerIds] = createSignal<string[]>([])
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
      <button onClick={() => webrtc.signal(({id:webrtc.id, type:"PeerID"}))}>广播 Peer ID</button>
      <label for="peer_ids">Peer ID List: </label>
      <select id="peer_ids" style="width: 320px;"
      onChange={e=>{
        console.log('select peer id', e.target.value);
      }}
      >
        <option value={'none'}>请选择peer id</option>
       <For each={peerIds()} >
       {(item) => <option value={item}>{item}</option>}
</For>
      </select>
      <button disabled={offer() === false} onClick={() => webrtc.createOffer()}>
        发送 Offer
      </button>
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
