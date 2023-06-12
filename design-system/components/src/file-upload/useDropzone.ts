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
import accepts from "attr-accept";
import { fromEvent } from "file-selector";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DropzoneInputProps,
  DropzoneRootProps,
  FileRejection,
  UseDropzoneParams,
} from "./FileUpload.types";

/**
 * A function that is invoked for the `dragenter`,
 * `dragover` and `dragleave` events.
 * It is not invoked if the items are not files (such as link, text, etc.).
 *
 * @callback dragCb
 * @param {DragEvent} event
 */

/**
 * A function that is invoked for the `drop` or input change event.
 * It is not invoked if the items are not files (such as link, text, etc.).
 *
 * @callback dropCb
 * @param {File[]} acceptedFiles List of accepted files
 * @param {FileRejection[]} fileRejections List of rejected files and why they were rejected
 * @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
 */

/**
 * A function that is invoked for the `drop` or input change event.
 * It is not invoked if the items are files (such as link, text, etc.).
 *
 * @callback dropAcceptedCb
 * @param {File[]} files List of accepted files that meet the given criteria
 * (`accept`, `multiple`, `minSize`, `maxSize`)
 * @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
 */

/**
 * A function that is invoked for the `drop` or input change event.
 *
 * @callback dropRejectedCb
 * @param {File[]} files List of rejected files that do not meet the given criteria
 * (`accept`, `multiple`, `minSize`, `maxSize`)
 * @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
 */

/**
 * A function that is used aggregate files,
 * in a asynchronous fashion, from drag or input change events.
 *
 * @callback getFilesFromEvent
 * @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
 * @returns {(File[]|Promise<File[]>)}
 */

/**
 * An object with the current dropzone state.
 *
 * @typedef {object} DropzoneState
 * @property {boolean} isFocused Dropzone area is in focus
 * @property {boolean} isFileDialogActive File dialog is opened
 * @property {boolean} isDragActive Active drag is in progress
 * @property {boolean} isDragAccept Dragged files are accepted
 * @property {boolean} isDragReject Some dragged files are rejected
 * @property {File[]} acceptedFiles Accepted files
 * @property {FileRejection[]} fileRejections Rejected files and why they were rejected
 */

/**
 * An object with the dropzone methods.
 *
 * @typedef {object} DropzoneMethods
 * @property {Function} getRootProps Returns the props you should apply to the root drop container you render
 * @property {Function} getInputProps Returns the props you should apply to hidden file input you render
 * @property {Function} open Open the native file selection dialog
 */

const TOO_MANY_FILES_REJECTION = {
  code: "too-many-files",
  message: "Too many files",
};

// Error codes
export const FILE_INVALID_TYPE = "file-invalid-type";
export const FILE_TOO_LARGE = "file-too-large";
export const FILE_TOO_SMALL = "file-too-small";
export const TOO_MANY_FILES = "too-many-files";
export const DUPLICATE_FILE = "duplicate-file";

export const ErrorCode = {
  FileInvalidType: FILE_INVALID_TYPE,
  FileTooLarge: FILE_TOO_LARGE,
  FileTooSmall: FILE_TOO_SMALL,
  TooManyFiles: TOO_MANY_FILES,
  DuplicateFile: DUPLICATE_FILE,
};

const getDuplicateFileRejectionErr = name => {
  return {
    code: DUPLICATE_FILE,
    message: `File ${name} has already been added to the list`,
  };
};

const getTooLargeRejectionErr = maxSize => {
  return {
    code: FILE_TOO_LARGE,
    message: `File is larger than ${maxSize} ${
      maxSize === 1 ? "byte" : "bytes"
    }`,
  };
};

const getTooSmallRejectionErr = minSize => {
  return {
    code: FILE_TOO_SMALL,
    message: `File is smaller than ${minSize} ${
      minSize === 1 ? "byte" : "bytes"
    }`,
  };
};

const getInvalidTypeRejectionErr = accept => {
  accept = Array.isArray(accept) && accept.length === 1 ? accept[0] : accept;
  const messageSuffix = Array.isArray(accept)
    ? `one of ${accept.join(", ")}`
    : accept;
  return {
    code: FILE_INVALID_TYPE,
    message: `File type must be ${messageSuffix}`,
  };
};

function fileMatchSize(file, minSize, maxSize) {
  if (isSet(file.size)) {
    if (isSet(minSize) && isSet(maxSize)) {
      if (file.size > maxSize) return [false, getTooLargeRejectionErr(maxSize)];
      if (file.size < minSize) return [false, getTooSmallRejectionErr(minSize)];
    } else if (isSet(minSize) && file.size < minSize)
      return [false, getTooSmallRejectionErr(minSize)];
    else if (isSet(maxSize) && file.size > maxSize)
      return [false, getTooLargeRejectionErr(maxSize)];
  }
  return [true, null];
}

/**
 * Firefox versions prior to 53 return a bogus MIME type for every file drag, so dragovers with
 * that MIME type will always be accepted
 */
function fileAccepted(file, accept) {
  const isAcceptable =
    file.type === "application/x-moz-file" || accepts(file, accept);
  return [
    isAcceptable,
    isAcceptable ? null : getInvalidTypeRejectionErr(accept),
  ];
}

/**
 * canUseFileSystemAccessAPI checks if the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)
 * is supported by the browser.
 * @returns {boolean}
 */
