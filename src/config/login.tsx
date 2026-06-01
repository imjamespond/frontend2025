import { DebugDialog } from "@components/debug";
import { useEffect, useRef, useState } from "react";

function FC() {
  const dlgRef = useRef<HTMLDialogElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    type handleKeyPressFn = Parameters<typeof window.addEventListener<"keydown">>[1];
    // 全局键盘事件监听
    const handleKeyPress: handleKeyPressFn = (event) => {
      // 例如：按 Ctrl+K 或 Cmd+K
      if ((event.ctrlKey || event.metaKey) && event.key === "l") {
        event.preventDefault();
        // alert("你按下了 Ctrl/Cmd + K！");
        dlgRef.current?.showModal();
        setShow(true);
      }

      // // 例如：单独按 F1 键
      // if (event.key === "F1") {
      //   event.preventDefault();
      //   alert("你按下了 F1 键！");
      // }

      // // 例如：按 Escape 键
      // if (event.key === "Escape") {
      //   alert("你按下了 ESC 键！");
      // }

      // // 例如：按 Shift + S
      // if (event.shiftKey && event.key === "S") {
      //   event.preventDefault();
      //   alert("你按下了 Shift + S！");
      // }
    };

    // 添加事件监听
    window.addEventListener("keydown", handleKeyPress);

    // 清理事件监听
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const close = () => {
    dlgRef.current?.close();
    setShow(false);
  };
  return (
    <DebugDialog ref={dlgRef} onClose={close}>
      {show && (
        <form
          id="signinForm"
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const username = formData.get("username") as string;
            const password = formData.get("password") as string;
            localStorage.setItem("dev.username", username);
            localStorage.setItem("dev.password", password);

            try {
              const rs = await (
                await fetch(`/api/auth/signin?username=${username}&password=${password}`, { method: "POST" })
              ).text();
              if (rs !== "ok") {
                throw new Error("登录失败");
              }
              close();
            } catch (error) {
              alert(error);
            }
          }}
        >
          <label htmlFor="username">用户名：</label>
          <input type="text" name="username" required defaultValue={localStorage.getItem("dev.username") ?? ""} />
          <br />
          <label htmlFor="password">密码：</label>
          <input type="password" name="password" required defaultValue={localStorage.getItem("dev.password") ?? ""} />
          <br />
          <button type="submit">登录</button>
        </form>
      )}
      <hr />
      {/*<button
        type="button"
        onClick={() => {
          mutate(
            (key) => {
              console.log("clear key", key);
              return true;
            }, // which cache keys are updated
            undefined, // update cache data to `undefined`
            { revalidate: false }, // do not revalidate
          );
        }}
      >
        Clear Cache
      </button>*/}
    </DebugDialog>
  );
}

export default FC;
