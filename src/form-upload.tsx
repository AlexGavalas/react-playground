import { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';

interface PostData {
    title: string;
    body: string;
    image: File | null;
}

const useUploadForm = (url: string) => {
    const [isSuccess, setSuccess] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const uploadForm = async (formData: FormData) => {
        setIsLoading(true);

        await axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                const progress =
                    (progressEvent.loaded / progressEvent.total) * 50;

                setProgress(progress);
            },
        });

        await new Promise((resolve) => {
            setTimeout(() => resolve('success'), 500);
        });

        setProgress(0);
        setSuccess(true);
    };

    return { uploadForm, isSuccess, progress, isLoading };
};

const Form = () => {
    const [formValues, setFormValues] = useState<PostData>({
        title: '',
        body: '',
        image: null,
    });

    const { isSuccess, uploadForm, progress } = useUploadForm(
        'http://localhost:3000/images',
    );

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues((prevFormValues) => ({
            ...prevFormValues,
            image: event.target.files ? event.target.files[0] : null,
        }));
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues((prevFormValues) => ({
            ...prevFormValues,
            title: event.target.value,
        }));
    };

    const handleBodyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues((prevFormValues) => ({
            ...prevFormValues,
            body: event.target.value,
        }));
    };

    const handleSubmit = async () => {
        const formData = new FormData();

        formData.append('title', formValues.title);
        formData.append('body', formValues.body);

        formValues.image && formData.append('image', formValues.image);

        return await uploadForm(formData);
    };

    return (
        <Box
            display="flex"
            height="100%"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
        >
            <Box marginY={2}>
                <TextField
                    onChange={handleTitleChange}
                    value={formValues.title}
                    label="Post Title"
                    name="title"
                />
            </Box>
            <Box marginY={2}>
                <TextField
                    onChange={handleBodyChange}
                    multiline
                    minRows={5}
                    label="Post Body"
                    name="body"
                />
            </Box>
            <Button variant="contained" component="label">
                {formValues.image?.name ?? 'Upload File'}
                <input onChange={handleImageChange} type="file" hidden />
            </Button>
            {isSuccess ? (
                <Box color="success.main" display="flex">
                    <CheckIcon color="success" />
                    <Typography>Success</Typography>
                </Box>
            ) : (
                <Box>
                    <Button onClick={handleSubmit}>Submit Post </Button>
                    <LinearProgress variant="determinate" value={progress} />
                </Box>
            )}
        </Box>
    );
};

export default Form;
