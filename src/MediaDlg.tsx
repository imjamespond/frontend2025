import { createSignal, For, Show } from "solid-js";
import { Message, WebRTCDemo } from "./WebRTC";

export function useMediaDlg(webrtc: WebRTCDemo /* getPeerID: () => string */) {
  let dialogRef: HTMLDialogElement | null = null;
  let videoRef: HTMLVideoElement | null = null;
  let peerRef: HTMLVideoElement | null = null;
  // let desktopDlgRef: HTMLDialogElement | null = null;
  // let desktopVideoRef: HTMLVideoElement | null = null;

  let localStream = new MediaStream();
  let videoTrack: MediaStreamTrack | null = null;
  let audioTrack: MediaStreamTrack | null = null;
  let desktopStream = new MediaStream();
  let desktopTracks: MediaStreamTrack[] | null = null;

  let videoSender: RTCRtpSender | undefined = undefined;
  let audioSender: RTCRtpSender | undefined = undefined;
  let desktopSenders: (RTCRtpSender | undefined)[] | undefined = undefined;

  let videoConstraint: Video | true = true;

  let facingMode: string | undefined = undefined;

  let maxBitrate: number | undefined = undefined;

  const [video, setVideo] = createSignal(false);
  const [audio, setAudio] = createSignal(false);
  const [desktop, setDesktop] = createSignal(false);

  const peerStream = (stream: MediaStream) => {
    if (peerRef === null) return;
    peerRef.srcObject = stream;
  };

  /**
   * 与 go2rtc 通信
   * HTTP REST API 信令通信
   * https://github.com/AlexxIT/go2rtc/blob/master/www/webrtc-sync.html
   * web page <=mqtt=> nodejs proxy <=http=> go2rtc
  const url = new URL('api/webrtc' + location.search, location.href);  
  const r = await fetch(url, {method: 'POST', body: await getCompleteOffer(pc)}); // include candidates
  const answerSDP = await r.text();
  await pc.setRemoteDescription({ type: 'answer', sdp: answerSDP });
   */
  // onMount(() => {
  //   if (peerRef === null || webrtc.peerConnection === null) return;
  //   peerRef.srcObject = new MediaStream([
  //     webrtc.peerConnection.addTransceiver("audio", { direction: "recvonly" }).receiver.track,
  //     webrtc.peerConnection.addTransceiver("video", { direction: "recvonly" }).receiver.track,
  //   ]);
  // });

  const dlgBtn = (
    <button
      onClick={() => {
        dialogRef?.showModal();
      }}
    >
      视频语音
    </button>
  );

  const dlg = (
    <dialog ref={(el) => (dialogRef = el)} style="width:50rem; height:30rem; max-width: 88%; max-height: 88%;">
      <button
        onClick={async () => {
          if (videoRef === null) return;
          if (!videoTrack) {
            // 获取视频 track
            const video =
              videoConstraint === true ? true : Object.assign({ facingMode }, defaultVideoConfig, videoConstraint);
            const stream = await navigator.mediaDevices.getUserMedia({ video });
            videoTrack = stream.getVideoTracks()[0];
            // try {
            //   await videoTrack.applyConstraints(videoConstraints);
            //   console.log("Video constraints applied successfully.");
            // } catch (err) {
            //   console.error("Failed to apply video constraints:", err);
            // }
            localStream.addTrack(videoTrack); // 添加到本地显示

            videoSender = webrtc.addTrack(videoTrack, localStream);
            console.log("📹 Video track added");
            videoRef.srcObject = localStream;
            setVideo(true);
          } else {
            // 移除视频 track
            if (videoSender) {
              webrtc.removeTrack(videoSender);
              videoSender = undefined;
            }
            localStream.removeTrack(videoTrack);
            videoTrack.stop();
            videoTrack = null;
            console.log("📹 Video track removed");
            // videoRef.pause();
            videoRef.srcObject = null;
            setVideo(false);
          }
        }}
      >
        Video: {video() ? "ON" : "OFF"}
      </button>
      <button
        onClick={async () => {
          if (videoRef === null) return;
          if (!audioTrack) {
            // 获取视频 track
            const stream = await navigator.mediaDevices.getUserMedia(audioConstraints /* { audio: true } */);
            audioTrack = stream.getAudioTracks()[0];
            localStream.addTrack(audioTrack); // 添加到本地显示

            audioSender = webrtc.addTrack(audioTrack, localStream);
            console.log("📹 Audio track added");
            videoRef.srcObject = localStream;
            setAudio(true);
          } else {
            // 移除视频 track
            if (audioSender) {
              webrtc.removeTrack(audioSender);
              audioSender = undefined;
            }
            localStream.removeTrack(audioTrack);
            audioTrack.stop();
            audioTrack = null;
            console.log("📹 Audio track removed");
            // videoRef.muted = true;
            videoRef.srcObject = null;
            setAudio(false);
          }
        }}
      >
        Audio: {audio() ? "ON" : "OFF"}
      </button>
      <button
        onClick={async () => {
          if (videoRef === null) return;
          if (!desktopTracks) {
            // 获取视频 track
            const stream = await navigator.mediaDevices.getDisplayMedia({
              video: { cursor: "always", displaySurface: "monitor" } as DisplayMediaStreamOptions["video"],
              audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false,
              } as DisplayMediaStreamOptions["audio"],
            });
            desktopTracks = stream.getTracks();
            desktopTracks.forEach((track) => desktopStream.addTrack(track)); // 添加到本地显示
            desktopSenders = desktopTracks.map((track) => webrtc.addTrack(track, desktopStream)); // 添加到本地显示
            desktopSenders.forEach((sender) => {
              console.log(sender);
              if (sender === void 0 || sender.track?.kind !== "video" || maxBitrate === undefined) return;
              // 获取当前参数
              const parameters = sender.getParameters();
              if (!parameters.encodings) {
                parameters.encodings = [{}];
              }
              // 设置最大比特率（单位 bps）
              parameters.encodings[0].maxBitrate = maxBitrate; // 2.5 Mbps
              parameters.encodings[0].maxFramerate = 30; // 可选帧率
              sender.setParameters(parameters);
            });
            console.log("📹 Desktop tracks added");
            videoRef.srcObject = desktopStream;
            setDesktop(true);
          } else {
            // 移除视频 track
            if (desktopSenders) {
              desktopSenders.forEach((sender) => sender && webrtc.removeTrack(sender));
              desktopSenders = undefined;
            }
            desktopTracks.forEach((track) => {
              desktopStream.removeTrack(track);
              track.stop();
            });
            desktopTracks = null;
            videoRef.srcObject = null;
            console.log("📹 Desktop tracks removed");
            setDesktop(false);
          }
        }}
      >
        共享桌面: {desktop() ? "ON" : "OFF"}
      </button>
      <button
        onClick={() => {
          if (videoRef) videoRef.muted = !videoRef.muted;
        }}
      >
        Mute
      </button>
      <button
        // disabled={video() || audio()}
        onClick={() => dialogRef?.close()}
      >
        关闭
      </button>
      <p>
        <Show when={supportedConstraints.frameRate && supportedConstraints.width && supportedConstraints.height}>
          <select
            onChange={(e) => {
              const video = videoConstraints[e.currentTarget.value];
              videoConstraint = video ?? true;
            }}
          >
            <option value="">分辨率</option>
            {Object.keys(videoConstraints).map((k) => (
              <option value={k}>{k}</option>
            ))}
          </select>
        </Show>
        <select
          onChange={(e) => {
            facingMode = e.currentTarget.value;
          }}
        >
          <option value="">摄像头</option>
          <option value="user">前置摄像头</option>
          <option value="environment">后置摄像头</option>
        </select>
        <select
          onChange={(e) => {
            maxBitrate = parseInt(e.currentTarget.value);
          }}
        >
          <For each={maxBitrateList} fallback={<div>No items</div>}>
            {([label, item], index) => (
              <option value={item}>
                {index()}: {label}
              </option>
            )}
          </For>
        </select>
      </p>
      <hr />
      <video
        ref={(el) => (peerRef = el)}
        autoplay
        playsinline
        style="width: 128px; height: 96px;"
        onClick={async (e) => {
          e.preventDefault();
          const currentFullscreenElement = document.fullscreenElement;
          if (!currentFullscreenElement || currentFullscreenElement !== peerRef) {
            try {
              await peerRef?.requestFullscreen();
            } catch (err) {
              console.warn("Fullscreen request failed:", err);
              return; // 如果失败，不继续坐标计算
            }
          }
          // await peerRef?.play().catch(() => {});
          const rect = e.currentTarget.getBoundingClientRect(); // 绑定事件的元素
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          console.log(`X: ${x.toFixed(2)}, Y: ${y.toFixed()}`);
          webrtc.sendMessage({ click: { x, y } });
        }}
      />
      <video ref={(el) => (videoRef = el)} autoplay playsinline muted style="width: 64px; height: 48px;" />
      <KeyInput
        sendKey={(val) => {
          webrtc.sendMessage({ key: val });
        }}
      />

      {/* <dialog ref={(el) => (desktopDlgRef = el)} style="width:100vw; height:100vh;padding:0px;overflow:hidden;">
        <video ref={(el) => (desktopVideoRef = el)} onClick={() => desktopDlgRef?.close()} />
      </dialog> */}
    </dialog>
  );

  return [dlg, dlgBtn, peerStream] as const;
}

