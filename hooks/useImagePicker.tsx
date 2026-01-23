import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

interface ImagePickerHook {
  pickImage: () => Promise<string | null>;
  image: string | null;
  setImage: (image: string | null) => void;
  loading: boolean;
}

export function useImagePicker(): ImagePickerHook {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async (): Promise<string | null> => {
    setLoading(true);

    try {
      // Request permission
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        setLoading(false);
        return null;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedImage = result.assets[0].uri;
        setImage(selectedImage);
        setLoading(false);
        return selectedImage;
      }

      setLoading(false);
      return null;
    } catch (error) {
      console.error("Error picking image:", error);
      alert("Failed to pick image. Please try again.");
      setLoading(false);
      return null;
    }
  };

  return {
    pickImage,
    image,
    setImage,
    loading,
  };
}
