import React, {createContext, useState, ReactNode, useContext} from 'react';
import {PhotoFile} from 'react-native-vision-camera';

interface PhotoContextType {
  photos: PhotoFile[];
  addPhoto: (photo: PhotoFile) => void;
  resetPhotos: () => void;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const usePhotoContext = () => {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error('usePhotoContext must be used within a PhotoProvider');
  }
  return context;
};

export const PhotoProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [photos, setPhotos] = useState<PhotoFile[]>([]);

  const addPhoto = (photo: PhotoFile) => {
    setPhotos(prev => [...prev, photo]);
  };

  const resetPhotos = () => {
    setPhotos([]);
  };

  return (
    <PhotoContext.Provider value={{photos, addPhoto, resetPhotos}}>
      {children}
    </PhotoContext.Provider>
  );
};
