"use client";

import { useState, useCallback, type ChangeEvent } from "react";
import NextImage from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Download,
  Key,
  Loader2,
  Lock,
  MessageSquare,
  ShieldCheck,
  Trash2,
  UploadCloud,
  FileImage,
  Repeat
} from "lucide-react";
import { LSB } from "@/lib/lsb";
import { encrypt, decrypt } from "@/lib/crypto";

export function SteganographyTool() {
  const { toast } = useToast();

  // Encode state
  const [encodeImage, setEncodeImage] = useState<string | null>(null);
  const [secretText, setSecretText] = useState<string>("");
  const [encodePassword, setEncodePassword] = useState<string>("");
  const [encodedResult, setEncodedResult] = useState<string | null>(null);
  const [isEncoding, setIsEncoding] = useState<boolean>(false);

  // Decode state
  const [decodeImage, setDecodeImage] = useState<string | null>(null);
  const [decodePassword, setDecodePassword] = useState<string>("");
  const [decodedResult, setDecodedResult] = useState<{ decodedText: string, validationResult: string } | null>(null);
  const [isDecoding, setIsDecoding] = useState<boolean>(false);

  const handleImageSelect = useCallback((e: ChangeEvent<HTMLInputElement>, mode: "encode" | "decode") => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload an image file.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        if (mode === "encode") {
          setEncodeImage(dataUri);
          setEncodedResult(null);
        } else {
          setDecodeImage(dataUri);
          setDecodedResult(null);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [toast]);

  const handleEncode = async () => {
    if (!encodeImage || !secretText) return;

    setIsEncoding(true);
    try {
      let textToEncode = secretText;
      if (encodePassword) {
        textToEncode = await encrypt(secretText, encodePassword);
      }

      const lsb = new LSB(encodeImage);
      const encodedDataUri = await lsb.encode(textToEncode);
      setEncodedResult(encodedDataUri);
      toast({
        title: "Success!",
        description: "Your message has been encoded into the image.",
      });
    } catch (error) {
      console.error("Encoding error:", error);
      toast({
        variant: "destructive",
        title: "Encoding Failed",
        description: (error as Error).message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsEncoding(false);
    }
  };

  const handleDecode = async () => {
    if (!decodeImage) return;

    setIsDecoding(true);
    try {
      const lsb = new LSB(decodeImage);
      const decodedTextFromImage = await lsb.decode();
      
      let finalDecodedText = decodedTextFromImage;
      let validationMessage = "Decoded successfully using LSB. No encryption was detected.";

      try {
        if (decodePassword) {
          finalDecodedText = await decrypt(decodedTextFromImage, decodePassword);
          validationMessage = "Message decrypted successfully.";
        } else {
          // Try to detect if it's encrypted
          const parts = decodedTextFromImage.split('.');
          if (parts.length === 3 && parts.every(p => /^[A-Za-z0-9+/=]+$/.test(p))) {
             validationMessage = "This message appears to be encrypted. Please enter a password to decrypt it."
          }
        }
      } catch (e) {
        throw new Error("Decryption failed. Check your password and try again.");
      }

      setDecodedResult({
        decodedText: finalDecodedText,
        validationResult: validationMessage
      });
      toast({
        title: "Success!",
        description: "A message has been decoded from the image.",
      });
    } catch (error) {
      console.error("Decoding error:", error);
      toast({
        variant: "destructive",
        title: "Decoding Failed",
        description: (error as Error).message || "Could not decode a message from this image. Please try another.",
      });
    } finally {
      setIsDecoding(false);
    }
  };


  const clearEncode = () => {
    setEncodeImage(null);
    setSecretText("");
    setEncodePassword("");
    setEncodedResult(null);
  };

  const clearDecode = () => {
    setDecodeImage(null);
    setDecodePassword("");
    setDecodedResult(null);
  };
  
  const ImageDropzone = ({ id, onImageChange, image }: { id: string, onImageChange: (e: ChangeEvent<HTMLInputElement>) => void, image: string | null }) => (
    <div className="space-y-4">
      {!image ? (
        <label
          htmlFor={id}
          className="relative flex flex-col items-center justify-center w-full p-10 border-2 border-dashed rounded-xl cursor-pointer border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-300"
        >
          <UploadCloud className="w-12 h-12 text-muted-foreground" />
          <p className="mt-4 text-sm font-semibold text-foreground">Click to upload or drag & drop</p>
          <p className="text-xs text-muted-foreground">PNG, JPG, WEBP, etc.</p>
          <Input id={id} type="file" className="hidden" accept="image/*" onChange={onImageChange} />
        </label>
      ) : (
        <div className="relative w-full overflow-hidden rounded-xl border border-border">
          <NextImage src={image} alt="Image preview" width={1280} height={720} className="w-full h-auto object-contain" />
        </div>
      )}
    </div>
  );

  return (
    <Tabs defaultValue="encode" className="w-full max-w-2xl">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="encode"><Key className="w-4 h-4 mr-2" />Encode</TabsTrigger>
        <TabsTrigger value="decode"><MessageSquare className="w-4 h-4 mr-2" />Decode</TabsTrigger>
      </TabsList>
      
      <TabsContent value="encode" className="mt-6">
        {!encodedResult ? (
          <Card>
            <CardHeader>
              <CardTitle>Encode Message</CardTitle>
              <CardDescription>Select an image and enter your secret message to hide it.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageDropzone id="encode-upload" onImageChange={(e) => handleImageSelect(e, 'encode')} image={encodeImage} />
              {encodeImage && (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter your secret message here..."
                    value={secretText}
                    onChange={(e) => setSecretText(e.target.value)}
                    className="min-h-[120px] text-base"
                  />
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input
                      type="password"
                      placeholder="Optional: Enter a password to encrypt your message"
                      value={encodePassword}
                      onChange={(e) => setEncodePassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}
            </CardContent>
            {encodeImage && (
              <CardFooter className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleEncode} disabled={!encodeImage || !secretText || isEncoding} className="w-full">
                  {isEncoding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Key className="mr-2 h-4 w-4" />}
                  Encode Message
                </Button>
                <Button variant="outline" onClick={clearEncode} className="w-full"><Trash2 className="mr-2 h-4 w-4" />Clear</Button>
              </CardFooter>
            )}
          </Card>
        ) : (
          <Card className="text-center">
            <CardHeader>
              <CardTitle>Encoded Successfully!</CardTitle>
              <CardDescription>Download your new image with the hidden message.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full overflow-hidden rounded-xl border border-border">
                <NextImage src={encodedResult} alt="Encoded image" width={1280} height={720} className="w-full h-auto object-contain" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <a href={encodedResult} download="encoded-image.png" className="w-full">
                <Button className="w-full"><Download className="mr-2 h-4 w-4" />Download Image</Button>
              </a>
              <Button variant="outline" onClick={clearEncode} className="w-full"><Repeat className="mr-2 h-4 w-4" />Start Over</Button>
            </CardFooter>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="decode" className="mt-6">
        {!decodedResult ? (
          <Card>
            <CardHeader>
              <CardTitle>Decode Message</CardTitle>
              <CardDescription>Upload an image to extract the hidden message.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageDropzone id="decode-upload" onImageChange={(e) => handleImageSelect(e, 'decode')} image={decodeImage} />
              {decodeImage && (
                <div className="space-y-4">
                  <div className="relative">
                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input
                      type="password"
                      placeholder="Enter password if message is encrypted"
                      value={decodePassword}
                      onChange={(e) => setDecodePassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}
            </CardContent>
            {decodeImage && (
              <CardFooter className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleDecode} disabled={!decodeImage || isDecoding} className="w-full">
                  {isDecoding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
                  Decode Message
                </Button>
                <Button variant="outline" onClick={clearDecode} className="w-full"><Trash2 className="mr-2 h-4 w-4" />Clear</Button>
              </CardFooter>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="w-5 h-5" /> Decoded Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-sm whitespace-pre-wrap p-4 bg-muted rounded-md">{decodedResult.decodedText}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShieldCheck className="w-5 h-5" /> Validation Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{decodedResult.validationResult}</p>
              </CardContent>
            </Card>
            <Button variant="outline" onClick={clearDecode} className="w-full"><Repeat className="mr-2 h-4 w-4" />Start Over</Button>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
