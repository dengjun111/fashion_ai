import React, { useState, useRef } from 'react';
import { Row, Col, Card, Spin, Image, Tooltip, Button, message } from 'antd';
import { DownloadOutlined, ZoomInOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import './ImageGrid.css';

export interface ImageCardProps {
    src?: string;
    sliceImage?: string;
    status: string;
    message: string;
    imageID?: string;
    progress?: number;
    imageIndex?: number;
}

const ImageCard: React.FC<ImageCardProps> = ({ sliceImage, src, status, imageID, imageIndex, message }) => {

    const [isPreviewVisible, setIsPreviewVisible] = React.useState(false);



    const handlePreview = () => {
        setIsPreviewVisible(true);
    };
    const [loading, setLoading] = useState(status !== 'in progress' && status !== 'generated');

    let imageSrc = "";

    if (src && src.length > 0) {
        imageSrc = src;
    } else if (sliceImage && sliceImage.length > 0) {
        imageSrc = sliceImage;
    }

    const handleDownload = (imageUrl: string) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card
            hoverable
            style={{ width: 300, marginBottom: 16, position: 'relative' }}
            bodyStyle={{ padding: 0, height: 0 }}
            cover=

            {
                imageSrc.length > 0 ? (
                    <div style={{ width: '100%', height: 300, overflow: 'hidden' }}>
                        <Image
                            alt="example"
                            src={imageSrc}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onLoad={() => setLoading(false)}
                            preview={
                                {
                                    visible: isPreviewVisible,
                                    onVisibleChange: (visible: boolean) => setIsPreviewVisible(visible),
                                }
                            }
                        />
                        <div className="card-buttons" style={{ position: 'absolute', bottom: 8, right: 8 }}>
                            <Tooltip title="下载">
                                <Button className='tooltip-button' icon={<DownloadOutlined />} onClick={ () => handleDownload(imageSrc)} />
                            </Tooltip>
                            <Tooltip title="放大">
                                <Button className='tooltip-button' icon={<ZoomInOutlined />} onClick={handlePreview}/>
                            </Tooltip>
                            <Tooltip title="微调">
                                <Button className='tooltip-button' icon={<AppstoreAddOutlined />} />
                            </Tooltip>
                        </div>
                    </div>
                ) : (
                    <div style={{ width: '100%', height: 300, overflow: 'hidden', display: 'flex', alignContent: "center", justifyContent: 'center', flexDirection: 'column' }}>
                        <Spin></Spin>
                        <div style={{ textAlign: "center", padding: "16px" }}>{message}</div>
                    </div>
                )

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
                        <ImageCard {...image} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ImageGrid;