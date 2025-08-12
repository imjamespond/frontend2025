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

  const [video, setVideo] = createSignal(false);
  const [audio, setAudio] = createSignal(false);

  const peerStream = (stream: MediaStream) => {
    if (peerRef === null) return;
    peerRef.srcObject = stream;
  };

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
    <dialog ref={(el) => (dialogRef = el)} style="width:50vw; height:50vh;">
      <button
        onClick={async () => {
          if (videoRef === null) return;
          if (!videoTrack) {
            // 获取视频 track
            const stream = await navigator.mediaDevices.getUserMedia(videoConstraints);
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

      <button disabled={video() || audio()} onClick={() => dialogRef?.close()}>
        关闭
      </button>
      <hr />
      <video ref={(el) => (peerRef = el)} autoplay playsinline style="width: 128px; height: 96px;" />
      <video ref={(el) => (videoRef = el)} autoplay playsinline muted style="width: 64px; height: 48px;" />
    </dialog>
  );

  return [dlg, dlgBtn, peerStream] as const;
}

const videoConstraints = {
  video: {
    width: 160,
    height: 120,
    frameRate: {
      ideal: 10,
      max: 15,
    },
  },
  // 设置理想的码率（例如，3 Mbps）
  // advanced: [
  //   {
  //     frameRate: { ideal: 10 }, // 帧率
  //   },
  // ],
};

const audioConstraints = {
  audio: {
    // 理想码率设置为 24 kbps，适合语音。
    bitrate: { ideal: 48_000 },

    // 采样率设置为 16000 Hz，适合语音通话。
    // sampleRate: { ideal: 16000 },

    // 使用单声道以减少数据量。
    channelCount: { ideal: 1 },

    // 开启回声消除以保证通话质量。
    echoCancellation: true,
  },
};
