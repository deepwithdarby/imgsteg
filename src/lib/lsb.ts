// Simple LSB (Least Significant Bit) Steganography
// This is a client-side implementation.

export class LSB {
    private image: HTMLImageElement;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private ready: Promise<void>;
  
    constructor(dataUri: string) {
      this.image = new Image();
      this.canvas = document.createElement('canvas');
      const context = this.canvas.getContext('2d');
      if (!context) {
        throw new Error("Could not get canvas context");
      }
      this.ctx = context;
  
      this.ready = new Promise((resolve, reject) => {
        this.image.onload = () => {
          this.canvas.width = this.image.width;
          this.canvas.height = this.image.height;
          this.ctx.drawImage(this.image, 0, 0);
          resolve();
        };
        this.image.onerror = (err) => reject(new Error("Failed to load image."));
        this.image.src = dataUri;
      });
    }
  
    private async _toBinary(text: string): Promise<string> {
      // Use TextEncoder to handle UTF-8 correctly
      const encoder = new TextEncoder();
      const encoded = encoder.encode(text);
      let binaryString = '';
      encoded.forEach(byte => {
        binaryString += byte.toString(2).padStart(8, '0');
      });
      return binaryString;
    }
  
    private _fromBinary(binary: string): string {
      const bytes = new Uint8Array(binary.length / 8);
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(binary.substr(i * 8, 8), 2);
      }
      // Use TextDecoder to handle UTF-8 correctly
      const decoder = new TextDecoder();
      return decoder.decode(bytes);
    }
  
    public async encode(message: string): Promise<string> {
      await this.ready;
  
      const terminator = "\0\0\0\0\0\0\0\0"; // 8 null bits as a terminator
      const messageBinary = await this._toBinary(message) + await this._toBinary(terminator);
      const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const data = imageData.data;
  
      if (messageBinary.length > data.length) {
        throw new Error("Message is too long to be encoded in this image.");
      }
  
      let bitIndex = 0;
      for (let i = 0; i < data.length; i += 1) {
        // We only use RGB channels, skip alpha channel (every 4th byte)
        if ((i + 1) % 4 === 0) {
            continue;
        }
        
        if (bitIndex < messageBinary.length) {
          // Clear the least significant bit
          data[i] = data[i] & 0xFE;
          // Set the least significant bit from the message
          data[i] = data[i] | parseInt(messageBinary[bitIndex], 2);
          bitIndex++;
        } else {
            // Once the message is encoded, we are done.
            break;
        }
      }
  
      this.ctx.putImageData(imageData, 0, 0);
      return this.canvas.toDataURL("image/png");
    }
  
    public async decode(): Promise<string> {
        await this.ready;
    
        const terminator = await this._toBinary("\0\0\0\0\0\0\0\0");
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        let binaryMessage = "";
        let foundTerminator = false;
    
        for (let i = 0; i < data.length; i++) {
            if ((i + 1) % 4 === 0) {
                continue;
            }
    
            binaryMessage += (data[i] & 1).toString();
    
            if (binaryMessage.length >= terminator.length && binaryMessage.slice(-terminator.length) === terminator) {
                binaryMessage = binaryMessage.slice(0, -terminator.length);
                foundTerminator = true;
                break;
            }
        }
    
        if (!foundTerminator) {
            throw new Error("No message found or terminator is missing.");
        }
    
        return this._fromBinary(binaryMessage);
    }
  }
  
