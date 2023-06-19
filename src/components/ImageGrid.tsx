import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spin, Tooltip, Button } from 'antd';
import { DownloadOutlined, ZoomInOutlined, DeleteOutlined } from '@ant-design/icons';
import './ImageGrid.css';

export interface ImageCardProps {
    src: string;
    status: string;
    message: string;
    pendingID?: string;
    imageIndex?: number;
}

type ApiResponse = {
    status: 'NOT_START' | 'SUBMITTED' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILURE';
    imageUrl?: string;
};

async function getApiStatus(taskID: string): Promise<ApiResponse> {
    // Replace this with a call to the real API
    const response = await fetch(`/mj/task/${taskID}/fetch`);
    const data: ApiResponse = await response.json();
    return data;
}

async function postData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
  
    return response.json(); // parses JSON response into native JavaScript objects
  }


const ImageCard: React.FC<ImageCardProps> = ({ src, status, pendingID, imageIndex }) => {
    const [loading, setLoading] = useState(status !== 'done');

    const [upscaleStatus, setUpscaleStatus] = useState<'pending' | 'finished'>('pending');
    const [timerId, setTimerId] = useState<number | null>(null);

    const [imageSrc, setImageSrc] = useState<string | undefined>(src);

    var upcaleID = "";
    const index = imageIndex || 0;
    const upcaleImage = async () => {
        const data = {
            action: 'UPSCALE',
            index: index + 1,
            taskId: pendingID,
        };
        try {
            const response = await postData('/mj/submit/change', data);
            if (response.code === 1) {
                upcaleID = response.result;
                const interval = 500; // 5 seconds
                const id = window.setInterval(checkStatus, interval);
                setTimerId(id);
            }
        } catch (error) { }
    };

    const checkStatus = async () => {
        const response = await getApiStatus(upcaleID);

        if (response.status === 'SUCCESS') {
            setUpscaleStatus('finished');
            setLoading(false);
            setImageSrc(response.imageUrl);
            if (timerId) {
                clearInterval(timerId);
            }
        } else {
            console.log('API job is still pending');
            setUpscaleStatus('pending');
        }
    };


    if (status === 'generated' && pendingID !== undefined) {
        upcaleImage();
    }

    return (
        <Card
            hoverable
            style={{ width: 300, marginBottom: 16, position: 'relative' }}
            bodyStyle={{ padding: 0, height:0 }}
            cover={
                <div style={{ width: '100%', height: 300, overflow: 'hidden', position: 'relative' }}>
                    <Spin spinning={loading} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <img
                            alt="example"
                            src={imageSrc}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onLoad={() => setLoading(false)}
                        />
                    </Spin>
                    <div className="card-buttons" style={{ position: 'absolute', bottom: 8, right: 8 }}>
                        <Tooltip title="下载">
                            <Button icon={<DownloadOutlined />} />
                        </Tooltip>
                        <Tooltip title="放大">
                            <Button icon={<ZoomInOutlined />} />
                        </Tooltip>
                        <Tooltip title="删除">
                            <Button icon={<DeleteOutlined />} />
                        </Tooltip>
                    </div>
                </div>
            }
        />
    );
};

interface ImageGridProps {
    images: ImageCardProps[];
}

const ImageGrid: React.FC<ImageGridProps> = ({ images }) => {
    return (
        <div className='image-grid-container'>
            <Row gutter={[16, 16]}>
                {images.map((image, index) => (
                    <Col key={index}>
                        <ImageCard src={image.src} imageIndex={image.imageIndex} status={image.status} message={image.message} pendingID={image.pendingID} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ImageGrid;