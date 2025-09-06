"use client";

import { useState, useCallback, type ChangeEvent } from "react";
import NextImage from "next/image";
import { decodeTextFromImage, type DecodeTextFromImageOutput } from "@/ai/flows/decode-text-from-image";
import { encodeTextToImage } from "@/ai/flows/encode-text-to-image";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Download,
  Key,
  Loader2,
  MessageSquare,
  ShieldCheck,
  Trash2,
  UploadCloud,
} from "lucide-react";

export function SteganographyTool() {
  const { toast } = useToast();

  // Encode state
  const [encodeImage, setEncodeImage] = useState<string | null>(null);
  const [secretText, setSecretText] = useState<string>("");
  const [encodedResult, setEncodedResult] = useState<string | null>(null);
  const [isEncoding, setIsEncoding] = useState<boolean>(false);

  // Decode state
  const [decodeImage, setDecodeImage] = useState<string | null>(null);
  const [decodedResult, setDecodedResult] = useState<DecodeTextFromImageOutput | null>(null);
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
      const result = await encodeTextToImage({
        photoDataUri: encodeImage,
        text: secretText,
      });
      setEncodedResult(result.encodedImageDataUri);
      toast({
        title: "Success!",
        description: "Your message has been encoded into the image.",
      });
    } catch (error) {
      console.error("Encoding error:", error);
      toast({
        variant: "destructive",
        title: "Encoding Failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsEncoding(false);
    }
  };

  const handleDecode = async () => {
    if (!decodeImage) return;

    setIsDecoding(true);
    try {
      const result = await decodeTextFromImage({
        encodedImageDataUri: decodeImage,
      });
      setDecodedResult(result);
      toast({
        title: "Success!",
        description: "A message has been decoded from the image.",
      });
    } catch (error) {
      console.error("Decoding error:", error);
      toast({
        variant: "destructive",
        title: "Decoding Failed",
        description: "Could not decode a message from this image. Please try another.",
      });
    } finally {
      setIsDecoding(false);
    }
  };

  const clearEncode = () => {
    setEncodeImage(null);
    setSecretText("");
    setEncodedResult(null);
  };

  const clearDecode = () => {
    setDecodeImage(null);
    setDecodedResult(null);
  };
  
  const ImageDropzone = ({ id, onImageChange, image }: { id: string, onImageChange: (e: ChangeEvent<HTMLInputElement>) => void, image: string | null }) => (
    <div className="space-y-4">
      {!image ? (
        <div
          className="relative flex flex-col items-center justify-center w-full p-10 border-2 border-dashed rounded-xl cursor-pointer border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-300"
          onClick={() => document.getElementById(id)?.click()}
        >
          <UploadCloud className="w-12 h-12 text-muted-foreground" />
          <p className="mt-4 text-sm font-semibold text-foreground">Click to upload or drag & drop</p>
          <p className="text-xs text-muted-foreground">PNG, JPG, WEBP, etc.</p>
          <Input id={id} type="file" className="hidden" accept="image/*" onChange={onImageChange} />
        </div>
      ) : (
        <div className="relative w-full overflow-hidden rounded-xl border border-border">
          <NextImage src={image} alt="Image preview" width={1280} height={720} className="w-full h-auto object-contain" />
        </div>
      )}
    </div>
  );

  return (
    <Card className="w-full max-w-2xl shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold tracking-tighter sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary">
          IMG STEG
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Hide secret messages in plain sight. Anonymously and securely.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="encode" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encode"><Key className="w-4 h-4 mr-2" />Encode</TabsTrigger>
            <TabsTrigger value="decode"><MessageSquare className="w-4 h-4 mr-2" />Decode</TabsTrigger>
          </TabsList>
          
          <TabsContent value="encode" className="mt-6 space-y-6">
            {!encodedResult ? (
              <>
                <ImageDropzone id="encode-upload" onImageChange={(e) => handleImageSelect(e, 'encode')} image={encodeImage} />
                {encodeImage && (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Enter your secret message here..."
                      value={secretText}
                      onChange={(e) => setSecretText(e.target.value)}
                      className="min-h-[120px] text-base"
                    />
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button onClick={handleEncode} disabled={!encodeImage || !secretText || isEncoding} className="w-full">
                        {isEncoding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Key className="mr-2 h-4 w-4" />}
                        Encode Message
                      </Button>
                      <Button variant="outline" onClick={clearEncode} className="w-full"><Trash2 className="mr-2 h-4 w-4" />Clear</Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4 text-center">
                <h3 className="text-xl font-semibold">Encoded Successfully!</h3>
                <div className="relative w-full overflow-hidden rounded-xl border border-border">
                  <NextImage src={encodedResult} alt="Encoded image" width={1280} height={720} className="w-full h-auto object-contain" />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <a href={encodedResult} download="encoded-image.png" className="w-full">
                    <Button className="w-full"><Download className="mr-2 h-4 w-4" />Download Image</Button>
                  </a>
                  <Button variant="outline" onClick={clearEncode} className="w-full">Start Over</Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="decode" className="mt-6 space-y-6">
            {!decodedResult ? (
              <>
                <ImageDropzone id="decode-upload" onImageChange={(e) => handleImageSelect(e, 'decode')} image={decodeImage} />
                {decodeImage && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={handleDecode} disabled={!decodeImage || isDecoding} className="w-full">
                      {isDecoding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
                      Decode Message
                    </Button>
                     <Button variant="outline" onClick={clearDecode} className="w-full"><Trash2 className="mr-2 h-4 w-4" />Clear</Button>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-primary">
                      <MessageSquare className="w-5 h-5" /> Decoded Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-mono text-sm whitespace-pre-wrap p-4 bg-background/50 rounded-md">{decodedResult.decodedText}</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <ShieldCheck className="w-5 h-5" /> Validation Result
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{decodedResult.validationResult}</p>
                  </CardContent>
                </Card>
                <Button variant="outline" onClick={clearDecode} className="w-full">Start Over</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
