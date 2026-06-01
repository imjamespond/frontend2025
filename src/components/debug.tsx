import React from "react";

function FC({ data }: { data: Misc.Any }) {
  if (!process.env.devMode) {
    return null;
  }
  return (
    <div style={{ position: "fixed", zIndex: 99999, left: 0, bottom: 0, width: "100vw" }}>{JSON.stringify(data)}</div>
  );
}

export default FC;

export function PrintJSON({ data }: { data: Misc.Any }) {
  if (!process.env.devMode) {
    return null;
  }
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

export const DebugDialog = React.forwardRef<HTMLDialogElement, React.PropsWithChildren<{ onClose: () => void }>>(
  function DebugDialog({ children, onClose }, ref) {
    return (
      <dialog
        ref={ref}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div>{children}</div>
      </dialog>
    );
  },
);

/**
 * example:
 *
const dlgRef = useRef<HTMLDialogElement>(null);
return <>
<button onClick={() => dlgRef.current?.showModal()}>show</button>
<DebugDialog
  ref={dlgRef}
  onClose={function (): void {
    dlgRef.current?.close();
  }}
>foobar</DebugDialog>
</>
 */
