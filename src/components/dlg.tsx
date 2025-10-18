import { JSXElement } from "solid-js";

export function useDlg({ title, content }: { title: JSXElement; content: JSXElement }) {
  let dialogRef: HTMLDialogElement | null = null;

  const dlgBtn = (
    <button
      onClick={() => {
        dialogRef?.showModal();
      }}
    >
      {title}
    </button>
  );

  const dlg = (
    <dialog ref={(el) => (dialogRef = el)} style="width:50rem; height:30rem; max-width: 88%; max-height: 88%;">
      <button onClick={() => dialogRef?.close()}>关闭</button>
      {content}
    </dialog>
  );

  return [dlg, dlgBtn] as const;
}