export type PDFVersion = "1.3" | "1.4" | "1.5" | "1.6" | "1.7" | "1.7ext3";

export type Orientation = "portrait" | "landscape";

type StandardPageSize =
  | "4A0"
  | "2A0"
  | "A0"
  | "A1"
  | "A2"
  | "A3"
  | "A4"
  | "A5"
  | "A6"
  | "A7"
  | "A8"
  | "A9"
  | "A10"
  | "B0"
  | "B1"
  | "B2"
  | "B3"
  | "B4"
  | "B5"
  | "B6"
  | "B7"
  | "B8"
  | "B9"
  | "B10"
  | "C0"
  | "C1"
  | "C2"
  | "C3"
  | "C4"
  | "C5"
  | "C6"
  | "C7"
  | "C8"
  | "C9"
  | "C10"
  | "RA0"
  | "RA1"
  | "RA2"
  | "RA3"
  | "RA4"
  | "SRA0"
  | "SRA1"
  | "SRA2"
  | "SRA3"
  | "SRA4"
  | "EXECUTIVE"
  | "FOLIO"
  | "LEGAL"
  | "LETTER"
  | "TABLOID"
  | "ID1";

type StaticSize = number | string;

export type PageSize =
  | StandardPageSize
  | [StaticSize]
  | [StaticSize, StaticSize]
  | { width: StaticSize; height?: StaticSize };

export type Bookmark =
  | string
  | {
      title: string;
      top?: number;
      left?: number;
      zoom?: number;
      fit?: true | false;
      expanded?: true | false;
    };

export interface PdfNodeProps {
  id?: string;
  style?: any;
  /**
   * Render component in all wrapped pages.
   * @see https://react-pdf.org/advanced#fixed-components
   */
  fixed?: boolean;
  /**
   * Force the wrapping algorithm to start a new page when rendering the
   * element.
   * @see https://react-pdf.org/advanced#page-breaks
   */
  break?: boolean;
  /**
   * Hint that no page wrapping should occur between all sibling elements following the element within n points
   * @see https://react-pdf.org/advanced#orphan-&-widow-protection
   */
  minPresenceAhead?: number;
}

export type FontStyle = "normal" | "italic" | "oblique";

export type FontWeight =
  | number
  | "thin"
  | "ultralight"
  | "light"
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "ultrabold"
  | "heavy";

export interface FontDescriptor {
  fontFamily: string;
  fontStyle?: FontStyle;
  fontWeight?: FontWeight;
}

export interface FontSource {
  src: string;
  fontFamily: string;
  fontStyle: FontStyle;
  fontWeight: number;
  data: any;
  loading: boolean;
  options: any;
}

export interface FontInstance {
  family: string;
  sources: FontSource[];
}

export type HyphenationCallback = (
  words: string,
  glyphString: { [key: string]: any }
) => string[];

interface BaseImageProps extends PdfNodeProps {
  /**
   * Enables debug mode on page bounding box.
   * @see https://react-pdf.org/advanced#debugging
   */
  debug?: boolean;
  cache?: boolean;
}

type HTTPMethod = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH";

type SourceURL = string;

type SourceBuffer = Buffer;

type SourceDataBuffer = { data: Buffer; format: "png" | "jpg" };

type SourceURLObject = {
  uri: string;
  method: HTTPMethod;
  body: any;
  headers: any;
};

type Source =
  | SourceURL
  | SourceBuffer
  | SourceDataBuffer
  | SourceURLObject
  | undefined;

type SourceFactory = () => Source;

type SourceAsync = Promise<Source>;

type SourceAsyncFactory = () => Promise<Source>;

export type SourceObject =
  | Source
  | SourceFactory
  | SourceAsync
  | SourceAsyncFactory;

export interface ImageWithSrcProp extends BaseImageProps {
  src: SourceObject;
}

export interface ImageWithSourceProp extends BaseImageProps {
  source: SourceObject;
}
