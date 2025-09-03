// App.tsx
import { createMemo, createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { Message, State, WebRTCDemo } from "./WebRTC";
import { createChunks } from "./utils";
import { createFileWriter, FileWriter } from "./chrome";
import { useMediaDlg } from "./MediaDlg";

const master = new URLSearchParams(window.location.search).has("master");

const App = () => {
  const webrtc = new WebRTCDemo({
    onConnState(state) {
      if (state === "signal_connected") {
        setCliConnected(true);
        webrtc.sendSignalingMessage({ type: "PeerID", id: webrtc.id });
      } else if (state === "signal_disconnected") {
        setCliConnected(false);
      } else {
        setState(state);
      }
    },
    async onMessage(data) {
      if (typeof data === "string") {
        const message = JSON.parse(data) as Message;
        if (message.file) {
          if (message.file.type === "showSaveFilePicker") {
            setHasFile(message.file);
          } else if (message.file.type === "beginRecieve") {
            if (chunksToSend) {
              for (const chunk of chunksToSend) {
                await webrtc.sendData(chunk);
              }
            }
          }
        }
        addMsg(data);
      } else if (data instanceof ArrayBuffer && fileWriter) {
        const hf = hasFile();
        if (hf?.type === "showSaveFilePicker") {
        }
        const [write, finish] = fileWriter;
        write(data);
        const rc = receivedChunk() + 1;
        setReceivedChunk(rc);
        if (hf?.chunks === rc) {
          finish();
          setHasFile(undefined);
          alert("文件保存成功");
        }
        console.log("receivedChunk", rc);
      } else {
        console.log("onMessage", data);
      }
    },
    onPeerID(id) {
      setPeerIds((prev) => {
        const list = prev.filter((item) => item !== id);
        list.unshift(id);
        return list;
      });
      addMsg(`收到 PeerID： ${id} - ${new Date().toLocaleTimeString()}`);
    },

    onStream(stream) {
      peerStream(stream);
    },
  });
  onMount(() => {
    console.log("App mounted");
  });
  onCleanup(() => {
    console.log("App onCleanup");
    webrtc.destroy();
  });

  // let peerId: string = ""; // 选中 PeerID
  let fileWriter: FileWriter | null = null;
  let chunksToSend: Blob[] | null = null;

  const [peerId, setPeerId] = createSignal("");
  const [peerIds, setPeerIds] = createSignal<string[]>([]);
  const [state, setState] = createSignal<State>();
  const [text, setText] = createSignal("");
  const [messages, setMessages] = createSignal<string[]>([]);
  const addMsg = (message: string) => {
    setMessages((prev) => {
      prev.unshift(message);
      return prev.slice(0, 30);
    });
  };

  const connected = createMemo(() => state() === "connected");
  const [signalConnected, setCliConnected] = createSignal(false);

  const [mdDlg, mdDlgBtn, peerStream] = useMediaDlg(webrtc);

  return (
    <div>
      <p>
        <button
          disabled={!signalConnected()}
          onClick={() => webrtc.sendSignalingMessage({ id: webrtc.id, type: "PeerID" })}
        >
          广播 ID
        </button>
        <Show when={master}>
          <button
            onClick={() => {
              webrtc.sendSignalingMessage({
                type: "Reload",
                id: webrtc.id,
              });
            }}
          >
            Reload
          </button>
          <button
            onClick={() => {
              if (peerId())
                webrtc.sendSignalingMessage({
                  type: "GiveMeOffer",
                  id: webrtc.id,
                  peerId: peerId(),
                });
            }}
            disabled={!peerId()}
          >
            GiveMeOffer
          </button>
          <button
            disabled={!connected()}
            onClick={() => {
              webrtc.disconnect();
            }}
          >
            Close
          </button>
        </Show>
        <Show when={peerIds().length > 0}>
          <label for="peer_ids">Peer ID List: </label>
          <select
            id="peer_ids"
            style="width: 320px;"
            onChange={(e) => {
              console.log("select peer id", e.target.value);
              setPeerId(e.target.value);
            }}
          >
            <option value="">{`========== 请选择 Peer ID ===========`}</option>
            <For each={peerIds()}>{(item) => <option value={item}>{item}</option>}</For>
          </select>
          <button
            disabled={!signalConnected() || !peerId()}
            onClick={() => {
              if (peerId()) webrtc.createOffer(peerId());
            }}
          >
            发送 Offer
          </button>
        </Show>
      </p>
      <div class="flex wrap">
        {/* 发消息 */}
        <div style="flex: 0 0 300px;">
          <div>
            <textarea
              id="text"
              rows={3}
              value={text()}
              onChange={(e) => setText(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </div>
          <p>
            <button
              disabled={connected() === false}
              onClick={() => {
                addMsg("me: " + text());
                webrtc.sendMessage(text());
              }}
            >
              发送
            </button>
          </p>
        </div>
        {/* 传输文件 */}
        <div class="flex-1">
          <Show when={connected() || master || import.meta.env.DEV}>
            <div>
              {mdDlgBtn}
              <input
                id="file"
                type="file"
                placeholder="文件"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file === undefined) return;
                  console.log("文件选择", file);
                  e.target.value = "";
                  chunksToSend = createChunks(file, 32 * 1024);
                  console.log("分块", chunksToSend);

                  webrtc.sendMessage({
                    file: { type: "showSaveFilePicker", name: file.name, chunks: chunksToSend.length },
                  });

                  // finish();
                }}
              />
            </div>
          </Show>
          <p>
            <SaveFile
              onFileWriter={(fw) => {
                fileWriter = fw;
                const file = hasFile();
                if (file) {
                  setReceivedChunk(0);
                  webrtc.sendMessage({
                    file: { ...file, type: "beginRecieve" },
                  });
                }
              }}
            />
          </p>
        </div>
      </div>

      <p>
        Id: <mark>{webrtc.id}</mark>, State:{" "}
        <b>
          <i>{state() ?? "unknown"}</i>
        </b>
      </p>
      <p>Message:</p>
      <div class="break font">{messages().join("\n")}</div>
      {mdDlg}
    </div>
  );
};

export default App;

const [hasFile, setHasFile] = createSignal<Extract<Message["file"], { type: "showSaveFilePicker" }>>();
const [receivedChunk, setReceivedChunk] = createSignal(0); // 接收的chunk计数

function SaveFile(props: { onFileWriter: (_: FileWriter) => void }) {
  return (
    <Show when={hasFile()} keyed>
      {(hf) => (
        <>
          <button
            onClick={async () => {
              const fw = await createFileWriter(hf.name);
              props.onFileWriter(fw);
            }}
          >
            接收并保存
          </button>
          <br />
          <i class="font">
            文件：{hf?.name}，区块：{hf.chunks}，已接收：{receivedChunk()}
          </i>
        </>
      )}
    </Show>
  );
}
