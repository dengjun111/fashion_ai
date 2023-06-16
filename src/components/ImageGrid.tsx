import React, { useState } from 'react';
import { Row, Col, Card, Spin, Tooltip, Button } from 'antd';
import { DownloadOutlined, ZoomInOutlined, DeleteOutlined } from '@ant-design/icons';
import './ImageGrid.css';

interface ImageCardProps {
    src: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ src }) => {
    const [loading, setLoading] = useState(true);

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
                            src={src}
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
    images: string[];
}

const ImageGrid: React.FC<ImageGridProps> = ({ images }) => {
    return (
        <div className='image-grid-container'>
            <Row gutter={[16, 16]}>
                {images.map((image, index) => (
                    <Col key={index}>
                        <ImageCard src={image} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ImageGrid;