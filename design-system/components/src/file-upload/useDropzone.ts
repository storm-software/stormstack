/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  composeEventHandlers,
  isAbort,
  isEvtWithFiles,
  isExt,
  isFunction,
  isIeOrEdge,
  isMIMEType,
  isPropagationStopped,
  isSecurityError,
  isSet,
  noop,
} from "@open-system/core-utilities";
import { fromEvent } from "file-selector";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DropzoneInputProps,
  DropzoneRootProps,
  FileRejection,
  UseDropzoneParams,
} from "./FileUpload.types";

/**
 * canUseFileSystemAccessAPI checks if the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)
 * is supported by the browser.
 * @returns {boolean}
 */
function canUseFileSystemAccessAPI() {
  return "showOpenFilePicker" in window;
}

/**
 * Convert the `{accept}` dropzone prop to an array of MIME types/extensions.
 */
function acceptPropAsAcceptAttr(accept: any): string {
  if (isSet(accept)) {
    return (
      Object.entries(accept)
        .reduce(
          (a, [mimeType, ext]: [mimeType: any, ext: any]) => [
            ...a,
            mimeType,
            ...ext,
          ],
          []
        )
        // Silently discard invalid entries as pickerOptionsFromAccept warns about these
        .filter(v => isMIMEType(v) || isExt(v))
        .join(",")
    );
  }

  return undefined;
}

function onDocumentDragOver(event) {
  event.preventDefault();
}

function pickerOptionsFromAccept(accept) {
  if (isSet(accept)) {
    const acceptForPicker = Object.entries(accept)
      .filter(([mimeType, ext]) => {
        let ok = true;

        if (!isMIMEType(mimeType)) {
          console.warn(
            `Skipped "${mimeType}" because it is not a valid MIME type. Check https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types for a list of valid MIME types.`
          );
          ok = false;
        }

        if (!Array.isArray(ext) || !ext.every(isExt)) {
          console.warn(
            `Skipped "${mimeType}" because an invalid file extension was provided.`
          );
          ok = false;
        }

        return ok;
      })
      .reduce(
        (agg, [mimeType, ext]) => ({
          ...agg,
          [mimeType]: ext,
        }),
        {}
      );
    return [
      {
        // description is required due to https://crbug.com/1264708
        description: "Files",
        accept: acceptForPicker,
      },
    ];
  }
  return accept;
}

const initialState = {
  isFocused: false,
  isFileDialogActive: false,
  isDragActive: false,
  isDragAccept: false,
  isDragReject: false,
  acceptedFiles: [],
  fileRejections: [],
};

/**
 * A React hook that creates a drag 'n' drop area.
 *
 * ```jsx
 * function MyDropzone(props) {
 *   const {getRootProps, getInputProps} = useDropzone({
 *     onDrop: acceptedFiles => {
 *       // do something with the File objects, e.g. upload to some server
 *     }
 *   });
 *   return (
 *     <div {...getRootProps()}>
 *       <input {...getInputProps()} />
 *       <p>Drag and drop some files here, or click to select files</p>
 *     </div>
 *   )
 * }
 * ```
 *
 * @function useDropzone
 *
 * @param {object} props
 * @param {import("./utils").AcceptProp} [props.accept] Set accepted file types.
 * Checkout https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker types option for more information.
 * Keep in mind that mime type determination is not reliable across platforms. CSV files,
 * for example, are reported as text/plain under macOS but as application/vnd.ms-excel under
 * Windows. In some cases there might not be a mime type set at all (https://github.com/react-dropzone/react-dropzone/issues/276).
 *
 * **Note** that this callback is invoked after the `getFilesFromEvent` callback is done.
 *
 * Files are accepted or rejected based on the `accept`, `multiple`, `minSizeInBytes` and `maxSizeInBytes` props.
 * `accept` must be an object with keys as a valid [MIME type](http://www.iana.org/assignments/media-types/media-types.xhtml) according to [input element specification](https://www.w3.org/wiki/HTML/Elements/input/file) and the value an array of file extensions (optional).
 * If `multiple` is set to false and additional files are dropped,
 * all files besides the first will be rejected.
 * Any file which does not have a size in the [`minSizeInBytes`, `maxSizeInBytes`] range, will be rejected as well.
 *
 * Note that the `onDrop` callback will always be invoked regardless if the dropped files were accepted or rejected.
 * If you'd like to react to a specific scenario, use the `onDropAccepted`/`onDropRejected` props.
 *
 * `onDrop` will provide you with an array of [File](https://developer.mozilla.org/en-US/docs/Web/API/File) objects which you can then process and send to a server.
 * For example, with [SuperAgent](https://github.com/visionmedia/superagent) as a http/ajax library:
 *
 * ```js
 * function onDrop(acceptedFiles) {
 *   const req = request.post('/upload')
 *   acceptedFiles.forEach(file => {
 *     req.attach(file.name, file)
 *   })
 *   req.end(callback)
 * }
 * ```
 * @param {dropAcceptedCb} [props.onDropAccepted]
 * @param {dropRejectedCb} [props.onDropRejected]
 * @param {(error: Error) => void} [props.onError]
 *
 * @returns {DropzoneState & DropzoneMethods}
 */