const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
console.debug("supportedConstraints", supportedConstraints);

const audioConstraints: MediaStreamConstraints = {
  audio:
    supportedConstraints.sampleRate &&
    supportedConstraints.sampleSize &&
    supportedConstraints.echoCancellation &&
    supportedConstraints.channelCount
      ? {
          sampleSize: { ideal: 8 },
          // sampleRate: { ideal: 16_000 },

          // 使用单声道以减少数据量。
          channelCount: { ideal: 1 },

          // 开启回声消除以保证通话质量。
          echoCancellation: true,
        }
      : true,
};

type Video = Extract<MediaStreamConstraints["video"], object>;

const defaultVideoConfig: Video = {
  // aspectRatio: { ideal: 4 / 3 },
  width: { min: 640, ideal: 800, max: 1024 },
  height: { min: 480, ideal: 600, max: 768 },
  frameRate: { min: 5, ideal: 5, max: 5 },
};

const videoConstraints: { [key: string]: Video } = {
  default: defaultVideoConfig,
  "160*120": {
    width: 160,
    height: 120,
  },
  "320*240": {
    width: 320,
    height: 240,
  },
  "640*480": {
    width: 640,
    height: 480,
  },
  "800*600": {
    width: 800,
    height: 600,
  },
};

const maxBitrateList = [
  ["10Mbps", 10_000_000],
  ["2.5Mbps", 2_500_000],
  ["1Mbps", 1_000_000],
  ["500kbps", 500_000],
  ["100kbps", 100_000],
] as const;

if (import.meta.env.DEV) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log("不支持 enumerateDevices() .");
  } else {
    // 列出相机和麦克风。
    navigator.mediaDevices
      .enumerateDevices()
      .then(function (devices) {
        devices.forEach(function (device) {
          // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia + deviceId
          console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
        });
      })
      .catch(function (err) {
        console.log(err.name + ": " + err.message);
      });
  }
}

function KeyInput({ sendKey }: { sendKey: (val: Message["key"]) => void }) {
  return (
    <>
      <hr />
      keyboard:
      <input
        type="text"
        onKeyDown={(e) => {
          e.preventDefault(); // 👈 阻止浏览器默认输入行为
          e.currentTarget.value = e.key;
          sendKey({ key: e.key, alt: false, ctrl: false, shift: false });
        }}
      />
    </>
  );
}
