"use client";

import { isEmptyObject } from "@open-system/core-utilities";
/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import {
  ChangeEvent,
  FocusEvent,
  ForwardedRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import { FieldWrapper, FieldWrapperLabel } from "../field-wrapper";
import { InputTypes } from "../input/Input.types";
import { Link } from "../link";
import { BaseFieldProps } from "../types";
import { UseDropzoneParams } from "./FileUpload.types";
import { useDropzone } from "./useDropzone";

export type FileUploadProps = BaseFieldProps &
  UseDropzoneParams & {
    /**
     * Event handler for button click event
     */
    onClick?: (event: MouseEvent) => void;
  };

/**
 * The base FileUpload component used by the Open System repository
 */
export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      className,
      name,
      value,
      disabled = false,
      required = false,
      glow = false,
      label,
      placeholder,
      info,
      warning,
      errors,
      tabIndex,
      multiple = false,
      autoFocus = false,
      noBorder = false,
      onClick,
      onChange,
      onFocus,
      onBlur,
      ...props
    }: FileUploadProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [focused, setFocused] = useState<boolean>(false);
    const handleFocus = useCallback(
      (event?: FocusEvent<any>) => {
        event && event?.stopPropagation?.();

        if (!disabled) {
          setFocused(true);
          onFocus?.();
        }
      },
      [disabled, onFocus]
    );

    const handleBlur = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        event && event?.stopPropagation?.();

        setFocused(false);
        onBlur?.(event);
      },
      [onBlur]
    );

    const inputRef = useRef(null);
    const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
      inputRef,
      multiple,
      noClick: false,
      noKeyboard: false,
    });
    useImperativeHandle(ref, () => inputRef.current, []);

    const handleClick = useCallback(
      (event: MouseEvent) => {
        event && event?.stopPropagation?.();

        open(event);
        onClick?.(event);
      },
      [onClick, open]
    );

    return (
      <FieldWrapper
        name={name}
        label={label}
        info={info}
        errors={errors}
        warning={warning}
        focused={focused}
        disabled={disabled}
        required={required}
        noBorder={noBorder}>
        <div
          {...getRootProps({
            className: clsx(
              "rounded-md border-[3px] border-dashed border-primary cursor-pointer flex flex-col gap-10",
              className
            ),
          })}
          onClick={handleClick}>
          <FieldWrapperLabel
            className="flex h-full w-full grow cursor-pointer flex-row items-center justify-center align-middle"
            name={name}
            label={
              <>
                <svg
                  className="mr-3 h-12 fill-input-label"
                  viewBox="0 0 312.602 312.602">
                  <path
                    d="M251.52,137.244c-3.966,0-7.889,0.38-11.738,1.134c-1.756-47.268-40.758-85.181-88.448-85.181
	c-43.856,0-80.964,32.449-87.474,75.106C28.501,129.167,0,158.201,0,193.764c0,36.106,29.374,65.48,65.48,65.48h54.782
	c4.143,0,7.5-3.357,7.5-7.5c0-4.143-3.357-7.5-7.5-7.5H65.48c-27.835,0-50.48-22.645-50.48-50.48c0-27.835,22.646-50.48,50.48-50.48
	c1.367,0,2.813,0.067,4.419,0.206l7.6,0.658l0.529-7.61c2.661-38.322,34.861-68.341,73.306-68.341
	c40.533,0,73.51,32.977,73.51,73.51c0,1.863-0.089,3.855-0.272,6.088l-0.983,11.968l11.186-4.367
	c5.356-2.091,10.99-3.151,16.747-3.151c25.409,0,46.081,20.672,46.081,46.081c0,25.408-20.672,46.08-46.081,46.08
	c-0.668,0-20.608-0.04-40.467-0.08c-19.714-0.04-39.347-0.08-39.999-0.08c-4.668,0-7.108-2.248-7.254-6.681v-80.959l8.139,9.667
	c2.667,3.17,7.399,3.576,10.567,0.907c3.169-2.667,3.575-7.398,0.907-10.567l-18.037-21.427c-2.272-2.699-5.537-4.247-8.958-4.247
	c-3.421,0-6.686,1.548-8.957,4.247l-18.037,21.427c-2.668,3.169-2.262,7.9,0.907,10.567c1.407,1.185,3.121,1.763,4.826,1.763
	c2.137,0,4.258-0.908,5.741-2.67l7.901-9.386v80.751c0,8.686,5.927,21.607,22.254,21.607c0.652,0,20.27,0.04,39.968,0.079
	c19.874,0.041,39.829,0.081,40.498,0.081c33.681,0,61.081-27.4,61.081-61.08C312.602,164.644,285.201,137.244,251.52,137.244z"
                  />
                </svg>
                Drag and Drop or Click to{" "}
                <Link className="ml-[0.3rem]">Upload</Link>
              </>
            }
            info={info}
            errors={errors}
            warning={warning}
            focused={focused}
            required={!label && required}
          />

          {acceptedFiles && acceptedFiles.length && (
            <ul className="grid-cols-2 gap-4 p-10 lg:grid-cols-3">
              {acceptedFiles.map((file: File) => (
                <li
                  key={file.name}
                  className="border-1 rounded-lg border-primary bg-slate-200/60 font-label-1 text-primary">
                  {file.name} - {file.size} bytes
                </li>
              ))}
            </ul>
          )}

          <input
            id={name}
            name={name}
            className="hidden"
            type={InputTypes.FILE}
            // disabled={disabled}
            readOnly={disabled}
            // required={required}
            // minLength={minLength}
            // pattern={pattern}
            multiple={multiple}
            tabIndex={tabIndex}
            autoFocus={autoFocus}
            aria-invalid={!isEmptyObject(errors)}
            aria-required={required}
            aria-disabled={disabled}
            onInput={onChange}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...getInputProps({ onChange, handleClick })}></input>
        </div>
      </FieldWrapper>
    );
  }
);