export function useDropzone({
  inputRef,
  disabled = false,
  getFilesFromEvent = fromEvent,
  maxSizeInBytes = Infinity,
  minSizeInBytes = 0,
  multiple = true,
  maxFiles = 0,
  preventDropOnDocument = true,
  allowedFiles,
  noClick = false,
  noKeyboard = false,
  noDrag = false,
  noDragEventsBubbling = false,
  useFsAccessApi = true,
  autoFocus = false,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onDropAccepted,
  onDropRejected,
  onFileDialogCancel,
  onFileDialogOpen,
  onError,
  onAddFiles,
  onResetFiles,
  ...params
}: UseDropzoneParams) {
  const acceptAttr = useMemo(
    () => acceptPropAsAcceptAttr(allowedFiles),
    [allowedFiles]
  );
  const pickerTypes = useMemo(
    () => pickerOptionsFromAccept(allowedFiles),
    [allowedFiles]
  );

  const onFileDialogOpenCb = useMemo(
    () => (isFunction(onFileDialogOpen) ? onFileDialogOpen : noop),
    [onFileDialogOpen]
  );
  const onFileDialogCancelCb = useMemo(
    () => (isFunction(onFileDialogCancel) ? onFileDialogCancel : noop),
    [onFileDialogCancel]
  );

  /**
   * @constant
   * @type {React.MutableRefObject<HTMLElement>}
   */
  const rootRef = useRef(null);
  const [inputState, setInputState] = useState(initialState);
  const { isFocused, isFileDialogActive } = inputState;

  const handleFocus = useCallback(
    () => setInputState((state: any) => ({ ...state, isFocused: true })),
    []
  );
  const handleBlur = useCallback(
    () => setInputState((state: any) => ({ ...state, isFocused: false })),
    []
  );
  const handleOpenDialog = useCallback(
    () =>
      setInputState((state: any) => ({
        ...initialState,
        acceptedFiles: state.acceptedFiles,
        fileRejections: state.fileRejections,
        isFileDialogActive: true,
      })),
    []
  );
  const handleCloseDialog = useCallback(
    () =>
      setInputState((state: any) => ({ ...state, isFileDialogActive: false })),
    []
  );
  const handleSetDraggedFiles = useCallback(
    (isDragActive: boolean, isDragAccept: boolean, isDragReject: boolean) =>
      setInputState((state: any) => ({
        ...state,
        isDragActive,
        isDragAccept,
        isDragReject,
      })),
    []
  );
  const handleSetFiles = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      onAddFiles(acceptedFiles);
      setInputState((state: any) => ({
        ...state,
        acceptedFiles,
        fileRejections,
      }));
    },
    [onAddFiles]
  );
  const handleReset = useCallback(() => {
    onResetFiles();

    setInputState({
      ...initialState,
    });
  }, [onResetFiles]);

  const fsAccessApiWorksRef = useRef(
    typeof window !== "undefined" &&
      window.isSecureContext &&
      useFsAccessApi &&
      canUseFileSystemAccessAPI()
  );

  useEffect(() => {
    // Update file dialog active state when the window is focused on
    const onWindowFocus = () => {
      // Execute the timeout only if the file dialog is opened in the browser
      if (!fsAccessApiWorksRef.current && isFileDialogActive) {
        setTimeout(() => {
          if (inputRef.current) {
            const { files } = inputRef.current;

            if (!files.length) {
              handleCloseDialog();
              onFileDialogCancelCb();
            }
          }
        }, 300);
      }
    };

    window.addEventListener("focus", onWindowFocus, false);
    return () => {
      window.removeEventListener("focus", onWindowFocus, false);
    };
  }, [
    inputRef,
    isFileDialogActive,
    onFileDialogCancelCb,
    fsAccessApiWorksRef,
    handleCloseDialog,
  ]);

  const dragTargetsRef = useRef([]);
  const onDocumentDrop = event => {
    if (rootRef.current && rootRef.current.contains(event.target)) {
      // If we intercepted an event for our instance, let it propagate down to the instance's onDrop handler
      return;
    }
    event.preventDefault();
    dragTargetsRef.current = [];
  };

  useEffect(() => {
    if (preventDropOnDocument) {
      document.addEventListener("dragover", onDocumentDragOver, false);
      document.addEventListener("drop", onDocumentDrop, false);
    }

    return () => {
      if (preventDropOnDocument) {
        document.removeEventListener("dragover", onDocumentDragOver);
        document.removeEventListener("drop", onDocumentDrop);
      }
    };
  }, [rootRef, preventDropOnDocument]);

  // Auto focus the root when autoFocus is true
  useEffect(() => {
    if (!disabled && autoFocus && rootRef.current) {
      rootRef.current.focus();
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }, [rootRef, autoFocus, disabled]);

  const onErrCb = useCallback(
    e => {
      if (onError) {
        onError(e);
      } else {
        // Let the user know something's gone wrong if they haven't provided the onError cb.
        console.error(e);
      }
    },
    [onError]
  );

  const stopPropagation = useCallback(
    (event: Event) => {
      if (noDragEventsBubbling) {
        event.stopPropagation();
      }
    },
    [noDragEventsBubbling]
  );

  const onDragEnterCb = useCallback(
    event => {
      event.preventDefault();
      // Persist here because we need the event later after getFilesFromEvent() is done
      event.persist();
      stopPropagation(event);

      dragTargetsRef.current = [...dragTargetsRef.current, event.target];

      if (isEvtWithFiles(event)) {
        Promise.resolve(getFilesFromEvent(event))
          .then(files => {
            if (isPropagationStopped(event) && !noDragEventsBubbling) {
              return;
            }

            const fileCount = files.length;
            const isDragAccept = fileCount > 0;
            const isDragReject = fileCount > 0 && !isDragAccept;

            handleSetDraggedFiles(true, isDragAccept, isDragReject);

            if (onDragEnter) {
              onDragEnter(event);
            }
          })
          .catch(e => onErrCb(e));
      }
    },
    [
      stopPropagation,
      getFilesFromEvent,
      noDragEventsBubbling,
      handleSetDraggedFiles,
      onDragEnter,
      onErrCb,
    ]
  );

  const onDragOverCb = useCallback(
    event => {
      event.preventDefault();
      event.persist();
      stopPropagation(event);

      const hasFiles = isEvtWithFiles(event);
      if (hasFiles && event.dataTransfer) {
        try {
          event.dataTransfer.dropEffect = "copy";
        } catch {} /* eslint-disable-line no-empty */
      }

      if (hasFiles && onDragOver) {
        onDragOver(event);
      }

      return false;
    },
    [stopPropagation, onDragOver]
  );

  const onDragLeaveCb = useCallback(
    event => {
      event.preventDefault();
      event.persist();
      stopPropagation(event);

      // Only deactivate once the dropzone and all children have been left
      const targets = dragTargetsRef.current.filter(
        target => rootRef.current && rootRef.current.contains(target)
      );
      // Make sure to remove a target present multiple times only once
      // (Firefox may fire dragenter/dragleave multiple times on the same element)
      const targetIdx = targets.indexOf(event.target);
      if (targetIdx !== -1) {
        targets.splice(targetIdx, 1);
      }
      dragTargetsRef.current = targets;
      if (targets.length > 0) {
        return;
      }

      handleSetDraggedFiles(false, false, false);

      if (isEvtWithFiles(event) && onDragLeave) {
        onDragLeave(event);
      }
    },
    [stopPropagation, handleSetDraggedFiles, onDragLeave]
  );

  const setFiles = useCallback(
    (files, event) => {
      const fileRejections = [];

      if (
        (!multiple && files.length > 1) ||
        (multiple && maxFiles >= 1 && files.length > maxFiles)
      ) {
        // Reject everything and empty accepted files
        files.forEach(file => {
          fileRejections.push({
            file,
            errors: [
              {
                code: "too-many-files",
                message: "Exceeded the number of allowed file uploads",
              },
            ],
          });
        });
        files.splice(0);
      }

      handleSetFiles(files, fileRejections);
      if (onDrop) {
        onDrop(event);
      }

      if (fileRejections.length > 0 && onDropRejected) {
        onDropRejected(fileRejections, event);
      }

      if (files.length > 0 && onDropAccepted) {
        onDropAccepted(files, event);
      }
    },
    [multiple, maxFiles, onDrop, onDropAccepted, onDropRejected, handleSetFiles]
  );

  const onDropCb = useCallback(
    async event => {
      event.preventDefault();
      // Persist here because we need the event later after getFilesFromEvent() is done
      event.persist();
      stopPropagation(event);

      dragTargetsRef.current = [];

      try {
        if (isEvtWithFiles(event)) {
          const files = await getFilesFromEvent(event);
          if (isPropagationStopped(event) && !noDragEventsBubbling) {
            return;
          }
          setFiles(files, event);
        }
      } catch (e) {
        onErrCb(e);
      }
    },
    [
      stopPropagation,
      getFilesFromEvent,
      noDragEventsBubbling,
      setFiles,
      onErrCb,
    ]
  );

  // Fn for opening the file dialog programmatically
  const openFileDialog = useCallback(() => {
    // No point to use FS access APIs if context is not secure
    // https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts#feature_detection
    if (fsAccessApiWorksRef.current) {
      handleOpenDialog();
      onFileDialogOpenCb();
      // https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker
      const opts = {
        multiple,
        types: pickerTypes,
      };
      isFunction((window as any).showOpenFilePicker) &&
        (window as any)
          .showOpenFilePicker(opts)
          .then(handles => getFilesFromEvent(handles))
          .then(files => {
            setFiles(files, null);
            handleCloseDialog();
          })
          .catch(e => {
            // AbortError means the user canceled
            if (isAbort(e)) {
              onFileDialogCancelCb(e);
              handleCloseDialog();
            } else if (isSecurityError(e)) {
              fsAccessApiWorksRef.current = false;
              // CORS, so cannot use this API
              // Try using the input
              if (inputRef.current) {
                inputRef.current.value = null;
                inputRef.current.click();
              } else {
                onErrCb(
                  new Error(
                    "Cannot open the file picker because the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API is not supported and no <input> was provided."
                  )
                );
              }
            } else {
              onErrCb(e);
            }
          });
      return;
    }

    if (inputRef.current) {
      handleOpenDialog();
      onFileDialogOpenCb();
      inputRef.current.value = null;
      inputRef.current.click();
    }
  }, [
    inputRef,
    handleOpenDialog,
    onFileDialogOpenCb,
    multiple,
    pickerTypes,
    getFilesFromEvent,
    setFiles,
    handleCloseDialog,
    onFileDialogCancelCb,
    onErrCb,
  ]);

  // Cb to open the file dialog when SPACE/ENTER occurs on the dropzone
  const onKeyDownCb = useCallback(
    event => {
      // Ignore keyboard events bubbling up the DOM tree
      if (!rootRef.current || !rootRef.current.isEqualNode(event.target)) {
        return;
      }

      if (
        event.key === " " ||
        event.key === "Enter" ||
        event.keyCode === 32 ||
        event.keyCode === 13
      ) {
        event.preventDefault();
        openFileDialog();
      }
    },
    [rootRef, openFileDialog]
  );

  // Cb to open the file dialog when click occurs on the dropzone
  const onClickCb = useCallback(() => {
    if (noClick) {
      return;
    }

    // In IE11/Edge the file-browser dialog is blocking, therefore, use setTimeout()
    // to ensure React can handle state changes
    // See: https://github.com/react-dropzone/react-dropzone/issues/450
    if (isIeOrEdge()) {
      setTimeout(openFileDialog, 0);
    } else {
      openFileDialog();
    }
  }, [noClick, openFileDialog]);

  const composeHandler = useCallback(
    (fn: any) => {
      return disabled ? null : fn;
    },
    [disabled]
  );

  const composeKeyboardHandler = useCallback(
    (fn: any) => {
      return noKeyboard ? null : composeHandler(fn);
    },
    [composeHandler, noKeyboard]
  );

  const composeDragHandler = useCallback(
    (fn: any) => {
      return noDrag ? null : composeHandler(fn);
    },
    [composeHandler, noDrag]
  );

  const getRootProps = useMemo(
    () =>
      ({
        refKey = "ref",
        role,
        onKeyDown,
        onFocus,
        onBlur,
        onClick,
        onDragEnter,
        onDragOver,
        onDragLeave,
        onDrop,
        ...rest
      }: Partial<DropzoneRootProps>) => ({
        onKeyDown: composeKeyboardHandler(
          composeEventHandlers(onKeyDown, onKeyDownCb)
        ),
        onFocus: composeKeyboardHandler(
          composeEventHandlers(onFocus, handleFocus)
        ),
        onBlur: composeKeyboardHandler(
          composeEventHandlers(onBlur, handleBlur)
        ),
        onClick: composeHandler(composeEventHandlers(onClick, onClickCb)),
        onDragEnter: composeDragHandler(
          composeEventHandlers(onDragEnter, onDragEnterCb)
        ),
        onDragOver: composeDragHandler(
          composeEventHandlers(onDragOver, onDragOverCb)
        ),
        onDragLeave: composeDragHandler(
          composeEventHandlers(onDragLeave, onDragLeaveCb)
        ),
        onDrop: composeDragHandler(composeEventHandlers(onDrop, onDropCb)),
        role: typeof role === "string" && role !== "" ? role : "presentation",
        [refKey]: rootRef,
        ...(!disabled && !noKeyboard ? { tabIndex: 0 } : {}),
        ...rest,
      }),
    [
      composeKeyboardHandler,
      onKeyDownCb,
      handleFocus,
      handleBlur,
      composeHandler,
      onClickCb,
      composeDragHandler,
      onDragEnterCb,
      onDragOverCb,
      onDragLeaveCb,
      onDropCb,
      disabled,
      noKeyboard,
    ]
  );

  const onInputElementClick = useCallback(event => {
    event.stopPropagation();
  }, []);

  const getInputProps = useMemo(
    () =>
      ({
        refKey = "ref",
        onChange,
        onClick,
        files,
        ...rest
      }: DropzoneInputProps) => {
        return {
          files,
          disabled,
          accept: acceptAttr,
          multiple,
          type: "file",
          maxsize: maxSizeInBytes,
          minsize: minSizeInBytes,
          style: { display: "none" },
          onChange: composeHandler(composeEventHandlers(onChange, onDropCb)),
          onClick: composeHandler(
            composeEventHandlers(onClick, onInputElementClick)
          ),
          autoFocus,
          onDragEnter,
          onDragLeave,
          onDragOver,
          onDrop,
          onError,
          tabIndex: -1,
          [refKey]: inputRef,
        };
      },
    [
      disabled,
      acceptAttr,
      multiple,
      maxSizeInBytes,
      minSizeInBytes,
      composeHandler,
      onDropCb,
      onInputElementClick,
      autoFocus,
      onDragEnter,
      onDragLeave,
      onDragOver,
      onDrop,
      onError,
      inputRef,
    ]
  );

  return {
    ...inputState,
    isFocused: isFocused && !disabled,
    getRootProps,
    getInputProps,
    rootRef,
    inputRef,
    open: composeHandler(openFileDialog),
  };
}
