import {
  ConsoleLogger,
  FileLoadingError,
  isEmpty,
} from "@open-system/core-shared-utilities";

export function readAsTextAsync(file: File) {
  const fr = new FileReader();

  return new Promise((resolve, reject) => {
    fr.onerror = () => {
      fr.abort();
      reject(new FileLoadingError(file.name, fr.error?.message));
    };
    fr.onload = () => {
      resolve(fr.result);
    };

    fr.readAsText(file);
  });
}

export function readAsDataURLAsync(file: File) {
  const fr = new FileReader();

  return new Promise((resolve, reject) => {
    fr.onerror = () => {
      fr.abort();
      reject(new FileLoadingError(file.name, fr.error?.message));
    };
    fr.onload = () => {
      resolve(fr.result);
    };

    fr.readAsDataURL(file);
  });
}

export const openFileInNewTab = async (
  file: File,
  title = "File Content - View"
) => {
  let dataUrl, data, error, type;
  try {
    const dataUrlPromise = readAsDataURLAsync(file);
    const dataPromise = readAsTextAsync(file);

    const resolved = await Promise.all([dataUrlPromise, dataPromise]);
    if (Array.isArray(resolved) && resolved.length > 1) {
      dataUrl = resolved[0];
      data = resolved[1];
      type = file.type;
    }
  } catch (e) {
    error =
      (e as FileLoadingError)?.message ?? "An error occured reading the file";
    type = "error/FileLoadingError";
    ConsoleLogger.error(error);
  }

  openDataInNewTab(
    file.name,
    {
      dataUrl: typeof dataUrl === "string" ? dataUrl : undefined,
      data: typeof data === "string" ? data : undefined,
      error,
      type,
    },
    title
  );
};

export function openDataInNewTab(
  name: string,
  content: { dataUrl?: string; data?: string; error?: string; type?: string },
  title = "File Content - View"
) {
  const { data, dataUrl, error, type } = content;

  if (!isEmpty(window) && (error || dataUrl || data)) {
    const html = window.open(title)?.document.createElement("html");
    html &&
      (html.innerText = `<head><title>${title}</title></head>
      <body style="height: 100%; width: 98%; background: #e2e8f0;">
        ${
          isImageMIMEType(type) && !type?.includes("svg")
            ? `<img style="height: 30%;" src="${dataUrl}"" alt="${name}"></img>`
            : isApplicationMIMEType(type) && !type?.includes("json")
            ? `<iframe style="height: 100%; width: 100%;" src="${dataUrl}"" alt="${name}"></iframe>`
            : isVideoMIMEType(type)
            ? `<video style="width: 100%;" controls muted>
        <source src="${data}" type="${
                type ? type : "video/mp4"
              }">Your browser does not support the video tag.</video>`
            : isAudioMIMEType(type)
            ? `<audio  controls muted>
        <source src="${data}" type="${
                type ? type : "audio/mp3"
              }">Your browser does not support the audio element.</audio>`
            : `<div style="height: 100%; width: 100%;">${
                error ? error : data
              }"></div>`
        }
      </body>`);
  }
}

export function isPropagationStopped(event: any) {
  if (typeof event?.isPropagationStopped === "function") {
    return event.isPropagationStopped();
  } else if (typeof event?.cancelBubble !== "undefined") {
    return event.cancelBubble;
  }
  return false;
}

/**
 * This is intended to be used to compose event handlers
 * They are executed in order until one of them calls `event.isPropagationStopped()`.
 * Note that the check is done on the first invoke too,
 * meaning that if propagation was stopped before invoking the fns,
 * no handlers will be executed.
 *
 * @param {Function} fns the event handler functions
 * @return {Function} the event handler to add to an element
 */
export function composeEventHandlers(...fns: any[]) {
  return (event: any, ...args: any[]) =>
    fns.some(fn => {
      if (!isPropagationStopped(event) && fn) {
        fn(event, ...args);
      }
      return isPropagationStopped(event);
    });
}

export function isIe(userAgent: string) {
  return (
    userAgent.indexOf("MSIE") !== -1 || userAgent.indexOf("Trident/") !== -1
  );
}

export function isEdge(userAgent: string) {
  return userAgent.indexOf("Edge/") !== -1;
}

export function isIeOrEdge(userAgent = window.navigator.userAgent) {
  return isIe(userAgent) || isEdge(userAgent);
}

/**
 * Check if v is a file extension.
 * @param {string} v
 */
export function isExt(v: string) {
  return /^.*\.[\w]+$/.test(v);
}

/**
 * Check if v is a MIME type string.
 *
 * See accepted format: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers.
 *
 * @param {string} v
 */
export function isMIMEType(v?: string) {
  return (
    !isEmpty(v) &&
    (v === "audio/*" ||
      v === "video/*" ||
      v === "image/*" ||
      v === "text/*" ||
      (v && /\w+\/[-+.\w]+/g.test(v)))
  );
}

/**
 * Check if v is an image MIME type string.
 *
 * See accepted format: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers.
 *
 * @param {string} v
 */
export function isImageMIMEType(v?: string) {
  return isMIMEType(v) && v?.startsWith("image/");
}

/**
 * Check if v is an application MIME type string.
 *
 * See accepted format: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers.
 *
 * @param {string} v
 */
export function isApplicationMIMEType(v?: string) {
  return isMIMEType(v) && v?.startsWith("application/");
}

/**
 * Check if v is an video MIME type string.
 *
 * See accepted format: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers.
 *
 * @param {string} v
 */
export function isVideoMIMEType(v?: string) {
  return isMIMEType(v) && v?.startsWith("video/");
}

/**
 * Check if v is an audio MIME type string.
 *
 * See accepted format: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers.
 *
 * @param {string} v
 */
export function isAudioMIMEType(v?: string) {
  return isMIMEType(v) && v?.startsWith("audio/");
}

/**
 * Check if v is an exception caused by aborting a request (e.g window.showOpenFilePicker()).
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/DOMException.
 * @param {any} v
 * @returns {boolean} True if v is an abort exception.
 */
export function isAbort(v: any) {
  return (
    v instanceof DOMException &&
    (v.name === "AbortError" || v.code === v.ABORT_ERR)
  );
}

/**
 * Check if v is a security error.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/DOMException.
 * @param {any} v
 * @returns {boolean} True if v is a security error.
 */
export function isSecurityError(v: any) {
  return (
    v instanceof DOMException &&
    (v.name === "SecurityError" || v.code === v.SECURITY_ERR)
  );
}

export function isEvtWithFiles(event: any) {
  if (!event?.dataTransfer) {
    return !!event.target && !!event.target.files;
  }
  // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/types
  // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types#file
  return Array.prototype.some.call(
    event.dataTransfer.types,
    type => type === "Files" || type === "application/x-moz-file"
  );
}
