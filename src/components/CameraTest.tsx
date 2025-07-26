import React, { useEffect, useRef, useState } from 'react';

const CameraTest = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const testCamera = async () => {
      try {
        // First check if we have permission
        const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setHasPermission(permissionStatus.state === 'granted');
        
        // Try to get camera stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        setError('');
        setHasPermission(true);
      } catch (err: any) {
        console.error('Camera error:', err);
        setError(err.message || 'Failed to access camera');
        setHasPermission(false);
      }
    };

    testCamera();

    // Cleanup
    return () => {
      const video = videoRef.current;
      if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Camera Permission Test</h2>
      
      <div className="space-y-4">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <p className="font-semibold">Permission Status:</p>
          <p className={hasPermission === null ? 'text-gray-500' : hasPermission ? 'text-green-600' : 'text-red-600'}>
            {hasPermission === null ? 'Checking...' : hasPermission ? '✅ Granted' : '❌ Denied'}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 p-4 rounded">
            <p className="font-semibold text-red-800 dark:text-red-200">Error:</p>
            <p className="text-red-600 dark:text-red-300">{error}</p>
          </div>
        )}

        <div className="bg-black aspect-video rounded overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>

        <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded">
          <p className="font-semibold">Troubleshooting:</p>
          <ul className="list-disc list-inside text-sm mt-2 space-y-1">
            <li>Make sure you're using HTTPS or localhost</li>
            <li>Check browser settings for camera permissions</li>
            <li>Try a different browser if issues persist</li>
            <li>On macOS: System Preferences → Security & Privacy → Camera</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CameraTest;