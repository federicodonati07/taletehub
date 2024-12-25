import React, { useState } from "react";
import Image from "next/image";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";

const ImageUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file size and type
    if (!selectedFile.type.startsWith("image/")) {
      setError("Seleziona un file immagine valido.");
      return;
    }
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError("La dimensione del file deve essere inferiore a 50MB.");
      return;
    }

    // Clear errors and set file
    setError(null);
    setFile(selectedFile);

    // Generate preview URL
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(selectedFile);
  };

  const handleConfirm = () => {
    if (file) {
      console.log("File confermato:", file);
      alert("File confermato con successo!");
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Circle for preview using NextUI Avatar */}
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
          {preview ? (
            <Image
              src={preview}
              alt="Preview"
              className="object-cover"
              width={128}
              height={128}
            />
          ) : (
            <Avatar icon={<span className="text-gray-500">Nessuna immagine</span>} />
          )}
        </div>
      </div>

      {/* Upload Input */}
      <label
        htmlFor="file-upload"
        className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Seleziona Immagine
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Buttons */}
      {preview && (
        <div className="flex space-x-4">
          <Button onClick={handleConfirm} color="success">
            Conferma
          </Button>
          <Button onClick={handleReset} color="error">
            Reset
          </Button>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default ImageUpload;
