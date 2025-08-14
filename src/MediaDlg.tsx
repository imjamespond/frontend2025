import { createSignal } from "solid-js";
import { WebRTCDemo } from "./WebRTC";

export function useMediaDlg(webrtc: WebRTCDemo /* getPeerID: () => string */) {
  let dialogRef: HTMLDialogElement | null = null;
  let videoRef: HTMLVideoElement | null = null;
  let peerRef: HTMLVideoElement | null = null;

  let localStream = new MediaStream();
  let videoTrack: MediaStreamTrack | null = null;
  let audioTrack: MediaStreamTrack | null = null;

  let videoSender: RTCRtpSender | undefined = undefined;
  let audioSender: RTCRtpSender | undefined = undefined;

  let videoConstraint: { video: Video | boolean } = { video: true };

  const [video, setVideo] = createSignal(false);
  const [audio, setAudio] = createSignal(false);

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
            const stream = await navigator.mediaDevices.getUserMedia(videoConstraint);
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
            videoRef.srcObject = null;
            setAudio(false);
          }
        }}
      >
        Audio: {audio() ? "ON" : "OFF"}
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
        <select
          onChange={(e) => {
            const video = videoConstraints[e.currentTarget.value];
            videoConstraint = { video: video ?? true };
          }}
        >
          <option value="">分辨率</option>
          {Object.keys(videoConstraints).map((k) => (
            <option value={k}>{k}</option>
          ))}
        </select>
      </p>
      <hr />
      <video ref={(el) => (peerRef = el)} autoplay playsinline style="width: 128px; height: 96px;" />
      <video ref={(el) => (videoRef = el)} autoplay playsinline muted style="width: 64px; height: 48px;" />
    </dialog>
  );

  return [dlg, dlgBtn, peerStream] as const;
}

const audioConstraints: MediaStreamConstraints = {
  audio: {
    sampleSize: { ideal: 16000 },

    // 使用单声道以减少数据量。
    channelCount: { ideal: 1 },

    // 开启回声消除以保证通话质量。
    echoCancellation: true,
  },
};

type Video = Extract<MediaStreamConstraints["video"], object>;

const defaultVideoConfig: Video = {
  aspectRatio: { ideal: 4 / 3 },
  width: { min: 640, ideal: 800, max: 1024 },
  height: { min: 480, ideal: 600, max: 768 },
  frameRate: { min: 10, ideal: 15, max: 20 },
};

const videoConstraints: { [key: string]: Video } = {
  default: defaultVideoConfig,
  "160*120": {
    ...defaultVideoConfig,
    width: 160,
    height: 120,
  },
  "320*240": {
    ...defaultVideoConfig,
    width: 320,
    height: 240,
  },
  "640*480": {
    ...defaultVideoConfig,
    width: 640,
    height: 480,
  },
  "800*600": {
    ...defaultVideoConfig,
    width: 800,
    height: 600,
  },
};