function canUseFileSystemAccessAPI() {
  return "showOpenFilePicker" in window;
}

/**
 *
 * @param {object} options
 * @param {File[]} options.files
 * @param {string|string[]} [options.accept]
 * @param {number} [options.minSize]
 * @param {number} [options.maxSize]
 * @param {boolean} [options.multiple]
 * @param {number} [options.maxFiles]
 * @param {(f: File) => FileError|FileError[]|null} [options.validator]
 * @returns
 */
function allFilesAccepted({
  files,
  accept,
  minSize,
  maxSize,
  multiple,
  maxFiles,
  validator,
}) {
  if (
    (!multiple && files.length > 1) ||
    (multiple && maxFiles >= 1 && files.length > maxFiles)
  ) {
    return false;
  }

  return files.every(file => {
    const [accepted] = fileAccepted(file, accept);
    const [sizeMatch] = fileMatchSize(file, minSize, maxSize);
    const customErrors = validator ? validator(file) : null;
    return accepted && sizeMatch && !customErrors;
  });
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
 * Files are accepted or rejected based on the `accept`, `multiple`, `minSize` and `maxSize` props.
 * `accept` must be an object with keys as a valid [MIME type](http://www.iana.org/assignments/media-types/media-types.xhtml) according to [input element specification](https://www.w3.org/wiki/HTML/Elements/input/file) and the value an array of file extensions (optional).
 * If `multiple` is set to false and additional files are dropped,
 * all files besides the first will be rejected.
 * Any file which does not have a size in the [`minSize`, `maxSize`] range, will be rejected as well.
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
  maxSize = Infinity,
  minSize = 0,
  multiple = true,
  maxFiles = 0,
  preventDropOnDocument = true,
  noClick = false,
  noKeyboard = false,
  noDrag = false,
  noDragEventsBubbling = false,
  validator = null,
  useFsAccessApi = true,
  autoFocus = false,
  accept,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onDropAccepted,
  onDropRejected,
  onFileDialogCancel,
  onFileDialogOpen,
  onError,
  onInclude,
  onReset,
  ...params
}: UseDropzoneParams) {
  const acceptAttr = useMemo(() => acceptPropAsAcceptAttr(accept), [accept]);
  const pickerTypes = useMemo(() => pickerOptionsFromAccept(accept), [accept]);

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
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      await onInclude(acceptedFiles);

      setInputState((state: any) => ({
        ...state,
        acceptedFiles,
        fileRejections,
      }));
    },
    [onInclude]
  );
  const handleReset = useCallback(() => {
    onReset();

    setInputState({
      ...initialState,
    });
  }, [onReset]);

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
            const isDragAccept =
              fileCount > 0 &&
              allFilesAccepted({
                files,
                accept: acceptAttr,
                minSize,
                maxSize,
                multiple,
                maxFiles,
                validator,
              });
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
      acceptAttr,
      minSize,
      maxSize,
      multiple,
      maxFiles,
      validator,
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
    async (files, event) => {
      const acceptedFiles = [];
      const fileRejections = [];

      for (const file of files) {
        const [accepted, acceptError] = fileAccepted(file, acceptAttr);
        const [sizeMatch, sizeError] = fileMatchSize(file, minSize, maxSize);
        const customErrors = validator ? validator(file) : null;

        if (accepted && sizeMatch && !customErrors) {
          acceptedFiles.push(file);
        } else {
          let errors = [acceptError, sizeError];

          if (customErrors) {
            errors = errors.concat(customErrors);
          }

          fileRejections.push({ file, errors: errors.filter(e => e) });
        }
      }

      if (
        (!multiple && acceptedFiles.length > 1) ||
        (multiple && maxFiles >= 1 && acceptedFiles.length > maxFiles)
      ) {
        // Reject everything and empty accepted files
        acceptedFiles.forEach(file => {
          fileRejections.push({ file, errors: [TOO_MANY_FILES_REJECTION] });
        });
        acceptedFiles.splice(0);
      }

      await handleSetFiles(acceptedFiles, fileRejections);

      if (onDrop) {
        onDrop(acceptedFiles, fileRejections, event);
      }

      if (fileRejections.length > 0 && onDropRejected) {
        onDropRejected(fileRejections, event);
      }

      if (acceptedFiles.length > 0 && onDropAccepted) {
        onDropAccepted(acceptedFiles, event);
      }
    },
    [
      multiple,
      acceptAttr,
      minSize,
      maxSize,
      maxFiles,
      onDrop,
      onDropAccepted,
      onDropRejected,
      validator,
      handleSetFiles,
    ]
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
          await setFiles(files, event);
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
            setFiles(files, null).then(() => handleCloseDialog());
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
      ({ refKey = "ref", onChange, onClick, ...rest }: DropzoneInputProps) => {
        const inputProps = {
          accept: acceptAttr,
          multiple,
          type: "file",
          style: { display: "none" },
          onChange: composeHandler(composeEventHandlers(onChange, onDropCb)),
          onClick: composeHandler(
            composeEventHandlers(onClick, onInputElementClick)
          ),
          tabIndex: -1,
          [refKey]: inputRef,
        };

        return {
          ...inputProps,
          ...rest,
        };
      },
    [
      acceptAttr,
      multiple,
      composeHandler,
      onDropCb,
      onInputElementClick,
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
