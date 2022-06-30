import { useRef } from 'react';

const constraints: MediaStreamConstraints = {
    video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user',
    },
};

export const UserMediaDemo = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const streamRef = useRef<{ value: MediaStream | null }>({ value: null });

    const handleSuccess = (stream: MediaStream) => {
        if (!videoRef.current) return;

        streamRef.current.value = stream;
        videoRef.current.srcObject = stream;
    };

    const handleError = (error: unknown) => {
        console.error('Error: ', error);
    };

    const startWebcam = () => {
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(handleSuccess)
            .catch(handleError);
    };

    const stopWebcam = () => {
        streamRef.current.value?.getVideoTracks()[0].stop();
    };

    const takeAScreenshot = () => {
        if (!videoRef.current) return;

        const cardCanvas = document.createElement('canvas');

        const width = videoRef.current.videoWidth;
        const height = videoRef.current.videoHeight;

        // Setup Canvas
        cardCanvas.width = width;
        cardCanvas.height = height;

        const ctx = cardCanvas.getContext('2d');

        if (!ctx || !imageRef.current) return;

        ctx.drawImage(videoRef.current, 0, 0);

        // Output final composed canvas to DOM img
        imageRef.current.src = cardCanvas.toDataURL('image/jpeg', 1.0);
    };

    return (
        <div>
            <video
                autoPlay
                muted
                playsInline
                style={{ width: '100%', height: '50%' }}
                ref={videoRef}
            />
            <button onClick={startWebcam}>Start Webcam</button>
            <button onClick={stopWebcam}>Stop Webcam</button>
            <button onClick={takeAScreenshot}>Take a pic</button>
            <img
                ref={imageRef}
                alt="The screen capture will appear here."
                style={{ width: 100, height: 100 }}
            />
        </div>
    );
};
