declare module 'qrcodejs2' {
  export interface QRCodeOptions {
    text: string;
    width?: number;
    height?: number;
    colorDark?: string;
    colorLight?: string;
    correctLevel?: number;
  }

  export default class QRCode {
    constructor(element: HTMLElement | string, options: QRCodeOptions | string);
    static CorrectLevel: {
      L: number;
      M: number;
      Q: number;
      H: number;
    };
  }
}
