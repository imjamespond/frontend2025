
export async function createFileWriter(suggestedName) {
  let fileHandle = await window.showSaveFilePicker({
    suggestedName,
  });
  const writable = await fileHandle.createWritable();

  // 模拟接收 WebRTC DataChannel 的数据分块
  const write = async (chunk) => {
    // const chunk = event.data; // 可以是 ArrayBuffer / Blob / etc.
    await writable.write(chunk);
  };

  // 最终关闭文件
  const finish = () => {
    writable.close();
  };

  return [write, finish, writable];
}
