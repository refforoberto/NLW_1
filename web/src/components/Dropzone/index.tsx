import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import './styles.css';
import  { FiUpload } from 'react-icons/fi';

interface Props {
  onFileUpload: ( file:File ) => void;
}

const  Dropzone:React.FC<Props> = ({ onFileUpload }) => {
const [selectedFile, setSelectedFile] = useState('');

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];

    const fileURL = URL.createObjectURL(file);
    setSelectedFile(fileURL);
    onFileUpload(file);
    
  }, [onFileUpload])
  const {getRootProps, getInputProps } = useDropzone({onDrop, accept: 'image/*'});

  return (
    <div className = "dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept='image/*' />
      { selectedFile ?  <img src = {selectedFile} alt="Point thumbnail" /> : (          
                        <p>
                            <FiUpload />
                            Imagem do estabelecimento
                        </p> )

      }
    </div>
  )
}

export default Dropzone;