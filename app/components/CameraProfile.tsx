"use client"

import { useRef, useState, useCallback, useEffect } from "react";

interface CameraProfileProps {
  onProfileSet: (profileImage: string, nickname: string) => void;
  onCancel: () => void;
}

export function CameraProfile({ onProfileSet, onCancel }: CameraProfileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [nickname, setNickname] = useState("포켓마스터");
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      setIsLoading(true);
      console.log("카메라 시작 시도...");
      
      // 카메라 권한 요청
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user' // 전면 카메라 사용
        },
        audio: false
      });
      
      console.log("미디어 스트림 획득:", mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        
        // 비디오가 실제로 재생될 때까지 대기
        videoRef.current.onloadedmetadata = () => {
          console.log("비디오 메타데이터 로드됨");
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                console.log("비디오 재생 시작");
                setIsStreaming(true);
                setIsLoading(false);
              })
              .catch(error => {
                console.error("비디오 재생 실패:", error);
                setCameraError("카메라 재생에 실패했습니다.");
                setIsLoading(false);
              });
          }
        };
      } else {
        console.error("비디오 참조가 없습니다");
      }
    } catch (error) {
      console.error("카메라 접근 오류:", error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setCameraError("카메라 권한이 거부되었습니다. 브라우저 설정에서 카메라 권한을 허용해주세요.");
        } else if (error.name === 'NotFoundError') {
          setCameraError("카메라를 찾을 수 없습니다. 카메라가 연결되어 있는지 확인해주세요.");
        } else {
          setCameraError(`카메라 오류: ${error.message}`);
        }
      } else {
        setCameraError("카메라에 접근할 수 없습니다.");
      }
      setIsLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log("카메라 트랙 중지됨");
      });
      setStream(null);
      setIsStreaming(false);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current && isStreaming) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context && video.videoWidth > 0 && video.videoHeight > 0) {
        // 캔버스 크기를 비디오 크기에 맞춤
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // 비디오 프레임을 캔버스에 그리기
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // 이미지 데이터를 Base64로 변환
        const imageData = canvas.toDataURL('image/png', 0.8);
        setCapturedImage(imageData);
        
        // 카메라 중지
        stopCamera();
        
        console.log("사진 촬영 완료");
      } else {
        console.error("비디오 크기가 유효하지 않음:", video.videoWidth, video.videoHeight);
        setCameraError("사진 촬영에 실패했습니다. 다시 시도해주세요.");
      }
    }
  }, [isStreaming, stopCamera]);

  const handleConfirm = () => {
    if (capturedImage && nickname.trim()) {
      onProfileSet(capturedImage, nickname.trim());
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setCameraError(null);
    startCamera();
  };

  // 카메라 스트림 상태 변경 시 로그
  useEffect(() => {
    if (stream) {
      console.log("스트림 활성화됨:", stream.active);
      const videoTracks = stream.getVideoTracks();
      console.log("비디오 트랙 수:", videoTracks.length);
      videoTracks.forEach((track, index) => {
        console.log(`비디오 트랙 ${index}:`, track.label, track.readyState);
      });
    }
  }, [stream]);

  // 컴포넌트 언마운트 시 카메라 정리
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="camera-profile">
      <div className="camera-container">
        <h2>📷 프로필 사진 촬영</h2>
        
        {/* 에러 메시지 */}
        {cameraError && (
          <div className="error-message">
            ⚠️ {cameraError}
          </div>
        )}

        {/* 카메라 시작 화면 */}
        {!isStreaming && !capturedImage && !isLoading && (
          <div className="camera-start">
            <div className="camera-icon">📸</div>
            <p>카메라로 프로필 사진을 촬영하세요</p>
            <button onClick={startCamera} className="start-camera-btn">
              카메라 시작하기
            </button>
          </div>
        )}

        {/* 로딩 중 화면 */}
        {isLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>카메라를 준비하고 있습니다...</p>
          </div>
        )}

        {/* 카메라 미리보기 화면 */}
        {isStreaming && !capturedImage && (
          <div className="camera-preview">
            <div className="video-container">
              <video
                ref={videoRef}
                autoPlay={true}
                playsInline={true}
                muted={true}
                className="video-preview"
                style={{ 
                  width: '400px', 
                  height: '300px', 
                  objectFit: 'cover',
                  display: 'block',
                  backgroundColor: '#000'
                }}
              />
              <div className="capture-overlay">
                <div className="capture-circle"></div>
              </div>
              {/* 디버그 정보 */}
              <div style={{ 
                position: 'absolute', 
                bottom: '10px', 
                left: '10px', 
                color: 'white', 
                fontSize: '12px',
                background: 'rgba(0,0,0,0.5)',
                padding: '5px',
                borderRadius: '5px'
              }}>
                스트림 활성: {stream?.active ? 'Yes' : 'No'}
                <br />
                비디오 준비: {videoRef.current?.readyState || 'N/A'}
              </div>
            </div>
            <div className="camera-controls">
              <button onClick={capturePhoto} className="capture-btn">
                📸 사진 찍기
              </button>
              <button onClick={stopCamera} className="cancel-btn">
                취소
              </button>
            </div>
          </div>
        )}

        {/* 촬영된 사진 미리보기 */}
        {capturedImage && (
          <div className="photo-preview">
            <div className="photo-container">
              <img src={capturedImage} alt="촬영된 프로필 사진" className="captured-image" />
            </div>
            <div className="nickname-section">
              <label htmlFor="nickname">닉네임</label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={10}
                placeholder="닉네임을 입력하세요"
                className="nickname-input"
              />
              <span className="char-count">{nickname.length}/10</span>
            </div>
            <div className="photo-controls">
              <button onClick={handleConfirm} className="confirm-btn" disabled={!nickname.trim()}>
                ✅ 확인
              </button>
              <button onClick={handleRetake} className="retake-btn">
                🔄 다시 촬영
              </button>
            </div>
          </div>
        )}

        <button onClick={onCancel} className="back-btn">
          ← 뒤로가기
        </button>
      </div>

      {/* 숨겨진 캔버스 */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <style jsx>{`
        .camera-profile {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999999;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .camera-container {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 25px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 500px;
          width: 90%;
          backdrop-filter: blur(10px);
        }

        h2 {
          color: #333;
          margin: 0 0 25px 0;
          font-size: 24px;
          font-weight: 700;
        }

        .error-message {
          background: #ffebee;
          color: #c62828;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-weight: 500;
        }

        .camera-start {
          padding: 40px 20px;
        }

        .camera-icon {
          font-size: 100px;
          margin-bottom: 20px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .camera-start p {
          color: #666;
          margin-bottom: 30px;
          font-size: 16px;
          line-height: 1.5;
        }

        .start-camera-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 25px;
          padding: 15px 30px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .start-camera-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
        }

        .camera-preview {
          margin-bottom: 20px;
        }

        .video-container {
          position: relative;
          display: inline-block;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .video-preview {
          width: 400px;
          height: 300px;
          object-fit: cover;
          display: block;
        }

        .capture-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .capture-circle {
          width: 100px;
          height: 100px;
          border: 4px solid rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          animation: breathe 2s ease-in-out infinite;
        }

        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }

        .camera-controls {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 20px;
        }

        .capture-btn {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
          color: white;
          border: none;
          border-radius: 50px;
          padding: 15px 25px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
        }

        .capture-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
        }

        .cancel-btn, .back-btn {
          background: #757575;
          color: white;
          border: none;
          border-radius: 50px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn:hover, .back-btn:hover {
          background: #616161;
          transform: translateY(-1px);
        }

        .photo-preview {
          margin-bottom: 20px;
        }

        .photo-container {
          margin-bottom: 25px;
        }

        .captured-image {
          width: 200px;
          height: 200px;
          object-fit: cover;
          border-radius: 50%;
          border: 6px solid #667eea;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .nickname-section {
          margin-bottom: 25px;
        }

        .nickname-section label {
          display: block;
          color: #333;
          margin-bottom: 8px;
          font-weight: 600;
          font-size: 16px;
        }

        .nickname-input {
          padding: 12px 20px;
          border: 2px solid #e0e0e0;
          border-radius: 25px;
          font-size: 16px;
          text-align: center;
          width: 220px;
          transition: all 0.3s ease;
          margin-bottom: 5px;
        }

        .nickname-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .char-count {
          font-size: 12px;
          color: #999;
        }

        .photo-controls {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-bottom: 20px;
        }

        .confirm-btn {
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
          color: white;
          border: none;
          border-radius: 25px;
          padding: 12px 25px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .confirm-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
        }

        .confirm-btn:disabled {
          background: #cccccc;
          cursor: not-allowed;
        }

        .retake-btn {
          background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
          color: white;
          border: none;
          border-radius: 25px;
          padding: 12px 25px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .retake-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 152, 0, 0.4);
        }

        .back-btn {
          margin-top: 10px;
        }

        /* 반응형 디자인 */
        @media (max-width: 768px) {
          .camera-container {
            padding: 20px;
            margin: 20px;
          }
          
          .video-preview {
            width: 320px;
            height: 240px;
          }
          
          .captured-image {
            width: 150px;
            height: 150px;
          }

          .nickname-input {
            width: 180px;
          }

          .camera-controls, .photo-controls {
            flex-direction: column;
            align-items: center;
          }
        }

        /* 로딩 화면 스타일 */
        .loading-container {
          padding: 60px 20px;
          text-align: center;
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          margin: 0 auto 20px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-container p {
          color: #666;
          font-size: 16px;
        }

        /* 로딩 애니메이션 */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .camera-container > * {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
} 